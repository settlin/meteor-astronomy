import {Class} from 'meteor/settlin:astronomy';
import { expect } from 'chai';
import {Meteor} from 'meteor/meteor';

Tinytest.addAsync('Modules - Validators - ValidateAsync', async function(test, onComplete) {
	let ClassValidatorAsync1 = Class.create({
		name: 'ClassValidatorAsync1',
		fields: {
			nameA: {
				type: String
			}
		}
	});

	let docValidatorAsync = new ClassValidatorAsync1();

	docValidatorAsync.nameA = {};

	docValidatorAsync.validateAsync({
		fields: 'nameA'
	})
		.catch(function (validationError) {
		// this is not working somehow
		// test.isNotUndefined(validationError, 'Document not validated properly');
		expect(validationError).to.be.instanceof(Meteor.Error);
		onComplete();
	});
});
