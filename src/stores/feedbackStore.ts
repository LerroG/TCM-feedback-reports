import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
	IFeedbackResponse,
	IFeedbackStatResponse
} from '@/types/feedback.interface'
import { feedbackService } from '@/services/feedbacks.service'
import { handleStoreError } from '@/utils/handle-store-error'

export const useFeedbackStore = defineStore('feedbackStore', () => {
	const feedbacks = ref<IFeedbackResponse | null>(null)
	const loadingFeedbacks = ref(false)
	const errorFeedbacks = ref<string | null>(null)

	const feedbackStat = ref<IFeedbackStatResponse | null>(null)
	const loadingFeedbackStat = ref(false)
	const errorFeedbackStat = ref<string | null>(null)

	const getFeedbacks = async (
		startDate: string,
		endDate: string,
		lang: string
	) => {
		loadingFeedbacks.value = true
		errorFeedbacks.value = null

		try {
			const response = await feedbackService.getFeedbacksService(
				startDate,
				endDate,
				lang
			)

			if (!response?.Data) {
				feedbacks.value = null
				throw new Error('Получены пустые данные.')
			}

			feedbacks.value = response || null
		} catch (err: any) {
			handleStoreError(err, errorFeedbacks, loadingFeedbacks)
		}
	}

	const getFeedbackStat = async (
		startDate: string,
		endDate: string,
		lang: string
	) => {
		loadingFeedbackStat.value = true
		errorFeedbackStat.value = null

		try {
			const response = await feedbackService.getFeedbackStatService(
				startDate,
				endDate,
				lang
			)

			if (!response?.Data) {
				feedbackStat.value = null
				throw new Error('Получены пустые данные.')
			}

			feedbackStat.value = response || null
		} catch (err: any) {
			handleStoreError(err, errorFeedbackStat, loadingFeedbackStat)
		}
	}

	return {
		feedbacks,
		loadingFeedbacks,
		errorFeedbacks,
		getFeedbacks,
		feedbackStat,
		loadingFeedbackStat,
		errorFeedbackStat,
		getFeedbackStat
	}
})
