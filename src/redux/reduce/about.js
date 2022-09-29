import createReducer from '../../util/reduce';
const {
	ABOUT_US_GET,
	AUBOUT_US_PUBLISH
} = require('../key').default;
const initialState = {

}
const actionHandler = {
    [ABOUT_US_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;return {...state,};},
    [AUBOUT_US_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
}
export default createReducer(initialState, actionHandler);