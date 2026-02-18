export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const withDDD = digits.replace(/^(\d{2})(\d)/, "($1) $2");
  const withHyphen = withDDD.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
  return withHyphen;
}
