import request from '../../util/net';

export function getInvitePicture({keyword,page,pageSize}) {
	return request.get('/operate/invite', {
		keyword,page,pageSize
	})
}
export function setInvitePicture({
	gallery_id,img_url,name
}) {
	return request.post('/operate/invite/publish', {
		gallery_id,img_url,name
	})
}

export function actionInvitePicture({
	gallery_id,
	action
}) {
	return request.post(`/operate/invite/${gallery_id}`, {
		gallery_id,
		action
	})
}
///

export function getActiveReward({begin_time,end_time,ctype,is_admin,user_id,keyword,status,activity_id,page,pageSize}) {
	return request.get('/operate/activity/activityreward/'+activity_id, {
		begin_time,end_time,ctype,is_admin,user_id,keyword,status,activity_id,page,pageSize
	})
}

export function publishActiveReward({
	activity_id,
	address,
	ctype,
	integral,
	item_name,
	mobile,
	nickname
}) {
	return request.post('/operate/activity/activityreward/'+activity_id+'/publish', {
		activity_id,
		address,
		ctype,
		integral,
		item_name,
		mobile,
		nickname
	})
}

export function randomActiveReward({
	activity_id,
	number
}) {
	return request.post('/operate/activity/activityreward/'+activity_id+'/random', {
		activity_id,
		number
	})
}
////
export function getActiveItem({activity_id,page,pageSize}) {
	return request.get('/operate/activity/activityitem/'+activity_id, {
		activity_id,page,pageSize
	})
}
export function publishActiveItem({
		coupon_id,
		activity_id,
		ctype,
		integral,
		itemNum,
		item_img,
		item_index,
		item_name,
		rate
	}) {
	return request.post('/operate/activity/activityitem/'+activity_id, {
		coupon_id,
		activity_id,
		ctype,
		integral,
		itemNum,
		item_img,
		item_index,
		item_name,
		rate
	})
}
export function getActive({atype,page,title}) {
	return request.get('/operate/activity/', {
        atype,page,title
	})
}
export function getActiveInfo({activity_id}) {
	return request.get('/operate/activity/'+activity_id, {
	})
}
export function publishActive({
		activity_id,
		atype,
		begin_time,
		content,
		end_time,
		integral,
		rule,
		status,
		title,
		url
	}) {
	return request.post('/operate/activity/publish/', {
		url,status,activity_id,atype,begin_time,content,end_time,content,integral,rule,title
	})
}
export function updateActive({action,activity_id}) {
	return request.post('/operate/activity/'+activity_id, {
		action,activity_id
	})
}
//////
////
export function deleteBill({billboard_ids}) {
	return request.post('/operate/billboard/delete', {
		billboard_ids
	})
}
export function getBillInfo({billboard_id}) {
	return request.get('/operate/billboard/'+billboard_id, {
        billboard_id
	})
}
export function getBill({adId,keywords,page,pageSize,status}) {
	return request.get('/operate/billboard/', {
        adId,keywords,page,pageSize,status
	})
}
export function publishBill({file_url,flag,ad_id,begin_time,end_time,billboard_id,billboard_name,content,link,sort_order,status}) {
	return request.post('/operate/billboard/publish/', {
		file_url,flag,ad_id,begin_time,end_time,billboard_id,billboard_name,content,link,sort_order,status
	})
}
export function updateBill({action,billboard_id,status}) {
	return request.post('/operate/billboard/'+billboard_id, {
		action,billboard_id,status
	})
}
//////
////
export function getGift({gift_name,page,pageSize,gtype}) {
	return request.get('/operate/gift/', {
        gift_name,page,pageSize,gtype
	})
}
export function publishGift({
		gift_id,
		gift_img,
		gift_name,
		integral,
		status,
		gtype
	}) {
	return request.post('/operate/gift/publish/', {
		gift_id,gift_img,gift_name,integral,status,gtype
	})
}
export function updateGift({action,gift_id}) {
	return request.post('/operate/gift/'+gift_id, {
		action,gift_id
	})
}
//////
//////
export function getInviteInfo({invite_id,keyword,page,pageSize}) {
	return request.get('/operate/inviteresult/'+invite_id, {
        invite_id,keyword,page,pageSize
	})
}
export function getInviteById({keyword, page,pageSize,user_id}) {
	return request.get('/operate/invite/'+user_id, {
        keyword,page,pageSize,user_id
	})
}
export function getInvite({keyword, page,pageSize,beginTime,isAuth,regionId,sex,sortType,userId,mobile}) {
	return request.get('/operate/invites/', {
        keyword:keyword,page:page,pageSize:pageSize,beginTime:beginTime,isAuth:isAuth,regionId:regionId,sex:sex,sortType:sortType,userId:userId,mobile:mobile
	})
}
export function publishInvite() {
	return request.post('/operate/invite/publish/', {
	
	})
}
export function updateInvite({action}) {
	return request.post('/operate/invite/', {
		action:action
	})
}
/////
export function getKeywords({action}) {
	return request.get('/operate/keywords/', {
		action
	})
}
export function publishKeywords({action,keyword,type}) {
	return request.post('/operate/keywords/publish/', {
		keyword:keyword,
		type:type,
		action:action
	})
}
export function removeKeywords({action,keyword,type}) {
	return request.post('/operate/keywords/delete', {
		action:action,
		keyword:keyword,
		type:type
	})
}
////
/////
export function getMsgInfo({message_id}) {
	return request.get('/operate/message/'+message_id, {
		message_id
	})
}
export function getMsg({keywords,page,etype}) {
	return request.get('/operate/message/', {
		keywords,page,etype
	})
}
export function updateMsg({action,message_id}) {
	return request.post('/operate/message/' + message_id, {
		action:action,
		message_id:message_id
	})
}
export function publishMsg({etype,message_img,flag,content,link,message_id,p_intro,p_time,ptype,status,summary,title}) {
	return request.post('/operate/message/publish/', {
		etype,message_img,flag,content,link,message_id,p_intro,p_time,ptype,status,summary,title
	})
}
////
/////
export function getTmp() {
	return request.get('/operate/template/', {
	})
}
export function updateTmp({action,tmp_id}) {
	return request.post('/operate/template/' + tmp_id, {
		action:action,
		tmp_id:tmp_id
	})
}
export function publishTmp({content,status,summary,template_id,title}) {
	return request.post('/operate/template/publish/', {
		content,status,summary,template_id,title
	})
}
////
/////
export function getSen() {
	return request.get('/operate/sensitive/', {
	})
}

export function setSenTimes({times}) {
	return request.post('/operate/sensitive/times', {
		times:times
	})
}
export function publishSen({sensitive}) {
	return request.post('/operate/sensitive/publish/', {
		sensitive
	})
}
////

export function getBills(keyword) {
	return request.get('/operate/bill/', {
		keyword:keyword
	})
}
export function publishBills({data,title,year,bill_id,cover_url,status}) {
	return request.post('/operate/bill/', {
		data,title,year,bill_id,cover_url,status
	})
}
export function deleteBills({bill_ids,action}) {
	return request.post('/operate/update/', {
		bill_ids,action
	})
}
////

export function getSource(ftype,keywords,page,pageSize,getSource) {
	return request.get('/operate/source/list', {
		ftype:ftype,
		keywords:keywords,
		page:page,
		pageSize:pageSize,
		getSource:getSource,
	})
}
export function publishSource({content,files,code_type,ftype,parent_id,code_url,down_id,flag,img_url,name,titles,sort_order,can_share,download_sort}) {
	return request.post('/operate/source/publish', {
		content,files,code_type,ftype,parent_id,code_url,down_id,flag,img_url,name,titles,sort_order,can_share,download_sort
	})
}
////
export function publishReward({method,rate,type}) {
	return request.post('/operate/teacher/reward', {
		method,rate,type
	})
}
////
export function publishRankReward({activity_id,jsonStr}) {
	return request.post('/operate/rank/reward', {
		activity_id,jsonStr
	})
}
export function getActivityreward(activity_id) {
	return request.get('/operate/activity/activityreward'+activity_id, {
		activity_id:activity_id
	})
}
export function getRewards(action,activity_id,begin_time,is_auth) {
	return request.get('/statistics/reward', {
		action:action,
		activity_id:activity_id,
		begin_time:begin_time,
		is_auth:is_auth
	})
}
export function getRewardall(time_type,action,begin_time,end_time,is_auth) {
	return request.get('/statistics/reward/all', {
		time_type:time_type,
		action:action,
		begin_time:begin_time,
		is_auth:is_auth,
		end_time:end_time
	})
}
export function getRewardlist(is_auth,activity_id,begin_time,end_time) {
	return request.get('/statistics/reward/list', {
		is_auth:is_auth,
		activity_id:activity_id,
		begin_time:begin_time,
		end_time:end_time
	})
}
export function getStatistics(activity_id,begin_time,end_time) {
	return request.get('/statistics/reward/statistics', {
		activity_id:activity_id,
		begin_time:begin_time,
		end_time:end_time
	})
}

export function getCheck(keyy,section) {
	return request.get('/user/check/', {
		keyy,section
	})
}

export function downDelete(download_id) {
	return request.get('/operate/source/delete', {
		download_id:download_id
	})
}
export function getRankItem({atype}) {
	return request.get('/operate/activity/rankitem', {
		atype
	})
}
export function postRankItem({atype,begin_index,end_index,ctype,integral,itemNum,item_img,item_index,item_name}) {
	return request.post('/operate/activity/rankitem', {
		atype,begin_index,end_index,ctype,integral,itemNum,item_img,item_index,item_name
	})
}
export function deleteRankItem({key,atype}) {
	return request.post('/operate/remove/rankitem', {
		key,atype
	})
}
export function getOpBill({keyword,billId}) {
	return request.get('/operate/bill', {
		keyword,billId
	})
}
export function postOpBill({title,year,bill_id,cover_url,front_color,front_size,front_space,img,is_rough,pageIndex,row_space,status,text,bill_img,front_color2,front_size2,front_space2,align_type,text_space}) {
	return request.post('/operate/bill', {
		title,year,bill_id,cover_url,front_color,front_size,front_space,img,is_rough,pageIndex,row_space,status,text,bill_img,front_color2,front_size2,front_space2,align_type,text_space
	})
}
export function postOpBills({bill_id,year}) {
	return request.post('/operate/bill', {
		bill_id,year
	})
}
export function updateOpBills({bill_ids,action}) {
	return request.post('/operate/update', {
		bill_ids,action
	})
}
export function exportWithDraw({status,begin,end,keyword,is_done,atype,}) {
	return request.get('/operate/withdraw/export', {
		status,begin,end,keyword,is_done,atype,
	})
}
export function downAds({adId}) {
	return request.post('/operate/billboard/down', {
		adId
	})
}