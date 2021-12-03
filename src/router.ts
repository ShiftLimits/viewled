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
		{ path: '/settings', component: () => import('./pages/settings.vue'), children: [
			{ path: 'schedule', component: () => import('./pages/settings/time.vue') },
			{ path: 'wifi', component: () => import('./pages/settings/wifi.vue') },
			{ path: 'ui', component: () => import('./pages/settings/ui.vue') },
			{ path: 'hardware', component: () => import('./pages/settings/hardware.vue') },
			{ path: 'security', component: () => import('./pages/settings/security.vue') },
			{ path: 'update', component: () => import('./pages/settings/update.vue') },
			{ path: ':pathMatch(.*)*', component: () => import('./pages/settings/index.vue') },
		] },
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
