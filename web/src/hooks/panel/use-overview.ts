"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOverview, toggleBarberStatus } from "@/services/panel/overview";
import type { OverviewResponse, WindowOption } from "@/types/panel";

type MutationError = {
  message: string;
  code?: string;
};

type DateRange = {
  startDate: string;
  endDate: string;
};

function getCurrentDateIso(): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getInitialDateRange(initialOverview: OverviewResponse | null): DateRange {
  if (initialOverview?.window === "custom") {
    return {
      startDate: initialOverview.date_window.startDate,
      endDate: initialOverview.date_window.endDate,
    };
  }

  const today = getCurrentDateIso();
  return { startDate: today, endDate: today };
}

export function useOverview(initialOverview: OverviewResponse | null): {
  windowKey: WindowOption;
  barberId: string;
  selectedBarber: string;
  overview: OverviewResponse | null;
  loading: boolean;
  error: string;
  customRange: DateRange;
  setWindowKey: (windowKey: WindowOption) => void;
  setBarberId: (barberId: string) => void;
  setCustomRange: (range: DateRange) => void;
  reloadOverview: () => Promise<void>;
  onToggleBarberStatus: (
    barberId: string,
    active: boolean,
  ) => Promise<string | null>;
} {
  const queryClient = useQueryClient();
  const [windowKey, setWindowKey] = useState<WindowOption>(
    initialOverview?.window ?? "today",
  );
  const [barberId, setBarberId] = useState<string>("all");
  const [customRange, setCustomRange] = useState<DateRange>(
    getInitialDateRange(initialOverview),
  );

  const selectedBarber = useMemo<string>(
    () => (barberId === "all" ? "" : barberId),
    [barberId],
  );

  const overviewQuery = useQuery<OverviewResponse, MutationError>({
    queryKey: [
      "panel-overview",
      windowKey,
      barberId,
      customRange.startDate,
      customRange.endDate,
    ],
    queryFn: async (): Promise<OverviewResponse> => {
      const result = await getOverview({
        window: windowKey,
        barberId: barberId === "all" ? undefined : barberId,
        startDate: customRange.startDate,
        endDate: customRange.endDate,
      });

      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }

      return result.data;
    },
    initialData:
      initialOverview &&
      initialOverview.window === windowKey &&
      selectedBarber === ""
        ? initialOverview
        : undefined,
    staleTime: 30_000,
  });
  const toggleMutation = useMutation<
    { ok: boolean },
    MutationError,
    { barberId: string; active: boolean }
  >({
    mutationFn: async ({ barberId: id, active }): Promise<{ ok: boolean }> => {
      const result = await toggleBarberStatus(id, active);
      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }
      return result.data;
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["panel-overview"] });
    },
  });

  async function reloadOverview(): Promise<void> {
    await overviewQuery.refetch();
  }

  async function onToggleBarberStatus(
    id: string,
    active: boolean,
  ): Promise<string | null> {
    try {
      await toggleMutation.mutateAsync({ barberId: id, active });
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as MutationError).message);
      }
      return "No se pudo actualizar el estado del barbero";
    }
  }

  return {
    windowKey,
    barberId,
    selectedBarber,
    overview: overviewQuery.data ?? null,
    loading: overviewQuery.isLoading || overviewQuery.isFetching,
    error: overviewQuery.error?.message ?? "",
    customRange,
    setWindowKey,
    setBarberId,
    setCustomRange,
    reloadOverview,
    onToggleBarberStatus,
  };
}
