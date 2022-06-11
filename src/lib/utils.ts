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

export function deepEqual(x:object, y:object) {
  const typeof_x = typeof x, typeof_y = typeof y

  return (x && y && typeof_x === 'object' && typeof_x === typeof_y) ? (
    Object.keys(x).length === Object.keys(y).length && Object.keys(x).every(key => deepEqual(x[key], y[key]))
  ) : (x === y)
}

export function deepMerge(target:object, ...sources:object[]) {
	for (let source of sources) {
		for (let property in source) {
			let value = source[property]
			if (typeof value == 'object' && value !== null) {
				target[property] = target[property] || {}
				deepMerge(target[property], source[property])
			} else {
				target[property] = value
			}
		}
	}
}
