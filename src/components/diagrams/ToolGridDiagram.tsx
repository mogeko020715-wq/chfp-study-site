export interface ToolItem {
  name: string
  desc: string
  note?: string
}

interface ToolGridDiagramProps {
  caption: string
  items: ToolItem[]
  bottom?: string
}

/**
 * 工具清单模板：若干张卡片平铺，每张 = 名称 + 是什么 + 核心要点
 * 适用：货币市场五大工具、金融机构清单、理财工具箱……
 */
export default function ToolGridDiagram({ caption, items, bottom }: ToolGridDiagramProps) {
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">{caption}</figcaption>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <div
            key={item.name}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-400"
          >
            <p className="flex items-baseline gap-2 font-medium text-neutral-900">
              <span className="text-caption shrink-0">{String(i + 1).padStart(2, '0')}</span>
              {item.name}
            </p>
            <p className="mt-1 text-sm text-neutral-700">{item.desc}</p>
            {item.note && <p className="text-caption mt-1">{item.note}</p>}
          </div>
        ))}
      </div>

      {bottom && <p className="text-caption mt-4 border-t border-neutral-100 pt-3">{bottom}</p>}
    </figure>
  )
}
