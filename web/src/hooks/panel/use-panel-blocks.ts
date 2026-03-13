"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBarberBlock,
  createBarberDayOff,
  createShopClosedDay,
  deleteActiveBlock,
  getActiveBlocks,
  type ActiveBlockItem,
  type PanelBlockType,
} from "@/services/panel/blocks";

type QueryError = { message: string; code?: string };

async function invalidatePanelQueries(queryClient: ReturnType<typeof useQueryClient>): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["panel-overview"] }),
    queryClient.invalidateQueries({ queryKey: ["panel-bookings"] }),
    queryClient.invalidateQueries({ queryKey: ["panel-active-blocks"] }),
  ]);
}

export function usePanelBlocks(selectedBarber: string): {
  blocks: Array<ActiveBlockItem>;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string;
  saveBlock: (input: {
    type: PanelBlockType;
    barberId?: string;
    date: string;
    start?: string;
    end?: string;
    reason: string;
  }) => Promise<string | null>;
  removeBlock: (input: { type: PanelBlockType; id: string }) => Promise<string | null>;
  reloadBlocks: () => Promise<void>;
} {
  const queryClient = useQueryClient();

  const blocksQuery = useQuery<Array<ActiveBlockItem>, QueryError>({
    queryKey: ["panel-active-blocks", selectedBarber || "all"],
    queryFn: async (): Promise<Array<ActiveBlockItem>> => {
      const result = await getActiveBlocks({ barberId: selectedBarber || undefined });
      if (!result.success) {
        throw { message: result.error, code: result.code } satisfies QueryError;
      }
      return result.data;
    },
    staleTime: 30_000,
  });

  const saveMutation = useMutation<
    { ok: boolean },
    QueryError,
    { type: PanelBlockType; barberId?: string; date: string; start?: string; end?: string; reason: string }
  >({
    mutationFn: async (input): Promise<{ ok: boolean }> => {
      if (input.type === "shop-closed") {
        const result = await createShopClosedDay({ date: input.date, reason: input.reason });
        if (!result.success) throw { message: result.error, code: result.code } satisfies QueryError;
        return result.data;
      }

      if (!input.barberId) {
        throw { message: "Debes seleccionar un barbero" } satisfies QueryError;
      }

      if (input.type === "barber-day-off") {
        const result = await createBarberDayOff({ barberId: input.barberId, date: input.date, reason: input.reason });
        if (!result.success) throw { message: result.error, code: result.code } satisfies QueryError;
        return result.data;
      }

      if (!input.start || !input.end) {
        throw { message: "Debes indicar una franja de tiempo válida" } satisfies QueryError;
      }

      const result = await createBarberBlock({
        barberId: input.barberId,
        date: input.date,
        start: input.start,
        end: input.end,
        reason: input.reason,
      });

      if (!result.success) throw { message: result.error, code: result.code } satisfies QueryError;
      return result.data;
    },
    onSuccess: async (): Promise<void> => {
      await invalidatePanelQueries(queryClient);
    },
  });

  const deleteMutation = useMutation<{ ok: boolean }, QueryError, { type: PanelBlockType; id: string }>({
    mutationFn: async (input): Promise<{ ok: boolean }> => {
      const result = await deleteActiveBlock(input);
      if (!result.success) throw { message: result.error, code: result.code } satisfies QueryError;
      return result.data;
    },
    onSuccess: async (): Promise<void> => {
      await invalidatePanelQueries(queryClient);
    },
  });

  async function saveBlock(input: {
    type: PanelBlockType;
    barberId?: string;
    date: string;
    start?: string;
    end?: string;
    reason: string;
  }): Promise<string | null> {
    try {
      await saveMutation.mutateAsync(input);
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as QueryError).message);
      }
      return "No se pudo guardar el bloqueo";
    }
  }

  async function removeBlock(input: { type: PanelBlockType; id: string }): Promise<string | null> {
    try {
      await deleteMutation.mutateAsync(input);
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as QueryError).message);
      }
      return "No se pudo eliminar el bloqueo";
    }
  }

  async function reloadBlocks(): Promise<void> {
    await blocksQuery.refetch();
  }

  return {
    blocks: blocksQuery.data ?? [],
    loading: blocksQuery.isLoading || blocksQuery.isFetching,
    saving: saveMutation.isPending,
    deleting: deleteMutation.isPending,
    error: blocksQuery.error?.message ?? "",
    saveBlock,
    removeBlock,
    reloadBlocks,
  };
}