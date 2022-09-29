import request from '../../util/net';


export function getAllUserInfoStat({
	beginStr,endStr,ageType,sex,region_id
}) {
	return request.get(`/v2/statistics/YHGK`,{
		beginStr,endStr,ageType,sex,region_id
	})
}

export function getUserInfoStat({
	begin_time,end_time,user_id
}) {
	return request.get(`/statistics/data/user`,{
		begin_time,end_time,user_id
	})
}

export function exportAdexcel({
	begin_time,end_time
}) {
	return request.get(`/statistics/billboard/excel`,{
		begin_time,end_time
	})
}
export function getStatTeacherLevel({
	begin_time,end_time
}) {
	return request.get(`/statistics/teacher/level`,{
		begin_time,end_time
	})
}
export function getStatTeacherInfo({
	begin_time,end_time
}) {
	return request.get(`/statistics/teachers`,{
		begin_time,end_time
	})
}


export function getStatNews({time_type,article_id,is_auth,action,begin_time,end_time}) {
	return request.get(`/statistics/article/userReadCommentCollect/${article_id}`,{
		time_type,article_id,is_auth,action,begin_time,end_time
	})
}

export function getStatCourseRelearn({time_type,is_auth,action,begin_time,end_time}) {
	return request.get(`/statistics/study/again`,{
		time_type,is_auth,action,begin_time,end_time
	})
}
export function getStatCourseCateRelearn({category_id,is_auth,action,begin_time,end_time}) {
	return request.get(`/statistics/study/catgeory/again`,{
		is_auth,action,begin_time,end_time,category_id
	})
}

export function getStatCourseSingle({time_type,course_id,is_auth,action,begin_time,end_time}) {
	return request.get(`/statistics/course/${course_id}`,{
		time_type,course_id,is_auth,action,begin_time,end_time
	})
}

export function getStatUserSex() {
	return request.get('/statistics/numberbysex')
}

export function getCourseData({begin_time,end_time,limit,is_auth}) {
	return request.get('/statistics/course/learn', 
		{begin_time,end_time,limit,is_auth}
	)
}

export function getFeedData({time_type,begin_time,end_time,is_auth,action}) {
	return request.get('/statistics/feedback',{time_type,begin_time,end_time,is_auth,action})
}
export function getFeedExcel({keyword,begin_time,end_time,category_id,status,is_auth,region_id}) {
	return request.get('/statistics/feedback/export',{
		keyword,begin_time,end_time,category_id,status,is_auth,region_id
	})
}

export function getFeedLine({time_type,action,timeType,is_auth,begin_time,end_time}) {
	//type 0: 最近7天  1: 最近15天  2: 最近1月
	//返回的数据格式
	// resultBody:{
	// 	'2020-04-11':0,
	// 	'2020-04-12':0,
	// 	'2020-04-13':0,
	// 	'2020-04-14':0,
	// 	'2020-04-15':0,
	// 	'2020-04-16':0,
	// 	'2020-04-17':0
	// }
	return request.get('/statistics/feedback/line',{
		time_type,timeType,is_auth,begin_time,end_time,action
	})
}

export function getCoinInfo({time_type,begin_time,end_time,is_auth,action,region_id}) {
	return request.get('/statistics/integral/summary', 
		{time_type,begin_time,end_time,is_auth,action,region_id}
	)
}

export function getCoinConsume({time_type,action,begin_time,end_time,is_auth,region_id}) {
	return request.get('/statistics/integral/consume', 
		{time_type,action,begin_time,end_time,is_auth,region_id}
	)
}

export function getCoinOrigin({time_type,action,begin_time,end_time,is_auth,region_id}) {
	return request.get('/statistics/integral/get', 
		{time_type,action,begin_time,end_time,is_auth,region_id}
	)
}

//TODO
export function getRewardExcel({begin_time,end_time,activity_id,is_auth,region_id,ageType,idLevel,level,sex}) {
	return request.get('/statistics/reward/list',{
		begin_time,end_time,activity_id,is_auth,region_id,ageType,idLevel,level,sex
	})
}
export function getReward({activity_id,time_type,type,begin_time,end_time,is_auth,action}) {
	if(type=='all')
		return request.get('/statistics/reward/all',{
			time_type,begin_time,end_time,is_auth,action
		})
	return request.get('/statistics/reward',{
		activity_id,time_type,begin_time,end_time,is_auth,action
	})
}
export function getSenStat({time_type,action,begin_time,end_time,is_auth}) {
	return request.get('/statistics/sensitive',{
		time_type,action,begin_time,end_time,is_auth
	})
}


export function getStatCourseInfo({time_type,begin_time,end_time,is_auth}) {
	return request.get('/statistics/course', 
		{time_type,begin_time,end_time,is_auth}
	)
}

export function getUserEquity({action}) {
	return request.get('/statistics/user/equity',{
		action
	})
}
export function getUserTime({begin_time,is_auth,action,region_id,sex,time}) {
	return request.get('/statistics/user/time',{
		begin_time,is_auth,action,region_id,sex,time
	})
}
export function getUserDuration({action,begin_time,end_time,is_auth}) {
	return request.get('/statistics/user/duration',{
		begin_time,end_time,is_auth,action
	})
}

//TODO
export function getUserActive({begin_time,end_time,is_auth,action,region_id,sex}) {
	return request.get('/statistics/user/active',{
		begin_time,end_time,is_auth,action,region_id,sex
	})
}

export function getExpressStat({time_type,begin_time,end_time,is_auth,region_id}) {
	return request.get('/statistics/countOrderReturn',{
		time_type,begin_time,end_time,is_auth,region_id
	})
}

///////////////


export function getSenExcel({begin_time,end_time,is_auth,regionId}) {
	return request.get('/statistics/sensitive/excel',{
		begin_time,end_time,is_auth,regionId
	})
}



export function getUserStay({begin_time,end_time,type,is_auth,action,sex,region_id}) {
	return request.get('/statistics/user/stay',{
		begin_time,end_time,type,is_auth,action,sex,region_id
	})
}



export function getUserExcel() {
	return request.get('/statistics/user',{
	})
}




export function getCommentLine({time_type,is_auth, begin_time,end_time,region_id}) {
	//type 0: 最近7天  1: 最近15天  2: 最近1月
	return request.get('/statistics/course/comment/statistics',{
		time_type,is_auth, begin_time,end_time,region_id
	})
}



export function getCoinRank({page,pageSize,is_auth,action,begin_time,end_time,regionId}) {
	return request.get('/statistics/integral/rank',{page,pageSize,is_auth,action,begin_time,end_time,regionId})
}




export function getStatComment() {
	return request.get('/dashboard/stat/commentstatus', 
	)
}
export function getStatAuth() {
	return request.get('/dashboard/stat/userauth', 
	)
}
export function getStatCourse({sort,limit}) {
	return request.get('/dashboard/stat/course', 
		{sort,limit}
	)
}
export function getStatUser({timeType,action}) {
	return request.get('/dashboard/stat/users', {timeType,action})
}
export function getStatUserLevel() {
	return request.get('/dashboard/stat/userslevel', {})
}
export function getStatIntegral({timeType}) {
	return request.get('/dashboard/stat/integral', {timeType})
}
export function getStatFlag() {
	return request.get('/dashboard/stat/usersflag', {})
}
export function publishFeedCate({
		ctype,
		cctype,
		category_id,
		category_name,
		sort_order,
		status,
		link,
		summary
	}) {
	return request.post('/dashboard/category/publish', {
        ctype,
		cctype,
		category_id,
		category_name,
		sort_order,
		status,
		link,
		summary
	})
}
export function updateFeedCate({category_id,action}) {
	return request.post('/dashboard/category/'+category_id, {
		category_id,action
	})
}
export function getFeedCate({ctype,cctype,page,pageSize,keyword}) {
	return request.get('/dashboard/category', {
		ctype,cctype,page,pageSize,keyword
	})
}
export function getFeedCates({}) {
	return request.get('/dashboard/category/list', {

	})
}
/////////
export function getTodo() {
	return request.get('/dashboard/todos', {
	})
}
export function updatePost({reward_id,ship_sn}) {
	return request.post('/dashboard/activityreward/ship', {
		reward_id,ship_sn
	})
}

export function getPost({keywords,sort,status,page,pageSize,is_ship}) {
	return request.get('/dashboard/activityreward', {
		keywords,sort,status,page,pageSize,is_ship
	})
}


//////

export function deleteFeedback({feedback_ids,action,status}) {
	return request.post('/dashboard/feedback/delete', {
		feedback_ids,action,status
	})
}

export function getDoneFeedback({is_use,keyword,category_id,page,pageSize,status}) {
	return request.get('/dashboard/feedback', {
		is_use,keyword,category_id,page,pageSize,status
	})
}


export function getFeedback({is_use,keyword,category_id,page,pageSize,status}) {
	return request.get('/dashboard/feedback', {
		is_use,keyword,category_id,page,pageSize,status
	})
}

export function updateFeedback({feedback_id,action}) {
	return request.post('/dashboard/feedback/' + feedback_id, {
		action,
		feedback_id
	})
}

export function replyFeedback({feedback_id,reply,useful}) {
	return request.post('/dashboard/feedback/reply/' + feedback_id, {
		feedback_id,reply,useful
	})
}

export function getUserRanks({beginTime,endTime,limit,type}) {
	return request.get('/dashboard/UserRank', {
		beginTime,endTime,limit,type
	})
}
export function getAskExl({begin_time,end_time}) {
	return request.get('/statistics/ask/statistics', {
		begin_time,end_time
	})
}
export function getLiveExl({course_id}) {
	return request.get('/statistics/couse/live/info', {
		course_id
	})
}
export function getGuanjianziExl({is_auth,time_type,begin_time,end_time}) {
	return request.get('/statistics/hot/keywords/info', {
		is_auth,time_type,begin_time,end_time
	})
}
export function getGeshengExl({begin_time,end_time,type}) {
	return request.get('/statistics/mood/export', {
		begin_time,end_time,type
	})
}
export function getZhongjiangExl({begin_time,end_time,activity_id}) {
	return request.get('/statistics/reward/statistics', {
		begin_time,end_time,activity_id
	})
}
export function getPeixunExl({}) {
	return request.get('/statistics/squad/info', {
	})
}
export function getGuanggaoExl({begin_time,end_time}) {
	return request.get('/statistics/billboard/excel', {
		begin_time,end_time
	})
}
export function getChenjiExl({paper_ids}) {
	return request.get('/statistics/paper/test/user/info/', {
		paper_ids
	})
}
export function getAskChartStat({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/statistics/ask/replay/statistics', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getAskInfoStat({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/statistics/ask/statistics', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getJifenExl({userId,is_primary,sn}) {
	return request.get('/statistics/users/integral/history', {
		userId,is_primary,sn
	})
}
export function getCourseDao({action,begin_time,end_time}) {
	return request.get('/statistics/course/general', {
		action,begin_time,end_time
	})
}
export function getYouhui({beginTime,endTime,is_auth,region_id,time_type,action}) {
	return request.get('/statistics/coupon', {
		beginTime,endTime,is_auth,region_id,time_type,action
	})
}
export function getXuexiExl({userId,is_primary,sn}) {
	return request.get('/statistics/users/learn/info', {
		userId,is_primary,sn
	})
}
export function getCouponMain({action}) {
	return request.get('/statistics/user/coupon', {
		action
	})
}
export function getCouponCome({action}) {
	return request.get('/statistics/user/coupon/etype', {
		action
	})
}
export function getUserAges({}) {
	return request.get('/statistics/user/age', {
	})
}
export function getUserTags({begin_time,end_time,time_type}) {
	return request.get('/v2/statistics/course/tag/static', {
		begin_time,end_time,time_type
	})
}
export function getOrdernums({begin_time,end_time,time_type,region_id,is_auth}) {
	return request.get('/statistics/goods/ordernum', {
		begin_time,end_time,time_type,region_id,is_auth
	})
}
export function getOrderReturns({begin_time,end_time,time_type,region_id,is_auth,attr}) {
	return request.get('/statistics/goods/order/returnNum/attr', {
		begin_time,end_time,time_type,region_id,is_auth,attr
	})
}
export function getReturnReson({action}) {
	return request.get('/v2/statistics/good/return/reson', {
		action
	})
}
export function getRevenues({begin_time,end_time,time_type,is_auth,region_id}) {
	return request.get('/v2/statistics/goods/ordernum/all', {
		begin_time,end_time,time_type,is_auth,region_id
	})
}
export function getStaticOrders({begin_time,end_time,time_type,is_auth,region_id}) {
	return request.get('/v2/statistics/shop/course/static', {
		begin_time,end_time,time_type,is_auth,region_id
	})
}
export function getShopOrders({begin_time,end_time,time_type}) {
	return request.get('/v2/statistics/shop/goods/static', {
		begin_time,end_time,time_type
	})
}
export function getWithdrawOrders({begin_time,end_time,time_type,is_auth,region_id}) {
	return request.get('/v2/statistics/withdraw/static', {
		begin_time,end_time,time_type,is_auth,region_id
	})
}
export function getDaystatic({begin_time,end_time,time_type}) {
	return request.get('/v2/statistics/signIn/day/static', {
		begin_time,end_time,time_type
	})
}
export function getDaylasting({begin_time,end_time,time_type}) {
	return request.get('/v2/statistics/signIn/lasting/static', {
		begin_time,end_time,time_type
	})
}
export function getAlives({begin_time,end_time,time_type,user_id}) {
	return request.get('/v2/statistics/user/alive/time', {
		begin_time,end_time,time_type,user_id
	})
}
export function getTixian({begin_time,end_time,time_type,is_auth,region_id}) {
	return request.get('/v2/statistics/withdraw/rank', {
		begin_time,end_time,time_type,is_auth,region_id
	})
}
export function getXiaoshou({beginStr,endStr}) {
	return request.get('/v2/statistics/sell/day/static', {
		beginStr,endStr
	})
}
export function getYuer({}) {
	return request.get('/v2/statistics/integral/auth/static', {
	})
}
export function getNiandus({billId}) {
	return request.get('/v2/statistics/bill/open/static', {
		billId
	})
}
export function getDownDetails({dowload_id}) {
	return request.get('/v2/statistics/article/dowload/static', {
		dowload_id
	})
}
export function getSquadDetails({squad_id}) {
	return request.get('/v2/statistics/squad/user/static', {
		squad_id
	})
}
export function getSquadlast({squad_id}) {
	return request.get('/v2/statistics/squad/test/passStatic', {
		squad_id
	})
}
export function getSquadpractise({squadId}) {
	return request.get('/v2/statistics/squad/test/static', {
		squadId
	})
}
export function getHotinfo({is_auth,time_type,begin_time,end_time}) {
	return request.get('/statistics/hot/keywords/info', {
		is_auth,time_type,begin_time,end_time
	})
}
export function getRewardStaticInfo({time_type,begin_time,end_time,region_id,is_auth}) {
	return request.get('/v2/statistics/activity/rewardStatic', {
		time_type,begin_time,end_time,region_id,is_auth
	})
}
export function getMallJump({}) {
	return request.get('/v2/statistics/shop/jump/static', {
	})
}
export function getSeminarJump({course_id}) {
	return request.get('/v2/statistics/meet/live/jump', {
		course_id
	})
}
export function getRewardEveryInfo({time_type,begin_time,end_time}) {
	return request.get('/v2/statistics/activity/day/rewardStatic', {
		time_type,begin_time,end_time
	})
}
export function getBillDetails({type,action,billId}) {
	return request.get('/v2/statistics/bill/open/userinfo', {
		type,action,billId
	})
}
export function getGuanzhu({begin_time,end_time,time_type,action}) {
	return request.get('/v2/statistics/teacher/follow/rank', {
		begin_time,end_time,time_type,action
	})
}
export function getKaoshi({begin_time,end_time,time_type,teacher_id}) {
	return request.get('/v2/statistics/teacher/paper/static', {
		begin_time,end_time,time_type,teacher_id
	})
}
export function getShouyi({begin_time,end_time,time_type,teacher_id,itype,action}) {
	return request.get('/v2/statistics/teacher/reward/static', {
		begin_time,end_time,time_type,teacher_id,itype,action
	})
}
export function getShouyis({begin_time,end_time,time_type,teacher_id,itype,action}) {
	return request.get('/v2/statistics/teacher/reward/static/v2', {
		begin_time,end_time,time_type,teacher_id,itype,action
	})
}
export function getManyi({begin_time,end_time,time_type,teacher_id,scoreType,action}) {
	return request.get('/v2/statistics/teacher/stais/static', {
		begin_time,end_time,time_type,teacher_id,scoreType,action
	})
}
export function getChuruku({begin_time,end_time,time_type,itype}) {
	return request.get('/goods/inventory/all/export', {
		begin_time,end_time,time_type,itype
	})
}
export function getTuihuo({begin_time,end_time,time_type}) {
	return request.get('/v2/statistics/order/return/amount', {
		begin_time,end_time,time_type
	})
}
export function getXianxia({squadId}) {
	return request.get('/v2/statistics/squad/offline/class', {
		squadId
	})
}
export function getZhibo({regionId}) {
	return request.get('/v2/statistics/region/course/live/info', {
		regionId
	})
}
export function getZhongUser({type,activity_id,begin_time,end_time}) {
	return request.get('/statistics/reward/user/static', {
		type,activity_id,begin_time,end_time
	})
}
export function getEveryUserActive({begin_time,end_time,is_auth,region_id,sex}) {
	return request.get('/statistics/user/active/avg', {
		begin_time,end_time,is_auth,region_id,sex
	})
}
export function getUserAllNumber({beginTime,endTime,is_auth,region_id,sex,id_level,is_buy,level,time_type}) {
	return request.get('/v2/statistics/user/count', {
		beginTime,endTime,is_auth,region_id,sex,id_level,is_buy,level,time_type
	})
}
export function getXiaoShouFenxi({beginTime,endTime,time_type,action}) {
	return request.get('/v2/statistics/sell/day/static/new', {
		beginTime,endTime,time_type,action
	})
}
export function getTeacherAsks({begin_time,end_time,teacher_id,time_type,course_id,type}) {
	return request.get('/v2/statistics/teacher/questionnaire/number/static', {
		begin_time,end_time,teacher_id,time_type,course_id,type
	})
}
export function getGoodsRates({beginTime,endTime,time_type}) {
	return request.get('/v2/statistics/goods/rate/static', {
		beginTime,endTime,time_type
	})
}
export function getGoodsTable({sortType,beginTime,endTime,time_type,goodsName}) {
	return request.get('/v2/statistics/goods/flow/rate', {
		sortType,beginTime,endTime,time_type,goodsName
	})
}
export function getShopUsers({beginTime,endTime,time_type}) {
	return request.get('/v2/statistics/shop/see/users', {
		beginTime,endTime,time_type
	})
}
export function getCouponUse({action,begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/statistics/user/coupon', {
		action,begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getCouponComes({action,begin_time,end_time,is_auth,region_id}) {
	return request.get('/statistics/user/coupon/etype', {
		action,begin_time,end_time,is_auth,region_id
	})
}
export function getAmountTotal({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/total/amount', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getCourseSell({begin_time,end_time,is_auth,region_id,time_type,type}) {
	return request.get('/v2/statistics/course/sale/rank', {
		begin_time,end_time,is_auth,region_id,time_type,type
	})
}
export function getCourseAgent({begin_time,end_time,is_auth,region_id,time_type,courseId}) {
	return request.get('/v2/statistics/course/agent/static', {
		begin_time,end_time,is_auth,region_id,time_type,courseId
	})
}
export function getCashTotal({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/cash/total/static', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getOrderRecharge({begin_time,end_time,is_auth,rechargeId,page,pageSize,regionId}) {
	return request.get('/operate/recharge/order', {
		begin_time,end_time,is_auth,rechargeId,page,pageSize,regionId
	})
}
export function getwithdrawTeacher({begin_time,end_time,is_auth,teacherId,region_id,time_type}) {
	return request.get('/v2/statistics/cash/teacher/withdraw/static', {
		begin_time,end_time,is_auth,teacherId,region_id,time_type
	})
}
export function getCashIntegral({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/integral/total/static', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getCashIntegralUsers({begin_time,end_time,is_auth,regionId,time_type,userId}) {
	return request.get('/statistics/integral/situation', {
		begin_time,end_time,is_auth,regionId,time_type,userId
	})
}
export function getCashIntegralRage({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/statistics/integral/situation', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function CashIntegralTeacher({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/integral/teacher', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getKeywordsInfo({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/statistics/hot/keywords/info', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getHudon({begin_time,end_time,is_auth,region_id,time_type,status,askId}) {
	return request.get('/statistics/ask', {
		begin_time,end_time,is_auth,region_id,time_type,status,askId
	})
}
export function getPeixun({squad_id}) {
	return request.get('/v2/statistics/squad/user/static', {
		squad_id
	})
}
export function getShipingXuexi({squad_id,user_id}) {
	return request.get('/v2/statistics/squad/course/learn', {
		squad_id,user_id
	})
}
export function getSquadMessage({squadId}) {
	return request.get('/v2/statistics/o2o/message/send', {
		squadId
	})
}
export function getKechenChuXi({squadId}) {
	return request.get('/v2/statistics/o2o/status/static', {
		squadId
	})
}
export function getJianKon({squadId}) {
	return request.get('/v2/statistics/o2o/link/static', {
		squadId
	})
}
export function getXiaoGuo({squadId}) {
	return request.get('/v2/statistics/o2o/user/idLevel/static', {
		squadId
	})
}
export function getWeiJing({begin_time,end_time,time_type,userId}) {
	return request.get('/v2/statistics/user/ban/static', {
		begin_time,end_time,time_type,userId
	})
}
export function getLiveExports({action,courseIds,is_auth,region_id}) {
	return request.get('/statistics/couse/live/info', {
		action,courseIds,is_auth,region_id
	})
}
export function getLiveTimes({action,courseIds}) {
	return request.get('/statistics/couse/live/time/static', {
		action,courseIds
	})
}
export function getLiveRewards({action,courseIds,is_auth,region_id}) {
	return request.get('/statistics/couse/live/reward/static', {
		action,courseIds,is_auth,region_id
	})
}
export function getLiveBan({action,courseIds,is_auth,region_id}) {
	return request.get('/statistics/couse/live/ban/user', {
		action,courseIds,is_auth,region_id
	})
}
export function getActMessage({action,activityId,begin_time,end_time,time_type}) {
	return request.get('/v2/statistics/activity/message/send', {
		action,activityId,begin_time,end_time,time_type
	})
}
export function getActins({activityId,begin_time,end_time,time_type}) {
	return request.get('/v2/statistics/activity/static', {
		activityId,begin_time,end_time,time_type
	})
}
export function getActinsUser({activityId,begin_time,end_time,time_type,is_auth,region_id}) {
	return request.get('/v2/statistics/activity/join/user/static', {
		activityId,begin_time,end_time,time_type,is_auth,region_id
	})
}
export function getLiveHudon({action,courseIds,is_auth,region_id}) {
	return request.get('/statistics/couse/live/mutual/static', {
		action,courseIds,is_auth,region_id
	})
}
export function getLiveRewardExports({course_id,is_auth,region_id}) {
	return request.get('/course/activityreward/export', {
		course_id,is_auth,region_id
	})
}
export function getBillsUserExporets({type,action,billId}) {
	return request.get('/v2/statistics/bill/open/userinfo', {
		type,action,billId
	})
}
export function getTuiHuo({begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/order/return/amount', {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getFaPiaoExports({begin_time,end_time,order_id,time_type,user_id}) {
	return request.get('/goods/order/invoice/static', {
		begin_time,end_time,order_id,time_type,user_id
	})
}
export function getMeetScore({course_id}) {
	return request.get('/meet/class/score/export', {
		course_id
	})
}
export function getMeetActexport({dowload_id}) {
	return request.get('/v2/statistics/article/dowload/static', {
		dowload_id
	})
}
export function getMapLearnExport({mapId}) {
	return request.get('/v2/statistics/o2o/map/course/static', {
		mapId
	})
}
export function getMainLevels({levels}) {
	return request.get('/v2/statistics/main/map/pass/static', {
		levels
	})
}
export function getMapTestExport({mapId}) {
	return request.get('/v2/statistics/o2o/map/paper/static', {
		mapId
	})
}
export function getMeetTasksHistory({taskId}) {
	return request.get('/meet/task/user/history', {
		taskId
	})
}
export function getDownActExport({squad_id}) {
	return request.get('/certification/offLine/class/user/learn/export', {
		squad_id
	})
}
export function getDownActAll({action,beginTime,endTime,keyword,status,stype,time_type}) {
	return request.get('/squad/squad/export', {
		action,beginTime,endTime,keyword,status,stype,time_type
	})
}
export function getCertificationExport({squad_id}) {
	return request.get('/certification/class/user/learn/export', {
		squad_id
	})
}
export function getMessageBacks({begin_time,end_time,is_auth,messageId,region_id,time_type}) {
	return request.get('/v2/statistics/message/static/new', {
		begin_time,end_time,is_auth,messageId,region_id,time_type
	})
}
export function getMallLiuliang({action,beginTime,endTime,time_type}) {
	return request.get('/v2/statistics/sell/water/static/new', {
		action,beginTime,endTime,time_type
	})
}
export function getMapMainExports({isPrimary,sn}) {
	return request.get('/v2/statistics/main/map/course/static', {
		isPrimary,sn
	})
}
export function getLivePerson({courseId,type}) {
	return request.get('/statistics/couse/live/user/static', {
		courseId,type
	})
}
export function getLiveKeyword({courseId}) {
	return request.get('/statistics/couse/live/comment/keyword/static', {
		courseId
	})
}
export function getDownlistExports({begin_time,end_time,time_type,downloadId}) {
	return request.get('/v2/statistics/dowload/info/static', {
		begin_time,end_time,time_type,downloadId
	})
}
export function getTiaozhuan({action,begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/shop/jump/puv/static', {
		action,begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getHaibaoShenchen({action,begin_time,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/share/ctype/static', {
		action,begin_time,end_time,is_auth,region_id,time_type
	})
}
export function getKechenDaihuo({action,courseIds,is_auth,region_id}) {
	return request.get('/statistics/couse/goods/static', {
		action,courseIds,is_auth,region_id
	})
}
export function getUserDaihuo({begin_time,course_id,end_time,is_auth,region_id,time_type,type}) {
	return request.get('/v2/statistics/course/goods/hit/static', {
		begin_time,course_id,end_time,is_auth,region_id,time_type,type
	})
}
export function getPaihangExport({beginTime,endTime,limit,type}) {
	return request.get('/v2/statistics/userRank/export', {
		beginTime,endTime,limit,type
	})
}
export function getTeachersSexs({beginTime,endTime,teacher_id,time_type,type}) {
	return request.get('/v2/statistics/teacher/questionnaire/user/static', {
		beginTime,endTime,teacher_id,time_type,type
	})
}
export function getTeachersArea({beginTime,endTime,teacher_id,time_type}) {
	return request.get('/v2/statistics/teacher/questionnaire/region/static', {
		beginTime,endTime,teacher_id,time_type
	})
}
export function getTeachersAsks({teacher_id}) {
	return request.get('/v2/statistics/teacher/questionnaire/topic/static', {
		teacher_id
	})
}
export function getLiveDaihuo({action,courseIds,is_auth,region_id}) {
	return request.get('/statistics/couse/live/goods/static', {
		action,courseIds,is_auth,region_id
	})
}
export function getBanstatics({begin_time,end_time,time_type,type,userId}) {
	return request.get('/v2/statistics/ban/userinfo/static', {
		begin_time,end_time,time_type,type,userId
	})
}
export function getPingtaiFen({begin_time,end_time,time_type,region_id,is_auth}) {
	return request.get('/v2/statistics/total/integral/info', {
		begin_time,end_time,time_type,region_id,is_auth
	})
}
export function getCoursePaperEnds({course_id}) {
	return request.get('/meet/class/score/export', {
		course_id
	})
}
export function getEveryPv({begin_time,end_time,regionId,time_type}) {
	return request.get('/v2/statistics/module/static', {
		begin_time,end_time,regionId,time_type
	})
}
export function getLiveBadsay({action,courseId}) {
	return request.get('/statistics/course/live/badwords/user', {
		action,courseId
	})
}
export function getMessageExports({beginTime,endTime,etype,keywords,time_type,is_auth,region_id}) {
	return request.get('/operate/message/export', {
		beginTime,endTime,etype,keywords,time_type,is_auth,region_id
	})
}
export function getMessageInfos({messageId}) {
	return request.get('/operate/message/userinfo/export', {
		messageId
	})
}
export function getTeacherShouyi({action,begin_time,end_time,itype,teacher_id,time_type}) {
	return request.get('/v2/statistics/teacher/reward/info/static', {
		action,begin_time,end_time,itype,teacher_id,time_type
	})
}
export function getLevelMaps({levelId}) {
	return request.get('/v2/statistics/map/paper/info/static', {
		levelId
	})
}
export function getcourseExcelLink({action,section}) {
	return request.get('/statistics/courseExcelLink', {
		action,section
	})
}
export function getCourseResultExp({course_id,type}) {
	return request.get('/course/course/result/export', {
		course_id,type
	})
}
export function getCourseResults({course_id,type}) {
	return request.get('/course/course/result', {
		course_id,type
	})
}
export function getMapInfoExp({mouth}) {
	return request.get('/v2/statistics/map/learn/static', {
		mouth
	})
}
export function courseRates({begin_time,courseId,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/course/sale/rate', {
		begin_time,courseId,end_time,is_auth,region_id,time_type
	})
}
export function courseRate({begin_time,course_id,end_time,is_auth,region_id,time_type}) {
	return request.get('/v2/statistics/course/sale/rank/'+course_id, {
		begin_time,end_time,is_auth,region_id,time_type
	})
}
export function liveCome({begin_time,course_id,end_time,time_type}) {
	return request.get('/statistics/courseUser/from/export', {
		course_id,begin_time,end_time,time_type
	})
}