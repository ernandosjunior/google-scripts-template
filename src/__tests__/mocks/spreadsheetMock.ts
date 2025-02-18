/**
 * Mock simplificado de SpreadsheetApp, planilha e range
 */

export const mockValues = [
  [1, 2, 3],
  [4, 'texto', 6],
  [7, 8, 9],
];

export const RangeMock = {
  getValues: jest.fn(() => mockValues),
};

export const SheetMock = {
  getRange: jest.fn(() => RangeMock),
};

export const SpreadsheetAppMock = {
  getActiveSpreadsheet: jest.fn(() => ({
    getActiveSheet: jest.fn(() => SheetMock),
  })),
};
