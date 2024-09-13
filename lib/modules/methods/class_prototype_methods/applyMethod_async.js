import rawAll from "../../fields/utils/rawAll";
import { callMeteorMethodAsync } from '../../storage/utils/call_meteor_method_async';

export async function applyMethodAsync(methodName, methodArgs) {
  const doc = this;
  const Class = doc.constructor;

  // Prepare arguments to be sent to the "/Astronomy/execute" method.
  const meteorMethodArgs = {
    className: Class.getName(),
    methodName,
    methodArgs,
    rawDoc: rawAll(doc, {
      transient: false
    })
  };

	return callMeteorMethodAsync(
		Class,
		"/Astronomy/executeAsync",
		[meteorMethodArgs],
	);
}
