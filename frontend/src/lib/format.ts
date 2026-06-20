// Helpers de formatação no padrão brasileiro.

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function formatDate(iso: string | Date): string {
  return dateFormatter.format(new Date(iso));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}
