import _tail from 'lodash/tail';

export async function validateAsync(rawDoc) {
  const Class = this;
  const doc = new Class(rawDoc);
  const args = _tail(arguments);
  return doc.validateAsync.apply(doc, args);
};
