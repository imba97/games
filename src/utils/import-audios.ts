import { AudioType } from '@/enums/audio'

const audios = import.meta.glob('@/assets/audios/*.mp3', {
  eager: true
})

const importImages = () => {
  return _.map(audios, (audio: any) => audio.default)
}

export const loadAudios = (onProgress?: (progress: number) => void) => {
  return new Promise<Record<AudioType, HTMLAudioElement>>((resolve) => {
    const loadedAudioList: Record<string, HTMLAudioElement> = {}

    const audioList = importImages()
    let loaded = 0

    audioList.forEach((audioSrc: string) => {
      const audio = new Audio()

      audio.src = audioSrc
      audio.load()

      // 获取 type
      const filename = audioSrc.split('/').at(-1)
      const type = filename?.replace('.mp3', '') as AudioType
      loadedAudioList[type] = audio

      audio.oncanplaythrough = () => {
        if (_.isFunction(onProgress)) {
          onProgress((++loaded / audioList.length) * 100)
        }

        if (loaded === audioList.length) {
          resolve(loadedAudioList)
        }
      }
    })
  })
}
