/**
 * Created by rockyl on 2018/11/16.
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const {terser} = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript');

const name = 'qunity';

const prod = process.env.BUILD === 'production';

const options = {
	input: 'src/index.ts',
	output: [
		{
			file: prod ? 'dist/index.cjs.min.js' : 'dist/index.cjs.js',
			sourcemap: true,
			format: 'cjs',
		},
		{
			file: prod ? 'dist/index.esm.min.js' : 'dist/index.esm.js',
			sourcemap: true,
			format: 'esm',
		},
		{
			file: prod ? 'dist/index.umd.min.js' : 'dist/index.umd.js',
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
		prod && terser(),
	]
};

export default options;
