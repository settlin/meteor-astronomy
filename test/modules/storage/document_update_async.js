import { Class } from 'meteor/jagi:astronomy';

Tinytest.addAsync('Modules - Storage - Document update async', async function(test) {
  const Storage = Class.get('Storage');

  const id = 'documentAsyncId';
  const storage = await Storage.findOneAsync(id);

  // Update a document.
  storage.one.string = 'cba'
  storage.one.transient = 'transient'
  storage.one.immutable = 'IMMUTABLE'
  storage.many[0].string = 'cba';
  storage.many[0].transient = 'transient';
  storage.many[0].immutable = 'IMMUTABLE';
  storage.numbers = [3, 2, 1];
  storage.string = 'cba';
  storage.number = 321;
  storage.boolean = false;
  storage.date = new Date(2001, 0, 1, 0, 0, 0, 0);
  storage.transient = 'transient';
  storage.immutable = 'IMMUTABLE';
  await storage.saveAsync();

  const expected = {
    '_id': id,
    'one': {
      'string': 'cba',
      'immutable': 'immutable',
    },
    'many': [{
      'string': 'cba',
      'immutable': 'immutable',
    }],
    'numbers': [3, 2, 1],
    'string': 'cba',
    'number': 321,
    'boolean': false,
    'date': new Date(2001, 0, 1, 0, 0, 0, 0),
    'immutable': 'immutable',
  };
  test.equal(await Storage.findOneAsync(id, {
    transform: null,
  }), expected,
    'The document has not been updated properly'
  );
});
