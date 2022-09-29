import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber, DatePicker } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom';
import Editor from '../../components/Editor'
import PersonType from '../../components/PersonType'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
class MeettingTaskEdit extends Component {
    state = {
        view_mode: false,
        course_type: 1,
        course_exchange: 2,
        is_must: 0,
        status: 0,
        id: 0,
        v_list: [],
        p_list: [],
        fileList: [],
        editPanel: false,
        edit_index: -1,
        edit_title: '',
        edit_intro: '',
        posterList: [],
        imgList: [],
        isVideo: false,
        channels_list: [],
        type: 1,
        col: '所有专题',
        course_name: '',
        num: 1,
        times: 1,
        begin: '',
        end: '',
        beginTime:'',
        endTime:'',
        target: 0,
        flag: 0,
        task_id: 0,
        ids: 0,
        tag_list: [],
        moment: [],
        channels:[],
    }
    id = 0
    componentWillMount() {
        const { id } = this.props.match.params
        this.id = id
        const { path } = this.props.match
        const { actions } = this.props
        if (path == '/meetting/task/view/:id') {
            this.setState({ view_mode: true })
        }
        if (parseInt(id) !== 0) {
            this.setState({ id: parseInt(id), task_id: parseInt(id) })
            actions.getTasks({
                taskId: id,
                keyword: '',
                page: 0,
                page_size: 10
            })
        } else {
            actions.publishTasks({
                begin_time: '',
                end_time: '',
                etype: 0,
                integral: 0,
                link: '',
                task_id: 0,
                task_img: '',
                task_level: 0,
                task_limit: 0,
                task_name: '',
                task_summary: '',
                status: 0,
                resolved: (res) => {
                    this.setState({
                        task_id: res.taskId,
                    })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        }
        this.getChannels()
        this.getTags()
       
    }
    getTags = () => {
        const { actions } = this.props
        actions.getTag({
            keyword: this.state.keyword,
            page: this.page_current,
            ttype: 1,
            pageSize: this.page_size
        })
    }
    getChannels = () => {
        const { actions } = this.props
        actions.getChannels(4, this.state.keyword, 0, this.page_size)
    }
    componentWillReceiveProps(n_props) {
        if (n_props.channels_list != this.props.channels_list) {
            this.setState({
                channels_list: n_props.channels_list.data
            })
        }
        if (n_props.tag_list != this.props.tag_list) {
            this.setState({
                tag_list: n_props.tag_list.data
            })
        }
        if (n_props.task_list != this.props.task_list) {
            var begs = moment.unix(n_props.task_list.data[0].beginTime).format('YYYY-MM-DD HH:mm')
            let beg =moment(begs)
            var ens = moment.unix(n_props.task_list.data[0].endTime).format('YYYY-MM-DD HH:mm')
            let en = moment(ens)
            this.setState({
                status: n_props.task_list.data[0].status,
                begin: begs,
                end: ens,
                beginTime:beg,
                endTime:en,
                flag:n_props.task_list.data[0].integral
                // moment:moment,
            })
            let lists = []
            n_props.task_list.data[0].taskList.map(item => {
                // if (item.link == '所有专题') {
                //     cols = '所有专题'
                // }
                // if (item.link == '46') {
                //     cols = '考核条件须知'
                // }
                // if (item.link == '47') {
                //     cols = '旅游小知识'
                // }
                // if (item.link == '48') {
                //     cols = '旅游礼仪'
                // }
                // if (item.link == '50') {
                //     cols = '游学积分兑换'
                // }
                // if (item.link == '52') {
                //     cols = '栏目一二三'
                // }
                // console.log(this.state.channels,'///')
                this.props.actions.getMeetChannels({
                    ctype:4,
                    keyword:'', 
                    page:0,
                    pageSize:100,
                    flag:'',
                    resolved:(res)=>{
                        let typ = ['全部类型', '观看一门课程', '完成一场考试', '完成一个专题课程', '观看一场直播', '评分 点赞 分享', '观看组合课程', '在心情墙发布内容', '兑换一堂课']
                        let cols = ''
                        cols=res.data.filter(itm=>itm.channelId==item.link)[0].channelName
                        const items = {
                            id: item.taskId,
                            type: typ[item.etype],
                            col: cols,
                            course_name: item.taskName,
                            times: item.taskLimit,
                            num: item.taskLimit
                        }
                        lists = lists.concat(items)
                        console.log(lists)
                        this.setState({ v_list: lists,channels:res.data })
                    },
                    rejected:(err)=>{
        
                    }
                })
                
                
            })
        }
    }
   
    onOk = () => {
        const { type, col, course_name, begin, end, status, num, v_list, task_id ,flag} = this.state
        if (!begin) { message.info({ content: '请设置开始日期' }); return; }
        if (!end) { message.info({ content: '请设置结束日期' }); return; }
        if (v_list.length == 0) { message.info({ content: '请添加任务' }); return; }
        const { actions } = this.props
        actions.publishTasks({
            begin_time: begin,
            end_time: end,
            etype: 0,
            integral: 0,
            link: '',
            task_id: task_id,
            task_img: '',
            task_level: 0,
            task_limit: 0,
            task_name: 0,
            task_summary: '',
            status: status,
            tag_id:flag,
            resolved: (res) => {
                console.log(res)
                message.success({
                    content: '操作成功'
                })
                window.history.back()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onBack = () => {
        if (this.id == 0) {
            const { actions } = this.props
            actions.deleteTask({
                action: 'delete',
                task_id: this.state.task_id,
                resolved: (res) => {
                    window.history.back()
                },
                rejected: (err) => {
                    window.history.back()
                }
            })
        } else {
            window.history.back()
        }
    }
    onEds = (val) => {
        // console.log(val,)
        let coll = 0
        if (val.col == '所有专题') {
            coll = '所有专题'
        }
        if (val.col == '考核条件须知') {
            coll = 46
        }
        if (val.col == '旅游小知识') {
            coll = 47
        }
        if (val.col == '旅游礼仪') {
            coll = 48
        }
        if (val.col == '游学积分兑换') {
            coll = 50
        }
        if (val.col == '栏目一二三') {
            coll = 52
        }
        this.setState({
            edit_index: 0,
            editPanel: true,
            isVideo: true,
            type: val.type,
            col: val.col,
            course_name: val.course_name,
            num: val.num,
            ids: val.id
        })
    }
    render() {
        const { view_mode, id, isVideo, begin, end } = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={this.onBack}
                        title=""
                        subTitle={id == 0 ? '添加任务' : view_mode ? '查看任务' : '修改任务'}
                    >
                        <Card title="" style={{ minHeight: '400px' }}>
                            <Form wrapperCol={{ span: 18 }} labelCol={{ span: 3 }}>

                                <Form.Item label='任务时间'>
                                    <DatePicker
                                        key='t_5'
                                        // disabled={view_mode || this.course_info.liveStatus > 0}
                                        // disabledDate={this.disabledDate}
                                        format={'YYYY-MM-DD HH:mm'}
                                        placeholder="选择开始时间"
                                        onChange={(val, dateString) => {
                                            this.setState({
                                                begin: dateString,
                                                beginTime: val
                                            })
                                        }}
                                        value={this.state.beginTime}
                                        locale={locale}
                                        showTime={{ format: 'HH:mm' }}
                                        allowClear={false}
                                    />
                                    <span style={{ padding: '0 10px' }}>至</span>
                                    <DatePicker
                                        key='t_7'
                                        // disabled={view_mode || this.course_info.liveStatus > 0}
                                        // disabledDate={this.disabledDate}
                                        format={'YYYY-MM-DD HH:mm'}
                                        placeholder="选择结束时间"
                                        onChange={(val, dateString) => {
                                            this.setState({
                                                end: dateString,
                                                endTime: val
                                            })
                                        }}
                                        value={this.state.endTime}
                                        locale={locale}
                                        showTime={{ format: 'HH:mm' }}
                                        allowClear={false}
                                    />
                                </Form.Item>
                                <Form.Item label='对象标签'>
                                    <Select disabled={view_mode} className='m_w400' value={this.state.flag} onChange={(e) => { this.setState({ flag: e }) }}>
                                        <Select.Option value={0}>全部</Select.Option>
                                        {
                                            this.state.tag_list.map(item => {
                                                return (
                                                    <Select.Option value={item.tagId}>{item.tagName}</Select.Option>
                                                )
                                            })
                                        }
                                    </Select>

                                </Form.Item>
                                <Form.Item label='任务'>
                                    <Table pagination={false} size='small' columns={this.v_col} dataSource={this.state.v_list} bordered={true} />
                                    <Button type='dashed' disabled={view_mode} onClick={() => {
                                        this.setState({
                                            isVideo: true,
                                            editPanel: true,
                                            edit_index: -1,
                                            type: 1,
                                            col: this.state.channels_list[0].channelId,
                                            course_name: '',
                                            times: 1
                                        })
                                    }}>
                                        <Icon type="plus" /> 添加
                                    </Button>
                                </Form.Item>
                                <Form.Item label='是否上架'>
                                    <SwitchCom disabled={view_mode} value={this.state.status} onChange={(status) => {
                                        this.setState({ status })
                                    }}></SwitchCom>
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
                                    <Button className='m_2' onClick={this.onBack}>取消</Button>
                                    {view_mode ? null :
                                        <Button className='m_2' type='primary' onClick={this.onOk}>提交</Button>
                                    }
                                </Form.Item>
                            </Form>
                        </Card>
                    </PageHeader>
                </Card>

                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal okText='确定' cancelText='取消' title={this.state.edit_index == -1 ? '添加' : '修改'} onOk={this.onEdit} visible={this.state.editPanel} maskClosable={false} onCancel={() => {
                    this.setState({ editPanel: false })
                }}>
                    <Form wrapperCol={{ span: 20 }} labelCol={{ span: 4 }}>
                        <Form.Item label={'任务类型'}>
                            <Select value={this.state.type} onChange={type => this.setState({ type })}>
                                {/* <Select.Option value={0}>全部类型</Select.Option> */}
                                <Select.Option value={1}>观看一门课程</Select.Option>
                                <Select.Option value={2}>完成一场考试</Select.Option>
                                <Select.Option value={3}>完成一个专题课程</Select.Option>
                                <Select.Option value={4}>观看一场直播</Select.Option>
                                <Select.Option value={5}>评分 点赞 分享</Select.Option>
                                <Select.Option value={6}>观看组合课程</Select.Option>
                                <Select.Option value={7}>在心情墙发布内容</Select.Option>
                                <Select.Option value={8}>兑换一堂课</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={'选择课程'}>
                            <Select value={this.state.col} onChange={col => this.setState({ col })}>
                                {
                                    this.state.channels_list.map((item, index) => {
                                        return (
                                            <Select.Option value={item.channelId}>{item.channelName}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                            {/* <Input placeholder='课程名称/试卷名称' value={this.state.course_name} onChange={e => this.setState({ course_name: e.target.value })}></Input> */}
                        </Form.Item>
                        <Form.Item label='设置次数'>
                            <InputNumber min={1} onChange={num => this.setState({ num })} value={this.state.num}></InputNumber>
                            <span className='pad_l5'>次</span>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    onDelete = (val) => {
        const { actions } = this.props
        actions.deleteTask({
            action: 'delete',
            task_id: val.id,
            resolved: (res) => {
                actions.getTasks({
                    taskId: this.state.task_id,
                    keyword: '',
                    page: 0,
                    page_size: 10
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onEdit = () => {
        const { v_list, p_list, isVideo, task_id, edit_index, type, col, course_name, times, begin, end, status, num } = this.state
        const { actions } = this.props
        // if (course_name == '') { message.info('请输入课程名称或者试卷名称'); return; }

        if (edit_index == -1) {
            var item = {
                id: Date.now().toString(),
                type: type,
                col: col,
                course_name: course_name,
                times: times,
                num: num
            }
            this.setState({ v_list: [...v_list, item], editPanel: false })
            actions.publishTask({
                begin_time: '',
                end_time: '',
                etype: item.type,
                integral: 0,
                link: (col).toString(),
                task_id: 0,
                task_img: '',
                task_level: 0,
                task_limit: num,
                task_name: item.course_name,
                task_summary: '',
                status: 1,
                parentId: task_id,
                resolved: (res) => {
                    console.log(res)
                    // actions.getTasks({
                    //     taskId: task_id,
                    //     keyword: '',
                    //     page: 0,
                    //     page_size: 10
                    // })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else {
            v_list[edit_index].type = type
            v_list[edit_index].col = col
            v_list[edit_index].course_name = course_name
            v_list[edit_index].times = times
            this.setState({ v_list, editPanel: false })
            var item = {
                id: this.state.ids,
                type: type,
                col: col,
                course_name: course_name,
                times: times,
                num: num
            }

            actions.publishTasks({
                begin_time: '',
                end_time: '',
                etype: item.type,
                integral: 0,
                link: (col).toString(),
                task_id: 0,
                task_img: '',
                task_level: 0,
                task_limit: num,
                task_name: item.course_name,
                task_summary: '',
                status: 1,
                task_id: this.state.ids,
                resolved: (res) => {
                    console.log(res)
                    actions.getTasks({
                        taskId: task_id,
                        keyword: '',
                        page: 0,
                        page_size: 10
                    })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        }
    }
    v_col = [
        { dataIndex: 'id', key: 'id', title: 'ID' },
        {
            dataIndex: 'type', key: 'type', title: '任务类型', render: (item, ele) => {
                return ele.type
            }
        },
        { dataIndex: 'col', key: 'col', title: '专题' },
        { dataIndex: 'course_name', key: 'course_name', title: '课程名称', ellipsis: true },
        { dataIndex: 'times', key: 'times', title: '次数', ellipsis: true },
        {
            title: '操作', render: (item, ele, index) => {
                return <>
                    <a className='m_2' onClick={this.onEds.bind(this, ele)}>修改</a>
                    <a className='m_2' onClick={this.onDelete.bind(this, ele)}>删除</a>
                </>
            }
        },
    ]
}

const LayoutComponent = MeettingTaskEdit;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        channels_list: state.course.channels_list,
        task_list: state.meet.task_list,
        tag_list: state.course.tag_list,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
