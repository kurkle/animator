import Config from '../src/config.js';
import assert from 'assert';
import sleep from './sleep.js';

describe('Config', function() {
	it('Should not fail with empty config', function() {
		const c = new Config();
		assert.equal(c instanceof Config, true);
		assert.equal(c.props instanceof Map, true);
		assert.equal(c.props.size, 0);
		assert.equal(c.animate({}, {prop: true}).length, 0);
	});

	it('Should favor direct config over bundle', function() {
		const cfg = new Config({
			delay: 0,
			numbers: {
				type: 'number',
				props: ['a', 'b', 'f'],
				delay: 100,
				duration: 1000
			},
			a: {
				type: 'boolean',
				duration: 500
			},
			c: {
				duration: 200
			}
		});
		assert.equal(cfg.props.size, 4);

		const anims = cfg.animate({}, {a: false, b: 1000, c: 10, d: 40});
		// d has no config and f has no new value
		assert.equal(anims.length, 3);

		const a = anims.filter(an => an.prop === 'a').pop();
		const b = anims.filter(an => an.prop === 'b').pop();
		const c = anims.filter(an => an.prop === 'c').pop();
		assert.equal(a.type, 'boolean');
		assert.equal(a.duration, 500);
		assert.equal(a.delay, 100);

		assert.equal(b.type, 'number');
		assert.equal(b.duration, 1000);
		assert.equal(b.delay, 100);

		assert.equal(c.type, 'number');
		assert.equal(c.duration, 200);
		assert.equal(c.delay, 0);
	});

	it('Should update existing animations', function() {
		const cfg = new Config({duration: 100, a: {type: 'number'}});
		const target = {};

		let anims = cfg.animate(target, {a: 10});
		assert.equal(anims.length, 1);

		const a = anims.pop();
		assert.equal(a.from, 10);
		assert.equal(a.to, 10);
		assert.equal(target.a, undefined);

		// undefined is set directly to target
		a.tick(a.start + 20);
		assert.equal(target.a, 10);

		const oldStart = a.start;
		sleep(10);
		anims = cfg.animate(target, {a: 20});
		assert.equal(anims.length, 1);
		assert.equal(anims[0], a);
		assert.equal(a.from, 10);
		assert.equal(a.to, 20);
		assert.equal(a.start > oldStart, true);
		assert.equal(target.a, 10);

		a.tick(a.start + 20);
		assert.equal(target.a, 12);
	});

	it('Should not configure or set properties starting with `$` or `_`', function() {
		const cfg = new Config({$: {duration: 10}, _: {duration: 10}, test: {duration: 10, props: ['a', '_', '$']}});
		assert.equal(cfg.props.size, 1);

		const target = {$: 1, _: 2, a: 3};
		const anims = cfg.animate(target, {$: 100, _: 200, a: 300});
		assert.equal(anims.length, 1);
		const a = anims.pop();
		a.tick(a.start + 10);
		assert.equal(target.$, 1);
		assert.equal(target._, 2);
		assert.equal(target.a, 300);
	});

	it('Should directly set properties that are not animated', function() {
		const cfg = new Config({a: {duration: 10}, c: {duration: 0}});
		const target = {};
		cfg.animate(target, {a: 10, b: 10, c: 10});
		assert.equal(target.a, undefined);
		assert.equal(target.b, 10);
		assert.equal(target.c, 10);
	})
});
