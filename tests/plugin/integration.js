/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import { mount, createLocalVue } from '@vue/test-utils';
import createCKEditorPlugin from '../../src/plugin';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Vue, isNextVue, UNMOUNT_METHOD_NAME } from './../_utils/vueadapter';

const CKEditorPlugin = createCKEditorPlugin( Vue );

describe( 'CKEditor plugin', () => {
	describe( 'Plugin installed globally', () => {
		it( 'should work with an actual editor build', done => {
			const domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			const wrapper = mount( {
				template: '<ckeditor :editor="editor" @ready="onReady" v-model="editorData"></ckeditor>',
				methods: {
					onReady: () => {
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
				...getMountingOptionsForGlobalPluginInstallation( CKEditorPlugin )
			} );
		} );
	} );
} );

function getMountingOptionsForGlobalPluginInstallation( plugin ) {
	if ( isNextVue ) {
		return {
			global: {
				plugins: [ plugin ]
			}
		};
	}

	const localVue = createLocalVue();
	localVue.use( plugin );

	return {
		localVue
	};
}
