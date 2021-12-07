import { glsl } from '../glsl'

export const CommonUniforms = glsl`
#define PI 3.1415926535897932384626433832795
#define TAU PI*2.0

uniform vec2 resolution;
`

export const CommonUtils = glsl`
#define EPSILON 0.000001

bool approximately(float a, float b) {
	return abs(a - b) <= EPSILON;
}
`

export const ColorConversionUtils = glsl`
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec3 cct2rgb(float kelvin) {
	kelvin = clamp(kelvin, 1000., 40000.) / 100.;
	return vec3(
		kelvin <= 66. ? 1.0 : clamp(329.698727446 * (pow(kelvin - 60., -0.1332047592)), 0., 255.) / 255.,
		kelvin <= 66. ?	clamp(99.4708025861 * log(kelvin) - 161.1195681661, 0., 255.) / 255. : clamp(288.1221695283 * (pow(kelvin - 60., -0.0755148492)), 0., 255.) / 255.,
		kelvin >= 66. ? 1.0 : kelvin <= 19. ? 0. : clamp(138.5177312231 * log(kelvin - 10.) - 305.0447927307, 0., 255.) / 255.
	);
}
`

//
// Awesome quadratic bezier functions by Shadertoy user oneshade
// Source: https://www.shadertoy.com/view/NdfSDl
export const QuadraticBezierUtils = glsl`
// Evaluates the parametric equation of a quadratic bezier
// ---> a(1-t)^2 + 2b(1-t)t + ct^2
vec2 posBezier(in vec2 a, in vec2 b, in vec2 c, in float t) {
	float tInv = 1.0 - t;
	return a * tInv * tInv + b * 2.0 * t * tInv + c * t * t;
}

// vec2(shortest distance, parameter of closest point)
// clampRes flags whether the results should be held in the range [tmin, tmax]
float dot2(in vec2 v) { return dot(v, v); }
vec2 mapBezier(in vec2 p, in vec2 v1, in vec2 v2, in vec2 v3, in float tmin, in float tmax, in bool clampRes) {
    vec2 c1 = p - v1;
    vec2 c2 = 2.0 * v2 - v3 - v1;
    vec2 c3 = v1 - v2;

    // Cubic coefficients ---> t3*t^3 + t2*t^2 + t1*t + t0*t^0
    float t3 = dot(c2, c2);
    float t2 = dot(c3, c2) * 3.0;
    float t1 = dot(c1, c2) + 2.0 * dot(c3, c3);
    float t0 = dot(c1, c3);

    // Reduce by dividing by leading coefficient
    // This simplifies out a lot of things
    t2 /= t3, t1 /= t3, t0 /= t3;

    // Depressed cubic coefficients (p and q) and precomputation
    float t22 = t2 * t2;
    vec2 pq = vec2(t1 - t22 / 3.0, t22 * t2 / 13.5 - t2 * t1 / 3.0 + t0);
    float ppp = pq.x * pq.x * pq.x, qq = pq.y * pq.y;

    float p2 = abs(pq.x);
    float r1 = 1.5 / pq.x * pq.y;

    // Solutions and details gathered from here: https://en.wikipedia.org/wiki/Cubic_equation
    if (qq * 0.25 + ppp / 27.0 > 0.0) { // One real root, use hyperbolic trig
        float r2 = r1 * sqrt(3.0 / p2), root;
        if (pq.x < 0.0) root = sign(pq.y) * cosh(acosh(r2 * -sign(pq.y)) / 3.0);
        else root = sinh(asinh(r2) / 3.0);
        root = -2.0 * sqrt(p2 / 3.0) * root - t2 / 3.0;
        if (clampRes) root = clamp(root, tmin, tmax);
        return vec2(length(p - posBezier(v1, v2, v3, root)), root);
    }

    else { // Three real roots (only need to use two), use "normal" trig
        float ac = acos(r1 * sqrt(-3.0 / pq.x)) / 3.0; // 4pi/3 goes here --v
        vec2 roots = 2.0 * sqrt(-pq.x / 3.0) * cos(vec2(ac, ac - 4.18879020479)) - t2 / 3.0;
        if (clampRes) roots = clamp(roots, tmin, tmax);
        float d1 = dot2(p - posBezier(v1, v2, v3, roots.x));
        float d2 = dot2(p - posBezier(v1, v2, v3, roots.y));
        return d1 < d2 ? vec2(sqrt(d1), roots.x) : vec2(sqrt(d2), roots.t);
    }
}
`
