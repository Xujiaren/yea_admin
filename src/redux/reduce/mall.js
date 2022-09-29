
    
import createReducer from '../../util/reduce';
const {
	SET_GOODS_TAG,

	MALL_GOODS_RULL_PUBLISH,
	MALL_GOODS_PUBLISH,
	MALL_GOODS_ACTION,
	MALL_GOODS_GET,
	MALL_GOODS_TIME,

	GOODS_CATE_PUBLISH,
	GOODS_CATE_ACTION,
	GOODS_CATE_GET,

	GOODS_TYPE_PUBLISH,
	GOODS_TYPE_ACTION,
	GOODS_TYPE_GET,
	GOODSS_CATE_GET,

	GOODS_TYPE_ATTR_PUBLISH,
	GOODS_TYPE_ATTR_ACTION,
	GOODS_TYPE_ATTR_GET,

	GOODS_BRAND_PUBLISH,
	GOODS_BRAND_ACTION,
	GOODS_BRAND_GET,


	GOODS_ORDER_ACTION,
	GOODS_ORDER_GET,
	GOODS_ORDER_EXPORT,

	PROMOTE_PUBLISH,
	PROMOTE_ACTION,
	PROMOTE_GET,


	GOODS_RETURN_GET,
	GOODS_RETURN_ACTION,
	
	GOODS_LEVEL_PUBLISH,
	GOODS_LEVEL_GET,

	EXPRESS_GET,
	EXPRESS_PUBLISH,
	EXPRESS_ACTION,

	EXPRESS_RULL_GET,
	EXPRESS_RULL_PUBLISH,
	EXPRESS_RULL_ACTION,
	EXPRESS_REGION,


	INVENTORY_GET,
	INVENTORY_EXPORT,

	INVENTORY_ORDER_GET,
	INVENTORY_ORDER_ACTION,

	INVENTORY_ORDER_PUBLISH,
	INVENTORY_ORDER_EXPORT,
	INVENTORY_ORDER_IMPORT,
	GOODS_EXPORT,
	GOODSPRICE_GET,
	BACKADDRESS_POST,
	MALLATTR_POST,
	MALLGOODSS_GET,
	ATTRVAL_GET,
	ATTRIDS_GET,
	CATEIDS_GET,
} = require('../key').default;

const initialState = {
	goods_list:{},
	goods_cate_list:{},
	goodss_cate_list:{},
	goods_brand_list:{},
	goods_type_list:[],
	goods_type_rull:{},
	goods_order_list:{},
	goods_active:{},
	goods_return:{},
	goods_price_level:[],
	express_list:[],
	express_rule:[],
	inventory:{},
}

const actionHandler = {
	
	[INVENTORY_ORDER_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[INVENTORY_ORDER_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

	[INVENTORY_ORDER_EXPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[INVENTORY_ORDER_IMPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[GOODS_EXPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

    [INVENTORY_ORDER_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        inventory:{
				...payload
		}
	}},
	
	[EXPRESS_REGION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	
	[EXPRESS_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [EXPRESS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        express_list:[
				...payload
		]
	}},
	[EXPRESS_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

	[EXPRESS_RULL_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [EXPRESS_RULL_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        express_rule:[
				...payload
		]
	}},
	[EXPRESS_RULL_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},

	[GOODS_LEVEL_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_LEVEL_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_price_level:[
				...payload
		]
	}},

	[GOODS_RETURN_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_RETURN_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_return:{
				...payload
		}
		};
	},

	[SET_GOODS_TAG]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[PROMOTE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [PROMOTE_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [PROMOTE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_active:{
				...payload
		}
		};
	},

	[GOODS_ORDER_EXPORT]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_ORDER_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_ORDER_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_order_list:{
				...payload
		}
		};
	},
	
	[MALL_GOODS_RULL_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[MALL_GOODS_TIME]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[MALL_GOODS_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [MALL_GOODS_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [MALL_GOODS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_list:{
				...payload
		}
		};
	},

	[GOODS_TYPE_ATTR_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_TYPE_ATTR_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_TYPE_ATTR_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_type_rull:{
				...payload
		}
		};
	},

	[GOODS_TYPE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_TYPE_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_TYPE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_type_list:[
				...payload
		]
		};
	},

	[GOODS_CATE_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_CATE_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_CATE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_cate_list:{
				...payload
			}
		};
	},
	[GOODSS_CATE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goodss_cate_list:{
				...payload
			}
		};
	},
	[GOODS_BRAND_PUBLISH]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_BRAND_ACTION]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
    [GOODS_BRAND_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,
        goods_brand_list:{
				...payload
			}
		};
	},
	[GOODSPRICE_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[BACKADDRESS_POST]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[MALLATTR_POST]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[MALLGOODSS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[ATTRVAL_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[ATTRIDS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
	[CATEIDS_GET]: (state, action) => {const { payload, error, meta = {} } = action;return {...state,};},
}
export default createReducer(initialState, actionHandler);