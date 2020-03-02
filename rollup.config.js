import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import {version, homepage} from './package.json';

const name = '@kurkle/animator';
const input = 'src/index.js';
const banner = `/*!
 * ${name} v${version}
 * ${homepage}
 * (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()} Jukka Kurkela
 * Released under the MIT License
 */`;

export default [
	{
		input,
		plugins: [resolve()],
		output: {
			name,
			file: 'dist/index.js',
			banner,
			format: 'umd',
			indent: false
		}
	},
	{
		input,
		plugins: [
			resolve(),
			terser({
				output: {
					preamble: banner
				}
			}),
			visualizer({
				sourcemap: true,
				title: name,
				template: 'treemap',
				filename: 'docs/stats.html'
			})
		],
		output: {
			name,
			file: 'dist/index.min.js',
			format: 'umd',
			sourcemap: true,
			indent: false
		}
	},
];
