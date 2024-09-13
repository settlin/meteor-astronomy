import {EJSON} from 'meteor/ejson';

function fromJSONValue(e) {
  let doc = e.currentTarget;
  doc.set(EJSON.parse(e.json.values), {
    defaults: false,
    clone: false,
    cast: false
  });
}

export default fromJSONValue;