/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import semverGte from 'semver/functions/gte';
import semverCoerce from 'semver/functions/coerce';

const DEFAULT_VUE_VERSION = 2;

/**
 * Checks if provided version relates to the next Vue (v3.x) or to the previous one (v2.x). This distinction is required
 * because Vue has changed its API between v2.x and v3.x and couple of things have to be done differently than before.
 * The version is coerced to the SemVer, if possible.
 *
 * @param {Object} options
 * @param {String | Number} options.version Vue version to check.
 * @returns {Boolean}
 */
export function isNextVue( { version = DEFAULT_VUE_VERSION } = {} ) {
	return semverGte( semverCoerce( version ), '3.0.0' );
}
