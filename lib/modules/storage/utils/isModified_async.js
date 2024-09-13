import _includes from "lodash/includes";

import {getModifiedAsync} from "./getModified_async";

export async function isModifiedAsync(options = {}) {
  let { doc, pattern, transient = false, immutable = false } = options;

  const modified = await getModifiedAsync({
    doc,
    transient,
    immutable
  });

  if (pattern) {
    return _includes(modified, pattern);
  } else {
    return modified.length > 0;
  }
}
