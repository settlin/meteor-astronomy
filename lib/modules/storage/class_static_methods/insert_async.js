import isRemote from '../utils/is_remote.js';
import {DDP} from 'meteor/ddp';
import { callMeteorMethodAsync } from '../utils/call_meteor_method_async';
import { classInsertAsync } from '../utils/class_insert_async.js';

export async function insertAsync(rawDoc, callback) {
  const Class = this;
  const Collection = Class.getCollection();

  // Prepare arguments.
  const args = {
    className: Class.getName(),
    rawDoc
  };

  // Generate ID if not provided.
  if (!rawDoc._id) {
    let generateId = true;
    // Don't generate the id if we're the client and the 'outermost' call.
    // This optimization saves us passing both the randomSeed and the id.
    // Passing both is redundant.
    if (Collection._isRemoteCollection()) {
      const enclosing = DDP._CurrentInvocation.get();
      if (!enclosing) {
        generateId = false;
      }
    }
    if (generateId) {
      rawDoc._id = Collection._makeNewID();
    }
  }

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    const methodName = '/Astronomy/insertAsync';

		// Run Meteor method.
		return await callMeteorMethodAsync(
			Class, methodName, [args], callback
		);
  }

  // If we can just insert a document without calling the meteor method. We may
  // be on the server or the collection may be local.
	// Set the "trusted" argument to true.
	args.trusted = true;
	// Insert a document.
	let result = classInsertAsync(args);
	return result;
}
