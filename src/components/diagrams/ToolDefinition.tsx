/**
 * 图解：金融工具的双边视角
 * 金融工具 = 金融市场交易的对象；同一个工具，发行者看是债务，投资者看是资产
 */
export default function ToolDefinitionDiagram() {
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">图解 · 同一个金融工具，两边看不一样</figcaption>

      {/* 顶层：金融工具 */}
      <div className="mx-auto w-fit rounded-full border border-neutral-800 bg-neutral-900 px-5 py-1.5 text-sm font-medium text-white">
        金融工具（股票 / 债券）
      </div>

      {/* 分叉箭头 */}
      <svg viewBox="0 0 320 40" className="mx-auto mt-1 block h-10 w-56" fill="none" aria-hidden="true">
        <defs>
          <marker id="tooldef-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#a3a3a3" />
          </marker>
        </defs>
        <path d="M160 2 L72 34" stroke="#a3a3a3" strokeWidth="1.5" markerEnd="url(#tooldef-arrow)" />
        <path d="M160 2 L248 34" stroke="#a3a3a3" strokeWidth="1.5" markerEnd="url(#tooldef-arrow)" />
        <text x="88" y="14" fontSize="11" fill="#737373">发行（借钱）</text>
        <text x="196" y="14" fontSize="11" fill="#737373">购买（出钱）</text>
      </svg>

      {/* 两个视角 */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="group rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-400">
          <p className="font-medium text-neutral-900">发行者</p>
          <p className="text-caption mt-0.5">借钱的人（公司 / 政府）</p>
          <p className="mt-2 text-sm text-neutral-700">
            对他而言 → <span className="font-semibold text-neutral-900">债务</span>
          </p>
        </div>
        <div className="group rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-400">
          <p className="font-medium text-neutral-900">投资者</p>
          <p className="text-caption mt-0.5">出钱的人（买股票 / 债券的人）</p>
          <p className="mt-2 text-sm text-neutral-700">
            对他而言 → <span className="font-semibold text-neutral-900">金融资产</span>
          </p>
        </div>
      </div>

      <p className="text-caption mt-4 border-t border-neutral-100 pt-3">
        例：公司发行股票 —— 对公司是要还的债务，对买股票的人是一笔资产。
      </p>
    </figure>
  )
}
