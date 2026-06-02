import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        nosotros: 'nosotros.html',
        impactoAtrato: 'impacto-atrato.html',
        impactoMojana: 'impacto-mojana.html',
        alianzaCafe: 'alianza-cafe.html',
        alianzaGuajira: 'alianza-guajira.html',
      },
    },
  },
})
