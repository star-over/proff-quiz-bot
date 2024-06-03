import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

// https://stackoverflow.com/a/1199420/87713
export function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) { return str; }
  const subString = str.slice(0, n - 2); // the original check
  return (useWordBoundary
    ? subString.slice(0, subString.lastIndexOf(" "))
    : subString) + "...";
};

export function objStringify(obj: {}): string {
  return (new URLSearchParams(obj)).toString() // 'a=1&b=2'
};

export function objParse(str: string) {
  return Object.fromEntries((new URLSearchParams(str)).entries()) // {a: '1', b: '2'}
};
