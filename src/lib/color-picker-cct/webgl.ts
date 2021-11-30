import { createFragmentProgram } from '../webgl'
import ColorSpaceCCTFragmentSource from './shaders/color-space-cct.fragment'

export function createColorSpaceCCTShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentProgram(canvas, ColorSpaceCCTFragmentSource)

	const setHue = createUniform('1f', 'hue')

	return {
		render(hue:number) {
			setHue(hue)
			render()
		},
		destroy
	}
}
