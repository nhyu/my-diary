import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarProps {
  selectedDate: string | null
  diaryDates: Set<string>
  onSelectDate: (date: string) => void
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function Calendar({ selectedDate, diaryDates, onSelectDate }: CalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function goToday() {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
  }

  // 构建日历格子
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

  type Cell = { day: number; type: 'prev' | 'current' | 'next'; dateStr: string }
  const cells: Cell[] = []

  // 上月补位
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const pm = viewMonth === 0 ? 11 : viewMonth - 1
    const py = viewMonth === 0 ? viewYear - 1 : viewYear
    cells.push({ day: d, type: 'prev', dateStr: toDateStr(py, pm, d) })
  }

  // 当月
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current', dateStr: toDateStr(viewYear, viewMonth, d) })
  }

  // 下月补位
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const nm = viewMonth === 11 ? 0 : viewMonth + 1
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear
    cells.push({ day: d, type: 'next', dateStr: toDateStr(ny, nm, d) })
  }

  const monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']

  return (
    <div className="select-none">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          aria-label="上个月"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={goToday}
          className="text-sm font-semibold font-serif text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors px-2 py-1 rounded"
        >
          {viewYear}年 {monthNames[viewMonth]}
        </button>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          aria-label="下个月"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 星期表头 */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={cn(
              "text-center text-xs font-medium py-1",
              i === 0 || i === 6
                ? "text-[hsl(var(--diary-mark))]"
                : "text-[hsl(var(--muted-foreground))]"
            )}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell, idx) => {
          const isOther = cell.type !== 'current'
          const isToday = cell.dateStr === todayStr
          const isSelected = cell.dateStr === selectedDate
          const hasDiary = diaryDates.has(cell.dateStr)
          const isWeekend = idx % 7 === 0 || idx % 7 === 6

          return (
            <div key={idx} className="flex justify-center">
              <button
                onClick={() => !isOther && onSelectDate(cell.dateStr)}
                disabled={isOther}
                className={cn(
                  'cal-day',
                  isOther && 'cal-day--other',
                  isToday && !isSelected && 'cal-day--today',
                  isSelected && 'cal-day--selected',
                  hasDiary && 'cal-day--has-diary',
                  !isOther && !isSelected && isWeekend && 'text-[hsl(var(--diary-mark))]',
                )}
              >
                {cell.day}
              </button>
            </div>
          )
        })}
      </div>

      {/* 图例 */}
      <div className="mt-4 pt-3 border-t border-[hsl(var(--border))] flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--diary-mark))]" />
          有日记
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-5 h-5 rounded-full bg-[hsl(var(--gradient-primary))] text-center text-[10px] leading-5" style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}>
            •
          </span>
          今日
        </span>
      </div>
    </div>
  )
}
