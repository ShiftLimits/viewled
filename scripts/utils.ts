export function toHexString(buffer:Buffer, per_line:number = 16) {
	const lines:string[] = []

	for (let i = 0; i < buffer.length; i += per_line) {
		let line_hex_values = Array.from(buffer.slice(i, i + per_line), value => `0x${ value.toString(16).padStart(2, '0') }`)
		lines.push(`  ${ line_hex_values.join(', ') }`)
	}

	return lines.join(',\n')
}

export function buildWLEDServerRoute(route:string, file:string, mimetype:string) {
	return `  server.on("${ route }", HTTP_GET, [](AsyncWebServerRequest *request){
		if (handleIfNoneMatchCacheHeader(request)) return;
		AsyncWebServerResponse *response = request->beginResponse_P(200, "${ mimetype }", ${ file }, ${ file }_L);
		response->addHeader(F("Content-Encoding"),"gzip");
		setStaticContentCacheHeaders(response);
		request->send(response);
	});`
}

export function makeStringVariableSafe(string:string) {
	return string.replace(/[^a-zA-Z\d_]/g, '_')
}