/**
 * Testes de unidade para main.ts
 */
import { sumRangeValues } from '../spreadsheetService';
import { SpreadsheetAppMock, mockValues } from './mocks/spreadsheetMock';

describe('Funções de soma', () => {
  it('Deve somar todos os valores numéricos de uma matriz 2D', () => {
    const result = sumRangeValues(mockValues);
    // 1+2+3 + 4+6 + 7+8+9 = 40
    expect(result).toBe(40);
  });
});

describe('Mock do SpreadsheetApp', () => {
  beforeAll(() => {
    // @ts-ignore
    global.SpreadsheetApp = SpreadsheetAppMock;
  });

  it('Deve chamar getRange e getValues corretamente', () => {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    sheet.getRange('A1:D5').getValues();

    expect(sheet.getRange).toHaveBeenCalledWith('A1:D5');
    expect(sheet.getRange('A1:D5').getValues).toHaveBeenCalled();
  });
});
