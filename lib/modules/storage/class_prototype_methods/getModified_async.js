import { getModifiedAsync as utilGetModifiedAsync } from '../utils/getModified_async';

export async function getModifiedAsync(options = {}) {
  const doc = this;
  const { fields } = options;

  return await utilGetModifiedAsync({
    doc,
    transient: true,
    fields
  });
}
