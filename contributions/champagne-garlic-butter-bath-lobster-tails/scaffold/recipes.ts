export type Protein = "Lobster";
export type Unit = "F" | "C";
export type Recipe = {
  id: string;
  protein: Protein;
  title: string;
  headline: string[];
  description: string;
  time: string;
  rest: string;
  serves: string;
  method: string;
  grill: number[];
  internal: number[];
  finish: string;
  safety: string;
  wood: string;
  tip: string;
  ingredients: { title: string; items: string[] }[];
  steps: { title: string; cue: string; body: string }[];
};
export const safetySource =
  "https://www.fda.gov/food/buy-store-serve-safe-food/selecting-and-serving-fresh-and-frozen-seafood-safely";
export function temp(values: number[], unit: Unit) {
  return (
    values
      .map((v) => (unit === "F" ? v : Math.round(((v - 32) * 5) / 9)))
      .join("–") +
    "°" +
    unit
  );
}
export function unitText(text: string, unit: Unit) {
  return unit === "F"
    ? text
    : text.replace(/(\d+)(?:–(\d+))?°F/g, (_, a, b) =>
        temp(b ? [+a, +b] : [+a], "C"),
      );
}
