import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { Table, List,Checkbox,DatePicker,Radio,Icon,Upload,PageHeader,Modal,Form,Card,Select ,Input,Button,message, InputNumber, Switch} from 'antd';
import AntdOssUpload from '../../../components/AntdOssUpload'
importÂ connectComponentÂ fromÂ '../../../util/connect';
import TopicBox from '../../../components/TopicBox'

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

class AuthPaperEdit extends Component {
    state = {
        fileList:[],
        excelFile:[],
        previewVisible:false,
        previewImage: '',

        dataSource:[
            {   
                label:'A',
                value:0,
                title: '',
            }
        ],

        topic_name:0,
        content:'',
        radio:0,
        checkbox:[0],
        topic_type:0,
        topic_display:0,
        edit_index:0,
        edit_value:'',
        OptionList:[],
        QuetionList:[[]],
        ttype:0,
        activeType:0,
        showQuestionPanel:false,
        showAddPanel:false,

        view_mode:false,
        paperType:0,

        paper_id:'0',
        ptype:0,
        paper_name:'',
        teacher_id:'',
        course_id:'',
        chapter_id:'',
        cchapter_id:'',
        num:'',
        examed:0,
        total:0,
        score:100,
        duration:'',
        status:0,
        category_id:0,
        topic_ids:[],
        importLoading:false,
        loading:false,

        topiclist:[],
        percentage:0,

    }
    topicBox = null
    excelFile = null
    category_list = []
    auth_paper_list = []
    topic_ctype = 96
    keyword = ''

    
    page_total=0
    page_current=1
	page_size=0

    componentWillMount(){
        const {actions} = this.props
        const paper_id = this.props.match.params.id+''
        let _state = this.props.location.state

        if( typeof _state === 'undefined'){
            _state = { type:'' }
        }else if(_state.type === 'view'){
            this.setState({ view_mode:true })
        }
        
        if(paper_id !== '0'){
            actions.getAuthPaper({paper_id:paper_id,pageSize:0})
            this.setState({ paper_id })
        }
        this.getAuthTopic()
        actions.getAuthCate({ keyword:this.keyword, ctype:this.topic_ctype })
        
    }
    componentWillReceiveProps(n_props){
        if(n_props.auth_cate_list !==this.props.auth_cate_list){
            if(n_props.auth_cate_list.length !== 0){
                this.category_list = n_props.auth_cate_list
            }
        }
        if(n_props.auth_topic_list !== this.props.auth_topic_list){
			
			this.setState({ topiclist:n_props.auth_topic_list.data })
        }
        if(n_props.auth_paper_list !== this.props.auth_paper_list){
            this.auth_paper_info = n_props.auth_paper_list.data[0]
            console.log(this.auth_paper_info)
            let {
                paperId:paper_id,
                ptype,
                paperName:paper_name,
                teacherId:teacher_id,
                courseId:course_id,
                chapterId:chapter_id,
                cchapterId:cchapter_id,
                num:num,
                examed:examed,
                total:total,
                score:score,
                duration:duration,
                status:status,
                categoryId:category_id,
                percentage,
            } = this.auth_paper_info
            this.setState({
                percentage,
                paper_id,
                ptype,
                paper_name,
                teacher_id,
                course_id,
                chapter_id,
                cchapter_id,
                examed,
                total,
                score,
                duration,
                status,
                category_id,
            })

        }
    }
    getAuthTopic = ()=>{
        const {actions} = this.props
        actions.getAuthTopic({
            ctype: this.topic_ctype,
            paper_id:0,
            topic_id:0,
            category_id:0,
            keyword:"",
            page: 0,
            pageSize: 0
        })
    }
    importTopic = ()=>{
        this.setState({importLoading:true})

        const {actions} = this.props
        const that = this
        const url = this.excelFile.getValue()
        
        if(this.state.category_id == 0){
            message.info('è¯·éæ©åç±»')
            this.setState({importLoading:false})
            return
        }
       

        actions.importAuthPaperTopic({
            url,
            category_id:this.state.category_id,
            type:'paper',
            paper_id:this.paper_id,
            ctype:0,
            resolved:(data)=>{
                message.success({
                    content:'æäº¤æå',
                    onClose:()=>{
                        window.history.back()
                    }
                })
                that.setState({ importLoading:false })
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('å¯¼å¥å¤±è´¥ ï¼è¯·åèExcelå¯¼å¥æ¨¡ç '+data)
            }
        })
    }
    _onPublish = ()=>{
        if(!this.onPublish()){
            this.setState({loading:false})
        }
    }
    onPublish =()=>{
        this.setState({loading:true})
        const {
            paper_id,
            paper_name,
            teacher_id,
            course_id,
            chapter_id,
            cchapter_id,
            num,
            examed,
            total,
            score,
            duration,
            status,
            category_id,
            
            paperType,
            percentage,
        } = this.state
        const that = this
        const {actions} = this.props
        let topic_ids = []
        let excelUrl = ''
        console.log(this.refs)
        if(paperType==0&&that.excelFile!==null)
            excelUrl = that.excelFile.getValue()
        if(paperType==2){
            topic_ids = this.refs.topicbox.getValue()
        }

        if(!paper_name){ message.info('è¯·è¾å¥è¯å·åç§°'); return false;}
        if(category_id == 0){ message.info('è¯·éæ©è¯å·åç±»'); return false;}
        if(!duration||duration==''){ message.info('è¯·è®¾ç½®ç­å·æ¶é¿'); return false;}
        if(isNaN(duration)){
            message.info('è¯·è¾å¥æ­£ç¡®çç­å·æ¶é¿ï¼æ¶é¿åæ´æ°');return false;
        }
        if(isNaN(score)){
            message.info('è¯·è¾å¥æ­£ç¡®çæ»åï¼æ»ååæ´æ°');return false;
        }
        if(paperType==2&&topic_ids.length == 0){
            message.info('è¯·éæ©é¢ç®');return false;
        }
        if(duration>2*60*60*1000){
            message.info('ç­å·æ¶é¿ä¸è½è¶è¿2ä¸ªå°æ¶');return false;
        }
        if(paperType==1&&num==''){ message.info('è¯·è®¾ç½®è¯é¢æ°'); return false; }
        // if(percentage==''){ message.info('è¯·è®¾ç½®åæ ¼ç¾åæ¯'); return false; }
        // if(isNaN(percentage)){ message.info('è¯·è®¾ç½®æ­£ç¡®çåæ ¼ç¾åæ¯'); return false; }
        // if(percentage>100){ message.info('åæ ¼ç¾åæ¯ä¸è½è¶è¿ 100'); return false; }
        // if(percentage%1 != 0){ message.info('åæ ¼ç¾åæ¯è¯·åæ´æ°'); return false; }

        actions.publishAuthPaper({
            paper_id,
            ptype: paperType,
            paper_name,
            teacher_id,
            course_id,
            chapter_id,
            cchapter_id,
            num,
            examed,
            total,
            score,
            duration,
            status,
            category_id,
            design:paperType,
            topic_ids:topic_ids.join(','),
            percentage,
            resolved:(data)=>{

                this.paper_id = data.paperId
                
                if(excelUrl == ''){
                    message.success({
                        content:'æäº¤æå',
                        onClose:()=>{
                            window.history.back()
                        }
                    })
                }else{
                    that.importTopic()
                }
            },
            rejected:(data)=>{
                this.setState({loading:false})
                message.error(data)
            }
        })

    }

    _onOK = ()=>{
        console.log(this.topicBox)
        console.log(this.refs)
        // let topic_ids = this.refs.topicBox.getValue()
        // this.setState({topic_ids})
    }
    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 18 },
            },
        }
        const {view_mode,importLoading,loading} = this.state
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={this.state.paper_id=='0'?"æ·»å è¯å·":this.state.view_mode?'æ¥ç':'ä¿®æ¹è¯å·'}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="è¯å·åç§°">
                                            <Input 
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({paper_name:e.target.value})
                                                }}
                                                className="m_w400" 
                                                placeholder=""
                                                value={this.state.paper_name}
                                            />
                                        </Form.Item>
                                        <Form.Item label="éæ©åç±»">
                                            <Select value={this.state.category_id} disabled={view_mode} className='m_w400' onChange={val=>{
                                                this.setState({ category_id:val })
                                            }}>
                                                <Select.Option value={0}>æ </Select.Option>
                                                {this.category_list.map(ele=>(
                                                    <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="ç¶æ">
                                            <Switch disabled={view_mode} onChange={e=>this.setState({ status:e?1:0 })} checked={this.state.status==1?true:false}></Switch>
                                        </Form.Item>
                                        <Form.Item label="æ»å">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({score:e.target.value})
                                                }}
                                                className="m_w400" 
                                                value={this.state.score}
                                            />
                                        </Form.Item>
                                        <Form.Item label="è¯å·è®¾è®¡">
                                            <Radio.Group 
                                                disabled={view_mode}
                                                defaultValue={0}
                                                onChange={e=>{
                                                    this.setState({
                                                        paperType:e.target.value
                                                    })
                                                }}
                                            >
                                                <Radio value={0}>åºå®è¯å·å¯¼å¥</Radio>
                                                <Radio value={1}>éæºè¯å·</Radio>
                                                <Radio value={2}>æ½é¢è¯å·</Radio>
                                            </Radio.Group>
                                            {this.state.paperType == 0?
                                                <div>
                                                    <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' value={this.state.excelFile} disabled={view_mode} listType='text' ref={(ref)=>{ this.excelFile = ref }}></AntdOssUpload>
                                                    <div><a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1590563204861.xlsx'>Excelæ¨¡çä¸è½½</a></div>
                                                </div>
                                            :null}
                                        </Form.Item>
                                        {this.state.paperType == 1?
                                        <Form.Item label="è®¾ç½®è¯é¢æ°">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({num:e.target.value})
                                                }}
                                                className="m_w400"
                                                value={this.state.num}
                                            />
                                        </Form.Item>
                                        :null}
                                        {this.state.paperType == 2?
                                        <Form.Item label="éæ©é¢ç®">
                                            <TopicBox ref='topicbox' topiclist={this.state.topiclist}></TopicBox>
                                        </Form.Item>
                                        :null}
                                        <Form.Item label="ç­å·æ¶é¿(ç§)">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({duration:e.target.value})
                                                }}
                                                className="m_w400"
                                                value={this.state.duration}
                                            />
                                            <div>æ¶é¿åæ´æ°</div>
                                        </Form.Item>
                                        {/* <Form.Item label="è¯å·åæ ¼æ¯ä¾">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({percentage:e.target.value})
                                                }}
                                                className="m_w400"
                                                value={this.state.percentage}
                                            />
                                            <div>æ¯ä¾åæ´æ°ï¼ä¸ä¸è½è¶è¿100</div>
                                        </Form.Item> */}
                                        <Form.Item label="ç»å·æ¹å¼">
                                            <Radio.Group value={this.state.ptype} disabled={view_mode} onChange={e=>{ this.setState({ ptype:e.target.value }) }}>
                                                <Radio value={0}>é¢ç®éæº</Radio>
                                                <Radio value={1}>ç­æ¡éæº</Radio>
                                                <Radio value={2}>é¢ç®ç­æ¡éæº</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button type="primary" ghost onClick={() => window.history.back()}>åæ¶</Button>
                                        &nbsp;
                                        {view_mode?null:
                                            <Button onClick={this._onPublish} type="primary" loading={importLoading||loading}>{importLoading?'æ­£å¨ä¸ä¼ ':'æäº¤'}</Button>
                                        }
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    width={800}
                    title='éæ©é¢ç®'
                    visible={this.state.showSelectPanel}
                    closable={true}
                    maskClosable={true}
                    okText='ç¡®å®'
                    cancelText='åæ¶'
                    onCancel={()=>{
                        this.setState({ showSelectPanel:false })
                    }}
                    onOk={this._onOK}
                    bodyStyle={{padding: "25px",paddingTop:'25px' }}
                >
                    
                </Modal>
            </div>
        )
    }
}

constÂ LayoutComponentÂ =AuthPaperEdit;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        auth_topic_list:state.auth.auth_topic_list,
        auth_cate_list:state.auth.auth_cate_list,
        auth_paper_list:state.auth.auth_paper_list,
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});