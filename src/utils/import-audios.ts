import type { AudioType } from '@/enums/audio'

const audios = import.meta.glob('@/assets/audios/*.mp3', {
  eager: true
}) as Record<string, { default: string }>

function importAudios() {
  return Object.entries(audios).map(([importPath, audio]) => ({
    importPath,
    audioSrc: audio.default
  }))
}

export function loadAudios(onProgress?: (progress: number) => void) {
  return new Promise<Record<AudioType, HTMLAudioElement>>((resolve) => {
    const loadedAudioList: Record<string, HTMLAudioElement> = {}

    const audioList = importAudios()

    let settled = 0
    let failed = 0

    // 加载失败也要计入进度，否则 Promise 永远不会 resolve，界面会卡在加载中
    const settle = () => {
      settled++

      if (typeof onProgress === 'function') {
        onProgress((settled / audioList.length) * 100)
      }

      if (settled < audioList.length) {
        return
      }

      if (failed > 0) {
        console.warn(`[loadAudios] ${failed} 个音频加载失败`)
      }

      resolve(loadedAudioList)
    }

    audioList.forEach(({ audioSrc, importPath }) => {
      const audio = new Audio()

      // 获取 type
      const filePath = importPath.split('/')
      const filename = filePath[filePath.length - 1]
      const type = filename?.replace('.mp3', '') as AudioType
      loadedAudioList[type] = audio

      // 同一个音频只会被计入一次
      let done = false

      const settleOnce = () => {
        if (done) {
          return
        }

        done = true
        settle()
      }

      audio.src = audioSrc
      audio.load()

      audio.oncanplaythrough = settleOnce
      audio.onerror = () => {
        failed++
        settleOnce()
      }
    })
  })
}
