import type { CSSProperties } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      richColors={false}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600" />,
        info: <InfoIcon className="size-4 text-sky-600" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600" />,
        error: <OctagonXIcon className="size-4 text-red-600" />,
        loading: <Loader2Icon className="size-4 animate-spin text-sky-600" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "border shadow-lg !rounded-xl gap-3 !py-3 !px-4 backdrop-blur-[2px]",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          success:
            "!border-emerald-200 !bg-emerald-50/95 !text-emerald-950 dark:!border-emerald-800 dark:!bg-emerald-950/90 dark:!text-emerald-50",
          info: "!border-sky-200 !bg-sky-50/95 !text-sky-950 dark:!border-sky-800 dark:!bg-sky-950/85 dark:!text-sky-50",
          warning:
            "!border-amber-200 !bg-amber-50/95 !text-amber-950 dark:!border-amber-800 dark:!bg-amber-950/85 dark:!text-amber-50",
          error:
            "!border-red-200 !bg-red-50/95 !text-red-950 dark:!border-red-900 dark:!bg-red-950/85 dark:!text-red-50",
          closeButton:
            "rounded-lg border-none bg-transparent opacity-75 hover:!opacity-100",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
