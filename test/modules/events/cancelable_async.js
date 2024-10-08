import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';

Tinytest.addAsync('Modules - Events - Cancelable Async', async function(test) {
  let CancelableNestedEvent = Class.create({
    name: 'CancelableNestedEvent',
    events: {
      beforeSave: function(e) {
        var doc = e.target;
        if (doc.preventNested) {
          e.preventDefault();
        }
      }
    }
  });

  let CancelableEvents = new Mongo.Collection(null);

  let CancelableEvent = Class.create({
    name: 'CancelableEvent',
    collection: CancelableEvents,
    fields: {
      one: {
        type: CancelableNestedEvent,
        default: function() {
          return new CancelableNestedEvent();
        }
      },
      many: {
        type: [CancelableNestedEvent],
        default: function() {
          return [new CancelableNestedEvent()];
        }
      },
      prevent: {
        type: Boolean,
        default: false
      },
      preventNested: {
        type: Boolean,
        default: false
      }
    },
    events: {
      beforeSave: function(e) {
        var doc = e.currentTarget;
        if (doc.prevent) {
          e.preventDefault();
        }
      }
    }
  });

  let event = new CancelableEvent();

  // Prevent nested.
  event.prevent = false;
  event.preventNested = true;
  test.throws(
    async function() {
      await event.saveAsync();
    },
    'Operation prevented [prevented]'
  );

  // Prevent.
  event.prevent = true;
  event.preventNested = false;
  test.throws(
    async function() {
      await event.saveAsync();
    },
    'Operation prevented [prevented]'
  );

  // Do not prevent.
  event.prevent = false;
  event.preventNested = false;
  await event.saveAsync();
  test.isNotNull(event._id,
    'Execution of the operation should not be prevented'
  );
});
