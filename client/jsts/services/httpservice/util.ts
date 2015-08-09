export function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		const error = new Error(response.statusText);
		throw error;
	}
}

export function parseJSON(response) {
	return response.json();
}