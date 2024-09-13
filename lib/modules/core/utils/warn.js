import config from "../../../core/config.js";

function warn(warning) {
  // Be silent and do not log any warnings.
  if (!config.verbose) {
    return;
  }
  try {
    console.warn(warning);
	// eslint-disable-next-line no-unused-vars
	} catch (e) {
		//
	}
}

export default warn;
