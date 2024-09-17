import { Class } from 'meteor/settlin:astronomy';
import { Mongo } from 'meteor/mongo';
import { resetAsync } from '../utils';

Tinytest.addAsync('Core - State Async', async function(test) {
  await resetAsync();

  const States = new Mongo.Collection(null);

  const StateAsync = Class.create({
    name: 'StateAsync',
    collection: States
  });

  let core = new StateAsync();
  test.isTrue(StateAsync.isNew(core),
    'Newly created document should have the "_isNew" flag set to true'
  );

  await core.saveAsync();
  test.isFalse(StateAsync.isNew(core),
    'Saved document should have the "_isNew" flag set to false'
  );

  core = await States.findOneAsync();
  test.isFalse(StateAsync.isNew(core),
    'Aocument fetched from the collection should have the "_isNew" flag ' +
    'set to false'
  );
});
