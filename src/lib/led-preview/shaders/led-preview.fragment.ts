import { glsl } from "../../glsl"
import { ColorConversionUtils, CommonUniforms } from "../../shaders/utils.fragment"

export default glsl`#version 300 es

precision highp float;

${ CommonUniforms }
${ ColorConversionUtils }
in vec4 v_color;
in vec2 v_texcoord;
out vec4 out_color;

uniform float aspect_ratio;

void main() {
  float d = length(v_texcoord * 2. - 1.);
  vec3 raw_hsv = rgb2hsv(v_color.rgb);
  vec3 corrected_hsv = vec3(raw_hsv.x, pow(raw_hsv.y, 1.0), pow(raw_hsv.z, 0.25));

  vec3 c = mix(vec3(corrected_hsv.x, min(corrected_hsv.y, 0.4), corrected_hsv.z), corrected_hsv, smoothstep(0.12, 0.225, d));
  vec3 rgb = hsv2rgb(c);
  // vec3 rgb = hsv2rgb(corrected_hsv);

  float brightness_falloff = 1.0 * max(0.0, min(1.0, (10.0 / aspect_ratio)));

  out_color = mix(vec4(rgb, corrected_hsv.z), vec4(rgb, 0.0), smoothstep(0.4, 1.0, pow(d, 0.2))); //mix(vec4(rgb, pow(raw_hsv.z, brightness_falloff)), vec4(rgb, 0.0), pow(smoothstep(0.1, 1.0, d), 0.12 - raw_hsv.z*0.05));
}
`