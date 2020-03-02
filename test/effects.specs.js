/* eslint-disable import/no-namespace, import/namespace */
import  * as effects from '../src/effects';
import assert from 'assert';

describe('Effects', function() {
	it('Should retun 0 when t = 0', function() {
		for (const name of Object.keys(effects)) {
			assert.equal(Math.round(effects[name](0) * 1000) / 1000, 0, name);
		}
	});

	it('Should retun 1 when t = 1', function() {
		for (const name of Object.keys(effects)) {
			assert.equal(Math.round(effects[name](1) * 1000) / 1000, 1, name);
		}
	});

	it('Should be certain value at t = 0.25', function() {
		const values = {
			linear: 0.25,
			easeInQuad: 0.063,
			easeOutQuad: 0.438,
			easeInOutQuad: 0.125,
			easeInCubic: 0.016,
			easeOutCubic: 0.578,
			easeInOutCubic: 0.063,
			easeInQuart: 0.004,
			easeOutQuart: 0.684,
			easeInOutQuart: 0.031,
			easeInQuint: 0.001,
			easeOutQuint: 0.763,
			easeInOutQuint: 0.016,
			easeInSine: 0.076,
			easeOutSine: 0.383,
			easeInOutSine: 0.146,
			easeInExpo: 0.006,
			easeOutExpo: 0.823,
			easeInCirc: 0.032,
			easeOutCirc: 0.661,
			easeInOutCirc: 0.067,
			easeInElastic: 0.091,
			easeOutElastic: 1,
			easeInOutElastic: 0.198,
			easeInBack: -0.064,
			easeOutBack: 0.817,
			easeInOutBack: -0.044,
			easeOutBounce: 0.473,
			easeInBounce: 0.027,
			easeInOutBounce: 0.117
		};
		for (const name of Object.keys(effects)) {
			const result = Math.round(effects[name](0.25) * 1000) / 1000;
			assert.equal(result, values[name], name + ': ' + result);
		}
	});

	it('Should be certain value at t = 0.75', function() {
		const values = {
			linear: 0.75,
			easeInQuad: 0.563,
			easeOutQuad: 0.938,
			easeInOutQuad: 0.875,
			easeInCubic: 0.422,
			easeOutCubic: 0.984,
			easeInOutCubic: 0.938,
			easeInQuart: 0.316,
			easeOutQuart: 0.996,
			easeInOutQuart: 0.969,
			easeInQuint: 0.237,
			easeOutQuint: 0.999,
			easeInOutQuint: 0.984,
			easeInSine: 0.617,
			easeOutSine: 0.924,
			easeInOutSine: 0.854,
			easeInExpo: 0.177,
			easeOutExpo: 0.994,
			easeInCirc: 0.339,
			easeOutCirc: 0.968,
			easeInOutCirc: 0.933,
			easeInElastic: 1.442,
			easeOutElastic: 1.153,
			easeInOutElastic: 1.014,
			easeInBack: 0.183,
			easeOutBack: 1.064,
			easeInOutBack: 1.044,
			easeOutBounce: 0.973,
			easeInBounce: 0.527,
			easeInOutBounce: 0.883
		};
		for (const name of Object.keys(effects)) {
			const result = Math.round(effects[name](0.75) * 1000) / 1000;
			assert.equal(result, values[name], name + ': ' + result);
		}
	});

});