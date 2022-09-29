import React, { Component } from 'react';
import { DatePicker,Modal, Form, Upload, message, Button, Icon, Select } from 'antd';
import PieChart from 'bizcharts/lib/plots/PieChart'
import { Chart, Interval, Tooltip,Axis,Slider } from 'bizcharts';
import {Tabs,Table} from 'antd'
import moment from 'moment'
import locale from 'antd/es/date-picker/locale/zh_CN';
import PropTypes  from 'prop-types'

export default class StatCourse extends Component {
	state = {
        beginTime: null,
        endTime: null,
        begin_time:'',
        end_time:'',
        stat_course_id:0,
        loading:false,
        btnLoading:false,
        exportLoading:false,
        info:[],
        result:[],
        title:[],
        is_auth:-1
    };
    static defaultProps = {
        courseId: 0,
    }
    static propTypes = {
        courseId: PropTypes.number,
    }
    mapTxt = {
        'times': '完播次数',
        'people': '完播人数',
        'again':'复学次数',
        'auth': '认证用户学习人数',
        'authPeople': '认证用户完播人数',
        'authTimes': '认证用户完播次数',
        'pcomments':'留言人数',
        'comments':'留言次数',
        'scoreNumber':'评分人数',
        'rewards':'打赏量',

        'courseName':'课程名称',
        'pv':'课程PV',
        'uv':'课程UV',
        'score':'评分值',
        'ucomments':'人均留言次数',
    }
	componentDidMount() {
       
	}
	componentWillMount(){
	}
	componentWillReceiveProps(n_props) {

    }
    onExport = ()=>{
        this.setState({ exportLoading:true })
        const {begin_time,end_time} = this.state
        const course_ids = this.props.courseId
        const time_type = 3
        this.props.actions.getCourseStat({
            begin_time,end_time,course_ids,type:'export',action:'export',time_type,
            resolved:(data)=>{
                console.log(data)
                const {fileName,adress,name,address} = data
                let url = fileName||adress||name||address

                message.success('导出成功')
                this.getCourseStat()
                this.setState({ exportLoading:false },()=>{window.open(url,'_black')})
            },
            rejected:(data)=>{
                message.error(data)
                this.setState({ exportLoading:false })
            }
        })
    }
	getCourseStat = ()=>{
        this.setState({ btnLoading:true });
        const {begin_time,end_time,is_auth} = this.state
        const course_id = this.props.courseId
        this.props.actions.getCourseStat({
            begin_time,end_time,course_id,type:'',is_auth,
            resolved:(data)=>{
                console.log(data)
                const filter = ['courseMap']
                let title = []
                Object.keys(data).map(ele=>{
                    if(filter.indexOf(ele) == -1){
                        title.push(ele)
                        let _tmp = []
                        data[ele].map((_ele,index)=>{
                            Object.keys(_ele).map(__ele=>{
                                _tmp.push({ type:__ele,value:_ele[__ele] })
                                // _tmp.push({ type:index+'月',value:index+Math.floor(Math.random()*100) })
                            })
                        })
                        data[ele].data = _tmp
                    }else{
                        data[ele] = [data[ele]]
                    }
                })
                this.setState({result:data,title:title,loading:false,btnLoading:false,show:true})
            },
            rejected:(data)=>{
                this.setState({loading:false,btnLoading:false})
                message.error(data)
            }
        })
    }
	render() {
        const {loading} = this.state
		return (
			<>
				<Button loading={loading} onClick={()=>{
                    let date = new Date();
                    let year = parseInt(date.getFullYear());
                    let years = year
                    let mon = parseInt(date.getMonth()+1);
                    let mons = mon-6
                    if(mons<1){
                        mons = 12+mons
                        years = year - 1
                    }
                    this.setState({
                        begin_time:year+'-'+mon,
                        end_time:years+'-'+mons,
                        aTime:null,
                        endTime:null,
                        beginTime:null,
                        loading:true
                    },()=>{ this.getCourseStat() })
                }} className="m_2" size='small'>数据统计</Button>
				<Modal width={1000} visible={this.state.show} maskClosable={true} footer={null} onCancel={() => { this.setState({ show: false }) }}>
                    {/* <DatePicker.RangePicker mode={['month', 'month']} allowClear={true} value={this.state.aTime} locale={locale} onChange={(date,dateString)=>{
                        console.log(dateString)
                        this.setState({
                            aTime:date,
                            begin_time:dateString[0],
                            end_time:dateString[1]
                        })
                    }} /> */}
                    <DatePicker.MonthPicker value={this.state.beginTime} disabledDate={(current)=>current && current > moment().endOf('month')} allowClear={true} onChange={(data,dateString)=>{
                        console.log(dateString)
                        this.setState((pre)=>{
                            return {
                                endTime:null,
                                end_time:'',
                                beginTime:data,
                                begin_time:dateString,
                            }
                        })
                    }} />
                    <span className='pad_l5 pad_r5'>至</span>
                    <DatePicker.MonthPicker value={this.state.endTime} disabledDate={(current)=>current && (current > moment().endOf('month') || current < this.state.beginTime)} allowClear={true} onChange={(data,dateString)=>{
                        console.log(dateString)
                        this.setState((pre)=>{
                            return {
                                endTime:data,
                                end_time:dateString,
                            }
                        })
                    }} />
                    {/* <Select value={this.state.is_auth} onChange={(val) => { this.setState({is_auth:val}) }} className='m_2'>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select> */}
                    <Button className='ml_5' loading={this.state.btnLoading} onClick={()=>{ this.getCourseStat() }}>筛选</Button>
                    <Button className='ml_5' loading={this.state.exportLoading} onClick={this.onExport}>导出</Button>
                    <Table pagination={false} size='small' className='mt_10' bordered={false} columns={this.col} dataSource={this.state.result['courseMap']||[]}></Table>
                    {/*<Table pagination={false} size='small' className='mt_10' bordered={false} columns={this.col_se} dataSource={this.state.info}></Table> */}
                    
                    <Tabs defaultActiveKey="0_tabs" size={{size:'small'}}>
                        {
                            this.state.title.map((ele,index)=>(
                            <Tabs.TabPane tab={this.mapTxt[ele]} key={index+'_tabs'}>
                                <Chart height={400} autoFit data={this.state.result[ele]['data']||[]} interactions={['active-region']} padding={[40, 0, 100, 0]} >
                                    <Axis name="value" visible={false} />
                                    <Interval 
                                        label={["value", { style: { fill: '#535353' } }]} 
                                        color='type'
                                        position="type*value"
                                    />
                                    <Tooltip shared />
                                    
                                </Chart>
                                {/* <PieChart
                                    data={this.state.result[ele]['data']||[]}
                                    title={{
                                        visible: true,
                                        text: ''
                                    }}
                                    description={{
                                        visible: true,
                                        text: '',
                                    }}
                                    radius={0.8}
                                    angleField='value'
                                    colorField='type'
                                    label={{
                                        visible: true,
                                        type: 'outer',
                                        offset: 20,
                                    }}
                                /> */}
                            </Tabs.TabPane>
                            ))
                        }
                    </Tabs>
				</Modal>
			</>
		);
    }
    col = [
        { title:this.mapTxt['courseName'],dataIndex:'courseName',key:'courseName' },
        
        { title:this.mapTxt['pv'],dataIndex:'pv',key:'pv'},
        { title:this.mapTxt['uv'],dataIndex:'uv',key:'uv' },
        { title:this.mapTxt['score'],dataIndex:'score',key:'score' },
        // { title:this.mapTxt['times'],dataIndex:'times',key:'times' },
        // { title:this.mapTxt['people'],dataIndex:'people',key:'people' },
        // { title:this.mapTxt['again'],dataIndex:'again',key:'again' },
        // { title:this.mapTxt['auth'],dataIndex:'auth',key:'auth' },
    ]
    col_se = [
        { title:this.mapTxt['authPeople'],dataIndex:'authPeople',key:'authPeople' },
        { title:this.mapTxt['authTimes'],dataIndex:'authTimes',key:'authTimes' },
        { title:this.mapTxt['comments'],dataIndex:'comments',key:'comments' },
        { title:this.mapTxt['rewards'],dataIndex:'rewards',key:'rewards' },
        { title:this.mapTxt['scoreNumber'],dataIndex:'scoreNumber',key:'scoreNumber' },
        { title:this.mapTxt['score'],dataIndex:'score',key:'score' },
    ]
}
function getPv(pv){
    if(pv<=0) return 0;
    return Math.floor(pv/3)+8
}