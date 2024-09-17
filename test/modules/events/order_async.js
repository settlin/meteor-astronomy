import { Class } from "meteor/settlin:astronomy";
import { Mongo } from 'meteor/mongo';

Tinytest.addAsync("Modules - Events - Order Async", async function(test) {
  let executedEvents = [];
  let expectedEvents = [];

  let OrderNestedEvent = Class.create({
    name: "OrderNestedEvent",
    events: {
      beforeInit: function() {
        executedEvents.push("ONE.beforeInit");
      },
      afterInit: function() {
        executedEvents.push("ONE.afterInit");
      },
      beforeSave: function() {
        executedEvents.push("ONE.beforeSave");
      },
      afterSave: function() {
        executedEvents.push("ONE.afterSave");
      },
      beforeInsert: function() {
        executedEvents.push("ONE.beforeInsert");
      },
      afterInsert: function() {
        executedEvents.push("ONE.afterInsert");
      },
      beforeUpdate: function() {
        executedEvents.push("ONE.beforeUpdate");
      },
      afterUpdate: function() {
        executedEvents.push("ONE.afterUpdate");
      },
    },
  });

  let OrderEvents = new Mongo.Collection(null);

  let OrderEvent = Class.create({
    name: "OrderEvent",
    collection: OrderEvents,
    fields: {
      one: {
        type: OrderNestedEvent,
        default: function() {
          return new OrderNestedEvent();
        },
      },
      many: {
        type: [OrderNestedEvent],
        default: function() {
          return [new OrderNestedEvent()];
        },
      },
      string: {
        type: String,
        optional: true,
      },
    },
    events: {
      beforeInit: function() {
        executedEvents.push("OE.beforeInit");
      },
      afterInit: function() {
        executedEvents.push("OE.afterInit");
      },
      beforeSave: function() {
        executedEvents.push("OE.beforeSave");
      },
      afterSave: function() {
        executedEvents.push("OE.afterSave");
      },
      beforeInsert: function() {
        executedEvents.push("OE.beforeInsert");
      },
      afterInsert: function() {
        executedEvents.push("OE.afterInsert");
      },
      beforeUpdate: function() {
        executedEvents.push("OE.beforeUpdate");
      },
      afterUpdate: function() {
        executedEvents.push("OE.afterUpdate");
      },
    },
  });

  // Document creation.
  executedEvents = [];
  expectedEvents = [
    "OE.beforeInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "OE.afterInit",
  ];
  let event = new OrderEvent();
  test.equal(
    executedEvents,
    expectedEvents,
    "Wrong events order on a document creation",
  );

  // Document insertion.
  executedEvents = [];
  expectedEvents = [
    "OE.beforeSave",
    "ONE.beforeSave",
    "ONE.beforeSave",
    "OE.beforeInsert",
    "ONE.beforeInsert",
    "ONE.beforeInsert",
    "OE.afterInsert",
    "ONE.afterInsert",
    "ONE.afterInsert",
    "OE.afterSave",
    "ONE.afterSave",
    "ONE.afterSave",
  ];
  await event.saveAsync();
  test.equal(
    executedEvents,
    expectedEvents,
    "Wrong events order on a document insert",
  );

  // Document update without changes.
  executedEvents = [];
  expectedEvents = [
    "OE.beforeInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "OE.afterInit",
    "OE.beforeInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "OE.afterInit",
  ];
  await event.saveAsync();
  test.equal(
    executedEvents,
    expectedEvents,
    "Wrong events order on a document update without changes",
  );

  // Document update with changes.
  executedEvents = [];
  expectedEvents = [
    "OE.beforeInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "OE.afterInit",
    "OE.beforeInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "ONE.beforeInit",
    "ONE.afterInit",
    "OE.afterInit",
    "OE.beforeSave",
    "ONE.beforeSave",
    "ONE.beforeSave",
    "OE.beforeUpdate",
    "ONE.beforeUpdate",
    "ONE.beforeUpdate",
    "OE.afterUpdate",
    "ONE.afterUpdate",
    "ONE.afterUpdate",
    "OE.afterSave",
    "ONE.afterSave",
    "ONE.afterSave",
  ];
  event.string = "abc";
  await event.saveAsync();
  test.equal(
    executedEvents,
    expectedEvents,
    "Wrong events order on a document update with changes",
  );
});
