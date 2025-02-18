# Google Apps Script Template (TypeScript + Rollup + Jest)

Este repositório é um template para projetos do **Google Apps Script**, utilizando **TypeScript**, **Rollup**, **CLASP** e **Jest**. Ele inclui:

- Estrutura de arquivos organizada.
- Suporte a import/export via Rollup.
- Testes unitários com mocks de `SpreadsheetApp` (Jest).
- Exemplo de soma de valores em um intervalo (A1:D5) em uma planilha Google.
- Manuseio de informações sensíveis em arquivo não-versionado.

---

## Sumário

1. [Pré-requisitos](#pré-requisitos)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Instalação e Configuração Inicial](#instalação-e-configuração-inicial)
4. [Scripts Disponíveis](#scripts-disponíveis)
5. [Como Usar](#como-usar)
   1. [Build](#build)
   2. [Testes](#testes)
   3. [Deploy](#deploy)
   4. [Exemplo de Execução](#exemplo-de-execução)
6. [Armazenando Informações Sensíveis](#armazenando-informações-sensíveis)
7. [Observações sobre Rollup e Jest](#observações-sobre-rollup-e-jest)
8. [Contribuições](#contribuições)
9. [Licença](#licença)

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [CLASP](https://github.com/google/clasp) instalado globalmente

```bash
npm install -g @google/clasp
```

---

## Estrutura de Pastas

```bash
my-gas-project
├── .clasp.json
├── .gitignore
├── package.json
├── rollup.config.js
├── tsconfig.json
├── jest.config.js
├── src
│   ├── main.ts
│   ├── spreadsheetService.ts
│   ├── config.example.ts
│   ├── config.ts         # Arquivo para dados sensíveis (NÃO versionar)
│   └── __tests__
│       ├── main.test.ts
│       └── mocks
│           └── spreadsheetMock.ts
└── README.md
```

### Descrição dos Principais Arquivos

- **`.clasp.json`**: Configurações do CLASP, gerado ao criar o projeto.
- **`.gitignore`**: Arquivos/pastas ignorados pelo Git (inclui `config.ts` e `node_modules`).
- **`rollup.config.js`**: Configurações do bundler Rollup.
- **`tsconfig.json`**: Configurações do compilador TypeScript (modo **ESNext** para compatibilidade com Rollup).
- **`jest.config.js`**: Configurações do Jest (usa `ts-jest`).
- **`package.json`**: Scripts e dependências.
- **`src/main.ts`**: Arquivo principal com funções expostas ao Apps Script.
- **`src/spreadsheetService.ts`**: Lógica de planilha (ex.: soma de intervalos).
- **`src/__tests__`**: Testes unitários (com mocks para classes do Apps Script).

---

## Instalação e Configuração Inicial

1. **Clonar este repositório ou baixar o template**:

   ```bash
   git clone https://github.com/seu-usuario/google-scripts-template.git
   cd google-scripts-template
   ```

2. **Instalar dependências**:

   ```bash
   npm install
   ```

3. **Login no CLASP** (se ainda não tiver feito):

   ```bash
   clasp login
   ```

4. **Criar um projeto no Google Apps Script** (se ainda não existir):

   ```bash
   clasp create --type standalone --rootDir dist
   ```

   Isto irá gerar o arquivo `.clasp.json` com o `scriptId` do seu novo projeto.

> **Observação**: Se quiser vincular o script diretamente a uma planilha, troque `--type standalone` para `--type sheet`.

---

## Scripts Disponíveis

No arquivo `package.json`, há uma seção de scripts que você pode executar:

- **`npm run build`**  
  Compila os arquivos TypeScript usando Rollup e gera o output em `dist/main.js`.
- **`npm run test`**  
  Executa testes unitários com Jest.
- **`npm run push`**  
  Compila o projeto e faz o deploy do código para o Google Apps Script (via `clasp push`).
- **`npm run deploy`**  
  Executa o `push` e, em seguida, o `clasp deploy`, criando uma nova versão do script no Apps Script.

---

## Como Usar

### **Build**

Compila seu código TypeScript em um bundle para o Apps Script:

```bash
npm run build
```

A saída será gerada em `dist/main.js`. O Apps Script lerá esse arquivo ao ser enviado via `clasp push`.

---

### **Testes**

Executa os testes unitários locais, usando _mocks_ para classes do Google Apps Script:

```bash
npm run test
```

- O Jest está configurado para ignorar o código fora de `src/`, exceto `__tests__`.
- Você pode ver a cobertura de testes (coverage) ou realizar debug em modo watch se preferir.

---

### **Deploy**

Envia o código para o Google Apps Script (pode criar nova versão ou apenas atualizar a existente).

```bash
npm run push
```

Caso queira criar uma versão e implantar automaticamente, use:

```bash
npm run deploy
```

Isso depende das configurações em seu arquivo `.clasp.json`.

---

### **Exemplo de Execução**

Após o deploy (ou push), abra seu [script no Google Apps Script](https://script.google.com/) e execute a função de teste:

```ts
function testSumValues() {
  const result = sumValuesInRange('A1:D5');
  Logger.log(`Resultado da soma: ${result}`);
}
```

Abra o **Registro** (Logs) para ver o resultado da soma.

---

## Armazenando Informações Sensíveis

1. No arquivo `config.example.ts`, há um exemplo de como manter dados sensíveis (chaves de API, tokens etc.).
2. Crie um `config.ts` real, **não versionado** (adicione ao `.gitignore`), e inclua nele suas credenciais:
   ```ts
   export const SENSITIVE_DATA = {
     API_KEY: "sua_chave_aqui",
     ...
   };
   ```
3. Importe esse arquivo somente onde for necessário; dessa forma, suas credenciais não ficarão públicas no repositório.

---

## Observações sobre Rollup e Jest

- O **Rollup** precisa que o `tsconfig.json` use `module: "ESNext"` (ou `"ES2015"`, `"ES2020"`, `"ES2022"`) para conseguir bundlar corretamente.
- O **Jest** precisa que **TypeScript** use `module: "CommonJS"` **ou** que utilizemos um arquivo de configuração separado (`tsconfig.jest.json`) com `module = "CommonJS"`. Isso já está configurado via **`ts-jest`** em `jest.config.js` (ver `transform` e `tsconfig`).

---

## Contribuições

1. **Fork** este repositório.
2. Crie um **branch** para sua feature ou correção de bug.
3. Faça **commit** das suas alterações com mensagens claras.
4. Crie um **Pull Request** detalhando suas mudanças.

---

## Licença

Este projeto está sob a licença [MIT](LICENSE). Sinta-se à vontade para usar, modificar e distribuir conforme desejar.
