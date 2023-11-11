import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives
} from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      primary: '#8dc149'
    }
  }
})
