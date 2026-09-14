interface Party {
  name: string
  desc: string
}

interface MatchFlowDiagramProps {
  caption: string
  left: Party
  center: string
  centerTag?: string
  right: Party
  leftLabel?: string
  rightLabel?: string
  bottom?: string
}

/**
 * 匹配流程模板：两方通过中间市场/工具对接
 * 适用：货币市场供需匹配、发行↔投资、资金盈余方↔短缺方……
 */
export default function MatchFlowDiagram({
  caption,
  left,
  center,
  centerTag,
  right,
  leftLabel = '提供',
  rightLabel = '需求',
  bottom,
}: MatchFlowDiagramProps) {
  const id = `mf-${center.length}-${left.name.length}`
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">{caption}</figcaption>

      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-400">
          <p className="font-medium text-neutral-900">{left.name}</p>
          <p className="text-caption mt-0.5">{left.desc}</p>
          <p className="mt-2 text-sm text-neutral-700">
            {leftLabel} → <span className="font-semibold text-neutral-900">{center}</span>
          </p>
        </div>

        <svg viewBox="0 0 120 60" className="mx-auto hidden h-12 w-24 rotate-90 sm:block sm:rotate-0" fill="none" aria-hidden="true">
          <defs>
            <marker id={`${id}-l`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0 0 L6 3 L0 6 Z" fill="#a3a3a3" />
            </marker>
            <marker id={`${id}-r`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0 0 L6 3 L0 6 Z" fill="#a3a3a3" />
            </marker>
          </defs>
          <path d="M2 30 L50 30" stroke="#a3a3a3" strokeWidth="1.5" markerEnd={`url(#${id}-l)`} />
          <path d="M118 30 L70 30" stroke="#a3a3a3" strokeWidth="1.5" markerEnd={`url(#${id}-r)`} />
        </svg>
        <div className="text-center sm:hidden" aria-hidden="true">
          <span className="text-neutral-400">↓</span>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-right transition-colors hover:border-neutral-400">
          <p className="font-medium text-neutral-900">{right.name}</p>
          <p className="text-caption mt-0.5">{right.desc}</p>
          <p className="mt-2 text-sm text-neutral-700">
            {rightLabel} → <span className="font-semibold text-neutral-900">{center}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="inline-block rounded-full border border-neutral-800 bg-neutral-900 px-5 py-1.5 text-sm font-medium text-white">
          {center}
          {centerTag && <span className="ml-2 font-normal opacity-80">{centerTag}</span>}
        </span>
      </div>

      {bottom && <p className="text-caption mt-4 border-t border-neutral-100 pt-3">{bottom}</p>}
    </figure>
  )
}
