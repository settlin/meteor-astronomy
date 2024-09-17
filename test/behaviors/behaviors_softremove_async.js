import { Class } from 'meteor/settlin:astronomy';
import { resetAsync } from '../utils';
import {Mongo} from 'meteor/mongo';

Tinytest.add('Behaviors - Softremove async', async function(test) {
  // Reset Astronomy.
  resetAsync();

  const SoftremovesA = new Mongo.Collection(null);
  const SoftremovesB = new Mongo.Collection(null);
  const SoftremovesC = new Mongo.Collection(null);

	const docsA = await SoftremovesA.findFetchAsync({}, {
		transform: null
	});
	await Promise.all(docsA.map(async function (item) {
    await SoftremovesA.removeAsync(item._id);
  }));

  const docsB = await SoftremovesB.findFetchAsync({}, {
		transform: null
	});
	await Promise.all(docsB.map(async function (item) {
    await SoftremovesB.removeAsync(item._id);
  }));

	const docsC = await SoftremovesC.findFetchAsync({}, {
		transform: null
	});
	await Promise.all(docsC.map(async function (item) {
    await SoftremovesC.removeAsync(item._id);
  }));


  var SoftremoveA = Class.create({
    name: 'SoftremoveA',
    collection: SoftremovesA,
    fields: {
      name: 'string'
    },
    behaviors: {
      softremove: {}
    }
  });

  var SoftremoveB = Class.create({
    name: 'SoftremoveB',
    collection: SoftremovesB,
    fields: {
      name: 'string'
    },
    behaviors: {
      softremove: {
        removedFieldName: 'deleted',
        hasRemovedAtField: true,
        removedAtFieldName: 'removedDate'
      }
    }
  });

  var SoftremoveC = Class.create({
    name: 'SoftremoveC',
    collection: SoftremovesC,
    fields: {
      name: 'string'
    },
    behaviors: {
      softremove: {
        hasRemovedAtField: false
      }
    }
  });

  var softremoveA = new SoftremoveA();
  await softremoveA.saveAsync();
  await softremoveA.softRemoveAsync();
  test.isTrue(softremoveA.get('removed'),
    'The "removed" flag should be set after soft removing document'
  );
  test.instanceOf(softremoveA.get('removedAt'), Date,
    'The "removedAt" field should be set with a date of document removal'
  );
  test.equal(await SoftremovesA.find().countAsync(), 1,
    'Wrong number of fetched documents from the "Collection.find()" method call'
  );
  test.equal(await SoftremoveA.find().countAsync(), 0,
    'Wrong number of fetched documents from the "Class.find()" method call'
  );

  var softremoveB = new SoftremoveB();
  await softremoveB.saveAsync();
  await softremoveB.softRemoveAsync();
  test.isTrue(softremoveB.get('deleted'),
    'The "deleted" flag should be set after soft removing document'
  );
  test.instanceOf(softremoveB.get('removedDate'), Date,
    'The "removedDate" field should be set with a date of document removal'
  );
  test.equal(await SoftremovesB.find().countAsync(), 1,
    'Wrong number of fetched documents from the "Collection.find()" method call'
  );
  test.equal(await SoftremoveB.find().countAsync(), 0,
    'Wrong number of fetched documents from the "Class.find()" method call'
  );

  var softremoveC = new SoftremoveC();
  await softremoveC.saveAsync();
  await softremoveC.softRemoveAsync();
  test.isUndefined(softremoveC.get('removedAt'),
    'The "removedAt" field should not be available'
  );
  test.equal(await SoftremovesC.find().countAsync(), 1,
    'Wrong number of fetched documents from the "Collection.find()" method call'
  );
  test.equal(await SoftremoveC.find().countAsync(), 0,
    'Wrong number of fetched documents from the "Class.find()" method call'
  );
});
