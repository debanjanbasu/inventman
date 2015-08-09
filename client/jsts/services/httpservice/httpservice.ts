'use strict';
import {checkStatus, parseJSON} from './util';
export class HttpService {
	static serve(url, method, headers, body) {
		return window.fetch(url, {
			method: method,
			headers: headers,
			body: body
		}
			)
			.then(checkStatus)
			.then(parseJSON)
			.catch(error => {
				// Any error other than login, maybe some network disruption!!
				console.log(error.message);
				return error;
			});
	}
}
