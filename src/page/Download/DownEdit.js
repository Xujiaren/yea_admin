import React,{ Component } from 'react';
importÂ connectComponentÂ fromÂ '../../util/connect';
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
                        subTitle={id==0?'æ·»å å¾é':view_mode?'æ¥ç':'ä¿®æ¹'}
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            <Form wrapperCol={{span:18}} labelCol={{span:3}}>
                                <Form.Item label='å¾éåç§°'>
                                    <Input className='m_w400' disabled={view_mode}></Input>
                                </Form.Item>
                                
                                <Form.Item label='å¾éå°é¢' help='è¯·ä¸ä¼ ç¬¦åå°ºå¯¸ä¸º400px * 400px çå¾ç'>
                                    <AntdOssUpload 
                                      
                                        actions={this.props.actions}
                                        value={this.state.fileList}
                                        accept='image/*'
                                        ref={ref=>this.img = ref}
                                    ></AntdOssUpload>
                                </Form.Item>
                                <Form.Item label='å¾éç±»å'>
                                    <Select className='m_w400' defaultValue={0} disabled={view_mode}>
                                        <Select.Option value={0}>æ </Select.Option>
                                        <Select.Option value={1}>è§é¢</Select.Option>
                                        <Select.Option value={2}>å¾ç</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label='ä»ç»'>
                                    <Input.TextArea autoSize={{minRows:4}} className='m_w400' disabled={view_mode}></Input.TextArea>
                                </Form.Item>
                                <Form.Item label='è®¾ç½®å¯¹è±¡'>
                                    <Select value={this.state.type} className='m_w400' disabled={view_mode} onChange={(type)=>this.setState({type})}>
                                        <Select.Option value={0}>å¨é¨ç¨æ·</Select.Option>
                                        <Select.Option value={1}>è®¤è¯ç¨æ·</Select.Option>
                                    </Select>
                                    {this.state.type==1?
                                    <div>
                                        <Checkbox.Group options={[
                                            { label: 'è®²å¸', value: '1' },
                                            {label:'åºä¸»',value:'3'},
                                            {label:'åºå',value:'4'},
                                            { label: 'ä¼æ é¡¾å®¢', value: '5' },
                                            { label: 'ç´éå', value: '6' },

                                            { label: 'åçº§ä¸å¡å', value: '7' },
                                            { label: 'ä¸­çº§ä¸å¡å', value: '8' },
                                            { label: 'é«çº§ä¸å¡å', value: '9' },
                                            { label: 'èµæ·±æä»¥ä¸ä¸å¡å', value: 'GG' },
                                        ]} onChange={null} className='mt_20'/>
                                    </div>
                                    :null}
                                </Form.Item>
                                <Form.Item label='å¾ç/è§é¢'>
                                    <Table pagination={false} size='small' columns={this.p_col} dataSource={this.state.p_list} bordered={true} />
                                    <Button type='dashed' disabled={view_mode} onClick={()=>{
                                        this.setState({ edit_order:0, isVideo:false,editPanel:true,edit_index:-1,edit_title:'',edit_intro:'',posterList:[],imgList:[] })
                                    }}>
                                        <Icon type="plus" /> æ·»å å¾ç/è§é¢
                                    </Button>
                                </Form.Item>
                                <Form.Item label='éæ©æç '>
                                   <Radio.Group value={this.state.m_type} onChange={(e)=>this.setState({m_type:e.target.value})}>
                                       <Radio value={0}>ä¸ªäººäºç»´ç (ç³»ç»çæ)</Radio>
                                       <Radio value={1}>å¥½åä¸å±ç </Radio>
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
                                {/* <Form.Item label='ä¸ä¼ äºç»´ç '>
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
                                    }}>åæ¶</Button>
                                    {view_mode?null:
                                    <Button className='m_2' type='primary'>æäº¤</Button>
                                    }
                                </Form.Item>
                            </Form>
                        </Card>
                    </PageHeader>
                </Card>
                
                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="å¾çé¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal okText='ç¡®å®' cancelText='åæ¶' title={this.state.edit_index==-1?'æ·»å ':'ä¿®æ¹'} onOk={this.onEdit} visible={this.state.editPanel} maskClosable={false} onCancel={() => {
                    this.setState({ editPanel: false })
                }}>
                    <Form wrapperCol={{span:20}} labelCol={{span:4}}>
                        
                        <Form.Item label={'å¾ç/è§é¢'}>
                            <AntdOssUpload actions={this.props.actions} maxLength={1} accept={'image/*,video/mp4'} value={this.state.posterList} ref={(ref)=>this.imgs = ref}></AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='æåº'>
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

        // if(edit_title==''){ message.info('è¯·è¾å¥ææ¡');return; }
        if(!imgs){ message.info('è¯·ä¸ä¼ ç§ç');return; }

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
        { dataIndex:'img', key:'img',title:'å¾ç',render:(item,ele)=>{
            return (
                <img src={ele.img} className='head-example-img' onClick={()=>{
                    this.setState({ showImgPanel: true,previewImage:ele.img })
                }}/>)
        }},
        { dataIndex:'order', key:'order',title:'æåº' },
        { title:'æä½',render:(item,ele,index)=>{
            return <>
                <a className='m_2' onClick={()=>{
                    const {p_list} = this.state
                    
                    this.setState({ edit_order: ele.order,posterList:[{ uid:'uid',status:'done',url:p_list[index].img,type:'image/png' }],edit_index:index,editPanel:true },()=>{
                        
                    })
                }}>ä¿®æ¹</a>
                <a className='m_2' onClick={this.onDelete.bind(this,index,'')}>å é¤</a>
            </>
        }},
    ]
}

constÂ LayoutComponentÂ = DownEdit;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        user:state.site.user,
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
