// Reads the --dither colour token as RGB, so canvas effects follow the light/dark theme.
let probe: CanvasRenderingContext2D | null = null;

export function ditherRGB(): [number, number, number] {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--dither").trim() || "#2f5bff";
  probe ??= document.createElement("canvas").getContext("2d");
  if (!probe) return [47, 91, 255];
  probe.fillStyle = value;
  const hex = String(probe.fillStyle);
  if (hex.startsWith("#") && hex.length === 7) {
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  }
  const m = hex.match(/\d+(\.\d+)?/g)?.map(Number) ?? [47, 91, 255];
  return [m[0], m[1], m[2]];
}
