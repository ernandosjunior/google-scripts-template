// src/Code.ts

import {
  getSheetByName,
  getSpreadsheetById,
  getValuesFromRange,
  setValuesInRange,
} from './spreadsheet';

export function processData(
  spreadsheetId: string,
  sheetName: string,
  range: string
): any[][] {
  const ss = getSpreadsheetById(spreadsheetId);
  const sheet = getSheetByName(ss, sheetName);
  if (!sheet) throw new Error(`Sheet ${sheetName} not found`);

  const data = getValuesFromRange(sheet, range);

  // Exemplo de processamento (aqui você pode implementar sua lógica)
  const processedData = data.map((row) => row.map((cell) => cell));

  // Exemplo de salvamento dos dados processados
  setValuesInRange(sheet, range, processedData);

  return processedData;
}
