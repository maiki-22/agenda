"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function PanelSignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async (): Promise<void> => {
    setIsLoading(true);

    await supabaseBrowser.auth.signOut();
    router.push("/panel/login");
    router.refresh();

    setIsLoading(false);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleSignOut}
      disabled={isLoading}
      aria-label="Cerrar sesión"
      className="min-w-32"
    >
      {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
    </Button>
  );
}
