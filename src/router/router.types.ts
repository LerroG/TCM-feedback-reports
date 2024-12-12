import type { VueElement } from 'vue'
import type { AppLayoutsEnum } from '@/layouts/layouts.types'

declare module 'vue-router' {
	interface RouteMeta {
		layout?: AppLayoutsEnum
		layoutComponent?: VueElement
		titleKey: string
		requiresAuth?: boolean
	}
}

export enum RouteNamesEnum {
	home = 'home',
	auth = 'auth'
}
