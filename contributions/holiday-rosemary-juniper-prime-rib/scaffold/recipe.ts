export const recipe = {
  id: 'holiday-rosemary-juniper-prime-rib',
  baseWeightLb: 4,
  supportedWeightLb: [3, 4, 5, 6, 7, 8],
  grillAmbientF: [250, 275] as const,
  safetyInternalF: 145,
  restMinutes: [20, 30] as const,
  sauce: 'Horseradish cream with sour cream, Dijon, lemon, and chives',
} as const;
