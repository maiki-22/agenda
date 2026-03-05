"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "@/services/panel/bookings";
import type {
  BookingStatus,
  BookingStatusFilter,
  BookingsResponse,
  OverviewResponse,
} from "@/types/panel";

export function useBookings(params: {
  overview: OverviewResponse | null;
  selectedBarber: string;
}): {
  bookings: BookingsResponse | null;
  bookingStatus: BookingStatusFilter;
  bookingSearch: string;
  loading: boolean;
  error: string;
  setBookingStatus: (status: BookingStatusFilter) => void;
  setBookingSearch: (search: string) => void;
  reloadBookings: () => Promise<void>;
  onUpdateBookingStatus: (id: string, status: BookingStatus) => Promise<string | null>;
} {
  const [bookings, setBookings] = useState<BookingsResponse | null>(null);
  const [bookingStatus, setBookingStatus] = useState<BookingStatusFilter>("all");
  const [bookingSearch, setBookingSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const reloadBookings = useCallback(async (): Promise<void> => {
    if (!params.overview) return;

    setLoading(true);
    setError("");
    const result = await getBookings({
      dateFrom: params.overview.date_window.startDate,
      dateTo: params.overview.date_window.endDate,
      barberId: params.selectedBarber || undefined,
      status: bookingStatus,
      query: bookingSearch,
    });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setBookings(result.data);
    setLoading(false);
  }, [bookingSearch, bookingStatus, params.overview, params.selectedBarber]);

  useEffect(() => {
    void reloadBookings();
  }, [reloadBookings]);

  const onUpdateBookingStatus = useCallback(
    async (id: string, status: BookingStatus): Promise<string | null> => {
      const result = await updateBookingStatus(id, status);
      if (!result.success) {
        setError(result.error);
        return result.error;
      }
      await reloadBookings();
      return null;
    },
    [reloadBookings],
  );

  return {
    bookings,
    bookingStatus,
    bookingSearch,
    loading,
    error,
    setBookingStatus,
    setBookingSearch,
    reloadBookings,
    onUpdateBookingStatus,
  };
}