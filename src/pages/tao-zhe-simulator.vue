<style lang="scss" scoped>
.tao {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  width: 100%;
  max-width: 620px;
  min-height: calc(100vh - 64px);
  margin: 0 auto;
  padding: 36px 20px 56px;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.score-label {
  font-size: 12px;
  letter-spacing: 0.06em;
  color: rgba(255, 248, 236, 0.6);
}

.score-value {
  font-family: var(--font-mono);
  font-size: clamp(36px, 9vw, 52px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.runway {
  position: relative;
  width: 100%;
  padding: 24px 0 44px;
}

.runway-lane {
  position: relative;
  height: 64px;
}

/* 节拍轨道 */
.runway-lane::before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 3px;
  left: 10%;
  z-index: 0;
  height: 38px;
  background: linear-gradient(180deg, rgba(255, 248, 236, 0.06), transparent);
  border-radius: 10px 10px 0 0;
}

.runway-line {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 10%;
  z-index: 3;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(255, 248, 236, 0.5),
    rgba(255, 248, 236, 0.08)
  );
  border-radius: 999px;
}

.runway-hit {
  position: absolute;
  bottom: -13px;
  left: 10%;
  z-index: 4;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  color: var(--ink);
  background: var(--paper);
  border-radius: 999px;
  box-shadow: 0 0 0 3px var(--flame);
  transform: translateX(-50%);
}

.hit-icon {
  width: 18px;
  height: 18px;
}

.runway-blocks {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 10%;
  height: 100%;
}

.block {
  position: absolute;
  right: 100%;
  bottom: 12px;
  z-index: 2;
  padding: 8px 14px;
  font-size: 18px;
  font-weight: 800;
  white-space: nowrap;
  border-radius: 12px;
  box-shadow: 0 3px 0 rgba(10, 6, 20, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation: run 1.5s linear;
}

.runway-feedback {
  position: absolute;
  bottom: 46px;
  left: 10%;
}

.feedback {
  position: absolute;
  bottom: 0;
  left: 0;
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 700;
  color: var(--marigold);
  white-space: nowrap;
  animation: bounce 0.4s ease-out both;
}

.buttons-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(68px, 1fr));
  gap: 10px;
  width: 100%;
}

.pad {
  padding: 14px 8px;
  font-size: 17px;
  font-weight: 700;
  border-radius: 16px;
  box-shadow: 0 4px 0 rgba(10, 6, 20, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    box-shadow: 0 6px 0 rgba(10, 6, 20, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 1px 0 rgba(10, 6, 20, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transform: translateY(3px);
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.loading {
  font-family: var(--font-mono);
  font-size: 14px;
  color: rgba(255, 248, 236, 0.6);
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
    box-shadow: 2px 2px 0 rgba(10, 6, 20, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.28);
  }
}

.disc {
  width: 60px;
  height: 60px;
  background:
    radial-gradient(circle, var(--flame) 0 15%, var(--paper) 15% 19%, #4a3572 19% 100%),
    repeating-radial-gradient(
      circle,
      transparent 0 5px,
      rgba(255, 248, 236, 0.07) 5px 6px
    );
  border-radius: 999px;
  box-shadow: 0 0 0 2px rgba(255, 248, 236, 0.16), 0 8px 18px rgba(10, 6, 20, 0.5);
  animation: rotate 2.4s infinite linear;
}

@keyframes run {
  0% {
    right: 0%;
  }

  100% {
    right: 100%;
  }
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

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 560px) {
  .tao {
    gap: 22px;
    padding: 28px 16px 44px;
  }

  .buttons-container {
    grid-template-columns: repeat(auto-fit, minmax(76px, 1fr));
  }

  .pad {
    padding: 12px 6px;
    font-size: 15px;
  }
}
</style>

<template>
  <div class="tao">
    <div class="score">
      <span class="score-label">{{ t('taoZheSimulator.point') }}</span>
      <span class="score-value">{{ point }}</span>
    </div>

    <div class="runway">
      <div class="runway-lane">
        <div class="runway-line" />

        <div class="runway-hit">
          <div
            i-material-symbols-light-keyboard-double-arrow-left-rounded
            class="hit-icon"
          />
        </div>

        <div class="runway-blocks">
          <div
            v-for="item in blocks"
            :key="item.id"
            class="block"
            :style="audioStyles[item.type]"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="runway-feedback">
          <div v-for="item in feedbacks" :key="item.id" class="feedback">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>

    <div class="buttons-container">
      <button
        v-for="(getName, type) in AudioName"
        :key="type"
        class="pad"
        type="button"
        :style="audioStyles[type as AudioType]"
        @click="play(type as AudioType)"
      >
        {{ getName() }}
      </button>
    </div>

    <div class="actions">
      <div v-show="loadingAudios" class="loading">
        {{ t('game.loadingWithProgress', { progress }) }}
      </div>

      <template v-if="!loadingAudios">
        <button
          v-if="!isStarted"
          class="btn-primary"
          type="button"
          @click="() => (loadedAudios ? playMusic() : doLoadAudios())"
        >
          {{ loadedAudios ? t('game.start') : t('game.loadAudio') }}
        </button>

        <div v-else class="disc" />
      </template>
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
    backgroundColor: AudioColor[type].background
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
