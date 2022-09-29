import React, { Component } from 'react';
import { Row,Card,Badge, Select, DatePicker, Menu, Dropdown, Button, Icon, message, Col, Spin, Popover } from 'antd';
import connectComponent from '../../util/connect';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment'
import { PieChart,Chart, Interval, Tooltip as BTooltip,Axis,Slider } from 'bizcharts';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Dashboard extends Component {

	state = {
		result_data: [],
		teacher_data: [],
		sex_data: [],
		statTime: [moment().subtract(30,'days'),moment()]
	}
	componentDidMount(){
		this.getStatUserSex()
		this.getStatTeacherLevel()
		this.getAllUserInfoStat()
	}
	getStatTeacherLevel = ()=>{
		this.setState({ stat_loading:true })

        let {statTime} = this.state
        let begin_time = '',end_time = ''
        if(statTime && Array.isArray(statTime) && statTime.length == 2){
            begin_time = statTime[0].format('YYYY-MM-DD')
            end_time = statTime[1].format('YYYY-MM-DD')
        }
		this.props.actions.getStatTeacherLevel({
			begin_time,end_time,
			resolved:(res)=>{
				let teacher_data = []
				teacher_data = Object.keys(res).map(ele => ({ type: ele, value: res[ele] }))
				this.setState({ teacher_data,stat_loading:false })
			},
			rejected:()=>{
				this.setState({ stat_loading:false })
			}
		})
	}
	getStatUserSex = ()=>{
		this.props.actions.getStatUserSex({
            resolved: (res) => {
				const map = { manusers: '男性', womanusers: '女性' }
				let sex_data = []
				let unknow = 100
				Object.keys(res).map(ele =>{
					let value = parseInt(res[ele] * 100)
					unknow = unknow - value
					sex_data.push({ type: map[ele], value: value })
				})
				sex_data.push({ type:'保密',value:unknow })
                this.setState({
					sex_data
				})
            },
            rejected: () => {
            }
        })
	}
	getAllUserInfoStat = ()=>{
		this.props.actions.getAllUserInfoStat({
			beginStr:'',
			endStr:'',
			resolved: (res) => {
				let map_txt = {
					'APP':'APP用户数',
					'总人数':'总人数',
					'总认证':'总认证人数',
					'小程序数':'小程序用户数'
				}

				let arr_data = []
				if(res && typeof res === 'object'){
					Object.keys(res).map(ele=>{
						if(map_txt[ele])
							arr_data.push({
								type: map_txt[ele],
								value: parseInt(res[ele])
							})
					})
				}
                this.setState({
					result_data: arr_data
				})
            },
            rejected: () => {

            }
		})
	}
	renderTime = ()=>{
		return (
			<DatePicker.RangePicker 
				showTime={false} 
				allowClear={true}
				value={this.state.statTime} 
				locale={locale} onChange={(date)=>{
					this.setState({
						statTime:date,
					},this.getStatTeacherLevel)
			}}/>
		)
	}
	render() {
		return (
			<div className="animated fadeIn">
				
					<Row gutter={6}>
						<Col span={8}>
							<Card title='用户概况'>
								<Chart height={400} autoFit data={this.state.result_data} interactions={['active-region']} padding={[40, 0, 100, 0]} >
									<Axis name="value" visible={false} />
									<Interval 
										label={["value", { style: { fill: '#535353' } }]} 
										color='type'
										position="type*value"
									/>
									<BTooltip shared />
								</Chart>
							</Card>
						</Col>
						<Col span={8}>
							<Spin spinning={this.state.stat_loading}>
							<Card title='各级别讲师数量占比' extra={
								<Popover trigger='click' content={this.renderTime()}>
									<a>选择时间</a>
								</Popover>
							}>
								
								
								<PieChart
									data={this.state.teacher_data || []}
									title={{
										visible: false,
										text: '各级别讲师数量占比'
									}}
									description={{
										visible: false,
										text: '',
									}}
									radius={0.6}
									angleField='value'
									colorField='type'
									label={{
										visible: true,
										type: 'outer',
										offset: 20,
									}}
								/>
								
							</Card>
							</Spin>
						</Col>
						<Col span={8}>
							<Card title='男女性别比例'>
								<PieChart
									data={this.state.sex_data || []}
									title={{
										visible: false,
										text: '男女性别比例'
									}}
									description={{
										visible: false,
										text: '',
									}}
									radius={0.6}
									angleField='value'
									colorField='type'
									label={{
										visible: true,
										type: 'outer',
										offset: 20,
									}}
								/>
							</Card>
						</Col>
						
					</Row>
				
			</div>
		);
	}
}

const LayoutComponent = Dashboard;
const mapStateToProps = state => {
	return {

	}
}

export default connectComponent({ LayoutComponent, mapStateToProps })