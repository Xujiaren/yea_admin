import request from '../../util/net';

export function getTaskLog({keyword,page,pageSize}) {
	return request.get('/user/task/history',{
		keyword,page,pageSize
	})
}

export function getTask({task_level,keyword,page,pageSize,taskId}) {
	return request.get('/user/task',{
		task_level,keyword,page,pageSize,taskId
	})
}
export function actionTask({
	task_id,
	action
}) {
	return request.post('/user/task/update',{
		task_id,
		action
	})
}
export function setTask({
	task_id,
	task_name,
	task_level,
	begin_time,
	end_time,
	integral,
	task_limit,
	task_img,
	task_summary,
}) {
	return request.post('/user/task/publish',{
		task_id,
		task_summary,
		task_name,
		task_level,
		begin_time,
		end_time,
		integral,
		task_limit,
		task_img,
	})
}


export function getHelp({category_id,keyword,page,pageSize}) {
	return request.get('/operate/helps', {
		category_id,keyword,page,pageSize
	})
}
export function setHelp({help_id,category_id,title,content,status}) {
	return request.post('/operate/help/publish', {
		help_id,category_id,title,content,status
	})
}
export function actionHelp({help_id,action}) {
	return request.post('/operate/help/'+help_id, {
		help_id,action
	})
}



export function getFile({keyword,type,folder_id}) {
	if(type=='top')
		return request.get('/dashboard/folder', {
			keyword
		})
	else
		return request.get('/dashboard/folder/detail', {
			folder_id
		})
}
export function setFile({folder_name,parent_id,type,material_id,folder_id,link,title,ftype,ctype}) {
	if(type=='folder')
		return request.post('/dashboard/folder/publish', {
			folder_name,parent_id,folder_id
		})
	else
		return request.post('/dashboard/material/publish', {
			folder_id,material_id,link,title,ftype,ctype
		})
}
export function actionFile({material_id,type,folder_id,action}) {
	if(type=='folder')
		return request.post('/dashboard/folder/delete', {
			folder_id,action
		})
	else
		return request.post('/dashboard/material/delete', {
			material_id,action
		})
}

export function getUserChat({page,pageSize}) {
	return request.get('/chat/list',{
		page,pageSize
	})
}

export function getUserChatInfo({chat_id,page,pageSize}) {
	return request.get('/chat/message', {
		chat_id,page,pageSize
	})
}

export function login({vaildCode,acc_type, account, password}) {
	return request.post_login('/site/login', {
		acc_type : acc_type, 
		account : account, 
		password : password,
		vaildCode:vaildCode
	})
}

export function logout({}) {
	return request.get('/site/logout', {

	})
}

export function getConfirmImg() {
	return request.get('/site/getCaptchaImage', {
	})
}

export function upload({file,file_type}) {
	return request.post('/site/upload/', {
		file,file_type
	})
}
export function mediaAction({video_id,action}) {
	return request.post('/site/vod/video/', {
		video_id,action
	})
}
export function getUploadAuth({file,type,video_id,title}) {
	return request.post('/site/uploadAuth', {
		file,type,video_id,title
	})
}

export function user() {
	return request.post('/system/adminuser/role/', {

	})
}
export function upLodings({video_id}) {
	return request.post('／site/sub/transcode', {
		video_id:video_id
	})
}
