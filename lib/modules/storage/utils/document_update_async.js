import _omit from "lodash/omit";
import _size from "lodash/size";
import castNested from "../../fields/utils/castNested";
import triggerBeforeSave from "./trigger_before_save";
import triggerBeforeUpdate from "./trigger_before_update";
import triggerAfterSave from "./trigger_after_save";
import triggerAfterUpdate from "./trigger_after_update";
import isModified from "./isModified";
import { getModifierAsync } from './getModifier_async';
import { Meteor } from 'meteor/meteor';
import { documentValidateAsync } from '../../validators/utils/document_validate_async';

export async function documentUpdateAsync(args = {}) {
  let {
    doc,
    stopOnFirstError,
    fields,
    simulation = true,
    forceUpdate = false,
    trusted = false,
    oldDoc
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Return if there were no modifications.
  if (
    !isModified({
      doc,
      fields
    })
  ) {
    // Validate a document even if there were no modifications.
    await documentValidateAsync({
      doc,
      fields,
      stopOnFirstError,
      simulation
    });
    // 0 documents were modified.
    return 0;
  }

  // Check if a class is secured.
  if (Class.isSecured("update") && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, "Updating from the client is not allowed");
  }

  // Cast nested documents.
  castNested({
    doc,
    options: {
      clone: false
    }
  });

  // Trigger before events.
  triggerBeforeSave(args);
  triggerBeforeUpdate(args);

  // Cast nested documents.
  castNested({
    doc,
    options: {
      clone: false
    }
  });

  // Validate a document.
  await documentValidateAsync({
    doc,
    fields,
    stopOnFirstError,
    simulation
  });

  // Get modifier.
  // If the "forceUpdate" option was set then we don't run the "getModifier"
  // function to get modifier and instead we just take entire raw object and
  // remove the "_id" field as we can't update it.
  const modifier = forceUpdate
    ? _omit(doc.raw(), ["_id"])
    : await getModifierAsync({
        doc,
        fields,
        oldDoc
      });
  // Stop execution is a modifier is empty.
  if (_size(modifier) === 0) {
    return 0;
  }
  // Update a document.
	try {
		// Collection._collection.updateAsync does not seem to exist in Meteor 2.12
		// it exists but gives error on Meteor2.13
    // const result = await (Collection._collection.updateAsync || Collection.updateAsync)(
    const result = await Collection.updateAsync(
      {
        _id: doc._id
      },
      modifier
    );

    // Trigger after events.
    triggerAfterUpdate(args);
    triggerAfterSave(args);

    return result;
  } catch (err) {
    if (err.name === "MongoError" || err.name === "MinimongoError") {
      throw new Meteor.Error(409, err.toString());
    } else {
      throw err;
    }
  }
}
