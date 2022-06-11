const { writeFileSync } = require('fs')
const { basename, resolve } = require("path")
const cssClassGenerator = require("css-class-generator")

const transformed_names = new Map()
let index = 0

function generateClassName(name) {
  if (transformed_names.has(name)) return transformed_names.get(name)
  else {
    let transformed_name = cssClassGenerator(index++)
    transformed_names.set(name, transformed_name)
    return transformed_name
  }
}

const plugins = {
  'tailwindcss': {},
  'autoprefixer': {},
  'cssnano': {},
}

if (process.env.NODE_ENV == 'production') {
  plugins['postcss-modules'] = {
    getJSON(css_file_name, json) {
      const css_basename = basename(css_file_name, ".css")
      writeFileSync(resolve(`./dist/${css_basename}-classname-transforms.json`), JSON.stringify(json))
    },
    generateScopedName(name, filename, css) {
      return generateClassName(name)
    }
  }
}

module.exports = { plugins }
