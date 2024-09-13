// Class static methods.
import getResolveError from '../class_static_methods/get_resolve_error.js';
import getValidationOrder from '../class_static_methods/get_validation_order.js';
import getValidators from '../class_static_methods/get_validators.js';
import validateStatic from '../class_static_methods/validate.js';
import {validateAsync as validateAsyncStatic} from '../class_static_methods/validate_async.js';
import validateAllStatic from '../class_static_methods/validateAll.js';
import {validateAllAsync as validateAllAsyncStatic} from '../class_static_methods/validateAll_async.js';
import getCheckPatternStatic from '../class_static_methods/getCheckPattern.js';
// Class prototype methods.
import validate from '../class_prototype_methods/validate.js';
import validateAll from '../class_prototype_methods/validate_all.js';
import {validateAsync} from '../class_prototype_methods/validate_async.js';
import {validateAllAsync} from '../class_prototype_methods/validate_all_async.js';

function onInitClass(Class) {
	// Class static methods.
	Class.getResolveError = getResolveError;
	Class.getValidationOrder = getValidationOrder;
	Class.getValidators = getValidators;
	Class.validate = validateStatic;
	Class.validateAll = validateAllStatic;
	Class.validateAsync = validateAsyncStatic;
	Class.validateAllAsync = validateAllAsyncStatic;
	Class.getCheckPattern = getCheckPatternStatic;
	// Class prototype methods.
	Class.prototype.validate = validate;
	Class.prototype.validateAll = validateAll;
	Class.prototype.validateAsync = validateAsync;
	Class.prototype.validateAllAsync = validateAllAsync;
};

export default onInitClass;