import { glsl } from "../../glsl"
import { ColorConversionUtils, CommonUniforms } from '../../shaders/utils.fragment'

export default glsl`#version 300 es

precision highp float;

${ CommonUniforms }
${ ColorConversionUtils }

in vec4 a_color;
in vec4 a_position;
in vec2 a_texcoord;
out vec4 v_color;
out vec2 v_texcoord;

uniform float aspect_ratio;
uniform int total_leds;
uniform mat4 projection;
mat4 view = mat4(1.0);

void main() {
	int id = gl_InstanceID;

	float f_total_leds = float(total_leds);
	float pos = float(id) / (f_total_leds - 1.);

	float offset = (0.25) - (aspect_ratio / resolution.x) * resolution.x;
	mat4 position_matrix = mat4(
		1, 0,					 0, 0,
		0, 1,					 0, 0,
		0, 0,					 1, 0,
		(-offset) + (pos * offset * 2.), 0, 0, 1
	);

	float scale = pow(3.0 * min(1.0, resolution.x / (f_total_leds * (resolution.y*0.5))), 0.65);
	mat4 scale_matrix = mat4(
		scale, 0,									 0, 0,
		0, 									scale, 0, 0,
		0, 								  0,			  					 1, 0,
		0, 									0, 									 0, 1
	);

  gl_Position = projection * view * position_matrix * scale_matrix * a_position;

	// Set vertex color
	v_color = a_color;
	v_texcoord = a_texcoord;
}
`