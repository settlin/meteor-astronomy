import _each from 'lodash/each';
import Type from '../type.js';

Type.create({
  name: 'Map',
  class: Map,
  cast(object) {
    const map = new Map();
    _each(object, (value, key) => {
      map.set(key, value);
    });
    return map;
  },
  validate() {
    // Validators.number(args);
  }
});
