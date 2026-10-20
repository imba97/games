import { shuffle } from '@/utils/collection'

const images = import.meta.glob('@/assets/images/*.png', {
  eager: true
}) as Record<string, { default: string }>

/**
 * 已加载图片缓存
 */
const loadedImages = new Set<string>()

export function importImages() {
  return Object.values(images).map(image => image.default)
}

/**
 * 随机挑出 count 张图片，返回已打乱顺序的副本
 */
export function pickImages(count: number) {
  return shuffle(importImages()).slice(0, count)
}

/**
 * 按传入顺序预加载图片
 *
 * 已加载过的会直接计入进度；单张失败也计入，避免进度卡住
 * @param urls 需要加载的图片地址
 * @param onProgress 进度回调，0-100
 */
export function preloadImages(
  urls: string[],
  onProgress?: (progress: number) => void
) {
  if (urls.length === 0) {
    return Promise.resolve()
  }

  let settled = 0

  const settle = () => {
    settled++

    if (typeof onProgress === 'function') {
      onProgress((settled / urls.length) * 100)
    }
  }

  return Promise.all(
    urls.map((url) => {
      if (loadedImages.has(url)) {
        settle()
        return Promise.resolve()
      }

      return new Promise<void>((resolve) => {
        const image = new Image()

        image.onload = () => {
          loadedImages.add(url)
          settle()
          resolve()
        }

        image.onerror = () => {
          settle()
          resolve()
        }

        image.src = url
      })
    })
  )
}
