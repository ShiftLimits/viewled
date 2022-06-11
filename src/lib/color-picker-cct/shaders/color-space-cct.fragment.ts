import { glsl } from '../../glsl'
import { QuadraticBezierUtils, ColorConversionUtils, CommonUniforms } from '../../shaders/utils.fragment'

export default glsl`#version 300 es

precision highp float;

${ CommonUniforms }
${ ColorConversionUtils }
${ QuadraticBezierUtils }
out vec4 color;

uniform float kelvin_min;
uniform float kelvin_max;

void main() {
	vec2 uv = gl_FragCoord.xy/resolution;
	vec2 uv_from_center = ((uv*2.0) - 1.0);

	float thickness = 0.12;
	vec2 start_point = vec2(-0.8, -0.125);
	vec2 control_point = vec2(0., 0.375);
	vec2 end_point = vec2(0.8, -0.125);

	vec2 b = mapBezier(uv_from_center, start_point, control_point, end_point, 0.0, 1.0, true);

	float distance_to_curve = 10000.0;
	distance_to_curve = abs(b.x) - thickness;
	float i = smoothstep(0.05, 0.045, distance_to_curve);

	// float t = 1.0;//1.0-((1.2+b.x*2.8)/2.);
	float kelvin = mix(kelvin_min, kelvin_max, b.y);
	color = vec4(cct2rgb(kelvin), i);
}
`