<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed, ref } from 'vue'
import { EChartsOption } from 'echarts'
import { useI18n } from 'vue-i18n'
import { useFeedbackStore } from '@/stores/feedbackStore'

const feedbackStore = useFeedbackStore()
const { t } = useI18n()
use([
	CanvasRenderer,
	PieChart,
	TitleComponent,
	TooltipComponent,
	LegendComponent
])

const dataForChart = computed(() => {
	// Определим категории с их возможными ответами
	const Excellent = t('All Excellent')
	const Good = t('All Good')
	const Satisfactory = t('All Satisfactory')
	const Poor = t('All Poor')

	const categories = {
		[Excellent]: [
			t('Excellent'),
			t('Yes'),
			t('Very satisfied'),
			t('Very comfortable'),
			t('Very convenient'),
			t('Very safe'),
			t('Very interesting')
		],
		[Good]: [
			t('Good'),
			t('Partially'),
			t('Satisfied'),
			t('Comfortable'),
			t('Convenient'),
			t('Safe'),
			t('Interesting')
		],
		[Satisfactory]: [
			t('Satisfactory'),
			t('Acceptable'),
			t('Satisfactory Website')
		],
		[Poor]: [
			t('Poor'),
			t('No'),
			t('Not satisfied'),
			t('Uncomfortable'),
			t('Inconvenient'),
			t('Unsafe'),
			t('Not interesting')
		]
	}

	const result: { value: number; name: string }[] = []

	// Проходим по категориям и суммируем количество для каждого ответа
	Object.keys(categories).forEach(category => {
		let totalCount = 0
		const categoryAnswers = categories[category]

		// Проходим по данным и суммируем количество для каждого ответа, который попадает в категорию
		feedbackStore.feedbackStat?.Data.forEach(item => {
			item.AnswerData.forEach(answer => {
				if (categoryAnswers.includes(answer.Answer)) {
					totalCount += answer.Count
				}
			})
		})

		// Добавляем объект с результатами в итоговый массив

		result.push({
			value: totalCount,
			name: category
		})
	})

	return result
})

const option = ref<EChartsOption>({
	color: ['#91cc75', '#5470c6', '#fac858', '#ee6666'],
	tooltip: {
		trigger: 'item',
		formatter: '{a} <br/>{b} : <strong>{c}</strong> ({d}%)'
	},
	legend: {
		orient: 'vertical',
		left: 'left',
		data: [
			t('All Excellent'),
			t('All Good'),
			t('All Satisfactory'),
			t('All Poor')
		]
	},
	series: [
		{
			name: 'Отзывы',
			type: 'pie',
			// radius: '55%',
			center: ['50%', '60%'],
			data: dataForChart.value,
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}
	]
})
</script>

<template>
	<v-chart :option="option" autoresize />
</template>
