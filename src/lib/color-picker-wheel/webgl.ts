import { createFragmentProgram } from '../webgl'
import ColorSpaceWheelFragmentSource from './shaders/color-space-wheel.fragment'

export function createColorSpaceWheelShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentProgram(canvas, ColorSpaceWheelFragmentSource)

	const setHue = createUniform('1f', 'hue')

	return {
		render(hue:number) {
			setHue(hue)
			render()
		},
		destroy
	}
}
