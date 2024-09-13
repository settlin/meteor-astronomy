import globals from "globals";
import pluginJs from "@eslint/js";


export default [
	{
		languageOptions: {
			globals: {
				...globals.browser,
				Npm: 'readonly',
				Package: 'readonly',
				Tinytest: 'readonly',
			}
		},
	},
  pluginJs.configs.recommended,
];