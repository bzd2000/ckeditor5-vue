/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import * as VueModule from 'vue';
import { mount, createLocalVue } from '@vue/test-utils';
import createCKEditorPlugin, { isLegacyVue } from '../../src/plugin';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Vue = VueModule.default || VueModule;
const UNMOUNT_METHOD_NAME = isLegacyVue( Vue ) ? 'destroy' : 'unmount';

describe( 'CKEditor plugin', () => {
	describe( 'Plugin installed globally', () => {
		const plugin = createCKEditorPlugin( Vue );

		it( 'should work with an actual editor build', done => {
			const domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			const wrapper = mount( {
				template: '<ckeditor :editor="editor" @ready="onReady" v-model="editorData"></ckeditor>',
				methods: {
					onReady: () => {
						// const instance = wrapper.findComponent( '#ckeditor' ).vm.$_instance;
						const instance = wrapper.findComponent( { name: 'ckeditor' } ).vm.$_instance;

						expect( instance ).to.be.instanceOf( ClassicEditor );
						expect( instance.getData() ).to.equal( '<p>foo</p>' );

						wrapper[ UNMOUNT_METHOD_NAME ]();
						done();
					}
				}
			}, {
				attachTo: domElement,
				data: () => {
					return {
						editor: ClassicEditor,
						editorData: '<p>foo</p>'
					};
				},
				...getMountingOptionsForGlobalPluginInstallation( Vue, plugin )
			} );
		} );
	} );
} );

function getMountingOptionsForGlobalPluginInstallation( { version }, plugin ) {
	if ( isLegacyVue( { version } ) ) {
		const localVue = createLocalVue();

		localVue.use( plugin );

		return {
			localVue
		};
	}

	return {
		global: {
			plugins: [ plugin ]
		}
	};
}
