import { useEffect } from "react"
import { useDemoStore } from "@/store/demo-store"

const RESET_MS = 2600

export function CompletionAutoReset() {
  const status = useDemoStore((s) => s.status)
  const cycleFromCompletion = useDemoStore((s) => s.cycleFromCompletion)

  useEffect(() => {
    if (status !== "completed") return
    const t = window.setTimeout(() => {
      cycleFromCompletion()
    }, RESET_MS)
    return () => window.clearTimeout(t)
  }, [status, cycleFromCompletion])

  return null
}
