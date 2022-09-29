import {createAction} from 'redux-actions';
import * as askService from '../service/ask';

const {ASK, ASK_INFO, ASK_PUBLISH, ASK_COMMENT, ASK_REPLY, ASK_OP, ASK_REVIEW,  REPLY,  REPLY_OP, REPLY_REVIEW} = require('../key').default;

export const ask = createAction(ASK, async(keyword, page, pageSize, status) => {
	const data = await askService.ask(keyword, page, pageSize, status);
	return data;
});

export const askInfo = createAction(ASK_INFO, async(ask_id) => {
	const data = await askService.askInfo(ask_id);
	return data;
});

export const askComment = createAction(ASK_COMMENT, async(ask_id, page, pageSize) => {
	const data = await askService.askComment(ask_id, page, pageSize);
	return data;
});

export const askPublish = createAction(ASK_PUBLISH, askService.askPublish, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const askReply = createAction(ASK_REPLY, askService.askReply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const askOp = createAction(ASK_OP, askService.askOp, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const askReview = createAction(ASK_REVIEW, askService.askReview, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const reply = createAction(REPLY, async(keyword, page, pageSize, status) => {
	const data = await askService.reply(keyword, page, pageSize, status);
	return data;
});

export const replyOp = createAction(REPLY_OP, askService.replyOp, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const replyReview = createAction(REPLY_REVIEW, askService.replyReview, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});