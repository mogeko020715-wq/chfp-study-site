export interface PracticeOption {
  id: string
  label: string
  /** 每个选项独立的反馈文案：选对给肯定+延伸，选错点破误解 */
  feedback: string
  correct: boolean
}

export interface PracticeItem {
  id: string
  /** 对应 concepts.ts 里的概念 id，答对后解锁该概念详情 */
  conceptId: string
  /** 练习方向（与概念分类一致，用于筛选） */
  cat: string
  title: string
  options: PracticeOption[]
}

export const practiceItems: PracticeItem[] = [
  {
    id: 'fx-usdcny-headline',
    conceptId: 'fx-quotation',
    cat: '外汇',
    title:
      '财经 App 弹出快讯：「在岸人民币 USDCNY 报 6.85，昨日为 6.70」。小白惊呼「数字涨了，人民币升值了！」他的判断：',
    options: [
      {
        id: 'depreciate',
        label: '错了——数字上升表示 1 美元能换更多人民币，人民币其实在贬值',
        feedback:
          '答对了。先认标价法再谈方向：USDCNY 是直接标价（1 美元合多少人民币），数字升 = 美元更贵 = 人民币贬。',
        correct: true,
      },
      {
        id: 'appreciate',
        label: '对，数字变大就是升值，汇率和股票读法一样',
        feedback:
          '还不对。汇率数字的含义取决于标价法，不能照搬股票直觉。直接标价法下数字升 = 本币贬。',
        correct: false,
      },
      {
        id: 'unknown',
        label: '无法判断，还得等官方解读才知道涨跌',
        feedback:
          '还不对。不需要等解读——认出直接标价法（1 美元 = X 人民币），方向立刻就能定。',
        correct: false,
      },
    ],
  },
  {
    id: 'fund-discount-panic',
    conceptId: 'closed-vs-open-fund',
    cat: '基金',
    title: '小王看到某封闭式基金净值 1.00 元，场内却只卖 0.90 元，以为是行情软件出错了。你怎么解释？',
    options: [
      {
        id: 'discount',
        label: '没出错。封基到期前不能赎回，只能在二级市场转手，供求失衡时市价就会低于净值——这叫折价',
        feedback:
          '答对了。折价率 = 市价 ÷ 净值 − 1。折价不是捡便宜，要等基金到期或转型时才收敛回净值。',
        correct: true,
      },
      {
        id: 'data-error',
        label: '数据错了，基金的市价必须等于净值',
        feedback:
          '还不对。只有开放式基金按净值申购赎回才锁定价格；封闭式在二级市场交易，价格由供求决定，可以偏离净值。',
        correct: false,
      },
      {
        id: 'free-lunch',
        label: '别解释了，赶紧买——折价 10% 等于白赚',
        feedback:
          '还不对。折价不等于白赚：它可能长期存在甚至扩大，买入后能不能收敛，要看基金到期或转型安排。',
        correct: false,
      },
    ],
  },
  {
    id: 'etf-lof-tracking',
    conceptId: 'etf-vs-lof',
    cat: '基金',
    title:
      '同跟踪沪深 300 的两只基金：ETF 的市价几乎贴着净值走，LOF 却偏离了 2% 还没回归。最合理的解释是：',
    options: [
      {
        id: 'arbitrage',
        label: 'ETF 用一篮子股票实物申赎，套利者随时抹平价差；LOF 现金申赎慢，折溢价可能拖很久',
        feedback:
          '答对了。折溢价大小主要看套利速度：实物申赎快所以贴得紧，现金申赎慢所以飘得久。',
        correct: true,
      },
      {
        id: 'manager',
        label: 'LOF 的基金经理水平差，没跟住指数',
        feedback:
          '还不对。跟踪误差和市价偏离是两回事——这里说的是市价与净值的偏离，根源在申赎与套利机制。',
        correct: false,
      },
      {
        id: 'retail-ban',
        label: 'ETF 不允许散户买卖，所以价格更稳',
        feedback:
          '还不对。ETF 在交易所人人可买，只是「申购赎回」的一篮子实物门槛高，主要由机构套利者参与。',
        correct: false,
      },
    ],
  },
  {
    id: 'bond-rate-hike',
    conceptId: 'bond-price-rate',
    cat: '债券',
    title: '新闻说央行加息 0.25%，债券基金经理却说「今天组合亏钱了」。他并不慌，因为：',
    options: [
      {
        id: 'inverse',
        label: '票面利息是固定的，市场利率升 → 旧债价格跌，账面浮亏是利率反向关系的正常表现',
        feedback:
          '答对了。债券价格与市场利率反向变动；期限越长，同样加息带来的价格波动越大。',
        correct: true,
      },
      {
        id: 'fake-loss',
        label: '加息利好债券，他在假装亏钱',
        feedback:
          '还不对。加息对存量债券是利空：新债利息更高，旧债只能降价才卖得动。',
        correct: false,
      },
      {
        id: 'default',
        label: '说明他买的债券违约了',
        feedback:
          '还不对。违约是信用风险，和央行加息没有必然关系；利率上行引起的普跌不等于违约。',
        correct: false,
      },
    ],
  },
  {
    id: 'triangle-sales-call',
    conceptId: 'impossible-triangle',
    cat: '基础概念',
    title: '推销电话：「这款理财收益 8%，保本，随存随取。」用不可能三角判断，最值得怀疑的是：',
    options: [
      {
        id: 'trinity',
        label: '高收益、低风险、高流动三者不可兼得——三个承诺同时出现，大概率有诈',
        feedback:
          '答对了。「还、流、险、收」四大特征里没有保本；三样全占的产品只存在于话术里。',
        correct: true,
      },
      {
        id: 'too-low',
        label: '8% 太低了，算不上高收益，不值得怀疑',
        feedback:
          '还不对。问题不在 8% 高不高，而在「高收益 + 保本 + 随时取」这个组合本身违反不可能三角。',
        correct: false,
      },
      {
        id: 'money-fund',
        label: '随存随取说明是货币基金，完全可信',
        feedback:
          '还不对。货币基金的确流动性好，但代价正是收益低——它做不到 8%，更没有「保本」承诺。',
        correct: false,
      },
    ],
  },
  {
    id: 'option-exercise-early',
    conceptId: 'option-exercise',
    cat: '衍生品',
    title:
      '客户急问：「我买的欧式期权今天大涨，能不能现在就行权落袋？」今天距到期日还有 10 天。理财师应回答：',
    options: [
      {
        id: 'sell-secondary',
        label: '欧式期权只能在到期日当天行权；现在想落袋，只能在二级市场把期权卖掉',
        feedback:
          '答对了。美式可随时行权，欧式只能到期行权；但欧式期权本身可以在交易所卖出平仓，不必等到期。',
        correct: true,
      },
      {
        id: 'exercise-anytime',
        label: '可以，只要盈利了随时都能行权',
        feedback:
          '还不对。「盈利就能行权」是美式期权的规则；你手里的欧式期权没到期就不能行权。',
        correct: false,
      },
      {
        id: 'voided',
        label: '行权是美式期权的事，你的欧式期权已经作废了',
        feedback:
          '还不对。欧式期权没有作废——它在到期日仍可行权，平时也能按市场价卖出。「美式 / 欧式」只说行权时间。',
        correct: false,
      },
    ],
  },
  {
    id: 'forward-vs-futures-hedge',
    conceptId: 'forward-vs-futures',
    cat: '衍生品',
    title:
      '企业财务问：「同样锁定 3 个月后的购汇汇率，为什么银行推荐签远期，而不是直接买外汇期货？」最合适的理由是：',
    options: [
      {
        id: 'custom-fit',
        label: '远期是场外一对一定制，金额和日期能精确匹配企业的真实敞口；期货是标准化合约，未必正好对上',
        feedback:
          '答对了。套期保值要的是「刚好盖住风险」——远期非标准但合身，期货标准但可能有缺口。',
        correct: true,
      },
      {
        id: 'futures-pricier',
        label: '因为期货一定比远期贵',
        feedback:
          '还不对。价格不是核心差别：远期到期必须交割、无每日结算；期货每日结算、可平仓，差别在机制不在贵贱。',
        correct: false,
      },
      {
        id: 'forward-exchange',
        label: '因为远期在交易所集中交易，更安全',
        feedback:
          '还不对。说反了：远期是场外（OTC）一对一签的，期货才是在交易所集中撮合、有保证金制度。',
        correct: false,
      },
    ],
  },
  {
    id: 'deposit-insurance-80w',
    conceptId: 'deposit-insurance',
    cat: '银行',
    title:
      '张阿姨在同一家银行存了 80 万，听说存款保险只赔 50 万，想把其中 30 万转去另一家银行。你的评价是：',
    options: [
      {
        id: 'split',
        label: '有道理。同一人在同一家银行本息合计只保 50 万，分银行存放能让全额都在保障范围内',
        feedback:
          '答对了。50 万按「同一存款人、同一家银行、本息合计」计算；分开放是提高覆盖率的标准做法。',
        correct: true,
      },
      {
        id: 'no-need',
        label: '没必要折腾，银行不会出问题',
        feedback:
          '还不对。存款保险就是为「万一」准备的制度安排，而且保费由银行缴纳、储户免费——不用白不用。',
        correct: false,
      },
      {
        id: 'useless',
        label: '没用，转出去也一样不赔',
        feedback:
          '还不对。保障是按单家银行算的：换一家银行，那 30 万就落进新银行的 50 万额度里了。',
        correct: false,
      },
    ],
  },
  {
    id: 'fund-80-mislabel',
    conceptId: 'fund-80-rule',
    cat: '基金',
    title: '某基金 75% 投股票、20% 投债券、5% 现金，销售页却写着「股票型基金」。按 80% 规则判断：',
    options: [
      {
        id: 'hybrid',
        label: '名不副实。股票仓位不到 80%，各项又都未超 80%，它应该叫混合型基金',
        feedback:
          '答对了。80% 以上是股票型 / 债券型的硬线；各项都不超 80% 的，一律归入混合型。',
        correct: true,
      },
      {
        id: 'majority',
        label: '没写错，股票占大头就是股票型基金',
        feedback:
          '还不对。分类不看「大头」看硬线：股票型要求 80% 以上投股票，75% 没过线。',
        correct: false,
      },
      {
        id: 'bond-type',
        label: '写错了，它应该叫债券型基金',
        feedback:
          '还不对。债券型同样要求 80% 以上投债券——它只有 20%。两项都不过线，归混合型。',
        correct: false,
      },
    ],
  },
  {
    id: 'hammer-position',
    conceptId: 'hammer-vs-hanging',
    cat: '股票',
    title:
      '小王复盘时发现一根 K 线：小实体在顶部、下影线很长。他直接判断「这是锤子线，要涨了」。他漏看了什么？',
    options: [
      {
        id: 'position',
        label: '漏了看位置。同样的形态在下跌趋势末端才叫锤子线（见底）；在上涨末端是上吊线（见顶预警）',
        feedback:
          '答对了。形态不决定含义，位置决定含义；而且锤子线还要等次日 K 线确认才算数。',
        correct: true,
      },
      {
        id: 'volume',
        label: '漏了看成交量——没有成交量的 K 线一律不作数',
        feedback:
          '还不对。成交量是辅助参考，但这道题的关键错误是忽略形态出现的位置，而不是成交量。',
        correct: false,
      },
      {
        id: 'no-miss',
        label: '没漏，这个形态本来就是看涨信号',
        feedback:
          '还不对。同一根 K 线放在上涨末端叫上吊线，是见顶预警——单看形状就下结论恰恰是常见错误。',
        correct: false,
      },
    ],
  },
  {
    id: 'paper-gold-gift',
    conceptId: 'paper-vs-physical-gold',
    cat: '贵金属',
    title: '客户拿着手机银行里的纸黄金问：「过年想给孙子打个金锁，能把这里面的黄金提出来打吗？」',
    options: [
      {
        id: 'cannot-withdraw',
        label: '不能。纸黄金是账面买卖，全程不涉及实物交割；想拿真金得另外买实物黄金',
        feedback:
          '答对了。纸黄金是「个人凭证式黄金」，只是一条跟着报价涨跌的账面记录，提取不了实物。',
        correct: true,
      },
      {
        id: 'counter-pickup',
        label: '可以，去柜台预约一下就能提取金条',
        feedback:
          '还不对。纸黄金没有实物对应物可提——能提实物的是实物金条、积存金这类产品，不是纸黄金。',
        correct: false,
      },
      {
        id: 'pay-fee',
        label: '补一笔手续费就能把纸黄金换成实物',
        feedback:
          '还不对。这不是手续费问题：纸黄金在产品设计上就不支持实物交割，换不成金条。',
        correct: false,
      },
    ],
  },
  {
    id: 'strategies-down-market',
    conceptId: 'four-strategies',
    cat: '股票',
    title:
      '市场连跌两周，四只产品净值表现：A 大跌、B 小跌、C 微涨、D 大涨。按四种策略的典型表现，最可能的对应是：',
    options: [
      {
        id: 'a-multi-b-ls-c-neutral-d-cta',
        label: 'A 多头、B 多空、C 中性、D CTA（做空趋势盈利）',
        feedback:
          '答对了。下跌市里：多头跟跌、多空对冲后小亏、中性几乎不动、CTA 做空趋势反而大赚——震荡横盘才是 CTA 的天敌。',
        correct: true,
      },
      {
        id: 'a-cta',
        label: 'A CTA、B 中性、C 多空、D 多头',
        feedback:
          '还不对。下跌市里多头一定受损（A 才是多头）；CTA 靠做空趋势赚钱，应该是最出彩的那个（D）。',
        correct: false,
      },
      {
        id: 'all-same',
        label: '四只都只是仓位不同的多头产品，跌多跌少而已',
        feedback:
          '还不对。多空对冲和中性策略本来就不跟大盘同涨同跌——下跌市里表现分化正是策略差异的体现。',
        correct: false,
      },
    ],
  },
]

/** 按方向（分类）筛选后的列表 */
export function practiceByCat(cat: string | null): PracticeItem[] {
  if (!cat) return practiceItems
  return practiceItems.filter((p) => p.cat === cat)
}

export const practiceCats: string[] = [...new Set(practiceItems.map((p) => p.cat))]
