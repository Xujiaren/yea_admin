import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Icon, Upload, Avatar, List, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio, Spin, Tooltip, InputNumber } from 'antd';
import connectComponent from '../../util/connect';
import locale from 'antd/es/date-picker/locale/zh_CN';
import _ from 'lodash'
import ChapterSetting from './ChapterSetting'
import moment from 'moment';
import config from '../../config/config';
import Clipboard from 'react-copy-to-clipboard'
import cookie from 'react-cookies'
import StatCourse from '../../components/StatCourse'
import AntdOssUpload from '../../components/AntdOssUpload'
import { Button, Popconfirm } from '../../components/BtnComponent'
import Quetionna from './Quetionna'
function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const { TabPane } = Tabs;
const { Search } = Input;
class LiveManager extends Component {
    state = {
        view_mode: false,
        edit: true,
        view: true,
        visible: false,
        isView: false,
        loading: true,
        title: '',

        status: 0,

        course_id: '0',
        course_name: '',

        live_name: '直播小助手',
        avatar: '',
        teacher_avatar: '',
        teacher_name: '',
        teacher_url: '',

        keyword: '',
        _keyword: '',
        category_id: '',
        ctype: '2',
        live_status: '0',

        stream_url: '',

        previewImage: '',
        showImgPanel: false,
        showDownPannel: false,
        videoList: [],
        fileList: [],
        teacherFileList: [],

        activeTab: '0',
        isAll: false,
        selected_g: [],
        id_group: [],
        exportLoading: false,
        showsetting: false,
        id: 0,
        activity_title: '',
        activity_num: 0,
        activity_content: '',
        begin_time: '',
        BeginTime: null,
        courseId: 0,
        ctypes: 1,
        activity_id: 0,
        reward_lists: [],
        showlist: false,
        actlist: [],
        showsettings: false,
        sn: '',
        rid: 0,
        loads: false,
        showHudong: false,
        askList: {},
        topicList: [],
        create_time: '',
        createTime: null,
        send_now:0,
    };
    category_list = []
    course_live_list = []
    page_total = 0
    page_current = 1
    page_size = 10

    _onPage = (val) => {

        const { actions } = this.props;
        let pathname = this.props.history.location.pathname

        clearInterval(this.interval)
        this.props.history.replace(pathname + '?page=' + val)
        actions.getLiveCourse({
            keyword: this.state.keyword,
            page: val - 1,
            pageSize: this.page_size,
            category_id: this.state.category_id,
            ctype: this.state.ctype,
            live_status: this.state.live_status
        })

        this.getCourseInterval()

    }
    getStream(id) {
        const { actions } = this.props
        let timestamp = new Date().getTime()
        this.setState({ stream_url: '正在获取推流链接。。', showBeginPanel: true })
        fetch(config.api + '/course/stream/?course_id=' + id + '&action=push', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(body => {
                const { errorMsg } = body
                if (!errorMsg) {
                    this.setState({ stream_url: body.resultBody.rtmp })
                    actions.startEnd({
                        course_id: id,
                        time: parseInt(timestamp / 1000),
                        type: 0
                    })
                }
            });
    }
    _onDownCourse = () => {

        const { keyword, category_id, selected_g } = this.state
        if (selected_g.length == 0) {
            message.error('请先选择课程')
            return;
        }
        clearInterval(this.interval)
        const { actions } = this.props
        actions.downCourse({
            course_ids: selected_g.join(','),
            resolved: (data) => {
                message.success("操作成功")
                actions.getLiveCourse({
                    keyword: this.state.keyword,
                    page: this.page_current - 1,
                    pageSize: this.page_size,
                    category_id: this.state.category_id,
                    ctype: this.state.ctype,
                    live_status: this.state.live_status
                })
            },
            rejected: (data) => {
                message.error(data)
            }
        })
        this.getCourseInterval()
    }

    _onUpCourse = () => {

        const { selected_g } = this.state
        if (selected_g.length == 0) {
            message.info('请先选择课程')
            return;
        }
        clearInterval(this.interval)
        const { actions } = this.props
        actions.upCourse({
            course_ids: selected_g.join(','),
            resolved: (data) => {
                message.success("操作成功")
                actions.getLiveCourse({
                    keyword: this.state.keyword,
                    page: this.page_current - 1,
                    pageSize: this.page_size,
                    category_id: this.state.category_id,
                    ctype: this.state.ctype,
                    live_status: this.state.live_status
                })
            },
            rejected: (data) => {
                message.error(data)
            }
        })
        this.getCourseInterval()
    }
    _onRemove_all = () => {
        const { actions } = this.props
        const { selected_g } = this.state
        if (selected_g.length == 0) {
            message.info('请先选择课程'); return;
        }

        clearInterval(this.interval)
        actions.removeCourse({
            course_ids: selected_g.join(','),
            resolved: (data) => {
                message.success("操作成功")
                actions.getLiveCourse({
                    keyword: this.state.keyword,
                    page: this.page_current - 1,
                    pageSize: this.page_size,
                    category_id: this.state.category_id,
                    ctype: this.state.ctype,
                    live_status: this.state.live_status
                })
            },
            rejected: (data) => {
                message.error(data)
            }
        })
        this.getCourseInterval()
    }
    _onTop(courseId) {
        const { actions } = this.props
        clearInterval(this.interval)
        this.getCourseInterval()
        actions.updateCourse({
            action: 'top',
            course_id: courseId,
            resolved: (data) => {
                message.success("操作成功")
                actions.getLiveCourse({
                    keyword: this.state.keyword,
                    page: this.page_current - 1,
                    pageSize: this.page_size,
                    category_id: this.state.category_id,
                    ctype: this.state.ctype,
                    live_status: this.state.live_status
                })
            },
            rejected: (data) => {
                message.error(data)
            }
        })

    }
    _onStatus(courseId) {
        const { actions } = this.props

        clearInterval(this.interval)
        this.getCourseInterval()
        actions.updateCourse({
            action: 'status',
            course_id: courseId,
            resolved: (data) => {
                message.success("操作成功")
                actions.getLiveCourse({
                    keyword: this.state.keyword,
                    page: this.page_current - 1,
                    pageSize: this.page_size,
                    category_id: this.state.category_id,
                    ctype: this.state.ctype,
                    live_status: this.state.live_status
                })
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onRemove(courseId) {
        const { actions } = this.props

        clearInterval(this.interval)
        actions.removeCourse({
            course_id: courseId,
            resolved: (data) => {
                message.success("操作成功")
                actions.getLiveCourse({
                    keyword: this.state.keyword,
                    page: this.page_current - 1,
                    pageSize: this.page_size,
                    category_id: this.state.category_id,
                    ctype: this.state.ctype,
                    live_status: this.state.live_status
                })
            },
            rejected: (data) => {
                //console.log(data)
                message.error(data)
            }
        })
        this.getCourseInterval()
    }
    _onFilter = () => {
        const { actions } = this.props
        const pathname = this.props.history.location.pathname

        clearInterval(this.interval)
        actions.getLiveCourse({
            keyword: this.state._keyword,
            page: 0,
            pageSize: this.page_size,
            category_id: this.state.category_id,
            ctype: this.state.ctype,
            live_status: this.state.live_status
        })
        this.props.history.replace(pathname + '?page=1')
        this.setState({ keyword: this.state._keyword })
        this.getCourseInterval()
    }
    _onSearch = (val) => {
        const { actions } = this.props
        const pathname = this.props.history.location.pathname

        clearInterval(this.interval)
        actions.getLiveCourse({
            keyword: val,
            page: 0,
            pageSize: this.page_size,
            category_id: this.state.category_id,
            ctype: this.state.ctype,
            live_status: this.state.live_status
        })
        this.props.history.replace(pathname + '?page=1')
        this.setState({ keyword: val })
        this.getCourseInterval()
    }
    _onTabChange = val => {
        let typ = ''
        if (val == '0') {
            typ = 2
        } else if (val == '1') {
            typ = 52
        } else if (val == '2') {
            typ = 51
        } else if (val == '4') {
            typ = 53
        }
        this.setState({ loading: true, activeTab: val, ctype: typ })

        const that = this
        const { actions } = this.props

        actions.getLiveCourse({
            keyword: this.state.keyword,
            page: 0,
            pageSize: this.page_size,
            category_id: this.state.category_id,
            ctype: typ,
            live_status: val
        })

        this.setState({
            live_status: val
        }, () => {
            clearInterval(that.interval)
            that.getCourseInterval()
        })
    }
    componentWillMount() {
        const { actions } = this.props

        const { search } = this.props.history.location

        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page + 1
        }

        actions.getCategory({
            keyword: '',
            page: 0,
            pageSize: 10000,
            cctype: '-1',
            ctype: '3',
            parent_id: '0'
        })
        actions.getLiveCourse({
            keyword: this.state.keyword,
            page: page,
            pageSize: this.page_size,
            category_id: this.state.category_id,
            ctype: this.state.ctype,
            live_status: this.state.live_status
        })
        this.getCourseInterval()
    }
    getCourseInterval = () => {
        const { actions } = this.props
        this.interval = setInterval(() => {
            actions.getLiveCourse({
                keyword: this.state.keyword,
                page: this.page_current - 1,
                pageSize: this.page_size,
                category_id: this.state.category_id,
                ctype: this.state.ctype,
                live_status: this.state.live_status
            })
        }, 10000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    componentWillReceiveProps(n_props) {

        if (n_props.course_qrcode_info !== this.props.course_qrcode_info) {
            this.setState({ qrcode: n_props.course_qrcode_info.data })
        }
        if (n_props.category_list !== this.props.category_list) {
            this.category_list = n_props.category_list.data
        }
        if (n_props.course_live_list !== this.props.course_live_list) {
            if (n_props.course_live_list.data.length == 0) {

            }

            this.course_live_list = n_props.course_live_list.data
            this.page_total = n_props.course_live_list.total
            this.page_current = n_props.course_live_list.page + 1

            let _id_tmp = []
            this.course_live_list.map((ele, index) => {
                _id_tmp.push({ id: ele.courseId, checked: false })
            })
            this.setState({
                id_group: _id_tmp
            }, () => {
                this.setState({ loading: false })
            })
        }
        this.setState({
            isAll: false,
            selected_g: [],
        })

    }
    _onCheckAll = () => {

        this.setState(pre => {
            let selected_g = []
            let id_group = pre.id_group

            let isAll = false
            if (pre.isAll) {
                isAll = false

                id_group.map(ele => {
                    ele.checked = false
                })

            } else {
                isAll = true
                id_group.map(ele => {
                    selected_g.push(ele.id)
                    ele.checked = true
                })
            }
            return {
                isAll,
                selected_g,
                id_group
            }
        })

    }
    _onCheck(idx, e) {
        const id = e.target['data-id']

        this.setState((pre) => {
            let id_group = pre.id_group
            let selected_g = []
            let tmp = []
            let isAll = false

            if (e.target.checked) {
                id_group[idx].checked = true
                selected_g = [...pre.selected_g, id]
            } else {
                id_group[idx].checked = false
                tmp = pre.selected_g.filter((ele) => (
                    ele !== id
                ))
                selected_g = tmp
            }

            return {
                id_group,
                selected_g,
                isAll
            }

        }, () => {
            let isAll = false
            if (this.state.selected_g.length == this.state.id_group.length)
                isAll = true
            this.setState({ isAll })
        })

    }
    handleCancel = () => {
        this.setState({
            visible: false,
            tag_id: '',
        });
    };
    showImgPanel(url) {
        this.setState({
            showImgPanel: true,
            previewImage: url
        });
    }
    showDownPannel = (videoList) => {
        let showDownPannel = true
        this.setState({ videoList, showDownPannel })
    }
    hideImgPanel = () => {
        this.setState({
            showImgPanel: false
        });
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            showImgPanel: true,
        });
    };
    onImgChange = ({ file, fileList, event }) => {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.info('只能上传 JPG/PNG/GIF 文件!');
            return
        }

        let img = ''
        if (file.status == 'done') {
            img = file.response.resultBody
        }

        this.setState({
            fileList: fileList,
            avatar: img
        })

    }
    onTeacherImgChange = ({ file, fileList }) => {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.info('只能上传 JPG/PNG/GIF 文件!');
            return
        }

        let img = ''
        let teacher_url = this.state.teacher_url
        if (file.status == 'done') {
            img = file.url
            teacher_url += ('&avatar=' + img.replace(/\//g, '_'))
        }

        if (fileList.length == 0) {
            teacher_url = teacher_url.slice(0, teacher_url.indexOf('&avatar='))
        }
        this.setState({
            teacher_avatar: img,
            teacher_url: teacher_url
        })

    }
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        return isJpgOrPng;
    }
    _onExportUser(course_id, course_name) {
        this.setState({ exportLoading: true })
        const { actions } = this.props
        // const {course_id,course_name,begin_time} = this.state
        actions.exportCourseUser({
            course_id, course_name, begin_time: '2020-01-01 00:00',
            resolved: (data) => {
                this.setState({ exportLoading: false })
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(data.adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                this.setState({ exportLoading: false })
                message.error(data)
            }
        })
    }
    showCode(course_id, type) {
        const { actions } = this.props
        let ctype = 2
        if (this.state.activeTab == 1 || this.state.activeTab == 4) {
            ctype = 52
        }
        this.setState({
            showCode: true,
            qrcode: ''
        })

        if (type == 'roll')
            ctype = 0

        actions.getCoursePreviewQrcode({
            course_id,
            ctype
        })
    }
    onSetting = (val) => {
        const { actions } = this.props
        console.log(val)
        this.setState({
            courseId: val.courseId,
            reward_lists: []
        })
        actions.getActivelive({
            course_id: val.courseId,
            atype: 5,
            resolved: (res) => {
                if (res.length > 0) {
                    let begin_time = moment.unix(res[0].beginTime).format('YYYY-MM-DD HH:mm')
                    let BeginTime = moment(begin_time)
                    console.log(res, '??')
                    this.setState({
                        // activity_id: res[0].activityId,
                        // activity_num: res[0].num,
                        // activity_title: res[0].title,
                        // activity_content: res[0].content,
                        // begin_time: begin_time,
                        // BeginTime: BeginTime,
                        reward_lists: res
                    })
                }
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        this.setState({ showsetting: true, id: val.courseId })
    }
    onHudong = (val) => {
        const { actions } = this.props
        let that = this
        console.log(val)
        this.setState({
            courseId: val.courseId,
            reward_lists: []
        })
        actions.getActivelive({
            course_id: val.courseId,
            atype: 6,
            resolved: (res) => {
                if (res.length > 0) {
                    let create_time = moment.unix(res[0].beginTime).format('YYYY-MM-DD HH:mm')
                    let createTime = moment(create_time)
                    console.log(res, '??')
                    const { topics } = res[0]
                    let topicList = []
                    if (topics.length > 0) {
                        topics.map(ele => {
                            let options = []
                            let dataSource = []
                            ele.topicOptions.map((_ele, _index) => {
                                options.push(_ele.optionLabel)
                                dataSource.push({
                                    label: String.fromCharCode(_index + 65),
                                    title: _ele.optionLabel,
                                })
                            })
                            topicList.push({
                                title: ele.title,
                                ttype: ele.ttype,
                                options: options,
                                uid: Math.random() * 10 + Date.now() + '',
                                dataSource
                            })
                        })
                    }
                    this.setState({
                        askList: res[0],
                        createTime: createTime,
                        create_time: create_time,
                        topicList: topicList
                    })
                } else {
                    actions.postLiveHudong({
                        content: '',
                        content_id: val.courseId,
                        num: 0,
                        title: val.courseName,
                        activity_id: 0,
                        begin_time: '',
                        resolved: (ress) => {
                            let create_time = moment.unix(ress.beginTime).format('YYYY-MM-DD HH:mm')
                            let createTime = moment(create_time)
                            that.setState({
                                askList: ress,
                                createTime: createTime,
                                create_time: create_time
                            })
                        },
                        rejected: (err) => {
                            console.log(err)
                        }
                    })
                }
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        this.setState({ showHudong: true, id: val.courseId })
    }
    onEdits = (val) => {
        let begin_time = moment.unix(val.beginTime).format('YYYY-MM-DD HH:mm')
        let BeginTime = moment(begin_time)
        this.setState({
            activity_id: val.activityId,
            activity_num: val.num,
            activity_title: val.title,
            activity_content: val.content,
            begin_time: begin_time,
            BeginTime: BeginTime,
        })
    }
    onOk = () => {
        const { activity_title, activity_num, activity_content, id } = this.state
        const { actions } = this.props
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        let begin = new Date().Format("yyyy-MM-dd hh:mm:ss");
        actions.publishActive({
            content: activity_content,
            activity_content: id,
            ctype: 0,
            num: activity_num,
            title: activity_title,
            activity_id: 0,
            begin_time: begin,
            resolved: (res) => {
                console.log(res)
                message.success({
                    content: '操作成功'
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getacts = () => {
        this.props.actions.getActivelive({
            course_id: this.state.courseId,
            resolved: (res) => {
                if (res.length > 0) {
                    let begin_time = moment.unix(res[0].beginTime).format('YYYY-MM-DD HH:mm')
                    let BeginTime = moment(begin_time)
                    console.log(res)
                    this.setState({
                        reward_lists: res
                    })
                }
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onOkeys = () => {
        const { activity_content, activity_title, activity_num, begin_time, ctypes, activity_id, courseId,send_now } = this.state
        const { actions } = this.props
        // console.log(activity_num)
        actions.publishActivelive({
            content: activity_content,
            content_id: courseId,
            ctype: ctypes,
            num: activity_num,
            title: activity_title,
            activity_id: activity_id,
            begin_time: begin_time,
            send_now:send_now,
            resolved: (res) => {
                actions.publishActiveItem({
                    activity_id: res.activityId,
                    item_index: -1,
                    itemNum: activity_num,
                    coupon_id: 0,
                    ctype: ctypes,
                    integral: 0,
                    item_img: '',
                    item_name: activity_title,
                    rate: 0,
                    resolved: (res) => {
                        message.success({
                            content: '操作成功'
                        })
                        this.getacts()
                    },
                    rejected: (err) => {

                    }
                })
                this.setState({
                    activity_id: 0,
                    activity_num: 0,
                    activity_title: '',
                    activity_content: '',
                    begin_time: '',
                    BeginTime: null,
                    // showsetting: false
                })

            },
            rejected: (err) => {
                console.log(err)
            }
        })

    }
    onDeleteAct = (val) => {
        this.props.actions.actionActivity({
            action: 'delete',
            activity_id: val.activityId,
            resolved: (res) => {
                message.success({
                    content: '操作成功'
                })
                this.getacts()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    showList = (val) => {
        const { actions } = this.props
        this.setState({
            activity_id: val.activityId
        })
        actions.getActrewards({
            activity_id: val.activityId,
            keyword: '',
            page: 0,
            pageSize: 100,
            resolved: (res) => {
                this.setState({
                    actlist: res.data,
                    showlist: true
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onTrues = () => {
        const { actions } = this.props
        const { rid, sn, activity_id } = this.state
        if (!sn) { message.info({ content: '请填写单号' }); return; }
        actions.updatePost({
            reward_id: rid,
            ship_sn: sn,
            resolved: (res) => {
                message.success({
                    content: "操作成功"
                })
                actions.getActrewards({
                    activity_id: activity_id,
                    keyword: '',
                    page: 0,
                    pageSize: 100,
                    resolved: (res) => {
                        this.setState({
                            actlist: res.data,
                            // showlist:true
                        })
                    },
                    rejected: (err) => {
                        console.log(err)
                    }
                })
                this.setState({
                    showsettings: false,
                })

            }
        })
    }
    onExports = (val) => {
        this.setState({
            loads: true
        })
        this.props.actions.getLiveExports({
            action: 'export',
            courseIds: val,
            is_auth: -1,
            region_id: 0,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExportall = () => {
        const { id_group } = this.state
        let lst = []
        id_group.map(item => {
            if (item.checked === true) {
                lst = lst.concat(item.id)
            }
        })
        if (lst.length == 0) { message.info({ content: '请先选择' }); return; }
        this.setState({
            loads: true
        })
        this.props.actions.getLiveExports({
            action: 'export',
            courseIds: lst.toString(),
            is_auth: -1,
            region_id: 0,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExportTime = (val) => {
        this.setState({
            loads: true
        })
        this.props.actions.getLiveTimes({
            action: 'export',
            courseIds: val,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExporttimeall = () => {
        const { id_group } = this.state
        let lst = []
        id_group.map(item => {
            if (item.checked === true) {
                lst = lst.concat(item.id)
            }
        })
        if (lst.length == 0) { message.info({ content: '请先选择' }); return; }
        this.setState({
            loads: true
        })
        this.props.actions.getLiveTimes({
            action: 'export',
            courseIds: lst.toString(),
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExportReward = (val) => {
        this.setState({
            loads: true
        })
        this.props.actions.getLiveRewards({
            action: 'export',
            courseIds: val,
            is_auth: -1,
            region_id: 0,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExportRewardall = () => {
        const { id_group } = this.state
        let lst = []
        id_group.map(item => {
            if (item.checked === true) {
                lst = lst.concat(item.id)
            }
        })
        if (lst.length == 0) { message.info({ content: '请先选择' }); return; }
        this.setState({
            loads: true
        })
        this.props.actions.getLiveRewards({
            action: 'export',
            courseIds: lst.toString(),
            is_auth: -1,
            region_id: 0,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExportBan = (val) => {
        this.setState({
            loads: true
        })
        this.props.actions.getLiveBan({
            action: 'export',
            courseIds: val,
            is_auth: -1,
            region_id: 0,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExportBanall = () => {
        const { id_group } = this.state
        let lst = []
        id_group.map(item => {
            if (item.checked === true) {
                lst = lst.concat(item.id)
            }
        })
        if (lst.length == 0) { message.info({ content: '请先选择' }); return; }
        this.setState({
            loads: true
        })
        this.props.actions.getLiveBan({
            action: 'export',
            courseIds: lst.toString(),
            is_auth: -1,
            region_id: 0,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExportHudon = (val) => {
        this.setState({
            loads: true
        })
        this.props.actions.getLiveHudon({
            action: 'export',
            courseIds: val,
            is_auth: -1,
            region_id: 0,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onExportHudonall = () => {
        const { id_group } = this.state
        let lst = []
        id_group.map(item => {
            if (item.checked === true) {
                lst = lst.concat(item.id)
            }
        })
        if (lst.length == 0) { message.info({ content: '请先选择' }); return; }
        this.setState({
            loads: true
        })
        this.props.actions.getLiveHudon({
            action: 'export',
            courseIds: lst.toString(),
            is_auth: -1,
            region_id: 0,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({
                    loads: false
                })
                message.success({ content: '导出成功', })
                window.open(url, '_black')
            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onRewardExport = () => {
        const { courseId } = this.state
        this.setState({
            loads: true
        })
        this.props.actions.getLiveRewardExports({
            course_id: courseId,
            is_auth: -1,
            region_id: 0,
            resolved: (res) => {
                if (res.address) {
                    message.success({
                        content: '导出成功'
                    })
                    window.open(res.address)
                    this.setState({
                        loads: false
                    })
                } else {
                    message.info({
                        content: '没有数据'
                    })
                    this.setState({
                        loads: false
                    })
                }

            },
            rejected: (err) => {
                console.log(err)
                this.setState({
                    loads: false
                })
            }
        })
    }
    onHudonOk = () => {
        const { askList, create_time } = this.state
        const { actions } = this.props
        let quetionna = []
        quetionna = this.quetionna.getValue() || []
        if (quetionna.length == 0) {
            message.info('请上传问卷题目'); return false;
        }

        actions.postLiveHudong({
            content: '',
            content_id: askList.courseId,
            num: 0,
            title: askList.title,
            activity_id: askList.activityId,
            begin_time: create_time,
            resolved: (res) => {

                quetionna.map((ele, index) => {
                    actions.publishQuestionna({
                        ttype: ele.ttype,
                        title: ele.title,
                        options: ele.options.join('|||'),
                        topic_id: 0,
                        activity_id: askList.activityId,
                        resolved: () => {
                            message.success({
                                content: '操作成功'
                            })
                            this.setState({
                                showHudong: false,
                                askList: {},
                                topicList: []
                            })
                        },
                        rejected: (data) => {
                            message.error(data)
                        }
                    })
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onResult = (val) => {
        const { actions } = this.props
        this.setState({
            courseId: val.courseId,
            reward_lists: []
        })
        actions.getActivelive({
            course_id: val.courseId,
            atype: 6,
            resolved: (res) => {
                if (res.length > 0) {
                    this.props.history.push('/activity/result/4/' + res[0].activityId)
                } else {
                    message.info({
                        content: '该直播未设置互动回答'
                    })
                }
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }

    render() {

        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const uploadButtonImg = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const { view, edit } = this.state
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="直播列表管理">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>

                                        <Select defaultValue='' onChange={val => { this.setState({ category_id: val }) }} style={{ minWidth: '120px' }}>
                                            <Select.Option value=''>全部分类</Select.Option>
                                            {this.category_list.map((ele, index) => (
                                                <Select.Option key={index + 'cate'} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                            ))}
                                        </Select>&nbsp;
                                        <Search
                                            placeholder=''
                                            onSearch={this._onSearch}
                                            onChange={e => {
                                                this.setState({ _keyword: e.target.value })
                                            }}
                                            value={this.state._keyword}
                                            style={{ maxWidth: 200 }}
                                        />&nbsp;
                                        <Button onClick={this._onFilter}>筛选</Button>
                                    </div>
                                    <div>
                                        <Button value='live/add' onClick={() => {
                                            this.props.history.push('/live/add/0')
                                        }}>创建直播课程</Button>
                                    </div>
                                </div>
                                <Tabs onChange={this._onTabChange} activeKey={this.state.activeTab}>
                                    <TabPane tab="课程直播" key='0'>
                                    </TabPane>
                                    <TabPane tab="活动直播" key='1'>
                                    </TabPane>
                                    <TabPane tab="研讨会课程直播" key='2'>
                                    </TabPane>
                                    <TabPane tab="研讨会活动直播" key='4'>
                                    </TabPane>
                                    <TabPane tab="回播" key='3'>
                                    </TabPane>
                                </Tabs>
                                <div className="pad_b10">
                                    <Button onClick={this._onCheckAll} size={'small'}>{this.state.isAll ? '取消全选' : '全选'}</Button>&nbsp;
                                    <Popconfirm value='live/del' title='确定要批量删除吗' okText='确定' cancelText='取消' onConfirm={
                                        this._onRemove_all
                                    }>
                                        <Button type="" size={'small'}>删除</Button>
                                    </Popconfirm>
                                    &nbsp;
                                    {/*<Button onClick={null} type="" size={'small'} disabled>推荐</Button>*/}
                                    <Button value='live/edit' onClick={this._onUpCourse} type="" size={'small'} className="">上架</Button>&nbsp;
                                    <Button value='live/edit' onClick={this._onDownCourse} type="" size={'small'} className="">下架</Button>
                                    <Button loading={this.state.loads} size='small' onClick={this.onExportall}>批量直播观看数据导出</Button>
                                    <Button loading={this.state.loads} size='small' onClick={this.onExporttimeall}>批量在线人数时间分布数据导出</Button>
                                    <Button loading={this.state.loads} size='small' onClick={this.onExportRewardall}>批量打赏数据导出</Button>
                                    <Button loading={this.state.loads} size='small' onClick={this.onExportBanall}>批量禁言用户导出</Button>
                                    <Button loading={this.state.loads} size='small' onClick={this.onExportHudonall}>批量互动情况导出</Button>
                                </div>
                                {this.state.loading ? <Spin className='block_center pad_20' indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /> : this.state.activeTab == '0' || this.state.activeTab == '1' || this.state.activeTab == '2' || this.state.activeTab == '4' ?
                                    <Table responsive size="sm" className='animated fadeIn' key='_table'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>课程主图</th>
                                                <th>课程 ID</th>
                                                <th>课程编号</th>
                                                <th>课程名称</th>
                                                <th>分类</th>
                                                <th>直播时间</th>
                                                <th>结束时间</th>
                                                <th>价格</th>
                                                <th>主讲人</th>
                                                <th>PV</th>
                                                <th>UV</th>
                                                <th>预约人数</th>
                                                <th>上架状态</th>
                                                <th>直播状态</th>
                                                <th>视频状态</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.course_live_list.map((ele, index) => (


                                                <tr key={index + '_a'}>
                                                    <td>
                                                        <Checkbox
                                                            data-id={ele.courseId}
                                                            onChange={this._onCheck.bind(this, index)}
                                                            checked={this.state.id_group[index].checked}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a>
                                                            <img onClick={this.showImgPanel.bind(this, ele.courseImg)} className="head-example-img" src={ele.courseImg} />
                                                        </a>
                                                    </td>
                                                    <td>{ele.courseId}</td>
                                                    <td>{ele.sn}</td>
                                                    <td style={{ maxWidth: '260px' }} className='pad_t20 pad_b20'>
                                                        <Tooltip title={ele.courseName}>
                                                            <div className='text_more'>{ele.courseName}</div>
                                                        </Tooltip>
                                                        {
                                                            this.state.activeTab == 1 || this.state.activeTab == 4 ?
                                                                <div className='be_ll_gray'>/comPages/pages/index/activeLive?courseId={ele.courseId}</div>
                                                                :
                                                                <div className='be_ll_gray'>/pages/index/liveDesc?courseId={ele.courseId}</div>
                                                        }
                                                    </td>
                                                    <td><Tag>{ele.category_name || '无'}</Tag><Tag>{ele.ccategory_name || '无'}</Tag></td>
                                                    <td>{moment.unix(ele.beginTime).format('YYYY-MM-DD HH:mm')}</td>
                                                    <td>{moment.unix(ele.endTime).format('YYYY-MM-DD HH:mm')}</td>
                                                    <td>{ele.integral}</td>
                                                    <td>{ele.teacherName}</td>
                                                    <td>{ele.hit}</td>
                                                    <td>{ele.uv}</td>
                                                    <td>{ele.bookNum}</td>
                                                    <td>{ele.status == 1 ? "已上架" : "已下架"}</td>
                                                    <td>{
                                                        ele.liveStatus == 0 ? '未开播' :
                                                            ele.liveStatus == 1 ? '直播中' :
                                                                ele.endTime > Date.parse(new Date()) / 1000 ? '直播暂停' : '直播结束'
                                                    }
                                                    </td>
                                                    <td>
                                                        {
                                                            ele.liveStatus >= 1 && ele.videoList.length !== 0 ?
                                                                <Button value='live/down' onClick={this.showDownPannel.bind(this, ele.videoList)} size={'small'} className='m_2' type='primary'>
                                                                    下载
                                                                </Button> : ''
                                                        }
                                                        {
                                                            ele.liveStatus == 2 && (ele.endTime < Date.parse(new Date()) / 1000) ?
                                                                <Popconfirm value='live/chapter' title='如果直播已结束，上传回播视频后，将变成回播课程' okText='确定' cancelText='取消'
                                                                    onConfirm={() => {
                                                                        this.props.history.push({
                                                                            pathname: '/live/chapter/' + ele.courseId
                                                                        })
                                                                    }}
                                                                >
                                                                    <Button size={'small'} className='m_2'>上传</Button>
                                                                </Popconfirm>

                                                                : ''}

                                                    </td>
                                                    <td>
                                                        <div>

                                                            {/* <Button size={'small'} className='m_2' onClick={()=>{
                                                        this.setState({ showChapter:true })
                                                    }}>章节管理</Button> */}
                                                            <Button value='live/edit' onClick={this._onStatus.bind(this, ele.courseId)} className="m_2" type="primary" ghost={ele.status ? true : false} size={'small'}>{ele.status == 1 ? "下架" : "上架"}</Button>
                                                            {/*<Button  type="primary" size={'small'} className='m_2'>已置顶</Button>&nbsp;*/}
                                                            <Button value='live/view' onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: '/live/add/' + ele.courseId,
                                                                    state: { type: "view" }
                                                                })
                                                            }} type="primary" size={'small'} className='m_2'>查看</Button>
                                                            <Button value='live/edit' onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: '/live/add/' + ele.courseId,
                                                                    state: { type: "edit" }
                                                                })

                                                            }} type="primary" size={'small'} className='m_2'>修改</Button>
                                                            <Popconfirm
                                                                value='live/del'
                                                                okText="确定"
                                                                cancelText='取消'
                                                                title='确定删除吗？'
                                                                onConfirm={this._onRemove.bind(this, ele.courseId)}
                                                            >
                                                                <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                                                            </Popconfirm>
                                                            <Button value='live/mng' type="primary" size={'small'} className='m_2'
                                                                onClick={() => { this.setState({ showMngPannel: true, course_id: ele.courseId, course_name: ele.courseName }) }}
                                                            >直播管理</Button>
                                                            <Button value='live/start' size={'small'} className='m_2'
                                                                onClick={() => {

                                                                    let teacher_url = window.location.origin + '/#/room/' + ele.courseId + '/?wsname=' + ele.teacherName + '&admin=1&teacherid=' + ele.teacherId + '&coursename=' + ele.courseName + '&ctype=' + ele.ctype
                                                                    this.setState({
                                                                        teacher_url: teacher_url,
                                                                        teacherFileList: [],
                                                                        teacher_name: ele.teacherName
                                                                    })
                                                                    message.success({ content: '开始直播' })
                                                                    setTimeout(() => {
                                                                        this.getStream(ele.courseId)
                                                                    }, 500);
                                                                }}
                                                            >开始直播</Button>
                                                            {/* <Button type="primary" size={'small'} className='m_2'
                                                        onClick={()=>{
                                                            this.props.history.push('/todo-list/comment-list/3/'+ele.courseId)
                                                        }}
                                                    >用户评论</Button> */}

                                                            <Button value='live/exportuser' loading={this.state.exportLoading && ele.courseId == this.state.course_id} size={'small'} className='m_2' onClick={() => {
                                                                this._onExportUser(ele.courseId, ele.courseName)
                                                                this.setState({ course_id: ele.courseId })
                                                            }}>导出用户</Button>
                                                            {
                                                                this.state.activeTab !== 5 ?
                                                                    <Button type="primary" size={'small'} className='m_2' onClick={this.onSetting.bind(this, ele)}
                                                                    >抽奖设置</Button>
                                                                    : null
                                                            }
                                                            <Button type="primary" size={'small'} className='m_2' onClick={this.onHudong.bind(this, ele)}
                                                            >互动回答设置</Button>
                                                            <Button value='live/view' className='m_2' onClick={this.showCode.bind(this, ele.courseId)} type="" size={'small'}>
                                                                二维码预览
                                                            </Button>
                                                            {/* <Button value='live/view' size='small' className='m_2' onClick={() => { message.info({ content: '测试服不支持二维码预览' }) }}>
                                                                二维码预览
                                                            </Button> */}
                                                            <StatCourse courseId={ele.courseId} size='small' actions={this.props.actions}></StatCourse>
                                                            <Button loading={this.state.loads} size='small' onClick={this.onExports.bind(this, ele.courseId)}>直播观看数据导出</Button>
                                                            <Button loading={this.state.loads} size='small' onClick={this.onExportTime.bind(this, ele.courseId)}>在线人数时间分布数据导出</Button>
                                                            {/* <Button loading={this.state.loads} size='small' onClick={this.onExportReward.bind(this, ele.courseId)}>打赏数据导出</Button> */}
                                                            <Button loading={this.state.loads} size='small' onClick={this.onExportBan.bind(this, ele.courseId)}>禁言用户导出</Button>
                                                            {/* <Button loading={this.state.loads} size='small' onClick={this.onExportHudon.bind(this, ele.courseId)}>互动情况导出</Button> */}
                                                            <Button value='activity/result' onClick={this.onResult.bind(this._onExportUser, ele)} type="primary" size={'small'} className='m_2'>
                                                                查看回答结果
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </Table>
                                    :
                                    <Table responsive size="sm" className='animated fadeIn' key='table_'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>课程主图</th>
                                                <th>课程 ID</th>
                                                <th>课程编号</th>
                                                <th>课程名称</th>
                                                <th>分类</th>
                                                <th>直播时间</th>
                                                <th>结束时间</th>
                                                {/* <th>价格</th>*/}
                                                <th>主讲人</th>
                                                <th>PV</th>
                                                <th>UV</th>
                                                <th>预约人数</th>
                                                <th>评分</th>
                                                {/*
                                            <th>时长</th>
                                            <th>大小</th>
                                            */}
                                                <th>上架状态</th>
                                                <th>视频状态</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.course_live_list.map((ele, index) => (
                                                <tr key={index + '_b'}>
                                                    <td>
                                                        <Checkbox
                                                            data-id={ele.courseId}
                                                            onChange={this._onCheck.bind(this, index)}
                                                            checked={this.state.id_group[index].checked}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a>
                                                            <img onClick={this.showImgPanel.bind(this, ele.courseImg)} className="head-example-img" src={ele.courseImg} />
                                                        </a>
                                                    </td>
                                                    <td>{ele.courseId}</td>
                                                    <td>{ele.sn}</td>
                                                    <td style={{ maxWidth: '260px' }} className='pad_t20 pad_b20'>
                                                        <Tooltip title={ele.courseName}>
                                                            <div className='text_more'>{ele.courseName}</div>
                                                        </Tooltip>
                                                        <div className='be_ll_gray'>/pages/index/courseDesc?course_id={ele.courseId}</div>
                                                    </td>
                                                    <td><Tag>{ele.category_name || '无'}</Tag><Tag>{ele.ccategory_name || '无'}</Tag></td>
                                                    <td>{moment.unix(ele.beginTime).format('YYYY-MM-DD HH:mm')}</td>
                                                    <td>{moment.unix(ele.endTime).format('YYYY-MM-DD HH:mm')}</td>
                                                    {/*<td>{ele.integral}</td>*/}
                                                    <td>{ele.teacherName}</td>
                                                    <td>{ele.hit}</td>
                                                    <td>{ele.uhit}</td>
                                                    <td>{ele.bookNum}</td>
                                                    <td>{ele.score}</td>
                                                    {/*
                                            <td>{ele.duration+'秒'}</td>
                                            <td>{ele.size+'MB'}</td>
                                            */}
                                                    <td>{ele.status == 1 ? "已上架" : "已下架"}</td>

                                                    <td>
                                                        {
                                                            ele.liveStatus >= 1 && ele.videoList.length !== 0 ?
                                                                <Button value='live/down' onClick={this.showDownPannel.bind(this, ele.videoList)} size={'small'} className='m_2' type='primary'>
                                                                    下载
                                                                </Button> : ''
                                                        }
                                                        {
                                                            ele.liveStatus == 2 && (ele.endTime < Date.parse(new Date()) / 1000) ?
                                                                <Button value='live/chapter' size={'small'} className='m_2' onClick={() => {
                                                                    this.props.history.push({
                                                                        pathname: '/live/chapter/' + ele.courseId
                                                                    })
                                                                }}>上传</Button>
                                                                : ''}

                                                    </td>
                                                    <td>
                                                        <div>
                                                            {/*
                                                    <Button className='m_2' type="" size={'small'}
                                                        onClick={()=>{ 
                                                            this.props.history.push({
                                                                pathname:'/live/chapter/'+ele.courseId
                                                            })
                                                        }}
                                                    >
                                                        章节设置
                                                    </Button>
                                                    */}
                                                            <Button value='live/edit' onClick={this._onStatus.bind(this, ele.courseId)} className="m_2" type="primary" ghost={ele.status ? true : false} size={'small'}>{ele.status == 1 ? "下架" : "上架"}</Button>
                                                            {/* <Button onClick={this._onTop.bind(this,ele.courseId)} className="m_2" type="primary" ghost={ele.isTop?true:false} size={'small'}>{ele.isTop==1?'已置顶':'未置顶'}</Button> */}
                                                            <Button value='live/view' onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: '/live/add/' + ele.courseId,
                                                                    state: { type: "view_roll" }
                                                                })
                                                            }} type="primary" size={'small'} className='m_2'>查看</Button>
                                                            <Button value='live/edit' onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: '/live/add/' + ele.courseId,
                                                                    state: { type: "edit_roll" }
                                                                })
                                                            }} type="primary" size={'small'} className='m_2'>修改</Button>
                                                            <Popconfirm
                                                                value='live/del'
                                                                okText="确定"
                                                                cancelText='取消'
                                                                title='确定删除吗？'
                                                                onConfirm={this._onRemove.bind(this, ele.courseId)}
                                                            >
                                                                <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                                                            </Popconfirm>

                                                            <Button value='live/comment' type="primary" size={'small'} className='m_2'
                                                                onClick={() => {
                                                                    this.props.history.push('/todo-list/comment-list/3/' + ele.courseId)
                                                                }}
                                                            >用户评论</Button>
                                                            <Button value='live/exportuser' loading={this.state.exportLoading && ele.courseId == this.state.course_id} size={'small'} className='m_2' onClick={() => {
                                                                this._onExportUser(ele.courseId, ele.courseName)
                                                                this.setState({ course_id: ele.courseId })
                                                            }}>导出用户</Button>

                                                            <Button value='live/view' className='m_2' onClick={this.showCode.bind(this, ele.courseId, 'roll')} type="" size={'small'}>
                                                                二维码预览
                                                            </Button>
                                                            {/* <Button value='live/view' size='small' className='m_2' onClick={() => { message.info({ content: '测试服不支持二维码预览' }) }}>
                                                                二维码预览
                                                            </Button> */}
                                                            <StatCourse value='live/view' courseId={ele.courseId} actions={this.props.actions}></StatCourse>
                                                            <Button loading={this.state.loads} size='small' onClick={this.onExports.bind(this, ele.courseId)}>直播观看数据导出</Button>
                                                            <Button loading={this.state.loads} size='small' onClick={this.onExportTime.bind(this, ele.courseId)}>在线人数时间分布数据导出</Button>
                                                            <Button loading={this.state.loads} size='small' onClick={this.onExportReward.bind(this, ele.courseId)}>打赏数据导出</Button>
                                                            <Button loading={this.state.loads} size='small' onClick={this.onExportBan.bind(this, ele.courseId)}>禁言用户导出</Button>
                                                            {/* <Button loading={this.state.loads} size='small' onClick={this.onExportHudon.bind(this, ele.courseId)}>互动情况导出</Button> */}
                                                            <Button value='activity/result' onClick={this.onResult.bind(this._onExportUser, ele)} type="primary" size={'small'} className='m_2'>
                                                                查看回答结果
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </Table>
                                }
                            </div>

                            <Pagination showTotal={() => ('总共' + this.page_total + '条')} showQuickJumper pageSize={this.page_size} current={this.page_current} onChange={this._onPage} total={this.page_total} />

                        </Card>
                    </Col>
                </Row>

                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>

                <Modal zIndex={99} visible={this.state.showDownPannel} maskClosable={true} footer={null} onCancel={() => this.setState({ showDownPannel: false })}>
                    <div style={{ padding: '40px' }}>
                        <List
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                        >
                            {this.state.videoList.map((ele, index) => (
                                <List.Item
                                    actions={[<a key="list-loadmore-edit" href={ele.link} target='_black'>下载</a>]}
                                >

                                    <List.Item.Meta
                                        avatar={
                                            <Avatar size="small">{index + 1}</Avatar>
                                        }
                                        description={ele.link}
                                    />
                                </List.Item>
                            ))}
                        </List>
                    </div>
                </Modal>
                <Modal
                    zIndex={90}
                    title="导出"
                    visible={this.state.showExport}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showExport: false })
                    }}
                    onOk={this._onExportUser}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='选择开始时间'>
                            <DatePicker format='YYYY-MM-DD' onChange={(date, dateString) => {
                                this.setState({ export_time: dateString })
                            }}></DatePicker>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="直播管理"
                    visible={this.state.showMngPannel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showMngPannel: false })
                    }}
                    onOk={() => {
                        let avatar = ''
                        if (this.avatar) {
                            avatar = this.avatar.getValue()
                        }
                        avatar = avatar.replace(/\//g, '_')
                        let { live_name, course_id, course_name } = this.state
                        let admin = 1

                        if (live_name == '直播小助手')
                            admin = 0
                        let pathname = encodeURI(`/liveroom/${course_id}/?wsname=${live_name}&admin=${admin}&avatar=${avatar}&teacherid=&coursename=${course_name}`)
                        this.props.history.push({
                            pathname: pathname,
                            state: { type: "edit" }
                        })
                    }}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='选择身份'>
                            <Select value={this.state.live_name} onChange={val => {
                                this.setState({ live_name: val })
                            }}>
                                <Select.Option value={'直播小助手'}>直播小助手</Select.Option>
                                <Select.Option value={'系统管理员'}>系统管理员</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='选择头像'>
                            <AntdOssUpload
                                actions={this.props.actions}
                                accept='image/*'
                                ref={ref => this.avatar = ref}
                                listType="picture-card"
                                value={this.state.fileList}
                            >
                            </AntdOssUpload>
                            <span style={{ marginTop: '-30px', display: 'block' }}>* 不设置头像将使用默认头像</span>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="开始直播"
                    visible={this.state.showBeginPanel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showBeginPanel: false })
                    }}
                    onOk={null}
                    bodyStyle={{ padding: "10px 25px" }}
                    footer={
                        <div>
                            {this.state.teacher_name == '' ?
                                <span>
                                    <Button className='m_2' onClick={() => { message.info('老师的直播昵称不能为空') }}>
                                        直接打开
                                    </Button>
                                    <Button className='m_2' onClick={() => { message.info('老师的直播昵称不能为空') }}>
                                        复制直播链接
                                    </Button>
                                </span>
                                :
                                <span>
                                    <Button className='m_2'>
                                        <a href={encodeURI(this.state.teacher_url)} target='_black'>直接打开</a>
                                    </Button>
                                    <Clipboard text={encodeURI(this.state.teacher_url)} onCopy={() => {
                                        message.success('复制成功，请在浏览器中打开')
                                    }}>
                                        <Button className='m_2'>复制直播链接</Button>
                                    </Clipboard>
                                </span>
                            }
                            <Clipboard text={this.state.stream_url} onCopy={() => {
                                message.success('复制成功')
                            }}>
                                <Button type='primary'>复制推流链接</Button>
                            </Clipboard>
                        </div>
                    }
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='推流链接'>
                            <Input.TextArea
                                autoSize={{ minRows: 1 }}
                                placeholder=''
                                value={this.state.stream_url}
                            />
                            <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                                * 推流链接发给主播后，请放到OBS的推流设置中，再开始推流<br />
                                * 推流链接5小时内有效，失效后请点击开始直播按钮重新获取
                            </div>
                        </Form.Item>
                        <Form.Item label='老师直播链接'>
                            <Input.TextArea
                                autoSize={{ minRows: 1 }}
                                value={this.state.teacher_url}
                            />
                            <div style={{ fontSize: '12px' }}>* 直播链接发给主播后，在浏览器中打开</div>
                        </Form.Item>
                        <Form.Item label='老师直播昵称'>
                            <Input
                                onChange={e => {
                                    const value = e.target.value
                                    this.setState((pre) => {
                                        let { teacher_url, teacher_name } = pre

                                        teacher_url = teacher_url.replace('wsname=' + teacher_name, 'wsname=' + value)
                                        return { teacher_name: value, teacher_url: teacher_url }
                                    })

                                }}
                                value={this.state.teacher_name}
                            >
                            </Input>
                        </Form.Item>
                        <Form.Item label='老师直播头像'>
                            <AntdOssUpload
                                actions={this.props.actions}
                                listType="picture-card"
                                value={this.state.teacherFileList}
                                ref={ref => this.t_avatar = ref}
                                onChange={this.onTeacherImgChange}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                            <span style={{ marginTop: '-30px', display: 'block' }}>* 不设置头像将使用默认头像</span>
                            <div style={{ fontSize: '12px', lineHeight: '1.5', marginTop: '15px', color: 'red' }}>
                                * 直播已开始，如需关闭直播，请前往直播间点击结束直播
                            </div>
                        </Form.Item>
                        {/*
                        <Form.Item label='设置老师为房管'>
                            <Switch defaultChecked onChange={(val)=>{
                                    let {teacher_url} = this.state
                                    if(val)
                                        teacher_url = teacher_url.replace('admin=0','admin=1')
                                    else
                                        teacher_url = teacher_url.replace('admin=1','admin=0')
                                    this.setState({ teacher_url })
                            }}
                            ></Switch>
                        </Form.Item>
                        */}
                    </Form>
                </Modal>
                <Modal
                    title="预览(https方式访问)"
                    visible={this.state.showCode}
                    maskClosable={true}
                    onCancel={() => { this.setState({ showCode: false }) }}
                    okText="确定"
                    cancelText="取消"
                    footer={null}
                >
                    {this.state.qrcode ?
                        <div>
                            <img className="block_center" alt="" style={{ width: '40%' }} src={this.state.qrcode} />
                            <div className="text_center">微信扫码预览</div>
                        </div>
                        : <div>正在加载中。。。</div>}
                </Modal>
                <Modal
                    zIndex={90}
                    title="抽奖设置"
                    visible={this.state.showsetting}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({
                            showsetting: false,
                            activity_id: 0,
                            activity_num: 0,
                            activity_title: '',
                            activity_content: '',
                            begin_time: '',
                            BeginTime: null,
                        })
                    }}
                    onOk={() => {
                        this.setState({ showsetting: false })
                    }}

                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='抽奖名称'>
                            <Input value={this.state.activity_title} onChange={(e) => { this.setState({ activity_title: e.target.value }) }} />
                        </Form.Item>
                        <Form.Item label='中奖数量'>
                            <InputNumber value={this.state.activity_num} onChange={(e) => { this.setState({ activity_num: e }) }} />
                        </Form.Item>
                        <Form.Item label='备注'>
                            <Input value={this.state.activity_content} onChange={(e) => { this.setState({ activity_content: e.target.value }) }} />
                        </Form.Item>
                        <Form.Item label="立即推送">
                            <Switch checked={this.state.send_now == 1 ? true : false} onChange={e => {
                                if (e) {
                                    this.setState({ send_now: 1 })
                                } else {
                                    this.setState({ send_now: 0 })
                                }
                            }} />
                        </Form.Item>
                        {
                            !this.state.send_now ?
                                <Form.Item label='开始时间'>
                                    <DatePicker
                                        key='t_6'
                                        // disabled={view_mode || this.course_info.liveStatus > 0}
                                        disabledDate={this.disabledDate}
                                        format={'YYYY-MM-DD HH:mm'}
                                        placeholder="选择开始时间"
                                        onChange={(val, dateString) => {
                                            this.setState({
                                                begin_time: dateString,
                                                BeginTime: val
                                            })
                                        }}
                                        value={this.state.BeginTime}
                                        locale={locale}
                                        showTime={{ format: 'HH:mm' }}
                                        allowClear={false}
                                    />
                                    <div style={{ fontSize: '12px', color: 'red', lineHeight: '20px' }}>注：在已有抽奖列表里的抽奖进行时间的8分钟内，不得在该时间内添加抽奖（抽奖时间3分钟，开奖时间5分钟）</div>
                                </Form.Item>
                                : null
                        }

                        <div style={{ marginLeft: '300px', marginBottom: '40px' }}>
                            {
                                this.state.activity_id == 0 ?
                                    <Button onClick={this.onOkeys}>创建</Button>
                                    :
                                    <Button onClick={this.onOkeys}>修改</Button>
                            }
                        </div>

                        {/* <Form.Item label='历史抽奖记录'> */}
                        <Card extra={
                            <>
                                <Button loading={this.state.loads} onClick={this.onRewardExport}>导出中奖名单</Button>
                            </>
                        }>
                            <Table responsive size="sm" className='animated fadeIn' key='_table'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>抽奖名称</th>
                                        <th>中奖数</th>
                                        <th>备注</th>
                                        <th>开始时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.reward_lists.map((ele, index) => (
                                        <tr key={index + '_b'}>
                                            <td>
                                                {ele.activityId}
                                            </td>
                                            <td>
                                                {ele.title}
                                            </td>
                                            <td>{ele.num}</td>
                                            <td>{ele.content}</td>
                                            <td> {moment.unix(ele.beginTime).format('YYYY-MM-DD HH:mm')}</td>
                                            <td>
                                                <Button onClick={this.showList.bind(this, ele)}>查看获奖名单</Button>
                                                <Button onClick={this.onEdits.bind(this, ele)}>编辑</Button>
                                                <Button onClick={this.onDeleteAct.bind(this, ele)}>删除</Button>
                                                {/* <Button>推送</Button> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>

                        {/* </Form.Item> */}

                    </Form>
                </Modal>
                <Modal
                    zIndex={100}
                    title="获奖名单"
                    visible={this.state.showlist}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showlist: false })
                    }}
                    onOk={() => {
                        this.setState({ showlist: false })
                    }}

                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Table responsive size="sm" className='animated fadeIn' key='_table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>用户id</th>
                                    <th>昵称</th>
                                    <th>姓名</th>
                                    <th>手机号</th>
                                    <th>中奖时间</th>
                                    <th>地址</th>
                                    <th>奖品名</th>
                                    {/* <th>数量</th> */}
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.actlist.map((ele, index) => (
                                    <tr key={index + '_b'}>
                                        <td>
                                            {ele.rewardId}
                                        </td>
                                        <td>
                                            {ele.userId}
                                        </td>
                                        <td>
                                            {ele.nickname}
                                        </td>
                                        <td>{ele.realname}</td>
                                        <td>{ele.mobile}</td>
                                        <td>{ele.winningTime}</td>
                                        <td>{ele.address}</td>
                                        <td>{ele.itemName}</td>
                                        {/* <td>{ele.itemIndex}</td> */}
                                        <td>
                                            {
                                                ele.shipSn ?
                                                    <div>{ele.shipSn}</div>
                                                    :
                                                    <Button onClick={() => {
                                                        this.setState({
                                                            rid: ele.rewardId,
                                                            showsettings: true
                                                        })
                                                    }}>填写运单号</Button>
                                            }

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Form>
                </Modal>
                <Modal
                    zIndex={110}
                    title="运单设置"
                    visible={this.state.showsettings}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsettings: false })
                    }}
                    onOk={this.onTrues}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='单号'>
                            <Input value={this.state.sn} onChange={(e) => { this.setState({ sn: e.target.value }) }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="互动设置"
                    visible={this.state.showHudong}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showHudong: false })
                    }}
                    onOk={this.onHudonOk}

                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='开始时间'>
                            <DatePicker
                                key='t_6'
                                // disabled={view_mode || this.course_info.liveStatus > 0}
                                disabledDate={this.disabledDate}
                                format={'YYYY-MM-DD HH:mm'}
                                placeholder="选择开始时间"
                                onChange={(val, dateString) => {
                                    this.setState({
                                        create_time: dateString,
                                        createTime: val
                                    })
                                }}
                                value={this.state.createTime}
                                locale={locale}
                                showTime={{ format: 'HH:mm' }}
                                allowClear={false}
                            />
                        </Form.Item>
                        <Form.Item label='添加问题'>
                            <Quetionna dataSource={this.state.topicList} ref={(val) => { this.quetionna = val }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <style>
                    {`
                    .ant-list-item-action{ margin-left:0 }
                `}
                </style>
            </div>
        )
    }

}
function getPv(pv,uv) {
    let val = pv
    if (pv <= 0){
        val = 0
    }else if(Math.floor(pv / 3) + 8<uv){
        val = pv
    }else {
        val = Math.floor(pv / 3) + 8
    }
    return val
}
const LayoutComponent = LiveManager;
const mapStateToProps = state => {
    return {
        category_list: state.course.category_list,
        course_live_list: state.course.course_live_list,
        user: state.site.user,
        course_qrcode_info: state.course.course_qrcode_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
