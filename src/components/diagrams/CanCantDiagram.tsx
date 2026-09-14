interface CanCantDiagramProps {
  caption: string
  can: string[]
  cant: string[]
  note?: string
  bottom?: string
}

/**
 * 能/不能清单模板：两列对照 ✓ 可以 / ✗ 不可以
 * 适用：货币基金投资范围、能做/不能做的业务边界……
 */
export default function CanCantDiagram({ caption, can, cant, note, bottom }: CanCantDiagramProps) {
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">{caption}</figcaption>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-400">
          <p className="font-medium text-neutral-900">✓ 可以买的</p>
          <ul className="mt-2 space-y-1.5">
            {can.map((item) => (
              <li key={item} className="text-sm text-neutral-700">
                <span className="mr-1.5 text-neutral-400">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-400">
          <p className="font-medium text-neutral-900">✗ 不能买的</p>
          <ul className="mt-2 space-y-1.5">
            {cant.map((item) => (
              <li key={item} className="text-sm text-neutral-700">
                <span className="mr-1.5 text-neutral-400">·</span>
                {item}
              </li>
            ))}
          </ul>
          {note && <p className="text-caption mt-2 border-t border-neutral-100 pt-2">{note}</p>}
        </div>
      </div>

      {bottom && <p className="text-caption mt-4 border-t border-neutral-100 pt-3">{bottom}</p>}
    </figure>
  )
}
