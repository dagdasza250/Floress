const crisisHints = [/samobój|skrzywdz/i, /koniec ze sobą/i, /nie chcę żyć/i];
export function detectCrisis(text:string): boolean {
  return crisisHints.some(r => r.test(text));
}