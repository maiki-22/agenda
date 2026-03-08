DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appointments_customer_name_length_chk'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_customer_name_length_chk
      CHECK (char_length(btrim(customer_name)) BETWEEN 2 AND 80);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appointments_customer_name_format_chk'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_customer_name_format_chk
      CHECK (customer_name ~ '^[A-Za-zÀ-ÖØ-öø-ÿ'' .-]+$');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appointments_customer_phone_e164_chk'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_customer_phone_e164_chk
      CHECK (
        char_length(customer_phone) BETWEEN 8 AND 16
        AND customer_phone ~ '^\+[1-9][0-9]{1,14}$'
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appointments_cancel_reason_length_chk'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_cancel_reason_length_chk
      CHECK (
        cancel_reason IS NULL
        OR char_length(btrim(cancel_reason)) BETWEEN 3 AND 280
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appointments_confirmation_token_format_chk'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_confirmation_token_format_chk
      CHECK (
        confirmation_token IS NULL
        OR (
          char_length(confirmation_token) BETWEEN 20 AND 128
          AND confirmation_token ~ '^[A-Za-z0-9_-]+$'
        )
      );
  END IF;
END $$;