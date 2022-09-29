
import {createAction} from 'redux-actions';
import * as activity from '../service/activity';

const {
    ACTIVITY_GET,
	ACTIVITY_PUBISH,
	ACTIVITY_ACTION,
	ACTIVITY_RESULT,
	
	ACTIVITY_VOTE_ADD,
	ACTIVITY_VOTE_ACTION,
	ACTIVITY_VOTE_GET,
	ACTIVITY_CHECK,
	
	ACTIVITY_IMPORT,
	ACTIVITY_QUETION_ADD,
	ACTIVITY_QUETION_GET,
	ACTIVITY_RESULT_EXPORT,
	ACTIVITY_RESULT_ACTION,
	ACTIVITY_QUETIONS_ADD,
} = require('../key').default;

export const actionActivityResult = createAction(ACTIVITY_RESULT_ACTION,
	activity.actionActivityResult, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const exportActivityResult = createAction(ACTIVITY_RESULT_EXPORT,
	activity.exportActivityResult, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const publishQuestionna = createAction(ACTIVITY_QUETION_ADD,
	activity.publishQuestionna, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishQuestionnas = createAction(ACTIVITY_QUETIONS_ADD,
	activity.publishQuestionnas, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getQuestionna = createAction(ACTIVITY_QUETION_GET, 
	async({activity_id}) => {
	const data = await activity.getQuestionna({activity_id});
	return data;
});


export const actionVote = createAction(ACTIVITY_VOTE_ACTION,
	activity.actionVote, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getActivityVote = createAction(ACTIVITY_VOTE_GET, 
	async({activity_id}) => {
	const data = await activity.getVoteList({activity_id});
	return data;
});

export const getActivity = createAction(ACTIVITY_GET, 
	async({activity_status,activity_id,atype,keyword,status,page,pageSize}) => {
	const data = await activity.getActivity({activity_status,activity_id,atype,keyword,status,page,pageSize});
	return data;
});

export const getActivityResult = createAction(ACTIVITY_RESULT, 
	async(props) => {
	const data = await activity.getActivityResult(props);
	return data;
},({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const publishActivity = createAction(ACTIVITY_PUBISH,
	activity.publishActivity, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const addVote = createAction(ACTIVITY_VOTE_ADD,
	activity.addVote, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
export const passActivityWork = createAction(ACTIVITY_CHECK,
	activity.passActivityWork, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionActivity = createAction(ACTIVITY_ACTION,
	activity.actionActivity, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});