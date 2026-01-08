import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDebug = mode === 'debug';

  return {
    plugins: [cssInjectedByJsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@types': path.resolve(__dirname, './src/types'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@i18n': path.resolve(__dirname, './src/i18n'),
        '@config': path.resolve(__dirname, './src/config'),
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/main.ts'),
        name: 'AnymalWidget',
        fileName: 'widget',
        formats: ['es'],
      },
      outDir: 'dist',
      sourcemap: isDebug, // Source map apenas em modo debug
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: !isDebug, // Remove console.log em produção
        },
      },
    },
  };
});
