import { create } from "zustand";

export type DashboardNotification = {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
};

type State = {
  notifications: DashboardNotification[];
};

type Actions = {
  push: (n: Omit<DashboardNotification, "id">) => void;
  remove: (id: string) => void;
};

export const useDashboardNotificationStore = create<State & Actions>((set) => ({
  notifications: [],

  push: (n) =>
    set((s) => ({
      notifications: [
        { id: crypto.randomUUID(), ...n },
        ...s.notifications,
      ],
    })),

  remove: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
}));
