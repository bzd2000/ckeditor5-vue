/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import * as VueModule from 'vue';
import { isNextVue as isNextVueHelper } from '../../src/helper';

export const Vue = VueModule.default || VueModule;
export const isNextVue = isNextVueHelper( Vue );
export const PROPS_KEY_NAME = isNextVue ? 'props' : 'propsData';
export const UNMOUNT_METHOD_NAME = isNextVue ? 'unmount' : 'destroy';
