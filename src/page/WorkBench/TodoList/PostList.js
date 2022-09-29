import React, { Component } from 'react';
import { CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { PageHeader, Card, Form, Select, Checkbox, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, Modal, Avatar, Empty } from 'antd';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import {Button,Popconfirm} from '../../../components/BtnComponent'

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const InputGroup = Input.Group;


class PostList extends Component {

	post_list = []
	page_total = 0
	page_current = 0
	page_size = 10

	current_status = 0
	sort = 0

	state = {
		edit : true,
		view : true,

		visible: false,
		previewImage: '',
		showImgPanel: false,
		keywords:'',

		rewardId:'',
		realname:'',
		itemName:'',
		itemImg:'',
		address:'',
		mobile:'',

		ship_sn:'',
		is_ship:0,
		sort:0
	};

	componentDidMount(){
		const {actions} = this.props
		actions.getPost({keywords:this.state.keyword,is_ship:0})

	}
	componentWillReceiveProps(n_props){
		if(n_props.post_list !== this.props.post_list){
			if(n_props.post_list.data.length == 0){
                message.info('暂时没有数据')
            }
			this.post_list = n_props.post_list.data||[]
			this.page_total=n_props.post_list.total
			this.page_current=n_props.post_list.page
		}
	}
	getPost = ()=>{
		const {keywords,sort,is_ship} = this.state
		this.props.actions.getPost({
			keywords,sort,page:this.page_current,pageSize:this.page_size,is_ship
		})
	}
	onPost=()=>{
		const { ship_sn } = this.state
		if(!ship_sn){
			message.error('请输入物流单号')
			return
		}
		const { actions } = this.props
		let { rewardId:reward_id } = this.state
		
		actions.updatePost({
			reward_id,ship_sn,
			resolved:(data)=>{
				actions.getTodo()
				message.success('提交成功')
				this.handleCancel()
				this.getPost()
			}
		})
	}
	showModal(index){
		let {
			rewardId,
			realname,
			itemName,
			itemImg,
			address,
			mobile,
			shipSn
		} = this.post_list[index]

		this.setState({
			rewardId,
			realname,
			itemName,
			itemImg,
			address,
			mobile,
			ship_sn:shipSn,
			visible: true
		});
	};
	onSearch = (val)=>{
		this.setState({ keywords:val },()=>{
			this.page_current = 0
			this.getPost()
		})
	}
	_onPage=(val)=>{
		this.page_current = val - 1
		this.getPost()
	}
	_onOrder=(val)=>{
		this.setState({ sort:val },()=>{
			this.getPost()
		})
	}
	_onStatus=(val)=>{
		this.setState({
			is_ship:val
		},()=>{
			this.page_current = 0
			this.getPost()
		})
	}
	showImgPanel(url){
        this.setState({
            showImgPanel: true,
            previewImage:url
        });
    }
    hideImgPanel=()=>{
        this.setState({
            showImgPanel: false
        });
    }
	
	handleCancel = () => {
		this.setState({
			ship_sn:'',
			visible: false,
		});
	};
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
			<div className="animated fadeIn">
				<PageHeader

					ghost={false}
					onBack={() => window.history.back()}
					title=""
					subTitle="邮寄列表"
				>
					<Row>
						<Col xs="12" lg="12">
							<Card bodyStyle={{ padding: 0 }}>
								<CardHeader className="flex f_row">
									<InputGroup compact className="mr_10">
										<Input disabled={true} style={{ width: '50px' }} defaultValue="状态" />
										<Select value={this.state.is_ship} onChange={this._onStatus}>
											<Option value={-1}>全部</Option>
											<Option value={0}>未处理</Option>
											<Option value={1}>已处理</Option>
										</Select>
									</InputGroup>
									<InputGroup compact className="mr_10">
										<Input disabled={true} style={{ width: '50px' }} defaultValue="排序" />
										<Select value={this.state.sort} onChange={this._onOrder}>
											<Option value={0}>降序</Option>
											<Option value={1}>升序</Option>
										</Select>
									</InputGroup>
									<Search
										placeholder="搜索"
										onSearch={this.onSearch}
										style={{ maxWidth: "200px" }}
										value = {this.state.keywords}
										onChange={(e)=>{ this.setState({ keywords:e.target.value })}}
									/>
								</CardHeader>
								<CardBody>
									<Table bordered responsive size="sm">
										<thead>
											<tr>
												<th>序号</th>
												<th>ID</th>
												<th>中奖时间</th>
												<th>产品名</th>
												<th>产品图</th>
												<th>用户昵称</th>
												<th>收件人姓名</th>
												<th>收件地址</th>
												<th>手机号</th>
												<th>物流单号</th>
												<th>操作</th>
											</tr>
										</thead>
										<tbody>
											{this.post_list.length==0?
											 <tr>
												 <td colSpan={10}>
												 	<Empty className='mt_20 mb_10' description='待邮寄列表为空'></Empty>
												 </td>
											 </tr>
											:this.post_list.map((ele,index) =>{
												{/*if(ele.ctype == 2){*/}
													return(
														<tr key={ele.rewardId+'reward'}>
															<td>{index+1}</td>
															<td>{ele.rewardId}</td>
															<td>{moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm:ss')}</td>
															<td>{ele.itemName}</td>
															<td>
																<a>
																	<img onClick={this.showImgPanel.bind(this,ele.itemImg)} className="disc head-example-img" src={ele.itemImg}/>
																</a>
															</td>
															<td>{ele.nickname}</td>
															<td>{ele.realname}</td>
															<td>{ele.address}</td>
															<td>{ele.mobile}</td>
															<td>{ele.shipSn}</td>
															<td>
																<div className="flex f_row j_space_around">
																	<Button value="post/edit" type="primary" size={'small'} onClick={this.showModal.bind(this,index)}>物流单号回填</Button>
																</div>
															</td>
														</tr>
													)
												{/*
												}else{
													return null
												}
												*/}
											}
											)}
										</tbody>
									</Table>

									<Pagination  showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper  pageSize={this.page_size} current={this.page_current+1} onChange={this._onPage} total={this.page_total} />
								</CardBody>
							</Card>
						</Col>

					</Row>
				</PageHeader>
				<Modal
					title="物流单号回填"
					visible={this.state.visible}
					okText="提交"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={this.handleCancel}
					onOk={this.onPost}
					bodyStyle={{ padding: "10px" }}
				>
					<Form {...formItemLayout}>
						<Form.Item label="产品名称">
							<Input disabled value={this.state.itemName} />
						</Form.Item>
						<Form.Item label="产品图">
							<a>
								<img className="disc head-example-img" src={this.state.itemImg}/>
							</a>
						</Form.Item>
						<Form.Item label="收件人信息">
							<Input disabled value={this.state.realname} />
						</Form.Item>
						<Form.Item label="收件人地址">
							<Input disabled value={this.state.address} />
						</Form.Item>
						<Form.Item label="联系方式">
							<Input disabled value={this.state.mobile} />
						</Form.Item>
						<Form.Item label="物流单号">
							<Input 
								placeholder="请输入单号" 
								value={this.state.ship_sn}
								onChange={e=>{
									this.setState({
										ship_sn:e.target.value
									})
								}}
							/>
						</Form.Item>
					</Form>
				</Modal>

				<Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
					<img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
				</Modal>
			</div>
		);
	}
}

const LayoutComponent = PostList;
const mapStateToProps = state => {
	return {
		post_list: state.dashboard.post_list,
		user:state.site.user
	}
}
export default connectComponent({ LayoutComponent, mapStateToProps });
