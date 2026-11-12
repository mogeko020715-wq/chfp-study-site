export type DemoKind =
  | 'triangle'
  | 'compound'
  | 'bondRate'
  | 'shares'
  | 'fund80'
  | 'optionPayoff'
  | 'optionExercise'
  | 'deposit'
  | 'maturityLiquidity'
  | 'convertible'
  | 'forwardFutures'
  | 'agentBroker'
  | 'fxQuotation'
  | 'closedOpenFund'
  | 'etfLof'
  | 'fourStrategies'

export interface Concept {
  id: string
  name: string
  en: string
  cat: string
  /** 考生常问的原话 */
  quote: string
  /** 白话说清：一句话解答 */
  answer: string
  /** 易错点 / 考点提示 */
  point: string
  demo: DemoKind
  /** 关联闪卡筛选（对应题库 theme） */
  flashFilter?: string
  /** 反向匹配：哪些章节/主题的闪卡应链回本概念（对应题库 chapter/theme） */
  match: string[]
}

export const conceptCategories = ['基础概念', '债券', '股票', '基金', '外汇', '衍生品', '银行', '保险']

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
    match: [],
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
    match: [],
  },
  {
    id: 'maturity-vs-liquidity',
    name: '偿还期 vs 流动性',
    en: 'Maturity vs Liquidity',
    cat: '基础概念',
    quote: '3 年定期还没到期，急用钱怎么办？这和股票随时能卖差在哪？',
    answer: '偿还期是「多久到期」的时间概念；流动性是「能否马上变现」的能力概念。定期未到期也能提前取，只是损失利息——所以流动性打折。',
    point: '口诀「还、流、险、收」；偿还期由合同定死，流动性随市场冷热变化。',
    demo: 'maturityLiquidity',
    match: ['概述', '综合'],
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
    match: ['债券'],
  },
  {
    id: 'convertible-vs-exchangeable',
    name: '可转债 vs 可交换债',
    en: 'Convertible vs Exchangeable',
    cat: '债券',
    quote: '可转债和可交换债，不都能换成股票吗，差在哪？',
    answer: '可转债转成「发行人自己」的股票；可交换债换成的是发行人持有的「别家公司」的股票。',
    point: '盯住「转谁的股」：自己 = 可转债，别人 = 可交换。',
    demo: 'convertible',
    flashFilter: '债券',
    match: ['债券'],
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
    match: ['股票'],
  },
  {
    id: 'four-strategies',
    name: '四种投资策略',
    en: 'Long / Long-Short / Neutral / CTA',
    cat: '股票',
    quote: '多头、多空、中性、CTA——行情下跌的时候，谁能赚钱？',
    answer: '多头只能涨了才赚；多空对冲后涨跌都只剩小波动；中性几乎不看大盘脸色；CTA 跟踪期货趋势，涨也赚跌也赚，就怕横盘。',
    point: 'CTA = 管理期货策略，赌「有趋势」；中性策略赚的是选股能力，不是行情。',
    demo: 'fourStrategies',
    flashFilter: '股票',
    match: ['股票'],
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
    match: ['证券投资基金'],
  },
  {
    id: 'closed-vs-open-fund',
    name: '封闭式 vs 开放式基金',
    en: 'Closed-end vs Open-end',
    cat: '基金',
    quote: '同一只基金，净值 1 块钱，为什么市场上 9 毛就能买到？',
    answer: '那是封闭式基金：到期前不能找基金公司赎回，只能在二级市场转手，价格由供求决定，经常低于净值——这就是「封基折价」。',
    point: '折价率 = 市价 ÷ 净值 − 1；折价不是「捡便宜」，要等基金到期或转型时才收敛回净值。',
    demo: 'closedOpenFund',
    flashFilter: '证券投资基金',
    match: ['证券投资基金', '公募基金'],
  },
  {
    id: 'etf-vs-lof',
    name: 'ETF vs LOF',
    en: 'ETF vs LOF',
    cat: '基金',
    quote: 'ETF 和 LOF 不都能在交易所买卖吗？为什么 ETF 几乎不折价，LOF 却经常偏离净值？',
    answer: '关键在申赎机制：ETF 用一篮子股票实物申赎、门槛高，套利者随时把价差抹平；LOF 用现金申赎、门槛低，套利慢，折溢价就可能拖很久。',
    point: '两者都是「上市交易的开放式基金」；考差别就考申赎方式（实物 vs 现金）和折溢价幅度。',
    demo: 'etfLof',
    flashFilter: '证券投资基金',
    match: ['证券投资基金', '公募基金'],
  },
  {
    id: 'fx-quotation',
    name: '直接标价 vs 间接标价',
    en: 'Direct vs Indirect Quote',
    cat: '外汇',
    quote: '美元人民币从 6.65 涨到 6.80，人民币到底是升值还是贬值？',
    answer: '先看你用哪种标价法。直接标价法（1 美元 = X 人民币）下，数字变大 = 1 美元能换更多人民币 = 人民币贬值；间接标价法正好相反。',
    point: '先判断标价法，再谈币值方向——直接标价法下「数字升 = 本币贬」是最常见的坑。',
    demo: 'fxQuotation',
    flashFilter: '外汇',
    match: ['外汇'],
  },
  {
    id: 'forward-vs-futures',
    name: '远期 vs 期货',
    en: 'Forward vs Futures',
    cat: '衍生品',
    quote: '远期和期货都是约定未来交易，为什么还要分两个？',
    answer: '远期是场外一对一定制的，到期必须交割；期货是交易所标准化合约，每日结算、大多平仓了结。',
    point: '别称坑：「合约现货外汇交易」说的是外汇期货，不是远期。',
    demo: 'forwardFutures',
    flashFilter: '期货和衍生品',
    match: ['期货和衍生品', '外汇'],
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
    match: ['期货和衍生品'],
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
    match: ['期货和衍生品'],
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
    match: [],
  },
  {
    id: 'agent-vs-broker',
    name: '代理人 vs 经纪人',
    en: 'Agent vs Broker',
    cat: '保险',
    quote: '保险代理人和经纪人，到底谁替我说话？',
    answer: '代理人代表保险公司（卖方），经纪人代表投保人（买方）；公估人是查勘定损的中立第三方。',
    point: '「经纪人代表谁」是高频考点：代表投保人，不是保险公司。',
    demo: 'agentBroker',
    match: [],
  },
]

/** 根据闪卡的章节/主题找到应链回的概念（最多 2 个） */
export function conceptsForQuestion(chapter: string, theme: string): Concept[] {
  return concepts
    .filter((c) => c.match.length > 0 && c.match.some((m) => m === theme || m === chapter))
    .slice(0, 2)
}
