import 'virtual:svg-icons-register'
import { createApp as createVueApp } from 'vue'
import App from './App'
import { createAppRouter } from './router'
// import { createWLEDClient, createWLEDService } from './services/wled';
import { WLEDClient } from 'wled-client'
import { wledClientPlugin } from 'vue-wled'
import SvgIcon from './components/SvgIcon.vue'

export interface AppOptions {
	isServer?:boolean
}

const default_app_options:AppOptions = {
	isServer: false
}

export function createApp(options:AppOptions = {}) {
	const { isServer } = Object.assign({}, default_app_options, options)

	const app = createVueApp(App)

	const router = createAppRouter({ isServer })
	app.use(router)

	let host = isServer ? '' : window.location.hostname
	const wled_client = new WLEDClient({
		host: import.meta.env.PROD ? host : import.meta.env.WLED_DEVICE_HOST,
		immediate: !isServer
	})
	app.use(wledClientPlugin(wled_client))

	if (!import.meta.env.SSR) window.wled = wled_client

	// App Services

	// Components
	app.component('svg-icon', SvgIcon)

	return { app, router }
}