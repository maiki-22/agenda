"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAvailability,
  fetchAvailabilityBatch,
} from "@/services/booking/availability.service";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useAvailabilityBatch(params: {
  barberId: string;
  from: string;
  to: string;
  service: string;
  dateRange: string;
  dates: string[];
}): {
  slotsByDate: Record<string, string[]>;
  isLoading: boolean;
  error: string;
  code?: string;
  reload: () => Promise<void>;
} {
  const query = useQuery<
    { slotsByDate: Record<string, string[]> },
    Error & { code?: string }
  >({
    queryKey: ["booking-availability-batch", params.barberId, params.dateRange],
    queryFn: async (): Promise<{ slotsByDate: Record<string, string[]> }> => {
      let batchErrorCode: string | undefined;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        const batchResult = await fetchAvailabilityBatch(params);

        if (batchResult.success) {
          return batchResult.data;
        }

        batchErrorCode = batchResult.code;

        if (batchResult.code === "AVAILABILITY_SOURCE_ERROR") {
          const sourceError = new Error(batchResult.error) as Error & {
            code?: string;
          };
          sourceError.code = batchResult.code;
          throw sourceError;
        }

        if (batchResult.status === 429) {
          break;
        }

        if (attempt === 0) {
          await sleep(250);
        }
      }

      const slotsByDate: Record<string, string[]> = {};

      for (const date of params.dates) {
        const dayResult = await fetchAvailability({
          barberId: params.barberId,
          date,
          service: params.service,
        });

        if (!dayResult.success) {
          if (dayResult.code === "AVAILABILITY_SOURCE_ERROR") {
            const sourceError = new Error(dayResult.error) as Error & {
              code?: string;
            };
            sourceError.code = dayResult.code;
            throw sourceError;
          }

          slotsByDate[date] = [];
          continue;
        }

        slotsByDate[date] = dayResult.data.slots;
      }

      if (!Object.keys(slotsByDate).length) {
        const error = new Error("No se pudo validar disponibilidad") as Error & {
          code?: string;
        };
        error.code = batchErrorCode;
        throw error;
      }

      return { slotsByDate };
    },
    enabled: Boolean(params.barberId && params.from && params.to && params.service),
    staleTime: 30_000,
  });

  return {
    slotsByDate: query.data?.slotsByDate ?? {},
    isLoading: query.isLoading || query.isFetching,
    error: query.error?.message ?? "",
    code: query.error?.code,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}