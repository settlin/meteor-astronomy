import {getModifierAsync as utilGetModifierAsync} from '../utils/getModifier_async';

export async function getModifierAsync() {
  let doc = this;

  return utilGetModifierAsync({
    doc
  });
};
