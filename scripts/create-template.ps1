# scripts/create-template.ps1
Param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

# Cria a pasta do projeto e as subpastas necessárias
New-Item -ItemType Directory -Force -Path $ProjectName
Set-Location $ProjectName
New-Item -ItemType Directory -Force -Path "src"
New-Item -ItemType Directory -Force -Path "test"
New-Item -ItemType Directory -Force -Path "mocks"
New-Item -ItemType Directory -Force -Path "scripts"

# Cria o arquivo package.json
@"
{
  "name": "google-scripts-Template",
  "version": "1.0.0",
  "description": "Template para desenvolvimento de Google Scripts com Clasp, TypeScript e Jest",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "predeploy": "npm run build",
    "deploy": "clasp push"
  },
  "devDependencies": {
    "@types/google-apps-script": "^1.0.96",
    "@types/jest": "^29.5.14",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.5",
    "typescript": "^5.7.3"
  },
  "dependencies": {
    "dotenv": "^16.4.7",
    "googleapis": "^144.0.0",
    "minimist": "^1.2.8"
  }
}
"@ | Set-Content -Path "package.json"

# Cria o arquivo tsconfig.json
@"
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "lib": ["ES2017"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "test", "scripts"]
}
"@ | Set-Content -Path "tsconfig.json"

# Cria o arquivo jest.config.js
@"
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/*.test.ts']
};
"@ | Set-Content -Path "jest.config.js"

# Cria o arquivo .claspignore
@"
node_modules/
dist/
.env
*.spec.ts
"@ | Set-Content -Path ".claspignore"

# Cria o arquivo .env.example
@"
# Exemplo de variáveis de ambiente
GOOGLE_SCRIPT_ID=your_script_id_here
"@ | Set-Content -Path ".env.example"

# Cria o arquivo src/spreadsheet.ts
@"
// src/spreadsheet.ts

export interface SpreadsheetData {
  id: string;
  sheets: {
    [sheetName: string]: any[][];
  };
}

export function getSpreadsheetById(id: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
  return SpreadsheetApp.openById(id);
}

export function getSheetByName(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string): GoogleAppsScript.Spreadsheet.Sheet | null {
  return spreadsheet.getSheetByName(sheetName);
}

export function getValuesFromRange(sheet: GoogleAppsScript.Spreadsheet.Sheet, range: string): any[][] {
  return sheet.getRange(range).getValues();
}

export function setValuesInRange(sheet: GoogleAppsScript.Spreadsheet.Sheet, range: string, values: any[][]): void {
  sheet.getRange(range).setValues(values);
}
"@ | Set-Content -Path "src/spreadsheet.ts"

# Cria o arquivo src/Code.ts
@"
// src/Code.ts

import { getSpreadsheetById, getSheetByName, getValuesFromRange, setValuesInRange } from './spreadsheet';

export function processData(spreadsheetId: string, sheetName: string, range: string): any[][] {
  const ss = getSpreadsheetById(spreadsheetId);
  const sheet = getSheetByName(ss, sheetName);
  if (!sheet) throw new Error(\`Sheet \${sheetName} not found\`);
  
  const data = getValuesFromRange(sheet, range);
  const processedData = data.map(row => row.map(cell => cell));
  
  setValuesInRange(sheet, range, processedData);
  
  return processedData;
}
"@ | Set-Content -Path "src/Code.ts"

# Cria o arquivo test/spreadsheet.test.ts
@"
import { processData } from '../src/Code';
import * as spreadsheetModule from '../src/spreadsheet';
import * as fs from 'fs';
import * as path from 'path';

const mockDataPath = path.join(__dirname, '../mocks/spreadsheet.mock.json');
const mockSpreadsheet: spreadsheetModule.SpreadsheetData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

describe('processData', () => {
  let spreadsheetAppMock: any;
  let sheetMock: any;

  beforeAll(() => {
    sheetMock = {
      getRange: jest.fn().mockReturnValue({
        getValues: jest.fn().mockReturnValue(mockSpreadsheet.sheets['Sheet1']),
        setValues: jest.fn()
      })
    };

    spreadsheetAppMock = {
      openById: jest.fn().mockReturnValue({
        getSheetByName: jest.fn().mockImplementation((name) => {
          return mockSpreadsheet.sheets[name] ? sheetMock : null;
        })
      })
    };

    (global).SpreadsheetApp = spreadsheetAppMock;
  });

  it('should process data correctly', () => {
    const spreadsheetId = mockSpreadsheet.id;
    const sheetName = 'Sheet1';
    const range = 'A1:B2';
    
    const result = processData(spreadsheetId, sheetName, range);

    expect(result).toEqual(mockSpreadsheet.sheets[sheetName]);
    expect(spreadsheetAppMock.openById).toHaveBeenCalledWith(spreadsheetId);
    expect(spreadsheetAppMock.openById().getSheetByName).toHaveBeenCalledWith(sheetName);
    expect(sheetMock.getRange).toHaveBeenCalledWith(range);
  });

  it('should throw error if sheet not found', () => {
    const spreadsheetId = mockSpreadsheet.id;
    const sheetName = 'NonExistentSheet';
    const range = 'A1:B2';

    expect(() => processData(spreadsheetId, sheetName, range)).toThrow(\`Sheet \${sheetName} not found\`);
  });
});
"@ | Set-Content -Path "test/spreadsheet.test.ts"

# Cria o arquivo mocks/spreadsheet.mock.json
@"
{
  "id": "mock-spreadsheet-id",
  "sheets": {
    "Sheet1": [
      ["Header1", "Header2"],
      ["Row1Col1", "Row1Col2"],
      ["Row2Col1", "Row2Col2"]
    ],
    "Sheet2": [
      ["A", "B", "C"],
      ["1", "2", "3"]
    ]
  }
}
"@ | Set-Content -Path "mocks/spreadsheet.mock.json"

# Cria o arquivo scripts/export-data.js (para exportar dados reais da planilha via API)
@"
// scripts/export-data.js

const { google } = require('googleapis');
const fs = require('fs');

async function exportSpreadsheet({ spreadsheetId, sheets, maxRows, outputPath }) {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
  const sheetsApi = google.sheets({ version: 'v4', auth });
  
  // Obtém informações da planilha para identificar as abas disponíveis
  const res = await sheetsApi.spreadsheets.get({ spreadsheetId });
  const sheetInfo = res.data.sheets;
  
  const data = { id: spreadsheetId, sheets: {} };
  
  // Determina quais abas exportar: as informadas ou todas
  const sheetNames = sheets && sheets.length > 0 
    ? sheets 
    : sheetInfo.map(sheet => sheet.properties.title);
  
  for (const sheetName of sheetNames) {
    const range = maxRows ? \`\${sheetName}!A1:Z\${maxRows}\` : \`\${sheetName}\`;
    const resValues = await sheetsApi.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    data.sheets[sheetName] = resValues.data.values || [];
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(\`Dados exportados para \${outputPath}\`);
}

// Processa os parâmetros de linha de comando
const args = require('minimist')(process.argv.slice(2));
const spreadsheetId = args.id || process.env.GOOGLE_SCRIPT_ID;
if (!spreadsheetId) {
  console.error("Informe o id da planilha com --id ou configure GOOGLE_SCRIPT_ID no .env");
  process.exit(1);
}
const sheetsParam = args.sheets ? args.sheets.split(',') : [];
const maxRows = args.rows ? args.rows : null;
const outputPath = args.output || 'mocks/spreadsheet.mock.json';

exportSpreadsheet({ spreadsheetId, sheets: sheetsParam, maxRows, outputPath })
  .catch(err => {
    console.error('Erro ao exportar dados:', err);
    process.exit(1);
  });
"@ | Set-Content -Path "scripts/export-data.js"

Write-Host "Projeto '$ProjectName' criado com sucesso."
