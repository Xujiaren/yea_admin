import createReducer from '../../util/reduce';
const {
	USER_GET,
	USER_KEYWORD,
	USER_INFO,
	USER_INFO_COMMENT,
	USER_INFO_FEEDBACK,

	USER_REMOVE,
	USER_PUBLISH,
	USER_UPDATE,
	USER_CHARGE,
	USER_UNAUTH,

    LEVEL_GET,
    LEVEL_REMOVE,
    LEVEL_PUBLISH,

    EQUITY_GET,
    EQUITY_REMOVE,
	EQUITY_PUBLISH,

	INTEGRAL_GET,
	INTEGRAL_PUBLISH,

	TEACHER_LEADER_GET,

	MEDAL_GET,
	MEDAL_PUBLISH,
	MEDAL_ACTION,
	MEDAL_EVENT_GET,
	USER_DETAIL_GET,
	USER_LEVEL_LOG_GET,
	NUM_PUBLISH,
	NUM_GET,
	NUMS_GET,
	RECHARGE_GET,
	RECHARGEITEM_GET,
	RECHARGEITEM_PUBLISH,
	REWARDS_GET,
	REWARDSS_GET, 
	REWARD_POST, 
	POINT_POST,
	MESS_POST,
	NUMSS_GET,
	RANKREWARDS_GET,
	REMIND_SEND,
	USERS_IMPORT,
	FOR_NUMBER,
	GOODSODERS_GET,
	GOODSODERS_IMPORT,
	FAPIAOS_POST,
	GUIZE_POST,
	ZHUNRU_POST,
	ZHUNRUUSER_GET,
	INVITEOUT_GET,
	INVITEUSEROUT_GET,
	ZHUNRUEXPORT_GET,
	QIANDAO_POST,
} = require('../key').default;
const initialState = {
	kuser_list: [],
    equity_list:{},
	level_list:[],
	user_info:{},
	integral_list:[],

	medal_list:{},
	num:[],
	nums:[],
	numss:[],
	recharge:[],
	item:{},
	rewards:[],
	rankRewards:[]
}

const actionHandler = {
	[USER_LEVEL_LOG_GET]: (state, action) => ({...state}),
	[USER_DETAIL_GET]: (state, action) => ({...state}),
	[USER_KEYWORD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			kuser_list: payload,
		};
    },
	[MEDAL_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			medal_list: {
                ...payload
			}
		};
    },
	[MEDAL_PUBLISH]: (state, action) => ({...state}),
	[MEDAL_ACTION]: (state, action) => ({...state}),
	[MEDAL_EVENT_GET]: (state, action) => ({...state}),

	[TEACHER_LEADER_GET]: (state, action) => ({...state}),
	[USER_INFO_COMMENT]: (state, action) => ({...state}),
	[USER_INFO_FEEDBACK]: (state, action) => ({...state}),
	[INTEGRAL_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			integral_list: [
                ...payload
            ]
		};
    },
	[INTEGRAL_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	////////////
    [EQUITY_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			equity_list: [
				...payload
			]
		};
    },
    [EQUITY_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state
		};
    },
    [EQUITY_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state
		};
    },
    ////////////////
    [LEVEL_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			level_list: [
                ...payload
            ]
		};
    },
    [LEVEL_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state
		};
    },
    [LEVEL_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state
		};
    },
    ////////////////
	[USER_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			user_list: {
				...payload
			}
		};
	},
	[USER_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			user_info: {
				...payload
			}
		};
	},
	[USER_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_UNAUTH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_UPDATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[USER_CHARGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[NUM_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[NUM_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			num: [
                ...payload
			]
		};
    },
	[NUMS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			nums: [
                ...payload
			]
		};
    },
	[RECHARGE_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			recharge: [
                ...payload
			]
		};
    },
	[RECHARGEITEM_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			item: {
                ...payload
			}
		};
    },
	[RECHARGEITEM_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[REWARDS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			rewards: {
                ...payload
			}
		};
    },
	[REWARDSS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			rewardss: {
                ...payload
			}
		};
    },
	[REWARD_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[POINT_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[MESS_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[NUMSS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			numss: {
                ...payload
			}
		};
    },
	[RANKREWARDS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			rankRewards: {
                ...payload
			}
		};
    },
	[REMIND_SEND]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[USERS_IMPORT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[FOR_NUMBER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[GOODSODERS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[GOODSODERS_IMPORT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[FAPIAOS_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[GUIZE_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[ZHUNRU_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[ZHUNRUUSER_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[INVITEOUT_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[INVITEUSEROUT_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[ZHUNRUEXPORT_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[QIANDAO_POST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
}
export default createReducer(initialState, actionHandler);