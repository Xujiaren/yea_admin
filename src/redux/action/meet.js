import {createAction} from 'redux-actions';
import * as meetService from '../service/meet';

const {
	GET_MOOD,
    GET_MOODS,
    MOOD_PUBLISH,
    GET_MOODSS,
	GET_MOMENT,
	GET_MOM,
	MOM_PUBLISH,
	MOMENT_PUBLISH,
	MOMENTS_PUBLISH,
	PV_PUBLISH,
	GET_TASK,
	TASK_PUBLISH,
	GET_COURSELS, 
	TASKS_PUBLISH,
	TASK_DELETE,
	TAGUSER_POST,
	TAGUSER_DELETE,
	OUTS_GET,
	OUTSS_GET,
	OUTSSS_GET,
	TAGUSER_CHANGE,
	OUTTAG_GET,
	COURSEUSERSS_GET,
	MOMENTTIME_POST,
} = require('../key').default;

export const getMood = createAction(GET_MOOD, 
	async({keyword,page,pageSize,status}) => {
	const data = await meetService.getMood({keyword,page,pageSize,status});
	return data;
});

export const getMoods = createAction(GET_MOODS, 
	async({keyword,page,pageSize,status}) => {
	const data = await meetService.getMoods({keyword,page,pageSize,status});
	return data;
});
export const getMoodss = createAction(GET_MOODSS, 
	async({keyword,page,pageSize,status}) => {
	const data = await meetService.getMoodss({keyword,page,pageSize,status});
	return data;
});
export const publishMood = createAction(MOOD_PUBLISH,
	meetService.publishMood, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMoment = createAction(GET_MOMENT, 
	async({keyword,page,pageSize}) => {
	const data = await meetService.getMoment({keyword,page,pageSize});
	return data;
});
export const getMom = createAction(GET_MOM, 
	async({articleId}) => {
	const data = await meetService.getMom({articleId});
	return data;
});
export const publishMom = createAction(MOM_PUBLISH,
	meetService.publishMom, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishMoment = createAction(MOMENT_PUBLISH,
	async({title,article_img,content,files,content1,ftype,name,article_id, downId, img_url}) => {
		const data = await meetService.publishMoment({title,article_img,content,files,content1,ftype,name,article_id, downId, img_url});
		return data;
});
export const publishMoments = createAction(MOMENTS_PUBLISH,
	meetService.publishMoments, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishPv = createAction(PV_PUBLISH,
	meetService.publishPv, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTasks = createAction(GET_TASK, 
	async({taskId,keyword,page,pageSize}) => {
	const data = await meetService.getTasks({taskId,keyword,page,pageSize});
	return data;
});
export const publishTask = createAction(TASK_PUBLISH,
	meetService.publishTask, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishTasks = createAction(TASKS_PUBLISH,
	meetService.publishTasks, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseLs = createAction(GET_COURSELS, 
	async({category_id,ccategoryId,live_status,page,pageSize,sort}) => {
	const data = await meetService.getCourseLs({category_id,ccategoryId,live_status,page,pageSize,sort});
	return data;
});
export const deleteTask = createAction(TASK_DELETE,
	meetService.deleteTask, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postTagUser = createAction(TAGUSER_POST,
	meetService.postTagUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const deleteTagUser = createAction(TAGUSER_DELETE,
	meetService.deleteTagUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getOuts = createAction(OUTS_GET,
	meetService.getOuts, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getOutss = createAction(OUTSS_GET,
	meetService.getOutss, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getOutsss = createAction(OUTSSS_GET,
	meetService.getOutsss, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const changeTagUser = createAction(TAGUSER_CHANGE,
	meetService.changeTagUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getOutTag = createAction(OUTTAG_GET,
	meetService.getOutTag, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCourseUserss = createAction(COURSEUSERSS_GET,
	meetService.getCourseUserss, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postMomentTime = createAction(MOMENTTIME_POST,
	meetService.postMomentTime, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});