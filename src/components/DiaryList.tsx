import { Pencil, Trash2, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import type { DiaryEntry } from '@/types/diary'
import { WEATHER_OPTIONS } from '@/types/diary'
import { formatDate } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface DiaryListProps {
  entries: DiaryEntry[]
  selectedDate: string | null
  onEdit: (entry: DiaryEntry) => void
  onDelete: (id: string) => void
  onClearFilter: () => void
}

const PAGE_SIZE = 10

function getWeatherDisplay(entry: DiaryEntry): string {
  if (entry.weather === 'custom') return entry.customWeather || '自定义'
  const opt = WEATHER_OPTIONS.find(o => o.value === entry.weather)
  return opt ? `${opt.emoji} ${opt.label}` : ''
}

export default function DiaryList({ entries, selectedDate, onEdit, onDelete, onClearFilter }: DiaryListProps) {
  // 分页状态放在组件内，selectedDate 变化时重置
  const [page, setPage] = useState(1)

  // 用 key 触发重置——实际上用 useEffect 会更清晰
  const prevSelectedRef = useRef(selectedDate)
  if (prevSelectedRef.current !== selectedDate) {
    prevSelectedRef.current = selectedDate
    // 在 render 中同步重置（React 允许在渲染期间 setState，但用 ref 更简洁）
    if (page !== 1) setPage(1) // 会再次 render，无害
  }

  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = entries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function confirmDelete(id: string, title: string) {
    if (window.confirm(`确定删除日记「${title}」吗？`)) {
      onDelete(id)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 列表头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold font-serif text-[hsl(var(--foreground))]">
            {selectedDate ? formatDate(selectedDate) : '全部日记'}
          </h2>
          {entries.length > 0 && (
            <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
              {entries.length} 篇
            </span>
          )}
        </div>
        {selectedDate && (
          <button
            onClick={onClearFilter}
            className="text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-1 transition-colors"
          >
            <CalendarDays size={12} />
            查看全部
          </button>
        )}
      </div>

      {/* 列表内容 */}
      {entries.length === 0 ? (
        <EmptyState selectedDate={selectedDate} />
      ) : (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {paged.map(entry => (
              <DiaryItem
                key={entry.id}
                entry={entry}
                onEdit={onEdit}
                onDelete={() => confirmDelete(entry.id, entry.title)}
              />
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className={cn(
                  "page-btn text-[hsl(var(--muted-foreground))]",
                  safePage === 1 && "opacity-30 cursor-not-allowed"
                )}
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "page-btn",
                    p === safePage
                      ? "page-btn--active"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className={cn(
                  "page-btn text-[hsl(var(--muted-foreground))]",
                  safePage === totalPages && "opacity-30 cursor-not-allowed"
                )}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ---- 子组件 ----

import { useState, useRef } from 'react'

function DiaryItem({ entry, onEdit, onDelete }: {
  entry: DiaryEntry
  onEdit: (e: DiaryEntry) => void
  onDelete: () => void
}) {
  return (
    <div className="diary-item group animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        {/* 左侧信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
              {entry.date}
            </span>
            <span className="text-xs bg-[hsl(var(--diary-warm))] text-[hsl(var(--accent-foreground))] px-2 py-0.5 rounded-full">
              {getWeatherDisplay(entry)}
            </span>
          </div>
          <h3 className="font-semibold font-serif text-[hsl(var(--foreground))] truncate text-sm leading-snug">
            {entry.title || '（无标题）'}
          </h3>
          {entry.content && (
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-1">
              {entry.content}
            </p>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(entry)}
            title="编辑"
            className="w-7 h-7 flex items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))] transition-all"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={onDelete}
            title="删除"
            className="w-7 h-7 flex items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.08)] transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ selectedDate }: { selectedDate: string | null }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 opacity-60">📖</div>
      <p className="text-[hsl(var(--muted-foreground))] text-sm font-medium">
        {selectedDate ? `${selectedDate} 还没有日记` : '还没有任何日记'}
      </p>
      <p className="text-[hsl(var(--muted-foreground))] text-xs mt-1 opacity-70">
        点击「新建日记」开始记录今天的故事
      </p>
    </div>
  )
}
