import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Checkbox,Empty,Spin,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message} from 'antd';
import BraftEditor from '../../components/braft-editor'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import UploadList from 'antd/es/upload/UploadList';
importÂ connectComponentÂ fromÂ '../../util/connect';
import config from '../../config/config';
import customUpload from '../../components/customUpload'
import zhCN from 'antd/es/locale/zh_CN';
import {myUploadFn} from '../../components/MyUploadFn'
import AntdOssUpload from '../../components/AntdOssUpload'
import PersonTypePublic from '../../components/PersonTypePublic'

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}


class ColumnEdit extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        
        view_mode:false,

        imgList:[],
        fileList:[],
        previewVisible:false,
        previewImage: '',
        editorState: BraftEditor.createEditorState(null),

        fetching:false,
        selectData:[],
        selectValue:[],
        
        fetching:false,
        selectTeacher:[],
        teacherData:[],
        videoList:[],
        postList:[],

        posterList:[],
        poster:'',
        poster_title:'',

        article_id:0, 
        teacher_id:0,
        category_id:'',
        article_img:'',

        atype:'0',
        ctype:'15',
        content_id:'',

        media_id:'',

        ttype:0,
        images:'',
		tags:'',
		title:'',
        summary:'',
		content:'',
		sort_order:0,
		status:0,
        can_share:0,
        is_top:0,

    };

    input_value = ''
    squad_list = []
    clickTime = 0
    clickCount = 0
    onCourseImgRemove = ()=>{
        this.setState({
            article_img:''
        })
    }
    onCourseImgChange = ({file,fileList,event}) =>{
        let article_img = ''
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                if(index == 0){
                    article_img = ele.response.resultBody
                }
            }
        })

        this.setState({
            fileList,
            article_img
        })
    }

    onRemove = file => {
        this.setState((pre)=>{
            const {videoList} = pre
            const newFileList = videoList.filter(item => item.uid !== file.uid);
            return { videoList: newFileList }
        });
    }
    onImgRemove = ()=>{
        this.setState({
            images:'',
            imgList:[]
        })
    }
    onImgChange = ({file,fileList,event}) =>{
        let imgList = []
        let images = ''

        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                imgList.push(ele.response.resultBody)
            }
        })

        if(imgList.length !== 0)
            images = imgList.join(',')

        this.setState({
            imgList:fileList,
            images,
        })
    }
    _onPublish = ()=>{
        if(this.onPublish() == false) this.setState({loading:false})
    }
    onPublish =()=>{
        this.setState({loading:true})
        let { 
            article_id, 
            teacher_id,
            category_id,
            
            atype,
            ctype,
            content_id,
            
            ttype,
            tags,
            title,
            summary,
            content,
            sort_order,
            status,
            can_share,
            is_top,
            media_id,
            videoList
        } = this.state;
        let images = []
        let videos = []
        const {actions} = this.props


        const article_img = (this.img&&this.img.getValue())||''
        const flag = this.flag&&this.flag.getValue()
        if(flag === null){ return false }

        if(!title){ message.info('è¯·è¾å¥æ é¢'); return false;}

        if(!article_img){ message.info('è¯·ä¸ä¼ å°é¢'); return false;}

        if(this.state.videoList.length == 0){
            message.info('è¯·ä¸ä¼ è§é¢');return false;
        }

        if(sort_order > 9999){ message.info('æåºä¸è½å¤§äº9999'); return; }
        videoList.map(ele=>{
            if(ele.status == 'done'&&ele.response.err == '0'){
                videos.push({
                    fpath:ele.poster||'',
                    link:ele.response.data.videoId,
                    title:ele.name
                })
            }
        })
        videos = JSON.stringify(videos)
        actions.publishNews({
        
            article_id, 
            teacher_id,
            category_id,
            article_img,
            ttype,
            images:'',
            
            atype,
            ctype,
            content_id,

            tags,
            title,
            summary,
            content,
            sort_order,
            status,
            can_share,
            is_top,

            media_id,
            videos,
            flag,
            resolved:(data)=>{

                if(this.flag&&this.flag.getValue() == '/I/'&&this.flag.getFile() !== '')
                    this.flag.uploadFile(data.articleId, this.props.actions,this,15)
                else
                message.success({
                    content:'æäº¤æå',
                    onClose:()=>{
                        this.setState({loading:false})
                        window.history.back()
                    }
                })
            },
            rejected:(data)=>{
                this.setState({loading:false})
                message.error({
                    content:data
                })
            }
        })
    }

    componentWillMount(){
        const article_id = this.props.match.params.id+'';
        
        const {actions} = this.props

        let _state = this.props.location.state
        if( typeof _state === 'undefined'){
            _state = { type:'' }
        }else if(_state.type === 'view'){
            this.setState({ view_mode:true })
        }

        if(article_id !== '-1'){
            actions.getNewsDetail({articleId:article_id})
            this.setState({ article_id })
        }

    }
    componentDidMount(){
        
    }
    componentWillReceiveProps(n_props){
        if(n_props.news_detail !== this.props.news_detail){
 
            let {
                articleId:article_id,
                teacherId:teacher_id,
                articleImg:article_img,
                categoryId:category_id,
                ttype:ttype,
                galleryList:galleryList,
                tagList:tagList,
                title:title,
                summary:summary,
                content:content,
                sortOrder:sort_order,
                status:status,
                canShare:can_share,
                isTop:is_top,
                mediaId:media_id,
                teacherName:teacherName,
                flag
            } = n_props.news_detail

            let tags = []
            let images = []
            let imgList = []
            let fileList = []
            let selectValue = []
            let selectTeacher =[{
                key:'0',
                label:'æ '
            }]
            let videoList = []
            let postList = []

            //è®²å¸
            if(teacher_id){
                selectTeacher = [{
                    key:teacher_id+'',
                    label:teacherName
                }]
            }
            //ç¼è¾å¨
            let editorState =  BraftEditor.createEditorState(content)||BraftEditor.createEditorState(null)
            //æ ç­¾
            tagList.map((ele)=>{
                tags.push(ele.tagId)
            })
            tags = tags.join(',')
            //æ ç­¾å±ç¤º
            tagList.map(ele=>{
                selectValue.push({
                    key:ele.tagId,
                    label:ele.tagName
                })
            })

            //è§é¢åè¡¨
            galleryList.map((ele,index)=>{
                images.push(ele.fpath)
                videoList.push({
                    response:{resultBody:ele.link,err:'0',data:{videoId:ele.link}},
                    uid:ele.link+index,
                    name:ele.title,
                    status:'done',
                    poster:ele.fpath,
                    type:'video/mp4'
                })
            })
            images = images.join(',')

            //ä¸»å¾
            fileList.push({
                response:{resultBody:article_img},
                uid:article_id,
                name:title,
                status:'done',
                url:article_img
            })
            
            //ä¸»å¾è§é¢
            if(media_id !== '')
            postList = [{
                response:{resultBody:media_id},
                uid:'postList_1',
                name:media_id,
                status:'done',
                url:'',
                type:'video/mp4'
            }]

            this.setState({
                flag,
                selectTeacher,
                editorState,

                fileList,
                selectValue,

                article_id, 
                teacher_id,
                category_id,
                article_img,
                ttype,
                images,
                tags,
                title,
                summary,
                content,
                sort_order,
                status,
                can_share,
                is_top,
                media_id,
                videoList,
                postList
            })
        }

    }
    
    handleEditorChange = (editorState) => {
        let content = editorState.toHTML()
        this.setState({ editorState,content })
    }
    submitContent = () => {
        // å¨ç¼è¾å¨è·å¾ç¦ç¹æ¶æä¸ctrl+sä¼æ§è¡æ­¤æ¹æ³
        // ç¼è¾å¨åå®¹æäº¤å°æå¡ç«¯ä¹åï¼å¯ç´æ¥è°ç¨editorState.toHTML()æ¥è·åHTMLæ ¼å¼çåå®¹
        const htmlContent = this.state.editorState.toHTML()
        this.setState({
            content:htmlContent
        })
    }
    handleCancelModal = () => this.setState({ previewVisible: false });
    handleCancelCourse = () => this.setState({ coursePreviewVisible: false });
    handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
    };
    
    handleChangeModal = ({ fileList }) => this.setState({ fileList });

    onCourseVideoChange = ({ file,fileList }) =>{
        
        if(file.type !== 'video/mp4'){
            message.error('åªè½ä¸ä¼  MP4 è§é¢æä»¶!');
            return;
        }

        let videoList = fileList
        console.log(videoList)
        if(file.status == 'done'&&file.response.err == '0'){
            message.info('ä¸ä¼ æå')

            this.setState({
                poster:'',
                posterIndex:fileList.length-1,
                posterList:[],
                poster_title:file.name,
                showEditPannel:true
            })
        }else if(file.status == 'error'){
            message.info('ä¸ä¼ å¤±è´¥')
        }

        this.setState({
            videoList
        })
    };
    onVideoChange = ({ file,fileList }) =>{
        
        if(file.type !== 'video/mp4'){
            message.error('åªè½ä¸ä¼  MP4 è§é¢æä»¶!');
            return;
        }

        let media_id = ''
        let postList = fileList
        if(file.status == 'done'&&file.response.err == '0'){
            media_id = file.response.data.videoId
            message.info('ä¸ä¼ æå')
        }else if(file.status == 'error'){
            message.info('ä¸ä¼ å¤±è´¥')
        }

        this.setState({
            media_id,
            postList
        },()=>{
            this.props.actions.upLodings({
                video_id:media_id
            })
        })
    };
    beforeVideoUpload(file,fileList) {
        const isMp4 = file.type === 'video/mp4'
        return isMp4;
    }

    onDragEnd = ({ source, destination }) => {
        if(destination == null) return

        const reorder = (list, startIndex, endIndex) => {
          const [removed] = list.splice(startIndex, 1);
          list.splice(endIndex, 0, removed);
    
          return list;
        }

        this.setState(pre=>{
            return {videoList:reorder([...pre.videoList], source.index, destination.index)}
        })
    }
    uploadBtnVideoRoll = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">ä¸ä¼ è§é¢</div>
        </div>
    )
    //åå»
    _onClick = (index)=>{
        
        if(this.clickTime+400<new Date().getTime()){
            this.clickCount = 0
        }
        if(this.clickCount  < 1){
            this.clickTime = new Date().getTime()
            this.clickCount++
        }else{
            if(this.clickTime+400>new Date().getTime()){
                const { videoList } = this.state
                const poster_title = videoList[index].name
                let  posterList = []

                if(videoList[index]['poster'])
                posterList = [{
                    uid:'posterList',
                    name:'posterList',
                    status:'done',
                    type:'image/png',
                    url:videoList[index].poster,
                }]

                this.setState({
                    poster:videoList[index].poster,
                    posterIndex:index,
                    posterList,
                    poster_title,
                    showEditPannel:true
                })
            }
            this.clickCount = 0
        }
    }
    onPosterConfirm = ()=>{
        const {videoList , posterIndex, poster_title} = this.state
        let poster = ''
        if(this.posterImg){
            poster = this.posterImg.getValue()
        }
        if(!poster_title || poster_title == ''){
            message.info('è¯·è¾å¥æ é¢'); return;
        }
        if(!poster || poster == ''){
            message.info('è¯·ä¸ä¼ å°é¢'); return;
        }
        
        videoList[posterIndex].name = poster_title
        videoList[posterIndex].poster = poster||''
        this.setState({
            videoList,
            showEditPannel:false
        })
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


        const { videoList,view_mode,fetching, selectData, selectValue,can_share,article_id } = this.state;
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={!article_id?'æ·»å ä¸é¢':view_mode?'ä¸é¢è¯¦æ':'ç¼è¾ä¸é¢è¯¦æ'}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="æ é¢">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({title:e.target.value})
                                                }}
                                                value={this.state.title} className="m_w400" placeholder=""/>
                                        </Form.Item>
                                        <Form.Item label="å¯æ é¢">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({summary:e.target.value})
                                                }}
                                                value={this.state.summary} className="m_w400" placeholder=""/>
                                        </Form.Item>
                                        
                                        <Form.Item label="å°é¢" help='è¯·ä¸ä¼ ç¬¦åå°ºå¯¸ä¸º 332 x 130çå¾ç'>
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                disabled={view_mode}
                                                tip='ä¸ä¼ å¾ç'
                                                maxLength={1}
                                                value={this.state.fileList}
                                                ref={ref=>this.img = ref}
                                                accept='image/*'
                                            />
                                        </Form.Item>
                                        <Form.Item label="ä¸»å¾è§é¢">
                                            <div className='mb_10' style={{maxWidth:'50%'}}>
                                            <Upload
                                                disabled={view_mode}
                                            
                                                fileList={this.state.postList}
                                                onChange={this.onVideoChange}
                                                beforeUpload={this.beforeVideoUpload}
                                                customRequest={customUpload}
                                                showRemoveIcon={true}
                                                showDownloadIcon={false}
                                                showPreviewIcon={false}
                                                accept='video/*'
                                            >
                                                {this.state.postList.length >= 1 ? null : <Button><Icon type="upload" /> ä¸ä¼ MP4è§é¢æä»¶</Button>}
                                            </Upload>
                                            </div>
                                            <span style={{marginTop:'0px',display:'block',color:'red'}}>
                                                * è¯·ä¸ä¼ ç¬¦ååè¾¨çä¸º 720 x 480 çè§é¢
                                            </span>
                                        </Form.Item>
                                        <Form.Item label="æ¯å¦åäº«">
                                            <Switch  disabled={view_mode} checked={can_share==1?true:false} onChange={(checked)=>{
                                                if(checked)
                                                    this.setState({can_share:1})
                                                else
                                                    this.setState({can_share:0})
                                            }}/>
                                        </Form.Item>
                                        
                                        <Form.Item label="ä¸ä¼ è§é¢">
                                            {videoList.length==0?null:
                                                <div className='mb_10' style={{maxWidth:'50%'}}>
                                                <DragDropContext onDragEnd={this.onDragEnd}>
                                                <Droppable droppableId="droppable" >
                                                    {provided => (
                                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                                        {videoList.map((item, index) => (
                                                            <Draggable key={item.uid} draggableId={item.uid} index={index}>
                                                                {provided => (
                                                                <div
                                                                    onClick={this._onClick.bind(this,index)}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <UploadList
                                                                        showDownloadIcon={false}
                                                                        items={[item]}
                                                                        locale={zhCN}
                                                                        listType='text'
                                                                        showRemoveIcon={true}
                                                                        showDownloadIcon={false}
                                                                        showPreviewIcon={false}
                                                                        onRemove={this.onRemove}
                                                                    />
                                                                </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                    )}
                                                </Droppable>
                                                </DragDropContext>
                                                </div>
                                            }
                                            <Upload
                                                
                                                disabled={view_mode}
                                                multiple={true}
                                                showUploadList={false}
                                                fileList={this.state.videoList}
                                                onChange={this.onCourseVideoChange}
                                                beforeUpload={this.beforeVideoUpload}
                                                customRequest={customUpload}
                                                accept='video/*'
                                            >
                                                <Button>
                                                    <Icon type="upload" /> ä¸ä¼ MP4è§é¢æä»¶
                                                </Button>
                                            </Upload>
                                            <div style={{marginTop:'10px',display:'block',color:'#8b8b8b',lineHeight:'1.5'}}>
                                                * å¯ææ½æåº<br/>
                                                * åå»ä¿®æ¹å°é¢åæ é¢<br/>
                                            </div>
                                        </Form.Item>
                                        <Form.Item label="åå¸å¯¹è±¡">
                                            <PersonTypePublic showO2O={false} ref={ref=>this.flag=ref} actions={this.props.actions} contentId={this.state.article_id} ctype='15' showUser={this.state.article_id=='0'?false:true} disabled={view_mode} flag={this.state.flag} />
                                        </Form.Item>
                                        <Form.Item label="æåº">
                                            <InputNumber  min={0} max={9999} disabled={view_mode} onChange={val=>{
                                                if(val !== ''&&!isNaN(val)){
                                                    val = Math.round(val)
                                                    if(val<0) val=0
                                                    this.setState({sort_order:val})
                                                }
                                            }} value={this.state.sort_order}/>
                                        </Form.Item>
                                        <Form.Item label="æ¯å¦ä¸æ¶">
                                            <Switch  disabled={view_mode} checked={this.state.status==1?true:false} onChange={(checked)=>{
                                                if(checked)
                                                    this.setState({status:1})
                                                else
                                                    this.setState({status:0})
                                            }}/>
                                        </Form.Item>
                                        {/*
                                        <Form.Item label="è¯¦æ">
                                            
                                            <BraftEditor
                                                readOnly={view_mode}
                                                style={{border:"1px solid #eaeaea"}}
                                                value={this.state.editorState}
                                                onChange={this.handleEditorChange}
                                                onSave={this.submitContent}
                                                contentStyle={{height:'400px'}}
                                                media={{uploadFn:myUploadFn}}
                                                controls={controls}
                                            />
                                            <p style={{color:"#ff7e7e",fontSize:'12px',lineHeight:'2'}}>
                                                * å«å¤å¤å¶çæå­åå®¹ï¼è¯·åæ¸é¤æ ·å¼ï¼åéæ°è®¾ç½®æå­æ ·å¼<br />
                                                * å¾çãè§é¢ãé³é¢ç­åªä½è¯·éè¿ä¸ä¼ æé®ä¸ä¼ <br />
                                                * è¯·ç¡®ä¿ç¼è¾æ¡çè§é¢ãé³é¢ææ¾ç¤ºæ­£å¸¸çé¾æ¥ãå¾çæ­£å¸¸æ¾ç¤ºï¼å¦åè¯·å é¤å¹¶éæ°ä¸ä¼ <br />
                                                * ä¸ä¼ çæä»¶ä¸­æä»¶åä¸è¦åå« ç¹æ®å­ç¬¦ ä»¥å ç©ºæ ¼ï¼å¦ååªä½å°ä¸è½æ­£å¸¸æ¾ç¤º<br />
                                            </p>
                                            
                                        </Form.Item>
                                        */}
                                    </Form>
                                    <div className="flex f_row j_center">
                                        {view_mode?null:
                                        <Button loading={this.state.loading||this.state.importLoading} onClick={this._onPublish} type="primary">{this.state.importLoading?'æ­£å¨å¯¼å¥':'æäº¤'}</Button>
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

                <Modal onOk={this.onPosterConfirm} maskClosable={true} onCancel={()=>{this.setState({showEditPannel:false})}} title='è®¾ç½®' visible={this.state.showEditPannel} okText='ç¡®å®' cancelText='åæ¶'>
                    <Form {...{ labelCol: { span: 4 },wrapperCol: { span: 20 }}}>
                        <Form.Item label="å°é¢">
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref=>this.posterImg = ref}
                                listType="picture-card"
                                value={this.state.posterList}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                            <div style={{marginTop:'-5px',display:'block',fontSize:'12px',lineHeight:'1.5'}}>
                                * è¯·ä¸ä¼ ç¬¦åå°ºå¯¸ä¸º 100 x 62 çå¾ç
                            </div>
                        </Form.Item>
                        <Form.Item label="è®¾ç½®æ é¢">
                            <Input placeholder='è®¾ç½®è§é¢æ é¢' value={this.state.poster_title} onChange={e=>{this.setState({poster_title:e.target.value})}}></Input>
                            <div style={{marginTop:'0px',display:'block',fontSize:'12px',lineHeight:'1.5'}}>
                                * å»ºè®®ä¸è¶è¿6ä¸ªå­ç¬¦
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
constÂ LayoutComponentÂ = ColumnEdit;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        squad_list:state.o2o.squad_list,
        news_detail:state.news.news_detail,
        user:state.site.user,
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
