import { createRouter, createWebHistory } from 'vue-router'
import { loadLayoutMiddleware } from '@/router/middleware/loadLayout.middleware'
import { RouteNamesEnum } from '@/router/router.types'
import { AppLayoutsEnum } from '@/layouts/layouts.types'
// import type { RouteLocationNormalized } from 'vue-router'
// import { ROUTE_URL } from '@/config/url.config'
// import i18n from '@/lib/i18n'
// import { watch } from 'vue'

const routes = [
	{
		path: '/',
		name: RouteNamesEnum.home,
		component: () => import('@/pages/home.vue'),
		meta: { requiresAuth: true, titleKey: 'Home' }
	},
	{
		path: '/auth',
		name: RouteNamesEnum.auth,
		component: () => import('@/pages/auth.vue'),
		meta: {
			layout: AppLayoutsEnum.auth,
			titleKey: 'Авторизация'
		}
	},
	{
		path: '/:catchAll(.*)', // Ловит все несуществующие маршруты
		component: () => import('@/pages/notFound.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach(loadLayoutMiddleware)

// router.beforeEach(to => {
// 	const titleKey = to.meta.titleKey as string
// 	document.title = i18n.global.t(titleKey)
// })

// router.beforeEach((to, _, next) => {
// 	const token = localStorage.getItem('token')

// 	// Если маршрут требует аутентификации
// 	if (to.matched.some(record => record.meta.requiresAuth)) {
// 		if (token) {
// 			next() // Пропустить, если токен есть
// 		} else {
// 			next(ROUTE_URL.auth()) // Перенаправить на страницу логина
// 		}
// 	} else {
// 		next() // Пропустить, если маршрут не требует аутентификации
// 	}
// })

// router.afterEach(() => {
// 	window.scrollTo(0, 0)
// })

// const setTitle = (route: RouteLocationNormalized) => {
// 	const titleKey = route.meta.titleKey as string
// 	document.title = i18n.global.t(titleKey)
// }

// watch(
// 	() => i18n.global.locale,
// 	() => {
// 		const currentRoute = router.currentRoute.value
// 		setTitle(currentRoute)
// 	}
// )

export default router
