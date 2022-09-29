import request from '../../util/net';

export function getWithdrawOrder({
    atype,
    begin,
    end,
    is_done,
    keyword,
    page,
    page_size,
    status,
    userId
}) {
    return request.get('/operate/withdraw', {
        atype,
        begin,
        end,
        is_done,
        keyword,
        page,
        page_size,
        status,
        userId
    })
}

export function actionWithdrawOrder({
    is_done,
    withdraw_id,
}) {
    return request.post('/operate/withdraw/deal', {
        is_done,
        withdraw_id,
    })
}

export function getInventory({
    inventory_id,
    keyword,
    itype,
    status,
    begin_time,
    end_time,
    page,
    pageSize
}) {
    return request.get('/goods/inventory', {
        inventory_id,
        keyword,
        itype,
        status,
        begin_time,
        end_time,
        page,
        pageSize
    })
}
export function publishInventory({
    itype,
    remark,
    goods_list
}) {
    return request.post('/goods/inventory/apply', {
        itype,
        remark,
        goods_list
    })
}
export function actionInventory({
    inventory_id,
    remark,
    status,
    action,
}) {
    return request.post('/goods/inventory/update', {
        inventory_id,
        remark,
        status,
        action,
    })
}
export function importInventory({
    fileUrl,
    itype,
}) {
    return request.post('/goods/inventory/import', {
        fileUrl,
        itype,
    })
}
export function exportInventory({
    inventory_ids,
    itype,
}) {
    return request.get('/goods/inventory/export', {
        inventory_ids,
        itype,
    })
}

export function exportInventoryGoods({
}) {
    return request.get('/goods/stock/export', {
    })
}

////

export function actionReturn({
    order_id,
    goods_id,
    shipping_name,
    shipping_sn,
    is_receive,

    admin_status,
    admin_reason,

    action
}) {

    if(action=='update')
        return request.post('/goods/return/update', {
            orderId:order_id,
            goodsId:goods_id,
            admin_status:admin_status,
            admin_reason:admin_reason,
        })
    else
        return request.post('/goods/return/receive', {
            order_id,
            goods_id,
            shipping_name,
            shipping_sn,
            is_receive,
        })

}

export function getReturn({
    keyword,
    status,
    begin_time,
    end_time,
    page,
    pageSize
}) {
    return request.get('/goods/return', {
        keyword,
        status,
        begin_time,
        end_time,
        page,
        pageSize
    })
}

export function getRegion({
    region_id,
    region_type
}) {
    return request.get('/goods/region', {
        region_id,
        region_type
    })
}


export function actionExpressRull({
    rule_id
}) {
    return request.post('/goods/logistics/freight/update', {
        rule_id
    })
}
export function publishExpressRull({
    rule_id,
    rule_name,

    rule_status,
    city_ids,
    cfg,
}) {
    return request.post('/goods/logistics/freight/publish', {
        rule_id,
        rule_name,

        rule_status,
        city_ids,
        cfg,
    })
}
export function getExpressRull({
    shipping_id,
}) {
    return request.get('/goods/logistics/freight', {
        shipping_id
    })
}
///
export function actionExpress({
    shipping_id,
    action
}) {
    return request.post('/goods/logistics/update', {
        shipping_id,
        action
    })
}
export function publishExpress({
    shipping_id,
    shipping_name,
    shipping_url,
    status,
    is_default,
    rule_name,
    first_price,
    added_weight,
    added_price,
    added_number_price,
    rule_status,
    stype,
    first_weight,
    added_number,
}) {
    return request.post('/goods/logistics/publish', {
        shipping_id,
        shipping_name,
        shipping_url,
        status,
        is_default,
        rule_name,
        first_price,
        added_weight,
        added_price,
        added_number_price,
        rule_status,
        stype,
        first_weight,
        added_number,
    })
}
export function getExpress({
    shipping_id,
    keyword,
}) {
    return request.get('/goods/logistics', {
        shipping_id,
        keyword,
    })
}

////
export function getGoodsLevelPrice({
    goods_id,
    type
}) {
    return request.post('/goods/amount', {
        goods_id,
        type
    })
}

export function setGoodsLevelPrice({
    goods_id,
    level,
    goods_amount,
    type,
    discount
}) {
    return request.post('/goods/amount/publish', {
        goods_id,
        level,
        goods_amount,
        type,
        discount
    })
}

export function setGoodsTag({
    goods_id,
    tagName,
}) {
    return request.post('/goods/tag/update', {
        goods_id,
        tag_name:tagName,
    })
}
export function publishGoodsActive({
    activity_id,
    title,
    begin_time,
    end_time,
    goods_limit,
    status,
    goods_ids,
    goods_amount,
    way,
    cond_fir,
    cond_sec,
}) {
    return request.post('/goods/activity/publish', {
        activity_id,
        title,
        begin_time,
        end_time,
        goods_limit,
        status,
        goods_ids,
        goods_amount,
        way,
        cond_fir,
        cond_sec,
    })
}

export function getGoodsActive({
    activity_id,
    way,
    keyword,
    page,
    pageSize,
}) {
    return request.get(`/goods/activity`, {
        activity_id,
		way,
		keyword,
		page,
		pageSize,
    })
}

export function actionGoodsActive({
    activity_id,
    action,
    order_sort
}) {
    return request.post('/goods/activity/update', {
        activity_id,
        action,
        order_sort
    })
}
///
export function getGoodsOrder({
    order_id,
    keyword,
    begin_time,
    end_time,
    status,
    page,
    pageSize,
}) {
    return request.get(`/goods/order`, {
        order_id,
        keyword,
        begin_time,
        end_time,
        status,
        page,
        pageSize,
    })
}
export function exportGoodsOrder({
    order_ids,
    action
}) {
    let url = ''
    if(action == 'in_order')
       url = '/goods/order/export/distributionlist'
    if(action == 'send_order')
        url = '/goods/order/export/invoice'
    if(action == 'order')
        url = '/goods/order/exprot/order'
    return request.get(url, {
        order_ids
    })
}

export function actionGoodsOrder({
    order_ids,
    status,
    shipping_sn,
    shipping_id,
    action,

    admin_status,
    admin_reason,
}) {
    if (action == 'recom')
        return request.post('/goods/goods/recomment', {
            order_ids: order_ids
        })
    else
        return request.post('/goods/order/update', {
            order_ids,
            shipping_sn,
            shipping_id,
            action,
            adminStatus:admin_status,
            adminReason:admin_reason,
        })
}
///

export function getMallGoods({
    goods_id,
    brand_id,
    category_id,
    keyword,
    page,
    pageSize,
    status,
    sort
}) {
    return request.get(`/goods/goods`, {
        goods_id,
        brand_id,
        category_id,
        keyword,
        page,
        pageSize,
        status,
        sort
    })
}

export function setGoodsTime({
    goods_ids,
    delivery_time
}) {
    return request.post('/goods/goods/deliverytime', {
        goods_ids,
        delivery_time
    })
}

export function actionMallGoods({
    goods_ids,
    status,
    action
}) {
    if (action == 'recom')
        return request.post('/goods/goods/recomment', {
            goods_id: goods_ids
        })
    else if(action == 'timeLimit')
        return request.post('/goods/goods/timelimit', {
            goods_id: goods_ids
        }) 
    else
        return request.post('/goods/goods/bulk', {
            goods_ids,
            status,
            action
        })
}

export function publishGoodsAttr({
    goods_id,
    attr_id,
    value
}) {
    return request.post('/goods/attribute/add', {
        goods_id,
        attr_id,
        value
    })
}


export function publishMallGoods({
    goods_id,
    category_id,
    ccategory_id,
    brand_id,
    good_name,
    summary,
    begin_time,
    end_time,
    goods_sn,
    goods_img,
    goods_intro,
    goods_amount,
    market_amount,
    goods_weight,
    goods_limit,
    goods_integral,
    sale_num,
    is_free,
    cost,
    status,
    stock,
    activity_id,
    ulevel,
    tlevel,
    delivery,
    gtype,
    can_share,
    kate_sn
}) {
    return request.post('/goods/goods/publish', {
        goods_id,
        category_id,
        ccategory_id,
        brand_id,
        good_name,
        summary,
        begin_time,
        end_time,
        goods_sn,
        goods_img,
        goods_intro,
        goods_amount,
        market_amount,
        goods_weight,
        goods_limit,
        goods_integral,
        sale_num,
        is_free,
        cost,
        status,
        stock,
        activity_id,
        ulevel,
        tlevel,
        delivery,
        gtype,
        can_share,
        kate_sn
    })
}

/////
export function getGoodsTypeRull({
    attr_id,
    type_id,
    page,
    pageSize,
}) {
    let typeId = type_id
    return request.get(`/goods/attribute`, {
        attr_id,
        typeId,
        page,
        pageSize,
    })
}

export function actionGoodsTypeRull({
    attr_id,
    action
}) {
    let url = action == 'delete' ? '/goods/attribute/delete' : '/goods/attribute/delete'
    return request.post(url, {
        attr_id,
    })
}
export function publishGoodsTypeRull({
    attr_id,
    type_id,
    name,
    atype,
    itype,
    values,
}) {
    return request.post('/goods/attribute/publish', {
        attr_id,
        type_id,
        name,
        atype,
        itype,
        values,
    })
}

/////

export function getGoodsType({ type_id }) {
    return request.get(`/goods/type`, {
        type_id
    })
}

export function actionGoodsType({
    type_id,
    action
}) {
    return request.post('/goods/type/update', {
        type_id,
        action
    })
}
export function publishGoodsType({
    type_id,
    type_name
}) {
    return request.post('/goods/type/publish', {
        type_id,
        type_name
    })
}

export function getGoodsBrand({ brand_id, keyword, page, pageSize }) {
    return request.get(`/goods/brand`, {
        brand_id, keyword, page, pageSize
    })
}

export function actionGoodsBrand({
    brand_id,
    action
}) {
    return request.post('/goods/brand/update', {
        brand_id,
        action
    })
}
export function publishGoodsBrand({
    brand_id,
    brand_name,
    brand_img,
    brand_intro,
    link,
    status,
    sort_order
}) {
    return request.post('/goods/brand/publish', {
        brand_id,
        brand_name,
        brand_img,
        brand_intro,
        link,
        status,
        sort_order
    })
}


export function getGoodsCate({ category_id, keyword, page, pageSize, parent_id, ctype }) {
    ctype = 7
    return request.get(`/goods/category`, {
        category_id, keyword, page, pageSize, parent_id, ctype
    })
}
export function getGoodsCates({ category_id, keyword, page, pageSize, parent_id, ctype }) {
    ctype = 7
    return request.get(`/goods/category`, {
        category_id, keyword, page, pageSize, parent_id, ctype
    })
}

export function actionGoodsCate({
    category_id,
    action
}) {
    return request.post('/goods/category/update', {
        category_id,
        action
    })
}
export function publishGoodsCate({
    category_id,
    parent_id,
    category_name,
    ctype,
    link,
    status,
    sort_order
}) {
    ctype = 7
    return request.post('/goods/category/publish', {
        category_id,
        parent_id,
        category_name,
        ctype,
        link,
        status,
        sort_order
    })
}
export function getGoodsprice({ goods_id }) {
    return request.post('/goods/amount', {
        goods_id
    })
}
export function getBackAddress({}) {
    return request.get('/goods/return/address', {
    })
}
export function postBackAddress({address,phone,name}) {
    return request.post('/goods/return/address', {
        address,phone,name
    })
}
export function postMallAttr({attr_ids,goods_attr_ids,goods_id,stock}) {
    return request.post('/goods/attribute/stock/set', {
        attr_ids,goods_attr_ids,goods_id,stock
    })
}
export function getMallGoodss({
    goods_id,
}) {
    return request.get(`/goods/goods`, {
        goods_id,
    })
}
export function getAttrVal({attrValues,goods_id}) {
    return request.get('/goods/attribute/stock/attrIds', {
        attrValues,goods_id
    })
}
export function getAttrIds({attr_map_ids,goods_id}) {
    return request.get('/goods/attribute/stock/attrVals', {
        attr_map_ids,goods_id
    })
}
export function getCateIds({categoryId}) {
    return request.get('/comm/category/info', {
        categoryId
    })
}
export function getFapiaos({}) {
    return request.post('/goods/goods/kate', {
    })
}

