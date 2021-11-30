import { glsl } from '../../glsl'
import { ColorConversionUtils, CommonUniforms } from '../../shaders/utils.fragment'

export default glsl`#version 300 es

precision highp float;

${ CommonUniforms }
${ ColorConversionUtils }
out vec4 color;

uniform float saturation;
uniform float value;

void main() {
	vec2 uv = gl_FragCoord.xy/resolution;

	color = vec4(
		hsv2rgb(
			vec3(
				uv.y,
				saturation,
				value
			)
		),
		1.0
	);
}
`