import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        nosotros: 'nosotros.html',
        impactoAtrato: 'impacto-atrato.html',
        impactoMojana: 'impacto-mojana.html',
      },
    },
  },
})
