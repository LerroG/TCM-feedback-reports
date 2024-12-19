<script setup lang="ts">
import { NDataTable, NDatePicker, NSelect, NButton, NInput } from 'naive-ui'
import type { DataTableColumns, DataTableInst } from 'naive-ui'
import { useFeedbackStore } from '@/stores/feedbackStore'
import { computed, onMounted, ref, watch } from 'vue'
import { formatTimestamp } from '@/utils/format-timestamp'
import Spinner from '@/components/Spinner.vue'
import FeedbacksChart from '@/components/FeedbacksChart.vue'
import { useRoute, useRouter } from 'vue-router'
import { IFeedbackItem } from '@/types/feedback.interface'
import { useI18n } from 'vue-i18n'
import { loadLocaleMessages } from '@/lib/i18n'
import { exportToExcel } from '@/utils/export-to-excel'

type Language = 'ru' | 'en' | 'uz'
// type Row = {
// 	Answer: string
// 	Percent: string
// 	Count: number
// 	rowSpan: number
// 	Question?: string
// }

const languageMap: Record<Language, string> = {
	ru: 'Русский',
	en: 'English',
	uz: "O'zbek"
}

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const tableFeedbacks = ref<any>()
const searchQuery = ref('')
const dateRange = ref<[number, number]>()
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

const feedbackStore = useFeedbackStore()

const columnsFeedbacks = computed<DataTableColumns<IFeedbackItem>>(() => [
	{
		title: t('Question'),
		key: 'Question',
		className: 'lg:w-96',
		sorter: 'default'
	},
	{
		title: t('Answer'),
		key: 'Answer',
		align: 'center',
		sorter: 'default'
	},
	{
		title: t('Device name'),
		key: 'DeviceName',
		align: 'center',
		sorter: 'default'
	},
	{
		title: t('Language'),
		key: 'Lang',
		align: 'center',
		defaultFilterOptionValues: ['ru', 'uz', 'en'],
		filterOptions: [
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
		],
		filter(value, row) {
			return value === row.Lang
		},
		render(row) {
			return languageMap[row.Lang as keyof typeof languageMap] || row.Lang
		}
	},
	{
		title: t('Date'),
		key: 'Date',
		align: 'center',
		sorter: 'default'
	},
	{
		title: t('Time'),
		key: 'Time',
		align: 'center'
	}
])

const columns = computed<DataTableColumns<typeof tableData>>(() => [
	{
		title: t('Question'),
		key: 'Question',
		rowSpan: (_, rowIndex) => {
			return tableData.value[rowIndex].rowSpan
		}
	},
	{
		title: t('Answer'),
		key: 'Answer',
		width: 200,
		titleAlign: 'center',
		align: 'center'
	},
	{
		title: t('Percent'),
		key: 'Percent',
		width: 130,
		titleAlign: 'center',
		align: 'center'
	},
	{
		title: t('Quantity'),
		key: 'Count',
		width: 130,
		titleAlign: 'center',
		align: 'center'
	}
])

const tableData = computed(() => {
	const data = feedbackStore.feedbackStat?.Data.flatMap(item => {
		const totalCount = item.AnswerData.reduce(
			(sum, item) => sum + item.Count,
			0
		)
		return item.AnswerData.map((answer, index) => ({
			Question: index === 0 ? item.Question : '',
			Answer: answer.Answer,
			Percent: answer.Count ? (totalCount / answer.Count) * 100 + '%' : 0 + '%',
			Count: answer.Count,
			rowSpan: index === 0 ? item.AnswerData.length : 1
		}))
	})

	return data || []
})

// const tableData = computed(() => {
// 	const data = feedbackStore.feedbackStat?.Data.flatMap(item => {
// 		const totalCount = item.AnswerData.reduce(
// 			(sum, answer) => sum + answer.Count,
// 			0
// 		)
// 		return item.AnswerData.map((answer, index) => {
// 			const row: Row = {
// 				Answer: answer.Answer,
// 				Percent: answer.Count ? (totalCount / answer.Count) * 100 + '%' : '0%',
// 				Count: answer.Count,
// 				rowSpan: index === 0 ? item.AnswerData.length : 1
// 			}

// 			// Добавляем поле Question только для первой строки (index === 0)
// 			if (index === 0) {
// 				row.Question = item.Question
// 			}

// 			return row
// 		})
// 	})

// 	return data || []
// })

const filteredData = computed(() => {
	if (!searchQuery.value) {
		return feedbackStore.feedbacks?.Data
	}

	return feedbackStore.feedbacks?.Data.filter(item => {
		return (
			item.Question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			item.Answer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			item.DeviceName.toLowerCase().includes(searchQuery.value.toLowerCase())
		)
	})
})

const handleExportFeedbackStat = () => {
	const question = t('Question')
	const answer = t('Answer')
	const percent = t('Percent')
	const count = t('Quantity')

	const tableFeedbackStat = tableData.value.map(item => {
		return {
			[question]: item.Question,
			[answer]: item.Answer,
			[percent]: item.Percent,
			[count]: item.Count
		}
	})

	exportToExcel(
		tableFeedbackStat,
		`Статистика отзывов ${formatTimestamp(
			dateRange.value?.[0]!
		)} - ${formatTimestamp(dateRange.value?.[1]!)}`
	)
}

const handleExportFeedbacks = () => {
	const question = t('Question')
	const answer = t('Answer')
	const deviceName = t('Device name')
	const language = t('Language')
	const date = t('Date')
	const time = t('Time')

	const tableFeedbacksEx = tableFeedbacks.value?.data.map((item: any) => {
		return {
			[question]: item.Question,
			[answer]: item.Answer,
			[deviceName]: item.DeviceName,
			[language]: languageMap[item.Lang as keyof typeof languageMap],
			[date]: item.Date,
			[time]: item.Time
		}
	})

	exportToExcel(
		tableFeedbacksEx,
		`Статистика отзывов ${formatTimestamp(
			dateRange.value?.[0]!
		)} - ${formatTimestamp(dateRange.value?.[1]!)}`
	)
}

const changeLanguage = async (lang: string) => {
	if (locale.value !== lang) {
		await loadLocaleMessages(lang)
		localStorage.setItem('lang', lang)
		locale.value = lang
	}
}

onMounted(() => {
	if (route.query.startDate && route.query.endDate) {
		const startDate = new Date(route.query.startDate as string).getTime()
		const endDate = new Date(route.query.endDate as string).getTime()
		dateRange.value = [startDate, endDate]
	}

	if (route.query.lang) selectLang.value = route.query.lang as string
})

watch([dateRange, selectLang], () => {
	const currentQuery = { ...route.query }

	currentQuery.lang = selectLang.value

	if (dateRange.value?.[0] && dateRange.value?.[1]) {
		const startDate = formatTimestamp(dateRange.value?.[0])
		const endDate = formatTimestamp(dateRange.value?.[1])

		currentQuery.startDate = startDate
		currentQuery.endDate = endDate

		Promise.all([
			feedbackStore.getFeedbacks(startDate, endDate, selectLang.value),
			feedbackStore.getFeedbackStat(startDate, endDate, selectLang.value)
		])
	} else {
		delete currentQuery.startDate
		delete currentQuery.endDate
	}

	router.replace({ query: currentQuery })
})
</script>

<template>
	<div>
		<div class="w-full flex items-center justify-between p-4 bg-white">
			<div class="2xl:w-1/4">
				<div class="text-base mb-1">{{ $t('Choose the period') }}</div>
				<n-date-picker
					v-model:value="dateRange"
					type="daterange"
					:first-day-of-week="0"
					format="dd.MM.yyyy"
					:is-date-disabled="(curr: number) => curr > Date.now()"
					start-placeholder="От"
					end-placeholder="До"
					clearable
				/>
			</div>
			<div class="min-w-32">
				<div class="text-base mb-1">{{ $t('Select the language') }}</div>
				<n-select
					v-model:value="selectLang"
					@update:value="changeLanguage(selectLang)"
					:options="language"
				/>
			</div>
		</div>
		<Transition mode="out-in">
			<div v-if="!dateRange?.[0] || !dateRange?.[1]">
				<h1 class="mt-6 text-center text-3xl font-bold">
					{{ $t('Select the date to display reviews') }}
				</h1>
			</div>

			<!-- Loading -->
			<div
				class="flex justify-center mt-20"
				v-else-if="
					feedbackStore.loadingFeedbacks || feedbackStore.loadingFeedbackStat
				"
			>
				<Spinner />
			</div>
			<!-- Loading -->

			<div
				v-else-if="
					feedbackStore.feedbacks?.Code === 0 &&
					feedbackStore.feedbackStat?.Code === 0
				"
			>
				<div
					class="w-full flex flex-col-reverse 2xl:flex-row justify-center gap-2"
				>
					<div class="w-full 2xl:w-1/2 my-6">
						<h1 class="text-center text-2xl font-bold mb-4">
							{{ $t('Feedback statistics') }}
						</h1>
						<div class="mb-2 flex justify-end">
							<n-button @click="handleExportFeedbackStat">{{
								$t('Export')
							}}</n-button>
						</div>
						<n-data-table
							:columns="columns"
							:data="tableData"
							:max-height="460"
							:single-line="false"
							:bordered="false"
						/>
					</div>
					<div class="w-full 2xl:w-1/2 my-6">
						<h1 class="text-center text-2xl font-bold mb-4">
							{{ $t('Feedback schedule') }}
						</h1>
						<div class="bg-white w-full h-[550px] p-4">
							<FeedbacksChart />
						</div>
					</div>
				</div>
				<div class="w-full flex justify-center gap-2 my-6">
					<div class="w-full 2xl:w-4/5">
						<h1 class="text-center text-2xl font-bold mb-4">
							{{ $t('All reviews') }}
						</h1>
						<div class="w-full flex justify-between mb-2">
							<div class="w-1/3 lg:w-1/4">
								<n-input v-model:value="searchQuery" placeholder="Поиск" />
							</div>
							<n-button @click="handleExportFeedbacks">{{
								$t('Export')
							}}</n-button>
						</div>

						<n-data-table
							ref="tableFeedbacks"
							:columns="columnsFeedbacks"
							:data="filteredData"
							:max-height="500"
							:single-line="false"
							:bordered="false"
							virtual-scroll
						/>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	@apply transition-opacity duration-300 ease-in;
}

.v-enter-from,
.v-leave-to {
	@apply opacity-0;
}
</style>
