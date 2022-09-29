import {message} from 'antd'
export default function errorAction({dispatch}) {
	return next => action => {
		const { meta = {}, error, payload } = action;
		if(payload=='please login first'&&window.location.hash.indexOf('/userCheck')==-1){
			if(window.location.href.indexOf('login')==-1&&window.location.href.indexOf('todo-list')==-1){
				message.info({
					content:'当前账户已被其他人登录，请重新登录',
					duration:2
				})
			}
			window.location.href = window.location.origin+'/#/login'
		}else if(error){
			message.error(JSON.stringify(payload))
		}else{
			next(action);
		}
	}
}