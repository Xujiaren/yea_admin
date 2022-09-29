import {createAction} from 'redux-actions';
import * as newsService from '../service/news';

const {
	NEWS_PUBLISH,
	NEWS_GET,
	NEWS_DETAIL,
	NEWS_ACTION,
	NEWS_RESULT,
} = require('../key').default;


export const publishNews = createAction(NEWS_PUBLISH,
	newsService.publishNews, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getNews = createAction(NEWS_GET, 
	async({teacher_id,atype,keyword,page,pageSize,ctype}) => {
	const data = await newsService.getNews({teacher_id,atype,keyword,page,pageSize,ctype});
	return data;
});
export const getNewsDetail = createAction(NEWS_DETAIL, 
	async({articleId}) => {
	const data = await newsService.getNewsDetail({articleId});
	return data;
});
export const getNewsResult = createAction(NEWS_RESULT, 
	newsService.getNewsResult, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const actionNews = createAction(NEWS_ACTION, 
	newsService.actionNews, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});