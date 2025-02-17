// test/spreadsheet.test.ts

import * as fs from 'fs';
import * as path from 'path';
import { processData } from '../src/code';
import * as spreadsheetModule from '../src/spreadsheet';

// Carrega o mock da planilha a partir do JSON
const mockDataPath = path.join(__dirname, '../mocks/spreadsheet.mock.json');
const mockSpreadsheet: spreadsheetModule.SpreadsheetData = JSON.parse(
  fs.readFileSync(mockDataPath, 'utf8')
);

describe('processData', () => {
  let spreadsheetAppMock: any;
  let sheetMock: any;

  beforeAll(() => {
    // Cria um mock para a aba
    sheetMock = {
      getRange: jest.fn().mockReturnValue({
        getValues: jest.fn().mockReturnValue(mockSpreadsheet.sheets['Sheet1']),
        setValues: jest.fn(),
      }),
    };

    // Cria o mock do SpreadsheetApp
    spreadsheetAppMock = {
      openById: jest.fn().mockReturnValue({
        getSheetByName: jest.fn().mockImplementation((name: string) => {
          return mockSpreadsheet.sheets[name] ? sheetMock : null;
        }),
      }),
    };

    // Injeta o mock no ambiente global
    (global as any).SpreadsheetApp = spreadsheetAppMock;
  });

  it('should process data correctly', () => {
    const spreadsheetId = mockSpreadsheet.id;
    const sheetName = 'Sheet1';
    const range = 'A1:B2';

    const result = processData(spreadsheetId, sheetName, range);

    expect(result).toEqual(mockSpreadsheet.sheets[sheetName]);
    expect(spreadsheetAppMock.openById).toHaveBeenCalledWith(spreadsheetId);
    expect(spreadsheetAppMock.openById().getSheetByName).toHaveBeenCalledWith(
      sheetName
    );
    expect(sheetMock.getRange).toHaveBeenCalledWith(range);
  });

  it('should throw error if sheet not found', () => {
    const spreadsheetId = mockSpreadsheet.id;
    const sheetName = 'NonExistentSheet';
    const range = 'A1:B2';

    expect(() => processData(spreadsheetId, sheetName, range)).toThrow(
      `Sheet ${sheetName} not found`
    );
  });
});
