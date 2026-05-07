import type { ReactNode } from "react"
import { House } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { NotificationBell } from "@/components/NotificationBell"
import { Button } from "@/components/ui/button"
import trustLayLogo from "@/assets/trustlay-logo.png"
import { useDemoStore } from "@/store/demo-store"

function FlagES({ className }: { className?: string }) {
  return (
    <span
      className={
        "block overflow-hidden rounded-[3px] bg-[linear-gradient(to_bottom,#AA151B_0_25%,#F1BF00_25%_75%,#AA151B_75%_100%)] ring-1 ring-black/10 " +
        (className ?? "")
      }
      aria-hidden
    />
  )
}

function FlagUS({ className }: { className?: string }) {
  return (
    <span
      className={
        "relative block overflow-hidden rounded-[3px] bg-[repeating-linear-gradient(to_bottom,#B22234_0_7.69%,#FFFFFF_7.69%_15.38%)] ring-1 ring-black/10 " +
        (className ?? "")
      }
      aria-hidden
    >
      <span className="absolute left-0 top-0 h-[54%] w-[42%] bg-[#3C3B6E]" />
    </span>
  )
}

export function AppLayout({
  children,
  onReset,
  onGoHome,
}: {
  children: ReactNode
  onReset: () => void
  onGoHome: () => void
}) {
  const language = useDemoStore((s) => s.language)
  const setLanguage = useDemoStore((s) => s.setLanguage)
  const status = useDemoStore((s) => s.status)

  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_circle_at_20%_-10%,oklch(0.95_0.04_210)_0%,transparent_45%),radial-gradient(900px_circle_at_100%_0%,oklch(0.96_0.03_200)_0%,transparent_50%)] pb-[env(safe-area-inset-bottom,0px)] text-foreground">
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[oklch(0.995_0.01_218_/0.88)] shadow-[0_1px_0_rgb(0_0_0_/0.03),0_14px_42px_-28px_oklch(0.48_0.08_215_/_0.35)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[oklch(0.995_0.012_220_/0.78)] dark:border-white/10 dark:bg-black/58 dark:shadow-black/50">
        <div className="mx-auto flex w-full max-w-md items-center gap-3 px-[max(1rem,env(safe-area-inset-left))] py-3.5 pr-[max(1rem,env(safe-area-inset-right))] sm:max-w-2xl sm:py-4 lg:max-w-4xl">
          <button
            type="button"
            onClick={onReset}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl text-left outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/35 sm:gap-3"
            aria-label="Reiniciar demo"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl sm:h-11 sm:w-11">
              <img
                src={trustLayLogo}
                alt="TrustLay"
                className="h-10 w-[11rem] max-w-none object-left mix-blend-multiply sm:h-11"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-semibold tracking-tight sm:text-lg">
                TrustLay
              </p>
              <p className="truncate text-[0.65rem] leading-tight text-muted-foreground sm:text-xs">
                Conductor
              </p>
            </div>
          </button>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {status !== "assigned" ? (
              <button
                type="button"
                onClick={onGoHome}
                aria-label={language === "es" ? "Inicio" : "Home"}
                className="group/home relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-black/8 bg-white/90 text-foreground shadow-[0_8px_28px_-16px_oklch(0.45_0.1_215_/_0.45)] backdrop-blur-md transition-all duration-200 ease-out hover:w-[6.5rem] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:border-white/12 dark:bg-white/10 sm:h-11 sm:w-11"
              >
                <House className="pointer-events-none absolute left-1/2 top-1/2 size-[1.3rem] -translate-x-1/2 -translate-y-1/2 text-foreground/90 transition-all duration-200 group-hover/home:left-3.5 group-hover/home:translate-x-0 sm:group-hover/home:left-4" />
                <span className="ml-8 whitespace-nowrap text-[0.6875rem] font-semibold uppercase opacity-0 transition-opacity duration-150 group-hover/home:opacity-100 sm:text-[0.75rem]">
                  {language === "es" ? "Inicio" : "Home"}
                </span>
              </button>
            ) : null}
            <NotificationBell />
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="h-10 w-10 rounded-xl border-black/8 bg-white/90 shadow-[0_8px_28px_-16px_oklch(0.45_0.1_215_/_0.45)] backdrop-blur-md transition-transform duration-150 ease-out active:scale-[0.96] dark:border-white/12 dark:bg-white/10 sm:h-11 sm:w-11"
              aria-label={
                language === "es" ? "Cambiar a ingles" : "Switch to Spanish"
              }
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
            >
              {language === "es" ? (
                <FlagES className="h-[1.05rem] w-[1.55rem]" />
              ) : (
                <FlagUS className="h-[1.05rem] w-[1.55rem]" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-[max(1rem,env(safe-area-inset-left))] pb-5 pt-5 pr-[max(1rem,env(safe-area-inset-right))] sm:max-w-2xl sm:pb-8 sm:pt-8 lg:max-w-4xl">
        {children}
      </main>

      <Toaster position="top-center" closeButton duration={3800} />
    </div>
  )
}
