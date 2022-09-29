import { createAction } from 'redux-actions';
import * as adService from '../service/ad';

const {
	AD_TMP_GET,
	AD_TMP_UPDATE,
	AD_TMP_PUBLISH,

	AD_SEN_GET,
	AD_SEN_PUBLISH,
	AD_SEN_TIMES,

	AD_MSG_GET_INFO,
	AD_MSG_GET,
	AD_MSG_UPDATE,
	AD_MSG_PUBLISH,

	_AD_KEYWORD_GET,
	AD_KEYWORD_GET,
	AD_KEYWORD_REMOVE,
	AD_KEYWORD_PUBLISH,

	AD_INVITE_INFO,
	AD_INVITE_GET,
	AD_INVITE_UPDATE,
	AD_INVITE_PUBLISH,


	AD_GIFT_GET,
	AD_GIFT_UPDATE,
	AD_GIFT_PUBLISH,

	AD_BILLBOARD_INFO,
	AD_BILLBOARD_GET,
	AD_BILLBOARD_UPDATE,
	AD_BILLBOARD_REMOVE,
	AD_BILLBOARD_PUBLISH,
	AD_BILLBOARD_DELETE_ALL,

	AD_ACTIVE_ITEM_GET,
	AD_ACTIVE_ITEM_PUBLISH,
	AD_ACTIVE_INFO,
	AD_ACTIVE_GET,
	AD_ACTIVE_UPDATE,
	AD_ACTIVE_REMOVE,
	AD_ACTIVE_PUBLISH,


	AD_ACTIVE_REWARD_GET,
	AD_ACTIVE_REWARD_PUBLISH,
	AD_ACTIVE_REWARD_RANDOM,


	INVITE_PICTURE_GET,
	INVITE_PICTURE_PUBLISH,
	INVITE_PICTURE_ACTION,
	GET_INVITE_BY_ID,

	AD_BILLS_GET,
	AD_BILLS_PUBLISH,
	AD_BILLS_DELETE,

	AD_SOURCE_GET,
	AD_SOURCE_PUBLISH,

	AD_REWARD_PUBLISH,

	AD_RANKREWARD_PUBLISH,
	AD_ACTIVITYREWARD_GET,
	AD_STATISTICS_GET,
	AD_REWARDS_GET,
	AD_REWARDALL_GET,
	AD_REWARDLIST_GET,
	AD_CHECK_GET,
	AD_DOWN_DELETE,
	RANKITEM_GET,
	RANKITEM_POST,
	RANKITEM_DELETE,
	OPBILL_GET,
	OPBILL_POST,
	OPBILLS_POST,
	OPBILLS_UPDATE,
	WIDTHDRAW_EXPORT,
	DOWNADS,
} = require('../key').default;

export const getInviteById = createAction(GET_INVITE_BY_ID,
	adService.getInviteById, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const getInvitePicture = createAction(INVITE_PICTURE_GET,
	async ({ keyword, page, pageSize }) => {
		const data = await adService.getInvitePicture({ keyword, page, pageSize });
		return data;
	});
export const setInvitePicture = createAction(INVITE_PICTURE_PUBLISH,
	adService.setInvitePicture, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const actionInvitePicture = createAction(INVITE_PICTURE_ACTION,
	adService.actionInvitePicture, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
////
export const getActiveReward = createAction(AD_ACTIVE_REWARD_GET,
	async ({ keyword, activity_id, page, pageSize }) => {
		const data = await adService.getActiveReward({ keyword, activity_id, page, pageSize });
		return data;
	});
export const publishActiveReward = createAction(AD_ACTIVE_REWARD_PUBLISH,
	adService.publishActiveReward, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const randomActiveReward = createAction(AD_ACTIVE_REWARD_RANDOM,
	adService.randomActiveReward, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
////
export const publishActiveItem = createAction(AD_ACTIVE_ITEM_PUBLISH,
	adService.publishActiveItem, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const getActiveItem = createAction(AD_ACTIVE_ITEM_GET,
	async ({ activity_id, page, pageSize }) => {
		const data = await adService.getActiveItem({ activity_id, page, pageSize });
		return data;
	});
export const getActiveInfo = createAction(AD_ACTIVE_INFO,
	async ({ activity_id }) => {
		const data = await adService.getActiveInfo({ activity_id });
		return data;
	});
export const getActive = createAction(AD_ACTIVE_GET,
	async ({ atype, page, title }) => {
		const data = await adService.getActive({ atype, page, title });
		return data;
	});
export const updateActive = createAction(AD_ACTIVE_UPDATE,
	adService.updateActive, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const publishActive = createAction(AD_ACTIVE_PUBLISH,
	adService.publishActive, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});

////

export const getGift = createAction(AD_GIFT_GET,
	async ({ gift_name, page, pageSize, gtype }) => {
		const data = await adService.getGift({ gift_name, page, pageSize, gtype });
		return data;
	});
export const updateGift = createAction(AD_GIFT_UPDATE,
	adService.updateGift, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const publishGift = createAction(AD_GIFT_PUBLISH,
	adService.publishGift, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});

////
export const getSen = createAction(AD_SEN_GET,
	async () => {
		const data = await adService.getSen();
		return data;
	});
export const setSenTimes = createAction(AD_SEN_TIMES,
	adService.setSenTimes, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const publishSen = createAction(AD_SEN_PUBLISH,
	adService.publishSen, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});

////
export const _getKeyword = createAction(_AD_KEYWORD_GET,
	adService.getKeywords, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
////
export const getKeyword = createAction(AD_KEYWORD_GET,
	async ({ action }) => {
		const data = await adService.getKeywords({ action });
		return data;
	});
export const removeKeywords = createAction(AD_KEYWORD_REMOVE,
	adService.removeKeywords, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const publishKeywords = createAction(AD_KEYWORD_PUBLISH,
	adService.publishKeywords, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});

////
export const getBillInfo = createAction(AD_BILLBOARD_INFO,
	async ({ billboard_id }) => {
		const data = await adService.getBillInfo({ billboard_id });
		return data;
	});
export const getBill = createAction(AD_BILLBOARD_GET,
	async ({ adId, keywords, page, pageSize, status }) => {
		const data = await adService.getBill({ adId, keywords, page, pageSize, status });
		return data;
	});

export const deleteBill = createAction(AD_BILLBOARD_DELETE_ALL,
	adService.deleteBill, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const updateBill = createAction(AD_BILLBOARD_UPDATE,
	adService.updateBill, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const publishBill = createAction(AD_BILLBOARD_PUBLISH,
	adService.publishBill, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});

////
export const getMsgInfo = createAction(AD_MSG_GET_INFO,
	async ({ message_id }) => {
		const data = await adService.getMsgInfo({ message_id });
		return data;
	});
export const getMsg = createAction(AD_MSG_GET,
	async ({ keywords, page, etype }) => {
		const data = await adService.getMsg({ keywords, page, etype });
		return data;
	});
export const updateMsg = createAction(AD_MSG_UPDATE,
	adService.updateMsg, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const publishMsg = createAction(AD_MSG_PUBLISH,
	adService.publishMsg, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
///
export const getTmp = createAction(AD_TMP_GET,
	async () => {
		const data = await adService.getTmp();
		return data;
	});

export const updateTmp = createAction(AD_TMP_UPDATE,
	adService.updateTmp, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const publishTmp = createAction(AD_TMP_PUBLISH,
	adService.publishTmp, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
///////
///////
export const getInvite = createAction(AD_INVITE_GET,
	async (keyword, page, pageSize) => {
		const data = await adService.getInvite(keyword, page, pageSize);
		return data;
	});
export const getInviteInfo = createAction(AD_INVITE_INFO,
	async ({ invite_id, keyword, page, pageSize }) => {
		const data = await adService.getInviteInfo({ invite_id, keyword, page, pageSize });
		return data;
	});
//////
//////
export const getBills = createAction(AD_BILLS_GET,
	async (keyword) => {
		const data = await adService.getBills(keyword);
		return data;
	});
export const publishBills = createAction(AD_BILLS_PUBLISH,
	adService.publishBills, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const deleteBills = createAction(AD_BILLS_DELETE,
	adService.deleteBills, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
//////
//////
export const getSource = createAction(AD_SOURCE_GET,
	async (ftype,keywords, page, pageSize,getSource) => {
		const data = await adService.getSource(ftype,keywords, page, pageSize,getSource);
		return data;
	});
export const publishSource = createAction(AD_SOURCE_PUBLISH,
	adService.publishSource, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
//////
//////
export const publishReward = createAction(AD_REWARD_PUBLISH,
	adService.publishReward, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
//////
//////
export const publishRankReward = createAction(AD_RANKREWARD_PUBLISH,
	adService.publishRankReward, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const getActivityreward = createAction(AD_ACTIVITYREWARD_GET,
	async (activity_id) => {
		const data = await adService.getActivityreward(activity_id);
		return data;
	});
export const getRewards = createAction(AD_REWARDS_GET,
	async (action, activity_id, begin_time, is_auth) => {
		const data = await adService.getRewards(action, activity_id, begin_time, is_auth);
		return data;
	});
export const getRewardall = createAction(AD_REWARDALL_GET,
	async (time_type, action, begin_time, end_time, is_auth) => {
		const data = await adService.getRewardall(time_type, action, begin_time, end_time, is_auth);
		return data;
	});
export const getRewardlist = createAction(AD_REWARDLIST_GET,
	async (is_auth, activity_id, begin_time, end_time) => {
		const data = await adService.getRewardlist(is_auth, activity_id, begin_time, end_time);
		return data;
	});
export const getStatistics = createAction(AD_STATISTICS_GET,
	async (activity_id, begin_time, end_time) => {
		const data = await adService.getStatistics(activity_id, begin_time, end_time);
		return data;
	});
export const getCheck = createAction(AD_CHECK_GET,
	async (keyy, section) => {
		const data = await adService.getCheck(keyy, section);
		return data;
	});
export const downDelete = createAction(AD_DOWN_DELETE,
	async (downDelete) => {
		const data = await adService.downDelete(downDelete);
		return data;
	});
export const getRankItem = createAction(RANKITEM_GET,
	async (atype) => {
		const data = await adService.getRankItem(atype);
		return data;
	});
export const postRankItem = createAction(RANKITEM_POST,
	adService.postRankItem, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const deleteRankItem = createAction(RANKITEM_DELETE,
	adService.deleteRankItem, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const getOpBill = createAction(OPBILL_GET,
	adService.getOpBill, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const postOpBill = createAction(OPBILL_POST,
	adService.postOpBill, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const postOpBills = createAction(OPBILLS_POST,
	adService.postOpBills, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const updateOpBills = createAction(OPBILLS_UPDATE,
	adService.updateOpBills, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const exportWithDraw = createAction(WIDTHDRAW_EXPORT,
	adService.exportWithDraw, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});
export const downAds = createAction(DOWNADS,
	adService.downAds, ({ resolved, rejected }) => {
		return {
			resolved,
			rejected
		}
	});