"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { getOverview, toggleBarberStatus } from "@/services/panel/overview";
import type { OverviewResponse, WindowOption } from "@/types/panel";

export function useOverview(): {
  windowKey: WindowOption;
  barberId: string;
  selectedBarber: string;
  overview: OverviewResponse | null;
  loading: boolean;
  error: string;
  setWindowKey: (windowKey: WindowOption) => void;
  setBarberId: (barberId: string) => void;
  reloadOverview: () => Promise<void>;
  onToggleBarberStatus: (barberId: string, active: boolean) => Promise<string | null>;
} {
  const [windowKey, setWindowKey] = useState<WindowOption>("next_7_days");
  const [barberId, setBarberId] = useState<string>("all");
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const selectedBarber = useMemo<string>(() => (barberId === "all" ? "" : barberId), [barberId]);

  const reloadOverview = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError("");
    const result = await getOverview({ window: windowKey, barberId: selectedBarber || undefined });
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setOverview(result.data);
    setLoading(false);
  }, [selectedBarber, windowKey]);

  useEffect(() => {
    void reloadOverview();
  }, [reloadOverview]);

  const onToggleBarberStatus = useCallback(
    async (id: string, active: boolean): Promise<string | null> => {
      const result = await toggleBarberStatus(id, active);
      if (!result.success) {
        setError(result.error);
        return result.error;
      }
      await reloadOverview();
      return null;
    },
    [reloadOverview],
  );

  return { windowKey, barberId, selectedBarber, overview, loading, error, setWindowKey, setBarberId, reloadOverview, onToggleBarberStatus };
}