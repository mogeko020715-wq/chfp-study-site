interface TradeoffDiagramProps {
  caption: string
  /** 三角三个角（不可兼得的三个目标） */
  corners: [string, string, string]
  center: string
  /** 取二舍一：选择了哪两个、牺牲哪个、现实例子 */
  pairs: { pick: [string, string]; give: string; example: string }[]
}

/**
 * 不可能三角模板：三个目标两两不可兼得
 * 适用：收益-风险-流动性三角、汇率不可能三角、投资三要素取舍……
 */
export default function TradeoffDiagram({ caption, corners, center, pairs }: TradeoffDiagramProps) {
  const [a, b, c] = corners
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">{caption}</figcaption>

      {/* 三角：三个角 + 中心 */}
      <div className="mx-auto max-w-sm">
        <div className="flex justify-center">
          <span className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white">{a}</span>
        </div>
        <svg viewBox="0 0 320 60" className="block h-14 w-full" fill="none" aria-hidden="true">
          <path d="M160 4 L40 56 M160 4 L280 56 M40 56 L280 56" stroke="#a3a3a3" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
        <div className="flex items-end justify-between">
          <span className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-900">{b}</span>
          <span className="mb-4 text-center text-xs text-neutral-500">{center}</span>
          <span className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-900">{c}</span>
        </div>
      </div>

      {/* 取二舍一 */}
      <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
        {pairs.map((p) => (
          <p key={p.give} className="text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">
              要 {p.pick[0]} + {p.pick[1]}
            </span>
            <span className="mx-1.5 text-neutral-400">→</span>
            牺牲 {p.give}
            <span className="text-caption ml-1.5">（{p.example}）</span>
          </p>
        ))}
      </div>
    </figure>
  )
}
