import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';

Tinytest.add('Modules - Storage - Init', function () {
  const NestedStorage = Class.create({
    name: 'NestedStorage',
    fields: {
      string: {
        type: String,
        optional: true
      },
      transient: {
        type: String,
        transient: true
      },
      immutable: {
        type: String,
        immutable: true
      }
    }
  });

  const Storages = new Mongo.Collection(null);

  // eslint-disable-next-line no-unused-vars
  const Storage = Class.create({
    name: 'Storage',
    collection: Storages,
    fields: {
      one: {
        type: NestedStorage,
        optional: true
      },
      many: {
        type: [NestedStorage],
        optional: true
      },
      numbers: {
        type: [Number],
        optional: true
      },
      string: {
        type: String,
        optional: true
      },
      number: {
        type: Number,
        optional: true
      },
      boolean: {
        type: Boolean,
        optional: true
      },
      date: {
        type: Date,
        optional: true
      },
      transient: {
        type: String,
        transient: true
      },
      immutable: {
        type: String,
        immutable: true
      }
    }
  });
});