import {createAction} from 'redux-actions';
import * as pk from '../service/pk';

const {	
	GET_PK_LEVEL
} = require('../key').default;


export const getPkMatchRank = createAction('getPkMatchRank',pk.getPkMatchRank, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPkMatchReward = createAction('getPkMatchReward',pk.getPkMatchReward, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const setPkMatchReward = createAction('setPkMatchReward',pk.setPkMatchReward, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});



export const setPkMatch = createAction('setPkMatch',pk.setPkMatch, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionPkMatch = createAction('actionPkMatch',pk.actionPkMatch, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPkMatch = createAction('getPkMatch',pk.getPkMatch, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getPkLevel = createAction(GET_PK_LEVEL,pk.getPkLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const setPkLevel = createAction('setPkLevel',pk.setPkLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPkMatchaward = createAction('getPkMatchaward',pk.getPkMatchaward, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPkcategories = createAction('getPkcategories',pk.getPkcategories, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postPkcategories = createAction('postPkcategories',pk.postPkcategories, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const deletePkcategories = createAction('deletePkcategories',pk.deletePkcategories, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getPkpaper = createAction('getPkpaper',pk.getPkpaper, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});