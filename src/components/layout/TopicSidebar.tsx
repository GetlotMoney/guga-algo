import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { TOPICS, TOPIC_CATEGORIES } from '@/content/topics-registry'
import type { TopicMeta } from '@/content/topics-registry'
import type { HeadingItem } from '@/lib/extract-headings'
import { cn } from '@/lib/utils'

type Props = {
  currentTopicId: string
  headings: HeadingItem[]  // 当前专题的 h2/h3 标题
  onNavigate?: () => void
}

/**
 * 完整侧栏：全部专题（按分类折叠）+ 当前专题的 h2/h3 子目录。
 * 学完一个专题可直接点侧栏里的其他专题切换，不用回首页。
 */
export function TopicSidebar({ currentTopicId, headings, onNavigate }: Props) {
  const reduce = useReducedMotion()
  const [expandedCats, setExpandedCats] = useState<Set<string>>(() => {
    // 默认展开当前专题所在的分类
    const currentTopic = TOPICS.find(t => t.id === currentTopicId)
    return new Set(currentTopic ? [currentTopic.category] : [])
  })
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set([currentTopicId])
  )
  const [activeHeadingId, setActiveHeadingId] = useState(headings[0]?.id ?? '')

  const toggleCategory = (cat: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev)
      if (next.has(topicId)) next.delete(topicId)
      else next.add(topicId)
      return next
    })
  }

  const handleHeadingClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setActiveHeadingId(id)
    const el = document.getElementById(id)
    if (el) {
      const offset = 56 + 16
      const y = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
      history.replaceState(null, '', `#${id}`)
    }
    onNavigate?.()
  }

  // 构建当前专题的 h2/h3 树
  type TreeNode = HeadingItem & { children: HeadingItem[] }
  const headingTree: TreeNode[] = []
  let currentParent: TreeNode | null = null
  for (const h of headings) {
    if (h.level === 2) {
      currentParent = { ...h, children: [] }
      headingTree.push(currentParent)
    } else if (h.level === 3 && currentParent) {
      currentParent.children.push(h)
    }
  }

  // 按分类分组专题
  const topicsByCat = TOPIC_CATEGORIES.map(cat => ({
    category: cat,
    topics: TOPICS.filter(t => t.category === cat),
  }))

  const difficultyColor: Record<string, string> = {
    '入门': 'text-emerald-600 dark:text-emerald-400',
    '进阶': 'text-amber-600 dark:text-amber-400',
    '综合': 'text-red-600 dark:text-red-400',
  }

  return (
    <nav className="space-y-1" aria-label="专题目录">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        全部专题
      </p>

      {topicsByCat.map(({ category, topics }) => {
        const isCatExpanded = expandedCats.has(category)
        return (
          <div key={category}>
            {/* 分类标题：可展开/折叠 */}
            <button
              onClick={() => toggleCategory(category)}
              className="flex w-full items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {isCatExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              {category}
              <span className="ml-auto text-[10px] font-normal opacity-60">{topics.length}</span>
            </button>

            {/* 分类下的专题列表 */}
            {isCatExpanded && (
              <div className="space-y-0.5">
                {topics.map(t => {
                  const isCurrent = t.id === currentTopicId
                  const isTopicExpanded = expandedTopics.has(t.id)
                  return (
                    <div key={t.id}>
                      {/* 专题标题 */}
                      <div className="flex items-center">
                        {t.id === currentTopicId && headingTree.length > 0 && (
                          <button
                            onClick={() => toggleTopic(t.id)}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <ChevronRight
                              className={cn('h-3 w-3 transition-transform', isTopicExpanded && 'rotate-90')}
                            />
                          </button>
                        )}
                        <Link
                          to={`/topics/${t.id}`}
                          onClick={onNavigate}
                          className={cn(
                            'flex-1 truncate rounded-md px-3 py-2 text-[15px] transition-colors',
                            isCurrent
                              ? 'bg-primary/10 font-medium text-primary'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          )}
                          title={t.title}
                        >
                          {t.title}
                          <span className={cn('ml-1.5 text-[10px]', difficultyColor[t.difficulty] ?? '')}>
                            {t.difficulty}
                          </span>
                        </Link>
                      </div>

                      {/* 当前专题的 h2/h3 子目录 */}
                      {isCurrent && isTopicExpanded && headingTree.length > 0 && (
                        <div className="space-y-0.5 border-l-2 border-primary/20 ml-5">
                          {headingTree.map(parent => (
                            <div key={parent.id}>
                              <a
                                href={`#${parent.id}`}
                                onClick={(e) => handleHeadingClick(e, parent.id)}
                                className={cn(
                                  'block truncate rounded-md py-1.5 pl-4 pr-3 text-sm transition-colors',
                                  activeHeadingId === parent.id
                                    ? 'font-medium text-primary'
                                    : 'text-muted-foreground hover:text-foreground',
                                )}
                              >
                                {parent.text}
                              </a>
                              {parent.children.map(child => (
                                <a
                                  key={child.id}
                                  href={`#${child.id}`}
                                  onClick={(e) => handleHeadingClick(e, child.id)}
                                  className={cn(
                                    'block truncate rounded-md py-1 pl-8 pr-3 text-[13px] transition-colors',
                                    activeHeadingId === child.id
                                      ? 'font-medium text-primary'
                                      : 'text-muted-foreground/80 hover:text-foreground',
                                  )}
                                >
                                  {child.text}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
