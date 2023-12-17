const t = i18n.global.t

export enum AudioType {
  /**
   * 啊
   */
  A = 'a',

  /**
   * 哎
   */
  Ai = 'ai',

  /**
   * 臭 1
   */
  Chou1 = 'chou-1',

  /**
   * 臭 2
   */
  Chou2 = 'chou-2',

  /**
   * 诶
   */
  Ei = 'ei',

  /**
   * 哦
   */
  O = 'o',

  /**
   * 孙楠
   */
  SunNan = 'sun-nan',

  /**
   * 背景音乐
   */
  Music = 'music'
}

export const AudioName: Record<string, () => string> = Object.freeze({
  [AudioType.O]: () => t('taoZheSimulator.o'),
  [AudioType.A]: () => t('taoZheSimulator.a'),
  [AudioType.Ai]: () => t('taoZheSimulator.ai'),
  [AudioType.Ei]: () => t('taoZheSimulator.ei'),
  [AudioType.SunNan]: () => t('taoZheSimulator.sunNan'),
  [AudioType.Chou1]: () => t('taoZheSimulator.chou1'),
  [AudioType.Chou2]: () => t('taoZheSimulator.chou2')
})

export const AudioColor: Record<string, { text: string; backgrond: string }> =
  Object.freeze({
    [AudioType.A]: { text: '#fff', backgrond: '#8b5cf6' },
    [AudioType.Ai]: { text: '#fff', backgrond: '#0ea5e9' },
    [AudioType.Chou1]: { text: '#fff', backgrond: '#22c55e' },
    [AudioType.Chou2]: { text: '#fff', backgrond: '#f59e0b' },
    [AudioType.Ei]: { text: '#fff', backgrond: '#4b5563' },
    [AudioType.O]: { text: '#fff', backgrond: '#57534e' },
    [AudioType.SunNan]: { text: '#fff', backgrond: '#f43f5e' }
  })

export enum FeedbackType {
  /**
   * 过早
   */
  Prematurely = 'prematurely',

  /**
   * 完美
   */
  Perfect = 'perfect',

  /**
   * 好
   */
  Good = 'good'
}

export const PointRange: Record<FeedbackType, { min: number; max: number }> =
  Object.freeze({
    [FeedbackType.Prematurely]: {
      min: -Infinity,
      max: -0.1
    },
    [FeedbackType.Perfect]: {
      min: -0.11,
      max: 0.15
    },
    [FeedbackType.Good]: {
      min: 0.16,
      max: 0.3
    }
  })
