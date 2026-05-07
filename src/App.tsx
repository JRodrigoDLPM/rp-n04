import { AppLayout } from "@/components/AppLayout"
import { AssignedWelcomePing } from "@/components/AssignedWelcomePing"
import { DemoFlow } from "@/components/DemoFlow"
import { useDemoStore } from "@/store/demo-store"

export default function App() {
  const resetDemo = useDemoStore((s) => s.resetDemo)
  const setStatus = useDemoStore((s) => s.setStatus)

  return (
    <>
      <AssignedWelcomePing />
      <AppLayout
        onReset={resetDemo}
        onGoHome={() => setStatus("assigned")}
      >
        <DemoFlow />
      </AppLayout>
    </>
  )
}
