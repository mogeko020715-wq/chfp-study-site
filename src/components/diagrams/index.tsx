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

  /* ================= 贵金属市场 ================= */

  if (chapterTitle === '贵金属市场' && pointTitle.includes('贵金属概述')) {
    return (
      <ToolGridDiagram
        caption="图解 · 贵金属的三大投资属性"
        items={[
          { name: '商品属性', desc: '工业用途 + 珠宝首饰，是白银的主要属性（工业占比约 50%）' },
          { name: '货币属性', desc: '历史上长期作为货币，至今仍是各国央行储备资产' },
          { name: '金融属性', desc: '避险工具、通胀对冲、资产配置——考试最常考的一层' },
        ]}
        bottom="四大贵金属：黄金、白银、铂金、钯金。"
      />
    )
  }

  if (chapterTitle === '贵金属市场' && pointTitle.includes('黄金市场')) {
    return (
      <ToolGridDiagram
        caption="图解 · 黄金投资的四种方式与五大价格因素"
        items={[
          { name: '实物黄金', desc: '金条、金币、金饰——长期保值，适合实物持有偏好', note: '实物' },
          { name: '纸黄金', desc: '账面买卖、无实物交割——短期交易、操作便捷', note: '账面' },
          { name: '黄金 ETF', desc: '交易所交易基金——机构与散户都适用', note: '场内' },
          { name: '黄金期货', desc: '杠杆交易、双向操作——专业投资者', note: '杠杆' },
        ]}
        bottom="价格五大因素：① 美元指数（负相关，美元强 → 黄金弱）② 实际利率（名义利率-通胀率，升 → 黄金弱）③ 通胀预期（升 → 黄金涨）④ 地缘政治（危机 → 避险 → 涨）⑤ 央行购金（需求增加）。"
      />
    )
  }

  if (chapterTitle === '贵金属市场' && pointTitle.includes('白银市场')) {
    return (
      <ComparisonDiagram
        caption="图解 · 白银 vs 黄金：不是「小黄金」"
        sides={[
          {
            name: '白银',
            tagline: '贵金属属性 + 工业属性 双重属性',
            rows: [
              { label: '工业占比', value: '约 50%（光伏、电子、医疗）' },
              { label: '价格弹性', value: '波动更大，弹性高' },
              { label: '避险强度', value: '弱于黄金' },
            ],
          },
          {
            name: '黄金',
            tagline: '以货币与金融属性为主',
            rows: [
              { label: '工业占比', value: '很低，需求以投资与储备为主' },
              { label: '价格弹性', value: '相对平稳' },
              { label: '避险强度', value: '全球公认避险资产' },
            ],
          },
        ]}
        bottom="易错点：白银不能简单视为「小黄金」——工业属性强，波动远大于黄金。"
      />
    )
  }

  if (chapterTitle === '贵金属市场' && pointTitle.includes('投资组合')) {
    return (
      <ToolGridDiagram
        caption="图解 · 贵金属在组合中的三大作用"
        items={[
          { name: '避险功能', desc: '股市大跌时，黄金往往上涨，组合里的「稳定器」' },
          { name: '通胀对冲', desc: '长期通胀环境下保值，实际利率走低时尤其受益' },
          { name: '分散风险', desc: '与股票、债券相关性低，降低组合整体波动' },
        ]}
        bottom="配置建议：贵金属占家庭金融资产 5%-15%，以黄金为主、白银为辅。"
      />
    )
  }

  if (chapterTitle === '贵金属市场' && pointTitle.includes('易错点提醒')) {
    return (
      <ToolGridDiagram
        caption="图解 · 贵金属三大易错点"
        items={[
          { name: '纸黄金 ≠ 实物黄金', desc: '纸黄金是账面资产，不能提取实物——遇到实物兑付题要警惕' },
          { name: '负相关不是铁律', desc: '黄金与美元长期负相关，但危机时美元、黄金可能同涨' },
          { name: '不生利息', desc: '贵金属本身不产生利息/股息，持有成本（保管、机会成本）要考虑' },
        ]}
      />
    )
  }

  /* ================= 商业银行 ================= */

  if (chapterTitle === '商业银行' && pointTitle.includes('性质与特征')) {
    return (
      <ToolGridDiagram
        caption="图解 · 商业银行的三大核心特征"
        items={[
          { name: '营利性', desc: '以营利为目的——区别于政策性银行' },
          { name: '信用中介', desc: '一边吸收存款、一边发放贷款，连接资金盈余方与短缺方' },
          { name: '信用创造', desc: '存贷循环可以派生存款、放大货币供给——银行独有功能' },
        ]}
        bottom="考试关键词：「信用创造」是商业银行区别于其他金融机构的核心。"
      />
    )
  }

  if (chapterTitle === '商业银行' && pointTitle.includes('三大业务')) {
    return (
      <MatchFlowDiagram
        caption="图解 · 三大业务看「资金流向」"
        left={{ name: '负债业务（资金来源）', desc: '存款 70%+、同业拆借、向央行借款、发行金融债券' }}
        right={{ name: '资产业务（资金运用）', desc: '贷款（最核心）、证券投资、现金资产' }}
        center="商业银行"
        leftLabel="钱进来"
        rightLabel="钱出去"
        bottom="中间业务（表外）：支付结算、代理、银行卡、担保承诺、理财——只提供服务、不碰资金，赚手续费。中间业务 ⊂ 表外业务。"
      />
    )
  }

  if (chapterTitle === '商业银行' && pointTitle.includes('经营原则')) {
    return (
      <StepFlowDiagram
        caption="图解 · 三性原则的优先顺序"
        steps={[
          { title: '安全性（前提）', desc: '先控制风险、保障资金安全——银行是高杠杆经营，安全是底线。' },
          { title: '流动性（条件）', desc: '随时满足客户提款和贷款需求，资产要能较快变现。' },
          { title: '效益性（目标）', desc: '在前两者的约束下追求利润最大化。' },
        ]}
        bottom="三者存在矛盾：想多赚钱 → 要放贷/投资高风险资产 → 安全和流动性下降。考试记：安全是前提、流动是条件、效益是目标。"
      />
    )
  }

  if (chapterTitle === '商业银行' && pointTitle.includes('存款保险制度')) {
    return (
      <ToolGridDiagram
        caption="图解 · 存款保险三要点"
        items={[
          { name: '投保机构', desc: '商业银行、农村合作银行、农村信用合作社' },
          { name: '最高偿付限额', desc: '人民币 50 万元/人', note: '必考数字' },
          { name: '谁交保费', desc: '由投保机构缴纳，储户不承担' },
        ]}
        bottom="易错点：50 万是「同一存款人在同一家银行」的本息合计，不是每家银行各 50 万。"
      />
    )
  }

  /* ================= 证券公司 ================= */

  if (chapterTitle === '证券公司' && pointTitle.includes('什么是证券公司')) {
    return (
      <ToolGridDiagram
        caption="图解 · 什么是证券公司"
        items={[
          { name: '设立门槛', desc: '必须经证监会批准，依《公司法》《证券法》设立' },
          { name: '业务范围', desc: '专门围绕证券（股票、债券、基金等）展开' },
          { name: '市场角色', desc: '连接投资者与证券市场的重要桥梁' },
        ]}
        bottom="一句话记忆：商业银行管钱，证券公司管证券。"
      />
    )
  }

  if (chapterTitle === '证券公司' && pointTitle.includes('六大核心业务')) {
    return (
      <ToolGridDiagram
        caption="图解 · 六大核心业务：钱从哪来、为谁服务"
        items={[
          { name: '证券经纪', desc: '代客买卖证券，赚佣金', note: '普通投资者' },
          { name: '投资咨询', desc: '投资建议、研报分析', note: '机构/高净值' },
          { name: '承销与保荐', desc: '帮企业 IPO、发债，包销证券', note: '发行人' },
          { name: '证券自营', desc: '用自有资金投资证券，自担风险', note: '券商自己' },
          { name: '资产管理', desc: '代客理财，赚管理费+业绩提成', note: '机构/个人' },
          { name: '融资融券', desc: '借钱买股（融资）、借股卖出（融券）', note: '合格投资者' },
        ]}
        bottom="易混淆三连：经纪=中介赚佣金、自营=自己炒股、资管=帮客户炒。"
      />
    )
  }

  if (chapterTitle === '证券公司' && pointTitle.includes('商业银行')) {
    return (
      <ComparisonDiagram
        caption="图解 · 证券公司 vs 商业银行"
        sides={[
          {
            name: '证券公司',
            tagline: '管证券',
            rows: [
              { label: '核心业务', value: '证券发行、交易、承销' },
              { label: '盈利方式', value: '佣金、承销费、投资收益' },
              { label: '风险特征', value: '与市场波动强相关' },
              { label: '监管主体', value: '证监会' },
              { label: '客户资金', value: '第三方存管（银行托管）' },
            ],
          },
          {
            name: '商业银行',
            tagline: '管钱',
            rows: [
              { label: '核心业务', value: '存贷款、支付结算' },
              { label: '盈利方式', value: '存贷利差、手续费' },
              { label: '风险特征', value: '信用风险为主' },
              { label: '监管主体', value: '金融监管总局' },
              { label: '客户资金', value: '直接吸收存款' },
            ],
          },
        ]}
        bottom="关键区别：商业银行可以创造信用（存贷循环），证券公司不能。"
      />
    )
  }

  if (chapterTitle === '证券公司' && pointTitle.includes('本节要点速记')) {
    return (
      <ToolGridDiagram
        caption="图解 · 本节要点速记"
        items={[
          { name: '三驾马车', desc: '经纪、承销、资管——券商最核心的三大业务' },
          { name: '自营 vs 代客', desc: '自营是自己炒，资管是帮客户炒' },
          { name: '融资融券', desc: '杠杆工具，风险放大器' },
          { name: '与银行核心区别', desc: '不吸收存款，不创造信用' },
        ]}
      />
    )
  }

  /* ================= 证券公司补充内容 ================= */

  if (chapterTitle === '证券公司补充内容' && pointTitle.includes('资产管理业务')) {
    return (
      <ToolGridDiagram
        caption="图解 · 资管业务三种形式"
        items={[
          { name: '集合资产管理', desc: '多个客户的钱统一托管、统一投资', note: '门槛低·普通投资者' },
          { name: '专项资产管理', desc: '为特定目标设立专门账户', note: '特定需求机构/个人' },
          { name: '定向资产管理', desc: '一对一服务，定制化投资', note: '大客户·机构投资者' },
        ]}
        bottom="记忆口诀：多对一（集合）→ 特定目标（专项）→ 一对一（定向）。"
      />
    )
  }

  if (chapterTitle === '证券公司补充内容' && pointTitle.includes('国际业务')) {
    return (
      <ComparisonDiagram
        caption="图解 · QDII vs RQFII：方向相反"
        sides={[
          {
            name: 'QDII 合格境内机构投资者',
            tagline: '境内 → 境外',
            rows: [
              { label: '资金方向', value: '境内募集资金，境外投资' },
              { label: '作用', value: '让国内投资者间接参与海外市场' },
            ],
          },
          {
            name: 'RQFII 人民币合格境外机构投资者',
            tagline: '境外 → 境内（用人民币）',
            rows: [
              { label: '资金方向', value: '境外机构用人民币投资境内市场' },
              { label: '与 QFII 区别', value: 'RQFII 用人民币，QFII 用外币' },
            ],
          },
        ]}
        bottom="易错点：QDII 是境内→境外，不是境外→境内；QFII 投资顾问只出谋划策、不直接管理资金；境外经纪业务主要在香港。"
      />
    )
  }

  /* ================= 保险公司 ================= */

  if (chapterTitle === '保险公司' && pointTitle.includes('保险公司基础')) {
    return (
      <ToolGridDiagram
        caption="图解 · 保险公司的四大核心特征"
        items={[
          { name: '经营对象：风险', desc: '经营的是无形、不确定的风险，先收保费、后可能赔付' },
          { name: '负债性', desc: '负债先于资产确定——准备金管理至关重要' },
          { name: '长期性', desc: '寿险合同动辄数十年，负债久期长' },
          { name: '社会性', desc: '兼具经济补偿 + 社会管理功能' },
        ]}
      />
    )
  }

  if (chapterTitle === '保险公司' && pointTitle.includes('保险分类体系')) {
    return (
      <ToolGridDiagram
        caption="图解 · 保险四大分类维度（必考）"
        items={[
          { name: '按保险标的', desc: '财产保险（保物：房屋、车辆、货物）vs 人身保险（保人：生命、健康、意外）' },
          { name: '按实施方式', desc: '强制保险（法律规定必须买，如交强险）vs 自愿保险' },
          { name: '按承保方式', desc: '原保险（投保人与保险人直接签约）vs 再保险（保险公司把风险转给其他保险公司）' },
          { name: '按赔付方式', desc: '定额给付（约定金额一次性给付，如寿险）vs 损失补偿（按实际损失赔，不超保额，如财产险）' },
        ]}
        bottom="交叉记忆：财产险多为损失补偿，人身险多为定额给付——两条线别混淆。"
      />
    )
  }

  if (chapterTitle === '保险公司' && pointTitle.includes('三大支柱')) {
    return (
      <ToolGridDiagram
        caption="图解 · 人身保险三大支柱"
        items={[
          { name: '人寿保险', desc: '保生存/死亡，定额给付', note: '定期寿险·终身寿险·两全·年金' },
          { name: '健康保险', desc: '保疾病/医疗费用，定额或报销', note: '重疾险·医疗险·护理险' },
          { name: '意外伤害保险', desc: '保意外导致的伤残/死亡，定额给付', note: '综合意外险·交通意外险' },
        ]}
        bottom="口诀：寿（命）、健（康）、意（外）——「人身上三件事」。"
      />
    )
  }

  if (chapterTitle === '保险公司' && pointTitle.includes('保险中介')) {
    return (
      <ComparisonDiagram
        caption="图解 · 代理人 vs 经纪人：代表谁？"
        sides={[
          {
            name: '保险代理人',
            tagline: '代表保险公司（卖方）',
            rows: [{ label: '做什么', value: '为保险公司销售保险产品' }],
          },
          {
            name: '保险经纪人',
            tagline: '代表投保人（买方）——容易混淆！',
            rows: [{ label: '做什么', value: '站在客户立场，帮客户挑选保险' }],
          },
        ]}
        bottom="公估人：中立第三方，负责查勘、定损、理赔——既不卖方也不买方。"
      />
    )
  }

  if (chapterTitle === '保险公司' && pointTitle.includes('资金运用')) {
    return (
      <ToolGridDiagram
        caption="图解 · 保险资金五大运用渠道（风险由低到高）"
        items={[
          { name: '银行存款', desc: '最安全，收益低', note: '低风险' },
          { name: '债券', desc: '国债/金融债为主，较稳健', note: '中低风险' },
          { name: '基础设施债权', desc: '期限长，收益稳', note: '中低风险' },
          { name: '不动产', desc: '长期持有，流动性差', note: '中风险' },
          { name: '股票', desc: '比例受限，波动大', note: '中高风险' },
        ]}
        bottom="监管红线：权益类资产（股票+基金）比例有上限，防止保险公司过度冒险——保险资金以「稳」为先。"
      />
    )
  }

  if (chapterTitle === '保险公司' && pointTitle.includes('易错点提醒')) {
    return (
      <ToolGridDiagram
        caption="图解 · 保险三大易错点"
        items={[
          { name: '再保险 ≠ 重复保险', desc: '再保险：A 保险公司把风险分给 B 保险公司；重复保险：同一投保人向多家买同一保险' },
          { name: '定额给付 vs 损失补偿', desc: '人身险多为定额给付（买 100 万赔 100 万）；财产险多为损失补偿（按实际损失赔，不超保额）' },
          { name: '代理人 vs 经纪人', desc: '代理人代表保险公司（卖方），经纪人代表投保人（买方）' },
        ]}
      />
    )
  }

  return null
}
