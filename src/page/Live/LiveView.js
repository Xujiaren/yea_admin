import React, { PureComponent } from 'react';
import { Row, Col } from 'reactstrap';
import { Popover, Spin, Dropdown, Menu, Upload, Icon, Table, Divider, List, Avatar, PageHeader, Modal, Card, Input, Button, message, Checkbox, Empty } from 'antd';

import connectComponent from '../../util/connect';

import config from '../../config/config';
import Websocket from 'react-websocket';
import moment from 'moment'
import Clipboard from 'react-copy-to-clipboard'
import { reactLocalStorage } from 'reactjs-localstorage';
import { List as VList } from "react-virtualized";
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer'
import { CellMeasurerCache, CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer'
import emoji from '../../components/emoji'
import Timer from '../../components/timer'
import { orderSort } from '../../components/CommonFn'
import AntdOssUpload from '../../components/AntdOssUpload'

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const live_msg_icon = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/d2323f7a-b26b-4380-911c-97d712bd2e67.png'


class LiveView extends PureComponent {
    constructor(props) {
        super(props);
        this._onMessage = this._onMessage.bind(this)

        this.getKickUserList = this.getKickUserList.bind(this)
        this.getRoomUserList = this.getRoomUserList.bind(this)

        this._onScroll = this._onScroll.bind(this)
        this._onScroll_admin = this._onScroll_admin.bind(this)
        this.rowRenderer = this.rowRenderer.bind(this)
        this.rowRenderer_admin = this.rowRenderer_admin.bind(this)
        this.rowRenderer_user = this.rowRenderer_user.bind(this)
        this.rowRenderer_kuser = this.rowRenderer_kuser.bind(this)
    }
    measureCache = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 80
    })
    measureCache_admin = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 80
    })
    measureCache_user = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 50
    })
    measureCache_kuser = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 50
    })
    state = {
        new_msg_count: 0,
        new_msg_count_admin: 0,
        course_name: '',

        url: { rtmp: '', flv: '' },
        ws_url: '',
        msg: '',
        keyword: '',
        keyword_kick: '',

        sendImgList: [],
        send_img: '',
        push_url: '正在加载中。。',
        mtype: 0,

        sys_msg: '',
        user_list: [],
        k_user_list: [],
        msg_pool: [],
        msg_pool_admin: [],
        ws_msg: [],
        gift_list: [{ giftName: '' }],

        user_count: 0,
        input_txt: '',
        uid: '',
        beMute: false,
        room_status: '未开播',
        showGoodsPannel: false,
        audioChat:0,
        ctype:0,
        publishType:0
    }
    url = { rtmp: '', flv: '' }
    ckplayer = null
    player = {}

    gift_list = [
        ''
    ]
    goods_info = []
    live_goods = []
    ws_msg = []
    avatar = ''
    default_avatar = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1abe17a5-8f6e-48f8-b61d-fa8ac4eb2912.png'

    columnsGoods = [
        {
            title: '商品ID',
            dataIndex: 'goodsId',
            key: 'goodsId',
        },
        {
            title: '图片',
            dataIndex: 'goodsImg',
            key: 'goodsImg',
            render: (ele, record) => (
                <a>
                    <img onClick={() => { this._onPreviewImg(record.goodsImg) }} className="head-example-img" src={record.goodsImg} />
                </a>
            )
        },
        {
            title: '名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            ellipsis: true,
        },
        {
            title: '价格',
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
            render: (ele, record) => record.goodsPrice + '元'
        },
        {
            title: '添加时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render: (item, record) => moment.unix(record.pubTime).format('YYYY-MM-DD HH:mm')
        },

        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder'
        },
        {
            title: '启用状态',
            dataIndex: 'status',
            key: 'status',
            render: (item, record) => (record.status == 1 ? '已启用' : '未启用')
        },
        {
            title: '操作',
            key: 'action',
            render: (item, record) => record.status == 0 ? null : (
                <span>
                    <a onClick={() => {
                        this._onPushGoods(record)
                    }}>推送商品</a>
                </span>
            ),
        },
    ]
    componentWillMount() {
        const href = decodeURI(window.location.href)
        const params = new URLSearchParams(href.split('?')[1])
        const { actions } = this.props

        this.course_id = this.props.match.params.id
        this.admin = params.get('admin')
        this.avatar = params.get('avatar') || ''
        this.wsname = params.get('wsname')
        this.teacher_id = params.get('teacherid') || 0
        this.ctype = params.get('ctype') || 2
        this.setState({ course_name: params.get('coursename') || ''})
        actions.getCourseInfo(this.course_id)

        if (!this.admin) {
            this.admin = 1
        }

        if (this.teacher_id == 0) {
            if (this.avatar == '') {
                this.avatar = this.default_avatar
            } else {
                this.avatar = this.avatar.replace(/\_/g, '/')
            }
            let ws_url = encodeURI(config.wss + this.course_id + '?uid=' + this.teacher_id + '&admin=' + this.admin + '&name=' + (this.wsname || 'admin') + '&avatar=' + this.avatar)
            this.setState({ ws_url })
        } else {
            actions.getTeacherInfo(this.teacher_id)
        }

        this.banMsg = reactLocalStorage.get('banMsg', '', true)

        actions.getGift({
            gift_name: '',
            page: 0,
            pageSize: 1000,
            gtype: 1
        })
        actions.getLiveGoods({ course_id: this.course_id, keyword: '' })
        actions.getStreamUrl({
            course_id: this.course_id,
            action: 'push',
            resolved: (data) => {
                this.setState({ push_url: data.rtmp })
            }
        })

    }

    componentDidMount() {
        const that = this
        const { actions } = this.props

        actions.getStreamUrl({
            course_id: this.course_id,
            action: 'pull',
            resolved: (url) => {
                that.ckplayer = that.ckplayerInit(url.rtmp)
            },
            rejected: (data) => {

            }
        })
    }

    componentWillUnmount() {
        this.ckplayer = null
        clearInterval(this.ping)
    }

    componentWillReceiveProps(n_props) {
        if (n_props.teacher_info !== this.props.teacher_info) {
            this.teacher_info = n_props.teacher_info
            let avatar = ''

            if (this.avatar !== '') {
                avatar = this.avatar.replace(/\_/g, '/')
            } else {
                avatar = this.teacher_info.user ? this.teacher_info.user.avatar : this.default_avatar
            }
            this.setState({
                ws_url: encodeURI(config.wss + this.course_id + '?uid=' + this.teacher_info.teacherId + '&admin=' + this.admin + '&name=' + (this.wsname || 'admin') + '&avatar=' + avatar)
            })
        }
        if (n_props.gift_list !== this.props.gift_list) {
            let gift_list = []

            n_props.gift_list.data.map(ele => {
                gift_list[ele.giftId] = ele.giftImg
            })
            this.gift_list = gift_list
        }
        if (n_props.live_goods !== this.props.live_goods) {

            let goods_info = []
            this.live_goods = n_props.live_goods

            this.live_goods.map(ele => {
                goods_info[ele.goodsId] = ele.goodsName + `  价格：` + ele.goodsPrice
            })
            this.goods_info = goods_info
        }
        if (n_props.course_info !== this.props.course_info){
            this.setState({
                audioChat:n_props.course_info.audioChat,
                ctype:n_props.course_info.ctype,
                publishType:n_props.course_info.publishType
            })
        }
    }
    _onPreviewImg(previewImg) {
        let showImgPannel = true
        this.setState({ previewImg, showImgPannel })
    }
    _onPushGoods(item) {
        let msg = {
            mtype: 'goods',
            msg: item.goodsId + ''
        }
        this.props.actions.postLiveOut({
            type: 2,
            content_id: parseInt(this.course_id),
            userId: item.uid,
        })
        this.websocket.sendMessage(JSON.stringify(msg))
        this.setState({ showGoodsPannel: false }, () => {
            message.success('推送成功')
        })
    }
    //初始化ckplayer
    ckplayerInit = (url) => {
        let videoObject = {
            container: '#ckplayer',
            variable: 'player',
            loop: false,
            autoplay: true,
            video: url
        }
        this.player = new window.ckplayer(videoObject)
        return this.player
    }


    //撤销消息
    _onCancel(mid, type, index) {
        const { msg_pool, msg_pool_admin } = this.state
        const { actions } = this.props
        let course_id = this.course_id
        actions.cancelUser({
            course_id: course_id, id: mid,
            resolved: () => {
                //修改消息池里消息的状态
                if (type !== 'admin') {
                    msg_pool[index].cancel = 1
                    this.setState({ msg_pool: [...msg_pool] })
                } else {
                    msg_pool_admin[index].cancel = 1
                    this.setState({ msg_pool_admin: [...msg_pool_admin] })
                }
            }
        })
    }

    _onMessage(data) {
        data = JSON.parse(data)
        const { user_count, current_top, current_top_admin } = this.state
        const { liveStatus, roomStatus, userCount } = data
        const the_type = data.type

        let { uid, name, avatar, status, id, admin } = data.user
        let { msg } = data.msg
        let mid = data.id
        let msg_item = {}

        if (the_type == 'event-system' || the_type == 'event-live') {
            if (data.timestamp + 3 >= Math.round(new Date().getTime() / 1000))
                this.setLiveStatus(liveStatus, roomStatus)
        }
        if (the_type === 'event-system' && userCount !== user_count) {
            this.setState({ user_count: userCount })
        }
        if (the_type == 'event-keyword' && this.teacher_id == id && Math.round(new Date().getTime() / 1000) - 2 <= data.timestamp) {
            message.info('您的发言中包含敏感词')
        }

        switch (the_type) {
            // 用户发言
            case 'event-msg':
                //若禁言状态，不显示消息
                if (status == 0) msg = ''
                console.log(the_type)
                msg_item.cancel = 0

                if (this.banMsg.indexOf(mid) > -1) {
                    msg_item.cancel = 1
                }
                break;

            // event-system 系统信息推送 如房间人数
            case 'event-system':
                msg = ''
                break;
            // event-join 用户加入
            case 'event-join':
                avatar = live_msg_icon
                msg = name + ' ' + msg
                name = '直播间消息'
                break;
            // event-mute 用户被禁言
            case 'event-mute':
                if (this.teacher_id == id) {
                    this.setState({ beMute: true })
                }
                avatar = live_msg_icon
                msg = name + ' ' + msg
                name = '直播间消息'
                break;
            // event-restore 用户恢复发言
            case 'event-restore':
                if (this.teacher_id == id) {
                    this.setState({ beMute: false })
                }
                avatar = live_msg_icon
                msg = name + ' ' + msg
                name = '直播间消息'
                break;
            // event-leave 用户离开
            case 'event-leave':
                avatar = live_msg_icon
                msg = name + ' ' + msg
                name = '直播间消息'
                break;
            // event-cancel 撤回消息
            case 'event-cancel':
                let banMsg = reactLocalStorage.get('banMsg', '', true)
                if (banMsg.indexOf(msg) == -1) {
                    if (banMsg == '')
                        banMsg = msg
                    else
                        banMsg += '_' + msg

                    reactLocalStorage.remove('banMsg')
                    reactLocalStorage.set('banMsg', banMsg)
                }

                msg = ''

                break;
            // event-kick 用户被踢出房间
            case 'event-kick':
                avatar = live_msg_icon
                msg = name + ' ' + msg
                name = '直播间消息'

                if (this.teacher_id == id) {
                    let time_offset = parseInt(data.timestamp) + 60
                    let current_time = Math.round(new Date().getTime() / 1000)

                    if (time_offset >= current_time) {
                        this.websocket.componentWillUnmount()
                        message.info({
                            content: '您已被踢出房间，请60秒后再重新进入',
                            onClose: () => {
                                this.props.history.push("/login");
                            }
                        })
                    }
                }
                break;
        }

        //消息池不显示禁言用户以及空消息
        if (name == '直播间消息' && data.timestamp < Math.round(new Date().getTime() / 1000)) {
            msg = ''
        }
        if (msg && msg !== '')
            this.setState((preState) => {
                const { msg_pool, msg_pool_admin } = preState

                let parseMsg = emoji.textToEmoji(msg)

                msg_item.msg = parseMsg
                msg_item.id = id
                msg_item.mid = data.id
                msg_item.uid = uid
                msg_item.name = name
                msg_item.avatar = avatar
                msg_item.time_string = moment.unix(data.timestamp).format('MM-DD HH:mm')

                msg_item.timestamp = data.timestamp
                msg_item.payload = data
                msg_item.status = status


                if (admin == 1 && data.type == 'event-msg') {
                    //主讲区消息滚动
                    if (current_top_admin === undefined && data.timestamp + 1 >= Math.round(new Date().getTime() / 1000))
                        this.setState((pre) => {
                            return { new_msg_count_admin: pre.new_msg_count_admin + 1 }
                        })

                    return { msg_pool_admin: [...msg_pool_admin, msg_item] }
                }
                else {
                    //互动区消息滚动
                    if (current_top === undefined && data.timestamp + 1 >= Math.round(new Date().getTime() / 1000))
                        this.setState((pre) => {
                            return { new_msg_count: pre.new_msg_count + 1 }
                        })

                    return { msg_pool: [...msg_pool, msg_item] }
                }
            })

    }
    _onOpen = () => {
        let that = this
        this.ping = setInterval(() => {
            let msg = {
                mtype: 'ping',
                msg: ''
            }
            if (that.websocket !== null)
                that.websocket.sendMessage(JSON.stringify(msg))
        }, 10000)
        console.log('Websocket_onOpen')
    }
    _onClose = () => {
        console.log('Websocket_onClose')
    }
    _onImg = () => {
        const { beMute } = this.state
        let send_img = ''
        if (this.img) {
            send_img = this.img.getValue()
        }
        if (send_img == '') { message.info('请上传图片'); return; }
        if (beMute) {
            message.info('您已经被禁言')
            return;
        }

        send_img.split(',').map(ele => {
            this.websocket.sendMessage(JSON.stringify({
                mtype: 'img',
                msg: ele
            }))
        })
        this.setState({ showImgUpPannel: false })
    }
    _onSend = () => {
        const { input_txt, beMute } = this.state

        if (input_txt == '') {
            message.info('请输入消息再发送')
            return;
        }
        if (beMute) {
            message.info('您已经被禁言')
            return;
        }
        let msg = {
            mtype: 'text',
            msg: input_txt
        }
        this.websocket.sendMessage(JSON.stringify(msg))
        this.setState({ input_txt: '' })
    }
    setLiveStatus(liveStatus, roomStatus) {
        let room_status = '未开播'
        let that = this
        const { actions } = this.props

        if (liveStatus == 0) {
            if (roomStatus == 0)
                room_status = '未开播'
            if (roomStatus == 2)
                room_status = '已开播'
        } else if (liveStatus == 1) {
            room_status = '正在开播'

            if (this.state.room_status !== '正在开播')
                setTimeout(() => {
                    actions.getStreamUrl({
                        course_id: this.course_id,
                        action: 'pull',
                        resolved: (url) => {
                            that.ckplayer = that.ckplayerInit(url.rtmp)
                        },
                        rejected: (data) => {

                        }
                    })
                }, 1000)
        } else {
            if (roomStatus == 1)
                room_status = '暂停'
            else if (roomStatus == 3)
                room_status = '结束'
            else if (roomStatus == 4)
                room_status = '回放'
        }
        this.setState({ room_status })
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            showImgPannel: true,
        });
    }
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        return isJpgOrPng;
    }
    onSendImgChange = ({ file, fileList }) => {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            message.info('只能上传 JPG/PNG/GIF 文件!');
            return
        }

        let send_img = ''
        let sendImgList = fileList

        if (file.status == 'done' && file.response.errorCode !== '1') {
            send_img = file.response.resultBody
        }

        this.setState({
            sendImgList,
            send_img
        })
    };
    showUserPannel = (type) => {
        const { actions } = this.props

        this.setState({ user_list: [], user_list_type: type, showUserPannel: true, keyword: '' }, () => {
            actions.getRoomUserList({
                course_id: this.course_id,
                resolved: (data) => {
                    if (data == null)
                        data = []

                    if (type == 'band') {
                        data = data.filter(ele => {
                            return ele.status == 0
                        })
                    }
                    data = orderSort({ arr: data, flag: 'id' })
                    this.setState({ user_list: data })
                },
                rejected: () => {
                    message.error('获取在线用户失败')
                }
            })
        })

    }
    getKickUserList() {
        const { actions } = this.props
        actions.getKickUserList({
            course_id: this.course_id,
            resolved: (data) => {
                if (data == null)
                    data = []

                data = orderSort({ arr: data, flag: 'id' })
                this.setState({ k_user_list: data })
            },
            rejected: () => {
                message.error('获取被踢用户失败')
            }
        })
    }
    onZero = () => {
        this.getRoomUserList()
    }
    getRoomUserList() {
        const { actions } = this.props
        const { user_list_type, keyword } = this.state

        actions.getRoomUserList({
            course_id: this.course_id,
            resolved: (data) => {
                if (data == null)
                    data = []

                if (user_list_type == 'band') {
                    data = data.filter(ele => {
                        if (keyword !== '')
                            return ele.status == 0 && ele.name.indexOf(keyword) > -1
                        else
                            return ele.status == 0
                    })
                }
                data = orderSort({ arr: data, flag: 'id' })
                this.setState({ user_list: data })
            },
            rejected: (data) => {
                message.error('获取在线用户失败')
            }
        })
    }
    //踢人
    _onKick(uid) {
        const that = this
        const { actions } = this.props
        const { keyword, user_list_type } = this.state
        let course_id = this.course_id
        actions.kickUser({
            course_id, uid,
            resolved: () => {
                //踢人后，获取用户列表
                actions.postLiveOut({
                    type: 1,
                    content_id: parseInt(this.course_id),
                    userId: uid,
                    resolved: (res) => {

                    },
                    rejected: (err) => {

                    }
                })
                actions.getRoomUserList({
                    course_id: this.course_id,
                    resolved: (data) => {
                        if (data == null)
                            data = []

                        if (user_list_type == 'band') {
                            data = data.filter(ele => {
                                if (keyword !== '')
                                    return ele.status == 0 && ele.name.indexOf(keyword) > -1
                                else
                                    return ele.status == 0
                            })
                        } else {
                            data = data.filter(ele => {
                                if (keyword !== '')
                                    return ele.name.indexOf(keyword) > -1
                                else
                                    return true
                            })
                        }

                        data = orderSort({ arr: data, flag: 'id' })
                        that.setState({ user_list: data })
                        message.success('操作成功')
                    },
                    rejected: (data) => {
                        message.error('获取在线用户失败')

                    }
                })
            }
        })
    }
    //禁言
    _onMute(uid, this_user_status, this_user_id, mtype, index, otype) {
        const that = this
        const { actions } = this.props
        const { user_list_type, keyword } = this.state
        let { msg_pool } = this.state
        let course_id = this.course_id

        // console.log(uid)
        actions.muteUser({
            course_id, uid, mtype,
            resolved: () => {
                actions.postLiveOut({
                    type: 0,
                    content_id: parseInt(this.course_id),
                    userId: uid,
                    resolved: (res) => {

                    },
                    rejected: (err) => {

                    }
                })
                message.success('操作成功')

                if (otype !== 'msg')
                    actions.getRoomUserList({
                        course_id: this.course_id,
                        resolved: (data) => {
                            if (data == null)
                                data = []
                            if (user_list_type == 'band' && mtype === '') {
                                data = data.filter(ele => {
                                    if (keyword !== '')
                                        return ele.status == 0 && ele.name.indexOf(keyword) > -1
                                    else
                                        return ele.status == 0
                                })
                            }

                            data = orderSort({ arr: data, flag: 'id' })
                            that.setState({ user_list: data })
                        },
                        rejected: () => {
                            message.error('获取在线用户失败')
                        }
                    })

                let _msg_pool = []
                _msg_pool = msg_pool.map(ele => {
                    if (ele.id == this_user_id)
                        ele.status = this_user_status == 1 ? 0 : 1
                    return ele
                })
                that.setState({ msg_pool: _msg_pool })
            },
            rejected: () => {
                message.error('操作失败')
            }
        })


    }
    _onRevert(uid) {
        const { actions } = this.props
        const course_id = this.course_id

        actions.revertUser({
            course_id, uid,
            resolved: () => {
                //踢人后，获取用户列表
                actions.getKickUserList({
                    course_id,
                    resolved: (data) => {
                        message.success('操作成功')
                        if (data == null)
                            data = []

                        data = orderSort({ arr: data, flag: 'id' })
                        this.setState({ k_user_list: data })
                    },
                    rejected: () => {
                        message.error('获取被踢用户失败')
                    }
                })
            }
        })
    }
    showKickPannel = () => {
        this.setState({ showKickPannel: true, keyword_kick: '' })
        this.getKickUserList()
    }
    showGoodsPannel = () => {
        const { actions } = this.props
        this.setState({ showGoodsPannel: true })

        actions.getLiveGoods({ course_id: this.course_id, keyword: '' })
    }
    _onSearchChange = (e) => {
        this.setState({ keyword: e.target.value })
    }
    _onSearchChangeKick = (e) => {
        this.setState({ keyword_kick: e.target.value })
    }
    _onSearch = (val) => {
        const { actions } = this.props
        const { user_list_type } = this.state

        actions.getRoomUserList({
            course_id: this.course_id,
            resolved: (data) => {
                if (data == null)
                    data = []
                if (user_list_type == 'band')
                    data = data.filter(ele => {
                        if (val) {
                            return ele.status == 0 && ele.name.indexOf(val) > -1
                        } else {
                            return ele.status == 0
                        }
                    })
                else
                    data = data.filter(ele => ele.name.indexOf(val) > -1)

                data = orderSort({ arr: data, flag: 'id' })
                this.setState({ user_list: data })
            },
            rejected: () => {
                message.error('获取在线用户失败')
            }
        })

    }
    _onSearchKick = (val) => {
        const { actions } = this.props

        actions.getKickUserList({
            course_id: this.course_id,
            resolved: (data) => {
                if (data == null)
                    data = []
                if (val)
                    data = data.filter(ele => {
                        if (ele.name.indexOf(val) > -1) {
                            return true
                        } else {
                            return false
                        }
                    })

                data = orderSort({ arr: data, flag: 'id' })
                this.setState({ k_user_list: data })
            },
            rejected: () => {
                message.error('获取在线用户失败')
            }
        })

    }
    _noRowsRenderer() {
        return <Empty className='mt_20'></Empty>;
    }
    rowRenderer_kuser({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
        parent,
    }) {
        const { k_user_list } = this.state
        const ele = k_user_list[index]

        return (
            <CellMeasurer cache={this.measureCache_kuser} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                <div key={key} style={style}>
                    <List.Item
                        key={index + '_user_kick_list'}
                        actions={this.teacher_id == ele.id || ele.admin == 1 ? null : [
                            <span className='action'>
                                <a onClick={() => {
                                    this._onRevert(ele.uid)
                                }}>取消踢人操作</a>
                            </span>
                        ]}
                    >

                        <List.Item.Meta
                            avatar={
                                <Avatar size="small" src={ele.avatar}></Avatar>
                            }
                            title={
                                <div>
                                    {ele.name}
                                    <span style={{ color: '#bebebe', paddingLeft: '5px' }}>{ele.admin == 1 ? '房管' : ''}</span>
                                    <span style={{ color: '#bebebe', paddingLeft: '5px' }}>{ele.status == 0 ? '(已被禁言)' : ''}</span>
                                </div>
                            }
                        />

                    </List.Item>
                </div>
            </CellMeasurer>
        )
    }
    rowRenderer_user({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
        parent,
    }) {
        const { user_list } = this.state
        const ele = user_list[index]

        return (
            <CellMeasurer cache={this.measureCache_user} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                <div key={key} style={style}>
                    <List.Item
                        key={index + '_user_list'}
                        actions={this.teacher_id == ele.id || ele.admin == 1 ? null : [
                            <span className='action'>
                                {ele.status == 1 ?
                                    <Dropdown placement="bottomCenter" trigger={['click']} overlay={
                                        <Menu>
                                            <Menu.Item key={'item1'}><a onClick={this._onMute.bind(this, ele.uid, ele.status, ele.id, 0, index)}>15分钟</a></Menu.Item>
                                            <Menu.Item key={'item2'}><a onClick={this._onMute.bind(this, ele.uid, ele.status, ele.id, 1, index)}>30分钟</a></Menu.Item>
                                            <Menu.Item key={'item3'}><a onClick={this._onMute.bind(this, ele.uid, ele.status, ele.id, 2, index)}>1小时</a></Menu.Item>
                                        </Menu>
                                    }>
                                        <a key="list-loadmore-edit">禁言</a>
                                    </Dropdown>
                                    :
                                    <a key="list-loadmore-edit" onClick={this._onMute.bind(this, ele.uid, ele.status, ele.id, '', index)}>解禁</a>
                                }
                                <Divider type="vertical" />
                                <a onClick={() => {
                                    this._onKick(ele.uid)
                                }}>踢人</a>
                            </span>
                        ]}
                    >

                        <List.Item.Meta
                            avatar={
                                <Avatar size="small" src={ele.avatar}></Avatar>
                            }
                            title={
                                <div>
                                    {ele.name}
                                    <span style={{ color: '#bebebe', paddingLeft: '5px' }}>{ele.admin == 1 ? '房管' : ''}</span>
                                    <span style={{ color: '#bebebe', paddingLeft: '5px', paddingRight: '8px' }}>{ele.status == 0 && ele.mute_num !== 0 && ele.duration !== 0 ? '禁言次数 ' + ele.mute_num : ''}</span>
                                    <span style={{ color: '#bebebe' }}>{ele.status == 0 && ele.duration !== 0 && this.state.showUserPannel ? <Timer onZero={this.onZero} duration={ele.duration} key={ele.uid} /> : null}</span>
                                </div>
                            }
                        />

                    </List.Item>
                </div>
            </CellMeasurer>
        )
    }

    rowRenderer_admin({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
        parent,
    }) {
        const { msg_pool_admin } = this.state
        let action_list = [
            <a onClick={
                this._onCancel.bind(this, msg_pool_admin[index].mid, 'admin', index)
            }>撤回</a>
        ]
        //撤回
        return (
            <CellMeasurer cache={this.measureCache_admin} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                <div key={key} style={style}>
                    <List.Item
                        actions={msg_pool_admin[index].payload.msg.mtype == 'goods' || msg_pool_admin[index].cancel == 1 ? null : action_list}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar size="small" src={msg_pool_admin[index].avatar}></Avatar>
                            }
                            title={
                                <span>
                                    <span href="#" style={{ marginRight: '10px' }}>{msg_pool_admin[index].name}</span>
                                    <span style={{ color: '#bcbcbc' }}>{msg_pool_admin[index].time_string}</span>
                                </span>
                            }
                            description={
                                msg_pool_admin[index].cancel == 1 ? '消息已被您撤回' : msg_pool_admin[index].payload.msg.mtype == 'img' ? <div className='ws_msg_wrap'><img src={msg_pool_admin[index].msg[0].msgCont} onClick={this._onPreviewImg.bind(this, msg_pool_admin[index].msg[0].msgCont)} className='msg_img' /></div> :
                                    msg_pool_admin[index].payload.msg.mtype == 'goods' ? '推送商品 ' + this.goods_info[msg_pool_admin[index].msg[0].msgCont] :
                                        msg_pool_admin[index].msg.map(_ele => {
                                            if (_ele.msgType == 'emoji')
                                                return (<img src={_ele.msgImage} key={'emoji' + Math.random() * 100} style={{ width: '20px', height: '20px' }}></img>)
                                            else
                                                return _ele.msgCont
                                        })
                            }
                        />

                    </List.Item>
                </div>
            </CellMeasurer>
        )
    }
    rowRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
        parent,
    }) {

        const { msg_pool } = this.state
        const { msgCont } = msg_pool[index].msg[0]
        const giftIndex = msgCont.split('&')[1] || 0

        let action_list = [
            <a onClick={
                this._onCancel.bind(this, msg_pool[index].mid, 'user', index)
            }>撤回</a>
        ]
        //如果是小助手，不显示禁言按钮
        if (msg_pool[index].id !== 0) {
            action_list = [
                <a>
                    {msg_pool[index].status == 1 ?
                        <Dropdown placement="bottomCenter" trigger={['click']} overlay={
                            <Menu>
                                <Menu.Item key={'item1'}><a onClick={this._onMute.bind(this, msg_pool[index].uid, msg_pool[index].status, msg_pool[index].id, 0, index, 'msg')}>15分钟</a></Menu.Item>
                                <Menu.Item key={'item2'}><a onClick={this._onMute.bind(this, msg_pool[index].uid, msg_pool[index].status, msg_pool[index].id, 1, index, 'msg')}>30分钟</a></Menu.Item>
                                <Menu.Item key={'item3'}><a onClick={this._onMute.bind(this, msg_pool[index].uid, msg_pool[index].status, msg_pool[index].id, 2, index, 'msg')}>1小时</a></Menu.Item>
                            </Menu>
                        }>
                            <span key="list-loadmore-edit">禁言</span>
                        </Dropdown>
                        :
                        <span key="list-loadmore-edit" onClick={this._onMute.bind(this, msg_pool[index].uid, msg_pool[index].status, msg_pool[index].id, '', index, 'msg')}>解禁</span>
                    }
                </a>,
                // <a onClick={()=>{
                //     this._onKick(msg_pool[index].uid)
                // }}>踢人</a>,
                ...action_list
            ]
        }

        //撤回
        return (
            <CellMeasurer cache={this.measureCache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                <div key={key} style={style}>
                    <List.Item
                        actions={msg_pool[index].payload.msg.mtype == 'goods' || msg_pool[index].payload.msg.mtype == 'gift' || msg_pool[index].cancel == 1 || msg_pool[index].payload.type !== 'event-msg' || msg_pool[index].payload.user.admin == 1 ? null : action_list}
                    >

                        <List.Item.Meta
                            avatar={
                                <Avatar size="small" src={msg_pool[index].avatar}></Avatar>
                            }
                            title={
                                <span>
                                    <span href="#" style={{ marginRight: '10px' }}>{msg_pool[index].name}</span>
                                    <span style={{ color: '#bcbcbc' }}>{msg_pool[index].time_string}</span>
                                </span>
                            }
                            description={
                                msg_pool[index].cancel == 1 ? '消息已被您撤回' : msg_pool[index].payload.msg.mtype == 'img' ? <div className='ws_msg_wrap'><img src={msg_pool[index].msg[0].msgCont} onClick={this._onPreviewImg.bind(this, msgCont)} className='msg_img' /></div> :
                                    msg_pool[index].payload.msg.mtype == 'goods' ? '推送商品 ' + this.goods_info[msgCont] :
                                        msg_pool[index].payload.msg.mtype == 'gift' ?
                                            <span>打赏了 <img src={this.gift_list[giftIndex]} style={{ width: '20px', height: '20px' }}></img></span>
                                            :
                                            msg_pool[index].msg.map(_ele => {
                                                if (_ele.msgType == 'emoji') {
                                                    return (<img src={_ele.msgImage} key={'emoji' + Math.random() * 100} style={{ width: '20px', height: '20px' }}></img>)
                                                }
                                                else {
                                                    return _ele.msgCont
                                                }
                                            })
                            }
                        />

                    </List.Item>
                </div>
            </CellMeasurer>
        )
    }

    _onScroll_admin({ scrollTop, clientHeight, scrollHeight }) {
        if (scrollTop === scrollHeight - clientHeight) {
            this.setState({ new_msg_count_admin: 0, current_top_admin: scrollHeight - clientHeight })
        } else {
            this.setState({ current_top_admin: undefined })
        }
    }
    _onScroll({ scrollTop, clientHeight, scrollHeight }) {
        if (scrollTop === scrollHeight - clientHeight) {
            this.setState({ new_msg_count: 0, current_top: scrollHeight - clientHeight })
        } else {
            this.setState({ current_top: undefined })
        }
    }
    contentEmoji = () => {
        const { input_txt } = this.state

        return (
            <div className='bf_emojis_wrap'>
                <ul className='bf_emojis'>
                    {Object.keys(emoji.emojis).map((item, index) => {
                        return (
                            <li
                                key={index}
                                onClick={() => {
                                    this.setState({ input_txt: input_txt + item })
                                }}
                            ><img style={{ width: '30px', height: '30px' }} src={emoji.emojiToPath(item)}></img></li>
                        )
                    })}
                </ul>
            </div>
        )
    }
    onClose = () => {
        const { actions } = this.props
        let timestamp = new Date().getTime()
        actions.startEnd({
            course_id: this.course_id,
            time: parseInt(timestamp / 1000),
            type: 0,
            resolved: (res) => {
                message.success({ content: '结束直播' })
                setTimeout(() => {
                    window.close()
                }, 1000);
            },
            rejected: (err) => {

            }
        })
    }
    onOuts=()=>{
        const{actions}=this.props
        actions.startChat({
            course_id:this.course_id,
            status:0,
            resolved:(res)=>{
                actions.getCourseInfo(this.course_id)
            }
        })
    }
    onOpen=()=>{
        const{actions}=this.props
        actions.startChat({
            course_id:this.course_id,
            status:1,
            resolved:(res)=>{
                actions.getCourseInfo(this.course_id)
            }
        })
    }
    render() {
        const { course_name, room_status, keyword, msg_pool_admin, msg_pool, push_url, ws_url, user_count, input_txt, user_list, user_list_type, k_user_list } = this.state
        const uploadButtonImg = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">选择图片</div>
            </div>
        );
        return (
            <div className="animated fadeIn" style={{ minWidth: '836px' }}>
                {ws_url == '' ? null :
                    <Websocket
                        ref={(ref) => { this.websocket = ref }}
                        url={ws_url}
                        onMessage={this._onMessage}
                        onOpen={this._onOpen.bind(this)}
                        onClose={this._onClose.bind(this)}
                    />}
                <Card className='con' bodyStyle={{ padding: '10px 25px 0 25px' }}>
                    {this.props.match.path == '/room/:id' ?
                        <div className='d_flex ai_ct jc_sb m_10'>
                            <div className='d_flex ai_ct'>
                                <Popover placement="bottom" content={course_name} trigger="hover">
                                    <div className='mr_20' style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course_name}</div>
                                </Popover>
                                <div>直播状态: <strong>{room_status}</strong></div>
                                <div className='ml_20'>主播昵称: <strong>{this.wsname}</strong></div>
                            </div>
                            <div>
                                <Button onClick={this.onClose}>结束直播</Button>
                                <Button onClick={() => this.props.history.push('/login')}>退出房间</Button>
                            </div>
                        </div> : null}
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={this.props.match.path == '/room/:id' ? false : () => window.history.back()}
                        title=""
                        subTitle={this.props.match.path == '/room/:id' ? false :
                            <div className='d_flex ai_ct'>
                                <Popover placement="bottom" content={course_name} trigger="hover">
                                    <div className='mr_20' style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course_name}</div>
                                </Popover>
                                <div>直播状态: <strong>{room_status}</strong></div>
                                <div className='ml_20'>主播昵称: <strong>{this.wsname}</strong></div>
                            </div>
                        }
                    >
                        <Row>
                            <Col xs="8">

                                <Card className='player' bodyStyle={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {/* <DPlayer
                                        options={this.state.d_player_option}
                                        ref='d_player'
                                        style={{width:"100%",height:'100%',minHeight:'600px'}}
                                    /> */}
                                    <div style={{ minHeight: '600px', minWidth: '100%' }}>
                                        <div style={{ width: "100%", height: '100%', minHeight: '600px' }} id="ckplayer" className="video-js vjs-default-skin"></div>
                                    </div>
                                </Card>
                                {this.props.match.path == '/room/:id' ? null :
                                    <div className='mt_10'>
                                        {/*
                                    <Button className='m_2' onClick={this._onAdPush}>推送广告</Button>
                                    */}
                                        <Button className='m_2' onClick={this.showGoodsPannel}>推送商品</Button>

                                        <Button disabled className='m_2' >推送试题</Button>
                                        {
                                            (this.state.ctype==52||this.state.ctype==53)&&this.state.publishType==1?
                                            <Button className='m_2' type={this.state.audioChat?'':"primary"} onClick={this.state.audioChat?this.onOuts:this.onOpen}>{this.state.audioChat?'关闭连麦':'开启连麦'}</Button>
                                            :
                                            null
                                        }
                                    </div>
                                }
                                <p style={{ color: "#6f6f6f", fontSize: '12px', lineHeight: '2' }}>
                                    <Clipboard
                                        text={push_url !== '正在加载中。。' && push_url !== '' ? push_url : ''}
                                        onCopy={push_url == '正在加载中。。' || push_url == '' ? null : () => { message.success('复制成功') }}
                                    >
                                        <span>* 推流地址：{push_url}</span>
                                    </Clipboard><br />
                                    * 直播帮助：<a href='https://help.aliyun.com/document_detail/45212.html?spm=a2c4g.11186623.6.857.4c454cceZ6ER74' target='_black'>https://help.aliyun.com/document_detail/45212.html?spm=a2c4g.11186623.6.857.4c454cceZ6ER74</a><br />
                                </p>
                            </Col>
                            <Col xs="4">
                                <Card title="" bodyStyle={{ height: '400px', padding: 0 }}>
                                    <div className='userCount d_flex jc_sb ai_ct' style={{ flexWrap: 'nowrap' }}>
                                        <span>在线人数：{user_count}</span>
                                        <div>
                                            <Button size={'small'} className='m_2' onClick={this.showKickPannel}>被踢用户</Button>
                                            <Button size={'small'} className='m_2' onClick={this.showUserPannel.bind(this, 'band')}>禁言用户</Button>
                                            <Button size={'small'} className='m_2' onClick={this.showUserPannel.bind(this, 'all')}>全部用户</Button>
                                        </div>

                                    </div>
                                    <div style={{ width: '100%', height: '362px', position: 'relative' }}>
                                        <AutoSizer>
                                            {({ width, height }) => (
                                                <VList
                                                    width={width}
                                                    height={height}

                                                    rowCount={msg_pool.length}
                                                    onScroll={this._onScroll}
                                                    scrollToIndex={this.state.current_top === undefined ? undefined : msg_pool.length - 1}
                                                    deferredMeasurementCache={this.measureCache}
                                                    rowHeight={this.measureCache.rowHeight}
                                                    scrollToAlignment='end'
                                                    rowRenderer={this.rowRenderer}
                                                    style={{
                                                        marginTop: '38px',
                                                        padding: '0 15px',
                                                        outlineStyle: 'none',
                                                    }}
                                                    noRowsRenderer={this._noRowsRenderer}
                                                >
                                                </VList>
                                            )}
                                        </AutoSizer>
                                        {this.state.new_msg_count == 0 ? null :
                                            <div onClick={() => { this.setState({ current_top: 0, new_msg_count: 0 }) }} className='msg_tips animated fadeIn fadeOut'>
                                                <Icon type="double-left" rotate={-90} style={{ marginRight: '5px', fontSize: '12px', color: '#83d3fd' }} />
                                                <span>{this.state.new_msg_count} 条新消息</span>
                                                <Divider type="vertical"></Divider>
                                                <Icon onClick={(e) => { e.stopPropagation(); this.setState({ new_msg_count: 0 }) }} type="close" style={{ fontSize: '10px', color: '#b7b7b7' }} />
                                            </div>
                                        }
                                    </div>
                                </Card>
                                <Card title="" className='mt_10 admin_pannel' bodyStyle={{ padding: 0, height: '190px' }}>
                                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                        <AutoSizer>
                                            {({ width, height }) => (
                                                <VList
                                                    width={width}
                                                    height={height}

                                                    rowCount={msg_pool_admin.length}
                                                    onScroll={this._onScroll_admin}
                                                    scrollToIndex={this.state.current_top_admin === undefined ? undefined : msg_pool_admin.length - 1}
                                                    deferredMeasurementCache={this.measureCache_admin}
                                                    rowHeight={this.measureCache_admin.rowHeight}
                                                    scrollToAlignment='end'
                                                    rowRenderer={this.rowRenderer_admin}
                                                    style={{
                                                        padding: '0 15px',
                                                        outlineStyle: 'none',
                                                    }}
                                                    noRowsRenderer={this._noRowsRenderer}
                                                >
                                                </VList>
                                            )}
                                        </AutoSizer>
                                        {this.state.new_msg_count_admin == 0 ? null :
                                            <div onClick={() => { this.setState({ current_top_admin: 0, new_msg_count_admin: 0 }) }} className='msg_tips animated fadeIn fadeOut'>
                                                <Icon type="double-left" rotate={-90} style={{ marginRight: '5px', fontSize: '12px', color: '#83d3fd' }} />
                                                <span>{this.state.new_msg_count_admin} 条新消息</span>
                                                <Divider type="vertical"></Divider>
                                                <Icon onClick={(e) => { e.stopPropagation(); this.setState({ new_msg_count_admin: 0 }) }} type="close" style={{ fontSize: '10px', color: '#b7b7b7' }} />
                                            </div>
                                        }
                                    </div>
                                </Card>
                                <div className='mt_10 flex align_items msg_wrap'>
                                    <Input.TextArea
                                        autoSize={{ minRows: 1 }}
                                        value={input_txt}
                                        onChange={(e) => {
                                            this.setState({ input_txt: e.target.value })
                                        }}
                                        className='m_2'
                                    />
                                    {
                                        this.ctype != 52 &&this.ctype != 53?
                                            <div onClick={() => { this.setState({ showImgUpPannel: true, sendImgList: [] }) }} className='d_flex jc_ct ai_ct' style={{ width: '50px', height: '34px' }}>
                                                <Icon type="file-image" style={{ fontSize: '25px' }} />
                                            </div> : null
                                    }

                                    <div className='emojis_wrap' style={{ height: '25px', marginRight: '5px' }}>
                                        <Popover content={this.contentEmoji()} trigger="click">
                                            <Icon type="smile" style={{ fontSize: '25px' }} />
                                        </Popover>
                                    </div>
                                    <Button onClick={this._onSend}>发送消息</Button>
                                </div>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal okText='刷新' bodyStyle={{ paddingTop: '10px', height: '520px' }} cancelText='关闭' onOk={this.getRoomUserList} title={user_list_type == 'all' ? '在线用户' : '禁言用户'} zIndex={99} visible={this.state.showUserPannel} maskClosable={true} onCancel={() => this.setState({ showUserPannel: false })}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#bebebe', paddingBottom: '5px' }}>* 要查看最新的用户，请点击刷新按钮</div>
                        <Input.Search
                            placeholder="用户名"
                            onSearch={this._onSearch}
                            style={{ maxWidth: '100%' }}
                            onChange={this._onSearchChange}
                            value={keyword}
                        />
                        <div style={{ width: '100%', height: '455px', position: 'relative' }}>
                            <AutoSizer>
                                {({ width, height }) => (
                                    <VList
                                        width={width}
                                        height={height}

                                        rowCount={user_list.length}
                                        deferredMeasurementCache={this.measureCache_user}
                                        rowHeight={this.measureCache_user.rowHeight}
                                        rowRenderer={this.rowRenderer_user}
                                        style={{
                                            padding: '0 15px',
                                            outlineStyle: 'none',
                                        }}
                                        noRowsRenderer={this._noRowsRenderer}
                                    >
                                    </VList>
                                )}
                            </AutoSizer>
                        </div>
                    </div>
                </Modal>
                <Modal okText='刷新' bodyStyle={{ paddingTop: '10px', minHeight: '520px' }} cancelText='关闭' onOk={this.getKickUserList} title='被踢用户' zIndex={99} visible={this.state.showKickPannel} maskClosable={true} onCancel={() => this.setState({ showKickPannel: false })}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#bebebe', paddingBottom: '5px' }}>* 要查看最新的用户，请点击刷新按钮</div>
                        <Input.Search
                            placeholder="用户名"
                            onSearch={this._onSearchKick}
                            style={{ maxWidth: '100%' }}
                            onChange={this._onSearchChangeKick}
                            value={this.state.keyword_kick}
                        />
                        <div style={{ width: '100%', height: '455px', position: 'relative' }}>
                            <AutoSizer>
                                {({ width, height }) => (
                                    <VList
                                        width={width}
                                        height={height}

                                        rowCount={k_user_list.length}
                                        deferredMeasurementCache={this.measureCache_kuser}
                                        rowHeight={this.measureCache_kuser.rowHeight}
                                        rowRenderer={this.rowRenderer_kuser}
                                        style={{
                                            padding: '0 15px',
                                            outlineStyle: 'none',
                                        }}
                                        noRowsRenderer={this._noRowsRenderer}
                                    >
                                    </VList>
                                )}
                            </AutoSizer>
                        </div>
                    </div>
                </Modal>
                <Modal title='商品推送' zIndex={99} width={800} visible={this.state.showGoodsPannel} maskClosable={true} footer={null} onCancel={() => this.setState({ showGoodsPannel: false })}>
                    <Table dataSource={this.live_goods} columns={this.columnsGoods} rowKey={'goodsId'} tableLayout={'fixed'} size={'middle'} pagination={false} />
                </Modal>
                <Modal zIndex={100} visible={this.state.showImgPannel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPannel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImg} />
                </Modal>
                <Modal
                    zIndex={99}
                    visible={this.state.showImgUpPannel}
                    closable={true}
                    maskClosable={true}
                    okText='发送'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showImgUpPannel: false, sendImgList: [] })
                    }}
                    bodyStyle={{ paddingTop: "40px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onOk={this._onImg}
                >
                    <AntdOssUpload
                        actions={this.props.actions}
                        maxLength={4}
                        tip='上传图片'
                        listType="picture-card"
                        accept='image/*'
                        ref={ref => this.img = ref}
                    />
                </Modal>
                <style>
                    {
                        style
                    }
                    {
                        this.props.match.path !== '/room/:id' ? null : teacher_style
                    }
                </style>
            </div>
        )
    }
}
const teacher_style = `
    .admin_pannel .ant-card-body{
        height: 380px !important;
    }
    .msg_wrap{
        margin-bottom:10px;
    }
    .player .ant-card-body{
        min-height: 792px !important;
    }
    .con{
        height: 100vh;
        min-height: 910px;
    }
`
const style = `
    address, dl, ol, ul {
        margin-bottom: 0 !important;
    }
    .arrow_icon{
        width:10px;
        height:10px;
    }
    .msg_tips{
        cursor: default;
        position: absolute;
        bottom: 10px;
        right: 25px;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        color: #83d3fd;
        font-size: 12px;
        box-shadow: 0 0 2px #eaeaea;
        background: #fff;
        padding: 5px 15px;
    }
    .bf_emojis li {
        display: block;
        float: left;
        width: 36px;
        margin: 0;
        padding: 0;
        color: #fff;
        border-radius: 2px;
        font-family: Semoji,emoji,Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol;
        font-size: 18px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-transition: -webkit-transform .2s;
        transition: -webkit-transform .2s;
        transition: transform .2s;
        transition: transform .2s,-webkit-transform .2s;
    }
    .emojis_wrap{
        position: relative;
    
    }
    .emojis_wrap:hover .bf_emojis_wrap{
        display: block;
    }
    .bf_emojis_wrap{
        overflow: hidden;
        overflow: auto;
        border-radius: 2px;
    }
    .bf_emojis{
        padding:0;
        box-sizing: content-box;
        width: 220px;
        
        list-style: none;
        margin: 0;
        overflow: auto;
    }
    #ckplayer>div{height:600px !important}
    .dplayer-video-wrap .dplayer-video{height: 600px;}
    .dplayer-video-wrap{ display: flex;align-items: center;}
    .userCount{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 5px 5px;
        background: #fff;
        z-index: 99;
        border-bottom: 1px solid #eaeaea;
    }

    .ant-list-item-action{
        margin-left:0
    }
    .ws_msg_wrap{
        width: 120px;
        height:90px;
    }
    .msg_img{
        box-shadow:0 0 8px 0px #b9b9b9;
        max-width:100%;
        max-height: 100%;
        display:block;
    }
    .breadcrumb{
        min-width:866px;
        padding: 0.55rem 1rem;
        margin-bottom: 5px;
    }
    .hide{
        display: none !important;
    }
    .row{
        flex-wrap:nowrap;
    }
    .col-8{
        flex-shrink: 1;
    }
    .col-4{
        min-width: 462px;
        flex-shrink: 0;
    }

`
const LayoutComponent = LiveView;
const mapStateToProps = state => {
    return {
        room_user_list: state.course.room_user_list,
        live_goods: state.course.live_goods,
        gift_list: state.ad.gift_list,
        teacher_info: state.teacher.teacher_info,
        course_info: state.course.course_info,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
