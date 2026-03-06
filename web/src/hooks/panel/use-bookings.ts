"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings, updateBookingStatus } from "@/services/panel/bookings";
import type {
  BookingStatus,
  BookingStatusFilter,
  BookingsResponse,
  OverviewResponse,
} from "@/types/panel";

type MutationError = {
  message: string;
  code?: string;
};

export function useBookings(params: {
  overview: OverviewResponse | null;
  selectedBarber: string;
  initialBookings: BookingsResponse | null;
}): {
  bookings: BookingsResponse | null;
  bookingStatus: BookingStatusFilter;
  bookingSearch: string;
  loading: boolean;
  error: string;
  setBookingStatus: (status: BookingStatusFilter) => void;
  setBookingSearch: (search: string) => void;
  reloadBookings: () => Promise<void>;
  onUpdateBookingStatus: (
    id: string,
    status: BookingStatus,
  ) => Promise<string | null>;
} {
  const queryClient = useQueryClient();
  const [bookingStatus, setBookingStatus] =
    useState<BookingStatusFilter>("all");
  const [bookingSearch, setBookingSearch] = useState<string>("");
  const normalizedSearch = useMemo<string>(
    () => bookingSearch.trim(),
    [bookingSearch],
  );

  const bookingsQuery = useQuery<BookingsResponse, MutationError>({
    queryKey: [
      "panel-bookings",
      params.overview?.window ?? "none",
      params.overview?.date_window.startDate ?? "",
      params.overview?.date_window.endDate ?? "",
      params.selectedBarber || "all",
      bookingStatus,
      normalizedSearch,
    ],
    queryFn: async (): Promise<BookingsResponse> => {
      if (!params.overview) {
        return { items: [], page: 1, pageSize: 8, total: 0 };
      }

      const result = await getBookings({
        dateFrom: params.overview.date_window.startDate,
        dateTo: params.overview.date_window.endDate,
        barberId: params.selectedBarber || undefined,
        status: bookingStatus,
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
    enabled: Boolean(params.overview),
    initialData:
      params.initialBookings &&
      params.overview &&
      bookingStatus === "all" &&
      normalizedSearch.length === 0 &&
      params.selectedBarber.length === 0
        ? params.initialBookings
        : undefined,
    staleTime: 30_000,
  });

  const updateStatusMutation = useMutation<
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["panel-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["panel-overview"] }),
      ]);
    },
  });

  async function reloadBookings(): Promise<void> {
    await bookingsQuery.refetch();
  }

  async function onUpdateBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<string | null> {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      return null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as MutationError).message);
      }
      return "No se pudo actualizar el estado de la reserva";
    }
  }

  return {
    bookings: bookingsQuery.data ?? null,
    bookingStatus,
    bookingSearch,
    loading: bookingsQuery.isLoading || bookingsQuery.isFetching,
    error: bookingsQuery.error?.message ?? "",
    setBookingStatus,
    setBookingSearch,
    reloadBookings,
    onUpdateBookingStatus,
  };
}
