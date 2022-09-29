import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Divider, Table, Tag, List, Checkbox, Empty, Spin, Radio, InputNumber, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message, DatePicker } from 'antd';

import locale from 'antd/es/date-picker/locale/zh_CN';
import config from '../../config/config';
import connectComponent from '../../util/connect';

import Editor from '../../components/Editor'
// import BraftFinder from "../../components/braft-finder";
import moment from 'moment';
import _ from 'lodash'
import * as courseService from '../../redux/service/course'
import customUpload from '../../components/customUpload'
import { myUploadFn } from '../../components/MyUploadFn'
import AntdOssUpload from '../../components/AntdOssUpload'
const { Search, TextArea } = Input;
const controls = [
    'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
    'headings',
    'list-ul',
    //'blockquote', 
    //'list-ol', 'code', 
    'link', 'separator', 'hr', 'separator',
    'media', 'separator',
    'clear'
]

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class EditO2O extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        view_mode: false,

        squad_id: '0',
        squad_name: '',
        squad_img: '',
        stype: '0',
        begin_time: '0',
        end_time: '0',
        BeginTime: 0,
        EndTime: 0,
        location: '',
        link: '',
        content: '',
        summary: '',
        enroll_num: 0,
        is_volunteer: 0,
        status: 0,

        publishLoading: false,

        fileList: [],
        videoList: [],


        showImgPanel: false,
        previewImage: '',

        aTime: null,
        vTime: null,
        can_share: 0,
    }
    squad_info = {
        beginTime: 0,
        endTime: 0
    }
    componentDidMount() {
        const { actions } = this.props
        const squad_id = this.props.match.params.id + ''
        let _state = this.props.location.state

        if (typeof _state === 'undefined') {
            _state = { type: '' }
        } else if (_state.type === 'view') {
            this.setState({ view_mode: true })
        }

        if (squad_id !== '0') {
            actions.getSquadInfo({ squad_id })
            this.setState({ squad_id })
        }
    }
    componentWillReceiveProps(n_props) {


        if (n_props.squad_info !== this.props.squad_info) {
            this.squad_info = n_props.squad_info

            let fileList = []
            if (this.squad_info.squadImg) {
                let imgs = this.squad_info.squadImg.split(',')
                imgs.map((ele, idx) => {
                    fileList.push({
                        response: { resultBody: ele },
                        uid: idx,
                        name: 'img' + idx,
                        status: 'done',
                        url: ele,
                        type: 'image/png'
                    })
                })
            }
            let begin_time = moment.unix(this.squad_info.beginTime).format('YYYY-MM-DD HH:mm')
            let BeginTime = moment(begin_time)
            let end_time = moment.unix(this.squad_info.endTime).format('YYYY-MM-DD HH:mm')
            let EndTime = moment(end_time)

            let apply_begin = moment.unix(this.squad_info.applyBegin).format('YYYY-MM-DD HH:mm')
            let ApplyBegin = moment(apply_begin)
            let apply_end = moment.unix(this.squad_info.applyEnd).format('YYYY-MM-DD HH:mm')
            let ApplyEnd = moment(apply_end)


            this.setState({
                apply_begin,
                apply_end,
                vTime: [ApplyBegin, ApplyEnd],
                aTime: [BeginTime, EndTime],
                squad_name: this.squad_info.squadName,
                squad_img: this.squad_info.squadImg,
                stype: this.squad_info.stype,
                begin_time: begin_time,
                BeginTime: BeginTime,
                end_time: end_time,
                EndTime: EndTime,
                location: this.squad_info.location,
                link: this.squad_info.link,
                content: this.squad_info.content,
                summary: this.squad_info.summary,
                enroll_num: this.squad_info.enrollNum,
                is_volunteer: this.squad_info.isVolunteer,
                status: this.squad_info.status,
                can_share: this.squad_info.canShare,
                fileList: fileList,
            })
        }
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
    onImgChange = ({ file, fileList }) => {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        let img = []

        if (!isJpgOrPng) {
            message.info('只能上传 JPG/PNG/GIF 文件!');
            return
        }
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.url)
            }
        })

        this.setState({
            fileList: fileList,
            squad_img: img.join(',')
        })
    }

    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        return isJpgOrPng;
    }
    _onPublish = () => {
        const { actions } = this.props
        let {
            squad_id,
            squad_name,

            stype,
            begin_time,
            end_time,
            location,
            link,
            summary,
            enroll_num,
            is_volunteer,
            status,
            apply_begin,
            apply_end,
            can_share,
            vTime
        } = this.state;
        if (!squad_name) { message.info('请输入名称'); return; }
        if (!summary) { message.info('请输入副标题'); return; }
        if (!begin_time) { message.info('请输入报名时间'); return; }
        if (!end_time) { message.info('请输入活动时间'); return; }
        const squad_img = (this.img && this.img.getValue()) || ''
        if (!squad_img) { message.info('请上传封面'); return; }
        // if(!location){ message.info('请输入活动地点'); return;}
        let myDate = new Date()
        if(myDate.getTime()>Date.parse(begin_time)){message.info('报名时间已过期，请重新输入活动时间'); return;}
        // if(today.getTime()>begin_time.getTime()){console.log('111')}else{controls.log('222')}
        const content = this.refs.editor.toHTML() || ''
        this.setState({ publishLoading: !this.state.publishLoading })
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
            can_share,
            resolved:(data)=>{
                message.success({
                    content:'提交成功',
                })
                this.setState({ publishLoading:false })
                        window.history.back()
            },
            rejected:(data)=>{
                message.error({
                    content:data,
                })
                this.setState({ publishLoading:false })
            }
        })

    }

    myUploadFn = (param) => {
        const { squad_img } = this.state
        // console.log('param',param);
        const serverURL = config.api + '/site/upload';//upload 是接口地址
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        let name = param.file.name
        const id = param.file.lastModified
        if (name.indexOf('.mp3') > -1)
            name = name.replace('.mp3', '')


        const successFn = (response) => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            // console.log('response:  ', response);
            //console.log('xhr.responseText', xhr.responseText);
            const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
            param.success({
                url: JSON.parse(xhr.responseText).resultBody,
                meta: {
                    id: id,
                    title: name || '',
                    alt: name || '',
                    loop: false, // 指定音视频是否循环播放
                    autoPlay: false, // 指定音视频是否自动播放
                    controls: true, // 指定音视频是否显示控制栏
                    poster: squad_img == '' ? '' : squad_img, // 指定视频播放器的封面
                    name: name || ''
                }
            })
        };

        const progressFn = (event) => {
            param.progress(event.loaded / event.total * 100)

        };

        const errorFn = (response) => {
            param.error({
                msg: '上传出错！请重试'
            })
        };

        xhr.upload.addEventListener("progress", progressFn, false);
        xhr.addEventListener("load", successFn, false);
        xhr.addEventListener("error", errorFn, false);
        xhr.addEventListener("abort", errorFn, false);

        fd.append('file', param.file);

        xhr.open('POST', serverURL, true);
        xhr.withCredentials = true;
        xhr.send(fd)
    };

    disabledDate = (current) => {
        return current < moment().subtract(1, 'day')
    }
    disabledEndDate = (current) => {
        const { vTime } = this.state
        if (!vTime)
            return true
        const startValue = vTime[0] || null;
        const endValue = vTime[1] || null;
        if (!startValue || !endValue) {
            return true;
        }
        return current < endValue.valueOf()
    }
    render() {
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
        const {

            squad_id,
            squad_name,
            squad_img,
            stype,
            begin_time,
            end_time,
            location,
            link,
            content,
            summary,
            enroll_num,
            is_volunteer,
            status,

            view_mode
        } = this.state;

        const locked = this.squad_info.beginTime < Date.parse(new Date()) / 1000

        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={
                            squad_id == '0' ?
                                '添加' : (view_mode ? '详情' : '编辑')
                        }
                    >
                        <Row>
                            <Col xs="12">

                                <Card type='inner'>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="标题">
                                            <Input disabled={view_mode} onChange={(e) => {
                                                this.setState({ squad_name: e.target.value })
                                            }} className="m_w400" value={squad_name} />
                                        </Form.Item>
                                        <Form.Item label="副标题">
                                            <TextArea disabled={view_mode} autoSize={{ minRows: 6 }} value={summary} onChange={e => {
                                                let summary = e.target.value.replace(/\s+/g, '')
                                                this.setState({ summary })
                                            }} className="m_w400" />
                                        </Form.Item>


                                        <Form.Item label="封面" help='130px * 72px'>
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                ref={ref => this.img = ref}
                                                disabled={view_mode}
                                                listType="picture-card"
                                                value={this.state.fileList}
                                                accept='image/*'
                                                maxLength={1}
                                            >
                                            </AntdOssUpload>
                                        </Form.Item>
                                        <Form.Item label='报名时间'>
                                            <DatePicker.RangePicker disabled={view_mode} allowClear={false} value={this.state.vTime} disabledDate={this.disabledDate} locale={locale} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }} onChange={(date, dateString) => {
                                                this.setState({
                                                    vTime: date,
                                                    aTime: null,
                                                    begin_time: '',
                                                    end_time: '',
                                                    apply_begin: dateString[0],
                                                    apply_end: dateString[1]
                                                })
                                            }} />
                                            {/*
                                                <p style={{color:"#ff7e7e",fontSize:'12px',lineHeight:'2'}}>
                                                    * 报名开始后无法再设置时间
                                                </p>
                                                */}
                                        </Form.Item>
                                        <Form.Item label="活动时间">
                                            <DatePicker.RangePicker disabled={view_mode} allowClear={false} disabledDate={this.disabledEndDate} value={this.state.aTime} locale={locale} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }} onChange={(date, dateString) => {
                                                console.log(date)
                                                this.setState({
                                                    aTime: date,
                                                    begin_time: dateString[0],
                                                    end_time: dateString[1]
                                                })
                                            }} />
                                            {/*
                                                <p style={{color:"#ff7e7e",fontSize:'12px',lineHeight:'2'}}>
                                                    * 活动开始后无法再设置时间
                                                </p>
                                                */}
                                        </Form.Item>

                                        <Form.Item label="招生人数">
                                            <InputNumber min={0} max={10000} disabled={view_mode} onChange={val => {
                                                if (val !== '' && !isNaN(val)) {
                                                    val = Math.round(val)
                                                    if (val < 0) val = 0
                                                    this.setState({ enroll_num: val })
                                                }
                                            }} value={enroll_num} />
                                        </Form.Item>
                                        <Form.Item label="活动地点">
                                            <Input disabled={view_mode} value={location} onChange={e => {
                                                this.setState({ location: e.target.value })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="是否分享">
                                            <Switch disabled={view_mode} checked={this.state.can_share == 1 ? true : false} onChange={(e) => {
                                                if (e) {
                                                    this.setState({ can_share: 1 })
                                                } else {
                                                    this.setState({ can_share: 0 })
                                                }
                                            }} />
                                        </Form.Item>
                                    </Form>
                                </Card>
                                <Card type='inner' className='mt_10'>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="详情">
                                            <Editor readOnly={view_mode} content={this.state.content} ref='editor' actions={this.props.actions}></Editor>
                                        </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button onClick={() => {
                                            window.history.go(-1)
                                        }}>取消</Button>&nbsp;
                                        {view_mode ? null :
                                            <Button onClick={this.state.publishLoading?null:this._onPublish} style={{ minWidth: '64px' }} type="primary">{this.state.publishLoading ? <Icon type="loading" style={{ fontSize: 24, color: '#fff' }} spin /> : '提交'}</Button>
                                        }
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ previewVisible: false })
                }}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}
const LayoutComponent = EditO2O;
const mapStateToProps = state => {
    return {
        squad_info: state.o2o.squad_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
