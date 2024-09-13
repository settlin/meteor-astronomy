export async function wrapMethodAsync(methodName) {
  return function(...methodArgs) {
    const doc = this;

    // Call the "/Astronomy/execute" method.
    return doc.applyMethodAsync(methodName, methodArgs);
  };
}
