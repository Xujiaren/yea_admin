import React, { Component } from 'react';
import connectComponent from '../../util/connect'
import { Tabs, message, Card, Spin, DatePicker, Table, Input, InputNumber, Modal, Form, Switch } from 'antd'
import moment from 'moment'
import { Button, Popconfirm } from '../../components/BtnComponent'

class WithDraw extends Component {
	state = {
		atype: -1,
		begin: '',
		end: '',
		is_done: '0',
		keyword: '',
		page: 0,
		pageSize: 10,
		status: -1,
		total: 0,
		num: 0,
		numin: 0,
		showsetting: false,
		rulePanel: false,
		text: '',
		iftext: '',
		rulePanels: false,
		ttext: '',
		again_one: 0,
		again_two: 0,
		agree: 0,
		forOut:false,
	};
	componentDidMount() {
		this.getWithdrawOrder()
		this.Num()
		this.Text()
		this.getGuize()
	}
	Text = () => {
		const { actions } = this.props
		// actions.getCheck('fund_text', 'teacher')
		// actions.getNumss('fund_iftext', 'teacher')
		actions.postZhunru({
			again:0,
			open:1,
			text:'',
			v:0,
			agree:0,
			agree_text:'',
			resolved:(res)=>{
				console.log(res)
				this.setState({
					agree:res.agree,
					text:res.text,
					iftext:res.agreeText,
					again_two:res.again
				})
			},
			rejected:(err)=>{
				console.log(err)
			}
		})
	}
	Num = () => {
		const { actions } = this.props
		actions.getNum('integral_to_balance_rate', 'exchange')
		actions.getNums('withdrawl_limit', 'teacher')
	}
	componentWillReceiveProps(n_props) {
		if (n_props.num != this.props.num) {
			this.setState({
				num: parseInt(n_props.num[0].val)
			})
		}
		if (n_props.nums != this.props.nums) {
			this.setState({
				numin: parseInt(n_props.nums[0].val)
			})
		}
		if (n_props.numss != this.props.numss) {
			this.setState({
				iftext: n_props.numss[0].val
			})
		}
		if (n_props.check_list !== this.props.check_list) {
			this.setState({
				text: n_props.check_list[0].val
			})
		}
	}
	actionWithDrawOrder = (withdraw_id) => {
		this.props.actions.actionWithdrawOrder({
			is_done: 1,
			withdraw_id,
			resolved: (res) => {
				message.success('提交成功')
				this.getWithdrawOrder()
			},
			rejected: () => {

			}
		})
	}
	getWithdrawOrder = () => {
		let {
			atype,
			begin,
			end,
			is_done,
			keyword,
			page,
			pageSize,
			status,
		} = this.state

		this.setState({ loading: true })
		this.props.actions.getWithdrawOrder({
			atype,
			begin,
			end,
			is_done,
			keyword,
			page,
			page_size: pageSize,
			status,
			resolved: (res) => {
				const { total, page, data } = res
				if (Array.isArray(data)) {
					this.setState({ data_list: data, total, page })
				}
				this.setState({ loading: false })
			},
			rejected: () => {
				this.setState({ loading: false })
			}
		})
	}
	onMore = (val) => {
		console.log(val)
	}
	renderTitle = () => {
		return (
			<>
				<DatePicker.RangePicker format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }} onChange={(val, dateString) => {
					let begin = '', end = ''
					if (Array.isArray(dateString) && dateString.length === 2) {
						begin = dateString[0]
						end = dateString[1]
					}
					console.log(dateString)
					this.setState({ begin, end }, this.getWithdrawOrder)
				}}></DatePicker.RangePicker>
				<Input.Search style={{ width: 200 }} onSearch={() => {
					this.setState({ page: 0 }, this.getWithdrawOrder)
				}} value={this.state.keyword} onChange={e => {
					this.setState({ keyword: e.target.value })
				}}></Input.Search>
				<Button type='primary' style={{ marginLeft: '30px' }} onClick={() => { this.setState({ showsetting: true }) }}>提现设置</Button>
				<Button className='m_2' style={{ marginLeft: '30px' }} onClick={() => {
					this.setState({ rulePanel: true })
				}}>准入文案编辑</Button>
				<Button className='m_2' style={{ marginLeft: '30px' }} onClick={() => {
					this.setState({ rulePanels: true })
				}}>提现规则设置</Button>
			</>
		)
	}
	onOk = () => {
		const { num, numin } = this.state
		const { actions } = this.props
		actions.publishNum({
			keyy: 'withdrawl_limit',
			section: 'teacher',
			val: numin.toString(),
			resolved: (res) => {
				message.success({
					content: '修改成功'
				})
				this.Num()
				this.setState({
					showsetting: false
				})
			},
			rejected: (err) => {
				console.log(err)
			}
		})
		actions.publishNum({
			keyy: 'integral_to_balance_rate',
			section: 'exchange',
			val: num.toString(),
			resolved: (res) => {
				message.success({
					content: '修改成功'
				})
				this.Num()
				this.setState({
					showsetting: false
				})
			},
			rejected: (err) => {
				console.log(err)
			}
		})
	}
	onOkey = () => {
		const { text, iftext,agree,again_two } = this.state
		const { actions } = this.props
		// actions.publishNum({
		// 	keyy: 'fund_text',
		// 	section: 'teacher',
		// 	val: text,
		// 	resolved: (res) => {
		// 		message.success({
		// 			content: '操作成功'
		// 		})
		// 		this.Text()
		// 		this.setState({
		// 			rulePanel: false
		// 		})
		// 	},
		// 	rejected: (err) => {
		// 		console.log(err)
		// 	}
		// })
		// actions.publishNum({
		// 	keyy: 'fund_iftext',
		// 	section: 'teacher',
		// 	val: iftext,
		// 	resolved: (res) => {
		// 		message.success({
		// 			content: '操作成功'
		// 		})
		// 		this.Text()
		// 		this.setState({
		// 			rulePanel: false
		// 		})
		// 	},
		// 	rejected: (err) => {
		// 		console.log(err)
		// 	}
		// })
		actions.postZhunru({
			again:again_two,
			open:1,
			text:text,
			v:1,
			agree:agree,
			agree_text:iftext,
			resolved:(res)=>{
				message.success({
					content: '提交成功'
				})
				this.setState({
					rulePanel: false
				})
			},
			rejected:(err)=>{
				console.log(err)
			}
		})
	}
	getGuize = () => {
		this.props.actions.postGuize({
			again: 1,
			open: 1,
			text: '',
			v: 0,
			resolved: (res) => {
				this.setState({
					ttext: res.text,
					again_one: res.again
				})
			},
			rejected: (err) => {
				console.log(err)
			}
		})
	}
	onGuize = () => {
		const { again_one, ttext } = this.state
		this.props.actions.postGuize({
			again: again_one,
			open: 1,
			text: ttext,
			v: 1,
			resolved: (res) => {
				message.success({
					content: '提交成功'
				})
				this.getGuize()
				this.setState({
					rulePanels: false
				})
			},
			rejected: (err) => {
				console.log(err)
			}
		})
	}
	onOut=()=>{
		const{status,begin,end,keyword,is_done,atype,}=this.state
		this.setState({
			forOut: true
		})
		this.props.actions.exportWithDraw({
			status:status,
			begin:begin,
			end:end,
			keyword:keyword,
			is_done:is_done,
			atype:atype,
			resolved:(data)=>{
				const { fileName, adress, name, address } = data
				const url = fileName || adress || name || address

				this.setState({ forOut: false })
				message.success({
					content: '导出成功',
				})
				window.open(url, '_black')
			},
			rejected:(err)=>{
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
		return (
			<div className="animated fadeIn" >
				<Spin spinning={this.state.loading}>
					<Card title={this.renderTitle()}>
						<Tabs onChange={(is_done) => this.setState({ is_done }, this.getWithdrawOrder)} activeKey={this.state.is_done}>
							<Tabs.TabPane tab="未处理" key='0'>
							</Tabs.TabPane>
							<Tabs.TabPane tab="已处理" key='1'>
							</Tabs.TabPane>
						</Tabs>
						<div style={{display:'flex',justifyContent:'space-between'}}>
						<div></div>
						<Button loading={this.state.forOut} onClick={this.onOut}>导出</Button>
						</div>
						<Table
							scroll={{ x: 1200 }}
							rowKey='withdrawId'
							// rowSelection={{
							//     selectedRowKeys:this.state.selectedRowKeys,
							//     onChange:(value)=>{ this.setState({ selectedRowKeys:value }) }}
							// }
							columns={this.col}
							dataSource={this.state.data_list}
							pagination={{
								current: this.state.page + 1,
								pageSize: this.state.pageSize,
								total: this.state.total,
								showQuickJumper: true,
								onChange: (val) => {
									this.setState({ page: val - 1 }, this.getWithdrawOrder)
								},
								showTotal: (total) => '总共' + total + '条'
							}}>

						</Table>
					</Card>
				</Spin>
				<Modal
					zIndex={90}
					title="提现设置"
					visible={this.state.showsetting}
					okText="确定"
					width={800}
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={() => {
						this.setState({ showsetting: false })
					}}
					onOk={this.onOk}
					bodyStyle={{ padding: "10px 25px" }}
				>
					<Form {...formItemLayout}>
						<Form.Item label='提现金额比例'>
						<span style={{fontSize:'16px',marginLeft:'10px', marginRight:'5px',fontWeight:'bolder'}}>1元:</span>
							<InputNumber value={this.state.num} onChange={(e) => { this.setState({ num: e }) }} /><span style={{fontSize:'16px',marginLeft:'10px'}}>金币</span>
							<div style={{color:'red',fontSize:'12px', marginTop:'10px'}}>注：1元={this.state.num}金币</div>
						</Form.Item>
						<Form.Item label='最低提现额度'>
							<InputNumber value={this.state.numin} onChange={(e) => { this.setState({ numin: e }) }} /><span style={{fontSize:'16px',marginLeft:'10px'}}>元</span>
						</Form.Item>
					</Form>
				</Modal>
				<Modal title={'准入提示'} onOk={this.onOkey} visible={this.state.rulePanel} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
					this.setState({ rulePanel: false })
				}}>
					<Form.Item label='准入提示'>
						<Input.TextArea autoSize={{ minRows: 6 }} defaultValue={'准入提示'} value={this.state.text} onChange={e => { this.setState({ text: e.target.value }) }}></Input.TextArea>
						{/* <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>提示:换行请用";"隔开</div> */}
					</Form.Item>
					<Form.Item label='是否启用不再提示按钮'>
						<Switch checked={this.state.again_two ? true : false} onChange={(e) => {
							if (e) {
								this.setState({ again_two: 1 })
							} else {
								this.setState({ again_two: 0 })
							}
						}} />
					</Form.Item>
					<Form.Item label='是否开启同意明细'>
						<Switch checked={this.state.agree ? true : false} onChange={(e) => {
							if (e) {
								this.setState({ agree: 1 })
							} else {
								this.setState({ agree: 0 })
							}
						}} />
					</Form.Item>
					{
						this.state.agree ?
							<Form.Item label='同意明细'>
								<Input.TextArea autoSize={{ minRows: 6 }} defaultValue={'同意明细'} value={this.state.iftext} onChange={e => { this.setState({ iftext: e.target.value }) }}></Input.TextArea>
							</Form.Item>
							: null
					}

				</Modal>
				<Modal title={'提现规则'} onOk={this.onGuize} visible={this.state.rulePanels} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
					this.setState({ rulePanels: false })
				}}>
					<Form.Item label='提现规则文案'>
						<Input.TextArea autoSize={{ minRows: 6 }} defaultValue={'提现规则'} value={this.state.ttext} onChange={e => { this.setState({ ttext: e.target.value }) }}></Input.TextArea>
						{/* <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>提示:换行请用";"隔开</div> */}
					</Form.Item>
					<Form.Item label='是否启用不再提示按钮'>
						<Switch checked={this.state.again_one ? true : false} onChange={(e) => {
							if (e) {
								this.setState({ again_one: 1 })
							} else {
								this.setState({ again_one: 0 })
							}
						}} />
					</Form.Item>
				</Modal>
			</div>
		);
	}
	col = [
		{ title: "ID", dataIndex: "withdrawId", key: 'withdrawId' },
		{ title: '用户ID', dataIndex: 'userId', key: 'userId' },
		{ title: '用户昵称', dataIndex: 'nickname', key: 'nickname' },
		{ title: '金额', dataIndex: 'amount', key: 'amount' },
		{ title: '提交时间', dataIndex: '', key: '' ,render:((item,ele)=>{
			return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
		})},
		{
			title: '提现途径', render: (item, ele) => {
				return ele.atype === 1 ? '支付宝' : ele.atype === 2 ? '银行卡' : '微信'
			}
		},
		{
			title: '提现账号', render: (item, ele) => {
				return ele.account
			}
		},
		{ title: '详细信息', dataIndex: '', key: '' ,render:(item,ele)=>{
			return(
				<>
				{
					ele.atype==2?
					<div>
						<div>姓名：{ele.realname}</div>
						<div>开户行：{ele.bankName}</div>
					</div>
					:null
				}
				</>
			)
		}},
		{
			title: '是否处理', render: (item, ele) => {
				return ele.isDone ? '已处理' : '未处理'
			}
		},
		{
			title: '处理时间', render: (item, ele) => {
				if (ele.updateTime) {
					return moment.unix(ele.updateTime).format('YYYY-MM-DD HH:mm')
				} else {
					return '暂无'
				}
			}
		},
		{ title: '备注', dataIndex: 'remark', key: 'remark' },
		{
			title: '操作', fixed: "right", render: (item, ele) => {
				if (ele.isDone)
					return <Button size='small' disabled >已处理</Button>
				return (


					<Popconfirm value='withdraw/edit' title='确定处理吗' okText='确定' cancelText='取消' onConfirm={this.actionWithDrawOrder.bind(this, ele.withdrawId)}>
						<Button size='small' type='primary'>处理</Button>
					</Popconfirm>

				)
			}
		}
	]
}

const LayoutComponent = WithDraw;
const mapStateToProps = state => {
	return {
		num: state.user.num,
		nums: state.user.nums,
		numss: state.user.numss,
		check_list: state.ad.check_list,
	}
}

export default connectComponent({ LayoutComponent, mapStateToProps })