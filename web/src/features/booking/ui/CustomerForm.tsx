"use client";

import { useState } from "react";

export function CustomerForm({
  name,
  phone,
  onChange,
}: {
  name: string;
  phone: string;
  onChange: (name: string, phone: string) => void;
}) {
  const [localName, setLocalName] = useState(name);
  const [localPhone, setLocalPhone] = useState(phone);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Tus datos</h2>

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Nombre</label>
        <input
          value={localName}
          onChange={(e) => {
            setLocalName(e.target.value);
            onChange(e.target.value, localPhone);
          }}
          className="w-full rounded-xl border border-gray-200 px-4 py-3"
          placeholder="Ej: Maiki"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Teléfono (WhatsApp)</label>
        <input
          value={localPhone}
          onChange={(e) => {
            setLocalPhone(e.target.value);
            onChange(localName, e.target.value);
          }}
          className="w-full rounded-xl border border-gray-200 px-4 py-3"
          placeholder="Ej: +55 11 99999-9999"
        />
        <p className="text-xs text-gray-500">
          Te enviaremos la confirmación por WhatsApp.
        </p>
      </div>
    </div>
  );
}