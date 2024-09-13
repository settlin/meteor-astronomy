import AstroClass from '../../../core/class';
import { Match, check } from 'meteor/check';

export async function astronomyExecuteAsync(args = {}) {
  check(args, Match.Any);

  const {
    className,
    rawDoc,
    methodName,
    methodArgs
  } = args;

  const Class = AstroClass.get(className);
  let doc;
  if (rawDoc._id) {
    doc = await Class.findOneAsync(rawDoc._id);
  }
  if (doc) {
    doc.set(rawDoc);
  }
  else {
    doc = new Class(rawDoc, {
      clone: false
    });
  }

  // Get a method from the class. In some cases method may not be present,
  // because it might be defined only on the server.
  const method = Class.getMeteorMethod(methodName);
  if (!method) {
    return;
  }

  return method.apply(doc, methodArgs);
};
