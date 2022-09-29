import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { Table,Popconfirm,message,Pagination,Switch,Modal,Form,Card,Select ,Input,Button} from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload'
const {Option} = Select;
const {Search} = Input;

class MeettingPaper extends Component {
    state = {
            
        edit : true,
        view : true,
        visible: false,
        isView:false,
        loading:false,
        title:'添加试卷',

        status:0, 
        tag_id:'',
        tagName:'',
        ttype:0,

        keyword:'',
        paper_id:'',
        ctype: 25,

        importLoading:false,
        showImportPannel:false,
        

    };
    category_list = []
    category_obj = {}
    auth_paper_list = []
    page_total=0
    page_current=1
    page_size=10
    paper_ctype = 48
    cate_ctype = 25

	onRefuse = ()=>{
		message.info('当前管理员无此权限');
    }

    componentWillMount(){
        const {search} = this.props.history.location
        let page =0
        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page+1
        }
        this.getAuthPaper()
    }
    componentDidMount(){
        const {actions} = this.props
        actions.getAuthCate({ keyword:'', ctype:this.cate_ctype })
    }
    componentWillReceiveProps(n_props){
        const { user } = n_props
        if(_.indexOf(user.rule, '*') >= 0||_.indexOf(user.rule, 'label/view') >= 0){
            this.setState({
                view:true
            })
        }
        if(_.indexOf(user.rule, '*') >= 0||_.indexOf(user.rule, 'label/edit') >= 0){
            this.setState({
                edit:true
            })
        }
        if(n_props.auth_cate_list !==this.props.auth_cate_list){
            let category_obj = {}
           
            if(n_props.auth_cate_list.length !== 0){
                n_props.auth_cate_list.map(ele=>{
                    category_obj[ele.categoryId] = ele.categoryName
                })
                this.category_obj = category_obj
                this.category_list = n_props.auth_cate_list
            }
            
        }
        if(n_props.auth_paper_list !== this.props.auth_paper_list){
            this.auth_paper_list = n_props.auth_paper_list.data
            this.page_total=n_props.auth_paper_list.total
            this.page_current=n_props.auth_paper_list.page+1
            this.setState({loading:false})
        }
        
    }
    getAuthPaper = ()=>{
        this.setState({loading:true})
        const {actions} = this.props;
        const {paper_id,keyword} = this.state
        actions.getAuthPaper({
            ctype:this.paper_ctype,
            paper_id:paper_id,
            keyword:keyword,
            page:this.page_current-1,
            pageSize:this.page_size
        })
    }

    _onUpdate(paper_id,action){
        const {actions} = this.props
        actions.actionAuthPaper({
            paper_id,action,
            resolved:(data)=>{
                message.success("操作成功")
                this.getAuthPaper()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val)=>{
        this.page_current = 1
        this.setState({
            keyword:val
        },()=>{
            this.getAuthPaper()
        })
    }
     importTopic = ()=>{
        this.setState({importLoading:true})

        const {actions} = this.props
        const that = this
        const url = this.excelFile.getValue()

        if(this.category_id == 0){
            message.info('请选择题目分类')
            this.setState({importLoading:false})
            return
        }
        if(url == ''){
            message.info('请选择Excel文件')
            this.setState({importLoading:false})
            return
        }

        actions.importAuthPaperTopic({
            url,
            category_id:this.category_id,
            type:'paper',
            paper_id:0,
            ctype:this.paper_ctype,
            resolved:(data)=>{
                message.success('导入成功')
                that.category_id = 0
                this.getAuthPaper()
                that.setState({ importLoading:false,showImportPannel:false },()=>{

                    // let rejectedUser = []
                    // Object.keys(data.fail).map(ele=>{
                    //     rejectedUser.push(data.fail[ele])
                    // })

                    // if(rejectedUser.length>0){
                        
                    //     that.setState({
                    //         showResult:true,
                    //         rejectedUser:rejectedUser
                    //     })
                    // }
                })
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('导入失败 ，请参考Excel导入模版 '+data)
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
        const {importLoading} = this.state
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="试卷管理" style={{minHeight:'400px'}}>
                            
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />
                                </div>
                                <div>
                                <Input.Group compact>
                                    {/*<Button onClick={()=>{
                                        this.setState({
                                            showSetting:true
                                        })
                                    }}>设置</Button>*/}
                                    <Button onClick={()=>{
                                        this.props.history.push('/meetting/topic/paper/edit/0')
                                    }}>添加试卷</Button>
                                    <Button onClick={()=>{
                                        this.category_id = 0
                                        this.setState({showImportPannel:true,})}
                                    }>导入试卷</Button>
                                </Input.Group>
                                </div>
                            </div>
                            <div className="min_height">
                                <Table loading={this.state.loading} rowKey='paperId' columns={this.col} dataSource={this.auth_paper_list} pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper: true,
                                    onChange: (val) => {
                                        this.page_current = val
                                        this.getAuthPaper()
                                    },
                                    showTotal: (total) => '总共' + total + '条'
                                }}></Table>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title='设置'
                    visible={this.state.showSetting}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={()=>{
                        this.setState({
                            showSetting:false
                        })
                    }}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="题目总长">
                            <Input placeholder='填写后将不能修改' onChange={(e)=>{
                                
                            }}/>
                        </Form.Item>
                        <Form.Item label="答卷时长">
                            <Input placeholder='填写后将不能修改' onChange={(e)=>{
                                    
                            }}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title='导入'
                    visible={this.state.showImportPannel}
                    closable={true}
                    maskClosable={false}
                    okText='开始导入'
                    cancelText='取消'
                    onCancel={()=>{
                        this.setState({showImportPannel:false})
                    }}
                    destroyOnClose={true}
                    onOk={this.importTopic}
                    confirmLoading={importLoading}
                >
                    <Form labelCol={{span:6}} wrapperCol={{span:18}}>
                        <Form.Item label="选择题目分类">
                            <Select defaultValue={0} style={{width:200}} onChange={val=>{
                                this.category_id = val
                            }}>
                                <Select.Option value={0}>无</Select.Option>
                                {this.category_list.map(ele=>(
                                    <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="选择Excel文件">
                            <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' listType='text' ref={(ref)=>{ this.excelFile = ref }}></AntdOssUpload>
                        </Form.Item>
                        <Form.Item label="说明">
                            <div style={{color:"#8e8e8e",marginTop:'10px',lineHeight:'1.5'}}>
                                <p>
                                    * 导入前，请先下载Excel模板文件<br/>
                                    * 仅支持xlsx格式的文件
                                    &nbsp;&nbsp;&nbsp;
                                    <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1590563204861.xlsx'>
                                        Excel导入模板下载
                                    </a>
                                </p>
                                
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal width={800} onCancel={()=>{ this.setState({showTopicPannel:false}) }} visible={this.state.showTopicPannel} maskClosable={false} footer={null}>
                    <Table
                        columns={this.topic_column}
                        expandedRowRender={this.topicDetail}
                        dataSource={this.state.topic_list}
                        rowKey='topicId'
                    />
                </Modal>
            </div>
        )
    }
    topicDetail = (record)=>{
        return(
            <div>
                <div className='mb_10'>
                    <strong>{record.ttype == 3?'多选题':record.ttype==0?'单选题':'判断题'}：</strong>{record.title}
                </div>
                <div>
                {record.galleries.map(ele=>(
                    record.mtype==1?
                        <img src={ele.link} className='head-example-img' onClick={()=>{this.setState({ showImgPanel:true,previewImage:ele.link, })}}></img>:
                    record.mtype==2?
                        <video style={{height:'150px'}} src={ele.link} controls></video>:
                    record.mtype==3?
                        <audio src={ele.link} controls></audio>:''
                ))}
                </div>
                <div style={{display:'flex',flexWrap:'wrap',alignItems:'flex-start', lineHeight: 2,color: '#828282'}}>
                    {record.topicOptions.map((ele,index)=>(
                        <div key={'topicOptions'+ele.optionLabel+index} className={record.answerIds.indexOf(ele.optionId+'')>-1?'be_green':''} style={{width:'25%',padding:'5px',lineHeight: 1.5}}>
                            {String.fromCharCode(index+65)}.{ele.optionLabel}
                        </div>
                    ))}
                </div>
                <div className='mt_10'>
                    <strong>解析：</strong>{record.analysis}
                </div>
            </div>
    )}
    _onRemoveTopic(topic_id){
        const {actions} = this.props
        actions.actionAuthTopic({
            topic_id,
            resolved:(data)=>{
                message.success('提交成功')
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    col = [
        { title: 'ID', dataIndex: 'paperId', key: 'paperId' },
        { title: '试卷名称', dataIndex: 'paperName', key: 'paperName',ellipsis:true},
        { title: '分类', dataIndex: 'categoryId', key: 'categoryId', render:(item,ele)=>this.category_obj[ele.categoryId] },
        { title: '题目数量', dataIndex: 'num', key: 'num' },
        { title: '创建时间', dataIndex: 'pubTime', key: 'pubTime', render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm') },
        { title: '状态', dataIndex: 'status', key: 'status', render: (item, ele) => ele.status == 1 ? '已启用' : '未启用' },
        {
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    <Button className='m_2' type="primary" size={'small'} onClick={()=>{
                        this.setState({ showTopicPannel:true, topic_list:ele.topicList })
                    }}>查看题目</Button>
                    <Button className='m_2' type="primary" size={'small'} onClick={()=>{
                        this.props.history.push({
                            pathname:'/meetting/topic/paper/edit/'+ele.paperId,
                            state:{type:"view"}
                        })
                    }}>查看</Button>
                    <Button className='m_2' type="primary" size={'small'} onClick={()=>{
                        this.props.history.push({
                            pathname:'/meetting/topic/paper/edit/'+ele.paperId,
                            state:{type:"edit"}
                        })
                    }}>修改</Button>
                    <Button className='m_2' onClick={!this.state.edit?this.onRefuse:this._onUpdate.bind(this,ele.paperId,'status')} type={ele.status == 0?"primary":'danger'} ghost size={'small'}>{ele.status == 1?'禁用':'启用'}</Button>
                    <Popconfirm 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={!this.state.edit?this.onRefuse:!this.state.edit?this.onRefuse:this._onUpdate.bind(this,ele.paperId,'delete')}
                    >
                        <Button className='m_2' type="danger" ghost size={'small'}>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]
    topic_column = [
        { title: 'ID', dataIndex: 'topicId', key: 'topicId',width: 100 },
        { title: '题干', dataIndex: 'title', key: 'title', ellipsis:true},
        { title: '题目类型', dataIndex: 'ttype', key: 'ttype', render:(item,ele)=>ele.ttype == 3?'多选题':ele.ttype==0?'单选题':'判断题' },
        // {
        //     title: '操作',
        //     dataIndex: '',
        //     key: 'x',
        //     render: (item,ele) =>(
        //         <Popconfirm 
        //             okText="确定"
        //             cancelText='取消'
        //             title='确定删除吗？'
        //             onConfirm={this._onRemoveTopic.bind(this,ele.topicId)}
        //         >
        //             <Button className='m_2' size={'small'}>删除</Button>
        //         </Popconfirm>
        //     ),
        // },
    ]
}
const LayoutComponent =MeettingPaper;
const mapStateToProps = state => {
    return {
        auth_paper_list:state.auth.auth_paper_list,
        auth_cate_list:state.auth.auth_cate_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
