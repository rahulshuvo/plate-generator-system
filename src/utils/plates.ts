export function exportPNGHelper(canvasEl: HTMLCanvasElement | null): void {
  if (!canvasEl) return;
  const url = canvasEl.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `plates_${Date.now()}.png`;
  a.click();
}