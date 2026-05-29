import { Feather } from 'lucide-react'

interface HeaderProps {
  totalCount: number
  today: string
}

export default function Header({ totalCount, today }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.85)] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Feather size={14} className="text-[hsl(var(--primary-foreground))]" />
          </div>
          <span className="font-semibold font-serif text-[hsl(var(--foreground))] text-base tracking-wide">
            我的日记
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[hsl(var(--muted-foreground))] hidden sm:block">
            共 {totalCount} 篇记录
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))] hidden sm:block">
            {today}
          </span>
        </div>
      </div>
    </header>
  )
}
