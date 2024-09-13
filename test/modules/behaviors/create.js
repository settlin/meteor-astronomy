import { Behavior } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Behaviors - Create', function(test) {
	let CustomBehavior = Behavior.create({
		name: 'custom',
		options: {
			fieldName: 'behaviorField'
		},
		createClassDefinition: function() {
			let behavior = this;

			let definition = {
				fields: {}
			};

			definition.fields[behavior.options.fieldName] = {
				type: String,
				default: 'defaultValue'
			};

			return definition;
		}
	});

  test.isTrue(
		Object.prototype.isPrototypeOf.call(Behavior.prototype, CustomBehavior.prototype),
    'Behavior not created'
  );
});
