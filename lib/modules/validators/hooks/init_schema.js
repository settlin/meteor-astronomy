function onInitSchema(schema) {
	schema.validators = {};
	schema.resolveError = undefined;
};

export default onInitSchema;