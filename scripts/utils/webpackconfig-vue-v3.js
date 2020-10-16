/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );

module.exports = {
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.esm-bundler.js',
			'@vue/test-utils': '@vue/test-utils/dist/vue-test-utils.esm-bundler.js'
		},
		modules: [ path.resolve( __dirname, path.normalize( '../../dependencies/vue-v3/node_modules' ) ), 'node_modules' ]
	}
};
