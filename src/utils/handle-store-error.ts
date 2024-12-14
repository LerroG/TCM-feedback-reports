export const handleStoreError = (err: any, error: any, loading?: any) => {
	try {
		if (err.response) {
			// Если ошибка от Axios
			error.value = `Ошибка: ${
				err.response.data.message || 'Неизвестная ошибка'
			}`
		} else if (err instanceof Error) {
			// Обычная ошибка
			error.value = `Ошибка: ${err.message}`
		} else {
			error.value = 'Неизвестная ошибка'
		}
	} finally {
		if (loading) loading.value = false
	}
}
