const images = import.meta.glob('@/assets/images/*.png', {
  eager: true
})

/**
 * 已加载图片缓存
 */
const loadedImages = new Set<string>()

export const importImages = () => {
  return _.map(images, (image: any) => image.default)
}

/**
 * 取出一定数量的照片
 *
 * 该函数会自动预加载图片
 * @param length 取出数量
 * @param onProgress 进度回调
 */
export const pullImages = (
  length: number,
  onProgress?: (progress: number) => void
) => {
  const images = _.clone(importImages())
  const resultImages: string[] = []

  let progress = 0

  const execOnProgress = () => {
    if (_.isFunction(onProgress)) {
      progress++
      onProgress((progress / length) * 100)
    }
  }

  for (let i = 0; i < length; i++) {
    const index = _.random(0, images.length - 1)

    if (!loadedImages.has(images[index])) {
      const image = new Image()
      image.src = images[index]

      image.onload = () => {
        loadedImages.add(images[index])
        execOnProgress()
      }
    } else {
      execOnProgress()
    }

    resultImages.push(images[index])
    images.splice(index, 1)
  }

  return resultImages
}
