/**
 * Caso de uso: estimación de tiempo de lectura.
 * Puro, testeable, agnóstico de UI.
 * Convención: 200 palabras/minuto (ES), mínimo 1 min.
 */

export function estimateReadingTime(markdownBody: string): number {
  const normalized: string = markdownBody
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_\-~|]/g, ' ');

  const words: string[] = normalized.split(/\s+/).filter((w: string) => w.length > 0);
  return Math.max(1, Math.ceil(words.length / 200));
}
