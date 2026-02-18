export function formatDate(value: string) {
  const date = new Date(value);
  const formatted = date.toLocaleDateString("pt-BR");
  return formatted;
}
