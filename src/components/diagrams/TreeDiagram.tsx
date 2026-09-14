export interface TreeChild {
  name: string
  desc: string
}

interface TreeDiagramProps {
  caption: string
  root: string
  children: TreeChild[]
  bottom?: string
}

/**
 * 层级树模板：一个根节点 + 若干子节点卡片
 * 适用：货币市场的子市场分类、金融体系层级、衍生品家族……
 */
export default function TreeDiagram({ caption, root, children, bottom }: TreeDiagramProps) {
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">{caption}</figcaption>

      <div className="text-center">
        <span className="inline-block rounded-full border border-neutral-800 bg-neutral-900 px-5 py-1.5 text-sm font-medium text-white">
          {root}
        </span>
      </div>

      <svg viewBox="0 0 40 24" className="mx-auto block h-6 w-10" fill="none" aria-hidden="true">
        <path d="M20 0 V8 M20 8 L4 22 M20 8 L36 22" stroke="#a3a3a3" strokeWidth="1.5" />
      </svg>

      <div className="grid gap-3 sm:grid-cols-2">
        {children.map((child) => (
          <div
            key={child.name}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-400"
          >
            <p className="font-medium text-neutral-900">{child.name}</p>
            <p className="mt-1 text-sm text-neutral-700">{child.desc}</p>
          </div>
        ))}
      </div>

      {bottom && <p className="text-caption mt-4 border-t border-neutral-100 pt-3">{bottom}</p>}
    </figure>
  )
}
