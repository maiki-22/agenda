"use client";

import { useState } from "react";
import { createBarberBlock } from "@/services/panel/scheduling";

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
  const [loading, setLoading] = useState<boolean>(false);

  async function submitBlock(input: {
    barberId: string;
    date: string;
    start: string;
    end: string;
    reason: string;
  }): Promise<string | null> {
    setLoading(true);
    const result = await createBarberBlock(input);
    setLoading(false);
    if (!result.success) return result.error;
    return null;
  }

  return { loading, submitBlock };
}