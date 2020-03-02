/**
 * Easing functions adapted from Robert Penner's easing equations.
 * @see http://www.robertpenner.com/easing/
 */

const PI = Math.PI;
const TAU = 2 * PI;
const S = 1.70158

const cos = Math.cos;
const pow = Math.pow;
const sin = Math.sin;
const sqrt = Math.sqrt;

const inOut = (t, f1, f2) => ((t *= 2) < 1) ? 0.5 * f1(t) : 0.5 + f2(t - 1) * 0.5;

export const linear = (t) => t;

export const easeInQuad = (t) => t * t;
export const easeOutQuad = (t) => -t * (t - 2);
export const easeInOutQuad = (t) => inOut(t, easeInQuad, easeOutQuad);

export const easeInCubic = (t) => t * t * t;
export const easeOutCubic = (t) => (t -= 1) * t * t + 1;
export const easeInOutCubic = (t) => inOut(t, easeInCubic, easeOutCubic);

export const easeInQuart = (t) => t * t * t * t;
export const easeOutQuart = (t) => -((t -= 1) * t * t * t - 1);
export const easeInOutQuart = (t) => inOut(t, easeInQuart, easeOutQuart);

export const easeInQuint = (t) => t * t * t * t * t;
export const easeOutQuint = (t) => (t -= 1) * t * t * t * t + 1;
export const easeInOutQuint = (t) => inOut(t, easeInQuint, easeOutQuint);

export const easeInSine = (t) => -cos(t * (PI / 2)) + 1;
export const easeOutSine = (t) => sin(t * (PI / 2));
export const easeInOutSine = (t) => -0.5 * (cos(PI * t) - 1);

export const easeInExpo = (t) => (t === 0) ? 0 : pow(2, 10 * (t - 1));
export const easeOutExpo = (t) => (t === 1) ? 1 : -pow(2, -10 * t) + 1;

export const easeInCirc = (t) => (t >= 1) ? t : -(sqrt(1 - t * t) - 1);
export const easeOutCirc = (t) => sqrt(1 - (t -= 1) * t);
export const easeInOutCirc = (t) => inOut(t, easeInCirc, easeOutCirc);

export const easeInElastic = (t) => t === 0 ? 0 : t === 1 ? 1 : -(pow(2, 10 * (t -= 1)) * sin(t - 0.15) * TAU / 0.3);
export const easeOutElastic = (t) => t === 0 ? 0 : t === 1 ? 1 : -(pow(2, 10 * (t -= 1)) * sin((t - 0.15) * TAU / 0.3)) + 1;
export const easeInOutElastic = (t) => inOut(t, easeInElastic, easeOutElastic);

export const easeInBack = (t) => t * t * ((S + 1) * t - S);
export const easeOutBack = (t) => (t -= 1) * t * ((S + 1) * t + S) + 1;
export const easeInOutBack = (t) => inOut(t, easeInBack, easeOutBack);

export const easeOutBounce = (t) => (t < (1 / 2.75)) ? 7.5625 * t * t : (t < (2 / 2.75)) ? 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75
		: (t < (2.5 / 2.75)) ? 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375 : 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;

export const easeInBounce = (t) => 1 - easeOutBounce(1 - t);
export const easeInOutBounce = (t) => inOut(t, easeInBounce, easeOutBounce);
