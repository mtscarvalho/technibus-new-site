"use client";

import { ChangeEvent } from "react";

import { formatPhone } from "@/utilities/format-phone";
import { TextInput, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";

export const PhoneNumberFieldComponent: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <TextInput
      path={path}
      label={field.label}
      description="DDD + Número. O texto será formatado automaticamente."
      onChange={handleChange}
      placeholder="(11) 98765-4321"
      value={value ? formatPhone(value as string) : (value as string)}
    />
  );
};

export default PhoneNumberFieldComponent;
