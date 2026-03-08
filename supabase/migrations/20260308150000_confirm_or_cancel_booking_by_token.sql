create or replace function public.confirm_or_cancel_booking_by_token(
  p_booking_id uuid,
  p_booking_token text,
  p_action text,
  p_cancel_reason text default null
)
returns table (
  booking_id uuid,
  status booking_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.appointments%rowtype;
begin
  if p_action not in ('confirmed', 'cancelled') then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_ACTION';
  end if;

  select *
  into v_booking
  from public.appointments
  where id = p_booking_id
    and confirmation_token = p_booking_token
  for update;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'BOOKING_NOT_UPDATABLE';
  end if;

  if v_booking.status not in ('booked', 'needs_confirmation') then
    raise exception using
      errcode = 'P0001',
      message = 'BOOKING_NOT_UPDATABLE';
  end if;

  if p_action = 'confirmed' and exists (
    select 1
    from public.appointments as a
    where a.barber_id = v_booking.barber_id
      and a.id <> v_booking.id
      and a.status in ('booked', 'needs_confirmation', 'confirmed')
      and a.timeslot && v_booking.timeslot
  ) then
    raise exception using
      errcode = '23P01',
      message = 'SLOT_TAKEN';
  end if;

  return query
    update public.appointments
    set
      status = case
        when p_action = 'confirmed' then 'confirmed'::booking_status
        else 'cancelled'::booking_status
      end,
      confirmed_at = case
        when p_action = 'confirmed' then now()
        else confirmed_at
      end,
      confirmation_token = null,
      cancel_reason = case
        when p_action = 'cancelled' then p_cancel_reason
        else null
      end
    where id = v_booking.id
    returning appointments.id, appointments.status;
end;
$$;