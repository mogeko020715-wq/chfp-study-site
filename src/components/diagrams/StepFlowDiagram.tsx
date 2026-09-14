export interface Step {
  title: string
  desc: string
}

interface StepFlowDiagramProps {
  caption: string
  steps: Step[]
  bottom?: string
}

/**
 * 步骤流程模板：竖向时间轴，编号 + 标题 + 说明
 * 适用：回购协议先卖后买、申购赎回流程、结算流程……
 */
export default function StepFlowDiagram({ caption, steps, bottom }: StepFlowDiagramProps) {
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">{caption}</figcaption>

      <ol className="relative ml-3 border-l border-neutral-200 pl-6">
        {steps.map((step, i) => (
          <li key={step.title} className="relative pb-5 last:pb-0">
            <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-[11px] font-medium text-white">
              {i + 1}
            </span>
            <p className="font-medium text-neutral-900">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700">{step.desc}</p>
          </li>
        ))}
      </ol>

      {bottom && <p className="text-caption mt-4 border-t border-neutral-100 pt-3">{bottom}</p>}
    </figure>
  )
}
