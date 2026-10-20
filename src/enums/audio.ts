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

export const AudioColor: Record<string, { text: string, background: string }>
  = Object.freeze({
    [AudioType.A]: { text: '#fff8ec', background: '#8a5cf6' },
    [AudioType.Ai]: { text: '#1f1633', background: '#5cc8f5' },
    [AudioType.Chou1]: { text: '#1f1633', background: '#4fc98a' },
    [AudioType.Chou2]: { text: '#1f1633', background: '#f7b32b' },
    [AudioType.Ei]: { text: '#fff8ec', background: '#6b7280' },
    [AudioType.O]: { text: '#1f1633', background: '#f0a04b' },
    [AudioType.SunNan]: { text: '#fff8ec', background: '#f0567a' }
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

export const PointRange: Record<FeedbackType, { min: number, max: number }>
  = Object.freeze({
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
