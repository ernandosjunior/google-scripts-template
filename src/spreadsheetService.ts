/**
 * spreadsheetService.ts
 *
 * Lida com lógica de acesso e manipulação de dados
 * em planilhas do Google Sheets.
 */

export function sumRangeValues(rangeValues: any[][]): number {
  // Soma todos os valores numéricos de uma matriz 2D
  let total = 0;
  for (const row of rangeValues) {
    for (const cell of row) {
      if (typeof cell === 'number') {
        total += cell;
      }
    }
  }
  return total;
}
