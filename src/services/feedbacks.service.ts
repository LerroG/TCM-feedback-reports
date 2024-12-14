import { axiosWithAuth } from '@/api/api.interceptors'
import {
	IFeedbackResponse,
	IFeedbackStatResponse
} from '@/types/feedback.interface'

class FeedbackService {
	// Обработчик ошибок с подробным логированием
	private handleError(error: any) {
		// Здесь можно добавить более сложную обработку в зависимости от типа ошибки
		console.error('Ошибка при выполнении запроса:', error)
		throw new Error(error?.response?.data?.message || 'Неизвестная ошибка')
	}

	async getFeedbacksService(startDate: string, endDate: string, lang: string) {
		try {
			const { data } = await axiosWithAuth<IFeedbackResponse>({
				url: '/GetFeedbacks',
				method: 'GET',
				params: {
					startDate,
					endDate,
					lang
				}
			})

			if (!data) {
				throw new Error('Получены пустые данные.')
			}

			return data
		} catch (error: any) {
			this.handleError(error)
		}
	}

	async getFeedbackStatService(
		startDate: string,
		endDate: string,
		lang: string
	) {
		try {
			const { data } = await axiosWithAuth<IFeedbackStatResponse>({
				url: '/GetFeedbackStat',
				method: 'GET',
				params: {
					startDate,
					endDate,
					lang
				}
			})

			if (!data) {
				throw new Error('Получены пустые данные.')
			}

			return data
		} catch (error: any) {
			this.handleError(error)
		}
	}
}

export const feedbackService = new FeedbackService()
