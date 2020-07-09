/**
 * Created by rockyl on 2018/11/16.
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
const {uglify} = require('rollup-plugin-uglify');
const typescript = require('rollup-plugin-typescript');

const name = 'qunity';

const prod = process.env.BUILD === 'production';

const options = {
	input: 'src/index.ts',
	output: [
		{
			file: prod ? 'dist/bundle.umd.cjs.js' : 'dist/bundle.cjs.js',
			sourcemap: true,
			format: 'cjs',
		},
		{
			file: prod ? 'dist/bundle.umd.esm.js' : 'dist/bundle.esm.js',
			sourcemap: true,
			format: 'esm',
		},
		{
			file: prod ? 'dist/bundle.umd.min.js' : 'dist/bundle.umd.js',
			sourcemap: !prod,
			format: 'umd',
			name,
		}
	],
	plugins: [
		resolve({
			browser: true,
		}),
		typescript({
			typescript: require('typescript'),
		}),
		commonjs(),
	]
};

if (prod) {
	options.plugins.push(uglify({}));
}

export default options;
