import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Divider, Table, Tag, List, Checkbox, Empty, Spin, Radio, InputNumber, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message, DatePicker } from 'antd';

import locale from 'antd/es/date-picker/locale/zh_CN';

import qrcode from '../../../assets/img/code.jpg'

import config from '../../../config/config';

import connectComponent from '../../../util/connect';
import qs from 'qs';

import BraftEditor from '../../../components/braft-editor'
// import BraftFinder from "../../components/braft-finder";
import moment from 'moment';
import _ from 'lodash'

import customUpload from '../../../components/customUpload'
import AntdOssUpload from '../../../components/AntdOssUpload';

const { Option } = Select;
const { Search, TextArea } = Input;

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


class AuthCourseEdit extends Component {

    state = {
        view_mode: false,
        roll_mode: false,

        publishLoading: false,

        fileList: [],
        mediaList: [],

        showImgPanel: false,
        previewImage: '',
        showTheBox: true,
        isVideoCourse: true,

        fetching: false,
        selectData: [],
        selectValue: [],
        checkValue: [],

        teacherFetching: false,
        selectTeacher: [],
        teacherData: [],
        second_category: [],

        ctype: 1,
        category_id: 0,
        ccategory_id: '',
        content: '',
        course_id: '0',
        course_img: '',
        course_name: '',
        flag: '',
        integral: '',
        is_recomm: '',
        room_id: '',
        sn: '',
        sort_order: 0,
        status: 0,
        summary: '',
        tag_ids: '',
        teacher_id: '0',

        course_link: '',
        isSeries: '0',
        begin_time: '',
        end_time: '',
        BeginTime: 0,
        EndTime: 0,
        media_id: '',
        duration: '',
        size: '',
        can_share: 0,
        stype: 1,
        is_must: 1,

        sellType: 1,

        dataSource: [
            {
                value: 0,
                level: '',
            }
        ],
        edit_level: 'LV1',
        edit_index: 0,
        edit_value: '',

        linkList: [1],
        selectValue: [],
        selectValue1: [],

        flag_select: 0,

        live_ad: [],
        live_goods: [],

        proType: 0

    };

    course_info = { liveStatus: 0 }
    category_list = []
    id = 0
    ctype = 18
    keyword = ''

    componentDidMount() {
        const { actions } = this.props
        const course_id = this.props.match.params.id + '';

        let _state = this.props.location.state
        if (typeof _state === 'undefined') {
            _state = { type: '' }
        } else if (_state.type === 'view') {
            this.setState({ view_mode: true })
        }

        if (course_id !== '0') {
            actions.getAuthCourse({ course_id })
            this.setState({ course_id })
        }
        actions.getAuthCate({ keyword: this.keyword, ctype: this.ctype })

    }
    componentWillReceiveProps(n_props) {
        if(n_props.auth_cate_list != this.props.auth_cate_list){
            this.category_list = n_props.auth_cate_list
        }
        if (n_props.auth_course_list !== this.props.auth_course_list) {
            this.course_info = n_props.auth_course_list.data[0]

            let _course_img = []
            let fileList = []
            let selectValue = []
            let flag_select = 1

            let checkValue = []

            let teacher_id = 0
            let images = []
            let imgList = []
            let tag_ids = []

            if (this.course_info.courseImg) {

                let imgs = this.course_info.courseImg.split(',')
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
            if (this.course_info.galleryList.length !== 0) {
                this.course_info.galleryList.map((ele, idx) => {

                    images.push(ele.link)

                    imgList.push({
                        response: { resultBody: ele.link },
                        uid: idx,
                        name: 'img' + idx,
                        status: 'done',
                        url: ele.link,
                        type: 'image/png'
                    })

                })

            }

            let mediaList = []
            if (this.course_info.mediaId !== '') {
                mediaList = [{ type: 'video/mp4', status: 'done', response: { resultBody: this.course_info.mediaId }, uid: 'dd', name: this.course_info.mediaId, url: '' }]
            }

            this.setState({
                is_must: this.course_info.isMust,
                // stype:this.course_info.stype,
                mediaList: mediaList,
                ccategory_id: this.course_info.ccategoryId,
                ctype: this.course_info.ctype,
                media_id: this.course_info.mediaId,

                course_id: this.course_info.courseId,
                flag: this.course_info.flag,
                teacher_id: teacher_id,
                fileList: fileList,
                course_name: this.course_info.courseName,
                summary: this.course_info.summary,
                course_img: this.course_info.courseImg,
                category_id: this.course_info.categoryId,

                category_name: this.course_info.category_name,
                sort_order: this.course_info.sortOrder,
                score: this.course_info.score,
                status: this.course_info.status,
                sn: this.course_info.sn,
                content: this.course_info.content,
                isSeries: this.course_info.isSeries + '',
                ttype: this.course_info.ttype,

                images: images.join(','),
                imgList: imgList,

                can_share: this.course_info.canShare
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


    onCourseImgChange = ({ file, fileList, event }) => {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.info('只能上传 JPG/PNG/GIF 文件!');
            return
        }

        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList: fileList,
            course_img: img.join(',')
        })

    }
    beforeMediaUpload(file, fileList) {
        const isMedia = file.type.indexOf('video') > -1
        return isMedia;
    }
    beforeUpload(file) {
        const isImg = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        return isImg;
    }

    onCourseMediaChange = ({ file, fileList }) => {
        console.log(file)
        const isMedia = file.type.indexOf('video') > -1

        if (!isMedia) {
            message.error('只能上传视频文件!');
            return;
        }

        let media_id = ''
        let size = ''
        let mediaList = fileList
        console.log(file)
        if (file.status == 'done') {
            media_id = file.response.data.videoId
            message.info('上传成功')
            size = (file.size / 1000000).toFixed(2)
            this.setState({
                size
            })
        } else if (file.status == 'error') {
            message.info('上传失败')
        }

        this.setState({
            mediaList,
            media_id
        })
    };

    onCheckBox = (val) => {
        const checkValue = val
        const flag = '/' + val.join('/') + '/';
        this.setState({
            flag,
            checkValue
        })
    }

    onPublish = () => {
        const { media_id } = this.state
        const { actions } = this.props
        this.setState({loading:true})

        if (media_id || media_id !== '')
            actions.mediaAction({
                video_id: media_id,
                action: 'info',
                resolved: (data) => {
                    let duration = data.duration
                    let size = data.size
                    this.setState({ duration, size })
                },
                rejected: (data) => {
                    this.setState({loading:false})
                    message.error('获取视频时长信息出错，请重新上传')
                }
            })
        setTimeout(() => {
            if(this._onPublish()==false){
                this.setState({loading:false})
            }
        }, 1000)
    }
    _onPublish = () => {

        let {
            ctype,
            category_id,
            content,
            course_id,
            course_name,
            flag,
            integral,
            is_recomm,
            room_id,
            sort_order,
            status,
            summary,
            teacher_id,
            sn,
            selectValue,
            isSeries,
            begin_time,
            end_time,
            media_id,
            ccategory_id,
            tag_ids,
            duration,
            size,

            can_share,
            stype,
            is_must,
        } = this.state;

        const { actions } = this.props
        // const flag = this.refs.personType.getValue()
        // const that = this
        // if(flag===null){
        //     return;
        // }
        const course_img = (this.media&&this.media.getValue())||''

        if (!course_name) { message.info('请输入课程名称'); return false; }
        if (!summary) { message.info('请输入课程摘要'); return false; }
        // if(!teacher_id || teacher_id == 0){ message.info('请选择讲师'); return;}

        if (!course_img) { message.info('请上传主图'); return false; }

        if (category_id == '' || category_id == 0) { message.info('请选择课程分类'); return false; }
        if (media_id == '') { message.info('请上传视频'); return false; }

        if (sort_order > 9999) { message.info('课程排序不能大于9999'); return false; }
        if (!sn) { message.info('请输入课程编号'); return false; }
        if (!content) { message.info('请输入课程详情'); return false; }

        
        actions.publishAuthCourse({
            ctype,
            category_id,
            content,
            course_id,
            course_img,
            course_name,
            flag,
            integral,
            is_recomm,
            room_id,
            sort_order,
            status,
            summary,
            tag_ids,
            teacher_id,
            sn,
            is_series: isSeries,
            begin_time,
            end_time,
            media_id,
            ccategory_id,
            duration,
            size,
            can_share,
            stype,
            is_must,
            resolved: (data) => {
                console.log(data)

                // if(flag==='/I/')
                //     that.refs.personType.uploadFile(data.courseId,this.props.actions)
                // else
                message.success({
                    content: '提交成功',
                    onClose: () => {
                        this.setState({ loading: false })
                        window.history.back()
                    }
                })
            },
            rejected: (data) => {
                this.setState({loading:false})
                if (data.toString().indexOf('query did not return a unique result') > -1) {
                    message.info('课程编号已存在，请重新输入')
                } else {
                    message.error({
                        content: data
                    })
                }

            }
        })

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
        const uploadBtnVideoRoll = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传视频</div>
            </div>
        )

        const {
            fetching,
            selectData,
            selectValue,
            checkValue,
            teacherFetching,
            selectTeacher,
            teacherData,

            ctype,
            category_id,
            content,
            course_id,
            course_img,
            course_name,
            integral,
            is_recomm,
            room_id,
            sort_order,
            status,
            summary,
            teacher_id,
            view_mode,
            can_share,
            is_must,
        } = this.state;

        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={
                            course_id == '0' ? '创建课程' : (view_mode ? '课程详情' : '编辑课程')
                        }
                    >
                        <Row>
                            <Col xs="12">
                                <Card type='inner'>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="课程名称">
                                            <Input disabled={view_mode} onChange={(e) => {
                                                this.setState({ course_name: e.target.value })
                                            }} className="m_w400" value={course_name} />
                                        </Form.Item>
                                        <Form.Item label="摘要">
                                            <TextArea disabled={view_mode} autoSize={{ minRows: 6 }} value={summary} onChange={e => {
                                                let summary = e.target.value.replace(/\s+/g, '')
                                                this.setState({ summary })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="主图">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                ref={ref=>this.media=ref}
                                                maxLength={1}
                                                value={this.state.fileList}
                                                disabled={view_mode}
                                                tip='上传图片'
                                                accept='image/*'
                                                listType="picture-card"
                                            ></AntdOssUpload>
                                            <span style={{ marginTop: '-30px', display: 'block' }}>(130px * 72px)</span>
                                        </Form.Item>
                                        <Form.Item label="分类">
                                            <Select value={this.state.category_id} disabled={view_mode} className='m_w400' onChange={val => {
                                                this.setState({ category_id: val })
                                            }}>
                                                <Select.Option value={0}>无</Select.Option>
                                                {this.category_list.map(ele => (
                                                    <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="上传视频">
                                            
                                            <Upload
                                                disabled={view_mode}
                                                accept='video/mp4'
                                                listType="picture-card"
                                                fileList={this.state.mediaList}
                                                onChange={this.onCourseMediaChange}
                                                beforeUpload={this.beforeMediaUpload}
                                                customRequest={customUpload}
                                            >
                                                {this.state.mediaList.length >= 1 ? null : uploadBtnVideoRoll}
                                            </Upload>
                                            <span>媒体ID ：{this.state.media_id}</span>
                                        </Form.Item>
                                        {!this.state.view_mode ? null :
                                            <Form.Item label='时长'>
                                                {this.course_info.duration}秒
                                            </Form.Item>
                                        }
                                        {!this.state.view_mode ? null :
                                            <Form.Item label='视频大小'>
                                                {this.course_info.size}MB
                                            </Form.Item>
                                        }
                                        <Form.Item label="课程编号">
                                            <Input disabled={view_mode} value={this.state.sn} onChange={e => {
                                                this.setState({ sn: e.target.value })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="是否上架">
                                            <Switch disabled={view_mode} checked={status == 1 ? true : false} onChange={(e) => {
                                                if (e) {
                                                    this.setState({ status: 1 })
                                                } else {
                                                    this.setState({ status: 0 })
                                                }
                                            }} />
                                        </Form.Item>
                                        <Form.Item label="课程类型">
                                            <Radio.Group  disabled={view_mode}  value={is_must} onChange={e => {
                                                this.setState({
                                                    is_must: e.target.value
                                                })
                                            }}>
                                                <Radio value={1}>必修</Radio>
                                                <Radio value={0}>选修</Radio>
                                                
                                            </Radio.Group>
                                        </Form.Item>

                                        <Form.Item label="课程详情">
                                            <TextArea disabled={view_mode} autoSize={{ minRows: 6 }} value={content} onChange={e => { this.setState({ content: e.target.value }) }} />
                                        </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button onClick={() => {
                                            window.history.go(-1)
                                        }}>取消</Button>&nbsp;
                                                {/*
                                                <Button type="primary" ghost onClick={()=>{this.setState({coursePreviewVisible:true})}}>预览</Button>
                                                &nbsp;
                                                */}
                                        {view_mode ? null :
                                            <Button loading={this.state.loading} onClick={this.onPublish} style={{ minWidth: '64px' }} type="primary">提交</Button>
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

                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => { this.setState({ showImgPanel: false }) }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}
const LayoutComponent = AuthCourseEdit;
const mapStateToProps = state => {
    return {
        auth_course_list: state.auth.auth_course_list,
        auth_cate_list: state.auth.auth_cate_list,
        course_info: state.course.course_info,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
