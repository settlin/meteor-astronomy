import { Class } from 'meteor/settlin:astronomy';

Tinytest.add('Modules - Fields - Definition', function(test) {
  reset();

  let Definition = Class.create({
    name: 'Definition',
    fields: {
      // Field type provided.
      string: {
        type: String
      },
      // Field definition provided.
      number: {
        type: Number
      }
    }
  });

  test.equal(Definition.getField('string').type.name, 'String',
    'The type of the "string" field should be "string"'
  );
  test.equal(Definition.getField('number').type.name, 'Number',
    'The type of the "number" field should be "number"'
  );
});