import Config from './config.js';
import Entry from './entry.js';

const browser = typeof window !== 'undefined';

const raf = browser
	? (fn) => window.requestAnimationFrame(fn)
	: (fn) => setTimeout(fn, 1000 / 60); // ~60 fps

const registry = new Map();
let fps = null;
let last = null;
let frame = null;
let running = false;

const run = () => {
	const ts = Date.now();
	let remaining = 0;

	for (const entry of registry.values()) {
		remaining += entry.run(ts);
	}

	fps = (1000 / (ts - last)) | 0;
	last = ts;

	if (remaining === 0) {
		running = false;
	}
}

const refresh = () => {
	if (!frame) {
		running = true;

		frame = raf(() => {
			run();
			frame = null;
			if (running) {
				refresh();
			}
		});
	}
}

const getEntry = (owner) => {
	const entry = registry.get(owner);
	if (!entry) {
		throw new Error('Not registered!');
	}
	return entry;
}

/**
 * This callback is displayed as a global member.
 * @callback animationEvent
 * @param {number} numSteps
 * @param {number} currentSteps
  */

export default {
	/**
	 * Register a controller for animations
	 * @param {object} owner - the controller
	 * @param {function} draw - callback for frame drawing
	 * @param {object} config - the default configuration to use
	 */
	register: (owner, draw, config) => registry.set(owner, new Entry(draw, new Config(config))),

	/**
	 * Unregister a controller
	 * @param {object} owner - the controller
	 */
	unregister: (owner) => registry.delete(owner),

	/**
	 * Listen for event
	 * @param {object} owner - the controller
	 * @param {string} event - 'progress' or 'complete'
	 * @param {animationEvent} cb - callback function for the event
	 */
	listen: (owner, event, cb) => getEntry(owner).listeners[event].push(cb),

	/**
	 * Initialize an additional config
	 * @param {object} config
	 * @return {Config}
	 */
	initConfig: (config) => new Config(config),

	/**
	 * Animate given `target`, controlled by `owner`, to new `props`.
	 * @param {object} owner - the controller
	 * @param {object} target - target object
	 * @param {object} props - the new properties
	 * @param {Config} [config] - custom config if not using the default one
	 * @return {Promise}
	 */
	animate: (owner, target, props, config) => {
		const entry = getEntry(owner);
		config = config || entry.config;
		const anims = config.animate(target, props);
		entry.anims.push(...anims);
		let num = anims.length;
		let fail = false;
		return !num
			? Promise.resolve()
			: new Promise((resolve, reject) => {
				const onEnd = (done) => {
					if (!done) {
						fail = true;
					}
					if (--num === 0) {
						if (fail) {
							reject();
						} else {
							resolve();
						}
					}
				}
				for (const anim of anims) {
					anim.onEnd = onEnd;
				}
			});
	},

	/**
	 * Start animating given object
	 * @param {object} owner - the controller
	 */
	start: (owner) => {
		getEntry(owner).start();
		refresh();
	},

	/**
	 * Stop animating given controller
	 * @param {object} owner - the controller
	 */
	stop: (owner) => {
		getEntry(owner).stop();
	},

	/**
	 * @return {number} - frames per second
	 */
	fps: () => fps
}
