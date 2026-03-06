"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBarberDayOff,
  createShopClosedDay,
} from "@/services/panel/scheduling";

type MutationError = {
  message: string;
  code?: string;
};

export function useDaysOff(): {
  loading: boolean;
  submitBarberDayOff: (input: {
    barberId: string;
    date: string;
    reason: string;
  }) => Promise<string | null>;
  submitShopClosedDay: (input: {
    date: string;
    reason: string;
  }) => Promise<string | null>;
} {
  const queryClient = useQueryClient();

  const createBarberDayOffMutation = useMutation<
    { ok: boolean },
    MutationError,
    { barberId: string; date: string; reason: string }
  >({
    mutationFn: async (input): Promise<{ ok: boolean }> => {
      const result = await createBarberDayOff(input);
      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }
      return result.data;
    },
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["panel-overview"] }),
        queryClient.invalidateQueries({ queryKey: ["panel-bookings"] }),
      ]);
    },
  });

  const createShopClosedDayMutation = useMutation<
    { ok: boolean },
    MutationError,
    { date: string; reason: string }
  >({
    mutationFn: async (input): Promise<{ ok: boolean }> => {
      const result = await createShopClosedDay(input);
      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }
      return result.data;
    },
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["panel-overview"] }),
        queryClient.invalidateQueries({ queryKey: ["panel-bookings"] }),
      ]);
    },
  });

  async function submitBarberDayOff(input: {
    barberId: string;
    date: string;
    reason: string;
  }): Promise<string | null> {
    try {
      await createBarberDayOffMutation.mutateAsync(input);
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as MutationError).message);
      }
      return "No se pudo registrar el día libre";
    }
  }

  async function submitShopClosedDay(input: {
    date: string;
    reason: string;
  }): Promise<string | null> {
    try {
      await createShopClosedDayMutation.mutateAsync(input);
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as MutationError).message);
      }
      return "No se pudo registrar el cierre de la tienda";
    }
  }

  return {
    loading:
      createBarberDayOffMutation.isPending ||
      createShopClosedDayMutation.isPending,
    submitBarberDayOff,
    submitShopClosedDay,
  };
}
