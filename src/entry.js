export default class Entry {
	constructor(draw, config) {
		this.anims = [];
		this.config = config;
		this.duration = 0;
		this.draw = draw;
		this.listeners = {
			progress: [],
			complete: []
		};
		this.running = false;
		this._start = 0;
	}

	start() {
		this.running = true;
		this._start = Date.now();
		this.duration = this.anims.reduce((acc, cur) => Math.max(acc, cur.duration), 0);
	}

	stop() {
		const anims = this.anims;
		if (anims.length) {
			let i = anims.length - 1;

			for (; i >= 0; --i) {
				anims[i].cancel();
			}

			this.anims = [];
			this.notify(Date.now(), 'complete');
		}
	}

	run(ts) {
		const me = this;
		if (!me.running) {
			return;
		}
		const anims = me.anims;
		let draw = false;

		for (let i = anims.length - 1; i >= 0; --i) {
			const item = anims[i];

			if (item.active) {
				item.tick(ts);
				draw = true;
			} else {
				anims[i] = anims[anims.length - 1];
				anims.pop();
			}
		}

		if (draw) {
			me.draw();
		}

		me.notify(ts, 'progress');

		if (!anims.length) {
			me.running = false;
			me.notify(ts, 'complete');
		}
		return anims.length;
	}

	notify(date, type) {
		const callbacks = this.listeners[type];
		const numSteps = this.duration;

		for (const fn of callbacks) {
			fn({numSteps, currentStep: date - this._start});
		}
	}
}
