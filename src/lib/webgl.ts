import ScreenCoveringTriangleVertexSource from './shaders/triangle.vertex'
import { debounceAnimationFrame } from './utils'

export function createShaderProgram(canvas:HTMLCanvasElement, vertex_source:string, fragment_source:string) {
	const gl = canvas.getContext("webgl2", { premultipliedAlpha: false })
	if (!gl) throw new Error('Unable to get WebGL context.')

	const device_pixel_ratio = window.devicePixelRatio || 1

	// Create shaders
	const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex_source)
	const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment_source)

	// Create program
	const program = createProgram(gl, vertex_shader, fragment_shader)
	if (!program) throw new Error('Unable to create shader program')

	// Set up common program uniforms
	const setResolution = createUniform(gl, program, '2fv', 'resolution')

	// Make sure the gl context is using the program
	gl.useProgram(program)

	// Create resize observer on the canvas to re-render it as it moves around
	const resize_observer = new ResizeObserver(() => debounceAnimationFrame(render))
	resize_observer.observe(canvas)

	// This function runs the webgl program
	function render(draw = true) {
		if (!gl) return

		// Resize viewport to DOM resolution and set resolution uniform
		const canvas_rect = canvas.getBoundingClientRect()
		const width = canvas.width = canvas_rect.width * device_pixel_ratio
		const height = canvas.height = canvas_rect.height * device_pixel_ratio

		gl.viewport(0, 0, width, height)
		setResolution([width, height])

		if (draw) gl.drawArrays(gl.TRIANGLE_FAN, 0, 3) // Draw

		return {
			width, height,
			ratio: width/height
		}
	}

	function destroy() {
		if (!gl) return

		let ext = gl.getExtension('WEBGL_lose_context')
		if (ext) ext.loseContext()
	}

	return {
		gl,
		render,
		destroy,
		createUniform: (type:WebGLUniformType, name:string) => createUniform(gl, program, type, name),
		createAttribute: (name:string) => createAttribute(gl, program, name),
		setResolution
	}
}

export function createFragmentProgram(canvas:HTMLCanvasElement, fragment_source:string) {
	return createShaderProgram(canvas, ScreenCoveringTriangleVertexSource, fragment_source)
}

export function createShader(gl:WebGL2RenderingContext, type:number, source:string) {
	let shader = gl.createShader(type)
	if (!shader) throw new Error('Unable to create shader1')

	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (!success) {
		console.log(source)
		console.error(gl.getShaderInfoLog(shader))
		throw new Error('Unable to create shader2')
	}


	return shader
}

export function createProgram(gl:WebGL2RenderingContext, vertex_shader:WebGLShader, fragment_shader:WebGLShader) {
	let program = gl.createProgram()
	if (!program) throw new Error('Unable to create program')

	gl.attachShader(program, vertex_shader)
	gl.attachShader(program, fragment_shader)
	gl.linkProgram(program)

	let success = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (!success) throw new Error('Unable to create program')

	return program
}

export type WebGLUniformType = '1f'|'1fv'|'1i'|'1iv'|'1ui'|'1uiv'|'2f'|'2fv'|'2i'|'2iv'|'2ui'|'2uiv'|
															 '3f'|'3fv'|'3i'|'3iv'|'3ui'|'3uiv'|'4f'|'4fv'|'4i'|'4iv'|'4ui'|'4uiv'|
															 'Matrix2fv'|'Matrix2x3fv'|'Matrix2x4fv'|
															 'Matrix3fv'|'Matrix3x2fv'|'Matrix3x4fv'|
															 'Matrix4fv'|'Matrix4x2fv'|'Matrix4x3fv'

export function createUniform(gl:WebGL2RenderingContext, program:WebGLProgram, type:WebGLUniformType, name:string) {
	let location = gl.getUniformLocation(program, name)
	return function setUniform(...args) {
		return gl[`uniform${type}`](location, ...args)
	}
}

export function createAttribute(gl:WebGL2RenderingContext, program:WebGLProgram, name:string) {
	let location = gl.getAttribLocation(program, name)
	return location
}

const buffers:Map<WebGL2RenderingContext, WebGLBuffer[]> = new Map()
function addBuffer(gl:WebGL2RenderingContext, buffer:WebGLBuffer) {
	let gl_buffers = buffers.get(gl) || []
	buffers.set(gl, [...gl_buffers, buffer])
}

export function releaseBuffers(gl:WebGL2RenderingContext) {
	for (let buffer of buffers.get(gl) || []) gl.deleteBuffer(buffer)
	buffers.set(gl, [])
}

export function createBuffer(gl:WebGL2RenderingContext, data:ArrayBufferView | ArrayBuffer | null, usage:number = gl.STATIC_DRAW) {
	const buffer = gl.createBuffer()
	if (!buffer) throw new Error('Unable to create buffer')

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, usage)
	addBuffer(gl, buffer)

	return buffer
}
