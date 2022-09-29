import {combineReducers } from 'redux';

import teacher from './teacher';
import system from './system';
import site from './site';
import user from './user';
import course from './course';
import ad from './ad';
import dashboard from './dashboard'
import news from './news'
import o2o from './o2o'
import about from './about'
import activity from './activity'
import ask from './ask'
import auth from './auth'
import mall from './mall'
import meet from './meet'



export default combineReducers({
    activity,
    ask,
    o2o,
    teacher,
    system,
    site,
    user,
    course,
    ad,
    dashboard,
    news,
    about,
    auth,
    mall,
    meet,
    
})