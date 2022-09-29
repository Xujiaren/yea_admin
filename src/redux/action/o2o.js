import {createAction} from 'redux-actions';
import * as o2oService from '../service/o2o';

const {
    SQUAD_COURSE_ACTION,
	SQUAD_COURSE_GET,
	SQUAD_USER_ACTION,
	SQUAD_USER_GET,
	SQUAD_ACTION,
	SQUAD_PUBLISH,
	SQUAD_GET,
	SQUAD_INFO,
	SQUAD_SIGH,
	SQUAD_EXPORT,
	SQUAD_IMPORT,
	SQUAD_IMPORT_USER_GET,
	SQUAD_USER_CLASS,
	SQUADS_PUBLISH,
	SQUADSS_PUBLISH,


} = require('../key').default;
export const getUserClassById = createAction(SQUAD_USER_CLASS, o2oService.getUserClassById, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getSquadImportUser = createAction(SQUAD_IMPORT_USER_GET, 
	async({squad_id}) => {
	const data = await o2oService.getSquadImportUser({squad_id});
	return data;
});
export const importSquadUser = createAction(SQUAD_IMPORT, o2oService.importSquadUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const exportSquadUser = createAction(SQUAD_EXPORT, o2oService.exportSquadUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const sighSquadUser = createAction(SQUAD_SIGH, o2oService.sighSquadUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


export const getSquadCourse = createAction(SQUAD_COURSE_GET, 
	async({squad_id,keyword,page,pageSize}) => {
	const data = await o2oService.getSquadCourse({squad_id,keyword,page,pageSize});
	return data;
});
export const getSquadUser = createAction(SQUAD_USER_GET, 
	async({squad_id,keyword,page,pageSize,type,status}) => {
	const data = await o2oService.getSquadUser({squad_id,keyword,page,pageSize,type,status});
	return data;
});

export const actionSquadCourse = createAction(SQUAD_COURSE_ACTION,
	o2oService.actionSquadCourse, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
export const actionSquadUser = createAction(SQUAD_USER_ACTION,
	o2oService.actionSquadUser, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
export const actionSquad = createAction(SQUAD_ACTION,
	o2oService.actionSquad, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});

export const getSquadInfo = createAction(SQUAD_INFO, 
	async({squad_id,type}) => {
	const data = await o2oService.getSquadInfo({squad_id,type});
	return data;
});
export const getO2OClass = createAction(SQUAD_GET,
	o2oService.getSquad, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
export const getSquad = createAction(SQUAD_GET, 
	async({type,keyword,stype,status,pageSize,page}) => {
	const data = await o2oService.getSquad({type,keyword,stype,status,pageSize,page});
	return data;
});
export const publishSquad = createAction(SQUAD_PUBLISH,
	o2oService.publishSquad, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});

export const publishSquadss = createAction(SQUADSS_PUBLISH,
	o2oService.publishSquadss, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});
export const publishSquads = createAction(SQUADS_PUBLISH,
	o2oService.publishSquads, ({resolved, rejected}) => {
   return {
	   resolved,
	   rejected
   }
});