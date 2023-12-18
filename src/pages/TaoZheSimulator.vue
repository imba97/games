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
          <div absolute bottom-0 left-0 w-1 h-8 rounded-t-full bg-blue></div>
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
              :style="getColor(item.type)"
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
          ></div>
        </div>
      </div>
    </div>

    <div class="buttons-container">
      <div>
        <button
          v-for="(getName, type) in AudioName"
          :style="getColor(type as AudioType)"
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
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  AudioType,
  AudioName,
  AudioColor,
  FeedbackType,
  PointRange
} from '@/enums/audio'

import { loadAudios } from '@/utils/import-audios'

type BlockType = {
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
const timeline: Record<string, number | number[]> = _.reduce(
  {
    [AudioType.O]: 3.58,
    [AudioType.A]: [3.9, 4.3],
    [AudioType.Ai]: 6.15,
    [AudioType.Ei]: 6.55,
    [AudioType.SunNan]: 10.1,
    [AudioType.Chou1]: 12.62,
    [AudioType.Chou2]: 13
  },
  (result, item, key) => {
    if (_.isArray(item)) {
      result[key] = item.map((n) => n - showBlockTime)
    } else {
      result[key] = item - showBlockTime
    }

    return result
  },
  {} as Record<string, number | number[]>
)

/**
 * 音乐块
 */
const blocks = ref<BlockType[]>([])
/**
 * 点击反馈
 */
const feedbacks = ref<{ id: string; text: string; time: number }[]>([])

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

const loadedAudios = computed(() => !_.isEmpty(audios.value))

let music: HTMLAudioElement | null = null

onMounted(() => {
  // iOS 先让开始按钮显示，具体加载在按钮点击事件里
  if (isIOS) {
    return
  }

  doLoadAudios()
})

const doLoadAudios = async () => {
  // 加载音频
  loadingAudios.value = true
  audios.value = await loadAudios((_progress) => {
    progress.value = _progress
  }).finally(() => {
    loadingAudios.value = false
  })
}

/**
 * 获取颜色
 */
const getColor = (type: AudioType) => {
  return {
    color: AudioColor[type].text,
    backgroundColor: AudioColor[type].backgrond
  }
}

/**
 * 播放背景音乐
 */
const playMusic = async () => {
  reset()

  isStarted.value = true

  if (!music) {
    music = audios.value![AudioType.Music].cloneNode() as HTMLAudioElement
  }

  music.play()

  // 音乐停止事件
  music.addEventListener('ended', () => {
    isStarted.value = false
    clearInterval(timer)
  })

  let once = true

  const timer = setInterval(() => {
    if (!music) {
      clearInterval(timer)
      return
    }

    blocks.value = _.filter(
      blocks.value,
      (block: BlockType) =>
        block.time - music!.currentTime > -PointRange[FeedbackType.Good].max
    )

    _.remove(
      feedbacks.value,
      (feedback: { time: number }) => music!.currentTime - feedback.time > 0.8
    )

    let playKey
    let time

    _.forEach(timeline, (value, key) => {
      let latestTime

      if (_.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const n = value[i]

          if (music!.currentTime - n > 0 && music!.currentTime - n < 0.1) {
            latestTime = n
          }
        }
      } else {
        latestTime = value
      }

      if (!latestTime) {
        return
      }

      const lt = latestTime - 0.02
      const gt = latestTime + 0.02

      if (music!.currentTime >= lt && music!.currentTime <= gt) {
        playKey = key
        time = latestTime
      }
    })

    if (once && !_.isUndefined(playKey)) {
      blocks.value.push({
        id: _.uniqueId('blocks_'),
        type: playKey as AudioType,
        name: AudioName[playKey as AudioType](),
        time: time! + showBlockTime,
        played: false
      })

      once = false
    }

    if (_.isUndefined(playKey)) {
      once = true
    }
  }, 10)
}

const play = (type: AudioType) => {
  ;(audios.value![type].cloneNode() as HTMLAudioElement).play()

  const noPlayedBlock = _.filter(
    blocks.value,
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

  // 正确
  const time = music!.currentTime - block.time
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
      id: _.uniqueId('feedback_'),
      text: feedbackText,
      time: music!.currentTime
    })
  }

  point.value = Math.floor(point.value)
}

/**
 * 移除块
 */
const removeBlock = (id: string) => {
  _.remove(blocks.value, (block: BlockType) => block.id === id)
}

/**
 * 根据时间匹配按键反馈
 */
const feedbackValueOf = (time: number) => {
  const feedback = _.findKey(
    PointRange,
    (item) => item.min <= time && item.max >= time
  )

  return feedback
}

/**
 * 重置游戏
 */
const reset = () => {
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
