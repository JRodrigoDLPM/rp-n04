import { create } from "zustand"
import { toast as sonnerToast } from "sonner"

export type NotifyTone = "success" | "info" | "warning" | "error"
export type AppLanguage = "es" | "en"

export type DeliveryStatus =
  | "assigned"
  | "route"
  | "created"
  | "in_progress"
  | "completed"
  | "exception"
  | "rejected"

export interface NotificationItem {
  id: string
  title: string
  body: string
  createdAt: number
  read: boolean
}

export interface IncidentItem {
  id: string
  title: string
  createdAt: number
}

export interface DemoState {
  /** Incremented whenever the driver returns to Assigned home; used to fire welcome once per cycle. */
  welcomeEpoch: number
  language: AppLanguage
  tripId: string
  deliveryCompleted: boolean
  deliveryClosedByIncident: boolean
  routeAccepted: boolean
  hasStartedDelivery: boolean
  hasEnteredProofStep: boolean
  proofEntryOpen: boolean
  status: DeliveryStatus
  validationDoc: boolean
  satDoc: boolean
  deliveryProof: boolean
  verificationCode: string
  incidents: IncidentItem[]
  notifications: NotificationItem[]
}

export const SAMPLE_TRIP_ID = "TL-XP-92831"

function freshDeliveryFields(
  notifications: NotificationItem[],
  welcomeEpoch: number,
): DemoState {
  return {
    welcomeEpoch,
    language: "es",
    tripId: SAMPLE_TRIP_ID,
    deliveryCompleted: false,
    deliveryClosedByIncident: false,
    routeAccepted: false,
    hasStartedDelivery: false,
    hasEnteredProofStep: false,
    proofEntryOpen: false,
    status: "assigned",
    validationDoc: false,
    satDoc: false,
    deliveryProof: false,
    verificationCode: "",
    incidents: [],
    notifications,
  }
}

const initialState = (): DemoState => freshDeliveryFields([], 0)

export interface DemoActions {
  setTripId: (id: string) => void
  setLanguage: (language: AppLanguage) => void
  setDeliveryCompleted: (v: boolean) => void
  setDeliveryClosedByIncident: (v: boolean) => void
  setRouteAccepted: (v: boolean) => void
  setHasStartedDelivery: (v: boolean) => void
  setHasEnteredProofStep: (v: boolean) => void
  setProofEntryOpen: (v: boolean) => void
  setStatus: (status: DeliveryStatus) => void
  setValidationDoc: (v: boolean) => void
  setSatDoc: (v: boolean) => void
  setDeliveryProof: (v: boolean) => void
  setVerificationCode: (code: string) => void
  addIncident: (title: string) => void
  clearIncidents: () => void
  notify: (title: string, body: string, tone?: NotifyTone) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearAllNotifications: () => void
  beginNewRun: () => void
  resetDemo: () => void
  cycleFromCompletion: () => void
}

export type DemoStore = DemoState & DemoActions

export const useDemoStore = create<DemoStore>((set, get) => ({
  ...initialState(),

  setTripId: (tripId) => set({ tripId }),
  setLanguage: (language) => set({ language }),
  setDeliveryCompleted: (deliveryCompleted) => set({ deliveryCompleted }),
  setDeliveryClosedByIncident: (deliveryClosedByIncident) =>
    set({ deliveryClosedByIncident }),
  setRouteAccepted: (routeAccepted) => set({ routeAccepted }),
  setHasStartedDelivery: (hasStartedDelivery) => set({ hasStartedDelivery }),
  setHasEnteredProofStep: (hasEnteredProofStep) => set({ hasEnteredProofStep }),

  setProofEntryOpen: (proofEntryOpen) => set({ proofEntryOpen }),

  setStatus: (status) => set({ status }),

  setValidationDoc: (validationDoc) => set({ validationDoc }),

  setSatDoc: (satDoc) => set({ satDoc }),

  setDeliveryProof: (deliveryProof) => set({ deliveryProof }),

  setVerificationCode: (verificationCode) =>
    set({ verificationCode }),

  addIncident: (title) =>
    set({
      incidents: [
        {
          id: crypto.randomUUID(),
          title,
          createdAt: Date.now(),
        },
        ...get().incidents,
      ],
    }),

  clearIncidents: () => set({ incidents: [] }),

  notify: (title, body, tone = "info") => {
    const item: NotificationItem = {
      id: crypto.randomUUID(),
      title,
      body,
      createdAt: Date.now(),
      read: false,
    }
    set({ notifications: [item, ...get().notifications] })
    const opts = { description: body }
    switch (tone) {
      case "success":
        sonnerToast.success(title, opts)
        break
      case "warning":
        sonnerToast.warning(title, opts)
        break
      case "error":
        sonnerToast.error(title, opts)
        break
      default:
        sonnerToast.info(title, opts)
    }
  },

  markNotificationRead: (id) =>
    set({
      notifications: get().notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }),

  markAllNotificationsRead: () =>
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
    }),

  clearAllNotifications: () => set({ notifications: [] }),

  beginNewRun: () =>
    set((s) =>
      freshDeliveryFields(s.notifications, s.welcomeEpoch + 1),
    ),

  cycleFromCompletion: () =>
    set((s) => freshDeliveryFields([], s.welcomeEpoch + 1)),

  resetDemo: () =>
    set((s) => freshDeliveryFields([], s.welcomeEpoch + 1)),
}))
