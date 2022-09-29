import {createAction} from 'redux-actions';
import * as siteService from '../service/site';

const {	
	HELP_GET,
	HELP_ACTION,
	HELP_PUBLISH,
	GET_FILE,
	ACTION_FILE,
	PUBLISH_FILE,
	CHAT_LIST,
	CHAT_INFO,
	GET_CONFIRM_IMG_M,
	LOGIN, 
	LOGOUT,
	UPLOAD,
	GET_ROLE,
	GET_CONFIRM_IMG,
	MEDIA_ACTION,
	UPLOAD_AUTH_GET,
	SITE_CHANGE,
	TASK_GETSSS,
} = require('../key').default;



export const getTaskLog = createAction('getTaskLog',siteService.getTaskLog, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTask = createAction('getTask',siteService.getTask, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
// export const getTask = createAction(TASK_GETSSS, async(task_level,keyword,page,pageSize,taskId) => {
// 	const data = await siteService.getTask({task_level,keyword,page,pageSize,taskId});
// 	return data;
// });
export const actionTask = createAction('actionTask',siteService.actionTask, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const setTask = createAction('setTask',siteService.setTask, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
////
export const changeSite = createAction(SITE_CHANGE,(value)=>value, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getHelp = createAction(HELP_GET,siteService.getHelp, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const actionHelp = createAction(HELP_ACTION, siteService.actionHelp, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const setHelp = createAction(HELP_PUBLISH, siteService.setHelp, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
///

export const getFile = createAction(GET_FILE,siteService.getFile, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const actionFile = createAction(ACTION_FILE, siteService.actionFile, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const setFile = createAction(PUBLISH_FILE, siteService.setFile, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
///
export const getUserChat = createAction(CHAT_LIST,siteService.getUserChat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUserChatInfo = createAction(CHAT_INFO, siteService.getUserChatInfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getConfirmImg = createAction(GET_CONFIRM_IMG, async() => {
	const data = await siteService.getConfirmImg();
	return data;
});

export const getConfirmImgM = createAction(GET_CONFIRM_IMG_M,siteService.getConfirmImg, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getAdminInfo = createAction(GET_ROLE, siteService.user, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const user = createAction(GET_ROLE, async() => {
	const data = await siteService.user();
	if(typeof (data) !== 'object'){
		data = {}
	}
	if(Object.keys(data).indexOf('rule')>-1){
		if(data.rule.indexOf('|||'>-1)){
			const res = data.rule.split('|||')
			let rule = []
			res.map(ele=>{
				rule = [...rule,...ele.split(',')]
			})
			data.rule = rule
		}else{
			data.rule = data.rule.split(',')
		}
		
		if(data.rule == "*"){
			data.rule = ["*"]
		}
	}
	return data;
},(params={resolved:null,rejected:null}) => {
	const {resolved,rejected} = params
	if(resolved&&rejected)
	return {
		resolved,
		rejected
	}
});

export const login = createAction(LOGIN, siteService.login, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const logout = createAction(LOGOUT, siteService.logout, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUploadAuth= createAction(UPLOAD_AUTH_GET, siteService.getUploadAuth, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


export const mediaAction= createAction(MEDIA_ACTION, siteService.mediaAction, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const upload= createAction(UPLOAD, siteService.upload, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const upLodings= createAction('upLodings', siteService.upLodings, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});