import { Class } from 'meteor/settlin:astronomy';

Tinytest.addAsync('Modules - Storage - Document GetModifier async', async function(test) {
  const Storage = Class.get('Storage');

	const id = 'documentGMAsyncId';
  const storage = new Storage({
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
    'date': new Date(2000, 0, 1, 0, 0, 0, 0),
    'transient': 'transient',
    'immutable': 'immutable',
	});
	await storage.saveAsync();
  
	storage.one.string = 'modified';
	storage.numbers = [9];
	const modifier = await storage.getModifierAsync();

  test.equal(JSON.stringify(modifier), '{"$set":{"one.string":"modified","numbers":[9]}}',
    'The modifier is not proper'
  );
});
