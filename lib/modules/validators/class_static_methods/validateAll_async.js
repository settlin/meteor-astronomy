import _tail from 'lodash/tail';

export async function validateAllAsync(rawDoc) {
  const Class = this;
  const doc = new Class(rawDoc);
  const args = _tail(arguments);
  return doc.validateAllAsync.apply(doc, args);
};
