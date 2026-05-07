import { useDemoStore, type DeliveryStatus } from "@/store/demo-store"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const labels = {
  es: {
    assigned: "Asignada",
    route: "En ruta",
    created: "Alta creada",
    in_progress: "En entrega",
    completed: "Completada",
    exception: "Excepcion",
    rejected: "Rechazada",
  },
  en: {
    assigned: "Assigned",
    route: "On route",
    created: "Created",
    in_progress: "In progress",
    completed: "Completed",
    exception: "Exception",
    rejected: "Rejected",
  },
}

const styles: Record<DeliveryStatus, string> = {
  assigned:
    "border-sky-500/30 bg-sky-500/10 text-[oklch(0.45_0.12_235)] dark:text-sky-200",
  route:
    "border-cyan-500/30 bg-cyan-500/10 text-[oklch(0.42_0.11_200)] dark:text-cyan-200",
  created:
    "border-teal-500/35 bg-teal-500/10 text-[oklch(0.4_0.09_195)] dark:text-teal-200",
  in_progress:
    "border-emerald-500/35 bg-emerald-500/10 text-[oklch(0.42_0.12_155)] dark:text-emerald-200",
  completed:
    "border-emerald-600/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-100",
  exception: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  rejected: "border-destructive/35 bg-destructive/10 text-destructive",
}

export function StatusBadge({
  status,
  className,
}: {
  status: DeliveryStatus
  className?: string
}) {
  const language = useDemoStore((s) => s.language)
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-3 py-0.5 text-xs font-medium shadow-sm transition-colors",
        styles[status],
        className,
      )}
    >
      {labels[language][status]}
    </Badge>
  )
}
