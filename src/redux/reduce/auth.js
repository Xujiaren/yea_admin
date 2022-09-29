 import createReducer from '../../util/reduce';
const {
    AUTH_CATE_GET,
    AUTH_CATE_PUBLISH,
    AUTH_PAPER_PUBLIC,
    AUTH_PAPER_GET,
    AUTH_PAPER_ACTION,
    AUTH_COURSE_PUBLISH,
    AUTH_COURSE_ACTION,
    AUTH_COURSE_GET,

    AUTH_TOPIC_ACTION,
    AUTH_TOPIC_GET,
    AUTH_TOPIC_PUBLIC,
    AUTH_PAPER_TOPIC_IMPORT,

    SQUAD_SCORE_GET,
    SQUAD_SCORE_EXPORT,

    
} = require('../key').default;

const initialState = {
    auth_cate_list:[],
    auth_paper_list:{},
    auth_course_list:{},
    auth_topic_list:{},
    auth_squad_score:{}
}

const actionHandler = {
    [SQUAD_SCORE_EXPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [SQUAD_SCORE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        auth_squad_score:{
          ...payload
        }
      };
    },

    [AUTH_PAPER_TOPIC_IMPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AUTH_TOPIC_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        auth_topic_list:{
          ...payload
        }
      };
    },
    [AUTH_TOPIC_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AUTH_TOPIC_PUBLIC]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

    [AUTH_COURSE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        auth_course_list:{
          ...payload
        }
      };
    },
    [AUTH_COURSE_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AUTH_COURSE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AUTH_PAPER_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        auth_paper_list:{
				...payload
        }
      };
    },
    [AUTH_PAPER_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AUTH_PAPER_PUBLIC]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AUTH_CATE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AUTH_CATE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        auth_cate_list:[
				...payload
			]
		};
	},

}
export default createReducer(initialState, actionHandler);