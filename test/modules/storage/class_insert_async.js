import { Class } from 'meteor/jagi:astronomy';

Tinytest.addAsync('Modules - Storage - Class insert async', async function(test) {
  const Storage = Class.get('Storage');

  const id = 'classDocAsyncId';
  await Storage.insertAsync({
    '_id': id,
    'one': {
      'string': 'abc',
      'transient': 'transient',
      'immutable': 'immutable',
    },
    'many': [{
      'string': 'abc',
      'transient': 'transient',
      'immutable': 'immutable',
    }],
    'numbers': [1, 2, 3],
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': new Date(2000, 0, 1),
    'transient': 'transient',
    'immutable': 'immutable',
  });

  const expected = {
    '_id': id,
    'one': {
      'string': 'abc',
      'immutable': 'immutable',
    },
    'many': [{
      'string': 'abc',
      'immutable': 'immutable',
    }],
    'numbers': [1, 2, 3],
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': new Date(2000, 0, 1),
    'immutable': 'immutable',
	};
  test.equal(await Storage.findOneAsync(id, {
    transform: null,
  }), expected,
    'Document has not been inserted properly'
  );
});
