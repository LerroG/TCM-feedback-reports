import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
	base: '/reports', // Путь для деплоя, если нужно
	build: {
		outDir: 'dist',
		assetsDir: 'assets'
	},
	css: {
		postcss: {
			plugins: [tailwindcss(), autoprefixer()] // Автопрефиксы для CSS
		}
	},
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src') // Упрощаем пути к модулям
		}
	}
})
