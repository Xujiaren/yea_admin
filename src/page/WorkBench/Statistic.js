import React, { Component } from 'react';
import { CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Pagination,Table,Select,Tabs,Card, DatePicker,Menu, Dropdown, Button, Icon, message,Input} from 'antd';
import { Polar,Line,Pie,Bar,HorizontalBar} from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import locale from 'antd/es/date-picker/locale/zh_CN';
import randomColor from 'randomcolor'
import UserChar from './Chart'

const { TabPane } = Tabs;
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
let line_course_com = {
    labels: [],
    datasets: [
        {   
            key:'course',
            maxBarThickness:50,
            label:'课程评论数',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgba(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
let line_course_hit = {
    labels: [],
    datasets: [
        {   
            key:'course',
            maxBarThickness:50,
            label:'课程播放数',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgba(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
let line_course_learn = {
    labels: [],
    datasets: [
        {   
            key:'course',
            maxBarThickness:50,
            label:'课程学习数',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgba(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
let line_course_score = {
    labels: [],
    datasets: [
        {   
            key:'course',
            maxBarThickness:50,
            label:'课程评分',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgba(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
let line_course_finish = {
    labels: [],
    datasets: [
        {   
            key:'course',
            maxBarThickness:50,
            label:'课程完成率(%)',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgba(100, 190, 255,0.4)',
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
            backgroundColor:'rgba(100, 190, 255,0.4)',
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
            backgroundColor:'rgba(100, 190, 255,0.4)',
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
            backgroundColor:'rgba(100, 190, 255,0.4)',
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
            backgroundColor:'rgba(100, 190, 255,0.4)',
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
            pointHoverBackgroundColor: 'rgb(75,192,192)',
            pointHoverBorderColor: 'rgb(220,220,220)',
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
            pointHoverBackgroundColor: 'rgb(75,192,192)',
            pointHoverBorderColor: 'rgb(220,220,220)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        },
    ],
}

let line_integral = {
    labels: [],
    datasets: [
        {
            key:'integral_total',
            label: '总积分',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#689eff',
            borderColor: '#689eff',

            borderDash: [],

            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#689eff',
            pointBackgroundColor: '#689eff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#689eff',
            pointHoverBorderColor: '#689eff',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        },
        {
            key:'integral_in',
            label: '获得积分',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#ec932f',
            borderColor: '#ec932f',
    
            borderDash: [],

            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ec932f',
            pointBackgroundColor: '#ec932f',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ec932f',
            pointHoverBorderColor: '#ec932f',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        },
        {
            key:'integral_out',
            label: '消耗积分',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(75,192,192,1)',

            borderDash: [],

            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(75,192,192,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        },
        {
            key:'integral_left',
            label: '结余积分',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(100, 190, 255,1)',
            borderColor: 'rgba(100, 190, 255,1)',

            borderDash: [],

            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(100, 190, 255,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(100, 190, 255,1)',
            pointHoverBorderColor: 'rgba(100, 190, 255,1)',
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
            tab:'1',
            course_com_sort:'comment',
            course_com_limit:20,
            course_hit_limit:20,
            course_learn_limit:20,
            course_score_limit:20,
            course_finish_limit:20,

            course_num:0,
            course_average:0,
            stat_course_info:{},
            course_info_type:'各分类课程平均分',
            course_info_begin_time:moment().subtract('days', 30).format('YYYY-MM-DD'),
            course_info_end_time:moment().format('YYYY-MM-DD'),

            coin_consume_begin_time:moment().subtract('days', 30).format('YYYY-MM-DD'),
            coin_consume_end_time:moment().format('YYYY-MM-DD'),
            coin_consume:{},

            coin_origin_begin_time:moment().subtract('days', 30).format('YYYY-MM-DD'),
            coin_origin_end_time:moment().format('YYYY-MM-DD'),
            coin_origin:{},

            reward_begin_time:moment().format('YYYY-MM-DD'),
            reward_data:{},
            reward_pie:{},

            stat_course_data:{},
            person_data:[],
            collection_data:[],
            frequency_data:[],
            course_data_limit:'20',
            course_data_title:'课程打赏人数',

            coin_page_total:0,
            coin_page_current:1,
            coin_page_size:10,
            coin_rank:[],

            feed_total:0,
            feed_data_end_time:moment().format('YYYY-MM-DD'),
            feed_data_begin_time:moment().subtract('days', 30).format('YYYY-MM-DD'),
            feed_data:{},

            duration_end_time:moment().format('YYYY-MM-DD'),
            duration_begin_time:moment().subtract('days', 30).format('YYYY-MM-DD'),
            user_duration:{},

            user_time:{},
            user_time_begin_time:moment().subtract('days', 1).format('YYYY-MM-DD'),

            user_stay:{},
            user_stay_begin_time:moment().subtract('days', 1).format('YYYY-MM-DD'),

            user_sen_rate:{},
            user_sen_num:{},
            sen_begin_time:moment().format('YYYY-MM-DD'),

            user_active:{},
            user_active_timeType:2,
            register:0,
            lose:0,
            back:0,
            loyalty:0,
            activenum:0,

            feed_line:{},
            feed_line_type:2,
            feed_data_end:moment().format('YYYY-MM-DD'),
            feed_data_begin:moment().subtract('days', 30).format('YYYY-MM-DD'),
            feed_line_end:moment().format('YYYY-MM-DD'),
            feed_line_begin:moment().subtract('days', 30).format('YYYY-MM-DD'),

            
            comment_line_type:2,
            comment_line:{},

            line_intergral_chart:[],

            user_active_auth:-1,
            duration_auth:-1,
            user_time_auth:-1,
            course_info_auth:-1,
            sen_auth:-1,
            reward_auth:-1,
            coin_origin_auth:-1,
            coin_consume_auth:-1,
            feed_line_auth:-1,
            feed_data_auth:-1,
            course_data_auth:-1,

        }
        this.stat_course_com = []
        this.stat_course_hit = []
        this.stat_course_learn = []
        this.stat_course_score = []
        this.stat_course_finish = []


        this.line_user = line_user
        this.line_integral = line_integral

        this.line_userlevel = line_userlevel
        this.line_flag = line_flag

        this.line_course_com = line_course_com
        this.line_course_hit = line_course_hit
        this.line_course_learn = line_course_learn
        this.line_course_score = line_course_score
        this.line_course_finish = line_course_finish

        this.line_auth = line_auth
        this.line_comment = line_comment
    }
    componentWillMount(){
        const {search} = this.props.history.location
        if(search.indexOf('tab=') > -1){
            let tab = search.split('=')[1]
            this.setState({tab})
        }
    }
    componentDidMount(){
        const {actions} = this.props

		actions.getStatUser({timeType:2})
		actions.getStatUserLevel()
        actions.getStatIntegral({timeType:2})
        actions.getStatFlag()

        actions.getStatCourseCom({limit:20})
        actions.getStatCourseHit({limit:20})
        actions.getStatCourseLearn({limit:20})
        actions.getStatCourseScore({limit:20})
        actions.getStatCourseFinish({limit:20})
        
        actions.getStatAuth()

        actions.getStatComment()
        this.getReward()
        this.getStatCourseInfo()
        this.getCoinConsume()
        this.getCoinOrigin()
        this.getCourseData()
        this.getCoinRank()
        this.getFeedData()
        this.getFeedLine()
        this.getCommentLine()
        this.getUserEquity()
        this.getUserTime()
        this.getUserStay()
        this.getUserActive()
        this.getUserDuration()
        this.getSenStat()
	}
	componentWillReceiveProps(n_props){
        const {user} = n_props
        const {course_sort,course_limit} = this.state

        if(_.indexOf(user.rule, '*') >= 0||_.indexOf(user.rule, 'statistic/view') >= 0){
			this.setState({view:true})
		}
		if(_.indexOf(user.rule, '*') >= 0||_.indexOf(user.rule, 'statistic/edit') >= 0){
			this.setState({edit:true})
        }
        if(n_props.stat_course_score !== this.props.stat_course_score){
            const {stat_course_score} = n_props
            let labels = []
            let data = []
            this.stat_course_score = stat_course_score

            stat_course_score.map(ele=>{
                if(ele[1].length>15)
                    ele[1] = ele[1].slice(0,15)+'...'
                labels.push(ele[1])
                data.push(ele[2])
            })

            this.line_course_score.labels = labels
            this.line_course_score.datasets[0].data = data
            this.line_course_score.datasets[0].maxBarThickness = 15
        }
        if(n_props.stat_course_finish !== this.props.stat_course_finish){
            const {stat_course_finish} = n_props
            let labels = []
            let data = []
            this.stat_course_finish = stat_course_finish

            stat_course_finish.map(ele=>{
                if(ele[1].length>15)
                    ele[1] = ele[1].slice(0,15)+'...'
                labels.push(ele[1])
                data.push(ele[2].toFixed(2))

            })

            this.line_course_finish.labels = labels
            this.line_course_finish.datasets[0].data = data
            this.line_course_finish.datasets[0].maxBarThickness = 15
        }
        if(n_props.stat_course_learn !== this.props.stat_course_learn){
            const {stat_course_learn} = n_props
            let labels = []
            let data = []
            this.stat_course_learn = stat_course_learn

            stat_course_learn.map(ele=>{
                if(ele[1].length>15)
                    ele[1] = ele[1].slice(0,15)+'...'
                
                labels.push(ele[1])
                data.push(ele[2])
            })

            this.line_course_learn.labels = labels
            this.line_course_learn.datasets[0].data = data
            this.line_course_learn.datasets[0].maxBarThickness = 15
        }
        if(n_props.stat_course_hit !== this.props.stat_course_hit){
            const {stat_course_hit} = n_props
            let labels = []
            let data = []
            this.stat_course_hit = stat_course_hit

            stat_course_hit.map(ele=>{
                if(ele[1].length>15)
                    ele[1] = ele[1].slice(0,15)+'...'

                labels.push(ele[1])
                data.push(ele[2])
            })

            this.line_course_hit.labels = labels
            this.line_course_hit.datasets[0].data = data
            this.line_course_hit.datasets[0].maxBarThickness = 15
        }
        if(n_props.stat_course_com !== this.props.stat_course_com){
            const {stat_course_com} = n_props
            let labels = []
            let data = []
            this.stat_course_com = stat_course_com

            stat_course_com.map(ele=>{
                if(ele[1].length>15)
                    ele[1] = ele[1].slice(0,15)+'...'
                labels.push(ele[1])
                data.push(ele[2])
            })
            
            this.line_course_com.labels = labels
            this.line_course_com.datasets[0].data = data
            this.line_course_com.datasets[0].maxBarThickness = 15
        }
        ///////
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
            let _label = {all:'总评论数',pass:'通过',reject:'拒绝',wait:'待审核'}
            
            Object.keys(stat_comment).map(ele=>{
                label.push(_label[ele])
                data.push(stat_comment[ele])
            })

            this.line_comment.labels = label
            this.line_comment.datasets[0].data = data
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
            let _left = []
            let _total =[]

            let line_intergral_chart = []
            Object.keys(stat_integral).map(ele=>{
               
                // line_intergral_chart.push({
                //     'name':ele,
                //     '获得积分': stat_integral[ele].in,
                //     '消耗积分': stat_integral[ele].out,
                //     '总积分': stat_integral[ele].totalintegral,
                //     '结余积分': stat_integral[ele].letintegral
                // })

                label.push(ele)
                _in.push(stat_integral[ele].in)
                _out.push(stat_integral[ele].out)
                _left.push(stat_integral[ele].letintegral)
                _total.push(stat_integral[ele].totalintegral)
            })



            
            // this.setState({line_intergral_chart})
            this.line_integral.labels = label

            this.line_integral.datasets[0].key ='integral_total'
            this.line_integral.datasets[0].data = _total
            this.line_integral.datasets[0].label ='总积分'

            this.line_integral.datasets[1].data = _in
            this.line_integral.datasets[1].label ='获得积分'
            this.line_integral.datasets[1].key ='integral_in'

            this.line_integral.datasets[2].key ='integral_out'
            this.line_integral.datasets[2].data = _out
            this.line_integral.datasets[2].label ='消耗积分'

            
            this.line_integral.datasets[3].key ='integral_left'
            this.line_integral.datasets[3].data = _left
            this.line_integral.datasets[3].label ='结余积分'

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
            this.line_user.datasets[1].data = invite

        }
    }

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }
    getSenStat = ()=>{
        const {actions} = this.props
        const {sen_begin_time:begin_time,sen_auth:is_auth} = this.state
        actions.getSenStat({
            is_auth,
            begin_time,
            resolved:(data)=>{
                // data={
                //     "sensitiveword": [
                //         "小不一，不好66666",
                //         "小不一"
                //       ],
                //       "num": {
                //         "小不一，不好66666": 4,
                //         "小不一":34
                //       },
                //       "rate": {
                //         "小不一，不好66666": 23.00,
                //         "小不一": 56.00
                //       }
                // }
                const {sensitiveword:labels,num:num,rate:rate} = data
                let out_back_color = []
                let inner_back_color = []
                let num_data = [],rate_data = []

                Object.keys(num).map(ele=>{
                    rate_data.push(parseInt(rate[ele]))
                    num_data.push(num[ele])
                    
                    let _color = randomColor({
                        luminosity: 'light',
                        format: 'rgba',
                        alpha: 0.9
                    })
                    out_back_color.push(_color)
                    inner_back_color.push(_color)
                })
                const user_sen_num = {
                    labels: labels,
                    datasets: [
                        {
                            key:'user_num',
                            label:'次数',
                            data: num_data,
                            backgroundColor: inner_back_color
                        },
                    ],
                }
                const user_sen_rate = {
                    labels: labels,
                    datasets: [
                        {
                            key:'user_rate',
                            label:'百分比',
                            data: rate_data,
                            backgroundColor: inner_back_color
                        }
                    ],
                }
                // this.setState({user_sen_num,user_sen_rate})
            }
        })
    }
    getUserActive = ()=>{
        const {actions} = this.props
        const {user_active_timeType:timeType,user_active_auth:is_auth} = this.state
        actions.getUserActive({
            timeType,
            is_auth,
            resolved:(data)=>{
                // data = {
                //     "register": 0,
                //     "active": {
                //       "2019-12-25": 0,
                //       "2019-12-26": 0,
                //       "2019-12-27": 0,
                //       "2019-12-28": 0,
                //       "2019-12-29": 0,
                //       "2019-12-30": 0
                //     },
                //     "lose": 26618,
                //     "back": 0,
                //     "loyalty": 0,
                //     "activenum": 59999
                // }
                const {active,register,lose,back,loyalty,activenum} = data
                let labels = []
                let data_arr = []
                Object.keys(active).map(ele=>{
                    labels.push(ele)
                    data_arr.push(active[ele])
                })
                
                let user_active = {
                    labels: labels,
                    datasets: [
                        {
                            key:'user_active',
                            maxBarThickness:50,
                            label:'用户活跃',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:data_arr
                        }
                    ]
                }
                this.setState({ user_active,register,lose,back,loyalty,activenum })
            }
        })
    }
    getUserStay = ()=>{
        const {actions} = this.props
        const {user_stay_begin_time:begin_time} = this.state
        actions.getUserStay({
            begin_time,
            resolved:(data)=>{
                
                let txt = 
                {
                    "tomorrow":'次日留存率',
                    "week": '七日留存率',
                    "month": '月度留存率',
                    "Quarter": '季度留存率',
                    "year": '年度留存率'
                }
                let labels = []
                let data_arr = []
                Object.keys(data).map(ele=>{
                    labels.push(txt[ele])
                    data_arr.push(data[ele])
                })
                
                let user_stay = {
                    labels: labels,
                    datasets: [
                        {   
                            key:'user_stay',
                            maxBarThickness:50,
                            label:'留存率',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:data_arr
                        }
                    ]
                }
                this.setState({ user_stay })
            }
        })
    }
    getUserTime = ()=>{
        const {actions} = this.props
        const {user_time_begin_time:begin_time,user_time_auth:is_auth} = this.state
        actions.getUserTime({
            begin_time,
            is_auth,
            resolved:(data)=>{
                
                let labels = []
                let data_arr = []
                Object.keys(data).map(ele=>{
                    labels.push(ele)
                    data_arr.push(data[ele])
                })
                
                let user_time = {
                    labels: labels,
                    datasets: [
                        {   
                            key:'user_time',
                            maxBarThickness:50,
                            label:'用户在线时间段分布',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:data_arr
                        }
                    ]
                }
                this.setState({ user_time })
            }
        })
    }
    getUserDuration = ()=>{
        const {actions} = this.props
        const {duration_begin_time:begin_time,duration_end_time:end_time,duration_auth:is_auth} = this.state
        actions.getUserDuration({
            begin_time,end_time,is_auth,
            resolved:(data)=>{

                const back = randomColor({
                    luminosity: 'light',
                    format: 'rgba',
                    alpha: 0.9
                })
                const duration =  Math.floor(data.averageduration)
                
                const user_duration = {
                    labels: ['人均在线时长(分钟)',''],
                    datasets: [
                      {
                        data: [duration,0],
                        backgroundColor: [back,back],
                        hoverBackgroundColor: [back,back],
                      }],
                };

                this.setState({ user_duration:user_duration })
            }
        })
    }
    
    getUserEquityExport = ()=>{
        this.setState({ getUserEquity:true })
        this.props.actions.getUserEquity({
            action:'export',
            resolved:(data)=>{
                const {address,adress} = data
                const url = address||adress
                message.success({
                    content:'导出成功',
                    onClose:()=>{
                        this.setState({ getUserEquity:false })
                        window.open(url,'_black')
                    }
                })
            },
            rejected:()=>{
                this.setState({ getUserEquity:false })
                message.error('导出失败')
            }
        })
    }
    getUserEquity = ()=>{
        const {actions} = this.props
        actions.getUserEquity({
            resolved:(data)=>{
                let labels = []
                let data_arr = []
                Object.keys(data).map(ele=>{
                    labels.push(ele)
                    data_arr.push(data[ele])
                })
                let user_equity = {
                    labels: labels,
                    datasets: [
                        {   
                            key:'user_equity',
                            maxBarThickness:50,
                            label:'用户权益统计',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:data_arr
                        }
                    ]
                }
                this.setState({ user_equity })
            }
        })
    }
    getReward = ()=>{
        const {actions} = this.props
        const {reward_begin_time,reward_auth} = this.state
        const color_arr = [
            '#fad24b','#f7829e','#33d4f9','#6ba3ff','#4bc0c0','#5f5f5f','#b5b5b5','#ae4eaf','#8ed1ec'
        ]
        actions.getReward({
            begin_time:reward_begin_time,
            is_auth:reward_auth,
            resolved:(data)=>{
                console.log(data)
                const {rate, reward} = data
                let reward_label = []
                let reward_value = []
                let rate_label = []
                let rate_data = []

                Object.keys(reward).map(ele=>{
                    reward_label.push(ele)
                    reward_value.push(reward[ele])
                })
                
                let random_color = []
                let idx = 0
                Object.keys(rate).map((ele,index)=>{
                    idx++
                    if(index>color_arr.length){
                        idx = 0
                    }
                    random_color.push(
                        randomColor({
                            luminosity: 'light',
                            format: 'rgba',
                            alpha: 0.9
                         })
                    )

                    rate_label.push(ele)
                    rate_data.push(rate[ele])
                })
               
                const reward_data = {
                    labels: reward_label,
                    datasets: [
                        {
                            key:'reward_data',
                            maxBarThickness:50,
                            label:'每日中奖',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:reward_value
                        },
                    ]
                }

                const reward_pie = {
                    labels: rate_label,
                    datasets: [
                      {
                        data: rate_data,
                        backgroundColor: random_color,
                        hoverBackgroundColor: random_color,
                      }],
                };
                this.setState({reward_data, reward_pie})
            }
        })
    }
    getCoinOrigin = ()=>{
        const {actions} = this.props
        const {coin_origin_begin_time,coin_origin_end_time,coin_origin_auth} = this.state

        actions.getCoinOrigin({
            begin_time:coin_origin_begin_time,
            end_time:coin_origin_end_time,
            is_auth:coin_origin_auth,
            resolved:(data)=>{
                console.log(data)
                const txt = {'userget':'用户获取','platformget':'管理员赠送'}
                let label = []
                let ava_data = []
                let coin_origin = {}
                
                Object.keys(data).map(ele=>{
                    label.push(txt[ele])
                    ava_data.push(data[ele])
                })
               
                coin_origin = {
                    labels: label,
                    datasets: [
                        {   
                            key:'user',
                            maxBarThickness:50,
                            label:'金币获得统计',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:ava_data
                        },
                    ]
                }

                this.setState({coin_origin})
                
            }
        })
    }
    
    getCommentLine = ()=>{
        const { actions } = this.props
        const { comment_line_type:timeType } = this.state

        actions.getCommentLine({
            timeType,
            resolved:(data)=>{
                let label = []
                let data_arr = []
                Object.keys(data).map(ele=>{
                    label.push(ele)
                    data_arr.push(data[ele])
                })

                let comment_line = {
                    labels: label,
                    datasets: [
                        {   
                            key:'getCommentLine',
                            maxBarThickness:50,
                            label:'每日用户提交评论数',
                            borderWidth: 1,
                            borderColor:'rgb(100, 190, 255)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:data_arr
                        },
                    ]
                }

                this.setState({
                    comment_line
                })
            }
        })
    }
    getFeedLineExport = ()=>{
        const { feed_line_begin:begin_time,feed_line_end:end_time,feed_line_auth:is_auth } = this.state
        this.setState({ getFeedLine:true })
        this.props.actions.getFeedExcel({
            begin_time,end_time,is_auth,
            resolved:(data)=>{
                const {address,adress} = data
                const url = address||adress
                message.success({
                    content:'导出成功',
                    onClose:()=>{
                        this.setState({ getFeedLine:false })
                        window.open(url,'_black')
                    }
                })
            },
            rejected:()=>{
                this.setState({ getFeedLine:false })
                message.error('导出失败')
            }
        })
    }
    getFeedLine = ()=>{
        const { actions } = this.props
        const { feed_line_type:timeType,feed_line_begin:begin_time,feed_line_end:end_time,feed_line_auth:is_auth } = this.state

        actions.getFeedLine({
            timeType,
            end_time,
            begin_time,
            is_auth,
            resolved:(data)=>{
                const _data = data
                let data_arr = []
                let label = Object.getOwnPropertyNames(_data)
                label.map(ele=>{
                    data_arr.push(data[ele])
                })
                console.log(label,data_arr)

               

                let feed_line = {
                    labels: label,
                    datasets: [
                        {   
                            key:'getFeedLine',
                            maxBarThickness:50,
                            label:'每日反馈帮助人数',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:data_arr
                        },
                    ]
                }

                this.setState({
                    feed_line
                })
            }
        })
    }
    getFeedDataExport = ()=>{
        const {feed_data_auth:is_auth,feed_data_begin_time:begin_time,feed_data_end_time:end_time} = this.state
        this.setState({ getFeedData:true })
        this.props.actions.getFeedData({
            begin_time,end_time,is_auth,action:'export',
            resolved:(data)=>{
                const {address,adress} = data
                const url = address||adress
                message.success({
                    content:'导出成功',
                    onClose:()=>{
                        this.setState({ getFeedData:false })
                        window.open(url,'_black')
                    }
                })
            },
            rejected:()=>{
                this.setState({ getFeedData:false })
                message.error('导出失败')
            }
        })
    }
    getFeedData = ()=>{
        const {actions} = this.props
        const {feed_data_auth:is_auth,feed_data_begin_time:begin_time,feed_data_end_time:end_time} = this.state
        //type 0:最近7天  1:最近15天  2:最近1月

        actions.getFeedData({
            begin_time,end_time,is_auth,
            resolved:(resultBody)=>{
                //返回的数据结构
                console.log(resultBody)
                const feed_total = resultBody.total
                
                let label = []
                let data = []
                Object.keys(resultBody.data).map(ele=>{
                    label.push(ele)
                    data.push(resultBody.data[ele])
                })

                let feed_data = {
                    labels: label,
                    datasets: [
                        {   
                            key:'user',
                            maxBarThickness:50,
                            label:'反馈帮助数量统计',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:data
                        },
                    ]
                }

                this.setState({
                    feed_data,
                    feed_total
                })
                
                console.log(data)
            }
        })
    }
    getCoinRank = ()=>{
        const {actions} = this.props
        const {coin_page_current,coin_page_size} = this.state
        actions.getCoinRank({
            page:0,
            pageSize:coin_page_size,
            resolved:(data)=>{
                const coin_rank = data.data
                let coin_page_total = data.total
                let coin_page_current = data.page+1

                this.setState({
                    coin_page_total,
                    coin_page_current,
                    coin_rank
                })
                
                console.log(data)
            }
        })
    }
    getCoinConsume = ()=>{
        const {actions} = this.props
        const {coin_consume_begin_time,coin_consume_end_time,coin_consume_auth} = this.state

        actions.getCoinConsume({
            begin_time:coin_consume_begin_time,
            end_time:coin_consume_end_time,
            is_auth:coin_consume_auth,
            resolved:(data)=>{
                
                const txt = {
                    'userrewardcost':'金币打赏消耗总数',
                    'askcostintegral':'答题消耗金币总数',
                    'activitycostintegral':'翻牌抽奖消耗金币总数'
                }
                
                let label = []
                let ava_data = []
                console.log(data)

                Object.keys(data).map(ele=>{
                    label.push(txt[ele])
                    ava_data.push(data[ele])
                })
               
                let coin_consume = {
                    labels: label,
                    datasets: [
                        {   
                            key:'coin_consume',
                            maxBarThickness:50,
                            label:'金币消耗统计',
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:ava_data
                        },
                    ]
                }
                
                this.setState({coin_consume})
                
            }
        })
    }
    getCourseData = ()=>{
        const {actions} = this.props
        const {course_data_limit,course_data_title,course_data_auth} = this.state
        actions.getCourseData({
            begin_time:'2019-10-01',
            end_time:moment().format('YYYY-MM-DD'),
            limit:course_data_limit,
            is_auth:course_data_auth,
            resolved:(data)=>{
                const {person,collection,frequency} = data
                let label = []
                let person_data = [],collection_data = [],frequency_data = []
                let stat_course_data = {}

                Object.keys(person).map(ele=>{
                    if(ele.length>15)
                        ele = ele.slice(0,15)+'...'
                    label.push(ele)
                    person_data.push(person[ele])
                })
                Object.keys(collection).map(ele=>{
                    collection_data.push(collection[ele])
                    
                })
                Object.keys(frequency).map(ele=>{
                    frequency_data.push(frequency[ele])
                })

                stat_course_data = {
                    labels: label,
                    datasets: [
                        {   
                            key:'course_ava',
                            maxBarThickness:50,
                            label:course_data_title,
                            borderWidth: 1,
                            borderColor:'#ffc350',
                            backgroundColor:'rgba(255, 195, 80,0.4)',
                            data:person_data
                        },
                    ]
                }
                if(course_data_title == '课程打赏次数'){
                    stat_course_data.datasets[0].data = frequency_data
                }else if(course_data_title == '课程收藏量'){
                    stat_course_data.datasets[0].data = collection_data
                }
                this.setState({stat_course_data,person_data,collection_data,frequency_data})
                
            }
        })
    }
    getStatCourseInfo = ()=>{
        const {actions} = this.props
        const {course_info_auth,course_info_begin_time,course_info_end_time,course_info_type} = this.state

        actions.getStatCourseInfo({
            begin_time:course_info_begin_time,
            end_time:course_info_end_time,
            is_auth:course_info_auth,
            resolved:(data)=>{
                console.log(data)

                const {categoryaverage,pv,uv} = data
                const course_num = data.number
                const course_average = data.average
                let label = []
                let ava_data = []
                let stat_course_info = {}

                if(course_info_type == '各分类课程平均分')
                    Object.keys(categoryaverage).map(ele=>{
                        label.push(ele)
                        ava_data.push(categoryaverage[ele])
                    })
                else if(course_info_type == '各分类课程PV')
                    Object.keys(pv).map(ele=>{
                        label.push(ele)
                        ava_data.push(pv[ele])
                    })
                else
                    Object.keys(uv).map(ele=>{
                        label.push(ele)
                        ava_data.push(uv[ele])
                    })

                stat_course_info = {
                    labels: label,
                    datasets: [
                        {   
                            key:'course_ava',
                            maxBarThickness:50,
                            label:course_info_type,
                            borderWidth: 1,
                            borderColor:'#ffc350',
                            backgroundColor:'rgba(255, 195, 80,0.4)',
                            data:ava_data
                        }
                    ]
                }

                this.setState({stat_course_info,course_average,course_num})
                
            }
        })
    }
    _onCommentClick(type,ele){
        console.log(type,ele)
        if(ele.length!==0){
            let id = ''
            if(type == 'comment')
                id = this.stat_course_com[ele[0]._index][0]
            if(type == 'hit')
                id = this.stat_course_hit[ele[0]._index][0]
            if(type == 'learn')
                id = this.stat_course_learn[ele[0]._index][0]
            if(type == 'score')
                id = this.stat_course_score[ele[0]._index][0]
            if(type == 'finish')
                id = this.stat_course_finish[ele[0]._index][0]
            
            if(id !== '')
                this.props.history.push({
                    pathname:'/course-manager/view-course/'+id,
                    state:{
                        tab:3
                    }
                })
        }
        
    }
    moreInfo(type){
        this.props.history.push({
            pathname:'/workbench/statistic/CourseStatInfo',
            state:{
                type
            }
        })
    }
    disabledDate = (current)=>{
        return current > moment().subtract(0, 'day')
    }
    bodyStyle = {

    }
    render() {
        return (
        <div className="animated fadeIn">
            
            <Card>
                <Tabs activeKey={this.state.tab} onChange={val=>{
                    let pathname = this.props.history.location.pathname
                    this.setState({tab:val})
                    this.props.history.replace(pathname+'?tab='+val)
                }}>
                    <TabPane tab="会员统计" key="1">
                        <Row>
                            <Col xl="6" md='12' sm='12' className="mt_10">
                                <Card className='static_card'  bodyStyle={this.bodyStyle}   title="会员注册总人数" extra={(
                                    <div className="flex row align_items">
                                        {/*
                                        <Select defaultValue="0">
                                            <Option value="0">没有验证</Option>
                                            <Option value="1">实名验证</Option>
                                        </Select>
                                        */}
                                        <Select 
                                            defaultValue={2}
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
                                <Card bordered={false} size='small' className="mt_10 static_card" bodyStyle={this.bodyStyle}  title="会员使用积分" extra={(
                                    <div className="flex row align_items">
                                        {/*
                                        <Select defaultValue="0">
                                            <Option value="0">总积分</Option>
                                            <Option value="1">使用积分</Option>
                                        </Select>
                                        */}
                                        <Select defaultValue="2"
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
                                        {/* 
                                            <ResponsiveContainer>
                                            <AreaChart data={this.state.line_intergral_chart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="总积分" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                                <Area type="monotone" dataKey="结余积分" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                                <Area type="monotone" dataKey="获得积分" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                                <Area type="monotone" dataKey="消耗积分" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                                            </AreaChart>
                                            </ResponsiveContainer>
                                            */}
                                        </div>
                                </Card>
                                <Card className="mt_10 static_card" bodyStyle={this.bodyStyle}  title="认证用户统计" extra={(
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
                                <Card className='mt_10 static_card'  title={"用户在线时间段分布（"+this.state.user_time_begin_time+"）"} extra={
                                        <>
                                        <DatePicker format='YYYY-MM-DD' disabledDate={this.disabledDate} allowClear={false} onChange={(time,dataString)=>{
                                            this.setState({ user_time_begin_time:dataString },()=>{
                                                this.getUserTime()
                                            })
                                        }}></DatePicker>
                                        <Select value={this.state.user_time_auth} onChange={(val)=>{
                                            this.setState({ user_time_auth:val },()=>{
                                                this.getUserTime()
                                            })
                                        }}>
                                            <Option value={-1}>全部</Option>
                                            <Option value={0}>未认证</Option>
                                            <Option value={1}>已认证</Option>
                                        </Select>
                                        </>
                                    }>
                                        <div className="chart-wrapper">
                                            
                                            {!this.state.view?<div>无查看权限</div>:
                                                <Line height={150} data={this.state.user_time} options={options} />
                                            }
                                        </div>
                                </Card>
                            </Col>
                            <Col xl="6" md='12' sm='12' className="mt_10">
                                <Card className='static_card' bodyStyle={this.bodyStyle}   title="各个等级会员统计" extra={(
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
                                <Card className="mt_10 static_card" bodyStyle={this.bodyStyle}  title="业务员等级用户统计" extra={(
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
                                <Card className="mt_10 static_card" bodyStyle={this.bodyStyle}   title="评论数统计" extra={(
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
                                <Card className="mt_10 static_card" bodyStyle={this.bodyStyle}  title="用户权益统计" extra={(
                                    <div className="flex row align_items">
                                        {/*<Select defaultValue="0">
                                            <Option value="0">LV1</Option>
                                            <Option value="1">LV2</Option>
                                            <Option value="2">LV3</Option>
                                        </Select>*/}
                                        <Button loading={this.state.getUserEquity}>导出</Button>
                                    </div>
                                    )}>
                                        <div className="chart-wrapper chart_pos">
                                        <div className='fix_wrap'></div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.state.user_equity} options={bar_options} />
                                        }
                                        </div>
                                </Card>
                               
                            </Col>
                        </Row>
                        <Row>
                            <Col xl='6'> 
                                <Card className='mt_10 static_card'  title={"留存率（"+this.state.user_stay_begin_time+"）"} extra={
                                        <DatePicker format='YYYY-MM-DD' disabledDate={this.disabledDate} allowClear={false} onChange={(time,dataString)=>{
                                            this.setState({ user_stay_begin_time:dataString },()=>{
                                                this.getUserStay()
                                            })
                                        }}></DatePicker>
                                    }>
                                        <div className="chart-wrapper">
                                            
                                            {!this.state.view?<div>无查看权限</div>:
                                                <Line height={150} data={this.state.user_stay} options={options} />
                                            }
                                        </div>
                                        <div style={{opacity:0}}>留存率</div>
                                </Card>
                            </Col>
                            <Col xl='6'>
                                <Card className='mt_10 static_card'  title='用户活跃' extra={
                                    <>
                                        <Select value={this.state.user_active_timeType} onChange={(val)=>{
                                            this.setState({ user_active_timeType:val },()=>{
                                                this.getUserActive()
                                            })
                                        }}>
                                            <Option value={0}>最近7天</Option>
                                            <Option value={1}>最近15天</Option>
                                            <Option value={2}>最近1月</Option>
                                        </Select>
                                        <Select value={this.state.user_active_auth} onChange={(val)=>{
                                            this.setState({ user_active_auth:val },()=>{
                                                this.getUserActive()
                                            })
                                        }}>
                                            <Option value={-1}>全部</Option>
                                            <Option value={0}>未认证</Option>
                                            <Option value={1}>已认证</Option>
                                        </Select>
                                    </>
                                    }>
                                        <div className="chart-wrapper">
                                            {!this.state.view?<div>无查看权限</div>:
                                                <Line height={150} data={this.state.user_active} options={options} />
                                            }
                                        </div>
                                        <span className='pad_r10'>注册数：<strong>{this.state.register}</strong></span>
                                        <span className='pad_r10'>流失用户：<strong>{this.state.lose}</strong></span>
                                        <span className='pad_r10'>回流用户：<strong>{this.state.back}</strong></span>
                                        <span className='pad_r10'>忠诚用户数：<strong>{this.state.loyalty}</strong></span>
                                        <span className='pad_r10'>活跃用户数：<strong>{this.state.activenum}</strong></span>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl='6'> 
                                <Card className='mt_10 static_card'  title={"每日敏感词统计（"+this.state.sen_begin_time+"）"} extra={
                                    <>
                                        <DatePicker format='YYYY-MM-DD' disabledDate={this.disabledDate} allowClear={false} onChange={(time,dataString)=>{
                                            this.setState({ sen_begin_time:dataString },()=>{
                                                this.getSenStat()
                                            })
                                        }}></DatePicker>
                                        <Select value={this.state.sen_auth} className='m_2' onChange={val=>{
                                            this.setState({sen_auth:val},()=>{ this.getSenStat() })
                                        }}>
                                            <Select.Option value={-1}>全部</Select.Option>
                                            <Select.Option value={0}>未认证</Select.Option>
                                            <Select.Option value={1}>已认证</Select.Option>
                                        </Select>
                                    </>
                                }>
                                    <strong>触发次数</strong>
                                    {!this.state.view?<div>无查看权限</div>:
                                        <Polar height={150} data={this.state.user_sen_num} />
                                    }
                                    <br />
                                    <strong>触发占比</strong>
                                    {!this.state.view?<div>无查看权限</div>:
                                        <Pie height={150} data={this.state.user_sen_rate} />
                                    }
                                </Card>
                            </Col>
                            <Col xl='6'>
                            <Card className='mt_10 static_card'  title='用户在线时长' extra={
                                    <>
                                    <DatePicker.RangePicker disabledDate={this.disabledDate} onChange={(date,dateString)=>{
                                        if(dateString[0]==dateString[1]){ message.info('请不要选择相同的时间'); return; }
                                        this.setState({ duration_begin_time:dateString[0] ,duration_end_time:dateString[1] },()=>{
                                            this.getUserDuration()
                                        })
                                    }}></DatePicker.RangePicker>
                                    <Select value={this.state.duration_auth} onChange={(val)=>{
                                        this.setState({ duration_auth:val },()=>{
                                            this.getUserDuration()
                                        })
                                    }}>
                                        <Option value={-1}>全部</Option>
                                        <Option value={0}>未认证</Option>
                                        <Option value={1}>已认证</Option>
                                    </Select>
                                    </>
                                }>
                                    <div>时间：<strong>{this.state.duration_begin_time}</strong>至<strong>{this.state.duration_end_time}</strong></div>
                                    <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Pie height={150} data={this.state.user_duration} />
                                        }
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="数据监控" key="2">
                        <Row>
                            {/* 
                            <Col xl="6">
                                <Card  title="热门搜词" extra={(
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
                                           <Line height={130} data={null} options={options} />
                                        </div>
                                </Card>
                                
                            </Col>
                            
                            <Col xl='6'>
                                <Card  className="mt_10 static_card"  title="金币概况" extra={
                                    <DatePicker.RangePicker allowClear={false} disabledDate={this.disabledDate} style={{ maxWidth: 250}} format="YYYY-MM-DD" locale={locale} onChange={(date,dateString)=>{
                                        if(dateString[0] == dateString[1]){ message.info('请不要选择相同的日期'); return; }
                                        this.setState({
                                            coin_info_begin_time:dateString[0],
                                            coin_info_end_time:dateString[1],
                                        },()=>{
                                            this.getStatCourseInfo()
                                        })
                                    }}/>
                                }>
                                    <div className="chart-wrapper chart_pos">
                                        <div class="fix_wrap"></div>
                                        <div>
                                            <span className='mr_10'>课程数量：{this.state.course_num}</span>
                                            <span className='mr_20'>课程总平均分：{this.state.course_average}</span>
                                            <span>时间：{this.state.course_info_begin_time} 至 {this.state.course_info_end_time}</span>
                                        </div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.state.stat_coin_info} options={bar_options} />
                                        }
                                    </div>
                                </Card>
                            </Col>
                           */}
                           <Col xl='12'>
                                <Card  className="mt_10 static_card"  title="每日中奖数量、奖品类型、奖品占比" extra={
                                    <>
                                    <DatePicker allowClear={false} disabledDate={this.disabledDate} style={{ maxWidth: 250}} format="YYYY-MM-DD" locale={locale} onChange={(date,dateString)=>{
                                        if(dateString == ''){ return null; }
                                        this.setState({
                                            reward_begin_time:dateString,
                                        },()=>{
                                            this.getReward()
                                        })
                                    }}/>
                                    <Select value={this.state.reward_auth} className='m_2' onChange={val=>{
                                        this.setState({reward_auth:val},()=>{ this.getReward() })
                                    }}>
                                        <Select.Option value={-1}>全部</Select.Option>
                                        <Select.Option value={0}>未认证</Select.Option>
                                        <Select.Option value={1}>已认证</Select.Option>
                                    </Select>
                                    </>
                                }>   
                                <Row>
                                    <Col xl='6'>
                                        <div className="chart-wrapper chart_pos">
                                            <div className="fix_wrap"></div>
                                            <div>
                                                <span>时间：{this.state.reward_begin_time} </span>
                                            </div>
                                            {!this.state.view?<div>无查看权限</div>:
                                                <Bar height={150} data={this.state.reward_data} options={bar_options} />
                                            }
                                        </div>
                                    </Col>
                                    <Col xl='6'>
                                        <div className="chart-wrapper chart_pos">
                                           
                                            {!this.state.view?<div>无查看权限</div>:
                                                <Pie height={150} data={this.state.reward_pie} />
                                            }
                                        </div>
                                    </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xl='6'>
                                <Card  className="mt_10 static_card"  title="金币消耗统计" extra={
                                    <>
                                    <DatePicker.RangePicker allowClear={false} disabledDate={this.disabledDate} style={{ maxWidth: 250}} format="YYYY-MM-DD" locale={locale} onChange={(date,dateString)=>{
                                        if(dateString[0] == dateString[1]){ message.info('请不要选择相同的日期'); return; }
                                        this.setState({
                                            coin_consume_begin_time:dateString[0],
                                            coin_consume_end_time:dateString[1],
                                        },()=>{
                                            this.getCoinConsume()
                                        })
                                    }}/>
                                    <Select value={this.state.coin_consume_auth} className='m_2' onChange={val=>{
                                        this.setState({coin_consume_auth:val},()=>{ this.getCoinConsume() })
                                    }}>
                                        <Select.Option value={-1}>全部</Select.Option>
                                        <Select.Option value={0}>未认证</Select.Option>
                                        <Select.Option value={1}>已认证</Select.Option>
                                    </Select>
                                    </>
                                }>
                                    <div className="chart-wrapper chart_pos">
                                        <div className="fix_wrap"></div>
                                        <div>
                                            <span>时间：{this.state.coin_consume_begin_time} 至 {this.state.coin_consume_end_time}</span>
                                        </div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.state.coin_consume} options={bar_options} />
                                        }
                                    </div>
                                </Card>
                            </Col>
                            <Col xl='6'>
                                <Card  className="mt_10 static_card"  title="金币获得统计" extra={
                                    <>
                                    <DatePicker.RangePicker allowClear={false} disabledDate={this.disabledDate} style={{ maxWidth: 250}} format="YYYY-MM-DD" locale={locale} onChange={(date,dateString)=>{
                                        if(dateString[0] == dateString[1]){ message.info('请不要选择相同的日期'); return; }
                                        this.setState({
                                            coin_origin_begin_time:dateString[0],
                                            coin_origin_end_time:dateString[1],
                                        },()=>{
                                            this.getCoinOrigin()
                                        })
                                    }}/>
                                    <Select value={this.state.coin_origin_auth} className='m_2' onChange={val=>{
                                        this.setState({coin_origin_auth:val},()=>{ this.getCoinOrigin() })
                                    }}>
                                        <Select.Option value={-1}>全部</Select.Option>
                                        <Select.Option value={0}>未认证</Select.Option>
                                        <Select.Option value={1}>已认证</Select.Option>
                                    </Select>
                                    </>
                                }>
                                    <div className="chart-wrapper chart_pos">
                                        <div className="fix_wrap"></div>
                                        <div>
                                            <span>时间：{this.state.coin_origin_begin_time} 至 {this.state.coin_origin_end_time}</span>
                                        </div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.state.coin_origin} options={bar_options} />
                                        }
                                    </div>
                                </Card>
                            </Col>
                            <Col xl='12'>
                                <Card  className="mt_10 static_card"  title="金币排行榜" extra={
                                    <Select value={this.state.coin_page_size} onChange={val=>{ this.setState({coin_page_size:val},()=>{ this.getCoinRank() })}}>
                                        <Select.Option value={10}>前10名</Select.Option>
                                        <Select.Option value={50}>前50名</Select.Option>
                                        <Select.Option value={100}>前100名</Select.Option>
                                    </Select>
                                }>
                                    <Table dataSource={this.state.coin_rank} columns={this.columns} rowKey={'userId'} tableLayout={'fixed'} size={'middle'} pagination={false}/>
                                </Card>
                            </Col>
                            <Col xl='6'>
                                <Card  className="mt_10 static_card"  title="反馈帮助数量统计" extra={
                                    <>
                                    <DatePicker.RangePicker allowClear={false} disabledDate={this.disabledDate} style={{ maxWidth: 250}} format="YYYY-MM-DD" locale={locale} onChange={(date,dateString)=>{
                                        if(dateString[0] == dateString[1]){ message.info('请不要选择相同的日期'); return; }
                                        this.setState({
                                            feed_data_begin_time:dateString[0],
                                            feed_data_end_time:dateString[1],
                                        },()=>{
                                            this.getFeedData()
                                        })
                                    }}/>
                                    <Select value={this.state.feed_data_auth} className='m_2' onChange={val=>{
                                        this.setState({feed_data_auth:val},()=>{ this.getFeedData() })
                                    }}>
                                        <Select.Option value={-1}>全部</Select.Option>
                                        <Select.Option value={0}>未认证</Select.Option>
                                        <Select.Option value={1}>已认证</Select.Option>
                                    </Select>
                                    <Button loading={this.state.getFeedData} onClick={this.getFeedDataExport}>导出</Button>
                                    </>
                                }>
                                    <div className="chart-wrapper chart_pos">
                                        <div className="fix_wrap"></div>
                                        <div>
                                            <span style={{paddingRight:'15px'}}>总数：{this.state.feed_total}</span>
                                            <span>{this.state.feed_data_begin_time} 至 {this.state.feed_data_end_time}</span>
                                        </div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.state.feed_data} options={bar_options} />
                                        }
                                    </div>
                                </Card>
                            </Col>
                            <Col xl='6'>
                                <Card className='mt_10 static_card'  title="每日反馈帮助人数" extra={(
                                    <div className="flex row align_items">
                                        <DatePicker.RangePicker allowClear={false} disabledDate={this.disabledDate} style={{ maxWidth: 250}} format="YYYY-MM-DD" locale={locale} onChange={(date,dateString)=>{
                                            if(dateString[0] == dateString[1]){ message.info('请不要选择相同的日期'); return; }
                                            this.setState({
                                                feed_line_begin:dateString[0],
                                                feed_line_end:dateString[1],
                                            },()=>{
                                                this.getFeedLine()
                                            })
                                        }}/>
                                        <Select value={this.state.feed_line_auth} className='m_2' onChange={val=>{
                                            this.setState({feed_line_auth:val},()=>{ this.getFeedLine() })
                                        }}>
                                            <Select.Option value={-1}>全部</Select.Option>
                                            <Select.Option value={0}>未认证</Select.Option>
                                            <Select.Option value={1}>已认证</Select.Option>
                                        </Select>
                                        <Select 
                                            defaultValue={2}
                                            onChange={val=>{
                                                this.setState({ feed_line_type:val },()=>{
                                                    this.getFeedLine()
                                                })
                                            }}
                                        >
                                            <Option value={0}>最近7天</Option>
                                            <Option value={1}>最近15天</Option>
                                            <Option value={2}>最近1月</Option>
                                        </Select>
                                        <Button loading={this.state.getFeedLine} onClick={this.getFeedLineExport}>导出</Button>
                                    </div>
                                    )}>
                                        <div className="chart-wrapper">
                                            {!this.state.view?<div>无查看权限</div>:
                                                <Line height={150} data={this.state.feed_line} options={options} />
                                            }
                                        </div>
                                </Card>
                            </Col>
                             
                        </Row>
                    </TabPane>
                    <TabPane tab="课程数据统计" key="3">
                        <Row>
                            <Col xl='6'>
                                <Card  className="mt_10 static_card"  title="课程概况" extra={
                                    <div>
                                        <Select value={this.state.course_info_type} className='m_2' onChange={val=>{
                                            this.setState({course_info_type:val},()=>{ this.getStatCourseInfo() })
                                        }}>
                                            <Select.Option value={'各分类课程平均分'}>各分类课程平均分</Select.Option>
                                            <Select.Option value={'各分类课程UV'}>各分类课程UV</Select.Option>
                                            <Select.Option value={'各分类课程PV'}>各分类课程PV</Select.Option>
                                        </Select>
                                    
                                        <DatePicker.RangePicker allowClear={false} className='m_2' disabledDate={this.disabledDate} style={{ maxWidth: 250}} format="YYYY-MM-DD" locale={locale} onChange={(date,dateString)=>{
                                            if(dateString[0] == dateString[1]){ message.info('请不要选择相同的日期'); return; }
                                            this.setState({
                                                course_info_begin_time:dateString[0],
                                                course_info_end_time:dateString[1],
                                            },()=>{
                                                this.getStatCourseInfo()
                                            })
                                        }}/>
                                        <Select value={this.state.course_info_auth} className='m_2' onChange={val=>{
                                            this.setState({course_info_auth:val},()=>{ this.getStatCourseInfo() })
                                        }}>
                                            <Select.Option value={-1}>全部</Select.Option>
                                            <Select.Option value={0}>未认证</Select.Option>
                                            <Select.Option value={1}>已认证</Select.Option>
                                        </Select>
                                    </div>
                                }>
                                    <div className="chart-wrapper chart_pos">
                                        <div class="fix_wrap"></div>
                                        <div>
                                            <span className='mr_10'>课程数量：{this.state.course_num}</span>
                                            <span className='mr_20'>课程总平均分：{this.state.course_average}</span>
                                            <span>时间：{this.state.course_info_begin_time} 至 {this.state.course_info_end_time}</span>
                                        </div>
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Bar height={150} data={this.state.stat_course_info} options={bar_options} />
                                        }
                                    </div>
                                </Card>
                            </Col>
                            <Col xl='6'>
                                <Card  className="mt_10 static_card"  title="每日用户提交评论数" extra={
                                    <div>
                                        <Select value={this.state.comment_line_type} className='m_2' onChange={val=>{
                                            this.setState({comment_line_type:val},()=>{ this.getCommentLine() })
                                        }}>
                                            <Select.Option value={0}>最近7天</Select.Option>
                                            <Select.Option value={1}>最近15天</Select.Option>
                                            <Select.Option value={2}>最近1月</Select.Option>
                                        </Select>
                                    </div>
                                }>
                                    <div className="chart-wrapper chart_pos">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <Line height={150} data={this.state.comment_line} options={options} />
                                        }
                                    </div>
                                </Card>
                            </Col>
                            <Col xl="12" className="mt_10">
                                <Card  title='课程评论数'  extra={(
                                    <div className="flex row align_items">
                                        <Button onClick={this.moreInfo.bind(this,'comment')}>更多</Button>&nbsp;
                                        <Input.Group compact>
                                            <Input disabled value={'展示数量'} style={{width:'80px'}}/>
                                            <Select 
                                                value={this.state.course_com_limit}
                                                onChange={val=>{
                                                    const {actions} = this.props
                                                    actions.getStatCourseCom({limit:val})
                                                    this.setState({course_com_limit: val})
                                                }}
                                            >
                                                <Option value="10">10</Option>
                                                <Option value="20">20</Option>
                                                <Option value="30">30</Option>
                                            </Select>
                                        </Input.Group>&nbsp;
                                        {/*<Select 
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
                                        */}
                                    </div>
                                )}>
                                    <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <HorizontalBar onElementsClick={this._onCommentClick.bind(this,'comment')} height={110} data={this.line_course_com} options={options} />
                                        }
                                    </div>
                                </Card>

                                <Card className='mt_10'  title='课程播放数'  extra={(
                                    <div className="flex row align_items">
                                        <Button onClick={this.moreInfo.bind(this,'hit')}>更多</Button>&nbsp;  
                                        <Input.Group compact>
                                            <Input disabled value={'展示数量'} style={{width:'80px'}}/>
                                            <Select 
                                                value={this.state.course_hit_limit}
                                                onChange={val=>{
                                                    const {actions} = this.props
                                                    actions.getStatCourseHit({limit:val})
                                                    this.setState({course_hit_limit: val})
                                                }}
                                            >
                                                <Option value="10">10</Option>
                                                <Option value="20">20</Option>
                                                <Option value="30">30</Option>
                                            </Select>
                                        </Input.Group>
                                    </div>
                                )}>
                                    <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <HorizontalBar onElementsClick={this._onCommentClick.bind(this,'hit')} height={110} data={this.line_course_hit} options={options} />
                                        }
                                    </div>
                                </Card>
                                <Card className='mt_10'  title='课程学习数'  extra={(
                                    <div className="flex row align_items">
                                        <Button onClick={this.moreInfo.bind(this,'learn')}>更多</Button>&nbsp;
                                        <Input.Group compact>
                                            <Input disabled value={'展示数量'} style={{width:'80px'}}/>
                                            <Select 
                                                value={this.state.course_learn_limit}
                                                onChange={val=>{
                                                    const {actions} = this.props
                                                    actions.getStatCourseLearn({limit:val})
                                                    this.setState({course_learn_limit: val})
                                                }}
                                            >
                                                <Option value="10">10</Option>
                                                <Option value="20">20</Option>
                                                <Option value="30">30</Option>
                                            </Select>
                                        </Input.Group>
                                    </div>
                                )}>
                                    <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <HorizontalBar onElementsClick={this._onCommentClick.bind(this,'learn')} height={110} data={this.line_course_learn} options={options} />
                                        }
                                    </div>
                                </Card>
                                <Card className='mt_10'  title='课程评分'  extra={(
                                    <div className="flex row align_items">
                                        <Button onClick={this.moreInfo.bind(this,'score')}>更多</Button>&nbsp;
                                        <Input.Group compact>
                                            <Input disabled value={'展示数量'} style={{width:'80px'}}/>
                                            <Select 
                                                value={this.state.course_score_limit}
                                                onChange={val=>{
                                                    const {actions} = this.props
                                                    actions.getStatCourseScore({limit:val})
                                                    this.setState({course_score_limit: val})
                                                }}
                                            >
                                                <Option value="10">10</Option>
                                                <Option value="20">20</Option>
                                                <Option value="30">30</Option>
                                            </Select>
                                        </Input.Group>
                                    </div>
                                )}>
                                    <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <HorizontalBar onElementsClick={this._onCommentClick.bind(this,'score')} height={110} data={this.line_course_score} options={options} />
                                        }
                                    </div>
                                </Card>
                                <Card className='mt_10'  title='课程完成率'  extra={(
                                    <div className="flex row align_items">
                                        <Button onClick={this.moreInfo.bind(this,'finish')}>更多</Button>&nbsp;
                                        <Input.Group compact>
                                            <Input disabled value={'展示数量'} style={{width:'80px'}}/>
                                            <Select 
                                                value={this.state.course_finish_limit}
                                                onChange={val=>{
                                                    const {actions} = this.props
                                                    actions.getStatCourseFinish({limit:val})
                                                    this.setState({course_finish_limit: val})
                                                }}
                                            >
                                                <Option value="10">10</Option>
                                                <Option value="20">20</Option>
                                                <Option value="30">30</Option>
                                            </Select>
                                        </Input.Group>
                                    </div>
                                )}>
                                    <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <HorizontalBar onElementsClick={this._onCommentClick.bind(this,'finish')} height={110} data={this.line_course_finish} options={options} />
                                        }
                                    </div>
                                </Card>
                                <Card className='mt_10'  title={this.state.course_data_title}  extra={(
                                    <div className="flex row align_items">
                                        <Button onClick={this.moreInfo.bind(this,'data')}>更多</Button>&nbsp;
                                        <Select 
                                                value={this.state.course_data_title}
                                                onChange={val=>{
                                                    this.setState({course_data_title:val},()=>{
                                                        this.getCourseData()
                                                    })
                                                }}
                                            >
                                                <Option value="课程打赏人数">课程打赏人数</Option>
                                                <Option value="课程打赏次数">课程打赏次数</Option>
                                                <Option value="课程收藏量">课程收藏量</Option>
                                        </Select>
                                        <Input.Group compact>
                                            <Input disabled value={'展示数量'} style={{width:'80px'}}/>
                                            <Select 
                                                value={this.state.course_data_limit}
                                                onChange={val=>{
                                                    this.setState({course_data_limit: val},()=>{
                                                        this.getCourseData()
                                                    })
                                                }}
                                            >
                                                <Option value="10">10</Option>
                                                <Option value="20">20</Option>
                                                <Option value="30">30</Option>
                                            </Select>
                                            <Select value={this.state.course_data_auth} className='m_2' onChange={val=>{
                                                this.setState({course_data_auth:val},()=>{ this.getCourseData() })
                                            }}>
                                                <Select.Option value={-1}>全部</Select.Option>
                                                <Select.Option value={0}>未认证</Select.Option>
                                                <Select.Option value={1}>已认证</Select.Option>
                                            </Select>
                                        </Input.Group>
                                    </div>
                                )}>
                                    <div className="chart-wrapper">
                                        {!this.state.view?<div>无查看权限</div>:
                                            <HorizontalBar height={110} data={this.state.stat_course_data} options={options} />
                                        }
                                    </div>
                                </Card>

                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Card>
            <style>
            {
                `.ant-card-body::before, .ant-card-body::after {
                    display: none;
                    content: '';
                }`
            }
            </style>
        </div>
        );
    }
    _onPage=(val)=>{
        this.setState({ coin_page_current:val+1 },()=>{
            this.getCoinRank()
        })
    }
    columns = [
        {
            title: 'UID',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: '金币',
            dataIndex: 'integral',
            key: 'integral'
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: '姓名',
            dataIndex: 'username',
            key: 'username'
        },
        
        {
            title: '性别',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render:(item,record)=>record.sex==0?'未知':record.sex==1?'男':'女'
        },
        {
            title: '联系电话',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: true,
        },
    ]
}
const LayoutComponent =Statistic;
const mapStateToProps = state => {
    return {
        stat_userLevel:state.dashboard.stat_userLevel,
        stat_user:state.dashboard.stat_user,
        stat_integral:state.dashboard.stat_integral,
        stat_flag:state.dashboard.stat_flag,
        stat_course_com:state.dashboard.stat_course_com,
        stat_course_hit:state.dashboard.stat_course_hit,
        stat_course_learn:state.dashboard.stat_course_learn,
        stat_course_score:state.dashboard.stat_course_score,
        stat_course_finish:state.dashboard.stat_course_finish,

        user:state.site.user,

        stat_auth:state.dashboard.stat_auth,
        stat_comment:state.dashboard.stat_comment
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});