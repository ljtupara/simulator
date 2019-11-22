/* eslint-disable no-undef */
const assert = require('assert');
const app = require('../../src/app');

describe('\'army\' service', () => {
	it('registered the service', () => {
		const service = app.service('army');

		assert.ok(service, 'Registered the service');
	});
});
