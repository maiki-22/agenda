create or replace function public.create_booking(
  p_barber_id text,
  p_service_id text,
  p_date text,
  p_time text,
  p_duration_min integer,
  p_customer_name text,
  p_customer_phone text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking_id uuid;
  v_start_at timestamptz;
  v_end_at timestamptz;
begin
  v_start_at := ((p_date || ' ' || p_time)::timestamp at time zone 'America/Santiago');
  v_end_at := v_start_at + make_interval(mins => p_duration_min);

  if v_start_at < now() + interval '30 minutes' then
    raise exception using
      errcode = 'P0001',
      message = 'MIN_LEAD_TIME';
  end if;

  if exists (
    select 1
    from public.appointments as a
    where a.barber_id = p_barber_id
      and a.status in ('booked', 'needs_confirmation', 'confirmed')
      and a.timeslot && tstzrange(v_start_at, v_end_at, '[)')
  ) then
    raise exception using
      errcode = '23P01',
      message = 'SLOT_TAKEN';
  end if;

  insert into public.appointments (
    barber_id,
    service_id,
    date,
    time,
    duration_min,
    start_at,
    end_at,
    customer_name,
    customer_phone,
    status
  )
  values (
    p_barber_id,
    p_service_id,
    p_date,
    p_time,
    p_duration_min,
    v_start_at,
    v_end_at,
    p_customer_name,
    p_customer_phone,
    'needs_confirmation'::booking_status
  )
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;