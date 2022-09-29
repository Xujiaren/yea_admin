import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { TimePicker,DatePicker,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message} from 'antd';
import {Link} from 'react-router-dom';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import connectComponent from '../../../util/connect';

const InputGroup = Input.Group;
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search,TextArea} = Input;


function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

function beforeUpload(file) {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//   if (!isJpgOrPng) {
//     message.error('只能上传 JPG/PNG 文件!');
//   }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('图片文件需小于 1MB!');
  }
//   return isJpgOrPng && isLt2M;
  return isLt2M;
}

class ViewTmp extends Component {
    state = {
        fileList:[],
        fileList_1:[],
        previewVisible:false,
        previewImage: '',
        editorState: null,
        showTheBox:true,
        isVideoCourse:true,

        content:'',
        status:'',
        summary:'',
        template_id:'',
        title:''
    };
    componentDidMount(){
        const index = this.props.match.params.index
        const tmp_list =this.props.tmp_list[index]
        if(Object.keys(this.props.tmp_list).length==0){
            window.history.back()
        }else{
            this.setState({
                content:tmp_list.content,
                status:tmp_list.status,
                summary:tmp_list.summary,
                template_id:tmp_list.templateId,
                title:tmp_list.title
            })
        }
        
    }
    _onPublish = ()=>{
        const {content,summary,title,template_id} = this.state
        if(!content||!summary||!title){
            message.info('请输入完整的信息再提交')
            return;
        }
        const {actions} = this.props
        actions.publishTmp({
            content,summary,title,template_id,
            resolved:(data)=>{
                message.success({
                    content:'提交成功',
                    onClose:()=>{
                        window.history.back()
                    }
                });
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    onSelected = (value)=>{
        if(value == 2){
            this.setState({
                showTheBox:true
            })
        }else{
            this.setState({
                showTheBox:false
            })
        }
    }
    onCourseSelected = (value) =>{
        if(value == 0){
            this.setState({
                isVideoCourse:true
            })
        }else{
            this.setState({
                isVideoCourse:false
            })
        }
    }
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
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
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    handleChangeModal = ({ fileList }) => this.setState({ fileList });
    handleChangeModalVideo = ({ fileList }) => this.setState({ fileList_1:fileList });
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
        const uploadBtnVideo = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传视频</div>
            </div>
        );
        const {content,status,summary,template_id,title} = this.state
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle="模板详情"
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="标题">
                                           <Input 
                                                onChange={e=>{
                                                    this.setState({title:e.target.value})
                                                }} 
                                                disabled
                                                value={title} 
                                                className="m_w400" 
                                                placeholder="输入标题"
                                            />
                                        </Form.Item>
                                        <Form.Item label="内容">
                                        {/*
                                            <BraftEditor
                                                style={{border:"1px solid #eaeaea"}}
                                                value={this.state.editorState}
                                                onChange={this.handleEditorChange}
                                                contentStyle={{height:'400px'}}
                                            />
                                        */}
                                            <TextArea 
                                                onChange={e=>{
                                                    this.setState({content:e.target.value})
                                                }} 
                                                disabled
                                                placeholder="输入内容"
                                                value={content} 
                                                rows={4} 
                                                className="m_w400">
                                            </TextArea>
                                        </Form.Item>
                                        <Form.Item label="摘要">
                                            <TextArea 
                                                disabled
                                                onChange={e=>{
                                                    this.setState({summary:e.target.value})
                                                }} 
                                                placeholder="输入摘要"
                                                value={summary} 
                                                rows={4} 
                                                className="m_w400">
                                            </TextArea>
                                        </Form.Item>
                                        
                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
               
            </div>
        )
    }
}
const LayoutComponent =ViewTmp;
const mapStateToProps = state => {
    return {
        tmp_list:state.ad.tmp_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
