import { useState, useMemo } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import Header from '@/components/Header'
import Calendar from '@/components/Calendar'
import DiaryList from '@/components/DiaryList'
import DiaryDialog from '@/components/DiaryDialog'
import type { DiaryEntry } from '@/types/diary'
import {
  loadEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  getDatesWithDiary,
  getEntriesByDate,
  todayStr,
} from '@/lib/storage'

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadEntries())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<DiaryEntry | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // 日历标记
  const diaryDates = useMemo(() => getDatesWithDiary(entries), [entries])

  // 当前展示的日记列表
  const displayedEntries = useMemo(() => {
    if (selectedDate) return getEntriesByDate(entries, selectedDate)
    // 按时间倒序
    return [...entries].sort((a, b) => b.updatedAt - a.updatedAt)
  }, [entries, selectedDate])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  function handleNewDiary() {
    setEditEntry(null)
    setDialogOpen(true)
  }

  function handleEdit(entry: DiaryEntry) {
    setEditEntry(entry)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setEntries(prev => deleteEntry(prev, id))
    showToast('日记已删除')
  }

  function handleSave(entry: DiaryEntry) {
    if (editEntry) {
      setEntries(prev => updateEntry(prev, entry))
      showToast('日记已更新 ✓')
    } else {
      setEntries(prev => addEntry(prev, entry))
      showToast('日记已保存 ✓')
    }
    setDialogOpen(false)
    setEditEntry(null)
  }

  function handleSelectDate(date: string) {
    setSelectedDate(prev => prev === date ? null : date)
  }

  const today = todayStr()

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header totalCount={entries.length} today={today} />

      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">

          {/* 左侧：新建按钮 + 日历 */}
          <aside className="w-72 shrink-0 space-y-4">
            {/* 新建按钮 */}
            <button
              onClick={handleNewDiary}
              className="diary-btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium"
            >
              <Plus size={16} />
              新建日记
            </button>

            {/* 日历卡片 */}
            <div className="diary-card p-4">
              <Calendar
                selectedDate={selectedDate}
                diaryDates={diaryDates}
                onSelectDate={handleSelectDate}
              />
            </div>

            {/* 小提示 */}
            <p className="text-xs text-center text-[hsl(var(--muted-foreground))] opacity-70 px-2">
              点击日历中的日期查看当天日记
            </p>
          </aside>

          {/* 右侧：日记列表 */}
          <section className="flex-1 min-w-0">
            <div className="diary-card p-5 min-h-[calc(100vh-10rem)]">
              {entries.length === 0 && !selectedDate ? (
                <WelcomeBanner onNew={handleNewDiary} />
              ) : (
                <DiaryList
                  entries={displayedEntries}
                  selectedDate={selectedDate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClearFilter={() => setSelectedDate(null)}
                />
              )}
            </div>
          </section>
        </div>
      </main>

      {/* 编辑/新建对话框 */}
      <DiaryDialog
        open={dialogOpen}
        editEntry={editEntry}
        defaultDate={selectedDate ?? today}
        onClose={() => { setDialogOpen(false); setEditEntry(null) }}
        onSave={handleSave}
      />

      {/* Toast 提示 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-sm px-5 py-2.5 rounded-full shadow-lg font-medium">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

// 欢迎横幅
function WelcomeBanner({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-card-warm" style={{ background: 'var(--gradient-primary)' }}>
        <BookOpen size={28} className="text-[hsl(var(--primary-foreground))]" />
      </div>
      <h2 className="font-serif text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
        开始记录你的故事
      </h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-xs leading-relaxed mb-6">
        每一天都是值得珍藏的记忆，用文字记录生活的喜怒哀乐，让时间留下痕迹。
      </p>
      <button
        onClick={onNew}
        className="diary-btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
      >
        <Plus size={15} />
        写下第一篇日记
      </button>
    </div>
  )
}
