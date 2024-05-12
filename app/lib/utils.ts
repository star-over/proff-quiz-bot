import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const proxies = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K",
  "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Z"];

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
};

export function extractText(html: string) {
  return html.replace(/<[^>]+>/g, '');
};

export function getRandom(items) {
  // "|" for a kinda "int div"
  return items[items.length * Math.random() | 0];
}
