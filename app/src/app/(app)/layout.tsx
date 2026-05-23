import { BottomNav } from '@/components/pm/BottomNav'
import { StarsBg } from '@/components/pm/StarsBg'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StarsBg />
      <main className="relative z-10 min-h-dvh pb-24 max-w-md mx-auto px-0">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
