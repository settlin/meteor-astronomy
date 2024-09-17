import { Class, Behavior } from 'meteor/settlin:astronomy';
import { Meteor } from 'meteor/meteor';

export const resetDatabase = function() {
	Object.entries(Class.classes).map(([, Class]) => {
    let Collection = Class.getCollection();
    if (!Collection) {
      return;
    }

    // Remove documents from the collection.
    Collection.find().fetch().forEach((doc) => {
      Collection.remove(doc._id);
    });
  });
};

export const resetMethods = function() {
	Object.entries(Class.classes).map(([, Class]) => {
    let Collection = Class.getCollection();
    if (!Collection) {
      return;
    }

    let methodHandlers;
    if (Meteor.connection) {
      methodHandlers = Meteor.connection._methodHandlers;
    }
    else if (Meteor.server) {
      methodHandlers = Meteor.server.method_handlers;
    }
    if (!methodHandlers) {
      return;
    }

    delete methodHandlers['/' + Collection._name + '/insert'];
    delete methodHandlers['/' + Collection._name + '/update'];
		delete methodHandlers['/' + Collection._name + '/remove'];
		delete methodHandlers['/' + Collection._name + '/insertAsync'];
    delete methodHandlers['/' + Collection._name + '/updateAsync'];
    delete methodHandlers['/' + Collection._name + '/removeAsync'];
  });
};

export const reset = function() {
  resetDatabase();
  resetMethods();

	// if done before calling any class constructor - causes error
	// may happen esp. if reset is called after a client method call
	// as it may take time for the call to execute on server and in the meanwhile this line executes
	Class.classes = {};
  Behavior.behaviors = {};
};

export const resetDatabaseAsync = async function() {
	const all = Object.entries(Class.classes).map(async ([, Class]) => {
    let Collection = Class.getCollection();
    if (!Collection) {
      return;
		}
		
    // Remove documents from the collection.
		return await Promise.all(await Collection.find().mapAsync(async (doc) =>
			await Collection.removeAsync(doc._id)
    ));
	});
	await Promise.all(all);
};

export const resetAsync = async function() {
  await resetDatabaseAsync();
  resetMethods();

  Class.classes = {};
  Behavior.behaviors = {};
};