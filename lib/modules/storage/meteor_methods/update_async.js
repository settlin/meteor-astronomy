import {classUpdateAsync} from '../utils/class_update_async.js';
import { check, Match } from 'meteor/check';

export async function updateAsync(args) {
  check(args, Match.Any);

  return classUpdateAsync(args);
};
