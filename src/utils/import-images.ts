const images = import.meta.glob('@/assets/images/*.png', {
  eager: true
})

export const importImages = () => {
  return _.map(images, (image: any) => image.default)
}

// 图片预加载
importImages().forEach((image: any) => {
  const img = new Image()
  img.src = image
})
