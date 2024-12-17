<script setup lang="ts">
import { NDataTable, NDatePicker, NSelect } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useFeedbackStore } from '@/stores/feedbackStore'
import { computed, onMounted, ref, watch } from 'vue'
import { formatTimestamp } from '@/utils/format-timestamp'
import Spinner from '@/components/Spinner.vue'
import FeedbacksChart from '@/components/FeedbacksChart.vue'
import { useRoute, useRouter } from 'vue-router'
import { IFeedbackItem } from '@/types/feedback.interface'

type Language = 'ru' | 'en' | 'uz'

const languageMap: Record<Language, string> = {
	ru: 'Русский',
	en: 'English',
	uz: "O'zbek"
}

const route = useRoute()
const router = useRouter()

const dateRange = ref<[number, number]>()
const selectLang = ref('ru')
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

const columnsFeedbacks: DataTableColumns<IFeedbackItem> = [
	{
		title: 'Вопрос',
		key: 'Question',
		className: 'w-96'
	},
	{
		title: 'Ответ',
		key: 'Answer',
		align: 'center'
	},
	{
		title: 'Имя устройства',
		key: 'DeviceName',
		align: 'center'
	},
	{
		title: 'Язык',
		key: 'Lang',
		align: 'center',
		render(row) {
			return languageMap[row.Lang as keyof typeof languageMap] || row.Lang // Если язык не найден в map, показываем код
		}
	},
	{
		title: 'Дата',
		key: 'Date',
		align: 'center'
	},
	{
		title: 'Время',
		key: 'Time',
		align: 'center'
	}
]

const columns: DataTableColumns<typeof tableData> = [
	{
		title: 'Вопрос',
		key: 'Question'
	},
	{
		title: 'Ответ',
		key: 'Answer',
		// width: 200,
		titleAlign: 'center',
		align: 'center'
	},
	{
		title: 'Процент',
		key: 'Percent',
		// width: 130,
		titleAlign: 'center',
		align: 'center'
	},
	{
		title: 'Количество',
		key: 'Count',
		// width: 130,
		titleAlign: 'center',
		align: 'center'
	}
]

const tableData = computed(() => {
	const data = feedbackStore.feedbackStat?.Data.flatMap(item => {
		const totalCount = item.AnswerData.reduce(
			(sum, item) => sum + item.Count,
			0
		)
		return item.AnswerData.map((answer, index) => ({
			Question: index === 0 ? item.Question : '', // Только для первого ответа отображаем Question
			Answer: answer.Answer,
			Percent: answer.Count ? (totalCount / answer.Count) * 100 + '%' : 0 + '%',
			Count: answer.Count
		}))
	})

	return data
})

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
			<div class="w-1/4">
				<div class="text-base mb-1">Выберите париод</div>
				<n-date-picker
					v-model:value="dateRange"
					type="daterange"
					:first-day-of-week="0"
					format="dd.MM.yyyy"
					:is-date-disabled="(curr: number) => curr > Date.now()"
					clearable
				/>
			</div>
			<div class="min-w-32">
				<div class="text-base mb-1">Выберите язык</div>
				<n-select v-model:value="selectLang" :options="language" />
			</div>
		</div>
		<Transition mode="out-in">
			<div v-if="!dateRange?.[0] || !dateRange?.[1]">
				<h1 class="text-center text-3xl font-bold mt-6">
					Выберите дату для отображения отзывов
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
				<div class="w-full flex justify-center gap-2 my-6">
					<div class="w-4/5">
						<h1 class="text-center text-2xl font-bold mb-4">
							Статистика отзывов
						</h1>
						<n-data-table
							:columns="columns"
							:data="tableData"
							:max-height="500"
							:single-line="false"
							:bordered="false"
							virtual-scroll
						/>
					</div>
					<!-- <div class="w-1/2">
				<h1 class="text-center text-2xl font-bold mb-4">График отзывов</h1>
				<div class="bg-white w-full h-[550px] p-4">
					<FeedbacksChart />
				</div>
			</div> -->
				</div>
				<div class="w-full flex justify-center gap-2 my-6">
					<div class="w-4/5">
						<h1 class="text-center text-2xl font-bold mb-4">Все отзывы</h1>
						<n-data-table
							:columns="columnsFeedbacks"
							:data="feedbackStore.feedbacks?.Data"
							:max-height="500"
							:single-line="false"
							:bordered="false"
							virtual-scroll
						/>
					</div>
					<!-- <div class="w-1/2">
				<h1 class="text-center text-2xl font-bold mb-4">График отзывов</h1>
				<div class="bg-white w-full h-[550px] p-4">
					<FeedbacksChart />
				</div>
			</div> -->
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
