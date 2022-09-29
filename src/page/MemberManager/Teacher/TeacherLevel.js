import React, { Component } from 'react';
import connectComponent from '../../util/connect'
import {Modal,Card, Spin, Table, Button, Popconfirm, message} from 'antd'

class TeacherLevel extends Component {
	state = { 
		loading:false,
		previewImage:'',
		showImgPanel:false,
		data_list:[]
    };
	componentDidMount() {
        
    }
	getTeacherLevel = ()=>{
		this.setState({ loading:true })
		this.props.actions.getTeacherLevel({
			level_id:0,
			resolved:(res)=>{
				if(Array.isArray(res)){
					this.setState({ data_list:res })
				}
				this.setState({ loading:false })
				
			},
			rejected:()=>{
				this.setState({ loading:false })
			}
		})
	}
	actionTeacherLevel = (action,level_id) =>{
		this.props.actions.actionTeacherLevel({
			action,level_id,
			resolved:(res)=>{
				message.success('提交成功')
				this.getTeacherLevel()
			},
			rejected:()=>{

			}
		})
	}
	renderExtra = ()=>{
		return (
			<Button>添加讲师等级</Button>
		)
	}
	render() {
		return (
			<div className="animated fadeIn" >
				<Spin>
					<Card title='讲师权益管理' extra={this.renderExtra()}>
						<Table
							rowKey='levelId'
							columns={[
								{title:'ID',dataIndex:'levelId',key:'levelId'},
								{title:"老师等级",dataIndex:'levelName',key:'levelName'},
								{title:'标识',render:(item,ele)=>{
									return (
										 <img src={ele.levelImg} onClick={() => { this.setState({ showImgPanel: true, previewImage: ele.levelImg }) }} className='disc head-example-img'></img>
									)
								}},
								{title:'兑换课程数',dataIndex:'exchange',key:'exchange'},
								{title:'操作',render:(item,ele)=>{
									return (
										<>
											<Button className='m_2' size='small'>修改</Button>
											<Popconfirm okText='确定' title='确定删除吗' cancelText='取消' onConfirm={this.actionTeacherLevel.bind(this,'delete',ele.levelId)}>
												<Button className='m_2' size='small'>删除</Button>
											</Popconfirm>
										</>
									)
								}}
							]}
							dataSource={this.state.data_list}
						></Table>
					</Card>
				</Spin>
				<Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{this.setState({ showImgPanel:false })}}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
			</div>
		);
	}
}

const LayoutComponent = TeacherLevel;
const mapStateToProps = state => {
	return {

	}
}

export default connectComponent({ LayoutComponent, mapStateToProps })