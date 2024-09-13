import {classUpsertAsync} from '../utils/class_upsert_async.js';
import { check, Match } from 'meteor/check';

export async function upsertAsync(args) {
  check(args, Match.Any);

  return classUpsertAsync(args);
};
