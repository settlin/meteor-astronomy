import _defaults from 'lodash/defaults';
import _each from 'lodash/each';
import castNested from '../../fields/utils/castNested';
import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { callMeteorMethodAsync } from '../../storage/utils/call_meteor_method_async';
import { documentValidateAsync } from '../utils/document_validate_async';

export async function validateAsync(options = {}) {
  const doc = this;
  const Class = doc.constructor;
  const Collection = Class.getCollection();
  let connection = Collection && Collection._connection;
  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection;
  }

  // Set default options.
  _defaults(options, {
    fields: Class.getValidationOrder(),
    modified: false,
    stopOnFirstError: true,
    simulation: true
  });

  // If a fields property is a string then put it into array.
  if (Match.test(options.fields, String)) {
    options.fields = [options.fields];
  }

  // Cast all fields.
  if (options.cast) {
    _each(Class.getFields(), (field) => {
      doc[field.name] = field.castValue(doc[field.name], {
        clone: false,
        cast: true
      });
    });
  }
  // Cast only nested fields.
  else {
    castNested({
      doc,
      options: {
        clone: false
      }
    });
  }

  // Prepare arguments for meteor method and utility.
  let methodArgs = {
    doc,
    fields: options.fields,
    modified: options.modified,
    stopOnFirstError: options.stopOnFirstError,
    simulation: options.simulation,
  };

  // If we are dealing with a remote collection and we are not on the server.
  if (connection && connection !== Meteor.server) {
    // Prepare arguments for meteor method.
    let methodName = '/Astronomy/validateAsync';

		// Run Meteor method.
		return await callMeteorMethodAsync(
			Class, methodName, [methodArgs]
		);
  }

  // If we can just validate a document without calling the meteor method. We
	// may be on the server or the collection may be local.
	return await documentValidateAsync(methodArgs);
}
