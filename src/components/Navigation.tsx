import { Home, Package } from "lucide-react"
import { cn } from "@/lib/utils"

export type DemoSection = "home" | "delivery"

export function Navigation({
  active,
  onChange,
}: {
  active: DemoSection
  onChange: (section: DemoSection) => void
}) {
  const tabs: { key: DemoSection; label: string; icon: typeof Home }[] = [
    { key: "home", label: "Inicio", icon: Home },
    { key: "delivery", label: "Entrega", icon: Package },
  ]

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-3 sm:bottom-6 sm:flex sm:justify-center sm:bg-transparent sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex w-[min(32rem,calc(100%-1.75rem))] items-center gap-2 rounded-[1.25rem] bg-white/90 px-3 py-2 shadow-[0_22px_60px_-38px_oklch(0.42_0.1_215_/_0.65)] ring-1 ring-black/10 backdrop-blur-xl dark:bg-white/12 dark:ring-white/15 sm:rounded-full sm:py-2.5">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = active === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-300 ease-out active:scale-[0.98] sm:flex-initial sm:rounded-full sm:px-6 sm:py-2",
                isActive &&
                  "bg-primary text-primary-foreground shadow-[0_16px_40px_-26px_oklch(0.48_0.12_205_/_0.55)] dark:shadow-black/35",
                !isActive &&
                  "bg-transparent text-muted-foreground hover:bg-muted/65 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
