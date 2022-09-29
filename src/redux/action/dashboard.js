import {createAction} from 'redux-actions';
import * as dashboardService from '../service/dashboard';

const {
	FEEDBACK_DELETE,
	FEEDBACK_DONE_GET,
	FEEDBACK_GET,
	FEEDBACK_REPLY,
	FEEDBACK_UPDATE,

	FEED_CATEGORY_GET,
	FEED_CATEGORY_PUBLISH,
    FEED_CATEGORY_UPDATE,
    
    POST_GET,
    TODO_GET,
	POST_UPDATE,
	
	STAT_COURSE_SINGLE,
	STAT_COURSE_INFO,
	STAT_COIN_CONSUME,
	STAT_COIN_ORIGIN,
	STAT_COIN_INFO,

	STAT_COMMENT,
	STAT_AUTH,
	STAT_INTEGRAl,
	STAT_USERS,
	STAT_USERLEVEL,
	STAT_FLAG,
	STAT_COURSE_COM,
	STAT_COURSE_HIT,
	STAT_COURSE_LEARN,
	STAT_COURSE_SCORE,
	STAT_COURSE_FINISH,
	STAT_COURSE,
	STAT_COURSE_DATA,
	STAT_COIN_RATE,
	STAT_FEED_DATA,
	STAT_FEED_LINE,

	EXCEL_FEED,
	EXCEL_USER,
	EXCEL_SEN,
	EXCEL_REWARD,

	STAT_COMMENT_LINE,
	STAT_REWARD,

	STAT_USER_EQUITY,
	STAT_USER_ACTIVE,
	STAT_USER_TIME,
	STAT_USER_STAY,
	STAT_USER_DURATION,
	STAT_USER_SEN,
	STAT_USER_SEX,

	STAT_COURSE_CATE_RELEARN,
	STAT_COURSE_RELEARN,
	STAT_EXPRESS,
	STAT_NEWS_INFO,
	USER_RANKS_GET, 
	ASKEXL_GET,
	LIVEEXL_GET,
	GUANJIANCIEXL_GET,
	GESHENGEXL_GET,
	ZHONGJIANGEXL_GET,
	PEIXUNEXL_GET,
	GUANGGAOEXL_GET,
	CHENGJIEXL_GET,
	ASKCHARTTART_GET,
	ASKINFOTART_GET,
	JIFENEXL_GET,
	COURSEDAO_GET,
	YOUHUI_GET,
	XUEXIEXL_GET,
	COUPONMAIN_GET,
	COUPONCOME_GET,
	FEEDCATES_GET,
	USERAGES_GET,
	USERTAGS_GET,
	ORDERNUMS_GET,
	ORDERRETURNS_GET,
	RETURNRESON_GET,
	REVENUES_GET,
	STATICORDERS_GET,
	SHOPORDERS_GET,
	WITHDRAWORDERS_GET,
	DAYSTATIC_GET,
	DAYLASTING_GET,
	ALIVES_GET,
	TIXIAN_GET,
	XIAOSHOU_GET,
	YOUER_GET,
	NIANDUS_GET,
	DOWNDETAILS_GET,
	SQUADDETAILS_GET,
	SQUADLAST_GET,
	SQUADPRACTISE_GET,
	HOTINFO_GET,
	REWARDSTATICINFO_GET,
	MALLJUMP_GET,
	SEMINARJUMP_GET,
	REWARDEVERYINFO_GET,
	BILLDETAILS_GET,
	GUANZHU_GET,
	KAOSHI_GET,
	SHOUYI_GET,
	MANYI_GET,
	CHURUKU_GET,
	TUIHUO_GET,
	XIANXIA_GET,
	ZHIBO_GET,
	ZHONGUSER_GET,
	EVERYUSERACTIVE_GET,
	USERALLNUMBER_GET,
	XIAOSHOUFENXI_GET,
	TEACHERASKS_GET,
	GOODSRATES_GET,
	GOODSTANLE_GET,
	GSHOPUSERS_GET,
	COUPONUSE_GET,
	COUPONCOMES_GET,
	AMOUNTTOTAL_GET,
	COURSESELL_GET,
	COURSEAGENT_GET,
	CASHTOTAL_GET,
	ORDERRECHARGE_GET,
	WITHDRAWTEACHER_GET,
	CASHINTEGRAL_GET,
	CASHINTEGRALUSERS_GET,
	CASHINTERGRALRAGE_GET,
	CASHINTERGRALTEACHER_GET,
	KEYWORDSINFO_GET,
	HUDON_GET,
	PEIXUN_GET,
	SHIPINGXUEXI_GET,
	SQUADMESSAGE_GET,
	KECHENCHUXI_GET,
	JIANKON_GET,
	XIAOGUO_GET,
	WEIJING_GET,
	LIVEEXPORTS_GET,
	LIVETIMES_GET,
	LIVEREWARDS_GET,
	LIVEBAN_GET,
	ACTMESSAGE_GET,
	ACTINS_GET,
	ACTINSUSER_GET,
	LIVEHUDON_GET,
	LIVEREWARDEXPORTS_GET,
	BILLSUSEREXPORTS_GET,
	TUIHUOFENXI_GET,
	FAPIAOEXPORTS_GET,
	MEETSCORE_GET,
	MEETACTEXPORT_GET,
	MAPLEARNEXPORT_GET,
	MAINLEVELS_GET,
	MAPTESTEXPORT_GET,
	MEETTASKHISTORY_GET,
	DOWNACTEXPORT_GET,
	DOWNACTALL_GET,
	CERTIFICATIONEXPORT_GET,
	MESSAGEBACKS_GET,
	MALLLIULIANG_GET,
	MAPMAINEXPORTS_GET,
	LIVEPERSON_GET,
	LIVEKEYWORD_GET,
	DOWNLISTEXPORTS_GET,
	TIAOZHUAN_GET,
	HAIBAOSHENCHEN_GET,
	KECHENDAIHUO_GET,
	USERDAIHUO_GET,
	PAIHANGEXPORT_GET,
	TEACHERSSEXS_GET,
	TEACHERSAREA_GET,
	TEACHERSASKS_GET,
	LIVEDAIHUO_GET,
	BANSTATICS_GET,
	PINGTAIFEN_GET,
	COURSEPAPERENDS_GET,
	EVERYPV_GET,
	LIVEBADSAY_GET,
	MESSAGEEXPORTS_GET,
	MESSAGEINFOS_GET,
	TEACHERSHOUYI_GET,
	LEVELMAPS_GET,
	COURSEEXCELLINK_GET,
	COURSERESULTEXP_GET,
	COURSERESULTS_GET,
	SHOUYIS_GET,
	MAPINFOEXP_GET,
	COURSERATES,
	COURSERATE,
	LIVECOME,
} = require('../key').default;


export const getAllUserInfoStat = createAction('getAllUserInfoStat', dashboardService.getAllUserInfoStat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUserInfoStat = createAction('getUserInfoStat', dashboardService.getUserInfoStat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const exportAdexcel = createAction('exportAdexcel', dashboardService.exportAdexcel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getStatTeacherLevel = createAction('getStatTeacherLevel', dashboardService.getStatTeacherLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getStatTeacherInfo = createAction('getStatTeacherInfo', dashboardService.getStatTeacherInfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
////
export const getStatNews = createAction(STAT_NEWS_INFO, dashboardService.getStatNews, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getExpressStat = createAction(STAT_EXPRESS, dashboardService.getExpressStat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getStatCourseRelearn = createAction(STAT_COURSE_RELEARN, dashboardService.getStatCourseRelearn, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getStatCourseCateRelearn = createAction(STAT_COURSE_CATE_RELEARN, dashboardService.getStatCourseCateRelearn, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getStatCourseSingle = createAction(STAT_COURSE_SINGLE, dashboardService.getStatCourseSingle, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getStatUserSex = createAction(STAT_USER_SEX, dashboardService.getStatUserSex, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserStay = createAction(STAT_USER_STAY, dashboardService.getUserStay, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const _getStatFlag = createAction(STAT_FLAG, dashboardService.getStatFlag, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const _getStatUser = createAction(STAT_USERS, dashboardService.getStatUser,({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const _getStatUserLevel = createAction(STAT_USERLEVEL, dashboardService.getStatUserLevel,({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
//////
export const getSenExcel = createAction(EXCEL_SEN, dashboardService.getSenExcel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getSenStat = createAction(STAT_USER_SEN, dashboardService.getSenStat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserDuration = createAction(STAT_USER_DURATION, dashboardService.getUserDuration, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


export const getUserTime = createAction(STAT_USER_TIME, dashboardService.getUserTime, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUserActive = createAction(STAT_USER_ACTIVE, dashboardService.getUserActive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getUserEquity = createAction(STAT_USER_EQUITY, dashboardService.getUserEquity, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getCommentLine = createAction(STAT_COMMENT_LINE, dashboardService.getCommentLine, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getReward = createAction(STAT_REWARD, dashboardService.getReward, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserExcel = createAction(EXCEL_USER, dashboardService.getUserExcel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getRewardExcel = createAction(EXCEL_REWARD, dashboardService.getRewardExcel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getFeedExcel = createAction(EXCEL_FEED, dashboardService.getFeedExcel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getFeedLine = createAction(STAT_FEED_LINE, dashboardService.getFeedLine, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getFeedData = createAction(STAT_FEED_DATA, dashboardService.getFeedData, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCoinRank = createAction(STAT_COIN_RATE, dashboardService.getCoinRank, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseData = createAction(STAT_COURSE_DATA, dashboardService.getCourseData, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCoinOrigin = createAction(STAT_COIN_ORIGIN, dashboardService.getCoinOrigin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCoinConsume = createAction(STAT_COIN_CONSUME, dashboardService.getCoinConsume, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCoinInfo = createAction(STAT_COIN_INFO, dashboardService.getCoinInfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getStatCourseInfo = createAction(STAT_COURSE_INFO, dashboardService.getStatCourseInfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getFeedCates = createAction(FEEDCATES_GET, dashboardService.getFeedCates, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getStatCourse = createAction(STAT_COURSE, 
	async({sort,limit}) => {
		const data = await dashboardService.getStatCourse({sort,limit});
		return data;
});
export const getStatCourseCom = createAction(STAT_COURSE_COM, 
	async({sort,limit}) => {
		sort = 'comment'
		const data = await dashboardService.getStatCourse({sort,limit});
		return data;
});
export const getStatCourseHit = createAction(STAT_COURSE_HIT, 
	async({sort,limit}) => {
		sort = 'hit'
		const data = await dashboardService.getStatCourse({sort,limit});
		return data;
});
export const getStatCourseLearn = createAction(STAT_COURSE_LEARN, 
	async({sort,limit}) => {
		sort = 'learn'
		const data = await dashboardService.getStatCourse({sort,limit});
		return data;
});
export const getStatCourseScore = createAction(STAT_COURSE_SCORE, 
	async({sort,limit}) => {
		sort = 'score'
		const data = await dashboardService.getStatCourse({sort,limit});
		return data;
});
export const getStatCourseFinish = createAction(STAT_COURSE_FINISH, 
	async({sort,limit}) => {
		sort = 'finish'
		const data = await dashboardService.getStatCourse({sort,limit});
		return data;
});
////
export const getStatComment = createAction(STAT_COMMENT, 
	async() => {
		const data = await dashboardService.getStatComment();
		return data;
});
export const getStatAuth = createAction(STAT_AUTH, 
	async() => {
		const data = await dashboardService.getStatAuth();
		return data;
});

export const getStatFlag = createAction(STAT_FLAG, 
	async() => {
	const data = await dashboardService.getStatFlag();
	return data;
});
export const getStatUser = createAction(STAT_USERS, 
	async({timeType}) => {
	const data = await dashboardService.getStatUser({timeType});
	return data;
});

export const getStatUserLevel = createAction(STAT_USERLEVEL, 
	async() => {
	const data = await dashboardService.getStatUserLevel();
	return data;
});

export const getStatIntegral = createAction(STAT_INTEGRAl, 
	async({timeType}) => {
	const data = await dashboardService.getStatIntegral({timeType});
	return data;
});


/////
export const deleteFeedback = createAction(FEEDBACK_DELETE,
    dashboardService.deleteFeedback, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getFeedCate = createAction(FEED_CATEGORY_GET, 
	async({ctype,cctype,page,pageSize,keyword}) => {
	const data = await dashboardService.getFeedCate({ctype,cctype,page,pageSize,keyword});
	return data;
});


export const publishFeedCate = createAction(FEED_CATEGORY_PUBLISH,
    dashboardService.publishFeedCate, ({resolved, rejected}) => {
   return {
       resolved,
       rejected
   }
});
export const updateFeedCate = createAction(FEED_CATEGORY_UPDATE,
    dashboardService.updateFeedCate, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
/////
export const getTodo = createAction(TODO_GET, 
	async() => {
	const data = await dashboardService.getTodo();
	return data;
});
/////
export const getPost = createAction(POST_GET, 
	async({keywords,sort,status,page,pageSize,is_ship}) => {
	const data = await dashboardService.getPost({keywords,sort,status,page,pageSize,is_ship});
	return data;
});

export const updatePost = createAction(POST_UPDATE,
    dashboardService.updatePost, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

/////
export const getDoneFeedback = createAction(FEEDBACK_DONE_GET, 
	async({is_use,keyword,category_id,page,pageSize,status}) => {
	status=1
	const data = await dashboardService.getDoneFeedback({is_use,keyword,category_id,page,pageSize,status});
	return data;
});

export const getFeedback = createAction(FEEDBACK_GET, 
	async({is_use,keyword,category_id,page,pageSize,status}) => {
	const data = await dashboardService.getFeedback({is_use,keyword,category_id,page,pageSize,status});
	return data;
});

export const updateFeedback = createAction(FEEDBACK_UPDATE,
    dashboardService.updateFeedback, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const replyFeedback= createAction(FEEDBACK_REPLY,
    dashboardService.replyFeedback, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserRanks = createAction(USER_RANKS_GET, 
	async({beginTime,endTime,limit,type}) => {
	const data = await dashboardService.getUserRanks({beginTime,endTime,limit,type});
	return data;
});
export const getAskExl= createAction(ASKEXL_GET,
    dashboardService.getAskExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveExl= createAction(LIVEEXL_GET,
    dashboardService.getLiveExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGuanjianziExl= createAction(GUANJIANCIEXL_GET,
    dashboardService.getGuanjianziExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGeshengExl= createAction(GESHENGEXL_GET,
    dashboardService.getGeshengExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getZhongjiangExl= createAction(ZHONGJIANGEXL_GET,
    dashboardService.getZhongjiangExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPeixunExl= createAction(PEIXUNEXL_GET,
    dashboardService.getPeixunExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGuanggaoExl= createAction(GUANGGAOEXL_GET,
    dashboardService.getGuanggaoExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getChenjiExl= createAction(CHENGJIEXL_GET,
    dashboardService.getChenjiExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAskChartStat= createAction(ASKCHARTTART_GET,
    dashboardService.getAskChartStat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAskInfoStat= createAction(ASKINFOTART_GET,
    dashboardService.getAskInfoStat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getJifenExl= createAction(JIFENEXL_GET,
    dashboardService.getJifenExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseDao= createAction(COURSEDAO_GET,
    dashboardService.getCourseDao, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getYouhui= createAction(YOUHUI_GET,
    dashboardService.getYouhui, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getXuexiExl= createAction(XUEXIEXL_GET,
    dashboardService.getXuexiExl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCouponMain= createAction(COUPONMAIN_GET,
    dashboardService.getCouponMain, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCouponCome= createAction(COUPONCOME_GET,
    dashboardService.getCouponCome, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserAges= createAction(USERAGES_GET,
    dashboardService.getUserAges, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserTags= createAction(USERTAGS_GET,
    dashboardService.getUserTags, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getOrdernums= createAction(ORDERNUMS_GET,
    dashboardService.getOrdernums, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getOrderReturns= createAction(ORDERRETURNS_GET,
    dashboardService.getOrderReturns, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getReturnReson= createAction(RETURNRESON_GET,
    dashboardService.getReturnReson, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getRevenues= createAction(REVENUES_GET,
    dashboardService.getRevenues, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getStaticOrders= createAction(STATICORDERS_GET,
    dashboardService.getStaticOrders, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getShopOrders= createAction(SHOPORDERS_GET,
    dashboardService.getShopOrders, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getWithdrawOrders= createAction(WITHDRAWORDERS_GET,
    dashboardService.getWithdrawOrders, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getDaystatic= createAction(DAYSTATIC_GET,
    dashboardService.getDaystatic, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getDaylasting= createAction(DAYLASTING_GET,
    dashboardService.getDaylasting, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAlives= createAction(ALIVES_GET,
    dashboardService.getAlives, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTixian= createAction(TIXIAN_GET,
    dashboardService.getTixian, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getXiaoshou= createAction(XIAOSHOU_GET,
    dashboardService.getXiaoshou, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getYuer= createAction(YOUER_GET,
    dashboardService.getYuer, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getNiandus= createAction(NIANDUS_GET,
    dashboardService.getNiandus, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getDownDetails= createAction(DOWNDETAILS_GET,
    dashboardService.getDownDetails, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getSquadDetails= createAction(SQUADDETAILS_GET,
    dashboardService.getSquadDetails, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getSquadlast= createAction(SQUADLAST_GET,
    dashboardService.getSquadlast, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getSquadpractise= createAction(SQUADPRACTISE_GET,
    dashboardService.getSquadpractise, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getHotinfo= createAction(HOTINFO_GET,
    dashboardService.getHotinfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getRewardStaticInfo= createAction(REWARDSTATICINFO_GET,
    dashboardService.getRewardStaticInfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMallJump= createAction(MALLJUMP_GET,
    dashboardService.getMallJump, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getSeminarJump= createAction(SEMINARJUMP_GET,
    dashboardService.getSeminarJump, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getRewardEveryInfo= createAction(REWARDEVERYINFO_GET,
    dashboardService.getRewardEveryInfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getBillDetails= createAction(BILLDETAILS_GET,
    dashboardService.getBillDetails, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGuanzhu= createAction(GUANZHU_GET,
    dashboardService.getGuanzhu, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getKaoshi= createAction(KAOSHI_GET,
    dashboardService.getKaoshi, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getShouyi= createAction(SHOUYI_GET,
    dashboardService.getShouyi, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getShouyis= createAction(SHOUYIS_GET,
    dashboardService.getShouyis, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getManyi= createAction(MANYI_GET,
    dashboardService.getManyi, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getChuruku= createAction(CHURUKU_GET,
    dashboardService.getChuruku, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTuihuo= createAction(TUIHUO_GET,
    dashboardService.getTuihuo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getXianxia= createAction(XIANXIA_GET,
    dashboardService.getXianxia, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getZhibo= createAction(ZHIBO_GET,
    dashboardService.getZhibo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getZhongUser= createAction(ZHONGUSER_GET,
    dashboardService.getZhongUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getEveryUserActive= createAction(EVERYUSERACTIVE_GET,
    dashboardService.getEveryUserActive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserAllNumber= createAction(USERALLNUMBER_GET,
    dashboardService.getUserAllNumber, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getXiaoShouFenxi= createAction(XIAOSHOUFENXI_GET,
    dashboardService.getXiaoShouFenxi, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTeacherAsks= createAction(TEACHERASKS_GET,
    dashboardService.getTeacherAsks, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGoodsRates= createAction(GOODSRATES_GET,
    dashboardService.getGoodsRates, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGoodsTable= createAction(GOODSTANLE_GET,
    dashboardService.getGoodsTable, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getShopUsers= createAction(GSHOPUSERS_GET,
    dashboardService.getShopUsers, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCouponUse= createAction(COUPONUSE_GET,
    dashboardService.getCouponUse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCouponComes= createAction(COUPONCOMES_GET,
    dashboardService.getCouponComes, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAmountTotal= createAction(AMOUNTTOTAL_GET,
    dashboardService.getAmountTotal, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseSell= createAction(COURSESELL_GET,
    dashboardService.getCourseSell, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseAgent= createAction(COURSEAGENT_GET,
    dashboardService.getCourseAgent, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCashTotal= createAction(CASHTOTAL_GET,
    dashboardService.getCashTotal, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getOrderRecharge= createAction(ORDERRECHARGE_GET,
    dashboardService.getOrderRecharge, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getwithdrawTeacher= createAction(WITHDRAWTEACHER_GET,
    dashboardService.getwithdrawTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCashIntegral= createAction(CASHINTEGRAL_GET,
    dashboardService.getCashIntegral, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCashIntegralUsers= createAction(CASHINTEGRALUSERS_GET,
    dashboardService.getCashIntegralUsers, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCashIntegralRage= createAction(CASHINTERGRALRAGE_GET,
    dashboardService.getCashIntegralRage, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const CashIntegralTeacher= createAction(CASHINTERGRALTEACHER_GET,
    dashboardService.CashIntegralTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getKeywordsInfo= createAction(KEYWORDSINFO_GET,
    dashboardService.getKeywordsInfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getHudon= createAction(HUDON_GET,
    dashboardService.getHudon, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPeixun= createAction(PEIXUN_GET,
    dashboardService.getPeixun, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getShipingXuexi= createAction(SHIPINGXUEXI_GET,
    dashboardService.getShipingXuexi, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getSquadMessage= createAction(SQUADMESSAGE_GET,
    dashboardService.getSquadMessage, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getKechenChuXi= createAction(KECHENCHUXI_GET,
    dashboardService.getKechenChuXi, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getJianKon= createAction(JIANKON_GET,
    dashboardService.getJianKon, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getXiaoGuo= createAction(XIAOGUO_GET,
    dashboardService.getXiaoGuo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getWeiJing= createAction(WEIJING_GET,
    dashboardService.getWeiJing, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveExports= createAction(LIVEEXPORTS_GET,
    dashboardService.getLiveExports, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveTimes= createAction(LIVETIMES_GET,
    dashboardService.getLiveTimes, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveRewards= createAction(LIVEREWARDS_GET,
    dashboardService.getLiveRewards, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveBan= createAction(LIVEBAN_GET,
    dashboardService.getLiveBan, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getActMessage= createAction(ACTMESSAGE_GET,
    dashboardService.getActMessage, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getActins= createAction(ACTINS_GET,
    dashboardService.getActins, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getActinsUser= createAction(ACTINSUSER_GET,
    dashboardService.getActinsUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveHudon= createAction(LIVEHUDON_GET,
    dashboardService.getLiveHudon, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveRewardExports= createAction(LIVEREWARDEXPORTS_GET,
    dashboardService.getLiveRewardExports, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getBillsUserExporets= createAction(BILLSUSEREXPORTS_GET,
    dashboardService.getBillsUserExporets, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTuiHuo= createAction(TUIHUOFENXI_GET,
    dashboardService.getTuiHuo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getFaPiaoExports= createAction(FAPIAOEXPORTS_GET,
    dashboardService.getFaPiaoExports, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMeetScore= createAction(MEETSCORE_GET,
    dashboardService.getMeetScore, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMeetActexport= createAction(MEETACTEXPORT_GET,
    dashboardService.getMeetActexport, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMapLearnExport= createAction(MAPLEARNEXPORT_GET,
    dashboardService.getMapLearnExport, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMainLevels= createAction(MAINLEVELS_GET,
    dashboardService.getMainLevels, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMapTestExport= createAction(MAPTESTEXPORT_GET,
    dashboardService.getMapTestExport, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMeetTasksHistory= createAction(MEETTASKHISTORY_GET,
    dashboardService.getMeetTasksHistory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getDownActExport= createAction(DOWNACTEXPORT_GET,
    dashboardService.getDownActExport, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getDownActAll= createAction(DOWNACTALL_GET,
    dashboardService.getDownActAll, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCertificationExport= createAction(CERTIFICATIONEXPORT_GET,
    dashboardService.getCertificationExport, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMessageBacks= createAction(MESSAGEBACKS_GET,
    dashboardService.getMessageBacks, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMallLiuliang= createAction(MALLLIULIANG_GET,
    dashboardService.getMallLiuliang, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMapMainExports= createAction(MAPMAINEXPORTS_GET,
    dashboardService.getMapMainExports, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLivePerson= createAction(LIVEPERSON_GET,
    dashboardService.getLivePerson, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveKeyword= createAction(LIVEKEYWORD_GET,
    dashboardService.getLiveKeyword, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getDownlistExports= createAction(DOWNLISTEXPORTS_GET,
    dashboardService.getDownlistExports, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTiaozhuan= createAction(TIAOZHUAN_GET,
    dashboardService.getTiaozhuan, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getHaibaoShenchen= createAction(HAIBAOSHENCHEN_GET,
    dashboardService.getHaibaoShenchen, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getKechenDaihuo= createAction(KECHENDAIHUO_GET,
    dashboardService.getKechenDaihuo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getUserDaihuo= createAction(USERDAIHUO_GET,
    dashboardService.getUserDaihuo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPaihangExport= createAction(PAIHANGEXPORT_GET,
    dashboardService.getPaihangExport, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTeachersSexs= createAction(TEACHERSSEXS_GET,
    dashboardService.getTeachersSexs, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTeachersArea= createAction(TEACHERSAREA_GET,
    dashboardService.getTeachersArea, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTeachersAsks= createAction(TEACHERSASKS_GET,
    dashboardService.getTeachersAsks, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveDaihuo= createAction(LIVEDAIHUO_GET,
    dashboardService.getLiveDaihuo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getBanstatics= createAction(BANSTATICS_GET,
    dashboardService.getBanstatics, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPingtaiFen= createAction(PINGTAIFEN_GET,
    dashboardService.getPingtaiFen, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCoursePaperEnds= createAction(COURSEPAPERENDS_GET,
    dashboardService.getCoursePaperEnds, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getEveryPv= createAction(EVERYPV_GET,
    dashboardService.getEveryPv, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLiveBadsay= createAction(LIVEBADSAY_GET,
    dashboardService.getLiveBadsay, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMessageExports= createAction(MESSAGEEXPORTS_GET,
    dashboardService.getMessageExports, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMessageInfos= createAction(MESSAGEINFOS_GET,
    dashboardService.getMessageInfos, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTeacherShouyi= createAction(TEACHERSHOUYI_GET,
    dashboardService.getTeacherShouyi, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getLevelMaps= createAction(LEVELMAPS_GET,
    dashboardService.getLevelMaps, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getcourseExcelLink= createAction(COURSEEXCELLINK_GET,
    dashboardService.getcourseExcelLink, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseResultExp= createAction(COURSERESULTEXP_GET,
    dashboardService.getCourseResultExp, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseResults= createAction(COURSERESULTS_GET,
    dashboardService.getCourseResults, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMapInfoExp= createAction(MAPINFOEXP_GET,
    dashboardService.getMapInfoExp, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const courseRates= createAction(COURSERATES,
    dashboardService.courseRates, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const courseRate= createAction(COURSERATES,
    dashboardService.courseRate, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const liveCome= createAction(LIVECOME,
    dashboardService.liveCome, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
