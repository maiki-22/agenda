"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBarberSchedule, updateBarberSchedule } from "@/services/panel/scheduling";
import type { BarberScheduleResponse, ScheduleDay } from "@/types/panel";

type MutationError = {
  message: string;
  code?: string;
};

export function useSchedule(barberId: string): {
  schedule: BarberScheduleResponse | null;
  loading: boolean;
  saving: boolean;
  error: string;
  saveSchedule: (days: ScheduleDay[]) => Promise<string | null>;
  retry: () => Promise<void>;
} {
  const queryClient = useQueryClient();

  const scheduleQuery = useQuery<BarberScheduleResponse, MutationError>({
    queryKey: ["panel-schedule", barberId],
    queryFn: async (): Promise<BarberScheduleResponse> => {
      const result = await getBarberSchedule({ barberId });
      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }
      return result.data;
    },
    enabled: barberId.length > 0,
    staleTime: 30_000,
  });

  const updateMutation = useMutation<
    { ok: boolean },
    MutationError,
    { barberId: string; days: ScheduleDay[] }
  >({
    mutationFn: async (input): Promise<{ ok: boolean }> => {
      const result = await updateBarberSchedule(input);
      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }
      return result.data;
    },
    onSuccess: async (_data, variables): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["panel-schedule", variables.barberId] }),
        queryClient.invalidateQueries({ queryKey: ["panel-overview"] }),
        queryClient.invalidateQueries({ queryKey: ["panel-bookings"] }),
      ]);
    },
  });

  async function saveSchedule(days: ScheduleDay[]): Promise<string | null> {
    try {
      await updateMutation.mutateAsync({ barberId, days });
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as MutationError).message);
      }
      return "No se pudo guardar el horario";
    }
  }

  async function retry(): Promise<void> {
    await scheduleQuery.refetch();
  }

  return {
    schedule: scheduleQuery.data ?? null,
    loading: scheduleQuery.isLoading || scheduleQuery.isFetching,
    saving: updateMutation.isPending,
    error: scheduleQuery.error?.message ?? "",
    saveSchedule,
    retry,
  };
}