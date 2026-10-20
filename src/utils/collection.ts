/**
 * 生成 [min, max] 区间内的随机整数（含两端）
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 返回打乱顺序后的新数组，不修改原数组（Fisher-Yates）
 */
export const shuffle = <T>(list: T[]): T[] => {
  const result = [...list]

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    const tmp = result[i]

    result[i] = result[j]
    result[j] = tmp
  }

  return result
}

/**
 * 原地移除满足条件的元素，返回被移除的元素（保持原顺序）
 */
export const removeWhere = <T>(
  list: T[],
  predicate: (item: T) => boolean
): T[] => {
  const removed: T[] = []

  for (let i = list.length - 1; i >= 0; i--) {
    if (predicate(list[i])) {
      removed.unshift(list.splice(i, 1)[0])
    }
  }

  return removed
}

let id = 0

/**
 * 生成带前缀的自增 id
 */
export const uniqueId = (prefix = '') => `${prefix}${++id}`
