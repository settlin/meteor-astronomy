import AstroClass from '../../../core/class.js';
import {Meteor} from 'meteor/meteor';
import { documentInsertAsync } from './document_insert_async.js';

export async function classInsertAsync(args = {}) {
  const {
    className,
    rawDoc,
    stopOnFirstError,
    simulation = true,
    trusted = false,
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  const Class = AstroClass.get(className);
  // Create a new document.
  const doc = new Class(rawDoc);

  // Insert a document.
  return await documentInsertAsync({
    doc,
    stopOnFirstError,
    simulation,
    trusted,
  });
};
