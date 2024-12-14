<script setup lang="ts">
import { NDataTable, NCard, NDatePicker, NSelect } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useFeedbackStore } from '@/stores/feedbackStore'
import { h, ref, watch } from 'vue'
import { formatTimestamp } from '@/utils/format-timestamp'
import {
	IFeedbackResponse,
	IFeedbackStatResponse
} from '@/types/feedback.interface'

// const data = ref<IFeedbackStatResponse>()
const dateRange = ref<[number, number]>()
const selectValue = ref('ru')
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

feedbackStore.getFeedbacks('2024-01-01', '2024-12-31', 'ru')
feedbackStore.getFeedbackStat('2024-01-01', '2024-12-31', 'ru')

const columnsFeedbacks: DataTableColumns<IFeedbackResponse> = [
	{
		title: 'Question',
		key: 'Question',
		className: 'w-96'
	},
	{
		title: 'Answer',
		key: 'Answer',
		align: 'center'
	},
	{
		title: 'DeviceName',
		key: 'DeviceName',
		align: 'center'
	},
	{
		title: 'Lang',
		key: 'Lang',
		align: 'center'
	},
	{
		title: 'Date',
		key: 'Date',
		align: 'center'
	},
	{
		title: 'Time',
		key: 'Time',
		align: 'center'
	}
]
const columnsFeedbackStat: DataTableColumns<IFeedbackStatResponse> = [
	{
		title: 'Question',
		key: 'Question',
		className: 'w-96',
		rowSpan: (_, rowIndex) => (rowIndex === 0 ? 2 : 1)
	},
	{
		title: 'AnswerData',
		key: 'AnswerData',
		align: 'center'
	},
	{
		title: 'TotalAnswersCount',
		key: 'TotalAnswersCount',
		align: 'center'
	}
]

watch([dateRange, selectValue], () => {
	if (dateRange.value?.[0] && dateRange.value?.[1]) {
		const startDate = formatTimestamp(dateRange.value?.[0])
		const endDate = formatTimestamp(dateRange.value?.[1])

		feedbackStore.getFeedbacks(startDate, endDate, selectValue.value)
		feedbackStore.getFeedbackStat(startDate, endDate, selectValue.value)
	}
})
</script>

<template>
	<div>
		<div
			class="w-full flex items-center justify-between p-4 bg-white mb-4 sticky"
		>
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
				<n-select v-model:value="selectValue" :options="language" />
			</div>
		</div>
		<div>
			<n-data-table
				:columns="columnsFeedbackStat"
				:data="feedbackStore.feedbackStat?.Data"
				:max-height="500"
				virtual-scroll
			/>
		</div>
		<!-- <div>
			<n-data-table
				class="w-1/2 mb-4"
				:columns="columnsFeedbackStat"
				:data="feedbackStore.feedbackStat?.Data"
				:max-height="500"
				virtual-scroll
			/>
		</div> -->
		<!-- <div class="w-full flex"> -->
		<!-- <n-data-table
			:columns="columnsFeedbacks"
			:data="feedbackStore.feedbacks?.Data"
			:max-height="500"
			virtual-scroll
		/> -->
		<!-- </div> -->
	</div>
</template>
