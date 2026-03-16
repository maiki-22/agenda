"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Barber } from "@/types/panel";
import type { PanelBlockType } from "@/services/panel/blocks";

const formSchema = z
  .object({
    type: z.enum(["shop-closed", "barber-day-off", "barber-block"]),
    barberId: z.string().optional(),
    date: z.string().min(1, "Selecciona una fecha"),
    start: z.string().optional(),
    end: z.string().optional(),
    reason: z.string().max(140, "Máximo 140 caracteres").optional(),
  })
  .superRefine((value, context) => {
    if ((value.type === "barber-day-off" || value.type === "barber-block") && !value.barberId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["barberId"],
        message: "Selecciona un barbero",
      });
    }

    if (value.type === "barber-block" && (!value.start || !value.end)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start"],
        message: "Debes completar hora de inicio y fin",
      });
    }

    if (value.type === "barber-block" && value.start && value.end && value.start >= value.end) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end"],
        message: "La hora de fin debe ser mayor a la de inicio",
      });
    }
  });

type BlocksFormValues = z.infer<typeof formSchema>;

const BLOCK_TYPE_OPTIONS: Array<{ value: PanelBlockType; label: string }> = [
  { value: "shop-closed", label: "Cierre local" },
  { value: "barber-day-off", label: "Día libre barbero" },
  { value: "barber-block", label: "Franja barbero" },
];

const HELP_BY_TYPE: Record<PanelBlockType, string> = {
  "shop-closed": "Cierra la barbería completa en la fecha seleccionada.",
  "barber-day-off": "Marca al barbero como no disponible durante todo el día.",
  "barber-block": "Bloquea una franja horaria específica para un barbero.",
};

interface BlocksFormProps {
  barbers: Array<Barber>;
  loading: boolean;
  selectedBarber: string;
  onSave: (values: {
    type: PanelBlockType;
    barberId?: string;
    date: string;
    start?: string;
    end?: string;
    reason: string;
  }) => Promise<void>;
}

export function BlocksForm({ barbers, loading, selectedBarber, onSave }: BlocksFormProps) {
  const form = useForm<BlocksFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      type: "shop-closed",
      barberId: selectedBarber || undefined,
      date: "",
      start: "",
      end: "",
      reason: "",
    },
  });

  const blockType = useWatch({
    control: form.control,
    name: "type",
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values): Promise<void> => {
        await onSave({ ...values, reason: values.reason ?? "" });
        form.reset({ ...values, reason: "" });
      })}
      aria-live="polite"
    >
      <fieldset disabled={loading} className="space-y-4 disabled:opacity-70">
        <div className="space-y-1">
          <label htmlFor="block-type" className="text-xs font-medium text-[rgb(var(--muted))]">
            Tipo de bloqueo
          </label>
          <select
            id="block-type"
            {...form.register("type")}
            className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
          >
            {BLOCK_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {(blockType === "barber-day-off" || blockType === "barber-block") && (
          <div className="space-y-1">
            <label htmlFor="block-barber" className="text-xs font-medium text-[rgb(var(--muted))]">
              Barbero
            </label>
            <select
              id="block-barber"
              {...form.register("barberId")}
              className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
            >
              <option value="">Selecciona barbero</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
            {form.formState.errors.barberId && <p className="text-xs text-red-400">{form.formState.errors.barberId.message}</p>}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="block-date" className="text-xs font-medium text-[rgb(var(--muted))]">
            Fecha
          </label>
          <Input id="block-date" type="date" min={new Date().toISOString().slice(0, 10)} {...form.register("date")} />
        </div>

        {blockType === "barber-block" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="block-start" className="text-xs font-medium text-[rgb(var(--muted))]">
                Desde
              </label>
              <Input id="block-start" type="time" step={900} {...form.register("start")} />
            </div>
            <div className="space-y-1">
              <label htmlFor="block-end" className="text-xs font-medium text-[rgb(var(--muted))]">
                Hasta
              </label>
              <Input id="block-end" type="time" step={900} {...form.register("end")} />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="block-reason" className="text-xs font-medium text-[rgb(var(--muted))]">
            Motivo (opcional)
          </label>
          <Input id="block-reason" type="text" placeholder="Ej: capacitación, feriado, trámite" {...form.register("reason")} />
        </div>

        <p className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-xs text-[rgb(var(--muted))]">
          {HELP_BY_TYPE[blockType]}
        </p>

        <Button type="submit" fullWidth className="btn-gold" disabled={!form.formState.isValid || loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </fieldset>
    </form>
  );
}
