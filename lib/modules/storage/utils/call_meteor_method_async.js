import { Meteor } from 'meteor/meteor';

export const callMeteorMethodAsync = async function (Class, methodName, methodArgs) {
  const Collection = Class.getCollection();
  let connection = Collection && Collection._connection;
  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection || Meteor.server;
  }
  // Prepare meteor method options.
  const methodOptions = {
    throwStubExceptions: true,
    returnStubValue: true
  };
	return await new Promise(function (resolve, reject) {
		connection.apply(methodName, methodArgs, methodOptions, function (err, res) {
			err ? reject(err) : resolve(res);
		});
	});
};
