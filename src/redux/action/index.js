import * as teacher from './teacher';
import * as system from './system';
import * as site from './site';
import * as user from './user';
import * as course from './course';
import * as ad from './ad';
import * as dashboard from './dashboard';
import * as news from './news';
import * as o2o from './o2o';
import * as about from './about';
import * as activity from './activity';
import * as ask from './ask';
import * as auth from './auth'
import * as mall from './mall'
import * as meet from './meet'
import * as pk from './pk'
import * as coupon from './coupon'
import * as download from './download'

export default {
	...download,
	...coupon,
	...pk,
	...activity,
	...ask,
	...o2o,
	...teacher,
	...system,
	...site,
	...user,
	...course,
	...ad,
	...dashboard,
	...news,
	...about,
	...auth,
	... mall,
	...meet,
	
};