import triggerBeforeRemove from './trigger_before_remove.js';
import triggerAfterRemove from './trigger_after_remove.js';
import { Meteor } from 'meteor/meteor';

export async function documentRemoveAsync(args = {}) {
  const {
    doc,
    simulation = true,
    trusted = false
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  const Class = doc.constructor;
  const Collection = Class.getCollection();

  // Remove only when document has the "_id" field (it's persisted).
  if (doc._isNew) {
    return 0;
  }

  // Check if a class is secured.
  if (Class.isSecured('remove') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Removing from the client is not allowed');
  }

  // Trigger before events.
  await triggerBeforeRemove(args);

  // Remove a document.
  try {
    const result = await Collection._collection.removeAsync({
      _id: doc._id
    });

    // Mark a document as new, so it will be possible to save it again.
    doc._isNew = true;

    // Trigger after events.
    await triggerAfterRemove(args);

    return result;
  }
  catch(err) {
    if (err.name === 'MongoError' || err.name === 'MinimongoError') {
      throw new Meteor.Error(409, err.toString());
    }
    else {
      throw err;
    }
  }
};
