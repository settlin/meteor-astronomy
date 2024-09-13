import {isModifiedAsync as utilIsModifiedAsync} from '../utils/isModified_async';

export async function isModifiedAsync(pattern) {
	let doc = this;

	return utilIsModifiedAsync({
		doc,
		pattern,
		transient: true
	});
};
