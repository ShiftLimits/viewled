import { createFragmentShaderCanvas } from 'slgl'
import ColorSpaceCCTFragmentSource from './shaders/color-space-cct.fragment'

export function createColorSpaceCCTShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentShaderCanvas(canvas, ColorSpaceCCTFragmentSource)

	const setKelvinMin = createUniform('1f', 'kelvin_min')
	const setKelvinMax = createUniform('1f', 'kelvin_max')

	return {
		render(kevlin_min:number, kevlin_max:number) {
			setKelvinMin(kevlin_min)
			setKelvinMax(kevlin_max)
			render()
		},
		destroy
	}
}
