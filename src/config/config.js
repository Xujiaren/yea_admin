const debug = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
// 豪哥本地192.168.1.171:8088
// http://admin.whalew.com:8088/admin
// 陈 192.168.1.147:8088
// http://admin2.whalew.com:8088/admin

// const api = debug ? 'http://admin2.whalew.com:8088/admin' : 'http://perfect.whalew.com/admin';

// 测试服
// http://perfect.whalew.com/admin


const api = debug ? 'https://perfect.whalew.com/admin' : 'https://perfect.whalew.com/admin';
const chat_room = debug ? 'https://perfect.whalew.com' : 'https://perfect.whalew.com'
const wss = debug ? 'wss://perfect.whalew.com/chat/room/' : 'wss://perfect.whalew.com/chat/room/';

// 正式服

// const api = debug ? 'https://teach.perfect99.com/admin' : 'https://teach.perfect99.com/admin';
// const chat_room = debug ? 'https://teach.perfect99.com' : 'https://teach.perfect99.com'
// const wss = debug ? 'wss://teach.perfect99.com/chat/room/' : 'wss://teach.perfect99.com/chat/room/';

const host = 'https://teach.perfect99.com'
const admin_msg_ws = debug ? 'ws://perfect.whalew.com/admin' : 'wss://teach.perfect99.com/admin';
export default {
    api:api,
    host:host,
    chat_room:chat_room,
    wss:wss,
    admin_ws:admin_msg_ws,
}