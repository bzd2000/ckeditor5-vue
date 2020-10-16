/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );

module.exports = {
	resolve: {
		modules: [ path.resolve( __dirname, path.normalize( '../../dependencies/vue-v2/node_modules' ) ), 'node_modules' ]
	}
};
