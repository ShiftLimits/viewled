import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSvgIcons from 'vite-plugin-svg-icons'
import { resolve } from 'path'
import { colorSuitePlugin } from 'tailwindcss-color-suite'

export default defineConfig({
  plugins: [
    vue(),
    colorSuitePlugin(),
    viteSvgIcons({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')]
    })
  ],
  envPrefix: 'WLED'
})
