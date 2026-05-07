import { useCallback, useRef, useState, type DragEvent } from "react"
import { Check, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropProps {
  label: string
  description?: string
  done: boolean
  onSimulateUpload: () => void
}

export function FileDrop({
  label,
  description,
  done,
  onSimulateUpload,
}: FileDropProps) {
  const [drag, setDrag] = useState(false)
  const [phase, setPhase] = useState<"idle" | "uploading" | "success">("idle")
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  const abortRaf = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
  }, [])

  const startUpload = useCallback(() => {
    if (done || phase === "uploading") return
    abortRaf()

    const durationMs = 1000 + Math.floor(Math.random() * 780)
    setPhase("uploading")
    setProgress(0)
    const started = performance.now()

    const step = (now: number) => {
      const t = Math.min(1, (now - started) / durationMs)
      setProgress(Math.round(t * 100))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setPhase("success")
        onSimulateUpload()
        window.setTimeout(() => {
          setPhase("idle")
          setProgress(0)
        }, 520)
      }
    }
    rafRef.current = requestAnimationFrame(step)
  }, [abortRaf, done, onSimulateUpload, phase])

  const runFromUser = useCallback(() => {
    startUpload()
  }, [startUpload])

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDrag(false)
      runFromUser()
    },
    [runFromUser],
  )

  const showSuccess = done || phase === "success"
  const showUploading = phase === "uploading"

  return (
    <button
      type="button"
      disabled={done || phase === "uploading"}
      onClick={() => runFromUser()}
      onDragEnter={(e) => {
        e.preventDefault()
        if (!done && phase !== "uploading") setDrag(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!done && phase !== "uploading") setDrag(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setDrag(false)
      }}
      onDrop={onDrop}
      className={cn(
        "group relative w-full min-h-[7.75rem] rounded-3xl border-2 border-dashed border-primary/35 bg-[oklch(0.99_0.02_220)] p-3.5 text-left shadow-[0_14px_40px_-26px_oklch(0.45_0.1_215_/_0.55)] duration-300 ease-out outline-none hover:border-primary/60 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/25 dark:bg-white/5 sm:min-h-[12.25rem] sm:p-6",
        drag &&
          !done &&
          phase === "idle" &&
          "scale-[1.01] border-primary bg-[oklch(0.97_0.04_210)] dark:bg-white/10",
        showSuccess &&
          "duration-300 ease-out animate-in fade-in-0 zoom-in-[0.985] cursor-default border-emerald-500/55 bg-emerald-500/[0.08]",
        showUploading &&
          "cursor-wait border-primary/50 bg-primary/[0.04] duration-150",
      )}
    >
      <div className="flex min-h-[4.9rem] items-start gap-3 sm:min-h-[8.5rem] sm:gap-4">
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-inner ring-1 ring-black/5 duration-300 ease-out group-hover:translate-y-0.5 dark:bg-white/10 dark:ring-white/10",
            showSuccess && "bg-emerald-50 dark:bg-emerald-950/50",
            showUploading && "bg-primary/8",
          )}
        >
          {showUploading ? (
            <div
              aria-hidden
              className="size-7 animate-spin rounded-full border-2 border-primary/35 border-t-primary"
              style={{ animationDuration: "0.85s" }}
            />
          ) : showSuccess ? (
            <Check
              aria-hidden
              className="animate-in zoom-in-50 duration-200 size-7 text-emerald-600 dark:text-emerald-300"
              strokeWidth={2.5}
            />
          ) : (
            <UploadCloud
              className="size-7 text-primary transition-colors duration-200"
              aria-hidden
            />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {showSuccess ? `${label} · listo` : label}
          </p>
          <p className="hidden min-h-[2.75rem] text-sm leading-relaxed text-muted-foreground sm:block">
            {showSuccess
              ? "Documento procesado · simulación"
              : showUploading
                ? "Subiendo de forma segura…"
                : description}
          </p>
          {showUploading ? (
            <div className="pt-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted/80 ring-1 ring-black/[0.04] dark:ring-white/[0.08]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/90 to-teal-500/95 transition-[width] duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-right font-mono text-[0.65rem] tabular-nums text-muted-foreground">
                {progress}%
              </p>
            </div>
          ) : null}
          {!showSuccess && !showUploading ? (
            <p className="pt-1 text-xs text-primary/85">
              Toca o arrastra · simula 1–2 s
            </p>
          ) : null}
        </div>
      </div>
    </button>
  )
}
