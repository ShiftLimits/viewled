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
  vec3 corrected_hsv = vec3(raw_hsv.x, pow(raw_hsv.y, 0.125), pow(raw_hsv.z, 0.125));
  
  vec3 c = mix(vec3(corrected_hsv.x, 0.0, corrected_hsv.z), corrected_hsv, pow(smoothstep(0.0, 0.5, d), 0.75));
  vec3 rgb = hsv2rgb(c);

  float brightness_falloff = 1.0 * max(0.0, min(1.0, (10.0 / aspect_ratio)));// * min(1.0, resolution.x / (float(total_leds) * (resolution.y*0.5)));//0.125*aspect_ratio;

  // float grey = (0.33 * v_color.r + 0.33 * v_color.g + 0.33 * v_color.b);
  // // grey = 1.0 - pow(1. / (5. * grey + 1.), 2.);
  // vec4 c = vec4(grey, grey, grey, 1.0);
  // vec3 c = mix(vec3(pow(hsv.z, 0.125)), rgb, smoothstep(0.3, 1.0, pow(d, 0.25)));
  out_color = mix(vec4(rgb, pow(raw_hsv.z, brightness_falloff)), vec4(rgb, 0.0), pow(smoothstep(0.1, 1.0, d), 0.12 - raw_hsv.z*0.05));
}
`