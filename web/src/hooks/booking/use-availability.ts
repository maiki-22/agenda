"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAvailability } from "@/services/booking/availability.service";

export function useAvailability(params: {
  barberId: string;
  date: string;
  service: string;
}): {
  slots: string[];
  isLoading: boolean;
  error: string;
  code?: string;
  reload: () => Promise<void>;
} {
  const query = useQuery<{ slots: string[] }, Error & { code?: string }>({
    queryKey: ["booking-availability", params.barberId, params.date, params.service],
    queryFn: async (): Promise<{ slots: string[] }> => {
      const result = await fetchAvailability(params);

      if (!result.success) {
        const error = new Error(result.error) as Error & { code?: string };
        error.code = result.code;
        throw error;
      }

      return result.data;
    },
    enabled: Boolean(params.barberId && params.date && params.service),
    staleTime: 30_000,
  });

  return {
    slots: query.data?.slots ?? [],
    isLoading: query.isLoading || query.isFetching,
    error: query.error?.message ?? "",
    code: query.error?.code,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}