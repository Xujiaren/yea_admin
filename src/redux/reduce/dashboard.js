import createReducer from '../../util/reduce';
const {
    FEEDBACK_DELETE,
    FEEDBACK_DONE_GET,
    FEEDBACK_GET,
    FEEDBACK_REPLY,
    FEEDBACK_UPDATE,

    FEED_CATEGORY_GET,
    FEED_CATEGORY_PUBLISH,
    FEED_CATEGORY_UPDATE,
    
    POST_GET,
    TODO_GET,
	POST_UPDATE,
	
	STAT_COURSE_SINGLE,
	STAT_COMMENT,
    STAT_AUTH,
    STAT_INTEGRAl,
    STAT_USERS,
    STAT_USERLEVEL,
    STAT_FLAG,
	STAT_COURSE_COM,
	STAT_COURSE_HIT,
	STAT_COURSE_LEARN,
	STAT_COURSE_SCORE,
	STAT_COURSE_FINISH,
	STAT_COURSE,

	STAT_COIN_INFO,
	STAT_COURSE_INFO,
	STAT_COIN_CONSUME,
	STAT_COIN_ORIGIN,
	STAT_COURSE_DATA,
	STAT_COIN_RATE,
	STAT_FEED_DATA,
	STAT_FEED_LINE,
	EXCEL_FEED,
	EXCEL_REWARD,
	EXCEL_USER,
	EXCEL_SEN,

	STAT_COMMENT_LINE,
	STAT_REWARD,

	STAT_USER_EQUITY,
	STAT_USER_ACTIVE,
	STAT_USER_TIME,
	STAT_USER_STAY,
	STAT_USER_DURATION,
	STAT_USER_SEN,
	STAT_USER_SEX,
	STAT_COURSE_CATE_RELEARN,
	STAT_COURSE_RELEARN,
	STAT_EXPRESS,
	STAT_NEWS_INFO,
	USER_RANKS_GET, 
	ASKEXL_GET,
	LIVEEXL_GET,
	GUANJIANCIEXL_GET,
	GESHENGEXL_GET,
	ZHONGJIANGEXL_GET,
	PEIXUNEXL_GET,
	GUANGGAOEXL_GET,
	CHENGJIEXL_GET,
	ASKCHARTTART_GET,
	ASKINFOTART_GET,
	JIFENEXL_GET,
	COURSEDAO_GET,
	YOUHUI_GET,
	XUEXIEXL_GET,
	COUPONMAIN_GET,
	COUPONCOME_GET,
	FEEDCATES_GET,
	USERAGES_GET,
	USERTAGS_GET,
	ORDERNUMS_GET,
	ORDERRETURNS_GET,
	RETURNRESON_GET,
	REVENUES_GET,
	SHOPORDERS_GET,
	WITHDRAWORDERS_GET,
	DAYSTATIC_GET,
	DAYLASTING_GET,
	ALIVES_GET,
	XIAOSHOU_GET,
	YOUER_GET,
	NIANDUS_GET,
	SQUADDETAILS_GET,
	SQUADLAST_GET,
	SQUADPRACTISE_GET,
	HOTINFO_GET,
	REWARDSTATICINFO_GET,
	MALLJUMP_GET,
	SEMINARJUMP_GET,
	REWARDEVERYINFO_GET,
	BILLDETAILS_GET,
    GUANZHU_GET,
    KAOSHI_GET,
    SHOUYI_GET,
    MANYI_GET,
    CHURUKU_GET,
    TUIHUO_GET,
    XIANXIA_GET,
    ZHIBO_GET,
    ZHONGUSER_GET,
    EVERYUSERACTIVE_GET,
    USERALLNUMBER_GET,
    XIAOSHOUFENXI_GET,
    TEACHERASKS_GET,
    GOODSRATES_GET,
    GOODSTANLE_GET,
    GSHOPUSERS_GET,
    COUPONUSE_GET,
    COUPONCOMES_GET,
    AMOUNTTOTAL_GET,
    COURSESELL_GET,
    COURSEAGENT_GET,
    CASHTOTAL_GET,
    ORDERRECHARGE_GET,
    WITHDRAWTEACHER_GET,
    CASHINTEGRAL_GET,
    CASHINTEGRALUSERS_GET,
    CASHINTERGRALRAGE_GET,
    CASHINTERGRALTEACHER_GET,
    KEYWORDSINFO_GET,
    HUDON_GET,
    PEIXUN_GET,
    SHIPINGXUEXI_GET,
    SQUADMESSAGE_GET,
    KECHENCHUXI_GET,
    JIANKON_GET,
    XIAOGUO_GET,
    WEIJING_GET,
    LIVEEXPORTS_GET,
    LIVETIMES_GET,
    LIVEREWARDS_GET,
    LIVEBAN_GET,
    ACTMESSAGE_GET,
    ACTINS_GET,
    ACTINSUSER_GET,
    LIVEHUDON_GET,
    LIVEREWARDEXPORTS_GET,
    BILLSUSEREXPORTS_GET,
    TUIHUOFENXI_GET,
    FAPIAOEXPORTS_GET,
    MEETSCORE_GET,
    MEETACTEXPORT_GET,
    MAPLEARNEXPORT_GET,
    MAINLEVELS_GET,
    MAPTESTEXPORT_GET,
    MEETTASKHISTORY_GET,
    DOWNACTEXPORT_GET,
    DOWNACTALL_GET,
    CERTIFICATIONEXPORT_GET,
    MESSAGEBACKS_GET,
    MALLLIULIANG_GET,
    MAPMAINEXPORTS_GET,
    LIVEPERSON_GET,
    LIVEKEYWORD_GET,
    DOWNLISTEXPORTS_GET,
    TIAOZHUAN_GET,
    HAIBAOSHENCHEN_GET,
    KECHENDAIHUO_GET,
    USERDAIHUO_GET,
    PAIHANGEXPORT_GET,
    TEACHERSSEXS_GET,
    TEACHERSAREA_GET,
    TEACHERSASKS_GET,
    LIVEDAIHUO_GET,
    BANSTATICS_GET,
    PINGTAIFEN_GET,
    COURSEPAPERENDS_GET,
    EVERYPV_GET,
    LIVEBADSAY_GET,
    MESSAGEEXPORTS_GET,
    MESSAGEINFOS_GET,
    TEACHERSHOUYI_GET,
    LEVELMAPS_GET,
    COURSEEXCELLINK_GET,
    COURSERESULTEXP_GET,
    COURSERESULTS_GET,
    SHOUYIS_GET,
    MAPINFOEXP_GET,
    COURSERATES,
    COURSERATE,
    LIVECOME,
} = require('../key').default;

const initialState = {
    post_list:{},
    todo_info:{},
    feed_list:{},
    feed_done_list:{},
    feed_cate_list:{},
    stat_integral:{},
    stat_user:{},
    stat_userLevel:{},
	stat_flag:{},

	stat_course:[],
	stat_course_com:[],
	stat_course_hit:[],
	stat_course_learn:[],
	stat_course_score:[],
	stat_course_finish:[],

    stat_auth:{},
    stat_comment:{},
    user_ranks:[],
}
const actionHandler = {
	////CHART
	[STAT_NEWS_INFO]: (state, action) => ({...state}),
	[STAT_EXPRESS]: (state, action) => ({...state}),
	[STAT_COURSE_CATE_RELEARN]: (state, action) => ({...state}),
	[STAT_COURSE_RELEARN]: (state, action) => ({...state}),
	[STAT_COURSE_SINGLE]: (state, action) => ({...state}),
	[EXCEL_SEN]: (state, action) => ({...state}),
	[STAT_USER_SEN]: (state, action) => ({...state}),
	[STAT_USER_SEX]: (state, action) => ({...state}),
	[STAT_USER_DURATION]: (state, action) => ({...state}),
	[STAT_USER_EQUITY]: (state, action) => ({...state}),
	[STAT_USER_ACTIVE]: (state, action) => ({...state}),
	[STAT_USER_TIME]: (state, action) => ({...state}),
	[STAT_USER_STAY]: (state, action) => ({...state}),
	[STAT_REWARD]: (state, action) => ({...state}),
	[EXCEL_USER]: (state, action) => ({...state}),
	[EXCEL_REWARD]: (state, action) => ({...state}),
	[EXCEL_FEED]: (state, action) => ({...state}),
	[STAT_COMMENT_LINE]: (state, action) => ({...state}),
	[STAT_FEED_LINE]: (state, action) => ({...state}),
	[STAT_FEED_DATA]: (state, action) => ({...state}),
	[STAT_COIN_RATE]: (state, action) => ({...state}),
	[STAT_COURSE_DATA]: (state, action) => ({...state}),
	[STAT_COIN_ORIGIN]: (state, action) => ({...state}),
	[STAT_COIN_INFO]: (state, action) => ({...state}),
	[STAT_COIN_CONSUME]: (state, action) => ({...state}),
	[STAT_COURSE_INFO]: (state, action) => ({...state}),
	
	[STAT_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			stat_course:[
				...payload
			]
		};
	},
	[STAT_COURSE_FINISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			stat_course_finish:[
				...payload
			]
		};
	},
	[STAT_COURSE_SCORE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			stat_course_score:[
				...payload
			]
		};
	},
	[STAT_COURSE_LEARN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			stat_course_learn:[
				...payload
				]
			};
	},
	[STAT_COURSE_HIT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
		...state,
		stat_course_hit:[
		...payload
		]
		};
	},
	[STAT_COURSE_COM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
		...state,
		stat_course_com:[
		...payload
		]
		};
	},
	///
  	[STAT_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
        ...state,
        stat_comment:{
          ...payload
        }
		};
	},
	[STAT_AUTH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            stat_auth:{
				...payload
			}
		};
	},
  	
	[STAT_FLAG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            stat_flag:{
				...payload
			}
		};
	},
	[STAT_INTEGRAl]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            stat_integral:{
				...payload
			}
		};
	},
	[STAT_USERS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            stat_user:{
				...payload
			}
		};
	},
	[STAT_USERLEVEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            stat_userLevel:{
				...payload
			}
		};
    },
 	///////
	[FEEDBACK_DELETE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [FEED_CATEGORY_UPDATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [FEED_CATEGORY_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [FEED_CATEGORY_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            feed_cate_list:{
				...payload
			}
		};
    },
    ///
    [FEEDBACK_REPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [FEEDBACK_UPDATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [FEEDBACK_DONE_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            feed_done_list:{
				...payload
			}
		};
    },
    [FEEDBACK_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            feed_list:{
				...payload
			}
		};
    },
    ///
    [POST_UPDATE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[POST_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            post_list:{
                ...payload
            }
        };
    },
    [TODO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            todo_info:{
                ...payload
            }
        };
    },
	[USER_RANKS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            user_ranks:[
                ...payload
			]
        };
    },
	[ASKEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[LIVEEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[GUANJIANCIEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[GESHENGEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[ZHONGJIANGEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[PEIXUNEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[GUANGGAOEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[CHENGJIEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[ASKCHARTTART_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[ASKINFOTART_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[JIFENEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[COURSEDAO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[YOUHUI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[XUEXIEXL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[COUPONMAIN_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[COUPONCOME_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[FEEDCATES_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[USERAGES_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[USERTAGS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[ORDERNUMS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[ORDERRETURNS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[RETURNRESON_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[REVENUES_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[SHOPORDERS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[WITHDRAWORDERS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[DAYSTATIC_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[DAYLASTING_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[ALIVES_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[XIAOSHOU_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[YOUER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[NIANDUS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[SQUADDETAILS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[SQUADLAST_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[SQUADPRACTISE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[HOTINFO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[REWARDSTATICINFO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[MALLJUMP_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[SEMINARJUMP_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[REWARDEVERYINFO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
	[BILLDETAILS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [GUANZHU_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [KAOSHI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [SHOUYI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MANYI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [CHURUKU_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TUIHUO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [XIANXIA_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [ZHIBO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [ZHONGUSER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [EVERYUSERACTIVE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [USERALLNUMBER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [XIAOSHOUFENXI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TEACHERASKS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [GOODSRATES_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [GOODSTANLE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [GSHOPUSERS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COUPONUSE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COUPONCOMES_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [AMOUNTTOTAL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSESELL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSEAGENT_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [CASHTOTAL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [ORDERRECHARGE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [WITHDRAWTEACHER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [CASHINTEGRAL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [CASHINTEGRALUSERS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [CASHINTERGRALRAGE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [CASHINTERGRALTEACHER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [KEYWORDSINFO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [HUDON_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [PEIXUN_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [SHIPINGXUEXI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [SQUADMESSAGE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [KECHENCHUXI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [JIANKON_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [XIAOGUO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [WEIJING_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEEXPORTS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVETIMES_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEREWARDS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEBAN_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [ACTMESSAGE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [ACTINS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [ACTINSUSER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEHUDON_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEREWARDEXPORTS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [BILLSUSEREXPORTS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TUIHUOFENXI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [FAPIAOEXPORTS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MEETSCORE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MEETACTEXPORT_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAPLEARNEXPORT_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAINLEVELS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAPTESTEXPORT_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MEETTASKHISTORY_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [DOWNACTEXPORT_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [DOWNACTALL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [CERTIFICATIONEXPORT_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MESSAGEBACKS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MALLLIULIANG_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAPMAINEXPORTS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEPERSON_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEKEYWORD_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [DOWNLISTEXPORTS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TIAOZHUAN_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [HAIBAOSHENCHEN_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [KECHENDAIHUO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [USERDAIHUO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [PAIHANGEXPORT_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TEACHERSSEXS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TEACHERSAREA_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TEACHERSASKS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEDAIHUO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [BANSTATICS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [PINGTAIFEN_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSEPAPERENDS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [EVERYPV_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEBADSAY_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MESSAGEEXPORTS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MESSAGEINFOS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TEACHERSHOUYI_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LEVELMAPS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSEEXCELLINK_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSERESULTEXP_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSERESULTS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [SHOUYIS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAPINFOEXP_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSERATES]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSERATE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVECOME]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
}
export default createReducer(initialState, actionHandler);