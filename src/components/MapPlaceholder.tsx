import mapImage from "@/assets/gps-simulation.png"
import { cn } from "@/lib/utils"

export function MapPlaceholder({
  disabled,
  /** Full color map with GPS pulse overlay (delivery in progress). */
  gpsActive,
  /** Neutral / closed-out map (completed stop). Same look as disabled. */
  completed,
  caption,
  className,
}: {
  disabled?: boolean
  gpsActive?: boolean
  completed?: boolean
  caption?: string
  className?: string
}) {
  const muted = disabled ?? completed ?? false

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.375rem] ring-1 shadow-[0_18px_50px_-30px_oklch(0.42_0.1_215_/_0.75)] duration-700 ease-out dark:shadow-black/35",
        muted
          ? "pointer-events-none ring-black/15 opacity-95 duration-500 dark:ring-white/20"
          : "ring-black/10 dark:ring-white/15",
        className,
      )}
    >
      <img
        src={mapImage}
        alt=""
        className={cn(
          "h-auto w-full object-contain transition-[filter,opacity,transform] duration-700 ease-out",
          muted &&
            "scale-[1.02] grayscale-[0.85] saturate-50 brightness-[1.03] contrast-95 dark:brightness-[0.92]",
          gpsActive && !muted && "brightness-[1.02] saturate-[1.05]",
        )}
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-muted/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[oklch(0.99_0.02_220_/0.25)] transition-opacity duration-500 dark:to-white/10" />
      {muted ? (
        <div className="pointer-events-none absolute inset-0 bg-[oklch(0.98_0.02_220_/0.4)] transition-opacity duration-500 dark:bg-black/28" />
      ) : null}
      {gpsActive && !muted ? (
        <>
          <div className="pointer-events-none absolute bottom-14 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="relative flex size-5 items-center justify-center">
              <span className="absolute size-11 animate-[tl-gps-ring_2s_ease-out_infinite] rounded-full bg-primary/25 blur-[1px]" />
              <span className="absolute size-9 animate-[tl-gps-ring_2.4s_ease-out_infinite] rounded-full border-2 border-primary/55" />
              <span className="relative size-[0.5625rem] rounded-full bg-primary shadow-[0_0_0_4px_oklch(0.72_0.12_205_/_0.35)] ring-2 ring-white/90" />
            </span>
          </div>
          {caption ? (
            <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs font-semibold tracking-wide text-primary drop-shadow-[0_1px_1px_white] dark:drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.5)]">
              {caption}
            </p>
          ) : null}
        </>
      ) : caption && !muted ? (
        <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs font-semibold text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </div>
  )
}
