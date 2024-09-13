/* globals describe, it */ 

import { assert } from 'chai';
import {Class} from 'meteor/jagi:astronomy';

describe('Module', function() {
  describe('Fields', function() {
    describe('Raw', function() {
      const NestedItemRaw = Class.create({
        name: 'NestedItemRaw',
        fields: {
          string: {
            type: String
          }
        }
      });

      const ItemRaw = Class.create({
        name: 'ItemRaw',
        fields: {
          one: {
            type: NestedItemRaw
          },
          many: {
            type: [NestedItemRaw]
          },
          undefined: {
            type: String
          },
          immutable: {
            type: String,
            immutable: true
          },
          transient: {
            type: String,
            transient: true
          }
        }
      });

      const doc = new ItemRaw({
        one: new NestedItemRaw({
          string: 'abc'
        }),
        many: [
          new NestedItemRaw({
            string: 'abc'
          })
        ],
        immutable: 'immutable',
        transient: 'transient'
      });

      it('retrieves single raw value', () => {
        assert.deepEqual(doc.raw('one'), {
          string: 'abc'
        });
      });
      it('retrieves nested raw value', () => {
        assert.deepEqual(doc.raw('one.string'), 'abc');
      });
      it('retrieves raw value of the list field', () => {
        assert.deepEqual(doc.raw('many'), [{
          string: 'abc'
        }]);
      });
      it('retrieves raw value of the element in the list field', () => {
        assert.deepEqual(doc.raw('many.0'), {
          string: 'abc'
        });
      });
      it('retrieves multiple single raw values', () => {
        assert.deepEqual(doc.raw(['one', 'immutable', 'transient']), {
          one: {
            string: 'abc'
          },
          immutable: 'immutable',
          transient: 'transient'
        });
      });
      it('retrieves multiple single raw values ommiting immutable fields', () => {
        assert.deepEqual(doc.raw(['one', 'immutable', 'transient'], {
          immutable: false
        }), {
          one: {
            string: 'abc'
          },
          immutable: undefined,
          transient: 'transient'
        });
      });
      it('retrieves multiple single raw values ommiting transient fields', () => {
        assert.deepEqual(doc.raw(['one', 'immutable', 'transient'], {
          transient: false
        }), {
          one: {
            string: 'abc'
          },
          immutable: 'immutable',
          transient: undefined
        });
      });
      it('retrieves multiple single raw, non-undefined values', () => {
        assert.deepEqual(doc.raw(['one', 'undefined'], {
          undefined: false
        }), {
          one: {
            string: 'abc'
          }
        });
      });
      it('retrieves multiple single raw, non-undefined values ommiting immutable and transient fields', () => {
        assert.deepEqual(doc.raw(['one', 'immutable', 'transient'], {
          immutable: false,
          transient: false,
          undefined: false
        }), {
          one: {
            string: 'abc'
          }
        });
      });
      it('retrieves multiple nested raw values', () => {
        assert.deepEqual(doc.raw(['one.string']), {
          'one.string': 'abc'
        });
      });
      it('retrieves all raw values', () => {
        assert.deepEqual(doc.raw(), {
          one: {
            string: 'abc'
          },
          many: [{
            string: 'abc'
          }],
          undefined: undefined,
          immutable: 'immutable',
          transient: 'transient'
        });
      });
    });
  });
});