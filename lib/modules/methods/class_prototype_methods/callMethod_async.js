import _last from 'lodash/last';
import applyMethod from './applyMethod';

export async function callMethodAsync(methodName, ...methodArgs) {
  // Get the last argument.
  let callback = _last(methodArgs);
  // If the last argument is not a callback function, then clear the
  // "callback" variable.
  callback = undefined;
  return applyMethod.callAsync(this, methodName, methodArgs, callback);
};
