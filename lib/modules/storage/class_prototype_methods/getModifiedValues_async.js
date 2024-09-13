import _each from "lodash/each";
import rawOne from "../../fields/utils/rawOne";
import { getModifiedAsync } from '../utils/getModified_async';

export async function getModifiedValuesAsync(options = {}) {
  let { old = false, raw = false, fields } = options;

  let doc = this;
  const Class = doc.constructor;

  // Get list of modified fields.
  const modified = await getModifiedAsync({
    doc,
    transient: true,
    fields
  });

  // Get old or new values of a document.
  if (old) {
    doc = await Class.findOneAsync(doc._id);
    if (!doc) {
      doc = new Class();
    }
  }

  // Collect values for each field.
  const values = {};
  _each(modified, name => {
    if (raw) {
      values[name] = rawOne(doc, name);
    } else {
      values[name] = doc.get(name);
    }
  });

  return values;
}
