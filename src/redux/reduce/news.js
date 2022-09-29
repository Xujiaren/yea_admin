import createReducer from '../../util/reduce';
const {
	NEWS_PUBLISH,
	NEWS_GET,
	NEWS_DETAIL,
	NEWS_ACTION,
	NEWS_RESULT,
} = require('../key').default;
const initialState = {
	news_list : {},
	news_detail : {}
}
const actionHandler = {
	[NEWS_RESULT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[NEWS_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [NEWS_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [NEWS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            news_list:{
				...payload
			}
		};
	},
	[NEWS_DETAIL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            news_detail:{
				...payload
			}
		};
	},
    /////
}
export default createReducer(initialState, actionHandler);