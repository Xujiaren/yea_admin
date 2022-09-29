import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {Checkbox,message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, InputNumber} from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom';
// import PersonTypePublic from '../../'
class DownEdit extends Component{
    state = {
        view_mode:false,
        course_type:1,
        course_exchange:2,
        is_must:0,
        status:0,
        id:0,
        v_list:[],
        p_list:[],
        fileList:[],
        editPanel:false,
        edit_index:-1,
        edit_title:'',
        edit_intro:'',
        posterList:[],
        imgList:[],
        isVideo:false,
        type:1,
        m_type:1,
        edit_order:0,

        content:'',
        files:'',
        code_type:0,
        ftype:0,
        parent_id:0,
        code_url:'',
        down_id:0,
        flag:'',
        img_url:'',
        name:''

    }
    componentWillMount(){
        const {id} = this.props.match.params
        const {path} = this.props.match
        // if(path=='/imgdownload/view/:id'){
        //     this.setState({ view_mode:true })
        // }
        if(parseInt(id)!==0){
            this.setState({id:parseInt(id)})
        }
    }
    componentWillReceiveProps(n_props){
        
    }
    setDownloadList = ()=>{
        let {
            content,
            files,
            code_type,
            ftype,
            parent_id,
            code_url,
            down_id,
            flag,
            img_url,
            name
        } = this.state

        this.props.actions.setDownloadList({
            content,
            files,
            code_type,
            ftype,
            parent_id,
            code_url,
            down_id,
            flag,
            img_url,
            name,
            resolved:(res)=>{

            },
            rejected:()=>{

            }
        })
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
                        subTitle={id==0?'添加图集':view_mode?'查看':'修改'}
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            <Form wrapperCol={{span:18}} labelCol={{span:3}}>
                                <Form.Item label='图集名称'>
                                    <Input className='m_w400' disabled={view_mode}></Input>
                                </Form.Item>
                                
                                <Form.Item label='图集封面' help='请上传符合尺寸为400px * 400px 的图片'>
                                    <AntdOssUpload 
                                      
                                        actions={this.props.actions}
                                        value={this.state.fileList}
                                        accept='image/*'
                                        ref={ref=>this.img = ref}
                                    ></AntdOssUpload>
                                </Form.Item>
                                <Form.Item label='图集类型'>
                                    <Select className='m_w400' defaultValue={0} disabled={view_mode}>
                                        <Select.Option value={0}>无</Select.Option>
                                        <Select.Option value={1}>视频</Select.Option>
                                        <Select.Option value={2}>图片</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label='介绍'>
                                    <Input.TextArea autoSize={{minRows:4}} className='m_w400' disabled={view_mode}></Input.TextArea>
                                </Form.Item>
                                <Form.Item label='设置对象'>
                                    <Select value={this.state.type} className='m_w400' disabled={view_mode} onChange={(type)=>this.setState({type})}>
                                        <Select.Option value={0}>全部用户</Select.Option>
                                        <Select.Option value={1}>认证用户</Select.Option>
                                    </Select>
                                    {this.state.type==1?
                                    <div>
                                        <Checkbox.Group options={[
                                            { label: '讲师', value: '1' },
                                            {label:'店主',value:'3'},
                                            {label:'店员',value:'4'},
                                            { label: '优惠顾客', value: '5' },
                                            { label: '直销员', value: '6' },

                                            { label: '初级业务员', value: '7' },
                                            { label: '中级业务员', value: '8' },
                                            { label: '高级业务员', value: '9' },
                                            { label: '资深或以上业务员', value: 'GG' },
                                        ]} onChange={null} className='mt_20'/>
                                    </div>
                                    :null}
                                </Form.Item>
                                <Form.Item label='图片/视频'>
                                    <Table pagination={false} size='small' columns={this.p_col} dataSource={this.state.p_list} bordered={true} />
                                    <Button type='dashed' disabled={view_mode} onClick={()=>{
                                        this.setState({ edit_order:0, isVideo:false,editPanel:true,edit_index:-1,edit_title:'',edit_intro:'',posterList:[],imgList:[] })
                                    }}>
                                        <Icon type="plus" /> 添加图片/视频
                                    </Button>
                                </Form.Item>
                                <Form.Item label='选择打码'>
                                   <Radio.Group value={this.state.m_type} onChange={(e)=>this.setState({m_type:e.target.value})}>
                                       <Radio value={0}>个人二维码(系统生成)</Radio>
                                       <Radio value={1}>好友专属码</Radio>
                                   </Radio.Group>
                                   <br/>
                                   {this.state.m_type==1?
                                    <AntdOssUpload 
                                     
                                        actions={this.props.actions}
                                        value={this.state.fileList1}
                                        accept='image/*'
                                        ref={ref=>this.imgs = ref}
                                    ></AntdOssUpload>
                                   :null}
                                </Form.Item>
                                {/* <Form.Item label='上传二维码'>
                                    <AntdOssUpload 
                                        disabled={view_mode}
                                        actions={this.props.actions}
                                        value={this.state.fileList1}
                                        accept='image/*'
                                        ref={ref=>this.imgs = ref}
                                    ></AntdOssUpload>
                                </Form.Item> */}
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
                <Modal okText='确定' cancelText='取消' title={this.state.edit_index==-1?'添加':'修改'} onOk={this.onEdit} visible={this.state.editPanel} maskClosable={false} onCancel={() => {
                    this.setState({ editPanel: false })
                }}>
                    <Form wrapperCol={{span:20}} labelCol={{span:4}}>
                        
                        <Form.Item label={'图片/视频'}>
                            <AntdOssUpload actions={this.props.actions} maxLength={1} accept={'image/*,video/mp4'} value={this.state.posterList} ref={(ref)=>this.imgs = ref}></AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='排序'>
                            <InputNumber min={0} value={this.state.edit_order} onChange={e=>{
                                this.setState({ edit_order:e })
                            }}></InputNumber>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    onDelete = (index,type)=>{
        const {p_list} = this.state
        let tmp = []
        tmp = p_list.filter((ele,_index)=>_index!==index)
        this.setState({p_list:tmp})
    }
    onEdit = ()=>{
        const {p_list,edit_index,edit_title,edit_order} = this.state
        const imgs = this.imgs&&this.imgs.getValue()

        // if(edit_title==''){ message.info('请输入文案');return; }
        if(!imgs){ message.info('请上传照片');return; }

        if(edit_index==-1){
            const item = {
                id:Date.now().toString(),
                title:'',
                img:imgs,
                order:edit_order,
            }
            this.setState({ p_list:[...p_list,item],editPanel:false })
        }else{
            p_list[edit_index].title = edit_title
            p_list[edit_index].img = imgs
            p_list[edit_index].order = edit_order
            this.setState({ p_list,editPanel:false })
        }
    }
    p_col = [
        { dataIndex:'id', key:'id',title:'ID' },
        { dataIndex:'img', key:'img',title:'图片',render:(item,ele)=>{
            return (
                <img src={ele.img} className='head-example-img' onClick={()=>{
                    this.setState({ showImgPanel: true,previewImage:ele.img })
                }}/>)
        }},
        { dataIndex:'order', key:'order',title:'排序' },
        { title:'操作',render:(item,ele,index)=>{
            return <>
                <a className='m_2' onClick={()=>{
                    const {p_list} = this.state
                    
                    this.setState({ edit_order: ele.order,posterList:[{ uid:'uid',status:'done',url:p_list[index].img,type:'image/png' }],edit_index:index,editPanel:true },()=>{
                        
                    })
                }}>修改</a>
                <a className='m_2' onClick={this.onDelete.bind(this,index,'')}>删除</a>
            </>
        }},
    ]
}

const LayoutComponent = DownEdit;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
