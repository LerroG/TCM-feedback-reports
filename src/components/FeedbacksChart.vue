<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	GridComponent
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
	LineChart,
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	GridComponent
])

const dataForChart = computed(() => {
	// Определим категории с их возможными ответами
	const Excellent = t('Excellent')
	const Good = t('Good')
	const Satisfactory = t('Satisfactory')
	const Poor = t('Poor')

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
	xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
	// color: ['#91cc75', '#5470c6', '#fac858', '#ee6666'],
	// tooltip: {
	// 	trigger: 'item',
	// 	formatter: '{a} <br/>{b} : <strong>{c}</strong> ({d}%)'
	// },
	// legend: {
	// 	orient: 'horizontal',
	// 	data: [
	// 		t('Excellent'),
	// 		t('Good'),
	// 		t('Satisfactory'),
	// 		t('Poor')
	// 	]
	// },
	// // series: [
	// // 	{
	// // 		name: 'Отзывы',
	// // 		type: 'line',
	// // 		// radius: '55%',
	// // 		// center: ['50%', '60%'],
	// // 		data: dataForChart.value,
	// // 		emphasis: {
	// // 			itemStyle: {
	// // 				shadowBlur: 10,
	// // 				shadowOffsetX: 0,
	// // 				shadowColor: 'rgba(0, 0, 0, 0.5)'
	// // 			}
	// // 		}
	// // 	}
	// // ]
})
</script>

<template>
	<v-chart :option="option" autoresize />
</template>
