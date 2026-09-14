import type { ReactNode } from 'react'
import ToolDefinitionDiagram from './ToolDefinition'
import ComparisonDiagram from './ComparisonDiagram'
import MatchFlowDiagram from './MatchFlowDiagram'
import ToolGridDiagram from './ToolGridDiagram'
import StepFlowDiagram from './StepFlowDiagram'
import CanCantDiagram from './CanCantDiagram'
import TreeDiagram from './TreeDiagram'
import QuizDiagram from './QuizDiagram'
import TradeoffDiagram from './TradeoffDiagram'

/**
 * 知识点图解注册表：按「章节 + 知识点标题」匹配，命中即在知识点页展示图解并折叠原文。
 * 新增图解时在此添加一条映射即可；优先复用通用模板（Comparison / MatchFlow / ToolGrid / StepFlow / CanCant / Tree / Quiz）。
 */
export function diagramFor(chapterTitle: string, pointTitle: string): ReactNode | null {
  if (chapterTitle === '金融工具概述' && pointTitle.includes('定义')) {
    return <ToolDefinitionDiagram />
  }
  if (chapterTitle === '金融工具概述' && pointTitle.includes('偿还期')) {
    return (
      <ComparisonDiagram
        caption="图解 · 一个是时间本身，一个是能不能动"
        sides={[
          {
            name: '偿还期',
            tagline: '时间维度 · 我多久能拿回本金？',
            rows: [
              { label: '关注', value: '时间长度（多久到期）' },
              { label: '能否改变', value: '不能，合同签了就不变' },
              { label: '例子', value: '3 个月国债 → 3 个月后还本' },
            ],
          },
          {
            name: '流动性',
            tagline: '灵活维度 · 我现在急用能马上卖吗？',
            rows: [
              { label: '关注', value: '变现能力（能不能马上卖）' },
              { label: '能否改变', value: '受市场行情影响' },
              { label: '例子', value: '股票随时挂牌卖出（可能亏本）' },
            ],
          },
        ]}
        bottom="口诀：偿还期是「等多久」，流动性是「能不能不等」。"
      />
    )
  }

  /* ================= 货币市场 ================= */

  if (chapterTitle === '货币市场' && pointTitle.includes('什么是货币市场')) {
    return (
      <MatchFlowDiagram
        caption="图解 · 让短期闲钱和短期用钱的人对上"
        left={{ name: '资金盈余方', desc: '企业 / 银行 / 政府，钱暂时闲着' }}
        right={{ name: '资金短缺方', desc: '临时周转：发工资、付货款、补头寸' }}
        center="货币市场"
        centerTag="期限 ≤ 1 年"
        leftLabel="出借"
        rightLabel="借入"
        bottom="例：企业 3 个月后要付供应商货款——先把闲钱借出去赚利息，到期刚好收回付钱。"
      />
    )
  }

  if (chapterTitle === '货币市场' && pointTitle.includes('有哪些工具')) {
    return (
      <ToolGridDiagram
        caption="图解 · 五大货币市场工具，一句话记住每个"
        items={[
          { name: '短期国债', desc: '政府发的短期借条', note: '3/6/9/12 个月到期，信用最高' },
          { name: '短期融资券', desc: '企业发的短期借条', note: '无担保，但大企业信用好' },
          { name: '回购协议', desc: '先卖后买回来的借款', note: '实质是抵押借款' },
          { name: '票据', desc: '商业 / 银行汇票', note: '承诺到期付款的凭证' },
          { name: '货币市场基金', desc: '集合大家的钱买上面这些', note: '投资范围严格受限，非常安全' },
        ]}
        bottom="口诀：国债是国家的、融资券是企业的、回购是抵押的、票据是凭证、基金是打包。"
      />
    )
  }

  if (chapterTitle === '货币市场' && pointTitle.includes('回购协议')) {
    return (
      <StepFlowDiagram
        caption="图解 · 回购协议 = 戴着「卖出」帽子的抵押借款"
        steps={[
          { title: '银行 A 缺 1 个月资金', desc: '手头紧，但手里有一批国债（市值 1000 万）。' },
          { title: '「卖」国债给银行 B', desc: '先把国债卖给 B，拿到 980 万现金——看似买卖，实为抵押。' },
          { title: '约定 1 个月后买回', desc: '到期 A 以 985 万把国债买回来。' },
          { title: '差价 5 万 = 利息', desc: '980 借、985 还，5 万就是这笔借款的利息。' },
        ]}
        bottom="关键点：不是真卖，是抵押（抵押品通常是国债）；双方都安全——借钱的有抵押，出借的有国债在手。"
      />
    )
  }

  if (chapterTitle === '货币市场' && pointTitle.includes('货币市场基金')) {
    return (
      <CanCantDiagram
        caption="图解 · 货币基金的钱只能买「很安全的东西」"
        can={['现金', '1 年以内的存款', '债券回购', '央行票据', '同业存单', '397 天以内的债券', '资产支持证券']}
        cant={['2 年以上的存款', '股票', '可转债']}
        note="为什么卡 397 天？≈ 1 年 + 1 个月的安全边际，怎么算都不到 1 年期以上。"
        bottom="因为买货币基金的人想保本、随时取——所以投资范围被严格限制在短期、低风险的货币市场工具。"
      />
    )
  }

  if (chapterTitle === '货币市场' && pointTitle.includes('核心逻辑')) {
    return (
      <MatchFlowDiagram
        caption="图解 · 货币市场 = 短期资金的中介"
        left={{ name: '有短期闲置钱的人', desc: '钱闲着也是闲着，想赚点利息' }}
        right={{ name: '需要短期借钱的人', desc: '只是临时周转，不是长期缺钱' }}
        center="金融工具"
        centerTag="期限 ≤ 1 年"
        leftLabel="投出"
        rightLabel="融入"
        bottom="为什么期限要 ≤ 1 年？短 = 风险可控：借 1 个月，到期大概率还得起；借 10 年，中间可能出各种事。"
      />
    )
  }

  if (chapterTitle === '货币市场' && pointTitle.includes('子市场分类')) {
    return (
      <TreeDiagram
        caption="图解 · 货币市场这个大篮子，里面分五个子市场"
        root="货币市场"
        children={[
          { name: '短期债券市场', desc: '交易对象：短期国债（3/6/9/12 个月），政府 ↔ 投资者' },
          { name: '票据市场', desc: '商业票据（企业信用）+ 银行承兑汇票（银行信用），企业 ↔ 投资者/银行' },
          { name: '回购市场', desc: '交易对象：回购协议（抵押借款），金融机构之间' },
          { name: '同业拆借市场', desc: '无担保短期借贷，银行 ↔ 银行' },
          { name: '货币市场基金市场', desc: '交易对象：货币基金份额，散户 ↔ 基金公司' },
        ]}
        bottom="易考对应关系：回购协议在回购市场交易、同业拆借只发生在银行之间。"
      />
    )
  }

  if (chapterTitle === '货币市场' && pointTitle.includes('两个市场')) {
    return (
      <>
        <ComparisonDiagram
          caption="图解 · 回购市场 vs 同业拆借市场"
          sides={[
            {
              name: '回购市场',
              tagline: '有抵押的借款',
              rows: [
                { label: '交易对象', value: '回购协议' },
                { label: '安全性', value: '高（有国债抵押）' },
                { label: '利率', value: '通常较低' },
              ],
            },
            {
              name: '同业拆借市场',
              tagline: '无抵押的信用借款',
              rows: [
                { label: '交易对象', value: '同业拆借协议' },
                { label: '安全性', value: '较高（只限银行间，信用审核严格）' },
                { label: '利率', value: '通常略高' },
              ],
            },
          ]}
          bottom="为什么银行要同业拆借？每天收盘后有的银行钱多、有的钱少，多的借给少的，隔夜或 7 天，第二天还。"
        />
        <ComparisonDiagram
          caption="图解 · 商业票据 vs 银行承兑汇票"
          sides={[
            {
              name: '商业票据（短期融资券）',
              tagline: '企业信用',
              rows: [
                { label: '风险', value: '较高（企业可能违约）' },
                { label: '利率', value: '较高' },
              ],
            },
            {
              name: '银行承兑汇票',
              tagline: '银行信用',
              rows: [
                { label: '风险', value: '较低（银行担保）' },
                { label: '利率', value: '较低' },
              ],
            },
          ]}
          bottom="信用越好，利率越低：银行信用 > 企业信用。"
        />
      </>
    )
  }

  if (chapterTitle === '货币市场' && pointTitle.includes('易错点')) {
    return (
      <QuizDiagram
        caption="图解 · 易错点：考的是「对应关系」"
        question="回购协议在哪个市场交易？"
        options={['股票市场', '回购市场', '期货市场', '外汇市场']}
        answer={1}
        explanation="答案 B。虽然听起来像废话，但考试就是考这个对应关系——工具名 ≈ 市场名。"
      />
    )
  }

  if (chapterTitle === '货币市场' && pointTitle.includes('练习题')) {
    return (
      <QuizDiagram
        caption="图解 · 章节练习题"
        question="以下关于货币市场的说法，正确的是？"
        options={[
          '货币市场的交易对象都是期限在 1 年以上的金融工具',
          '回购市场实质是有抵押的借款市场',
          '同业拆借是银行与企业之间的资金借贷',
          '货币市场基金可以投资股票和可转债',
        ]}
        answer={1}
        explanation="答案 B。A 错在「1 年以上」（应 ≤1 年）；C 错在拆借只发生在银行之间；D 错在货币基金不能买股票和可转债。"
      />
    )
  }

  /* ================= 金融工具概述（补充） ================= */

  if (chapterTitle === '金融工具概述' && pointTitle.includes('四大特征')) {
    return (
      <ToolGridDiagram
        caption="图解 · 四大特征，口诀「还、流、险、收」"
        items={[
          { name: '偿还期', desc: '偿还本金前经历的时间', note: '时间维度 · 我多久能拿回本金？' },
          { name: '流动性', desc: '迅速变现而不致损失', note: '灵活维度 · 急用能马上卖吗？' },
          { name: '风险性', desc: '本金和收益遭受损失的可能性', note: '安全维度 · 会不会亏？' },
          { name: '收益性', desc: '为持有者带来收入', note: '回报维度 · 能赚多少？' },
        ]}
        bottom="易错：四大特征是「还流险收」，没有便捷性、没有保本性！"
      />
    )
  }

  if (chapterTitle === '金融工具概述' && pointTitle.includes('关系理解')) {
    return (
      <TradeoffDiagram
        caption="图解 · 高收益、低风险、高流动 —— 不可兼得"
        corners={['高收益', '低风险', '高流动性']}
        center="最多取其二"
        pairs={[
          { pick: ['低风险', '高流动性'], give: '高收益', example: '货币基金、活期存款' },
          { pick: ['高收益', '低风险'], give: '高流动性', example: '长期定期存款' },
          { pick: ['高收益', '高流动性'], give: '低风险', example: '股票' },
        ]}
      />
    )
  }

  /* ================= 债券市场 ================= */

  if (chapterTitle === '债券市场' && pointTitle.includes('政府债券')) {
    return (
      <ToolGridDiagram
        caption="图解 · 政府债券三兄弟"
        items={[
          { name: '国债', desc: '中央政府发行，1 年以上', note: '金边债券：无信用风险，收益率 = 无风险利率基准' },
          { name: '国库券', desc: '1 年以内', note: '⚠️ 属货币市场工具，不在债券市场' },
          { name: '地方政府债', desc: '用于地方建设', note: '期限多样，有税收优惠' },
        ]}
        bottom="核心考点：国债 = 金边债券（Gilt-edged），风险最低。"
      />
    )
  }

  if (chapterTitle === '债券市场' && pointTitle.includes('金融债券')) {
    return (
      <ToolGridDiagram
        caption="图解 · 金融债券：都是金融机构发的，信用各不相同"
        items={[
          { name: '政策性金融债', desc: '国开行、农发行、进出口银行', note: '国家信用背书 = 准国债' },
          { name: '商业银行债', desc: '商业银行', note: '补充资本金或中长期资金' },
          { name: '非银行金融机构债', desc: '券商、保险、信托', note: '资质参差，看具体机构' },
        ]}
        bottom="风险排序：国债 < 政策性金融债 < 商业银行债 < 非银行金融机构债。"
      />
    )
  }

  if (chapterTitle === '债券市场' && pointTitle.includes('公司债券')) {
    return (
      <ToolGridDiagram
        caption="图解 · 公司债券四品种"
        items={[
          { name: '普通公司债', desc: '到期还本付息', note: '最标准，无附加权利' },
          { name: '可转换债券', desc: '可转为发行公司的股票', note: '债转股：向下保底、向上有弹性' },
          { name: '分离交易可转债', desc: '债券和认股权证分开交易', note: '权证可单独买卖' },
          { name: '可交换债券', desc: '可交换为「其他公司」的股票', note: '⚠️ 不是发行人自己的股票！' },
        ]}
        bottom="核心考点：可转换 vs 可交换 = 转自己的股 vs 转别人的股；评级低于 BBB = 垃圾债券。"
      />
    )
  }

  if (chapterTitle === '债券市场' && pointTitle.includes('国际债券')) {
    return (
      <ComparisonDiagram
        caption="图解 · 外国债券 vs 欧洲债券（按发行地点分）"
        sides={[
          {
            name: '外国债券',
            tagline: '在 A 国发行、以 A 国货币计价',
            rows: [{ label: '例', value: '扬基（美/美元）、武士（日/日元）、熊猫（中/人民币）' }],
          },
          {
            name: '欧洲债券',
            tagline: '在 A 国发行、以 B 国货币计价',
            rows: [{ label: '特点', value: '发行地与计价货币不同，与「欧洲」无关' }],
          },
        ]}
        bottom="按发行主体再分：主权国家债（发展中国家政府外债）、超国家机构债（世界银行、IMF）。"
      />
    )
  }

  if (chapterTitle === '债券市场' && pointTitle.includes('考试重点速记')) {
    return (
      <ToolGridDiagram
        caption="图解 · 债券市场六大考点"
        items={[
          { name: '风险最低', desc: '国债（金边债券）' },
          { name: '无风险利率基准', desc: '国债收益率' },
          { name: '准国债', desc: '政策性金融债（国开行等）' },
          { name: '可转债 vs 可交换债', desc: '转自己的股 vs 转别人的股' },
          { name: '欧洲债券特点', desc: '发行地与计价货币不同' },
          { name: '熊猫债券', desc: '外国主体在中国发行的人民币债' },
        ]}
      />
    )
  }

  /* ================= 外汇市场 ================= */

  if (chapterTitle === '外汇市场' && pointTitle.includes('即期交易')) {
    return (
      <StepFlowDiagram
        caption="图解 · 即期交易：成交后两个营业日内交割（T+2）"
        steps={[
          { title: '成交（T 日）', desc: '双方按即期汇率（Spot Rate）约定买卖外汇。' },
          { title: 'T+1', desc: '期间最常见的日常外汇交易形式，无额外操作。' },
          { title: 'T+2 交割', desc: '两个营业日内完成实际资金交割。' },
        ]}
        bottom="关键词：即时交割、即期汇率、最常见。"
      />
    )
  }

  if (chapterTitle === '外汇市场' && pointTitle.includes('远期交易')) {
    return (
      <StepFlowDiagram
        caption="图解 · 远期交易：现在锁定未来的汇率"
        steps={[
          { title: '现在签约', desc: '场外（OTC）一对一协商，约定未来某日期、按预先约定的汇率交割。' },
          { title: '持有到期', desc: '非标准化合约，条款灵活定制；期间不结算。' },
          { title: '到期必须交割', desc: '不可反向平仓，按签约汇率履约——无论市场汇率怎么变。' },
        ]}
        bottom="主要功能：套期保值——企业锁定成本，规避汇率波动风险。"
      />
    )
  }

  if (chapterTitle === '外汇市场' && pointTitle.includes('期货交易')) {
    return (
      <ComparisonDiagram
        caption="图解 · 外汇期货 vs 外汇远期"
        sides={[
          {
            name: '外汇期货',
            tagline: '交易所内标准化',
            rows: [
              { label: '结算', value: '每日结算（Mark-to-Market）' },
              { label: '了结', value: '可反向平仓，极少实物交割' },
              { label: '保障', value: '保证金制度' },
            ],
          },
          {
            name: '外汇远期',
            tagline: '场外一对一协商',
            rows: [
              { label: '结算', value: '到期一次性结算' },
              { label: '了结', value: '到期必须交割' },
              { label: '保障', value: '无（靠对手方信用）' },
            ],
          },
        ]}
        bottom="别称必考：外汇期货 = 外汇保证金交易 = 合约现货外汇交易 = 按金交易 = 虚盘交易（注意：合约现货 ≠ 合约期货！）"
      />
    )
  }

  if (chapterTitle === '外汇市场' && pointTitle.includes('期权交易')) {
    return (
      <ComparisonDiagram
        caption="图解 · 看涨 vs 看跌：花钱买「选择权」"
        sides={[
          {
            name: '看涨期权 Call',
            tagline: '有权以约定价格买入',
            rows: [{ label: '什么时候买', value: '预期汇率上涨时' }],
          },
          {
            name: '看跌期权 Put',
            tagline: '有权以约定价格卖出',
            rows: [{ label: '什么时候买', value: '预期汇率下跌时' }],
          },
        ]}
        bottom="权利义务不对称：买方有权利无义务（最大损失=期权费），卖方有义务无权利；欧式只能到期日行权，美式到期前任何时间可行权。"
      />
    )
  }

  if (chapterTitle === '外汇市场' && pointTitle.includes('四大工具对比总结')) {
    return (
      <ToolGridDiagram
        caption="图解 · 四大外汇工具一句话区分"
        items={[
          { name: '即期', desc: '银行间市场，T+2 必须交割', note: '功能：实际结算' },
          { name: '远期', desc: '场外 OTC，非标准化', note: '功能：套期保值（到期必须交割）' },
          { name: '期货', desc: '交易所标准化合约', note: '功能：投机/套保（可平仓了结）' },
          { name: '期权', desc: '交易所/OTC，可标准化', note: '功能：风险管理（权利而非义务）' },
        ]}
        bottom="关键理解：即期/远期/期货/期权是通用金融工具，外汇只是应用场景之一。"
      />
    )
  }

  /* ================= 基金与证券投资基金 ================= */

  if (chapterTitle === '基金与证券投资基金' && pointTitle.includes('基本概念')) {
    return (
      <StepFlowDiagram
        caption="图解 · 基金 = 凑份子 + 请专业的人打理"
        steps={[
          { title: '集合理财', desc: '发售基金份额，把众多投资者的资金集中起来——散户资金汇成大河。' },
          { title: '分工管理', desc: '基金托管人（银行）管钱，基金管理人（基金公司）投资股票、债券等。' },
          { title: '按份分配', desc: '投资收益按投资者的份额比例分配——赚了一起分，亏了一起扛。' },
        ]}
        bottom="四大特点：集合理财专业管理 · 组合投资分散风险 · 利益共享风险共担 · 严格监管信息透明。"
      />
    )
  }

  if (chapterTitle === '基金与证券投资基金' && pointTitle.includes('分类')) {
    return (
      <ToolGridDiagram
        caption="图解 · 按投资对象分四类，风险从高到低"
        items={[
          { name: '股票型基金', desc: '80% 以上投股票', note: '高风险高收益' },
          { name: '债券型基金', desc: '80% 以上投债券', note: '中低风险稳定收益' },
          { name: '混合型基金', desc: '股债现金灵活配', note: '中等风险，比例最灵活' },
          { name: '货币市场基金', desc: '短期货币工具', note: '低风险，流动性好' },
        ]}
        bottom="⚠️ 股票型基金不是只买股票——是 80% 以上买股票，剩下可配债券/现金。"
      />
    )
  }

  if (chapterTitle === '基金与证券投资基金' && pointTitle.includes('当事人')) {
    return (
      <ToolGridDiagram
        caption="图解 · 基金四方当事人，各管一摊"
        items={[
          { name: '份额持有人', desc: '投资者——出钱的人' },
          { name: '基金管理人', desc: '基金公司——管钱投资的人' },
          { name: '基金托管人', desc: '商业银行——保管资金的人' },
          { name: '基金销售机构', desc: '银行/券商/平台——卖基金的人' },
        ]}
        bottom="连接已学知识：基金托管人通常是商业银行 ↔ 商业银行的基金托管业务。"
      />
    )
  }

  if (chapterTitle === '基金与证券投资基金' && pointTitle.includes('收益与费用')) {
    return (
      <ComparisonDiagram
        caption="图解 · 钱从哪来（收益），花到哪去（费用）"
        sides={[
          {
            name: '收益来源',
            tagline: '基金帮你赚的钱',
            rows: [
              { label: '利息', value: '债券利息、存款利息' },
              { label: '股息', value: '股票分红' },
              { label: '差价', value: '低买高卖的资本利得' },
            ],
          },
          {
            name: '主要费用',
            tagline: '养基金花的钱',
            rows: [
              { label: '买入', value: '认购费 / 申购费' },
              { label: '卖出', value: '赎回费' },
              { label: '持有', value: '管理费 + 托管费（按年收）' },
            ],
          },
        ]}
        bottom="记忆钩子：买时申购费、卖时赎回费、年年管理托管费。"
      />
    )
  }

  if (chapterTitle === '基金与证券投资基金' && pointTitle.includes('易错点')) {
    return (
      <ToolGridDiagram
        caption="图解 · 基金四大易错点"
        items={[
          { name: '股票型基金 ≠ 全股票', desc: '是 80% 以上投股票，其余可配债券/现金' },
          { name: '混合型基金最灵活', desc: '基金经理根据市场调整股债比例' },
          { name: '货币基金 ≠ 银行存款', desc: '不保本，但风险极低、流动性接近活期' },
          { name: '净值 ≠ 价格', desc: '净值是每份真实价值，申购赎回按净值计算' },
        ]}
      />
    )
  }

  /* ================= 金融衍生品 ================= */

  if (chapterTitle === '金融衍生品' && pointTitle.includes('基本概念')) {
    return (
      <MatchFlowDiagram
        caption="图解 · 衍生品的价值「衍生」自基础资产"
        left={{ name: '基础资产', desc: '股票 / 债券 / 外汇 / 利率 / 商品 / 指数' }}
        right={{ name: '四大衍生工具', desc: '远期 / 期货 / 期权 / 互换' }}
        center="金融衍生品"
        leftLabel="价值之源"
        rightLabel="具体形态"
        bottom="四大特性：派生性（价值来自基础资产）、杠杆性（保证金撬动大额）、高风险性（放大盈亏）、双重功能（套保 + 投机）。"
      />
    )
  }

  if (chapterTitle === '金融衍生品' && pointTitle.includes('远期合约')) {
    return (
      <StepFlowDiagram
        caption="图解 · 远期合约的生命周期"
        steps={[
          { title: '场外签约', desc: '一对一协商，非标准化合约，约定未来某日期按预定价格买卖。' },
          { title: '持有期间', desc: '无每日结算，盈亏到期才一次性算清。' },
          { title: '到期交割', desc: '双方必须履约——没有交易所担保，对手方违约就是信用风险。' },
        ]}
        bottom="关键词：OTC、非标准化、到期必须交割、无每日结算、有信用风险。"
      />
    )
  }

  if (chapterTitle === '金融衍生品' && pointTitle.includes('期货合约')) {
    return (
      <StepFlowDiagram
        caption="图解 · 期货合约的一天"
        steps={[
          { title: '交保证金开仓', desc: '只交合约金额的一小部分（如 10%）——杠杆由此而来。' },
          { title: '每日结算', desc: 'Mark-to-Market：每天收盘按结算价算盈亏，亏多了要追加保证金。' },
          { title: '反向平仓了结', desc: '做一笔反方向交易平仓，绝大多数合约不走到实物交割。' },
        ]}
        bottom="关键词：交易所标准化、保证金、每日结算、可平仓。"
      />
    )
  }

  if (chapterTitle === '金融衍生品' && pointTitle.includes('期权')) {
    return (
      <ComparisonDiagram
        caption="图解 · 看涨 Call vs 看跌 Put"
        sides={[
          {
            name: '看涨期权 Call',
            tagline: '有权按执行价格买入',
            rows: [{ label: '用在', value: '预期基础资产价格上涨' }],
          },
          {
            name: '看跌期权 Put',
            tagline: '有权按执行价格卖出',
            rows: [{ label: '用在', value: '预期基础资产价格下跌' }],
          },
        ]}
        bottom="买方风险有限（最大损失=期权费），卖方风险可能无限；欧式只能到期日行权，美式到期前任何时间可行权。"
      />
    )
  }

  if (chapterTitle === '金融衍生品' && pointTitle.includes('互换')) {
    return (
      <MatchFlowDiagram
        caption="图解 · 互换 = 交换一系列现金流"
        left={{ name: '甲方', desc: '手里是固定利率，想要浮动' }}
        right={{ name: '乙方', desc: '手里是浮动利率，想要固定' }}
        center="利率互换"
        leftLabel="付出固定"
        rightLabel="付出浮动"
        bottom="不是交换资产，是交换现金流（货币互换除外——本金也换）；OTC、非标准化、期限较长。常见：利率互换、货币互换、商品互换。"
      />
    )
  }

  if (chapterTitle === '金融衍生品' && pointTitle.includes('易错点')) {
    return (
      <ToolGridDiagram
        caption="图解 · 衍生品五大易错点"
        items={[
          { name: '远期 ≠ 期货', desc: '远期场外非标准化、到期必须交割；期货交易所标准化、可平仓' },
          { name: '期权买方风险有限', desc: '最大损失就是期权费；卖方风险可能无限' },
          { name: '结算方式不同', desc: '期货每日结算 ≠ 远期到期结算' },
          { name: '互换不交换资产', desc: '交换的是「现金流」，本金通常不动（货币互换除外）' },
          { name: '杠杆程度排序', desc: '期货 > 期权 > 远期 > 互换' },
        ]}
        bottom="💡 本质：远期/期货锁定价格，期权锁定选择权，互换锁定交换条件——都是「现在约定未来按什么条件交易」。"
      />
    )
  }

  return null
}
