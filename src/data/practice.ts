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
      '财经 App 弹出快讯：「在岸人民币 USDCNY 报 6.85，昨日为 6.70」。小白惊呼「数字涨了，人民币升值了！」ta 的判断：',
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
    title: '新闻说央行加息 0.25%，债券基金经理却说「今天组合亏钱了」。ta 并不慌，因为：',
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
        label: '加息利好债券，ta 在假装亏钱',
        feedback:
          '还不对。加息对存量债券是利空：新债利息更高，旧债只能降价才卖得动。',
        correct: false,
      },
      {
        id: 'default',
        label: '说明 ta 买的债券违约了',
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
      '小王复盘时发现一根 K 线：小实体在顶部、下影线很长。ta 直接判断「这是锤子线，要涨了」。ta 漏看了什么？',
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
  {
    id: 'maturity-liquidity-deposit',
    conceptId: 'maturity-vs-liquidity',
    cat: '基础概念',
    title:
      '客户买了 3 年定期存款，第 2 年突然急用钱。同事安慰 ta：「没办法，没到期就是拿不出来。」这个说法：',
    options: [
      {
        id: 'liquidity',
        label: '不准确。偿还期是「多久到期」；定期没到期也能提前支取（损失利息）——能不能马上拿到钱看的是流动性',
        feedback:
          '答对了。偿还期由合同定死，流动性随规则和市场变；「没到期」和「拿不到钱」是两回事。',
        correct: true,
      },
      {
        id: 'locked',
        label: '对，定期没到期，银行一分钱都不会给',
        feedback:
          '还不对。银行允许定期提前支取，只是提前支取部分按活期计息——「变现会致损失」正是流动性打折的定义。',
        correct: false,
      },
      {
        id: 'same-thing',
        label: '对，偿还期和流动性本来就是一回事',
        feedback:
          '还不对。反例就在身边：股票没有偿还期（永不到期），流动性却极高；房产也没有到期日，变现却要几个月。',
        correct: false,
      },
    ],
  },
  {
    id: 'convertible-exchangeable-report',
    conceptId: 'convertible-vs-exchangeable',
    cat: '债券',
    title: '研报写：「A 公司发行可交换债，持有人到期可将其转换为 A 公司的股票。」这句话：',
    options: [
      {
        id: 'wrong-subject',
        label: '写错了。能转成发行人自己股票的是可转债；可交换债换的是发行人持有的别家公司股票',
        feedback:
          '答对了。盯住「转谁的股」：自己 = 可转债，别人 = 可交换。',
        correct: true,
      },
      {
        id: 'same-name',
        label: '没写错，可转债和可交换债是同一个东西的两种叫法',
        feedback:
          '还不对。两者转换标的不同：可转债转成发行人的股，可交换债换成别家公司的股——这是考试的标准区分点。',
        correct: false,
      },
      {
        id: 'to-cash',
        label: '写错了，可交换债到期是直接换成现金的',
        feedback:
          '还不对。可交换债换的是「股票」（别家公司的），不是现金；到期直接换现金的那是普通债还本付息。',
        correct: false,
      },
    ],
  },
  {
    id: 'b-share-news',
    conceptId: 'share-classes',
    cat: '股票',
    title: '新闻说「某公司 B 股大涨」。朋友问：「B 股是不是就是用人民币买的便宜股票？」你答：',
    options: [
      {
        id: 'foreign-currency',
        label: '不是。B 股面值是人民币，但要用外币认购和买卖；用人民币买卖的是 A 股',
        feedback:
          '答对了。B 股 = 人民币面值 + 外币认购，同样在沪深上市；「面值货币」和「认购货币」别记反。',
        correct: true,
      },
      {
        id: 'cheap-rmb',
        label: '对，B 股就是人民币计价的低价股',
        feedback:
          '还不对。B 股面值确实是人民币，但买卖要用外币——它和「便宜」没有关系。',
        correct: false,
      },
      {
        id: 'hk-dollar',
        label: '不对，B 股在香港上市，用港币买',
        feedback:
          '还不对。在香港上市、用港币交易的是 H 股；B 股在上海和深圳证券交易所。',
        correct: false,
      },
    ],
  },
  {
    id: 'pe-pb-same-price',
    conceptId: 'pe-vs-pb',
    cat: '股票',
    title:
      '两只股票都卖 20 元：A 每股盈利 2 元，B 每股盈利 0.5 元。同事说「价格一样，估值也一样」。你怎么纠正？',
    options: [
      {
        id: 'pe-diff',
        label: '不对。A 的 PE 是 10，B 的 PE 是 40——股价相同，但赚钱能力不同，估值差 4 倍',
        feedback:
          '答对了。PE = 股价 ÷ 每股收益，看的是回本年限；亏损公司 PE 失真，那种场合要看 PB。',
        correct: true,
      },
      {
        id: 'same-price',
        label: '对，股价相同估值自然相同',
        feedback:
          '还不对。股价只是分子——估值高低取决于分母（盈利或净资产），单看价格没有意义。',
        correct: false,
      },
      {
        id: 'momentum',
        label: '估值不用算，看谁的股价最近涨得快就行',
        feedback:
          '还不对。涨得快是动量，不是估值；PE/PB 衡量的正是「现在这个价格对应多少真实盈利/家底」。',
        correct: false,
      },
    ],
  },
  {
    id: 'candle-color-mixup',
    conceptId: 'candle-basic',
    cat: '股票',
    title: '小白第一次看 A 股 K 线图，指着绿色柱子说「这根涨了」。ta 的理解：',
    options: [
      {
        id: 'reversed',
        label: '搞反了。中国盘面红涨绿跌：收盘高于开盘是红色阳线，低于开盘是绿色阴线',
        feedback:
          '答对了。实体两端是开盘价和收盘价，影线指向最高/最低价；颜色和欧美盘面正好相反。',
        correct: true,
      },
      {
        id: 'global-green',
        label: '没反，全球市场都是绿涨红跌',
        feedback:
          '还不对。欧美盘面确实绿涨红跌，但 A 股相反——红涨绿跌。看哪个市场就用哪套配色。',
        correct: false,
      },
      {
        id: 'color-meaningless',
        label: '颜色没有意义，只看柱子长短就行',
        feedback:
          '还不对。颜色标记的是阴阳（涨跌方向）：实体长度 + 颜色一起才构成一根 K 线的信息。',
        correct: false,
      },
    ],
  },
  {
    id: 'money-fund-convertible',
    conceptId: 'money-fund-rules',
    cat: '基金',
    title: '货币基金经理想提高收益，打算拿 10% 仓位买可转债。这个操作：',
    options: [
      {
        id: 'forbidden',
        label: '违规。货基投资范围严格受限，可转债和股票是禁区——只能买现金、短期存款、397 天内债券等',
        feedback:
          '答对了。记住「397 天」这个奇怪的数字；货基的定位决定了它碰不了任何含股性的资产。',
        correct: true,
      },
      {
        id: 'small-ok',
        label: '可以，10% 仓位不大，风险可控',
        feedback:
          '还不对。货基的限制是「品种禁区」，不是「仓位比例」——哪怕 1% 买可转债也违规。',
        correct: false,
      },
      {
        id: 'client-consent',
        label: '可以，只要在合同里写明、客户同意就行',
        feedback:
          '还不对。投资范围由监管规定，不是合同双方能协商改的——这也是货基安全性的来源。',
        correct: false,
      },
    ],
  },
  {
    id: 'option-max-loss',
    conceptId: 'option-payoff',
    cat: '衍生品',
    title: '客户花 500 元期权费买了看涨期权，到期标的大跌。ta 紧张地问：「我最多会亏多少？」',
    options: [
      {
        id: 'premium-cap',
        label: '最多亏 500 元期权费。买方的权利不行使就作废，损失封顶',
        feedback:
          '答对了。买方权利义务不对称的另一半是：卖方收了期权费，却可能承担大得多的赔付。',
        correct: true,
      },
      {
        id: 'unlimited',
        label: '理论上可能亏光本金还倒欠，杠杆产品都这样',
        feedback:
          '还不对。「可能亏光还倒欠」描述的是卖方/融资仓位的风险；期权买方的最大损失就是期权费。',
        correct: false,
      },
      {
        id: 'seller-credit',
        label: '看卖方信用好不好，亏多亏少不一定',
        feedback:
          '还不对。买方损失与卖方信用无关：权利金付了就不退，但也仅此而已。',
        correct: false,
      },
    ],
  },
  {
    id: 'gold-td-channel',
    conceptId: 'gold-exchanges',
    cat: '贵金属',
    title: '客户想在正规渠道做黄金延期交易（T+D），理财师应推荐哪个交易所？',
    options: [
      {
        id: 'sge',
        label: '上海黄金交易所——黄金 T+D、白银 T+D 是它的产品',
        feedback:
          '答对了。T+D 归上金所，期货归上期所，天通归天贵所——国务院批准的就这三家。',
        correct: true,
      },
      {
        id: 'shfe',
        label: '上海期货交易所',
        feedback: '还不对。上期所做的是黄金期货、白银期货，不是 T+D 现货延期——两家都带「上海」，别记串。',
        correct: false,
      },
      {
        id: 'tjpme',
        label: '天津贵金属交易所',
        feedback: '还不对。天贵所的产品是天通金、天通银；T+D 是上海黄金交易所的。',
        correct: false,
      },
    ],
  },
  {
    id: 'compound-vs-simple',
    conceptId: 'compound-interest',
    cat: '基础概念',
    title:
      '两个方案：甲每年 10% 复利，乙每年 12% 单利，同样放 10 年。朋友果断选乙：「每年多 2%，肯定划算」。这个判断：',
    options: [
      {
        id: 'compound-wins',
        label: '错了。10% 复利十年约 2.59 倍，12% 单利只有 2.2 倍——利滚利的差距会越拉越大',
        feedback:
          '答对了。72 法则口算也能验：10% 复利约 7.2 年翻倍，单利永远不会「利生利」。',
        correct: true,
      },
      {
        id: 'simple-wins',
        label: '对，每年多 2 个点，十年后肯定更多',
        feedback:
          '还不对。单利的利息不再产生利息；时间越长，复利指数增长对单利线性增长的碾压越明显。',
        correct: false,
      },
      {
        id: 'whatever',
        label: '两者差不多，随便选都行',
        feedback:
          '还不对。十年下来 2.59 倍 vs 2.2 倍，20 万的本金差出近 8 万——这可不是「差不多」。',
        correct: false,
      },
    ],
  },
  {
    id: 'agent-broker-side',
    conceptId: 'agent-vs-broker',
    cat: '保险',
    title: '客户想找一个「站在我这边」的人帮 ta 挑保险。应该找代理人还是经纪人？',
    options: [
      {
        id: 'broker',
        label: '找经纪人——经纪人代表投保人（买方）；代理人代表的是保险公司（卖方）',
        feedback:
          '答对了。还有一个公估人：查勘定损的中立第三方。三个角色代表谁，是高频考点。',
        correct: true,
      },
      {
        id: 'agent',
        label: '找代理人——「代理人」顾名思义就是代理客户的',
        feedback:
          '还不对。名字最容易误读：代理人代理的是保险公司，替保险公司卖产品，不是替客户挑。',
        correct: false,
      },
      {
        id: 'same',
        label: '都一样，反正都是卖保险的',
        feedback:
          '还不对。立场决定建议的可信度：卖方（代理人）和买方（经纪人）给你的推荐逻辑完全不同。',
        correct: false,
      },
    ],
  },
  {
    id: 'family-ratios-checkup',
    conceptId: 'family-ratios',
    cat: '家庭财务',
    title:
      '客户家庭：流动资产 6 万，月支出 2 万；年税后收入 30 万，年支出 24 万。理财师看完直摇头，因为：',
    options: [
      {
        id: 'both-bad',
        label: '流动性比率只有 3（偏低），结余比率 20%（低于 30% 健康线）——两个指标都不健康',
        feedback:
          '答对了。6÷2=3 刚到流动性下限，结余比率 (30−24)÷30=20% 不达标——先攒备用金再谈投资。',
        correct: true,
      },
      {
        id: 'both-good',
        label: '流动资产够 3 个月支出，结余也有 6 万，挺健康的',
        feedback:
          '还不对。流动性 3 是最低门槛，结余比率 20% 低于 30% 的健康线——两个都不算好。',
        correct: false,
      },
      {
        id: 'liquidity-ok',
        label: '流动性比率 3 很健康，只是结余略低而已',
        feedback:
          '还不对。3 是健康区间的下沿，不是「很健康」；何况结余比率 20% 已经亮红灯了。',
        correct: false,
      },
    ],
  },
  {
    id: 'emergency-fund-freelancer',
    conceptId: 'emergency-fund',
    cat: '家庭财务',
    title: '自由职业的小李每月固定支出 1.2 万，收入波动很大。ta 的紧急备用金应该留多少、放哪里？',
    options: [
      {
        id: 'six-twelve',
        label: '留 7.2–14.4 万（6–12 个月支出），放在活期存款或货币基金里',
        feedback:
          '答对了。收入不稳定就往 6–12 个月留；备用金求安全和流动，不追求收益。',
        correct: true,
      },
      {
        id: 'three-six',
        label: '留 3.6–7.2 万（3–6 个月），拿去投股票型基金赚收益',
        feedback:
          '还不对。收入不稳定要留 6–12 个月，而且备用金放股票基金是典型错误——要用钱时可能正跌着。',
        correct: false,
      },
      {
        id: 'one-month',
        label: '留 1–2 个月就够，反正随时可以借',
        feedback:
          '还不对。1–2 个月连常规下限都不够；「随时能借」是信用额度，不是流动性储备。',
        correct: false,
      },
    ],
  },
  {
    id: 'insurance-principles-case',
    conceptId: 'insurance-principles',
    cat: '保险',
    title: '客户给借钱的邻居的房子买了财产险，邻居失火烧毁了房子。保险公司应该赔付吗？',
    options: [
      {
        id: 'no-interest',
        label: '不赔。客户对邻居的房子没有保险利益，合同本身无效',
        feedback:
          '答对了。保险利益原则：你对保的东西必须有法律认可的利益，否则合同无效——判案四步的第一步就出局了。',
        correct: true,
      },
      {
        id: 'pay-fire',
        label: '赔，火灾是承保风险，按实际损失赔付',
        feedback:
          '还不对。先有保险利益才谈得到近因和赔付——没有保险利益，合同从一开始就不成立。',
        correct: false,
      },
      {
        id: 'pay-half',
        label: '赔一半，毕竟客户出了保费',
        feedback:
          '还不对。保险不是「交多少赔多少比例」的储蓄；没有保险利益的合同无效，保费应予退还而非赔付。',
        correct: false,
      },
    ],
  },
  {
    id: 'pension-pillars-sort',
    conceptId: 'pension-pillars',
    cat: '保险',
    title: '小张的养老钱：工资里扣的养老保险、公司给缴的企业年金、自己存的个人养老金。按支柱分：',
    options: [
      {
        id: 'correct-sort',
        label: '分别是第一、第二、第三支柱——国家主导、单位主导、个人主导',
        feedback:
          '答对了。记「谁主导」：一靠国家、二靠单位、三靠自己；个人养老金年缴上限 1.2 万，有税收优惠。',
        correct: true,
      },
      {
        id: 'wrong-sort',
        label: '企业年金是第一支柱，因为是企业给缴的',
        feedback:
          '还不对。支柱按主导方分：国家（基本养老）→ 单位（企业/职业年金）→ 个人（个人养老金）。',
        correct: false,
      },
      {
        id: 'all-first',
        label: '都是社保第一支柱，都是国家强制的',
        feedback:
          '还不对。只有基本养老保险是强制的；企业年金是单位自愿，个人养老金是个人自愿。',
        correct: false,
      },
    ],
  },
  {
    id: 'bonus-tax-compare',
    conceptId: 'bonus-tax',
    cat: '税收',
    title: '陈先生年终奖 20 万。人力问他选单独计税还是并入综合所得。理财师的正确做法是：',
    options: [
      {
        id: 'calculate-both',
        label: '两种方式各算一遍税额再比——单独计税与综合计税哪个省要看具体数字，没有铁律',
        feedback:
          '答对了。考试套路就是各算一次：差额就是「少缴纳 X 元」的答案。一般工资高、年终奖占比小时单独计税更省。',
        correct: true,
      },
      {
        id: 'always-separate',
        label: '一律选单独计税，单独计税总是更省',
        feedback:
          '还不对。没有「总是」：当年终奖占收入比重大时，并入综合可能反而更省——必须实际算一遍。',
        correct: false,
      },
      {
        id: 'always-combined',
        label: '一律并入综合所得，合并起来级距更平滑',
        feedback:
          '还不对。对多数中高收入者是单独计税更省；「并入更平滑」不是普遍结论。',
        correct: false,
      },
    ],
  },
  {
    id: 'education-fund-pv',
    conceptId: 'education-fund',
    cat: '家庭财务',
    title: '林女士的女儿 8 年后上大学，预计每月生活费 2000 元（读 4 年），投资收益率 3%。现在最该做的是：',
    options: [
      {
        id: 'pv-calc',
        label: '按 3% 把四年费用折现到今天，一次性或分期投入稳健工具——约 7.2 万起步',
        feedback:
          '答对了。教育金是刚性支出：年金现值 ÷ (1+3%)⁸，工具选国债/教育金保险这类稳健品种。',
        correct: true,
      },
      {
        id: 'lump-later',
        label: '到时候再说，8 年后的事不急',
        feedback:
          '还不对。教育金有时间刚性，越早准备复利越帮忙——拖到临头只能靠大额储蓄硬扛。',
        correct: false,
      },
      {
        id: 'all-stock',
        label: '全部买成股票，8 年够长，肯定跑赢通胀',
        feedback:
          '还不对。教育金刚性支出不能赌——股票的波动可能在用钱那年来个下跌，教科书建议稳健工具。',
        correct: false,
      },
    ],
  },
  {
    id: 'property-life-payout',
    conceptId: 'property-vs-life-insurance',
    cat: '保险',
    title: '同一场车祸：车修了 8 万（车损险保额 20 万），人确诊重疾（重疾险保额 50 万）。两份保险各赔多少？',
    options: [
      {
        id: 'eight-fifty',
        label: '车损险赔 8 万（按实际损失），重疾险赔 50 万（按约定保额）',
        feedback:
          '答对了。财产险走损失补偿、跟实际花费走；人身险走定额给付、买多少赔多少。',
        correct: true,
      },
      {
        id: 'both-full',
        label: '都按保额赔：20 万 + 50 万',
        feedback:
          '还不对。车损险是补偿型，损失 8 万只赔 8 万——多赔你就「因祸得福」了，损失补偿原则不允许。',
        correct: false,
      },
      {
        id: 'both-actual',
        label: '都按实际花费赔：8 万 + 医药费',
        feedback:
          '还不对。重疾险是给付型，确诊约定疾病即按保额赔，与实际医疗费无关。',
        correct: false,
      },
    ],
  },
  {
    id: 'ci-medical-complement',
    conceptId: 'ci-vs-medical',
    cat: '保险',
    title: '客户问：「我有百万医疗险了，重疾的医药费都能报，还要重疾险干嘛？」最合适的回答是：',
    options: [
      {
        id: 'living-gap',
        label: '医疗险管治病的钱，重疾险赔的保额管养病期间的收入断档——互补不替代',
        feedback:
          '答对了。医疗险先垫付后报销；重疾险确诊即给付，钱到账就能覆盖生活费、房贷、康复开支。',
        correct: true,
      },
      {
        id: 'redundant',
        label: '说得对，重复了，退掉重疾险',
        feedback:
          '还不对。医疗险只覆盖医疗费；休养半年没收入这件事，只有给付型重疾险能兜住。',
        correct: false,
      },
      {
        id: 'reverse',
        label: '正好相反：医疗险管养病，重疾险管治病',
        feedback:
          '还不对。两者恰好反过来：医疗险报销治疗费用，重疾险的保额自由支配。',
        correct: false,
      },
    ],
  },
  {
    id: 'life-cycle-strategy',
    conceptId: 'financial-life-cycle',
    cat: '家庭财务',
    title: '四位客户都要理财建议：单身小张、新婚小王、孩子上小学的老李、刚退休的老周。谁的组合最适合重仓股票？',
    options: [
      {
        id: 'single-zhang',
        label: '单身期的小张——没家庭负担、时间最长，风险承受力最高',
        feedback:
          '答对了。生命周期节奏：单身期可适度激进，形成期负债高峰先配保险，成长期抓教育金，成熟期降风险，退休期防守。',
        correct: true,
      },
      {
        id: 'retired-zhou',
        label: '刚退休的老周——有的是时间，可以放开了投',
        feedback:
          '还不对。退休期恰恰是防守期：保住现金流、流动性优先，重仓股票是大忌。',
        correct: false,
      },
      {
        id: 'growing-li',
        label: '孩子上小学的老李——教育金要增值，必须重仓股票',
        feedback:
          '还不对。成长期的教育金是刚性支出，要用稳健工具；重仓股票可能在孩子要用钱那年赶上大跌。',
        correct: false,
      },
    ],
  },
  {
    id: 'bank-trio-who',
    conceptId: 'bank-trio',
    cat: '银行',
    title: '三类机构都带「银行」二字：能直接吸收我们存款的是哪家？能发行货币的是哪家？',
    options: [
      {
        id: 'right',
        label: '吸收存款的是商业银行，发行货币的是央行——政策性银行只做政策性放贷',
        feedback:
          '答对了。央行是「银行的银行」不管个人业务；政策性银行（国开行等）贯彻政策、不计利润。',
        correct: true,
      },
      {
        id: 'wrong-central',
        label: '吸收存款的是央行——它名字最大',
        feedback:
          '还不对。央行不对个人开门：它的客户是商业银行和政府，存贷款业务是商业银行的事。',
        correct: false,
      },
      {
        id: 'wrong-policy',
        label: '都能吸收存款也都能发行货币，只是分工不同',
        feedback:
          '还不对。发行货币是央行的专属权力；政策性银行不吸收公众存款，只做政策性放贷。',
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
