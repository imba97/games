<style lang="scss" scoped>
.buttons {
  --at-apply: flex items-center gap-2 flex-wrap;

  button {
    --at-apply: py-2 px-4 text-white text-5 bg-primary b-px b-solid b-black
      rounded-2;
  }
}
</style>

<template>
  <div p-3>
    <div class="buttons">
      <button @click="play(AudioType.O)">哦</button>
      <button @click="play(AudioType.A)">啊</button>
      <button @click="play(AudioType.Ai)">哎</button>
      <button @click="play(AudioType.Ei)">诶</button>
      <button @click="play(AudioType.SunNan)">孙楠</button>
      <div>
        <button @click="play(AudioType.Chou1)">臭1</button>
        <button @click="play(AudioType.Chou2)">臭2</button>
      </div>
      <div>
        <button @click="playMusic">开始</button>
        <button @click="stopMusic">停止</button>
        <button @click="showCurrentTime">当前时间</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AudioType } from '@/enums/audio'
import { loadAudios } from '@/utils/import-audios'

const audios = ref<Record<AudioType, HTMLAudioElement>>()

const timeline: Record<string, number | number[]> = {
  [AudioType.O]: 3.58,
  [AudioType.A]: [3.9, 4.3],
  [AudioType.Ai]: 6.35,
  [AudioType.Ei]: 6.76,
  [AudioType.SunNan]: 9.95,
  [AudioType.Chou1]: 12.62,
  [AudioType.Chou2]: 13
}

let music: HTMLAudioElement | null = null

onMounted(async () => {
  audios.value = await loadAudios()
})

const playMusic = () => {
  if (!music) {
    music = audios.value![AudioType.Music].cloneNode() as HTMLAudioElement
  }

  music.play()
  music.addEventListener('ended', () => {
    clearInterval(timer)
  })

  let once = true

  const timer = setInterval(() => {
    if (!music) {
      clearInterval(timer)
    }

    const playKey = _.findKey(timeline, (value) => {
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
        return true
      }

      return false
    })

    if (once && !_.isUndefined(playKey)) {
      play(playKey as AudioType)
      once = false
    }

    if (_.isUndefined(playKey)) {
      once = true
    }

    // if (music!.currentTime <= 3.79 && music!.currentTime >= 3.78) {
    //   play(AudioType.O)
    // }
  }, 10)
}

const stopMusic = () => {
  if (!music) {
    return
  }

  music.pause()
  music.currentTime = 0
}

const showCurrentTime = () => {
  if (!music) {
    return
  }

  console.log(music.currentTime)
}

const play = (type: AudioType) => {
  ;(audios.value![type].cloneNode() as HTMLAudioElement).play()
}
</script>
