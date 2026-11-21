import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Nav from '@/sections/Nav'
import Footer from '@/sections/Footer'
import { useMastered } from '@/hooks/useMastered'
import { getSession } from '@/lib/account'

const sliderCls = 'w-full accent-neutral-900'
const labelCls = 'text-xs text-neutral-500'

type ToolInputs = {
  checkup: { income: number; expense: number; liquid: number; invest: number; networth: number; debt: number }
  bonus: { salary: number; bonus: number; deduct: number }
  education: { childAge: number; collegeAge: number; monthly: number; rate: number; saved: number }
  pension: { age: number; retireAge: number; saved: number; monthlySave: number; rate: number; monthlyCost: number; yearsAfter: number }
  emergency: { monthly: number; stable: boolean; saved: number }
  deposit: { bankA: number; bankB: number; bankC: number }
  dca: { monthly: number; rate: number; years: number }
}

const DEFAULTS: ToolInputs = {
  checkup: { income: 2, expense: 1.5, liquid: 6, invest: 20, networth: 80, debt: 0.4 },
  bonus: { salary: 2, bonus: 20, deduct: 1000 },
  education: { childAge: 8, collegeAge: 18, monthly: 2000, rate: 3, saved: 3 },
  pension: { age: 35, retireAge: 60, saved: 30, monthlySave: 3000, rate: 4, monthlyCost: 8000, yearsAfter: 20 },
  emergency: { monthly: 1.5, stable: true, saved: 3 },
  deposit: { bankA: 80, bankB: 30, bankC: 0 },
  dca: { monthly: 2000, rate: 5, years: 15 },
}

function toolsKey() {
  const s = getSession()
  return s ? `chfp-tools-v1:${s}` : 'chfp-tools-v1'
}

function loadInputs(): ToolInputs {
  try {
    const raw = localStorage.getItem(toolsKey())
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return DEFAULTS
}

function ToolSection({
  title,
  subtitle,
  conceptId,
  children,
}: {
  title: string
  subtitle: string
  conceptId: string
  children: React.ReactNode
}) {
  return (
    <section className="card mt-6 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
          <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>
        </div>
        <Link
          to={`/concepts?c=${conceptId}`}
          className="shrink-0 text-xs font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900"
        >
          原理 →
        </Link>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function NumInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label} <span className="font-medium text-neutral-900">{value}{unit}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className={sliderCls}
      />
    </label>
  )
}

/* ===== 工具 1：家庭财务体检 ===== */
function CheckupTool({ v, set }: { v: ToolInputs['checkup']; set: (p: Partial<ToolInputs['checkup']>) => void }) {
  const liqRatio = v.expense > 0 ? v.liquid / v.expense : 0
  const saveRatio = v.income > 0 ? (v.income - v.expense) / v.income : 0
  const investRatio = v.networth > 0 ? v.invest / v.networth : 0
  const debtRatio = v.income > 0 ? v.debt / v.income : 0

  const metrics = [
    {
      name: '流动性比率',
      value: liqRatio.toFixed(1),
      target: '3–6',
      ok: liqRatio >= 3 && liqRatio <= 6,
      advice: liqRatio < 3 ? '备用金偏少，先补到 3 个月支出' : liqRatio > 6 ? '备用金过多，部分可转投' : '流动性健康',
    },
    {
      name: '结余比率',
      value: `${Math.round(saveRatio * 100)}%`,
      target: '≥30%',
      ok: saveRatio >= 0.3,
      advice: saveRatio < 0 ? '入不敷出，先砍支出' : saveRatio < 0.3 ? '结余偏低，攒钱速度跟不上目标' : '储蓄节奏良好',
    },
    {
      name: '投资与净资产比率',
      value: `${Math.round(investRatio * 100)}%`,
      target: '≥50%',
      ok: investRatio >= 0.5,
      advice: investRatio < 0.5 ? '资产在睡大觉，可提高投资占比' : '资产运转良好',
    },
    {
      name: '负债收入比',
      value: `${Math.round(debtRatio * 100)}%`,
      target: '≤40%',
      ok: debtRatio <= 0.4,
      advice: debtRatio > 0.4 ? '月供压力偏大，谨防现金流风险' : '负债可控',
    },
  ]
  const badCount = metrics.filter((m) => !m.ok).length
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NumInput label="月税后收入" value={v.income} min={0.3} max={10} step={0.1} unit=" 万" onChange={(x) => set({ income: x })} />
        <NumInput label="月支出" value={v.expense} min={0.2} max={8} step={0.1} unit=" 万" onChange={(x) => set({ expense: x })} />
        <NumInput label="流动资产" value={v.liquid} min={0} max={100} step={1} unit=" 万" onChange={(x) => set({ liquid: x })} />
        <NumInput label="投资资产" value={v.invest} min={0} max={500} step={5} unit=" 万" onChange={(x) => set({ invest: x })} />
        <NumInput label="净资产" value={v.networth} min={10} max={1000} step={10} unit=" 万" onChange={(x) => set({ networth: x })} />
        <NumInput label="月负债还款" value={v.debt} min={0} max={5} step={0.1} unit=" 万" onChange={(x) => set({ debt: x })} />
      </div>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
        <p className="text-sm font-medium text-neutral-900">
          {badCount === 0 ? '四项指标全部健康 ✅' : `${badCount} 项需要注意 ⚠️`}
        </p>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {metrics.map((m) => (
            <p key={m.name} className="text-xs leading-relaxed">
              <span className={m.ok ? 'text-emerald-700' : 'text-amber-700'}>{m.ok ? '●' : '●'}</span>{' '}
              <span className="text-neutral-600">{m.name}</span>{' '}
              <span className="font-medium text-neutral-900">{m.value}</span>
              <span className="text-neutral-400">（{m.target}）</span>
              <span className="text-neutral-500"> — {m.advice}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===== 工具 2：年终奖计税选择器 ===== */
const ANNUAL_BRACKETS: [number, number, number][] = [
  [36000, 0.03, 0],
  [144000, 0.1, 2520],
  [300000, 0.2, 16920],
  [420000, 0.25, 31920],
  [660000, 0.3, 52920],
  [960000, 0.35, 85920],
  [Infinity, 0.45, 181920],
]
function taxOf(taxable: number, brackets: [number, number, number][]) {
  if (taxable <= 0) return 0
  for (const [cap, rate, ded] of brackets) {
    if (taxable <= cap) return taxable * rate - ded
  }
  return 0
}
function BonusTool({ v, set }: { v: ToolInputs['bonus']; set: (p: Partial<ToolInputs['bonus']>) => void }) {
  const monthlyBrackets = ANNUAL_BRACKETS.map(([c, r, d]) => [c / 12, r, d / 12] as [number, number, number])
  const bonusSeparate = taxOf(v.bonus * 10000, monthlyBrackets)
  const salaryTaxBase = v.salary * 120000 - 60000 - v.deduct * 12
  const salaryTax = taxOf(salaryTaxBase, ANNUAL_BRACKETS)
  const separateTotal = salaryTax + bonusSeparate
  const combinedTax = taxOf(salaryTaxBase + v.bonus * 10000, ANNUAL_BRACKETS)
  const separateBetter = separateTotal < combinedTax
  const diff = Math.round(Math.abs(combinedTax - separateTotal))
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <NumInput label="月工资" value={v.salary} min={0.3} max={8} step={0.1} unit=" 万" onChange={(x) => set({ salary: x })} />
        <NumInput label="年终奖" value={v.bonus} min={1} max={60} step={1} unit=" 万" onChange={(x) => set({ bonus: x })} />
        <NumInput label="月专项附加扣除" value={v.deduct} min={0} max={5000} step={100} unit=" 元" onChange={(x) => set({ deduct: x })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ['单独计税', separateTotal, separateBetter],
            ['并入综合所得', combinedTax, !separateBetter],
          ] as const
        ).map(([name, tax, better]) => (
          <div key={name} className={`rounded-lg border px-4 py-3 ${better ? 'border-emerald-500 bg-emerald-50' : 'border-neutral-200 bg-neutral-50'}`}>
            <p className="text-sm text-neutral-500">{name}</p>
            <p className="mt-1 text-xl font-bold text-neutral-900">¥{Math.round(tax).toLocaleString()}</p>
            {better && <p className="mt-0.5 text-xs font-medium text-emerald-700">更划算 ✓</p>}
          </div>
        ))}
      </div>
      <p className="text-sm text-neutral-600">
        选<span className="font-semibold text-neutral-900">{separateBetter ? '单独计税' : '并入综合所得'}</span>，
        一年省 <span className="font-semibold text-emerald-700">¥{diff.toLocaleString()}</span> 的税。
      </p>
    </div>
  )
}

/* ===== 工具 3：教育金规划器 ===== */
function EducationTool({ v, set }: { v: ToolInputs['education']; set: (p: Partial<ToolInputs['education']>) => void }) {
  const n = Math.max(v.collegeAge - v.childAge, 1)
  const r = v.rate / 100
  const annuityFactor = (1 - Math.pow(1 + r, -4)) / r
  const pvCollege = v.monthly * 12 * annuityFactor // 上大学时需备好的钱
  const lumpSum = pvCollege / Math.pow(1 + r, n) // 现在一次性要存
  const monthlyRate = r / 12
  const monthlyPmt = (pvCollege * monthlyRate) / (Math.pow(1 + monthlyRate, n * 12) - 1) // 每月定投
  const progress = Math.min(v.saved / (lumpSum / 10000), 1)
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NumInput label="孩子现在" value={v.childAge} min={0} max={17} step={1} unit=" 岁" onChange={(x) => set({ childAge: x })} />
        <NumInput label="上大学时" value={v.collegeAge} min={v.childAge + 1} max={25} step={1} unit=" 岁" onChange={(x) => set({ collegeAge: x })} />
        <NumInput label="月生活费预估" value={v.monthly} min={1000} max={5000} step={100} unit=" 元" onChange={(x) => set({ monthly: x })} />
        <NumInput label="年收益率" value={v.rate} min={1} max={8} step={0.5} unit="%" onChange={(x) => set({ rate: x })} />
        <NumInput label="已有储备" value={v.saved} min={0} max={100} step={1} unit=" 万" onChange={(x) => set({ saved: x })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="text-sm text-neutral-500">一次性投入</p>
          <p className="mt-1 text-xl font-bold text-neutral-900">{(lumpSum / 10000).toFixed(1)} 万</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="text-sm text-neutral-500">或每月定投</p>
          <p className="mt-1 text-xl font-bold text-neutral-900">¥{Math.round(monthlyPmt).toLocaleString()}</p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>已有储备 {v.saved} 万</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded bg-neutral-100">
          <div className="h-full rounded bg-emerald-600 transition-all duration-300" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-neutral-400">
          {progress >= 1 ? '储备已达标 🎉' : `还需准备 ${(lumpSum / 10000 - v.saved).toFixed(1)} 万`}
        </p>
      </div>
    </div>
  )
}

/* ===== 工具 4：养老缺口测算 ===== */
function PensionTool({ v, set }: { v: ToolInputs['pension']; set: (p: Partial<ToolInputs['pension']>) => void }) {
  const n = Math.max(v.retireAge - v.age, 1)
  const r = v.rate / 100
  const fvSaved = v.saved * Math.pow(1 + r, n)
  const fvMonthly = v.monthlySave > 0 && r > 0 ? ((v.monthlySave * 12) / 10000) * ((Math.pow(1 + r, n) - 1) / r) : 0
  const total = fvSaved + fvMonthly
  const annuityFactor = (1 - Math.pow(1 + r, -v.yearsAfter)) / r
  const needed = (v.monthlyCost * 12 * annuityFactor) / 10000
  const gap = needed - total
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NumInput label="现在年龄" value={v.age} min={20} max={59} step={1} unit=" 岁" onChange={(x) => set({ age: x })} />
        <NumInput label="退休年龄" value={v.retireAge} min={v.age + 1} max={70} step={1} unit=" 岁" onChange={(x) => set({ retireAge: x })} />
        <NumInput label="目前养老储备" value={v.saved} min={0} max={500} step={5} unit=" 万" onChange={(x) => set({ saved: x })} />
        <NumInput label="每月定投" value={v.monthlySave} min={0} max={20000} step={500} unit=" 元" onChange={(x) => set({ monthlySave: x })} />
        <NumInput label="预期年收益率" value={v.rate} min={1} max={10} step={0.5} unit="%" onChange={(x) => set({ rate: x })} />
        <NumInput label="退休后月支出预期" value={v.monthlyCost} min={2000} max={30000} step={500} unit=" 元" onChange={(x) => set({ monthlyCost: x })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="text-sm text-neutral-500">退休时预计储备</p>
          <p className="mt-1 text-xl font-bold text-neutral-900">{total.toFixed(0)} 万</p>
          <p className="mt-0.5 text-xs text-neutral-400">现有 {v.saved} 万滚存 + 定投累计</p>
        </div>
        <div className={`rounded-lg border px-4 py-3 ${gap <= 0 ? 'border-emerald-500 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
          <p className="text-sm text-neutral-500">退休生活需要（{v.yearsAfter} 年折现）</p>
          <p className="mt-1 text-xl font-bold text-neutral-900">{needed.toFixed(0)} 万</p>
          <p className={`mt-0.5 text-xs font-medium ${gap <= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {gap <= 0 ? `盈余 ${Math.abs(gap).toFixed(0)} 万，可以松口气 ✅` : `缺口 ${gap.toFixed(0)} 万 ⚠️`}
          </p>
        </div>
      </div>
      {gap > 0 && (
        <p className="text-sm text-neutral-600">
          要补上缺口：每月定投需增至约{' '}
          <span className="font-semibold text-neutral-900">
            ¥{Math.round(v.monthlySave + (gap * 10000 * r) / 12 / (Math.pow(1 + r, n) - 1)).toLocaleString()}
          </span>
          ，或退休后再工作 {Math.ceil(gap / ((v.monthlyCost * 12) / 10000))} 年。
        </p>
      )}
    </div>
  )
}

/* ===== 工具 5：紧急备用金配置单 ===== */
function EmergencyTool({ v, set }: { v: ToolInputs['emergency']; set: (p: Partial<ToolInputs['emergency']>) => void }) {
  const lo = v.stable ? 3 : 6
  const hi = v.stable ? 6 : 12
  const loAmt = v.monthly * lo
  const hiAmt = v.monthly * hi
  const status = v.saved < loAmt ? 'short' : v.saved > hiAmt ? 'over' : 'ok'
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <NumInput label="月固定支出" value={v.monthly} min={0.3} max={5} step={0.1} unit=" 万" onChange={(x) => set({ monthly: x })} />
        <NumInput label="已有流动储备" value={v.saved} min={0} max={60} step={1} unit=" 万" onChange={(x) => set({ saved: x })} />
        <div>
          <span className={labelCls}>收入稳定度</span>
          <div className="mt-1.5 flex gap-2">
            {([
              [true, '稳定'],
              [false, '不稳定'],
            ] as const).map(([val, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => set({ stable: val })}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  v.stable === val
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
        <p className="text-sm">
          建议储备{' '}
          <span className="font-semibold text-neutral-900">
            {loAmt.toFixed(1)} – {hiAmt.toFixed(1)} 万
          </span>
          <span className="ml-1 text-xs text-neutral-400">（{lo}–{hi} 个月支出）</span>
        </p>
        <p className={`mt-1.5 text-sm font-medium ${status === 'ok' ? 'text-emerald-700' : 'text-amber-700'}`}>
          {status === 'short' && `目前 ${v.saved} 万，还差 ${(loAmt - v.saved).toFixed(1)} 万才到下限`}
          {status === 'ok' && `目前 ${v.saved} 万，在建议区间内 ✅`}
          {status === 'over' && `目前 ${v.saved} 万，超出上限 ${(v.saved - hiAmt).toFixed(1)} 万可考虑转投`}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          配置建议：1 个月放活期存款，2–3 个月放货币基金，其余可放短债基金——求安全和流动，不追求收益。
        </p>
      </div>
    </div>
  )
}

/* ===== 工具 6：存款保险检查器 ===== */
function DepositTool({ v, set }: { v: ToolInputs['deposit']; set: (p: Partial<ToolInputs['deposit']>) => void }) {
  const banks = (
    [
      ['A 行', v.bankA, 'bankA'],
      ['B 行', v.bankB, 'bankB'],
      ['C 行', v.bankC, 'bankC'],
    ] as const
  ).filter(([, amt]) => amt > 0)
  const totalCovered = banks.reduce((s, [, amt]) => s + Math.min(amt, 50), 0)
  const totalUncovered = banks.reduce((s, [, amt]) => s + Math.max(amt - 50, 0), 0)
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <NumInput label="A 行存款" value={v.bankA} min={0} max={200} step={5} unit=" 万" onChange={(x) => set({ bankA: x })} />
        <NumInput label="B 行存款" value={v.bankB} min={0} max={200} step={5} unit=" 万" onChange={(x) => set({ bankB: x })} />
        <NumInput label="C 行存款" value={v.bankC} min={0} max={200} step={5} unit=" 万" onChange={(x) => set({ bankC: x })} />
      </div>
      <div className="space-y-2">
        {banks.map(([name, amt]) => {
          const covered = Math.min(amt, 50)
          const over = amt - covered
          return (
            <div key={name} className="flex items-center gap-2 text-xs">
              <span className="w-12 shrink-0 text-neutral-500">{name}</span>
              <div className="flex h-4 flex-1 overflow-hidden rounded bg-neutral-100">
                <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${(covered / 200) * 100}%` }} />
                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(over / 200) * 100}%` }} />
              </div>
              <span className="w-36 shrink-0 text-right text-neutral-600">
                {amt} 万{over > 0 && <span className="text-rose-600">（{over} 万不保）</span>}
              </span>
            </div>
          )
        })}
      </div>
      <p className="text-sm text-neutral-600">
        受保障合计 <span className="font-semibold text-emerald-700">{totalCovered} 万</span>
        {totalUncovered > 0 && (
          <>
            {' · '}<span className="font-semibold text-rose-600">{totalUncovered} 万超出 50 万上限</span>
            ——把超出的部分转到还没用的那家银行，就全额在保障内了
          </>
        )}
      </p>
    </div>
  )
}

/* ===== 工具 7：定投复利计算器 ===== */
function DcaTool({ v, set }: { v: ToolInputs['dca']; set: (p: Partial<ToolInputs['dca']>) => void }) {
  const r = v.rate / 100 / 12
  const months = v.years * 12
  const fv = r > 0 ? v.monthly * ((Math.pow(1 + r, months) - 1) / r) : v.monthly * months
  const invested = v.monthly * months
  const earnings = fv - invested
  const invW = (invested / fv) * 100
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <NumInput label="每月定投" value={v.monthly} min={100} max={20000} step={100} unit=" 元" onChange={(x) => set({ monthly: x })} />
        <NumInput label="预期年收益率" value={v.rate} min={0} max={15} step={0.5} unit="%" onChange={(x) => set({ rate: x })} />
        <NumInput label="坚持" value={v.years} min={1} max={40} step={1} unit=" 年" onChange={(x) => set({ years: x })} />
      </div>
      <p className="text-center text-sm">
        {v.years} 年后约{' '}
        <span className="text-xl font-bold text-neutral-900">{(fv / 10000).toFixed(1)} 万</span>
      </p>
      <div>
        <div className="flex h-5 overflow-hidden rounded text-[10px] leading-5 text-white">
          <div className="bg-neutral-900 transition-all duration-300" style={{ width: `${invW}%` }}>
            <span className="px-2">本金 {(invested / 10000).toFixed(1)} 万</span>
          </div>
          <div className="bg-emerald-600 transition-all duration-300" style={{ width: `${100 - invW}%` }}>
            <span className="px-2">收益 {(earnings / 10000).toFixed(1)} 万</span>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-neutral-400">
        复利效应：{Math.round((earnings / invested) * 100)}% 的钱是「利滚利」赚出来的
      </p>
    </div>
  )
}

export default function ToolsPage() {
  const { count } = useMastered()
  const [inputs, setInputs] = useState<ToolInputs>(loadInputs)

  useEffect(() => {
    try {
      localStorage.setItem(toolsKey(), JSON.stringify(inputs))
    } catch {
      /* ignore */
    }
  }, [inputs])

  const patch = <K extends keyof ToolInputs>(key: K) => (p: Partial<ToolInputs[K]>) =>
    setInputs((prev) => ({ ...prev, [key]: { ...prev[key], ...p } }))

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Nav masteredCount={count} />
      <main className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <section className="py-8">
          <h2 className="text-title">理财工具箱</h2>
          <p className="text-body mt-2">
            概念图鉴讲原理，这里用你自己的数字算。输入自动保存在本机，下次打开还在。
          </p>

          <ToolSection title="家庭财务体检" subtitle="输入你的收支与资产，看四项关键指标健不健康" conceptId="family-ratios">
            <CheckupTool v={inputs.checkup} set={patch('checkup')} />
          </ToolSection>

          <ToolSection title="年终奖计税选择器" subtitle="单独计税还是并入综合所得，算一遍就知道" conceptId="bonus-tax">
            <BonusTool v={inputs.bonus} set={patch('bonus')} />
          </ToolSection>

          <ToolSection title="教育金规划器" subtitle="孩子几年后上大学，现在该一次性存多少、每月投多少" conceptId="education-fund">
            <EducationTool v={inputs.education} set={patch('education')} />
          </ToolSection>

          <ToolSection title="养老缺口测算" subtitle="按现在的储备和定投速度，退休时够不够花" conceptId="pension-pillars">
            <PensionTool v={inputs.pension} set={patch('pension')} />
          </ToolSection>

          <ToolSection title="紧急备用金配置单" subtitle="月支出 × 3–6 个月，算你该留多少、差多少" conceptId="emergency-fund">
            <EmergencyTool v={inputs.emergency} set={patch('emergency')} />
          </ToolSection>

          <ToolSection title="存款保险检查器" subtitle="各行存款对照 50 万上限，看有没有裸奔的部分" conceptId="deposit-insurance">
            <DepositTool v={inputs.deposit} set={patch('deposit')} />
          </ToolSection>

          <ToolSection title="定投复利计算器" subtitle="每月定投 × 收益率 × 年数，看复利能滚多大" conceptId="compound-interest">
            <DcaTool v={inputs.dca} set={patch('dca')} />
          </ToolSection>
        </section>
      </main>
      <Footer />
    </div>
  )
}
