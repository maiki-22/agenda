"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings, updateBookingStatus } from "@/services/panel/bookings";
import {
  createBarberBlock,
  createBarberDayOff,
  getBarberBlocks,
  getBarberDaysOff,
} from "@/services/panel/scheduling";
import type {
  BarberBlocksResponse,
  BarberDaysOffResponse,
  BookingsResponse,
  BookingStatus,
  BookingStatusFilter,
} from "@/types/panel";

type MutationError = {
  message: string;
  code?: string;
};

interface UseBarberPanelParams {
  barberId: string;
  dateFrom: string;
  dateTo: string;
  bookingStatus: BookingStatusFilter;
  bookingSearch: string;
  initialBookings: BookingsResponse | null;
  initialBlocks: BarberBlocksResponse | null;
  initialDaysOff: BarberDaysOffResponse | null;
}

export function useBarberPanel(params: UseBarberPanelParams) {
  const queryClient = useQueryClient();

  const normalizedSearch = useMemo<string>(
    () => params.bookingSearch.trim(),
    [params.bookingSearch],
  );

  const bookingsQuery = useQuery<BookingsResponse, MutationError>({
    queryKey: [
      "barber-panel-bookings",
      params.barberId,
      params.dateFrom,
      params.dateTo,
      params.bookingStatus,
      normalizedSearch,
    ],
    queryFn: async (): Promise<BookingsResponse> => {
      const result = await getBookings({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        barberId: params.barberId,
        status: params.bookingStatus,
        query: normalizedSearch,
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
      params.initialBookings &&
      params.bookingStatus === "all" &&
      normalizedSearch.length === 0
        ? params.initialBookings
        : undefined,
    staleTime: 30_000,
  });

  const blocksQuery = useQuery<BarberBlocksResponse, MutationError>({
    queryKey: ["barber-panel-blocks", params.barberId],
    queryFn: async (): Promise<BarberBlocksResponse> => {
      const result = await getBarberBlocks({ barberId: params.barberId });
      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }
      return result.data;
    },
    initialData: params.initialBlocks ?? undefined,
    staleTime: 30_000,
  });

  const daysOffQuery = useQuery<BarberDaysOffResponse, MutationError>({
    queryKey: ["barber-panel-days-off", params.barberId],
    queryFn: async (): Promise<BarberDaysOffResponse> => {
      const result = await getBarberDaysOff({ barberId: params.barberId });
      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }
      return result.data;
    },
    initialData: params.initialDaysOff ?? undefined,
    staleTime: 30_000,
  });

  const bookingMutation = useMutation<
    { ok: boolean },
    MutationError,
    { id: string; status: BookingStatus }
  >({
    mutationFn: async ({ id, status }): Promise<{ ok: boolean }> => {
      const result = await updateBookingStatus(id, status);
      if (!result.success) {
        throw {
          message: result.error,
          code: result.code,
        } satisfies MutationError;
      }
      return result.data;
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: ["barber-panel-bookings"],
      });
    },
  });

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
        queryClient.invalidateQueries({ queryKey: ["barber-panel-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["barber-panel-blocks"] }),
      ]);
    },
  });

  const createDayOffMutation = useMutation<
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
        queryClient.invalidateQueries({ queryKey: ["barber-panel-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["barber-panel-days-off"] }),
      ]);
    },
  });

  async function updateBooking(
    id: string,
    status: BookingStatus,
  ): Promise<string | null> {
    try {
      await bookingMutation.mutateAsync({ id, status });
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as MutationError).message);
      }
      return "No se pudo actualizar la cita";
    }
  }

  async function createBlock(input: {
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
      return "No se pudo crear el bloqueo";
    }
  }

  async function createDayOff(input: {
    barberId: string;
    date: string;
    reason: string;
  }): Promise<string | null> {
    try {
      await createDayOffMutation.mutateAsync(input);
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as MutationError).message);
      }
      return "No se pudo crear el día libre";
    }
  }

  return {
    bookings: bookingsQuery.data ?? null,
    bookingsLoading: bookingsQuery.isLoading || bookingsQuery.isFetching,
    bookingsError: bookingsQuery.error?.message ?? "",
    retryBookings: bookingsQuery.refetch,
    updateBooking,
    blocks: blocksQuery.data?.items ?? [],
    blocksLoading: blocksQuery.isLoading || blocksQuery.isFetching,
    blocksError: blocksQuery.error?.message ?? "",
    retryBlocks: blocksQuery.refetch,
    createBlock,
    daysOff: daysOffQuery.data?.items ?? [],
    daysOffLoading: daysOffQuery.isLoading || daysOffQuery.isFetching,
    daysOffError: daysOffQuery.error?.message ?? "",
    retryDaysOff: daysOffQuery.refetch,
    createDayOff,
    schedulingLoading:
      createBlockMutation.isPending || createDayOffMutation.isPending,
  };
}