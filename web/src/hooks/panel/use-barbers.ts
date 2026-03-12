"use client";

import { useQuery } from "@tanstack/react-query";
import { getPanelBarbers } from "@/services/panel/barbers";
import type { Barber } from "@/types/panel";

type QueryError = {
  message: string;
  code?: string;
};

export function useBarbers(): {
  barbers: Array<Barber>;
  loading: boolean;
  error: string;
  reloadBarbers: () => Promise<void>;
} {
  const barbersQuery = useQuery<Array<Barber>, QueryError>({
    queryKey: ["barbers"],
    queryFn: async (): Promise<Array<Barber>> => {
      const result = await getPanelBarbers();
      if (!result.success) {
        throw { message: result.error, code: result.code } satisfies QueryError;
      }
      return result.data;
    },
    staleTime: 30_000,
  });

  async function reloadBarbers(): Promise<void> {
    await barbersQuery.refetch();
  }

  return {
    barbers: barbersQuery.data ?? [],
    loading: barbersQuery.isLoading || barbersQuery.isFetching,
    error: barbersQuery.error?.message ?? "",
    reloadBarbers,
  };
}