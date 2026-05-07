import { useLayoutEffect, useRef } from "react"
import { useDemoStore } from "@/store/demo-store"

/**
 * Exactly one welcome ping per Assigned home visit (welcomeEpoch).
 * Handles React StrictMode without duplicate toasts/notifications.
 */
export function AssignedWelcomePing() {
  const status = useDemoStore((s) => s.status)
  const welcomeEpoch = useDemoStore((s) => s.welcomeEpoch)
  const language = useDemoStore((s) => s.language)
  const notify = useDemoStore((s) => s.notify)
  const lastHandled = useRef(-1)

  useLayoutEffect(() => {
    if (status !== "assigned") return
    if (lastHandled.current === welcomeEpoch) return
    lastHandled.current = welcomeEpoch
    notify(
      language === "es" ? "Nueva entrega" : "New delivery",
      language === "es" ? "¡Tienes una nueva entrega!" : "You have a new delivery!",
      "info",
    )
  }, [status, welcomeEpoch, notify, language])

  return null
}
