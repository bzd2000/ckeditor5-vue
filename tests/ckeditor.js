/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console, setTimeout */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import createCKEditorComponent from '../src/ckeditor';
import { isLegacyVue } from '../src/plugin';
import {
	MockEditor,
	ModelDocument,
	ViewDocument
} from './_utils/mockeditor';

const CKEditorComponent = createCKEditorComponent( {
	isLegacyVue: isLegacyVue( Vue ),
	h: Vue.h
} );

describe( 'CKEditor Component', () => {
	let sandbox, wrapper, vm;

	beforeEach( () => {
		( { wrapper, vm } = mountComponent() );

		sandbox = sinon.createSandbox();
	} );

	afterEach( () => {
		sandbox.restore();
		wrapper.destroy();
	} );

	it( 'should have a name', () => {
		expect( CKEditorComponent.name ).to.equal( 'ckeditor' );
	} );

	it( 'should call editor#create when initializing', async () => {
		const stub = sandbox.stub( MockEditor, 'create' ).resolves( new MockEditor() );
		const { wrapper } = mountComponent();

		await Vue.nextTick();

		sinon.assert.calledOnce( stub );
		wrapper.destroy();
	} );

	it( 'should call editor#destroy when destroying', async () => {
		const stub = sandbox.stub( MockEditor.prototype, 'destroy' ).resolves();
		const { wrapper, vm } = mountComponent();

		await Vue.nextTick();

		wrapper.destroy();
		sinon.assert.calledOnce( stub );
		expect( vm.$_instance ).to.be.null;
	} );

	it( 'should pass the editor promise rejection error to console#error()', async () => {
		const error = new Error( 'Something went wrong.' );
		const consoleErrorStub = sandbox.stub( console, 'error' );

		sandbox.stub( MockEditor, 'create' ).rejects( error );

		const { wrapper } = mountComponent();

		await timeout( 0 );

		consoleErrorStub.restore();

		expect( consoleErrorStub.calledOnce ).to.be.true;
		expect( consoleErrorStub.firstCall.args[ 0 ] ).to.equal( error );

		wrapper.destroy();
	} );

	describe( 'properties', () => {
		describe( '#editor', () => {
			it( 'should accept an editor constructor', async () => {
				const { wrapper, vm } = mountComponent( {
					editor: MockEditor
				} );

				await Vue.nextTick();

				expect( vm.editor ).to.equal( MockEditor );
				expect( vm.$_instance ).to.be.instanceOf( MockEditor );

				wrapper.destroy();
			} );
		} );

		describe( '#modelValue', () => {
			it( 'should be defined', () => {
				expect( vm.modelValue ).to.equal( '' );
			} );

			// See: https://github.com/ckeditor/ckeditor5-vue/issues/47.
			it( 'should set the initial data', async () => {
				const { wrapper, vm } = mountComponent( {
					modelValue: 'foo'
				} );

				await Vue.nextTick();

				expect( vm.$_instance.config.initialData ).to.equal( 'foo' );
				expect( vm.$_instance.setDataCounter ).to.equal( 0 );

				wrapper.destroy();
			} );
		} );

		describe( '#tagName', () => {
			it( 'should be defined', () => {
				expect( vm.tagName ).to.equal( 'div' );
			} );

			it( 'should define the tag of the element', () => {
				const { wrapper, vm } = mountComponent( {
					tagName: 'textarea'
				} );

				expect( vm.$el.tagName ).to.equal( 'TEXTAREA' );

				wrapper.destroy();
			} );
		} );

		describe( '#disabled', () => {
			it( 'should be defined', () => {
				expect( vm.disabled ).to.be.false;
			} );

			it( 'should set the initial editor#isReadOnly', async () => {
				const { wrapper, vm } = mountComponent( {
					disabled: true
				} );

				await Vue.nextTick();

				expect( vm.$_instance.isReadOnly ).to.be.true;
				wrapper.destroy();
			} );
		} );

		describe( '#config', () => {
			it( 'should be empty', () => {
				expect( vm.config ).to.deep.equal( {} );
			} );

			it( 'should be set according to the initial editor#config', async () => {
				const { wrapper, vm } = mountComponent( {
					config: { foo: 'bar' }
				} );

				await Vue.nextTick();

				expect( vm.$_instance.config ).to.deep.equal( { foo: 'bar' } );
				wrapper.destroy();
			} );

			// https://github.com/ckeditor/ckeditor5-vue/issues/101
			it( 'should not be mutated', async () => {
				const createStub = sandbox.stub( MockEditor, 'create' ).resolves( new MockEditor() );

				const ParentComponent = {
					data() {
						return {
							editor: MockEditor,
							editorConfig: {
								foo: 'bar'
							},
							editorFooData: 'foo',
							editorBarData: 'bar',
							editorBazData: 'baz'
						};
					},
					template: `
						<div>
							<ckeditor :editor="editor" tag-name="textarea" v-model="editorFooData" :config="editorConfig">foo</ckeditor>
							<ckeditor :editor="editor" tag-name="textarea" v-model="editorBarData" :config="editorConfig">bar</ckeditor>
							<ckeditor :editor="editor" tag-name="textarea" v-model="editorBazData" :config="editorConfig">baz</ckeditor>
						</div>
					`
				};

				const { vm } = mount( ParentComponent, {
					stubs: {
						ckeditor: CKEditorComponent
					}
				} );

				await Vue.nextTick();

				const fooEditorConfig = createStub.firstCall.args[ 1 ];
				const barEditorConfig = createStub.secondCall.args[ 1 ];
				const bazEditorConfig = createStub.thirdCall.args[ 1 ];

				expect( fooEditorConfig ).to.not.equal( barEditorConfig );
				expect( fooEditorConfig ).to.not.equal( bazEditorConfig );
				expect( barEditorConfig ).to.not.equal( bazEditorConfig );

				expect( vm.editorConfig.initialData ).to.be.undefined;

				wrapper.destroy();
			} );
		} );

		it( '#instance should be defined', async () => {
			await Vue.nextTick();

			expect( vm.$_instance ).to.be.instanceOf( MockEditor );
		} );
	} );

	describe( 'bindings', () => {
		it( '#disabled should control editor#isReadOnly', async () => {
			const { wrapper, vm } = mountComponent( {
				disabled: true
			} );

			await Vue.nextTick();

			expect( vm.$_instance.isReadOnly ).to.be.true;

			wrapper.setProps( { disabled: false } );

			await Vue.nextTick();

			expect( vm.$_instance.isReadOnly ).to.be.false;

			wrapper.destroy();
		} );

		it( '#modelValue should trigger editor#setData', async () => {
			await Vue.nextTick();

			const spy = sandbox.spy( vm.$_instance, 'setData' );
			wrapper.setProps( { modelValue: 'foo' } );

			await Vue.nextTick();

			wrapper.setProps( { modelValue: 'bar' } );

			await Vue.nextTick();

			sinon.assert.calledTwice( spy );

			// Simulate typing: The #modelValue changes but at the same time, the instance update
			// its own data so instance.getData() and #modelValue are immediately the same.
			// Make sure instance.setData() is not called in this situation because it would destroy
			// the selection.
			wrapper.vm.$_lastEditorData = 'barq';
			wrapper.setProps( { modelValue: 'barq' } );

			await Vue.nextTick();

			sinon.assert.calledTwice( spy );
			sinon.assert.calledWithExactly( spy.firstCall, 'foo' );
			sinon.assert.calledWithExactly( spy.secondCall, 'bar' );
		} );
	} );

	describe( 'events', () => {
		it( 'should emit #ready when the editor is created', async () => {
			await Vue.nextTick();

			expect( wrapper.emitted().ready.length ).to.equal( 1 );
			expect( wrapper.emitted().ready[ 0 ] ).to.deep.equal( [ vm.$_instance ] );
		} );

		it( 'should emit #destroy when the editor is destroyed', async () => {
			const { wrapper, vm } = mountComponent();

			await Vue.nextTick();

			wrapper.destroy();

			expect( wrapper.emitted().destroy.length ).to.equal( 1 );
			expect( wrapper.emitted().destroy[ 0 ] ).to.deep.equal( [ vm.$_instance ] );
		} );

		describe( '#input event', () => {
			it( 'should be emitted but debounced when editor data changes', async () => {
				sandbox.stub( ModelDocument.prototype, 'on' );
				sandbox.stub( MockEditor.prototype, 'getData' ).returns( 'foo' );

				await Vue.nextTick();

				const on = vm.$_instance.model.document.on;
				const evtStub = {};

				expect( on.calledOnce ).to.be.true;
				expect( on.firstCall.args[ 0 ] ).to.equal( 'change:data' );
				expect( on.firstCall.args[ 1 ] ).to.be.a( 'function' );

				expect( wrapper.emitted().input ).to.be.undefined;

				on.firstCall.args[ 1 ]( evtStub );

				await timeout( 350 );

				expect( wrapper.emitted().input.length ).to.equal( 1 );
				expect( wrapper.emitted().input[ 0 ] ).to.deep.equal( [
					'foo', evtStub, vm.$_instance
				] );
			} );

			// https://github.com/ckeditor/ckeditor5-vue/issues/149
			it( 'should be emitted immediatelly despite being debounced', async () => {
				sandbox.stub( ModelDocument.prototype, 'on' );
				sandbox.stub( MockEditor.prototype, 'getData' ).returns( 'foo' );

				await Vue.nextTick();

				const on = vm.$_instance.model.document.on;
				const evtStub = {};

				expect( on.calledOnce ).to.be.true;
				expect( on.firstCall.args[ 0 ] ).to.equal( 'change:data' );
				expect( on.firstCall.args[ 1 ] ).to.be.a( 'function' );

				expect( wrapper.emitted().input ).to.be.undefined;

				on.firstCall.args[ 1 ]( evtStub );

				expect( wrapper.emitted().input.length ).to.equal( 1 );
				expect( wrapper.emitted().input[ 0 ] ).to.deep.equal( [
					'foo', evtStub, vm.$_instance
				] );
			} );
		} );

		it( 'should emit #focus when the editor editable is focused', async () => {
			sandbox.stub( ViewDocument.prototype, 'on' );

			await Vue.nextTick();

			const on = vm.$_instance.editing.view.document.on;
			const evtStub = {};

			expect( on.calledTwice ).to.be.true;
			expect( on.firstCall.args[ 0 ] ).to.equal( 'focus' );
			expect( on.firstCall.args[ 1 ] ).to.be.a( 'function' );

			expect( wrapper.emitted().focus ).to.be.undefined;

			on.firstCall.args[ 1 ]( evtStub );

			expect( wrapper.emitted().focus.length ).to.equal( 1 );
			expect( wrapper.emitted().focus[ 0 ] ).to.deep.equal( [
				evtStub, vm.$_instance
			] );
		} );

		it( 'should emits #blur when the editor editable is blurred', async () => {
			sandbox.stub( ViewDocument.prototype, 'on' );

			await Vue.nextTick();

			const on = vm.$_instance.editing.view.document.on;
			const evtStub = {};

			expect( on.calledTwice ).to.be.true;
			expect( on.secondCall.args[ 0 ] ).to.equal( 'blur' );
			expect( on.secondCall.args[ 1 ] ).to.be.a( 'function' );

			expect( wrapper.emitted().blur ).to.be.undefined;

			on.secondCall.args[ 1 ]( evtStub );

			expect( wrapper.emitted().blur.length ).to.equal( 1 );
			expect( wrapper.emitted().blur[ 0 ] ).to.deep.equal( [
				evtStub, vm.$_instance
			] );
		} );
	} );

	function mountComponent( props ) {
		const wrapper = mount( CKEditorComponent, {
			propsData: Object.assign( {}, {
				editor: MockEditor
			}, props )
		} );

		return { wrapper, vm: wrapper.vm };
	}

	function timeout( delay ) {
		return new Promise( resolve => setTimeout( resolve, delay ) );
	}
} );
