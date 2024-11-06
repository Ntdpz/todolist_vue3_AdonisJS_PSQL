import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from 'tailwindcss'; // ใช้ import แทน require
import autoprefixer from 'autoprefixer'; // ใช้ import แทน require

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss, // ใช้ tailwindcss ที่นำเข้า
        autoprefixer, // ใช้ autoprefixer ที่นำเข้า
      ],
    },
  },
});
