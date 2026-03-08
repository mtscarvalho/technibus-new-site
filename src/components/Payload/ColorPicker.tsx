"use client";

import { FieldLabel, useField } from "@payloadcms/ui";

type Props = {
  path: string;
  field: {
    label?: string;
    required?: boolean;
  };
};

export default function ColorPicker(props: Props) {
  const { path, field } = props;

  const { value, setValue } = useField<string>({ path });

  const label = field?.label;
  const required = field?.required;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <FieldLabel label={label} required={required} />

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: 6 }}>
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: 40,
            height: 40,
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        />

        <input
          type="text"
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#000000"
          style={{
            padding: "6px 8px",
            border: "1px solid #ccc",
            borderRadius: 4,
            width: 110,
          }}
        />
      </div>
    </div>
  );
}
