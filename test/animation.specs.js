import Animation from '../src/animation.js';
import assert from 'assert';

describe('Animation', function() {
	it('Should animate different types of properties', function() {
		const target = {b: false, n: 0, c: 'blue'};

		let a = new Animation({duration: 10}, target, 'b', true);
		assert.equal(a.type, 'boolean');
		a.tick(a.start + 2);
		assert.equal(target.b, false);
		a.tick(a.start + 6);
		assert.equal(target.b, true);

		a = new Animation({duration: 10}, target, 'n', 1);
		assert.equal(a.type, 'number');
		a.tick(a.start + 2);
		assert.equal(target.n, 0.2);
		a.tick(a.start + 8);
		assert.equal(target.n, 0.8);

		a = new Animation({duration: 10, type: 'color'}, target, 'c', 'transparent');
		assert.equal(a.type, 'color');
		a.tick(a.start + 2);
		assert.equal(target.c, '#00FC');
		a.tick(a.start + 10);
		assert.equal(target.c, 'transparent');

		target.c = null;
		a = new Animation({duration: 10, type: 'color'}, target, 'c', 'black');
		a.tick(a.start + 2);
		assert.equal(target.c, '#0003');
		a.tick(a.start + 10);
		assert.equal(target.c, 'black');

		a = new Animation({duration: 10, type: 'color'}, target, 'c', null);
		a.tick(a.start + 2);
		assert.equal(target.c, '#000C');
		a.tick(a.start + 10);
		assert.equal(target.c, null);

		a = new Animation({duration: 10, type: 'color'}, target, 'c', 'invalid');
		a.tick(a.start + 2);
		assert.equal(target.c, 'invalid');
		a.tick(a.start + 7);
		assert.equal(target.c, 'invalid');
	});

	it('Should be cancelable', function() {
		const target = {n: 0};

		const a = new Animation({duration: 1000}, target, 'n', 10000);
		let result = null;
		a.onEnd = (ok) => {result = ok};
		a.tick(a.start + 200);
		assert.equal(target.n, 2000);
		assert.equal(result, null);
		a.cancel();
		assert.equal(a.active, false);
		assert.equal(result, false);

		result = null;
		a.cancel();
		assert.equal(a.active, false);
		assert.equal(result, null);
	});

	it('Should be loopable', function() {
		const target = {n: 0};

		const a = new Animation({duration: 100, loop: true}, target, 'n', 100);
		let result = null;
		a.onEnd = (ok) => {result = ok};
		a.tick(a.start + 50);
		assert.equal(target.n, 50);
		a.tick(a.start + 100);
		assert.equal(target.n, 100);
		a.tick(a.start + 150);
		assert.equal(target.n, 50);
		a.tick(a.start + 200);
		assert.equal(target.n, 0);
		assert.equal(result, null);
		a.cancel();
		assert.equal(result, false);
	})
});
