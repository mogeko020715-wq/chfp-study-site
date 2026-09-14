interface QuizDiagramProps {
  caption: string
  question: string
  options: string[]
  /** 正确选项下标（从 0 开始） */
  answer: number
  explanation: string
}

/**
 * 考题图解模板：题干 + 选项列表，正确答案高亮
 * 适用：章节易错点、练习题
 */
export default function QuizDiagram({ caption, question, options, answer, explanation }: QuizDiagramProps) {
  return (
    <figure className="card mt-6 px-5 py-5">
      <figcaption className="text-caption mb-4">{caption}</figcaption>

      <p className="text-body font-medium text-neutral-900">{question}</p>

      <div className="mt-3 space-y-2">
        {options.map((opt, i) => {
          const correct = i === answer
          return (
            <p
              key={opt}
              className={`rounded-lg border px-4 py-2 text-sm ${
                correct
                  ? 'border-neutral-900 bg-neutral-900 font-medium text-white'
                  : 'border-neutral-200 bg-white text-neutral-700'
              }`}
            >
              <span className={`mr-2 ${correct ? 'opacity-70' : 'text-neutral-400'}`}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
              {correct && <span className="ml-2 text-xs opacity-70">✓ 正确</span>}
            </p>
          )
        })}
      </div>

      <p className="text-caption mt-4 border-t border-neutral-100 pt-3">{explanation}</p>
    </figure>
  )
}
