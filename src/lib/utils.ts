export function debounceAnimationFrame<F extends (...args:any[]) => any>(fn:F) {
	let animation_frame:number;
	return function(...args:Parameters<F>) {
		cancelAnimationFrame(animation_frame)
		return new Promise<ReturnType<F>>(res => {
			animation_frame = requestAnimationFrame(() => res(fn(...args)))
		})
	}
}

export function clamp(n:number, min:number, max:number) {
	return Math.min(max, Math.max(min, n))
}

export function hexToBytes(hex:string) {
	const bytes:number[] = []
	for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substr(i, 2), 16) / 255)
	bytes.push(1)
	return bytes
}

// Source and credit: https://github.com/toji/gl-matrix/blob/master/src/mat4.js#L1707
export function ortho(left:number, right:number, bottom:number, top:number, near:number, far:number) {
	const out = Array.from<number>({length:16})
  const lr = 1 / (left - right);
  const bt = 1 / (bottom - top);
  const nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
