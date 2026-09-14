import type { ReactNode } from 'react'
import ToolDefinitionDiagram from './ToolDefinition'
import ComparisonDiagram from './ComparisonDiagram'
import MatchFlowDiagram from './MatchFlowDiagram'
import ToolGridDiagram from './ToolGridDiagram'
import StepFlowDiagram from './StepFlowDiagram'
import CanCantDiagram from './CanCantDiagram'
import TreeDiagram from './TreeDiagram'
import QuizDiagram from './QuizDiagram'

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

  return null
}
