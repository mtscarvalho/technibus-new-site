export function getCurrentYear(): number {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { timeZone: "America/Sao_Paulo", year: "numeric" };
  return parseInt(new Intl.DateTimeFormat("pt-BR", options).format(now), 10);
}
