import request from '../../util/net';


export function getTeacherLevel({level_id}) {
	return request.get('/user/teacher/level', {
		level_id
	})
}
export function actionTeacherLevel({action,level_id}) {
	return request.post('/user/teacher/level/update', {
		action,level_id
	})
}
export function setTeacherLevel({exchange,level_id,level_img,level_name}) {
	return request.post('/user/teacher/level/publish', {
		exchange,level_id,level_img,level_name
	})
}
//


export function getUserBySn({sn}) {
	return request.get('/user/user/usersn',{
		sn
	})
}

export function importTeacherCourseData({file_url}) {
	return request.post('/user/teacher/level/import', {
		file_url
	})
}
export function exportTeacherApply({type,level,status,wtype,keyword,teacher_id,company_no}) {
	
	return request.get('/user/teacher/export',{
		type,level,status,wtype,keyword,teacher_id,company_no
	})
}
export function importTeacherApply({file_url}) {
	return request.post('/user/teacher/import', {
		file_url
	})
}


////

export function changeTeacherLevel({check_id,level}) {
	return request.post('/user/teacher/rate/update', {
		check_id,level
	})
}

export function getCheckList({ctype,content_id	}) {
	return request.get('/user/admin/role', {
		ctype,content_id
	})
}
////
export function getApplySetting({keyy,section}) {
	return request.get('/user/check', {
		keyy,section
	})
}
export function publishApplySetting({val,keyy,section}) {
	return request.post('/user/check/num', {
		val,keyy,section
	})
}


export function getTeacherApply({filter,check_id,apply_id,type,page,pageSize,status,keyword,company_no}) {
	if(filter=='rank'){
		if(!check_id){check_id = apply_id}
		return request.get('/user/teacher/level/enter', {
			check_id,status,page,pageSize,keyword,company_no
		})
	}
	else{
		return request.get('/user/teacher/apply', {
			apply_id,type,page,pageSize,keyword,company_no
		})
	}
		
}
export function setTeacherApply({user_id,content_id,mobile,sn,name,age,sex,service,edu,province,category_ids,strong,train_exp,self_exp,train_cert,photo}) {
	return request.post('/user/teacher/apply/publish', {
		user_id,content_id,mobile,sn,name,age,sex,service,edu,province,category_ids,strong,train_exp,self_exp,train_cert,photo
	})
}
export function actionTeacherApply({type,apply_id,action,status,reason}) {
	if(type=='rank'){
		return request.post('/user/level/enter/update', {
			check_id:apply_id,action,status,reason
		})
	}
	return request.post('/user/teacher/apply/update', {
		apply_id,action,status,reason
	})
}

export function getTeacher({wtype,keyword, page,pageSize,level}) {
	return request.get('/user/teacher', {
		wtype:wtype,
		keyword: keyword,
		page: page,
		pageSize:pageSize,
		level:level
	})
}
export function getTeachers({wtype,keyword, page,pageSize,level,status}) {
	return request.get('/user/teacher', {
		wtype:wtype,
		keyword: keyword,
		page: page,
		pageSize:pageSize,
		level:level,
		status:status
	})
}
export function getTeacherInfo(id) {
	return request.get('/user/teacher/'+id, {
	})
}
export function getTeacherInfos({id,page}) {
	return request.get('/user/teacher/'+id, {
		page:page
	})
}
export function updateTeacher({teacher_id}) {
	return request.post('/user/teacher/' + teacher_id, {
		action:'status',
		teacher_id:teacher_id
	})
}
export function updateTeachers({teacher_id,action}) {
	return request.post('/user/teacher/' + teacher_id, {
		action:action,
		teacher_id:teacher_id
	})
}
export function removeTeacher({teacher_id}) {
	return request.post('/user/teacher/' + teacher_id, {
		action:'delete',
		teacher_id:teacher_id
	})
}

export function recommonTecher({teacher_id,leader_recomm_index,action,endTime}) {
	return request.post('/user/teacher/leader', {
		teacher_id,
		leader_recomm_index,
		action
	})
}
export function publishTeacher({
	content, 
	gallery,
	honor,
	level,
	mobile,
	sex,
	status,
	teacher_img,
	teacher_user_img,
	teacher_name,
	teacher_id,
	user_id,
	video,
	recommIndex,
	teaching_field,
	is_perfect,
	sn,
	work_sn,
	wtype,
	beginTime,
	endTime
	}) {
	return request.post('/user/teacher/publish', {
		sn,teaching_field,is_perfect,recommIndex,video,user_id,status,content,gallery,honor,level,mobile,sex,teacher_img,teacher_user_img,teacher_name,teacher_id,work_sn,wtype,beginTime,endTime
	})
}
export function getTeacherSheng({teacherId}) {
	return request.get('/user/teacher/level/history/'+teacherId, {
	})
}
export function postTeacherBind({teacher_id,user_id}) {
	return request.post('/user/teacher/bind/user', {
		teacher_id,user_id
	})
}