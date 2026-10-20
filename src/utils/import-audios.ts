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

    let loaded = 0

    const audioList = importAudios()

    audioList.forEach(({ audioSrc, importPath }) => {
      const audio = new Audio()

      audio.src = audioSrc
      audio.load()

      // 获取 type
      const filePath = importPath.split('/')
      const filename = filePath[filePath.length - 1]
      const type = filename?.replace('.mp3', '') as AudioType
      loadedAudioList[type] = audio

      audio.oncanplaythrough = () => {
        if (typeof onProgress === 'function') {
          onProgress((++loaded / audioList.length) * 100)
        }

        if (loaded === audioList.length) {
          resolve(loadedAudioList)
        }
      }
    })
  })
}
