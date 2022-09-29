import createReducer from '../../util/reduce';
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
const initialState = {
	admin_list:[],
	role_list:[],
	log_list:[],
	adresses_list:[]
}
const actionHandler = {
	[SYSTEM_ADMIN_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [SYSTEM_ADMIN_UPDATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [SYSTEM_ADMIN_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [SYSTEM_ADMIN_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            admin_list:{
				...payload
			}
		};
	},
//ROLE
	[SYSTEM_ROLE_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [SYSTEM_ROLE_UPDATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [SYSTEM_ROLE_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            role_info:{
				...payload
			}
		};
	},
    [SYSTEM_ROLE_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            role_list:[
				...payload
			]
		};
	},
//////////////LOG
	[SYSTEM_LOG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            log_list:{
				...payload
			}
		};
	},
//////////////RANK
	[SYSTEM_RANK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			rank_list:{
				...payload
			}
		};
	},
	[SYSTEM_RANK_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[SYSTEM_RANK_DELETE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[ADRESSES_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			adresses_list:[
				...payload
			]
		};
	},
	[NEWUSER_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[NEWPSD_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[COMPANYLIST_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[EXROLE_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[EXADMIN_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[EXADMIN_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[EXADMIN_DELETE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[ADRESSESLIST_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
}


export default createReducer(initialState, actionHandler);