export type Unit = 'F' | 'C';
export type WeightUnit = 'lb' | 'kg';
export const recipe = {
  id: 'steakhouse-beef-bison-burgers',
  title: 'Worcestershire. Big burgers.',
  description: 'A hard-seared, SPG-forward burger with grated onion, smoked cheddar, charred onions, and a peppery steakhouse sauce.',
  baseTotalLb: 1.5,
  safeInternalF: 160,
  grillAmbientF: [450, 500] as const,
  bisonOilTspPerLb: 2,
  steps: [
    { title: 'Mix cold and season gently', cue: 'Keep the meat chilled', body: 'Mix the meat with scaled Worcestershire, SPG, garlic, grated onion, and black pepper just until combined. For bison, add the scaled olive oil. Form loose patties ¾–1 inch thick with a shallow dimple. Chill while the grill heats.' },
    { title: 'Sear hard, then move only if needed', cue: '450–500°F ambient', body: 'Follow the grill manufacturer’s lighting sequence and oil clean grates. Cook over direct heat 3–5 minutes, flip once, and cook the second side. Move to the cooler zone if flare-ups build or the crust races ahead of the center.' },
    { title: 'Add cheese and char the onions', cue: 'Final 2 minutes', body: 'Top with smoked cheddar for the final 1–2 minutes and close the lid. Grill thick onion rounds beside the burgers until marked and tender. Toast buns cut-side down for the final minute.' },
    { title: 'Verify, rest, and sauce', cue: '160°F · 3 minute rest', body: 'Probe sideways through the center of every patty. Ground beef and bison must reach the 160°F safe minimum before serving. Rest 3 minutes, then stack with charred onion, pickles, and steakhouse sauce.' },
  ],
} as const;
