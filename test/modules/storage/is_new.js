/* globals describe, it */ 

import { assert } from 'chai';
import {Class} from 'meteor/jagi:astronomy';
import {
  Mongo
}
from 'meteor/mongo';

describe('Module', function() {
  describe('Storage', function() {
    describe('_isNew', function() {
      const NestedItemIsNew = Class.create({
        name: 'NestedItemIsNew'
      });

      const ItemIsNew = Class.create({
        name: 'ItemIsNew',
        collection: new Mongo.Collection(null)
      });

      it('should have the "_isNew" property set to "true"', () => {
        const doc = new ItemIsNew();
        assert.isTrue(doc._isNew);
      });
      it('should have the "_isNew" property set to "false"', () => {
        let doc = new ItemIsNew();
        doc.save();
        doc = ItemIsNew.findOne();
        assert.isFalse(doc._isNew);
      });
      it('should not have the "_isNew" property defined', () => {
        const doc = new NestedItemIsNew();
        assert.isUndefined(doc._isNew);
      });
    });
  });
});