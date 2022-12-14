import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import {Form, Table, Modal,Card as CardAntd,Affix,Pagination, Tag,Menu, Dropdown, Icon, message,Input, InputNumber, Select} from 'antd';

importÂ connectComponentÂ fromÂ '../../util/connect';
import AntdOssUpload from '../../components/AntdOssUpload'
import {Button,Popconfirm} from '../../components/BtnComponent'
import _ from 'lodash'

const { Search } = Input;

class AuthTopic extends Component {

	state = {
		edit: true,
        view: true,
        category_id:0,
        paper_id:0,
        topic_id:0,
        keyword:'',
        importLoading:false,
        showImportPannel:false,
        keys:[],
    };
    
    path = '/auth/topic/edit/'
    page_total=0
    page_current=1
    page_size=10
    category_list = []
    auth_paper_list = []
    category_obj = {}

    cate_ctype = 96
    cate_keyword = ''
    paper_keyword = ''

    category_id = 0

	componentWillMount(){
        const {actions} = this.props;

        actions.getAuthCate({ keyword:this.cate_keyword, ctype:this.cate_ctype })
        this.getAuthPaper()
        this.getAuthTopic()
    }
	componentWillReceiveProps(n_props){
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
        actions.getAuthPaper({page:0, pageSize:10000, keyword: this.paper_keyword})
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
        const {paper_id,topic_id,category_id,keyword} = this.state

        console.log(category_id)
        actions.getAuthTopic({
            ctype:96,
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
            if(keys.length == 0){ message.info('è¯·åéæ©é¢ç®');return; }
            topic_id = keys.join(',')
        }

        this.props.actions.actionAuthTopic({
            topic_id,
            resolved:(data)=>{
                this.setState({keys:[]})
                message.success('æäº¤æå')
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
                    <strong>{record.ttype == 3?'å¤éé¢':record.ttype==0?'åéé¢':'å¤æ­é¢'}ï¼</strong>{record.title}
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
                    <strong>è§£æï¼</strong>{record.analysis}
                </div>
            </div>
    )}
    importTopic = ()=>{
        this.setState({importLoading:true})

        const {actions} = this.props
        const that = this
        const url = this.excelFile.getValue()

        if(this.category_id == 0){
            message.info('è¯·éæ©é¢ç®åç±»')
            this.setState({importLoading:false})
            return
        }
        if(url == ''){
            message.info('è¯·éæ©Excelæä»¶')
            this.setState({importLoading:false})
            return
        }

        actions.importAuthPaperTopic({
            url,
            category_id:this.category_id,
            type:'topic',
            resolved:(data)=>{
                message.success('å¯¼å¥æå')
                this.getAuthTopic()
                that.category_id = 0
                that.setState({ importLoading:false,showImportPannel:false },()=>{
                })
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('å¯¼å¥å¤±è´¥ ï¼è¯·åèExcelå¯¼å¥æ¨¡çï¼'+data)
            }
        })
    }
	render() {
        const {importLoading, edit, view, category_id, paper_id, topic_id, keyword} = this.state

		return (
		<div className="animated fadeIn">
			<Row>
                <Col xs="12">
                    <CardAntd title="ç»ä¹ é¢ç®ç®¡ç">
                    <div className='min_height'>
                        <div className="flex f_row j_space_between align_items mb_10">

                            <div className='flex f_row align_items'>
                                
                                <Select className='m_2' value={category_id} style={{width:200}} onChange={val=>{
                                    console.log(val)
                                    this.setState({ category_id:val })
                                }}>
                                    <Select.Option value={0}>å¨é¨ç±»å</Select.Option>
                                    {this.category_list.map(ele=>(
                                        <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                    ))}
                                </Select>
                                <Select value={paper_id} onChange={val=>{this.setState({paper_id:val})}} style={{ minWidth: '120px' }} className='m_2'>
                                    <Select.Option value={0}>å¨é¨è¯å·</Select.Option>
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
                                }} className='m_2'>æç´¢</Button>
                            </div>
                            <div>
                                <Button value='authTopic/add' className='m_2' onClick={()=>{
                                    this.props.history.push({
                                        pathname:this.path+'0',
                                        state:{type:"edit"}
                                    })
                                }}>åå¸é¢ç®</Button>
                                <Button value='authTopic/in' className='m_2' onClick={()=>{
                                    this.category_id = 0
                                    this.setState({showImportPannel:true,})}
                                }>å¯¼å¥é¢ç®</Button>
                            </div>
                        </div>
                        <div>
                            <Popconfirm
                                value='authTopic/del'
                                okText="ç¡®å®"
                                cancelText='åæ¶'
                                title='ç¡®å®å é¤åï¼'
                                onConfirm={this._onUpdate.bind(this,'all')}
                            >
                                <Button className='m_2' size={'small'}>å é¤</Button>
                            </Popconfirm>
                        </div>
                        <Table
                            columns={this.topic_column}
                            expandedRowRender={this.topicDetail}
                            rowSelection={{selectedRowKeys:this.state.keys,onChange:(value)=>{ 
                                console.log(value)
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
                                showTotal:(total)=>'æ»å±'+total+'æ¡'
                            }}
                        />
                    </div>
                    </CardAntd>
                </Col>
            </Row>
            <Modal zIndex={6001} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                this.setState({showImgPanel:false})
            }}>
                <img alt="é¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
            <Modal
                title='å¯¼å¥'
                visible={this.state.showImportPannel}
                closable={true}
                maskClosable={true}
                okText='å¼å§å¯¼å¥'
                cancelText='åæ¶'
                onCancel={()=>{
                    this.setState({showImportPannel:false})
                }}
                destroyOnClose={true}
                onOk={this.importTopic}
                confirmLoading={importLoading}
            >
                <Form labelCol={{span:6}} wrapperCol={{span:18}}>
                    <Form.Item label="éæ©é¢ç®åç±»">
                        <Select defaultValue={0} style={{width:200}} onChange={val=>{
                            this.category_id = val
                        }}>
                            <Select.Option value={0}>æ </Select.Option>
                            {this.category_list.map(ele=>(
                                <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="éæ©Excelæä»¶">
                        <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' listType='text' ref={(ref)=>{ this.excelFile = ref }}></AntdOssUpload>
                    </Form.Item>
                    <Form.Item label="è¯´æ">
                        <div style={{color:"#8e8e8e",marginTop:'10px',lineHeight:'1.5'}}>
                            <p>
                                * å¯¼å¥åï¼è¯·åä¸è½½Excelæ¨¡æ¿æä»¶<br/>
                                * ä»æ¯æxlsxæ ¼å¼çæä»¶
                                &nbsp;&nbsp;&nbsp;
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1590563204861.xlsx'>
                                    Excelå¯¼å¥æ¨¡æ¿ä¸è½½
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
        { title: 'é¢å¹²', dataIndex: 'title', key: 'title', ellipsis:true},
        { title: 'é¢ç®ç±»å', dataIndex: 'ttype', key: 'ttype', render:(item,ele)=>ele.ttype == 3?'å¤éé¢':ele.ttype==0?'åéé¢':'å¤æ­é¢' },
        { title: 'ç»ä¹ é¢åç±»', dataIndex: 'categoryName', key: 'categoryName', ellipsis:false},
        { 
            title: 'è¯å·åç§°', dataIndex: 'paperIdAndName', key: 'paperIdAndName', ellipsis:false, 
            render:(record,item)=>item.paperIdAndName.map(ele=>(
                <Tag key={ele[0]}>{ele[1]}</Tag>
            ))
        },
        {
            title: 'æä½',
            dataIndex: '',
            key: 'x',
            render: (item,ele) =>(
                <>
                <Button value='authTopic/edit' onClick={()=>{
                    this.props.history.push({
                        pathname:this.path+ele.topicId,
                        state:{type:"edit"}
                    })
                }}  type="primary" size={'small'} className='m_2'>ä¿®æ¹</Button>
                <Popconfirm
                    value='authTopic/del'
                    okText="ç¡®å®"
                    cancelText='åæ¶'
                    title='ç¡®å®å é¤åï¼'
                    onConfirm={this._onUpdate.bind(this,ele.topicId)}
                >
                    <Button className='m_2' size={'small'}>å é¤</Button>
                </Popconfirm>
                </>
            ),
        },
    ]
}

constÂ LayoutComponentÂ = AuthTopic;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        user:state.site.user,
        auth_topic_list:state.auth.auth_topic_list,
        auth_cate_list:state.auth.auth_cate_list,
        auth_paper_list:state.auth.auth_paper_list,
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
