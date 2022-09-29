import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Tag, Empty, Checkbox, Spin, TimePicker, DatePicker, Radio, InputNumber, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import debounce from 'lodash/debounce';
import connectComponent from '../../../util/connect';
import AntdOssUpload from '../../../components/AntdOssUpload'

import qrcode from '../../../assets/img/code.jpg'
import config from '../../../config/config'

const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
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

class EditMsg extends Component {
    constructor(props) {
        super(props);
        this.input_value = ''
    }
    tmp_list = []
    state = {
        view_mode: false,
        fileList: [],
        fileList_1: [],
        previewVisible: false,
        previewImage: '',
        editorState: null,
        showTheBox: true,
        isVideoCourse: true,
        openSubscribe: true,
        isManual: false,
        isTick: '0',
        fetching: false,
        selectData: [],
        selectValue: [],
        targetUser: true,

        flag_select: 0,
        checkValue: [],
        _beginTime: null,

        content: '',
        flag: '',
        link: '',
        message_id: '0',
        p_intro: '0',
        p_time: '',
        ptype: 0,
        status: '',
        summary: '',
        title: '',
        etype: 41,

        image: '',
        imageList: [],

        tmp_item: [{ summary: '', content: '' }],

        coursePreviewVisible: false,
        ltype: 0,
        excelFileList: [],
        importLoading: false,
        checkLevelValue: [],
        class_list: [],
        fetching: false,
        squadId: '',
    };
    squad_import_user = []
    componentWillReceiveProps(n_props) {
        if (n_props.tmp_list !== this.props.tmp_list) {
            this.tmp_list = n_props.tmp_list || []
            const selectData = this.tmp_list.map((ele, idx) => {
                return {
                    key: idx,
                    label: ele.title,
                    summary: ele.summary,
                    content: ele.content
                }
            })
            this.setState({
                selectData,
                fetching: false
            });
        }
    }
    componentDidMount() {
        this.fetchTmp()
        this.getO2OClass()
        const { index, view } = this.props.match.params
        if (index == '-1') {

        } else if (Object.keys(this.props.msg_list).length == 0) {
            window.history.back()
        } else {

            let view_mode = false
            let item = this.props.msg_list.data[index]
            let p_time = moment.unix(item.ptime).format('YYYY-MM-DD HH:mm')
            let checkValue = []
            let flag_select = 0

            if (view && view == 1) {
                view_mode = true
            }
            if (item.flag) {
                checkValue = item.flag.split('/')
                checkValue.pop()
                checkValue.shift()
            }
            console.log(item.flag, '???')
            if (!item.flag)
                    flag_select = 0
                else if (item.flag === '/2/')
                    flag_select = 1
                else if (item.flag === '/NONE/')
                    flag_select = 4
                if (item.flag === '/cus/') {
                    this.setState({
                        ltype: 1
                    })
                }
                if(item.flag !== '/cus/'&&item.flag&&item.flag !== '/2/'&&item.flag !== '/NONE/'&&item.flag.indexOf('L-') == -1&&item.flag.indexOf('squad-') == -1){
                    flag_select = 2
                }
                if (item.flag.indexOf('L-') > -1) {
                    flag_select = 5
                    let checkValue = item.flag.split('/')
                    this.setState({
                        checkLevelValue: checkValue
                    })
                }
                if (item.flag.indexOf('squad-') > -1) {
                    flag_select = 6
                }

            console.log(flag_select, '///')
            this.setState({
                view_mode,
                _beginTime: moment(p_time, 'YYYY-MM-DD HH:mm'),
                checkValue: checkValue,
                flag_select: flag_select,

                content: item.content,
                flag: item.flag,
                link: item.link,
                message_id: item.messageId,
                p_intro: item.pintro,
                p_time: p_time,
                ptype: item.ptype,
                status: item.status,
                summary: item.summary,
                title: item.title,
                etype: item.etype == 0 ? 41 : item.etype,

                imageList: item.messageImg ? [{
                    status: 'done',
                    type: 'image/png',
                    url: item.messageImg,
                    uid: 'uid'
                }] : []
            })
        }
    }
    getO2OClass = () => {
        this.setState({ class_list: [], fetching: true });
        this.props.actions && this.props.actions.getO2OClass({
            stype: 0, status: -1, keyword: '', page: 0, pageSize: 10,
            resolved: (res) => {
                console.log(res)
                const { data } = res
                if (data) {
                    if (Array.isArray(data))
                        this.setState({ class_list: data, fetching: false })
                }
            },
            rejected: (res) => {
                this.setState({ fetching: false })
                message.error(JSON.stringify(res))
            }
        })
    }
    _onPreview = () => {

        let {
            flag, content, link, message_id, p_intro, p_time, ptype, status, summary, title
        } = this.state

        if (!title) { message.info('请输入标题'); return; }
        if (!summary) { message.info('请输入摘要'); return; }
        if (!content) { message.info('请输入正文'); return; }

        this.setState({ coursePreviewVisible: true })
    }
    importUser = () => {

    }
    _onPublish = () => {
        let {
            etype, _beginTime, isTick, flag, content, link, message_id, p_intro, excelFileList, p_time, ptype, status, summary, title, ltype
        } = this.state
        let message_img = ''

        if (this.img) { message_img = this.img.getValue() || '' }

        if (!title) { message.info('请输入标题'); return; }
        if (!summary) { message.info('请输入摘要'); return; }
        if (!content) { message.info('请输入正文'); return; }
        if (isTick == '1' && p_time == '') { message.info('请选择时间'); return; }
        if (isTick == '1' && _beginTime <= moment()) {
            message.info('推送时间不能小于当前时间');
            return;
        }
        let flags = flag
        if (ltype == 1) {
            flags = '/cus/'
        }
        let file_url = ''
        if (ltype == 1) {
            file_url = this.excelFile.getValue()
        }

        const { actions } = this.props
        this.setState({ importLoading: true })
        actions.publishMsg({
            etype, message_img, message_id, flag: flags, content, link, p_intro, p_time, ptype, status, summary, title,
            resolved: (data) => {
                if (etype > 40 && ptype == 2 && flags) {
                    actions.SendRemind({
                        message_id: data.messageId,
                        resolved: (res) => {
                            console.log(res)
                        },
                        rejected: (err) => {
                            console.log(err)
                        }
                    })
                }
                if (ltype == 1) {
                    const { excelFileList } = this.state;
                    const that = this
                    let file = new FormData();

                    file.append('file', excelFileList[0]);
                    // file.append('squad_id', this.squad_id)
                    actions.postMess({
                        file_url: file_url,
                        messageId: data.messageId,
                        resolved: (data) => {
                            if (Object.keys(data).indexOf('fail') > -1) {
                                // that.setState({ importLoading: false, excelFileList: [] }, () => {
                                //     let rejectedUser = []
                                //     Object.keys(data.fail).map(ele => {
                                //         rejectedUser.push(data.fail[ele])
                                //     })

                                //     that.setState({
                                //         success: data.success,
                                //         total: data.total,
                                //         publishLoading: false,
                                //         showResult: true,
                                //         rejectedUser: rejectedUser
                                //     })


                                // })
                                message.success({ content: '操作成功' })
                                window.history.back()
                            } else {
                                message.error('导入失败 ，请参考Excel导入模版')
                                this.setState({ importLoading: false })
                            }
                        },
                        rejected: (data) => {
                            this.setState({ importLoading: false })
                            message.error('导入失败 ，请参考Excel导入模版')
                        }
                    })
                } else {
                    this.setState({ importLoading: false })
                    message.success({
                        content: '提交成功',
                        onClose: () => {
                            window.history.back()
                        }
                    })
                }

            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    onSquad = (val) => {
        this.props.actions.forNumber({
            input:val,
            resolved:(res)=>{
                let flags = "squad-" + res
                this.setState({
                    squadId: val,
                    flag: flags
                })
            }
        })
       
    }
    onCheckLevelBox = (checkValue) => {
        let fla = '/' + checkValue.join('/') + '/';
        console.log(fla)
        this.setState({
            checkLevelValue: checkValue,
            flag: fla
        })
    }
    onSelected = (value) => {
        if (value == 2) {
            this.setState({
                flag_select: 2
            })
        } else if (value == 1) {
            this.setState({
                flag: '/2/',
                flag_select: 1
            })
        } else if (value === 4) {
            this.setState({
                flag: '/NONE/',
                flag_select: 4
            })
        } else if (value === 5) {
            this.setState({
                flag: '',
                flag_select: 5
            })
        } else if (value === 6) {
            this.setState({
                flag: '',
                flag_select: 6
            })
        } else {
            this.setState({
                flag: '',
                flag_select: 0
            })
        }
    }
    onCheckBox = (val) => {
        let flag = '/' + val.join('/') + '/';
        this.setState({
            flag: flag,
            checkValue: val
        })
    }
    disabledDate = (current) => {
        return current < moment().subtract(1, 'day')
    }
    onPushTime = (val, dateString) => {

        this.setState({
            p_time: dateString,
            _beginTime: val
        })
    }
    onChangeTmp = selectValue => {
        console.log(selectValue)
        const { selectData } = this.state
        let { key } = selectValue
        let summary = ''
        let content = ''
        if (key !== ' ') {
            summary = selectData[key].summary
            content = selectData[key].content
        }
        this.setState({
            content,
            summary,
            selectValue
        });
    };

    addTmp = () => {

        if (!this.input_value) {
            message.info("请输入内容再提交");
            return;
        }
        if (this.state.selectValue.length >= 1) {
            message.info('只能添加一个模板')
            return
        }
        let selectValue = this.state.selectValue;

        selectValue.push({ key: Math.floor(Math.random() * 100), label: this.input_value });
        this.setState({ selectValue });
        this.input_value = ''
    }
    targetUser = value => {
        if (value == '0') {
            this.setState({
                targetUser: true
            })
        } else {
            this.setState({
                targetUser: false
            })
        }
    }

    fetchTmp = () => {
        const { actions } = this.props
        actions.getTmp()
    };
    pushType = (isTick) => {
        let { p_time } = this.state
        if (isTick == '0') {
            p_time = ''
        }
        this.setState({ p_time, isTick })
    }
    openSubscribe = (checked) => {
        if (checked) {
            this.setState({
                openSubscribe: !this.state.openSubscribe
            })
        } else {
            this.setState({
                openSubscribe: !this.state.openSubscribe
            })
        }
    }
    isManual = (value) => {
        if (value == 0) {
            this.setState({
                isManual: true
            })
        } else {
            this.setState({
                isManual: false
            })
        }
    }
    onCourseSelected = (value) => {
        if (value == 0) {
            this.setState({
                isVideoCourse: true
            })
        } else {
            this.setState({
                isVideoCourse: false
            })
        }
    }
    beforeUploadExcel = file => {

        if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            message.info('请上传xlsx格式的文件')
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
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    handleCancelModal = () => this.setState({ previewVisible: false });
    handleCancelCourse = () => this.setState({ coursePreviewVisible: false });

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
        const push_type = ['商城订单提醒', '新用户消息', '返还用户消息', '直播预约消息', '优惠券过期消息', '系统提醒', '交互提醒']
        const push_way = ['手机短信', '微信', '站内', '锁屏']
        const options = [
            { label: '直销员', value: '1' },
            { label: '服务中心员工', value: '3' },
            { label: '店主', value: '4' },
            { label: '优惠顾客', value: '5' },
            { label: '初级经理', value: '6' },

            { label: '中级经理', value: '7' },
            { label: '客户总监', value: '8' },
            { label: '高级客户总监', value: '9' },
            { label: '资深客户总监及以上', value: 'GG' },
        ];
        const options_level = [
            { label: 'LV0', value: 'L-0' },
            { label: 'LV1', value: 'L-1' },
            { label: 'LV2', value: 'L-2' },
            { label: 'LV3', value: 'L-3' },

            { label: 'LV4', value: 'L-4' },
            { label: 'LV5', value: 'L-5' },

            { label: 'LV6', value: 'L-6' },
            { label: 'LV7', value: 'L-7' }
        ];
        const { view_mode, _beginTime, fetching, selectData, selectValue, flag, content, link, message_id, p_intro, p_time, ptype, status, summary, title } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={message_id == '0' ? '添加消息' : view_mode ? '查看消息' : "编辑消息"}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{ minHeight: '400px' }}>
                                    <Form {...formItemLayout}>

                                        <Form.Item label="模板">
                                            <Select
                                                disabled={view_mode}
                                                labelInValue
                                                value={selectValue}
                                                notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
                                                onChange={this.onChangeTmp}
                                                className="m_w400"
                                            >
                                                <Option key={' '}>无</Option>
                                                {selectData.map((d, index) => (
                                                    <Option key={index} value={index}>{d.label}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="标题">
                                            <Input
                                                disabled={view_mode}
                                                value={title}
                                                onChange={e => {
                                                    this.setState({ title: e.target.value })
                                                }}
                                                className="m_w400"
                                                placeholder="输入标题"
                                            />
                                        </Form.Item>
                                        <Form.Item label="摘要" help='最多输入100个字符'>
                                            <TextArea
                                                disabled={view_mode}
                                                autoSize={{ minRows: 4 }}
                                                className="m_w400"
                                                value={summary}
                                                onChange={e => {
                                                    this.setState({ summary: e.target.value })
                                                }}
                                                maxLength={100}
                                            >
                                            </TextArea>
                                        </Form.Item>
                                        <Form.Item label="正文">
                                            <TextArea
                                                disabled={view_mode}
                                                autoSize={{ minRows: 6 }}
                                                className="m_w400"
                                                value={content}
                                                onChange={e => {
                                                    this.setState({ content: e.target.value })
                                                }}
                                            >
                                            </TextArea>
                                        </Form.Item>
                                        <Form.Item label="内容链接">
                                            <Input
                                                disabled={view_mode}
                                                value={link}
                                                onChange={e => {
                                                    this.setState({ link: e.target.value })
                                                }}
                                                className="m_w400"
                                                placeholder="输入链接"
                                            />
                                        </Form.Item>
                                        <Form.Item label="目标用户">
                                            <Select
                                                disabled={view_mode}
                                                className="m_w200"
                                                value={this.state.ltype}
                                                onChange={(e) => { this.setState({ ltype: e }) }}
                                            >
                                                <Option value={0}>用户类型</Option>
                                                <Option value={1}>自定义</Option>
                                            </Select>
                                            {
                                                this.state.ltype == 0 ?
                                                    <Select
                                                        disabled={view_mode}
                                                        className="m_w400"
                                                        value={this.state.flag_select}
                                                        onChange={this.onSelected}
                                                    >
                                                        {
                                                            this.state.etype > 40 && ptype == 2 ?
                                                                <Option value={0} disabled={true}>全部用户</Option>
                                                                :
                                                                <Option value={0}>全部用户</Option>
                                                        }

                                                        <Option value={1}>新用户(注册15天内)</Option>
                                                        <Option value={2}>已验证</Option>
                                                        {
                                                            this.state.etype > 40 && ptype == 2 ?
                                                                <Option value={4} disabled={true}>未认证</Option>
                                                                :
                                                                <Option value={4}>未认证</Option>
                                                        }
                                                        <Option value={5}>有等级用户</Option>
                                                        <Option value={6}>O2O培训班</Option>
                                                    </Select>
                                                    :
                                                    <div>
                                                        {
                                                            this.squad_import_user.length > 0 ?
                                                                <Button className='m_2' onClick={() => { this.setState({ showImportUser: true }) }}>查看导入名单</Button>
                                                                : null
                                                        }
                                                        {/* <Upload
                                                            disabled={view_mode}
                                                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                            fileList={this.state.excelFileList}
                                                            beforeUpload={this.beforeUploadExcel}
                                                            onRemove={this.onRemoveExcel}
                                                        >
                                                            <Button className='m_2'>
                                                                <Icon type="upload" /> 导入名单
                                                        </Button>
                                                        </Upload> */}
                                                        <Form.Item label="选择Excel文件">
                                                            <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' listType='text' ref={(ref) => { this.excelFile = ref }}></AntdOssUpload>
                                                        </Form.Item>
                                                        <div style={{ color: "#8e8e8e", marginTop: '10px', lineHeight: '1.5' }}>
                                                            <p>
                                                                * 导入前，请先下载Excel模板文件<br />
                                                                * 仅支持xlsx格式的文件
                                                            </p>
                                                            <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/09b8e959-ffce-425b-a216-811bf7bb5d89.xlsx'>
                                                                Excel导入模板下载
                                                            </a>
                                                        </div>
                                                    </div>
                                            }
                                            {
                                                this.state.flag_select == 5 ?
                                                    <div>
                                                        <Checkbox.Group
                                                            key='level'
                                                            // disabled={disabled}
                                                            options={options_level}
                                                            value={this.state.checkLevelValue}
                                                            onChange={this.onCheckLevelBox}
                                                            className='mt_20'
                                                        />
                                                    </div>
                                                    : null
                                            }
                                            {this.state.flag_select == 6 ?
                                                <div>
                                                    <Select
                                                        placeholder="搜索O2O培训班"
                                                        notFoundContent={this.state.fetching ? <Spin size="small" /> : <Empty />}
                                                        showSearch
                                                        // disabled={disabled}
                                                        className="m_w400"
                                                        value={this.state.squadId}
                                                        placeholder='搜索培训班'
                                                        filterOption={false}
                                                        onChange={this.onSquad}
                                                        onSearch={(val) => {
                                                            this.setState({ keyword: val }, () => {
                                                                this.getO2OClass()
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            this.state.class_list.map(item => (
                                                                <Select.Option key={item.squadId} value={item.squadId}>{item.squadName}</Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </div>
                                                : null}
                                            {this.state.flag_select == 2 ?
                                                <div>
                                                    <Checkbox.Group
                                                        disabled={view_mode}
                                                        options={options}
                                                        value={this.state.checkValue}
                                                        onChange={this.onCheckBox}
                                                        className='mt_20'
                                                    />
                                                </div>
                                                : null}
                                        </Form.Item>
                                        <Form.Item label="类型">
                                            <Select className="m_w400" value={this.state.etype} onChange={(etype) => {
                                                this.setState({ etype })
                                                if (etype > 40 && this.state.ptype == 2) {
                                                    this.setState({
                                                        flag_select: 2
                                                    })
                                                }
                                            }}>
                                                <Select.Option value={41}>课程通知</Select.Option>
                                                <Select.Option value={40}>油葱新鲜事</Select.Option>
                                                <Select.Option value={42}>系统通知</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="推送渠道" help='选择推送渠道为手机短信时，将会立即推送，且无法撤回'>
                                            <Select
                                                disabled={view_mode}
                                                className="m_w400"
                                                value={ptype}
                                                onChange={val => {
                                                    if (val == 0) {
                                                        this.setState({ isTick: '0' })
                                                    }
                                                    this.setState({
                                                        ptype: val,
                                                    })
                                                    if (val == 2 && this.state.etype > 40) {
                                                        this.setState({
                                                            flag_select: 2
                                                        })
                                                    }
                                                }}
                                            >
                                                <Select.Option value={0}>手机短信</Select.Option>
                                                <Select.Option value={1}>微信</Select.Option>
                                                <Select.Option value={2}>站内</Select.Option>
                                                <Select.Option value={3}>锁屏</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item label="推送时间">
                                            <Select disabled={view_mode} className="m_w400" value={this.state.isTick} onChange={this.pushType}>
                                                <Select.Option value={'0'}>立即推送</Select.Option>
                                                {this.state.ptype == 0 ? null :
                                                    <Select.Option value={'1'}>定时推送</Select.Option>
                                                }
                                            </Select>
                                        </Form.Item>
                                        {this.state.isTick == '1' ?
                                            <Form.Item label="选择推送时间">
                                                <DatePicker
                                                    disabled={view_mode}
                                                    disabledDate={this.disabledDate}
                                                    format={'YYYY-MM-DD HH:mm'}
                                                    placeholder="选择推送时间"
                                                    onChange={this.onPushTime}
                                                    value={_beginTime}
                                                    locale={locale}
                                                    showTime={{ format: 'HH:mm' }}
                                                />
                                            </Form.Item>
                                            : null}

                                        {/*
                                        <Form.Item label="启用状态">
                                            <Switch defaultChecked onChange={this.openSubscribe}/>
                                        </Form.Item>
                                        */}


                                        {/* <Form.Item label="通知内容">
                                            <Select className="m_w400" defaultValue='0'>
                                                <Select.Option value='0'>全部事件</Select.Option>
                                                <Select.Option value='1'>资金变动</Select.Option>
                                                <Select.Option value='2'>订单通知</Select.Option>
                                                <Select.Option value='3'>运营功能</Select.Option>
                                            </Select>
                                        </Form.Item>*/}
                                        {/*
                                        <Form.Item label="推送类型">
                                            <Select onChange={this.isManual} className="m_w400" defaultValue='1'>
                                                <Select.Option value='0'>手动推送</Select.Option>
                                                <Select.Option value='1'>自动推送</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        */}
                                        <Form.Item label="推送类型">
                                            <Select
                                                disabled={view_mode}
                                                className="m_w400"
                                                value={p_intro}
                                                onChange={(val) => {
                                                    this.setState({
                                                        p_intro: val
                                                    })
                                                }}
                                            >
                                                <Option value={'0'}>商城订单提醒</Option>
                                                <Option value={'1'}>新用户消息</Option>
                                                <Option value={'2'}>返还用户消息</Option>
                                                <Option value={'3'}>直播预约消息</Option>
                                                <Option value={'4'}>优惠券过期消息</Option>
                                                <Option value={'5'}>系统提醒</Option>
                                                <Option value={'6'}>交互提醒</Option>
                                            </Select>
                                        </Form.Item>
                                        {
                                            this.state.etype > 40 ?
                                                null
                                                :
                                                <Form.Item label='上传封面'>
                                                    <AntdOssUpload
                                                        disabled={view_mode}
                                                        actions={this.props.actions}
                                                        maxLength={1}
                                                        accept="image/*"
                                                        listType='picture-card'
                                                        value={this.state.imageList}
                                                        tip="上传图片"
                                                        ref={ref => this.img = ref}
                                                    />
                                                    <div className='tip'>请上传符合尺寸为 544px * 184px 的封面</div>
                                                </Form.Item>
                                        }

                                    </Form>
                                    <div className="flex f_row j_center">
                                        {/* 
                                        <Button type="primary" ghost onClick={()=>{this.setState({coursePreviewVisible:true})}}>取消</Button>
                                         */}
                                        {
                                            view_mode ? null :
                                                <Button onClick={this._onPublish} type="primary">提交</Button>
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
                <Modal
                    visible={this.state.coursePreviewVisible}
                    maskClosable={true}
                    onCancel={this.handleCancelCourse}
                    onOk={this.handleCancelCourse}
                    okText="确定"
                    cancelText="取消"
                >
                    {/*
                    <img className="block_center" alt="example" style={{ width: '40%' }} src={qrcode} />
                    <div className="text_center">扫码预览</div>
                    */}

                    <Form className="ant-advanced-search-form">
                        <Form.Item label="标题">
                            {title}
                        </Form.Item>
                        <hr />
                        <Form.Item label="摘要">
                            {summary}
                        </Form.Item>
                        <hr />
                        <Form.Item label="正文">
                            {content}
                        </Form.Item>
                        <hr />
                        <Form.Item label="内容链接">
                            {link}
                        </Form.Item>
                        <hr />
                        <Form.Item label="目标用户设置">
                            {this.state.flag_select == 2 ?
                                <Checkbox.Group
                                    options={options}
                                    value={this.state.checkValue}
                                />
                                : this.state.flag_select == 0 ?
                                    <Tag>全部用户</Tag>
                                    : <Tag>新用户</Tag>
                            }

                        </Form.Item>
                        <hr />
                        <Form.Item label="推送渠道">
                            {push_way[ptype]}
                        </Form.Item>
                        <hr />
                        {/*
                        <Form.Item label="消息类别">
                            站内
                        </Form.Item>
                        <hr/>
                        */}
                        <Form.Item label="推送时间">
                            {p_time ? p_time : <Tag>立即推送</Tag>}
                        </Form.Item>
                        <hr />
                        <Form.Item label="推送类型">
                            {push_type[p_intro]}
                        </Form.Item>
                        {/*
                            <hr/>
                            <Form.Item label="消息推送">
                                手动推送
                            </Form.Item>
                        */}
                    </Form>
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = EditMsg;
const mapStateToProps = state => {
    return {
        tmp_list: state.ad.tmp_list,
        msg_list: state.ad.msg_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
