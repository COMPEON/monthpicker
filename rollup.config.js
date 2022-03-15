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
      globals: {
        react: "React",
        "prop-types": "PropTypes",
        "styled-components": "styled",
        "date-fns" :"dateFns"
      }
    },
    {
      file: 'dist/monthpicker.es.js',
      name: 'monthpicker',
      format: 'es',
      globals: {
        react: "React",
        "prop-types": "PropTypes",
        "styled-components": "styled",
        "date-fns" :"dateFns"
      }
    }
  ],
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-proposal-class-properties'],
      presets: [['@babel/env', { modules: false }], '@babel/react']
    })
  ],
  external
}
