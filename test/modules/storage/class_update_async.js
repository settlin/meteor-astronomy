import { Class } from 'meteor/settlin:astronomy';

Tinytest.addAsync('Modules - Storage - Class update async', async function(test) {
  const Storage = Class.get('Storage');

  const id = 'classDocAsyncId';
  await Storage.updateAsync(id, {
    $set: {
      'one': {
        'string': 'cba',
        'transient': 'transient',
        'immutable': 'IMMUTABLE',
      },
      'many.0': {
        'string': 'cba',
        'transient': 'transient',
        'immutable': 'IMMUTABLE',
      },
      'numbers': [3, 2, 1],
      'string': 'cba',
      'number': 321,
      'boolean': false,
      'date': new Date(2001, 0, 1),
      'immutable': 'IMMUTABLE',
    }
  });

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
    'date': new Date(2001, 0, 1),
    'immutable': 'immutable',
  };
  test.equal(Storage.findOne(id, {
    transform: null
  }), expected,
    'Document has not been updated properly'
  );
});
