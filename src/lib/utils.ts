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