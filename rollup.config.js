import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const externals = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  'prop-types'
]

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/monthpicker.umd.js',
      name: 'monthpicker',
      globals: ['react', 'styled-components'],
      format: 'umd'
    },
    {
      file: 'dist/monthpicker.es.js',
      name: 'monthpicker',
      globals: ['react', 'styled-components'],
      format: 'es'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    commonjs({ exclude: 'src/**' }),
    resolve(),
  ],
  external: externals
}
