import { Ref, watch, onMounted, isRef, onUnmounted } from 'vue';
import { createColorSpaceShader, createHueWheelShader, createAlphaWheelShader } from './webgl';

export function useColorSpaceShader(canvas:Ref<HTMLCanvasElement>, hue:Ref<number>) {
	let shader:ReturnType<typeof createColorSpaceShader>

	watch(hue, (new_hue) => {
		if (shader) shader.render(new_hue / 360)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createColorSpaceShader(new_canvas)
				shader.render(hue.value / 360)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}

export function useHueWheelShader(canvas:Ref<HTMLCanvasElement>, saturation:Ref<number>, value:Ref<number>) {
	let shader:ReturnType<typeof createHueWheelShader>

	watch(saturation, (new_saturation) => {
		if (shader) shader.render(new_saturation / 100, value.value / 100)
	}, { immediate: true })

	watch(value, (new_value) => {
		if (shader) shader.render(saturation.value / 100, new_value / 100)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createHueWheelShader(new_canvas)
				shader.render(saturation.value / 100, value.value / 100)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}

export function useAlphaWheelShader(canvas:Ref<HTMLCanvasElement>, hue:Ref<number>, saturation:Ref<number>, value:Ref<number>) {
	let shader:ReturnType<typeof createAlphaWheelShader>

	watch(hue, (new_hue) => {
		if (shader) shader.render(new_hue / 360, saturation.value / 100, value.value / 100)
	}, { immediate: true })

	watch(saturation, (new_saturation) => {
		if (shader) shader.render(hue.value / 360, new_saturation / 100, value.value / 100)
	}, { immediate: true })

	watch(value, (new_value) => {
		if (shader) shader.render(hue.value / 360, saturation.value / 100, new_value / 100)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createAlphaWheelShader(new_canvas)
				shader.render(hue.value / 360, saturation.value / 100, value.value / 100)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}