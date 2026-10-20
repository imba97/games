import { randomInt } from '@/utils/collection'

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
 * 取出一定数量的照片
 *
 * 该函数会自动预加载图片
 * @param length 取出数量
 * @param onProgress 进度回调
 */
export function pullImages(length: number, onProgress?: (progress: number) => void) {
  const pool = [...importImages()]
  const resultImages: string[] = []

  let progress = 0

  const execOnProgress = () => {
    if (typeof onProgress === 'function') {
      progress++
      onProgress((progress / length) * 100)
    }
  }

  for (let i = 0; i < length; i++) {
    // 图片不够时提前结束，避免取到 undefined
    if (pool.length === 0) {
      break
    }

    const index = randomInt(0, pool.length - 1)
    const url = pool[index]

    if (!loadedImages.has(url)) {
      const image = new Image()
      image.src = url

      // 用固定的 url 而不是回头再取 pool[index]，否则 pool 变动后会记错缓存
      image.onload = () => {
        loadedImages.add(url)
        execOnProgress()
      }
    }
    else {
      execOnProgress()
    }

    resultImages.push(url)
    pool.splice(index, 1)
  }

  // 图片数量不足时也要把进度补满，否则调用方的等待永远不会结束
  if (progress < length && typeof onProgress === 'function') {
    onProgress(100)
  }

  return resultImages
}
