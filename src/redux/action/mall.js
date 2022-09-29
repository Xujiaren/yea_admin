
import {createAction} from 'redux-actions';
import * as mall from '../service/mall';

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
	GOODSS_CATE_GET,

	GOODS_TYPE_PUBLISH,
	GOODS_TYPE_ACTION,
	GOODS_TYPE_GET,

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

export const getWithdrawOrder = createAction('getWithdrawOrder',
	mall.getWithdrawOrder, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const actionWithdrawOrder = createAction('actionWithdrawOrder',
	mall.actionWithdrawOrder, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})

export const getInventory = createAction(INVENTORY_ORDER_GET,
	async({
		inventory_id,
		keyword,
		itype,
		status,
		begin_time,
		end_time,
		page,
		pageSize
	}) => {
		const data = await mall.getInventory({
			inventory_id,
			keyword,
			itype,
			status,
			begin_time,
			end_time,
			page,
			pageSize
	});
	return data;
})
export const actionInventory = createAction(INVENTORY_ORDER_ACTION,
	mall.actionInventory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const publishInventory = createAction(INVENTORY_ORDER_PUBLISH,
	mall.publishInventory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const importInventory = createAction(INVENTORY_ORDER_IMPORT,
	mall.importInventory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const exportInventoryGoods = createAction(GOODS_EXPORT,
	mall.exportInventoryGoods, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const exportInventory = createAction(INVENTORY_ORDER_EXPORT,
	mall.exportInventory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
///
export const getRegion= createAction(EXPRESS_REGION, 
	mall.getRegion, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const getExpressRull= createAction(EXPRESS_RULL_GET, 
	async({
		shipping_id
	}) => {
		const data = await mall.getExpressRull({
			shipping_id
	});
	return data;
})
export const actionExpressRull = createAction(EXPRESS_RULL_ACTION,
	mall.actionExpressRull, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const publishExpressRull = createAction(EXPRESS_RULL_PUBLISH,
	mall.publishExpressRull, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})

export const getExpress= createAction(EXPRESS_GET, 
	async({
		shipping_id,
    	keyword,
	}) => {
		const data = await mall.getExpress({
			shipping_id,
    		keyword,
	});
	return data;
})
export const actionExpress = createAction(EXPRESS_ACTION,
	mall.actionExpress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const publishExpress = createAction(EXPRESS_PUBLISH,
	mall.publishExpress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})
export const getGoodsLevelPrice= createAction(GOODS_LEVEL_GET, 
	async({
		goods_id
	}) => {
		const data = await mall.getGoodsLevelPrice({
			goods_id
	});
	return data;
})
export const setGoodsLevelPrice = createAction(GOODS_LEVEL_PUBLISH,
	mall.setGoodsLevelPrice, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})

export const getGoodsReturn= createAction(GOODS_RETURN_GET, 
	async({
		order_sn,
		status,
		keyword,
		begin_time,
		end_time,
		page,
		pageSize,
	}) => {
		const data = await mall.getReturn({
			order_sn,
			status,
			keyword,
			begin_time,
			end_time,
			page,
			pageSize,
	});
	return data;
})
export const actionGoodsReturn = createAction(GOODS_RETURN_ACTION,
	mall.actionReturn, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})

export const setGoodsTag = createAction(SET_GOODS_TAG,
	mall.setGoodsTag, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})


export const publishGoodsActive = createAction(PROMOTE_PUBLISH,
	mall.publishGoodsActive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})

export const actionGoodsActive = createAction(PROMOTE_ACTION,
	mall.actionGoodsActive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
})

export const getGoodsActive= createAction(PROMOTE_GET, 
	async({
		activity_id,
		way,
		keyword,
		page,
		pageSize,
	}) => {
		const data = await mall.getGoodsActive({
			activity_id,
			way,
			keyword,
			page,
			pageSize,
	});
	return data;
})
///
///
export const publishGoodsAttr = createAction(MALL_GOODS_RULL_PUBLISH,
	mall.publishGoodsAttr, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const exportGoodsOrder= createAction(GOODS_ORDER_EXPORT, 
	mall.exportGoodsOrder, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const actionGoodsOrder = createAction(GOODS_ORDER_ACTION,
	mall.actionGoodsOrder, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const _getGoodsOrder = createAction('_getGoodsOrder',
	mall.getGoodsOrder, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getGoodsOrder= createAction(GOODS_ORDER_GET, 
	async({
		order_id,
		keyword,
		begin_time,
		end_time,
		status,
		page,
		pageSize,
	}) => {
		const data = await mall.getGoodsOrder({
			order_id,
			keyword,
			begin_time,
			end_time,
			status,
			page,
			pageSize,
	});
	return data;
});
///

export const setGoodsTime = createAction(MALL_GOODS_TIME,
	mall.setGoodsTime, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const publishMallGoods = createAction(MALL_GOODS_PUBLISH,
	mall.publishMallGoods, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMallGoods= createAction(MALL_GOODS_GET, 
	async({
		goods_id,
        brand_id,
        category_id,
        keyword,
        page,
        pageSize,
        status,
		sort
	}) => {
		const data = await mall.getMallGoods({
			goods_id,
			brand_id,
			category_id,
			keyword,
			page,
			pageSize,
			status,
			sort
	});
	return data;
});

export const actionMallGoods = createAction(MALL_GOODS_ACTION,
	mall.actionMallGoods, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
////
export const publishGoodsTypeRull = createAction(GOODS_TYPE_ATTR_PUBLISH,
	mall.publishGoodsTypeRull, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGoodsTypeRull= createAction(GOODS_TYPE_ATTR_GET, 
	async({
		attr_id,
        type_id,
        page,
		pageSize,
	}) => {
		const data = await mall.getGoodsTypeRull({
			attr_id,
			type_id,
			page,
			pageSize,
		});
	return data;
});

export const actionGoodsTypeRull = createAction(GOODS_TYPE_ATTR_ACTION,
	mall.actionGoodsTypeRull, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const publishGoodsType = createAction(GOODS_TYPE_PUBLISH,
	mall.publishGoodsType, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGoodsType= createAction(GOODS_TYPE_GET, 
	async({type_id}) => {
		const data = await mall.getGoodsType({
			type_id
		});
	return data;
});

export const actionGoodsType = createAction(GOODS_TYPE_ACTION,
	mall.actionGoodsType, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const publishGoodsBrand = createAction(GOODS_BRAND_PUBLISH,
	mall.publishGoodsBrand, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGoodsBrand= createAction(GOODS_BRAND_GET, 
	async({
		brand_id,keyword,page,pageSize}) => {
		const data = await mall.getGoodsBrand({
			brand_id,keyword,page,pageSize
		});
	return data;
});

export const actionGoodsBrand = createAction(GOODS_BRAND_ACTION,
	mall.actionGoodsBrand, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishGoodsCate = createAction(GOODS_CATE_PUBLISH,
	mall.publishGoodsCate, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGoodsCate= createAction(GOODS_CATE_GET, 
	async({category_id,keyword,page,pageSize,parent_id,ctype}) => {
		const data = await mall.getGoodsCate({category_id,keyword,page,pageSize,parent_id,ctype});
		return data;
});
export const getGoodsCates= createAction(GOODSS_CATE_GET, 
	async({category_id,keyword,page,pageSize,parent_id,ctype}) => {
		const data = await mall.getGoodsCates({category_id,keyword,page,pageSize,parent_id,ctype});
		return data;
})

export const actionGoodsCate = createAction(GOODS_CATE_ACTION,
	mall.actionGoodsCate, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getGoodsprice = createAction(GOODSPRICE_GET,
	mall.getGoodsprice, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getBackAddress = createAction('getBackAddress',
	mall.getBackAddress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postBackAddress = createAction(BACKADDRESS_POST,
	mall.postBackAddress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postMallAttr = createAction(MALLATTR_POST,
	mall.postMallAttr, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getMallGoodss = createAction(MALLGOODSS_GET,
	mall.getMallGoodss, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAttrVal = createAction(ATTRVAL_GET,
	mall.getAttrVal, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getAttrIds = createAction(ATTRIDS_GET,
	mall.getAttrIds, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getCateIds = createAction(CATEIDS_GET,
	mall.getCateIds, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getFapiaos = createAction('fapiao_get',
	mall.getFapiaos, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});