import { Link } from 'react-router'
import { Megaphone } from 'lucide-react'
import { useFeed, tickerItems, type FeedDaily } from '@/data/feed'

/** 首页横滑公告栏：展示最近一期日报中 importance=3 的条目，悬停暂停，点击进入资讯页 */
export default function NewsTicker() {
  const { feed, error } = useFeed()
  const items = tickerItems(feed)

  if (error || items.length === 0) return null

  return (
    <div className="news-ticker group flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2 sm:px-6">
      <Link
        to="/news"
        className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-neutral-900 hover:underline"
      >
        <Megaphone className="h-3.5 w-3.5" />
        行业资讯
      </Link>
      <span className="h-4 w-px shrink-0 bg-neutral-300" />
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="news-ticker-track flex w-max items-center gap-10">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-10" aria-hidden={dup === 1}>
              {items.map((d: FeedDaily) => (
                <Link
                  key={`${dup}-${d.id}`}
                  to="/news"
                  className="flex items-center gap-2 whitespace-nowrap text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  <span className="text-neutral-400">{d.date.slice(5)}</span>
                  <span className="max-w-[60vw] truncate">{d.title}</span>
                  {d.sample && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">示例</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Link
        to="/news"
        className="shrink-0 text-sm text-neutral-400 transition-colors hover:text-neutral-900"
      >
        全部 →
      </Link>
    </div>
  )
}
