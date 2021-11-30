import { ref, reactive, computed, toRefs, watch, WatchOptions, nextTick } from 'vue';
import { ColorHEX, ColorHSVA, ColorAny, ColorRGB } from './types'
import { hsvaToHex, hsvaToRGBA, rgbToHSV, hexToHSVA, hexToRGB, isHSVColor, isHexColor, rgbToHex, isRGBColor, isRGBAColor, rgbaToHSVA, rgbaToHex } from './utils'

export function Color(color:ColorAny = { h:0, s:100, v:100, a:100 }) {
	const watch_options:WatchOptions = { flush: 'sync', immediate: true }

	let initial_hsva:ColorHSVA,
			initial_rgb:ColorRGB,
			initial_hex:ColorHEX

	if (isHexColor(color)) {
		initial_hex = color
		initial_hsva = hexToHSVA(color)
		initial_rgb = hexToRGB(color)
	} else if (isRGBAColor(color)) {
		let { r, g, b } = color
		initial_hex = rgbaToHex(color)
		initial_hsva = rgbaToHSVA(color)
		initial_rgb = { r, g, b }
	} else if (isRGBColor(color)) {
		initial_hex = rgbToHex(color)
		initial_hsva = { ...rgbToHSV(color), a: 100 }
		initial_rgb = color
	} else if (isHSVColor(color)) {
		let { h, s, v } = color
		let hsva = { h, s, v , a: 100 }
		let { r, g, b } = hsvaToRGBA(hsva)
		initial_hex = hsvaToHex(hsva)
		initial_hsva = hsva
		initial_rgb = { r, g, b }
	} else { // is HSVA
		let { r, g, b } = hsvaToRGBA(color)
		initial_hex = hsvaToHex(color)
		initial_hsva = color
		initial_rgb = { r, g, b }
	}

  const hsva = reactive<ColorHSVA>(initial_hsva)
	const { h, s, v, a } = toRefs(hsva)

	const rgb = reactive<ColorRGB>(initial_rgb)
	const { r, g, b } = toRefs(rgb)

	const hex = ref<ColorHEX>(initial_hex)

	let syncing = false	
	// Sync Alpha
	watch(a, () => {
		if (!syncing) {
			syncing = true
			hex.value = hsvaToHex(hsva)
			nextTick(() => syncing = false)
		}
	}, watch_options)

	// // Sync HSV
	function syncHSV() {
		if (!syncing) {
			syncing = true
			let new_rgb = hsvaToRGBA(hsva)
			r.value = new_rgb.r
			g.value = new_rgb.g
			b.value = new_rgb.b

			hex.value = hsvaToHex(hsva)
			nextTick(() => syncing = false)
		}
	}
	watch(h, syncHSV, watch_options)
	watch(s, syncHSV, watch_options)
	watch(v, syncHSV, watch_options)

	// Sync RGB
	function syncRGB() {
		if (!syncing) {
			syncing = true
			let new_hsv = rgbToHSV(rgb)
			h.value = new_hsv.h
			s.value = new_hsv.s
			v.value = new_hsv.v

			hex.value = rgbToHex(rgb)
			nextTick(() => syncing = false)
		}
	}
	watch(r, syncRGB, watch_options)
	watch(g, syncRGB, watch_options)
	watch(b, syncRGB, watch_options)

	// Sync HEX
	function syncHEX() {
		if (!syncing) {
			syncing = true
			let new_rgb = hexToRGB(hex.value)
			r.value = new_rgb.r
			g.value = new_rgb.g
			b.value = new_rgb.b

			let new_hsv = hexToHSVA(hex.value)
			h.value = new_hsv.h
			s.value = new_hsv.s
			v.value = new_hsv.v

			a.value = new_hsv.a
			nextTick(() => syncing = false)
		}
	}
	watch(hex, syncHEX, watch_options)

  return reactive({
		h,s,v,a,
    r,g,b,
    hex
  })
}

export * from './types'
export * from './utils'