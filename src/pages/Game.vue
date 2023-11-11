<style lang="scss" scoped>
.options-container {
  --at-apply: flex flex-wrap items-center justify-center gap-5;

  & > div {
    --at-apply: h-24 w-40 flex items-center justify-center text-white rounded-4
      shadow-lg;
  }
}

img {
  --at-apply: rounded-2;
}
</style>

<template>
  <div h-screen w-screen flex items-center justify-center>
    <div w-full xl:w-300 h-full xl:h-180 xl:rounded-6 flex="~ col" items-center>
      <!-- 倒计时 -->
      <div mt-10 text-6>{{ t('game.countDown') }}：{{ countDown }}s</div>
      <div m-10 text="center 10">
        <div h-36 w-64>
          <img
            v-if="currentImage !== ''"
            h-full
            w-full
            object-cover
            :src="currentImage"
          />
          <div
            v-else
            h-full
            w-full
            b="3 gray dashed"
            rounded-4
            flex
            items-center
            justify-center
          >
            <span text="10 gray">{{ t('game.noImage') }}</span>
          </div>
        </div>
      </div>
      <div v-if="isStarted" class="options-container">
        <div v-for="url in currentOptionsList" :key="url" @click="next(url)">
          <img w-full h-full object-cover :src="url" />
        </div>
      </div>
      <div v-else text-center>
        <div>{{ t('game.startTips') }}</div>
        <button
          mt-5
          w-32
          h-18
          rounded-2
          bg-primary
          text="6 white"
          shadow-lg
          @click="start"
        >
          开始
        </button>
      </div>
    </div>

    <div
      v-if="dialog.visible"
      fixed
      top-0
      left-0
      w-full
      h-full
      flex
      justify-center
      items-center
      z-1000
      class="bg-[rgba(0,0,0,0.5)]"
    >
      <Dialog :content="dialog.content" @reset="onDialogReset"></Dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Dialog from '@/components/Dialog.vue'

import { importImages } from '@/utils/import-images'

const { t } = useI18n()

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
 * 初始选项，重置时用
 */
const originalOptionsList = _.map(importImages())

/**
 * 全部选项
 */
const allOptionsList = ref<string[]>(_.clone(originalOptionsList))

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

const start = () => {
  startTimer()
  next()
  isStarted.value = true
}

const startTimer = () => {
  timer.id = window.setInterval(() => {
    timer.time += 10
  }, 10)
}

const stopTimer = () => {
  window.clearInterval(timer.id)
}

const next = (clickedItem?: string) => {
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
  currentOptionsList.value = _.shuffle(newCurrentOptionsList)

  // 重新选取一个
  currentImage.value = pullOne()
}

const generateObstacle = () => {
  const list = _.clone(checkedOptionsList.value)

  // 不足 5 个则全部放到可选项中
  if (list.length <= 5) {
    return list
  }

  const newList = []

  // 大于 5 个则随机选 5 个
  for (let i = 0; i < 5; i++) {
    const random = _.random(0, list.length - 1)
    const [item] = _.pullAt(list, random)
    newList.push(item)
  }

  return newList
}

/**
 * 随机取出一个值
 */
const pullOne = () => {
  if (allOptionsList.value.length === 0) {
    return ''
  }

  const random = _.random(0, allOptionsList.value.length - 1)
  const [item] = _.pullAt(allOptionsList.value, random)
  return item
}

const win = () => {
  stopTimer()
  dialog.visible = true
  dialog.content = t('game.win', {
    countDown: countDown.value
  })
}

const gameOver = () => {
  stopTimer()
  dialog.visible = true
  dialog.content = t('game.over', {
    score: score.value
  })
}

const reset = () => {
  isStarted.value = false
  currentImage.value = ''
  needToFindImage.value = ''
  currentOptionsList.value = []
  checkedOptionsList.value = []
  allOptionsList.value = _.clone(originalOptionsList)

  score.value = 0

  timer.time = 0
  if (timer.id !== -1) {
    window.clearInterval(timer.id)
  }

  // 游戏开始，首先取出一个作为二选一之一
  const first = pullOne()
  currentOptionsList.value.push(first)
  checkedOptionsList.value.push(first)

  // 再取出一个作为当前选项
  currentImage.value = pullOne()
}

const onDialogReset = () => {
  reset()
  dialog.visible = false
}
</script>
