import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives
} from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      // 信号橙：主按钮与强调
      primary: '#ff5a3c',
      // 深紫底、纸色面、墨色描边
      plum: '#221636',
      paper: '#fff8ec',
      ink: '#1f1633',
      lilac: '#a78bfa',
      mint: '#4fc98a',
      marigold: '#f7b32b'
    }
  }
})
