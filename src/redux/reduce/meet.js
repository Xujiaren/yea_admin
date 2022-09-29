import createReducer from '../../util/reduce';

const {
	GET_MOOD,
    GET_MOODS,
    MOOD_PUBLISH,
    GET_MOODSS,
	GET_MOMENT,
	GET_MOM,
	MOM_PUBLISH,
	MOMENT_PUBLISH,
	MOMENTS_PUBLISH,
	PV_PUBLISH,
	GET_TASK,
	TASK_PUBLISH,
	GET_COURSELS, 
	TASKS_PUBLISH,
	TASK_DELETE,
	TAGUSER_POST,
	TAGUSER_DELETE,
	OUTS_GET,
	OUTSS_GET,
	OUTSSS_GET,
	TAGUSER_CHANGE,
	OUTTAG_GET,
	COURSEUSERSS_GET,
	MOMENTTIME_POST,
} = require('../key').default;
const initialState = {
	mood_list:{},
    moods_list:{},
    moodss_list:{},
	moment_list:{},
	mom_list:{},
	moment_lists:{},
	task_list:{},
	course_list:{}
}
const actionHandler = {
    [GET_MOOD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            mood_list:{
				...payload
			}
		};
	},
    [GET_MOODS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            moods_list:{
				...payload
			}
		};
	},
    [GET_MOODSS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            moodss_list:{
				...payload
			}
		};
	},
    [MOOD_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[GET_MOMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            moment_list:{
				...payload
			}
		};
	},
	[GET_MOM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            mom_list:{
				...payload
			}
		};
	},
	[MOM_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[MOMENT_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			moment_lists:{
				...payload
			}
		};
	},
	[MOMENTS_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[PV_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[GET_TASK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            task_list:{
				...payload
			}
		};
	},
	[TASK_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[TASKS_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[GET_COURSELS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            course_list:{
				...payload
			}
		};
	},
	[TASK_DELETE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[TAGUSER_POST]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[TAGUSER_DELETE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[OUTS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[OUTSS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[OUTSSS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[TAGUSER_CHANGE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[OUTTAG_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[COURSEUSERSS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[MOMENTTIME_POST]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
}
export default createReducer(initialState, actionHandler);