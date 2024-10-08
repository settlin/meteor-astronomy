import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition) {
  _each(sourceDefinition.indexes, function(index, indexName) {
    targetDefinition.indexes[indexName] = index;
  });
};

export default onMergeDefinitions;