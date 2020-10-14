/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import semverLt from 'semver/functions/lt';
import createCKEditorComponent from './ckeditor.js';

export function isLegacyVue( Vue ) {
	return semverLt( Vue.version, '3.0.0' );
}

export default function( Vue ) {
	const component = createCKEditorComponent( {
		isLegacyVue: isLegacyVue( Vue ),
		h: Vue.h
	} );

	return {
		/**
		 * Installs the plugin, registering the `<ckeditor>` component.
		 *
		 * @param {Vue} VueOrApp The Vue object (vue@2.x) or app instance (vue@3.x).
		 */
		install( VueOrApp ) {
			VueOrApp.component( 'ckeditor', component );
		},
		component
	};
}
