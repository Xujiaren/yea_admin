import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, InputNumber} from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom';
import Editor from '../../components/Editor'

class TreeGoodsEdit extends Component{
    state = {
        view_mode:false,
        course_type:1,
        course_exchange:2,
        is_must:0,
        status:0,
        id:0,
        v_list:[
            {id:0,title:'树苗'},
            {id:1,title:'小树'},
            {id:2,title:'中树'},
            {id:3,title:'大树'},
            {id:4,title:'开花'},
            {id:5,title:'结果'},
            {id:6,title:'果实成长期'},
            {id:7,title:'果实成熟期'},
            {id:8,title:'果实成熟期'},
        ],
        p_list:[],
        fileList:[],
        fileList1:[],
        editPanel:false,
        edit_index:-1,
        edit_title:'',
        edit_intro:'',
        posterList:[],
        imgList:[],
        isVideo:false,
    }
    componentWillMount(){
        const {id} = this.props.match.params
        const {path} = this.props.match
        if(path=='/tree/goods/view/:id'){
            this.setState({ view_mode:true })
        }
        if(parseInt(id)!==0){
            this.setState({id:parseInt(id)})
        }
    }
    componentWillReceiveProps(n_props){
        
    }
    
    render(){
        const {view_mode,id,isVideo} = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={id==0?'添加商品':view_mode?'查看':'修改'}
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            <Form wrapperCol={{span:18}} labelCol={{span:3}}>
                                
                                <Form.Item label='商品名称'>
                                    <Input className='m_w400' disabled={view_mode}></Input>
                                </Form.Item>
                                
                                <Form.Item label='商品主图' help='请上传符合尺寸为400px * 400px 的图片'>
                                    <AntdOssUpload 
                                        disabled={view_mode}
                                        actions={this.props.actions}
                                        value={this.state.fileList}
                                        accept='image/*'
                                        ref={ref=>this.img = ref}
                                    ></AntdOssUpload>
                                </Form.Item>
                                <Form.Item label='兑换券'>
                                    <InputNumber min={0} disabled={view_mode}/>
                                </Form.Item>
                                <Form.Item label='库存'>
                                    <InputNumber min={0} disabled={view_mode}/>
                                </Form.Item>
                                <Form.Item label='商品详情'>
                                    <Editor readOnly={view_mode} actions={this.props.actions}></Editor>
                                </Form.Item>
                                <Form.Item label='证书'>
                                    <AntdOssUpload 
                                        disabled={view_mode}
                                        actions={this.props.actions}
                                        value={this.state.fileList1}
                                        accept='image/*'
                                        ref={ref=>this.imgs = ref}
                                    ></AntdOssUpload>
                                </Form.Item>
                                <Form.Item label='是否上架'>
                                    <SwitchCom 
                                        disabled={view_mode}
                                        value={this.state.status}
                                        onChange={status=>this.setState({status})}
                                    ></SwitchCom>
                                </Form.Item>
                                <Form.Item wrapperCol={{offset:3,span: 18}}>
                                    <Button className='m_2' onClick={()=>{
                                        window.history.back()
                                    }}>取消</Button>
                                    {view_mode?null:
                                    <Button className='m_2' type='primary'>提交</Button>
                                    }
                                </Form.Item>
                            </Form>
                        </Card>
                    </PageHeader>
                </Card>
                
                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
            </div>
        )
    }
    
    v_col = [
        { dataIndex:'title', key:'title',title:'阶段' },
        { dataIndex:'', key:'',title:'阳光数',ellipsis:false,render:()=>{
            return (
            <>
                <InputNumber />
                <span className="pad_l5 pad_r5">至</span>
                <InputNumber />
            </>
            )
        }},
    ]
    
}

const LayoutComponent = TreeGoodsEdit;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
