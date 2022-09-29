import createReducer from '../../util/reduce';
const {
    SQUAD_COURSE_ACTION,
	SQUAD_COURSE_GET,
	SQUAD_USER_ACTION,
	SQUAD_USER_GET,
	SQUAD_ACTION,
	SQUAD_PUBLISH,
	SQUAD_GET,
	SQUAD_INFO,
	SQUAD_EXPORT,
	SQUAD_IMPORT,
	SQUAD_SIGH,
	SQUAD_IMPORT_USER_GET,
	SQUAD_USER_CLASS,
	SQUADS_PUBLISH,
	SQUADSS_PUBLISH,

} = require('../key').default;
const initialState = {
    squad_list:{},
    squad_user_list:{},
	squad_course_list:{},
	squad_info:{},
	squad_import_user:[],

}
const actionHandler = {
	[SQUAD_IMPORT_USER_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        squad_import_user:[
				...payload
			]
		};
	},
	[SQUAD_USER_CLASS]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[SQUAD_EXPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[SQUAD_IMPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[SQUAD_SIGH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[SQUAD_COURSE_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [SQUAD_USER_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [SQUAD_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    
    [SQUAD_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [SQUAD_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        squad_list:{
				...payload
			}
		};
	},
	[SQUAD_INFO]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        squad_info:{
				...payload
			}
		};
	},
    [SQUAD_USER_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        squad_user_list:{
				...payload
			}
		};
    },
    [SQUAD_COURSE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        squad_course_list:{
				...payload
			}
		};
	},
	[SQUADS_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[SQUADSS_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	
}
export default createReducer(initialState, actionHandler);