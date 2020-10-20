/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { isNextVue } from '../src/helper';

describe( 'isNextVue() helper', () => {
	it( 'should return false for versions < 3.0.0', () => {
		expect( isNextVue() ).to.be.false;
		expect( isNextVue( {} ) ).to.be.false;
		expect( isNextVue( { notValidProperty: 42 } ) ).to.be.false;
		expect( isNextVue( { version: 0 } ) ).to.be.false;
		expect( isNextVue( { version: 1 } ) ).to.be.false;
		expect( isNextVue( { version: 2 } ) ).to.be.false;
		expect( isNextVue( { version: '0' } ) ).to.be.false;
		expect( isNextVue( { version: '0.0' } ) ).to.be.false;
		expect( isNextVue( { version: '1' } ) ).to.be.false;
		expect( isNextVue( { version: '1.1' } ) ).to.be.false;
		expect( isNextVue( { version: '2' } ) ).to.be.false;
		expect( isNextVue( { version: '2.2' } ) ).to.be.false;
		expect( isNextVue( { version: '0.0.1' } ) ).to.be.false;
		expect( isNextVue( { version: '0.0.1-alpha.1' } ) ).to.be.false;
		expect( isNextVue( { version: '0.0.1-beta.2' } ) ).to.be.false;
		expect( isNextVue( { version: '0.0.1-rc.3' } ) ).to.be.false;
		expect( isNextVue( { version: '0.1.1' } ) ).to.be.false;
		expect( isNextVue( { version: '1.1.1' } ) ).to.be.false;
		expect( isNextVue( { version: '2.0.0' } ) ).to.be.false;
		expect( isNextVue( { version: '2.99.99' } ) ).to.be.false;
	} );

	it( 'should return true for versions >= 3.0.0', () => {
		expect( isNextVue( { version: 3 } ) ).to.be.true;
		expect( isNextVue( { version: 4 } ) ).to.be.true;
		expect( isNextVue( { version: 99 } ) ).to.be.true;
		expect( isNextVue( { version: '3' } ) ).to.be.true;
		expect( isNextVue( { version: '3.0' } ) ).to.be.true;
		expect( isNextVue( { version: '3.0.0' } ) ).to.be.true;
		expect( isNextVue( { version: '3.0.0-rc.99' } ) ).to.be.true;
		expect( isNextVue( { version: '3.0.1' } ) ).to.be.true;
		expect( isNextVue( { version: '3.0.1-alpha.1' } ) ).to.be.true;
		expect( isNextVue( { version: '3.0.1-beta.2' } ) ).to.be.true;
		expect( isNextVue( { version: '3.0.1-rc.3' } ) ).to.be.true;
		expect( isNextVue( { version: '3.99.99' } ) ).to.be.true;
		expect( isNextVue( { version: '4.0.0' } ) ).to.be.true;
		expect( isNextVue( { version: '99.99.99' } ) ).to.be.true;
	} );
} );
