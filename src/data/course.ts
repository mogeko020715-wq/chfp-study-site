export interface CourseModule {
  name: string
  chapters: string[]
  questions: number
  icon: string
  note?: string
}

// 六大课程板块（同步自 Notion 主页面「习题汇总」表）
export const modules: CourseModule[] = [
  {
    name: '理财规划基础',
    icon: '📐',
    chapters: ['概论', '经济环境', '金融环境', '法律基础'],
    questions: 342,
  },
  {
    name: '家庭财务规划',
    icon: '🏠',
    chapters: ['分析比率', '现金规划', '消费支出规划', '教育规划', '退休养老规划'],
    questions: 252,
  },
  {
    name: '风险管理与保险规划',
    icon: '🛡️',
    chapters: ['概论', '保险导论', '保险类别', '保险合同', '保险基本原则', '保险规划操作实务', '互联网保险'],
    questions: 459,
  },
  {
    name: '投资规划',
    icon: '📈',
    chapters: ['概述', '投资需求分析', '基础资产', '资产配置', '资产管理工具', '证券投资基金评价与选择'],
    questions: 425,
    note: '本站闪卡已收录本板块 173 题：概述、投资需求分析、基础资产（债券 / 股票）',
  },
  {
    name: '税收筹划',
    icon: '🧾',
    chapters: [],
    questions: 80,
  },
  {
    name: '税收基础',
    icon: '📚',
    chapters: [],
    questions: 39,
  },
]

export interface ToolChapter {
  icon: string
  title: string
  pages: string
  summary: string
  points: string[]
}

// 投资规划 · 金融工具学习路线（同步自 Notion 主页面，同步时间 2026-07-25）
export const toolChapters: ToolChapter[] = [
  {
    icon: '🔧',
    title: '金融工具概述',
    pages: 'P90',
    summary: '金融工具的全景入口，建立分类与风险收益的基本坐标系。',
    points: ['金融工具的定义与特征', '原生工具与衍生工具的划分'],
  },
  {
    icon: '💵',
    title: '货币市场',
    pages: 'P91-93',
    summary: '一年以内的短期资金市场，流动性管理的基石。',
    points: ['同业拆借、票据、回购', '货币市场工具的风险收益特征'],
  },
  {
    icon: '📈',
    title: '股票市场',
    pages: 'P94',
    summary: '权益类资产的核心市场，长期增值的主要来源。',
    points: ['股票估值基础', '一级市场与二级市场'],
  },
  {
    icon: '📖',
    title: '债券市场',
    pages: 'P99-103',
    summary: '固定收益资产的定价与风险管理，本站闪卡重点章节。',
    points: ['债券要素、分类与发行', '久期、凸性与利率免疫', '债券投资风险与收益来源'],
  },
  {
    icon: '🌐',
    title: '外汇市场',
    pages: 'P104',
    summary: '汇率与货币兑换的市场，全球资产配置的通道。',
    points: ['汇率标价方法', '外汇交易的参与者'],
  },
  {
    icon: '💰',
    title: '基金与证券投资基金',
    pages: 'P105-108',
    summary: '集合投资的典型形态，普通投资者入市的主要工具。',
    points: ['基金的分类与运作', '基金的费用与估值'],
  },
  {
    icon: '📊',
    title: '金融衍生品',
    pages: 'P109-112',
    summary: '远期、期货、期权与互换，风险管理与杠杆的双刃剑。',
    points: ['四类基本衍生品', '套期保值与投机'],
  },
  {
    icon: '🪙',
    title: '贵金属市场',
    pages: 'P111-112',
    summary: '黄金等贵金属的保值属性与配置价值。',
    points: ['贵金属投资方式', '与通胀、汇率的关系'],
  },
  {
    icon: '🏦',
    title: '商业银行',
    pages: 'P113-116',
    summary: '金融体系的主体，存款、贷款与中间业务的全貌。',
    points: ['银行业务与监管指标', '理财产品基础'],
  },
  {
    icon: '🏦',
    title: '证券公司',
    pages: '专题',
    summary: '资本市场的中介，经纪、投行与资管三大业务线。',
    points: ['证券公司的业务版图', '投资者适当性管理'],
  },
  {
    icon: '📊',
    title: '证券公司补充内容',
    pages: '专题',
    summary: '对证券公司板块的延伸与考点补充。',
    points: ['常考细节归纳'],
  },
  {
    icon: '🏥',
    title: '保险公司',
    pages: '专题',
    summary: '保险资金运用与保险产品设计的机构视角。',
    points: ['保险资金的投资约束', '保单与产品结构'],
  },
]

export const totalQuestions = modules.reduce((s, m) => s + m.questions, 0)
