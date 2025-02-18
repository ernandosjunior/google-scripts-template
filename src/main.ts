/**
 * main.ts
 *
 * Funções expostas ao Google Apps Script.
 */

import { sumRangeValues } from './spreadsheetService';

/**
 * Exemplo de função principal que:
 *  - Obtém valores de um intervalo (A1:D5) em uma Planilha ativa.
 *  - Soma todos os valores numéricos.
 *  - Retorna o resultado.
 */
function sumValuesInRange(rangeNotation: string = 'A1:D5'): number {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    const range = sheet.getRange(rangeNotation);
    const values = range.getValues();

    if (!values || !Array.isArray(values) || !Array.isArray(values[0])) {
      throw new Error(`Intervalo inválido: ${rangeNotation}`);
    }

    const result = sumRangeValues(values);
    Logger.log(`Soma dos valores (${rangeNotation}): ${result}`);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.log(
      `Erro ao somar valores no intervalo ${rangeNotation}: ${errorMessage}`
    );
    return 0; // Ou retorne um erro, se preferir.
  }
}

/**
 * Exponha a função globalmente para que o Apps Script possa executá-la.
 */

(globalThis as any).sumValuesInRange = sumValuesInRange;
