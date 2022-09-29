import {createAction} from 'redux-actions';
import * as coupon from '../service/coupon';

const {	
	GET_PK_LEVEL
} = require('../key').default;

export const getCouponStat = createAction('getCouponStat',coupon.getCouponStat, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionCoupon = createAction('actionCoupon',coupon.actionCoupon, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const setCoupon = createAction('setCoupon',coupon.setCoupon, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getCoupon = createAction('getCoupon',coupon.getCoupon, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
///
export const getCouponYC = createAction('getCouponYC',coupon.getCouponYC, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const importCouponYC = createAction('importCouponYC',coupon.importCouponYC, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const releaseCouponYC = createAction('releaseCouponYC',coupon.releaseCouponYC, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionCouponYC = createAction('actionCouponYC',coupon.actionCouponYC, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});