/** Shared presentation helpers; independent of recipe data and configuration. */
export function numberLabel(value: number) {
  return Number(value.toFixed(2)).toString();
}

export function amountLabel(value: number) {
  const eighths = Math.round(value * 8);
  if (value >= 0.125 && Math.abs(value - eighths / 8) < 0.001) {
    const whole = Math.floor(eighths / 8);
    const fraction = ["", "⅛", "¼", "⅜", "½", "⅝", "¾", "⅞"][eighths % 8];
    return (
      (whole ? String(whole) : "") + (whole && fraction ? " " : "") + fraction
    );
  }
  return Number(value.toFixed(3)).toString();
}
