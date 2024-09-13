import _last from "lodash/last";

function wrapMethod(methodName) {
  return function(...methodArgs) {
    const doc = this;

    // Get the last argument.
    let callback = _last(methodArgs);
    // If the last argument is a callback function, then remove the last
    // argument.
    if (typeof callback === "function") {
      methodArgs.pop();
    } else {
      // If the last argument is not a callback function, then clear the
      // "callback" variable.
      callback = undefined;
    }
    // Call the "/Astronomy/execute" method.
    return doc.applyMethod(methodName, methodArgs, callback);
  };
}

export default wrapMethod;
