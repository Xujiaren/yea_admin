import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Table as TableAntd, Form, Empty, Radio, Select, Modal, Steps, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, InputNumber, Tabs, } from 'antd';
import { Link } from 'react-router-dom'
import connectComponent from '../../../util/connect';

import moment from 'moment';

import locale from 'antd/es/date-picker/locale/zh_CN';
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import AntdOssUpload from '../../../components/AntdOssUpload'
import { Button, Popconfirm } from '../../../components/BtnComponent'
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
class Teacher extends Component {

	teacher_list = [];
	page_total = 0
	page_current = 0
	page_size = 20
	total = 0

	state = {
		edit: true,
		view: true,
		showBindUser: false,
		current: 0,
		leader_recomm_index: 99,
		teacher_id: 0,
		keyword: '',
		sortList: [],
		teacher_list: [],
		importLoading: false,
		showResult: false,
		total: 0,
		success: 0,
		rejectedUser: [],
		page: 0,
		level: -1,
		isInside: -1,
		status: -1,
		bindUsers: false,
		teacherId: 0,
		user_id: '',
		userList: [],
		exportOut: false,
	}

	componentWillReceiveProps(nextProps) {
		// console.log( nextProps.teachers_list,'??')
		if (nextProps.teachers_list !== this.props.teachers_list) {
			if (nextProps.teachers_list.data.length == 0) {
				message.info('暂时没有数据')
			}
			this.setState({
				teacher_list: nextProps.teachers_list.data
			})
			this.teacher_list = nextProps.teachers_list.data;
			this.page_total = nextProps.teachers_list.total
			this.page_current = nextProps.teachers_list.page + 1
			this.total = nextProps.teachers_list.total
		}
		if (nextProps.user_list !== this.props.user_list) {
			this.setState({
				userList: nextProps.user_list.data
			})
		}
	}
	componentWillMount() {
		const { search } = this.props.history.location
		let page = 0
		if (search.indexOf('page=') > -1) {
			page = search.split('=')[1] - 1
			this.page_current = page
		}
		this.getTeach()
	}
	getTeach = () => {
		const { actions } = this.props;
		actions.getTeachers({
			wtype: this.state.isInside,
			keyword: this.state.keyword,
			page: this.page_current,
			pageSize: this.page_size,
			status: this.state.status,
			level: this.state.level
		})
	}
	_onDelete(teacher_id) {
		if (!teacher_id) return;
		const { actions } = this.props;

		actions.removeTeacher({
			teacher_id,
			resolved: (data) => {
				message.success("操作成功")
				actions.getTeachers({
					wtype: this.state.isInside,
					keyword: this.state.keyword,
					page: this.page_current - 1,
					pageSize: this.page_size,
					level: this.state.level,
					status: this.state.status,
				})
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onStatus(teacher_id) {
		if (!teacher_id) return;
		const { actions } = this.props;

		actions.updateTeacher({
			teacher_id,
			resolved: (data) => {
				message.success("操作成功")
				actions.getTeachers({
					wtype: this.state.isInside,
					keyword: this.state.keyword,
					page: this.page_current - 1,
					pageSize: this.page_size,
					level: this.state.level,
					status: this.state.status,
				})
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onStatuss(teacher_id) {
		if (!teacher_id) return;
		const { actions } = this.props;

		actions.updateTeachers({
			teacher_id,
			action:'fire',
			resolved: (data) => {
				message.success("操作成功")
				actions.getTeachers({
					wtype: this.state.isInside,
					keyword: this.state.keyword,
					page: this.page_current - 1,
					pageSize: this.page_size,
					level: this.state.level,
					status: this.state.status,
				})
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onSearch = (val) => {
		const { actions } = this.props;
		// actions.getTeacher({
		// 	wtype: this.state.isInside,
		// 	keyword: val,
		// 	page: 0,
		// 	pageSize: this.page_size
		// })
		this.page_current = 0
		actions.getTeachers({
			wtype: this.state.isInside,
			keyword: val,
			page: this.page_current,
			pageSize: this.page_size,
			status: this.state.status,
			level: this.state.level
		})
		this.getTeach()

	}
	_onPage = (val) => {
		const { actions } = this.props;
		let pathname = this.props.history.location.pathname

		this.props.history.replace(pathname + '?page=' + val)
		actions.getTeachers({
			wtype: this.state.isInside,
			keyword: this.state.keyword,
			page: val - 1,
			pageSize: this.page_size,
			status: this.state.status,
			level: this.state.level
		})
	}
	next() {
		const current = this.state.current + 1;
		this.setState({ current });
	}

	prev() {
		const current = this.state.current - 1;
		this.setState({ current });
	}
	showBindUser(index) {
		this.setState({
			showBindUser: true
		})
	}
	hideBindUser = () => {
		this.setState({
			showBindUser: false
		})
	}
	_onPushTeacher(teacher_id, action) {
		const { actions } = this.props
		const { leader_recomm_index } = this.state
		if (leader_recomm_index > 10000) {
			message.info('排序不能大于1万')
			return
		}
		actions.recommonTecher({
			teacher_id,
			leader_recomm_index,
			action,
			resolved: () => {
				message.success('提交成功')
				actions.getTeachers({
					wtype: this.state.isInside,
					keyword: this.state.keyword,
					page: this.page_current - 1,
					pageSize: this.page_size,
					level: this.state.level,
					status: this.state.status,
				})
				if (!action)
					this.setState({ showSortPannel: false })
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onChange = (val) => {
		console.log(val)
		let page = 0
		const { search } = this.props.history.location
		if (search.indexOf('page=') > -1) {
			page = search.split('=')[1] - 1
			this.page_current = page
		}
		this.setState({ level: val }, () => {
			this._onSearch()
		})
	}
	_onChanges = (val) => {

		let page = 0
		const { search } = this.props.history.location
		if (search.indexOf('page=') > -1) {
			page = search.split('=')[1] - 1
			this.page_current = page
		}
		const { actions } = this.props
		this.setState({ isInside: val }, () => {
			this._onSearch()
		})


	}
	getUsers = () => {
		this.props.actions.getUser({
			userId: this.state.user_id,
			page: 0,
			pageSize: 10,
		})
	}
	onBind = (val) => {
		const { teacherId } = this.state
		this.props.actions.postTeacherBind({
			teacher_id: teacherId,
			user_id: val.userId,
			resolved: (res) => {
				message.success({
					content: '绑定成功'
				})
				this.getUsers()
			},
			rejected: (err) => {
				console.log(err)
			}
		})
	}
	render() {
		const { current } = this.state;
		const teacher_level = ['讲师', '初级', '中级', '高级']

		return (
			<div className="animated fadeIn">
				<Row>
					{/* <Tabs style={{ marginLeft: '10px' }} onChange={(e) => {
						this.page_current = 0
						this.setState({
							status: parseInt(e)
						}, () => { this.getTeach() })
					}}>
						<TabPane tab="正常状态" key='-1'>
						</TabPane>
						<TabPane tab="非正常状态" key='2'>
						</TabPane>
					</Tabs> */}
					<Col xs="12" lg="12">
						<Card>
							<CardHeader className="flex j_space_between align_items">
								<div className="flex row align_items f_grow_1 ml_5">
									<span style={{ flexShrink: 0 }}>筛选&nbsp;&nbsp;</span>
									{/*
								<RangePicker style={{ maxWidth: 200 }} locale={locale}/>
							*/}
									<Search
										placeholder="用户名／手机号"
										onSearch={this._onSearch}
										style={{ maxWidth: 200 }}
										value={this.state.keyword}
										onChange={(e) => {
											this.setState({ keyword: e.target.value })
										}}
									/>
									<Select style={{ width: '120px' }} value={this.state.level} onChange={this._onChange} defaultValue={0} className="m_w400">
										<Option value={-1}>全部</Option>
										<Option value={0}>讲师</Option>
										<Option value={1}>初级讲师</Option>
										<Option value={2}>中级讲师</Option>
										<Option value={3}>高级讲师</Option>
									</Select>
									<Select style={{ width: '120px' }} value={this.state.isInside} onChange={this._onChanges} defaultValue={-1} className="m_w400">
										<Option value={-1}>全部</Option>
										<Option value={0}>无</Option>
										<Option value={1}>经销商讲师</Option>
										<Option value={2}>外部讲师</Option>
										<Option value={3}>内部讲师</Option>
									</Select>
									<Select style={{ width: '120px' }} value={this.state.status} onChange={(e) => {
										this.page_current = 0
										this.setState({
											status: e
										}, () => {
											this.getTeach()
										})
									}} defaultValue={-1} className="m_w400">
										<Option value={-1}>全部</Option>
										<Option value={0}>下架</Option>
										<Option value={1}>上架</Option>
									</Select>
								</div>
								<div className="flex f_row f_nowrap align_items">
									<Button value='teacher/out' className='m_2' onClick={this.exportTeacherApply} loading={this.state.exportLoading}>导出</Button>
									<Button value='teacher/in' className='m_2' onClick={() => { this.setState({ showImportPannel: true }) }}>导入</Button>
									<Button value='teacher/order' className='m_2' onClick={this.getTeacherLeader}>领导风采排序</Button>
									<Button value='teacher/add' onClick={() => { this.props.history.push('/teacher-manager/teacher-edit/0') }}>添加讲师</Button>
								</div>
							</CardHeader>
							<CardBody>
								<Table responsive size="sm">
									<thead>
										<tr>
											<th>ID</th>
											<th>名字</th>
											<th>当前级别</th>
											<th>最高级别</th>
											<th>手机号</th>
											<th>卡号</th>
											<th>工号</th>
											<th>讲师类型</th>
											<th>课程数量</th>
											<th>聘用时间</th>
											<th>到期时间</th>
											<th>老师详情链接</th>
											{/* <th>领导风采排序</th> */}
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
										{this.state.teacher_list.length == 0 ?
											<tr>
												<td colSpan={8}>
													<Empty className="mt_10" description="没有数据" />
												</td>
											</tr>
											: this.state.teacher_list.map((ele, index) =>
												<tr key={index + 'teacher'}>
													<td>{ele.teacherId}</td>
													<td>{ele.teacherName}</td>
													<td>
														{teacher_level[ele.level]}
													</td>
													<td>
														{teacher_level[ele.teacherHlevel]}
													</td>
													<td>{ele.mobile}</td>
													<td>{ele.sn}</td>
													<td>{ele.workSn}</td>
													<td>{ele.wtype == 0 ? '无' : ele.wtype == 1 ? '经销商讲师' : ele.wtype == 2 ? '外部讲师' : ele.wtype == 3 ? '内部讲师' : null}</td>
													<td>{ele.courseNum}</td>
													<td>
														{ele.beginTime == 0 ? '未设置' : moment.unix(ele.beginTime).format('YYYY-MM-DD')}
													</td>
													<td>
														{ele.endTime == 0 ? '不限期' : moment.unix(ele.endTime).format('YYYY-MM-DD')}
													</td>
													<td>/pages/index/teachZone?teacher_id={ele.teacherId}</td>
													{/* <td>{ele.isLeaderRecomm=='1'?ele.leaderRecommIndex:''}</td> */}
													<td>
														<div>
															<Button value='teacher/view' onClick={() => {
																this.props.history.push('/teacher-manager/teacher-detail/' + ele.teacherId)
															}} type="primary" size={'small'} className='m_2'>查看</Button>
															<Button value='teacher/edit' onClick={() => {
																this.props.history.push('/teacher-manager/teacher-edit/' + ele.teacherId)
															}} type="primary" size={'small'} className='m_2'>修改</Button>
															<Button value='' onClick={this._onStatus.bind(this, ele.teacherId)} ghost={ele.status == 1 ? true : false} type="primary" size={'small'} className='m_2'>{ele.status == 1 ? "下架" : "上架"}</Button>&nbsp;
															<Button value='' onClick={this._onStatuss.bind(this, ele.teacherId)} ghost={ele.status == 2 ? true : false} type="primary" size={'small'} className='m_2'>{ele.status == 2 ? "取消解聘" : "解聘"}</Button>&nbsp;
															<Popconfirm
																value='teacher/del'
																okText="确定"
																cancelText='取消'
																title='确定删除吗？'
																onConfirm={this._onDelete.bind(this, ele.teacherId)}
															>
																<Button type="danger" ghost size={'small'} className='m_2'>删除</Button>
															</Popconfirm>
															<Popconfirm value='teacher/edit' title={ele.isLeaderRecomm == 1 ? "确定取消推荐吗？" : "确定推荐吗？"} okText="确定" cancelText="取消" onConfirm={this._onPushTeacher.bind(this, ele.teacherId, ele.isLeaderRecomm == 1 ? 'down' : 'up')}>
																<Button type={ele.isLeaderRecomm == 1 ? '' : "primary"} size={'small'} className='m_2' style={{ width: '128px' }}>{ele.isLeaderRecomm == 1 ? '取消推荐领导风采' : '推荐领导风采'}</Button>
															</Popconfirm>
															{/* <Button value='activity/result' onClick={() => {
																this.props.history.push('/teacher-manager/teacherAsk/' + '4' + '/' + ele.teacherId)
															}} type="" size={'small'} className='m_2'>
																查看选题分析
															</Button> */}
															{
																ele.userId ?
																	null
																	:
																	<Button size={'small'} onClick={() => {
																		this.setState({
																			bindUsers: true,
																			teacherId: ele.teacherId
																		})
																	}}>绑定用户</Button>
															}
															<Button size={'small'} onClick={this.onOuts.bind(this, ele)} loading={this.state.exportOut}>导出</Button>
															{/* {ele.isLeaderRecomm==1?
									<Button size={'small'} className='m_2'
										onClick={()=>{ this.setState({ showSortPannel:true,leader_recomm_index:ele.leaderRecommIndex,teacher_id:ele.teacherId }) }}
									>领导风采排序</Button>
									:null} */}
														</div>
													</td>
												</tr>
											)}
									</tbody>
								</Table>
								<Pagination showTotal={() =>
									('总共' + this.page_total + '条')}
									showQuickJumper onChange={this._onPage}
									pageSize={this.page_size}
									defaultCurrent={this.page_current}
									total={this.page_total}
								/>

							</CardBody>
						</Card>
					</Col>





				</Row>
				<Modal
					title='设置领导风采排序'
					visible={this.state.showSortPannel}
					okText='确定'
					cancelText='取消'
					onOk={this._onPushTeacher.bind(this, this.state.teacher_id, '')}
					onCancel={() => { this.setState({ showSortPannel: false }) }}
				>
					<div className='flex f_row f_nowrap align_items j_center pad_t20 pad_b20'>
						<span className='mr_10' style={{ flexShrink: '0' }}>设置排序：</span>
						<Input
							style={{ width: '200px' }}
							value={this.state.leader_recomm_index}
							onChange={(e) => {
								this.setState({ leader_recomm_index: e.target.value })
							}}
						></Input>
					</div>
				</Modal>
				<Modal
					title='领导风采排序（拖动排序）'
					visible={this.state.showSortPanel}
					maskClosable={true}
					onCancel={() => { this.setState({ showSortPanel: false }) }}
					okText='提交'
					cancelText='取消'
					onOk={this._onSort}
				>
					<div style={{ minHeight: 130 }}>
						{this.state.sortList.length == 0 ? <Empty /> :
							<DragDropContext onDragEnd={this.onDragEnd}>
								<Droppable droppableId="droppable" >
									{provided => (
										<div ref={provided.innerRef} {...provided.droppableProps}>
											{this.state.sortList.map((item, index) => (
												<Draggable key={item.key} draggableId={item.key} index={index}>
													{provided => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
														>
															<div style={{ padding: '5px' }}>{item.label} </div>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						}
					</div>
				</Modal>
				<Modal
					width={600}
					title='导入结果'
					visible={this.state.showResult}
					closable={true}
					maskClosable={true}
					okText='确定'
					cancelText='取消'
					onCancel={() => {
						this.setState({ showResult: false })
					}}
					onOk={() => {
						this.setState({ showResult: false })
					}}
					bodyStyle={{ padding: '10px' }}
				>

					<div style={{ textAlign: 'center', width: '100%', marginBottom: '10px' }}>
						<span style={{ paddingRight: '20px' }}>总数:{this.state.total}</span>
						<span style={{ paddingRight: '20px' }}>导入成功数:{this.state.success}</span>
						<span style={{ paddingRight: '20px' }}>导入失败数:{this.state.total - this.state.success}</span>
					</div>
					<TableAntd columns={this.rejectedUser} pagination={{ size: 'small', showTotal: (total) => `总共${total}条` }} dataSource={this.state.rejectedUser} rowKey='sn'></TableAntd>

				</Modal>
				<Modal
					title='导入'
					visible={this.state.showImportPannel}
					closable={true}
					maskClosable={true}
					okText='开始导入'
					cancelText='取消'
					onCancel={() => {
						this.setState({ showImportPannel: false })
					}}
					onOk={this.importTeacherApply}
					confirmLoading={this.state.importLoading}
				>
					<Form labelCol={{ span: 6 }}>
						<Form.Item label="选择Excel文件">
							<AntdOssUpload
								showMedia={false}
								maxLength={1}
								tip='上传文件'
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								listType='text'
								ref={(ref) => { this.excelFile = ref }}
							/>
							<div style={{ color: "#8e8e8e", marginTop: '10px', lineHeight: '1.5' }}>
								<p>
									* 导入前，请先下载Excel模板文件<br />
									* 仅支持xlsx格式的文件
								</p>
								<a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/d6825989-1a32-4151-b8a9-5334b158a880.xlsx'>
									Excel导入模板下载
								</a>
							</div>
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					title='绑定用户'
					visible={this.state.bindUsers}
					closable={true}
					maskClosable={true}
					okText='确定'
					cancelText='取消'
					onCancel={() => {
						this.setState({ bindUsers: false })
					}}
					onOk={() => {
						this.setState({
							bindUsers: false,
							user_id: ''
						})
					}}
				// confirmLoading={this.state.importLoading}
				>
					{/* <Form labelCol={{ span: 6 }}> */}
					<Form.Item label="">
						<Input placeholder="请输入用户ID" style={{ width: '200px' }} value={this.state.user_id} onChange={(e) => {
							this.setState({
								user_id: e.target.value
							})
						}} />
						<Button onClick={this.getUsers}>搜索</Button>
					</Form.Item>

					<Table responsive size="sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>认证状态</th>
								<th>昵称</th>
								<th>卡号</th>
								{/* <th>工号</th> */}
								<th>用户等级</th>
								{/* <th>电话</th> */}
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							{this.state.userList.length == 0 ?
								<tr>
									<td colSpan={8}>
										<Empty className="mt_10" description="没有数据" />
									</td>
								</tr>
								:
								this.state.userList.map((ele, index) =>
									<tr>
										<td>{ele.userId}</td>
										<td>{ele.isAuth == 0 ? '未认证' : '已认证'}</td>
										<td>{ele.nickname}</td>
										<td>{ele.sn}</td>
										{/* <td>{ele.workSn}</td> */}
										<td>LV{ele.level}</td>
										{/* <td>{ele.mobile}</td> */}
										<td>
											{
												ele.isTeacher ?
													<div>已绑定</div>
													:
													<Button onClick={this.onBind.bind(this, ele)}>绑定</Button>
											}
										</td>
									</tr>
								)
							}
						</tbody>
					</Table>

					{/* </Form> */}
				</Modal>
			</div>
		);
	}
	_onSort = () => {
		const { sortList } = this.state
		const { actions } = this.props

		sortList.map((ele, index) => {
			actions.recommonTecher({
				teacher_id: ele.teacherId,
				leader_recomm_index: index + 1,
				action: 'up',
				resolved: () => {
					if (sortList.length - 1 == index) {
						message.success('提交成功')
						this.setState({ showSortPanel: false })
					}
				},
				rejected: (data) => {
					message.error(data)
				}
			})
		})

	}
	getTeacherLeader = () => {
		const { actions } = this.props
		actions.getTeacherLeader({
			resolved: (data) => {
				// data = orderSort({ arr:data,flag:'leaderRecommIndex',orderBy:true})
				console.log(data)
				let sortList = []
				data.map(ele => {
					sortList.push({
						key: ele.teacherId + '',
						label: ele.teacherName,
						teacherId: ele.teacherId,
						leaderRecommIndex: ele.leaderRecommIndex
					})
				})
				this.setState({ sortList, showSortPanel: true })
			},
			rejected: (data) => {
				message.error(data)
			}
		})

	}
	onDragEnd = ({ source, destination }) => {
		if (destination == null) return

		const reorder = (list, startIndex, endIndex) => {
			const [removed] = list.splice(startIndex, 1);
			list.splice(endIndex, 0, removed);

			return list;
		}

		this.setState(pre => {
			return { sortList: reorder([...pre.sortList], source.index, destination.index) }
		})
	}
	importTeacherApply = () => {
		const file_url = this.excelFile.getValue() || ''
		if (file_url == '') { message.info('请上传文件'); return; }

		this.setState({ importLoading: true })
		this.props.actions.importTeacherApply({
			file_url,
			resolved: (data) => {
				console.log(data)
				const { fail } = data
				const rejectedUser = fail || []

				this.setState({
					showImportPannel: false,
					importLoading: false,
					showResult: true,
					total: data.total,
					success: data.success,
					rejectedUser: rejectedUser
				})
				message.success({
					content: '提交成功',
				})
			},
			rejected: (data) => {
				this.setState({ importLoading: false })
				message.error(data)
			}
		})
	}
	exportTeacherApply = () => {
		const { isInside, level, status, keyword } = this.state
		this.setState({ exportLoading: true })
		this.props.actions.exportTeacherApply({
			teacher_id: 0,
			keyword: keyword,
			wtype: isInside,
			level: level,
			status: status,
			resolved: (data) => {
				const { fileName, adress, name, address } = data
				const url = fileName || adress || name || address

				this.setState({ exportLoading: false })
				message.success({
					content: '导出成功',
					onClose: () => {
						window.open(url, '_black')
					}
				})
			},
			rejected: (data) => {
				this.setState({ exportLoading: false })
				message.error(data)
			}
		})
	}
	onOuts = (val) => {
		const { isInside, level, status, keyword } = this.state
		this.setState({ exportOut: true })
		this.props.actions.exportTeacherApply({
			teacher_id: val.teacherId,
			keyword: '',
			wtype: -1,
			level: -1,
			status: status,
			resolved: (data) => {
				const { fileName, adress, name, address } = data
				const url = fileName || adress || name || address

				this.setState({ exportOut: false })
				message.success({
					content: '导出成功',
					onClose: () => {
						window.open(url, '_black')
					}
				})
			},
			rejected: (data) => {
				this.setState({ exportOut: false })
				message.error(data)
			}
		})
	}
}

const LayoutComponent = Teacher;
const mapStateToProps = state => {
	return {
		teachers_list: state.teacher.teachers_list,
		user: state.site.user,
		user_list: state.user.user_list,
	}
}

export default connectComponent({ LayoutComponent, mapStateToProps });