import createReducer from '../../util/reduce';
const {ASK, ASK_INFO, ASK_PUBLISH, ASK_COMMENT, ASK_REPLY, ASK_OP, ASK_REVIEW, REPLY,  REPLY_OP, REPLY_REVIEW} = require('../key').default;

const initialState = {
	ask: {},
    ask_info: {},
    ask_comment: {},

	reply: {},
}

const actionHandler = {
	[ASK]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
		ask:{
				...payload
			}
		};
	},
    [ASK_INFO]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
		ask_info:{
				...payload
			}
		};
	},
	[ASK_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [ASK_COMMENT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
		ask_comment:{
				...payload
			}
		};
	},
	[ASK_REPLY]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [ASK_OP]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [ASK_REVIEW]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[REPLY]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
		reply:{
				...payload
			}
		};
	},
	[REPLY_REVIEW]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [REPLY_OP]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
}

export default createReducer(initialState, actionHandler);