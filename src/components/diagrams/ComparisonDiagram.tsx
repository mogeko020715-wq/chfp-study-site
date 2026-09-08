export interface CompareRow {
  label: string
  value: string
}

export interface CompareSide {
  name: string
  tagline?: string
  rows: CompareRow[]
}

interface ComparisonDiagramProps {
  caption: string
  sides: [CompareSide, CompareSide]
  /** 底部一句话总结 / 记忆钩子 */
  bottom?: string
}

/**
 * 对比型图解模板：左右两个对象，各带若干「维度 → 要点」行
 * 适用：偿还期 vs 流动性、股票 vs 债券、一级市场 vs 二级市场……
 */
export default function ComparisonDiagram({ caption, sides, bottom }: ComparisonDiagramProps) {
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">{caption}</figcaption>

      <div className="grid gap-3 sm:grid-cols-2">
        {sides.map((side) => (
          <div
            key={side.name}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-400"
          >
            <p className="font-medium text-neutral-900">{side.name}</p>
            {side.tagline && <p className="text-caption mt-0.5">{side.tagline}</p>}
            <dl className="mt-2 space-y-1.5">
              {side.rows.map((row) => (
                <div key={row.label} className="flex gap-2 text-sm">
                  <dt className="shrink-0 text-neutral-400">{row.label}</dt>
                  <dd className="text-neutral-700">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {bottom && (
        <p className="text-caption mt-4 border-t border-neutral-100 pt-3">{bottom}</p>
      )}
    </figure>
  )
}
