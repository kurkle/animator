import Animation from './animation.js';

const isObject = (obj) => {
	const type = typeof obj;
	return type === 'function' || (type === 'object' && !!obj);
};

function inheritedDefaults(config) {
	const result = {};
	for (const key in config) {
		const value = config[key];
		if (!isObject(value)) {
			result[key] = value;
		}
	}
	return result;
}

const runningMap = new WeakMap();

export default class Config {
	constructor(config) {
		this.props = new Map();
		this.configure(config);
	}

	configure(config) {
		if (!isObject(config)) {
			return;
		}

		const props = this.props;
		const defaults = inheritedDefaults(config);

		for (const key in config) {
			const cfg = config[key];
			if (!isObject(cfg)) {
				continue;
			}
			for (const prop of (cfg.props || [key])) {
				if (prop[0] === '$' || prop[0] === '_') {
					continue;
				}
				// Can have only one config per animation.
				if (!props.has(prop)) {
					props.set(prop, Object.assign({}, defaults, cfg));
				} else { // prop === key
					// Single property targetting config wins over multi-targetting.
					props.set(prop, Object.assign({}, props.get(prop), cfg));
				}
			}
		}
	}

	/**
	 * @private
	 */
	_create(target, values) {
		const props = this.props;
		const anims = [];
		let running = runningMap.get(target);

		if (!running) {
			running = {};
			runningMap.set(target, running);
		}

		for (const prop in values) {
			if (prop[0] === '$' || prop[0] === '_') {
				continue;
			}

			const value = values[prop];
			const cfg = props.get(prop);
			let animation = running[prop];
			if (!cfg || (!cfg.duration && !animation)) {
				// not animated, set directly to new value
				target[prop] = value;
				continue;
			}

			if (!animation) {
				animation = running[prop] = new Animation(cfg, target, prop, value);
			} else {
				animation.update(cfg, value);
			}
			anims.push(animation);
		}
		return anims;
	}

	animate(target, values) {
		if (this.props.size === 0) {
			Object.assign(target, values);
		}

		return this._create(target, values);
	}
}

