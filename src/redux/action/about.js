import {createAction} from 'redux-actions';
import * as aboutService from '../service/about';

const {
    ABOUT_US_ALL,
    ABOUT_US_PUBLISH
} = require('../key').default;

export const publishAbout = createAction(ABOUT_US_PUBLISH, aboutService.publishAbout, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAbout = createAction(ABOUT_US_ALL, aboutService.getAbout, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});