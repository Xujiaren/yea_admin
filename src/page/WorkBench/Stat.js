import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { Tabs, Layout, Menu, Icon, Card, Empty } from 'antd';
import { CourseRatess,CourseRates,Manyis,Coursetsts,CourseText,Everypv, TeacherSex, TeacherArea, LiveKeyword, LivePerson, MessageBacks, ActinUser, Actin, ActMessage, WeiJing, JianKon, KechenChuXi, CashIntegralTeacher, CashIntegralRage, CashIntegralUsers, CashIntegral, WithdrawTeacher, OrderRecharge, CashTotal, CourseAgent, CourseSell, AmountTotal, CouponCome, CouponUse, ShopUsers, GoodsTable, GoodsRates, CourseAsks, OrderNumsFenxi, EveryDayTime, UserNumbers, ZhongUser, Zhibo, Xianxia, Manyi, Shouyi, Kaoshi, Guanzhu, Alluser, SquadPractise, SquadLast, Niandus, Youer, Xiaoshou, Tixian, Alives, Daylasting, Daystatic, WithOrder, ShopOrder, StaticOrder, Revenues, ReturnResons, OrdeReturn, OrderNums, UserTags, UserAge, WebSiteInfo, SenStats, CourseTag, AskInfo, AskChart, TeacherStat, GuaCardAvtivityDaily, ExpressInfo, CourseRate, UserActive, SenStat, CardAvtivityDaily, CoinRank, CoinOrigin, CoinConsume, CoinInfo, CourseComment, Feedback, CardAvtivity, CourseRelearn, CourseInfo, UserOnlineTime, UserLevel, UserFlag, UserStay, UserSex, UserDuration } from './Chart'
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,

} from '@ant-design/icons';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const Chart = React.lazy(() => import('./Chart'))

class Stat extends Component {
    state = {
        com: null,
        keys: ['userInfo']
    }
    componentWillMount() {

    }
    componentWillReceiveProps(n_props) {

    }
    componentDidMount() {
        this.setState({ com: this.userInfo })
    }
    userInfo = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='会员注册总人数' key="1">
                <Chart actions={this.props.actions}></Chart>
            </Tabs.TabPane>
            <Tabs.TabPane tab='用户概况' key="8">
                <Alluser actions={this.props.actions}></Alluser>
            </Tabs.TabPane>
            <Tabs.TabPane tab='用户活跃度' key="2">
                <UserActive actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='用户数' key="13">
                <UserNumbers actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='权益用户统计' key="3">
                <UserLevel actions={this.props.actions}></UserLevel>
            </Tabs.TabPane>
            <Tabs.TabPane tab='业绩用户统计' key="4">
                <UserFlag actions={this.props.actions}></UserFlag>
            </Tabs.TabPane>
            <Tabs.TabPane tab='用户留存率' key="5">
                <UserStay actions={this.props.actions}></UserStay>
            </Tabs.TabPane>
            <Tabs.TabPane tab='生命周期' key="7">
                <Alives actions={this.props.actions}></Alives>
            </Tabs.TabPane>
        </Tabs>
    )
    teacherInfo = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='讲师统计' key="1">
                <TeacherStat actions={this.props.actions}></TeacherStat>
            </Tabs.TabPane>
            <Tabs.TabPane tab='讲师关注' key="2">
                <Guanzhu actions={this.props.actions}></Guanzhu>
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab='讲师课程考试' key="3">
                <Kaoshi actions={this.props.actions}></Kaoshi>
            </Tabs.TabPane> */}
            <Tabs.TabPane tab='讲师收益' key="4">
                <Shouyi actions={this.props.actions}></Shouyi>
            </Tabs.TabPane>
            <Tabs.TabPane tab='讲师满意度' key="5">
                <Manyi actions={this.props.actions}></Manyi>
            </Tabs.TabPane>
            <Tabs.TabPane tab='各课程意度' key="6">
                <Manyis actions={this.props.actions}></Manyis>
            </Tabs.TabPane>
        </Tabs>
    )
    userAct = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='用户画像' key="1">
                <Card title='用户画像' bordered={false} size='small' bodyStyle={{ padding: 20 }}

                >
                    <UserSex actions={this.props.actions}></UserSex>
                </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab='用户年龄' key="2">
                <Card title='用户年龄' bordered={false} size='small' bodyStyle={{ padding: 20 }}

                >
                    <UserAge actions={this.props.actions}></UserAge>
                </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab='用户在线时间段分布' key="3">
                <EveryDayTime actions={this.props.actions}></EveryDayTime>
            </Tabs.TabPane>
        </Tabs>
    )
    contentFlood = (
        <>
            <UserDuration actions={this.props.actions}></UserDuration>
            <UserOnlineTime actions={this.props.actions}></UserOnlineTime>
        </>
    )
    contentAnalysis = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='课程概况' key="1">
                <CourseInfo actions={this.props.actions}></CourseInfo>
            </Tabs.TabPane>
            <Tabs.TabPane tab='课程评分' key="2">
                <CourseRate actions={this.props.actions}></CourseRate>
            </Tabs.TabPane>
            <Tabs.TabPane tab='课程学习' key="3">
                <div className='text_center'>
                    <a className='mt_40' onClick={() => {
                        this.props.history.push('/course-manager/video-course/1')
                    }}>
                        前往课程列表查看单门课程数据
                    </a>
                </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab='复学报表' key="4">
                <CourseRelearn actions={this.props.actions}></CourseRelearn>
            </Tabs.TabPane>
            <Tabs.TabPane tab='直播统计' key="5">
                <Zhibo actions={this.props.actions}></Zhibo>
            </Tabs.TabPane>
            <Tabs.TabPane tab='直播观众分布图' key="6">
                <LivePerson actions={this.props.actions}></LivePerson>
            </Tabs.TabPane>
            <Tabs.TabPane tab='直播评论关键词' key="7">
                <LiveKeyword actions={this.props.actions}></LiveKeyword>
            </Tabs.TabPane>
            <Tabs.TabPane tab='各板块pv、uv分析' key="8">
                <Everypv actions={this.props.actions}></Everypv>
            </Tabs.TabPane>
        </Tabs>
    )
    activeInfo = (
        <>
            <CardAvtivity actions={this.props.actions}></CardAvtivity>
        </>
    )
    coinInfo = (
        <>
            <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
                <Tabs.TabPane tab='金币概况' key="1">
                    <CoinInfo actions={this.props.actions}></CoinInfo>
                </Tabs.TabPane>
                <Tabs.TabPane tab='金币消耗统计' key="2">
                    <CoinConsume actions={this.props.actions}></CoinConsume>
                </Tabs.TabPane>
                <Tabs.TabPane tab='金币获得统计' key="3">
                    <CoinOrigin actions={this.props.actions}></CoinOrigin>
                </Tabs.TabPane>
                <Tabs.TabPane tab='金币排行榜' key="4">
                    <CoinRank actions={this.props.actions} />
                </Tabs.TabPane>
                <Tabs.TabPane tab='金币余额' key="5">
                    <Youer actions={this.props.actions} />
                </Tabs.TabPane>
            </Tabs>
        </>
    )
    todoInfo = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='会员反馈帮助数量统计' key="1">
                <Feedback actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='会员反馈明细报表' key="6">
                <div className='text_center'>
                    <a className='mt_40' onClick={() => {
                        this.props.history.push('/workbench/excel-manager')
                    }}>
                        前往报表管理查看会员反馈明细报表
                    </a>
                </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab='消息看板' key="14">
                <MessageBacks actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='课程评论审核' key="2">
                <CourseComment actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='邮寄' key="5">
                <ExpressInfo actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='翻牌抽奖' key="3">
                <CardAvtivityDaily actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='刮刮卡' key="7">
                <GuaCardAvtivityDaily actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='敏感词管理' key="4">
                <SenStat actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='优惠券' key="8">
                <SenStats actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='优惠券使用情况' key="11">
                <CouponUse actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='赠券渠道分析' key="12">
                <CouponCome actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='年度账单' key="9">
                <Niandus actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='中奖用户概况' key="10">
                <ZhongUser actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='违禁分析' key="13">
                <WeiJing actions={this.props.actions} />
            </Tabs.TabPane>
        </Tabs>
    )
    newsInfo = (
        <div className='text_center'>
            <a className='mt_40' onClick={() => {
                this.props.history.push('/news/list')
            }}>
                前往资讯列表查看资讯数据统计
            </a>
        </div>
    )
    AskPanel = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='问吧看板' key="1">
                <AskInfo actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='问吧统计' key="6">
                <AskChart actions={this.props.actions}></AskChart>
            </Tabs.TabPane>
        </Tabs>
    )
    UserLike = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='课程标签分析' key="1">
                <UserTags actions={this.props.actions} />
            </Tabs.TabPane>
        </Tabs>
    )
    Malls = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='销量排行' key="1">
                <OrderNums actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='销售分析' key="2">
                <OrderNumsFenxi actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='商品转换率' key="3">
                <GoodsRates actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='商城流量分析' key="4">
                <GoodsTable actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='商城访客分析' key="5">
                <ShopUsers actions={this.props.actions} />
            </Tabs.TabPane>
        </Tabs>
    )
    Returns = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='退货统计' key="1">
                <OrdeReturn actions={this.props.actions} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='退货原因分析' key="2">
                <ReturnResons actions={this.props.actions}></ReturnResons>
            </Tabs.TabPane>
        </Tabs>
    )
    Revenue = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='财务看板数据' key="1">
                <Revenues actions={this.props.actions}></Revenues>
            </Tabs.TabPane>
            <Tabs.TabPane tab='销售分析' key="2">
                <Xiaoshou actions={this.props.actions}></Xiaoshou>
            </Tabs.TabPane>
            <Tabs.TabPane tab='经营状况' key="3">
                <AmountTotal actions={this.props.actions}></AmountTotal>
            </Tabs.TabPane>
            <Tabs.TabPane tab='课程销量排行' key="4">
                <CourseSell actions={this.props.actions}></CourseSell>
            </Tabs.TabPane>
            <Tabs.TabPane tab='课程分销分析' key="5">
                <CourseAgent actions={this.props.actions}></CourseAgent>
            </Tabs.TabPane>
            <Tabs.TabPane tab='课程销售分析' key="6">
                <CourseRates actions={this.props.actions}></CourseRates>
            </Tabs.TabPane>
            <Tabs.TabPane tab='单课销售分析' key="9">
                <CourseRatess actions={this.props.actions}></CourseRatess>
            </Tabs.TabPane>
        </Tabs>
    )
    Orders = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='课程订单分析' key="1">
                <StaticOrder actions={this.props.actions}></StaticOrder>
            </Tabs.TabPane>
            <Tabs.TabPane tab='商城订单分析' key="2">
                <ShopOrder actions={this.props.actions}></ShopOrder>
            </Tabs.TabPane>
        </Tabs>
    )
    WidthOrder = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='提现分析' key="1">
                <WithOrder actions={this.props.actions}></WithOrder>
            </Tabs.TabPane>
            <Tabs.TabPane tab='提现排行' key="2">
                <Tixian actions={this.props.actions}></Tixian>
            </Tabs.TabPane>
        </Tabs>
    )
    Daystatic = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='每日签到' key="1">
                <Daystatic actions={this.props.actions}></Daystatic>
            </Tabs.TabPane>
            <Tabs.TabPane tab='连续签到' key="2">
                <Daylasting actions={this.props.actions}></Daylasting>
            </Tabs.TabPane>
        </Tabs>
    )
    squads = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='考试情况统计' key="1">
                <SquadLast actions={this.props.actions}></SquadLast>
            </Tabs.TabPane>
            <Tabs.TabPane tab='练习情况统计' key="2">
                <SquadPractise actions={this.props.actions}></SquadPractise>
            </Tabs.TabPane>
        </Tabs>
    )
    xianxia = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='线下课程报名统计' key="1">
                <Xianxia actions={this.props.actions}></Xianxia>
            </Tabs.TabPane>
        </Tabs>
    )
    o2o = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='课程出席统计' key="1">
                <KechenChuXi actions={this.props.actions}></KechenChuXi>
            </Tabs.TabPane>
            <Tabs.TabPane tab='活动过程监控' key="2">
                <JianKon actions={this.props.actions}></JianKon>
            </Tabs.TabPane>
        </Tabs>
    )
    cashall = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='资金情况' key="1">
                <CashTotal actions={this.props.actions}></CashTotal>
            </Tabs.TabPane>
            <Tabs.TabPane tab='充值订单' key="2">
                <OrderRecharge actions={this.props.actions}></OrderRecharge>
            </Tabs.TabPane>
            <Tabs.TabPane tab='讲师提现' key="3">
                <WithdrawTeacher actions={this.props.actions}></WithdrawTeacher>
            </Tabs.TabPane>
            <Tabs.TabPane tab='商城金币情况' key="4">
                <CashIntegral actions={this.props.actions}></CashIntegral>
            </Tabs.TabPane>
            <Tabs.TabPane tab='用户金币情况' key="5">
                <CashIntegralUsers actions={this.props.actions}></CashIntegralUsers>
            </Tabs.TabPane>
            <Tabs.TabPane tab='平台金币情况' key="6">
                <CashIntegralRage actions={this.props.actions}></CashIntegralRage>
            </Tabs.TabPane>
            <Tabs.TabPane tab='讲师金币情况' key="7">
                <CashIntegralTeacher actions={this.props.actions}></CashIntegralTeacher>
            </Tabs.TabPane>
        </Tabs>
    )
    activity = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='活动消息发送情况' key="1">
                <ActMessage actions={this.props.actions}></ActMessage>
            </Tabs.TabPane>
            <Tabs.TabPane tab='活动参与情况' key="2">
                <Actin actions={this.props.actions}></Actin>
            </Tabs.TabPane>
            <Tabs.TabPane tab='活动参与用户明细导出' key="3">
                <ActinUser actions={this.props.actions}></ActinUser>
            </Tabs.TabPane>
        </Tabs>
    )
    courseAsk = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='课程问卷' key="1">
                <CourseAsks actions={this.props.actions}></CourseAsks>
            </Tabs.TabPane>
            <Tabs.TabPane tab='课程问卷详情' key="2">
                <TeacherSex actions={this.props}></TeacherSex>
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab='课程问卷地区' key="3">
                <TeacherArea actions={this.props.actions}></TeacherArea>
            </Tabs.TabPane> */}
        </Tabs>
    )
    courseTest = (
        <Tabs defaultActiveKey="1" size={{ size: 'small' }}>
            <Tabs.TabPane tab='课程考试' key="1">
                <Coursetsts actions={this.props.actions}></Coursetsts>
            </Tabs.TabPane>
            <Tabs.TabPane tab='课程考试分析' key="2">
                <CourseText actions={this.props}></CourseText>
            </Tabs.TabPane>
        </Tabs>
    )
    nullCom = <Empty className='animated fadeIn'></Empty>
    onMenuClick = ({ item, key, keyPath }) => {

        switch (key) {
            case 'userInfo':
                this.setState({ com: this.userInfo })
                break;
            case 'teacherInfo':
                this.setState({ com: this.teacherInfo })
                break;
            case 'userAnalysis':
                this.setState({ com: this.userAct })
                break;
            case 'contentFlood':
                this.setState({ com: this.contentFlood })
                break;
            case 'contentAnalysis':
                this.setState({ com: this.contentAnalysis })
                break;
            case 'activeInfo':
                this.setState({ com: this.activeInfo })
                break;
            case 'todoInfo':
                this.setState({ com: this.todoInfo })
                break;
            case 'coinInfo':
                this.setState({ com: this.coinInfo })
                break;
            case 'newsInfo':
                this.setState({ com: this.newsInfo })
                break;
            case 'askPanel':
                this.setState({ com: this.AskPanel })
                break;
            case 'userLike':
                this.setState({ com: this.UserLike })
                break;
            case 'Malls':
                this.setState({ com: this.Malls })
                break;
            case 'Returns':
                this.setState({ com: this.Returns })
                break;
            case 'Revenue':
                this.setState({ com: this.Revenue })
                break;
            case 'Orders':
                this.setState({ com: this.Orders })
                break;
            case 'WidthOrder':
                this.setState({ com: this.WidthOrder })
                break;
            case 'Daystatic':
                this.setState({ com: this.Daystatic })
                break;
            case 'squads':
                this.setState({ com: this.squads })
                break;
            case 'xianxia':
                this.setState({ com: this.xianxia })
                break;
            case 'cashall':
                this.setState({ com: this.cashall })
                break;
            case 'o2o':
                this.setState({ com: this.o2o })
                break;
            case 'activity':
                this.setState({ com: this.activity })
                break;
            case 'courseAsk':
                this.setState({ com: this.courseAsk })
                break;
            case 'courseTest':
                this.setState({ com: this.courseTest })
                break;
            default:
                this.setState({ com: this.nullCom })

                this.setState({ keys: key })
        }
    }
    render() {
        const { com, keys } = this.state
        return (
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['userInfo']}
                        defaultOpenKeys={['sub1', 'sub2', 'sub3']}
                        style={{ height: '100%' }}
                        onClick={this.onMenuClick}
                    >
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="user" />
                                    用户分析
                                </span>
                            }
                        >
                            <Menu.Item key="userInfo">基本信息</Menu.Item>
                            <Menu.Item key="userAnalysis">行为分析</Menu.Item>
                            <Menu.Item key="userLike">偏好兴趣</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub10"
                            title={
                                <span>
                                    <Icon type="user" />
                                    讲师
                                </span>
                            }
                        >
                            <Menu.Item key="teacherInfo">基本信息</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                                    <Icon type="laptop" />
                                    内容运营
                                </span>
                            }
                        >
                            <Menu.Item key="contentFlood">流量分析</Menu.Item>
                            <Menu.Item key="contentAnalysis">内容分析</Menu.Item>
                            <Menu.Item key="courseAsk">课程问卷分析</Menu.Item>
                            <Menu.Item key="courseTest">课程考试分析</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub3"
                            title={
                                <span>
                                    <Icon type="notification" />
                                    营销推广
                                </span>
                            }
                        >
                            {/* <Menu.Item key="inviteInfo">推广分析</Menu.Item>
                        <Menu.Item key="wayInfo">渠道分析</Menu.Item> */}
                            <Menu.Item key="activeInfo">活动分析</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="askPanel"> <Icon type="laptop" />问吧</Menu.Item>
                        <SubMenu
                            key="sub5"
                            title={
                                <span>
                                    <Icon type="notification" />
                                    财报收入
                                </span>
                            }
                        >
                            <Menu.Item key="coinInfo">金币分析</Menu.Item>
                            <Menu.Item key="Revenue">营收分析</Menu.Item>
                            <Menu.Item key="Orders">订单分析</Menu.Item>
                            <Menu.Item key="WidthOrder">提现分析</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub6"
                            title={
                                <span>
                                    <Icon type="notification" />
                                    运营
                                </span>
                            }
                        >
                            <Menu.Item key="todoInfo">待办事项</Menu.Item>
                            <Menu.Item key="Daystatic">签到统计</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub11"
                            title={
                                <span>
                                    <Icon type="notification" />
                                    财务情况
                                </span>
                            }
                        >
                            <Menu.Item key="cashall">财务情况</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub7"
                            title={
                                <span>
                                    <Icon type="notification" />
                                    商城
                                </span>
                            }
                        >
                            <Menu.Item key="Malls">销售分析</Menu.Item>
                            <Menu.Item key="Returns">售后分析</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub8"
                            title={
                                <span>
                                    <Icon type="notification" />
                                    资讯数据
                                </span>
                            }
                        >
                            <Menu.Item key="newsInfo">资讯数据分析</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub9"
                            title={
                                <span>
                                    <Icon type="notification" />
                                    职业资格认证
                                </span>
                            }
                        >
                            <Menu.Item key="squads">职业资格统计</Menu.Item>
                            <Menu.Item key="xianxia">线下课程</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="o2o"> <Icon type="notification" />O2O</Menu.Item>
                        <SubMenu
                            key="sub12"
                            title={
                                <span>
                                    <Icon type="notification" />
                                    活动
                                </span>
                            }
                        >
                            <Menu.Item key="activity">活动数据分析</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    {com}
                </Content>
            </Layout>
        )
    }
}

const LayoutComponent = Stat;
const mapStateToProps = state => {
    return {
        user: state.site.user,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
