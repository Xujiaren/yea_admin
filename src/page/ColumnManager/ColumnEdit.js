import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Checkbox,Empty,Spin,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message} from 'antd';
import BraftEditor from '../../components/braft-editor'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import UploadList from 'antd/es/upload/UploadList';
import connectComponent from '../../util/connect';
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

        if(!title){ message.info('请输入标题'); return false;}

        if(!article_img){ message.info('请上传封面'); return false;}

        if(this.state.videoList.length == 0){
            message.info('请上传视频');return false;
        }

        if(sort_order > 9999){ message.info('排序不能大于9999'); return; }
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
                    content:'提交成功',
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
                label:'无'
            }]
            let videoList = []
            let postList = []

            //讲师
            if(teacher_id){
                selectTeacher = [{
                    key:teacher_id+'',
                    label:teacherName
                }]
            }
            //编辑器
            let editorState =  BraftEditor.createEditorState(content)||BraftEditor.createEditorState(null)
            //标签
            tagList.map((ele)=>{
                tags.push(ele.tagId)
            })
            tags = tags.join(',')
            //标签展示
            tagList.map(ele=>{
                selectValue.push({
                    key:ele.tagId,
                    label:ele.tagName
                })
            })

            //视频列表
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

            //主图
            fileList.push({
                response:{resultBody:article_img},
                uid:article_id,
                name:title,
                status:'done',
                url:article_img
            })
            
            //主图视频
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
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
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
            message.error('只能上传 MP4 视频文件!');
            return;
        }

        let videoList = fileList
        console.log(videoList)
        if(file.status == 'done'&&file.response.err == '0'){
            message.info('上传成功')

            this.setState({
                poster:'',
                posterIndex:fileList.length-1,
                posterList:[],
                poster_title:file.name,
                showEditPannel:true
            })
        }else if(file.status == 'error'){
            message.info('上传失败')
        }

        this.setState({
            videoList
        })
    };
    onVideoChange = ({ file,fileList }) =>{
        
        if(file.type !== 'video/mp4'){
            message.error('只能上传 MP4 视频文件!');
            return;
        }

        let media_id = ''
        let postList = fileList
        if(file.status == 'done'&&file.response.err == '0'){
            media_id = file.response.data.videoId
            message.info('上传成功')
        }else if(file.status == 'error'){
            message.info('上传失败')
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
            <div className="ant-upload-text">上传视频</div>
        </div>
    )
    //双击
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
            message.info('请输入标题'); return;
        }
        if(!poster || poster == ''){
            message.info('请上传封面'); return;
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
              <div className="ant-upload-text">上传图片</div>
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
                        subTitle={!article_id?'添加专题':view_mode?'专题详情':'编辑专题详情'}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="标题">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({title:e.target.value})
                                                }}
                                                value={this.state.title} className="m_w400" placeholder=""/>
                                        </Form.Item>
                                        <Form.Item label="副标题">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({summary:e.target.value})
                                                }}
                                                value={this.state.summary} className="m_w400" placeholder=""/>
                                        </Form.Item>
                                        
                                        <Form.Item label="封面" help='请上传符合尺寸为 332 x 130的图片'>
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                disabled={view_mode}
                                                tip='上传图片'
                                                maxLength={1}
                                                value={this.state.fileList}
                                                ref={ref=>this.img = ref}
                                                accept='image/*'
                                            />
                                        </Form.Item>
                                        <Form.Item label="主图视频">
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
                                                {this.state.postList.length >= 1 ? null : <Button><Icon type="upload" /> 上传MP4视频文件</Button>}
                                            </Upload>
                                            </div>
                                            <span style={{marginTop:'0px',display:'block',color:'red'}}>
                                                * 请上传符合分辨率为 720 x 480 的视频
                                            </span>
                                        </Form.Item>
                                        <Form.Item label="是否分享">
                                            <Switch  disabled={view_mode} checked={can_share==1?true:false} onChange={(checked)=>{
                                                if(checked)
                                                    this.setState({can_share:1})
                                                else
                                                    this.setState({can_share:0})
                                            }}/>
                                        </Form.Item>
                                        
                                        <Form.Item label="上传视频">
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
                                                    <Icon type="upload" /> 上传MP4视频文件
                                                </Button>
                                            </Upload>
                                            <div style={{marginTop:'10px',display:'block',color:'#8b8b8b',lineHeight:'1.5'}}>
                                                * 可拖拽排序<br/>
                                                * 双击修改封面和标题<br/>
                                            </div>
                                        </Form.Item>
                                        <Form.Item label="发布对象">
                                            <PersonTypePublic showO2O={false} ref={ref=>this.flag=ref} actions={this.props.actions} contentId={this.state.article_id} ctype='15' showUser={this.state.article_id=='0'?false:true} disabled={view_mode} flag={this.state.flag} />
                                        </Form.Item>
                                        <Form.Item label="排序">
                                            <InputNumber  min={0} max={9999} disabled={view_mode} onChange={val=>{
                                                if(val !== ''&&!isNaN(val)){
                                                    val = Math.round(val)
                                                    if(val<0) val=0
                                                    this.setState({sort_order:val})
                                                }
                                            }} value={this.state.sort_order}/>
                                        </Form.Item>
                                        <Form.Item label="是否上架">
                                            <Switch  disabled={view_mode} checked={this.state.status==1?true:false} onChange={(checked)=>{
                                                if(checked)
                                                    this.setState({status:1})
                                                else
                                                    this.setState({status:0})
                                            }}/>
                                        </Form.Item>
                                        {/*
                                        <Form.Item label="详情">
                                            
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
                                                * 别处复制的文字内容，请先清除样式，再重新设置文字样式<br />
                                                * 图片、视频、音频等媒体请通过上传按钮上传<br />
                                                * 请确保编辑框的视频、音频有显示正常的链接、图片正常显示，否则请删除并重新上传<br />
                                                * 上传的文件中文件名不要包含 特殊字符 以及 空格，否则媒体将不能正常显示<br />
                                            </p>
                                            
                                        </Form.Item>
                                        */}
                                    </Form>
                                    <div className="flex f_row j_center">
                                        {view_mode?null:
                                        <Button loading={this.state.loading||this.state.importLoading} onClick={this._onPublish} type="primary">{this.state.importLoading?'正在导入':'提交'}</Button>
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

                <Modal onOk={this.onPosterConfirm} maskClosable={true} onCancel={()=>{this.setState({showEditPannel:false})}} title='设置' visible={this.state.showEditPannel} okText='确定' cancelText='取消'>
                    <Form {...{ labelCol: { span: 4 },wrapperCol: { span: 20 }}}>
                        <Form.Item label="封面">
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref=>this.posterImg = ref}
                                listType="picture-card"
                                value={this.state.posterList}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                            <div style={{marginTop:'-5px',display:'block',fontSize:'12px',lineHeight:'1.5'}}>
                                * 请上传符合尺寸为 100 x 62 的图片
                            </div>
                        </Form.Item>
                        <Form.Item label="设置标题">
                            <Input placeholder='设置视频标题' value={this.state.poster_title} onChange={e=>{this.setState({poster_title:e.target.value})}}></Input>
                            <div style={{marginTop:'0px',display:'block',fontSize:'12px',lineHeight:'1.5'}}>
                                * 建议不超过6个字符
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const LayoutComponent = ColumnEdit;
const mapStateToProps = state => {
    return {
        squad_list:state.o2o.squad_list,
        news_detail:state.news.news_detail,
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
