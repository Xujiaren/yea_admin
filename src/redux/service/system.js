import request from '../../util/net';

export function publishAdmin({mobile, password,realname,role_id,status,username,user_id,dept,regionId,company_no}) {
	return request.post('/system/adminuser/publish', {
		mobile, password,realname,role_id,status,username,user_id,dept,regionId,company_no
	})
}

export function getAdmin(page,role_id,keyword) {
	return request.get('/system/adminuser/', {
		role_id:role_id,
		page:page,
		keyword:keyword
	})
}

export function removeAdmin({user_id}) {
	return request.delete('/system/adminuser/' + user_id, {
	})
}

export function updateAdmin({user_id}) {
	return request.post('/system/adminuser/'+user_id, {
		user_id:user_id
	})
}
export function deleteAdmin({action,user_id}) {
	return request.post('/system/adminuser/'+user_id, {
		action
	})
}

///////////ROlE
export function publishRole({is_system,name,role_id,rule,status}) {
	return request.post('/system/adminrole/publish', {
		is_system,name,role_id,rule,status
	})
}

export function getRole() {
	return request.get('/system/adminrole', {
	})
}
export function getRoleInfo({role_id}) {
	return request.get('/system/adminrole/'+role_id, {
	})
}

export function updateRole({action,role_id}) {
	return request.post('/system/adminrole/' + role_id, {
		action,role_id
	})
}
///////////LOG
export function getLog(page,keyword,pageSize) {
	return request.get('/system/logs', {
		page:page,
		keyword:keyword,
		pageSize:pageSize
	})
}
///////////Rank

export function getRank(page,keyword,pageSize) {
	return request.get('/system/rank/region', {
		page:page,
		keyword:keyword,
		pageSize:pageSize
	})
}
export function publishRank({region_id,is_show}) {
	return request.post('/system/rank/region', {
		region_id,is_show
	})
}
export function deleteRank({region_id,action}) {
	return request.post('/system/rank/region/update', {
		region_id,action
	})
}
export function getAdresses() {
	return request.get('/system/region/list', {
	})
}
export function getAdressesList() {
	return request.get('/system/region/list', {
	})
}
export function postNewUser({mobile,userName}) {
	return request.get('/system/adminuser/info', {
		mobile,userName
	})
}
export function postNewPsd({password,user_id}) {
	return request.post('/system/adminuser/modify', {
		password,user_id
	})
}
export function getCompanyList({}) {
	return request.get('/system/company/list', {
	})
}
export function getExRole({is_system}) {
	return request.get('/system/adminrole', {
		is_system
	})
}
export function postExAdmin({role_id,user_id,type}) {
	return request.post('/system/band/adminrole/'+role_id, {
		user_id,type
	})
}
export function getExAdmin({apply_role_id,enter_role_id,keyword,page,pageSize,role_id}) {
	return request.get('/system/adminuser', {
		apply_role_id,enter_role_id,keyword,page,pageSize,role_id
	})
}
export function deleteExAdmin({user_id,type}) {
	return request.post('/system/del/band/adminrole', {
		user_id,type
	})
}