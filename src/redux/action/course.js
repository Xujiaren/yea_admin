import {createAction} from 'redux-actions';
import * as courseService from '../service/course';

const {
	COURSE_UP_DOWN_TIME,
	GET_STATIC_COURSE_PREVIEW_QRCODE,
	GET_COURSE_PREVIEW_QRCODE,
	COURSE_GET_INFO,
	COURSE_GET_STATIC,
	COURSE_GET_LIVE,

	COURSE_USER_EXPORT,
	COURSE_USER_IMPORT,
	COURSE_USER_GET,

    COURSE_GET,
	COURSE_REMOVE,
    COURSE_PUBLISH,
    COURSE_UPDATE,
	COURSE_RECOMM,
	COURSE_UP,
	COURSE_DOWN,
	COURSE_DELETE,

	COURSE_TAG_COURSE_GET,
	COURSE_TAG_COURSE_REMOVE,
	COURSE_TAG_COURSE_REMOVE_ALL,

	COURSE_TAG_GET,
	COURSE_TAG_REMOVE,
	COURSE_TAG_PUBLISH,
	COURSE_TAG_UPDATE,

	COURSE_CATEGORY_GET,
	COURSE_CATEGORY_REMOVE,
	COURSE_CATEGORY_PUBLISH,
	COURSE_CATEGORY_UPDATE,

	COURSE_CHANNEL_GET,
	COURSE_CHANNEL_REMOVE,
	COURSE_CHANNEL_PUBLISH,
	COURSE_CHANNEL_UPDATE,
	COURSE_CHANNEL_INFO_GET,
	COURSE_CHANNEL_DOWN,
	COURSE_CHANNEL_SORT,

	COURSE_CHAPTER_GET,
	COURSE_CHAPTER_REMOVE,
	COURSE_CHAPTER_PUBLISH,	
	COURSE_CHAPTER_DELETE,
	
	COMMENTS_UPDATE_ALL,
	COMMENTS_DONE_GET,
	COMMENTS_GET,
    COMMENTS_UPDATE,
	COMMENTS_REPLY,
	
	COMMENTS_TOP,
	COMMENTS_DELETE,

	GET_RE_TEACHER,
	UPDATE_RE_TEACHER,

	LIVE_STREAM_GET,

	LIVE_AD_GET,
	LIVE_AD_PUBLISH,
	LIVE_AD_DELETE,
	    
    ROOM_USER_MUTE,
	ROOM_USER_KICK,
	ROOM_USER_GET,
	ROOM_USER_CANCEL,
	ROOM_KUSER_GET,
	ROOM_USER_REVERT,

	LIVE_GOODS_GET,
	LIVE_GOODS_PUBLISH,
	LIVE_GOODS_ACTION,
	LIVE_GOODS_UPLOAD,

	INDEX_CHEANNEL_GET,
	INDEX_CHEANNEL_PUBLISH,
	
	STUDY_MAP_GET,
	STUDY_MAP_PUBLISH,
	STUDY_MAP_ACTION,
	STUDY_MAP_IMPORT,
	STUDY_MAP_IMPORT_USER,
	
	COURSE_STAT_INFO,

	COURSE_PAPER_GET,
	COURSE_PAPER_SET,
    COURSE_PAPER_ACITON,
	COURSE_CHANNELS_GET,
	COURSE_CHANNELS_PUBLISH,
	COURSES_PUBLISH,
	COURSESS_PUBLISH,
	ACTIVE_PUBLISH,
	FILE_PUBLISH, 
	COUR_PUBLISH,
	QUES_PAPER_GET,
	TAGS_GET,
	COURSE_USERS_GET,
	MAPMAIL_POST, 
	MAINSS_GET,
	MAINSSS_GET, 
	ACTIVELIVE_GET,
	WENJUAN_POST, 
	COURSE_CATEGORYS_GET,
	ACTREWARDS_GET,
	LIVEOUT_POST, 
	MEETCHANNELS_GET,
	LIVEHUDONG_POST,
	COURSEWATCHUSER_GET, 
	COURSESTATNUM_GET, 
	COURSELST_GET,
	COURSEASK_CHECK,
	MAP_CHECK, 
	STARTEND,
	STARTCHAT,
} = require('../key').default;


export const exportCourseOrder = createAction('exportCourseOrder', courseService.exportCourseOrder, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const setCourseUpDownTime = createAction(COURSE_UP_DOWN_TIME, courseService.setCourseUpDownTime, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const setCoursePaper = createAction(COURSE_PAPER_SET, courseService.setCoursePaper, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCoursePaper = createAction(COURSE_PAPER_GET, courseService.getCoursePaper, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getQues = createAction(QUES_PAPER_GET, courseService.getQues, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionCoursePaper = createAction(COURSE_PAPER_ACITON, courseService.actionCoursePaper, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

///
export const getCourseStat = createAction(COURSE_STAT_INFO, courseService.getCourseStat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getStudyMapO2O = createAction('getStudyMapO2O', courseService.getStudyMapO2O, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const _getStudyMap = createAction('_getStudyMap', courseService.getStudyMap, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getStudyMap = createAction(STUDY_MAP_GET, async({level_id,map_id,page,pageSzie,type}) => {
	const data = await courseService.getStudyMap({level_id,map_id,page,pageSzie,type});
	return data;
});
export const setStudyMap = createAction(STUDY_MAP_PUBLISH, courseService.setStudyMap, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionStudyMap = createAction(STUDY_MAP_ACTION, courseService.actionStudyMap, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const importUserPublic = createAction(STUDY_MAP_IMPORT, courseService.importUserPublic, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getImportUserPublic = createAction(STUDY_MAP_IMPORT_USER, courseService.getImportUserPublic, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
////
export const getSortChannel = createAction(INDEX_CHEANNEL_GET, courseService.getSortChannel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const sortChannel = createAction(INDEX_CHEANNEL_PUBLISH, courseService.sortChannel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getCourseUser = createAction(COURSE_USER_GET, courseService.getCourseUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseUsers = createAction(COURSE_USERS_GET, courseService.getCourseUsers, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const importCourseUser = createAction(COURSE_USER_IMPORT, courseService.importCourseUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
// export const importCourseUser = createAction(COURSE_USER_IMPORT, async({file}) => {
// 	const data = await courseService.importCourseUser({file});
// 	return data;
// });
export const exportCourseUser = createAction(COURSE_USER_EXPORT, courseService.exportCourseUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

/////直播URL
export const getStreamUrl = createAction(LIVE_STREAM_GET, courseService.getStreamUrl, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

//////直播房间
export const getKickUserList = createAction(ROOM_USER_REVERT, courseService.getKickUserList, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const revertUser = createAction(ROOM_USER_CANCEL, courseService.revertUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getRoomUserList = createAction(ROOM_USER_GET, courseService.getRoomUserList, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const cancelUser = createAction(ROOM_USER_CANCEL, courseService.cancelUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const kickUser = createAction(ROOM_USER_KICK, courseService.kickUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const muteUser = createAction(ROOM_USER_MUTE, 
	courseService.muteUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


//////直播货物
export const _getLiveGoods = createAction('_getLiveGoods', courseService.getLiveGoods, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getLiveGoods = createAction(LIVE_GOODS_GET, async({course_id,keyword}) => {
	const data = await courseService.getLiveGoods({course_id,keyword});
	return data;
});
export const publishLiveGoods = createAction(LIVE_GOODS_PUBLISH, courseService.publishLiveGoods, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionLiveGoods = createAction(LIVE_GOODS_ACTION, courseService.actionLiveGoods, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const uploadLiveGoods = createAction(LIVE_GOODS_UPLOAD, courseService.uploadLiveGoods, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
///////


///////

//////直播广告
export const getLiveAd = createAction(LIVE_AD_GET, async({course_id}) => {
	const data = await courseService.getLiveAd({course_id});
	return data;
});
export const publishLiveAd = createAction(LIVE_AD_PUBLISH, courseService.publishLiveAd, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const removeLiveAd = createAction(LIVE_AD_DELETE, courseService.removeLiveAd, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
///////
export const getLiveCourse = createAction(COURSE_GET_LIVE, async({ccategoryId, keyword, page ,pageSize,category_id,ctype,live_status}) => {
	const data = await courseService.getLiveCourse({ccategoryId, keyword, page,pageSize,category_id,ctype,live_status});
	return data;
});
export const getStaticCourse = createAction(COURSE_GET_STATIC, async(ccategoryId, keyword, page = 0,pageSize,category_id) => {
	const data = await courseService.getStaticCourse(ccategoryId, keyword, page,pageSize,category_id);
	return data;
});
export const getCourseList = createAction(COURSE_GET, courseService.getCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getCourse = createAction(COURSE_GET, async({ccategoryId,keyword, page,pageSize,category_id,ctype}) => {
	const data = await courseService.getCourse({ccategoryId, keyword, page,pageSize,category_id,ctype});
	return data;
});
export const getCourselst = createAction(COURSELST_GET, courseService.getCourselst, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishCourse = createAction(COURSE_PUBLISH, courseService.publishCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishCour = createAction(COUR_PUBLISH, courseService.publishCour, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishCoursess = createAction(COURSESS_PUBLISH, courseService.publishCoursess, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishCourses = createAction(COURSES_PUBLISH, courseService.publishCourses, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const removeCourse = createAction(COURSE_REMOVE, courseService.removeCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const recommCourse = createAction(COURSE_RECOMM, courseService.recommCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const updateCourse = createAction(COURSE_UPDATE, 
	courseService.updateCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const upCourse = createAction(COURSE_UP, 
	courseService.upCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const downCourse = createAction(COURSE_DOWN, 
	courseService.downCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const deleteCourse = createAction(COURSE_DELETE, 
	courseService.deleteCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
/////
export const updateReTeacher = createAction(UPDATE_RE_TEACHER,
	courseService.updateReTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getReTeacher = createAction(GET_RE_TEACHER, 
	async() => {
	const data = await courseService.getReTeacher();
	return data;
});	
/////
export const topCommentsAll = createAction(COMMENTS_TOP,
	courseService.topCommentsAll, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const deleteCommentsAll = createAction(COMMENTS_DELETE,
	courseService.deleteCommentsAll, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getDoneComments = createAction(COMMENTS_DONE_GET, 
	async({content_id,keyword,page,sort,status,pageSize,ctype}) => {
	status=3
	const data = await courseService.getComments({content_id,keyword,page,sort,status,pageSize,ctype});
	return data;
});

export const getComments = createAction(COMMENTS_GET, 
	async({content_id,keyword,page,sort,status,pageSize,ctype}) => {
	status=0
	const data = await courseService.getComments({content_id,keyword,page,sort,status,pageSize,ctype});
	return data;
});
export const getComment = createAction(COMMENTS_GET, 
	async({content_id,keyword,page,sort,status,pageSize,ctype}) => {
	const data = await courseService.getComments({content_id,keyword,page,sort,status,pageSize,ctype});
	return data;
});
export const updateCommentsAll = createAction(COMMENTS_UPDATE_ALL,
	courseService.updateCommentsAll, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const updateComments = createAction(COMMENTS_UPDATE,
	 courseService.updateComments, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const replyComments= createAction(COMMENTS_REPLY,
	 courseService.replyComments, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
/////
/////
export const deleteChapters= createAction(COURSE_CHAPTER_DELETE,
	courseService.deleteChapter, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
export const getChapter = createAction(COURSE_CHAPTER_GET, 
	async(course_id,type) => {
	const data = await courseService.getChapter(course_id,type);
	return data;
});

export const publishChapter = createAction(COURSE_CHAPTER_PUBLISH,
	 courseService.publishChapter, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const removeChapter= createAction(COURSE_CHAPTER_REMOVE,
	 courseService.removeChapter, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
/////

export const getChannelInfo = createAction(COURSE_CHANNEL_INFO_GET, 
	async(keyword,page,course_id,category_id,pageSize) => {
	const data = await courseService.getChannelInfo(keyword,page,course_id,category_id,pageSize);
	return data;
});
export const getChannel = createAction(COURSE_CHANNEL_GET, 
	async(keyword,page,pageSize) => {
	const data = await courseService.getChannel(keyword,page,pageSize);
	return data;
});
export const getChannels = createAction(COURSE_CHANNELS_GET, 
	async(ctype,keyword,page,pageSize) => {
	const data = await courseService.getChannels(ctype,keyword,page,pageSize);
	return data;
});

export const publishChannel = createAction(COURSE_CHANNEL_PUBLISH,
	 courseService.publishChannel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishChannels = createAction(COURSE_CHANNELS_PUBLISH,
	courseService.publishChannels, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
export const removeChannel= createAction(COURSE_CHANNEL_REMOVE,
	 courseService.removeChannel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const downChannelCourse= createAction(COURSE_CHANNEL_DOWN,
	courseService.downChannelCourse, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
export const updateChannel= createAction(COURSE_CHANNEL_UPDATE,
	 courseService.updateChannel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


export const sortChannelCourse= createAction(COURSE_CHANNEL_SORT,
	courseService.sortChannelCourse, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
//////

export const getStaticCoursePreviewQrcode = createAction(GET_STATIC_COURSE_PREVIEW_QRCODE, async({course_id,ctype}) => {
	const data = await courseService.getStaticCoursePreviewQrcode({course_id,ctype});
	return data;
});

export const getCoursePreviewQrcode = createAction(GET_COURSE_PREVIEW_QRCODE, async({course_id,ctype}) => {
	const data = await courseService.getCoursePreviewQrcode({course_id,ctype});
	return data;
});
export const getCourseInfo = createAction(COURSE_GET_INFO, async(course_id) => {
	const data = await courseService.getCourseInfo(course_id);
	return data;
});
export const getCourseInfos = createAction(COURSE_CATEGORYS_GET, courseService.getCourseInfos, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCategory = createAction(COURSE_CATEGORY_GET, 
	async(keyword, page = 0,cctype, ctype,pageSize) => {
	const data = await courseService.getCategory(keyword, page,cctype, ctype,pageSize);
	return data;
});

export const getSubCategory = createAction(COURSE_CATEGORY_GET, courseService.getCategory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const publishCategory = createAction(COURSE_CATEGORY_PUBLISH, courseService.publishCategory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const removeCategory = createAction(COURSE_CATEGORY_REMOVE, courseService.removeCategory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const updateCategory = createAction(COURSE_CATEGORY_UPDATE, 
	courseService.updateCategory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


/////
export const searchTag = createAction(COURSE_TAG_GET,
	courseService.getTag, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTag = createAction(COURSE_TAG_GET, 
	async({keyword, page = 0,ttype,pageSize}) => {
	const data = await courseService.getTag({keyword, page,ttype,pageSize});
	return data;
});
export const getTags = createAction(TAGS_GET,
	courseService.getTags, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishTag = createAction(COURSE_TAG_PUBLISH,
	courseService.publishTag, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const removeTag = createAction(COURSE_TAG_REMOVE, 
	courseService.removeTag, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const updateTag = createAction(COURSE_TAG_UPDATE, 
	courseService.updateTag, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
/////
export const removeTagCourse = createAction(COURSE_TAG_COURSE_REMOVE, 
	courseService.removeTagCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const removeTagCourseAll = createAction(COURSE_TAG_COURSE_REMOVE_ALL, 
	courseService.removeTagCourseAll, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTagCourse = createAction(COURSE_TAG_COURSE_GET, 
	async(keyword,page,tag_id,pageSize) => {
	const data = await courseService.getTagCourse(keyword,page,tag_id,pageSize);
	return data;
});
export const publishActivelive = createAction(ACTIVE_PUBLISH, 
	courseService.publishActivelive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getActivelive = createAction(ACTIVELIVE_GET, 
	courseService.getActivelive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishFile = createAction(FILE_PUBLISH, 
	courseService.publishFile, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postMapMails = createAction(MAPMAIL_POST, 
	courseService.postMapMails, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMainss = createAction(MAINSS_GET, 
	courseService.getMainss, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMainsss = createAction(MAINSSS_GET, 
	courseService.getMainsss, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postWenjuan = createAction(WENJUAN_POST, 
	courseService.postWenjuan, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getActrewards = createAction(ACTREWARDS_GET, 
	courseService.getActrewards, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postLiveOut = createAction(LIVEOUT_POST, 
	courseService.postLiveOut, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMeetChannels = createAction(MEETCHANNELS_GET, 
	courseService.getMeetChannels, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postLiveHudong = createAction(LIVEHUDONG_POST, 
	courseService.postLiveHudong, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseWatchUser = createAction(COURSEWATCHUSER_GET, 
	courseService.getCourseWatchUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseStatNum = createAction(COURSESTATNUM_GET, 
	courseService.getCourseStatNum, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const checkCourseAsk = createAction(COURSEASK_CHECK, 
	courseService.checkCourseAsk, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const checkMap = createAction(MAP_CHECK, 
	courseService.checkMap, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const startEnd = createAction(STARTEND, 
	courseService.startEnd, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const startChat = createAction(STARTCHAT, 
	courseService.startChat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

