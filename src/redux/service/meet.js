import request from '../../util/net';

export function getMood({keyword,page,pageSize,status}) {
	return request.get('/meet/mood', {
		keyword,
        page,
        pageSize,
        status
	})
}

export function getMoods({keyword,page,pageSize,status}) {
	return request.get('/meet/mood', {
		keyword,
        page,
        pageSize,
        status
	})
}
export function getMoodss({keyword,page,pageSize,status}) {
	return request.get('/meet/mood', {
		keyword,
        page,
        pageSize,
        status
	})
}
export function publishMood({mood_id,status,}) {
    return request.post('/meet/mood/update/'+mood_id, {
        status,
    })
}
export function getMoment({keyword,page,pageSize}) {
	return request.get('/meet/moments', {
		keyword,
        page,
        pageSize,
	})
}
export function getMom({articleId}) {
    return request.get('/meet/moment/'+articleId,{
    })
}
export function publishMoment({
    title,
    article_img,
    content,
    files,
    content1,
    ftype,
    name,
    article_id, 
    durations,
    downId,
    img_url}) {
    return request.post('/meet/moment/publish', {
        title,
        article_img,
        content,
        files,
        content1,
        ftype,
        name,
        article_id, 
        durations,
        downId, 
        img_url
    })
}
export function publishMoments({title,article_img,content,article_id, files,content1,name,img_url,downId,sort_order}) {
    return request.post('/meet/moment/publish', {
        title,
        article_img,
        content,
        article_id ,
        files,
        content1,
        name,
        img_url,
        downId,
        sort_order
    })
}
export function publishMom({article_id,action,}) {
    return request.post('/meet/moment/'+article_id, {
        action,
    })
}
export function publishPv({down_id,action,}) {
    return request.post('/meet/moment/update/'+down_id, {
        action,
    })
}
export function getTasks({keyword,page,pageSize,taskId}) {
	return request.get('/meet/task', {
        taskId,
		keyword,
        page,
        pageSize,
	})
}
export function publishTask({begin_time,end_time,etype,integral,link,task_img,task_level,task_limit,task_name,task_summary,status,parentId}) {
    return request.post('/meet/task/publish', {
        begin_time,
        end_time,
        etype,
        integral,
        link,
        task_img,
        task_level,
        task_limit,
        task_name,
        task_summary,
        status,
        parentId
    })
}
export function publishTasks({begin_time,end_time,etype,integral,link,task_id,task_img,task_level,task_limit,task_name,task_summary,status,tag_id}) {
    return request.post('/meet/task/publish', {
        begin_time,
        end_time,
        etype,
        integral,
        link,
        task_id,
        task_img,
        task_level,
        task_limit,
        task_name,
        task_summary,
        status,
        tag_id
    })
}
export function getCourseLs({category_id,ccategoryId,live_status,page,pageSize,sort}) {
	return request.get('/meet/course', {
		category_id,
        ccategoryId,
        live_status,
        page,
        pageSize,
        sort
	})
}
export function deleteTask({action,task_id}) {
    return request.post('/meet/task/update', {
        action,
        task_id
    })
}
export function postTagUser({file_url}) {
    return request.post('/meet/import/tagUser', {
        file_url,
        
    })
}
export function deleteTagUser({tag_id,user_ids}) {
    return request.post('/meet/delete/tagUser', {
        tag_id,
        user_ids
    })
}
export function getOuts({begin_time}) {
	return request.get('/meet/mood/export', {
        begin_time
	})
}
export function getOutss({begin_time}) {
	return request.get('/meet/export', {
        begin_time
	})
}
export function getOutsss({course_id}) {
	return request.get('/meet/class/score/export', {
        course_id
	})
}
export function changeTagUser({newtag_id,tag_id,user_id}) {
    return request.post('/meet/modify/tagUser', {
        newtag_id,
        tag_id,
        user_id
    })
}
export function getOutTag({tag_id,is_auth}) {
	return request.get('/meet/export/unauth', {
        tag_id,is_auth
	})
}
export function getCourseUserss({tag_id,is_auth,keyword,page,pageSize}) {
	return request.get('/meet/import/tag/user', {
        tag_id,is_auth,keyword,page,pageSize
	})
}
export function postMomentTime({gallery_id,duration}) {
    return request.post('/meet/gallery/set/duration/'+gallery_id, {
        duration
    })
}