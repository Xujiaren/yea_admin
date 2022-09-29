import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, InputNumber} from 'antd'
import moment from 'moment'
import SwitchCom from '../../components/SwitchCom';

class MeettingLabel extends Component{
    state = {
        view_mode:false,
        status:0,
        data_list:[
            {id:324,title:'标签1',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg',time:'22',isTop:1,status:0},
            {id:325,title:'标签2',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg',time:'22',isTop:0,status:1},
        ],
        name:'标签管理',
        title:'',
        tag_id:0,
        ttype:1,
        keyword:'',
        channel_id:0,
        flag:'',
        sort_order:0,
        teacher_id:0,
        ctype:4,
        channels_list:[],
        tag_list:[],
    }
    
    page_current = 0
    page_total = 0
    page_size = 10

    componentWillMount(){
        console.log(this.props)
        if(this.props.location.pathname=="/meetting/classify"){
            const data_list = [
                {id:324,title:'考核条件须知',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg',time:'22',isTop:1,status:0},
                {id:325,title:'旅游小知识',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg',time:'22',isTop:0,status:1},
                {id:3235,title:'出行问答',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg',time:'22',isTop:0,status:1},
            ]
            this.setState({ data_list,name:'研讨会课程栏目管理' })
            const { search } = this.props.history.location
            let page = 0
            if (search.indexOf('page=') > -1) {
                page = search.split('=')[1] - 1
                this.page_current = page
            }
            this.getChannels()
        }else{
            this.getTags()
        }
    }
    getChannels=()=>{
        const{actions}=this.props
        actions.getChannels(4,this.state.keyword,0,this.page_size)
    }
    getTags=()=>{
        const{actions}=this.props
        actions.getTag({
            keyword:this.state.keyword,
            page:this.page_current,
            ttype:1,
            pageSize:this.page_size
        })
    }
    componentWillReceiveProps(n_props){
        if(n_props.channels_list!=this.props.channels_list){
            this.setState({
                channels_list:n_props.channels_list.data
            })
            this.page_current=n_props.channels_list.page
            this.page_total=n_props.channels_list.total
        }
        if(n_props.tag_list!=this.props.tag_list){
            this.setState({
                tag_list:n_props.tag_list.data
            })
        }
    }
    onTags=()=>{
        const{title,status,tag_id,ttype}=this.state
        const{actions}=this.props
        console.log(title)
        let tagName = title
        actions.publishTag({
            status, 
            tag_id,
            tagName,
            ttype,
            resolved:(data)=>{
                message.success("操作成功")
                this.setState({editPanel:false})
                this.getTags()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    publishChannle=()=>{
        const{channel_id,title,status,flag,sort_order,ttype,teacher_id,ctype}=this.state
        let channel_name = title
        if(!channel_name){message.info({content:'请输入名称'});return;}
        const{actions}=this.props
        actions.publishChannel({
            channel_id,
            channel_name,
            ttype,
            ctype,
            sort_order,
            status,
            flag,
            teacher_id,
            resolved:(res)=>{
                message.success({
                    content:'添加成功'
                })
                this.setState({editPanel:false})
                this.getChannels()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    onEdit=(ele)=>{
        this.setState({ editPanel:true, title:ele.channelName,status:ele.status,channel_id:ele.channelId })
    }
    _onUpdataChannel(val,action){
        const {actions} = this.props;
        actions.updateChannel({
            action:action,
            channel_id:val,
            resolved:(data)=>{
                message.success('操作成功')
                this.getChannels()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onUpdate(id){
        const {actions} = this.props
        actions.updateTag({
            tag_id:id,
            resolved:(data)=>{
                this.getTags()
                message.success("操作成功")
            },
            rejected:(data)=>{
                message.error("data")
            }
        })
    }
    _onDelete(id){
        console.log(id,'??')
        const {actions} = this.props
        actions.removeTag({
            tag_id:id,
            resolved:(data)=>{
                this.getTags()
                message.success("操作成功")
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    render(){
        const {view_mode,channels_list,keyword} = this.state
        return (
            <div className="animated fadeIn">
                <Card title={this.state.name} extra={
                    <>
                        <Button className='m_2' onClick={()=>{
                            this.setState({ editPanel:true, edit_index:-1,title:'',status:0 })
                        }}>添加</Button>
                    </>
                }>
                    <Input.Search className='m_w200 m_2' placeholder='关键词' onSearch={()=>{this.getChannels()}} value={keyword} onChange={(e)=>{
                        this.setState({keyword:e.target.value})
                    }}></Input.Search>
                   
                    <Table
                        columns={this.state.name=='标签管理'?this.col:this.class_col}
                        // rowSelection={{
                        //     selectedRowKeys:this.state.keys,
                        //     onChange:(keys)=>{
                        //         this.setState({ keys })
                        //     }
                        // }}
                        rowKey='id'
                        dataSource={this.state.name=='标签管理'?this.state.tag_list:channels_list}
                       
                        pagination={{
                            current: this.page_current+1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper:true,
                            onChange: (val)=>{
                                let pathname = this.props.history.location.pathname
                                this.props.history.replace(pathname + '?page=' + val)
                                this.page_current = val-1
                                this.getChannels()
                            },
                            showTotal:(total)=>'总共'+total+'条'
                        }}
                    />
                </Card>
                
                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal 
                    visible={this.state.editPanel}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ editPanel: false })
                    }}
                    title="修改"
                    okText='确定'
                    cancelText='取消'
                    onOk={()=>{
                        const {title,status,edit_index,data_list} = this.state
                        if(title==''){ message.info('请输入标题');return; }

                        // if(edit_index==-1){
                        //     const item = {
                        //         id:Date.now().toString(),
                        //         title,
                        //         status
                        //     }
                        //     this.setState({ data_list:[item,...data_list],editPanel:false })
                        //     this.publishChannle()
                        // }else{
                        //     data_list[edit_index].title = title
                        //     data_list[edit_index].status = status
                        //     this.publishChannle()
                        //     this.setState({ data_list,editPanel:false })
                        // }
                        if(this.state.name=='标签管理'){
                            this.onTags()
                        }else{
                            this.publishChannle()
                        }
                        
                    }}
                >
                    <Form labelCol={{span:4}} wrapperCol={{span:20}}>
                        <Form.Item label='标签名称'>
                            <Input  value={this.state.title} onChange={e=>this.setState({title:e.target.value})}></Input>
                        </Form.Item>
                        <Form.Item label='状态'>
                           <SwitchCom value={this.state.status} onChange={status=>this.setState({status})}></SwitchCom>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex:'tagId',key:'tagId',title:'ID' },
        { dataIndex:'tagName',key:'tagName',title:'标签名称',ellipsis:true },

        { dataIndex:'',key:'',title:'状态',render:(item,ele,index)=>{
            return ele.status==1?'已启用':'未启用'
        }},
        { width:250,dataIndex:'',key:'',title:'操作',render:(item,ele,index)=>{
            return(
                <>
                    <Button size='small' type={ele.status==1?'primary':''} className='m_2' onClick={this._onUpdate.bind(this,ele.tagId)}>{ele.status==1?'禁用':'启用'}</Button>
                    
                    {/* <Button size='small' className='m_2' onClick={()=>{
                        this.props.history.push('/meetting/activity/view/1')
                    }}>查看</Button> */}
                    <Button size='small' className='m_2' onClick={()=>{
                        this.setState({ editPanel:true,title:ele.tagName,status:ele.status,tag_id:ele.tagId })
                    }}>修改</Button>
                   
                    <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this._onDelete.bind(this,ele.tagId)}>
                        <Button size='small' className='m_2'>删除</Button>
                    </Popconfirm>
                </>
            )
        }},

    ]
    class_col = [
        { dataIndex:'channelId',key:'channelId',title:'ID' },
        { dataIndex:'channelName',key:'channelName',title:'栏目名称',ellipsis:true },

        { dataIndex:'status',key:'status',title:'状态',render:(item,ele,index)=>{
            return ele.status==1?'已启用':'未启用'
        }},
        { width:250,dataIndex:'',key:'',title:'操作',render:(item,ele,index)=>{
            return(
                <>
                    <Button size='small' type={ele.status==1?'primary':''} className='m_2' onClick={this._onUpdataChannel.bind(this,ele.channelId,'status')}>{ele.status==1?'禁用':'启用'}</Button>
                    
                    {/* <Button size='small' className='m_2' onClick={()=>{
                        this.props.history.push('/meetting/activity/view/1')
                    }}>查看</Button> */}
                    <Button size='small' className='m_2' onClick={this.onEdit.bind(this,ele)}>修改</Button>
                   
                    <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this._onUpdataChannel.bind(this,ele.channelId,'delete')}>
                        <Button size='small' className='m_2'>删除</Button>
                    </Popconfirm>
                </>
            )
        }},

    ]
}

const LayoutComponent = MeettingLabel;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        tag_list:state.course.tag_list,
        channels_list:state.course.channels_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
