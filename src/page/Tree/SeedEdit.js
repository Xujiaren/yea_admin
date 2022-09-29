import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, InputNumber} from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom';

class SeedEdit extends Component{
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
        know_id:-1,
        know_value:'',
        knowledge:[]
    }
    componentWillMount(){
        const {id} = this.props.match.params
        const {path} = this.props.match
        if(path=='/tree/seed/view/:id'){
            this.setState({ view_mode:true })
        }
        if(parseInt(id)!==0){
            this.setState({id:parseInt(id)})
        }
    }
    componentWillReceiveProps(n_props){
        
    }
    renderKnowledge = (item,ele,index)=>{
        const {know_id,know_value} = this.state
        if(know_id == index)
            return <Input.TextArea autoSize={{minRows:1}} value={know_value} onChange={e=>this.setState({ know_value:e.target.value })}></Input.TextArea>
        else
            return ele.value
    }
    renderDel = (ele,item,index)=>(
        <>
            <a onClick={()=>{
                const {knowledge,know_id,know_value} = this.state
                if(know_id !== index){
                    this.setState({ 
                        know_value: knowledge[index].value,
                        know_id:index
                    })
                }else{
                    if(know_value == ''){ message.info('请输入知识点'); return }
                    
                    knowledge[index].value = know_value
                    this.setState({ know_id:-1,knowledge:[...knowledge] })
                }
            }}>{this.state.know_id == index?'保存':'修改'}</a>
            <a style={{marginLeft:'20px'}} onClick={()=>{
                const {knowledge} = this.state
                this.setState({ knowledge:knowledge.filter(_ele=>_ele.id !== item.id)})
            }}>删除</a>
        </>
    )
    onAddKnow = ()=>{
        const {knowledge,know_value} = this.state
        const id = Math.floor(Math.random()*100000000 + Date.now() )
        const item = { 
            value: '',
            id: id
        }
        this.setState({ know_value: '',know_id:knowledge.length,knowledge:[...knowledge,item] })
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
                        subTitle={id==0?'添加种子':view_mode?'查看':'修改'}
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            <Form wrapperCol={{span:18}} labelCol={{span:3}}>
                                
                                <Form.Item label='种子名称'>
                                    <Input className='m_w400' disabled={view_mode}></Input>
                                </Form.Item>
                                
                                <Form.Item label='上传封面' help='请上传符合尺寸为400px * 400px 的图片'>
                                    <AntdOssUpload 
                                        disabled={view_mode}
                                        actions={this.props.actions}
                                        value={this.state.fileList}
                                        accept='image/*'
                                        ref={ref=>this.img = ref}
                                    ></AntdOssUpload>
                                </Form.Item>
                                <Form.Item label='消耗金币数'>
                                    <InputNumber min={0} disabled={view_mode}/>
                                </Form.Item>
                                <Form.Item label='获得兑换券'>
                                    <InputNumber min={0} disabled={view_mode}/>
                                </Form.Item>
                              
                                <Form.Item label='介绍'>
                                    <Input.TextArea className='m_w400'  autoSize={{minRows:4}} disabled={view_mode}/>
                                </Form.Item>
                                <Form.Item label='知识点'>
                                    <Table rowKey='id' pagination={false} size='small' columns={[
                                        {dataIndex:'id',title:'序号'},
                                        {dataIndex:'value',title:'知识点',render:this.renderKnowledge},
                                        {title:'操作',render:this.renderDel}
                                    ]} dataSource={this.state.knowledge} bordered={true} />
                                    <Button className='m_t' onClick={this.onAddKnow}>添加</Button>
                                </Form.Item>
                                <Form.Item label='设置'>
                                    <Table rowKey='id' pagination={false} size='small' columns={this.v_col} dataSource={this.state.v_list} bordered={true} />
                                    
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

const LayoutComponent = SeedEdit;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
