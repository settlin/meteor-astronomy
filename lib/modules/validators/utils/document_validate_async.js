import _each from 'lodash/each';
import _intersection from 'lodash/intersection';
import _isNil from 'lodash/isNil';
import AstroClass from '../../../core/class';
import castNested from '../../fields/utils/castNested';
import isNestedFieldName from '../../fields/utils/isNestedFieldName';
import traverse from '../../fields/utils/traverse_without_callback';
import ObjectField from '../../fields/ObjectField';
import ListField from '../../fields/ListField';
import Validators from '../validators';
import { Meteor } from 'meteor/meteor';
import { ValidationError } from './validation_error.js';

export async function documentValidateAsync(options = {}) {
  let {
    doc,
    fields,
    modified = false,
    prefix = '',
    stopOnFirstError = true,
    simulation = true
  } = options;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  let Class = doc.constructor;

  // Cast nested fields.
  castNested({
    doc,
    options: {
      clone: false
    }
  });

  // Prepare array for storing errors list.
  let errors = [];

  // Helper function for catching and collecting errors.
  const catchValidationError = async (func) => {
		try {
      await func();
    }
		catch (err) {
			// If it's ValidationError.
      if (ValidationError.is(err)) {
        // If we stop on first error then just throw error again.
        if (stopOnFirstError) {
          throw err;
        }
        // Otherwise we collect errors.
        else {
          _each(err.details, (details) => {
            errors.push(details);
          });
        }
      }
      // It it's not ValidationError, then we throw error again.
      else {
        throw err;
      }
    }
  };

  // If no fields were passed to validation, then we pick default validation
  // order.
  if (!fields) {
    fields = Class.getValidationOrder();
  }

  // Validate only modified fields.
  if (modified && Class.getCollection()) {
    fields = _intersection(fields, doc.getModified());
  }

  await Promise.all(fields.map(async (name) => {
    // If it is a nested field pattern name then we have to look for the most
    // nested document and validate the nested field.
    if (isNestedFieldName(name)) {
			const { doc: nestedDoc, name: nestedName } = traverse(doc, name);
      return await catchValidationError(async () => {
          await documentValidateAsync({
            doc: nestedDoc,
            fields: [nestedName],
            prefix: prefix + name.substr(0, name.lastIndexOf(nestedName)),
            stopOnFirstError,
            simulation
          });
        });
    }

    let field = Class.getField(name);

    // Move to the next one if a field does not exist.
    if (!field) {
      return null;
    }

    // We do not validate transient fields.
    if (field.transient) {
      return null;
    }

    // Get value of the field.
    let value = doc.get(name);

    // If a field is optional and value is undefined then we do not validate.
    if (field.getOptional(doc) && _isNil(value)) {
      return null;
    }

    // Execute validation in the try-catch block. That's because we want to
    // continue validation if the "stopOnFirstError" flag is set to false.
		await catchValidationError(async () => {
			// First, execute type level validators.
			await field.validate({
				doc,
				name: prefix + name,
				nestedName: name,
				value
			});
			// Get validators for a given field.
			let validators = Class.getValidators(name) || [];
			await Promise.all(validators.map(async ({
				type,
				param,
				resolveParam,
				message,
				resolveError
			}) => {
				// Get validation helper function.
				let validationFunction = Validators[type];
				// Execute single validator.
				return await validationFunction({
					doc,
					name: prefix + name,
					nestedName: name,
					value,
					param,
					resolveParam,
					message,
					resolveError
				});
			}));
    });

    // If it is the object field then validate it.
    if (field instanceof ObjectField) {
      if (value instanceof AstroClass) {
        await catchValidationError(async () => {
          await documentValidateAsync({
            doc: value,
            fields: value.constructor.getValidationOrder(),
            prefix: prefix + field.name + '.',
            stopOnFirstError
          });
        });
      }
    }
    // If it is the list field then validate each one.
    else if (field instanceof ListField && field.isClass) {
      await Promise.all(value.map(async (element, index) => {
        if (element instanceof AstroClass) {
          return await catchValidationError(async () => {
            await documentValidateAsync({
              doc: element,
              fields: element.constructor.getValidationOrder(),
              prefix: prefix + field.name + '.' + index + '.',
              stopOnFirstError
            });
          });
				}
				return null;
      }));
    }
  }));

  // If we have not thrown any error yet then it means that there are no errors
  // or we do not throw on the first error.
  if (errors.length > 0) {
    throw new ValidationError(errors, errors[0].message);
	}
	
	return null;
};
