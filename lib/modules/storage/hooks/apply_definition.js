import _each from 'lodash/each';
import _extend from 'lodash/extend';
import _zipObject from 'lodash/zipObject';
// Utils.
import hasMeteorMethod from '../utils/has_meteor_method';
// Class static methods.
import { find, findOne } from '../class_static_methods/find';
import { findFetchAsync, findOneAsync } from '../class_static_methods/find_async';
import insert from '../class_static_methods/insert';
import update from '../class_static_methods/update';
import upsert from '../class_static_methods/upsert';
import remove from '../class_static_methods/remove';
import {insertAsync} from '../class_static_methods/insert_async';
import {updateAsync} from '../class_static_methods/update_async';
import {upsertAsync} from '../class_static_methods/upsert_async';
import {removeAsync} from '../class_static_methods/remove_async';
// Class prototype methods.
import protoSave from '../class_prototype_methods/save';
import protoRemove from '../class_prototype_methods/remove';
import protoReload from '../class_prototype_methods/reload';
import protoCopy from '../class_prototype_methods/copy';
import protoGetModifier from '../class_prototype_methods/getModifier';
import protoGetModified from '../class_prototype_methods/getModified';
import protoGetModifiedValues from '../class_prototype_methods/getModifiedValues';
import protoIsModified from '../class_prototype_methods/isModified';
import {saveAsync as protoSaveAsync} from '../class_prototype_methods/save_async';
import {removeAsync as protoRemoveAsync} from '../class_prototype_methods/remove_async';
import {reloadAsync as protoReloadAsync} from '../class_prototype_methods/reload_async';
import {copyAsync as protoCopyAsync} from '../class_prototype_methods/copy_async';
import { getModifierAsync as protoGetModifierAsync } from '../class_prototype_methods/getModifier_async';
import { getModifiedAsync as protoGetModifiedAsync} from '../class_prototype_methods/getModified_async';
import { getModifiedValuesAsync as protoGetModifiedValuesAsync } from '../class_prototype_methods/getModifiedValues_async';
import { isModifiedAsync as protoIsModifiedAsync } from '../class_prototype_methods/isModified_async';
// Meteor methods.
import meteorInsert from '../meteor_methods/insert';
import meteorUpdate from '../meteor_methods/update';
import meteorUpsert from '../meteor_methods/upsert';
import meteorRemove from '../meteor_methods/remove';
import {insertAsync as meteorInsertAsync} from '../meteor_methods/insert_async';
import {updateAsync as meteorUpdateAsync } from '../meteor_methods/update_async';
import {upsertAsync as meteorUpsertAsync} from '../meteor_methods/upsert_async';
import {removeAsync as meteorRemoveAsync} from '../meteor_methods/remove_async';
// Class events.
import fromJSONValue from '../class_events/fromJSONValue';
import toJSONValue from '../class_events/toJSONValue';

function onApplyDefinition(Class, parsedDefinition) {
  const schema = Class.schema;

  if (parsedDefinition.collection) {
    const Collection = schema.collection = parsedDefinition.collection;
    // Get type of the "_id" field.
    const id = Collection._makeNewID();
    const IdType = id.constructor;

    Class.extend({
      // Add the "_id" field if not already added.
      fields: {
        _id: {
          name: '_id',
          type: IdType,
          optional: true
        }
      },
      // Add storage events.
      events: {
        toJSONValue: [toJSONValue],
        fromJSONValue: [fromJSONValue]
      }
    }, ['fields', 'events']);

    // If it's a remote collection then we register methods on the connection
    // object of the collection.
    const connection = Collection._connection;
    if (connection) {
      // Prepare meteor methods to be added.
      const meteorMethods = {
        '/Astronomy/insert': meteorInsert,
        '/Astronomy/update': meteorUpdate,
        '/Astronomy/upsert': meteorUpsert,
        '/Astronomy/remove': meteorRemove,
        '/Astronomy/insertAsync': meteorInsertAsync,
        '/Astronomy/updateAsync': meteorUpdateAsync,
        '/Astronomy/upsertAsync': meteorUpsertAsync,
        '/Astronomy/removeAsync': meteorRemoveAsync,
      };
      _each(meteorMethods, (meteorMethod, methodName) => {
        if (!hasMeteorMethod(connection, methodName)) {
          // Add meteor method.
          connection.methods(_zipObject([methodName], [meteorMethod]));
        }
      });
    }

    // Class static methods.
    Class.find = find;
    Class.findOne = findOne;
    Class.insert = insert;
    Class.update = update;
    Class.upsert = upsert;
		Class.remove = remove;
		
		Class.findFetchAsync = findFetchAsync;
    Class.findOneAsync = findOneAsync;
    Class.insertAsync = insertAsync;
    Class.updateAsync = updateAsync;
    Class.upsertAsync = upsertAsync;
		Class.removeAsync = removeAsync;
		
    // Class prototype methods.
    Class.prototype.save = protoSave;
    Class.prototype.remove = protoRemove;
    Class.prototype.reload = protoReload;
    Class.prototype.copy = protoCopy;
    Class.prototype.getModifier = protoGetModifier;
    Class.prototype.getModified = protoGetModified;
    Class.prototype.getModifiedValues = protoGetModifiedValues;
		Class.prototype.isModified = protoIsModified;
		
    Class.prototype.saveAsync = protoSaveAsync;
    Class.prototype.removeAsync = protoRemoveAsync;
    Class.prototype.reloadAsync = protoReloadAsync;
    Class.prototype.copyAsync = protoCopyAsync;
    Class.prototype.getModifierAsync = protoGetModifierAsync;
    Class.prototype.getModifiedAsync = protoGetModifiedAsync;
    Class.prototype.getModifiedValuesAsync = protoGetModifiedValuesAsync;
    Class.prototype.isModifiedAsync = protoIsModifiedAsync;
  }

  // Apply type field.
  if (parsedDefinition.typeField) {
    const typeField = schema.typeField = parsedDefinition.typeField;
    // Add the type field if not already added.
    if (!Class.hasField(typeField)) {
      Class.extend({
        fields: {
          [typeField]: {
            type: String,
            index: 1
          }
        },
        events: {
          afterInit(e) {
            const doc = e.currentTarget;
            const Class = doc.constructor;
            doc[typeField] = Class.getName();
          }
        }
      }, ['fields', 'events']);
    }

    if (parsedDefinition.typeField) {
      schema.typeField = parsedDefinition.typeField;
    }
  }

  // If class has already assigned collection.
  const Collection = Class.getCollection();
  if (Collection) {
    // Apply the "transform" property only if it's a function or equal null.
    if (
      typeof parsedDefinition.transform === 'function' ||
      parsedDefinition.transform === null
    ) {
      schema.transform = parsedDefinition.transform;
    }

    if (parsedDefinition.secured !== undefined) {
      _extend(schema.secured, parsedDefinition.secured);
    }
  }
};

export default onApplyDefinition;