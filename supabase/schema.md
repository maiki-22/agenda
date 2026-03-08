| table_name       | column_name          | data_type                | character_maximum_length | is_nullable | column_default           | constraint_type |
| ---------------- | -------------------- | ------------------------ | ------------------------ | ----------- | ------------------------ | --------------- |
| appointments     | id                   | uuid                     | null                     | NO          | gen_random_uuid()        | PRIMARY KEY     |
| appointments     | barber_id            | text                     | null                     | NO          | null                     | FOREIGN KEY     |
| appointments     | service_id           | text                     | null                     | NO          | null                     | FOREIGN KEY     |
| appointments     | date                 | text                     | null                     | NO          | null                     | null            |
| appointments     | time                 | text                     | null                     | NO          | null                     | null            |
| appointments     | duration_min         | integer                  | null                     | NO          | null                     | null            |
| appointments     | start_at             | timestamp with time zone | null                     | NO          | null                     | null            |
| appointments     | end_at               | timestamp with time zone | null                     | NO          | null                     | null            |
| appointments     | timeslot             | tstzrange                | null                     | YES         | null                     | null            |
| appointments     | customer_name        | text                     | null                     | NO          | null                     | null            |
| appointments     | customer_phone       | text                     | null                     | NO          | null                     | null            |
| appointments     | status               | USER-DEFINED             | null                     | NO          | 'booked'::booking_status | null            |
| appointments     | created_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| appointments     | confirmation_token   | text                     | null                     | YES         | null                     | null            |
| appointments     | confirmation_sent_at | timestamp with time zone | null                     | YES         | null                     | null            |
| appointments     | confirmed_at         | timestamp with time zone | null                     | YES         | null                     | null            |
| appointments     | cancel_reason        | text                     | null                     | YES         | null                     | null            |
| appointments     | rescheduled_from     | uuid                     | null                     | YES         | null                     | FOREIGN KEY     |
| barber_blocks    | id                   | uuid                     | null                     | NO          | gen_random_uuid()        | PRIMARY KEY     |
| barber_blocks    | barber_id            | text                     | null                     | NO          | null                     | FOREIGN KEY     |
| barber_blocks    | start_at             | timestamp with time zone | null                     | NO          | null                     | null            |
| barber_blocks    | end_at               | timestamp with time zone | null                     | NO          | null                     | null            |
| barber_blocks    | reason               | text                     | null                     | YES         | null                     | null            |
| barber_blocks    | created_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| barber_blocks    | date                 | text                     | null                     | NO          | null                     | null            |
| barber_days_off  | id                   | uuid                     | null                     | NO          | gen_random_uuid()        | PRIMARY KEY     |
| barber_days_off  | barber_id            | text                     | null                     | NO          | null                     | FOREIGN KEY     |
| barber_days_off  | date                 | text                     | null                     | NO          | null                     | null            |
| barber_days_off  | reason               | text                     | null                     | YES         | null                     | null            |
| barber_days_off  | created_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| barber_schedules | id                   | uuid                     | null                     | NO          | gen_random_uuid()        | PRIMARY KEY     |
| barber_schedules | barber_id            | text                     | null                     | NO          | null                     | FOREIGN KEY     |
| barber_schedules | dow                  | integer                  | null                     | NO          | null                     | null            |
| barber_schedules | start_time           | time without time zone   | null                     | NO          | null                     | null            |
| barber_schedules | end_time             | time without time zone   | null                     | NO          | null                     | null            |
| barber_schedules | break_start          | time without time zone   | null                     | YES         | null                     | null            |
| barber_schedules | break_end            | time without time zone   | null                     | YES         | null                     | null            |
| barber_schedules | active               | boolean                  | null                     | NO          | true                     | null            |
| barber_schedules | created_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| barber_schedules | updated_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| barbers          | id                   | text                     | null                     | NO          | null                     | PRIMARY KEY     |
| barbers          | name                 | text                     | null                     | NO          | null                     | null            |
| barbers          | active               | boolean                  | null                     | NO          | true                     | null            |
| barbers          | sort_order           | integer                  | null                     | NO          | 0                        | null            |
| barbers          | updated_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| profiles         | user_id              | uuid                     | null                     | NO          | null                     | PRIMARY KEY     |
| profiles         | user_id              | uuid                     | null                     | NO          | null                     | FOREIGN KEY     |
| profiles         | role                 | text                     | null                     | NO          | 'barber'::text           | null            |
| profiles         | barber_id            | text                     | null                     | YES         | null                     | FOREIGN KEY     |
| profiles         | created_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| services         | id                   | text                     | null                     | NO          | null                     | PRIMARY KEY     |
| services         | name                 | text                     | null                     | NO          | null                     | null            |
| services         | duration_min         | integer                  | null                     | NO          | null                     | null            |
| services         | price_clp            | integer                  | null                     | NO          | null                     | null            |
| services         | active               | boolean                  | null                     | NO          | true                     | null            |
| services         | sort_order           | integer                  | null                     | NO          | 0                        | null            |
| services         | updated_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| shop_closed_days | id                   | uuid                     | null                     | NO          | gen_random_uuid()        | PRIMARY KEY     |
| shop_closed_days | date                 | text                     | null                     | NO          | null                     | UNIQUE          |
| shop_closed_days | reason               | text                     | null                     | YES         | null                     | null            |
| shop_closed_days | created_at           | timestamp with time zone | null                     | NO          | now()                    | null            |
| shop_settings    | id                   | text                     | null                     | NO          | 'main'::text             | PRIMARY KEY     |
| shop_settings    | shop_name            | text                     | null                     | NO          | null                     | null            |
| shop_settings    | address              | text                     | null                     | NO          | null                     | null            |
| shop_settings    | phone                | text                     | null                     | NO          | null                     | null            |
| shop_settings    | email                | text                     | null                     | NO          | null                     | null            |
| shop_settings    | instagram_url        | text                     | null                     | YES         | null                     | null            |
| shop_settings    | facebook_url         | text                     | null                     | YES         | null                     | null            |
| shop_settings    | tiktok_url           | text                     | null                     | YES         | null                     | null            |
| shop_settings    | about_text           | text                     | null                     | YES         | null                     | null            |
| shop_settings    | cancellation_policy  | text                     | null                     | YES         | null                     | null            |
| shop_settings    | updated_at           | timestamp with time zone | null                     | NO          | now()                    | null            |

## RLS — Estado por tabla

| tabla            | rls activo | lectura pública  | escritura anon                                 | escritura autenticado      |
| ---------------- | ---------- | ---------------- | ---------------------------------------------- | -------------------------- |
| appointments     | ✅         | ❌               | ✅ (solo INSERT con status needs_confirmation) | admin + barber propio      |
| barber_blocks    | ✅         | ❌               | ❌                                             | admin + barber propio      |
| barber_days_off  | ✅         | ❌               | ❌                                             | admin + barber propio      |
| barber_schedules | ✅         | ❌               | ❌                                             | admin + barber propio      |
| barbers          | ✅         | ✅ (solo SELECT) | ❌                                             | ❌                         |
| profiles         | ✅         | ❌               | ❌                                             | admin (ALL), self (SELECT) |
| services         | ✅         | ✅ (solo SELECT) | ❌                                             | solo admin                 |
| shop_closed_days | ✅         | ✅ (solo SELECT) | ❌                                             | solo admin                 |
| shop_settings    | ✅         | ✅ (solo SELECT) | ❌                                             | ❌                         |

## RLS — Helper functions usadas en policies

- `is_admin()` → verifica que el usuario autenticado tenga rol admin en `profiles`
- `is_authenticated_admin()` → igual que is_admin() pero exige rol `authenticated`
- `is_authenticated_barber_for(barber_id)` → verifica que el usuario autenticado sea el barbero dueño del recurso
- `my_barber_id()` → retorna el `barber_id` del usuario autenticado desde `profiles`

## RLS — Policies detalladas

### appointments

| policy                            | roles         | cmd    | condición                                                                          |
| --------------------------------- | ------------- | ------ | ---------------------------------------------------------------------------------- |
| appointments_anon_insert          | anon          | INSERT | with_check: status = 'needs_confirmation'                                          |
| appointments_anon_select_token    | anon          | SELECT | auth.jwt()->>'booking_token' = confirmation_token y auth.jwt()->>'booking_id' = id |
| appointments_anon_update_token    | anon          | UPDATE | token válido → solo puede pasar a confirmed o cancelled                            |
| appointments_authenticated_select | authenticated | SELECT | admin O barbero propio                                                             |
| appointments_authenticated_insert | authenticated | INSERT | admin O barbero propio                                                             |
| appointments_authenticated_update | authenticated | UPDATE | admin O barbero propio                                                             |
| appointments_authenticated_delete | authenticated | DELETE | admin O barbero propio                                                             |

Nota de flujo: el `confirmation_token` debe invalidarse (`NULL`) al ejecutar confirmación/cancelación por token para evitar reutilización.

### barber_blocks / barber_days_off / barber_schedules

Mismo patrón en las tres tablas: admin O barbero dueño del recurso (`barber_id = my_barber_id()`) para SELECT, INSERT, UPDATE, DELETE.

### barbers

Solo lectura pública (`SELECT true`). Sin escritura por RLS — modificar solo desde panel admin con service_role.

### profiles

- Admin puede leer y actualizar cualquier perfil
- Cada usuario puede leer solo su propio perfil (`auth.uid() = user_id`)
- Sin INSERT por RLS — los perfiles se crean vía trigger en auth.users

### services / shop_closed_days

- Lectura pública libre
- Escritura solo admin (`is_admin()`)

### shop_settings

- Solo lectura pública. Sin política de escritura definida por RLS — usar service_role desde servidor. |

## RLS — Estado de habilitación por tabla

| tabla            | rls_enabled | rls_forced |
| ---------------- | :---------: | :--------: |
| appointments     |     ✅      |     ❌     |
| barber_blocks    |     ✅      |     ❌     |
| barber_days_off  |     ✅      |     ❌     |
| barber_schedules |     ✅      |     ❌     |
| barbers          |     ✅      |     ❌     |
| profiles         |     ✅      |     ❌     |
| services         |     ✅      |     ❌     |
| shop_closed_days |     ✅      |     ❌     |
| shop_settings    |     ✅      |     ❌     |

> RLS habilitado en todas las tablas. `rls_forced = false` significa que el service_role
> bypasea RLS — usar con cuidado solo en Server Actions o funciones de servidor de confianza.
