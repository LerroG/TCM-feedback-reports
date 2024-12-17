/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			sans: ['PT Sans', 'sans-serif']
		},
		extend: {
			animation: {
				spin: 'spin 1s linear infinite'
			}
		}
	},
	plugins: []
}
