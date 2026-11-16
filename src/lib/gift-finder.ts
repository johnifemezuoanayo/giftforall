import { productMatchesRule } from "@/lib/product-rules";
import type { FinderBudget, FinderOccasion, FinderPerson, Interest, InterestId, Product } from "@/types";

export type FinderAnswers = {
  personId: string | null;
  occasionId: string | null;
  interestIds: InterestId[];
  keyword: string;
  budgetId: string | null;
};

export type FinderMatch = {
  product: Product;
  score: number;
  reasons: string[];
};

export type FinderData = {
  products: Product[];
  people: FinderPerson[];
  occasions: FinderOccasion[];
  budgets: FinderBudget[];
  interests: Interest[];
};

export const emptyAnswers: FinderAnswers = {
  personId: null,
  occasionId: null,
  interestIds: [],
  keyword: "",
  budgetId: null,
};

// Who it's for and the budget are hard limits. Occasion, interests and keywords only change the ranking.
export function findGifts(answers: FinderAnswers, data: FinderData): { matches: FinderMatch[]; closeMatchesOnly: boolean } {
  const person = data.people.find((item) => item.id === answers.personId);
  const occasion = data.occasions.find((item) => item.id === answers.occasionId);
  const budget = data.budgets.find((item) => item.id === answers.budgetId);
  const keyword = answers.keyword.trim().toLowerCase();

  const allowed = data.products.filter((product) => {
    if (person && person.audiences.length > 0 && !product.audiences.some((audience) => person.audiences.includes(audience))) {
      return false;
    }
    if (budget?.max !== undefined && product.price.amount > budget.max) return false;
    return true;
  });

  const matches = allowed.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    if (person && person.audiences.length > 0) reasons.push(`for ${person.label}`);

    const sharedInterests = product.interests.filter((id) => answers.interestIds.includes(id));
    score += sharedInterests.length * 3;
    sharedInterests.forEach((id) => {
      const label = data.interests.find((interest) => interest.id === id)?.label ?? id;
      reasons.push(`into ${label}`);
    });

    if (keyword) {
      const text = `${product.name} ${product.description} ${product.details ?? ""}`.toLowerCase();
      if (text.includes(keyword)) {
        score += 3;
        reasons.push(`mentions "${answers.keyword.trim()}"`);
      }
    }

    if (occasion && occasion.id !== "just-because" && productMatchesRule(product, occasion.rule)) {
      score += 1;
      reasons.push(`great for ${occasion.label}`);
    }

    if (budget?.max !== undefined) reasons.push(`under $${budget.max}`);
    if (product.badge) score += 0.5;

    return { product, score, reasons };
  });

  matches.sort((a, b) => b.score - a.score || a.product.price.amount - b.product.price.amount);

  const askedForSomething = answers.interestIds.length > 0 || keyword !== "";
  const strongMatches = matches.filter((match) => match.score >= 3);
  const closeMatchesOnly = askedForSomething && strongMatches.length === 0;

  return { matches: askedForSomething && !closeMatchesOnly ? strongMatches : matches, closeMatchesOnly };
}
