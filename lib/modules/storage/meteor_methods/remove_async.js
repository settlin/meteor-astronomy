import {classRemoveAsync} from '../utils/class_remove_async';
import { check, Match } from 'meteor/check';

export async function removeAsync(args) {
  check(args, Match.Any);

  return classRemoveAsync(args);
};
