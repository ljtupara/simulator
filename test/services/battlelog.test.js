/* eslint-disable no-undef */
const assert = require('assert');
const app = require('../../src/app');

describe('\'battlelog\' service', () => {
	it('registered the service', () => {
		const service = app.service('battlelog');

		assert.ok(service, 'Registered the service');
	});
});
