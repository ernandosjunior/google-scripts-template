markdown

# Google Apps Script Template com Clasp, TypeScript e Jest

Este projeto é um template para desenvolver scripts do Google Apps (Google Apps Script) localmente utilizando:

- **Clasp**: Ferramenta de linha de comando para desenvolver e publicar Google Apps Scripts.
- **TypeScript**: Linguagem para desenvolvimento com tipagem estática.
- **Jest**: Framework para testes unitários.
- **PowerShell**: Scripts para criação de template e exportação de dados de planilhas.

O template também inclui um script para exportar dados de uma planilha do Google Sheets para um arquivo JSON, que pode ser utilizado para mocks nos testes.

---

## Estrutura do Projeto

```

my-google-app/
├── src/
│ ├── Code.ts # Código principal do Apps Script
│ └── spreadsheet.ts # Funções de manipulação da planilha
├── test/
│ └── spreadsheet.test.ts # Testes unitários com Jest
├── mocks/
│ └── spreadsheet.mock.json # Mock dos dados da planilha em JSON
├── scripts/
│ ├── create-template.ps1 # Script PowerShell para gerar um novo template
│ └── export-data.js # Script Node para exportar dados da planilha para JSON
├── .claspignore # Arquivo para ignorar arquivos/pastas no deploy com Clasp
├── .env.example # Exemplo de arquivo de variáveis de ambiente
├── jest.config.js # Configuração do Jest
├── package.json # Configurações do npm e scripts de build/deploy
└── tsconfig.json # Configurações do TypeScript

```

---

## Pré-requisitos

- **Node.js** e **npm** instalados.
- **Clasp** instalado globalmente:
  ```bash
  npm install -g @google/clasp
  ```

````

- Conta Google com permissões para acessar Google Apps Script e Google Sheets.
- **PowerShell** para executar os scripts `.ps1` (no Windows ou em ambientes compatíveis).
- Configuração de autenticação para as APIs do Google (p.ex.: Application Default Credentials).

---

## Instalação

1. **Gerar o template (opcional):**

   Utilize o script PowerShell para criar a estrutura do projeto:

   ```powershell
   .\scripts\create-template.ps1 -ProjectName "my-google-app"
   ```

   _Obs.: Esse script criará uma nova pasta com toda a estrutura do template._

2. **Instale as dependências:**

   Navegue até a pasta do projeto e execute:

   ```bash
   cd my-google-app
   npm install
   ```

3. **Configuração de Variáveis de Ambiente:**

   Crie um arquivo `.env` a partir do arquivo `.env.example` e configure a variável `GOOGLE_SCRIPT_ID`:

   ```env
   GOOGLE_SCRIPT_ID=seu_script_id_aqui
   ```

---

## Desenvolvimento

### Build e Testes

- **Build:**
  Compila os arquivos TypeScript para JavaScript (os arquivos compilados são gerados na pasta `dist/`, que é ignorada no deploy).

  ```bash
  npm run build
  ```

- **Testes:**
  Executa os testes unitários utilizando o Jest.
  ```bash
  npm test
  ```

### Deploy com Clasp

O deploy envia apenas os arquivos de origem (pasta `src/`), conforme configurado no arquivo `.claspignore`.

```bash
npm run deploy
```

---

## Exportação de Dados do Google Sheets para JSON

Este projeto inclui um script para exportar os dados de uma planilha do Google Sheets para um arquivo JSON, que pode ser usado como mock nos testes.

### Utilizando o Script Node

Execute o script `export-data.js` via Node.js:

```bash
node scripts/export-data.js --id "SEU_SPREADSHEET_ID" --sheets "Sheet1,Sheet2" --rows 50 --output "mocks/spreadsheet.mock.json"
```

- **--id**: ID da planilha.
- **--sheets**: Lista de abas separadas por vírgula. Se omitido, exporta todas as abas.
- **--rows**: Número máximo de linhas a serem exportadas (limita o range para `A1:Z{rows}`). Se omitido, exporta todas as linhas.
- **--output**: Caminho do arquivo JSON de saída.

### Utilizando o Script PowerShell

Alternativamente, use o script PowerShell `export-data.ps1`:

```powershell
.\scripts\export-data.ps1 -SpreadsheetId "SEU_SPREADSHEET_ID" -Sheets "Sheet1,Sheet2" -Rows 50 -Output "mocks/spreadsheet.mock.json"
```

---

## Testes Locais

Os testes unitários (localizados em `test/spreadsheet.test.ts`) utilizam mocks para simular as funções do Google Apps Script (como `SpreadsheetApp`), permitindo a execução dos testes localmente sem acesso à API real.

---

## Contribuições

Contribuições são bem-vindas! Se você deseja contribuir, por favor, abra issues ou envie pull requests com sugestões e melhorias.

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## Contato

Para dúvidas ou sugestões, entre em contato através do [seu-email@exemplo.com](mailto:seu-email@exemplo.com).

```

---

Este README oferece uma visão geral do projeto, incluindo instruções para instalação, desenvolvimento, testes, deploy e exportação de dados. Ajuste as informações de contato e licença conforme necessário para o seu projeto.
```
````
