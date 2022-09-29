import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { Table, List,Checkbox,DatePicker,Radio,Icon,Upload,PageHeader,Modal,Form,Card,Select ,Input,Button,message, InputNumber, Switch} from 'antd';
import AntdOssUpload from '../../components/AntdOssUpload'
import connectComponent from '../../util/connect';
import TopicBox from '../../components/TopicBox'

class MeettingPaperEdit extends Component {
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
        percentage:'',

        ctype:48,//普通试卷分类
    }
    topicBox = null
    excelFile = null
    category_list = []
    auth_paper_list = []
    cate_ctype = 25 //题目分类
    topic_ctype = 25 //习题分类
    paper_ctype = 48
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
            actions.getAuthPaper({ctype:this.paper_ctype,paper_id:paper_id,pageSize:0})
            this.setState({ paper_id })
        }
        this.getAuthTopic()
        actions.getAuthCate({ keyword:this.keyword, ctype:this.cate_ctype })
        
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
            message.info('请选择分类')
            this.setState({importLoading:false})
            return
        }
       

        actions.importAuthPaperTopic({
            url,
            category_id:this.state.category_id,
            type:'paper',
            paper_id:this.paper_id,
            ctype:this.paper_ctype,
            resolved:(data)=>{
                message.success({
                    content:'提交成功',
                    onClose:()=>{
                        window.history.back()
                    }
                })
                that.setState({ importLoading:false })
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('导入失败 ，请参考Excel导入模版 '+data)
            }
        })
    }
    _onPublish = ()=>{
        message.success('提交成功')
        window.history.back()
        return;
        if(!this.onPublish()){
            this.setState({loading:false})
        }
    }
    onPublish =()=>{
        this.setState({loading:true})
        const {
            ctype,
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

        if(!paper_name){ message.info('请输入试卷名称'); return false;}
        if(category_id == 0){ message.info('请选择试卷分类'); return false;}
        if(!duration||duration==''){ message.info('请设置答卷时长'); return false;}
        if(isNaN(duration)){
            message.info('请输入正确的答卷时长，时长取整数');return false;
        }
        if(isNaN(score)){
            message.info('请输入正确的总分，总分取整数');return false;
        }
        if(paperType==2&&topic_ids.length == 0){
            message.info('请选择题目');return false;
        }
        if(duration>2*60*60*1000){
            message.info('答卷时长不能超过2个小时');return false;
        }
        if(paperType==1&&num==''){ message.info('请设置试题数'); return false; }
        if(percentage==''){ message.info('请设置合格百分比'); return false; }
        if(isNaN(percentage)){ message.info('请设置正确的合格百分比'); return false; }
        if(percentage>100){ message.info('合格百分比不能超过 100'); return false; }

        actions.publishAuthPaper({
            ctype,
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
                        content:'提交成功',
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
                        subTitle={this.state.paper_id=='0'?"添加试卷":this.state.view_mode?'查看':'修改试卷'}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="试卷名称">
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
                                        <Form.Item label="选择分类">
                                            <Select value={this.state.category_id} disabled={view_mode} className='m_w400' onChange={val=>{
                                                this.setState({ category_id:val })
                                            }}>
                                                <Select.Option value={0}>无</Select.Option>
                                                {this.category_list.map(ele=>(
                                                    <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="状态">
                                            <Switch disabled={view_mode} onChange={e=>this.setState({ status:e?1:0 })} checked={this.state.status==1?true:false}></Switch>
                                        </Form.Item>
                                        {/* <Form.Item label='发布对象' help='未选择任何标签则为全部'>
                                            <Select labelInValue mode="multiple" className='m_w400' disabled={view_mode}>
                                                <Select.Option value={1}>2020B1</Select.Option>
                                                <Select.Option value={2}>2019D1</Select.Option>
                                                <Select.Option value={3}>2021C1</Select.Option>
                                                <Select.Option value={4}>2020B1</Select.Option>   
                                            </Select>
                                        </Form.Item> */}
                                        {/* <Form.Item label="总分">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({score:e.target.value})
                                                }}
                                                className="m_w400" 
                                                value={this.state.score}
                                            />
                                        </Form.Item> */}
                                        <Form.Item label="试卷设计">
                                            <Radio.Group 
                                                disabled={view_mode}
                                                defaultValue={0}
                                                onChange={e=>{
                                                    this.setState({
                                                        paperType:e.target.value
                                                    })
                                                }}
                                            >
                                                <Radio value={0}>固定试卷导入</Radio>
                                                <Radio value={1}>随机试卷</Radio>
                                                <Radio value={2}>抽题试卷</Radio>
                                            </Radio.Group>
                                            {this.state.paperType == 0?
                                                <div>
                                                    <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' value={this.state.excelFile} disabled={view_mode} listType='text' ref={(ref)=>{ this.excelFile = ref }}></AntdOssUpload>
                                                    <div><a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1590563204861.xlsx'>Excel模版下载</a></div>
                                                </div>   
                                            :null}
                                        </Form.Item>
                                        {this.state.paperType == 1?
                                        <Form.Item label="设置试题数">
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
                                        <Form.Item label="选择题目">
                                            <TopicBox ref='topicbox' topiclist={this.state.topiclist}></TopicBox>
                                        </Form.Item>
                                        :null}
                                        <Form.Item label="答卷时长(秒)">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({duration:e.target.value})
                                                }}
                                                className="m_w400"
                                                value={this.state.duration}
                                            />
                                            <div>时长取整数</div>
                                        </Form.Item>
                                        <Form.Item label="试卷合格比例">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({percentage:e.target.value})
                                                }}
                                                className="m_w400"
                                                value={this.state.percentage}
                                            />
                                            <div>比例取整数，且不能超过100</div>
                                        </Form.Item>
                                        <Form.Item label="组卷方式">
                                            <Radio.Group value={this.state.ptype} disabled={view_mode} onChange={e=>{ this.setState({ ptype:e.target.value }) }}>
                                                <Radio value={0}>题目随机</Radio>
                                                <Radio value={1}>答案随机</Radio>
                                                <Radio value={2}>题目答案随机</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="试卷有效期">
                                            <InputNumber></InputNumber>
                                        </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button type="primary" ghost onClick={() => window.history.back()}>取消</Button>
                                        &nbsp;
                                        {view_mode?null:
                                            <Button onClick={this.onPublish} type="primary" loading={importLoading||loading}>{importLoading?'正在上传':'提交'}</Button>
                                        }
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal visible={this.state.previewVisible} maskClosable={false} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    width={800}
                    title='选择题目'
                    visible={this.state.showSelectPanel}
                    closable={true}
                    maskClosable={false}
                    okText='确定'
                    cancelText='取消'
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

const LayoutComponent =MeettingPaperEdit;
const mapStateToProps = state => {
    return {   
        auth_topic_list:state.auth.auth_topic_list,
        auth_cate_list:state.auth.auth_cate_list,
        auth_paper_list:state.auth.auth_paper_list,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});