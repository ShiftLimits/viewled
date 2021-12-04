import { Ref, ref, watch, onMounted, isRef, onUnmounted } from 'vue';
import { createColorSpaceWheelShader } from './webgl';

export function useColorSpaceWheelShader(canvas:Ref<HTMLCanvasElement|undefined>) {
	const hue = ref(0)
	let shader:ReturnType<typeof createColorSpaceWheelShader>

	watch(hue, (new_hue) => {
		if (shader) shader.render(new_hue / 360)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createColorSpaceWheelShader(new_canvas)
				shader.render(hue.value / 360)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}
