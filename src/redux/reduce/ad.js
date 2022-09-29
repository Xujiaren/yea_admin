import createReducer from '../../util/reduce';
const {
	AD_TMP_GET,
	AD_TMP_REMOVE,
	AD_TMP_UPDATE,
	AD_TMP_PUBLISH,

	AD_SEN_GET,
	AD_SEN_PUBLISH,
	AD_SEN_TIMES,

	AD_MSG_GET_INFO,
	AD_MSG_GET,
	AD_MSG_UPDATE,
	AD_MSG_REMOVE,
	AD_MSG_PUBLISH,

	_AD_KEYWORD_GET,
	AD_KEYWORD_GET,
	AD_KEYWORD_REMOVE,
	AD_KEYWORD_PUBLISH,

	AD_INVITE_INFO,
	AD_INVITE_GET,
	AD_INVITE_UPDATE,
	AD_INVITE_REMOVE,
	AD_INVITE_PUBLISH,


	AD_GIFT_GET,
	AD_GIFT_UPDATE,
	AD_GIFT_REMOVE,
	AD_GIFT_PUBLISH,

	AD_ACTIVE_REWARD_GET,
	AD_ACTIVE_REWARD_PUBLISH,
	AD_ACTIVE_REWARD_RANDOM,

	AD_BILLBOARD_INFO,
	AD_BILLBOARD_GET,
	AD_BILLBOARD_UPDATE,
	AD_BILLBOARD_REMOVE,
	AD_BILLBOARD_PUBLISH,
	AD_BILLBOARD_DELETE_ALL,

	AD_ACTIVE_ITEM_GET,
	AD_ACTIVE_ITEM_PUBLISH,
	AD_ACTIVE_INFO,
	AD_ACTIVE_GET,
	AD_ACTIVE_UPDATE,
	AD_ACTIVE_REMOVE,
	AD_ACTIVE_PUBLISH,


	FEEDBACK_DONE_GET,
	FEEDBACK_GET,
	FEEDBACK_REPLY,
	FEEDBACK_UPDATE,

	FEED_CATEGORY_GET,
	FEED_CATEGORY_PUBLISH,
	FEED_CATEGORY_UPDATE,

	INVITE_PICTURE_GET,
	INVITE_PICTURE_PUBLISH,
	INVITE_PICTURE_ACTION,
	GET_INVITE_BY_ID,

	AD_BILLS_GET,
	AD_BILLS_PUBLISH,
	AD_BILLS_DELETE,

	AD_SOURCE_GET,
	AD_SOURCE_PUBLISH,

	AD_REWARD_PUBLISH,

	AD_RANKREWARD_PUBLISH,
	AD_ACTIVITYREWARD_GET,
	AD_STATISTICS_GET,
	AD_REWARDS_GET,
	AD_REWARDALL_GET,
	AD_REWARDLIST_GET,
	AD_CHECK_GET,
	AD_DOWN_DELETE,
	RANKITEM_GET,
	RANKITEM_POST,
	RANKITEM_DELETE,
	OPBILL_GET,
	OPBILL_POST,
	OPBILLS_POST,
	OPBILLS_UPDATE,
	WIDTHDRAW_EXPORT,
	DOWNADS,
} = require('../key').default;
const initialState = {
	sen_list:{},
	msg_list:{},
	keyword_list:{},

    invite_list:{},
	gift_list:{},
    billboard_list:{},

	tmp_list:{},
	active_list:{},
	invite_picture:{},
	rank_item:{}
}
const actionHandler = {
	
	[GET_INVITE_BY_ID]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[INVITE_PICTURE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [INVITE_PICTURE_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [INVITE_PICTURE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
		invite_picture:{
				...payload
			}
		};
	},
    /////
    [AD_SEN_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_SEN_TIMES]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_SEN_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
            sen_list:{
				...payload
			}
		};
	},
    /////
    [AD_MSG_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_MSG_UPDATE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_MSG_REMOVE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_MSG_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
            msg_list:{
				...payload
			}
		};
	},
	[AD_MSG_GET_INFO]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
			msg_info_list:{
				...payload
			}
		};
	},
    /////
    [AD_KEYWORD_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_KEYWORD_REMOVE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	// [_AD_KEYWORD_GET]
    [AD_KEYWORD_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
            keyword_list:{
				...payload
			}
		};
	},
    /////
    [AD_INVITE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_INVITE_UPDATE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_INVITE_REMOVE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_INVITE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
            invite_list:{
				...payload
			}
		};
	},
	[AD_INVITE_INFO]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
			invite_info:{
				...payload
			}
		};
	},
    /////
    [AD_GIFT_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_GIFT_UPDATE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_GIFT_REMOVE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_GIFT_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            gift_list:{
				...payload
			}
		};
	},
	/////
	[AD_BILLBOARD_INFO]:(state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            bill_info:{
				...payload
			}
		};
	},
	
    [AD_BILLBOARD_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_BILLBOARD_REMOVE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_BILLBOARD_UPDATE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_BILLBOARD_DELETE_ALL]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_BILLBOARD_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            billboard_list:{
				...payload
			}
		};
	},
    /////
    [AD_TMP_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_TMP_REMOVE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_TMP_UPDATE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_TMP_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            tmp_list:[
				...payload
			]
		};
	},
	////
	[AD_ACTIVE_REWARD_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            reward_list:{
                ...payload
            }
        };
	},
	[AD_ACTIVE_REWARD_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_ACTIVE_REWARD_RANDOM]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    /////
    [AD_ACTIVE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_ACTIVE_REMOVE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_ACTIVE_UPDATE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [AD_ACTIVE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            active_list:{
                ...payload
            }
        };
	},
	[AD_ACTIVE_INFO]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            active_info:{
                ...payload
            }
        };
	},
	[AD_ACTIVE_ITEM_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            active_item_list:{
                ...payload
            }
        };
	},
	[AD_ACTIVE_ITEM_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_BILLS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            bills_list:{
                ...payload
            }
        };
	},
	[AD_BILLS_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_BILLS_DELETE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_SOURCE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            source_list:{
                ...payload
            }
        };
	},
	[AD_SOURCE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_REWARD_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_RANKREWARD_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[AD_ACTIVITYREWARD_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            activity_list:{
                ...payload
            }
        };
	},
	[AD_STATISTICS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            statistics_list:{
                ...payload
            }
        };
	},
	[AD_REWARDS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            rewards_list:{
                ...payload
            }
        };
	},
	[AD_REWARDALL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            rewardall_list:{
                ...payload
            }
        };
	},
	[AD_REWARDLIST_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            reward_lists:{
                ...payload
            }
        };
	},
	[AD_CHECK_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            check_list:{
                ...payload
            }
        };
	},
	[AD_DOWN_DELETE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            down_list:{
                ...payload
            }
        };
	},
	[RANKITEM_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            rank_item:{
                ...payload
            }
        };
	},
	[RANKITEM_POST]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[RANKITEM_DELETE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[OPBILL_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[OPBILL_POST]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[OPBILLS_POST]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[OPBILLS_UPDATE]: (state, action) => {const { payload, error, meta = {} } = action;return {...state};},
	[WIDTHDRAW_EXPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state};},
	[DOWNADS]: (state, action) => {const { payload, error, meta = {} } = action;return {...state};},
}
export default createReducer(initialState, actionHandler);