import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Table as AntdTable, Empty,PageHeader,Switch,Modal,Form,Card,Select ,Input, message} from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Search} = Input;

class Feedback extends Component {
    state = {
        edit : true,
        view : true,

        visible: false,
        ctype:'',
		cctype:'',
		category_id:0,
		category_name:'',
		sort_order:'',
        status:'',
        keyword:'',
        summary:'',
        iconList:[],
        question_status:0,
        lists:[],
    };
    feed_cate_list = []
    page_size = 10
    page_current = 0
    page_total = 0
    cate_ctype = 31

    componentDidMount(){
        this.getFeedCate()
        this.getFeedCatelist()
    }

	componentWillReceiveProps(n_props) {
		if (n_props.feed_cate_list !== this.props.feed_cate_list) {
            this.feed_cate_list = n_props.feed_cate_list.data
            this.page_current = n_props.feed_cate_list.page
            this.page_total = n_props.feed_cate_list.total
		}
    }
    getFeedCate = ()=>{
        const {keyword} = this.state
        this.props.actions.getFeedCate({
            keyword: keyword,
            ctype: this.cate_ctype,
            pageSize: this.page_size,
            page: this.page_current,
        })
    }
    getFeedCatelist=()=>{
        this.props.actions.getFeedCates({
            resolved:(res)=>{
                let list = res.filter(item=>item.status==1)
                this.setState({
                    lists:list
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    _onPublish = ()=>{
        const {
            category_name,
            summary,
            category_id,
            status,
        } = this.state
        const {actions} = this.props

        let link = ''
        if(this.img){
            link = this.img.getValue()
        }
        if(!category_name){
            message.info('请输入分类标题')
            return
        }
        if(!summary){
            message.info('请输入副标题')
            return
        }
        actions.publishFeedCate({
            ctype:this.cate_ctype,
            category_id,
            category_name,
            link,
            summary,
            status,
            resolved:(data)=>{
                message.success("提交成功")
                this.getFeedCate()
                this.getFeedCatelist()
                this.setState({ visible:false })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })

    }
    _onStatus(id){
        const {actions} = this.props

        actions.updateFeedCate({
            category_id:id,action:'status',
            resolved:(data)=>{
                message.success("操作成功")
                this.getFeedCate()
                this.getFeedCatelist()
                this.setState({
                    visible: false,
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val)=>{
        this.setState({keyword:val},()=>{
            this.getFeedCate()
            this.getFeedCatelist()
        })
        
    }
    _onAdd = ()=>{
        const {
            category_id,title,content,question_status:status
        } = this.state
        const help_id = 0

        if(!category_id){ message.info('请选择分类'); return false }
        if(!title){ message.info('请输入问题'); return false }
        if(!content){ message.info('请输入答案'); return false }

        this.props.actions.setHelp({
            help_id,category_id,title,content,status,
            resolved:(data)=>{
                message.success("提交成功")
                this.setState({ addPanel:false })
                this.getFeedCate()
                this.getFeedCatelist()
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    _onDelete(id){
        const {actions} = this.props

        actions.updateFeedCate({
            category_id:id,action:'delete',
            resolved:(data)=>{
                message.success("操作成功")
                this.getFeedCate()
                this.getFeedCatelist()
            },
            rejected:(data)=>{
                message.error(data)
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
        const {keyword} = this.state
        return(
            <div className="animated fadeIn">
                <Card title='帮助反馈管理' style={{ minHeight: '400px' }} extra={
                    <>
                        <Button value='feedlist/add' className='m_2' onClick={()=>{
                            this.setState({ 
                                title:'',
                                content:'',
                                category_id:'',
                                question_status:0,
                                addPanel:true
                            })
                        }}>添加问题</Button>
                        <Button value='feedlist/addCate' className='m_2' onClick={()=>{
                            this.setState({ 
                                category_name:'',
                                summary:'',
                                iconList:[],
                                visible:true
                            })
                        }}>添加分类</Button>
                    </>
                }>
                    {/* <Select value={this.state.category_id} onChange={val=>{this.setState({category_id:val})}} className='m_2'>
                        <Select.Option value={''}>全部类型</Select.Option>
                        {
                            this.feed_cate_list.map((ele,index)=>(
                                <Select.Option value={ele.categoryId}>{ele.categoryName}</Select.Option>
                            ))
                        }
                    </Select> */}
                    <Search
                        placeholder="关键词"
                        onSearch={this._onSearch}
                        style={{ maxWidth: 200 }}
                        value={keyword}
                        onChange={(e) => {
                            this.setState({ keyword: e.currentTarget.value })
                        }}
                        className='m_2'
                    />
                    <AntdTable rowKey='categoryId' expandIcon={() => null} columns={ this.col } dataSource={this.feed_cate_list||[]}  pagination={{
                        current: this.page_current+1,
                        pageSize: this.page_size,
                        total: this.page_total,
                        showQuickJumper:true,
                        onChange: (val)=>{
                            this.page_current = val-1
                            this.getFeedCate()
                        },
                        showTotal:(total)=>'总共'+total+'条'
                    }}/>
                </Card>
                <Modal
                    title={this.state.category_id==0?"添加分类":"修改分类"}
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={()=>{ this.setState({ visible:false }) }}
                    onOk={this._onPublish}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="分类标题">
                            <Input 
                                value={this.state.category_name} 
                                placeholder="分类标题"
                                onChange={e=>{
                                    this.setState({
                                        category_name:e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="副标题">
                            <Input 
                                value={this.state.summary} 
                                placeholder="副标题"
                                onChange={e=>{
                                    this.setState({
                                        summary:e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="图标" help='62px * 60px'>
                            <AntdOssUpload
                                actions={this.props.actions}
                                actions={this.props.actions}
                                listType='picture-card'
                                accept='image/*'
                                ref={ref=>this.img = ref}
                                value={this.state.iconList}
                            ></AntdOssUpload>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="添加问题"
                    visible={this.state.addPanel}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={()=>{
                        this.setState({ addPanel:false })
                    }}
                    onOk={this._onAdd}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="选择分类">
                            <Select value={this.state.category_id} onChange={val=>{this.setState({category_id:val})}}>
                                <Select.Option value={''}>无</Select.Option>
                                {
                                    this.state.lists.map((ele,index)=>{
                                        if(ele.status==1){
                                            return(
                                                <Select.Option value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                            )
                                        }
                                       
                                    })
                                }
                            </Select>
                        </Form.Item>
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
                            <SwitchCom value={this.state.question_status} onChange={(question_status)=>{
                                this.setState({question_status})
                            }}></SwitchCom>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex:'categoryId',title:'ID',key:'categoryId' },
        { dataIndex:'categoryName',title:'分类标题',key:'categoryName' },
        { dataIndex:'summary',title:'分类副标题',key:'summary' },
        { dataIndex:'pubTime',title:'发布时间',key:'pubTime',render:(item,ele)=>(
            ele.pubTime?moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm'):''
        )},
        { dataIndex:'courseNum',title:'问题数',key:'courseNum' },
        
        { dataIndex:'',title:'操作',key:'',render:(item,ele,index)=>(
            <div>
                <Button value='feedlist/status' onClick={this._onStatus.bind(this,ele.categoryId)} type={ele.status==1?'primary':''} size={'small'} className='m_2'>{ele.status==1?'禁用':'启用'}</Button>
                <Button value='feedlist/edit' size={'small'} className='m_2' onClick={()=>{
                    const iconList = [{ url:ele.link,type:'image/png',status:'done',uid:Date.now() }]
                    this.setState({
                        category_id:ele.categoryId,
                        category_name:ele.categoryName,
                        summary:ele.summary,
                        status:ele.status,
                        visible:true,
                    },()=>{
                        this.setState({ iconList })
                    })
                }}>修改</Button>
                <Button value='feedlist/question' size={'small'} className='m_2' onClick={()=>{
                    this.props.history.push('/web-manager/feedback/listView/'+ele.categoryId)
                }}>查看问题</Button>
                <Button value='feedlist/edit' size={'small'} className='m_2' onClick={()=>{
                    this.props.history.push('/web-manager/feedback/listEdit/'+ele.categoryId)
                }}>修改问题</Button>
                <Popconfirm
                    value='feedlist/del'
                    okText="确定"
                    cancelText="取消"
                    title="确定删除吗？"
                    onConfirm={this._onDelete.bind(this,ele.categoryId)}
                >
                    <Button type="danger" ghost size={'small'} className='m_2'>删除</Button>
                </Popconfirm>
            </div>
        )},
    ]
}

const LayoutComponent = Feedback;
const mapStateToProps = state => {
    return {
        feed_cate_list:state.dashboard.feed_cate_list,
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});