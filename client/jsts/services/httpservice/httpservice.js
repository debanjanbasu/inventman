'use strict';
import { checkStatus, parseJSON } from './util';
export class HttpService {
    static serve(url, method, headers, body) {
        return window.fetch(url, {
            method: method,
            headers: headers,
            body: body
        })
            .then(checkStatus)
            .then(parseJSON)
            .catch(error => {
            console.log(error.message);
            return error;
        });
    }
}
//# sourceMappingURL=httpservice.js.map