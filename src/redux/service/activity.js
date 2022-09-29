import request from '../../util/net';

export function actionActivityResult({activity_id,join_id,gallery,gallerId,work_intro,work_name}) {
	return request.get(`/activity/activity/join/updata`, {
		activity_id,join_id,gallery,gallerId,work_intro,work_name
	})
}

export function exportActivityResult({activity_id}) {
	return request.get(`/activity/activity/result/export`, {
		activity_id,
	})
}


export function getActivity({activity_status,activity_id,atype,keyword,status,page,pageSize}) {
	return request.get(`/activity/activity`, {
		activity_status,activity_id,atype,keyword,status,page,pageSize
	})
}

export function getQuestionna({activity_id}) {
	return request.get(`/activity/questionnaire`, {
		activity_id,
	})
}

export function publishQuestionna({
	activity_id,
    topic_id,
    title,
    options,
    ttype
}) {
	return request.post('/activity/activity/questionnaire', {
		activity_id,
        topic_id,
        title,
        options,
        ttype
	})
}
export function publishQuestionnas({
	course_id,
    topic_id,
    title,
    options,
    ttype,
    stype
}) {
	return request.post('/course/course/questionnaire', {
		course_id,
        topic_id,
        title,
        options,
        ttype,
        stype
	})
}


export function publishActivity({
	activity_id,
    activity_img,
    flag,
    atype,
    title,
    rule,
    content,
    integral,
    ctype,
    begin_time,
    end_time,
    signend_time,
    voteend_time,

    show_time,
    show_vote,
    voteend_begin_time,
    status,
    etype,
    sub_title,
    can_share,
    only_modify_content
}) {
	return request.post('/activity/activity/publish', {
        etype,
		activity_id,
        activity_img,
        flag,
        atype,
        title,
        rule,
        content,
        integral,
        ctype,
        begin_time,
        end_time,
        signend_time,
        voteend_time,

        show_time,
        show_vote,
        voteend_begin_time,
        status,
        sub_title,
        can_share,
        only_modify_content
	})
}

export function getActivityResult({activity_id,type,page,pageSize}) {
	return request.get('/activity/activity/result', {
		activity_id,type,page,pageSize
	})
}
export function passActivityWork({join_id,type}) {
	return request.post('/activity/activity/works', {
		join_id,type
	})
}
export function importUser({file,activity_id,type}) {
    let url = '/activity/activity/vote/import'
    if(type==='theme')
        url = '/activity/activity/theme/import'
	return request.upload(url, {
		file,activity_id
	})
}

export function actionActivity({action,activity_id}) {
    return request.post('/activity/activity/update', {
        action,activity_id
    })
}


export function addVote({activity_id,option_id,option,url,integral,vtype}) {
    return request.post('/activity/activity/vote', {
        activity_id,option_id,option,url,integral,vtype
    })
}
export function getVoteList({activity_id}) {
    return request.get('/activity/activity/voteoptions', {
        activity_id
    })
}
export function actionVote({option_id}) {
    return request.post('/activity/activity/voteDelete', {
        option_id
    })
}

