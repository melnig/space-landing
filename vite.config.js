import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';
import { createHtmlPlugin } from 'vite-plugin-html'; // Правильний імпорт

export default defineConfig({
  base: '/<space-landing>/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    },
    postcss: {
      plugins: [require('autoprefixer')]
    }
  },
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.8] },
      svgo: { plugins: [{ name: 'removeViewBox', active: false }] }
    }),
    createHtmlPlugin({
      minify: true // Увімкнення мініфікації HTML
    })
  ]
});