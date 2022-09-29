import React, { Component } from 'react';
import connectComponent from '../../util/connect'
import {InputNumber,Card,Table,Button,Modal, Form, Input, message} from 'antd'
import moment from 'moment'
import SwitchCom from '../../components/SwitchCom'
import AntdOssUpload from '../../components/AntdOssUpload'

class PkLevel extends Component {
	state = { 
        data_list:[],
        total:0,
        page:0,
        pageSize:10,

        begin_point:0,
        end_point:0,
        level_img:'',
        level_name:'',
        share_integral:0,
        levelId:0,
        status:0,
        imgList:[]
    };
    img = {
        getValue:()=>''
    }
	componentDidMount() {
        this.getPkLevel()
    }
    getPkLevel = ()=>{
        this.props.actions.getPkLevel({
            resolved:(res)=>{
                console.log(res)
                if(Array.isArray(res)){
                    this.setState({ data_list:res })
                }
            }
        })
    }
    setPkLevel = ()=>{
        let {
            view,
            begin_point,
            end_point,
            level_img,
            level_name,
            share_integral,
            levelId,
            status
        } = this.state
        if(view){
            this.setState({ setPanel:false })
            return;
        }
        level_img = this.img.getValue()
        
        if(!level_name) { message.info('请输入段位名称');return  }
        if(!level_img) { message.info('请上传图片');return  }

        this.setState({ loading:true })
        this.props.actions.setPkLevel({
            begin_point,
            end_point,
            level_img,
            level_name,
            share_integral,
            levelId,
            status,
            resolved:(res)=>{
                this.setState({ 
                    loading:false,
                    setPanel:false
                })
                message.success('提交成功')
                this.getPkLevel()
            },
            rejected:()=>{
                this.setState({ loading:false })
            }
        })
    }
    onAdd = ()=>this.setState({
        view:false,
        setPanel:true,
        levelId:0,
        imgList:[],
        begin_point:0,
        end_point:0,
        level_name:'',
        share_integral:0,
        status:0,
    })
    renderTitle = ()=>{
        return (
            <>
                {/* <Button className='m_2'>设置</Button> */}
                <Button className='m_2' onClick={this.onAdd}>添加段位等级</Button>
            </>
        )
    }
	render() {
        const {view,data_list,total,page,pageSize} = this.state
		return (
			<div className="animated fadeIn" >
                <Card title='段位管理' extra={this.renderTitle()}>
                    <Table 
                        columns={this.col} 
                        dataSource={data_list}
                        pagination={false}
                        // pagination={{
                        //     pageSize:pageSize,
                        //     current:page+1,
                        //     total:total,
                        //     onChange:(val)=>this.setState({ page:val-1 },this.getPkLevel)
                        // }}
                    >
                    </Table>
                </Card>
                <Modal title={
                    this.state.levelId == 0?'添加':
                    this.state.view?'查看':'修改'
                } onOk={this.setPkLevel} okText='确定' cancelText='取消' visible={this.state.setPanel} maskClosable={false} onCancel={()=>{
                    this.setState({setPanel:false})
                }}>
                    <Form labelCol={{span:4}} wrapperCol={{span:20}}>
                        <Form.Item label='段位名称'>
                            <Input disabled={view} value={this.state.level_name} onChange={(e)=>{
                                this.setState({ level_name:e.target.value })
                            }}></Input>
                        </Form.Item>
                        <Form.Item label='段位图标'>
                            <AntdOssUpload
                                disabled={view}
                                ref={ref=>this.img = ref}
                                accept='image/*'
                                value={this.state.imgList}
                                actions={this.props.actions}
                            >
                            </AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='状态'>
                            <SwitchCom  disabled={view}  value={this.state.status} onChange={(status)=>{
                                this.setState({ status })
                            }}></SwitchCom>
                        </Form.Item>
                        <Form.Item label='积分'>
                            <InputNumber  disabled={view}  value={this.state.begin_point} min={0} onChange={begin_point=>{
                                this.setState({ begin_point })
                            }}></InputNumber>
                            <span className='m_2'>至</span>
                            <InputNumber  disabled={view}  value={this.state.end_point} min={0} onChange={end_point=>{
                                this.setState({ end_point })
                            }}></InputNumber>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal zIndex={99} visible={this.state.imgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({imgPanel:false})
                }}>
                    <img alt="图片／视频" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
			</div>
		);
    }
    col = [
        {title:'ID',dataIndex:'levelId',key:'levelId'},
        {title:'段位名称',dataIndex:'levelName',key:'levelName'},
        {title:'段位图标',render:(item,ele)=>(
            <a>
                <img onClick={()=>{
                    this.setState({ previewImage:ele.levelImg,imgPanel:true })
                }} className="head-example-img" src={ele.levelImg}/>
            </a>
        )},
        {title:'操作',render:(item,ele)=>(
            <div>
                <Button className='m_2' size='small' onClick={()=>{
                    this.setState({ 
                        view:true,
                        setPanel:true,
                        level_name:ele.levelName,
                        imgList:[{ 
                            uid:'uid',
                            type:'image/png',
                            url:ele.levelImg,
                            status:'done'
                        }],
                        share_integral:ele.shareIntegral,
                        end_point:ele.endPoint,
                        begin_point:ele.beginPoint,
                        levelId:ele.levelId
                    })
                }}>查看</Button>
                 <Button className='m_2' size='small' onClick={()=>{
                    this.setState({ 
                        view:false,
                        setPanel:true,
                        level_name:ele.levelName,
                        imgList:[{ 
                            uid:'uid',
                            type:'image/png',
                            url:ele.levelImg,
                            status:'done'
                        }],
                        share_integral:ele.shareIntegral,
                        end_point:ele.endPoint,
                        begin_point:ele.beginPoint,
                        levelId:ele.levelId
                    })
                }}>修改</Button>
            </div>
        )}
    ]
}

const LayoutComponent = PkLevel;
const mapStateToProps = state => {
	return {

	}
}

export default connectComponent({ LayoutComponent, mapStateToProps })