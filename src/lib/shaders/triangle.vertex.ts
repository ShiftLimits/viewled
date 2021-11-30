import { glsl } from '../glsl'

export default glsl`#version 300 es

precision highp float;

void main() {
	float x = float((gl_VertexID & 1) << 2);
	float y = float((gl_VertexID & 2) << 1);
	gl_Position = vec4(x - 1.0, y - 1.0, 0, 1);
}
`
