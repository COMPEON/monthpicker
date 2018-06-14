import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const external = [
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
      format: 'umd',
    },
    {
      file: 'dist/monthpicker.es.js',
      name: 'monthpicker',
      format: 'es',
    }
  ],
  plugins: [
    commonjs({ include: 'node_modules/date-fns' }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: ['transform-class-properties', 'external-helpers'],
      presets: [['env', { modules: false }], 'react']
    })
  ],
  external
}
