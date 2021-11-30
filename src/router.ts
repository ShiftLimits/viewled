import { createRouter, createMemoryHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

export interface AppRouterOptions {
	isServer?:boolean
}

const default_app_router_options:AppRouterOptions = {
	isServer: false
}

export function createAppRouter(options:AppRouterOptions = {}) {
	const { isServer } = Object.assign({}, default_app_router_options, options)

	const routes:RouteRecordRaw[] = [
		{ path: '/', component: () => import('./pages/index.vue') },
		{ path: '/color', component: () => import('./pages/color.vue') },
		{ path: '/info', component: () => import('./pages/info.vue') },
		{ path: '/:pathMatch(.*)*', component: () => import('./pages/404.vue') }
	]

	const history = isServer ? createMemoryHistory() : createWebHistory()

	const router = createRouter({
		scrollBehavior(to, from, saved_position) {
			return { top: 0, left: 0 }
		},
		routes,
		history
	})

	return router
}
