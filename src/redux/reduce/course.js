import createReducer from '../../util/reduce';
const {
    COURSE_UP_DOWN_TIME,
    COURSE_STAT_INFO,
    GET_STATIC_COURSE_PREVIEW_QRCODE,
    GET_COURSE_PREVIEW_QRCODE,
    COURSE_GET_INFO,
    COURSE_GET_STATIC,
    COURSE_GET_LIVE,

    COURSE_USER_EXPORT,
    COURSE_USER_IMPORT,
    COURSE_USER_GET,

    LIVE_STREAM_GET,

    LIVE_AD_GET,
	LIVE_AD_PUBLISH,
    LIVE_AD_DELETE,
    
    LIVE_GOODS_GET,
	LIVE_GOODS_PUBLISH,
    LIVE_GOODS_ACTION,
    LIVE_GOODS_UPLOAD,
    
    ROOM_USER_GET,
	ROOM_USER_KICK,
    ROOM_USER_MUTE,
    ROOM_USER_CANCEL,
    ROOM_KUSER_GET,
	ROOM_USER_REVERT,

    COURSE_GET,
	COURSE_REMOVE,
    COURSE_PUBLISH,
    COURSE_UPDATE,
    COURSE_RECOMM,
    COURSE_UP,
	COURSE_DOWN,
	COURSE_DELETE,

	COURSE_TAG_GET,
	COURSE_TAG_REMOVE,
    COURSE_TAG_PUBLISH,
    COURSE_TAG_UPDATE,

    COURSE_TAG_COURSE_REMOVE,
    COURSE_TAG_COURSE_GET,
    COURSE_TAG_COURSE_REMOVE_ALL,

	COURSE_CATEGORY_GET,
	COURSE_CATEGORY_REMOVE,
	COURSE_CATEGORY_PUBLISH,

	COURSE_CHANNEL_GET,
	COURSE_CHANNEL_REMOVE,
	COURSE_CHANNEL_PUBLISH,
    COURSE_CHANNEL_INFO_GET,
    COURSE_CHANNEL_DOWN,
    COURSE_CHANNEL_SORT,

	COURSE_CHAPTER_GET,
	COURSE_CHAPTER_REMOVE,
    COURSE_CHAPTER_PUBLISH,
    COURSE_CHAPTER_DELETE,

    COMMENTS_UPDATE_DONE,
    COMMENTS_DONE_GET,
    COMMENTS_GET,
    COMMENTS_UPDATE,
    COMMENTS_REPLY,
    	
	COMMENTS_TOP,
    COMMENTS_DELETE,
    
    GET_RE_TEACHER,
    UPDATE_RE_TEACHER,

    INDEX_CHEANNEL_GET,
    INDEX_CHEANNEL_PUBLISH,

    STUDY_MAP_GET,
	STUDY_MAP_PUBLISH,
	STUDY_MAP_ACTION,
    STUDY_MAP_IMPORT,
    STUDY_MAP_IMPORT_USER,

    COURSE_PAPER_GET,
	COURSE_PAPER_SET,
    COURSE_PAPER_ACITON,
    COURSE_CHANNELS_GET,
    COURSE_CHANNELS_PUBLISH,
    COURSES_PUBLISH,
    COURSESS_PUBLISH,
    ACTIVE_PUBLISH,
    FILE_PUBLISH, 
    COUR_PUBLISH,
    QUES_PAPER_GET,
    TAGS_GET,
    COURSE_USERS_GET,
    MAPMAIL_POST,
    MAINSS_GET, 
    MAINSSS_GET,
    ACTIVELIVE_GET,
    WENJUAN_POST,
    COURSE_CATEGORYS_GET,
    ACTREWARDS_GET,
    LIVEOUT_POST, 
    MEETCHANNELS_GET,
    LIVEHUDONG_POST,
    COURSEWATCHUSER_GET, 
    COURSESTATNUM_GET, 
    COURSELST_GET,
    COURSEASK_CHECK,
    MAP_CHECK, 
    STARTEND,
    STARTCHAT,
} = require('../key').default;

const initialState = {
    course_list:{},
    course_static_list:{},
    course_live_list:{},
    live_ad:[],
    live_goods:[],

	tag_list:{},
	log_list:{},
    category_list:{},
    channel_list:{},
    channels_list:[],
    channel_info_list:{},
    chapter_list:[],
    course_info:{},
    comments_list:{},

    re_teacher_list:[],

    course_qrcode_info:{},
    static_course_qrcode_info:{},
    room_user_list:[],
    study_level:{},

}
const actionHandler = {
    [QUES_PAPER_GET]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [COURSE_UP_DOWN_TIME]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [COURSE_PAPER_GET]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [COURSE_PAPER_SET]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [COURSE_PAPER_ACITON]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

    [COURSE_STAT_INFO]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [STUDY_MAP_PUBLISH]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [STUDY_MAP_ACTION]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [STUDY_MAP_IMPORT]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [STUDY_MAP_IMPORT_USER]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [COURSE_USERS_GET]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [STUDY_MAP_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            study_level:{
				...payload
            }
		};
    },
   
    [INDEX_CHEANNEL_PUBLISH]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [INDEX_CHEANNEL_GET]:(state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    
    [COURSE_USER_EXPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [COURSE_USER_IMPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [COURSE_USER_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    
    ////获取直播流URL

    [LIVE_STREAM_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },

    /////直播房间

    [ROOM_USER_REVERT]: (state, action) => {
        return {
            ...state,
        };
    },
    [ROOM_KUSER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },

    [ROOM_USER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [ROOM_USER_KICK]: (state, action) => {
        return {
            ...state,
        };
    },
    [ROOM_USER_MUTE]: (state, action) => {
        return {
            ...state,
        };
    },
    [ROOM_USER_CANCEL]: (state, action) => {
        return {
            ...state,
        };
    },

/////直播商品

    [LIVE_GOODS_UPLOAD]: (state, action) => {
        return {
            ...state,
        };
    },
    [LIVE_GOODS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            live_goods:[
				...payload
			]
		};
    },
    [LIVE_GOODS_PUBLISH]: (state, action) => {
        return {
            ...state,
        };
    },
    [LIVE_GOODS_ACTION]: (state, action) => {
        return {
            ...state,
        };
    },
    



    [LIVE_AD_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            live_ad:[
				...payload
			]
		};
    },
    [LIVE_AD_PUBLISH]: (state, action) => {
        return {
            ...state,
        };
    },
    [LIVE_AD_DELETE]: (state, action) => {
        return {
            ...state,
        };
    },

    [COURSE_GET_LIVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            course_live_list:{
				...payload
			}
		};
    },
/////

    
    [UPDATE_RE_TEACHER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [GET_RE_TEACHER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            re_teacher_list:[
				...payload
            ]
		};
    },
    ////////

    [COMMENTS_TOP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COMMENTS_DELETE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COMMENTS_REPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COMMENTS_UPDATE_DONE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COMMENTS_UPDATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COMMENTS_DONE_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            comments_done_list:{
				...payload
			}
		};
    },
    [COMMENTS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            comments_list:{
				...payload
			}
		};
    },
    //////
    [COURSE_UP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COURSE_DOWN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COURSE_DELETE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[COURSE_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COURSES_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COURSESS_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COURSE_UPDATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COURSE_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COURSE_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [COURSE_GET_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            course_info:{
				...payload
			}
		};
    },
    [GET_STATIC_COURSE_PREVIEW_QRCODE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            static_course_qrcode_info:{
				...payload
			}
		};
    },
    [GET_COURSE_PREVIEW_QRCODE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            course_qrcode_info:{
				...payload
			}
		};
    },
    [COURSE_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            course_list:{
				...payload
			}
		};
    },
    [COURSE_GET_STATIC]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            course_static_list:{
				...payload
			}
		};
    },
    [COURSE_TAG_PUBLISH]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_TAG_REMOVE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_TAG_UPDATE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_TAG_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            tag_list:{
                ...payload
            }
        };
    },
    [COURSE_TAG_COURSE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            tag_course_list:{
                ...payload
            }
        };
    },
    [COURSE_TAG_COURSE_REMOVE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_TAG_COURSE_REMOVE_ALL]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
//////////////
    [COURSE_CATEGORY_PUBLISH]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CATEGORY_REMOVE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CATEGORY_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            category_list:{
                ...payload
            }
        };
    },
        
//////////////

    [COURSE_CHANNEL_SORT]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CHANNEL_DOWN]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CHANNEL_PUBLISH]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CHANNELS_PUBLISH]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CHANNEL_REMOVE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CHANNEL_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            col_list:{
                ...payload
            }
        };
    },
    [COURSE_CHANNELS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            channels_list:{
                ...payload
            }
        };
    },
    [COURSE_CHANNEL_INFO_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            col_info_list:{
                ...payload
            }
        };
    },
            
    //////////////
    
    [COURSE_CHAPTER_DELETE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CHAPTER_PUBLISH]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CHAPTER_REMOVE]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CHAPTER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
            chapter_list:[
                ...payload
            ]
        };
    },
    [ACTIVE_PUBLISH]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [FILE_PUBLISH]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COUR_PUBLISH]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [TAGS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAPMAIL_POST]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAINSS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAINSSS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [ACTIVELIVE_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [WENJUAN_POST]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSE_CATEGORYS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    }, 
    [ACTREWARDS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [LIVEOUT_POST]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MEETCHANNELS_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    }, 
    [LIVEHUDONG_POST]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSEWATCHUSER_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSESTATNUM_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSELST_GET]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [COURSEASK_CHECK]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [MAP_CHECK]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [STARTEND]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
    [STARTCHAT]: (state, action) => {
        const { payload, error, meta = {} } = action;
        return {
            ...state,
        };
    },
}
export default createReducer(initialState, actionHandler);