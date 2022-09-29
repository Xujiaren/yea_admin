import request from '../../util/net';



export function exportSquadScore({
    squad_id,type
}) {
    if(type=='unpass')
        return request.get('/certification/export/user/unpass', {
            squad_id,
        })
    else
        return request.get('/certification/class/score/export', {
            squad_id,
        })
}

export function getSquadScore({
    squad_id,
    keyword,
    page,
    pageSize
}) {
	return request.get('/certification/class/score', {
		squad_id,
        keyword,
        page,
        pageSize
	})
}

export function importAuthPaperTopic({
	url,
    category_id,
    type,
    paper_id,
    ctype
}) {
    if(type=='paper'){
        return request.post('/certification/import/'+type, {
            url,
            category_id,
            paper_id,
            ctype,
        })
    }
	return request.post('/certification/import/'+type, {
		url,
        category_id,
        ctype,
	})
}

export function getAuthTopic({
    ctype,
    paper_id,
    topic_id,
    category_id,
    keyword,
    page,
    pageSize
}) {
	return request.get('/certification/topic', {
        ctype,
		paper_id,
        topic_id,
        category_id,
        keyword,
        page,
        pageSize
	})
}
export function publishAuthTopic({
    ctype,
	paper_id,
    topic_id,
    ttype,
    mtype,
    answers,
    analysis,
    options,
    category_id,
    title,
    url,
}) {
	return request.post('/certification/topic/publish', {
        ctype,
		paper_id,
        topic_id,
        ttype,
        mtype,
        answers,
        analysis,
        options,
        category_id,
        title,
        url,
	})
}
export function actionAuthTopic({topic_id}) {
	return request.post(`/certification/option/delete`, {
		topic_ids:topic_id
	})
}

export function actionAuthPaper({paper_id,action}) {
	return request.post(`/certification/paper/${paper_id}`, {
		paper_id,action
	})
}

export function getAuthPaper({ctype,paper_id,keyword,page,pageSize}) {
	return request.get('/certification/paper', {
        ctype,
		paper_id,
        keyword,
        page,
        pageSize
	})
}

export function publishAuthPaper({
    ctype,
	paper_id,
    ptype,
    paper_name,
    teacher_id,
    course_id,
    chapter_id,
    cchapter_id,
    num,
    examed,
    total,
    score,
    duration,
    status,
    category_id,
    topic_ids,
    design,
    percentage
}) {
	return request.post('/certification/paper/publish', {
        ctype,
        percentage,

		paper_id,
        ptype,
        paper_name,
        teacher_id,
        course_id,
        chapter_id,
        cchapter_id,
        num,
        examed,
        total,
        score,
        duration,
        status,
        category_id,
        topic_ids,
        design
	})
}
export function getAuthClass({keyword,stype,status,cataegory_id,page,pageSize}) {
	return request.get(`/certification/class`, {
		keyword,stype,status,cataegory_id,page,pageSize
	})
}

export function publishAuthClass({
	squad_id,
    squad_name,
    squad_img,
    stype,
    begin_time,
    end_time,
    localtion,
    link,
    content,
    summary,
    enroll_num,
    is_volunteer,
    status,
    category_id,
    paper_ids,
    apply_begin,
    apply_end,

    pass_number,

}) {
	return request.post('/certification/class/publish', {
		squad_id,
        squad_name,
        squad_img,
        stype,
        begin_time,
        end_time,
        localtion,
        link,
        content,
        summary,
        enroll_num,
        is_volunteer,
        status,
        category_id,
        paper_ids,
        apply_begin,
        apply_end,

        pass_number,
	})
}
export function actionAuthClass({action,squad_id}) {
    return request.post(`/certification/class/${squad_id}`, {
        action,squad_id
    })
}


export function getAuthCate({keyword,ctype}) {
	return request.get(`/certification/category`,{
        keyword,ctype
    })
}
export function publicAuthCate({is_must, link,category_id, category_name, status ,action, ctype}) {
	return request.post(`/certification/course/categoty`, {
       is_must, link,category_id, category_name, status ,action, ctype
	})
}

export function getAuthCourse({course_id,category_id,keyword,page,pageSize}) {
	return request.get('/certification/course', {
		course_id,category_id,keyword,page,pageSize
	})
}
export function publishAuthCourse({
	course_id,
    course_name,
    sn,
    course_img,
    category_id,
    ccategory_id,
    flag,
    teacher_id,
    teacher_name,
    ttype,
    ctype,
    is_series,
    summary,
    content,
    score,
    room_id,
    size,
    duration,
    begin_time,
    end_time,
    media_id,
    integral,
    is_recomm,
    is_shop,
    can_share,
    sort_order,
    status,
    is_must,

}) {
	return request.post('/certification/course/publish', {
		course_id,
        course_name,
        sn,
        course_img,
        category_id,
        ccategory_id,
        flag,
        teacher_id,
        teacher_name,
        ttype,
        ctype,
        is_series,
        summary,
        content,
        score,
        room_id,
        size,
        duration,
        begin_time,
        end_time,
        media_id,
        integral,
        is_recomm,
        is_shop,
        can_share,
        sort_order,
        status,
        is_must,

	})
}
export function actionAuthCourse({action,course_id}) {
    return request.post(`/certification/course/${course_id}`, {
        action,course_id
    })
}

