import {Class} from 'meteor/settlin:astronomy';

Tinytest.addAsync(
  'Modules - Validators - ValidateWithCallback', function(test, onComplete) {
    let ClassValidatorAsync = Class.create({
      name: 'ClassValidatorAsync',
      fields: {
        nameA: {
          type: String
        }
      }
    });

    let doc = new ClassValidatorAsync();

    doc.nameA = {};

    // Validate with callback
    doc.validate({
      fields: 'nameA'
		}, function (validationError) {
      test.isNotUndefined(
        validationError, 'Document not validated properly'
      );
      onComplete();
    });
  }
);