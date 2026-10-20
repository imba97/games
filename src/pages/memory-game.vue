<style lang="scss" scoped>
.memory {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 26px;
  min-height: calc(100vh - 64px);
  padding: 32px 20px 56px;
}

.hud {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 7px 16px;
  background: rgba(255, 248, 236, 0.07);
  border: 1px solid rgba(255, 248, 236, 0.16);
  border-radius: 999px;
}

.hud-label {
  font-size: 13px;
  color: rgba(255, 248, 236, 0.62);
}

.hud-value {
  font-family: var(--font-mono);
  font-size: 22px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.hud-unit {
  margin-left: 2px;
  font-size: 13px;
  color: rgba(255, 248, 236, 0.55);
}

.target {
  width: min(340px, 76vw);
  aspect-ratio: 4 / 3;
  padding: 10px;
  background: var(--paper);
  border-radius: 20px;
  box-shadow: var(--drop);
  transform: rotate(-2deg);
}

.target-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.target-empty {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 15px;
  color: rgba(31, 22, 51, 0.38);
  border: 2px dashed rgba(31, 22, 51, 0.22);
  border-radius: 12px;
}

.options-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  width: 100%;
  max-width: 920px;
}

.option {
  width: clamp(100px, 22vw, 160px);
  aspect-ratio: 4 / 3;
  padding: 6px;
  background: var(--paper);
  border-radius: 16px;
  box-shadow: var(--drop);
  transition: transform 0.14s ease, box-shadow 0.14s ease;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  &:hover {
    transform: translate(-2px, -3px) rotate(-1deg);
    box-shadow: 8px 9px 0 rgba(10, 6, 20, 0.55);
  }

  &:active {
    transform: translate(2px, 3px);
    box-shadow: 2px 2px 0 rgba(10, 6, 20, 0.55);
  }
}

.ready {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.ready-tip {
  font-size: 15px;
  color: rgba(255, 248, 236, 0.66);
}

.btn-primary {
  padding: 14px 44px;
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  background: var(--flame);
  border-radius: 16px;
  box-shadow: var(--drop), inset 0 1px 0 rgba(255, 255, 255, 0.28);
  transition: transform 0.14s ease, box-shadow 0.14s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 rgba(10, 6, 20, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.28);
  }

  &:active {
    transform: translate(3px, 3px);
    box-shadow: 2px 2px 0 rgba(10, 6, 20, 0.55);
  }
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: min(320px, 70vw);
}

.loading-value {
  font-family: var(--font-mono);
  font-size: 32px;
  font-variant-numeric: tabular-nums;
  line-height: 1;

  span {
    margin-left: 2px;
    font-size: 16px;
    color: rgba(255, 248, 236, 0.55);
  }
}

.loading-track {
  width: 100%;
  height: 8px;
  overflow: hidden;
  background: rgba(255, 248, 236, 0.12);
  border-radius: 999px;
}

.loading-fill {
  height: 100%;
  background: var(--flame);
  border-radius: 999px;
  transition: width 0.2s ease;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(18, 10, 32, 0.72);
  backdrop-filter: blur(6px);
}

@media (max-width: 560px) {
  .memory {
    gap: 20px;
    padding: 24px 16px 44px;
  }

  .options-container {
    gap: 10px;
  }
}
</style>

<template>
  <div class="memory">
    <div class="hud">
      <span class="hud-label">{{ t('memoryGame.countDown') }}</span>
      <span class="hud-value">{{ countDown }}<span class="hud-unit">s</span></span>
    </div>

    <figure class="target">
      <img
        v-if="currentImage !== ''"
        class="target-image"
        :src="currentImage"
        alt=""
      >
      <div v-else class="target-empty">
        {{ t('memoryGame.noImage') }}
      </div>
    </figure>

    <div v-if="isStarted" class="options-container">
      <button
        v-for="url in currentOptionsList"
        :key="url"
        class="option"
        type="button"
        @click="next(url)"
      >
        <img :src="url" alt="">
      </button>
    </div>

    <div v-else class="ready">
      <template v-if="ready">
        <p class="ready-tip">
          {{ t('memoryGame.startTips') }}
        </p>
        <button class="btn-primary" type="button" @click="start">
          {{ t('game.start') }}
        </button>
      </template>

      <div v-else class="loading">
        <div class="loading-value">
          {{ Math.round(progress) }}<span>%</span>
        </div>
        <div class="loading-track">
          <div class="loading-fill" :style="{ width: `${progress}%` }" />
        </div>
      </div>
    </div>

    <div v-if="dialog.visible" class="overlay">
      <Dialog :content="dialog.content" @reset="onDialogReset" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Dialog from '@/components/Dialog.vue'

import { randomInt, shuffle } from '@/utils/collection'
import { pickImages, preloadImages } from '@/utils/import-images'

const { t } = useI18n()

/**
 * 每局使用的图片数量
 */
const IMAGE_COUNT = 10

/**
 * 开局前先加载的张数，剩下的在开局后静默加载
 */
const PRELOAD_COUNT = 6

const progress = ref(0)

/**
 * 开局所需的图片是否已就绪
 */
const ready = ref(false)

/**
 * 开局后再静默加载的图片
 */
const pendingImages = ref<string[]>([])

const timer = reactive({
  id: -1,
  time: 0
})

const score = ref(0)

const isStarted = ref(false)

/**
 * 当前图片
 */
const currentImage = ref<string>('')

/**
 * 需要找到的图
 */
const needToFindImage = ref<string>('')

/**
 * 全部选项
 */
const allOptionsList = ref<string[]>([])

/**
 * 当前选项图
 */
const currentOptionsList = ref<string[]>([])

/**
 * 已选择过的图
 */
const checkedOptionsList = ref<string[]>([])

const countDown = computed(() => {
  return (timer.time / 1000).toFixed(2)
})

const dialog = reactive({
  visible: false,
  content: ''
})

onMounted(() => {
  reset()
})

// 离开页面时停掉计时器，否则组件卸载后定时器仍在跑
onUnmounted(() => {
  stopTimer()
})

async function initImages() {
  progress.value = 0
  ready.value = false

  const picked = pickImages(IMAGE_COUNT)

  allOptionsList.value = [...picked]
  pendingImages.value = picked.slice(PRELOAD_COUNT)

  // 只等开局要用的那批，进度按这批算
  await preloadImages(picked.slice(0, PRELOAD_COUNT), (p) => {
    progress.value = p
  })

  ready.value = true
}

function start() {
  startTimer()
  next()
  isStarted.value = true

  // 开局后静默补齐剩余图片，不展示进度
  preloadImages(pendingImages.value)
}

function startTimer() {
  // 重复开局时先清掉上一轮，避免计时器叠加
  stopTimer()

  timer.id = window.setInterval(() => {
    timer.time += 10
  }, 10)
}

function stopTimer() {
  if (timer.id === -1) {
    return
  }

  window.clearInterval(timer.id)
  timer.id = -1
}

function next(clickedItem?: string) {
  // 将上个需要找的图片放到已选选项中
  if (isStarted.value) {
    // 游戏结束
    if (clickedItem !== needToFindImage.value) {
      gameOver()
      return
    }

    ++score.value

    checkedOptionsList.value.push(needToFindImage.value)
  }

  // 游戏胜利
  if (currentImage.value === '') {
    win()
    return
  }

  // 设置新的需要找到的图
  needToFindImage.value = currentImage.value

  // 在已经选择过的图中随机选最多 5 张作为障碍项
  const newCurrentOptionsList = generateObstacle()

  // 把要选的也掺进去
  newCurrentOptionsList.push(needToFindImage.value)

  // 打乱顺序
  currentOptionsList.value = shuffle(newCurrentOptionsList)

  // 重新选取一个
  currentImage.value = pullOne()
}

function generateObstacle() {
  const list = [...checkedOptionsList.value]

  // 不足 5 个则全部放到可选项中
  if (list.length <= 5) {
    return list
  }

  const newList = []

  // 大于 5 个则随机选 5 个
  for (let i = 0; i < 5; i++) {
    const random = randomInt(0, list.length - 1)
    const [item] = list.splice(random, 1)
    newList.push(item)
  }

  return newList
}

/**
 * 按预加载好的顺序取出下一张
 */
function pullOne() {
  return allOptionsList.value.shift() ?? ''
}

function win() {
  stopTimer()
  dialog.visible = true
  dialog.content = t('memoryGame.win', {
    countDown: countDown.value
  })
}

function gameOver() {
  stopTimer()
  dialog.visible = true
  dialog.content = t('memoryGame.over', {
    score: score.value
  })
}

async function reset() {
  isStarted.value = false
  currentImage.value = ''
  needToFindImage.value = ''
  currentOptionsList.value = []
  checkedOptionsList.value = []

  await initImages()

  score.value = 0
  timer.time = 0
  stopTimer()

  // 游戏开始时先取一张图放进已选选项，作为后续的障碍项候选
  const first = pullOne()
  checkedOptionsList.value.push(first)

  // 再取出一个作为当前选项
  currentImage.value = pullOne()
}

function onDialogReset() {
  reset()
  dialog.visible = false
}
</script>
