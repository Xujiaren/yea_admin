import React, { Component } from 'react';
import { Button as Btn, Tooltip,Table, Empty, Upload,PageHeader, Card, Select, Checkbox, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, Modal, Avatar, Tabs } from 'antd';

import connectComponent from '../../../util/connect';
import { Link, NavLink } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

import _ from 'lodash'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import {Button,Popconfirm} from '../../../components/BtnComponent'

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const InputGroup = Input.Group;
const { TextArea } = Input;

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

class FeedbackList extends Component {
	showDeleteConfirm = (e) => {
		let _content = e.currentTarget.getAttribute('data-content');
		confirm({
			title: '确定审核通过吗?',
			content: _content,
			okText: '通过',
			okType: 'primary',
			cancelText: '拒绝',
			cancelType: 'danger',
			maskClosable: true,
			onOk() {
				message.success('操作成功')
			},
			onCancel() {
				message.success('操作成功')
			},
		});
	}
	state = {
		edit : true,
		view : true,

		isEdit:false,

		view_id:'',
		view_content:'',
		view_reply:'',
		view_user:'',

		previewVisible:false,
		visible: false,
		showFeed: false,
		previewImage: '',
		showImgPanel: false,
		feed_cate:'',
		status:'0',
		cate_id:'',

		useful:0,
		reply:'',
		feedback_id:'',
		fileList:[],

		quetions_type:{},

		editorState: BraftEditor.createEditorState(null),

		keyword:'',
		is_use:'-1',
		loading:false,
		keys:[]
	};

	feed_list = []
	feed_cate_list = []

	page_total = 0
	page_current = 0
	page_size = 10

	componentDidMount() {
		const { actions } = this.props
		actions.getFeedCate({ctype:9})
		this.getFeedback()
	}
	componentWillReceiveProps(n_props) {
		if (n_props.feed_list !== this.props.feed_list) {
			if(Array.isArray(n_props.feed_list.data)){
				this.feed_list = n_props.feed_list.data
				this.page_total=n_props.feed_list.total
				this.page_current=n_props.feed_list.page
			}
			this.setState({loading:false})
		}
		if (n_props.feed_cate_list !== this.props.feed_cate_list) {
			this.feed_cate_list = n_props.feed_cate_list.data
		}
	}
	getFeedback = ()=>{
		this.setState({loading:true})

		const {is_use,keyword,cate_id:category_id,status} = this.state
		const page = this.page_current ,pageSize = this.page_size
		this.props.actions.getFeedback({
			is_use,keyword,category_id,page,pageSize,status
		})
	}
	_onDismiss = (status)=>{
		const {actions} = this.props
		const {keys} = this.state
		if(keys.length == 0){
			message.info('请选择要忽略的项目');return;
		}
		actions.deleteFeedback({
			feedback_ids:keys.join(','),
			action:'status',
			status:status,
			resolved:()=>{
				actions.getTodo()
				this.setState({
					keys:[],
				})
				message.success('操作成功')
				this.getFeedback()
			},
			rejected:(data)=>{
				message.error(JSON.stringify(data))
			}
		})
	}
	_onDeleteAll = ()=>{
		const {actions} = this.props
		const {keys} = this.state
		if(keys.length == 0){
			message.info('请选择要删除的项目');return;
		}
		actions.deleteFeedback({
			feedback_ids:keys.join(','),
			action:'delete',
			resolved:()=>{
				actions.getTodo()
				this.setState({
					keys:[],
				})
				message.success('操作成功')
				this.getFeedback()
			},
			rejected:(data)=>{
				message.error(JSON.stringify(data))
			}
		})
	}
	_onEditReply =()=>{
		const {view_reply,view_id} = this.state

		if(!view_reply){
			message.info('回复不能为空')
			return
		}

		this.reply(view_id,view_reply)
	}
	_onReply = ()=>{
		const {useful,reply,feedback_id} = this.state

		if(!reply){
			message.info('请输入回复')
			return
		}
		this.reply(feedback_id,reply,useful)
		 
	}
	reply = (feedback_id,reply,useful)=>{
		const {actions} =this.props
		
		actions.replyFeedback({
			feedback_id,
			reply,
			useful,
			resolved:(data)=>{
				actions.getTodo()
				this.getFeedback()
				this.handleCancel()
				this.hideFeed()
				message.success("提交成功")
			},
			rejected:(data)=>{
				message.error(data)
			}
		})
	}
	showFeed(idx,type){
		
		let _comm = this.feed_list[idx];
		//feedback_id,reply,useful
		this.setState({
			view_id:_comm.feedbackId,
			view_user:_comm.username,
			view_content:_comm.content,
			view_reply:_comm.reply,
			showFeed: true,
		});
		
	}
	hideFeed = () => {
		this.setState({
			isEdit:false,
			showFeed: false,
		});
	}
	onTabChange =val=>{
		this.setState({
			status:val
		},()=>{
			this.page_current = 0
			this.getFeedback()
		})
	}
	onSearch = keyword =>{
		this.setState({
			keyword
		},()=>{
			this.page_current = 0
			this.getFeedback()
		})
	}
	_onCategory = (val)=>{
		this.setState({
			cate_id:val,
			feed_cate:val
		},()=>{
			this.getFeedback()
		})
	}
	_onDelete(id){
		const {actions} = this.props
		actions.updateFeedback({
			action:'delete',
			feedback_id:id,
			resolved:(data)=>{
				actions.getTodo()
				message.success("操作成功")
				this.getFeedback()
			},
			rejected:(data)=>{
				message.error(data)
			}
		})
	}
	_onPage=(val)=>{
		this.page_current = val - 1
		this.getFeedback()
	}

	onUse = (is_use)=>{
		this.setState({is_use},()=>{
			this.getFeedback()
		})
	}
	showModal(id){
		this.setState({
			reply:'',
			useful:0,
			feedback_id:id,
			visible: true,
			editorState:BraftEditor.createEditorState(null)
		});
	};
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};
	showImgPanel(index){
		let item = this.feed_list[index]
		let fileList = []

		if(item.fileList.length > 0){
			item.fileList.map((ele,idx)=>{
				fileList.push({uid:idx,name:'img'+idx,status:'done',url:ele.fpath})
			})
		}
		this.setState({
			fileList:fileList,
			showImgPanel: true,
		});
	}
	hideImgPanel = () => {
		this.setState({
			showImgPanel: false,
		});
	}

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
		const reply = editorState.toText()

        this.setState({ 
            editorState,
            reply
        })
	}
	submitContent = () => {
        const htmlContent = this.state.editorState.toText()
        this.setState({
            reply:htmlContent
        })
    }
	render() {
		return (
			<div className="animated fadeIn">
				<PageHeader
					ghost={false}
					onBack={() => window.history.back()}
					subTitle="反馈列表"
				>
					<Card loading={this.state.loading}  title={
						<div className="flex f_row align_items">
							<Select 
								value={this.state.feed_cate}
								onChange={this._onCategory}
								style={{ width: '110px' }}
							>
								<Option value={''}>全部问题类型</Option>
								{
									this.feed_cate_list.map(ele=>(
										<Option key={ele.categoryId+'_cate'} value={ele.categoryId}>{ele.categoryName}</Option>
									))
								}
							</Select>
							<InputGroup compact className="mr_10 flex f_row f_nowrap">
								<Button style={{ width: '130px' }} defaultValue="是否有建设意义" >
									是否有建设意义
								</Button>
								<Select 
									value={this.state.is_use}
									onChange={this.onUse}
									style={{ width: '120px' }}
								>
									<Option value={'-1'}>全部</Option>
									<Option value={'0'}>无建设意义</Option>
									<Option value={'1'}>有建设意义</Option>
								</Select>
							</InputGroup>
							<Search
								placeholder="搜索"
								value={this.state.keyword}
								onSearch={this.onSearch}
								style={{ maxWidth: "200px" }}
								onChange={(e)=>{
									this.setState({
										keyword:e.target.value
									})
								}}
							/>
						</div>
						} extra={
							<Button value='feedback/cate' onClick={()=>{
								this.props.history.push('/feedback-list/feedback-classify')
							}}>类型管理</Button>
						}>
							<Tabs 
								onChange={this.onTabChange}
								activeKey={this.state.status}
							>
								<Tabs.TabPane tab="未回复" key="0">
									<Popconfirm
										value='feedback/del'
										title='确定删除吗？'
										okText='确定'
										cancelText='取消'
										onConfirm={this._onDeleteAll}
									>
										<Button type="danger" ghost size={'small'} className="mr_10">删除</Button>
									</Popconfirm>
									<Popconfirm
										value='feedback/edit'
										title='确定要忽略吗？'
										okText='确定'
										cancelText='取消'
										onConfirm={this._onDismiss.bind(this,'2')}
									>
										<Button type="primary" ghost size={'small'} className="mr_10">忽略</Button>
									</Popconfirm>
								</Tabs.TabPane>
								<Tabs.TabPane tab="已回复" key="1">
									<Popconfirm
										value='feedback/del'
										title='确定删除吗？'
										okText='确定'
										cancelText='取消'
										onConfirm={this._onDeleteAll}
									>
										<Button type="danger" ghost size={'small'} className="mr_10">删除</Button>
									</Popconfirm>
								</Tabs.TabPane>
								<Tabs.TabPane tab="已忽略" key="2">
									<Popconfirm 
										value='feedback/del'
										title='确定删除吗？'
										okText='确定'
										cancelText='取消'
										onConfirm={this._onDeleteAll}
									>
										<Button type="danger" ghost size={'small'} className="mr_10">删除</Button>
									</Popconfirm>
									<Popconfirm 
										value='feedback/edit'
										title='确定要取消忽略吗？'
										okText='确定'
										cancelText='取消'
										onConfirm={this._onDismiss.bind(this,'0')}
									>
										<Button type="primary" ghost size={'small'} className="mr_10">取消忽略</Button>
									</Popconfirm>
								</Tabs.TabPane>
							</Tabs>
							<Table
								scroll={{x:1300}}
								dataSource={this.feed_list}
								columns={this.state.status=='0'?this.col:this.done_col}
								rowKey='feedbackId'
								rowSelection={{
									selectedRowKeys:this.state.keys,
									onChange:(keys)=>this.setState({ keys }) 
								}}
								pagination={{
									position: 'bottom',
									current: this.page_current + 1,
									pageSize: this.page_size,
									total: this.page_total,
									showQuickJumper:true,
									onChange: this._onPage,
									showTotal:(total)=>'总共'+total+'条'
								}}
							/>
						</Card>
				</PageHeader>
				<Modal
					title="回复"
					visible={this.state.visible}
					okText="发送"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={this.handleCancel}
					bodyStyle={{ padding: "10px" }}
					footer={<div>
                        <Button onClick={this.handleCancel}>取消</Button>
                        <Button value='feedback/edit' onClick={this._onReply} type='primary'>确定</Button>
					</div>}
					
				>
					{/*
					<TextArea 
						value={this.state.reply}
						rows={4}
						onChange={e=>{
							this.setState({
								reply:e.target.value
							})
						}}
					/>
					*/}
					<BraftEditor
                        style={{border:"1px solid #cacaca"}}
                        value={this.state.editorState}
                        onChange={this.handleEditorChange}
                        onSave={this.submitContent}
						contentStyle={{height:'100px'}}
						controls={['emoji']}
                    />
					<InputGroup compact className="mt_10">
						<Input disabled={true} style={{ width: '120px' }} defaultValue="是否有建设意义" />
						<Select 
							value={this.state.useful}
							onChange={val=>{
								this.setState({
									useful:val
								})
							}}
						>
							<Option value={0}>否</Option>
							<Option value={1}>是</Option>
						</Select>
					</InputGroup>
				</Modal>
				<Modal
					title="反馈"
					visible={this.state.showFeed}
					okText="提交"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={this.hideFeed}
					bodyStyle={{ padding: "20px 25px" }}
					
					footer={<div>
                        <Button onClick={this.hideFeed}>取消</Button>
                        <Button value='feedback/edit' type='primary' onClick={this._onEditReply}>确定</Button>
                    </div>}
				>
					<div>
						<span className="be_l_gray">
							<strong>昵称:&nbsp;&nbsp;</strong>
						</span>
						<span>{this.state.view_user}</span>
					</div>
					<hr />
					<div>
						<span>
							<strong>评论内容:&nbsp;&nbsp;</strong>
						</span>
						<span>{this.state.view_content}</span>
					</div>
					<hr />
					<div>
						<span><strong>管理员回复:&nbsp;&nbsp;</strong></span>
						<div>
							
							<div  className={"flex f_row f_nowrap"} style={{ minHeight: '50px', width: '100%', padding: '10px 0' }}>
								<TextArea 
									disabled={this.state.isEdit?false:true} 
									rows={5} 
									value={this.state.view_reply} 
									onChange={e=>{
										this.setState({
											view_reply:e.target.value
										})
									}}
								/>&nbsp;&nbsp;
								<Btn.Group style={{ flexShrink: 0 }}>
										<Button
											value='feedback/del'
											onClick={()=>{
												this.setState({
													view_reply:''
												})
											}} 
											disabled={this.state.isEdit?false:true} 
											size={"normal"}
										>
											删除
										</Button>
										<Button 
											value='feedback/edit'
											onClick={()=>{
												this.setState({
													isEdit:true
												})
											}} size={"normal"}
										>
											编辑
										</Button>
								</Btn.Group>
							  </div>
						</div>
					</div>


				</Modal>
				<Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
					<Upload
						disabled
						listType="picture-card"
						fileList={this.state.fileList}
						onPreview={this.handlePreview}
					>
						{this.state.fileList.length == 0?'暂时没有附件':null}
					</Upload>
				</Modal>
				<Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
					{
						this.state.previewImage.indexOf('.mp4')>-1?
						<video src={this.state.previewImage} controls style={{width:'100%'}}></video>:
						<img alt="附件预览" style={{ width: '100%' }} src={this.state.previewImage} />
					}
                </Modal>
			</div>
		);
	}
	col = [
		{dataIndex:'feedbackId',width:68,title:'ID'},
		{dataIndex:'userId',width:140,title:'用户ID',ellipsis:true},
		{dataIndex:'username',width:140,title:'昵称',ellipsis:true},
		{dataIndex:'',title:'问题类型',render:(item,ele)=>{
			return (
				<div>
					{this.feed_cate_list.length==0?null:this.feed_cate_list.map(_ele=>{
						if(_ele.categoryId==ele.categoryId)
							return _ele.categoryName
					})}
				</div>
			)
		}},
		{dataIndex:'content',title:'反馈内容',width:380,render:(item,ele)=>{
			return (
				<Tooltip title={ele.content}>
				<div className="video_content">
					{ele.content}
				</div>
				</Tooltip>
			)
		}},
		{dataIndex:'status',title:'状态',render:(item,ele)=>ele.status ==1? "已回复" : "未回复"},
		{dataIndex:'mobile',title:'手机号'},
		{dataIndex:'username',title:'提交时间',render:(item,ele)=>{
			return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
		}},
		{title:'操作',render:(item,ele,index)=>(
			<div style={{ minWidth: "160px" }}>
				<Button value='feedback/view' className='m_2' onClick={this.showFeed.bind(this,index,'')} type="primary" ghost size={'small'}>查看</Button>
				<Button value='feedback/edit' className='m_2' type="primary" size={'small'} onClick={this.showModal.bind(this,ele.feedbackId)}>回复</Button>
				<Button value='feedback/view' disabled={ele.fileList.length==0?true:false} className='m_2' type="primary" size={'small'} onClick={this.showImgPanel.bind(this,index)}>查看附件</Button>
				<Popconfirm
					value='feedback/del'
					title='确定删除吗？'
					onConfirm={this._onDelete.bind(this,ele.feedbackId)}
					okText="确定"
					cancelText='取消'
				>
					<Button className='m_2' type="danger" ghost size={'small'}>删除</Button>
				</Popconfirm>
			</div>
		)},
	]
	done_col = [
		{dataIndex:'feedbackId',width:68,title:'ID'},
		{dataIndex:'userId',width:140,title:'用户ID',ellipsis:true},
		{dataIndex:'username',width:140,title:'昵称',ellipsis:true},
		{dataIndex:'',title:'问题类型',render:(item,ele)=>{
			return (
				<div>
					{this.feed_cate_list.length==0?null:this.feed_cate_list.map(_ele=>{
						if(_ele.categoryId==ele.categoryId)
							return _ele.categoryName
					})}
				</div>
			)
		}},
		{dataIndex:'content',title:'反馈内容',width:380,render:(item,ele)=>{
			return (
				<Tooltip title={ele.content}>
				<div className="video_content">
					{ele.content}
				</div>
				</Tooltip>
			)
		}},
		{dataIndex:'status',title:'状态',render:(item,ele)=>ele.status ==1? "已回复" : "未回复"},
		{dataIndex:'mobile',title:'手机号'},
		{dataIndex:'username',title:'提交时间',render:(item,ele)=>{
			return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
		}},
		{dataIndex:'reply',title:'管理员回复',ellipsis:true,render:(item,ele)=>(
			<Tooltip placement='left' title={ele.reply}>
				{ele.reply}
			</Tooltip>
		)},
		{title:'操作',render:(item,ele,index)=>(
			<div style={{ minWidth: "160px" }}>
				<Button value='feedback/view' className='m_2' onClick={this.showFeed.bind(this,index,'')} type="primary" ghost size={'small'}>查看</Button>
				<Button value='feedback/view' className='m_2' type="primary" size={'small'} onClick={this.showModal.bind(this,ele.feedbackId)}>已回复</Button>
				<Button value='feedback/view' disabled={ele.fileList.length==0?true:false} className='m_2' type="primary" size={'small'} onClick={this.showImgPanel.bind(this,index)}>查看附件</Button>
				
				<Popconfirm
					value='feedback/del'
					title='确定删除吗？'
					onConfirm={this._onDelete.bind(this,ele.feedbackId)}
					okText="确定"
					cancelText='取消'
				>
					<Button className='m_2' type="danger" ghost size={'small'}>删除</Button>
				</Popconfirm>
			</div>
		)},
	]
}

const LayoutComponent = FeedbackList;
const mapStateToProps = state => {
	return {
		feed_list:state.dashboard.feed_list,
		feed_cate_list:state.dashboard.feed_cate_list,
		user:state.site.user
	}
}
export default connectComponent({ LayoutComponent, mapStateToProps });