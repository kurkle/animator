/* eslint-disable import/namespace, import/no-namespace */
import color from '@kurkle/color';
import * as effects from './effects';

const transparent = 'transparent';

const interpolators = {
	boolean: (from, to, factor) => factor > 0.5 ? to : from,
	color: (from, to, factor) => {
		const c0 = color(from || transparent);
		const c1 = c0.valid && color(to || transparent);
		return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to;
	},
	number: (from, to, factor) => from + (to - from) * factor
};

const fallback = (...args) => {
	for (const v of args) {
		if (v !== undefined) {
			return v;
		}
	}
}

export default class Animation {
	constructor(cfg, target, prop, to) {
		this.target = target;
		this.prop = prop;
		this.onEnd = undefined;
		this.update(cfg, to);
	}

	update(cfg, to) {
		const me = this;
		const {target, prop} = me;

		me.active = true;
		const currentValue = target[prop];
		to = fallback(cfg.to, to, currentValue, cfg.from);
		const from = fallback(cfg.from, currentValue, to);
		const type = me.type = cfg.type || typeof from;
		const delay = cfg.delay | 0;
		const start = Date.now() + delay;
		let duration = cfg.duration | 0;
		if (me.duration) {
			const end = Math.max(me.start + me.duration, start + duration);
			duration = end - start;
		}

		me.fn = cfg.fn || interpolators[type];
		me.to = to;
		me.from = from;
		me.loop = !!cfg.loop;
		me.start = start;
		me.delay = delay;
		me.easing = effects[cfg.easing || 'linear'];
		me.duration = duration;
	}

	done(ok) {
		if (this.onEnd) {
			this.onEnd(ok);
		}
	}

	cancel() {
		const me = this;
		if (me.active) {
			me.tick(Date.now());
			me.active = false;
			me.done(false);
		}
	}

	tick(date) {
		const me = this;
		const {prop, from, to, duration, start, target, loop} = me;
		const elapsed = date - start;
		let factor;

		if (!(me.active = from !== to && (loop || (elapsed < duration)))) {
			target[prop] = to;
			this.done(true);
		} else {
			factor = (elapsed / duration) % 2;
			factor = loop && factor > 1 ? 2 - factor : factor;
			factor = me.easing(Math.min(1, Math.max(0, factor)));

			target[prop] = me.fn(from, to, factor);
		}
	}
}
