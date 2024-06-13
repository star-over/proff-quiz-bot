import { numberProxies } from "./lib/strings";
import { shuffle } from "./lib/utils";
import { getQuizById, getVariantsWithProxies } from "./post-commons";
import { allQuizzes } from "./quizzes/allQuizzes";
import { TVariants } from "./quizzes/quiz";

// how many variants show to user to choose
const variantRates = [
  { count: 3, weight: 10 }, { count: 4, weight: 90 },
];

// how many proxyes in variant [1, 2, 3]
const proxyRates = [
  { count: 1, weight: 3 }, { count: 2, weight: 50 }, { count: 3, weight: 47 },
];

const quiz = getQuizById(allQuizzes, 1);
const { variants } = quiz;
const variantsWithProxy: TVariants = getVariantsWithProxies(variants);


function getCorrectVariantText(variants: TVariants): string {
  return variants
    .filter(({ isCorrect }) => isCorrect)
    .map(({ proxy }) => proxy)
    .join(" ");
};

export function makeFakeVariantText(variants) {
  const proxyCount = getWeightedRandomItem(proxyRates).count;
  const proxyVariants = numberProxies.slice(0, variants.length);
  return shuffle(proxyVariants)
    .slice(0, proxyCount)
    .sort()
    .join(" ");
};

export function makeMaskedVariants() {
  const correctVariantText = getCorrectVariantText(variantsWithProxy);
  const variantCount = getWeightedRandomItem(variantRates).count;
  const maskedVariants = [correctVariantText];

  // todo make guard for infinite loop
  while (maskedVariants.length < variantCount) {
    const fakeVariantText = makeFakeVariantText(variantsWithProxy);
    if (!maskedVariants.includes(fakeVariantText)) {
      maskedVariants.push(fakeVariantText);
    };
  };

  return shuffle(maskedVariants);
}

// https://stackoverflow.com/a/73702866/87713
function getWeightedRandomItem(items) {
  const weights = items.reduce((acc, item, i) => {
    acc.push(item.weight + (acc[i - 1] ?? 0));
    return acc;
  }, []);
  const random = Math.random() * weights.at(-1);
  return items[weights.findIndex((weight) => weight > random)];
};
