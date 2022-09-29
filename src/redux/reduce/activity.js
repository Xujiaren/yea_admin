
    
import createReducer from '../../util/reduce';
const {
    ACTIVITY_GET,
	ACTIVITY_PUBISH,
	ACTIVITY_ACTION,
	ACTIVITY_RESULT,
	
	ACTIVITY_VOTE_ADD,
	ACTIVITY_VOTE_ACTION,
	ACTIVITY_VOTE_GET,

	ACTIVITY_CHECK,
	
	ACTIVITY_IMPORT,
	ACTIVITY_QUETION_ADD,
	ACTIVITY_QUETION_GET,
	ACTIVITY_RESULT_EXPORT,
	ACTIVITY_RESULT_ACTION,
	ACTIVITY_QUETIONS_ADD,
} = require('../key').default;

const initialState = {
	activity_list:{},
	activity_result:{},
	activity_vote_list:{},
	questionna_list:[]
}


const actionHandler = {
	[ACTIVITY_QUETIONS_ADD]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[ACTIVITY_RESULT_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[ACTIVITY_RESULT_EXPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[ACTIVITY_QUETION_ADD]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [ACTIVITY_QUETION_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		console.log(payload)
		return {
			...state,
        	questionna_list: [...payload]
		};
	},

	[ACTIVITY_VOTE_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[ACTIVITY_CHECK]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[ACTIVITY_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [ACTIVITY_PUBISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [ACTIVITY_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        activity_list:{
				...payload
			}
		};
	},
	[ACTIVITY_VOTE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        activity_vote_list:{
				...payload
			}
		};
	},
	[ACTIVITY_RESULT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        activity_result:{
				...payload
			}
		};
	},

}
export default createReducer(initialState, actionHandler);