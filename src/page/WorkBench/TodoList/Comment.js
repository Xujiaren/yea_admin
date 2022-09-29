import React, { Component } from 'react';
import { CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Tooltip, Table as AntdTable, Popover, Upload, Empty, Tabs, Card, Select, Checkbox, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, Modal, Avatar, Form, PageHeader } from 'antd';
import connectComponent from '../../../util/connect';
import moment from 'moment'
import _ from 'lodash'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'

import emoji from '../../../components/emoji'
import { Button, Popconfirm } from '../../../components/BtnComponent'

const { Search } = Input;
const { Option } = Select;
const InputGroup = Input.Group;
const { TabPane } = Tabs;
const { TextArea } = Input
function getBase(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

class Comment extends Component {

	state = {
		view: true,
		edit: true,

		visible: false,
		showDetail: false,

		ctype: '-1',
		is_secret: 0,
		content: '',
		comment_id: '',
		content_id: '',

		view_user: '',
		view_content: '',
		fileList: [],
		showImgPanel: false,
		previewImage: '',
		previewVisible: false,
		isSecret: 0,

		activeTab: '0',

		view_reply: { avatar: '', username: '', content: '', pubTime: '' },

		sortOrder: 0,
		pubTime: '',

		isAll: false,
		selected_g: [],
		id_group: [],

		d_isAll: false,
		d_selected_g: [],
		d_id_group: [],

		showConfirmPanel: false,
		confirmId: 0,
		confirmContent: '',
		confirmCourse: '',
		confirmUser: '',

		editorState: BraftEditor.createEditorState(null),

		keyword: '',
		keys: [],
		data_list: [],
		loading: false,
		showConfirmPanels: false,
		reason: ''
	};
	childList = []
	data_list = []
	comments_done_list = []
	comments_list = []

	page_total = 0
	page_current = 0
	page_size = 10


	d_page_total = 0
	d_page_current = 1
	d_page_size = 10

	content_id = ''

	ctype = '-1'

	componentWillMount() {
		this.setState({ title: this.title() })
	}
	componentDidMount() {
		const { ctype, id } = this.props.match.params
		this.ctype = ctype
		this.content_id = id
		this.getComment()
	}

	componentWillReceiveProps(n_props) {
		if (n_props.comments_list !== this.props.comments_list) {
			this.data_list = n_props.comments_list.data || []
			this.page_total = n_props.comments_list.total
			this.page_current = n_props.comments_list.page
			this.setState({ loading: false })
		}
	}
	getComment = () => {
		const { actions } = this.props

		this.setState({ loading: true })
		actions.getComment({
			content_id: this.content_id,
			sort: this.state.sortOrder,
			page: this.page_current,
			ctype: this.ctype,
			status: this.state.activeTab,
			keyword: this.state.keyword
		})
	}
	_onSearch = (val) => {
		this.setState({ keyword: val, keys: [] }, () => {
			this.page_current = 0
			this.getComment()
		})
	}
	showImgPanel(item) {
		let fileList = []
		if (item.galleryList.length > 0) {
			item.galleryList.map((ele, idx) => {
				fileList.push({ uid: idx, name: 'img' + idx, status: 'done', url: ele.fpath })
			})
		}
		this.setState({
			fileList: fileList,
			showImgPanel: true,
		});
	}
	hideImgPanel = () => {
		this.setState({
			showImgPanel: false,
		});
	}
	_onStatusAll = () => {
		const { actions } = this.props
		const { keys } = this.state
		if (keys.length == 0) {
			message.info('请选择评论'); return;
		}
		actions.updateCommentsAll({
			comment_ids: keys.join(','),
			status: 1,
			resolved: (data) => {
				actions.getTodo()
				this.setState({ keys: [] })
				message.success('操作成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onRefuseStatusAll = () => {
		const { actions } = this.props
		const { keys } = this.state
		if (keys.length == 0) {
			message.info('请选择评论'); return;
		}
		actions.updateCommentsAll({
			comment_ids: keys.join(','),
			status: 2,
			resolved: (data) => {
				actions.getTodo()
				this.setState({ keys: [] })
				message.success('操作成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onTopAll_Done(type) {
		const { actions } = this.props
		const { keys } = this.state
		let is_top = 1
		if (keys.length == 0) { message.info('请先选择选项'); return }
		if (type == 'untop')
			is_top = 0
		actions.topCommentsAll({
			is_top,
			comment_ids: keys.join(','),
			resolved: (data) => {
				this.setState({ keys: [] })
				message.success('操作成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}

	_onDeleteAll_Done = () => {
		const { actions } = this.props
		const { keys } = this.state
		if (keys.length == 0) {
			message.info('请选择评论'); return;
		}
		actions.deleteCommentsAll({
			comment_ids: keys.join(','),
			resolved: (data) => {
				this.setState({
					keys: []
				})
				message.success('操作成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onDeleteAll = () => {
		const { actions } = this.props
		const { keys } = this.state
		if (keys.length == 0) {
			message.info('请选择评论'); return;
		}
		actions.deleteCommentsAll({
			comment_ids: keys.join(','),
			resolved: (data) => {
				actions.getTodo()
				this.setState({
					keys: [],
				})
				message.success('操作成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}


	hideReplyPanel = () => {
		this.setState({
			showDetail: false,
			visible: false,
			is_secret: 0,
			content: '',
			comment_id: '',
			content_id: ''
		});
	};
	_onReply = () => {

		const { actions } = this.props
		const {
			re_ctype,
			is_secret,
			content,
			comment_id,
			content_id
		} = this.state

		if (content == '') {
			message.info('请输入回复内容')
			return
		}
		actions.replyComments({
			ctype: re_ctype,
			is_secret,
			content,
			comment_id,
			content_id,
			resolved: (data) => {
				this.hideReplyPanel()
				message.success('回复成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onOrder = (val) => {
		this.setState({
			sortOrder: val
		}, () => {
			this.getComment()
		})
	}
	_onCtype = (val) => {
		this.setState({
			ctype: val
		})
		const { actions } = this.props
		this.getComment()
	}
	updataStatus = (e) => {
		const { actions } = this.props
		const that = this
		let _status = e.currentTarget.getAttribute('data-status');
		let _id = e.currentTarget.getAttribute('data-id');
		if (_status == '2') {
			_status = 1
		} else {
			_status = 2
		}
		actions.updateCommentsAll({
			comment_ids: _id, status: _status,
			resolved: (data) => {
				message.success('操作成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	onOk() {
		const { confirmId: _id } = this.state
		const { actions } = this.props
		actions.updateComments({
			action: 'status',
			comment_id: _id,
			resolved: (data) => {
				this.hideConfirmPanel()
				actions.getTodo()
				message.success('操作成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})

	}
	onRejected = () => {
		const { confirmId: _id, reason } = this.state
		const { actions } = this.props
		const that = this
		actions.updateCommentsAll({
			comment_ids: _id, status: 2, reason: reason,
			resolved: (data) => {
				this.hideConfirmPanel()
				actions.getTodo()
				message.success('操作成功')
				this.getComment()
				this.setState({
					reason: '',
					showConfirmPanels: false
				})
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	updateComment = (e) => {

		let _id = e.currentTarget.getAttribute('data-id');
		let _content = e.currentTarget.getAttribute('data-content');
		let confirmCourse = e.currentTarget.getAttribute('data-confirmcourse')
		let confirmUser = e.currentTarget.getAttribute('data-confirmuser')

		this.setState({
			showConfirmPanel: true,
			confirmId: _id,
			confirmContent: _content,
			confirmUser: confirmUser,
			confirmCourse: confirmCourse,
		})
	}
	hideConfirmPanel = () => {
		this.setState({
			showConfirmPanel: false
		})
	}
	_onTop(_id) {
		const { actions } = this.props;
		actions.updateComments({
			action: 'top',
			comment_id: _id,
			resolved: (data) => {
				message.success('操作成功')
				this.getComment()
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	_onAction(comment_id, action) {
		const { actions } = this.props;
		actions.updateComments({
			action,
			comment_id,
			resolved: (data) => {
				actions.getTodo()
				this.getComment()
				message.success('操作成功')
			},
			rejected: (data) => {
				message.error(data)
			}
		})
	}
	showDetail(_comm) {
		if (!this.state.view) {
			message.info('无权限'); return
		}
		let view_reply = _comm.comment

		if (!view_reply) {
			view_reply = { avatar: '', username: '', content: '', pubTime: '' }
		}

		this.setState({
			view_user: _comm.username,
			view_content: _comm.content,
			view_reply: _comm.childList,
			pubTime: _comm.pubTime,
			isSecret: _comm.isSecret,
			showDetail: true,

			re_ctype: _comm.ctype,
			is_secret: 0,
			content: '',
			editorState: BraftEditor.createEditorState(null),
			comment_id: _comm.commentId,
			content_id: _comm.contentId,
		});
		this.childList = _comm.childList

	};
	_onTabChange = val => {
		const { actions } = this.props
		this.setState({
			activeTab: val,
			keyword: '',
			keys: []
		}, () => { this.page_current = 0; this.getComment() })
	}
	hideDetail = () => {
		this.setState({
			showDetail: false,
		});
	};
	showModal(ele) {
		if (!this.state.edit) {
			message.info('无权限'); return
		}
		this.setState({
			visible: true,
			re_ctype: ele.ctype,
			comment_id: ele.commentId,
			content_id: ele.contentId,
			editorState: BraftEditor.createEditorState(null)
		});
	};
	handleCancelModal = () => this.setState({ previewVisible: false });
	handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase(file.originFileObj);
		}

		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
		});
	};
	handleEditorChange = (editorState) => {
		const content = editorState.toText()
		this.setState({
			editorState,
			content
		})
	}
	submitContent = () => {

		const htmlContent = this.state.editorState.toText()
		this.setState({
			content: htmlContent
		})
	}
	insertText(item) {
		this.setState({
			editorState: ContentUtils.insertText(this.state.editorState, item)
		})
	}
	contentEmoji = () => {
		const that = this
		return (
			<div className='bf_emojis_wrap'>
				<ul className='bf_emojis'>
					{Object.keys(emoji.emojis).map((item, index) => {
						return (
							<li
								key={index}
								onClick={that.insertText.bind(this, item)}
							><img style={{ width: '30px', height: '30px' }} src={emoji.emojiToPath(item)}></img></li>
						)
					})}
				</ul>
			</div>
		)
	}
	renderBtn = () => {
		const { activeTab } = this.state
		if (activeTab == '0')
			return (<div className="pad_b10">
				<Popconfirm
					title='确定删除吗？'
					okText='确定'
					cancelText='取消'
					onConfirm={this._onDeleteAll}
					value='comment/del'
				>
					<Button type="danger" ghost size={'small'} className="mr_10">删除</Button>
				</Popconfirm>

				<Button value='comment/check' onClick={this._onStatusAll} type="" size={'small'} className="mr_10">通过审核</Button>
				<Button value='comment/check' onClick={this._onRefuseStatusAll} type="" size={'small'} className="mr_10">拒绝审核</Button>
			</div>)
		else if (activeTab == '1')
			return (<div className="pad_b10">
				<Popconfirm
					title='确定删除吗？'
					okText='确定'
					cancelText='取消'
					onConfirm={this._onDeleteAll_Done}
					value='comment/del'
				>
					<Button type="danger" ghost size={'small'} className="mr_10">删除</Button>
				</Popconfirm>
				<Button value='comment/check' onClick={this._onTopAll_Done.bind(this, 'top')} type="" size={'small'} className="mr_10">置顶</Button>
				<Button value='comment/check' onClick={this._onTopAll_Done.bind(this, 'untop')} type="" size={'small'} className="mr_10">取消置顶</Button>
			</div>)
		else
			return (<div className="pad_b10">
				<Popconfirm
					title='确定删除吗？'
					okText='确定'
					cancelText='取消'
					onConfirm={this._onDeleteAll_Done}
					value='comment/del'
				>
					<Button type="danger" ghost size={'small'} className="mr_10">删除</Button>
				</Popconfirm>
				<Button value='comment/check' onClick={this._onStatusAll} type="" size={'small'} className="mr_10">通过审核</Button>
			</div>)
	}
	render() {
		const { user } = this.props

		return (
			<div className="animated fadeIn">

				<PageHeader

					ghost={false}
					onBack={() => window.history.back()}
					title=""
					subTitle="评论列表"
				>
					<Row>
						<Col xs="12" lg="12">
							<Card bodyStyle={{ padding: 0 }}>
								<CardHeader className="flex f_row">
									{/*
									<InputGroup compact className="mr_10">
										<Input disabled={true} style={{ width: '50px' }} defaultValue="状态" />
										<Select defaultValue="1">
										<Option value="0">通过</Option>
										<Option value="1">拒绝</Option>
										<Option value="2">待审</Option>
										<Option value="3">全部</Option>
										</Select>
									</InputGroup>
									*/}
									<InputGroup compact className="mr_10">
										<Input disabled={true} style={{ width: '50px' }} defaultValue="排序" />
										<Select defaultValue={0} onChange={this._onOrder}>
											<Option value={0}>降序</Option>
											<Option value={1}>升序</Option>
										</Select>
									</InputGroup>
									{/* <InputGroup compact className="mr_10">
										<Input disabled={true} style={{ width: '50px' }} defaultValue="类型" />
										<Select value={this.state.ctype} onChange={this._onCtype}>
											<Option value={'-1'}>全部评论</Option>
											<Option value={'3'}>课程评论</Option>
											<Option value={'11'}>资讯评论</Option>
										</Select>
									</InputGroup> */}
									<Search
										placeholder="搜索"
										onSearch={this._onSearch}
										style={{ maxWidth: "200px" }}
										value={this.state.keyword}
										onChange={(e) => {
											this.setState({ keyword: e.target.value })
										}}
									/>

								</CardHeader>
								<CardBody>
									<Tabs onChange={this._onTabChange} activeKey={this.state.activeTab}>
										<TabPane tab="未审核" key="0"></TabPane>
										<TabPane tab="已通过" key="1"></TabPane>
										<TabPane tab='已拒绝' key='2'></TabPane>
									</Tabs>
									{this.renderBtn()}
									<AntdTable
										loading={this.state.loading}
										rowSelection={{ selectedRowKeys: this.state.keys, onChange: (value) => { this.setState({ keys: value }) } }}
										rowKey='commentId'
										columns={this.state.activeTab == '0' ? this.col : this.col_done}
										dataSource={this.data_list}
										pagination={{
											current: this.page_current + 1,
											pageSize: this.page_size,
											total: this.page_total,
											showQuickJumper: true,
											onChange: (val) => {
												this.page_current = val - 1
												this.getComment()
											},
											showTotal: (total) => '总共' + total + '条'
										}}>

									</AntdTable>
								</CardBody>
							</Card>
						</Col>
						{console.log(this.childList)}
					</Row>
				</PageHeader>

				<Modal
					title="评论详情"
					visible={this.state.showDetail}
					okText="确定"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={this.hideDetail}
					onOk={this.state.activeTab == '0' ? this.hideDetail : this._onReply}
					bodyStyle={{ padding: "10px 25px" }}
				>
					<p>
						<span className="be_l_gray"><strong>用户:&nbsp;&nbsp;</strong></span>
						<span>
							{this.state.view_user}
						</span>
					</p>
					<hr />
					<p>
						<span><strong>评论内容:&nbsp;&nbsp;</strong></span> <span>
							{emoji.textToEmoji(this.state.view_content).map(_ele => {
								if (_ele.msgType == 'emoji')
									return (<img src={_ele.msgImage} key={'emoji' + Math.random() * 100} style={{ width: '20px', height: '20px' }}></img>)
								else
									return _ele.msgCont
							})}
						</span>
					</p>
					<hr />
					{
						parseInt(this.state.activeTab) == 0 ?
							null
							:
							<div>
								<span><strong>回复:</strong></span>
								<div style={{ marginTop: '10px', border: '1px solid #eaeaea', width: '100%' }}>
									{this.childList ?
										<div style={{ padding: '10px 5px' }}>
											<Avatar style={{ float: 'left', marginRight: '10px' }} src={this.childList.content ? this.childList.content : '../../assets/img/avatars/6.jpg'} size={'default'} />
											<div>
												<div style={{
													color: '#5a5a5a',
													fontSize: '15px',
													marginBottom: '5px'
												}}>
													<span>{this.childList.username ? this.childList.username : '管理员回复'}</span>
													&nbsp;&nbsp;
													<span> {moment.unix(this.state.pubTime).format('YYYY-MM-DD HH:mm:ss')}</span>
												</div>
												<div style={{ marginLeft: '42px' }}>
													{/* {emoji.textToEmoji(this.state.view_reply).map(_ele=>{
												if(_ele.msgType == 'emoji')
													return (<img src={_ele.msgImage} key={'emoji'+Math.random()*100}  style={{width:'20px',height:'20px'}}></img>)
												else
													return _ele.content
											})} */}
													{
														this.childList.map(e => {
															// console.log(e,'///')
															// if (e.isSecret == 0) {
																return (<div>{e.content}</div>)
															// }


														})
													}
												</div>
											</div>
										</div>
										: <Empty style={{ margin: '5px 0' }} description='暂时没有回复' />}
								</div>
								<hr />
								{
									this.state.activeTab != 2 ?
										<InputGroup compact className="mb_10">
											<Input disabled={true} style={{ width: '50px' }} defaultValue="回复方式" />
											<Select disabled={this.state.isSecret == 0 ? true : false} value={this.state.is_secret} onChange={val => {
												this.setState({
													is_secret: val
												})
											}}>
												<Option value={0}>公开回复</Option>
												<Option value={1}>私密回复</Option>
											</Select>
										</InputGroup>
										: null
								}

								{
									this.state.activeTab != 2 ?
										<BraftEditor
											disabled={this.state.activeTab == '0' ? true : false}
											style={{ border: "1px solid #cacaca" }}
											value={this.state.editorState}
											onChange={this.handleEditorChange}
											onSave={this.submitContent}
											contentStyle={{ height: '100px' }}
											controls={[]}
											extendControls={[
												{
													key: 'custom-dropdown',
													type: 'dropdown',
													text: '表情',

													component: this.contentEmoji()
												}]
											}
										/>
										: null
								}

							</div>
					}

				</Modal>
				<Modal
					title="回复"
					visible={this.state.visible}
					okText="提交"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={this.hideReplyPanel}
					onOk={this._onReply}
					bodyStyle={{ padding: "10px" }}
				>
					<InputGroup compact className="mb_10">
						<Input disabled={true} style={{ width: '50px' }} defaultValue="回复方式" />
						<Select value={this.state.is_secret} onChange={val => {
							this.setState({
								is_secret: val
							})
						}}>
							<Option value={0}>公开回复</Option>
							<Option value={1}>私密回复</Option>
						</Select>
					</InputGroup>
					<BraftEditor

						style={{ border: "1px solid #cacaca" }}
						value={this.state.editorState}
						onChange={this.handleEditorChange}
						onSave={this.submitContent}
						contentStyle={{ height: '100px' }}
						controls={[]}
						extendControls={[
							{
								key: 'custom-dropdown',
								type: 'dropdown',
								text: '表情',

								component: this.contentEmoji()
							}]
						}
					/>
				</Modal>
				<Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
					<Upload
						disabled
						listType="picture-card"
						fileList={this.state.fileList}
						onPreview={this.handlePreview}
					>
						{this.state.fileList.length == 0 ? '暂时没有附件' : null}
					</Upload>
				</Modal>
				<Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
					<img alt="附件预览" style={{ width: '100%' }} src={this.state.previewImage} />
				</Modal>
				<Modal
					visible={this.state.showConfirmPanels}
					maskClosable={true}
					footer={
						<div>
							<Button onClick={() => { this.setState({ showConfirmPanels: false }) }}>取消</Button>&nbsp;
							<Button onClick={this.onRejected} type='primary'>确定</Button>
						</div>
					}
				>
					<Form.Item label='原因'>
						<TextArea autosize={{ minRows: 3 }} value={this.state.reason} onChange={(e) => {
							this.setState({ reason: e.target.value })
						}}></TextArea>
					</Form.Item>
				</Modal>
				<Modal
					visible={this.state.showConfirmPanel}
					maskClosable={true}
					footer={
						<div>
							<Button value='comment/check' onClick={() => { this.setState({ showConfirmPanels: true }) }}>拒绝</Button>&nbsp;
							<Button value='comment/check' onClick={this.onOk.bind(this)} type='primary'>通过</Button>
						</div>
					}
					bodyStyle={{ padding: '20px', paddingTop: '35px' }}
					onCancel={this.hideConfirmPanel}
				>
					<div>
						<strong>用户：</strong>
						<p className='p_border'>
							{this.state.confirmUser}
						</p>
					</div>
					<div>
						{
							this.ctype == '10' || this.ctype == '34' ?
								<strong>评论问题：</strong>
								:
								<strong>评论课程：</strong>
						}
						<p className='p_border'>
							{this.state.confirmCourse}
						</p>
					</div>
					<div>
						<strong>评论内容：</strong>
						<p className='p_border'>
							{this.state.confirmContent ? this.state.confirmContent : '无'}
						</p>
					</div>
				</Modal>
				<style>
					{`
					.bf-dropdown .dropdown-content{
						top:-450% !important;
					}
					.bf-dropdown .dropdown-content .dropdown-arrow{
						bottom:-3px !important;
						top: unset;
					}
				
					.bf_emojis{
						list-style: none;
						padding: 10px;
						margin: 0;
						width: 200px;
						display: flex;
						flex-wrap: wrap;
					}
					.bf-dropdown .dropdown-content-inner{
						background-color:#fff;
					}
					.bf-dropdown .dropdown-content .dropdown-arrow{
						background-color:#fff;
					}
				`}
				</style>
			</div>
		);
	}
	title = () => {
		const { ctype } = this.props.match
		let cctype = this.props.match.params.ctype
		if (cctype == '11') return '资讯'
		else if (cctype == '15') return '专题'
		else if (cctype == '2'||cctype == '54') return '活动'
		else if (cctype == '10') return '提问'
		else if (cctype == '34') return '回答'
		else return '课程'
	}
	col = [
		{ title: 'ID', width: 80, dataIndex: 'commentId', key: 'commentId' },
		{ title: '用户ID', width: 80, dataIndex: 'userId', key: 'userId' },
		{
			title: '昵称', width: 100, dataIndex: 'username', key: 'username', ellipsis: true, render: (item, ele) => {
				return <Tooltip title={ele.username}>{ele.username}</Tooltip>
			}
		},
		{
			title: this.title(), width: 120, dataIndex: '', key: '', ellipsis: true, render: (item, ele) => {
				return <Tooltip title={ele.contentName}>{ele.contentName}</Tooltip>
			}
		},
		{
			title: '评论内容', dataIndex: 'content', key: 'content', ellipsis: true, render: (item, ele) => {
				return <Tooltip title={emoji.textToEmoji(ele.content).map(_ele => {
					if (_ele.msgType == 'emoji')
						return (<img src={_ele.msgImage} key={'emoji' + Math.random() * 100} style={{ width: '20px', height: '20px' }}></img>)
					else
						return _ele.msgCont
				})}>{
						emoji.textToEmoji(ele.content).map(_ele => {
							if (_ele.msgType == 'emoji')
								return (<img src={_ele.msgImage} key={'emoji' + Math.random() * 100} style={{ width: '20px', height: '20px' }}></img>)
							else
								return _ele.msgCont
						})
					}</Tooltip>
			}
		},
		{ title: '发布时间', width: 200, dataIndex: 'pubTime', key: 'pubTime', ellipsis: false, render: (item, ele) => moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm:ss') },
		{ title: '状态', width: 80, dataIndex: 'status', key: 'status', ellipsis: true, render: (item, ele) => ele.status == 0 ? '待审' : ele.status == 1 ? '通过' : ele.status == 2 ? '拒绝' : '' },
		{
			title: '操作', dataIndex: '', key: 'username1', ellipsis: false, render: (item, ele, index) => (
				<div>
					<Button
						className='m_2'

						type="primary"
						ghost
						size={'small'}
						onClick={this.updateComment}
						data-status='0'
						data-content={ele.content}
						data-id={ele.commentId}
						data-confirmcourse={this.ctype == '10' || this.ctype == '34' ? ele.course.courseName : ele.contentName}
						data-confirmuser={ele.username}
						value='comment/check'
					>
						审核
					</Button>
					<Button value='comment/view' className='m_2' type="primary" size={'small'} onClick={this.showDetail.bind(this, ele)}>查看详情</Button>
					<Button
						disabled
						className='m_2'
						data-id={ele.commentId}
						data-contentid={ele.contentId}
						data-ctype={ele.ctype}
						type="primary"
						style={{ width: "70px" }}
						size={'small'}
						onClick={this.showModal.bind(this, ele)}
						value='comment/edit'
					>
						{ele.comment ? '已回复' : '未回复'}
					</Button>
					<Button value='comment/view' disabled={ele.galleryList.length == 0 ? true : false} className='m_2' type="primary" size={'small'} onClick={this.showImgPanel.bind(this, ele)}>查看附件</Button>
					<Popconfirm value='comment/del' placement="top" title="确认删除吗？" onConfirm={this._onAction.bind(this, ele.commentId, 'delete')} okText="确认" cancelText="取消">
						<Button className='m_2' type="danger" ghost size={'small'}>删除</Button>
					</Popconfirm>
					{/*<Button className='m_2' onClick={this._onTop.bind(this, ele.commentId)} type="primary" ghost={ele.isTop == 0 ? false : true} size={'small'}>{ele.isTop == 0 ? '置顶' : '取消置顶'}</Button>*/}
				</div>
			)
		},
	]
	col_done = [
		{ title: 'ID', width: 80, dataIndex: 'commentId', key: 'commentId' },
		{ title: '用户ID', width: 80, dataIndex: 'userId', key: 'userId' },
		{
			title: '昵称', width: 100, dataIndex: 'username', key: 'username', ellipsis: true, render: (item, ele) => {
				return <Tooltip title={ele.username}>{ele.username}</Tooltip>
			}
		},
		{
			title: this.title(), width: 120, dataIndex: '', key: '', ellipsis: true, render: (item, ele) => {
				return <Tooltip title={this.ctype == '34' || this.ctype == '10' ? ele.course.courseName : ele.contentName}>{this.ctype == '34' || this.ctype == '10' ? ele.course.courseName : ele.contentName}</Tooltip>
			}
		},
		{
			title: '评论内容', dataIndex: 'content', key: 'content', ellipsis: true, render: (item, ele) => {
				return <Tooltip title={emoji.textToEmoji(ele.content).map(_ele => {
					if (_ele.msgType == 'emoji')
						return (<img src={_ele.msgImage} key={'emoji' + Math.random() * 100} style={{ width: '20px', height: '20px' }}></img>)
					else
						return _ele.msgCont
				})}>{
						emoji.textToEmoji(ele.content).map(_ele => {
							if (_ele.msgType == 'emoji')
								return (<img src={_ele.msgImage} key={'emoji' + Math.random() * 100} style={{ width: '20px', height: '20px' }}></img>)
							else
								return _ele.msgCont
						})
					}</Tooltip>
			}
		},
		{ title: '发布时间', width: 150, dataIndex: 'pubTime', key: 'pubTime', ellipsis: false, render: (item, ele) => moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm:ss') },
		{ title: '状态', width: 80, dataIndex: 'status', key: 'status', ellipsis: true, render: (item, ele) => ele.status == 1 ? '显示' : '不显示' },
		{ title: '审核状态', width: 80, dataIndex: 'status', key: 'status', ellipsis: true, render: (item, ele) => ele.status == 0 ? '待审' : ele.status == 1 ? '通过' : ele.status == 2 ? '拒绝' : '' },
		{
			title: '操作', dataIndex: '', key: 'username1', ellipsis: false, render: (item, ele) => (
				<div>
					<Button
						className='m_2'
						onClick={this.updataStatus}
						data-status={ele.status}
						data-content={ele.content}
						data-id={ele.commentId}
						style={{ width: "90px" }}
						type="primary" ghost size={'small'}
						value='comment/edit'
					>
						{ele.status == 1 ? '取消显示' : '显示'}
					</Button>

					<Button value='comment/view' className='m_2' type="primary" size={'small'} onClick={this.showDetail.bind(this, ele)}>查看详情</Button>
					{
						this.state.activeTab == 2 ?
							null
							:
							<Button
								className='m_2'
								data-id={ele.commentId}
								data-contentid={ele.contentId}
								data-ctype={ele.ctype}
								type="primary"
								style={{ width: "70px" }}
								size={'small'}
								disabled={ele.comment ? true : false}
								onClick={this.showModal.bind(this, ele)}
								value='comment/edit'
							>
								{ele.childList.length > 0 ? '已回复' : '未回复'}
							</Button>
					}

					<Button value='comment/view' disabled={ele.galleryList.length == 0 ? true : false} className='m_2' type="primary" size={'small'} onClick={this.showImgPanel.bind(this, ele)}>查看附件</Button>
					<Popconfirm value='comment/del' placement="top" title="确认删除吗？" onConfirm={this._onAction.bind(this, ele.commentId, 'delete')} okText="确认" cancelText="取消">
						<Button className='m_2' type="danger" ghost size={'small'}>删除</Button>
					</Popconfirm>
					{ele.status == 2 ? null :
						<Button value='comment/edit' className='m_2' style={{ width: '72px' }} onClick={this._onTop.bind(this, ele.commentId)} type="primary" ghost={ele.isTop == 0 ? false : true} size={'small'}>{ele.isTop == 0 ? '置顶' : '取消置顶'}</Button>
					}
				</div>
			)
		},
	]
}

const LayoutComponent = Comment;
const mapStateToProps = state => {
	return {
		comments_list: state.course.comments_list,
		user: state.site.user
	}
}
export default connectComponent({ LayoutComponent, mapStateToProps });