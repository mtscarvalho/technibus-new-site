import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Usuário",
    plural: "Usuários",
  },
  admin: {
    useAsTitle: "email",
    group: "Globais",
  },
  auth: { useSessions: false },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
    },
    {
      type: "text",
      label: "Cargo",
      name: "role",
    },
    {
      type: "textarea",
      label: "Bioagrafia",
      name: "bio",
    },
  ],
};
