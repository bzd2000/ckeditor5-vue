#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

// This scripts run the Karma's server and tests. It does the same job what `karma start` but
// we need to do it manually because options passed by CLI can overwrite the karma configuration
// which produces invalid config.
// See: https://github.com/ckeditor/ckeditor5-react/issues/25

const options = parseArguments( process.argv.slice( 2 ) );

const getKarmaConfig = require( './utils/getkarmaconfig' );
const { Server: KarmaServer } = require( 'karma' );

const config = getKarmaConfig();

const server = new KarmaServer( config );

console.log( `
╓───┄                   ┄───╖
║ Starting tests for Vue v${ options.vue } ║
╙───┄                   ┄───╜
` );

server.start();

function parseArguments( args ) {
	return require( 'minimist' )( args, {
		alias: {
			v: 'vue'
		},
		default: {
			vue: 2
		}
	} );
}
