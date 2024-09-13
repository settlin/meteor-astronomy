import setOne from './set_one.js';

function setMany(doc, fieldsValues, options) {
  // Set multiple fields.
  Object.entries(fieldsValues).map(([fieldName, setValue]) => {
    setOne(doc, fieldName, setValue, options);
  });
};

export default setMany;