import request from '../../util/net';

export function kuser(keyword){
	return request.get(`/user/user/ident`,{
		keyword
	})
}

export function getUserLevelLog({user_id}){
	const userId = user_id
	return request.get(`/user/user/level/history/${userId}`,{
		userId
	})
}
export function getUserCourseOrder({
	begin,
	end,
	keyword,
	page,
	pageSize,
	user_id,
	mobile
}){
	return request.get(`/course/courseOrder`,{
		begin,
		end,
		keyword,
		page,
		pageSize,
		user_id,
		mobile
	})
}

export function getMedal({medal_id,keyword,page,pageSize}){
	return request.get(`/user/medal`,{
		medal_id,keyword,page,pageSize
	})
}
export function publishMedal({description,medal_id,level,medal_img,title,invent_name,condition,school_coupon_id,shop_coupon_id}){
	return request.post(`/user/medal`,{
		description,medal_id,level,medal_img,title,invent_name,condition,school_coupon_id,shop_coupon_id
	})
}
export function actionMedal({medal_id,action}){
	return request.post(`/user/medal/update`,{
		medal_id,action
	})
}

export function getMedalEvent(){
	return request.get(`/user/medal/invent`)
}



export function getTeacherLeader(){
	return request.get(`/user/leader`)
}

export function getUserComment({user_id,page,pageSize}){
	return request.get(`/user/user/comment/${user_id}`,{
		user_id,page,pageSize
	})
}
///
export function getUserDetail({type,user_id,page,pageSize}){
	if(type=='medal')
		return request.get(`/user/user/medal/${user_id}`,{
			user_id,page,pageSize
		})
	else if(type=='map')
		return request.get(`/user/user/map/${user_id}`,{
			user_id,page,pageSize
		})
	else if(type=='order')
		return request.get(`/user/user/order/info`,{
			userId: user_id, page, pageSize
		})
	else if(type=='class')
		return request.get(`/user/user/squad/${user_id}`,{
			user_id,page,pageSize
		})
	else if(type=='auth')
		return request.get(`/user/user/cert/${user_id}`,{
			user_id,page,pageSize
		})
}
///

export function getUserFeedback({user_id,page,pageSize}){
	return request.get(`/user/user/feedback/${user_id}`,{
		user_id,page,pageSize
	})
}
export function getUser({levels, regTimeBegin,regTimeEnd,userId,keywords,page,status,pageSize,id_level,is_agent_chair,is_agent_employee,is_seller,is_teacher}) {
	return request.get('/user/user/', {
		levels: levels,
		userId: userId,
		keywords: keywords,
        page: page,
		status:status, 
		pageSize:pageSize,
		id_level:id_level,
		regTimeBegin:regTimeBegin,
		regTimeEnd:regTimeEnd,
		is_agent_chair:is_agent_chair,
		is_agent_employee:is_agent_employee,
		is_seller:is_seller,
		is_teacher:is_teacher,
	},true)
}
export function getUserInfo(id) {
	return request.get('/user/user/'+id, {
	})
}
export function chargeUserCoin({user_id,type,integral}) {
	return request.post('/user/user/integral/change', {
        user_id,type,integral
	})
}
export function updateUser({user_id}) {
	return request.post('/user/user/' + user_id, {
        action:'status',
        user_id:user_id
	})
}

export function removeUser({user_id}) {
	return request.post('/user/user/' + user_id, {
        action:'delete',
        user_id:user_id
	})
}
export function unAuthUser({user_id}) {
	return request.post('/user/user/' + user_id, {
        action:'auth',
        user_id:user_id
	})
}
export function publishUser({is_auth,id_level,id_hlevel,is_seller,is_agent_chair,is_agent_employee,mobile,nickname,username,avatar,password,sex,Identity,birthday,integral,level,user_id,work_sn}) {
	return request.post('/user/user/publish', {
		is_auth,id_level,id_hlevel,is_seller,is_agent_chair,is_agent_employee,mobile,nickname,username,avatar,password,sex,Identity,birthday,integral,level,user_id,work_sn
	})
}

///////////////////////////LEVEL
export function getLevel() {
	return request.get('/user/level', {
	})
}
export function removeLevel({level_id}) {
	return request.post('/user/level/' + level_id, {
		action:'delete',
		level_id:level_id
	})
}

export function publishLevel({level_id,begin_prestige,end_prestige,level_name,equity}) {
	return request.post('/user/level/publish', {
		level_id,begin_prestige,end_prestige,level_name,equity
	})
}
/////////////////////////equity
export function getEquity() {
	return request.get('/user/equity', {
	})
}
export function removeEquity({equity_id}) {
	return request.post('/user/equity/delete', {
		equity_id:equity_id
	})
}

export function publishEquity({bottom_img,tag,integral,equity_name,content,equity_img,equity_id}) {
	return request.post('/user/equity/publish', {
		bottom_img,tag,integral,equity_name,content,equity_img,equity_id
	})
}
///////////////////////////INTERGRAL
export function getIntegral(type) {
	return request.get('/user/integral/', {
		type:type
	})
}

export function publishIntegral({json}) {
	return request.post('/user/integral/publish', {
		json
	})
}
export function publishNum({keyy,section,val}) {
	return request.post('/user/check/num', {
		keyy,section,val
	})
}
export function getNum(keyy,section) {
	return request.get('/user/check', {
		keyy:keyy,
		section:section
	})
}
export function getNums(keyy,section) {
	return request.get('/user/check', {
		keyy:keyy,
		section:section
	})
}
export function getNumss(keyy,section) {
	return request.get('/user/check', {
		keyy:keyy,
		section:section
	})
}
export function getRecharge() {
	return request.get('/operate/recharge', {
	})
}
export function getRechargeitem({recharge_id}) {
	return request.get('/operate/recharge/rechargeitem/'+recharge_id, {
	})
}
export function publishRechargeitem({recharge_id,v,ctype,integral,itemNum,item_img,item_name}) {
	return request.post('/operate/recharge/rechargeitem/'+recharge_id, {
		v,ctype,integral,itemNum,item_img,item_name
	})
}
export function getRewardss({recharge_id,status,page,pageSize}) {
	return request.get('/operate/recharge/rechargereward/'+recharge_id, {
		status,page,pageSize
	})
}
export function getRewardsss({recharge_id,status,page,pageSize}) {
	return request.get('/operate/recharge/rechargereward/'+recharge_id, {
		status,page,pageSize
	})
}
export function postReward({reward_id,ship_sn}) {
	return request.post('/dashboard/rechargereward/ship', {
		reward_id,ship_sn
	})
}
export function postPoint({user_id,integral,type}) {
	return request.post('/user/user/Yintegral/change', {
		user_id,integral,type
	})
}
export function postMess({file_url,messageId}) {
	return request.post('/operate/message/import', {
		file_url,messageId
	})
}
export function getRankRewards({atype,begin_time,end_time,ctype,is_admin,keyword,page,pageSize,status,user_id}) {
	return request.get('/operate/activity/rankreward', {
		atype,begin_time,end_time,ctype,is_admin,keyword,page,pageSize,status,user_id
	})
}
export function SendRemind({message_id}) {
	return request.post('/operate/remind/send', {
		message_id
	})
}
export function importUsers({file_url}) {
	return request.post('/user/user/import', {
		file_url
	})
}
export function forNumber({input}) {
	return request.get('/article/number/to/letter', {
		input
	})
}
export function getGoodsOders({status,begin_time,end_time,keyword,order_id,page,pageSize}) {
	return request.get('/goods/order', {
		status,begin_time,end_time,keyword,order_id,page,pageSize
	})
}
export function imporGoodsOrders({order_id,water_number}) {
	return request.post('/goods/orderinfo/set/waternumber', {
		order_id,water_number
	})
}
export function postFaPiaos({order_id,invoice_url}) {
	return request.post('/goods/orderinfo/set/invoice', {
		order_id,invoice_url
	})
}
export function postGuize({again,open,text,v}) {
	return request.post('/operate/withdraw/text/config', {
		again,open,text,v
	})
}
export function postZhunru({again,open,text,v,agree,agree_text,keyy,sction}) {
	return request.post('/operate/fund/text/config', {
		again,open,text,v,agree,agree_text,keyy,sction
	})
}
export function getZhunruUser({type,page,pageSize,mobile,userId}) {
	return request.get('/operate/confirm/userInfo', {
		type,page,pageSize,mobile,userId
	})
}
export function getInviteOut({beginTime,page,pageSize,isAuth,keyword,regionId,sex,sortType}) {
	return request.get('/operate/invite/export', {
		beginTime,page,pageSize,isAuth,keyword,regionId,sex,sortType
	})
}
export function getInviteUserOut({keyword,userId}) {
	return request.get('/operate/invite/user/export', {
		keyword,userId
	})
}
export function getZhunruExport({type,mobile,userId}) {
	return request.get('/operate/confirm/userInfo/export', {
		type,mobile,userId
	})
}
export function postQiandao({type,day_times,images}) {
	return request.post('/operate/day/checkin/img', {
		type,day_times,images
	})
}

