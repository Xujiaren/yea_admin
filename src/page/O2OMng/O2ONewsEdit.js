import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Checkbox,Empty,Spin,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message} from 'antd';

import _ from 'lodash'

import connectComponent from '../../util/connect';
import config from '../../config/config';
import customUpload from '../../components/customUpload'
import {myUploadFn} from '../../components/MyUploadFn'
import PersonTypePublic from '../../components/PersonTypePublic'
import AntdOssUpload from '../../components/AntdOssUpload'

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}


class O2ONewsEdit extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        
        view_mode:false,

        imgList:[],
        fileList:[],
        previewVisible:false,
        previewImage: '',

        fetching:false,
        selectData:[],
        selectValue:[],
        
        fetching:false,
        selectTeacher:[],
        teacherData:[],
        videoList:[],


        article_id:0, 
        teacher_id:0,
        category_id:'',
        article_img:'',

        atype:'0',
        ctype:'13',
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
        flag:'',

    };

    input_value = ''
    squad_list = []
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
    onImgRemove = ()=>{
        this.setState({
            images:''
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
        } = this.state;
        const {actions} = this.props
        const article_img = (this.img&&this.img.getValue())||''
        const images = (this.imgList&&this.imgList.getValue())||''
        const flag = (this.flag&&this.flag.getValue())
      
        
        if(!title){ message.info('请输入标题'); return false;}

        if(!article_img){ message.info('请上传封面'); return false;}


        if(!images){
            message.info('请上传图片');return false;
        }

        if(sort_order > 9999){ message.info('排序不能大于9999'); return false; }
        if(flag === null){ return false }
        if(flag.indexOf('squad-')!=-1){
            let flags =flag.slice(6)
           actions.forNumber({
            input:flags,
            resolved:(res)=>{
                let flagd = 'squad-'+res
                actions.publishNews({
        
                    article_id, 
                    teacher_id,
                    category_id,
                    article_img,
                    ttype,
                    images,
                    
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
                    flag:flagd,
                    resolved:(data)=>{
                        if(this.flag&&this.flag.getValue() == '/I/'&&this.flag.getFile() !== '')
                            this.flag.uploadFile(data.articleId, this.props.actions,this,11)
                        else
                        message.success({
                            content:'提交成功',
                        })
                        this.setState({loading:false})
                        window.history.back()
                    },
                    rejected:(data)=>{
                        this.setState({loading:false})
                        message.error({
                            content:data
                        })
                    }
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
           })
        }else{
            actions.publishNews({
        
                article_id, 
                teacher_id,
                category_id,
                article_img,
                ttype,
                images,
                
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
                flag,
                resolved:(data)=>{
                    if(this.flag&&this.flag.getValue() == '/I/'&&this.flag.getFile() !== '')
                        this.flag.uploadFile(data.articleId, this.props.actions,this,11)
                    else
                    message.success({
                        content:'提交成功',
                    })
                    this.setState({loading:false})
                    window.history.back()
                },
                rejected:(data)=>{
                    this.setState({loading:false})
                    message.error({
                        content:data
                    })
                }
            })
        }
       
    }

    componentWillMount(){
        const article_id = this.props.match.params.id;
        
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
                flag,
            } = n_props.news_detail

            let tags = []
            let images = []
            let imgList = []
            let fileList = []
            let videoList = []
            let selectValue = []
            let selectTeacher =[{
                key:'0',
                label:'无'
            }]

            //讲师
            if(teacher_id){
                selectTeacher = [{
                    key:teacher_id+'',
                    label:teacherName
                }]
            }

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

            //排版图
            galleryList.map((ele,index)=>{
                images.push(ele.fpath)
                imgList.push({
                    response:{resultBody:ele.link},
                    uid:index,
                    name:'img_'+index,
                    status:'done',
                    url:ele.link
                })
            })
            images = images.join(',')

            //主图
            fileList.push({
                response:{resultBody:article_img},
                uid:article_id,
                name:title,
                status:'done',
                url:article_img,
                type:'image/png'
            })

            //主图视频
            if(media_id !== '')
            videoList = [{
                response:{resultBody:media_id},
                uid:'postList_1',
                name:media_id,
                status:'done',
                url:'',
                type:'video/mp4'
            }]

            this.setState({
                media_id,
                selectTeacher,
     
                imgList,
                fileList,
                videoList,
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
                flag,
            })
        }

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

    addTmp = ()=>{
        if(!this.input_value){
            message.error("请输入内容再提交");
            return;
        }
        let {selectValue} = this.state;
        const {actions} = this.props
        
        actions.publishTag({
            tagName:this.input_value,
            resolved:(data)=>{
                selectValue.push({key:data.tagId,label:data.tagName});
                let tags = []
                selectValue.map((ele)=>{
                    tags.push(ele.key)
                })
                tags = tags.join(',')
                this.setState({ selectValue,tags });
                this.input_value= ''
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
        
    }
    onCourseVideoChange = ({ file,fileList }) =>{
        
        if(file.type !== 'video/mp4'){
            message.error('只能上传 MP4 视频文件!');
            return;
        }

        let media_id = ''
        let size = ''
        let videoList = fileList
        if(file.status == 'done'&&file.response.err == '0'){
            media_id = file.response.data.videoId
            message.info('上传成功')
            size = (file.size/1000000).toFixed(2)
            this.setState({
                size
            })
        }else if(file.status == 'error'){
            message.info('上传失败')
        }

        this.setState({
            videoList,
            media_id
        })
    };
    beforeVideoUpload(file,fileList) {
        const isMp4 = file.type === 'video/mp4'
        return isMp4;
    }
    uploadBtnVideoRoll = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传视频</div>
        </div>
    )
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


        const { view_mode,fetching, selectData, selectValue,can_share,article_id } = this.state;
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={!article_id?'添加资讯':view_mode?'资讯详情':'编辑资讯详情'}
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
                                        
                                        <Form.Item label="封面">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                accept='image/*'
                                                ref={ref=>this.img = ref}
                                                tip='上传图片'
                                                value={this.state.fileList}
                                                disabled={view_mode}
                                                listType="picture-card"
                                            ></AntdOssUpload>
                                            <span style={{marginTop:'-30px',display:'block',fontSize:'12px',color:'red'}}>* 请上传符合尺寸为 316 x 130的图片</span>
                                        </Form.Item>
                                        {/*
                                        <Form.Item label="关联培训班">
                                            <Select
                                                disabled={view_mode}
                                                showSearch
                                                labelInValue
                                                placeholder="搜索培训班"
                                                notFoundContent={this.state.fetching ? <Spin size="small" /> : <Empty />}
                                                filterOption={false}
                                                onSearch={this.getSquad}
                                                onChange={this.onSelectSquad}
                                                style={{ width: '400px' }}
                                                value={this.state.selectSquad}
                                            >
                                                <Option value={'0'}>无</Option>
                                                {this.squad_list.map(ele => (
                                                    <Option value={ele.squadId}>{ele.squadName}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        */}
                                        <Form.Item label="主图视频">
                                            <Upload
                                                disabled={view_mode}
                                                accept='video/mp4'
                                                listType="picture-card"
                                                fileList={this.state.videoList}
                                                onChange={this.onCourseVideoChange}
                                                beforeUpload={this.beforeVideoUpload}
                                                customRequest={customUpload}
                                            >
                                                {this.state.videoList.length >= 1 ? null : this.uploadBtnVideoRoll}
                                            </Upload>
                                            <span style={{marginTop:'-30px',display:'block',color:'red'}}>
                                                * 请上传符合分辨率为 720 x 480 的视频
                                            </span>
                                        </Form.Item>
                                        <Form.Item label="媒体ID">
                                            <span>{this.state.media_id}</span>
                                        </Form.Item>
                                        <Form.Item label="上传图片">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                accept='image/*'
                                                listType="picture-card"
                                                ref={ref=>this.imgList = ref}
                                                tip='上传图片'
                                                value={this.state.imgList}
                                                disabled={view_mode}
                                                maxLength={10000}
                                                multiple={true}
                                            ></AntdOssUpload>
                                            <span style={{marginTop:'-30px',display:'block',color:'red'}}>
                                                * 请上传符合尺寸为 162 x 92 的图片
                                            </span>
                                        </Form.Item>
                                        
                                        <Form.Item label="是否启用">
                                            <Switch  disabled={view_mode} checked={this.state.status==1?true:false} onChange={(checked)=>{
                                                if(checked)
                                                    this.setState({status:1})
                                                else
                                                    this.setState({status:0})
                                            }}/>
                                        </Form.Item>
                                        <Form.Item label="发布对象">
                                            <PersonTypePublic ref={ref=>this.flag=ref} actions={this.props.actions} contentId={this.state.article_id} ctype='11' showUser={this.state.article_id=='0'?false:true} disabled={view_mode} flag={this.state.flag} />
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
                                            <Button loading={this.state.loading||this.state.importLoading} onClick={this.state.loading||this.state.importLoading?null:this._onPublish} type="primary">{this.state.importLoading?'正在导入':'提交'}</Button>
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
            </div>
        )
    }
}
const LayoutComponent = O2ONewsEdit;
const mapStateToProps = state => {
    return {
        squad_list:state.o2o.squad_list,
        news_detail:state.news.news_detail,
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
