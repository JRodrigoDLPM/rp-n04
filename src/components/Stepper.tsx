import { cn } from "@/lib/utils"
import { useDemoStore, type DeliveryStatus } from "@/store/demo-store"
import { AlertTriangle, BadgeCheck, Check, CircleGauge, ClipboardCheck, XCircle } from "lucide-react"

function isErrorStatus(status: DeliveryStatus) {
  return status === "exception" || status === "rejected"
}

/** High-level: Home → Route → Tracking */
const mainSteps = [
  { key: "assigned", labelEs: "Inicio", labelEn: "Home" },
  { key: "route", labelEs: "Ruta", labelEn: "Route" },
  { key: "tracking", labelEs: "Seguimiento", labelEn: "Tracking" },
] as const

function mainStepIndex(status: DeliveryStatus): number {
  if (status === "assigned") return 0
  if (status === "route") return 1
  return 2
}

export function MainFlowStepper({ status }: { status: DeliveryStatus }) {
  const language = useDemoStore((s) => s.language)
  const active = mainStepIndex(status)
  const isError = isErrorStatus(status)

  return (
    <div className="w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className={cn(
          "flex min-w-max items-start gap-0 rounded-2xl px-0.5 py-2 transition-[background-color,box-shadow] duration-500 ease-out",
          isError &&
            "bg-destructive/6 ring-1 ring-destructive/35 shadow-inner dark:bg-destructive/15 dark:ring-destructive/40",
        )}
      >
        {mainSteps.map((step, index) => {
          const done = index < active
          const current = index === active

          let circleCls = cn(
            "relative flex size-9 items-center justify-center rounded-2xl text-xs font-semibold shadow-sm ring-2 ring-offset-2 ring-offset-[var(--background)] transition-[transform,background-color,color,box-shadow,ring-color] duration-500 ease-out",
          )

          if (isError) {
            circleCls = cn(
              circleCls,
              done &&
                "bg-destructive/25 text-destructive ring-destructive/45 dark:bg-destructive/35",
              current &&
                "scale-[1.05] bg-destructive text-destructive-foreground shadow-[0_10px_32px_-12px_rgb(239_68_68_/_0.45)] ring-destructive/60",
              !done &&
                !current &&
                "bg-destructive/10 text-destructive/75 ring-destructive/30 dark:text-destructive",
            )
          } else {
            circleCls = cn(
              circleCls,
              done &&
                "bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_oklch(0.55_0.12_200_/_0.55)] ring-primary/35",
              current &&
                !done &&
                "scale-105 bg-[oklch(0.93_0.04_200)] text-primary shadow-[0_10px_30px_-12px_oklch(0.52_0.11_205_/_0.45)] ring-primary/45 dark:bg-white/15",
              !done &&
                !current &&
                "bg-muted text-muted-foreground ring-border/70 dark:ring-white/15",
            )
          }

          return (
            <div key={step.key} className="flex items-start">
              <div className="flex flex-col items-center gap-2 px-3 py-1">
                <div className={circleCls}>
                  {done ? (
                    <Check aria-hidden className="size-4" strokeWidth={2.5} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "max-w-[5.5rem] text-center text-[0.6875rem] font-medium tracking-tight transition-colors duration-500 ease-out",
                    current && (isError ? "text-destructive" : "text-foreground"),
                    !current && "text-muted-foreground",
                  )}
                >
                  {language === "es" ? step.labelEs : step.labelEn}
                </span>
              </div>
              {index < mainSteps.length - 1 ? (
                <div
                  className={cn(
                    "relative top-[1.125rem] h-[3px] w-8 shrink-0 rounded-full transition-[background-color,width,transform] duration-500 ease-out sm:w-14",
                    isError
                      ? index < active
                        ? "bg-destructive/45"
                        : "bg-destructive/20"
                      : index < active
                        ? "bg-primary/50"
                        : "bg-border/80",
                  )}
                  aria-hidden
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type TrackingStep = {
  key: "created" | "in_progress" | "completed" | "exception" | "rejected"
  label: string
  icon: typeof ClipboardCheck
}

function trackingStepsFor(status: DeliveryStatus): TrackingStep[] {
  const tail =
    status === "exception"
      ? {
          key: "exception" as const,
          label: "Exception",
          icon: AlertTriangle,
        }
      : status === "rejected"
        ? { key: "rejected" as const, label: "Rejected", icon: XCircle }
        : { key: "completed" as const, label: "Completed", icon: BadgeCheck }

  return [
    { key: "created", label: "Created", icon: ClipboardCheck },
    { key: "in_progress", label: "In Progress", icon: CircleGauge },
    tail,
  ]
}

const trackingLabels = {
  es: {
    created: "Creada",
    in_progress: "En progreso",
    completed: "Completada",
    exception: "Incidente",
    rejected: "Rechazada",
  },
  en: {
    created: "Created",
    in_progress: "In Progress",
    completed: "Completed",
    exception: "Exception",
    rejected: "Rejected",
  },
}

function trackingStepIndex(status: DeliveryStatus): number {
  if (status === "created") return 0
  if (status === "in_progress") return 1
  return 2
}

export function TrackingStepBar({ status }: { status: DeliveryStatus }) {
  const language = useDemoStore((s) => s.language)
  const steps = trackingStepsFor(status)
  const active = trackingStepIndex(status)
  const isError = isErrorStatus(status)

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-muted/[0.28] px-3 py-3 sm:px-4 sm:py-4">
      <div
        className={cn(
          "relative grid grid-cols-3 items-start gap-3 rounded-2xl transition-[background-color] duration-500 ease-out sm:gap-5",
          isError && "bg-destructive/[0.04]",
        )}
      >
        <div
          className={cn(
            "absolute left-[16.66%] right-[16.66%] top-[3.875rem] h-[3px] rounded-full sm:top-[4.375rem]",
            isError ? "bg-destructive/15" : "bg-border/85",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "absolute left-[16.66%] top-[3.875rem] h-[3px] rounded-full transition-all duration-500 ease-out sm:top-[4.375rem]",
            active === 0 ? "w-0" : active === 1 ? "w-[33.33%]" : "w-[66.66%]",
            isError ? "bg-destructive/45" : "bg-primary/55",
          )}
          aria-hidden
        />

        {steps.map((step, index) => {
          const doneNormal = index < active
          const current = index === active
          const showCheckBadge =
            status === "completed" ? index <= active : !isError && doneNormal

          const cardBase =
            "relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl border bg-card shadow-sm transition-[transform,background-color,color,box-shadow,border-color] duration-500 ease-out sm:h-14 sm:w-14"

          let cardCls = cardBase

          if (isError && current) {
            cardCls = cn(
              cardBase,
              "scale-[1.02] border-destructive/60 bg-destructive/10 text-destructive shadow-[0_10px_24px_-16px_rgb(239_68_68_/_0.55)]",
            )
          } else if (isError && doneNormal) {
            cardCls = cn(cardBase, "border-destructive/35 bg-destructive/8 text-destructive")
          } else if (isError && !doneNormal && !current) {
            cardCls = cn(cardBase, "border-border/60 bg-card text-muted-foreground")
          } else {
            cardCls = cn(
              cardBase,
              doneNormal &&
                "border-primary/45 bg-primary/8 text-primary shadow-[0_8px_22px_-16px_oklch(0.55_0.12_200_/_0.55)]",
              current &&
                !doneNormal &&
                "scale-[1.02] border-primary/55 bg-primary/10 text-primary shadow-[0_10px_24px_-16px_oklch(0.52_0.11_205_/_0.5)]",
              !doneNormal &&
                !current &&
                "border-border/65 bg-card text-muted-foreground",
            )
          }

          const Icon = step.icon

          return (
            <div key={step.key} className="relative flex flex-col items-center">
              <div className={cardCls}>
                <Icon className="size-6 sm:size-7" strokeWidth={1.75} aria-hidden />
                {showCheckBadge ? (
                  <Check
                    aria-hidden
                    className="absolute -right-1 -top-1 size-4 rounded-full bg-background text-primary"
                    strokeWidth={2.4}
                  />
                ) : null}
              </div>
              <span
                className={cn(
                  "mt-2 size-3 rounded-full border-2 transition-colors duration-500",
                  doneNormal || current
                    ? isError
                      ? "border-destructive/20 bg-destructive shadow-[0_0_0_4px_rgb(239_68_68_/_0.15)]"
                      : "border-primary/15 bg-primary shadow-[0_0_0_4px_oklch(0.55_0.12_205_/_0.16)]"
                    : "border-border bg-background",
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "mt-2 text-center text-[0.66rem] font-semibold tracking-tight sm:text-xs",
                  current && (isError ? "text-destructive" : "text-foreground"),
                  !current && "text-muted-foreground",
                )}
              >
                {trackingLabels[language][step.key]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
