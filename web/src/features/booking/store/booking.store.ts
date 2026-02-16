"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ServiceType } from "../domain/booking.types";

type State = {
  barberId: string;
  service: ServiceType | "";
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;

  setBarberId: (v: string) => void;
  setService: (v: ServiceType) => void;
  setDate: (v: string) => void;
  setTime: (v: string) => void;
  setCustomer: (name: string, phone: string) => void;
  reset: () => void;
};

const initial = {
  barberId: "",
  service: "" as const,
  date: "",
  time: "",
  customerName: "",
  customerPhone: "",
};

export const useBookingStore = create<State>()(
  persist(
    (set) => ({
      ...initial,
      setBarberId: (v) => set({ barberId: v, time: "" }),
      setService: (v) => set({ service: v, time: "" }),
      setDate: (v) => set({ date: v, time: "" }),
      setTime: (v) => set({ time: v }),
      setCustomer: (name, phone) => set({ customerName: name, customerPhone: phone }),
      reset: () => set({ ...initial }),
    }),
    { name: "booking-wizard-v1" }
  )
);