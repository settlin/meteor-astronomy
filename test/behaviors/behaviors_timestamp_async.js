import { Class } from 'meteor/settlin:astronomy';
import { resetAsync } from '../utils';
import {Mongo} from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

Tinytest.addAsync('Behaviors - Timestamp', async function(test, next) {
  // Reset Astronomy.
  resetAsync();

  var TimestampsA = new Mongo.Collection(null);
  var TimestampsB = new Mongo.Collection(null);
  var TimestampsC = new Mongo.Collection(null);

  const docsA = await TimestampsA.findFetchAsync({}, {
		transform: null
	});
	await Promise.all(docsA.map(async function (item) {
    await TimestampsA.removeAsync(item._id);
  }));

  const docsB = await TimestampsB.findFetchAsync({}, {
		transform: null
	});
	await Promise.all(docsB.map(async function (item) {
    await TimestampsB.removeAsync(item._id);
  }));

	const docsC = await TimestampsC.findFetchAsync({}, {
		transform: null
	});
	await Promise.all(docsC.map(async function (item) {
    await TimestampsC.removeAsync(item._id);
  }));

  var TimestampA = Class.create({
    name: 'TimestampA',
    collection: TimestampsA,
    fields: {
      name: 'string'
    },
    behaviors: {
      timestamp: {}
    }
  });

  var TimestampB = Class.create({
    name: 'TimestampB',
    collection: TimestampsB,
    fields: {
      name: 'string'
    },
    behaviors: {
      timestamp: {
        createdFieldName: 'created',
        updatedFieldName: 'updated'
      }
    }
  });

  var TimestampC = Class.create({
  name: 'TimestampC',
  collection: TimestampsC,
  fields: {
    name: 'string'
  },
  behaviors: {
    timestamp: {
      hasCreatedField: false,
      hasUpdatedField: false
    }
  }
});

  var timestampA = new TimestampA({
    name: 'TimestampA'
  });
  await timestampA.saveAsync();

  test.instanceOf(timestampA.get('createdAt'), Date,
    'The "createdAt" field should be instance of Date'
  );
  test.instanceOf(timestampA.get('updatedAt'), Date,
    'The "updatedAt" field should be instance of Date'
  );
  test.equal(timestampA.get('createdAt'), timestampA.get('updatedAt'),
    'The "createdAt" and "updatedAt" fields should be equal'
  );

  timestampA.set('name', 'TimestampA2');

  Meteor.setTimeout(async function() {
    await timestampA.saveAsync();
    test.isTrue(timestampA.get('createdAt') < timestampA.get('updatedAt'),
      'The value of the "updatedAt" field should be greater than the value ' +
      'of the "createdAt" field'
    );
    next();
  }, 1);

  var timestampB = new TimestampB({
    name: 'TimestampB'
  });
  await timestampB.saveAsync();

  test.instanceOf(timestampB.get('created'), Date,
    'The "created" field should be instance of Date'
  );
  test.instanceOf(timestampB.get('updated'), Date,
    'The "updated" field should be instance of Date'
  );
  test.equal(timestampB.get('created'), timestampB.get('updated'),
    'The "created" and "updated" fields should be equal'
  );

  var timestampC = new TimestampC({
    name: 'TimestampC'
  });
  await timestampC.saveAsync();

  test.isUndefined(timestampC.get('createdAt'),
    'The "createdAt" field should be undefined'
  );
  test.isUndefined(timestampC.get('updatedAt'),
    'The "updatedAt" field should be undefined'
  );
});
