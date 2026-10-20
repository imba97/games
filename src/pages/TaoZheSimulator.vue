<style lang="scss" scoped>
.tao-zhe-container {
  --at-apply: m-auto md:w-sm;
}

.buttons-container {
  & > div {
    --at-apply: flex items-center gap-2 flex-wrap;
  }

  button {
    --at-apply: py-2 px-4  text-5 b-px b-solid b-black
      rounded-2;
  }
}

.block {
  --at-apply: px-3 py-2;

  animation: run 1.5s linear;
}

@keyframes run {
  0% {
    right: 0%;
  }
  100% {
    right: 100%;
  }
}

.feedback {
  animation: bounce 0.4s;
}

@keyframes bounce {
  0% {
    bottom: 0;
    font-size: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    bottom: 3rem;
    font-size: 2.5rem;
    opacity: 0;
  }
}

.rotate-cd {
  animation: rotate 2s infinite linear;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div class="tao-zhe-container" p-3 pr-0>
    <div mt-10>
      <div text="10 primary">
        <span>{{ t('taoZheSimulator.point') }}</span>
        <span ml-2>{{ point }}</span>
      </div>
    </div>
    <div my-30 class="progress">
      <div w-full h-3 rounded-l-full bg-primary relative flex items-center>
        <div absolute bottom-3 right-0 w="90%" h-1 bg-red>
          <div absolute bottom-0 left-0 w-1 h-8 rounded-t-full bg-blue />
          <div>
            <div
              v-for="item in blocks"
              :key="item.id"
              class="block"
              absolute
              bottom-0
              right="100%"
              w-auto
              font-bold
              text-5
              flex
              items-center
              justify-center
              rounded-2
              :style="audioStyles[item.type]"
            >
              <span text-truncate>{{ item.name }}</span>
            </div>
          </div>
          <div>
            <div
              v-for="item in feedbacks"
              :key="item.id"
              class="feedback"
              absolute
              bottom-12
              left-0
              opacity-0
              text="10 amber"
            >
              {{ item.text }}
            </div>
          </div>
        </div>

        <div absolute bottom-2 left-0 flex animate-flash animate-count-infinite>
          <div
            i-material-symbols-light-keyboard-double-arrow-left-rounded
            h-10
            w-10
          />
        </div>
      </div>
    </div>

    <div class="buttons-container">
      <div>
        <button
          v-for="(getName, type) in AudioName"
          :key="type"
          :style="audioStyles[type as AudioType]"
          @click="play(type as AudioType)"
        >
          {{ getName() }}
        </button>
      </div>

      <div mt-10 flex justify-center>
        <div v-show="loadingAudios" mt-3>
          <div text-8>
            {{
              t('game.loadingWithProgress', {
                progress
              })
            }}
          </div>
        </div>
        <div v-show="!loadingAudios">
          <div v-show="!isStarted" mt-3 gap-2>
            <button
              bg-primary
              text="8! white"
              @click="() => (loadedAudios ? playMusic() : doLoadAudios())"
            >
              {{ loadedAudios ? t('game.start') : t('game.loadAudio') }}
            </button>
          </div>
          <div v-show="isStarted">
            <div
              class="rotate-cd"
              i-icon-park-outline-music-cd
              h-20
              w-20
              bg-primary
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  AudioColor,
  AudioName,
  AudioType,
  FeedbackType,
  PointRange
} from '@/enums/audio'

import { removeWhere, uniqueId } from '@/utils/collection'
import { loadAudios } from '@/utils/import-audios'

interface BlockType {
  id: string
  type: AudioType
  name: string
  time: number
  played: boolean
}

const { t } = useI18n()

/**
 * 显示块提前量
 */
const showBlockTime = 1.3

/**
 * 分数
 */
const point = ref(0)

/**
 * 音频
 */
const audios = ref<Record<AudioType, HTMLAudioElement>>()

/**
 * 音频播放时间线
 */
const timeline: Record<string, number | number[]> = Object.entries({
  [AudioType.O]: 3.58,
  [AudioType.A]: [3.9, 4.3],
  [AudioType.Ai]: 6.15,
  [AudioType.Ei]: 6.55,
  [AudioType.SunNan]: 10.1,
  [AudioType.Chou1]: 12.62,
  [AudioType.Chou2]: 13
}).reduce<Record<string, number | number[]>>((result, [key, item]) => {
  result[key] = Array.isArray(item)
    ? item.map(n => n - showBlockTime)
    : item - showBlockTime

  return result
}, {})

/**
 * 逐帧遍历用的键值对，提前算好避免每帧新建数组
 */
const timelineEntries = Object.entries(timeline)

/**
 * 音乐块
 */
const blocks = ref<BlockType[]>([])
/**
 * 点击反馈
 */
const feedbacks = ref<{ id: string, text: string, time: number }[]>([])

/**
 * 音频资源加载进度条
 */
const progress = ref(0)

const loadingAudios = ref(false)

/**
 * 游戏是否开始
 */
const isStarted = ref(false)

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

const loadedAudios = computed(() => Object.keys(audios.value ?? {}).length > 0)

let music: HTMLAudioElement | null = null

let frameId: number | undefined

/**
 * 停止时间线轮询
 */
function stopLoop() {
  if (frameId === undefined) {
    return
  }

  cancelAnimationFrame(frameId)
  frameId = undefined
}

onMounted(() => {
  // iOS 先让开始按钮显示，具体加载在按钮点击事件里
  if (isIOS) {
    return
  }

  doLoadAudios()
})

// 离开页面时停掉轮询与音乐，避免定时器在组件卸载后继续跑
onUnmounted(() => {
  stopLoop()
  music?.pause()
})

async function doLoadAudios() {
  // 加载中不重复触发
  if (loadingAudios.value) {
    return
  }

  // 加载音频
  loadingAudios.value = true
  audios.value = await loadAudios((_progress) => {
    progress.value = _progress
  }).finally(() => {
    loadingAudios.value = false
  })
}

/**
 * 按钮颜色是静态的，提前算好，避免每次渲染都新建对象
 */
const audioStyles = (Object.keys(AudioColor) as AudioType[]).reduce<
  Record<string, { color: string, backgroundColor: string }>
>((result, type) => {
  result[type] = {
    color: AudioColor[type].text,
    backgroundColor: AudioColor[type].backgrond
  }

  return result
}, {})

/**
 * 播放背景音乐
 */
async function playMusic() {
  reset()

  isStarted.value = true

  if (!music) {
    music = audios.value![AudioType.Music].cloneNode() as HTMLAudioElement
  }

  music.play()

  let once = true

  // 用 onended 覆盖而不是 addEventListener，重复开局不会叠加监听
  music.onended = () => {
    isStarted.value = false
    stopLoop()
  }

  stopLoop()

  const step = () => {
    const currentMusic = music

    if (!currentMusic) {
      stopLoop()
      return
    }

    const currentTime = currentMusic.currentTime

    const aliveBlocks = blocks.value.filter(
      (block: BlockType) =>
        block.time - currentTime > -PointRange[FeedbackType.Good].max
    )

    // 只有真的移除了块才赋值，避免每帧都触发一次无谓的更新
    if (aliveBlocks.length !== blocks.value.length) {
      blocks.value = aliveBlocks
    }

    removeWhere(
      feedbacks.value,
      (feedback: { time: number }) => currentTime - feedback.time > 0.8
    )

    let playKey: AudioType | undefined
    let time = 0

    timelineEntries.forEach(([key, value]) => {
      let latestTime

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const n = value[i]

          if (currentTime - n > 0 && currentTime - n < 0.1) {
            latestTime = n
          }
        }
      }
      else {
        latestTime = value
      }

      if (!latestTime) {
        return
      }

      const lt = latestTime - 0.02
      const gt = latestTime + 0.02

      if (currentTime >= lt && currentTime <= gt) {
        playKey = key as AudioType
        time = latestTime
      }
    })

    if (once && playKey !== undefined) {
      blocks.value.push({
        id: uniqueId('blocks_'),
        type: playKey,
        name: AudioName[playKey](),
        time: time + showBlockTime,
        played: false
      })

      once = false
    }

    if (playKey === undefined) {
      once = true
    }
  }

  // 用 rAF 与渲染同频：比固定 10ms 轮询唤醒次数少，后台标签页还会自动暂停
  const tick = () => {
    step()

    if (frameId === undefined) {
      return
    }

    frameId = requestAnimationFrame(tick)
  }

  frameId = requestAnimationFrame(tick)
}

function play(type: AudioType) {
  const audio = audios.value?.[type]

  // 音频还没加载完（比如 iOS 尚未点「加载音频」）时直接忽略，避免抛错
  if (!audio) {
    return
  }

  ;(audio.cloneNode() as HTMLAudioElement).play()

  const noPlayedBlock = blocks.value.filter(
    (block: BlockType) => !block.played
  )

  if (noPlayedBlock.length === 0) {
    return
  }

  const block = noPlayedBlock[0]

  removeBlock(block.id)

  if (block.type !== type) {
    // 选错
    return
  }

  const currentMusic = music

  if (!currentMusic) {
    return
  }

  // 正确
  const time = currentMusic.currentTime - block.time
  const feedback = feedbackValueOf(time)

  let feedbackText

  switch (feedback) {
    case FeedbackType.Perfect:
      feedbackText = 'Perfect'
      point.value += 200
      break
    case FeedbackType.Good:
      feedbackText = 'Good'
      point.value += 200 * time * 1.5
      break
  }

  if (feedbackText) {
    feedbacks.value.push({
      id: uniqueId('feedback_'),
      text: feedbackText,
      time: currentMusic.currentTime
    })
  }

  point.value = Math.floor(point.value)
}

/**
 * 移除块
 */
function removeBlock(id: string) {
  removeWhere(blocks.value, (block: BlockType) => block.id === id)
}

/**
 * 根据时间匹配按键反馈
 */
function feedbackValueOf(time: number) {
  const feedback = (Object.keys(PointRange) as FeedbackType[]).find((key) => {
    const item = PointRange[key]

    return item.min <= time && item.max >= time
  })

  return feedback
}

/**
 * 重置游戏
 */
function reset() {
  stopLoop()

  if (music) {
    music.currentTime = 0
    music.pause()
  }

  isStarted.value = false
  blocks.value = []
  feedbacks.value = []
  point.value = 0
}
</script>
