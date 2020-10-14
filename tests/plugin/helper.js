/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { isLegacyVue } from '../../src/plugin';

describe( 'isLegacyVue() helper', () => {
	it( 'should return true for versions < 3.0.0', () => {
		expect( isLegacyVue( { version: '0.0.1' } ) ).to.be.true;
		expect( isLegacyVue( { version: '0.0.1-alpha.1' } ) ).to.be.true;
		expect( isLegacyVue( { version: '0.0.1-beta.2' } ) ).to.be.true;
		expect( isLegacyVue( { version: '0.0.1-rc.3' } ) ).to.be.true;
		expect( isLegacyVue( { version: '0.1.1' } ) ).to.be.true;
		expect( isLegacyVue( { version: '1.1.1' } ) ).to.be.true;
		expect( isLegacyVue( { version: '2.0.0' } ) ).to.be.true;
		expect( isLegacyVue( { version: '2.99.99' } ) ).to.be.true;
		expect( isLegacyVue( { version: '3.0.0-rc.99' } ) ).to.be.true;
	} );

	it( 'should return false for versions >= 3.0.0', () => {
		expect( isLegacyVue( { version: '3.0.0' } ) ).to.be.false;
		expect( isLegacyVue( { version: '3.0.1' } ) ).to.be.false;
		expect( isLegacyVue( { version: '3.0.1-alpha.1' } ) ).to.be.false;
		expect( isLegacyVue( { version: '3.0.1-beta.2' } ) ).to.be.false;
		expect( isLegacyVue( { version: '3.0.1-rc.3' } ) ).to.be.false;
		expect( isLegacyVue( { version: '3.99.99' } ) ).to.be.false;
		expect( isLegacyVue( { version: '4.0.0' } ) ).to.be.false;
		expect( isLegacyVue( { version: '99.99.99' } ) ).to.be.false;
	} );
} );
