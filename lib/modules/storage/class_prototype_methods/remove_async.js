import documentRemove from '../utils/document_remove.js';
import isRemote from '../utils/is_remote.js';
import { callMeteorMethodAsync } from '../utils/call_meteor_method_async.js';

export function removeAsync(args = {}) {
  let doc = this;
  let Class = doc.constructor;

  // Get variables from the first argument.
  let {
    simulation = true
  } = args;

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    let methodName = '/Astronomy/remove';
    // Prepare arguments for the meteor method.
    let methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      simulation
    };

		// Run meteor method.
		let result = callMeteorMethodAsync(
			Class, methodName, [methodArgs]
		);
		// Change the "_isNew" flag to "true". After removing a document can be
		// saved again as a new one.
		doc._isNew = true;
		// Return result of the meteor method call.
		return result;
  }

  // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.
	// Prepare arguments.
	let methodArgs = {
		doc,
		simulation,
		trusted: true
	};
	let result = documentRemove(methodArgs);
	return result;
}
