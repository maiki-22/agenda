create or replace function public.search_bookings(
  p_query text,
  p_barber_id text,
  p_status text,
  p_date_from text,
  p_date_to text,
  p_page int,
  p_page_size int
)
returns table (
  id uuid,
  date text,
  "time" text,
  status booking_status,
  customer_name text,
  customer_phone text,
  barber_id text,
  service_id text,
  barber_name text,
  service_name text,
  total_count bigint
)
language sql
stable
as $$
  with filtered as (
    select
      a.id,
      a.date,
      a.time as "time",
      a.status,
      a.customer_name,
      a.customer_phone,
      a.barber_id,
      a.service_id,
      b.name as barber_name,
      s.name as service_name
    from public.appointments a
    left join public.barbers b on b.id = a.barber_id
    left join public.services s on s.id = a.service_id
    where (p_date_from is null or a.date >= p_date_from)
      and (p_date_to is null or a.date <= p_date_to)
      and (p_barber_id is null or a.barber_id = p_barber_id)
      and (p_status is null or a.status::text = p_status)
      and (
        p_query is null
        or p_query = ''
        or a.customer_name ilike '%' || p_query || '%'
        or a.customer_phone ilike '%' || p_query || '%'
      )
  )
  select
    filtered.id,
    filtered.date,
    filtered."time",
    filtered.status,
    filtered.customer_name,
    filtered.customer_phone,
    filtered.barber_id,
    filtered.service_id,
    filtered.barber_name,
    filtered.service_name,
    count(*) over() as total_count
  from filtered
  order by filtered.date asc, filtered."time" asc
  offset greatest(coalesce(p_page, 1) - 1, 0) * greatest(coalesce(p_page_size, 10), 1)
  limit greatest(coalesce(p_page_size, 10), 1);
$$;