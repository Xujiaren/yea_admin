import {createAction} from 'redux-actions';
import * as download from '../service/download';

const {	
	GET_PK_LEVEL
} = require('../key').default;

export const setDownloadList = createAction('setDownloadList',download.setDownloadList, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getDownloadList = createAction('getDownloadList',download.getDownloadList, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
