import type { InputHTMLAttributes } from "react";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Toggle({ label, className = "", ...props }: ToggleProps) {
  return (
    <label className={`inline-flex cursor-pointer items-center gap-2 ${className}`}>
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="relative h-7 w-12 rounded-full bg-[rgb(var(--border))] transition-colors duration-200 ease-out peer-checked:bg-[rgb(var(--primary))]">
        <span className="absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-[rgb(var(--primary-foreground))] transition-transform duration-200 ease-out peer-checked:translate-x-5" />
      </span>
      <span className="sr-only">{label}</span>
    </label>
  );
}