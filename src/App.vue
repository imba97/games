<style lang="scss" scoped>
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 64px;
  padding: 0 20px;
  background: rgba(34, 22, 54, 0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 248, 236, 0.12);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--paper);
  text-decoration: none;
  white-space: nowrap;
}

.wordmark-sub {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 248, 236, 0.5);
}

.version {
  padding: 3px 7px;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.2;
  color: var(--ink);
  background: var(--marigold);
  border-radius: 6px;
  transform: translateY(-1px);
}

.tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  color: var(--paper);
  background: rgba(255, 248, 236, 0.06);
  border: 1px solid rgba(255, 248, 236, 0.16);
  border-radius: 12px;
  transition: background 0.16s ease, border-color 0.16s ease, transform 0.16s ease;

  &:hover {
    background: rgba(255, 248, 236, 0.12);
    border-color: rgba(255, 248, 236, 0.32);
  }

  &:active {
    transform: translateY(1px);
  }
}

.icon {
  width: 22px;
  height: 22px;
}

.mask {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.lang-panel {
  position: fixed;
  top: 72px;
  right: 20px;
  z-index: 41;
  display: grid;
  gap: 4px;
  width: 200px;
  padding: 8px;
  color: var(--ink);
  background: var(--paper);
  border-radius: 16px;
  box-shadow: var(--drop);

  &.animate-bounce-in {
    animation: panel-in 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.25) both;
  }

  &.animate-bounce-out {
    animation: panel-out 0.18s ease-in both;
  }
}

.lang-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  font-size: 15px;
  color: var(--ink);
  text-align: left;
  border-radius: 10px;
  transition: background 0.14s ease;

  &:hover {
    background: rgba(31, 22, 51, 0.06);
  }

  &.active {
    font-weight: 700;
  }
}

.lang-check {
  width: 18px;
  height: 18px;
  color: var(--flame);
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes panel-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.96);
  }
}

.page {
  flex: 1;
}
</style>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <button
          v-show="route.path !== '/'"
          class="icon-btn"
          type="button"
          aria-label="返回"
          @click="() => router.back()"
        >
          <div i-material-symbols-arrow-back-rounded class="icon" />
        </button>

        <router-link to="/" class="wordmark">
          imba97
          <span class="wordmark-sub">games</span>
        </router-link>

        <span class="version">v{{ version }}</span>
      </div>

      <div class="tools">
        <button class="icon-btn" type="button" aria-label="切换语言" @click="changeLanguage">
          <div i-ph-globe-light class="icon" />
        </button>
        <button class="icon-btn" type="button" aria-label="GitHub 仓库" @click="openGithub">
          <div i-mdi-github class="icon" />
        </button>
      </div>
    </header>

    <div v-if="showLanguage" class="mask" @click="closeLanguagePanel" />

    <div v-if="showLanguage" class="lang-panel" :class="languagePanelAnimation">
      <button
        v-for="lang in languages"
        :key="lang.value"
        class="lang-item"
        :class="{ active: lang.value === locale }"
        type="button"
        @click="setLanguage(lang.value)"
      >
        <span>{{ lang.label }}</span>
        <div
          v-if="lang.value === locale"
          i-material-symbols-check-circle-rounded
          class="lang-check"
        />
      </button>
    </div>

    <main class="page">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { version } from '../package.json'

const { locale } = useI18n()

const route = useRoute()
const router = useRouter()

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

function openLanguagePanel() {
  showLanguage.value = true
  languagePanelAnimation.value = 'animate-bounce-in'
}

function closeLanguagePanel() {
  languagePanelAnimation.value = 'animate-bounce-out'
  setTimeout(() => {
    showLanguage.value = false
  }, 500)
}

function changeLanguage() {
  if (!showLanguage.value) {
    openLanguagePanel()
  }
  else {
    closeLanguagePanel()
  }
}

function setLanguage(value: string) {
  locale.value = value
  closeLanguagePanel()
}

function openGithub() {
  window.open('https://github.com/imba97/games')
}
</script>
