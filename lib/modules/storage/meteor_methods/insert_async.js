import { check, Match } from 'meteor/check';
import { classInsertAsync } from '../utils/class_insert_async.js';

export function insertAsync(args) {
  check(args, Match.Any);

  return classInsertAsync(args);
};
