import { Ref, ref, watch, onMounted, isRef, onUnmounted } from 'vue';
import { createColorSpaceCCTShader } from './webgl';

export function useColorSpaceCCTShader(canvas:Ref<HTMLCanvasElement|undefined>, kelvin_min:Ref<number>, kelvin_max:Ref<number>) {
	let shader:ReturnType<typeof createColorSpaceCCTShader>

	watch(kelvin_min, (new_value) => {
		console.log('KMIN', new_value)
		if (shader) shader.render(new_value, kelvin_max.value)
	}, { immediate: true })
	watch(kelvin_max, (new_value) => {
		console.log('KMAX', new_value)
		if (shader) shader.render(kelvin_min.value, new_value)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createColorSpaceCCTShader(new_canvas)
				shader.render(kelvin_min.value, kelvin_max.value)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}
