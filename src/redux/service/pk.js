import request from '../../util/net';


export function getPkMatchRank({page,pageSize,match_id}) {
	return request.get(`/pk/rank/${match_id}`, {
        match_id,
        page,
        pageSize,
	})
}

export function getPkMatchReward({match_id,page,pageSize}) {
	return request.get('/pk/reward/'+match_id, {
		page,pageSize
	})
}
export function getPkMatchaward({match_id}) {
	return request.get('/pk/award', {
		match_id
	})
}
export function setPkMatchReward({json,match_id}) {
	return request.post('/pk/award', {
		json,match_id
	})
}



export function getPkMatch({mtype,match_id,page,pageSize}) {
	return request.get('/pk/match', {
		mtype,match_id,page,pageSize
	})
}
export function actionPkMatch({action,match_id}) {
	return request.post(`/pk/match/${match_id}`, {
		action,match_id
	})
}
export function setPkMatch({
    begin_time,
    end_time,
    match_img,
    match_name,
    flag,
    match_id,
    mtype,
    rule,
    status
}) {
	return request.post('/pk/match', {
        begin_time,
        end_time,
        match_img,
        match_name,
        flag,
        match_id,
        mtype,
        rule,
        status
	})
}
//
export function getPkLevel({keyword,page,pageSize}) {
	return request.get('/pk/level', {
		keyword,page,pageSize
	})
}
export function setPkLevel({
    begin_point,
    end_point,
    level_img,
    level_name,
    share_integral,
    levelId,
    status
}) {
	return request.post('/pk/level', {
		begin_point,
        end_point,
        level_img,
        level_name,
        share_integral,
        leveId: levelId,
        status
	})
}
export function getPkcategories({keyword}) {
	return request.get('/pk/categories', {
		keyword
	})
}
export function postPkcategories({category_name,category_id,status}) {
	return request.post('/pk/category', {
		category_name,category_id,status
	})
}
export function deletePkcategories({category_id,action}) {
	return request.post('/pk/category/'+category_id, {
		action
	})
}
export function getPkpaper({category_id,keyword,page,pageSize,status}) {
	return request.get('/pk/topics', {
		category_id,keyword,page,pageSize,status
	})
}