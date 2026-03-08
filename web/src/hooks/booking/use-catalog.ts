"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const CatalogSchema = z.object({
  services: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      duration_min: z.number(),
      price_clp: z.number(),
    }),
  ),
  barbers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

export type CatalogData = z.infer<typeof CatalogSchema>;

async function fetchCatalog(): Promise<CatalogData> {
  const response = await fetch("/api/catalog", { cache: "no-store" });
  const raw = (await response.json().catch(() => ({}))) as unknown;

  if (!response.ok) {
    throw new Error("No se pudo cargar el catálogo");
  }

  const parsed = CatalogSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("Respuesta inválida del catálogo");
  }

  return parsed.data;
}

export function useCatalog(initialData: CatalogData): {
  services: CatalogData["services"];
  barbers: CatalogData["barbers"];
  isLoading: boolean;
  error: string;
} {
  const query = useQuery<CatalogData, Error>({
    queryKey: ["booking-catalog"],
    queryFn: fetchCatalog,
    initialData,
    staleTime: 30_000,
  });

  return {
    services: query.data?.services ?? [],
    barbers: query.data?.barbers ?? [],
    isLoading: query.isLoading || query.isFetching,
    error: query.error?.message ?? "",
  };
}