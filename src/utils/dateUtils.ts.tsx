// utils/dateUtils.ts
export function formatLocalDateTime(isoString: string): string {
    if (!isoString) return "-";

    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "Invalid date";

    const locale = import.meta.env.VITE_DEFAULT_LOCALE

    return date.toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}
