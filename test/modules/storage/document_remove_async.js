import { Class } from 'meteor/jagi:astronomy';

Tinytest.addAsync('Modules - Storage - Document remove async', async function(test) {
  const Storage = Class.get('Storage');

  const id = 'documentAsyncId';
  const storage = await Storage.findOneAsync(id);
  await storage.removeAsync();

  test.equal(await Storage.find(id).countAsync(), 0,
    'The document has not been removed properly'
  );
});
