import { glsl } from '../../glsl'
import { ColorConversionUtils, CommonUniforms } from '../../shaders/utils.fragment'

export default glsl`#version 300 es

precision highp float;

${ CommonUniforms }
${ ColorConversionUtils }
out vec4 color;

uniform float hue;

void main() {
	vec2 uv = gl_FragCoord.xy/resolution;
	vec2 uv_from_center = ((uv*2.0) - 1.0);

	float angle = (atan(uv_from_center.y, uv_from_center.x) + PI) / (PI*2.); // same as atan2
	vec2 polar = vec2(length(uv_from_center), angle);


	float inside_radius = 0.5;
	float outside_radius = 1.0;
	color = vec4(hsv2rgb(
		vec3(
			polar.y,
			(polar.x - inside_radius) / (outside_radius - inside_radius),
			1.0
		)
	), 1.0);

	// Outer cut off
	color.a = mix(0.0, 1.0, 1.0 - smoothstep(outside_radius-0.005, outside_radius, polar.x));
	// Inner cut off
	color.a = mix(color.a, 0.0, 1.0 - smoothstep(inside_radius-0.005, inside_radius, polar.x));
}
`