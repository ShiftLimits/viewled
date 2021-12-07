<script setup lang="ts">
	import { useWLEDClient } from "vue-wled"
	import { computed, reactive, ref, watch } from "vue"
	import throttle from 'lodash/throttle'
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Popover, PopoverButton, PopoverPanel } from "@headlessui/vue"
	import SvgIcon from "../components/SvgIcon.vue"
	import MastheadNavButton from "./MastheadNavButton.vue"
	import AbstractButton from "./AbstractButton.vue"
	import Toggle from "./Toggle.vue"
	import ProgressCircle from "./ProgressCircle.vue"
	import SubNavButton from "./SubNavButton.vue"
import { WLEDPalettesData } from "wled-client"
import { createGradientCSSFromState } from "../lib/wled"

	const { state, info, effects, palettes, presets, live, nightlight, toggle, updateState, setEffect, setPalette, setEffectSpeed, setEffectIntensity, toggleLEDStream, enableUDPSync, disableUDPSync, setPreset, getPalettesData } = useWLEDClient()

	//
	// Palette selector
	const sorted_palettes = computed(() => [...palettes].sort((a, b) => {
		return a.localeCompare(b, undefined, {
			numeric: true,
			sensitivity: 'base'
		})
	}))
	const _selected_palette = ref(palettes[state.segments[state.mainSegmentId!]?.paletteId || 0])
	watch<string>(() => palettes[state.segments[state.mainSegmentId!]?.paletteId || 0], (new_value) => _selected_palette.value = new_value)
	const selected_palette = computed<string>({
		get() {
			return _selected_palette.value
		},
		set(new_value) {
			let paletteId = palettes.findIndex((effect) => effect === new_value)
			if (paletteId != -1) {
				_selected_palette.value = new_value
				setPalette(paletteId)
			}
		}
	})

	function isSelectedPalette(palette:string) {
		return _selected_palette.value == palette
	}

	let palettes_data = reactive<WLEDPalettesData>({})
	getPalettesData().then(data => {
		Object.assign(palettes_data, data)
	})
	function getPaletteStyle(palette:string) {
		if (!palettes_data) return ''
		let palette_id = palettes.indexOf(palette)
		let stops = palettes_data[palette_id]
		return createGradientCSSFromState(state, stops)
	}

	//
	// Effect selector
	const effects_search_query = ref('')
	const sorted_effects = computed(() => [...effects].sort((a, b) => {
		return a.localeCompare(b, undefined, {
			numeric: true,
			sensitivity: 'base'
		})
	}))
	const _selected_effect = ref(effects[state.segments[state.mainSegmentId!]?.effectId || 0])
	watch<string>(() => effects[state.segments[state.mainSegmentId!]?.effectId || 0], (new_value) => _selected_effect.value = new_value)
	const selected_effect = computed<string>({
		get() {
			return _selected_effect.value
		},
		set(new_value) {
			let effectId = effects.findIndex((effect) => effect === new_value)
			if (effectId != -1) {
				_selected_effect.value = new_value
				setEffect(effectId)
			}
		}
	})

	function isSelectedEffect(effect:string) {
		return _selected_effect.value == effect
	}

	//
	// Effect Sliders
	let isDraggingEffectSpeed = false
	const _effect_speed = ref<number>(state.segments[state.mainSegmentId!]?.effectSpeed||128)
	watch<number|undefined>(() => state.segments[state.mainSegmentId!]?.effectSpeed, (new_value) => { if (!isDraggingEffectSpeed) _effect_speed.value = new_value || 0 }, { immediate: true, flush: 'sync' })

	const _setEffectSpeed = throttle((effect_speed) => setEffectSpeed(effect_speed), 100)
	const effect_speed = computed({
		get() {
			return _effect_speed.value
		},
		set: (effect_speed:number) => {
			_effect_speed.value = effect_speed
			_setEffectSpeed(effect_speed)
		}
	})

	const handleEffectSpeedInput = ({target}) => effect_speed.value = parseInt(target.value)
	const handleEffectSpeedPointerDown = ({}) => isDraggingEffectSpeed = true
	const handleEffectSpeedPointerUp = ({}) => isDraggingEffectSpeed = false

	let isDraggingEffectIntensity = false
	const _effect_intensity = ref<number>(state.segments[state.mainSegmentId!]?.effectIntensity||128)
	watch<number|undefined>(() => state.segments[state.mainSegmentId!]?.effectIntensity, (new_value) => { if (!isDraggingEffectIntensity) _effect_intensity.value = new_value || 0 }, { immediate: true, flush: 'sync' })

	const _setEffectIntensity = throttle((effect_intensity) => setEffectIntensity(effect_intensity), 100)
	const effect_intensity = computed({
		get() {
			return _effect_intensity.value
		},
		set: (effect_intensity:number) => {
			_effect_intensity.value = effect_intensity
			_setEffectIntensity(effect_intensity)
		}
	})

	const handleEffectIntensityInput = ({target}) => effect_intensity.value = parseInt(target.value)
	const handleEffectIntensityPointerDown = ({}) => isDraggingEffectIntensity = true
	const handleEffectIntensityPointerUp = ({}) => isDraggingEffectIntensity = false

	//
	// Brightness Slider
	let isDraggingBrightness = false
	const _brightness = ref<number>(state.brightness||100)
	watch<number|undefined>(() => state.brightness, (new_value) => { if (!isDraggingBrightness) _brightness.value = new_value || 0 }, { immediate: true, flush: 'sync' })

	const setBrightness = throttle((brightness) => updateState({ brightness, temporaryTransition: 1 }), 100)
	const brightness = computed({
		get() {
			return _brightness.value
		},
		set: (brightness:number) => {
			_brightness.value = brightness
			setBrightness(brightness)
		}
	})

	const handleBrightnessInput = ({target}) => brightness.value = parseInt(target.value)
	const handleBrightnessPointerDown = ({}) => isDraggingBrightness = true
	const handleBrightnessPointerUp = ({}) => setTimeout(() => isDraggingBrightness = false, 200)

	//
	// Sync Button
	const isSyncActive = computed(() => info.syncToggleReceive ? state.udpSync.send && state.udpSync.receive : state.udpSync.send)
	const handleSyncClick = () => {
		if (info.syncToggleReceive && state.udpSync.send && state.udpSync.receive) return disableUDPSync()
		if (!info.syncToggleReceive && state.udpSync.send) return disableUDPSync()
		return enableUDPSync()
	}

	//
	// Nightlight
	const remaining = computed(() => Math.min(100, Math.max(0, ((state.nightlight.remaining || 0) / ((state.nightlight.duration || 100) * 60))*100 )))
</script>

<template>
	<header class="lg:bg-neutral-950 flex flex-col lg:flex-row relative">
		<!-- Device Global Functions -->
		<div class="flex-1 flex bg-neutral-825">
			<div class="w-4/5% xs:w-auto flex divide-x divide-neutral-850">
				<MastheadNavButton class="flex-1 xs:flex-initial" icon="power" label="Power" @click="toggle()" :active="state.on" />
				<MastheadNavButton class="flex-1 xs:flex-initial" @click="nightlight.toggle()" :active="state.nightlight.on" v-slot="{ active }">
					<SvgIcon name="nightlight" class="h-1-1/4 fill-current" v-if="!active" />
					<ProgressCircle :progress="remaining" class="h-1-1/4 stroke-current" v-else />
					<div class="leading-2/3 w-1-3/4 flex justify-center" :class="{ 'opacity-60': !active }">Timer</div>
				</MastheadNavButton>
				<MastheadNavButton class="flex-1 xs:flex-initial" icon="white-balance" label="White" to="/" />
				<MastheadNavButton class="flex-1 xs:flex-initial" icon="rgb-wheel" label="Color" to="/color" />
			</div>

			<!-- Presets -->
			<Popover class="flex-1 flex" v-slot="{ open, close }">
				<PopoverPanel class="absolute right-0 bottom-100% lg:top-100% lg:bottom-auto w-full flex flex-col shadow-md border-b lg:border-b-0 lg:border-t border-neutral-200 z-20">
					<div class="order-1 lg:order-3 border-b border-neutral-900 bg-gradient-to-b from-neutral-775 to-neutral-825 p-1/2">
						<div class="font-black">Quick Presets</div>
					</div>
					<div class="order-2 h-3-1/2 flex overflow-x-auto bg-neutral-875 divide-x divide-neutral-900">
						<template v-for="(preset, id) in presets">
							<SubNavButton class="min-w-3-1/2 justify-center text-lg" v-if="preset.label" :key="id" :label="preset.label" :active="(state.playlistId != -1 && state.playlistId == id) || (state.playlistId == -1 && state.presetId == id)" @click="setPreset(id).then(() => close())" />
						</template>
					</div>
				</PopoverPanel>
				<PopoverButton as="div" class="flex-1 xs:flex-initial flex z-30">
					<MastheadNavButton class="border-l border-neutral-850 w-full" :class="{ '': open }" icon="heart" label="Presets" :active="open" />
				</PopoverButton>
			</Popover>
		</div>

		<!-- Brightness -->
		<div class="flex-1 p-3/4 flex flex-col lg:max-w-12 lg:min-w-12 bg-neutral-900 bg-gradient-to-b from-neutral-950 to-neutral-900">
			<div class="lg:flex-1"></div>
			<div class="flex gap-1/2">
				<div>
					<SvgIcon name="brightness" class="w-1-3/4 h-1-3/4 fill-white" :style="{ 'opacity':  Math.max(0.1, brightness/100) }" />
				</div>
				<div class="flex-1 flex flex-col justify-end gap-1/4">
					<div class="justify-self-end flex text-xs leading-1/2">
						<div class="text-neutral-200">Brightness</div>
						<div class="flex-1"></div>
						<div class="font-bold">{{ brightness }}/100</div>
					</div>
					<input class="h-3/4" type="range" min="0" max="100" :value="brightness" @input="handleBrightnessInput" @pointerdown="handleBrightnessPointerDown" @pointerup="handleBrightnessPointerUp" />
				</div>
			</div>
		</div>

		<!-- Bottom -->
		<div class="flex relative border-t border-neutral-1000 lg:border-t-0">

			<!-- Effects -->
			<Listbox v-model="selected_effect" v-slot="{ open }">
				<ListboxButton class="flex-1 lg:w-8 text-left px-1 flex items-center" :class="{ 'bg-neutral-875 bg-gradient-to-br from-neutral-850 to-neutral-900 mouse:hover:from-neutral-850 mouse:hover:to-neutral-875': !open, 'bg-neutral-200 text-black': open }">
					<div class="flex-1 flex flex-col overflow-hidden">
						<div class="text-xs leading-1/2" :class="{ 'text-neutral-400': !open, 'text-neutral-800': open }">Effect</div>
						<div class="font-medium leading-1 truncate">{{ selected_effect }}</div>
					</div>
					<SvgIcon name="selector" class="h-1 fill-neutral-100" />
				</ListboxButton>
				<ListboxOptions class="absolute bottom-100% lg:bottom-0 lg:top-100% inset-x-0 lg:inset-x-auto lg:w-full lg:rounded-bl-1/2 overflow-hidden h-3/4-screen flex flex-col bg-neutral-950 border-b-1/8 lg:border-b-0 lg:border-t-1/8 border-neutral-200 z-50">
					<div class="border-b border-neutral-900 bg-gradient-to-b from-neutral-775 to-neutral-825 px-1/2 py-3/4 font-bold">Select Effect</div>
					<div class="overflow-auto flex-1 divide-y divide-neutral-950">
						<ListboxOption
							v-for="effect in sorted_effects"
							:key="effect"
							:value="effect"
							class="p-1/2 mouse:hover:bg-neutral-800 cursor-pointer"
							:class="{
								'bg-neutral-100 text-black': isSelectedEffect(effect),
								'bg-neutral-900': !isSelectedEffect(effect),
								'sticky inset-y-0 !border-b -mb-px bg-gradient-to-r from-primary-300/5 to-transparent': effect == 'Solid'
							}"
						>
							{{ effect }}
						</ListboxOption>
					</div>
				</ListboxOptions>
			</Listbox>

			<!-- Effects Sliders -->
			<Popover v-slot="{ open }">
				<PopoverPanel class="absolute right-0 bottom-100% lg:top-100% lg:bottom-auto w-full flex flex-col shadow-md border-b-1/8 lg:border-b-0 lg:border-t-1/8 border-primary-650 z-50">
					<div class="border-b border-neutral-900 bg-gradient-to-b from-neutral-775 to-neutral-825 px-1/2 py-3/4 font-bold">Effect Settings</div>
					<div class="flex-1 p-3/4 flex lg:max-w-18 lg:min-w-12 bg-neutral-875 gap-1/2">
						<div class="grid grid-stack">
							<SvgIcon name="speed-dial" class="mt-1/8 w-1-3/4 h-1-3/4 fill-white" :style="{ 'transform':  `rotate(${ ((effect_speed/255) * 180) }deg)` }" />
							<SvgIcon name="speed" class="w-1-3/4 h-1-3/4 fill-white" />
						</div>
						<div class="flex-1 flex flex-col justify-end gap-1/4">
							<div class="justify-self-end flex text-xs leading-1/2">
								<div class="text-neutral-200">Effect Speed</div>
								<div class="flex-1"></div>
								<div class="font-bold">{{ effect_speed }}/255</div>
							</div>
							<input class="h-3/4" type="range" min="0" max="255" :value="effect_speed" @input="handleEffectSpeedInput" @pointerdown="handleEffectSpeedPointerDown" @pointerup="handleEffectSpeedPointerUp" />
						</div>
					</div>
					<div class="flex-1 p-3/4 flex lg:max-w-18 lg:min-w-12 bg-neutral-875 gap-1/2">
						<div>
							<SvgIcon name="intensity" class="w-1-3/4 h-1-3/4 fill-white" :style="{ 'opacity':  Math.max(0.1, effect_intensity/255) }" />
						</div>
						<div class="flex-1 flex flex-col justify-end gap-1/4">
							<div class="justify-self-end flex text-xs leading-1/2">
								<div class="text-neutral-200">Effect Intensity</div>
								<div class="flex-1"></div>
								<div class="font-bold">{{ effect_intensity }}/255</div>
							</div>
							<input class="h-3/4" type="range" min="0" max="255" :value="effect_intensity" @input="handleEffectIntensityInput" @pointerdown="handleEffectIntensityPointerDown" @pointerup="handleEffectIntensityPointerUp" />
						</div>
					</div>
				</PopoverPanel>
				<PopoverButton class="h-full p-3/4 flex items-center group border-l border-neutral-1000" :class="{ 'bg-gradient-radial from-primary-500 to-primary-700': open, 'bg-gradient-to-b from-neutral-900 to-neutral-925 mouse:hover:bg-gradient-radial mouse:hover:from-primary-500 mouse:hover:to-primary-700': !open }">
					<SvgIcon name="sliders" class="w-1-1/4 h-1-1/4 fill-white z-10" />
				</PopoverButton>
			</Popover>

			<!-- Color Palette -->
			<Listbox v-model="selected_palette" v-slot="{ open }">
				<ListboxButton class="h-full p-3/4 flex items-center group border-l border-neutral-1000" :class="{ 'bg-gradient-radial from-primary-500 to-primary-700': open, 'bg-gradient-to-b from-neutral-900 to-neutral-925 mouse:hover:bg-gradient-radial mouse:hover:from-primary-500 mouse:hover:to-primary-700': !open }">
					<SvgIcon name="palette" class="w-1-1/4 h-1-1/4 fill-white z-10" />
				</ListboxButton>
				<ListboxOptions class="absolute bottom-100% lg:bottom-0 lg:top-100% inset-x-0 lg:inset-x-auto lg:w-full lg:rounded-bl-1/2 overflow-hidden h-3/4-screen flex flex-col bg-neutral-950 border-b-1/8 lg:border-b-0 lg:border-t-1/8 border-primary-650 z-50">
					<div class="border-b border-neutral-900 bg-gradient-to-b from-neutral-775 to-neutral-825 px-1/2 py-3/4 font-bold">Color Palette</div>
					<div class="overflow-auto flex-1 divide-y divide-neutral-1000">
						<ListboxOption
							v-for="palette in sorted_palettes"
							:key="palette"
							:value="palette"
							class="p-1/2 mouse:hover:bg-neutral-800 cursor-pointer space-y-1/4"
							:class="{
								'bg-neutral-200 text-black': isSelectedPalette(palette),
								'bg-neutral-900': !isSelectedPalette(palette)
							}"
						>
							<div class="h-1 w-full overflow-hidden rounded-1/4 border-1/8 border-neutral-1000" :style="{ 'background-image': getPaletteStyle(palette) }"></div>
							<div class="px-1/4 text-sm leading-1/2">{{ palette }}</div>
						</ListboxOption>
					</div>
				</ListboxOptions>
			</Listbox>

			<!-- Segments -->
			<Popover v-if="state.segments.length > 1" v-slot="{ open }">
				<PopoverPanel class="absolute right-0 bottom-100% lg:top-100% lg:bottom-auto w-full flex flex-col shadow-md border-b-1/8 lg:border-b-0 lg:border-t-1/8 border-primary-650 z-50">
					<div class="border-b border-neutral-900 bg-gradient-to-b from-neutral-775 to-neutral-825 px-1/2 py-3/4 font-bold">Segments</div>
				</PopoverPanel>
				<PopoverButton class="h-full p-3/4 flex items-center group border-l border-neutral-1000" :class="{ 'bg-gradient-radial from-primary-500 to-primary-700': open, 'bg-gradient-to-b from-neutral-900 to-neutral-925 mouse:hover:bg-gradient-radial mouse:hover:from-primary-500 mouse:hover:to-primary-700': !open }">
					<SvgIcon name="segments" class="w-1-1/4 h-1-1/4 fill-white z-10" />
				</PopoverButton>
			</Popover>

			<!-- Menu -->
			<Popover v-slot="{ open }">
				<PopoverPanel v-slot="{ close }" class="absolute right-0 bottom-100% lg:top-100% lg:bottom-auto w-full max-w-16 flex flex-col shadow-md z-50">
					<div class="rounded-tl-1/2 lg:rounded-tl-none px-3/4 py-1/2 bg-neutral-825 lg:bg-gradient-to-tr from-neutral-825 via-neutral-825 to-primary-700/70 flex items-center gap-1/2">
						<img src="../assets/images/aircookie-logo.png" title="AirCookie" class="h-1 pixellated"/>
						<div class="font-bold text-lg leading-1">WLED</div>
					</div>
					<router-link @click="close" class="py-3/4 lg:py-1/2 px-3/4 mouse:hover:bg-neutral-850 bg-neutral-875 flex items-center space-x-3/4" to="/presets">
						<SvgIcon name="heart" class="h-1 fill-current" />
						<div class="flex-1">Presets</div>
					</router-link>
					<router-link @click="close" class="py-3/4 lg:py-1/2 px-3/4 mouse:hover:bg-neutral-850 bg-neutral-875 flex items-center space-x-3/4" to="/segments">
						<SvgIcon name="segments" class="h-1 fill-current" />
						<div class="flex-1">Segments</div>
					</router-link>
					<router-link @click="close" class="py-3/4 lg:py-1/2 px-3/4 mouse:hover:bg-neutral-850 bg-neutral-875 flex items-center space-x-3/4" to="/info">
						<SvgIcon name="info" class="h-1 fill-current" />
						<div class="flex-1">Device Information</div>
					</router-link>
					<router-link @click="close" class="py-3/4 lg:py-1/2 px-3/4 mouse:hover:bg-neutral-850 bg-neutral-875 flex items-center space-x-3/4" to="/settings">
						<SvgIcon name="settings" class="h-1 fill-current" />
						<div class="flex-1">Settings</div>
					</router-link>
					<button @click="handleSyncClick" class="border-t border-neutral-925 text-left py-3/4 lg:py-1/2 px-3/4 flex items-center space-x-3/4 mouse:hover:bg-neutral-850 bg-neutral-875 cursor-pointer">
						<SvgIcon name="sync" class="h-1 fill-current" />
						<div class="flex-1 flex flex-col space-y-1/8">
							<div class="leading-3/4">Sync</div>
							<div class="text-neutral-600 leading-1/2 text-xs">Synchronize with other devices</div>
						</div>
						<Toggle :modelValue="isSyncActive ? true:undefined" />
					</button>
					<button @click="toggleLEDStream" class="border-t border-neutral-925 text-left py-3/4 lg:py-1/2 px-3/4 flex items-center space-x-3/4 mouse:hover:bg-neutral-850 bg-neutral-875 cursor-pointer">
						<SvgIcon name="peek" class="h-1 fill-current" />
						<div class="flex-1 flex flex-col space-y-1/8">
							<div class="leading-3/4">Peek</div>
							<div class="text-neutral-600 leading-1/2 text-xs">Show a preview of the device</div>
						</div>
						<Toggle :modelValue="live.leds ? true:undefined" />
					</button>
					<div class="lg:rounded-bl-1/2 h-1/2 bg-neutral-825 lg:bg-none bg-gradient-to-br from-neutral-825 via-neutral-825 to-primary-700/70"></div>
				</PopoverPanel>
				<PopoverButton class="h-full p-1/2 flex items-center group border-l border-neutral-1000" :class="{ 'bg-gradient-radial from-primary-500 to-primary-700': open, 'bg-gradient-to-b from-neutral-900 to-neutral-925 mouse:hover:bg-gradient-radial mouse:hover:from-primary-500 mouse:hover:to-primary-700': !open }">
					<img src="../assets/images/cheerful-akemi.png" title="Menu" class="pixellated w-1-3/4 h-1-3/4 -mr-3/4 from-primary-0/80 via-primary-300/70 to-primary-500/0" :class="{ 'bg-gradient-radial-side': open, 'opacity-40 mouse:group-hover:opacity-100 mouse:group-hover:bg-gradient-radial-side mix-blend-luminosity mouse:group-hover:mix-blend-normal': !open }" />
					<SvgIcon name="menu" class="w-1-3/4 h-1-3/4 fill-white z-10" />
				</PopoverButton>
			</Popover>
		</div>
	</header>
</template>