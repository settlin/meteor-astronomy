import {Class} from 'meteor/settlin:astronomy';
import { NestedItem } from './NestedItem';

export const Item = Class.create({
  name: 'Item',
  fields: {
    number: Number,
    boolean: Boolean,
    date: Date,
    one: NestedItem,
    many: [NestedItem],
    numbers: {
      type: [Number],
      default() {
        return [];
      }
    },
    strings: {
      type: [String],
      default() {
        return [];
      }
    },
    booleans: {
      type: [Boolean],
      default() {
        return [];
      }
    },
    dates: {
      type: [Date],
      default() {
        return [];
      }
    },
    custom: {
      type: String,
      cast(value) {
        return JSON.stringify(value);
      }
    }
  }
});
