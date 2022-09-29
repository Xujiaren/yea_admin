import createReducer from '../../util/reduce';
const {
	GET_CHECK_LIST,
	TEACHER_GET,
	TEACHER_INFO,
	TEACHER_REMOVE,
	TEACHER_PUBLISH,
	TEACHER_UPDATE,
	TEACHER_RECOMM,

	TEACHER_RANK,
	TEACHER_APPLY,
	TEACHER_APPLY_PUBLISH,
	TEACHER_APPLY_ACTION,
	TEACHER_APPLY_SETTING,
	TEACHER_APPLY_SETTING_PUBLISH,

	TEACHER_LEVEL_GET,
	TEACHER_LEVEL_CHANGE,

	TEACHER_APPLY_IMPORT,
	TEACHER_APPLY_EXPORT,
	IMPORT_TEACHER_COURSE_DATA,
	GET_USER_BY_SN,
	TEACHERS_GET,
	TEACHERSHENG_RECOMM,
	TEACHERBIND_POST,
	TEACHERINOFS_GET,
} = require('../key').default;
const initialState = {
	teacher_list:{},
	teachers_list:{},
	teacher_info:{},
	teacher_apply:{},
	teacher_rank:{}
}
const actionHandler = {
	
	[GET_USER_BY_SN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[GET_CHECK_LIST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[IMPORT_TEACHER_COURSE_DATA]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_APPLY_IMPORT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_APPLY_EXPORT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[TEACHER_LEVEL_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_LEVEL_CHANGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[TEACHER_APPLY_SETTING]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_APPLY_SETTING_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_APPLY_ACTION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_APPLY_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_RANK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teacher_rank: {
				...payload
			}
		};
	},
	[TEACHER_APPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teacher_apply: {
				...payload
			}
		};
	},
	[TEACHER_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teacher_list: {
				...payload
			}
		};
	},
	[TEACHERS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teachers_list: {
				...payload
			}
		};
	},
	[TEACHER_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teacher_info: {
				...payload
			}
		};
	},
	[TEACHER_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_UPDATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[TEACHERSHENG_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[TEACHERBIND_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[TEACHERINOFS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
}
export default createReducer(initialState, actionHandler);