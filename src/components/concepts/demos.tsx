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
/* 股票的族谱：按上市地点 / 按股东权利 两套分法 */
function SharesDemo() {
  const [dim, setDim] = useState<'place' | 'right'>('place')
  const [cur, setCur] = useState<keyof typeof SHARES>('B股')
  const [cls, setCls] = useState<'普通股' | '优先股'>('优先股')
  const RIGHTS: Record<string, [string, string][]> = {
    普通股: [['分红', '后分，看盈利'], ['清偿顺序', '最后'], ['投票权', '有'], ['收益', '浮动，弹性大']],
    优先股: [['分红', '先分，相对固定'], ['清偿顺序', '优先于普通股'], ['投票权', '一般没有'], ['收益', '相对固定']],
  }
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['place', '按上市地点'],
          ['right', '按股东权利'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setDim(k)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              dim === k
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {dim === 'place' ? (
        <>
          <div className="flex justify-center gap-2">
            {(Object.keys(SHARES) as (keyof typeof SHARES)[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setCur(k)}
                className={`rounded-full border px-3 py-0.5 text-xs transition-colors ${
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
        </>
      ) : (
        <>
          <div className="flex justify-center gap-2">
            {(['普通股', '优先股'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setCls(k)}
                className={`rounded-full border px-3 py-0.5 text-xs transition-colors ${
                  cls === k
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="mx-auto w-full max-w-60 divide-y divide-neutral-100 rounded-lg border border-neutral-200 text-sm">
            {RIGHTS[cls].map(([k, v]) => (
              <div key={k} className="flex justify-between px-3 py-1.5">
                <span className="text-neutral-500">{k}</span>
                <span className={`font-medium ${cls === '优先股' && (k === '分红' || k === '清偿顺序') ? 'text-amber-700' : 'text-neutral-900'}`}>{v}</span>
              </div>
            ))}
          </div>
        </>
      )}
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

/* 偿还期 vs 流动性：点资产看两个维度 */
const ASSETS: Record<string, { maturity: string; maturityW: number; liquidity: string; liquidityW: number }> = {
  活期存款: { maturity: '无（随取随用）', maturityW: 4, liquidity: '极高', liquidityW: 100 },
  三年定期: { maturity: '3 年（提前取损失利息）', maturityW: 60, liquidity: '较低', liquidityW: 35 },
  股票: { maturity: '无（永不到期）', maturityW: 4, liquidity: '极高（随时可卖）', liquidityW: 95 },
  房产: { maturity: '无（无到期日）', maturityW: 4, liquidity: '低（变现数月）', liquidityW: 15 },
}
function MaturityLiquidityDemo() {
  const [cur, setCur] = useState<keyof typeof ASSETS>('三年定期')
  const a = ASSETS[cur]
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(ASSETS) as (keyof typeof ASSETS)[]).map((k) => (
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
      {(
        [
          ['偿还期（时间）', a.maturity, a.maturityW, 'bg-neutral-400'],
          ['流动性（变现）', a.liquidity, a.liquidityW, 'bg-neutral-900'],
        ] as const
      ).map(([name, val, w, cls]) => (
        <div key={name} className="flex items-center gap-2 text-xs">
          <span className="w-24 shrink-0 text-neutral-500">{name}</span>
          <div className="h-4 flex-1 overflow-hidden rounded bg-neutral-100">
            <div className={`h-full rounded transition-all duration-300 ${cls}`} style={{ width: `${w}%` }} />
          </div>
          <span className="w-32 shrink-0 font-medium text-neutral-900">{val}</span>
        </div>
      ))}
      <p className="text-center text-xs text-neutral-400">一个是「多久到期」，一个是「能否马上卖」——两回事</p>
    </div>
  )
}

/* 可转债 vs 可交换债：转谁的股 */
function ConvertibleDemo() {
  const [kind, setKind] = useState<'cb' | 'eb'>('cb')
  const target = kind === 'cb' ? 'A 公司（发行人自己）的股票' : 'B 公司（别家）的股票'
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['cb', '可转债'],
          ['eb', '可交换债'],
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
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="rounded-lg border border-neutral-300 px-3 py-1.5 text-neutral-700">A 公司发的债</span>
        <span className="text-neutral-400">{kind === 'cb' ? '转换 →' : '交换 →'}</span>
        <span className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
          kind === 'cb' ? 'bg-neutral-900 text-white' : 'border border-amber-400 bg-amber-50 text-amber-900'
        }`}>
          {target}
        </span>
      </div>
      <p className="text-center text-xs text-neutral-400">盯住「转谁的股」：自己 = 可转债，别人 = 可交换</p>
    </div>
  )
}

/* 远期 vs 期货：特征归类，点开看归属 */
const FF_FEATURES: Record<string, '远期' | '期货'> = {
  场外一对一定制: '远期',
  到期必须交割: '远期',
  到期一次性结算: '远期',
  标准化合约: '期货',
  '每日结算（Mark-to-Market）': '期货',
  可反向平仓了结: '期货',
  交易所集中撮合: '期货',
  缴纳保证金: '期货',
}
function ForwardFuturesDemo() {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(FF_FEATURES).map((f) => {
          const side = picked === f ? FF_FEATURES[f] : null
          return (
            <button
              key={f}
              type="button"
              onClick={() => setPicked(picked === f ? null : f)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                side === '远期'
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : side === '期货'
                    ? 'border-amber-400 bg-amber-100 text-amber-900'
                    : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
              }`}
            >
              {f}
              {side && <span className="ml-1 opacity-70">· {side}</span>}
            </button>
          )
        })}
      </div>
      <div className="flex justify-center gap-6 text-xs">
        <span className="flex items-center gap-1.5 text-neutral-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-900" /> 远期：场外定制，到期交割
        </span>
        <span className="flex items-center gap-1.5 text-neutral-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" /> 期货：标准化，每日结算
        </span>
      </div>
      <p className="text-center text-xs text-neutral-400">点特征看归属——「合约现货外汇交易」说的是外汇期货</p>
    </div>
  )
}

/* 代理人 vs 经纪人：代表谁 */
function AgentBrokerDemo() {
  const ROLES = {
    代理人: { who: '代表保险公司', side: '卖方', note: '帮保险公司卖产品' },
    经纪人: { who: '代表投保人', side: '买方', note: '帮客户挑产品——高频考点' },
    公估人: { who: '中立第三方', side: '—', note: '查勘、定损、理赔' },
  } as const
  const [cur, setCur] = useState<keyof typeof ROLES>('经纪人')
  const r = ROLES[cur]
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {(Object.keys(ROLES) as (keyof typeof ROLES)[]).map((k) => (
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
      <div className="mx-auto w-full max-w-60 rounded-lg border border-neutral-200 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-neutral-900">{r.who}</p>
        <p className="mt-0.5 text-xs text-neutral-500">
          {r.side !== '—' && `立场：${r.side} · `}
          {r.note}
        </p>
      </div>
    </div>
  )
}

/* 直接 vs 间接标价：同一波数字变动，两种读法 */
function FxQuotationDemo() {
  const [mode, setMode] = useState<'direct' | 'indirect'>('direct')
  const yesterday = 6.65
  const [today, setToday] = useState(6.8)
  const up = today > yesterday + 1e-9
  const flat = Math.abs(today - yesterday) < 1e-9
  // 直接标价：数字升 = 人民币贬值；间接标价：数字升 = 升值
  const depreciate = up ? mode === 'direct' : mode === 'indirect'
  const shown = mode === 'direct' ? today.toFixed(2) : (1 / today).toFixed(4)
  const shownY = mode === 'direct' ? yesterday.toFixed(2) : (1 / yesterday).toFixed(4)
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['direct', '直接标价法'],
          ['indirect', '间接标价法'],
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
        <span className={labelCls}>
          {mode === 'direct' ? '1 美元 ＝ X 人民币' : '1 人民币 ＝ X 美元'}：昨日 {shownY} → 今日 {shown}
        </span>
        <input
          type="range"
          min={6.2}
          max={7.4}
          step={0.05}
          value={today}
          onChange={(e) => setToday(+e.target.value)}
          className={sliderCls}
        />
      </label>
      <p className="text-center text-sm">
        {flat ? (
          <span className="text-neutral-500">数字没变，币值也没变——拖一下滑块试试</span>
        ) : (
          <>
            <span className="text-neutral-500">数字{up ? '变大' : '变小'}，人民币在</span>{' '}
            <span className={`font-semibold ${depreciate ? 'text-rose-600' : 'text-emerald-700'}`}>
              {depreciate ? '贬值 ↘' : '升值 ↗'}
            </span>
          </>
        )}
      </p>
      <p className="text-center text-xs text-neutral-400">
        {mode === 'direct' ? '直接标价：数字升 = 本币贬（美元更贵了）' : '间接标价：同样一波变动，读法整个反过来'}
      </p>
    </div>
  )
}

/* 封闭式 vs 开放式：市价与净值的偏离 */
function ClosedOpenFundDemo() {
  const [kind, setKind] = useState<'closed' | 'open'>('closed')
  const nav = 1.0
  const [price, setPrice] = useState(0.9)
  const open = kind === 'open'
  const shownPrice = open ? nav : price
  const disc = (shownPrice / nav - 1) * 100
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['open', '开放式'],
          ['closed', '封闭式'],
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
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-8 text-neutral-500">净值</span>
          <div className="h-4 flex-1 overflow-hidden rounded bg-neutral-100">
            <div className="h-full w-2/3 rounded bg-neutral-400" />
          </div>
          <span className="w-12 text-right font-medium text-neutral-900">1.00</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-8 text-neutral-500">市价</span>
          <div className="relative h-4 flex-1 rounded bg-neutral-100">
            <div
              className={`absolute top-0 h-full rounded transition-all duration-300 ${disc < -0.05 ? 'bg-amber-500' : 'bg-neutral-900'}`}
              style={{ width: `${(shownPrice / 1.5) * 100}%` }}
            />
            <div className="absolute top-[-3px] h-[22px] w-px bg-neutral-400" style={{ left: '66.7%' }} />
          </div>
          <span className="w-12 text-right font-medium text-neutral-900">{shownPrice.toFixed(2)}</span>
        </div>
      </div>
      {!open && (
        <label className="block">
          <span className={labelCls}>二级市场成交价 {price.toFixed(2)} 元</span>
          <input
            type="range"
            min={0.8}
            max={1.2}
            step={0.01}
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
            className={sliderCls}
          />
        </label>
      )}
      <p className="text-center text-sm">
        {open ? (
          <span className="text-neutral-500">按净值申购赎回，市价 = 净值，不存在折价</span>
        ) : (
          <>
            <span className="text-neutral-500">当前</span>{' '}
            <span className={`font-semibold ${disc < -0.05 ? 'text-amber-700' : disc > 0.05 ? 'text-rose-600' : 'text-neutral-900'}`}>
              {disc < -0.05 ? `折价 ${Math.abs(disc).toFixed(1)}%` : disc > 0.05 ? `溢价 ${disc.toFixed(1)}%` : '平价'}
            </span>
            <span className="ml-1 text-xs text-neutral-400">（折价率 = 市价 ÷ 净值 − 1）</span>
          </>
        )}
      </p>
    </div>
  )
}

/* ETF vs LOF：申赎机制决定折溢价 */
function EtfLofDemo() {
  const [kind, setKind] = useState<'etf' | 'lof'>('etf')
  const etf = kind === 'etf'
  const rows: [string, string, string][] = [
    ['申赎用什么', '一篮子股票（实物）', '现金'],
    ['申赎门槛', '高（机构/大户为主）', '低（散户可参与）'],
    ['折溢价表现', '极小——套利者随时抹平', '可能持续偏离净值'],
  ]
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['etf', 'ETF'],
          ['lof', 'LOF'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-full border px-4 py-1 text-sm transition-colors ${
              kind === k
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mx-auto w-full max-w-64 divide-y divide-neutral-100 rounded-lg border border-neutral-200 text-xs">
        {rows.map(([label, etfVal, lofVal]) => (
          <div key={label} className="flex items-center justify-between px-3 py-1.5">
            <span className="text-neutral-500">{label}</span>
            <span className={`text-right font-medium ${(label === '折溢价表现' || label === '申赎用什么') ? (etf ? 'text-emerald-700' : 'text-amber-700') : 'text-neutral-900'}`}>
              {etf ? etfVal : lofVal}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-16 text-neutral-500">折溢价幅度</span>
        <div className="relative h-4 flex-1 rounded bg-neutral-100">
          <div className="absolute top-[-3px] left-1/2 h-[22px] w-px bg-neutral-400" />
          <div
            className={`absolute top-0 h-full rounded transition-all duration-300 ${etf ? 'bg-emerald-600' : 'bg-amber-500'}`}
            style={{ left: '50%', width: etf ? '3%' : '22%' }}
          />
        </div>
        <span className="w-14 text-right font-medium text-neutral-900">{etf ? '±0.1%' : '±2%'}</span>
      </div>
      <p className="text-center text-xs text-neutral-400">套利速度决定折溢价：实物申赎快，现金申赎慢</p>
    </div>
  )
}

/* 四种投资策略：不同行情下的盈亏 */
type Market = 'up' | 'down' | 'flat'
const STRATEGY_OUTCOMES: Record<string, { desc: string; o: Record<Market, { v: number; t: string }> }> = {
  多头: {
    desc: '低价买入高价卖出',
    o: {
      up: { v: 1, t: '盈利' },
      down: { v: -1, t: '亏损' },
      flat: { v: 0, t: '白忙' },
    },
  },
  多空: {
    desc: '同时做多做空，对冲风险',
    o: {
      up: { v: 0.35, t: '小幅盈利' },
      down: { v: -0.35, t: '小幅亏损' },
      flat: { v: 0.1, t: '看选股' },
    },
  },
  中性: {
    desc: '对冲掉大盘，只赚选股的钱',
    o: {
      up: { v: 0.15, t: '持平微赚' },
      down: { v: 0.15, t: '持平微赚' },
      flat: { v: 0.15, t: '持平微赚' },
    },
  },
  CTA: {
    desc: '跟踪期货趋势，可多可空',
    o: {
      up: { v: 0.8, t: '盈利' },
      down: { v: 0.8, t: '盈利（做空）' },
      flat: { v: -0.5, t: '亏损' },
    },
  },
}
function FourStrategiesDemo() {
  const [mkt, setMkt] = useState<Market>('down')
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {(
          [
            ['up', '上涨行情'],
            ['down', '下跌行情'],
            ['flat', '横盘震荡'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMkt(k)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              mkt === k
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {Object.entries(STRATEGY_OUTCOMES).map(([name, s]) => {
        const o = s.o[mkt]
        return (
          <div key={name} className="flex items-center gap-2 text-xs">
            <span className="w-10 shrink-0 font-medium text-neutral-900">{name}</span>
            <div className="relative h-4 flex-1 rounded bg-neutral-100">
              <div className="absolute top-[-3px] left-1/2 h-[22px] w-px bg-neutral-400" />
              <div
                className={`absolute top-0 h-full rounded transition-all duration-300 ${o.v > 0.05 ? 'bg-emerald-600' : o.v < -0.05 ? 'bg-rose-500' : 'bg-neutral-400'}`}
                style={{
                  left: o.v >= 0 ? '50%' : `${50 + o.v * 50}%`,
                  width: `${Math.abs(o.v) * 50}%`,
                }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-neutral-600" title={s.desc}>
              {o.t}
            </span>
          </div>
        )
      })}
      <p className="text-center text-xs text-neutral-400">
        {mkt === 'down' ? '下跌时 CTA 做空也盈利——这就是「管理期货」的价值' : mkt === 'flat' ? '震荡市是 CTA 的天敌，中性策略最稳' : '上涨时人人赚钱，差别在牛市之外'}
      </p>
    </div>
  )
}

/* PE vs PB：股价本身不代表贵贱 */
function PePbDemo() {
  const [kind, setKind] = useState<'pe' | 'pb'>('pe')
  const [price, setPrice] = useState(30)
  const [eps, setEps] = useState(1.5)
  const [bps, setBps] = useState(20)
  const pe = price / eps
  const pb = price / bps
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['pe', 'PE 市盈率'],
          ['pb', 'PB 市净率'],
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
        <span className={labelCls}>股价 ¥{price}</span>
        <input type="range" min={10} max={100} value={price} onChange={(e) => setPrice(+e.target.value)} className={sliderCls} />
      </label>
      {kind === 'pe' ? (
        <label className="block">
          <span className={labelCls}>每股收益 ¥{eps.toFixed(1)}</span>
          <input type="range" min={0.5} max={5} step={0.1} value={eps} onChange={(e) => setEps(+e.target.value)} className={sliderCls} />
        </label>
      ) : (
        <label className="block">
          <span className={labelCls}>每股净资产 ¥{bps}</span>
          <input type="range" min={5} max={50} value={bps} onChange={(e) => setBps(+e.target.value)} className={sliderCls} />
        </label>
      )}
      <p className="text-center text-sm">
        <span className="text-neutral-500">{kind === 'pe' ? 'PE' : 'PB'} =</span>{' '}
        <span className="text-lg font-bold text-neutral-900">{kind === 'pe' ? pe.toFixed(1) : pb.toFixed(2)}</span>
      </p>
      <p className="text-center text-xs text-neutral-400">
        {kind === 'pe'
          ? `按当前盈利，约 ${pe.toFixed(0)} 年回本——PE 看的是赚钱能力`
          : `为每 1 元账面净资产付了 ${pb.toFixed(2)} 元——PB 看的是家底`}
      </p>
    </div>
  )
}

/* 货基可投/不可投：点资产看答案 */
const MF_RULES: Record<string, boolean> = {
  现金: true,
  '1 年内存款': true,
  '397 天内债券': true,
  央行票据: true,
  同业存单: true,
  债券回购: true,
  股票: false,
  可转债: false,
  '2 年以上存款': false,
}
function MoneyFundDemo() {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(MF_RULES).map((f) => {
          const on = picked === f ? MF_RULES[f] : null
          return (
            <button
              key={f}
              type="button"
              onClick={() => setPicked(picked === f ? null : f)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                on === true
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : on === false
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
              }`}
            >
              {f}
              {on !== null && <span className="ml-1 opacity-80">{on ? '可投' : '禁投'}</span>}
            </button>
          )
        })}
      </div>
      <div className="flex justify-center gap-6 text-xs">
        <span className="flex items-center gap-1.5 text-neutral-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" /> 可投：短、稳、高流动
        </span>
        <span className="flex items-center gap-1.5 text-neutral-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" /> 禁投：风险超标
        </span>
      </div>
      <p className="text-center text-xs text-neutral-400">记住「397 天」；股票和可转债是货基的绝对禁区</p>
    </div>
  )
}

/* K 线基础：拖开盘/收盘价，看阴阳翻转 */
function CandleBasicDemo() {
  const [open, setOpen] = useState(8)
  const [close, setClose] = useState(11)
  const high = Math.max(open, close) + 2
  const low = Math.min(open, close) - 2
  const pct = (p: number) => ((high - p) / (high - low)) * 100
  const yang = close > open
  const flat = close === open
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelCls}>开盘价 {open.toFixed(1)}</span>
          <input type="range" min={5} max={15} step={0.5} value={open} onChange={(e) => setOpen(+e.target.value)} className={sliderCls} />
        </label>
        <label className="block">
          <span className={labelCls}>收盘价 {close.toFixed(1)}</span>
          <input type="range" min={5} max={15} step={0.5} value={close} onChange={(e) => setClose(+e.target.value)} className={sliderCls} />
        </label>
      </div>
      <div className="flex items-center justify-center gap-6">
        <div className="relative h-28 w-10">
          {/* 影线：最高到最低 */}
          <div className="absolute left-1/2 w-0.5 -translate-x-1/2 bg-neutral-500" style={{ top: 0, bottom: 0 }} />
          {/* 实体：开盘到收盘 */}
          <div
            className={`absolute left-1/2 w-7 -translate-x-1/2 rounded-sm transition-all duration-200 ${
              flat ? 'bg-neutral-400' : yang ? 'bg-rose-500' : 'bg-emerald-600'
            }`}
            style={{
              top: `${pct(Math.max(open, close))}%`,
              height: `${Math.max(pct(Math.min(open, close)) - pct(Math.max(open, close)), 3)}%`,
            }}
          />
          <span className="absolute -top-1 -right-7 text-[10px] text-neutral-400">高 {high.toFixed(1)}</span>
          <span className="absolute -bottom-1 -right-7 text-[10px] text-neutral-400">低 {low.toFixed(1)}</span>
        </div>
        <div className="space-y-1 text-xs text-neutral-500">
          <p>
            实体两端 = <span className="text-neutral-900">开盘 {open.toFixed(1)}</span> 与{' '}
            <span className="text-neutral-900">收盘 {close.toFixed(1)}</span>
          </p>
          <p>细线（影线）指向最高 / 最低价</p>
          <p>
            这是一根
            <span className={`font-semibold ${flat ? 'text-neutral-900' : yang ? 'text-rose-600' : 'text-emerald-700'}`}>
              {flat ? ' 十字星（收 = 开）' : yang ? ' 阳线（收 > 开，红色）' : ' 阴线（收 < 开，绿色）'}
            </span>
          </p>
        </div>
      </div>
      <p className="text-center text-xs text-neutral-400">中国盘面红涨绿跌，和欧美正好相反</p>
    </div>
  )
}

/* 锤子线 vs 上吊线：同形不同位 */
function HammerHangingDemo() {
  const [pos, setPos] = useState<'bottom' | 'top'>('bottom')
  const bottom = pos === 'bottom'
  // 趋势点：bottom 模式下跌（值递减），top 模式上涨
  const dots = bottom ? [11, 10, 9, 8] : [8, 9, 10, 11]
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['bottom', '出现在下跌趋势末端'],
          ['top', '出现在上涨趋势末端'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setPos(k)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              pos === k
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-end justify-center gap-3">
        {dots.map((v, i) => (
          <span
            key={i}
            className="w-2.5 rounded-full bg-neutral-300 transition-all duration-300"
            style={{ height: `${v * 5}px` }}
          />
        ))}
        {/* 同一根 K 线：小实体在顶部，下影线很长 */}
        <div className="relative h-16 w-8">
          <div className="absolute left-1/2 top-1 w-0.5 -translate-x-1/2 bg-rose-500" style={{ height: '88%' }} />
          <div className="absolute left-1/2 top-0 h-3.5 w-6 -translate-x-1/2 rounded-sm bg-rose-500" />
        </div>
      </div>
      <p className="text-center text-sm">
        <span className="text-neutral-500">同一形态，这里叫</span>{' '}
        <span className={`font-semibold ${bottom ? 'text-emerald-700' : 'text-rose-600'}`}>
          {bottom ? '锤子线 · 见底信号 ↗' : '上吊线 · 见顶预警 ↘'}
        </span>
      </p>
      <p className="text-center text-xs text-neutral-400">形态不决定含义，位置决定含义；还需次日 K 线确认</p>
    </div>
  )
}

/* 纸黄金 vs 实物黄金：你买到的到底是什么 */
function PaperGoldDemo() {
  const [kind, setKind] = useState<'paper' | 'physical'>('paper')
  const paper = kind === 'paper'
  const rows: [string, string, string][] = [
    ['你拿到的是', '账户里一行数字', '沉甸甸的金条/金币'],
    ['能提取实物吗', '不能，永远只是账面', '能，但回购有折价'],
    ['交易成本', '低（买卖个点差）', '高（保管 + 鉴定 + 回购折价）'],
    ['适合谁', '短线交易赚差价', '长期保值、压箱底'],
  ]
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-center gap-2">
        {([
          ['paper', '纸黄金'],
          ['physical', '实物黄金'],
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
      <div className="mx-auto flex w-full max-w-64 items-center justify-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
        <span aria-hidden="true" className={`text-3xl transition-all duration-300 ${paper ? '' : 'scale-110'}`}>
          {paper ? '📄' : '🧈'}
        </span>
        <p className="text-sm">
          <span className="font-semibold text-neutral-900">{paper ? '一条账面记录' : '一块真金'}</span>
          <span className="block text-xs text-neutral-400">{paper ? '跟着报价涨跌，不能交割' : '拿在手里，也要操心保管'}</span>
        </p>
      </div>
      <div className="mx-auto w-full max-w-64 divide-y divide-neutral-100 rounded-lg border border-neutral-200 text-xs">
        {rows.map(([label, pv, fv]) => (
          <div key={label} className="flex items-center justify-between px-3 py-1.5">
            <span className="text-neutral-500">{label}</span>
            <span className={`text-right font-medium ${label === '能提取实物吗' ? (paper ? 'text-rose-600' : 'text-emerald-700') : 'text-neutral-900'}`}>
              {paper ? pv : fv}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* 贵金属三大交易所：产品归哪家 */
const EXCHANGES: Record<string, string> = {
  '黄金 T+D': '上海黄金交易所',
  '白银 T+D': '上海黄金交易所',
  黄金期货: '上海期货交易所',
  白银期货: '上海期货交易所',
  天通金: '天津贵金属交易所',
  天通银: '天津贵金属交易所',
}
function GoldExchangesDemo() {
  const [picked, setPicked] = useState<string | null>(null)
  const badgeCls = (ex: string) =>
    ex === '上海黄金交易所' ? 'bg-amber-500' : ex === '上海期货交易所' ? 'bg-neutral-900' : 'bg-neutral-400'
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(EXCHANGES).map((f) => {
          const ex = picked === f ? EXCHANGES[f] : null
          return (
            <button
              key={f}
              type="button"
              onClick={() => setPicked(picked === f ? null : f)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                ex
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
              }`}
            >
              {f}
            </button>
          )
        })}
      </div>
      <div className="mx-auto w-full max-w-64 rounded-lg border border-neutral-200 px-4 py-3 text-center text-sm">
        {picked ? (
          <>
            <span className={`mr-1.5 inline-block h-2.5 w-2.5 rounded-full ${badgeCls(EXCHANGES[picked])}`} />
            <span className="font-medium text-neutral-900">{picked}</span>
            <span className="text-neutral-500"> 在 </span>
            <span className="font-semibold text-neutral-900">{EXCHANGES[picked]}</span>
            <span className="text-neutral-500"> 交易</span>
          </>
        ) : (
          <span className="text-neutral-400">点一个产品，看它归哪家交易所</span>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> 上金所：现货 T+D</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-900" /> 上期所：期货</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-400" /> 天贵所：天通金/银</span>
      </div>
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
  maturityLiquidity: MaturityLiquidityDemo,
  convertible: ConvertibleDemo,
  forwardFutures: ForwardFuturesDemo,
  agentBroker: AgentBrokerDemo,
  fxQuotation: FxQuotationDemo,
  closedOpenFund: ClosedOpenFundDemo,
  etfLof: EtfLofDemo,
  fourStrategies: FourStrategiesDemo,
  pePb: PePbDemo,
  moneyFund: MoneyFundDemo,
  candleBasic: CandleBasicDemo,
  hammerHanging: HammerHangingDemo,
  paperGold: PaperGoldDemo,
  goldExchanges: GoldExchangesDemo,
}
