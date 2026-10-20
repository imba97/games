import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      // 由 unplugin-auto-import 在构建时生成
      'auto-import/**',
      // 构建产物
      'dist/**'
    ],

    rules: {
      'style/comma-dangle': ['warn', 'never']
    },

    vue: {
      overrides: {
        'vue/block-order': ['error', {
          order: ['style', 'template', 'script']
        }],
        'vue/comma-dangle': ['warn', 'never']
      }
    },

    jsonc: {
      overrides: {
        'jsonc/comma-dangle': ['warn', 'never']
      }
    }
  }
)
