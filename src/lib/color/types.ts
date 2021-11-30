export type ColorHEX = string
export type ColorRGB = { r:number, g:number, b:number }
export type ColorHSV = { h:number, s:number, v:number }

export type ColorRGBA = ColorRGB & { a:number }
export type ColorHSVA = ColorHSV & { a:number }

export type ColorAny = ColorHEX|ColorRGB|ColorRGBA|ColorHSV|ColorHSVA