import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const banner = `\
/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 *
 * @author ${pkg.author}
 * @license ${pkg.license}
 * @preserve
 */
`;

export default [{
  external: ['@turf/turf'],
  input: pkg.module,
  output: [{
    banner: banner,
    compact: true,
    file: pkg.main,
    format: 'umd',
    name: pkg.name,
    sourcemap: true,
  }, {
    banner: banner,
    compact: true,
    file: pkg.main.replace('umd', 'esm'),
    format: 'esm',
    name: pkg.name,
    sourcemap: true,
  }],
  plugins: [
    commonjs(),
    resolve(),
    terser(),
  ],
}];

