import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/main.ts',
  output: {
    file: './dist/main.js', // ou 'dist/Code.js' se preferir
    format: 'cjs', // O Google Apps Script aceita formato IIFE ou CJS
    intro: 'var global = this;', // Ajuste necessário em alguns cenários
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser({
      mangle: {
        reserved: ['minhaFuncaoImportante', 'outraFuncaoCritica'], // Funções que NÃO serão renomeadas
      },
    }),
  ],
};
