import { Ref, ref, watch, onMounted, isRef, onUnmounted, reactive, isReactive } from 'vue';
import { createLEDPreviewShader } from './webgl';

export function useLEDPreviewShader(canvas:Ref<HTMLCanvasElement|undefined>, leds:Uint8Array[]) {
	let shader:ReturnType<typeof createLEDPreviewShader>

	if (isReactive(leds)) watch(leds, (new_leds) => {
		if (shader) shader.render(new_leds)
	}, { immediate: true })

	onMounted(() => {
		watch(canvas, (new_canvas) => {
			if (shader) shader.destroy()

			if (new_canvas) {
				shader = createLEDPreviewShader(new_canvas)
				shader.render(leds)
			}
		}, { immediate: true })
	})

	onUnmounted(() => {
		if (shader) shader.destroy()
	})
}
