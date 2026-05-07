import { type ReactNode, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileDrop } from "@/components/FileDrop"
import { MapPlaceholder } from "@/components/MapPlaceholder"
import { StatusBadge } from "@/components/StatusBadge"
import { TrackingStepBar } from "@/components/Stepper"
import {
  useDemoStore,
  type DeliveryStatus,
} from "@/store/demo-store"
import { ArrowRight, CircleDot, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const flowI18n = {
  es: {
    homeCompleted: "Entrega completada",
    homeIncidentDone: "Entrega terminada por incidente",
    homeAssigned: "Entrega asignada",
    homeNewAssigned: "Nueva entrega asignada",
    serviceDone: "Servicio finalizado correctamente.",
    serviceIncidentDone: "Servicio cerrado como incidente.",
    homeHint:
      "La ruta ya está optimizada. Revisa el mapa y los puntos antes de iniciar el servicio.",
    homeReady: "Listo para abrir el mapa y continuar",
    viewStatus: "Ver estatus",
    viewRoute: "Ver ruta",
    backHome: "Regresar al inicio",
    routeTitle: "Tu recorrido",
    routeSubtitle: "En espera",
    routeSubtitle2: "puntos ordenados (simulación).",
    startDelivery: "Iniciar entrega",
    origin: "Origen",
    stop1: "Parada 1",
    destination: "Destino",
    routeTitleOrigin: "Centro distribución Vallejo",
    routeTitleStop1: "Pickup paquete",
    routeTitleDestination: "Entrega al cliente final",
  },
  en: {
    homeCompleted: "Delivery completed",
    homeIncidentDone: "Delivery ended due to incident",
    homeAssigned: "Delivery assigned",
    homeNewAssigned: "New delivery assigned",
    serviceDone: "Service completed successfully.",
    serviceIncidentDone: "Service closed as incident.",
    homeHint: "Route is optimized. Review map and stops before starting service.",
    homeReady: "Ready to open the map and continue",
    viewStatus: "View status",
    viewRoute: "View route",
    backHome: "Back to home",
    routeTitle: "Your route",
    routeSubtitle: "On standby",
    routeSubtitle2: "ordered stops (simulation).",
    startDelivery: "Start delivery",
    origin: "Origin",
    stop1: "Stop 1",
    destination: "Destination",
    routeTitleOrigin: "Vallejo distribution center",
    routeTitleStop1: "Package pickup",
    routeTitleDestination: "Delivery to end customer",
  },
}

function validationCopy(validationDoc: boolean, satDoc: boolean) {
  const n = Number(validationDoc) + Number(satDoc)
  if (n === 0) return "Esperando validación"
  if (n === 1) return "Validación en curso"
  return "Validación completada"
}

function VerificationCodeInput({
  value,
  onChange,
  length = 8,
}: {
  value: string
  onChange: (next: string) => void
  length?: number
}) {
  const digits = Array.from({ length }, (_, i) => value[i] ?? "")

  const setAt = (index: number, char: string) => {
    const next = digits.slice()
    next[index] = char
    onChange(next.join("").replace(/\s/g, ""))
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            value={digit}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`Dígito ${index + 1}`}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(-1)
              setAt(index, v)
              if (v && index < length - 1) {
                const nextEl = document.getElementById(`otp-${index + 1}`)
                nextEl?.focus()
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digit && index > 0) {
                const prevEl = document.getElementById(`otp-${index - 1}`)
                prevEl?.focus()
              }
              if (e.key === "ArrowLeft" && index > 0) {
                e.preventDefault()
                const prevEl = document.getElementById(`otp-${index - 1}`)
                prevEl?.focus()
              }
              if (e.key === "ArrowRight" && index < length - 1) {
                e.preventDefault()
                const nextEl = document.getElementById(`otp-${index + 1}`)
                nextEl?.focus()
              }
            }}
            onPaste={(e) => {
              e.preventDefault()
              const pasted = e.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, length)
              if (!pasted) return
              const next = Array.from({ length }, (_, i) => pasted[i] ?? "")
              onChange(next.join(""))
              const focusIndex = Math.min(pasted.length, length - 1)
              const nextEl = document.getElementById(`otp-${focusIndex}`)
              nextEl?.focus()
            }}
            className="h-11 w-full rounded-lg border border-border bg-white text-center text-base font-semibold tabular-nums shadow-inner outline-none transition-[box-shadow,border-color] duration-200 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 dark:bg-black/35 sm:h-12 sm:text-lg"
          />
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Ingresa el código de 8 dígitos
      </p>
    </div>
  )
}

function IncidentList({ items }: { items: Array<{ id: string; title: string; createdAt: number }> }) {
  if (items.length === 0) return null

  return (
    <div className="space-y-2 rounded-2xl border border-amber-300/55 bg-amber-50/75 p-3.5 text-amber-900 dark:border-amber-600/40 dark:bg-amber-500/10 dark:text-amber-100">
      <p className="text-xs font-semibold uppercase tracking-[0.08em]">
        Incidentes reportados
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-amber-300/45 bg-white/75 px-2.5 py-2 text-xs dark:border-amber-500/30 dark:bg-black/20"
          >
            <p className="font-medium">{item.title}</p>
            <p className="text-[0.7rem] text-amber-800/80 dark:text-amber-200/80">
              {new Date(item.createdAt).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FaultActions({
  mode = "exception",
  onReportLogged,
}: {
  mode?: "exception" | "log"
  onReportLogged?: () => void
}) {
  const setStatus = useDemoStore((s) => s.setStatus)
  const addIncident = useDemoStore((s) => s.addIncident)
  const notify = useDemoStore((s) => s.notify)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-dashed border-border/80 pt-5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl text-xs font-semibold shadow-sm"
        onClick={() => {
          if (mode === "log") {
            onReportLogged?.()
            return
          }
          addIncident("Incidencia reportada por conductor")
          notify("Incidente registrado", "Entrega marcada como excepción.", "warning")
          setStatus("exception")
        }}
      >
        Reportar incidente
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl border-destructive/35 text-xs font-semibold text-destructive shadow-sm hover:bg-destructive/[0.08]"
        onClick={() => {
          notify(
            "Entrega rechazada",
            "El cliente marcó rechazo para esta orden.",
            "error",
          )
          setStatus("rejected")
        }}
      >
        Rechazar entrega
      </Button>
    </div>
  )
}

function IncidentReviewPanel({
  comment,
  onCommentChange,
  onContinue,
  onTerminateException,
}: {
  comment: string
  onCommentChange: (next: string) => void
  onContinue: () => void
  onTerminateException: () => void
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-amber-300/55 bg-amber-50/75 p-3.5 text-amber-900 dark:border-amber-600/40 dark:bg-amber-500/10 dark:text-amber-100">
      <p className="text-sm font-semibold">Incidencia registrada</p>
      <p className="text-xs leading-relaxed text-amber-900/85 dark:text-amber-100/85">
        Puedes continuar con la entrega o cerrarla como excepción.
      </p>
      <textarea
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Agregar comentario de la incidencia..."
        className="min-h-20 w-full resize-none rounded-xl border border-amber-300/60 bg-white/90 px-3 py-2 text-sm outline-none ring-0 transition focus-visible:border-amber-500 dark:border-amber-500/30 dark:bg-black/25"
      />
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onContinue}>
          Seguir entrega
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl border-destructive/35 text-destructive shadow-sm hover:bg-destructive/[0.08]"
          onClick={onTerminateException}
        >
          Terminar entrega por incidente
        </Button>
      </div>
    </div>
  )
}

export function DemoFlow() {
  const status = useDemoStore((s) => s.status)
  const validationDoc = useDemoStore((s) => s.validationDoc)
  const satDoc = useDemoStore((s) => s.satDoc)
  const deliveryProof = useDemoStore((s) => s.deliveryProof)
  const verificationCode = useDemoStore((s) => s.verificationCode)
  const proofEntryOpen = useDemoStore((s) => s.proofEntryOpen)

  if (status === "assigned") {
    return <ScreenAssigned />
  }

  if (status === "route") {
    return <ScreenRoute />
  }

  return (
    <ScreenTracking
      status={status}
      validationDoc={validationDoc}
      satDoc={satDoc}
      deliveryProof={deliveryProof}
      verificationCode={verificationCode}
      proofEntryOpen={proofEntryOpen}
    />
  )
}

function ScreenAssigned() {
  const language = useDemoStore((s) => s.language)
  const tx = flowI18n[language]
  const tripId = useDemoStore((s) => s.tripId)
  const deliveryCompleted = useDemoStore((s) => s.deliveryCompleted)
  const deliveryClosedByIncident = useDemoStore((s) => s.deliveryClosedByIncident)
  const routeAccepted = useDemoStore((s) => s.routeAccepted)
  const hasStartedDelivery = useDemoStore((s) => s.hasStartedDelivery)
  const hasEnteredProofStep = useDemoStore((s) => s.hasEnteredProofStep)
  const validationDoc = useDemoStore((s) => s.validationDoc)
  const satDoc = useDemoStore((s) => s.satDoc)
  const setRouteAccepted = useDemoStore((s) => s.setRouteAccepted)
  const setProofEntryOpen = useDemoStore((s) => s.setProofEntryOpen)
  const setStatus = useDemoStore((s) => s.setStatus)

  return (
    <div className="space-y-5 transition-all duration-300">
      <Card className="rounded-[1.375rem] shadow-[0_26px_70px_-46px_oklch(0.42_0.1_215_/_0.55)] ring-black/5 dark:ring-white/10">
        <CardHeader className="gap-4 border-b border-border/65 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                {deliveryCompleted
                  ? deliveryClosedByIncident
                    ? tx.homeIncidentDone
                    : tx.homeCompleted
                  : routeAccepted
                    ? tx.homeAssigned
                    : tx.homeNewAssigned}
              </CardTitle>
              {!deliveryCompleted ? (
                <CardDescription className="text-base font-mono font-medium text-muted-foreground sm:text-lg">
                  {tripId}
                </CardDescription>
              ) : null}
            </div>
            <StatusBadge status="assigned" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {deliveryCompleted ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {deliveryClosedByIncident
                ? tx.serviceIncidentDone
                : tx.serviceDone}
            </p>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tx.homeHint}
              </p>
              <p className="text-xs font-medium text-primary/90">
                {tx.homeReady}
              </p>
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  className="min-w-[10.5rem] rounded-xl px-4 text-sm shadow-[0_20px_38px_-20px_oklch(0.48_0.12_205_/_0.55)] sm:h-10"
                  onClick={() => {
                    setRouteAccepted(true)
                    if (hasStartedDelivery) {
                      // If document phase is still pending, reopen created (upload docs).
                      if (!(validationDoc && satDoc)) {
                        setStatus("created")
                        return
                      }
                      // Otherwise restore in-progress subview (GPS vs proof step).
                      setProofEntryOpen(hasEnteredProofStep)
                      setStatus("in_progress")
                      return
                    }
                    setStatus("route")
                  }}
                >
                  {routeAccepted ? tx.viewStatus : tx.viewRoute}
                  <ArrowRight aria-hidden className="size-[1.125rem]" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ScreenRoute() {
  const language = useDemoStore((s) => s.language)
  const tx = flowI18n[language]
  const setHasEnteredProofStep = useDemoStore((s) => s.setHasEnteredProofStep)
  const setHasStartedDelivery = useDemoStore((s) => s.setHasStartedDelivery)
  const setRouteAccepted = useDemoStore((s) => s.setRouteAccepted)
  const setStatus = useDemoStore((s) => s.setStatus)

  return (
    <div className="transition-all duration-300">
      <Card className="rounded-[1.375rem] shadow-[0_26px_70px_-46px_oklch(0.42_0.1_215_/_0.55)] ring-black/5 dark:ring-white/10">
        <CardHeader className="gap-3 border-b border-border/65 pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl font-semibold tracking-tight">
              {tx.routeTitle}
            </CardTitle>
            <StatusBadge status="route" />
          </div>
          <CardDescription>
            <span className="font-medium text-foreground/90">{tx.routeSubtitle}</span> ·{" "}
            {tx.routeSubtitle2}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-5 md:grid md:grid-cols-2 md:items-start md:gap-5 md:space-y-0">
          <MapPlaceholder
            caption={tx.routeSubtitle}
            className="md:order-2 md:max-h-[55vh]"
          />

          <ol className="space-y-0 overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10 md:order-1">
            <RouteLeg
              accent={tx.origin}
              title={tx.routeTitleOrigin}
              address="TrustLay Norte · Agrupamiento"
              first
            />
            <RouteLeg
              accent={tx.stop1}
              title={tx.routeTitleStop1}
              address="Mercado Abelardo · Andén 22"
              muted
            />
            <RouteLeg
              accent={tx.destination}
              title={tx.routeTitleDestination}
              address="Av. Insurgentes Sur 601, Ciudad de México · Torre Napoles"
            />
          </ol>

          <div className="flex justify-center pt-1 md:order-3 md:col-span-2 md:pt-2">
            <Button
              type="button"
              size="lg"
              className="min-w-[12rem] rounded-2xl px-6 text-base shadow-[0_26px_50px_-18px_oklch(0.48_0.12_205_/_0.55)] sm:h-12"
              onClick={() => {
                setRouteAccepted(true)
                setHasStartedDelivery(true)
                setHasEnteredProofStep(false)
                setStatus("created")
              }}
            >
              {tx.startDelivery}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RouteLeg({
  accent,
  title,
  address,
  first,
  muted,
}: {
  accent: string
  title: string
  address: string
  first?: boolean
  muted?: boolean
}) {
  return (
    <li
      className={cn(
        "flex gap-3 border-t border-black/10 bg-white/90 px-4 py-3.5 first:border-t-0 dark:border-white/10 dark:bg-black/35",
        muted && "bg-muted/40 dark:bg-white/5",
        first &&
          "bg-[oklch(0.99_0.02_220_/0.92)] dark:bg-white/[0.07]",
      )}
    >
      <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary dark:bg-white/10">
        <MapPin aria-hidden className="size-4 opacity-95" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary/95">
          {accent}
        </p>
        <p className="truncate text-[0.9375rem] font-semibold tracking-tight">
          {title}
        </p>
        <p className="text-sm leading-snug text-muted-foreground">{address}</p>
      </div>
    </li>
  )
}

function ScreenTracking({
  status,
  validationDoc,
  satDoc,
  deliveryProof,
  verificationCode,
  proofEntryOpen,
}: {
  status: Exclude<
    DeliveryStatus,
    "assigned" | "route"
  >
  validationDoc: boolean
  satDoc: boolean
  deliveryProof: boolean
  verificationCode: string
  proofEntryOpen: boolean
}) {
  const setStatus = useDemoStore((s) => s.setStatus)
  const setDeliveryCompleted = useDemoStore((s) => s.setDeliveryCompleted)
  const setDeliveryClosedByIncident = useDemoStore((s) => s.setDeliveryClosedByIncident)
  const setProofEntryOpen = useDemoStore((s) => s.setProofEntryOpen)
  const setHasEnteredProofStep = useDemoStore((s) => s.setHasEnteredProofStep)
  const setValidationDoc = useDemoStore((s) => s.setValidationDoc)
  const setSatDoc = useDemoStore((s) => s.setSatDoc)
  const setDeliveryProof = useDemoStore((s) => s.setDeliveryProof)
  const setVerificationCode = useDemoStore((s) => s.setVerificationCode)
  const deliveryClosedByIncident = useDemoStore((s) => s.deliveryClosedByIncident)
  const incidents = useDemoStore((s) => s.incidents)
  const addIncident = useDemoStore((s) => s.addIncident)
  const notify = useDemoStore((s) => s.notify)
  const [incidentReviewOpen, setIncidentReviewOpen] = useState(false)
  const [incidentComment, setIncidentComment] = useState("")

  const transitioned = useRef(false)

  useEffect(() => {
    if (status !== "created") {
      transitioned.current = false
      return
    }
    if (!validationDoc || !satDoc || transitioned.current) return
    transitioned.current = true
    const t = window.setTimeout(() => {
      notify("Validación completada", "Listo para ejecutar la entrega.", "success")
      setStatus("in_progress")
      setProofEntryOpen(false)
    }, 520)
    return () => window.clearTimeout(t)
  }, [
    status,
    validationDoc,
    satDoc,
    notify,
    setProofEntryOpen,
    setStatus,
  ])

  useEffect(() => {
    if (status !== "created" && status !== "in_progress") {
      setIncidentReviewOpen(false)
      setIncidentComment("")
    }
  }, [status])

  if (status === "exception") {
    return (
      <TrackingChrome status={status}>
        <div className="space-y-2 rounded-2xl border border-destructive/35 bg-destructive/8 px-4 py-4 text-sm leading-relaxed text-destructive dark:bg-destructive/14">
          <p className="font-semibold text-destructive">
            Entrega marcada como excepción
          </p>
          <p className="text-destructive/90">
            TrustLay registra este incidente. Coordina siguiente paso desde el centro
            de control.
          </p>
        </div>
        {deliveryClosedByIncident ? (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="secondary"
              className="min-w-[12rem] rounded-2xl px-6"
              onClick={() => setStatus("assigned")}
            >
              Volver al inicio
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="min-w-[12rem] rounded-2xl px-6"
              onClick={() => setStatus("in_progress")}
            >
              Volver al seguimiento
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-w-[12rem] rounded-2xl border-destructive/35 px-6 text-destructive hover:bg-destructive/[0.08]"
              onClick={() => {
                notify(
                  "Entrega cerrada como excepción",
                  "Se finalizó la entrega con estado exception.",
                  "warning",
                )
                useDemoStore.getState().beginNewRun()
              }}
            >
              Terminar entrega (exception)
            </Button>
          </div>
        )}
      </TrackingChrome>
    )
  }

  if (status === "rejected") {
    return (
      <TrackingChrome status={status}>
        <div className="space-y-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-4 text-sm text-destructive">
          <p className="font-semibold">Entrega rechazada</p>
          <p className="leading-relaxed text-destructive/90">
            El envío quedó cerrado sin entrega. TrustLay notificó al cliente.
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="min-w-[12rem] rounded-2xl border-destructive/40 px-6"
            onClick={() => useDemoStore.getState().beginNewRun()}
          >
            Nueva asignación
          </Button>
        </div>
      </TrackingChrome>
    )
  }

  if (status === "completed") {
    return (
      <TrackingChrome status={status}>
        <div className="space-y-6 md:grid md:grid-cols-2 md:items-center md:gap-5 md:space-y-0">
          <MapPlaceholder
            completed
            caption="Entrega cerrada · mapa inactivo"
            className="mx-auto max-w-xl md:order-2 md:mx-0 md:max-w-none md:max-h-[55vh]"
          />
          <div className="flex flex-col items-center gap-4 pb-4 pt-4 text-center md:order-1">
            <span className="flex size-[4.125rem] items-center justify-center rounded-[1.5rem] bg-emerald-500/14 text-emerald-700 shadow-inner ring-2 ring-emerald-500/30 animate-in fade-in zoom-in-95 duration-500 dark:text-emerald-200">
              <CircleDot aria-hidden className="size-10" strokeWidth={1.5} />
            </span>
            <div className="max-w-xs">
              <h3 className="text-xl font-semibold tracking-tight text-emerald-800 dark:text-emerald-50">
                ¡Entrega terminada con éxito!
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Tus documentos están archivados correctamente.
              </p>
            </div>
          </div>
        </div>
      </TrackingChrome>
    )
  }

  const phaseLabel =
    status === "created"
      ? validationCopy(validationDoc, satDoc)
      : proofEntryOpen
        ? "Validación completada · prueba pendiente"
        : "GPS activo"

  if (status === "created") {
    return (
      <TrackingChrome status={status} phaseHint={phaseLabel}>
        {incidentReviewOpen ? (
          <div className="rounded-2xl border border-amber-300/55 bg-amber-50/55 p-2.5 dark:border-amber-600/40 dark:bg-amber-500/10">
            <p className="text-center text-xs font-medium text-amber-900 dark:text-amber-100">
              Validación en pausa por incidencia registrada
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-center text-sm font-semibold tracking-tight text-muted-foreground">
              {phaseLabel}
            </p>
            <div className="space-y-5 md:grid md:grid-cols-2 md:items-start md:gap-5 md:space-y-0">
              <div className="grid gap-4 sm:grid-cols-2 md:order-1 md:grid-cols-1">
                <FileDrop
                  label="Hoja de validación"
                  description="Waybill del envío."
                  done={validationDoc}
                  onSimulateUpload={() => setValidationDoc(true)}
                />
                <FileDrop
                  label="Validación SAT"
                  description="Información fiscal requerida."
                  done={satDoc}
                  onSimulateUpload={() => setSatDoc(true)}
                />
              </div>
              <MapPlaceholder
                disabled
                caption="GPS en espera"
                className="mt-2 md:order-2 md:mt-0 md:max-h-[55vh]"
              />
            </div>
          </div>
        )}
        {!incidentReviewOpen ? <IncidentList items={incidents} /> : null}
        {incidentReviewOpen ? (
          <IncidentReviewPanel
            comment={incidentComment}
            onCommentChange={setIncidentComment}
            onContinue={() => {
              addIncident(incidentComment.trim() || "Incidencia reportada por conductor")
              notify("Incidente registrado", "Se agregó al historial de incidencias.", "warning")
              setIncidentComment("")
              setIncidentReviewOpen(false)
            }}
            onTerminateException={() => {
              const title = incidentComment.trim() || "Incidencia reportada por conductor"
              addIncident(title)
              notify("Entrega cerrada como excepción", title, "warning")
              setIncidentComment("")
              setIncidentReviewOpen(false)
              setDeliveryCompleted(true)
              setDeliveryClosedByIncident(true)
              setStatus("exception")
            }}
          />
        ) : (
          <FaultActions
            mode="log"
            onReportLogged={() => {
              setIncidentComment("")
              setIncidentReviewOpen(true)
            }}
          />
        )}
      </TrackingChrome>
    )
  }

  if (status === "in_progress" && !proofEntryOpen) {
    return (
      <div className="transition-all duration-300">
        <TrackingChrome status={status} phaseHint={phaseLabel}>
          <div className="space-y-6 md:grid md:grid-cols-2 md:items-start md:gap-5 md:space-y-0">
            <div className="md:order-2">
              {incidentReviewOpen ? (
                <div className="rounded-2xl border border-amber-300/55 bg-amber-50/55 p-2.5 dark:border-amber-600/40 dark:bg-amber-500/10">
                  <p className="text-center text-xs font-medium text-amber-900 dark:text-amber-100">
                    GPS en pausa por incidencia registrada
                  </p>
                </div>
              ) : (
                <MapPlaceholder
                  gpsActive
                  caption="GPS activo"
                  className="md:max-h-[55vh]"
                />
              )}
            </div>
            <div className="space-y-6 md:order-1">
              {!incidentReviewOpen ? <IncidentList items={incidents} /> : null}
              {incidentReviewOpen ? (
                <IncidentReviewPanel
                  comment={incidentComment}
                  onCommentChange={setIncidentComment}
                  onContinue={() => {
                    addIncident(incidentComment.trim() || "Incidencia reportada por conductor")
                    notify("Incidente registrado", "Se agregó al historial de incidencias.", "warning")
                    setIncidentComment("")
                    setIncidentReviewOpen(false)
                  }}
                  onTerminateException={() => {
                    const title = incidentComment.trim() || "Incidencia reportada por conductor"
                    addIncident(title)
                    notify("Entrega cerrada como excepción", title, "warning")
                    setIncidentComment("")
                    setIncidentReviewOpen(false)
                    setDeliveryCompleted(true)
                    setDeliveryClosedByIncident(true)
                    setStatus("exception")
                  }}
                />
              ) : (
                <FaultActions
                  mode="log"
                  onReportLogged={() => {
                    setIncidentComment("")
                    setIncidentReviewOpen(true)
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="button"
              size="lg"
              className="min-w-[12rem] rounded-2xl px-6 shadow-[0_26px_50px_-18px_oklch(0.48_0.12_205_/_0.55)] sm:h-12"
              onClick={() => {
                setHasEnteredProofStep(true)
                setProofEntryOpen(true)
              }}
            >
              Finalizar entrega
            </Button>
          </div>
        </TrackingChrome>
      </div>
    )
  }

  if (status === "in_progress" && proofEntryOpen) {
    const canConfirm = deliveryProof && verificationCode.trim().length === 8
    return (
      <div className="transition-all duration-300">
        <TrackingChrome status={status} phaseHint="Validación completada">
          <div className="space-y-3">
            <div className="rounded-3xl bg-muted/50 p-5 ring-1 ring-black/5 dark:ring-white/10">
              <label
                htmlFor="otp-0"
                className="text-xs font-semibold uppercase tracking-[0.09em] text-muted-foreground"
              >
                Código de verificación
              </label>
              <div className="mt-4">
                <VerificationCodeInput
                  value={verificationCode}
                  onChange={(next) => setVerificationCode(next)}
                  length={8}
                />
              </div>
            </div>
            <FileDrop
              label="Subir prueba de entrega"
              description="Evidencia o firma digitales."
              done={deliveryProof}
              onSimulateUpload={() => setDeliveryProof(true)}
            />
          </div>
  
          <p className="mx-auto max-w-sm pt-6 text-center text-xs text-muted-foreground">
            Requiere prueba cargada y código capturado. Activamos Confirmar cuando el cierre es
            seguro.
          </p>
          <div className="flex justify-center">
            <Button
              type="button"
              size="lg"
              className="min-w-[12rem] rounded-2xl px-6 shadow-[0_26px_50px_-18px_oklch(0.48_0.12_205_/_0.55)] disabled:opacity-55 sm:h-12"
              disabled={!canConfirm}
              onClick={() => {
                notify(
                  "¡Entrega terminada con éxito!",
                  "TrustLay actualizó el estado del cliente.",
                  "success",
                )
                setDeliveryClosedByIncident(false)
                setDeliveryCompleted(true)
                setProofEntryOpen(false)
                setStatus("completed")
              }}
            >
              Confirmar entrega
            </Button>
          </div>
        </TrackingChrome>
      </div>
    )
  }

  return null
}

function TrackingChrome({
  status,
  phaseHint,
  children,
}: {
  status: DeliveryStatus
  phaseHint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-5 transition-[opacity] duration-300 md:transition-all">
      <Card className="rounded-[1.375rem] shadow-[0_26px_70px_-46px_oklch(0.42_0.1_215_/_0.55)] ring-black/5 dark:ring-white/10">
        <CardHeader className="gap-4 border-b border-border/65 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold tracking-tight sm:text-[1.35rem]">
                Seguimiento
              </CardTitle>
              <CardDescription>
                {phaseHint ??
                  "Completa validación, evidencia y cierre."}
              </CardDescription>
            </div>
            <StatusBadge status={status} />
          </div>
          <TrackingStepBar status={status} />
        </CardHeader>
        <CardContent className="space-y-6 pt-5">{children}</CardContent>
      </Card>
    </div>
  )
}
