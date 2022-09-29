import {createAction} from 'redux-actions';
import * as userService from '../service/user';

const {
	USER_GET,
	USER_KEYWORD,
	USER_INFO,
	USER_INFO_COMMENT,
	USER_INFO_FEEDBACK,

	USER_REMOVE,
	USER_PUBLISH,
    USER_UPDATE,
	USER_CHARGE,
	USER_UNAUTH,

    LEVEL_GET,
    LEVEL_REMOVE,
    LEVEL_PUBLISH,

    EQUITY_GET,
    EQUITY_REMOVE,
	EQUITY_PUBLISH,
	
	INTEGRAL_GET,
	INTEGRAL_PUBLISH,

	TEACHER_LEADER_GET,

	MEDAL_GET,
	MEDAL_PUBLISH,
	MEDAL_ACTION,
	MEDAL_EVENT_GET,
	USER_DETAIL_GET,
	USER_LEVEL_LOG_GET,
	NUM_PUBLISH,
	NUM_GET,
	NUMS_GET,
	RECHARGE_GET,
	RECHARGEITEM_GET,
	RECHARGEITEM_PUBLISH,
	REWARDS_GET, 
	REWARDSS_GET,
	REWARD_POST, 
	POINT_POST,
	MESS_POST,
	NUMSS_GET,
	RANKREWARDS_GET,
	REMIND_SEND,
	USERS_IMPORT,
	FOR_NUMBER,
	GOODSODERS_GET,
	GOODSODERS_IMPORT,
	FAPIAOS_POST,
	GUIZE_POST,
	ZHUNRU_POST,
	ZHUNRUUSER_GET,
	INVITEOUT_GET,
	INVITEUSEROUT_GET,
	ZHUNRUEXPORT_GET,
	QIANDAO_POST,
} = require('../key').default;

export const kuser = createAction(USER_KEYWORD, async(keyword) => {
	const data = await userService.kuser(keyword);
	return data;
});

export const getUserCourseOrder = createAction('getUserCourseOrder', userService.getUserCourseOrder, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserLevelLog = createAction(USER_LEVEL_LOG_GET, userService.getUserLevelLog, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUserDetail = createAction(USER_DETAIL_GET, userService.getUserDetail, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getMedal = createAction(MEDAL_GET, async(props) => {
	const data = await userService.getMedal(props);
	return data;
}, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishMedal = createAction(MEDAL_PUBLISH, userService.publishMedal, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const actionMedal = createAction(MEDAL_ACTION, userService.actionMedal, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getMedalEvent = createAction(MEDAL_EVENT_GET, userService.getMedalEvent, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
/////
export const getTeacherLeader = createAction(TEACHER_LEADER_GET, userService.getTeacherLeader, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUserFeedback = createAction(USER_INFO_FEEDBACK, userService.getUserFeedback, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUserComment = createAction(USER_INFO_COMMENT, userService.getUserComment, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getIntegral = createAction(INTEGRAL_GET, async(type) => {
	const data = await userService.getIntegral(type);
	return data;
});
export const publishIntegral = createAction(INTEGRAL_PUBLISH, userService.publishIntegral, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
////////////////EQUITY
export const getEquity = createAction(EQUITY_GET, async() => {
	const data = await userService.getEquity();
	return data;
});
export const removeEquity = createAction(EQUITY_REMOVE, userService.removeEquity, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishEquity = createAction(EQUITY_PUBLISH, userService.publishEquity, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


////////////////LEVEL
export const getLevel = createAction(LEVEL_GET, async() => {
	const data = await userService.getLevel();
	return data;
});
export const removeLevel = createAction(LEVEL_REMOVE, userService.removeLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishLevel = createAction(LEVEL_PUBLISH, userService.publishLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


////////////////USER

export const chargeUserCoin = createAction(USER_CHARGE, userService.chargeUserCoin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUser = createAction(USER_GET, async({levels,regTimeBegin,regTimeEnd,userId = "", keywords, page = 0,status,pageSize,id_level,is_agent_chair,is_agent_employee,is_seller,is_teacher}) => {
	const data = await userService.getUser({levels,regTimeBegin,regTimeEnd,userId, keywords, page,status,pageSize,id_level,is_agent_chair,is_agent_employee,is_seller,is_teacher});
	return data;
}, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUserInfo = createAction(USER_INFO, async(userId) => {
	const data = await userService.getUserInfo(userId);
	return data;
});
export const updateUser = createAction(USER_UPDATE, userService.updateUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishUser = createAction(USER_PUBLISH, userService.publishUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const removeUser = createAction(USER_REMOVE, userService.removeUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const unAuthUser = createAction(USER_UNAUTH, userService.unAuthUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishNum = createAction(NUM_PUBLISH, userService.publishNum, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getNum = createAction(NUM_GET, async(keyy,section) => {
	const data = await userService.getNum(keyy,section);
	return data;
});
export const getNums = createAction(NUMS_GET, async(keyy,section) => {
	const data = await userService.getNums(keyy,section);
	return data;
});
export const getNumss = createAction(NUMSS_GET, async(keyy,section) => {
	const data = await userService.getNumss(keyy,section);
	return data;
});
export const getRecharge = createAction(RECHARGE_GET, async() => {
	const data = await userService.getRecharge();
	return data;
});
export const getRechargeitem = createAction(RECHARGEITEM_GET, async(recharge_id) => {
	const data = await userService.getRechargeitem({recharge_id});
	return data;
});
export const publishRechargeitem = createAction(RECHARGEITEM_PUBLISH, userService.publishRechargeitem, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getRewardss = createAction(REWARDS_GET, async(recharge_id,status,page,pageSize) => {
	const data = await userService.getRewardss({recharge_id,status,page,pageSize});
	return data;
});
export const getRewardsss = createAction(REWARDSS_GET, async(recharge_id,status,page,pageSize) => {
	const data = await userService.getRewardsss({recharge_id,status,page,pageSize});
	return data;
});
export const postReward = createAction(REWARD_POST, userService.postReward, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postPoint = createAction(POINT_POST, userService.postPoint, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postMess = createAction(MESS_POST, userService.postMess, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getRankRewards = createAction(RANKREWARDS_GET, async(atype,begin_time,end_time,ctype,is_admin,keyword,page,pageSize,status,user_id) => {
	const data = await userService.getRankRewards(atype,begin_time,end_time,ctype,is_admin,keyword,page,pageSize,status,user_id);
	return data;
});
export const SendRemind = createAction(REMIND_SEND, userService.SendRemind, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const importUsers = createAction(USERS_IMPORT, userService.importUsers, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const forNumber = createAction(FOR_NUMBER, userService.forNumber, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGoodsOders = createAction(GOODSODERS_GET, userService.getGoodsOders, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const imporGoodsOrders = createAction(GOODSODERS_IMPORT, userService.imporGoodsOrders, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postFaPiaos = createAction(FAPIAOS_POST, userService.postFaPiaos, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postGuize = createAction(GUIZE_POST, userService.postGuize, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postZhunru = createAction(ZHUNRU_POST, userService.postZhunru, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getZhunruUser = createAction(ZHUNRUUSER_GET, userService.getZhunruUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getInviteOut = createAction(INVITEOUT_GET, userService.getInviteOut, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getInviteUserOut = createAction(INVITEUSEROUT_GET, userService.getInviteUserOut, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getZhunruExport= createAction(ZHUNRUEXPORT_GET,
    userService.getZhunruExport, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postQiandao= createAction(QIANDAO_POST,
    userService.postQiandao, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});