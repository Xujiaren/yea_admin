import {createAction} from 'redux-actions';
import * as systemService from '../service/system';

const {
    SYSTEM_ADMIN_PUBLISH,
    SYSTEM_ADMIN_GET,
    SYSTEM_ADMIN_UPDATE,
	SYSTEM_ADMIN_REMOVE,

	SYSTEM_ROLE_PUBLISH,
    SYSTEM_ROLE_GET,
    SYSTEM_ROLE_UPDATE,
	SYSTEM_ROLE_INFO,
	
	SYSTEM_LOG,

	SYSTEM_RANK,
	SYSTEM_RANK_PUBLISH,
	SYSTEM_RANK_DELETE,
	ADRESSES_GET,
	NEWUSER_POST,
	NEWPSD_POST,
	COMPANYLIST_GET,
	EXROLE_GET,
	EXADMIN_POST,
	EXADMIN_GET,
	EXADMIN_DELETE,
	ADRESSESLIST_GET,
} = require('../key').default;

export const publishAdmin = createAction(SYSTEM_ADMIN_PUBLISH, systemService.publishAdmin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAdmin = createAction(SYSTEM_ADMIN_GET, async(page=0,role_id,keyword) => {
	const data = await systemService.getAdmin(page,role_id,keyword);
	return data;
});
export const deleteAdmin = createAction('deleteAdmin', systemService.deleteAdmin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const removeAdmin = createAction(SYSTEM_ADMIN_REMOVE, systemService.removeAdmin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const updateAdmin = createAction(SYSTEM_ADMIN_UPDATE, systemService.updateAdmin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});


///////////////////////////ROLE
export const publishRole = createAction(SYSTEM_ROLE_PUBLISH, systemService.publishRole, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getRole = createAction(SYSTEM_ROLE_GET, async() => {
	const data = await systemService.getRole();
	return data;
});

export const getRoleInfo = createAction(SYSTEM_ROLE_INFO, async({role_id}) => {
	const data = await systemService.getRoleInfo({role_id});
	return data;
});

export const updateRole = createAction(SYSTEM_ROLE_UPDATE, systemService.updateRole, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

////////////////
export const getLog = createAction(SYSTEM_LOG, async(page = 0,keyword,pageSize) => {
	const data = await systemService.getLog(page,keyword,pageSize);
	return data;
});

////////////////
export const getRank = createAction(SYSTEM_RANK, async(page = 0,keyword,pageSize) => {
	const data = await systemService.getRank(page,keyword,pageSize);
	return data;
});
export const publishRank = createAction(SYSTEM_RANK_PUBLISH, systemService.publishRank, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const deleteRank = createAction(SYSTEM_RANK_DELETE, systemService.deleteRank, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAdresses = createAction(ADRESSES_GET, async() => {
	const data = await systemService.getAdresses();
	return data;
});
export const postNewUser = createAction(NEWUSER_POST, systemService.postNewUser, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postNewPsd = createAction(NEWPSD_POST, systemService.postNewPsd, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCompanyList = createAction(COMPANYLIST_GET, systemService.getCompanyList, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getExRole = createAction(EXROLE_GET, systemService.getExRole, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postExAdmin = createAction(EXADMIN_POST, systemService.postExAdmin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getExAdmin = createAction(EXADMIN_GET, systemService.getExAdmin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const deleteExAdmin = createAction(EXADMIN_DELETE, systemService.deleteExAdmin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAdressesList = createAction(ADRESSESLIST_GET, systemService.getAdressesList, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});