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
	const result: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

	feedbackStore.feedbackStat?.Data.forEach(item => {
		item.AnswerData.forEach(answer => {
			if (result.hasOwnProperty(answer.Answer)) {
				result[answer.Answer] += answer.Count
			}
		})
	})

	return Object.entries(result).map(([key, value]) => ({
		value,
		name: `${t('Evaluation')} ${key}`
	}))
})

const option = ref<EChartsOption>({
	color: ['#ee6666', '#fac858', '#f7e463', '#91cc75', '#3ba272'],
	tooltip: {
		trigger: 'item',
		formatter: '{a} <br/>{b}: <strong>{c}</strong> ({d}%)'
	},
	legend: {
		orient: 'horizontal'
	},
	series: [
		{
			name: t('Reviews'),
			type: 'pie',
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
