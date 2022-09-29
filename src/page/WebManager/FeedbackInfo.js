import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Table as AntdTable, Empty,PageHeader,Switch,Modal,Form,Card,Select ,Input, message} from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import SwitchCom from '../../components/SwitchCom';
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Search} = Input;

class FeedbackInfo extends Component {
    state = {
        edit : true,
        view : true,

        visible: false,
        ctype:'',
		cctype:'',
		category_id:'',
		category_name:'',
		sort_order:'',
        status:'',
        keyword:'',

        title:'',
        status:0,
        help_id:0,
        category_id:0,
        content:'',
        help:[],
        page_size: 10,
        page_current: 0,
        view_mode:false,
    }
    feed_cate_list = []
    cate_ctype = 31

    componentWillMount(){
        const {id} = this.props.match.params
        if(this.props.match.path == '/web-manager/feedback/listView/:id'){
            this.setState({view_mode:true})
        }
        this.setState({ category_id:parseInt(id) },()=>{
            this.getHelp()
        })
    }
    componentDidMount(){
        const {actions} = this.props
        actions.getFeedCate({
            ctype:this.cate_ctype,
            pageSize:40000
        })
    }
	componentWillReceiveProps(n_props) {
    
		if (n_props.feed_cate_list !== this.props.feed_cate_list) {
            this.feed_cate_list = n_props.feed_cate_list.data
            console.log(this.feed_cate_list)
		}
    }
    getHelp = ()=>{
        this.props.actions.getHelp({
            category_id:this.state.category_id,
            keyword:this.state.keyword,
            page:this.state.page_current,
            pageSize:this.state.page_size,
            resolved:(data)=>{
                console.log(data)
                if(data.data instanceof Array){
                    this.setState({
                        help:data.data||[],
                        page_current:data.page,
                        page_total:data.total,
                    })
                }
                
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    _onPublish = ()=>{
        const {
            help_id,category_id,title,content,status
        } = this.state

        if(!title){ message.info('请输入问题'); return false }
        if(!content){ message.info('请输入答案'); return false }

        this.props.actions.setHelp({
            help_id,category_id,title,content,status,
            resolved:(data)=>{
                message.success("提交成功")
                this.setState({ visible:false })
                this.getHelp()
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    actionHelp(help_id,action){
        const {actions} = this.props
        actions.actionHelp({
            help_id,action,
            resolved:(data)=>{
                message.success("提交成功")
                this.getHelp()
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    
    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const {keyword,view_mode} = this.state
        return(
            <div className="animated fadeIn">
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    subTitle={view_mode?'查看问题':'修改问题'}
                    extra={view_mode?null:<Button value='feedlist/add' onClick={()=>{ this.setState({visible:true,title:'',content:'',help_id:0}) }}>添加问题</Button>}
                >
                <Card style={{ minHeight: '400px' }} bodyStyle={{padding:"10px"}}>
                    <Select disabled value={this.state.category_id} onChange={val=>{this.setState({category_id:val})}} className='m_2'>
                        {
                            this.feed_cate_list.map((ele,index)=>(
                                <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                            ))
                        }
                    </Select>
                    <AntdTable rowKey='helpId' expandIcon={() => null} columns={ this.col } dataSource={this.state.help||[]}  pagination={{
                        current: this.state.page_current+1,
                        pageSize: this.state.page_size,
                        total: this.state.page_total,
                        showQuickJumper:true,
                        onChange: (val)=>{
                            this.setState({ page_current:val-1 },()=>{
                                this.getHelp()
                            })
                        },
                        showTotal:(total)=>'总共'+total+'条'
                    }}/>
                </Card>
                </PageHeader>
                <Modal
                    title={this.state.help_id==0?"添加问题":"修改问题"}
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={()=>{
                        this.setState({ visible:false })
                    }}
                    onOk={this._onPublish}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="问">
                            <Input.TextArea
                                autoSize={{minRows:2}}
                                value={this.state.title} 
                                placeholder="输入问题"
                                onChange={e=>{
                                    this.setState({
                                        title:e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="答">
                            <Input.TextArea
                                autoSize={{minRows:2}}
                                value={this.state.content} 
                                placeholder="输入答案"
                                onChange={e=>{
                                    this.setState({
                                        content:e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="是否启用">
                            <SwitchCom value={this.state.status} onChange={(status)=>{
                                this.setState({status})
                            }}></SwitchCom>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex:'helpId',title:'ID',key:'helpId' },
        { dataIndex:'title',title:'问题',key:'title' },
        { dataIndex:'content',width:488,title:'答案',key:'content' },
        { dataIndex:'pubTime',title:'添加时间',key:'pubTime',render:(item,ele)=>(
            moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        )},
        { dataIndex:'status',title:'是否启用',key:'status',render:(item,ele)=>ele.status==1?'已启用':'已禁用' },
        { dataIndex:'',title:'操作',key:'',render:(ele,index)=>this.state.view_mode?null:(
            <div>
                <Button value='feedlist/status' onClick={this.actionHelp.bind(this,ele.helpId,'status')} type={ele.status==1?'primary':''} size={'small'} className='m_2'>{ele.status==1?'禁用':'启用'}</Button>
                <Button value='feedlist/edit' size={'small'} className='m_2' onClick={()=>{
                    this.setState({ 
                        help_id: parseInt(ele.helpId),
                        status:  ele.status,
                        title:   ele.title,
                        content: ele.content,
                        visible: true
                    })
                }}>修改</Button>
                <Popconfirm
                    value='feedlist/del'
                    okText="确定"
                    cancelText="取消"
                    title="确定删除吗？"
                    onConfirm={this.actionHelp.bind(this,ele.helpId,'delete')}
                >
                    <Button type="danger" ghost size={'small'} className='m_2'>删除</Button>
                </Popconfirm>
            </div>
        )},
    ]
}

const LayoutComponent = FeedbackInfo;
const mapStateToProps = state => {
    return {
        feed_cate_list:state.dashboard.feed_cate_list,
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});