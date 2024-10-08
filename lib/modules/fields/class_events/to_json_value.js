import getAll from '../utils/getAll';
import {EJSON} from 'meteor/ejson';

function toJSONValue(e) {
	let doc = e.currentTarget;
	e.json.values = EJSON.stringify(getAll(doc));
};

export default toJSONValue;