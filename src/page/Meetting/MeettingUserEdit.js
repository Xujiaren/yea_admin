import React, { Component } from 'react';
import { Collapse, Table as TableAntd, Tabs, Tag, Avatar, Card, Select, PageHeader, DatePicker, Menu, Dropdown, Button, Icon, message, Input, Pagination, Descriptions, InputNumber, Empty } from 'antd';
import connectComponent from '../../util/connect';
import moment from 'moment'

const { Panel } = Collapse;
const { TabPane } = Tabs
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;

const customPanelStyle = {
    background: '#FFF',
    borderRadius: 4,
    marginBottom: 10,
    border: 0,
    overflow: 'hidden',
}
const bg_url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/045f86a9-71b6-490f-aa64-c1f0ac1ed43e.png'
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
}
class MeettingUserEdit extends Component {

    user_info = {}
    user_data = {}
    _user = {}
    i_info = []
    finish = []
    unfinish = []
    userId = 0
    tagId = 0
    send = null

    state = {
        activeTab: '1',
        com_current: 1,
        com_page_size: 10000000,
        com_total: 0,
        user_com: [],

        feed_current: 1,
        feed_page_size: 10000000,
        feed_total: 0,
        user_feed: [],
        user_auth: [],
        user_medal: [],
        user_class: [],
        user_map: [
            {
                levelName: '第一关',
                time: '2019-12-1---2020-12-1',
                status: 1,
                unLockTime: '2020-12-3'
            },
            {
                levelName: '第二关',
                time: '2019-12-1---2020-12-1',
                status: 0,
                unLockTime: '2020-12-6'
            }
        ],
        user_order: [],
        user_auth: [],
        tag_list: [],
        tag_ids: 0,
        tag_id: 0,
        user_id: 0,
        task_list: [],
        tag: '',
    }
    getUserFeedback = () => {
        const { actions } = this.props
        const { feed_current, feed_page_size } = this.state

        actions.getUserFeedback({
            page: feed_current - 1,
            pageSize: feed_page_size,
            user_id: this.userId,
            resolved: (data) => {

                this.setState({
                    user_feed: data || []
                })
            }
        })
    }
    getUserComment = () => {
        const { actions } = this.props
        const { com_current, com_page_size } = this.state

        actions.getUserComment({
            page: com_current - 1,
            pageSize: com_page_size,
            user_id: this.userId,
            resolved: (data) => {
                this.setState({
                    user_com: data || []
                })
            }
        })
    }
    componentWillMount() {
        // this.userId = this.props.match.params.userId
        const { path } = this.props.match
        const { id, tagId } = this.props.match.params
        if (path == '/meetting/user/view/:id/:tagId') {
            this.setState({ view_mode: true })
        }
        this.userId = parseInt(id)

        this.setState({
            user_id: parseInt(id),
            tag_ids: parseInt(tagId)
        }, () => {
            this.getTags(parseInt(tagId))
        })
        const { actions } = this.props;
        actions.getUserInfo(parseInt(id));

        // this.getUserFeedback()
        // this.getUserComment()
        // this.getUserDetail('medal')
        // this.getUserDetail('class')
        // this.getUserDetail('map')
        // this.getUserDetail('order')
        // this.getUserDetail('auth')
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user_info !== this.props.user_info) {
            this.user_info = nextProps.user_info.userinfo
            this.user_data = nextProps.user_info
            this.finish = nextProps.user_info.finish
            this.unfinish = nextProps.user_info.unfinish
            this.i_info = nextProps.user_info.integralinfo
            this.send = nextProps.user_info.send
            let list = nextProps.user_info['研学会任务记录']
            this.setState({
                nickname: nextProps.user_info.userinfo.nickname,
                mobile: nextProps.user_info.userinfo.mobile,
                task_list: list,
            })
        }
        if (this.user_info.birthday > 1000000000) {
            this.user_info.birthday = this.user_info.birthday / 1000
        }
    }
    getTags = (e) => {
        const { actions } = this.props
        const { tagId } = this.props.match.params
        actions.getTags({
            keyword: '',
            page: 0,
            ttype: 1,
            pageSize: 100,
            resolved: (res) => {
                let val = res.data.filter(item => item.tagId == parseInt(tagId))
                this.setState({
                    tag_list: res.data,
                })
                if (val.length > 0) {
                    this.setState({
                        tag: res.data.filter(item => item.tagId == parseInt(tagId))[0].tagName,
                        tag_id: e
                    })
                } else {
                    this.setState({
                        tag_id: ''
                    })
                }
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getUserDetail = (type) => {
        const user_id = this.userId
        this.props.actions.getUserDetail({
            type,
            user_id,

            resolved: (data) => {
                if (type == 'medal') {
                    this.setState({ user_medal: data || [] })
                }
                if (type == 'class') {
                    this.setState({ user_class: data || [] })
                }
                if (type == 'map') {
                    this.setState({ user_map: data || [] })
                }
                if (type == 'order') {
                    this.setState({ user_order: data || [] })
                }
                if (type == 'auth') {
                    this.setState({ user_auth: data || [] })
                }
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    _onPublish = () => {
        const { actions } = this.props
        const { user_id, tag_id ,tag_ids} = this.state
        if (tag_id != this.tagId) {
            actions.changeTagUser({
                newtag_id: tag_id,
                tag_id: tag_ids,
                user_id: user_id,
                resolved: (res) => {
                    message.success('提交成功')
                    window.history.back()
                },
                rejected: (err) => {
                    message.error({ content: JSON.stringify(err) })
                }
            })
        } else {
            message.success('提交成功')
            window.history.back()
        }
    }
    render() {

        let { isSeller, isAgentChair, isAgentEmployee, idLevel } = this.user_info
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle="用户信息"
                        extra={this.state.view_mode ? null : <Button onClick={this._onPublish}>提交</Button>}
                    >
                        <Collapse
                            bordered={false}
                            defaultActiveKey={['1', '2', '8']}
                        >
                            <Panel header="基本信息" key="1" style={customPanelStyle}>
                                <Card type="inner">
                                    {
                                        this.state.view_mode ?
                                            <Descriptions size="small" column={3}>
                                                <Descriptions.Item label="用户昵称">
                                                    <Tag>{this.user_info.nickname ? this.user_info.nickname : '暂时为空'}</Tag>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="手机号">
                                                    <Tag>{this.user_info.mobile ? this.user_info.mobile : '暂时为空'}</Tag>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="身份标签">
                                                    <Tag>{this.state.tag}</Tag>
                                                </Descriptions.Item>
                                            </Descriptions>
                                            :
                                            <Descriptions size="small" column={3}>
                                                <Descriptions.Item label="用户昵称">
                                                    <Input value={this.state.nickname} disabled={true} onChange={(e) => {
                                                        this.setState({
                                                            nickname: e.target.value
                                                        })
                                                    }} />
                                                </Descriptions.Item>
                                                <Descriptions.Item label="手机号">
                                                    <Input maxLength={11} value={this.state.mobile} disabled={true} onChange={(e) => {
                                                        this.setState({
                                                            mobile: e.target.value
                                                        })
                                                    }} />
                                                </Descriptions.Item>
                                                <Descriptions.Item label="身份标签">
                                                    <Select className='m_2' style={{ width: '120px' }} value={this.state.tag_id} onChange={(e) => {
                                                        this.setState({ tag_id: e })
                                                    }}>
                                                        {
                                                            this.state.tag_list.map(item => {
                                                                return (
                                                                    <Select.Option value={item.tagId}>{item.tagName}</Select.Option>
                                                                )
                                                            })
                                                        }


                                                    </Select>
                                                </Descriptions.Item>
                                            </Descriptions>
                                    }

                                </Card>

                            </Panel>
                            <Panel header="学习记录" key="2" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <Tabs onChange={val => {
                                        this.setState({
                                            activeTab: val
                                        })
                                    }} activeKey={this.state.activeTab}>
                                        <TabPane tab="在学课程" key='1'>
                                        </TabPane>
                                        <TabPane tab="已学课程" key='2'>
                                        </TabPane>
                                    </Tabs>
                                    <TableAntd size='small' dataSource={this.state.activeTab == '1' ? this.unfinish : this.finish} columns={this.learn_col} pagination={{
                                        showQuickJumper: true,
                                        showTotal: (total) => '总共' + total + '条'
                                    }}>
                                    </TableAntd>
                                </Card>
                            </Panel>

                            <Panel header="闯关记录" key="8" style={customPanelStyle}>
                                <TableAntd size='small' dataSource={this.state.task_list} columns={this.map_col} rowKey={'levelId'} size={'small'} pagination={{
                                    showQuickJumper: true,
                                    showTotal: (total) => '总共' + total + '条'
                                }} />
                            </Panel>
                        </Collapse>
                    </PageHeader>
                </Card>
            </div>
        );
    }

    map_col = [
        {
            title: '关卡名称',
            dataIndex: 'task.taskName',
            key: 'levelName',
            ellipsis: false,
        },
        {
            title: '活动时间',
            dataIndex: '',
            key: '',
            ellipsis: false,
            render: (item, ele) => {
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
                let begin = new Date(ele.task.beginTime * 1000).Format("yyyy-MM-dd")
                let end = new Date(ele.task.endTime * 1000).Format("yyyy-MM-dd")
                return (
                    <div>{begin}至{end}</div>
                )
            }
        },
        {
            title: '是否完成',
            dataIndex: '',
            key: '',
            ellipsis: false,
            render: (item, ele) => {
                return '任务完成'
            }
        },
        {
            title: '时间',
            dataIndex: '',
            key: '',
            ellipsis: false,
            render: (item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD')
            }
        },
    ]

    learn_col = [
        {
            title: '课程名称',
            dataIndex: 'contentName',
            key: 'contentName',
            ellipsis: false,
            render: (item, ele) => ele.courseName
        },
        {
            title: '是否学完',
            dataIndex: 'integral',
            key: 'integral',
            ellipsis: false,
            render: (item, ele) => {
                return this.state.activeTab == '1' ? '未学完' : '已学完'
            }
        },
        {
            title: '时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            ellipsis: false,
            render: (item, ele) => {
                return ele.updateTime ? moment.unix(ele.updateTime).format('YYYY-MM-DD HH:mm:ss') : '无'
            }
        },
    ]
    coin_col = [
        {
            title: '内容',
            dataIndex: 'contentName',
            key: 'contentName',
            ellipsis: false,
        },
        {
            title: '金币数',
            dataIndex: 'integral',
            key: 'integral',
            ellipsis: false,
            render: (item, ele) => {
                return (ele.itype == 1 ? '减少' : '增加') + ele.integral
            }
        },
        {
            title: '时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            ellipsis: false,
            render: (item, ele) => {
                return ele.pubTime ? moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm:ss') : '无'
            }
        },
    ]
    com_colunms = [
        {
            title: 'ID',
            dataIndex: 'commentId',
            key: 'commentId',
            ellipsis: false,
        },
        {
            title: '评论课程',
            dataIndex: 'contentName',
            key: 'contentName',
            ellipsis: true,
        },
        {
            title: '评论内容',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
        },
        {
            title: '获赞量',
            dataIndex: 'praise',
            key: 'praise',
            ellipsis: false,
        },
        {
            title: '发布时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render: (item, ele) => moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm:ss')
        }
    ]
    feed_colunms = [
        {
            title: 'ID',
            dataIndex: 'feedbackId',
            key: 'feedbackId',
            ellipsis: false,
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: true,
        },
        {
            title: '反馈内容',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
        },
        {
            title: '回复',
            dataIndex: 'reply',
            key: 'reply',
            ellipsis: true,
        },
        {
            title: '是否有用',
            dataIndex: 'isUse',
            key: 'isUse',
            ellipsis: false,
            render: (item, record) => record.isUse == 1 ? '是' : '否'
        },
        {
            title: '发布时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render: (item, ele) => moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm:ss')
        }
    ]
}


const LayoutComponent = MeettingUserEdit;
const mapStateToProps = state => {
    return {
        user_info: state.user.user_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });