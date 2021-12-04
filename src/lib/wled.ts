import { WLEDClientState } from 'wled-client'

export function createGradientCSSFromState(state:WLEDClientState, color_stops:([number,number,number,number]|string)[]) {
	// Make sure we have at least 2 stops
	if (color_stops.length == 0) return '' // If no stops are passed, return empty string
	if (color_stops.length == 1) { // If only one has been passed, copy it to the end
		color_stops[1] = color_stops[0] // Clone first stop
		if (Array.isArray(color_stops[1])) color_stops[1][0] = 255 // Set stop to end position if it is an array
	}

	let percent:number|undefined, r:number|undefined, g:number|undefined, b:number|undefined
	let stop:[number,number,number,number]|string
	const css_color_stops:string[] = []
	for (let stop_index in color_stops) {
		stop = color_stops[stop_index]
		if (Array.isArray(stop)) {
			percent = stop[0]/255 * 100
			r = stop[1]
			g = stop[2]
			b = stop[3]
		} else if (stop == 'r') { // Random color
			r = Math.round(Math.random() * 255)
			g = Math.round(Math.random() * 255)
			b = Math.round(Math.random() * 255)
		} else {
			let color = parseInt(stop[1]) - 1 // `c1` -> index `0`
			let segment = state.segments[state.mainSegmentId!].colors![color]
			if (segment) {
				r = segment[0]
				g = segment[1]
				b = segment[2]
			}
		}

		if (percent == undefined) percent = parseInt(stop_index) / color_stops.length * 100
		css_color_stops.push(`rgb(${ r }, ${ g }, ${ b }) ${ percent }%`)
	}

	return `linear-gradient(90deg, ${css_color_stops.join(', ')})`
}