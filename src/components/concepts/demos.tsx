/* eslint-disable react-refresh/only-export-components */
import { useState, type ComponentType } from 'react'
import type { DemoKind } from '@/data/concepts'

const sliderCls = 'w-full accent-neutral-900'
const labelCls = 'text-xs text-neutral-500'

/* 不可能三角：最多同时选两样 */
function TriangleDemo() {
  const items = ['高收益', '低风险', '高流动']
  const [picked, setPicked] = useState<string[]>(['低风险', '高流动'])
  const [hint, setHint] = useState(false)
  const toggle = (it: string) => {
    if (picked.includes(it)) {
      setPicked(picked.filter((p) => p !== it))
      setHint(false)
    } else if (picked.length >= 2) {
      setHint(true)
    } else {
      setPicked([...picked, it])
      setHint(false)
    }
  }
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((it) => {
          const on = picked.includes(it)
          return (
            <button
              key={it}
              type="button"
              onClick={() => toggle(it)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                on
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
              }`}
            >
              {it}
            </button>
          )
        })}
      </div>
      <p className={`text-xs ${hint ? 'text-rose-600' : 'text-neutral-400'}`}>
        {hint ? '三者不可兼得——这就是「不可能三角」' : `已选 ${picked.length}/2 样，试着再点第三个`}
      </p>
    </div>
  )
}

/* 复利 vs 单利 */
function CompoundDemo() {
  const [rate, setRate] = useState(10)
  const [years, setYears] = useState(10)
  const r = rate / 100
  const compound = Math.pow(1 + r, years)
  const simple = 1 + r * years
  const max = Math.max(compound, simple)
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelCls}>年收益率 {rate}%</span>
          <input type="range" min={1} max={15} value={rate} onChange={(e) => setRate(+e.target.value)} className={sliderCls} />
        </label>
        <label className="block">
          <span className={labelCls}>持有 {years} 年</span>
          <input type="range" min={1} max={30} value={years} onChange={(e) => setYears(+e.target.value)} className={sliderCls} />
        </label>
      </div>
      {[
        { name: '复利', mult: compound, cls: 'bg-neutral-900' },
        { name: '单利', mult: simple, cls: 'bg-neutral-300' },
      ].map((row) => (
        <div key={row.name} className="flex items-center gap-2 text-xs">
          <span className="w-8 text-neutral-500">{row.name}</span>
          <div className="h-4 flex-1 overflow-hidden rounded bg-neutral-100">
            <div
              className={`h-full rounded transition-all duration-300 ${row.cls}`}
              style={{ width: `${(row.mult / max) * 100}%` }}
            />
          </div>
          <span className="w-14 text-right font-medium text-neutral-900">{row.mult.toFixed(2)}×</span>
        </div>
      ))}
      <p className="text-center text-xs text-neutral-400">10 万本金 · 72 法则：{rate > 0 ? (72 / rate).toFixed(1) : '—'} 年翻倍</p>
    </div>
  )
}

/* 债券价格与市场利率反向（永续债近似） */
function BondRateDemo() {
  const [rate, setRate] = useState(4)
  const coupon = 4
  const price = (100 * coupon) / rate
  const diff = price - 100
  const tag = diff > 0.5 ? '溢价' : diff < -0.5 ? '折价' : '平价'
  return (
    <div className="w-full space-y-3">
      <label className="block">
        <span className={labelCls}>市场利率 {rate}%（票面固定 {coupon}%）</span>
        <input type="range" min={1} max={10} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} className={sliderCls} />
      </label>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-8 text-neutral-500">价格</span>
        <div className="relative h-4 flex-1 rounded bg-neutral-100">
          <div
            className="absolute top-0 h-full rounded bg-neutral-900 transition-all duration-300"
            style={{ width: `${Math.min(price / 200, 1) * 100}%` }}
          />
          <div className="absolute top-[-3px] h-[22px] w-px bg-neutral-400" style={{ left: '50%' }} />
        </div>
        <span className="w-16 text-right font-medium text-neutral-900">¥{price.toFixed(1)}</span>
      </div>
      <p className="text-center text-xs text-neutral-400">
        面值 ¥100 · 当前<span className="font-medium text-neutral-700">{tag}</span>
        {rate !== coupon && `（利率${rate > coupon ? '升' : '降'} → 价格${rate > coupon ? '跌' : '涨'}）`}
        · 以永续债近似演示
      </p>
    </div>
  )
}

/* A股 / B股 / H股 */
const SHARES: Record<string, { rows: [string, string][] }> = {
  A股: { rows: [['面值货币', '人民币'], ['认购货币', '人民币'], ['上市地点', '上海 / 深圳']] },
  B股: { rows: [['面值货币', '人民币'], ['认购货币', '外币'], ['上市地点', '上海 / 深圳']] },
  H股: { rows: [['面值货币', '港币'], ['认购货币', '港币'], ['上市地点', '香港联交所']] },
}
function SharesDemo() {
  const [cur, setCur] = useState<keyof typeof SHARES>('B股')
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {(Object.keys(SHARES) as (keyof typeof SHARES)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setCur(k)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              cur === k
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="mx-auto w-full max-w-60 divide-y divide-neutral-100 rounded-lg border border-neutral-200 text-sm">
        {SHARES[cur].rows.map(([k, v]) => (
          <div key={k} className="flex justify-between px-3 py-1.5">
            <span className="text-neutral-500">{k}</span>
            <span className="font-medium text-neutral-900">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* 基金 80% 规则 */
function Fund80Demo() {
  const [stock, setStock] = useState(85)
  const [bond, setBond] = useState(10)
  const cash = 100 - stock - bond
  const kind = stock >= 80 ? '股票型基金' : bond >= 80 ? '债券型基金' : '混合型基金'
  return (
    <div className="w-full space-y-3">
      <label className="block">
        <span className={labelCls}>股票仓位 {stock}% {stock >= 80 && '≥ 80%'}</span>
        <input type="range" min={0} max={100 - bond} value={stock} onChange={(e) => setStock(+e.target.value)} className={sliderCls} />
      </label>
      <label className="block">
        <span className={labelCls}>债券仓位 {bond}% {bond >= 80 && '≥ 80%'}</span>
        <input type="range" min={0} max={100 - stock} value={bond} onChange={(e) => setBond(+e.target.value)} className={sliderCls} />
      </label>
      <div className="flex h-4 overflow-hidden rounded text-[10px] leading-4 text-white">
        <div className="bg-neutral-900 transition-all duration-300" style={{ width: `${stock}%` }} />
        <div className="bg-neutral-500 transition-all duration-300" style={{ width: `${bond}%` }} />
        <div className="bg-neutral-300 transition-all duration-300" style={{ width: `${cash}%` }} />
      </div>
      <p className="text-center text-sm">
        <span className="text-neutral-500">这是一只</span>{' '}
        <span className="font-semibold text-neutral-900">{kind}</span>
        <span className="ml-1 text-xs text-neutral-400">（现金 {cash}%）</span>
      </p>
    </div>
  )
}

/* 期权买方：最大亏损 = 期权费 */
function OptionPayoffDemo() {
  const [kind, setKind] = useState<'call' | 'put'>('call')
  const [spot, setSpot] = useState(110)
  const strike = 100
  const premium = 5
  const pnl = (kind === 'call' ? Math.max(spot - strike, 0) : Math.max(strike - spot, 0)) - premium
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['call', '看涨 Call'],
          ['put', '看跌 Put'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              kind === k
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="block">
        <span className={labelCls}>到期标的价格 ¥{spot}（行权价 ¥{strike} · 期权费 ¥{premium}）</span>
        <input type="range" min={80} max={120} value={spot} onChange={(e) => setSpot(+e.target.value)} className={sliderCls} />
      </label>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-8 text-neutral-500">盈亏</span>
        <div className="relative h-4 flex-1 rounded bg-neutral-100">
          <div className="absolute top-[-3px] left-1/2 h-[22px] w-px bg-neutral-400" />
          <div
            className={`absolute top-0 h-full rounded transition-all duration-300 ${pnl >= 0 ? 'bg-emerald-600' : 'bg-rose-500'}`}
            style={{
              left: pnl >= 0 ? '50%' : `${50 + (pnl / 20) * 50}%`,
              width: `${Math.min(Math.abs(pnl) / 20, 1) * 50}%`,
            }}
          />
        </div>
        <span className={`w-14 text-right font-medium ${pnl >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
          {pnl >= 0 ? '+' : ''}¥{pnl}
        </span>
      </div>
      <p className="text-center text-xs text-neutral-400">买方最多亏 ¥{premium} 期权费；最大收益{kind === 'call' ? '理论上不封顶' : '为行权价减期权费'}</p>
    </div>
  )
}

/* 美式 vs 欧式期权：行权时间窗 */
function OptionExerciseDemo() {
  const [mode, setMode] = useState<'us' | 'eu'>('eu')
  const [t, setT] = useState(60)
  const ok = mode === 'us' || t === 100
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['us', '美式期权'],
          ['eu', '欧式期权'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              mode === k
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="block">
        <span className={labelCls}>想在 {t}% 的时间点行权</span>
        <input type="range" min={0} max={100} step={10} value={t} onChange={(e) => setT(+e.target.value)} className={sliderCls} />
      </label>
      <div className="relative h-4 rounded bg-neutral-100">
        <div
          className={`absolute top-0 h-full rounded transition-all duration-300 ${mode === 'us' ? 'bg-emerald-600/30' : 'bg-transparent'}`}
          style={{ left: 0, width: '100%' }}
        />
        <div className={`absolute top-[-3px] right-0 h-[22px] w-1.5 rounded ${mode === 'eu' ? 'bg-emerald-600' : 'bg-neutral-400'}`} />
        <div className="absolute top-[-4px] h-6 w-1 rounded bg-neutral-900 transition-all duration-150" style={{ left: `calc(${t}% - 2px)` }} />
      </div>
      <p className={`text-center text-xs ${ok ? 'text-neutral-400' : 'text-rose-600'}`}>
        {ok
          ? mode === 'us'
            ? '美式：到期前任意交易日都可行权 ✓'
            : '欧式：在到期日当天行权 ✓'
          : '欧式期权只能在到期日（最右端）行权 ✗'}
      </p>
    </div>
  )
}

/* 存款保险：50 万偿付上限 */
function DepositDemo() {
  const [amount, setAmount] = useState(80)
  const insured = Math.min(amount, 50)
  const excess = amount - insured
  return (
    <div className="w-full space-y-3">
      <label className="block">
        <span className={labelCls}>同一家银行的存款本息合计 {amount} 万</span>
        <input type="range" min={10} max={200} step={10} value={amount} onChange={(e) => setAmount(+e.target.value)} className={sliderCls} />
      </label>
      <div className="flex h-4 overflow-hidden rounded text-[10px] leading-4">
        <div className="bg-emerald-600 transition-all duration-300" style={{ width: `${(insured / 200) * 100}%` }} />
        <div className="bg-rose-500 transition-all duration-300" style={{ width: `${(excess / 200) * 100}%` }} />
      </div>
      <p className="text-center text-xs text-neutral-400">
        <span className="text-emerald-700">受保障 {insured} 万</span>
        {excess > 0 && <span className="text-rose-600"> · 超出 {excess} 万需待清算受偿</span>}
        {excess <= 0 && ' · 全额在保障范围内'}
      </p>
    </div>
  )
}

export const demoComponents: Record<DemoKind, ComponentType> = {
  triangle: TriangleDemo,
  compound: CompoundDemo,
  bondRate: BondRateDemo,
  shares: SharesDemo,
  fund80: Fund80Demo,
  optionPayoff: OptionPayoffDemo,
  optionExercise: OptionExerciseDemo,
  deposit: DepositDemo,
}
