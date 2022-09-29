import request from '../../util/net';

export function getUserClassById({user_id}) {
	return request.get(`/squad/squad/user/in/`, {
		user_id
	})
}
export function sighSquadUser({user_id,squad_id,type}) {
    if(type=='new_apply')
        return request.post(`/squad/user/squad/apply`, {
            user_id,squad_id
        })
	return request.post(`/squad/user/apply/${user_id}`, {
		user_id,squad_id
	})
}
export function exportSquadUser({squad_id,status}) {
	return request.get('/squad/user/apply/export', {
		squad_id,status
	})
}
export function importSquadUser({file}) {
	return request.upload('/squad/user/apply/import', {
		file
	})
}

export function getSquadCourse({squad_id,keyword,page,pageSize}) {
	return request.get('/squad/course/'+squad_id, {
		squad_id,keyword,page,pageSize
	})
}

export function actionSquadCourse({action,squad_id,course_id}) {
    return request.post('/squad/course/'+squad_id, {
        action,squad_id,course_id
    })
}


export function actionSquadUser({action,squad_id,user_ids}) {
    return request.post('/squad/user/'+squad_id, {
        action,squad_id,user_ids
    })
}

export function getSquadImportUser({squad_id}) {
    return request.get('/squad/user/apply/import/user', {
        squad_id
    })
}

export function getSquadUser({squad_id,keyword,page,pageSize,type,status}) {
    if(type == 'cert'){
        return request.get('/certification/squaduser', {
            squad_id,keyword,page,pageSize
        })
    }else{
        return request.get('/squad/user/'+squad_id, {
            squad_id,keyword,page,pageSize,status
        })
    }
}

export function actionSquad({action,squad_id}) {
	return request.post('/squad/squad/'+squad_id, {
		action,squad_id
	})
}

export function getSquadInfo({squad_id,type}) {
    if(type=='cert')
        return request.get('/certification/class',{
            squad_id
        })
	return request.get('/squad/squad/'+squad_id)
}

export function getSquad({keyword,stype,status,pageSize,page,type}) {
    let url = '/squad/squad'
    if(type == 'cert'){
        url = '/certification/class'
    }
    return request.get(url, {
		keyword,stype,status,pageSize,page
	})
}

export function publishSquad({
	squad_id,
    squad_name,
    squad_img,
    stype,
    begin_time,
    end_time,
    apply_begin,
    apply_end,
    location,
    link,
    content,
    summary,
    enroll_num,
    is_volunteer,
    status,
    category_id,
    topic_ids,
    pass_number,
    percentage,
    pcategory_ids,
    can_share,
}) {
	return request.post('/squad/squad/publish', {
		squad_id,
        squad_name,
        squad_img,
        stype,
        begin_time,
        end_time,
        apply_begin,
        apply_end,
        location,
        link,
        content,
        summary,
        enroll_num,
        is_volunteer,
        status,
        category_id,
        topic_ids,
        pass_number,
        percentage,
        pcategory_ids,
        can_share,
	})
}

export function publishSquadss({
	squad_id,
    squad_name,
    squad_img,
    stype,
    begin_time,
    end_time,
    apply_begin,
    apply_end,
    location,
    link,
    content,
    summary,
    enroll_num,
    is_volunteer,
    status,
    category_id,
    topic_ids,
    pass_number,
    percentage,
    pcategory_ids,
    can_share,
    flag,
}) {
	return request.post('/squad/squad/publish', {
		squad_id,
        squad_name,
        squad_img,
        stype,
        begin_time,
        end_time,
        apply_begin,
        apply_end,
        location,
        link,
        content,
        summary,
        enroll_num,
        is_volunteer,
        status,
        category_id,
        topic_ids,
        pass_number,
        percentage,
        pcategory_ids,
        can_share,
        flag,
	})
}
export function publishSquads({squad_id, user_ids}) {
	return request.post(`/squad/user/apply/import/deleteuser`, {
        squad_id, user_ids
	})
}

