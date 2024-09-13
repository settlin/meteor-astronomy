import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition) {
  _each(sourceDefinition.fields, function(fieldDefinition, fieldName) {
    targetDefinition.fields[fieldName] = fieldDefinition;
  });
};

export default onMergeDefinitions;