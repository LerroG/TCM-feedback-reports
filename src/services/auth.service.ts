import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors'
import router from '@/router'
import { IAuthForm, IAuthResponse } from '@/types/auth.interface'

class AuthService {
	// Обработчик ошибок с подробным логированием
	private handleError(error: any) {
		// Здесь можно добавить более сложную обработку в зависимости от типа ошибки
		console.error('Ошибка при выполнении запроса:', error)
		throw new Error(error?.response?.data?.message || 'Неизвестная ошибка')
	}

	// Функция для работы с токеном
	private setToken(token: string) {
		localStorage.setItem('token', token)
	}

	private removeToken() {
		localStorage.removeItem('token')
	}

	// Функция для выполнения логина
	async login(data: IAuthForm) {
		try {
			const response = await axiosClassic<IAuthResponse>({
				url: '/Login',
				method: 'POST',
				data
			})

			if (response.data.Token) {
				this.setToken(response.data.Token)
				router.push('/')
			}

			return response
		} catch (error: any) {
			this.handleError(error)
		}
	}

	// Функция для выполнения логаута
	async logout() {
		try {
			this.removeToken()
			const { data } = await axiosWithAuth<Omit<IAuthResponse, 'Token'>>({
				url: '/Logout'
			})

			router.push('/auth')

			return data
		} catch (error: any) {
			this.handleError(error)
		}
	}
}

export const authService = new AuthService()
