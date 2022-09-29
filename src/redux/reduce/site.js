import createReducer from '../../util/reduce';
const {
    LOGIN,
	LOGOUT,
	UPLOAD,
	GET_ROLE,
	GET_CONFIRM_IMG,
	MEDIA_ACTION,
	UPLOAD_AUTH_GET,

	CHAT_LIST,
	CHAT_INFO,
	GET_FILE,
	ACTION_FILE,
	PUBLISH_FILE,
	HELP_GET,
	HELP_ACTION,
	HELP_PUBLISH,
	SITE_CHANGE,
	TASK_GETSSS
} = require('../key').default;
const initialState = {
	user:{
		adminId: 0,
		isDelete: 0,
		isSystem: 0,
		mobile: "",
		name: "",
		roleId: 0,
		rule:[],
		status:'',
		username:'',
	},
	admin_info:{},
	img_info:{},
	media_info:{},
	upload_info:{},
	site_type:0,
	tasks_list:{}
}
const actionHandler = {
	[SITE_CHANGE]: (state, action) => {
		const { payload } = action;
		return {
			...state,
			site_type:payload
		}
	},
	[HELP_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[HELP_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[HELP_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

	[PUBLISH_FILE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[ACTION_FILE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[GET_FILE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

	[CHAT_LIST]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[CHAT_INFO]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

	[GET_CONFIRM_IMG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            img_info:{
				...payload
			}
		};
    },
	[TASK_GETSSS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
			tasks_list:{
				...payload
			}
		};
    },
	[GET_ROLE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            user:{
				...payload
			}
		};
    },
	[LOGIN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			admin_info:{
				...payload
			}
		};
    },
    [LOGOUT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[UPLOAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[UPLOAD_AUTH_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			upload_info:{
				...payload
			}
		};
	},
	[MEDIA_ACTION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			media_info:{
				...payload
			}
		};
	},
}

export default createReducer(initialState, actionHandler);