import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type TPayloadObject = {
  questionId: number,
  variantsOrder: number[],
  isCorrect: boolean,
}

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
};

export function extractText(html: string): string {
  return html.replace(/<[^>]+>/g, '');
};

export function getRandom<T>(arr: T[]): T {
  // "|" for a kinda "int div"
  return arr[arr.length * Math.random() | 0];
}

export function hasDuplicates(arr: unknown[]): boolean {
  return arr.length !== new Set(arr).size;
};

// https://stackoverflow.com/a/1199420/87713
export function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) { return str; }
  const subString = str.slice(0, n - 2); // the original check
  return (useWordBoundary
    ? subString.slice(0, subString.lastIndexOf(" "))
    : subString) + "...";
};

// https://stackoverflow.com/a/73702866/87713
export function getWeightedRandomItem(items) {
  const weights = items.reduce((acc, item, i) => {
    acc.push(item.weight + (acc[i - 1] ?? 0));
    return acc;
  }, []);
  const random = Math.random() * weights.at(-1);
  return items[weights.findIndex((weight) => weight > random)];
};


export function objStringify(payloadObject: TPayloadObject): string {
  const { questionId, variantsOrder, isCorrect } = payloadObject;
  const obj = {
    q: questionId.toString(),
    o: variantsOrder.toString(),
    c: Number(isCorrect).toString(),
  }
  return (new URLSearchParams(obj)).toString() // 'a=1&b=2'
};

export function objParse(payload: string): TPayloadObject {
  const { q, o, c } = Object.fromEntries((new URLSearchParams(payload)).entries());
  return {
    questionId: Number(q),
    variantsOrder: o.split(",").map(Number),
    isCorrect: Boolean(Number(c))
  }
};

export function shuffle(array) {
  return array.toSorted(() => Math.random() - 0.5);
}
