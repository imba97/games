<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 860px;
  min-height: calc(100vh - 64px);
  margin: 0 auto;
  padding: 48px 20px 64px;
}

.game-list {
  display: grid;
  /* 说明折行时两张卡仍然等高 */
  grid-auto-rows: 1fr;
  gap: 18px;
}

.game-card {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  width: 100%;
  height: 100%;
  padding: 20px 22px;
  color: var(--ink);
  text-align: left;
  background: var(--paper);
  border-radius: 22px;
  box-shadow: var(--drop);
  transition: transform 0.16s ease, box-shadow 0.16s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 9px 9px 0 rgba(10, 6, 20, 0.55);
  }

  &:active {
    transform: translate(3px, 3px);
    box-shadow: 2px 2px 0 rgba(10, 6, 20, 0.55);
  }
}

.game-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 58px;
  height: 58px;
  /* 让图标顶边与标题字面顶对齐 */
  margin-top: 3px;
  color: var(--ink);
  border-radius: 18px;
}

.icon {
  width: 30px;
  height: 30px;
}

.game-text {
  min-width: 0;

  h2 {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  p {
    display: -webkit-box;
    /* 固定预留两行，保证每张卡高度一致 */
    min-height: calc(2 * 1.55em);
    margin-top: 6px;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.55;
    color: rgba(31, 22, 51, 0.6);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}

.game-play {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-left: auto;
  align-self: center;
  color: var(--ink);
  background: var(--marigold);
  border-radius: 999px;
  transition: transform 0.16s ease;
}

.game-card:hover .game-play {
  transform: translateX(3px);
}

.play-icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 520px) {
  .home {
    padding: 32px 16px 56px;
  }

  .game-card {
    gap: 14px;
    padding: 16px;
  }

  .game-icon {
    width: 48px;
    height: 48px;
    border-radius: 15px;
  }

  .icon {
    width: 26px;
    height: 26px;
  }

  .game-play {
    width: 38px;
    height: 38px;
  }
}
</style>

<template>
  <div class="home">
    <div class="game-list">
      <button
        v-for="item in gameList"
        :key="item.path"
        class="game-card"
        type="button"
        @click="() => router.push(item.path)"
      >
        <div class="game-icon" :style="{ background: item.color }">
          <div :class="item.icon" class="icon" />
        </div>

        <div class="game-text">
          <h2>{{ item.name() }}</h2>
          <p>{{ item.desc() }}</p>
        </div>

        <span class="game-play" aria-hidden="true">
          <div i-ph-play-fill class="play-icon" />
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const router = useRouter()

const gameList = ref([
  {
    name: () => t('pages.memoryGame'),
    desc: () => t('pages.memoryGameDesc'),
    icon: 'i-ph-images-light',
    color: 'var(--lilac)',
    path: '/memory-game'
  },
  {
    name: () => t('pages.taoZheSimulator'),
    desc: () => t('pages.taoZheSimulatorDesc'),
    icon: 'i-ph-music-notes-light',
    color: 'var(--flame)',
    path: '/tao-zhe-simulator'
  }
])
</script>
