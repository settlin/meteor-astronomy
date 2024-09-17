Package.describe({
  name: "settlin:astronomy",
  version: "2.8.0",
  summary: "Model layer for Meteor",
  git: "https://github.com/settlin/meteor-astronomy.git"
});

Npm.depends({
	lodash: "4.17.11",
});

Package.onUse(function(api) {
  api.versionsFrom("2.12");

  api.use(
    [
      "ecmascript",
      "es5-shim",
      "ddp",
      "mongo",
      "check",
      "minimongo",
      "ejson",
    ],
    ["client", "server"]
  );

  api.mainModule("lib/main.js", ["client", "server"], { lazy: true });
});

////////////////////////////////////////////////////////////////////////////////

Package.onTest(function(api) {
  api.use(
    [
      "meteortesting:mocha",
      "tinytest",
      "ecmascript",
      "es5-shim",
      "insecure",
      "mongo",
      "ejson",
      "settlin:astronomy"
    ],
    ["client", "server"]
  );

  api.addFiles("test/utils.js", ["client", "server"]);
  // Modules - Methods.
	api.addFiles(["test/modules/helpers/definition.js"], ["client", "server"]);
	// Core.
  api.addFiles(
    [
      "test/core/inherit.js",
      "test/core/extend.js",
      "test/core/state.js",
      "test/core/state_async.js",
      "test/core/ejson.js"
    ],
    ["client", "server"]
  );
  // Modules.
  // Modules - Behaviors.
  api.addFiles(
		[
			"test/modules/behaviors/create.js",
			"test/modules/behaviors/apply.js"
		],
    ["client", "server"]
  );
  // Modules - Validators.
  api.addFiles(
    [
      "test/modules/validators/create.js",
      "test/modules/validators/apply.js",
      "test/modules/validators/validate.js",
      "test/modules/validators/validate_async.js",
      "test/modules/validators/validate_callback.js"
    ],
    ["client", "server"]
  );
  // Modules - Storage.
  api.addFiles(
    [
      "test/modules/storage/is_new.js",
      "test/modules/storage/init.js",
      "test/modules/storage/type_field.js",
      "test/modules/storage/transform.js",
      "test/modules/storage/document_insert.js",
      "test/modules/storage/document_update.js",
      "test/modules/storage/document_remove.js",
      "test/modules/storage/class_insert.js",
      "test/modules/storage/class_update.js",
      "test/modules/storage/class_remove.js",
      "test/modules/storage/reload.js",
      "test/modules/storage/copy.js",
      "test/modules/storage/document_insert_async.js",
      "test/modules/storage/document_update_async.js",
      "test/modules/storage/document_remove_async.js",
      "test/modules/storage/document_getModifier_async.js",
      "test/modules/storage/class_insert_async.js",
      "test/modules/storage/class_update_async.js",
      "test/modules/storage/class_remove_async.js",
      "test/modules/storage/reload_async.js",
      "test/modules/storage/copy_async.js"
    ],
    ["client", "server"]
  );
  // Modules - Events.
  api.addFiles(
    [
      "test/modules/events/order.js",
      "test/modules/events/propagation.js",
      "test/modules/events/cancelable.js",
      // "test/modules/events/order_async.js",
      // "test/modules/events/propagation_async.js",
      // "test/modules/events/cancelable_async.js",
    ],
    ["client", "server"]
  );
  // Modules - Fields.
  api.addFiles(
    [
      "test/modules/fields/cast.js",
      "test/modules/fields/default.js",
      "test/modules/fields/definition.js",
      "test/modules/fields/enum.js",
      "test/modules/fields/get.js",
      "test/modules/fields/merge.js",
      "test/modules/fields/optional.js",
      "test/modules/fields/raw.js",
      "test/modules/fields/set.js"
    ],
    ["client", "server"]
  );
  // Modules - Indexes.
  api.addFiles(
    [
      // 'test/indexes/indexes_definition.js'
    ],
    "server"
  );
});
