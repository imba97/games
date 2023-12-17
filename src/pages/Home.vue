<style lang="scss" scoped>
.game-list {
  --at-apply: p-4 flex flex-col gap-3;

  & > div {
    --at-apply: p-2 bg-primary text-white text-5 rounded-2;
  }
}
</style>

<template>
  <div class="game-list">
    <div
      v-for="item in gameList"
      :key="item.path"
      @click="() => router.push(item.path)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const router = useRouter()

const gameList = ref([
  {
    name: t('pages.memoryGame'),
    path: '/MemoryGame'
  },
  {
    name: t('pages.taoZheSimulator'),
    path: '/TaoZheSimulator'
  }
])
</script>
