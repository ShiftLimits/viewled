import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
import { colorSuitePlugin } from 'tailwindcss-color-suite'
import MagicString from 'magic-string';
import { readFileSync } from 'fs'

let bytes_saved:number = 0

export default defineConfig({
  plugins: [
    vue(),
    colorSuitePlugin(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')]
    }),
  ],
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'postprocess',
          closeBundle() {
            console.log(`Saved ${bytes_saved/1000} kB by compressing class names.`)
          },
          renderChunk(code, chunk, { sourcemap }) {
            let src = new MagicString(code)

            const transforms = readFileSync('./dist/main-classname-transforms.json', 'utf8')
            const replacements = Object.entries<string>(JSON.parse(transforms))

            for (let [key, replace=''] of replacements) {
              let find = new RegExp(`(?<=^|\\s+|"+|'+|\`+)${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s+|$|"+|'+|\`+)`, 'g')

              let token:RegExpExecArray
              while (token = find.exec(code)) {
                bytes_saved += key.length - replace.length
                src.overwrite(token.index, token.index + token[0].length, replace)
              }
            }

            return {
              code: src.toString(),
              map: sourcemap === false ? null : src.generateMap({ hires: true })
            }
          }
        }
      ]
    }
  },
  envPrefix: 'WLED'
})
