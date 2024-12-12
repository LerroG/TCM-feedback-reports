import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
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
