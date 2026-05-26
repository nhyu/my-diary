import type { DiaryEntry } from '@/types/diary'

const STORAGE_KEY = 'my-diary-entries'

export function loadEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DiaryEntry[]
  } catch {
    return []
  }
}

export function saveEntries(entries: DiaryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function addEntry(entries: DiaryEntry[], entry: DiaryEntry): DiaryEntry[] {
  const next = [entry, ...entries]
  saveEntries(next)
  return next
}

export function updateEntry(entries: DiaryEntry[], updated: DiaryEntry): DiaryEntry[] {
  const next = entries.map(e => e.id === updated.id ? { ...updated, updatedAt: Date.now() } : e)
  saveEntries(next)
  return next
}

export function deleteEntry(entries: DiaryEntry[], id: string): DiaryEntry[] {
  const next = entries.filter(e => e.id !== id)
  saveEntries(next)
  return next
}

export function getDatesWithDiary(entries: DiaryEntry[]): Set<string> {
  return new Set(entries.map(e => e.date))
}

export function getEntriesByDate(entries: DiaryEntry[], date: string): DiaryEntry[] {
  return entries.filter(e => e.date === date)
}

export function formatDate(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
}

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function generateId(): string {
  return `diary-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
