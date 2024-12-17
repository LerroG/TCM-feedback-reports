<script setup lang="ts">
import { loadLocaleMessages } from '@/lib/i18n'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSelect } from 'naive-ui'

const { locale } = useI18n()

const selectLang = ref(localStorage.getItem('lang') || 'ru')
const language = [
	{
		label: 'Русский',
		value: 'ru'
	},
	{
		label: "O'zbek",
		value: 'uz'
	},
	{
		label: 'English',
		value: 'en'
	}
]

const changeLanguage = async (lang: string) => {
	if (locale.value !== lang) {
		await loadLocaleMessages(lang)
		localStorage.setItem('lang', lang)
		locale.value = lang
	}
}
</script>

<template>
	<main class="w-screen h-screen">
		<n-select
			class="absolute top-4 right-4 w-32"
			v-model:value="selectLang"
			@update:value="changeLanguage(selectLang)"
			:options="language"
		/>
		<slot />
	</main>
</template>
