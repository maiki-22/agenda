"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBarberBlock } from "@/services/panel/scheduling";

type MutationError = {
  message: string;
  code?: string;
};

export function useBarberBlocks(): {
  loading: boolean;
  submitBlock: (input: {
    barberId: string;
    date: string;
    start: string;
    end: string;
    reason: string;
  }) => Promise<string | null>;
} {
  const queryClient = useQueryClient();

  const createBlockMutation = useMutation<
    { ok: boolean },
    MutationError,
    {
      barberId: string;
      date: string;
      start: string;
      end: string;
      reason: string;
    }
  >({
    mutationFn: async (input): Promise<{ ok: boolean }> => {
      const result = await createBarberBlock(input);
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

  async function submitBlock(input: {
    barberId: string;
    date: string;
    start: string;
    end: string;
    reason: string;
  }): Promise<string | null> {
    try {
      await createBlockMutation.mutateAsync(input);
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as MutationError).message);
      }
      return "No se pudo bloquear el horario";
    }
  }

  return { loading: createBlockMutation.isPending, submitBlock };
}
