/* globals describe, it */ 

import { assert } from 'chai';
import {Class} from 'meteor/jagi:astronomy';

const NestedItemMerge = Class.create({
  name: 'NestedItemMerge',
  fields: {
    string: String,
    number: Number,
    date: Date
  }
});

const ItemMerge = Class.create({
  name: 'ItemMerge',
  fields: {
    one: NestedItemMerge,
    many: [NestedItemMerge]
  }
});

describe('Module', function() {
  describe('Fields', function() {
    describe('Merge', function() {
      it('merges objects on setting single value', function() {
        const item = new ItemMerge({
          one: {
            string: '123',
            number: 123,
            date: new Date(1988, 1, 18)
          },
          many: [{
            string: '123',
            number: 123,
            date: new Date(1988, 1, 18)
          }]
        });
        item.set('one', {
          string: '321',
          date: new Date(2000, 0, 1)
        }, {
          merge: true
        });
        item.set('many.0', {
          string: '321',
          date: new Date(2000, 0, 1)
        }, {
          merge: true
        });
        assert.deepEqual(item.one.string, '321');
        assert.deepEqual(item.one.number, 123);
        assert.deepEqual(item.one.date, new Date(2000, 0, 1));
        assert.deepEqual(item.many[0].string, '321');
        assert.deepEqual(item.many[0].number, 123);
        assert.deepEqual(item.many[0].date, new Date(2000, 0, 1));
      });
      it('merges objects on setting multiple values', function() {
        const item = new ItemMerge({
          one: {
            string: '123',
            number: 123,
            date: new Date(1988, 1, 18)
          },
          many: [{
            string: '123',
            number: 123,
            date: new Date(1988, 1, 18)
          }]
        });
        item.set({
          one: {
            string: '321',
            date: new Date(2000, 0, 1)
          },
          'many.0': {
            string: '321',
            date: new Date(2000, 0, 1)
          }
        }, {
          merge: true
        });
        assert.deepEqual(item.one.string, '321');
        assert.deepEqual(item.one.number, 123);
        assert.deepEqual(item.one.date, new Date(2000, 0, 1));
        assert.deepEqual(item.many[0].string, '321');
        assert.deepEqual(item.many[0].number, 123);
        assert.deepEqual(item.many[0].date, new Date(2000, 0, 1));
      });
    });
  });
});