import React, { Component } from 'react';
import { CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Select,Tabs,Card, DatePicker,Menu, Dropdown, Button, Icon, message,Input} from 'antd';
import { Line , Pie,Bar,HorizontalBar} from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import connectComponent from '../../util/connect';
import _ from 'lodash'

const { TabPane } = Tabs;
const { Search } = Input;
const {Option} = Select;

const options = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: true
}

const bar_options = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: true,
    
    animation: {
        
        duration: 0,
        onComplete: function() {
            var chartInstance = this.chart,
            ctx = chartInstance.ctx;
            //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = '#006080';

            this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function(arc, index) {
                    var data = dataset.data[index];
                    var ct=Math.round(arc._model.width*0.35);
                    //if(ct<12){ct=12;}
                    ctx.font='12px Arial';

                    ctx.fillText(data, arc._model.x, data>=0?arc._model.y :arc._model.y+15);
                });
            });
        }
    }
}
let line_course = {
    labels: [],
    datasets: [
        {   
            key:'course',
            maxBarThickness:50,
            label:'课程评论数',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgb(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
//line_comment
let line_comment = {
    labels: [],
    datasets: [
        {   
            key:'user_comment',
            maxBarThickness:50,
            label:'评论数',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgb(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
let line_auth = {
    labels: [],
    datasets: [
        {   
            key:'user',
            maxBarThickness:50,
            label:'认证用户',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgb(100, 190, 255,0.4)',
            data:[]
        }
    ]
}

let line_flag = {
    labels: [],
    datasets: [
        {   
            key:'user',
            maxBarThickness:50,
            label:'用户身份人数',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgb(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
let line_userlevel = {
    labels: [],
    datasets: [
        {   
            key:'level',
            maxBarThickness:50,
            label:'会员等级人数',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgb(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
let line_user = {
    labels: [],
    datasets: [
        {
            key:'2',
            label: '被邀请注册数',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: '#ec932f',
    
            borderDash: [],

            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ec932f',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        },
        {
            key:'3',
            label: '主动注册数',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#bebebe',
            borderColor: 'rgba(75,192,192,1)',

            borderDash: [],

            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        },
    ],
};

let line_integral = {
    labels: [],
    datasets: [
        {
            key:'integral_0',
            label: '获得积分',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: '#ec932f',
    
            borderDash: [],

            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ec932f',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        },
        {
            key:'integral_1',
            label: '消耗积分',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#bebebe',
            borderColor: 'rgba(75,192,192,1)',

            borderDash: [],

            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        },
    ],
};
const pie = {
    labels: [
      'data',
      'data',
    ],
    datasets: [
      { 
        key:'bar1',
        data: [300, 50],
        backgroundColor: [
          '#FF6384',
          '#FFCE56',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#FFCE56',
        ],
      }],
};
const flag_arg = {
    '1':'直销员',
    '2':'新用户',
    '3':'服务中心员工',
    '4':'服务中心负责人',
    '5':'优惠顾客',
    '6':'初级经理',
    '7':'中级经理',
    '8':'客户总监',
    '9':'高级客户总监',
    'GG':'资深客户总监及以上'
}
const course_sort = {
    'comment':'课程评论数',
    'hit':'课程播放数',
    'learn':'课程学习数',
    'score':'课程评分',
    'finish':'课程完成率'
}
class Statistic extends Component {

    constructor(props){
        super(props)
        this.state = {

            course_sort:'comment',
            course_limit:20,
            
        }
        this.stat_course = []

        this.line_user = line_user
        this.line_integral = line_integral

        this.line_userlevel = line_userlevel
        this.line_flag = line_flag

        this.line_course = line_course
        this.line_auth = line_auth
        this.line_comment = line_comment
    }
    componentDidMount(){
        const {actions} = this.props

		actions.getStatUser({timeType:0})
		actions.getStatUserLevel()
        actions.getStatIntegral({timeType:0})
        actions.getStatFlag()
        actions.getStatCourse({sort:'comment',limit:20})

        actions.getStatAuth()
        actions.getStatComment()
	}
	componentWillReceiveProps(n_props){
        const {course_sort,course_limit} = this.state


        if(n_props.stat_auth !== this.props.stat_auth){
            const {stat_auth} = n_props
            let label = []
            let data = []
            let _label = {auth:'认证',noauth:'未认证'}

            Object.keys(stat_auth).map(ele=>{
                label.push(_label[ele])
                data.push(stat_auth[ele])
            })

            this.line_auth.labels = label
            this.line_auth.datasets[0].data = data
        }
        if(n_props.stat_comment !== this.props.stat_comment){
            const {stat_comment} = n_props
            let label = []
            let data = []
            console.log(stat_comment)
            let _label = {all:'总评论数',pass:'通过',reject:'拒绝',wait:'待审核'}
            Object.keys(stat_comment).map(ele=>{
                label.push(_label[ele])
                data.push(stat_comment[ele])
            })

            this.line_comment.labels = label
            this.line_comment.datasets[0].data = data
        }
        if(n_props.stat_course !== this.props.stat_course){
            const {stat_course} = n_props
            let labels = []
            let data = []
            this.stat_course = stat_course
            stat_course.map(ele=>{
                if(ele[1].length>15)
                    ele[1] = ele[1].slice(0,15)+'...'
                labels.push(ele[1])
                if(course_sort == 'finish'){
                    data.push(ele[2].toFixed(2))
                }else{
                    data.push(ele[2])
                }
                

            })
            let label = '课程评论数'
            if(course_sort == 'comment')
                label = '课程评论数'
            if(course_sort == 'hit')
                label = '课程播放数'
            if(course_sort == 'learn')
                label = '课程学习数'
            if(course_sort == 'score')
                label = '课程评分'
            if(course_sort == 'finish'){
                label = '课程完成率(%)'
            }
                
            
            this.line_course.labels = labels
            this.line_course.datasets[0].label =label
            this.line_course.datasets[0].data = data
            this.line_course.datasets[0].maxBarThickness = 15
        }
        if(n_props.stat_flag !== this.props.stat_flag){
            const {stat_flag} = n_props
            let label = []
            let data = []

            Object.keys(stat_flag).map(ele=>{
                label.push(flag_arg[ele])
                data.push(stat_flag[ele])
            })

            this.line_flag.labels = label
            this.line_flag.datasets[0].data = data
        }
		if(n_props.stat_integral !== this.props.stat_integral){
            const {stat_integral} = n_props
            let label = []
            let _in = []
            let _out =[]

            Object.keys(stat_integral).map(ele=>{
                label.push(ele)
                _in.push(stat_integral[ele].in)
                _out.push(stat_integral[ele].out)
            })

            this.line_integral.labels = label
            this.line_integral.datasets[0].data = _in
            this.line_integral.datasets[0].label ='获得积分'
            this.line_integral.datasets[0].key ='integral_0'
            this.line_integral.datasets[1].key ='integral_1'
            this.line_integral.datasets[1].data = _out
            this.line_integral.datasets[1].label ='消耗积分'

        }
        if(n_props.stat_userLevel !== this.props.stat_userLevel ){
    
            const {stat_userLevel} = n_props
            let label = []
            let data = []

            Object.keys(stat_userLevel).map(ele=>{
                label.push('LV'+ele)
                data.push(stat_userLevel[ele])
            })

            this.line_userlevel.labels = label
            this.line_userlevel.datasets[0].data = data
        }
        if(n_props.stat_user !== this.props.stat_user ){

            const {stat_user} = n_props
            let label = []
            let be_invite = []
            let invite =[]

            Object.keys(stat_user).map(ele=>{
                label.push(ele)
                be_invite.push(stat_user[ele].parent)
                invite.push(stat_user[ele].self)
            })
            this.line_user.labels = label
            this.line_user.datasets[0].data = be_invite
            this.line_user.datasets[0].label ='被邀请注册数'
            this.line_user.datasets[1].data = invite
            this.line_user.datasets[1].label ='注册数'

        }
	}
    _onCourseClick = (ele)=>{
        if(ele.length!==0){
            let id = this.stat_course[ele[0]._index][0]
            this.props.history.push({
                pathname:'/course-manager/view-course/'+id,
                state:{
                    tab:3
                }
            })
        }
        
    }

    render() {
        return (
        <div className="animated fadeIn">
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="会员统计" key="1">
                        <Row>
                            <Col xl="6" md='12' sm='12' className="mt_10">
                                <Card className='static_card' type="inner" title="会员注册总人数" extra={(
                                    <div className="flex row align_items">
                                        {/*
                                        <Select defaultValue="0">
                                            <Option value="0">没有验证</Option>
                                            <Option value="1">实名验证</Option>
                                        </Select>
                                        */}
                                        <Select 
                                            defaultValue={0}
                                            onChange={val=>{
                                                const {actions} = this.props
                                                actions.getStatUser({timeType:val})
                                            }}
                                        >
                                            <Option value={0}>最近7天</Option>
                                            <Option value={1}>最近15天</Option>
                                            <Option value={2}>最近1月</Option>
                                        </Select>
                                    </div>
                                    )}>
                                        <div className="chart-wrapper">
                                            {!this.state.view?<div>无查看权限</div>:
                                                <Line height={150} data={this.line_user} options={options} />
                                            }
                                        </div>
                                </Card>
                                <Card className="mt_10 static_card" type="inner" title="会员使用积分" extra={(
                                    <div className="flex row align_items">
                                        {/*
                                        <Select defaultValue="0">
                                            <Option value="0">总积分</Option>
                                            <Option value="1">使用积分</Option>
                                        </Select>
                                        */}
                                        <Select defaultValue="0"
                                            onChange={val=>{
                                                const {actions} = this.props
                                                actions.getStatIntegral({timeType:val})
                                            }}
                                        >
                                            <Option value="0">最近7天</Option>
                                            <Option value="1">最近15天</Option>
                                            <Option value="2">最近1月</Option>
                                        </Select>
                                    </div>
                                    )}>
                                        <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Line height={150} data={this.line_integral} options={options} />
                                        }
                                        </div>
                                </Card>
                                <Card className="mt_10 static_card" type="inner" title="认证用户统计" extra={(
                                    <div className="flex row align_items">
                                        {/*<Select defaultValue="0">
                                            <Option value="0">LV1</Option>
                                            <Option value="1">LV2</Option>
                                            <Option value="2">LV3</Option>
                                        </Select>
                                        <Select defaultValue="0">
                                            <Option value="0">最近7天</Option>
                                            <Option value="1">最近1月</Option>
                                            <Option value="2">最近3月</Option>
                                        </Select>*/}
                                    </div>
                                    )}>
                                        <div className="chart-wrapper chart_pos">
                                        <div className='fix_wrap'></div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.line_auth} options={bar_options} />
                                        }
                                        </div>
                                </Card>
                            </Col>
                            <Col xl="6" md='12' sm='12' className="mt_10">
                                <Card className='static_card' type="inner" title="各个等级会员统计" extra={(
                                    <div className="flex row align_items">
                                    {/*
                                        <Select defaultValue="0">
                                            <Option value="0">LV1</Option>
                                            <Option value="1">LV2</Option>
                                            <Option value="2">LV3</Option>
                                        </Select>
                                    
                                        <Select defaultValue="0">
                                            <Option value="0">最近7天</Option>
                                            <Option value="1">最近1月</Option>
                                            <Option value="2">最近3月</Option>
                                        </Select>
                                    */}
                                    </div>
                                    )}>
                                        <div className="chart-wrapper chart_pos">
                                        <div className='fix_wrap'></div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.line_userlevel} options={bar_options} />
                                        }
                                        </div>
                                </Card>
                                <Card className="mt_10 static_card" type="inner" title="业务员等级用户统计" extra={(
                                    <div className="flex row align_items">
                                        {/*<Select defaultValue="0">
                                            <Option value="0">LV1</Option>
                                            <Option value="1">LV2</Option>
                                            <Option value="2">LV3</Option>
                                        </Select>
                                        <Select defaultValue="0">
                                            <Option value="0">最近7天</Option>
                                            <Option value="1">最近1月</Option>
                                            <Option value="2">最近3月</Option>
                                        </Select>*/}
                                    </div>
                                    )}>
                                        <div className="chart-wrapper chart_pos">
                                        <div className='fix_wrap'></div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.line_flag} options={bar_options} />
                                        }
                                        </div>
                                </Card>
                                <Card className="mt_10 static_card" type="inner" title="评论数统计" extra={(
                                    <div className="flex row align_items">
                                        {/*<Select defaultValue="0">
                                            <Option value="0">LV1</Option>
                                            <Option value="1">LV2</Option>
                                            <Option value="2">LV3</Option>
                                        </Select>
                                        <Select defaultValue="0">
                                                    <Option value="0">最近7天</Option>
                                            <Option value="1">最近1月</Option>
                                            <Option value="2">最近3月</Option>
                                        </Select>*/}
                                    </div>
                                    )}>
                                        <div className="chart-wrapper chart_pos">
                                            <div className='fix_wrap'></div>
                                            {!this.state.view?<div>无查看权限</div>:
                                                <Bar height={150} data={this.line_comment} options={bar_options} />
                                            }
                                        </div>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="数据监控" key="2">
                        <Row>
                            <Col xl="6">
                                <Card type="inner" title="热门搜词" extra={(
                                    <div className="flex row align_items">
                                        <Input.Group compact>
                                            <Input disabled value={'展示数量'} style={{width:'80px'}}/>
                                            <Select defaultValue="0">
                                                <Option value="0">10</Option>
                                                <Option value="1">20</Option>
                                                <Option value="2">30</Option>
                                            </Select>
                                        </Input.Group>&nbsp;
                                        <Select defaultValue="0">
                                            <Option value="0">最近7天</Option>
                                            <Option value="1">最近1月</Option>
                                            <Option value="2">最近3月</Option>
                                        </Select>
                                    </div>
                                    )}>
                                        <div className="chart-wrapper">
                                           {/* <Line height={130} data={null} options={options} />*/}
                                        </div>
                                </Card>
                                
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="课程数据统计" key="3">
                        <Row>
                            <Col xl="12" className="mt_10">
                                <Card type="inner" title={course_sort[this.state.course_sort]}  extra={(
                                    <div className="flex row align_items">
                                        <Input.Group compact>
                                            <Input disabled value={'展示数量'} style={{width:'80px'}}/>
                                            <Select 
                                                value={this.state.course_limit}
                                                onChange={val=>{
                                                    const {actions} = this.props
                                                    const {course_sort} = this.state
                                                    actions.getStatCourse({sort:course_sort,limit:val})
                                                    this.setState({course_limit: val})
                                                }}
                                            >
                                                <Option value="10">10</Option>
                                                <Option value="20">20</Option>
                                                <Option value="30">30</Option>
                                            </Select>
                                        </Input.Group>&nbsp;
                                        <Select 
                                            value={this.state.course_sort}
                                            onChange={val=>{
                                                const {actions} = this.props
                                                const {course_limit} = this.state
                                                actions.getStatCourse({sort:val,limit:course_limit})
                                                this.setState({course_sort: val})
                                            }}
                                        >
                                            <Option value="comment">课程评论数</Option>
                                            <Option value="hit">课程播放数</Option>
                                            <Option value="learn">课程学习数</Option>
                                            <Option value="score">课程评分</Option>
                                            <Option value="finish">课程完成率</Option>
                                        </Select>
                                    </div>
                                )}>
                                    <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <HorizontalBar onElementsClick={this._onCourseClick} height={130} data={this.line_course} options={options} />
                                        }
                                    </div>
                                </Card>
                            </Col>
                            
                        </Row>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
        );
    }
}

const LayoutComponent =Statistic;
const mapStateToProps = state => {
    return {
        stat_userLevel:state.dashboard.stat_userLevel,
        stat_user:state.dashboard.stat_user,
        stat_integral:state.dashboard.stat_integral,
        stat_flag:state.dashboard.stat_flag,
        stat_course:state.dashboard.stat_course,
        user:state.site.user,

        stat_auth:state.dashboard.stat_auth,
        stat_comment:state.dashboard.stat_comment
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});