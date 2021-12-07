import { createShaderProgram, createBuffer } from '../webgl';
import LEDPreviewVertexSource from './shaders/led-preview.vertex'
import LEDPreviewFragmentSource from './shaders/led-preview.fragment'
import { hexToBytes, ortho } from '../utils';

const gradient_stop_interpolation_shape_n_vertices = 6
const gradient_stop_interpolation_shape_data = new Float32Array([
	-1, -1,
	 1, -1,
	-1,  1,
	-1,  1,
	 1, -1,
	 1,  1,
])

const shape_texcoords_data = new Float32Array([
	0, 1,
	1, 1,
	0, 0,
	0, 0,
	1, 1,
	1, 0,
])

export function createLEDPreviewShader(canvas:HTMLCanvasElement) {
	const { gl, createUniform, createAttribute, render, destroy } = createShaderProgram(canvas, LEDPreviewVertexSource, LEDPreviewFragmentSource)
	gl.enable(gl.BLEND)
	gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

	const color_attribute_location = createAttribute('a_color')
	const position_attribute_location = createAttribute('a_position')
	const texcoord_attribute_location = createAttribute('a_texcoord')

	const setAspectRatio = createUniform('1f', 'aspect_ratio')
	const setTotalLEDs = createUniform('1i', 'total_leds')
	const setProjectionMatrix = createUniform('Matrix4fv', 'projection')
	const gradient_stop_interpolation_buffer = createBuffer(gl, gradient_stop_interpolation_shape_data)
	const texcoords_buffer = createBuffer(gl, shape_texcoords_data)

	gl.bindBuffer(gl.ARRAY_BUFFER, texcoords_buffer)
	gl.enableVertexAttribArray(texcoord_attribute_location)
	gl.vertexAttribPointer(texcoord_attribute_location, 2, gl.FLOAT, false, 0, 0)

	return {
		render(leds:string[]) {
			const { height, width, ratio } = render(false)

			setAspectRatio(ratio)
			setTotalLEDs(leds.length)
			setProjectionMatrix(false, ortho(-(ratio||1), (ratio||1), -1, 1, -1, 1))

			const indice_colors = leds.flatMap(hexToBytes)
			let colors_buffer = createBuffer(gl, Float32Array.from(indice_colors))
			gl.bindBuffer(gl.ARRAY_BUFFER, colors_buffer)
			gl.enableVertexAttribArray(color_attribute_location)
			gl.vertexAttribPointer(color_attribute_location, 4, gl.FLOAT, false, 0, 0)
			gl.vertexAttribDivisor(color_attribute_location, 1)

			// Attach shape
			gl.bindBuffer(gl.ARRAY_BUFFER, gradient_stop_interpolation_buffer)
			gl.enableVertexAttribArray(position_attribute_location)
			gl.vertexAttribPointer(position_attribute_location, 2, gl.FLOAT, false, 0, 0)

			// const brightness_falloff = 0.75 * Math.max(0, Math.min(1.0, (10 / ratio)));
			// console.log(brightness_falloff)

			// Draw Stops
			gl.drawArraysInstanced(
				gl.TRIANGLES,
				0,	// offset
				gradient_stop_interpolation_shape_n_vertices,	// num vertices per instance
				leds.length,	// num instances
			)
		},
		destroy
	}
}
