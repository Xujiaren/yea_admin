import React, { Component } from 'react';
import { Badge, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Radio, InputNumber, Steps, Form, Modal, Upload, Avatar, Card, Select, PageHeader, DatePicker, Menu, Dropdown, Button, Icon, message, Input, Pagination, Descriptions, List } from 'antd';

import connectComponent from '../../../util/connect';
import config from '../../../config/config'
import AntdOssUpload from '../../../components/AntdOssUpload';
import SwitchCom from '../../../components/SwitchCom'
import moment from 'moment';
const { Option } = Select
const { TextArea } = Input;
const { Step } = Steps;

const steps = [
    {
        title: '第一步'
    },
    {
        title: '第二步'
    }
];

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
class EditTeacher extends Component {

    teacher_info = {
        user: {
            avatar: ''
        }
    }
    field_data = [
        '精神文化类',
        '专业技能类',
        '团队建设类',
        '产品推广类'
    ]
    state = {
        view_mode: false,

        loading: false,

        previewVisible: false,
        previewImage: '',

        fileList: [],
        fileList1: [],
        fileList2: [],
        re_avatar: [],

        imageUrl: '',
        img_avatar: '',
        showBindUser: false,
        current: 0,

        content: '',
        honor: '',
        level: 3,
        mobile: '',
        sex: 0,
        teacher_img: '',
        teacher_user_img: '',
        gallery: '',
        teacher_name: '',
        teacher_id: 0,
        cover: '',
        recommIndex: 10,

        user_id: 0,
        video: '',
        status: 1,
        teaching_field: [],
        is_perfect: 0,
        validating: false,
        userBySnList: [],
        sn: '',
        ktyp: 0,
        workSn: '',
        begin_time: '',
        BeginTime: null,
        end_time: '',
        EndTime: null,
        wtype: 0
    };

    onImgChange = ({ fileList }) => {
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList: fileList,
            teacher_user_img: img.join(',')
        })
    };
    onReImgChange = ({ fileList }) => {
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList1: fileList,
            teacher_img: img.join(',')
        })
    };
    onShowImgChange = ({ fileList }) => {
        console.log(fileList)
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList2: fileList,
            gallery: img.join(',')
        })
    };

    componentDidMount() {
        const teacher_id = this.props.match.params.id;
        const { actions } = this.props;
        console.log(teacher_id)
        if (parseInt(teacher_id) !== 0) {
            actions.getTeacherInfo(teacher_id)
        }
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.teacher_info !== this.props.teacher_info) {
            console.log(nextProps.teacher_info)
            if (!Object.keys(nextProps.teacher_info).includes('teacherId')) {
                return;
            }
            this.teacher_info = { ...nextProps.teacher_info }
            console.log(this.teacher_info)

            let _teacher_img = []
            let _teacher_user_img = []
            let teacher_id = 0
            _teacher_img.push({ type: 'image/png', uid: '-1', name: 'img', status: 'done', url: this.teacher_info.teacherImg })
            if (this.teacher_info.user == null) {

            } else {
                _teacher_user_img.push({ type: 'image/png', uid: '-1', name: 'img_user', status: 'done', url: this.teacher_info.user['avatar'] })
            }

            let imgs = this.teacher_info.imgs
            let _imgs = []
            let _gallery = []
            let teaching_field = []
            if (this.teacher_info.teachingField && this.teacher_info.teachingField !== '') {
                teaching_field = this.teacher_info.teachingField.split(',') || []
            }
            if (imgs.length > 0) {
                imgs.map((ele, idx) => {
                    _gallery.push(ele.fpath)
                    _imgs.push({ type: 'image/png', response: { resultBody: ele.fpath }, uid: idx, name: 'img' + idx, status: 'done', url: ele.fpath })
                })
            }
            let begin_time = moment.unix(this.teacher_info.beginTime).format('YYYY-MM-DD')
            let BeginTime = moment(begin_time)
            let end_time = moment.unix(this.teacher_info.endTime).format('YYYY-MM-DD')
            let EndTime = moment(end_time)
            if (this.teacher_info.teacherId)
                teacher_id = this.teacher_info.teacherId
            this.setState({
                sn: this.teacher_info.sn,
                workSn:this.teacher_info.workSn,
                is_perfect: this.teacher_info.isPerfect,
                teaching_field: teaching_field,
                gallery: _gallery.join(','),
                teacher_img: this.teacher_info.teacherImg,
                wtype:this.teacher_info.wtype,
                fileList: _teacher_user_img,
                fileList1: _teacher_img,
                fileList2: _imgs,
                begin_time: begin_time,
                BeginTime: BeginTime,
                end_time: end_time,
                EndTime: EndTime,

                teacher_name: this.teacher_info.teacherName,
                teacher_id: teacher_id,
                user_id: this.teacher_info.userId,
                content: this.teacher_info.content,
                honor: this.teacher_info.honor,
                level: this.teacher_info.level,
                mobile: this.teacher_info.mobile,
                sex: this.teacher_info.sex,
                status: this.teacher_info.status,
                recommIndex: this.teacher_info.recommIndex
            })
        }

    }
    _onPublish = () => {
        let {
            content,
            honor,
            level,
            mobile,
            sex,
            teacher_name,
            teacher_id,
            video,
            status,
            begin_time,
            teaching_field,
            is_perfect,
            user_id,
            recommIndex,
            sn,
            workSn,
            end_time,
            wtype
        } = this.state;
        let teacher_img = ''
        let teacher_user_img = ''
        let gallery = ''
        if (!user_id || user_id == '') {
            sn = ''
        }
        if (this.imgAvatar) {
            teacher_user_img = this.imgAvatar.getValue()
        }
        if (this.img) {
            teacher_img = this.img.getValue()
        }
        if (this.images) {
            gallery = this.images.getValue()
        }

        if (!teacher_img) { message.info('请上传头像'); return; }
        if (!teacher_user_img) { message.info('请上传推荐位头像'); return; }
        if (!teacher_name) { message.info('请输入讲师名字'); return; }
        if (!mobile) { message.info('手机号不能为空'); return; }
        if (!gallery) { message.info('讲师展示页不能为空'); return; }
        if (!content) { message.info('讲师介绍不能为空'); return; }

        let telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        if (!telStr.test(mobile)) {
            message.info('手机号码不规范'); return;
        }
        if (teaching_field.length == 0) {
            teaching_field = ''
        } else {
            teaching_field = teaching_field.join(',')
        }
        const { actions } = this.props;
        console.log(sn)
        actions.publishTeacher({
            content,
            gallery,
            honor,
            level,
            mobile,
            sex,
            teacher_img,
            teacher_user_img,
            teacher_name,

            teacher_id,
            user_id,
            //          video,
            status,
            recommIndex,
            teaching_field,
            is_perfect,
            sn,
            work_sn:workSn,
            beginTime:begin_time,
            endTime: end_time,
            wtype:wtype,
            resolved: (data) => {
                console.log(data)
                if (data == '该用户已绑定教师')
                    message.info(JSON.stringify(data))
                else
                    message.success({
                        content: "操作成功",
                        onClose: () => {
                            window.history.back()
                        }
                    });
            },
            rejected: (data) => {

                message.error({
                    content: data || '修改失败，ErrorCode:1'
                });
            },
        })
    }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    showBindUser(index) {
        this.setState({
            showBindUser: true
        })
    }
    hideBindUser = () => {
        this.setState({
            showBindUser: false
        })
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };
    handleChangeAvatar = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    img_avatar: imageUrl,
                    loading: false,
                }),
            );
        }
    };

    handleCancelModal = () => this.setState({ previewVisible: false });
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    handleChangeModal = ({ fileList }) => {
        this.setState({ teacher_img: fileList })
    };
    _onTeacherField = () => {
        if (!this.input_value) {
            message.info("请输入内容再添加");
            return;
        }
        console.log(this.input_value)
        this.setState(pre => {
            pre.teaching_field.push(this.input_value)
            return { teaching_field: pre.teaching_field }
        })
        // this.setState({ teaching_field:[this.state.teaching_field,this.input_value] })
    }
    _onBlur = (e) => {
        if (e.target.value && e.target.value !== '') {

            this.setState({ validating: true })
            this.props.actions.getUserBySn({
                sn: e.target.value,
                resolved: (data) => {
                    console.log(data)
                    if (data instanceof Array) {
                        if (data.length > 1) {
                            this.setState({ showBindUser: true, userBySnList: data })
                        } else if (data.length == 1) {
                            this.setUser(data[0])
                        } else {
                            this.setState({ tips: '未匹配到用户', validating: false })
                        }
                        this.setState({ validating: false })
                    } else {
                        this.setState({ tips: '未匹配到用户', validating: false })
                    }
                    // if(data&&data instanceof Array){
                    //     if(total == 1 && list.length !== 0){
                    //         let {nickname:name,sex,mobile:phone} = list[0]
                    //         let tips = '',validating = false
                    //         this.setState({ name,sex,phone,tips,validating })
                    //     }else{
                    //         this.setState({ tips:'未匹配到用户',validating:false })
                    //     }
                    // }
                },
                rejected: (data) => {
                    this.setState({ validating: false })
                    message.error(JSON.stringify(data))
                }
            })
        } else {
            this.setState({ tips: '' })
        }

    }
    render() {
        const {
            content,
            honor,
            level,
            mobile,
            sex,
            teacherImg,
            teacher_id,
            teacher_name,
            current,
            view_mode,
        } = this.state;

        const uploadButton = (txt) => (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{txt}</div>

            </div>
        );
        const uploadButtonImg = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );

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
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardBody className="pad_0">
                        <PageHeader
                            className="pad_0"
                            ghost={false}
                            onBack={() => window.history.back()}
                            title=""
                            subTitle={this.state.teacher_id == 0 ? '添加讲师' : "编辑讲师"}
                        >
                            <Card className="add" type="inner" title="基本信息">
                                <Form {...formItemLayout}>
                                    <Form.Item label="讲师类型" >
                                        <Select style={{ width: '100px' }} value={this.state.wtype} onChange={(e) => {
                                            this.setState({
                                                wtype: e,
                                            })
                                        }}>
                                            <Select.Option value={0}>无</Select.Option>
                                            <Select.Option value={1}>经销商</Select.Option>
                                            <Select.Option value={2}>外部讲师</Select.Option>
                                            <Select.Option value={3}>内部讲师</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="卡号"
                                        placeholder='搜索'
                                        hasFeedback={this.state.tips ? true : false}
                                        help={this.state.tips ? this.state.tips : ''}
                                        validateStatus={this.state.validating ? 'validating' : ''}
                                    >


                                        <Input onBlur={this._onBlur} disabled={view_mode} value={this.state.sn} onChange={e => this.setState({ sn: e.target.value })} className='m_w400' />


                                    </Form.Item>
                                    <Form.Item
                                        label="工号"
                                        placeholder='搜索'
                                        hasFeedback={this.state.tips ? true : false}
                                        help={this.state.tips ? this.state.tips : ''}
                                        validateStatus={this.state.validating ? 'validating' : ''}
                                    >
                                        <Input onBlur={this._onBlur} disabled={view_mode} value={this.state.workSn} onChange={e => this.setState({ workSn: e.target.value })} className='m_w400' />
                                    </Form.Item>
                                    <Form.Item label="头像 (JPG/PNG)" >
                                        <AntdOssUpload
                                            actions={this.props.actions}
                                            listType="picture-card"
                                            value={this.state.fileList}
                                            accept='image/*'
                                            ref={ref => this.imgAvatar = ref}
                                        >
                                        </AntdOssUpload>
                                        <span style={{ marginTop: '-30px', display: 'block' }}>(60px * 60px)</span>
                                    </Form.Item>
                                    <Form.Item label="推荐位头像 (JPG/PNG)">
                                        <AntdOssUpload
                                            actions={this.props.actions}
                                            listType="picture-card"
                                            value={this.state.fileList1}
                                            accept='image/*'
                                            ref={ref => this.img = ref}
                                        >
                                        </AntdOssUpload>
                                        <span style={{ marginTop: '-30px', display: 'block' }}>(90px * 110px)</span>
                                    </Form.Item>
                                    <Form.Item label="名字">
                                        <Input value={teacher_name} onChange={(e) => { this.setState({ teacher_name: e.target.value }) }} className="m_w400" />
                                    </Form.Item>
                                    <Form.Item label="手机号码">
                                        <Input maxLength={11} value={mobile} onChange={(e) => { this.setState({ mobile: e.target.value }) }} className="m_w400" />
                                    </Form.Item>
                                    <Form.Item label="讲师头衔">
                                        <Input value={honor} onChange={(e) => { this.setState({ honor: e.target.value }) }} className="m_w400" />
                                        <div style={{ color: '#333', fontSize: '12px' }}>*  建议不超过6个字数</div>
                                    </Form.Item>
                                    <Form.Item label="聘用时间">
                                        <DatePicker
                                            key='t_5'
                                            disabledDate={this.disabledDate}
                                            format={'YYYY-MM-DD'}
                                            placeholder="选择开始时间"
                                            onChange={(val, dateString) => {
                                                this.setState({
                                                    begin_time: dateString,
                                                    BeginTime: val
                                                })
                                            }}
                                            value={this.state.BeginTime}
                                            // showTime={{ format: 'HH:mm' }}
                                            allowClear={false}
                                        />
                                    </Form.Item>
                                    <Form.Item label="到期时间">
                                        <DatePicker
                                            key='t_5'
                                            disabledDate={this.disabledDate}
                                            format={'YYYY-MM-DD'}
                                            placeholder="选择开始时间"
                                            onChange={(val, dateString) => {
                                                this.setState({
                                                    end_time: dateString,
                                                    EndTime: val
                                                })
                                            }}
                                            value={this.state.EndTime}
                                            // showTime={{ format: 'HH:mm' }}
                                            allowClear={false}
                                        />
                                    </Form.Item>
                                    <Form.Item label='是否曾为完美授课讲师'>
                                        <SwitchCom value={this.state.is_perfect} onChange={is_perfect => this.setState({ is_perfect })}></SwitchCom>
                                    </Form.Item>
                                    <Form.Item label="授课领域">
                                        <Input.Group compact>
                                            <Select
                                                disabled={view_mode}
                                                mode="multiple"
                                                value={this.state.teaching_field}
                                                placeholder="输入授课领域"
                                                onSearch={(value) => {
                                                    this.input_value = value
                                                }}
                                                onChange={(teaching_field) => {
                                                    console.log(teaching_field)
                                                    this.setState({ teaching_field })
                                                }}
                                                style={{ width: '300px' }}
                                            >
                                                {this.field_data.map(ele => (
                                                    <Option value={ele} key={ele}>{ele}</Option>
                                                ))}
                                            </Select>
                                            {view_mode ? null :
                                                <Button onClick={this._onTeacherField}>添加</Button>
                                            }
                                        </Input.Group>
                                    </Form.Item>
                                    <Form.Item label="性别">
                                        <Select value={sex} onChange={(val) => { this.setState({ sex: val }) }} defaultValue={0} className="m_w400">
                                            <Option value={0}>男</Option>
                                            <Option value={1}>女</Option>
                                            <Option value={2}>未知</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="当前等级">
                                        <Select value={level} onChange={(val) => { this.setState({ level: val }) }} defaultValue={3} className="m_w400">
                                            <Option value={0}>讲师</Option>
                                            <Option value={1}>初级讲师</Option>
                                            <Option value={2}>中级讲师</Option>
                                            <Option value={3}>高级讲师</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="讲师展示页 (JPG/PNG)">
                                        <AntdOssUpload
                                            actions={this.props.actions}
                                            ref={ref => this.images = ref}
                                            listType="picture-card"
                                            value={this.state.fileList2}
                                            maxLength={5}
                                            accept='image/*'
                                        >
                                        </AntdOssUpload>
                                        <span style={{ marginTop: '-30px', display: 'block' }}>(375px * 208px)</span>
                                    </Form.Item>

                                    <Form.Item label="讲师介绍">
                                        <TextArea rows={6} value={content} onChange={(val) => { this.setState({ content: val.target.value }) }} className="m_w400" />
                                    </Form.Item>
                                </Form>
                                <div className="flex f_row j_center mt_20">
                                    <Button onClick={() => window.history.back()}>取消</Button>&nbsp;
                                    {/*
                                    <Button type="primary" onClick={this.showBindUser.bind(this)}>提交</Button>
                                */}
                                    <Button type="primary" onClick={this._onPublish}>提交</Button>
                                </div>
                            </Card>

                        </PageHeader>
                    </CardBody>
                </Card>

                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>

                <Modal
                    title="请选择要绑定的用户"
                    visible={this.state.showBindUser}
                    footer={null}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideBindUser}
                    bodyStyle={{ padding: "10px" }}
                >
                    <List>
                        {this.state.userBySnList.map(ele => {
                            return <List.Item onClick={this.setUser.bind(this, ele)}>{ele.username}【{ele.isAuth ? '无' : ele.isPrimary ? '正卡' : '副卡'}】</List.Item>
                        })}
                    </List>
                </Modal>
            </div>
        );
    }
    setUser = (user) => {
        console.log(user)
        const { avatar, username, mobile, sex, userId } = user
        let fileList = []
        if (avatar)
            fileList = [{
                uid: Math.random().toString(),
                url: avatar || '',
                status: 'done',
                type: 'image/png'
            }]

        this.setState({
            tips: '',
            fileList,
            teacher_name: username,
            mobile,
            sex,
            user_id: userId,
        })
    }
}

const LayoutComponent = EditTeacher;
const mapStateToProps = state => {
    return {
        teacher_list: state.teacher.teacher_list,
        teacher_info: state.teacher.teacher_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });