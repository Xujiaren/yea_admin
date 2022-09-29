import request from '../../util/net';

export function getCouponStat({
    keyword,
    page,
    pageSize,
}) {
	return request.get('/statistics/coupon', {
        keyword,
        page,
        pageSize,
	})
}
export function actionCoupon({
    coupon_ids,
    action
}) {
	return request.post(`/comm/coupon/update`, {
        coupon_ids,
        action
	})
}
export function setCoupon({
    amount,
    begin_time,
    end_time,
    content_id,
    coupon_id,
    coupon_img,
    coupon_name,
    ctype,
    flag,
    limit,
    require_amount,
    total,
    etype,
    integral,
    require_integral
}) {
	return request.post(`/comm/coupon/publish`, {
        etype,
        amount,
        begin_time,
        end_time,
        content_id,
        coupon_id,
        coupon_img,
        coupon_name,
        ctype,
        flag,
        limit,
        require_amount,
        total,
        integral,
        require_integral
	})
}
export function getCoupon({
    coupon_id,
    keyword,
    page,
    pageSize,
    type,
    ctype
}) {
	return request.get('/comm/coupon', {
        coupon_id,
        keyword,
        page,
        pageSize,
        type,
        ctype
	})
}

export function getCouponYC({
    keyword,
    page,
    pageSize,
}) {
	return request.get('/operate/yc_coupon', {
        keyword,
        page,
        pageSize,
	})
}
export function importCouponYC({
    file,
}) {
	return request.upload('/operate/yc_coupon', {
        file
	})
}

export function releaseCouponYC({
    code,
    user_id,
}) {
	return request.post(`/operate/yc_coupon/${code}/${user_id}`, {
        code,
        user_id,
	})
}
export function actionCouponYC({
    action,
    code,
    coupon_ids,
}) {
	return request.post(`/operate/yc_coupon/update`, {
        action,
        code,
        coupon_ids,
	})
}

