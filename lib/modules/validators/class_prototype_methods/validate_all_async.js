import _extend from 'lodash/extend';

export async function validateAll(options = {}) {
  let doc = this;
  let Class = doc.constructor;

  _extend(options, {
    fields: Class.getValidationOrder(),
    stopOnFirstError: false
  });

  doc.validate(options);
};

export default validateAll;