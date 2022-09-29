import React, { Component } from 'react';
import { Tooltip, Collapse, Table as TableAntd, Tabs, Tag, Avatar, Card, Select, PageHeader, DatePicker, Menu, Dropdown, Button, Icon, message, Input, Pagination, Descriptions, InputNumber, Empty } from 'antd';
import connectComponent from '../../../util/connect';
import moment from 'moment'
import './UserView.scss'

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
    '4': '店主',
    '5': '客户代表',
    '6': '客户经理',
    '7': '中级经理',
    '8': '客户总监',
    '9': '高级客户总监',
    'GG': '资深客户总监',
}
class UserView extends Component {

    user_info = {}
    user_data = {}
    ask_info = {}
    askList = []
    replyList = []
    _user = {}
    i_info = []
    finish = []
    unfinish = []
    userId = 0
    send = null
    tag = {}
    game = '暂无'
    ask = '暂无'
    coupon = '暂无'
    tree = '暂无'
    cert = '暂无'
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
        user_map: [],
        user_order: [],
        user_auth: [],

        uc_total: 0,
        course_order: [],
        uc_page: 0,
        uc_pageSize: 20,

        reward_total: 0,
        reward_record: [],
        reward_page: 0,
        reward_pageSize: 20,
        list: [],
        activity: [],
        coupons: [],
        drawList: [],
        promoteIntegralInfo: [],
        identity: ''
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
    componentDidMount() {
        this.userId = this.props.match.params.userId
        const { actions } = this.props;
        actions.getUserInfo(this.userId);

        this.getUserLevelLog()
        this.getUserFeedback()
        this.getUserComment()
        this.getUserDetail('medal')
        this.getUserDetail('class')
        this.getUserDetail('map')
        this.getUserDetail('order')
        this.getUserDetail('auth')
        this.getUserCourseOrder()
        this.getWithdrawOrder(parseInt(this.userId))
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user_info !== this.props.user_info) {
            this.user_info = nextProps.user_info.userinfo
            this.user_data = nextProps.user_info
            this.ask_info = nextProps.user_info.问吧
            this.askList = nextProps.user_info.问吧.askList
            this.replyList = nextProps.user_info.问吧.replyList
            this.finish = nextProps.user_info.finish
            this.setState({ list: nextProps.user_info.finish })
            this.unfinish = nextProps.user_info.unfinish
            this.i_info = nextProps.user_info.integralinfo
            this.send = nextProps.user_info.send
            this.setState({
                promoteIntegralInfo: nextProps.user_info.promoteIntegralInfo,
                identity: nextProps.user_info.userinfo.identity
            })
            if ('tag' in nextProps.user_info && typeof nextProps.user_info['tag'] === 'object') {
                this.tag = nextProps.user_info['tag']
            }
            if ('趣味探索' in nextProps.user_info && typeof nextProps.user_info['趣味探索'] === 'string') {
                this.game = nextProps.user_info['趣味探索']
            }
            if ('问吧' in nextProps.user_info && typeof nextProps.user_info['问吧']) {
                this.ask = nextProps.user_info['问吧']
            }
            if ('优惠券' in nextProps.user_info && typeof nextProps.user_info['优惠券']) {
                this.coupon = nextProps.user_info['优惠券']
                this.setState({
                    coupons: nextProps.user_info['优惠券']
                })
            }
            if ('完美林' in nextProps.user_info && typeof nextProps.user_info['完美林'] === 'string') {
                this.tree = nextProps.user_info['完美林']
            }
            if ('兑换证书' in nextProps.user_info && typeof nextProps.user_info['兑换证书'] === 'string') {
                this.cert = nextProps.user_info['兑换证书']
            }
            this.setState({
                activity: nextProps.user_info['活动信息']
            })
        }
        if (this.user_info.birthday > 1000000000) {
            this.user_info.birthday = this.user_info.birthday / 1000
        }
    }
    getWithdrawOrder = (val) => {
        this.props.actions.getWithdrawOrder({
            userId: val,
            pageSize: 100,
            resolved: (res) => {
                console.log(res, '???')
                const { total, page, data } = res
                if (Array.isArray(data)) {
                    this.setState({ drawList: data })
                }
            },
            rejected: () => {
            }
        })
    }
    getUserActiveReward = () => {
        const { reward_page, reward_pageSize } = this.state
        this.props.actions.getActiveReward({
            user_id: this.userId,
            activity_id: 18,
            page: reward_page,
            pageSize: reward_pageSize,
            resolved: (res) => {
                const { total, data, page } = res
                if (Array.isArray(data)) {
                    this.setState({ reward_total: total, reward_page: page, reward_record: data, })
                }
            },
            rejected: () => {

            }
        })
    }
    getUserCourseOrder = () => {
        const { uc_page: page, uc_pageSize: pageSize } = this.state
        this.props.actions.getUserCourseOrder({
            begin: '',
            end: '',
            keyword: '',
            page: page,
            pageSize: pageSize,
            user_id: this.userId,
            resolved: (res) => {
                const { total, page, data } = res
                if (Array.isArray(data)) {
                    this.setState({
                        course_order: data,
                        uc_total: total,
                        uc_page: page
                    })
                }
                console.log(res)
            },
            rejected: () => {

            }
        })
    }
    getUserLevelLog = () => {
        this.props.actions.getUserLevelLog({
            user_id: this.userId,
            resolved: (res) => {
                if (Array.isArray(res)) {
                    this.setState({ user_level_log: res })
                }
            },
            rejected: (res) => {
                message.error(JSON.stringify(res))
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
    render() {

        let { isSeller, isAgentChair, isAgentEmployee, idLevel } = this.user_info
        console.log(this.state.user_medal)
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle="用户详情"
                        extra={[

                        ]}
                    >
                        <Collapse
                            bordered={false}
                            defaultActiveKey={['1']}
                        >
                            <Panel header="基本信息" key="1" style={customPanelStyle}>
                                <Card type="inner">
                                    <div className='mb_10'>
                                        {this.user_info.avatar ?
                                            <Avatar size={64} src={this.user_info.avatar}></Avatar>
                                            :
                                            <Avatar size={64} style={{ background: '#bebebe' }}>无</Avatar>
                                        }
                                        <div className='pad_t5'>用户头像</div>
                                    </div>
                                    <Descriptions size="small" column={3}>
                                        <Descriptions.Item label="昵称">
                                            <Tag>{this.user_info.nickname ? this.user_info.nickname : '暂时为空'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="手机号码">
                                            <Tag>{this.user_info.mobile ? this.user_info.mobile : '暂时为空'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="用户账户">
                                            <Tag>{this.user_info.mobile ? this.user_info.mobile : '暂时为空'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="姓名">
                                            <Tag>{this.user_info.username ? this.user_info.username : '暂时为空'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="地区">
                                            <Tag>暂时为空</Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item label="金币">
                                            <Tag>{this.user_info.integral + this.user_info.rintegral ? this.user_info.integral + this.user_info.rintegral : '暂时为空'}</Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item label="正副卡标识">
                                            <Tag>{this.user_info.isAuth ? (this.user_info.isPrimary == 1 ? '正卡' : '副卡') : '无'}</Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item label="性别">
                                            <Tag>
                                                {this.user_info.sex == 0 ? '未知' : this.user_info.sex == 1 ? '男' : '女'}
                                            </Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item label="当前业绩等级">
                                            {
                                                this.user_info.idLevel ?
                                                    flag_arg[this.user_info.idLevel] :
                                                    '无'
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="权益等级">
                                            <Tag>LV{this.user_info.level}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="历史最高级别">
                                            <Tag>
                                                {
                                                    this.user_info.idHlevel ?
                                                        flag_arg[this.user_info.idHlevel] :
                                                        '无'
                                                }
                                            </Tag>
                                        </Descriptions.Item>
                                    </Descriptions>

                                    <Descriptions>
                                        <Descriptions.Item label="生日">
                                            <Tag>{this.user_info['birth'] ? this.user_info['birth'] : moment.unix(this.user_info.birthday).format('YYYY-MM-DD')}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="注册时间">
                                            <Tag>{this.user_info.regTime ? moment.unix(this.user_info.regTime).format('YYYY-MM-DD HH:mm:ss') : '无'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="最后登录时间">
                                            <Tag>{this.user_info.loginTime ? moment.unix(this.user_info.loginTime).format('YYYY-MM-DD HH:mm:ss') : '无'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="身份标签">
                                            {
                                                this.user_info.isTeacher == 0 && this.user_info.isAgentChair == 0 && this.user_info.isAgentEmployee == 0 && this.user_info.isSeller == 0 ?
                                                    <Tag>暂时为空</Tag>
                                                    : null
                                            }
                                            {
                                                this.user_info.isTeacher ?
                                                    <Tag>讲师</Tag>
                                                    : null
                                            }
                                            {
                                                this.user_info.isAgentChair ?
                                                    <Tag>店主</Tag>
                                                    : null
                                            }
                                            {
                                                this.user_info.isAgentEmployee ?
                                                    <Tag>店员</Tag>
                                                    : null
                                            }
                                            {
                                                this.user_info.isSeller ?
                                                    <Tag>直销员</Tag>
                                                    : null
                                            }
                                        </Descriptions.Item>

                                        <Descriptions.Item label="VIP">
                                            <Tag>{this.user_info.sn ? this.user_info.sn : '无'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="工号">
                                            <Tag>{this.user_info.workSn ? this.user_info.workSn : '无'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="身份证后六位">
                                            <Tag>{this.user_info.idpwd ? this.user_info.idpwd : '无'}</Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item label="邮寄地址">
                                            {
                                                this.send instanceof Array ? this.send.map((ele, index) => {
                                                    const map_txt = ['province', 'city', 'district', 'address']
                                                    let str = []
                                                    map_txt.map(_ele => {
                                                        str.push(ele[_ele] || '')
                                                    })
                                                    return <Tag className='m_2' key={index}>{str.join(' ')}{ele['isFirst'] == 1 ? '【默认地址】' : ''}</Tag>
                                                }) : '无'
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="标签">
                                            {
                                                Object.keys(this.tag).length > 0 ?
                                                    Object.keys(this.tag).map(ele => <Tag>{`${ele}:${this.tag[ele]}`}</Tag>)
                                                    : <Tag>暂无</Tag>
                                            }
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Descriptions>
                                        <Descriptions.Item label="游学积分">
                                            <Tag>{this.user_info.yintegral ? this.user_info.yintegral : '无'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="粉丝数">
                                            <Tag>{this.user_data['粉丝数']}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="是否问答">
                                            {
                                                this.state.identity ?
                                                    <Tag>是</Tag>
                                                    :
                                                    <Tag>否</Tag>
                                            }

                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Descriptions>
                                        <Descriptions.Item label="抽奖机会">
                                            <Tag>{this.user_info.lottery}</Tag>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>

                            </Panel>
                            <Panel header="趣味探索" key="41" style={customPanelStyle}>
                                <div style={{ border: '1px solid #cccccc', width: '80px', height: '25px', lineHeight: '25px', textAlign: 'center', marginLeft: '100px' }}>{this.game}</div>
                                {/* <div>
                                  <span style={{display:'inline-block',margin:'15px'}}>金币数</span>
                                  <span style={{display:'inline-block',margin:'15px'}}></span>
                               </div>
                               <div>
                                <span style={{display:'inline-block',margin:'15px'}}>国际知识</span>
                                <span style={{display:'inline-block',margin:'15px'}}></span>
                                <span style={{display:'inline-block',margin:'15px'}}>法律法规</span>
                                <span style={{display:'inline-block',margin:'15px'}}></span>
                                <span style={{display:'inline-block',margin:'15px'}}>美容养生</span>
                                <span style={{display:'inline-block',margin:'15px'}}></span>
                                <span style={{display:'inline-block',margin:'15px'}}>公司产品</span>
                                <span style={{display:'inline-block',margin:'15px'}}></span>
                                <span style={{display:'inline-block',margin:'15px'}}>销售技巧</span>
                                <span style={{display:'inline-block',margin:'15px'}}></span>
                               </div>
                               <div style={{display:'flex'}}>
                                   <div style={{marginLeft:'30px',border:'1px solid #cccccc',width:'100px',height:'25px',lineHeight:'25px'}}>
                                   <span style={{display:'inline-block',marginLeft:'15px'}}>比赛</span>
                                    <span style={{display:'inline-block',marginLeft:'15px'}}></span>
                                   </div>
                                   <div style={{marginLeft:'30px',border:'1px solid #cccccc',width:'100px',height:'25px',lineHeight:'25px'}}>
                                   <span style={{display:'inline-block',marginLeft:'15px'}}>胜率</span>
                                    <span style={{display:'inline-block',marginLeft:'15px'}}></span>
                                   </div>
                                   <div style={{marginLeft:'30px',border:'1px solid #cccccc',width:'100px',height:'25px',lineHeight:'25px'}}>
                                   <span style={{display:'inline-block',marginLeft:'15px'}}>胜场</span>
                                    <span style={{display:'inline-block',marginLeft:'15px'}}></span>
                                   </div>
                                   <div style={{marginLeft:'30px',border:'1px solid #cccccc',width:'100px',height:'25px',lineHeight:'25px'}}>
                                   <span style={{display:'inline-block',marginLeft:'15px'}}>MVP</span>
                                    <span style={{display:'inline-block',marginLeft:'15px'}}></span>
                                   </div>
                               </div> */}
                            </Panel>
                            <Panel header="问吧" key="42" style={customPanelStyle}>
                                {this.ask_info == "暂无" ?
                                    <div style={{ border: '1px solid #cccccc', width: '80px', height: '25px', lineHeight: '25px', textAlign: 'center', marginLeft: '100px' }}>{this.ask}</div>
                                    :
                                    <div>
                                        <div>
                                            <span style={{ display: 'inline-block', margin: '15px' }}>提问数</span>
                                            <Tag style={{ display: 'inline-block', margin: '15px' }}>{this.ask_info.askNum}</Tag>
                                            <span style={{ display: 'inline-block', marginTop: '15px', marginLeft: '200px' }}>回答问题数</span>
                                            <Tag style={{ display: 'inline-block', margin: '15px' }}>{this.ask_info.replyNum}</Tag>
                                        </div>
                                        <div>
                                            {this.askList.length == 0 ? null :
                                                <div style={{ display: 'inline-block', width: '100%', margin: '15px' }}>
                                                    {
                                                        this.askList.map((item, index) => {
                                                            return (
                                                                <div style={{ borderBottom: '1px solid #cccccc', marginTop: '8px', paddingBottom: '8px' }}>{index + 1}.{item.title}</div>
                                                            )
                                                        })
                                                    }
                                                </div>}
                                            {/* {this.replyList.length == 0 ? null :
                                                <div style={{ display: 'inline-block', width: '200px', marginTop: '15px', marginLeft: '200px' }}>
                                                    {
                                                        this.replyList.map(item=>{
                                                            return(
                                                                <div>{item.content}</div>
                                                            )
                                                        })
                                                    }
                                                </div>} */}
                                        </div>
                                    </div>
                                }
                            </Panel>
                            <Panel header="活动信息" key="78" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <TableAntd size='small' dataSource={this.state.activity} columns={this.activity_col} rowKey={'activityId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                        showQuickJumper: true,
                                        showTotal: (total) => '总共' + total + '条'
                                    }} />
                                </Card>
                            </Panel>
                            <Panel header="优惠券" key="43" style={customPanelStyle}>
                                {
                                    this.state.coupons.length > 0 ?
                                        <div style={{ display: 'inline-block', width: '100%', margin: '15px' }}>
                                            {
                                                this.state.coupons.map(item => {
                                                    return (
                                                        <div style={{ borderBottom: '1px solid #cccccc', marginTop: '8px', paddingBottom: '8px' }}>{item.couponName}&nbsp;&nbsp;&nbsp;&nbsp;{item.status == 0 ? '(未使用)' : '(已使用)'} </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <div style={{ border: '1px solid #cccccc', width: '80px', height: '25px', lineHeight: '25px', textAlign: 'center', marginLeft: '100px' }}>暂无</div>
                                }

                            </Panel>
                            <Panel header="完美林" key="44" style={customPanelStyle}>
                                <div style={{ border: '1px solid #cccccc', width: '80px', height: '25px', lineHeight: '25px', textAlign: 'center', marginLeft: '100px' }}>{this.tree}</div>
                            </Panel>
                            <Panel header="兑换证书" key="45" style={customPanelStyle}>
                                <div style={{ border: '1px solid #cccccc', width: '80px', height: '25px', lineHeight: '25px', textAlign: 'center', marginLeft: '100px' }}>{this.cert}</div>
                            </Panel>
                            <Panel header="收入明细" key="46" style={customPanelStyle}>
                                <div style={{ width: '100%' }}>
                                    <Card title="课程分销" bordered={false} style={{ width: '100%' }}>
                                        <TableAntd size='small' dataSource={this.state.promoteIntegralInfo} columns={this.promote_col} rowKey={'levelHistoryId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                            showQuickJumper: true,
                                            showTotal: (total) => '总共' + total + '条'
                                        }} />
                                    </Card>
                                    <Card title="提现" bordered={false} style={{ width: '100%' }}>
                                        <TableAntd size='small' dataSource={this.state.drawList} columns={this.draw_col} rowKey={'levelHistoryId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                            showQuickJumper: true,
                                            showTotal: (total) => '总共' + total + '条'
                                        }} />
                                    </Card>
                                </div>
                            </Panel>
                            <Panel header="降级时间记录" key="20" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <TableAntd size='small' dataSource={this.state.user_level_log} columns={this.level_log_col} rowKey={'levelHistoryId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                        showQuickJumper: true,
                                        showTotal: (total) => '总共' + total + '条'
                                    }} />
                                </Card>
                            </Panel>
                            <Panel header="学习记录" key="2" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <Card type='inner' className="mb_10" >
                                        <Descriptions>
                                            <Descriptions.Item label="会员累计学习时长">
                                                <Tag>{this.user_data.duration}</Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="连续学习天数">
                                                <Tag>{this.user_info.learn}</Tag>
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Card>
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
                                    <TableAntd size='small' dataSource={this.state.activeTab == '1' ? this.unfinish : this.finish} columns={this.state.activeTab == '1' ?this.learn_cols:this.learn_col} pagination={{
                                        showQuickJumper: true,
                                        showTotal: (total) => '总共' + total + '条'
                                    }}>
                                        {console.log(this.finish)}
                                    </TableAntd>
                                </Card>
                            </Panel>
                            <Panel header="金币明细" key="3" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <div className='mt_10 mb_10'>
                                        金币总数：<Tag>{this.user_info.integral ? this.user_info.integral : '空'}</Tag>
                                        金币收入：<Tag>{parseInt(this.user_info.integral) + parseInt(this.user_data.integralOut)}</Tag>
                                        金币支出：<Tag>{this.user_data.integralOut ? this.user_data.integralOut : '空'}</Tag>
                                    </div>
                                    <TableAntd size='small' bordered={false} columns={this.coin_col} dataSource={this.i_info} pagination={{
                                        showQuickJumper: true,
                                        showTotal: (total) => '总共' + total + '条'
                                    }}>
                                    </TableAntd>
                                </Card>
                            </Panel>
                            <Panel header="课程订单" key="90" style={customPanelStyle}>
                                <TableAntd size='small' dataSource={this.state.course_order} columns={[
                                    { title: 'ID', dataIndex: 'id', key: 'id' },
                                    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
                                    { title: '课程名称', dataIndex: 'content', key: 'content' },
                                    { title: '积分', dataIndex: 'integral', key: 'integral' },
                                    {
                                        title: '创建时间', render: (item, ele) => {
                                            if (ele.pubTime)
                                                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
                                            return '暂无'
                                        }
                                    },

                                ]} rowKey={'id'} size={'small'} pagination={{
                                    pageSize: this.state.uc_pageSize,
                                    total: this.state.uc_total,
                                    current: this.state.uc_page + 1,
                                    onChange: (val) => this.setState({ uc_page: val - 1 }, this.getUserCourseOrder),
                                    showQuickJumper: true,
                                    showTotal: (total) => '总共' + total + '条'
                                }} />
                            </Panel>
                            <Panel header="商城订单" key="9" style={customPanelStyle}>
                                <TableAntd size='small' dataSource={this.state.user_order} columns={this.order_col} rowKey={'orderId'} size={'small'} pagination={{
                                    showQuickJumper: true,
                                    showTotal: (total) => '总共' + total + '条'
                                }} />
                            </Panel>
                            <Panel header="问题反馈" key="4" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <TableAntd size='small' dataSource={this.state.user_feed} columns={this.feed_colunms} rowKey={'feedbackId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                        showQuickJumper: true,
                                        showTotal: (total) => '总共' + total + '条'
                                    }} />
                                </Card>
                            </Panel>
                            <Panel header="互动" key="5" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <div className='mt_10 mb_10'>
                                        评论总数：<Tag>{this.state.user_com.length}</Tag>
                                        {/*获赞数：<Tag>{this.state.comment_press?this.state.comment_press:'空'}</Tag>*/}
                                    </div>
                                    <TableAntd dataSource={this.state.user_com} columns={this.com_colunms} rowKey={'commentId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                        showQuickJumper: true,
                                        showTotal: (total) => '总共' + total + '条'
                                    }} />
                                </Card>
                            </Panel>
                            <Panel header="勋章" key="6" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <div className='d_flex wrap'>
                                        {
                                            this.state.user_medal.length !== 0 ? this.state.user_medal.map(ele => (
                                                <div className='medal_wrap'>
                                                    <img src={ele.medalImg} className='m_img'></img>
                                                    <div className='medal_name'>{ele.title}</div>
                                                    <div className='medal_txt'>{ele.getTime}&nbsp;&nbsp;Lv.{ele.level}</div>
                                                </div>
                                            )) : <Empty className='block_center' />
                                        }
                                    </div>
                                </Card>
                            </Panel>
                            <Panel header="证书" key="auth" style={customPanelStyle}>
                                <Card className="mt_10" type="inner" title="">
                                    <div className='d_flex wrap'>
                                        {
                                            this.state.user_auth.length !== 0 ? this.state.user_auth.map(ele => (
                                                <div className='auth_wrap'>
                                                    <img src={bg_url} className='m_img'></img>
                                                    <Tooltip title={ele.content}>
                                                        <div className='medal_name text_more'>{ele.content}</div>
                                                    </Tooltip>
                                                    <div className='medal_txt'>{ele.getTime}</div>
                                                </div>
                                            )) : <Empty className='block_center' />
                                        }
                                    </div>
                                </Card>
                            </Panel>
                            <Panel header="培训班" key="7" style={customPanelStyle}>
                                <TableAntd size='small' dataSource={this.state.user_class} columns={this.class_col} rowKey={'squadId'} size={'small'} pagination={{
                                    showQuickJumper: true,
                                    showTotal: (total) => '总共' + total + '条'
                                }} />
                            </Panel>
                            <Panel header="地图" key="8" style={customPanelStyle}>
                                <TableAntd size='small' dataSource={this.state.user_map} columns={this.map_col} rowKey={'levelId'} size={'small'} pagination={{
                                    showQuickJumper: true,
                                    showTotal: (total) => '总共' + total + '条'
                                }} />
                            </Panel>
                            <Panel header="刮奖记录" key="80" style={customPanelStyle}>
                                <TableAntd size='small' dataSource={this.state.reward_record} columns={[
                                    { title: 'ID', dataIndex: 'rewardId', key: 'rewardId' },
                                    { title: '奖品', dataIndex: 'itemName', key: 'itemName' },
                                    { title: '中奖时间', dataIndex: 'winningTime', key: 'winningTime' }
                                ]} rowKey={'rewardId'} size={'small'} pagination={{
                                    showQuickJumper: true,
                                    showTotal: (total) => '总共' + total + '条',
                                    current: this.state.reward_page + 1,
                                    onChange: (val) => this.setState({ reward_page: val - 1 }, this.getGuaGuaRecord),
                                    total: this.state.reward_total,
                                }} />
                            </Panel>
                        </Collapse>
                    </PageHeader>
                </Card>
            </div>
        );
    }
    promote_col = [
        { title: '课程名', dataIndex: "contentName" },
        {
            title: '时间', dataIndex: "", render: ((item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            })
        },
        {
            title: '提成', dataIndex: "", render: ((item, ele) => {
                return ele.integral + '金币'
            })
        },
    ]
    draw_col = [
        {
            title: '金额', dataIndex: "amount", render: (item, ele) => {
                return '¥' + ele.amount
            }
        },
        {
            title: '提现时间', dataIndex: "", render: ((item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            })
        },
        {
            title: '提现途径', dataIndex: "", render: (item, ele) => {
                return ele.atype === 1 ? '支付宝' : ele.atype === 2 ? '银行卡' : '微信'
            }
        },
    ]
    level_log_col = [
        { title: 'ID', dataIndex: "levelHistoryId" },
        { title: '用户昵称', dataIndex: "nickname", },
        { title: '升降级', dataIndex: "actionType", render: (item, ele) => ele.actionType == 2 ? "降级" : "升级" },
        {
            title: '旧等级', dataIndex: "idLevelAfter", render: (item, ele) => {
                const flag_arg = {
                    '1': '直销员',
                    '2': '新用户',
                    '3': '服务中心员工',
                    '4': '店主',
                    '5': '客户代表',
                    '6': '客户经理',
                    '7': '中级经理',
                    '8': '客户总监',
                    '9': '高级客户总监',
                    'GG': '资深客户总监',
                }
                if (ele.idLevelAfter)
                    return flag_arg[ele.idLevelAfter]
                else
                    return "无"
            }
        },
        {
            title: '新等级', dataIndex: "idLevelLatest", render: (item, ele) => {
                const flag_arg = {
                    '1': '直销员',
                    '2': '新用户',
                    '3': '服务中心员工',
                    '4': '店主',
                    '5': '客户代表',
                    '6': '客户经理',
                    '7': '中级经理',
                    '8': '客户总监',
                    '9': '高级客户总监',
                    'GG': '资深客户总监',
                }
                if (ele.idLevelLatest)
                    return flag_arg[ele.idLevelLatest]
                else
                    return "无"
            }
        },
        { title: '升降级时间', dataIndex: "actionTime", render: (item, ele) => moment.unix(ele.actionTime).format('YYYY-MM-DD HH:mm') },
        // { title:'升降级时间',dataIndex:"pubTime",render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm') },
    ]
    activity_col = [
        { title: 'ID', dataIndex: "activityId" },
        { title: '活动昵称', dataIndex: "username", },
        { title: '活动作品名', dataIndex: "workName" },
        { title: '手机号', dataIndex: "mobile", },
        {
            title: '活动作品数量', dataIndex: "", render: (item, ele) => {
                if (ele.galleries.length > 0) {
                    return (
                        <div>{ele.galleries.length}</div>
                    )
                } else {
                    return '0'
                }
            }
        },
    ]
    order_col = [
        {
            title: '订单流水号',
            dataIndex: 'orderSn',
            key: 'orderSn',
            ellipsis: false,
        },
        {
            title: '商品名称',
            dataIndex: 'orderGoods',
            key: 'orderGoods',
            ellipsis: false,
            width: 288,
            render: (item, ele) => ele.orderGoods.map(_ele => (
                <Tag>{_ele.goodsName}</Tag>
            ))
        },
        {
            title: '价格', dataIndex: '', key: '', render: (item, ele) => {
                return (
                    <>
                        {
                            ele.integralAmount > 0 ?
                                <span>{ele.integralAmount}金币</span>
                                :
                                null
                        }
                        {
                            ele.goodsAmount > 0 ?
                                <span>¥{ele.goodsAmount}</span>
                                :
                                null
                        }
                    </>
                )
            }
        },
        {
            title: '支付金额', dataIndex: '', key: '', render: (item, ele) => {
                return (
                    <>
                        {
                            ele.integralAmount > 0 ?
                                <span>{ele.integralAmount}金币</span>
                                :
                                null
                        }
                        {
                            ele.goodsAmount > 0 ?
                                <span>¥{ele.orderAmount}</span>
                                :
                                null
                        }
                    </>
                )
            }
        },
        {
            title: '订单状态', dataIndex: 'orderStatus', key: 'orderStatus',
            render: (item, ele) =>
                ele.orderStatus == 0 ?
                    (ele.shippingStatus == 1 ? '已发货' : ele.shippingStatus == 2 ? '已完成' : '订单正常') :
                    ele.orderStatus == 1 ? '订单取消' :
                        ele.orderStatus == 2 ? '退款' :
                            ele.orderStatus == 3 ? '退款退货' :
                                ele.orderStatus == 4 ? '换货' : ''
        },
        { title: '下单时间', dataIndex: 'payTime', key: 'payTime', render: (item, ele) => moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm') },

    ]
    map_col = [
        {
            title: '关卡名称',
            dataIndex: 'levelName',
            key: 'levelName',
            ellipsis: false,
        },
        {
            title: '闯关',
            dataIndex: 'paper',
            key: 'paper',
            ellipsis: false,
            render: (item, ele) => {
                const { paper, course } = ele
                let content = []
                if (paper && paper !== null) {
                    const { paperName, finish } = paper
                    content.push(<Tag>试卷：{paperName}({finish ? '已完成' : '未完成'})</Tag>)
                }
                if (course && course !== null) {
                    const { courseName, finish } = course
                    content.push(<Tag>课程：{courseName}({finish ? '已完成' : '未完成'})</Tag>)
                }
                return content
            }
        },
        {
            title: '最高分数值',
            dataIndex: 'score',
            key: 'score',
            ellipsis: false,
        },
        {
            title: '关卡解锁时间',
            dataIndex: 'unLockTime',
            key: 'unLockTime',
            ellipsis: false,
        },
    ]

    class_col = [
        {
            title: '培训班名称',
            dataIndex: 'squadName',
            key: 'squadName',
            ellipsis: false,
        },
        {
            title: '时间',
            dataIndex: 'applyTime',
            key: 'applyTime',
            ellipsis: false,
        },
    ]
    learn_col = [
        {
            title: '内容',
            dataIndex: 'contentName',
            key: 'contentName',
            ellipsis: false,
            render: (item, ele, _e) => {
                return (
                    <div>
                        <div>学习《{ele.courseName}》课程</div>
                        {
                            ele.userCourseList ?
                                <div>
                                    {
                                        ele.userCourseList.map(val => {
                                            return (
                                                <div style={{ color: '#999999' }}>明细：{val.contentName}</div>
                                            )
                                        })
                                    }
                                </div>
                                : null
                        }
                    </div>
                )
            }
        },
        {
            title: '金币数',
            dataIndex: 'integral',
            key: 'integral',
            ellipsis: false,
            render: (item, ele, _e) => {
                return (
                    <div>
                        {
                            this.state.activeTab == '1' ?
                                null :
                                <div>
                                    <div>{ele.integral}</div>
                                    {
                                        ele.userCourseList ?
                                            <div>
                                                {
                                                    ele.userCourseList.map(val => {
                                                        return (
                                                            <div style={{ color: '#999999' }}>{val.integral}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            : null
                                    }
                                </div>
                        }
                    </div>
                )
            }
        },
        {
            title: '时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            ellipsis: false,
            render: (item, ele, _e) => {
                return (
                    <div>
                        {
                            ele.updateTime ?
                                <div>
                                    <div>{moment.unix(ele.updateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                    {
                                        ele.userCourseList ?
                                            <div>
                                                {
                                                    ele.userCourseList.map(val => {
                                                        return (
                                                            <div style={{ color: '#999999' }}>{moment.unix(val.pubTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            : null
                                    }
                                </div>
                                :
                                <div>无</div>
                        }
                    </div>
                )
            }
        },
    ]
    learn_cols = [
        {
            title: '内容',
            dataIndex: 'contentName',
            key: 'contentName',
            ellipsis: false,
            render: (item, ele, _e) => {
                return (
                    <div>
                        <div>学习《{ele.courseName}》课程</div>
                        {
                            ele.userCourseList ?
                                <div>
                                    {
                                        ele.userCourseList.map(val => {
                                            return (
                                                <div style={{ color: '#999999' }}>明细：{val.contentName}</div>
                                            )
                                        })
                                    }
                                </div>
                                : null
                        }
                    </div>
                )
            }
        },
        {
            title: '进度',
            dataIndex: 'integral',
            key: 'integral',
            ellipsis: false,
            render: (item, ele, _e) => {
                return (
                    <div>

                        <div>
                            <div>{ele.progress}%</div>
                            {
                                ele.userCourseList ?
                                    <div>
                                        {
                                            ele.userCourseList.map(val => {
                                                return (
                                                    <div style={{ color: '#999999' }}>{val.progress}%</div>
                                                )
                                            })
                                        }
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                )
            }
        },
        {
            title: '金币数',
            dataIndex: 'integral',
            key: 'integral',
            ellipsis: false,
            render: (item, ele, _e) => {
                return (
                    <div>
                        {
                            this.state.activeTab == '1' ?
                                null :
                                <div>
                                    <div>{ele.integral}</div>
                                    {
                                        ele.userCourseList ?
                                            <div>
                                                {
                                                    ele.userCourseList.map(val => {
                                                        return (
                                                            <div style={{ color: '#999999' }}>{val.integral}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            : null
                                    }
                                </div>
                        }
                    </div>
                )
            }
        },
        {
            title: '时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            ellipsis: false,
            render: (item, ele, _e) => {
                return (
                    <div>
                        {
                            ele.updateTime ?
                                <div>
                                    <div>{moment.unix(ele.updateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                    {
                                        ele.userCourseList ?
                                            <div>
                                                {
                                                    ele.userCourseList.map(val => {
                                                        return (
                                                            <div style={{ color: '#999999' }}>{moment.unix(val.pubTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            : null
                                    }
                                </div>
                                :
                                <div>无</div>
                        }
                    </div>
                )
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


const LayoutComponent = UserView;
const mapStateToProps = state => {
    return {
        user_info: state.user.user_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });