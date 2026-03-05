"use client";

import { useState } from "react";
import { createBarberDayOff, createShopClosedDay } from "@/services/panel/scheduling";

export function useDaysOff(): {
  loading: boolean;
  submitBarberDayOff: (input: { barberId: string; date: string; reason: string }) => Promise<string | null>;
  submitShopClosedDay: (input: { date: string; reason: string }) => Promise<string | null>;
} {
  const [loading, setLoading] = useState<boolean>(false);

  async function submitBarberDayOff(input: {
    barberId: string;
    date: string;
    reason: string;
  }): Promise<string | null> {
    setLoading(true);
    const result = await createBarberDayOff(input);
    setLoading(false);
    if (!result.success) return result.error;
    return null;
  }

  async function submitShopClosedDay(input: {
    date: string;
    reason: string;
  }): Promise<string | null> {
    setLoading(true);
    const result = await createShopClosedDay(input);
    setLoading(false);
    if (!result.success) return result.error;
    return null;
  }

  return { loading, submitBarberDayOff, submitShopClosedDay };
}