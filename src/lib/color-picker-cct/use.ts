import { Ref, ref, watch, onMounted, isRef, onUnmounted } from 'vue';
import { createColorSpaceCCTShader } from './webgl';

export function useColorSpaceCCTShader(canvas:Ref<HTMLCanvasElement|undefined>) {
	const hue = ref(0)
	let shader:ReturnType<typeof createColorSpaceShader>

	watch(hue, (new_hue) => {
		if (shader) shader.render(new_hue / 360)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createColorSpaceCCTShader(new_canvas)
				shader.render(hue.value / 360)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}
