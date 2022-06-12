import { createFragmentShaderCanvas } from 'slgl'
import ColorSpaceFragmentSource from './shaders/color-space.fragment'
import HueFragmentSource from './shaders/hue.fragment'
import AlphaFragmentSource from './shaders/alpha.fragment'

export function createColorSpaceShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentShaderCanvas(canvas, ColorSpaceFragmentSource)

	const setHue = createUniform('1f', 'hue')

	return {
		render(hue:number) {
			setHue(hue)
			render()
		},
		destroy
	}
}

export function createHueWheelShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentShaderCanvas(canvas, HueFragmentSource)

	const setSaturation = createUniform('1f', 'saturation')
	const setValue = createUniform('1f', 'value')

	return {
		render(saturation:number, value:number) {
			setSaturation(saturation)
			setValue(value)
			render()
		},
		destroy
	}
}

export function createAlphaWheelShader(canvas:HTMLCanvasElement) {
	const { createUniform, render, destroy } = createFragmentShaderCanvas(canvas, AlphaFragmentSource)

	const setHue = createUniform('1f', 'hue')
	const setSaturation = createUniform('1f', 'saturation')
	const setValue = createUniform('1f', 'value')

	return {
		render(hue:number, saturation:number, value:number) {
			setHue(hue)
			setSaturation(saturation)
			setValue(value)
			render()
		},
		destroy
	}
}