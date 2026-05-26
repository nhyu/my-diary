import { useState, useEffect, useRef } from 'react'
import { X, Check } from 'lucide-react'
import type { DiaryEntry, WeatherType } from '@/types/diary'
import { WEATHER_OPTIONS } from '@/types/diary'
import { generateId, todayStr } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface DiaryDialogProps {
  open: boolean
  editEntry?: DiaryEntry | null
  defaultDate?: string
  onClose: () => void
  onSave: (entry: DiaryEntry) => void
}

export default function DiaryDialog({ open, editEntry, defaultDate, onClose, onSave }: DiaryDialogProps) {
  const [date, setDate] = useState(todayStr())
  const [weather, setWeather] = useState<WeatherType>('sunny')
  const [customWeather, setCustomWeather] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const titleRef = useRef<HTMLInputElement>(null)

  // 打开时初始化表单
  useEffect(() => {
    if (open) {
      if (editEntry) {
        setDate(editEntry.date)
        setWeather(editEntry.weather)
        setCustomWeather(editEntry.customWeather ?? '')
        setTitle(editEntry.title)
        setContent(editEntry.content)
      } else {
        setDate(defaultDate ?? todayStr())
        setWeather('sunny')
        setCustomWeather('')
        setTitle('')
        setContent('')
      }
      setErrors({})
      // 聚焦标题输入框
      setTimeout(() => titleRef.current?.focus(), 80)
    }
  }, [open, editEntry, defaultDate])

  // ESC 关闭
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!date) errs.date = '请选择日期'
    if (!title.trim()) errs.title = '请输入日记标题'
    if (!content.trim()) errs.content = '请输入日记内容'
    if (weather === 'custom' && !customWeather.trim()) errs.customWeather = '请填写自定义天气'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const now = Date.now()
    const entry: DiaryEntry = {
      id: editEntry?.id ?? generateId(),
      date,
      weather,
      customWeather: weather === 'custom' ? customWeather.trim() : undefined,
      title: title.trim(),
      content: content.trim(),
      createdAt: editEntry?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(entry)
  }

  if (!open) return null

  return (
    <div
      className="dialog-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-[hsl(var(--diary-page))] rounded-2xl w-full max-w-lg shadow-[var(--shadow-dialog)] animate-slide-in overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={editEntry ? '编辑日记' : '新建日记'}
      >
        {/* 对话框头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
          <h2 className="font-semibold font-serif text-lg text-[hsl(var(--foreground))]">
            {editEntry ? '编辑日记' : '写下今天'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* 表单内容 */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* 日期 */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={e => { setDate(e.target.value); setErrors(err => ({ ...err, date: '' })) }}
              className={cn(
                "diary-input w-full px-3 py-2 text-sm",
                errors.date && "border-[hsl(var(--destructive))]"
              )}
            />
            {errors.date && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.date}</p>}
          </div>

          {/* 天气 */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
              今日天气
            </label>
            <div className="flex flex-wrap gap-2">
              {WEATHER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setWeather(opt.value)}
                  className={cn('weather-tag', weather === opt.value && 'weather-tag--active')}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setWeather('custom')}
                className={cn('weather-tag', weather === 'custom' && 'weather-tag--active')}
              >
                <span>✏️</span>
                <span>自定义</span>
              </button>
            </div>
            {weather === 'custom' && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="请描述天气，如：多云转晴"
                  value={customWeather}
                  onChange={e => { setCustomWeather(e.target.value); setErrors(err => ({ ...err, customWeather: '' })) }}
                  className={cn(
                    "diary-input w-full px-3 py-2 text-sm",
                    errors.customWeather && "border-[hsl(var(--destructive))]"
                  )}
                />
                {errors.customWeather && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.customWeather}</p>}
              </div>
            )}
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
              标题
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="给这篇日记起个标题…"
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(err => ({ ...err, title: '' })) }}
              className={cn(
                "diary-input w-full px-3 py-2 text-sm",
                errors.title && "border-[hsl(var(--destructive))]"
              )}
            />
            {errors.title && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.title}</p>}
          </div>

          {/* 正文 */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
              内容
            </label>
            <textarea
              placeholder="写下今天的故事、感受和想法…"
              value={content}
              onChange={e => { setContent(e.target.value); setErrors(err => ({ ...err, content: '' })) }}
              rows={7}
              className={cn(
                "diary-input diary-textarea w-full px-3 py-2 text-sm",
                errors.content && "border-[hsl(var(--destructive))]"
              )}
            />
            {errors.content && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.content}</p>}
            <p className="text-right text-xs text-[hsl(var(--muted-foreground))] mt-1">
              {content.length} 字
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-[hsl(var(--border))] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="diary-btn-primary flex items-center gap-1.5 px-5 py-2 text-sm"
          >
            <Check size={14} />
            {editEntry ? '保存修改' : '发布日记'}
          </button>
        </div>
      </div>
    </div>
  )
}
