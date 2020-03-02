import animator from '../src/index.js';
import assert from 'assert';
import Config from '../src/config.js';

describe('Animations', function() {

	it('Should animate an object', function(done) {
		const config = {
			x: {
				duration: 10,
				easing: 'linear',
				type: 'number'
			},
			y: {
				duration: 30,
				easing: 'easeInQuad',
				type: 'number'
			}
		};
		const owner = {};
		let count = 0;
		animator.register(owner, () => count++, config);

		const point = {x: 10, y: 10};
		const start = Date.now();
		const promise = animator.animate(owner, point, {x: 100, y: 100});

		assert(promise instanceof Promise);

		let error;
		promise
			.then(() => {
				const time = Date.now() - start;
				console.log({count, fps: animator.fps()});
				assert.equal(time > 30, true);
				assert.equal(point.x, 100);
				assert.equal(point.y, 100);
			})
			.catch((err) => error = err)
			.finally(() => {
				animator.unregister(owner)
				done(error);
			});

		animator.start(owner);
	});

	it('Should assing non-animated properties directly', function(done) {
		const owner = {};
		let frames = 0;
		animator.register(owner, () => frames++, {duration: 10, c: {type: 'number'}});
		const target = {a: 1, b: 2, c: 3};
		let error;
		animator.animate(owner, target, {a: 4})
			.then(() => {
				assert.equal(target.a, 4);
				assert.equal(frames, 0);
			})
			.catch((err) => error = err)
			.finally(() => {
				animator.unregister(owner)
				done(error);
			});
	});

	it('Should animate booleans', function(done) {
		const owner = {};
		let frames = 0;
		animator.register(owner, () => frames++, {b: {duration: 10}});
		const target = {a: 1, b: false, c: 3};
		let error;
		animator.animate(owner, target, {b: true})
			.then(() => {
				assert.equal(target.b, true);
				assert.equal(frames > 0, true);
			})
			.catch((err) => error = err)
			.finally(() => {
				animator.unregister(owner)
				done(error);
			});

		animator.start(owner);
	});

	it('Should stop', function(done) {
		const owner = {};
		let frames = 0;
		animator.register(owner, () => frames++, {a: {duration: 100}});
		const target = {a: 0};
		let error;
		animator.animate(owner, target, {a: 100})
			.then(() => {
				error = new Error('should have stopped');
			})
			.catch(() => {
				assert.equal(frames > 0, true);
				assert.equal(target.a > 0, true);
			})
			.finally(() => {
				animator.unregister(owner)
				done(error);
			});

		animator.start(owner);
		setTimeout(() => {
			animator.stop(owner);
		}, 50);
	});

	it('Should not fail when stopped and not running', function() {
		const owner = {};
		animator.register(owner);
		animator.stop(owner);
	})

	it('Should throw if owner is not registered', function() {
		const owner = {};
		assert.throws(() => animator.start(owner));
	})

	it('Should init config', function() {
		const cfg = animator.initConfig({duration: 44});
		assert.ok(cfg instanceof Config);
	});

	it('Should emit events', function(done) {
		const owner = {};
		const target = {};
		animator.register(owner, () => true, {duration: 10, a: {from: 0, to: 10}});
		let complete = false;
		animator.listen(owner, 'complete', () => {
			complete = true
		});
		animator.animate(owner, target, {a: null})
			.finally(() => {
				setTimeout(() => {
					assert.ok(complete);
					assert.ok(!animator.running);
					animator.unregister(owner);
					done();
				}, 100);
			});
		animator.start(owner);
	});
});
