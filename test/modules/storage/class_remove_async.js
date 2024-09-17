import { Class } from 'meteor/settlin:astronomy';

Tinytest.addAsync('Modules - Storage - Class remove async', async function(test) {
  const Storage = Class.get('Storage');

  const id = 'classDocAsyncId';
  await Storage.removeAsync(id);

  test.equal(await Storage.find(id).countAsync(), 0,
    'Document has not been removed properly'
  );
});
