import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';

Tinytest.addAsync('Modules - Events - Propagation Async', async function(test) {
  let expectedEvents = [];
  let executedEvents = [];

  let PropagationNestedEvent = Class.create({
    name: 'PropagationNestedEvent',
    events: {
      beforeSave: [
        function() {
          executedEvents.push('PNE.beforeSave1');
        }
      ]
    }
  });

  let PropagationEvents = new Mongo.Collection(null);

  let PropagationEvent = Class.create({
    name: 'PropagationEvent',
    collection: PropagationEvents,
    fields: {
      one: {
        type: PropagationNestedEvent,
        default: function() {
          return new PropagationNestedEvent();
        }
      },
      stopPropagation: {
        type: Boolean
      },
      stopImmediatePropagation: {
        type: Boolean
      },
    },
    events: {
      beforeSave: [
        function(e) {
          var doc = e.currentTarget;
          executedEvents.push('PE.beforeSave1');
          if (doc.stopImmediatePropagation) {
            e.stopImmediatePropagation();
          }
          else if (doc.stopPropagation) {
            e.stopPropagation();
          }
        },
        function() {
          executedEvents.push('PE.beforeSave2');
        }
      ]
    }
  });

  // Propagation NOT stopped.
  executedEvents = [];
  expectedEvents = [
    'PE.beforeSave1',
    'PE.beforeSave2',
    'PNE.beforeSave1'
  ];
  let eventsPropagation = new PropagationEvent();
  eventsPropagation.stopPropagation = false;
  eventsPropagation.stopImmediatePropagation = false;
  await eventsPropagation.saveAsync();
  test.equal(executedEvents, expectedEvents,
    'Events propagation should not be stopped'
  );

  // Propagation immediately stopped.
  executedEvents = [];
  expectedEvents = [
    'PE.beforeSave1'
  ];
  eventsPropagation.stopPropagation = false;
  eventsPropagation.stopImmediatePropagation = true;
  await eventsPropagation.saveAsync();
  test.equal(executedEvents, expectedEvents,
    'Events propagation should be stopped immediately'
  );

  // Propagation stopped.
  executedEvents = [];
  expectedEvents = [
    'PE.beforeSave1',
    'PE.beforeSave2'
  ];
  eventsPropagation.stopPropagation = true;
  eventsPropagation.stopImmediatePropagation = false;
  await eventsPropagation.saveAsync();
  test.equal(executedEvents, expectedEvents,
    'Events propagation should be stopped'
  );
});