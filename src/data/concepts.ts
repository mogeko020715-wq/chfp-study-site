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
  | 'pePb'
  | 'moneyFund'
  | 'candleBasic'
  | 'hammerHanging'
  | 'paperGold'
  | 'goldExchanges'
  | 'm012'
  | 'bankTrio'
  | 'familyRatios'
  | 'emergencyFund'
  | 'insurancePrinciples'
  | 'pensionPillars'
  | 'bonusTax'
  | 'educationFund'
  | 'propertyVsLife'
  | 'ciVsMedical'
  | 'lifeCycle'

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

export const conceptCategories = ['基础概念', '家庭财务', '债券', '股票', '基金', '外汇', '衍生品', '贵金属', '银行', '保险', '税收']

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
    name: '股票的族谱',
    en: 'Share Classes',
    cat: '股票',
    quote: 'A股B股H股、普通股优先股，股票到底有多少种分法？',
    answer: '两套分法别搞混：按上市地点分 A/B/H 股（在哪买、用什么钱买）；按股东权利分普通股/优先股（优先股先分红、先清偿，但一般没有投票权）。',
    point: '优先股的「优先」= 分红和清偿顺序优先，不是「更好」；B 股面值仍是人民币，只是用外币认购。',
    demo: 'shares',
    flashFilter: '股票',
    match: ['股票'],
  },
  {
    id: 'pe-vs-pb',
    name: 'PE vs PB',
    en: 'P/E vs P/B',
    cat: '股票',
    quote: '同样是 20 块的股票，为什么有的算贵有的算便宜？',
    answer: '单看股价没意义。PE = 股价 ÷ 每股收益，看赚钱能力（按当前盈利几年回本）；PB = 股价 ÷ 每股净资产，看家底（为每 1 元账面资产付了几块钱）。',
    point: '亏损公司 PE 无意义，要看 PB；银行、地产等重资产行业习惯用 PB 估值。',
    demo: 'pePb',
    flashFilter: '股票',
    match: ['股票'],
  },
  {
    id: 'candle-basic',
    name: 'K 线基础',
    en: 'Candlestick Basics',
    cat: '股票',
    quote: 'K 线图上红红绿绿的柱子，到底哪头是开盘价？',
    answer: '每根 K 线记录四个价：开盘、收盘、最高、最低。收盘高于开盘是阳线（红色），实体两端分别是开盘和收盘，细细的影线指向当天的最高和最低价。',
    point: '中国盘面红涨绿跌，和欧美正好相反；影线越长，说明盘中多空博弈越激烈。',
    demo: 'candleBasic',
    flashFilter: '股票',
    match: ['股票'],
  },
  {
    id: 'hammer-vs-hanging',
    name: '锤子线 vs 上吊线',
    en: 'Hammer vs Hanging Man',
    cat: '股票',
    quote: '锤子线和上吊线长得一模一样，怎么一个是好事一个是坏事？',
    answer: '它们确实是同一种形态：小实体在顶部、下影线很长。区别只在位置——出现在下跌趋势末端叫锤子线（见底信号），出现在上涨趋势末端叫上吊线（见顶预警）。',
    point: '形态不决定含义，位置决定含义；而且要等次日 K 线确认才算数。',
    demo: 'hammerHanging',
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
    id: 'money-fund-rules',
    name: '货基可投 / 不可投',
    en: 'Money Fund Rules',
    cat: '基金',
    quote: '货币基金这么稳，是不是什么都能买一点？',
    answer: '恰恰相反。货基的投资范围严格受限：只能买现金、1 年内存款、397 天内债券、央票、同业存单这些；股票、可转债、长期存款一概不能碰。',
    point: '记住「397 天」这个奇怪的数字；股票和可转债是货基的绝对禁区。',
    demo: 'moneyFund',
    flashFilter: '证券投资基金',
    match: ['证券投资基金', '公募基金'],
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
    id: 'paper-vs-physical-gold',
    name: '纸黄金 vs 实物黄金',
    en: 'Paper vs Physical Gold',
    cat: '贵金属',
    quote: '我在银行 App 买的纸黄金，能去柜台换成金条吗？',
    answer: '不能。纸黄金只是账面上的买卖记录，跟着报价涨跌赚差价，全程不涉及实物交割；想拿真金得买实物黄金，但要承担保管、鉴定和回购折价的成本。',
    point: '纸黄金 = 个人凭证式黄金，「账面买卖、不能提取实物」是考点原话；黄金不产生利息，持有成本别忘算。',
    demo: 'paperGold',
    flashFilter: '黄金',
    match: ['黄金'],
  },
  {
    id: 'gold-exchanges',
    name: '贵金属三大交易所',
    en: 'The Three Exchanges',
    cat: '贵金属',
    quote: '黄金 T+D、黄金期货、天通金，分别在哪个交易所交易？',
    answer: '国务院批准的就三家：上海黄金交易所做现货延期（黄金/白银 T+D），上海期货交易所做期货（黄金/白银期货），天津贵金属交易所做天通金、天通银。',
    point: '高频考点是「T+D 归上金所、期货归上期所」——两家名字都带「上海」，最容易记串。',
    demo: 'goldExchanges',
    flashFilter: '黄金',
    match: ['黄金'],
  },
  {
    id: 'family-ratios',
    name: '家庭财务三比率',
    en: 'Key Family Ratios',
    cat: '家庭财务',
    quote: '体检报告能看懂，家庭财务的「体检指标」怎么看？',
    answer: '三个最常用的：流动性比率 = 流动资产 ÷ 月支出（健康区间 3–6）；结余比率 = 年结余 ÷ 税后年收入（≥30% 为好）；投资与净资产比率 = 投资资产 ÷ 净资产（≥50% 为好）。',
    point: '流动性比率过高反而是资金闲置——不是越高越好；结余比率为负说明入不敷出。',
    demo: 'familyRatios',
    match: [],
  },
  {
    id: 'emergency-fund',
    name: '紧急备用金',
    en: 'Emergency Fund',
    cat: '家庭财务',
    quote: '「留几个月生活费」到底怎么算？留多了浪费收益，留少了心里没底。',
    answer: '一般保留相当于家庭 3–6 个月固定支出的金额，放在活期存款、货币基金这类高流动性资产里；收入越不稳定，越要往 6 个月甚至更多留。',
    point: '备用金追求安全和流动，不追求收益；全部拿去投股票型基金是典型错误。',
    demo: 'emergencyFund',
    match: [],
  },
  {
    id: 'insurance-principles',
    name: '保险四大原则',
    en: 'Four Insurance Principles',
    cat: '保险',
    quote: '损失补偿、最大诚信、保险利益、近因——四个词都会背，一做题就混。',
    answer: '损失补偿：赔不超过实际损失；最大诚信：如实告知，隐瞒可拒赔；保险利益：你对保的东西要有法律认可的利益；近因：赔不赔看损失的直接原因属不属于承保范围。',
    point: '案例题就按这四步判断：有没有保险利益 → 告知是否诚信 → 近因是否承保 → 按实际损失赔。',
    demo: 'insurancePrinciples',
    match: [],
  },
  {
    id: 'pension-pillars',
    name: '社保三支柱',
    en: 'Three Pension Pillars',
    cat: '保险',
    quote: '基本养老保险、企业年金、个人养老金，都是养老钱，谁给谁交？',
    answer: '第一支柱：基本养老保险（国家强制，统筹 + 个人账户）；第二支柱：企业/职业年金（单位自愿建立的补充养老）；第三支柱：个人养老金（个人自愿、有税收优惠，年缴上限 1.2 万）。',
    point: '支柱按「谁主导」分：国家、单位、个人；个人养老金账户退休前一般不能提前取。',
    demo: 'pensionPillars',
    match: [],
  },
  {
    id: 'bonus-tax',
    name: '年终奖单独 vs 综合计税',
    en: 'Bonus Tax Methods',
    cat: '税收',
    quote: '年终奖 20 万，单独计税和并入综合所得，哪个更划算？',
    answer: '单独计税：年终奖单独按月换算税率表计税；并入综合：和全年工资合并按年税率表计税。工资高、年终奖占比小时往往单独计税更省，要实际算一遍才知道。',
    point: '考试套路：两种方式各算一次税额，差额就是「少缴纳 X 元」的答案。',
    demo: 'bonusTax',
    match: [],
  },
  {
    id: 'education-fund',
    name: '教育金现值计算',
    en: 'Education Fund PV',
    cat: '家庭财务',
    quote: '孩子 8 年后上大学，每月生活费 2000 元，现在一次性要存多少钱？',
    answer: '把未来四年的生活费按投资收益率折现到现在：先算四年费用的年金现值，再除以 (1+r)ⁿ。收益率越高，现在要准备的本金越少。',
    point: '教育金是刚性支出，投资工具以稳健为先（国债、教育金保险），不宜重仓股票。',
    demo: 'educationFund',
    match: [],
  },
  {
    id: 'm0-m1-m2',
    name: 'M0 / M1 / M2 货币层次',
    en: 'Money Supply Layers',
    cat: '基础概念',
    quote: '新闻里说「M2 增长 8%」，这个 M2 到底是什么？和 M0、M1 什么关系？',
    answer: '货币按流动性分三层、层层嵌套：M0 = 流通中的现金；M1 = M0 + 活期存款（狭义货币，最活跃）；M2 = M1 + 定期存款等（广义货币，口径最宽）。',
    point: '记「M1 活、M2 宽」；M1 与 M2 的增速差（剪刀差）常被用来观察资金活化的程度。',
    demo: 'm012',
    match: [],
  },
  {
    id: 'bank-trio',
    name: '央行 vs 商行 vs 政策性银行',
    en: 'Central / Commercial / Policy Banks',
    cat: '银行',
    quote: '央行、商业银行、政策性银行，名字都带「银行」，干的活一样吗？',
    answer: '完全不同：央行是「银行的银行」，发货币、定政策、不管个人业务；商业银行吸收存款、发放贷款、创造信用，以营利为目的；政策性银行（国开行等）为贯彻国家政策放贷，不追求利润最大化。',
    point: '政策性金融债是「准国债」，信用仅次于国债；能创造信用的是商业银行，证券公司不能。',
    demo: 'bankTrio',
    match: [],
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
    id: 'property-vs-life-insurance',
    name: '财产险 vs 人身险',
    en: 'Property vs Life Insurance',
    cat: '保险',
    quote: '车险赔多少看修车发票，重疾险赔多少看合同保额——都是保险，赔法怎么不一样？',
    answer: '财产险走「损失补偿」：按实际损失赔，不能超过保额，更不能让你赚钱；人身险多走「定额给付」：买多少保额就赔多少，跟实际花了多少无关。',
    point: '同一份财产买两份财产险也不能重复获赔（损失补偿）；买两份重疾险可以叠加赔付（定额给付）。',
    demo: 'propertyVsLife',
    match: [],
  },
  {
    id: 'ci-vs-medical',
    name: '重疾险 vs 医疗险',
    en: 'Critical Illness vs Medical',
    cat: '保险',
    quote: '有了百万医疗险，为什么还要买重疾险？不是都能报医药费吗？',
    answer: '医疗险是报销型：花多少、按发票报多少，先垫付再报销；重疾险是给付型：确诊约定疾病就一次性赔保额，不管实际花了多少——这笔钱是用来养病和补收入缺口的。',
    point: '两者互补不替代：医疗险管「治病钱」，重疾险管「养病期间的生活费」。',
    demo: 'ciVsMedical',
    match: [],
  },
  {
    id: 'financial-life-cycle',
    name: '财务生命周期',
    en: 'Financial Life Cycle',
    cat: '家庭财务',
    quote: '单身、刚成家、孩子上学、快退休——每个阶段该怎么理钱，是一套路数吗？',
    answer: '不是。财务生命周期分五段：单身期（攒经验攒本金）、家庭形成期（买房结婚，负债高峰）、家庭成长期（子女教育金是主线）、家庭成熟期（还清负债，加速养老储备）、退休期（防守为主，保住现金流）。',
    point: '阶段决定策略：能承受的风险随年龄下降，「先负债后积累再防守」是标准节奏。',
    demo: 'lifeCycle',
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
