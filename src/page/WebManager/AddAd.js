import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Checkbox,TimePicker,DatePicker,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message} from 'antd';
import {Link} from 'react-router-dom';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import connectComponent from '../../util/connect';
import config from '../../config/config';
import BraftEditor from '../../components/braft-editor'

import qrcode from '../../assets/img/code.jpg'
import {myUploadFn} from '../../components/MyUploadFn'
import AntdOssUpload from '../../components/AntdOssUpload'

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

const controls = [
    'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
    'headings', 
    'list-ul',
    //'blockquote', 
    //'list-ol', 'code', 
    'link','separator', 'hr', 'separator',
    'media', 'separator',
    'clear'
]

class AddAd extends Component {
    state = {
        fileList:[],
        fileList_1:[],
        previewVisible:false,
        previewImage: '',

        showTheBox:true,
        isVideoCourse:true,

        file_url:'',
        flag:'',
        //广告位置 1：首页轮播  2：首页弹窗  3：个人中心广告
        ad_id:1,
        begin_time:'',
        end_time:'',
        billboard_id:'0',
        billboard_name:'',
        content:'',
        link:'',
        sort_order:0,
        status:0,
        editorState: BraftEditor.createEditorState(null),
        summary:'',

        _beginTime:0,
        _endTime:0,

    };
    onUpload = ({fileList})=>{
        let img = []
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                img.push(ele.url)
            }
        })
        
        this.setState({
            fileList:fileList,
            file_url:img.join(',')
        })
    }
    _onPublish =()=>{

        const {actions} = this.props
        let {file_url,flag,ad_id,begin_time,end_time,billboard_id,billboard_name,content,link,sort_order,status} = this.state

        if(!billboard_name){ message.info('请输入广告名称'); return;}
        if(!file_url){
            message.info('请上传图片');return;
        }
        if(!content){ message.info('请输入摘要'); return;}
        if(!status&&!begin_time){ message.info('请选择上架时间'); return;}
        if(!end_time){ message.info('请选择下架时间'); return;}
        
        console.log(this.state.begin_time,this.state.end_time,moment().format('YYYY-MM-DD HH:mm'))
        if(!status&&moment(this.state.begin_time).isSameOrBefore(moment().format('YYYY-MM-DD HH:mm'))){
            message.info('上架时间不能  小于等于  当前时间')
            return
        }
        if(moment(this.state.end_time).isSameOrBefore(moment().format('YYYY-MM-DD HH:mm'))){
            message.info('下架时间不能  小于等于  当前时间')
            return
        }
        if(!status&&moment(this.state.begin_time).isAfter(this.state.end_time)){
            message.info('上架时间不能  大于  下架时间')
            return
        }
        if(!status&&moment(this.state.begin_time).isSame(this.state.end_time)){
            message.info('上架时间不能  等于  下架时间')
            return
        }
       

        if(sort_order>127){
            message.info('优先级不能大于127'); return;
        }
        if(flag=='//'){
            message.info('请选择开放对象'); return;
        }
        if(status) begin_time = '';
        //if(!link){ message.info('请输入跳转链接'); return;}

        actions.publishBill({
            file_url,flag,ad_id,begin_time,end_time,billboard_id,billboard_name,content,link,sort_order,status,
            resolved:(data)=>{
                message.success({
                    content:'提交成功',
                    onClose:()=>{
                        window.history.back()
                        //this.props.history.replace("/web-manager/ad-manager");
                    }
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    disabledDate = (current)=>{
        return current < moment().subtract(1, 'day')
    }
    onSelected = (value)=>{
        if(value == 2){
            this.setState({
                flag:'//',
                showTheBox:true
            })
        }else if(value == 1){
            this.setState({
                flag:'/2/',
                showTheBox:false
            })
        }else{
            this.setState({
                flag:'',
                showTheBox:false
            })
        }
    }
    onCheckBox = (val)=>{
        val = '/'+val.join('/')+'/';

        this.setState({
            flag:val
        })
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
    
    handleChangeModal = ({ fileList }) => this.setState({ fileList });
    handleChangeModalVideo = ({ fileList }) => this.setState({ fileList_1:fileList });
    onUpTime = (val, dateString)=>{

        this.setState({
            begin_time:dateString,
            _beginTime:val
        })

    }
    onDownTime = (val, dateString)=>{
        console.log(val,dateString)
        
        this.setState({
            end_time:dateString,
            _endTime:val
        })
    }
    submitContent = () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        this.setState({
            summary:htmlContent
        })
    }
    handleEditorChange = (editorState) => {
        this.setState({ 
            editorState
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
        const uploadBtnVideo = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传视频</div>
            </div>
        );
        const options = [
            { label: '直销员', value: '1' },
            {label:'服务中心员工',value:'3'},
            {label:'服务中心负责人',value:'4'},
            { label: '优惠顾客', value: '5' },
            { label: '初级经理', value: '6' },

            { label: '中级经理', value: '7' },
            { label: '客户总监', value: '8' },
            { label: '高级客户总监', value: '9' },
            { label: '资深客户总监及以上', value: 'GG' },
        ];
        const {
            _beginTime,
            _endTime,
            ad_id
        } = this.state
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={"添加广告"}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="广告位置">
                                            <Select 
                                                onChange={val=>{
                                                    this.setState({ad_id:val})
                                                }}
                                                className="m_w400" 
                                                value={this.state.ad_id}
                                            >
                                                <Select.Option value={1}>首页轮播</Select.Option>
                                                <Select.Option value={2}>首页弹窗</Select.Option>
                                                <Select.Option value={3}>个人中心广告</Select.Option>
                                                <Select.Option value={4}>商城轮播</Select.Option>
                                                <Select.Option value={6}>问吧</Select.Option>
                                                <Select.Option value={7}>研讨会</Select.Option>
                                                <Select.Option value={8}>启动页</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="广告名称">
                                           <Input 
                                                onChange={e=>{
                                                    this.setState({billboard_name:e.target.value})
                                                }}
                                                value={this.state.billboard_name} 
                                                className="m_w400" 
                                                placeholder="输入名称" 
                                            />
                                        </Form.Item>

                                        <Form.Item label="广告图片">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                listType="picture-card"
                                                value={this.state.fileList}
                                                onChange={this.onUpload}
                                                accept={this.state.ad_id==8?'image/*;video/mp4':'image/*'}
                                            >
                                            </AntdOssUpload>
                                            <span style={{marginTop:'-30px',display:'block',color:'red',fontSize:'12px'}}>
                                                {this.state.ad_id == 1?'* 请上传符合 345x135 尺寸的图片':this.state.ad_id == 2?'* 请上传符合 690 x 460（3:2）尺寸的图片':this.state.ad_id == 8?'* 请上传符合 375 x 812 尺寸的图片':'* 请上传符合 750 x 222 尺寸的图片'}
                                            </span>
                                        </Form.Item>
                                        <Form.Item label="副标题">
                                            <TextArea
                                                autoSize={{minRows:4}}
                                                className="m_w400"
                                                value={this.state.content}
                                                onChange={e=>{
                                                    this.setState({
                                                        content:e.target.value
                                                    })
                                                }}
                                            ></TextArea>
                                        </Form.Item>
                                        
                                        <Form.Item label="是否启用">
                                            <Switch checked={this.state.status?true:false} onChange={e=>{
                                                if(e){
                                                    this.setState({status:1})
                                                }else{
                                                    this.setState({status:0})
                                                }
                                            }}/>
                                        </Form.Item>
                                        {this.state.status==0?
                                        <Form.Item label="上架时间">
                                            <DatePicker
                                                disabledDate = {this.disabledDate}
                                                format = {'YYYY-MM-DD HH:mm'}
                                                placeholder="选择上架时间" 
                                                onChange={this.onUpTime}
                                                locale={locale}
                                                showTime ={{format:'HH:mm'}}
                                            />
                                            
                                        </Form.Item>
                                        :null}
                                        <Form.Item label="下架时间">
                                            <DatePicker 
                                                disabledDate = {this.disabledDate}
                                                format = {'YYYY-MM-DD HH:mm'}
                                                locale={locale}
                                                placeholder="选择下架时间" 
                                                onChange={this.onDownTime} 
                                                showTime ={{format:'HH:mm'}}
                                            />
                                        </Form.Item>
                                   
                                        <Form.Item label="优先级">
                                            <InputNumber
                                                min={0} max={127}
                                                onChange={val=>{
                                                    if(val !== ''&&!isNaN(val)){
                                                        val = Math.round(val)
                                                        if(val<0) val=0
                                                        this.setState({
                                                            sort_order:val
                                                        })
                                                    }
                                                }}
                                                value={this.state.sort_order}
                                            />
                                        </Form.Item>
                                    
                                        <Form.Item label="目标用户">
                                            <Select className="m_w400" defaultValue={2} onChange={this.onSelected}>
                                                <Option value={0}>全部用户</Option>
                                                <Option value={1}>新用户</Option>
                                                <Option value={2}>已验证</Option>
                                            </Select>
                                            {this.state.showTheBox?
                                                <div>
                                                    <Checkbox.Group options={options} onChange={this.onCheckBox} className='mt_20'/>
                                                </div>
                                            :null}
                                        </Form.Item>
                                        <Form.Item label="跳转链接">
                                            <Input
                                                value={this.state.link}
                                                onChange={e=>{
                                                    this.setState({link:e.target.value})
                                                }}
                                                className="m_w400" 
                                                placeholder="请输入链接模板"
                                            />
                                        </Form.Item>
                                        {/*
                                        <Form.Item label="摘要">
                                       
                                            <BraftEditor
                                               
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
                                        <Button type="primary" ghost onClick={() => window.history.back()}>取消</Button>
                                        &nbsp;
                                        <Button onClick={this._onPublish} type="primary">提交</Button>
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
                    visible={this.state.coursePreviewVisible}
                    maskClosable={true}
                    onCancel={this.handleCancelCourse}
                    okText="发布"
                    cancelText="取消"
                >
                    <img className="block_center" alt="example" style={{ width: '40%' }} src={qrcode} />
                    <div className="text_center">扫码预览</div>
                </Modal>
            </div>
        )
    }
}

const LayoutComponent =AddAd;
const mapStateToProps = state => {
    return {

    }
}
export default connectComponent({LayoutComponent, mapStateToProps});