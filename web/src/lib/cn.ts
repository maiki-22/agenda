export type ClassValue = string | false | null | undefined;

type VariantValues = Record<string, Record<string, string>>;
type VariantDefaults<T extends VariantValues> = {
  [K in keyof T]?: keyof T[K] & string;
};

type VariantSelection<T extends VariantValues> = {
  [K in keyof T]?: keyof T[K] & string;
};

function normalizeClasses(input: string): string[] {
  return input.split(/\s+/).filter(Boolean);
}

export function twMerge(...classes: ClassValue[]): string {
  const tokens = classes.flatMap((value) =>
    typeof value === "string" ? normalizeClasses(value) : [],
  );
  const unique = new Map<string, string>();

  tokens.forEach((token) => {
    unique.set(token, token);
  });

  return Array.from(unique.values()).join(" ");
}

export function cn(...classes: ClassValue[]): string {
  return twMerge(...classes);
}

export function cva<T extends VariantValues>(
  base: string,
  config: {
    variants: T;
    defaultVariants?: VariantDefaults<T>;
  },
): (selection?: VariantSelection<T> & { className?: string }) => string {
  return (selection) => {
    const mergedSelection = {
      ...(config.defaultVariants ?? {}),
      ...(selection ?? {}),
    } as VariantSelection<T>;

    const variantClasses = Object.entries(config.variants).map(
      ([variantName, options]) => {
        const selected = mergedSelection[variantName as keyof T];
        if (!selected) return "";
        return options[selected] ?? "";
      },
    );

    return cn(base, ...variantClasses, selection?.className);
  };
}
