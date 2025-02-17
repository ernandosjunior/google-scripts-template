// scripts/export-data.js

const { google } = require('googleapis');
const fs = require('fs');
const minimist = require('minimist');

async function exportSpreadsheet({
  spreadsheetId,
  sheets,
  maxRows,
  outputPath,
}) {
  // Autentica usando as credenciais padrão configuradas (verifique as variáveis de ambiente ou seu arquivo de credenciais)
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheetsApi = google.sheets({ version: 'v4', auth });

  // Obtém informações da planilha para identificar as abas disponíveis
  const spreadsheet = await sheetsApi.spreadsheets.get({
    spreadsheetId,
  });

  const availableSheets = spreadsheet.data.sheets.map(
    (sheet) => sheet.properties.title
  );

  // Se for informado o parâmetro 'sheets', utiliza apenas as abas especificadas; caso contrário, exporta todas.
  let sheetNames;
  if (sheets && sheets.length > 0) {
    sheetNames = sheets.filter((name) => availableSheets.includes(name));
    if (sheetNames.length === 0) {
      console.warn(
        'Nenhuma aba correspondente encontrada. Exportando todas as abas.'
      );
      sheetNames = availableSheets;
    }
  } else {
    sheetNames = availableSheets;
  }

  // Objeto que armazenará os dados exportados
  const data = {
    id: spreadsheetId,
    sheets: {},
  };

  // Para cada aba, obtém os valores. Se maxRows for informado, limita o range (exemplo: A1 até Z{maxRows})
  for (const sheetName of sheetNames) {
    let range = sheetName;
    if (maxRows) {
      range = `${sheetName}!A1:Z${maxRows}`;
    }

    const resValues = await sheetsApi.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    data.sheets[sheetName] = resValues.data.values || [];
  }

  // Escreve os dados exportados em um arquivo JSON
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Dados exportados para ${outputPath}`);
}

// Processa os parâmetros da linha de comando
const args = minimist(process.argv.slice(2));
const spreadsheetId = args.id || process.env.GOOGLE_SCRIPT_ID;
if (!spreadsheetId) {
  console.error(
    'Erro: informe o id da planilha com --id ou configure a variável de ambiente GOOGLE_SCRIPT_ID.'
  );
  process.exit(1);
}
const sheetsParam = args.sheets
  ? args.sheets.split(',').map((s) => s.trim())
  : [];
const maxRows = args.rows ? parseInt(args.rows, 10) : null;
const outputPath = args.output || 'spreadsheet.mock.json';

exportSpreadsheet({
  spreadsheetId,
  sheets: sheetsParam,
  maxRows,
  outputPath,
}).catch((err) => {
  console.error('Erro ao exportar os dados:', err);
  process.exit(1);
});
