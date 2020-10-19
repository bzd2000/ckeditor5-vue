/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { mount } from '@vue/test-utils';
import createCKEditorPlugin from '../../src/plugin';
import { MockEditor } from '../_utils/mockeditor';
import { Vue, UNMOUNT_METHOD_NAME } from './../_utils/vueadapter';

class FooEditor extends MockEditor {}
class BarEditor extends MockEditor {}

const CKEditorPlugin = createCKEditorPlugin( Vue );

describe( 'CKEditor plugin', () => {
	it( 'should work when the component is used locally', async () => {
		const wrapperFoo = mount( {
			template: '<ckeditor ref="ckeditor-foo" :editor="editorType"></ckeditor>',
			components: {
				ckeditor: CKEditorPlugin.component
			}
		}, {
			data: () => {
				return {
					editorType: FooEditor
				};
			}
		} );

		const wrapperBar = mount( {
			template: '<ckeditor ref="ckeditor-bar" :editor="editorType"></ckeditor>',
			components: {
				ckeditor: CKEditorPlugin.component
			}
		}, {
			data: () => {
				return {
					editorType: BarEditor
				};
			}
		} );

		await Vue.nextTick();

		const instanceFoo = wrapperFoo.findComponent( { ref: 'ckeditor-foo' } ).vm.$_instance;
		const instanceBar = wrapperBar.findComponent( { ref: 'ckeditor-bar' } ).vm.$_instance;

		expect( instanceFoo ).to.be.instanceOf( FooEditor );
		expect( instanceBar ).to.be.instanceOf( BarEditor );

		wrapperFoo[ UNMOUNT_METHOD_NAME ]();
		wrapperBar[ UNMOUNT_METHOD_NAME ]();
	} );
} );
