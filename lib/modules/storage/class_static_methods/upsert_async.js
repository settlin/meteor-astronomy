import isRemote from '../utils/is_remote.js';
import classUpsert from '../utils/class_upsert.js';
import { callMeteorMethodAsync } from '../utils/call_meteor_method_async.js';

export async function upsertAsync(selector, modifier, options) {
  const Class = this;

  // Make sure that options is at least an empty object.
  options = options || {};
  // Prepare arguments.
  const args = {
    className: Class.getName(),
    selector,
    modifier,
    options
  };

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    const methodName = '/Astronomy/upsert';

		// Run Meteor method.
		return callMeteorMethodAsync(
			Class, methodName, [args]
		);
  }

  // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.
	// Set the "trusted" argument to true.
	args.trusted = true;
	// Remove a document.
	let result = classUpsert(args);
	return result;
}
