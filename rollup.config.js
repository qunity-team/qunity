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
			file: prod ? `dist/${name}.esm.min.js` : `dist/${name}.esm.js`,
			sourcemap: !prod,
			format: 'esm',
		},
		{
			file: prod ? `dist/${name}.umd.min.js` : `dist/${name}.umd.js`,
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
