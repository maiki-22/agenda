import { supabaseAdmin } from "@/lib/supabase/admin";

export type DbService = {
  id: string;
  name: string;
  duration_min: number;
  price_clp: number;
};

export type DbBarber = {
  id: string;
  name: string;
};

export async function listServices(): Promise<DbService[]> {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("id,name,duration_min,price_clp,sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as DbService[];
}

export async function listBarbers(): Promise<DbBarber[]> {
  const { data, error } = await supabaseAdmin
    .from("barbers")
    .select("id,name,sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as DbBarber[];
}