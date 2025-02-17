// src/spreadsheet.ts

export interface SpreadsheetData {
  id: string;
  sheets: {
    [sheetName: string]: any[][];
  };
}

// Função para abrir uma planilha pelo ID
export function getSpreadsheetById(
  id: string
): GoogleAppsScript.Spreadsheet.Spreadsheet {
  return SpreadsheetApp.openById(id);
}

// Função para obter uma aba pelo nome
export function getSheetByName(
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  sheetName: string
): GoogleAppsScript.Spreadsheet.Sheet | null {
  return spreadsheet.getSheetByName(sheetName);
}

// Função para buscar valores de um intervalo
export function getValuesFromRange(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  range: string
): any[][] {
  return sheet.getRange(range).getValues();
}

// Função para salvar valores em um intervalo
export function setValuesInRange(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  range: string,
  values: any[][]
): void {
  sheet.getRange(range).setValues(values);
}
