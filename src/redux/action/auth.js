
import {createAction} from 'redux-actions';
import * as auth from '../service/auth';

const {
    AUTH_CATE_GET,
	AUTH_CATE_PUBLISH,
	AUTH_PAPER_PUBLIC,
	AUTH_PAPER_GET,
	AUTH_PAPER_ACTION,
	AUTH_COURSE_PUBLISH,
	AUTH_COURSE_ACTION,
	AUTH_COURSE_GET,

	AUTH_TOPIC_ACTION,
    AUTH_TOPIC_GET,
    AUTH_TOPIC_PUBLIC,
	AUTH_PAPER_TOPIC_IMPORT,

	SQUAD_SCORE_GET,
	SQUAD_SCORE_EXPORT,


} = require('../key').default;

export const exportSquadScore = createAction(SQUAD_SCORE_EXPORT,
	auth.exportSquadScore, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getSquadScore= createAction(SQUAD_SCORE_GET, 
	async({
		squad_id,
		keyword,
		page,
		pageSize
	}) => {
		const data = await auth.getSquadScore({
			squad_id,
			keyword,
			page,
			pageSize
		});
		return data;
});

export const importAuthPaperTopic = createAction(AUTH_PAPER_TOPIC_IMPORT,
	auth.importAuthPaperTopic, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAuthTopic= createAction(AUTH_TOPIC_GET, 
	async({
		ctype,
		paper_id,
		topic_id,
		category_id,
		keyword,
		page,
		pageSize
	}) => {
		const data = await auth.getAuthTopic({
			ctype,
			paper_id,
			topic_id,
			category_id,
			keyword,
			page,
			pageSize
		});
		return data;
});
export const actionAuthTopic = createAction(AUTH_TOPIC_ACTION,
	auth.actionAuthTopic, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishAuthTopic = createAction(AUTH_TOPIC_PUBLIC,
	auth.publishAuthTopic, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getAuthCourse= createAction(AUTH_COURSE_GET, 
	async({course_id,category_id,keyword,page,pageSize}) => {
		const data = await auth.getAuthCourse({course_id,category_id,keyword,page,pageSize});
		return data;
});
export const actionAuthCourse = createAction(AUTH_COURSE_ACTION,
	auth.actionAuthCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishAuthCourse = createAction(AUTH_COURSE_PUBLISH,
	auth.publishAuthCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionAuthPaper = createAction(AUTH_PAPER_ACTION,
	auth.actionAuthPaper, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
////
export const _getAuthPaper = createAction(AUTH_PAPER_GET,
	auth.getAuthPaper, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAuthPaper= createAction(AUTH_PAPER_GET, 
	async({ctype, paper_id,keyword,page,pageSize}) => {
		const data = await auth.getAuthPaper({ctype,paper_id,keyword,page,pageSize});
		return data;
});
export const publishAuthPaper = createAction(AUTH_PAPER_PUBLIC,
	auth.publishAuthPaper, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAuthCateTopic = createAction(AUTH_CATE_GET,
	auth.getAuthCate, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAuthCate = createAction(AUTH_CATE_GET, 
	async({keyword,ctype}) => {
		const data = await auth.getAuthCate({keyword,ctype});
		return data;
});

export const publicAuthCate = createAction(AUTH_CATE_PUBLISH,
	auth.publicAuthCate, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});