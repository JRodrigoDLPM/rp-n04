import { Bell, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useDemoStore, type NotificationItem } from "@/store/demo-store"
import { useMemo, useState } from "react"

function formatNotificationStamp(ts: number, language: "es" | "en") {
  const locale = language === "es" ? "es-MX" : "en-US"
  const d = new Date(ts)
  const day =
    typeof navigator !== "undefined" &&
    d.toDateString() === new Date().toDateString()
      ? language === "es"
        ? "Hoy"
        : "Today"
      : d.toLocaleDateString(locale, {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
  const time = d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${day} · ${time}`
}

function NotificationRow({
  n,
  onOpen,
  language,
}: {
  n: NotificationItem
  onOpen: () => void
  language: "es" | "en"
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        onOpen()
      }}
      className={cn(
        "flex w-full flex-col gap-1 rounded-2xl px-3.5 py-3 text-left transition-colors duration-200",
        "hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        !n.read && "bg-primary/[0.06] ring-1 ring-primary/15",
      )}
    >
      <div className="flex items-start gap-2">
        {!n.read ? (
          <span
            className="mt-1.5 size-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_oklch(0.72_0.12_205_/_0.25)]"
            aria-hidden
          />
        ) : (
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-border" aria-hidden />
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[0.8125rem] font-semibold leading-snug text-foreground">
            {n.title}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">{n.body}</p>
          <p className="font-mono text-[0.65rem] tabular-nums text-muted-foreground/85">
            {formatNotificationStamp(n.createdAt, language)}
          </p>
        </div>
      </div>
    </button>
  )
}

export function NotificationBell() {
  const language = useDemoStore((s) => s.language)
  const notifications = useDemoStore((s) => s.notifications)
  const markRead = useDemoStore((s) => s.markNotificationRead)
  const markAll = useDemoStore((s) => s.markAllNotificationsRead)
  const clearAll = useDemoStore((s) => s.clearAllNotifications)
  const [open, setOpen] = useState(false)

  const unread = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const sorted = useMemo(
    () => [...notifications].sort((a, b) => b.createdAt - a.createdAt),
    [notifications],
  )

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="relative h-10 w-10 rounded-xl border-black/8 bg-white/90 shadow-[0_8px_28px_-16px_oklch(0.45_0.1_215_/_0.45)] backdrop-blur-md transition-transform duration-150 ease-out active:scale-[0.96] dark:border-white/12 dark:bg-white/10 sm:h-11 sm:w-11"
          aria-label={language === "es" ? "Notificaciones" : "Notifications"}
        >
          <Bell className="size-[1.35rem] text-foreground/90" />
          {unread > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-[oklch(0.58_0.2_25)] px-1 text-[0.625rem] font-bold leading-none text-white shadow-sm ring-2 ring-background">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(calc(100vw-2.25rem),17.5rem)] rounded-2xl p-0 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 sm:w-[min(calc(100vw-1.5rem),21rem)]"
      >
        <div className="border-b border-border/80 px-4 py-3">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            {language === "es" ? "Notificaciones" : "Notifications"}
          </DropdownMenuLabel>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {language === "es"
              ? "Historial de la sesión (demo)"
              : "Session history (demo)"}
          </p>
        </div>

        <div className="flex items-center justify-end gap-1 border-b border-border/60 px-2 py-2">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-8 rounded-lg px-2.5 text-[0.6875rem] font-medium"
            onClick={(e) => {
              e.stopPropagation()
              markAll()
            }}
          >
            {language === "es" ? "Marcar leidas" : "Mark all read"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-8 rounded-lg px-2.5 text-[0.6875rem] font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              clearAll()
            }}
          >
            <Trash2 className="size-3.5 opacity-80" aria-hidden />
            {language === "es" ? "Borrar todo" : "Clear all"}
          </Button>
        </div>

        <ScrollArea className="max-h-[min(46vh,16.5rem)] sm:max-h-[min(58vh,20rem)]">
          <div className="flex flex-col gap-1.5 p-2">
            {sorted.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                {language === "es"
                  ? "Sin avisos. Las acciones del flujo apareceran aqui."
                  : "No notifications yet. Flow actions appear here."}
              </p>
            ) : (
              sorted.map((n) => (
                <NotificationRow
                  key={n.id}
                  n={n}
                  language={language}
                  onOpen={() => markRead(n.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
