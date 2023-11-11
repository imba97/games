<style lang="scss" scoped></style>

<template>
  <div>
    <div px-4 h-10 flex items-center justify-between>
      <div>Memory Games v{{ version }}</div>
      <div @click="changeLanguage">
        <div i-ph-globe-light h-8 w-8 bg-primary></div>
      </div>
      <div
        v-if="showLanguage"
        p-2
        fixed
        top-10
        right-4
        bg-white
        rounded-2
        flex="~ col"
        gap-1
        :class="languagePanelAnimation"
      >
        <div
          v-for="lang in languages"
          :key="lang.value"
          flex
          items-center
          gap-1
          @click="setLanguage(lang.value)"
        >
          <div
            i-material-symbols-check-circle-rounded
            h-6
            w-6
            :class="lang.value === locale ? 'text-primary' : 'text-gray-3'"
          ></div>
          <div text-6>{{ lang.label }}</div>
        </div>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { version } from '../package.json'

const { locale } = useI18n()

const showLanguage = ref(false)
const languagePanelAnimation = ref('animate-bounce-in')

const languages = [
  {
    value: 'zh-CN',
    label: '简体中文'
  },
  {
    value: 'ja-JP',
    label: '日本語'
  }
]

const openLanguagePanel = () => {
  showLanguage.value = true
  languagePanelAnimation.value = 'animate-bounce-in'
}

const closeLanguagePanel = () => {
  languagePanelAnimation.value = 'animate-bounce-out'
  setTimeout(() => {
    showLanguage.value = false
  }, 500)
}

const changeLanguage = () => {
  if (!showLanguage.value) {
    openLanguagePanel()
  } else {
    closeLanguagePanel()
  }
}

const setLanguage = (value: string) => {
  locale.value = value
  closeLanguagePanel()
}
</script>
