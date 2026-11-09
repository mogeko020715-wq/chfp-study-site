export type DemoKind =
  | 'triangle'
  | 'compound'
  | 'bondRate'
  | 'shares'
  | 'fund80'
  | 'optionPayoff'
  | 'optionExercise'
  | 'deposit'

export interface Concept {
  id: string
  name: string
  en: string
  cat: string
  /** 考生常问的原话 */
  quote: string
  /** 一句话解答 */
  answer: string
  /** 考点提示 */
  point: string
  demo: DemoKind
  /** 关联闪卡筛选（对应题库 theme） */
  flashFilter?: string
}

export const conceptCategories = ['基础概念', '债券', '股票', '基金', '衍生品', '银行']

export const concepts: Concept[] = [
  {
    id: 'impossible-triangle',
    name: '不可能三角',
    en: 'Impossible Trinity',
    cat: '基础概念',
    quote: '有没有收益高、风险低、还能随时取的产品？',
    answer: '高收益、低风险、高流动性三者不可兼得，最多只能占两样。',
    point: '金融工具四大特征是「还、流、险、收」——没有便捷性，也没有保本性。',
    demo: 'triangle',
  },
  {
    id: 'compound-interest',
    name: '复利效应',
    en: 'Compound Interest',
    cat: '基础概念',
    quote: '每年 10% 的收益，十年到底是 2 倍还是更多？',
    answer: '利息会再生利息：10% 复利十年约 2.59 倍，比单利多出一截，时间越长差距越夸张。',
    point: '72 法则：72 ÷ 年收益率 ≈ 本金翻倍所需年数。',
    demo: 'compound',
  },
  {
    id: 'bond-price-rate',
    name: '债券价格与利率',
    en: 'Bond Price vs. Rate',
    cat: '债券',
    quote: '央行一加息，我手里的债券怎么就跌了？',
    answer: '票面利息是固定的，市场利率越高，旧债越不值钱——债券价格与市场利率反向变动。',
    point: '反向关系是债券第一考点；期限越长，价格波动越大。',
    demo: 'bondRate',
    flashFilter: '债券',
  },
  {
    id: 'share-classes',
    name: 'A股 / B股 / H股',
    en: 'Share Classes',
    cat: '股票',
    quote: 'A股、B股、H股，到底谁用什么钱买、在哪上市？',
    answer: 'A股用人民币在沪深买卖；B股人民币面值、外币认购；H股在香港上市。',
    point: 'B 股面值仍是人民币，只是用外币认购——最容易记反的一点。',
    demo: 'shares',
    flashFilter: '股票',
  },
  {
    id: 'fund-80-rule',
    name: '基金 80% 规则',
    en: 'The 80% Rule',
    cat: '基金',
    quote: '股票型基金是不是 100% 的钱都买了股票？',
    answer: '不是。80% 以上投股票就是股票型；股票、债券、基金各项比例都不超 80% 的是混合型。',
    point: '混合型基金的关键：各项比例均不超过 80%，而不是「什么都买点」。',
    demo: 'fund80',
    flashFilter: '证券投资基金',
  },
  {
    id: 'option-payoff',
    name: '期权的权利与义务',
    en: 'Option Payoff',
    cat: '衍生品',
    quote: '买期权最多亏多少？为什么说买卖双方不对称？',
    answer: '买方最多亏掉期权费，收益理论上不封顶；卖方收了期权费，却可能承担很大的赔付。',
    point: '期权费（Premium）无论是否行权都不退还。',
    demo: 'optionPayoff',
    flashFilter: '期货和衍生品',
  },
  {
    id: 'option-exercise',
    name: '美式 vs 欧式期权',
    en: 'American vs European',
    cat: '衍生品',
    quote: '美式期权和欧式期权，到底哪个更灵活？',
    answer: '美式在到期前任意交易日都能行权；欧式只能在到期日当天行权。',
    point: '「美式 / 欧式」与地理无关，只表示行权时间规则。',
    demo: 'optionExercise',
    flashFilter: '期货和衍生品',
  },
  {
    id: 'deposit-insurance',
    name: '存款保险 50 万',
    en: 'Deposit Insurance',
    cat: '银行',
    quote: '银行要是出问题，我的 80 万存款能全拿回来吗？',
    answer: '同一存款人在同一家银行，本息合计最高偿付 50 万；超出部分从银行清算财产中受偿。',
    point: '保费由投保机构缴纳，储户不出钱；注意是「同一家银行」合并计算。',
    demo: 'deposit',
  },
]
