import request from '../../util/net';


export function exportCourseOrder({keyword,begin,end,user_id,mobile}) {
	return request.post('/course/courseOrder/export',{
		keyword,begin,end,user_id,mobile
	})
}

export function setCourseUpDownTime({course_ids,action,up_time,down_time}) {
	return request.post('/course/cron', {
		course_ids,action,up_time,down_time
	})
}
export function setCoursePaper({ltype,course_id,paper_id,paper_name}) {
	return request.post('/course/paper', {
		course_id,paper_id,paper_name,ltype
	})
}
export function getCoursePaper({course_id}) {
	return request.get('/course/paper', {
		course_id
	})
}
export function actionCoursePaper({course_id,paper_id}) {
	return request.post('/course/paper/del', {
		course_id,paper_id
	})
}

export function getCourseStat({course_ids,action,time_type, is_auth, type,course_id,begin_time,end_time,beginIndex,limit}) {
	if(type=='export'){
		return request.get(`/statistics/data/many/course/export`, {
			course_ids,action,time_type, is_auth,course_id,begin_time,end_time,type,beginIndex,limit
		})
	}
	return request.get(`/statistics/data/course/${course_id}`, {
		is_auth,course_id,begin_time,end_time,type
	})
}
export function getCourseStatNum() {
	return request.get('/statistics/data/many/course/total/num')
}
export function getStudyMapO2O() {
	return request.get('/course/map/o2o')
}

export function getStudyMap({type,level,level_id,map_id,page,pageSzie}) {
	return request.get('/course/map', {
		type,level,level_id,map_id,page,pageSzie
	})
}
export function setStudyMap({squad_id,type,level_id,map_id,step,paper_id,course_id,status,level,flag,content_sort,level_name}) {
	return request.post('/course/map/publish', {
		squad_id,type,level_id,map_id,step,paper_id,course_id,status,level,flag,content_sort,level_name
	})
}
export function actionStudyMap({level_id,action}) {
	return request.post('/course/map/update', {
		level_id,action
	})
}
export function importUserPublic({type,file_url,content_id,ctype}) {
	if(type === 'comm')
		return request.post('/comm/flag/import', {
			file_url,content_id,ctype,type
		})
	return request.post('/activity/user/apply/import', {
		file_url,content_id,ctype,type
	})
}
export function getImportUserPublic({content_id,ctype,type}) {
	if(type === 'comm')
		return request.get('/comm/flag/import', {
			content_id,ctype
		})
	return request.get('/activity/user/apply/import/user', {
		content_id,ctype
	})
}


export function getReTeacher() {
	return request.get('/user/teacher/recomm', {

	})
}
export function updateReTeacher({json}) {
	return request.post('/user/teacher/recomm', {
		json
	})
}


////////
export function getStaticCoursePreviewQrcode({course_id,ctype}) {
	return request.get_qrcode('/api/site/preview/', {
		course_id:course_id,
		ctype:ctype
	})
}
export function getCoursePreviewQrcode({course_id,ctype}) {
	return request.get_qrcode('/api/site/preview/', {
		course_id,ctype
	})
}
////////////////////
export function deleteCourse({course_ids}) {
	return request.post('/course/course/', {
		course_ids:course_ids
	})
}
export function downCourse({course_ids}) {
	return request.post('/course/course/soldOut/', {
		course_ids:course_ids,
	})
}
export function upCourse({course_ids}) {
	return request.post('/course/course/putAway/', {
		course_ids:course_ids,
	})
}
export function getCourse({ccategoryId,keyword, page,pageSize,category_id,ctype}) {
	return request.get('/course/course/', {
        ccategoryId:ccategoryId,keyword:keyword,category_id:category_id,page:page,ctype:ctype,pageSize:pageSize
	})
}
export function getCourselst({ccategoryId,keyword, page,pageSize,category_id,ctype}) {
	return request.get('/course/course/', {
        ccategoryId:ccategoryId,keyword:keyword,category_id:category_id,page:page,ctype:ctype,pageSize:pageSize
	})
}
export function getCourseInfo(course_id) {
	return request.get('/course/course/'+course_id, {
	})
}
export function getCourseInfos({course_id}) {
	return request.get('/course/course/'+course_id, {
	})
}
////直播导出用户

export function getCourseUser({is_auth,course_id,page,pageSize}) {
	return request.get('/course/import/user', {
		course_id,page,pageSize,is_auth
	})
}
export function getCourseUsers({is_auth,course_id,page,pageSize,keyword}) {
	return request.get('/course/import/user', {
		course_id,page,pageSize,is_auth,keyword
	})
}
export function exportCourseUser({course_id,course_name,begin_time,type,is_auth}) {
	if(type == 'customUser')
		return request.get('/course/export/unauth', {
			course_id,is_auth
		})
	return request.get('/course/export', {
		course_id,course_name,begin_time
	})
}
export function importCourseUser({file,course_id,type}) {
	return request.upload('/course/import', {
		file
	})
}
//http://perfect.whalew.com/chat/api/user/2
export function getStreamUrl({course_id,action}) {
	return request.get('/course/stream/',{
		course_id,action
	})
}
export function revertUser({course_id,uid}) {
	return request.get_live('action','/chat/api/revert/'+course_id,{
		uid
	})
}
export function getKickUserList({course_id}) {
	return request.get_live('get','/chat/api/kuser/'+course_id)
}

export function getRoomUserList({course_id}) {
	return request.get_live('get','/chat/api/user/'+course_id)
}
export function kickUser({course_id,uid}) {
	return request.get_live('action','/chat/api/leave/'+course_id, {
		uid
	})
}
export function cancelUser({course_id,id}) {
	return request.get_live('action','/chat/api/cancel/'+course_id, {
		id
	})
}
export function muteUser({course_id,uid,mtype}) {
	return request.get_live('action','/chat/api/mute/'+course_id, {
		uid,mtype
	})
}


/////直播商品广告

export function uploadLiveGoods({course_id,file}) {
	return request.upload('/course/live/goods/import', {
		course_id,file
	})
}
export function getLiveGoods({course_id,keyword}) {
	return request.get('/course/live/goods', {
        course_id,keyword
	})
}

export function actionLiveGoods({goods_id,action}) {
	return request.post('/course/live/goods/'+goods_id, {
		goods_id,action
	})
}
export function publishLiveGoods({goods_id,course_id,goods_name,goods_img,goods_price,goods_link,sort_order,status}){
	return request.post('/course/live/goods/publish', {
		goods_id,course_id,goods_name,goods_img,goods_price,goods_link,sort_order,status
	})
}
/////


/////直播广告

export function getLiveAd({course_id}) {
	return request.get('/course/live/director', {
        course_id
	})
}
export function removeLiveAd({course_id,ltype,director_id}) {
	return request.post('/course/live/director/del', {
		course_id,ltype,director_id
	})
}

export function publishLiveAd({
	link,course_id,ltype,media_id,begin_time,end_time,title,mtype,director_id,
	}){
	return request.post('/course/live/director/publish', {
		link,course_id,ltype,media_id,begin_time,end_time,title,mtype,director_id,
	})
}
/////
export function getLiveCourse({ccategoryId:ccategoryId, keyword, page,pageSize,category_id,ctype,live_status}) {
	return request.get('/course/course/', {
        ccategoryId:ccategoryId,keyword, page,pageSize,category_id,ctype,live_status
	})
}
export function getStaticCourse(ccategoryId, keyword, page,pageSize,category_id) {
	return request.get('/course/course/', {
        ccategoryId:ccategoryId,category_id:category_id,keyword:keyword,page:page,ctype:3,pageSize:pageSize
	})
}
export function removeCourse({course_id,course_ids}) {
	if(typeof course_ids == 'undefined')
		return request.post('/course/course/' + course_id, {
			action:'delete',
			course_id:course_id
		})
	else
		return request.post('/course/course/delete', {
			course_ids
		})
}
export function getSortChannel({position,data}) {
	return request.get('/system/sort/appIndex/'+position, {
		position,data
	})
}

export function sortChannel({position,data}) {
	return request.post('/system/sort/appIndex/'+position, {
		position,data
	})
}

export function recommCourse({channel_ids,course_ids,type}) {
	return request.post('/course/course/recomm/', {
		channel_ids:channel_ids,
		course_ids:course_ids,
		type:type
	})
}
// export function recommCourse({channel_ids,course_ids}) {
// 	return request.post('/course/' + course_id, {
// 		channel_ids:channel_ids,
// 		course_ids:course_ids
// 	})
// }
export function updateCourse({action,course_id}) {
	return request.post('/course/course/' + course_id, {
		action:action,
		course_id:course_id
	})
}

export function publishCourse({
	begin_url,begin_url_type,end_url,end_url_type,
	promote_begin,
	promote_end,
	promote_price,
	cost_price,
	market_price,
	tlevel,
	ulevel,
	tuser_tax,
	vuser_tax,
	user_tax,
	is_agent,
	level_integral,
	ctype, 
	category_id ,
	content,
	course_id,
	course_img,
	course_name,
	flag,
	integral,
	is_recomm,
	sn,
	room_id,
	sort_order,
    status,
	summary,
	tag_ids,
    teacher_id,
	ttype,
	is_series,
	score,
	images,
	begin_time,
	end_time,
	media_id,
	ccategory_id,
	duration,
	size,
	is_shop,
	teacher_name,
	can_share,
	notify,

	course_integral,
	course_cash,
	pay_type,
	ltype,
	plant,
	regionId,
	publish_type
	}) {
	return request.post('/course/course/publish/', {
		begin_url,begin_url_type,end_url,end_url_type,
		promote_begin,
		promote_end,
		promote_price,
		cost_price,
		market_price,
		tlevel,
		ulevel,
		tuser_tax,
		vuser_tax,
		user_tax,
		is_agent,
		
		level_integral,
		plant,
		ltype,
		course_integral,
		course_cash,
		pay_type,
		
		notify,
        ctype, 
		category_id ,
		content,
		course_id,
		course_img,
		course_name,
		flag,
		integral,
		is_recomm,
		sn,
		room_id,
		sort_order,
		status,
		summary,
		tag_ids,
		teacher_id,
		ttype,
		is_series,
		score,
		images,
		begin_time,
		end_time,
		media_id,
		ccategory_id,
		duration,
		size,
		is_shop,
		teacher_name,
		can_share,
		regionId,
		publish_type
	})
}
export function publishCour({
	begin_url,begin_url_type,end_url,end_url_type,
	promote_begin,
	promote_end,
	promote_price,
	cost_price,
	market_price,
	tlevel,
	ulevel,
	tuser_tax,
	vuser_tax,
	user_tax,
	is_agent,
	level_integral,
	ctype, 
	category_id ,
	content,
	course_id,
	course_img,
	course_name,
	flag,
	integral,
	is_recomm,
	sn,
	room_id,
	sort_order,
    status,
	summary,
	tag_ids,
    teacher_id,
	ttype,
	is_series,
	score,
	images,
	begin_time,
	end_time,
	media_id,
	ccategory_id,
	duration,
	size,
	is_shop,
	teacher_name,
	can_share,
	notify,

	course_integral,
	course_cash,
	pay_type,
	ltype,
	plant,
	can_bonus,
	free_chapter,
	shelves_time,
	}) {
	return request.post('/course/course/publish/', {
		begin_url,begin_url_type,end_url,end_url_type,
		promote_begin,
		promote_end,
		promote_price,
		cost_price,
		market_price,
		tlevel,
		ulevel,
		tuser_tax,
		vuser_tax,
		user_tax,
		is_agent,
		
		level_integral,
		plant,
		ltype,
		course_integral,
		course_cash,
		pay_type,
		
		notify,
        ctype, 
		category_id ,
		content,
		course_id,
		course_img,
		course_name,
		flag,
		integral,
		is_recomm,
		sn,
		room_id,
		sort_order,
		status,
		summary,
		tag_ids,
		teacher_id,
		ttype,
		is_series,
		score,
		images,
		begin_time,
		end_time,
		media_id,
		ccategory_id,
		duration,
		size,
		is_shop,
		teacher_name,
		can_share,
		can_bonus,
		free_chapter,
		shelves_time
	})
}
export function publishCoursess({
	begin_url,begin_url_type,end_url,end_url_type,
	promote_begin,
	promote_end,
	promote_price,
	cost_price,
	market_price,
	tlevel,
	ulevel,
	tuser_tax,
	vuser_tax,
	user_tax,
	is_agent,
	level_integral,
	ctype, 
	category_id ,
	content,
	course_id,
	course_img,
	course_name,
	flag,
	integral,
	is_recomm,
	sn,
	room_id,
	sort_order,
    status,
	summary,
	tag_ids,
    teacher_id,
	ttype,
	is_series,
	score,
	images,
	begin_time,
	end_time,
	media_id,
	ccategory_id,
	duration,
	size,
	is_shop,
	teacher_name,
	can_share,
	notify,

	course_integral,
	course_cash,
	pay_type,
	ltype,
	plant,
	courseware,
	}) {
	return request.post('/course/course/publish/', {
		begin_url,begin_url_type,end_url,end_url_type,
		promote_begin,
		promote_end,
		promote_price,
		cost_price,
		market_price,
		tlevel,
		ulevel,
		tuser_tax,
		vuser_tax,
		user_tax,
		is_agent,
		
		level_integral,
		plant,
		ltype,
		course_integral,
		course_cash,
		pay_type,
		
		notify,
        ctype, 
		category_id ,
		content,
		course_id,
		course_img,
		course_name,
		flag,
		integral,
		is_recomm,
		sn,
		room_id,
		sort_order,
		status,
		summary,
		tag_ids,
		teacher_id,
		ttype,
		is_series,
		score,
		images,
		begin_time,
		end_time,
		media_id,
		ccategory_id,
		duration,
		size,
		is_shop,
		teacher_name,
		can_share,
		courseware
	})
}
export function publishCourses({
	begin_url,begin_url_type,end_url,end_url_type,
	promote_begin,
	promote_end,
	promote_price,
	cost_price,
	market_price,
	tlevel,
	ulevel,
	tuser_tax,
	vuser_tax,
	user_tax,
	is_agent,
	level_integral,
	ctype, 
	category_id ,
	content,
	course_id,
	course_img,
	course_name,
	flag,
	integral,
	is_recomm,
	sn,
	room_id,
	sort_order,
    status,
	summary,
	tag_ids,
    teacher_id,
	ttype,
	is_series,
	score,
	images,
	begin_time,
	end_time,
	media_id,
	ccategory_id,
	duration,
	size,
	is_shop,
	teacher_name,
	can_share,
	notify,

	course_integral,
	course_cash,
	pay_type,
	ltype,
	plant,
	is_must
	}) {
	return request.post('/course/course/publish/', {
		begin_url,begin_url_type,end_url,end_url_type,
		promote_begin,
		promote_end,
		promote_price,
		cost_price,
		market_price,
		tlevel,
		ulevel,
		tuser_tax,
		vuser_tax,
		user_tax,
		is_agent,
		
		level_integral,
		plant,
		ltype,
		course_integral,
		course_cash,
		pay_type,
		
		notify,
        ctype, 
		category_id ,
		content,
		course_id,
		course_img,
		course_name,
		flag,
		integral,
		is_recomm,
		sn,
		room_id,
		sort_order,
		status,
		summary,
		tag_ids,
		teacher_id,
		ttype,
		is_series,
		score,
		images,
		begin_time,
		end_time,
		media_id,
		ccategory_id,
		duration,
		size,
		is_shop,
		teacher_name,
		can_share,
		is_must
	})
}

//////

export function getTagCourse(keyword,page,tag_id,pageSize) {
	return request.get('/course/tag/'+tag_id+'/course/', {
        keyword, page,tag_id,pageSize
	})
}
export function removeTagCourse({tag_id,course_id}) {
	return request.post('/course/tag/'+tag_id+'/course/'+course_id , {
		course_id :course_id 
	})
}
export function removeTagCourseAll({tag_id,course_ids}) {
	return request.post('/course/tag/'+tag_id+'/course/', {
		tag_id,course_ids
	})
}

export function getTag({keyword,page,ttype,pageSize}) {
	return request.get('/course/tag/', {
        keyword, page,ttype,pageSize
	})
}
export function getTags({keyword,page,ttype,pageSize}) {
	return request.get('/course/tag/', {
        keyword, page,ttype,pageSize
	})
}
export function removeTag({tag_id }) {
	return request.post('/course/tag/' + tag_id , {
		action:'delete',
		tag_id :tag_id 
	})
}
export function updateTag({tag_id }) {
	return request.post('/course/tag/' + tag_id , {
		action:'status',
		tag_id :tag_id 
	})
}

export function publishTag({
	status, 
	tag_id ,
	tagName ,
	ttype,
	}) {
	return request.post('/course/tag/publish/', {
        status, 
        tag_id ,
        tag_name:tagName ,
        ttype,
	})
}
//////

export function getCategory({keyword,page,cctype,ctype,pageSize,parent_id}) {
	return request.get('/course/category/', {
        keyword, page,cctype,ctype,pageSize,parent_id
	})
}
export function removeCategory({category_id }) {
	return request.post('/course/category/' + category_id , {
		action:'delete',
		category_id :category_id 
	})
}
export function updateCategory({category_id }) {
	return request.post('/course/category/' + category_id , {
		action:'status',
		category_id :category_id 
	})
}

export function publishCategory({
	parent_id,
	category_id, 
	category_name ,
	cctype ,
    ctype,
    sort_order,
    status
	}) {
	return request.post('/course/category/publish/', {
		parent_id,
        category_id, 
        category_name ,
        cctype ,
        ctype,
        sort_order,
        status
	})
}

//////

export function sortChannelCourse({sort_order,channel_id,course_id}) {
	return request.post('/course/channel/recomm/'+channel_id+'/'+course_id, {
		sort_order,channel_id,course_id
	})
}
export function getChannelInfo(keyword,page,channel_id,category_id,pageSize) {
	return request.get('/course/channel/'+channel_id+'/course/', {
        keyword, page,channel_id,pageSize,category_id
	})
}

export function getChannel(keyword,page,pageSize,flag) {
	return request.get('/course/channel/', {
        keyword, page,pageSize,flag
	})
}
export function getChannels(ctype,keyword,page,pageSize,flag) {
	return request.get('/course/channel/', {
        ctype,keyword, page,pageSize,flag
	})
}
export function removeChannel({channel_id }) {
	return request.post('/course/channel/' + channel_id , {
		action:'delete',
		channel_id :channel_id 
	})
}
export function updateChannel({action,channel_id }) {
	return request.post('/course/channel/' + channel_id , {
		action:action,
		channel_id :channel_id 
	})
}
export function downChannelCourse({channel_id,course_ids}) {
	return request.post('/course/channel/recomm/' + channel_id , {
		course_ids:course_ids,
		channel_id :channel_id 
	})
}
export function publishChannel({
	channel_id, 
	channel_name,
	ttype,
    sort_order,
	status,
	ctype,
	flag,
	teacher_id
	}) {
	return request.post('/course/channel/publish/', {
		flag,
        channel_id, 
        channel_name,
        ttype,
        sort_order,
		status,
		ctype,
		teacher_id
	})
}
export function publishChannels({
	channel_id, 
	channel_name,
	status,
	ctype,
	}) {
	return request.post('/course/channel/publish/', {
		channel_id:channel_id, 
		channel_name:channel_name,
		status:status,
		ctype:ctype,
	})
}
//////
export function deleteChapter({chapter_ids}) {
	return request.post('/course/chapter/delete', {
		chapter_ids
	})
}

export function getChapter(course_id,type) {
	return request.get('/course/chapters/', {
		course_id:course_id,
		type:type
	})
}
export function removeChapter({chapter_id}) {
	return request.post('/course/chapter/publish/' + chapter_id  , {
		action:'delete',
		chapter_id:chapter_id  
	})
}
export function updateChapter({chapter_id  }) {
	return request.post('/course/chapter/' + chapter_id, {
		action:'status',
		chapter_id:chapter_id  
	})
}

export function publishChapter({
	is_free,
	chapter_id, 
	chapter_name ,
	content ,
    course_id,
    duration,
    media_id,
    parent_id,
    status
	}) {
	return request.post('/course/chapter/publish/', {
		is_free,
        chapter_id, 
        chapter_name ,
        content ,
        course_id,
        duration,
        media_id,
        parent_id,
        status,
	})
}


//////

export function getComments({content_id,keyword,page,sort,status,pageSize,ctype}) {
	return request.get('/dashboard/comment/', {
		ctype:ctype,
		keywords:keyword,
		page:page,
		content_id:content_id,
		sort:sort,
		status:status,
		pageSize:pageSize
	})
}
export function replyComments({content_id,is_secret,content,comment_id,ctype}) {
	return request.post('/dashboard/'+content_id+'/'+comment_id+'/' , {
		content_id,is_secret,content,comment_id,ctype
	})
}
export function updateCommentsAll({comment_ids,status,reason }) {
	return request.post('/dashboard/comment/', {
		comment_ids,status,reason
	})
}


export function updateComments({action,comment_id }) {
	return request.post('/dashboard/comment/' + comment_id, {
		action:action,
		comment_id:comment_id  
	})
}
export function deleteCommentsAll({comment_ids}) {
	return request.post('/dashboard/comment/delete', {
		comment_ids
	})
}
export function topCommentsAll({comment_ids,is_top}) {
	return request.post('/dashboard/comment/top', {
		comment_ids,is_top
	})
}
export function publishActivelive({content,content_id,ctype,num,title,activity_id,begin_time,send_now}) {
	return request.post('/course/activity/publish', {
		content,content_id,ctype,num,title,activity_id,begin_time,send_now
	})
}
export function getActivelive({course_id,atype}) {
    return request.get('/course/activity', {
        course_id,atype
    })
}
export function publishFile({course_id,file}) {
	return request.post('/course/pdf/import', {
		course_id,
		file
	})
}
export function getQues({course_id,stype}) {
    return request.get('/course/questionnaire', {
        course_id,
		stype
    })
}
export function postMapMails({level_id}) {
	return request.post('/course/remind/map/send', {
		level_id
	})
}
export function getMainss({}) {
    return request.get('/course/map/main', {
    })
}
export function getMainsss({level,type,page}) {
    return request.get('/course/map', {
		level,type,page
    })
}
export function postWenjuan({course_id}) {
	return request.get('/course/course/result/export', {
		course_id
	})
}
export function getActrewards({activity_id,keyword,page,pageSize}) {
	return request.get('/course/activity/activityreward/'+activity_id, {
		keyword,page,pageSize
	})
}
export function postLiveOut({type,content_id,userId}) {
	return request.post('/course/live/save/user/log', {
		type,content_id,userId
	})
}
export function getMeetChannels({ctype,keyword,page,pageSize,flag}) {
	return request.get('/course/channel/', {
        ctype,keyword, page,pageSize,flag
	})
}
export function postLiveHudong({content,content_id,num,title,activity_id,begin_time}) {
	return request.post('/course/activity/question/publish', {
        content,content_id,num,title,activity_id,begin_time
	})
}
export function getCourseWatchUser({courseId}) {
	return request.get('/meet/course/user/export', {
		courseId
	})
}
export function checkCourseAsk({action,course_id}) {
	return request.get('/course/course/quest/isSubmit', {
		action,course_id
	})
}
export function checkMap({action,level_id}) {
	return request.get('/course/course/map/check', {
		action,level_id
	})
}
export function startEnd({course_id,time,type}) {
	return request.post('/course/start/end/live', {
		course_id,time,type
	})
}
export function startChat({course_id,status}) {
	return request.post('/course/live/audioChat/status', {
		course_id,status
	})
}