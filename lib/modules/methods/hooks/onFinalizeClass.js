import _each from "lodash/each";
import wrapMethod from "../utils/wrapMethod";
import hasMeteorMethod from "../../storage/utils/has_meteor_method";
import astronomyExecute from "../meteor_methods/astronomyExecute";
import applyMethod from "../class_prototype_methods/applyMethod";
import callMethod from "../class_prototype_methods/callMethod";
import { Meteor } from 'meteor/meteor';
import { astronomyExecuteAsync } from '../meteor_methods/astronomyExecuteAsync';
import { callMethodAsync } from '../class_prototype_methods/callMethod_async';
import { applyMethodAsync } from '../class_prototype_methods/applyMethod_async';
import { wrapMethodAsync } from '../utils/wrapMethod_async';

function onFinalizeClass(Class) {
  const schema = Class.schema;

  if (schema.collection) {
    const Collection = schema.collection;
    const connection =
      Collection._connection || Meteor.connection || Meteor.server;
    if (connection) {
      if (!hasMeteorMethod(connection, "/Astronomy/execute")) {
        // Add Meteor method.
        connection.methods({
          "/Astronomy/execute": astronomyExecute,
          "/Astronomy/executeAsync": astronomyExecuteAsync
        });
      }
    }

    // Add Meteor methods to the class.
    _each(schema.methods, (method, methodName) => {
      Class.prototype[methodName] = wrapMethod(methodName);
      Class.prototype[methodName + 'Async'] = wrapMethodAsync(methodName);
    });

    // Add universal "applyMethod" and "callMethod" methods that can invoke any
    // method even if only defined on the server.
    Class.prototype.applyMethod = applyMethod;
    Class.prototype.callMethod = callMethod;
    Class.prototype.applyMethodAsync = applyMethodAsync;
    Class.prototype.callMethodAsync = callMethodAsync;
  }
}

export default onFinalizeClass;
