import { isValidUrl } from "@/utilities/is-valid-url";
import { GlobalConfig } from "payload";

export const Social: GlobalConfig = {
  slug: "social",
  label: "Redes sociais",
  admin: {
    group: "Navegação e estrutura",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "instagram",
      label: "",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "Instagram", hidden: true, required: true },
        { name: "url", type: "text", label: "Instagram", validate: isValidUrl },
      ],
    },

    {
      name: "facebook",
      label: "",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "Facebook", hidden: true, required: true },
        { name: "url", type: "text", label: "Facebook", validate: isValidUrl },
      ],
    },
    {
      name: "whatsapp",
      label: "",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "WhatsApp", hidden: true, required: true },
        { name: "url", type: "text", label: "WhatsApp", validate: isValidUrl },
      ],
    },
    {
      name: "youtube",
      label: "",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "YouTube", hidden: true, required: true },
        { name: "url", type: "text", label: "YouTube", validate: isValidUrl },
      ],
    },

    {
      name: "linkedin",
      label: "",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "LinkedIn", hidden: true, required: true },
        { name: "url", type: "text", label: "LinkedIn", validate: isValidUrl },
      ],
    },
    {
      name: "threads",
      label: "",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "Threads", hidden: true, required: true },
        { name: "url", type: "text", label: "Threads", validate: isValidUrl },
      ],
    },
    {
      name: "tiktok",
      label: "",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "LinkedIn", hidden: true, required: true },
        { name: "url", type: "text", label: "TikTok", validate: isValidUrl },
      ],
    },
    {
      name: "x",
      label: "",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "X (Twitter)", hidden: true, required: true },
        { name: "url", type: "text", label: "X (Twitter)", validate: isValidUrl },
      ],
    },
  ],
};
