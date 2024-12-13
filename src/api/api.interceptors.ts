import { authService } from '@/services/auth.service'
import axios, { type CreateAxiosDefaults } from 'axios'

// const baseURL = window.SETTINGS.api
const baseURL = 'http://192.168.0.100:8086/FeedbackService/json'
const options: CreateAxiosDefaults = {
	baseURL
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token')
		if (token) {
			const url = new URL(`${config.baseURL}${config.url!}`, config.baseURL)
			url.searchParams.set('token', token)
			config.url = url.toString()
		}

		return config
	},
	error => {
		if (error?.response?.Code === -3 && localStorage.getItem('token')) {
			localStorage.removeItem('token')
			authService.logout()
		}

		return Promise.reject(error)
	}
)

export { axiosClassic, axiosWithAuth }
