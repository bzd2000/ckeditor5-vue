/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import createCKEditorComponent from './ckeditor';
import { isNextVue } from './helper';

/**
 * Vue plugin creator.
 *
 * @param {Object} options
 * @param {Boolean} options.isNextVue Informs if current Vue version is the next one (v3.x) or the previous one (v2.x).
 * @param {Function} options.h Creates virtual DOM nodes (h stands for hyperscript). Only used for Vue v3.x.
 * @returns {Object} options
 * @returns {Object} options.install Used during plugin installation.
 * @returns {Object} options.component Vue component.
 */
export default function( { version, h } ) {
	const component = createCKEditorComponent( {
		isNextVue: isNextVue( { version } ),
		h
	} );

	return {
		/**
		 * Installs the plugin, registering the `<ckeditor>` component.
		 *
		 * @param {Vue} VueOrApp The Vue object (for Vue v2.x) or app instance (for Vue v3.x).
		 */
		install( VueOrApp ) {
			VueOrApp.component( 'ckeditor', component );
		},
		component
	};
}
