import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import * as glob from 'glob';
import path from 'path';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

const isDev = process.env.NODE_ENV === 'development';

const htmlDirs = fs
  .readdirSync('./src/html')
  .filter(dir => fs.statSync(`./src/html/${dir}`).isDirectory());

function watchExtraFiles() {
  return {
    name: 'watch-extra-files',
    buildStart() {
      const filesToWatch = glob.sync('src/html/**/*.{html,css,js}');
      filesToWatch.forEach(filePath => {
        const absolutePath = path.resolve(filePath);
        this.addWatchFile(absolutePath);
        console.log(`📌 Adicionando ao watch: ${absolutePath}`);
      });
    }
  };
}

// Plugin para embutir CSS e JS dentro dos arquivos HTML
function embedHtmlAssets() {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    name: 'embed-html-assets',
    generateBundle() {
      htmlDirs.forEach(dir => {
        const htmlPath = `./src/html/${dir}/index.html`;
        const cssPath = `./src/html/${dir}/style.css`;
        const jsPath = `./src/html/${dir}/script.js`;

        if (fs.existsSync(htmlPath)) {
          let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

          if (fs.existsSync(cssPath)) {
            const cssContent = fs.readFileSync(cssPath, 'utf-8');
            htmlContent = htmlContent.replace(
              '</head>',
              `<style>${cssContent}</style></head>`
            );
          }

          if (fs.existsSync(jsPath)) {
            const jsContent = fs.readFileSync(jsPath, 'utf-8');

            // 🔥 Adiciona script LiveReload apenas no modo desenvolvimento
            const livereloadScript = isDev
              ? `<script src="http://localhost:35729/livereload.js?snipver=1"></script>`
              : '';

            htmlContent = htmlContent.replace(
              '</body>',
              `<script>${jsContent}</script>${livereloadScript}</body>`
            );
          }

          // Emitindo o HTML final corretamente na pasta dist
          this.emitFile({
            type: 'asset',
            fileName: `html/${dir}/index.html`,
            source: htmlContent
          });
        }
      });
    }
  };
}

function removeLiveReloadFromIndexJS() {
  return {
    name: 'remove-livereload-from-indexjs',
    generateBundle(_, bundle) {
      Object.keys(bundle).forEach(fileName => {
        if (fileName.includes('index.js')) {
          let code = bundle[fileName].code;
          if (code.includes('livereload.js')) {
            console.log(`🛑 Removendo LiveReload do ${fileName}`);

            // Remove o LiveReload e também as linhas extras vazias que ficam no lugar
            code = code.replace(
              /\(function\(l, r\) \{ if \(!l \|\| l.getElementById\('livereloadscript'\)\) return;[^]*?\}\)\(self.document\);\n*/g,
              ''
            );

            // Remove múltiplas linhas vazias que possam ter sobrado
            code = code.replace(/\n{2,}/g, '\n');

            bundle[fileName].code = code;
          }
        }
      });
    }
  };
}

export default {
  input: { index: './src/index.ts' },
  output: {
    dir: './dist',
    format: 'cjs'
  },
  watch: {
    clearScreen: false // Mantém o log limpo
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss({
      inject: false,
      minimize: true
    }),
    watchExtraFiles(),
    // Injeção de CSS/JS nos HTML
    embedHtmlAssets(),
    // Servidor local
    isDev && removeLiveReloadFromIndexJS(),

    isDev &&
      serve({
        open: true,
        contentBase: 'dist',
        openPage: '/html/form/index.html',
        port: 4500
      }),

    // LiveReload observando o dist
    isDev &&
      livereload({
        watch: 'dist/html',
        delay: 400
      })
  ].filter(Boolean)
};
