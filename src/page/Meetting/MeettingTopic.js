import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import {Form, Table, Popconfirm, Modal,Card as CardAntd,Affix,Pagination, Tag,Menu, Dropdown, Button, Icon, message,Input, InputNumber, Select} from 'antd';

import connectComponent from '../../util/connect';
import AntdOssUpload from '../../components/AntdOssUpload'

import _ from 'lodash'

const { Search } = Input;

class MeettingTopic extends Component {

	state = {
		edit: true,
        view: true,
        category_id:0,
        paper_id:0,
        topic_id:0,
        keyword:'',
        importLoading:false,
        showImportPannel:false,
        topic_ctype:25,
        keys:[],

    };
    
    path = '/meetting/topic/edit/'
    page_total=0
    page_current=1
    page_size=10
    category_list = []
    auth_paper_list = []
    category_obj = {}

    cate_ctype = 25
    topic_ctype = 25
    paper_ctype = 26
    cate_keyword = ''
    paper_keyword = ''

    category_id = 0

	onRefuse = ()=>{
		message.info('当前管理员无此权限');
    }
	componentWillMount(){
        const {actions} = this.props;

        actions.getAuthCate({ keyword:this.cate_keyword, ctype:this.cate_ctype })
        this.getAuthPaper()
        this.getAuthTopic()
    }
	componentWillReceiveProps(n_props){
		const { user } = n_props
		if(_.indexOf(user.rule, '*') >= 0||_.indexOf(user.rule, 'bandfilter/view') >= 0){
			this.setState({view:true})
		}
		if(_.indexOf(user.rule, '*') >= 0||_.indexOf(user.rule, 'bandfilter/edit') >= 0){
			this.setState({edit:true})
		}
        if(n_props.auth_topic_list !== this.props.auth_topic_list){
            console.log(n_props.auth_topic_list)
            this.auth_topic_list = n_props.auth_topic_list.data
            this.page_current = n_props.auth_topic_list.page+1
            this.page_total = n_props.auth_topic_list.total
        }
        if(n_props.auth_paper_list !== this.props.auth_paper_list){
            this.auth_paper_list = n_props.auth_paper_list.data
            console.log(n_props.auth_paper_list)
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
    }
    getAuthPaper = ()=>{
        const {actions} = this.props;
        actions.getAuthPaper({ ctype:this.paper_ctype, page:0, pageSize:1000000, keyword: this.paper_keyword})
    }
    _onSearch = (val)=>{
        this.page_current = 1
        this.setState({
            keyword:val
        },()=>{
            this.getAuthTopic()
        })
    }
    getAuthTopic = ()=>{
        const {actions} = this.props
        const {topic_ctype,paper_id,topic_id,category_id,keyword} = this.state

        console.log(category_id)
        actions.getAuthTopic({
            ctype: topic_ctype,
            paper_id,
            topic_id,
            category_id,
            keyword,
            page: this.page_current-1,
            pageSize: this.page_size
        })
    }
    _onPage = (val)=>{
        this.page_current = val
        this.getAuthTopic()
    }
    _onUpdate(topic_id){
        if(topic_id==='all'){
            const {keys} = this.state
            if(keys.length == 0){ message.info('请先选择题目');return; }
            topic_id = keys.join(',')
        }
        this.props.actions.actionAuthTopic({
            topic_id,
            resolved:(data)=>{
                this.setState({keys:[]})
                message.success('提交成功')
                this.getAuthTopic()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
        
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
                        <div key={ele.optionLabel+Math.random()} className={record.answerIds.indexOf(ele.optionId+'')>-1?'be_green':''} style={{width:'25%',padding:'5px',lineHeight: 1.5}}>
                            {String.fromCharCode(index+65)}.{ele.optionLabel}
                        </div>
                    ))}
                </div>
                <div className='mt_10'>
                    <strong>解析：</strong>{record.analysis}
                </div>
            </div>
    )}
    importTopic = ()=>{
        this.setState({importLoading:true})

        const {actions} = this.props
        const that = this
        const url = this.excelFile.getValue()

        // if(this.category_id == 0){
        //     message.info('请选择题目分类')
        //     this.setState({importLoading:false})
        //     return
        // }
        if(url == ''){
            message.info('请选择Excel文件')
            this.setState({importLoading:false})
            return
        }

        actions.importAuthPaperTopic({
            url,
            category_id:'',
            type:'topic',
            ctype:this.topic_ctype,
            resolved:(data)=>{
                message.success('导入成功')
                this.getAuthTopic()
                that.category_id = 0
                that.setState({ importLoading:false,showImportPannel:false },()=>{
                })
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('导入失败 ，请参考Excel导入模版，'+data)
            }
        })
    }
	render() {
        const {importLoading, edit, view, category_id, paper_id, topic_id, keyword} = this.state

		return (
		<div className="animated fadeIn">
			<Row>
                <Col xs="12">
                    <CardAntd title="题库管理">
                    <div className='min_height'>
                        <div className="flex f_row j_space_between align_items mb_10">

                            <div className='flex f_row align_items'>
                                
                                <Select className='m_2' defaultValue={0} style={{width:200}} onChange={val=>{
                                    console.log(val)
                                }}>
                                    <Select.Option value={0}>全部类型</Select.Option>
                                    <Select.Option value={1}>健康</Select.Option>
                                    <Select.Option value={2}>文化</Select.Option>
                                </Select>
                                <Select value={paper_id} onChange={val=>{
                                    let topic_ctype = 25
                                    if(val !== 0){
                                        topic_ctype = 26
                                    }
                                    console.log(topic_ctype)
                                    this.setState({topic_ctype:topic_ctype,paper_id:val})
                                }} style={{ minWidth: '120px' }} className='m_2'>
                                    <Select.Option value={0}>全部试卷</Select.Option>
                                    {this.auth_paper_list.map(item => (
                                        <Select.Option key={item.paperId} value={item.paperId}>{item.paperName}</Select.Option>
                                    ))}
                                </Select>
                                <Search
                                    placeholder=''
                                    onSearch={this._onSearch}
                                    onChange={e=>{
                                        this.setState({ keyword:e.target.value })
                                    }}
                                    value={keyword}
                                    style={{ maxWidth: 200 }}
                                    className='m_2'
                                />
                                <Button onClick={()=>{
                                    this.page_current = 1
                                    this.getAuthTopic()
                                }} className='m_2'>搜素</Button>
                            </div>
                            <div>
                                <Button className='m_2' onClick={!edit?this.onRefuse:()=>{
                                    this.props.history.push({
                                        pathname:this.path+'0',
                                        state:{type:"edit"}
                                    })
                                }}>发布题目</Button>
                                <Button className='m_2' onClick={()=>{
                                    this.category_id = 0
                                    this.setState({showImportPannel:true,})}
                                }>导入题目</Button>
                            </div>
                        </div>
                        <div>
                            <Popconfirm 
                                okText="确定"
                                cancelText='取消'
                                title='确定删除吗？'
                                onConfirm={this._onUpdate.bind(this,'all')}
                            >
                                <Button className='m_2' size={'small'}>删除</Button>
                            </Popconfirm>
                        </div>
                        <Table
                            columns={this.topic_column}
                            expandedRowRender={this.topicDetail}
                            rowSelection={{selectedRowKeys:this.state.keys,onChange:(value)=>{ 
                                this.setState({ keys:value }) 
                            }}}
                            rowKey='topicId'
                            dataSource={this.auth_topic_list}
                            pagination={{
                                position: 'bottom',
                                current: this.page_current,
                                pageSize: this.page_size,
                                total: this.page_total,
                                showQuickJumper:true,
                                onChange: this._onPage,
                                showTotal:(total)=>'总共'+total+'条'
                            }}
                        />
                    </div>
                    </CardAntd>
                </Col>
            </Row>
            <Modal zIndex={6001} visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={()=>{
                this.setState({showImgPanel:false})
            }}>
                <img alt="预览" style={{ width: '100%' }} src={this.state.previewImage} />
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
                    {/* <Form.Item label="选择题目分类">
                        <Select defaultValue={0} style={{width:200}} onChange={val=>{
                            this.category_id = val
                        }}>
                            <Select.Option value={0}>无</Select.Option>
                            {this.category_list.map(ele=>(
                                <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item> */}
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
		</div>
		);
    }
    topic_column = [
        { title: 'ID', dataIndex: 'topicId', key: 'topicId',width:180 },
        { title: '题干', dataIndex: 'title', key: 'title', ellipsis:true},
        { title: '题目类型', dataIndex: 'ttype', key: 'ttype', render:(item,ele)=>ele.ttype == 3?'多选题':ele.ttype==0?'单选题':'判断题' },
        { title: '题目分类', dataIndex: 'categoryName', key: 'categoryName', ellipsis:false},
        { 
            title: '试卷名称', dataIndex: 'paperIdAndName', key: 'paperIdAndName', ellipsis:false, 
            render:(record,item)=>item.paperIdAndName.map(ele=>(
                <Tag key={ele[0]}>{ele[1]}</Tag>
            ))
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (item,ele) =>(
                <>
                <Button onClick={()=>{
                    this.props.history.push({
                        pathname:this.path+ele.topicId,
                        state:{type:"edit"}
                    })
                }}  type="primary" size={'small'} className='m_2'>修改</Button>
                <Popconfirm 
                    okText="确定"
                    cancelText='取消'
                    title='确定删除吗？'
                    onConfirm={this._onUpdate.bind(this,ele.topicId)}
                >
                    <Button className='m_2' size={'small'}>删除</Button>
                </Popconfirm>
                </>
            ),
        },
    ]
}

const LayoutComponent = MeettingTopic;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        auth_topic_list:state.auth.auth_topic_list,
        auth_cate_list:state.auth.auth_cate_list,
        auth_paper_list:state.auth.auth_paper_list,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
