import { createFragmentShaderCanvas } from 'slgl'
import ColorSpaceWheelFragmentSource from './shaders/color-space-wheel.fragment'

export function createColorSpaceWheelShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentShaderCanvas(canvas, ColorSpaceWheelFragmentSource)

	const setHue = createUniform('1f', 'hue')

	return {
		render(hue:number) {
			setHue(hue)
			render()
		},
		destroy
	}
}
