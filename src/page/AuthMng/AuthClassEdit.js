import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import {Divider,Table,Tag,List,Checkbox, Empty,Spin,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message, DatePicker} from 'antd';

import locale from 'antd/es/date-picker/locale/zh_CN';
import config from '../../config/config';
importÂ connectComponentÂ fromÂ '../../util/connect';

import moment from 'moment';
import _ from 'lodash'
import Editor from '../../components/Editor'
import AntdOssUpload from '../../components/AntdOssUpload'
import SwitchCom from '../../components/SwitchCom'

const {Search,TextArea} = Input;

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

class AuthClassEdit extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        view_mode:false,

        squad_id:'0',
        squad_name:'',
        squad_img:'',
        stype:1,
        begin_time:'0',
        end_time:'0',
        BeginTime:null,
        EndTime:null,
        apply_begin:'0',
        apply_end:'0',
        applyBegin:null,
        applyEnd:null,
        location:'',
        link:'',
        content:'',
        summary:'',
        enroll_num:0,
        is_volunteer:0,
        status:0,
        category_id:0,
        topic_ids:'',

        publishLoading:false,

        fileList:[],
        videoList:[],
        excelFileList:[],
        selectedPaper:[],
        fetchingPaper:false,

        showImgPanel:false,
        previewImage: '',
        pdfList:[],
        pass_number: '',
        percentage:0,
        topic_cate:[],
        topic_list:[],
        category_list:[],
        check:[]
    }
    squad_info = {
        beginTime:0,
        endTime:0
    }
    pdfList = {
        getValue:()=>''
    }
    squad_import_user = []
    category_list = []
    auth_paper_list = []
    ctype = 18
    topic_ctype = 96
    cate_keyword = ''
    paper_keyword = ''

    componentWillMount(){
        const {actions} = this.props

        if(this.props.match.path==='/auth/class-underline/edit/:id'){
            this.setState({stype:3})
        }else if(this.props.match.path==='/auth/class-new/edit/:id'){
            this.setState({stype:2})
            this.getAuthPaper()
        }   
    }
    componentDidMount(){
        const {actions} = this.props
        const squad_id = this.props.match.params.id+''
        let _state = this.props.location.state

        if( typeof _state === 'undefined'){
            _state = { type:'' }
        }else if(_state.type === 'view'){
            this.setState({ view_mode:true })
        }
        
        if(squad_id !== '0'){
            this.squad_id = squad_id
            actions.getSquadInfo({squad_id,type:'cert'})
            this.getSquadImportUser()
            this.setState({ squad_id })
        }
        actions.getAuthCateTopic({ 
            ctype:this.ctype,
            resolved:(data)=>{
                this.setState({ category_list:data||[] })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
       
        actions.getAuthCateTopic({ 
            ctype:this.topic_ctype,
            resolved:(data)=>{
                this.setState({ topic_cate:data||[] })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    componentWillReceiveProps(n_props){

        if(n_props.squad_import_user !== this.props.squad_import_user){
            console.log(n_props.squad_import_user)
            this.squad_import_user = n_props.squad_import_user
        }

        if(n_props.auth_paper_list !== this.props.auth_paper_list){

            this.auth_paper_list = n_props.auth_paper_list.data
            if(this.auth_paper_list.length === 0){
                this.setState({  fetchingPaper:false })
            }

            console.log(this.auth_paper_list)
        }
        if(n_props.auth_cate_list !==this.props.auth_cate_list){
            this.category_list = n_props.auth_cate_list||[]
        }
        if(n_props.squad_info !==this.props.squad_info){
            this.squad_info = n_props.squad_info.data[0]

            let fileList = []
            if(this.squad_info.squadImg){
                let imgs = this.squad_info.squadImg.split(',')
                imgs.map((ele,idx)=>{
                    fileList.push({
                        response:{resultBody:ele},
                        uid:idx,
                        name:'img'+idx,
                        status:'done',
                        url:ele,
                        type:'image/png'
                    })
                })
            }
            let begin_time = moment.unix(this.squad_info.beginTime).format('YYYY-MM-DD HH:mm')
            let BeginTime = moment(begin_time)
            let apply_begin = moment.unix(this.squad_info.applyBegin).format('YYYY-MM-DD HH:mm')
            let applyBegin = moment(apply_begin)
            let end_time = ''
            let EndTime = null
            let apply_end = ''
            let applyEnd = null
            if(this.squad_info.endTime !== 0){
                end_time = moment.unix(this.squad_info.endTime).format('YYYY-MM-DD HH:mm')
                EndTime = moment(end_time)
            }
            if(this.squad_info.applyEnd !== 0){
                apply_end = moment.unix(this.squad_info.applyEnd).format('YYYY-MM-DD HH:mm')
                applyEnd = moment(apply_end)
            }

            let selectedPaper = []

            this.squad_info.paper.map(ele=>{
                ele.map(_ele=>{
                    selectedPaper.push({
                        key:_ele[0],
                        label:_ele[1]
                    })
                })
            })
            let pdfList = []
            this.squad_info.link.split(',').map(ele=>{
                pdfList.push({
                    uid:ele,
                    name:'pdfList',
                    status:'done',
                    type:'image/png',
                    url:ele
                })
            })
            let topic_list = []
            if(this.squad_info.pcategoryIds){
                topic_list = this.squad_info.pcategoryIds.split(',').map(ele=>parseInt(ele))
            }
            

            this.setState({
                topic_list,
                selectedPaper,
                pdfList,
                squad_name:this.squad_info.squadName,
                squad_img: this.squad_info.squadImg,
                stype:this.squad_info.stype,
                begin_time:begin_time,
                BeginTime:BeginTime,
                end_time:end_time,
                EndTime:EndTime,
                applyBegin:applyBegin,
                applyEnd:applyEnd,
                apply_begin:apply_begin,
                apply_end:apply_end,
                location:this.squad_info.location,
                link:this.squad_info.link,
                content:this.squad_info.content,
                summary:this.squad_info.summary,
                enroll_num:this.squad_info.enrollNum,
                is_volunteer:this.squad_info.isVolunteer,
                status:this.squad_info.status,
                category_id:this.squad_info.categoryId,
                fileList: fileList,
                pass_number: this.squad_info.passNumber,
                percentage:this.squad_info['percentage']||0
            })
        }
    }
    getSquadImportUser = ()=>{
        const {actions} = this.props
        actions.getSquadImportUser({
            squad_id: this.squad_id
        })
    }
    getAuthPaper = ()=>{
        const {actions} = this.props;
        actions.getAuthPaper({page:0, pageSize:100000, keyword: this.paper_keyword})
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }
    
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    }
    onImgChange = ({file,fileList,event}) =>{
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        let img = []

        if (!isJpgOrPng) {
            message.info('åªè½ä¸ä¼  JPG/PNG/GIF æä»¶!');
            return
        }
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                img.push(ele.response.resultBody)
            }
        })
        
        this.setState({
            fileList:fileList,
            squad_img:img.join(',')
        })
    }

    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        return isJpgOrPng;
    }
    _onPublish =()=>{
        const {actions} = this.props
        let { 
            squad_id,
            squad_name,
            stype,
            begin_time,
            end_time,
            apply_begin,
            apply_end,
            location,
            
            summary,
            enroll_num,
            is_volunteer,
            status,
            category_id,
            selectedPaper,
            excelFileList,
            pass_number,
            percentage,
            topic_list,
        } = this.state;
        let content = ''
        let link = ''
        let topic_ids = []
        let pcategory_ids = ''
        if(stype == 3){
            link = this.pdfList.getValue()
            if(!link){ message.info('è¯·ä¸ä¼ å¹è®­éç¥'); return; }
        }else if(stype === 1){
            content = this.refs.editor.toHTML()
        }else if(stype === 2){
            content = this.refs.editor.toHTML()
            if(!selectedPaper.length){
                message.info('è¯·éæ©è¯å·'); return;
            }
            if(selectedPaper.length<3){
                message.info('ä¸ºäºç»è®¡èè¯ç»ä¹ æ°æ®ï¼å³èçè¯å·å¿é¡»å¤§äºç­äº3å¥'); return;
            }
            selectedPaper.map(ele=>{
                topic_ids.push(ele.key)
            })
            topic_ids = topic_ids.join(',')
        }
        
        
        if(!squad_name){ message.info('è¯·è¾å¥åç§°'); return;}
        if(stype==1&&!summary){ message.info('è¯·è¾å¥å¯æ é¢'); return;}
        if(stype>1&&category_id==0){ message.info('è¯·éæ©åç±»'); return;}
        if(this.img&&this.img.getValue()==''){ message.info('è¯·ä¸ä¼ å°é¢'); return;}
        if(stype==2){
            if(pass_number==''){ message.info('è¯·è®¾ç½®åæ ¼è¯å·æ°'); return; }
            if(pass_number>128){ message.info('åæ ¼è¯å·æ°ä¸è½è¶è¿ 128'); return; }

            if(percentage==''){ message.info('è¯å·åæ ¼åæ°'); return false; }
            if(isNaN(percentage)){ message.info('è¯·è®¾ç½®æ­£ç¡®çè¯å·åæ ¼åæ°'); return false; }
            if(percentage>100){ message.info('è¯å·åæ ¼åæ°ä¸è½è¶è¿ 100'); return false; }
            if(percentage%1 != 0){ message.info('è¯å·åæ ¼åæ°è¯·åæ´æ°'); return false; }
            
            if(topic_list.length==0){
                message.info('è¯·éæ©ä¹ é¢åç±»'); return false;
            }else{
                pcategory_ids = topic_list.map(ele=>{
                    return ele
                }).join(',')
            }
            if(pass_number>selectedPaper.length){
                message.info('è¯å·åæ ¼æ°éä¸è½è¶è¿è¯å·æ»æ°');return;
            }
        }

        const squad_img = (this.img&&this.img.getValue())||''
        // if(!location){ message.info('è¯·è¾å¥æ´»å¨å°ç¹'); return;}

        this.setState({ publishLoading:true })
        actions.publishSquad({
            squad_id,
            squad_name,
            squad_img,
            stype,
            begin_time,
            end_time,
            apply_begin,
            apply_end,
            location,
            link,
            content,
            summary,
            enroll_num,
            is_volunteer,
            status,
            category_id,
            topic_ids,
            pass_number,
            percentage,
            pcategory_ids,
            resolved:(data)=>{
                console.log(data)
                if(typeof(data)=='string'){
                    message.info({
                        content:data,
                        onClose:()=>{
                            this.setState({ publishLoading:false })
                        }
                    })
                }else{
                    if(excelFileList.length>0){
                        if(this.state.squad_id == 0){
                            this.squad_id = data.squadId
                        }else{
                            this.squad_id = this.state.squad_id
                        }
                        this.importUser()
                    }else{
                        message.success({
                            content:'æäº¤æå',
                            onClose:()=>{
                                this.setState({ publishLoading:false })
                                window.history.back()
                            }
                        })
                    }
                }
                
                
            },
            rejected:(data)=>{
                this.setState({ publishLoading:false })
            }
        })

    }
    
    disabledDate = (current)=>{
        return current < moment().subtract(1, 'day')
    }
    beforeUploadExcel = file => {
   
        if(file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            message.info('è¯·ä¸ä¼ xlsxæ ¼å¼çæä»¶')
            return;
        }
        this.setState(state => ({
            excelFileList: [file],
        })); 
        return false;
    }
    onRemoveExcel = file => {
        this.setState(state => {
            const index = state.excelFileList.indexOf(file);
            const newFileList = state.excelFileList.slice();
            newFileList.splice(index, 1);
            return {
                excelFileList: newFileList,
            };
        });
    }
    importUser = ()=>{
        this.setState({importLoading:true})

        const {actions} = this.props
        const {excelFileList} = this.state;
        const that = this
        let file = new FormData();

        file.append('file', excelFileList[0]);
        file.append('squad_id',this.squad_id)
        actions.importSquadUser({
            file:file,
            resolved:(data)=>{
                if(Object.keys(data).indexOf('fail')>-1){
                that.setState({ importLoading:false,excelFileList:[] },()=>{
                    let rejectedUser = []
                    Object.keys(data.fail).map(ele=>{
                        rejectedUser.push(data.fail[ele])
                    })

                    that.setState({
                        success:data.success,
                        total:data.total,
                        publishLoading:false,
                        showResult:true,
                        rejectedUser:rejectedUser
                    })
                    this.getSquadImportUser()
                    
                })
                }else{
                    message.error('å¯¼å¥å¤±è´¥ ï¼è¯·åèExcelå¯¼å¥æ¨¡ç')
                    this.setState({importLoading:false})
                }
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('å¯¼å¥å¤±è´¥ ï¼è¯·åèExcelå¯¼å¥æ¨¡ç')
            }
        })
    }
    _onSelectPaper = value => {
        console.log(value)

        this.setState({
            selectedPaper:value,
            fetchingPaper: false,
        });
    };
    _onSearchPaper = (value)=>{
        this.setState({ fetchingPaper: true })
        this.paper_keyword = value
        this.getAuthPaper()
    }

    _delete=(val,e)=>{ 
        const {actions} = this.props
        const{check}=this.state
        if(check.length==0){
            actions.publishSquads({
                squad_id:this.state.squad_id,
                user_ids:val.userId,
                resolved:(data)=>{
                    console.log(data)
                    this.getSquadImportUser()
                },
                rejected:(data)=>{
                    console.log(data)
                }
            })
        }else{
            actions.publishSquads({
                squad_id:this.state.squad_id,
                user_ids:check.toString(),
                resolved:(data)=>{
                    console.log(data)
                    this.getSquadImportUser()
                    this.setState({check:[]})
                },
                rejected:(data)=>{
                    console.log(data)
                }
            })
        }
        
    }

    onCheck=(val,ele,e)=>{
        const{check}=this.state
        console.log(e)
        if(e.target.checked==true){
            this.setState({
                check:check.concat(val.userId)
            })
        }else{
            this.setState({
                check:check.filter(item=>item!=val.userId)
            })
        }
       
    }
    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 20 },
            },
        };
        const uploadButtonImg = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">ä¸ä¼ å¾ç</div>
            </div>
        );
        const { 

            squad_id,
            squad_name,
            squad_img,
            
            begin_time,
            end_time,
            location,
            link,
            content,
            summary,
            enroll_num,
            is_volunteer,
            status,
            excelFileList,
            view_mode,
            stype,
            pass_number,
            check
        } = this.state;

        // const locked = this.squad_info.beginTime<Date.parse(new Date())/1000
        const locked = false
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={
                            squad_id=='0'?
                            'æ·»å ':(view_mode?'è¯¦æ':'ç¼è¾')
                            }
                    >
                        <Row>
                            <Col xs="12">
                                
                                    <Card type='inner'>
                                        <Form {...formItemLayout}>
                                            
                                            <Form.Item label={stype==3?'ç­çº§åç§°':stype==2?'å¼ç­åç§°':'æ é¢'}>
                                                <Input disabled={view_mode} onChange={(e)=>{
                                                    this.setState({squad_name:e.target.value})
                                                }} className="m_w400" value={squad_name}/>
                                            </Form.Item>
                                            {stype===3?
                                            <Form.Item label="ä¸è¯¾å°ç¹">
                                                <Input disabled={view_mode} value={location} onChange={e=>{
                                                    this.setState({location:e.target.value})
                                                }}  className="m_w400"/>
                                            </Form.Item>
                                            :null}
                                            {stype===2?
                                            <Form.Item label="å¯æ é¢">
                                                <TextArea disabled={view_mode} autoSize={{minRows:6}} value={summary} onChange={e=>{
                                                    let summary = e.target.value
                                                    this.setState({summary})
                                                }} className="m_w400"/>
                                            </Form.Item>
                                            :null}
                                            {stype==2?
                                            <Form.Item label="å°é¢" help='130px * 72px'>
                                                <AntdOssUpload
                                                    actions={this.props.actions}
                                                    ref={ref=>this.img = ref}
                                                    value={this.state.fileList}
                                                    listType="picture-card"
                                                    disabled={view_mode}
                                                    maxLength={1}
                                                    accept='image/*'
                                                ></AntdOssUpload>
                                            </Form.Item>
                                            :null}
                                             {/* <Form.Item label="æ¥åæ¶é´">
                                                
                                                {this.state.squad_id !=='0'?
                                                <DatePicker
                                                    key='t_5'
                                                    disabled={view_mode||locked}
                                                    disabledDate = {this.disabledDate}
                                                    format = {'YYYY-MM-DD HH:mm'}
                                                    placeholder="éæ©å¼å§æ¶é´" 
                                                    onChange={(val, dateString)=>{
                                                        this.setState({
                                                            applyBegin:val,
                                                            apply_begin:dateString
                                                        })
                                                    }}
                                                    value={this.state.applyBegin}
                                                    locale={locale}
                                                    showTime ={{format:'HH:mm'}}
                                                    allowClear={false}
                                                />:
                                                <DatePicker
                                                    key='t_6'
                                                    disabled={view_mode}
                                                    disabledDate = {this.disabledDate}
                                                    format = {'YYYY-MM-DD HH:mm'}
                                                    placeholder="éæ©å¼å§æ¶é´" 
                                                    onChange={(val, dateString)=>{
                                                        this.setState({
                                                            applyBegin:val,
                                                            apply_begin:dateString
                                                        })
                                                    }}
                                                    locale={locale}
                                                    showTime ={{format:'HH:mm'}}
                                                    allowClear={false}
                                                />
                                                }
                                                
                                                <span style={{padding:'0 10px'}}>è³</span>
                                                
                                                {this.state.squad_id !=='0'?
                                                <DatePicker
                                                    key='t_7'
                                                    disabled={view_mode||locked}
                                                    disabledDate = {this.disabledDate}
                                                    format = {'YYYY-MM-DD HH:mm'}
                                                    placeholder="éæ©ç»ææ¶é´" 
                                                    onChange={(val, dateString)=>{
                                                        this.setState({
                                                            apply_end:dateString,
                                                            applyEnd:val
                                                        })
                                                    }}
                                                    value={this.state.applyEnd}
                                                    locale={locale}
                                                    showTime ={{format:'HH:mm'}}
                                                    allowClear={false}
                                                />:
                                                <DatePicker
                                                    key='t_8'
                                                    disabled={view_mode}
                                                    disabledDate = {this.disabledDate}
                                                    format = {'YYYY-MM-DD HH:mm'}
                                                    placeholder="éæ©ç»ææ¶é´"
                                                    onChange={(val, dateString)=>{
                                                        this.setState({
                                                            apply_end:dateString,
                                                            applyEnd:val
                                                        })
                                                    }}
                                                    locale={locale}
                                                    showTime ={{format:'HH:mm'}}
                                                    allowClear={false}
                                                />
                                                }
                                               
                                            </Form.Item> */}
                                            <Form.Item label="å¼è¯¾æ¶é´">
                                                
                                                {this.state.squad_id !=='0'?
                                                <DatePicker
                                                    key='t_5'
                                                    disabled={view_mode||locked}
                                                    disabledDate = {this.disabledDate}
                                                    format = {'YYYY-MM-DD HH:mm'}
                                                    placeholder="éæ©å¼å§æ¶é´" 
                                                    onChange={(val, dateString)=>{
                                                        this.setState({
                                                            BeginTime:val,
                                                            begin_time:dateString
                                                        })
                                                    }}
                                                    value={this.state.BeginTime}
                                                    locale={locale}
                                                    showTime ={{format:'HH:mm'}}
                                                    allowClear={false}
                                                />:
                                                <DatePicker
                                                    key='t_6'
                                                    disabled={view_mode}
                                                    disabledDate = {this.disabledDate}
                                                    format = {'YYYY-MM-DD HH:mm'}
                                                    placeholder="éæ©å¼å§æ¶é´" 
                                                    onChange={(val, dateString)=>{
                                                        this.setState({
                                                            begin_time:dateString,
                                                            BeginTime:val
                                                        })
                                                    }}
                                                    locale={locale}
                                                    showTime ={{format:'HH:mm'}}
                                                    allowClear={false}
                                                />
                                                }
                                                
                                                <span style={{padding:'0 10px'}}>è³</span>
                                                
                                                {this.state.squad_id !=='0'?
                                                <DatePicker
                                                    key='t_7'
                                                    disabled={view_mode||locked}
                                                    disabledDate = {this.disabledDate}
                                                    format = {'YYYY-MM-DD HH:mm'}
                                                    placeholder="éæ©ç»ææ¶é´" 
                                                    onChange={(val, dateString)=>{
                                                        this.setState({
                                                            end_time:dateString,
                                                            EndTime:val
                                                        })
                                                    }}
                                                    value={this.state.EndTime}
                                                    locale={locale}
                                                    showTime ={{format:'HH:mm'}}
                                                    allowClear={false}
                                                />:
                                                <DatePicker
                                                    key='t_8'
                                                    disabled={view_mode}
                                                    disabledDate = {this.disabledDate}
                                                    format = {'YYYY-MM-DD HH:mm'}
                                                    placeholder="éæ©ç»ææ¶é´"
                                                    onChange={(val, dateString)=>{
                                                        this.setState({
                                                            end_time:dateString,
                                                            EndTime:val
                                                        })
                                                    }}
                                                    locale={locale}
                                                    showTime ={{format:'HH:mm'}}
                                                    allowClear={false}
                                                />
                                                }
                                                
                                            </Form.Item>
                                            <Form.Item label="æçäººæ°">
                                                <InputNumber disabled={view_mode} onChange={val=>{
                                                    if(val !== ''&&!isNaN(val)){
                                                        val = Math.round(val)
                                                        if(val<0) val=0
                                                        this.setState({enroll_num:val})
                                                    }
                                                }} value={enroll_num} min={0} max={20000}/>
                                            </Form.Item>
                                            {this.state.stype==2?
                                            <>
                                                <Form.Item label="åæ ¼è¯å·æ°">
                                                    <InputNumber disabled={view_mode} onChange={val=>{
                                                        if(val !== ''&&!isNaN(val)){
                                                            val = Math.round(val)
                                                            if(val<0) val=0
                                                            this.setState({pass_number:val})
                                                        }
                                                    }} value={pass_number} min={0} max={100}/>
                                                </Form.Item>
                                                <Form.Item label="è¯å·åæ ¼åæ°">
                                                <InputNumber
                                                    min={0}
                                                    max={100}
                                                    disabled={view_mode}
                                                    onChange={e=>{
                                                        this.setState({percentage:e})
                                                    }}
                                                    className="m_w400"
                                                    value={this.state.percentage}
                                                />
                                                <div>æ¯ä¾åæ´æ°ï¼ä¸ä¸è½è¶è¿100</div>
                                                </Form.Item>
                                            </>
                                            :null}
                                            {stype>1?
                                            <Form.Item label={stype==3?'å³èè¯¾ç¨':"è¯¾ç¨åç±»"}>
                                                <Select value={this.state.category_id} disabled={view_mode} className='m_w400' onChange={val=>{
                                                    this.setState({ category_id:val })
                                                }}>
                                                    <Select.Option value={0}>æ </Select.Option>
                                                    {this.state.category_list.map(ele=>(
                                                        <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            :null}
                                            {stype == 2?
                                            <Form.Item label="ä¹ é¢åç±»">
                                                <Select mode="multiple" value={this.state.topic_list} disabled={view_mode} className='m_w400' onChange={topic_list=>{
                                                    console.log(topic_list)
                                                    this.setState({topic_list})
                                                }}>
                                                    {this.state.topic_cate.map(ele=>(
                                                        <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            :null}
                                            {stype == 2?
                                            <Form.Item label="éæ©è¯å·">
                                                <Select
                                                    disabled={view_mode}
                                                    mode="multiple"
                                                    labelInValue
                                                    value={this.state.selectedPaper}
                                                    placeholder="æç´¢è¯å·"
                                                    className='m_w400'
                                                    notFoundContent={this.state.fetchingPaper ? <Spin size="small" /> : <Empty />}
                                                    filterOption={false}
                                                    onSearch={this._onSearchPaper}
                                                    onChange={this._onSelectPaper}
                                                >
                                                    {this.auth_paper_list.map(item => (
                                                        <Select.Option key={item.paperId} value={item.paperId}>{item.paperName}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            :null}

                                            {stype==2?
                                            <Form.Item label="è¯¦æ">
                                                <Editor readOnly={view_mode} content={this.state.content} ref='editor' actions={this.props.actions}></Editor>
                                            </Form.Item>
                                            :null}
                                            <Form.Item label='å¼æ¾å¯¹è±¡'>
                                                <div>
                                                    {
                                                        this.squad_import_user.length>0?
                                                        <Button className='m_2' onClick={()=>{this.setState({ showImportUser:true })}}>æ¥çå¯¼å¥åå</Button>
                                                        :null
                                                    }
                                                    <Upload
                                                        disabled={view_mode}
                                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                        fileList={excelFileList}
                                                        beforeUpload={this.beforeUploadExcel}
                                                        onRemove={this.onRemoveExcel}
                                                    >
                                                        <Button className='m_2'>
                                                            <Icon type="upload" /> å¯¼å¥åå
                                                        </Button>
                                                    </Upload>
                                                    
                                                    <div style={{color:"#8e8e8e",marginTop:'10px',lineHeight:'1.5'}}>
                                                        <p>
                                                            * å¯¼å¥åï¼è¯·åä¸è½½Excelæ¨¡æ¿æä»¶<br/>
                                                            * ä»æ¯æxlsxæ ¼å¼çæä»¶
                                                        </p>
                                                        <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/09b8e959-ffce-425b-a216-811bf7bb5d89.xlsx'>
                                                            Excelå¯¼å¥æ¨¡æ¿ä¸è½½
                                                        </a>
                                                    </div>
                                                </div>
                                            </Form.Item>
                                            {stype===3?
                                            <Form.Item label='ä¸ä¼ å¹è®­éç¥'>
                                                <AntdOssUpload 
                                                    maxLength={10}
                                                    tip='ä¸ä¼ å¾ç'
                                                    actions={this.props.actions}
                                                    accept='image/*'
                                                    value={this.state.pdfList}
                                                    ref={ref=>this.pdfList = ref}
                                                ></AntdOssUpload>
                                            </Form.Item>
                                            :null}
                                            <Form.Item label='æ¯å¦ä¸æ¶'>
                                                <SwitchCom disabled={view_mode} value={this.state.status} onChange={val=>this.setState({status:val})}></SwitchCom>
                                            </Form.Item>
                                        </Form>
                                        <div className="flex f_row j_center">
                                            <Button onClick={()=>{
                                                window.history.go(-1)
                                            }}>åæ¶</Button>&nbsp;
                                            {view_mode?null:
                                            <Button loading={this.state.publishLoading} onClick={this._onPublish} style={{minWidth:'64px'}} type="primary">{this.state.importLoading?'æ­£å¨å¯¼å¥':'æäº¤'}</Button>
                                            }
                                        </div>
                                    </Card>
                                    
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({ previewVisible:false })
                }}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    width={600}
                    title='æ¥çå¯¼å¥åå'
                    visible={this.state.showImportUser}
                    closable={true}
                    maskClosable={true}
                    okText='ç¡®å®'
                    cancelText='åæ¶'
                    onCancel={() => {
                        this.setState({ showImportUser:false })
                    }}
                    onOk={() => {
                        this.setState({ showImportUser:false })
                    }}
                    bodyStyle={{ padding: '10px' }}
                >
                    <Table
                        columns={this.props.history.location.state.type=='view'?this.importUserCols:this.importUserCol}
                        pagination={{size:'small',showTotal:(total)=>`æ»å±${total}æ¡`,showQiuckJumper:true}}
                        dataSource={this.squad_import_user}
                        rowKey='sn'
                    ></Table>
                </Modal>
                <Modal
                    width={600}
                    title='å¯¼å¥ç»æ'
                    visible={this.state.showResult}
                    closable={true}
                    maskClosable={true}
                    okText='ç¡®å®'
                    cancelText='åæ¶'
                    onCancel={() => {
                        window.history.back()
                    }}
                    onOk={() => {
                        window.history.back()
                    }}
                    bodyStyle={{ padding: '10px' }}
                >

                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '10px' }}>
                        <span style={{ paddingRight: '20px' }}>æ»æ°:{this.state.total}</span>
                        <span style={{ paddingRight: '20px' }}>å¯¼å¥æåæ°:{this.state.success}</span>
                        <span style={{ paddingRight: '20px' }}>å¯¼å¥å¤±è´¥æ°:{this.state.total - this.state.success}</span>
                    </div>
                    <Table 
                        columns={this.rejectedUser}
                        pagination={{size:'small',showTotal:(total)=>`æ»${total}æ¡`,showQiuckJumper:true}}
                        dataSource={this.state.rejectedUser}
                        rowKey='sn'
                    ></Table>

                </Modal>
            </div>
        )
    }
    rejectedUser = [
        {
            title: 'å§å',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
        },
        {
            title: 'ææº',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: 'å¡å·',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        },
        {
            title: 'å¯¼å¥å¤±è´¥åå ',
            dataIndex: 'result',
            key: 'result',
        },
    ]
    importUserCol = [
        {   title: 'å¤é',
            dataIndex: '',
            key: '',
            render:(item,index)=>{
                return(
                    <Checkbox onChange={this.onCheck.bind(this,item,index)}></Checkbox>
                )
            }
        },
        {
            title: 'å§å',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
        },
        {
            title: 'ææº',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: 'å¡å·',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        },
        {
            title: 'æä½',
            dataIndex: '',
            key: '',
            ellipsis: false,
            render:(item,ele)=>{
                return(
                    <div>
                    {
                       this.state.check.length ==0?
                       <div onClick={this._delete.bind(this,item,ele)}>å é¤</div>
                       :
                       <div onClick={this._delete.bind(this,item,ele)}>æ¹éå é¤</div>
                    }
                    </div>
                )
            }
        }
    ]
    importUserCols = [
        {
            title: 'å§å',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
        },
        {
            title: 'ææº',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: 'å¡å·',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        }
    ]
}
constÂ LayoutComponentÂ =AuthClassEdit;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        auth_paper_list:state.auth.auth_paper_list,
        auth_cate_list:state.auth.auth_cate_list,
        squad_info:state.o2o.squad_info,
        squad_import_user:state.o2o.squad_import_user
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
