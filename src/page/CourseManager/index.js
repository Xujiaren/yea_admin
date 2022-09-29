import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Tooltip, Tag, Spin, Empty, Form, Modal, Checkbox, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, Select, Switch } from 'antd';
import { Link, NavLink } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import connectComponent from '../../util/connect';
import config from '../../config/config';
import _ from 'lodash'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';
import CourseTime from '../../components/CourseTime'
import StatCourse from '../../components/StatCourse'
import { Button, Popconfirm } from '../../components/BtnComponent'


const { RangePicker } = DatePicker;
const { Search, TextArea } = Input;
const InputGroup = Input.Group;

const flag_arg = {
    '1': '直销员',
    '2': '新用户',
    '3': '服务中心员工',
    '4': '服务中心负责人',
    '5': '优惠顾客',
    '6': '初级经理',
    '7': '中级经理',
    '8': '客户总监',
    '9': '高级客户总监',
    'GG': '资深客户总监及以上',

    'I': '自定义',
}
class CourseManager extends Component {
    state = {

        edit: true,
        view: true,
        showRePanel: false,
        visible: false,
        showCode: false,
        showImgPanel: false,
        previewImage: '',


        selectData: [],
        selectValue: [],
        fetching: false,
        channel_keyword: '',
        exportLoading: false,
        isAll: false,
        selected_g: [],
        id_group: [],

        channel_ids: '',

        courseId: '',

        keyword: '',
        ctype: '0',

        qrcode: '',
        ccategory_list: [],
        category_list: [],
        ccategoryId: '',
        category_id: '',
        settingStatus: false,
        open: 0,
        content: '',
        showImages:false,
        fileList:[],
    };
    channel_id_g = []
    course_id = ''
    id_group = []
    course_list = []
    flag_list = []
    page_total = 0
    page_current = 0
    page_size = 10

    category_list = []

    lastFetchId = 0;

    componentWillMount() {

        const { actions } = this.props

        const { search } = this.props.history.location

        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }

        this.getCourse()
        this.getCategory()
        this.fetchChannel()
        this.getStatus()
        this.getImages()
    }
    getImages=()=>{
        this.props.actions.getApplySetting({
            keyy: 'agent_img',
            section: 'course',
            resolved: (data) => {

                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        let fileList = []
                        fileList.push({ response: { resultBody: val }, type: 'image/png', uid: 1, name: 'img' + 1, status: 'done', url: val})
                        this.setState({ fileList:fileList })
                    }
                }
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    postImg=()=>{
        let course_img = (this.img && this.img.getValue()) || ''
        this.props.actions.publishNum({
            keyy: 'agent_img',
            section: 'course',
            val: course_img,
            resolved: (data) => {
                message.success('提交成功')
                this.setState({ showImages: false }, () => {
                    this.getImages()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    getStatus = () => {
        this.props.actions.getApplySetting({
            keyy: 'agent_status',
            section: 'course',
            resolved: (data) => {

                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        this.setState({ open: Number(val) })
                    }
                }
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.getApplySetting({
            keyy: 'agent_text',
            section: 'course',
            resolved: (data) => {

                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        this.setState({ content: val })
                    }
                }
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    postStatus = () => {
        const { open, content } = this.state
        this.props.actions.publishNum({
            keyy: 'agent_status',
            section: 'course',
            val: open.toString(),
            resolved: (data) => {

            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.publishNum({
            keyy: 'agent_text',
            section: 'course',
            val: content,
            resolved: (data) => {
                message.success('提交成功')
                this.setState({ settingStatus: false }, () => {
                    this.getStatus()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    getCourse = () => {
        const { ccategoryId, keyword, category_id, ctype } = this.state
        this.props.actions.getCourse({
            ccategoryId,
            keyword,
            page: this.page_current,
            pageSize: this.page_size,
            category_id,
            ctype
        })
    }
    getCategory = () => {
        this.props.actions.getSubCategory({
            keyword: '',
            page: 0,
            pageSize: 10000,
            cctype: '-1',
            ctype: '3',
            parent_id: '',
            resolved: (res) => {
                const { data } = res
                if (typeof data !== 'undefined' && Array.isArray(data)) {
                    let data_lists = data.filter(item => item.parentId == 0)
                    this.setState({
                        category_list: data_lists
                    })
                }
            },
            rejected: (err) => {
                message.error(JSON.stringify(err))
            }
        })
    }
    getSubCategory = () => {
        const { category_id } = this.state
        if (category_id) {
            this.props.actions.getSubCategory({
                keyword: '',
                page: 0,
                pageSize: 10000,
                cctype: '-1',
                ctype: '3',
                parent_id: category_id,
                resolved: (res) => {
                    const { data } = res
                    if (typeof data !== 'undefined' && Array.isArray(data)) {
                        this.setState({
                            ccategory_list: data
                        })
                    }
                },
                rejected: (err) => {
                    message.error(JSON.stringify(err))
                }
            })
        }
    }
    componentWillReceiveProps(n_props) {
        if (n_props.course_list !== this.props.course_list) {
            this.id_group = []
            this.course_list = n_props.course_list.data;
            this.page_total = n_props.course_list.total
            this.page_current = n_props.course_list.page
            if (n_props.course_list.data.length == 0) {
                message.info('暂时没有数据')
            }
            this.flag_list = []
            let _id_tmp = []
            this.course_list.map((ele, index) => {

                let tmp = []

                if (ele.flag) {
                    tmp = ele.flag.split('/')
                    tmp.pop()
                    tmp.shift()
                }
                _id_tmp.push({ id: ele.courseId, checked: false })
                this.flag_list.push(tmp)
            })
            this.setState({
                id_group: _id_tmp
            })
        }
        if (n_props.course_qrcode_info !== this.props.course_qrcode_info) {

            this.setState({
                qrcode: n_props.course_qrcode_info.data
            })

        }
        this.setState({
            isAll: false,
            selectValue: [],
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
    showRePanelAll = () => {
        if (this.state.selected_g.length == 0) {
            message.info('请选择课程')
            return
        }
        this.setState({ showRePanel: true, channel_keyword: '' }, () => {
            this.fetchChannel()
        })
    }
    showRePanel(id) {
        this.course_id = id
        this.setState({ showRePanel: true, channel_keyword: '' }, () => {
            this.fetchChannel()
        })
    }
    hideRePanel = () => {
        this.course_id = ''
        this.setState({
            courseId: '',
            channel_ids: '',
            selectValue: [],
            //selected_g:[],
            //isAll:false,
            showRePanel: false
        })
    }
    genFlag(flag) {

        let tmp = flag.map((_ele, _index) => (
            <Tag key={_index + '_tag'}>{_ele&&_ele.tagName?_ele.tagName:''}</Tag>
        ))
        return tmp

    }
    showCode(course_id) {
        this.setState({
            showCode: true,
            qrcode: ''
        })
        const { actions } = this.props
        actions.getCoursePreviewQrcode({
            course_id, ctype: 0
        })

    }
    hideCode = () => {
        this.setState({
            showCode: false
        })
    }
    _onFetchChannel = (val) => {
        this.setState({ channel_keyword: val }, () => {
            this.fetchChannel()
        })
    }
    fetchChannel = () => {
        const { channel_keyword } = this.state

        fetch(config.api + '/course/channel/?keyword=' + channel_keyword + '&page=0&pageSize=100',
            {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
            }).then(response => response.json())
            .then(body => {
                const { errorMsg } = body
                if (!errorMsg) {
                    let selectData = []

                    body.resultBody.data.map(ele => {

                        if (ele.ctype == '0') {
                            this.channel_id_g.push(ele.channelId)
                            selectData.push(
                                {
                                    text: `${ele.channelName}`,
                                    value: ele.channelId,
                                    ctype: ele.ctype
                                }
                            )
                        }

                    });
                    this.setState({ selectData, fetching: false });
                }
            });
    };



    _onFilter = () => {
        this.page_current = 0
        this.getCourse()
    }
    _onSearch = (val) => {
        this.page_current = 0
        this.getCourse()
    }
    _onDownCourse = () => {

        const { keyword, category_id, selected_g } = this.state
        if (selected_g.length == 0) {
            message.error('请先选择课程')
            return;
        }
        const { actions } = this.props
        actions.downCourse({
            course_ids: selected_g.join(','),
            resolved: (data) => {
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }

    _onUpCourse = () => {

        const { keyword, category_id, selected_g } = this.state
        if (selected_g.length == 0) {
            message.info('请先选择课程')
            return;
        }
        const { actions } = this.props
        actions.upCourse({
            course_ids: selected_g.join(','),
            resolved: (data) => {
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }

    _onRecomm = () => {
        console.log(this.state.channel_ids)
        let channel_ids = this.state.channel_ids;
        let course_ids = this.course_id;
        this.Recomm(channel_ids, course_ids)
    }
    _onRecomm_s = () => {
        console.log(this.state.selected_g)
        let channel_ids = this.state.channel_ids;
        let course_ids = this.state.selected_g;
        course_ids = course_ids.join(',')
        this.Recomm(channel_ids, course_ids)
    }
    Recomm(channel_ids, course_ids) {
        const { actions } = this.props
        const { keyword, category_id } = this.state

        if (channel_ids == '') {
            message.info('请选择专栏')
            return
        }
        actions.recommCourse({
            course_ids,
            channel_ids,
            type: 0,
            resolved: (data) => {
                this.hideRePanel()
                this.course_id = ''
                this.setState({
                    selectValue: [],
                    channel_ids: '',
                    isAll: false
                })
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }

    _onDisRecomm(course_ids) {
        console.log(course_ids)
        //let channel_ids = this.state.channel_ids;
        this.DisRecomm('', course_ids)
    }
    _onDisRecomm_s = () => {
        let course_ids = this.state.selected_g;

        if (course_ids.length == 0) {
            message.info('请先选择课程'); return;
        }
        course_ids = course_ids.join(',')
        this.DisRecomm('', course_ids)
    }
    DisRecomm(channel_ids, course_ids) {
        const { actions } = this.props
        actions.recommCourse({
            course_ids,
            channel_ids,
            type: 1,
            resolved: (data) => {
                this.hideRePanel()
                this.course_id = ''
                this.setState({
                    selectValue: [],
                    channel_ids: '',
                    isAll: false
                })
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onNew(courseId) {
        const { actions } = this.props
        const { keyword, category_id } = this.state
        actions.updateCourse({
            action: 'is_new',
            course_id: courseId,
            resolved: (data) => {
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                //console.log(data)
                message.error(data)
            }
        })
    }
    _onStatus(courseId) {
        const { actions } = this.props
        const { keyword, category_id } = this.state
        actions.updateCourse({
            action: 'status',
            course_id: courseId,
            resolved: (data) => {
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                //console.log(data)
                message.error(data)
            }
        })
    }
    _onRemove(courseId) {
        const { actions } = this.props
        actions.removeCourse({
            course_id: courseId,
            resolved: (data) => {
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                //console.log(data)
                message.error(data)
            }
        })
    }
    _onPage = (val) => {
        let pathname = this.props.history.location.pathname
        this.props.history.replace(pathname + '?page=' + val)
        this.page_current = val - 1
        this.getCourse()
    }
    onSelectChannel = value => {
        let _tmp = []
        value.map(ele => {
            _tmp.push(ele.key)
        })
        this.setState({
            selectValue: value,
            fetching: false,
            channel_ids: _tmp.join(','),
        });
    };
    popCancel = (msg) => {
        message.error();
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    showImgPanel(url) {
        this.setState({
            showImgPanel: true,
            previewImage: url
        });
    }
    hideImgPanel = () => {
        this.setState({
            showImgPanel: false
        });
    }
    onOuts = (val) => {
        this.setState({
            exportLoading: true
        })
        this.props.actions.postWenjuan({
            course_id: val.courseId,
            resolved: (data) => {
                console.log(data)
                const url = data.address
                this.setState({
                    exportLoading: false
                })
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (err) => {
                this.setState({
                    exportLoading: false
                })
            }
        })
    }
    onOutss = (val) => {
        this.setState({
            exportLoading: true
        })
        this.props.actions.getCoursePaperEnds({
            course_id: val.courseId,
            resolved: (data) => {
                console.log(data)
                const url = data.address
                this.setState({
                    exportLoading: false
                })
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (err) => {
                this.setState({
                    exportLoading: false
                })
            }
        })
    }
    onOutsss = (val) => {
        this.setState({
            exportLoading: true
        })
        this.props.actions.getCourseWatchUser({
            courseId: val.courseId,
            resolved: (data) => {
                console.log(data)
                const url = data.adress
                this.setState({
                    exportLoading: false
                })
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (err) => {
                this.setState({
                    exportLoading: false
                })
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
        const { isAll, selectData, fetching } = this.state
        let time = new Date().getTime()
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader className="flex j_space_between align_items">
                                <div className="flex row align_items f_grow_1 ml_5">
                                    <span style={{ flexShrink: 0 }}>&nbsp;&nbsp;搜索&nbsp;&nbsp;</span>
                                    {/*
                                <RangePicker style={{ maxWidth: 200 }} locale={locale}/>
                            */}
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        onChange={e => {
                                            this.setState({
                                                keyword: e.target.value
                                            })
                                        }}
                                    />&nbsp;
                                    <Input.Group compact>
                                        <Input disabled={true} style={{ width: '80px' }} defaultValue="课程分类" />
                                        <Select defaultValue='' onChange={val => {
                                            this.setState({ ccategoryId: '', ccategory_list: [], category_id: val }, () => { this.getSubCategory() })
                                        }} style={{ minWidth: '200px' }}>
                                            <Select.Option value=''>全部</Select.Option>
                                            {this.state.category_list.map((ele, index) => (
                                                <Select.Option key={index + 'cate'} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                            ))}
                                        </Select>
                                    </Input.Group>&nbsp;
                                    <Input.Group compact>
                                        <Input disabled={true} style={{ width: '80px' }} defaultValue="二级分类" />
                                        <Select value={this.state.ccategoryId} onChange={val => { this.setState({ ccategoryId: val }) }} style={{ minWidth: '120px' }}>
                                            <Select.Option value=''>全部</Select.Option>
                                            {this.state.ccategory_list.map((ele, index) => (
                                                <Select.Option key={index + 'cate'} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                            ))}
                                        </Select>
                                    </Input.Group>&nbsp;
                                    <Button onClick={this._onFilter}>筛选</Button>
                                </div>
                                <div className="flex f_row f_nowrap align_items">
                                    <Button style={{ marginRight: '10px' }} onClick={()=>{
                                        this.setState({
                                            showImages:true
                                        })
                                    }}>推课赚钱分享页图片</Button>
                                    <Button style={{ marginRight: '10px' }} onClick={() => {
                                        this.setState({
                                            settingStatus: true
                                        })
                                    }}>分销启用设置</Button>
                                    <Button value='courseV/add' onClick={() => {
                                        this.props.history.push('/course-manager/edit-course/0')
                                    }}>创建视频课</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="pad_b10">
                                    <Button onClick={this._onCheckAll} size={'small'}>{this.state.isAll ? '取消全选' : '全选'}</Button>&nbsp;
                                    <Button value='courseV/edit' onClick={this.showRePanelAll} size={'small'}>批量推荐</Button>&nbsp;
                                    <Popconfirm
                                        value='courseV/edit'
                                        title="确定批量取消推荐吗？"
                                        onConfirm={this._onDisRecomm_s}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <Button size={'small'} className="">
                                            批量取消推荐
                                        </Button>
                                    </Popconfirm>&nbsp;
                                    <Button value='courseV/edit' onClick={this._onUpCourse} type="" size={'small'} className="">批量上架</Button>&nbsp;
                                    <Button value='courseV/edit' onClick={this._onDownCourse} type="danger" ghost size={'small'} className="">批量下架</Button>&nbsp;
                                    <CourseTime value='courseV/edit' actions={this.props.actions} courseIds={this.state.selected_g} />
                                </div>
                                <Table responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>课程主图</th>
                                            <th>课程编号</th>
                                            <th>课程ID</th>

                                            <th>课程名称</th>
                                            <th>课程分类</th>
                                            <th>已推荐专栏</th>
                                            <th>课程摘要</th>
                                            <th>销售价格</th>
                                            <th>标签</th>
                                            <th>开放对象</th>
                                            <th>主讲人</th>
                                            <th>评分</th>
                                            <th>排序</th>
                                            <th>创建时间</th>
                                            <th>上架时间</th>
                                            <th>状态</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.course_list.map((ele, index) =>
                                            // const on = ids.indexOf(ele.id)
                                            <tr key={index + 'd_course'}>
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

                                                <td>{ele.sn}</td>
                                                <td>{ele.courseId}</td>
                                                <td style={{ maxWidth: '260px' }} className='pad_t20 pad_b20'>
                                                    <Tooltip title={ele.courseName}>
                                                        <div className='text_more'>{ele.courseName}</div>
                                                    </Tooltip>
                                                    <div className='be_ll_gray'>/pages/index/courseDesc?course_id={ele.courseId}</div>
                                                </td>
                                                <td><Tag>{ele.category_name || '无'}</Tag><Tag>{ele.ccategory_name || '无'}</Tag></td>
                                                <td>
                                                    {ele.channelList ? ele.channelList.map((_ele, _index) => (
                                                        <Tag key={_index + 'cha'} className='m_2'>{_ele.channelName}</Tag>
                                                    )) :
                                                        <Tag>无</Tag>
                                                    }
                                                </td>
                                                <td>
                                                    <div className="video_content" style={{ maxWidth: '200px' }}>
                                                        <Tooltip title={ele.summary}>{ele.summary}</Tooltip>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ width: '80px' }}>
                                                        {ele.integral}
                                                    </div>
                                                </td>
                                                <td>
                                                    {ele.tagList ? ele.tagList.map((_ele, _index) => (
                                                        <Tag key={_index + '_tag'} className='m_2'>{_ele&&_ele.tagName?_ele.tagName:''}</Tag>
                                                    )) : <Tag>空</Tag>}
                                                </td>
                                                <td>
                                                    {ele.flag ? this.flag_list[index].map((_ele, _index) => {
                                                        if (_ele !== '')
                                                            return <Tag key={_index + '_flag'} className='m_2'>{flag_arg[_ele]}</Tag>
                                                    }) : <Tag>全部</Tag>}
                                                </td>
                                                <td>{ele.teacherName}</td>
                                                <td>{ele.score}</td>
                                                <td>{ele.sortOrder}</td>
                                                <td>{moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')}</td>
                                                {
                                                    ele.shelvesTime > 0 ?
                                                        <td>{moment.unix(ele.shelvesTime).format('YYYY-MM-DD HH:mm')}</td>
                                                        :
                                                        <td>未获取上架时间</td>
                                                }

                                                <td>{ele.status == 1&&time>=ele.shelvesTime*1000 ? "已上架" : "已下架"}</td>
                                                <td>
                                                    <div>

                                                        <Button value='courseV/edit' onClick={this._onStatus.bind(this, ele.courseId)} className="m_2" type="primary" ghost={ele.status&&time>=ele.shelvesTime*1000 ? true : false} size={'small'}>{ele.status == 1&&time>=ele.shelvesTime*1000 ? "下架" : "上架"}</Button>

                                                        <Button
                                                            value='courseV/edit'
                                                            onClick={
                                                                ele.channelList && ele.channelList.length > 0 ?
                                                                    this._onDisRecomm.bind(this, ele.courseId)
                                                                    :
                                                                    this.showRePanel.bind(this, ele.courseId)
                                                            }
                                                            className='m_2' type="primary"
                                                            ghost={ele.channelList ? false : true}
                                                            size={'small'}
                                                        >
                                                            {ele.channelList && ele.channelList.length > 0 ? "取消推荐" : "推荐"}
                                                        </Button>
                                                        <Button value='courseV/view' onClick={() => {
                                                            this.props.history.push('/course-manager/view-course/' + ele.courseId)
                                                        }} className='m_2' type="" size={'small'}>查看</Button>
                                                        <Button value='courseV/edit' onClick={() => {
                                                            this.props.history.push('/course-manager/edit-course/' + ele.courseId)
                                                        }} className='m_2' type="" size={'small'}>修改</Button>

                                                        <Button value='courseV/chapter' className='m_2' type="" size={'small'} onClick={() => {
                                                            this.props.history.push('/course-manager/chapter-setting/' + ele.courseId)
                                                        }}>章节设置</Button>
                                                        <Button value='courseV/usercom' className='m_2' type="" size={'small'} onClick={() => {
                                                            this.props.history.push('/todo-list/comment-list/3/' + ele.courseId)
                                                        }}>用户评论</Button>
                                                        {
                                                            ele.stype == 4 ?
                                                                <Button className='m_2' type="" size={'small'} type="primary" loading={this.state.exportLoading} onClick={this.onOuts.bind(this, ele)}>导出问卷</Button>
                                                                :
                                                                null
                                                        }
                                                        {
                                                            ele.stype==5 ?
                                                            <Button className='m_2' type="" size={'small'} type="primary" loading={this.state.exportLoading} onClick={this.onOutss.bind(this, ele)}>导出成绩</Button>
                                                                :
                                                                null
                                                        }
                                                        <Button className='m_2' type="" size={'small'} loading={this.state.exportLoading} onClick={this.onOutsss.bind(this, ele)}>观众数据导出</Button>
                                                        <Button value='courseV/view' className='m_2' onClick={this.showCode.bind(this, ele.courseId)} type="" size={'small'}>二维码预览</Button>
                                                        {/* <Button value='courseV/view' className='m_2' onClick={() => { message.info({ content: '测试服不支持二维码预览' }) }} type="" size={'small'}>二维码预览</Button> */}
                                                        <Popconfirm
                                                            value='courseV/del'
                                                            title={"确定删除吗？"}
                                                            onConfirm={this._onRemove.bind(this, ele.courseId)}
                                                            okText="确定"
                                                            cancelText="取消"
                                                        >
                                                            <Button className='m_2' type="" size={'small'}>删除</Button>
                                                        </Popconfirm>
                                                        <Button value='courseV/edit' onClick={this._onNew.bind(this, ele.courseId)} className='m_2' type={ele.isNew == 1 ? 'primary' : ''} size={'small'}>{ele.isNew == 1 ? '取消新课推荐' : '新课推荐'}</Button>
                                                        <StatCourse courseId={ele.courseId} actions={this.props.actions}></StatCourse>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Pagination showTotal={() => ('总共' + this.page_total + '条')} showQuickJumper pageSize={this.page_size} current={this.page_current + 1} onChange={this._onPage} total={this.page_total} />
                            </CardBody>
                        </Card>
                    </Col>

                </Row>
                <Modal
                    title="推荐"
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>

                        <Form.Item label="已推荐">
                            专栏1
                        </Form.Item>
                        <Form.Item label="推荐位置">
                            <Select defaultValue={0}>
                                <Select.Option value={0}>
                                    专栏一
                                </Select.Option>
                                <Select.Option value={1}>
                                    专栏二
                                </Select.Option>
                                <Select.Option value={2}>
                                    专栏三
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="预览"
                    visible={this.state.showCode}
                    maskClosable={true}
                    onCancel={this.hideCode}
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
                <Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    title="推荐"
                    visible={this.state.showRePanel}
                    okText="完成"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideRePanel}
                    onOk={this.course_id == '' ? this._onRecomm_s : this._onRecomm}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="专栏推荐设置">
                            <Select
                                mode="multiple"
                                labelInValue
                                value={this.state.selectValue}
                                placeholder="专栏搜索"
                                notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
                                filterOption={false}
                                onSearch={this._onFetchChannel}
                                onChange={this.onSelectChannel}

                            >
                                {selectData.map(d => (
                                    <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title='分销启用设置' visible={this.state.settingStatus} onCancel={() => { this.setState({ settingStatus: false }) }} onOk={this.postStatus} >
                    <Form layout='vertical'>
                        <Form.Item label='是否开启推课赚钱入口'>
                            <Switch checked={this.state.open == 1 ? true : false} onChange={(e) => {
                                if (e) {
                                    this.setState({ open: 1 })
                                } else {
                                    this.setState({ open: 0 })
                                }
                            }} />
                        </Form.Item>
                        <Form.Item label='关闭通道提示'>
                            <TextArea autoSize={{ minRows: 4 }} value={this.state.content} onChange={e => { this.setState({ content: e.target.value }) }} className="m_w400" />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title='推课赚钱分享页图片' visible={this.state.showImages} onCancel={() => { this.setState({ showImages: false }) }} onOk={this.postImg}>
                    <Form layout='vertical'>
                        <AntdOssUpload
                            actions={this.props.actions}
                            ref={ref => this.img = ref}
                            value={this.state.fileList}
                            listType="picture-card"
                            maxLength={1}
                            accept='image/*'
                        >
                        </AntdOssUpload>
                        <span style={{display: 'block' }}>(284px * 284px)</span>
                    </Form>
                </Modal>
            </div>
        );
    }
}
const LayoutComponent = CourseManager;
const mapStateToProps = state => {
    return {
        course_list: state.course.course_list,
        category_list: state.course.category_list,
        user: state.site.user,
        course_qrcode_info: state.course.course_qrcode_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
