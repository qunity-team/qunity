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
			file: prod ? 'dist/index.umd.cjs.js' : 'dist/index.cjs.js',
			sourcemap: true,
			format: 'cjs',
		},
		{
			file: prod ? 'dist/index.umd.esm.js' : 'dist/index.esm.js',
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
	]
};

if (prod) {
	options.plugins.push(uglify({}));
}

export default options;
