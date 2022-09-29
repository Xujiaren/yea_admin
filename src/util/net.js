import qs from 'qs';
import config from '../config/config';

function filterStatus(response) {
	if ((response.status >= 200 && response.status < 300 )|| response.status == 404|| response.status == 500 || response.status == 400) {
		return response
	} else {
		if(response.statusText){
			let error = new Error(response.statusText);
			error.response = response;
			error.type = 'http';
			throw error;
		}else{
			console.log(response)
		}
	}
}

function filterJSON(response) {
	return response.json();
}

function filterResult(result) {
	const {errorCode,errorMsg,resultBody,status,message,codeErrorMsg} = result
	if(typeof(message) !== "undefined" && typeof(status) !== "undefined"){
		if(status == 500) throw message
		if(status == 404) throw message
	}else if(typeof(errorCode) !== "undefined"){

		if (errorCode == '2'||errorCode == '1'||errorCode == '401') {
			if(typeof codeErrorMsg !== "undefined" && escape(codeErrorMsg).indexOf( "%u" ) > -1){
				throw codeErrorMsg
			}
			else{
				throw errorMsg;
			}
		} else if(errorCode == '200'){
			if(errorMsg)
				return errorMsg
			else
				return resultBody;
		} else {
			if(errorMsg)
				throw errorMsg
			else
				return resultBody;
		}
	}
}
function filterLoginResult(result) {
	if (result.errorCode == '1'||result.errorCode == '401') {
		throw result.errorMsg;
	} else {
		return result
	}
}
export default {
	
	get(url, params, generalUrl) {
		url = config.api + url;

		var cp = '?';
		if (url.indexOf(cp) > -1) {
			cp = '&';
		}

		if (params) {
			url += `${cp}${qs.stringify(params)}`;
		}

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`GET: `, url);
			console.info(`Params: `, params);
		}
		if(generalUrl){
			const hash = window.location.hash
			const searchIndex = window.location.hash.indexOf('?')
			let path = ''

			if(searchIndex > -1){
				path = hash.slice(0,searchIndex)
			}else{
				path = hash
			}

			window.location.replace(window.location.origin + path + `${cp}${qs.stringify(params)}`)
		}

		return fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then(filterStatus).then(filterJSON).then(filterResult);
	},
	get_qrcode(url, params) {
		url = config.host + url;

		var cp = '?';
		if (url.indexOf(cp) > -1) {
			cp = '&';
		}

		if (params) {
			url += `${cp}${qs.stringify(params)}`;
		}

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`GET: `, url);
			console.info(`Params: `, params);
		}

		return fetch(url, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then(filterStatus).then(filterJSON);
	},
	post(url, params) {
		url = config.api + url;

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`POST: `, url);
			console.info(`Params: `, params);
		}

		return fetch(url, {
			method: 'post',
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify(params)
		}).then(filterStatus).then(filterJSON).then(filterResult);
	},
	upload(url, params) {
		url = config.api + url;
		// if (params.course_id) {
		// 	url += `?${qs.stringify(params.course_id)}`;
		// }

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`POST: `, url);
			console.info(`Params: `, params);
		}

		return fetch(url, {
			method: 'post',
			mode: 'cors',
			credentials: 'include',
		
			body: params.file
		}).then(filterStatus).then(filterJSON).then(filterResult);
	},

	patch(url, params) {
		url = config.api + url;

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`PATCH: `, url);
			console.info(`Params: `, params);
		}

		return fetch(url, {
			method: 'PATCH',
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify(params)
		}).then(filterStatus).then(filterJSON).then(filterResult);
	},

	put(url, params) {
		url = config.api + url;

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`PUT: `, url);
			console.info(`Params: `, params);
		}

		return fetch(url, {
			method: 'PUT',
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify(params)
		}).then(filterStatus).then(filterJSON).then(filterResult);
	},

	delete(url, params) {
		url = config.api + url;

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`DELETE: `, url);
			console.info(`Params: `, params);
		}

		return fetch(url, {
			method: 'delete',
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify(params)
		}).then(filterStatus).then(filterJSON).then(filterResult);
	},
	post_login(url, params) {
		url = config.api + url;

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`POST: `, url);
			console.info(`Params: `, params);
		}

		return fetch(url, {
			method: 'post',
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify(params)
		}).then(filterStatus).then(filterJSON).then(filterLoginResult);
	},
	get_live(type,url, params) {
		url = config.chat_room + url;

		var cp = '?';
		if (url.indexOf(cp) > -1) {
			cp = '&';
		}

		if (params) {
			url += `${cp}${qs.stringify(params)}`;
		}

		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			console.info(`GET: `, url);
			console.info(`Params: `, params);
		}
		// let myHeaders = new Headers({
		// 	'Access-Control-Allow-Origin': '*',
		// 	'Content-Type': 'text/plain'
		// });

		if(type == 'action')
			return fetch(url, {
				method: 'get',
				mode: 'no-cors',
				credentials: 'include',
			}).then(() => []).then(body => {
				return body
			});
		else
			return fetch(url, {
				method: 'get',
				mode: 'cors',
				credentials: 'include',
				// headers:myHeaders
			}).then(response => response.json()).then(body => {
				return body
			});
	}
	
};