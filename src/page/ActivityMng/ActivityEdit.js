import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Switch, DatePicker, Radio, Icon, Upload, PageHeader, Modal, Form, Card, Input, Button, message } from 'antd';

import moment from 'moment';
import connectComponent from '../../util/connect';
import config from '../../config/config';
import locale from 'antd/es/date-picker/locale/zh_CN';

import Editor from '../../components/Editor'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import UploadList from 'antd/es/upload/UploadList';
import zhCN from 'antd/es/locale/zh_CN';
import AntdOssUpload from '../../components/AntdOssUpload'
import Quetionna from './Quetionna'
import PersonTypePublic from '../../components/PersonTypePublic'

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class ActivityEdit extends Component {
    state = {
        fileList: [],
        previewVisible: false,
        previewImage: '',

        dataSource: [
            {
                label: 'A',
                value: 0,
                title: '',
            }
        ],

        topic_name: 0,

        radio: 0,
        checkbox: [0],
        topic_type: 0,
        topic_display: 0,
        edit_index: 0,
        edit_value: '',
        OptionList: [],
        QuetionList: [[]],
        ttype: 0,
        activeType: 0,
        showQuestionPanel: false,
        showAddPanel: false,
        fileList: [],
        fileList1: [],
        showTheBox: true,

        view_mode: false,
        activity_id: '0',
        activity_img: '',
        flag: '',
        atype: 0,
        title: '',
        rule: '',
        content: '',
        integral: '',
        begin_time: '',
        end_time: '',
        ctype: 17,
        signend_time: '0',
        voteend_time: '0',
        sub_title: '',


        status: '0',
        voteList: [],
        voteFileList: [],
        topicList: [],
        voteIndex: -1,

        aTime: null,
        vTime: null,

        voteend_begin_time: '0',
        show_time: '0',
        applyTime: null,
        sTime: null,
        show_vote: 1,
        etype: 20,
        can_share: 1,
        only_modify_content: 0,
        showInfos:false
    }
    activity_info = { statusName: '未开始' }
    componentWillMount() {

        const { view: view_mode, id: activity_id } = this.props.match.params

        const { actions } = this.props

        this.activity_id = activity_id

        if (activity_id != '0') {
            if (view_mode && view_mode == '1') {
                this.setState({ view_mode: true })
            }else{
                this.setState({only_modify_content:1})
            }
            this.setState({ activity_id })
            actions.getActivityVote({ activity_id })
            actions.getActivity({
                activity_id
            })
            actions.getQuestionna({
                activity_id
            })
        }

    }
    componentWillReceiveProps(n_props) {
        if (n_props.vote_list !== this.props.vote_list) {
            const vote_list = n_props.vote_list.options
            console.log(vote_list)
            let voteList = []

            vote_list.map((ele, index) => {
                let link = ''
                if (ele.galleries.length > 0)
                    link = ele.galleries[0].link
                voteList.push({ integral: '0', option_id: ele.optionId, link: link, title: ele.optionLabel, name: ele.optionLabel, uid: ele.optionId + 'uid' })
            })
            this.setState({ voteList })
        }
        if (n_props.quetion_list !== this.props.question_list) {
            if (n_props.quetion_list.length > 0) {
                const { topics } = n_props.quetion_list[0]
                if (topics) {
                    let topicList = []
                    topics.map(ele => {
                        let options = []
                        let dataSource = []
                        ele.topicOptions.map((_ele, _index) => {
                            options.push(_ele.optionLabel)
                            dataSource.push({
                                label: String.fromCharCode(_index + 65),
                                title: _ele.optionLabel,
                            })
                        })
                        topicList.push({
                            title: ele.title,
                            ttype: ele.ttype,
                            options: options,
                            uid: Math.random() * 10 + Date.now() + '',
                            dataSource
                        })
                    })
                    this.setState({ topicList })
                }
            }
        }
        if (n_props.activity_list !== this.props.activity_list) {
            if (n_props.activity_list.data.length == 0) {
                // message.info('暂时没有数据')
            } else {
                this.activity_info = n_props.activity_list.data[0]
                console.log(this.activity_info)
                let {
                    activityId,
                    activityImg,
                    atype,
                    beginTime,
                    content,
                    contentId,
                    ctype,
                    endTime,
                    flag,
                    follow,
                    hit,
                    integral,
                    isRecomm,
                    rule,
                    signendTime,
                    status,
                    title,
                    voteendTime,
                    voteendBeginTime,
                    showTime,
                    showVote,
                    etype,
                    subTitle,
                    canShare,
                } = this.activity_info

                //主图
                let fileList = [{
                    response: { resultBody: activityImg },
                    uid: activityId,
                    name: title,
                    status: 'done',
                    url: activityImg,
                    type: 'image/png'
                }]

                let begin_time = moment.unix(beginTime).format('YYYY-MM-DD HH:mm')
                let BeginTime = moment(begin_time)
                let end_time = moment.unix(endTime).format('YYYY-MM-DD HH:mm')
                let EndTime = moment(end_time)

                let signend_time = moment.unix(signendTime).format('YYYY-MM-DD HH:mm')
                let applyTime = !signendTime || signendTime == '' ? null : moment(signend_time)

                let voteend_time = moment.unix(voteendTime).format('YYYY-MM-DD HH:mm')
                let VoteEndTime = !voteendTime || voteendTime == '' ? null : moment(voteend_time)

                let voteend_begin_time = moment.unix(voteendBeginTime).format('YYYY-MM-DD HH:mm')
                let VoteBeginTime = !voteendBeginTime || voteendBeginTime == '' ? null : moment(voteend_begin_time)

                let show_time = moment.unix(showTime).format('YYYY-MM-DD HH:mm')
                let sTime = !showTime ? null : moment(show_time)
                // voteend_begin_time
                this.setState({
                    show_vote: showVote,
                    etype,
                    sTime,
                    applyTime,
                    show_time,
                    voteend_begin_time,

                    fileList,
                    content,
                    title,
                    begin_time,
                    end_time,
                    signend_time,
                    voteend_time,

                    status,
                    flag,
                    ctype,
                    atype,
                    rule,
                    integral,
                    content_id: contentId,
                    activity_img: activityImg,
                    aTime: [BeginTime, EndTime],
                    vTime: [VoteBeginTime, VoteEndTime],
                    sub_title: subTitle,
                    can_share: canShare
                })
            }
        }



    }
    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    disabledDate = (current) => {
        return current < moment().subtract(1, 'day')
    }
    disabledTime = (current, type) => {
        console.log(current, type)
        // return moment().isSameOrAfter(current[0])
        if (type == 'start')
            return {
                disabledHours: () => this.range(0, moment().get('hour')),
                disabledMinutes: () => this.range(0, moment().get('minute')),
            }
        else return false

        //return current[0].valueOf() < moment().valueOf()+1000*60*60*24 ||  current[1] <  moment().valueOf()
    }
    disabledEndDate = (current) => {
        const { aTime } = this.state
        if (!aTime)
            return true

        const startValue = aTime[0] || null;
        const endValue = aTime[1] || null;
        if (!endValue || !startValue) {
            return true;
        }
        return current < startValue.valueOf() || current > endValue.valueOf()
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    addQuetionList(type, index) {
        let { QuetionList } = this.state
        if (type == 'sub') {
            QuetionList[index].push([])
            this.setState({
                QuetionList
            })
        } else {
            QuetionList.push([])
            this.setState({
                QuetionList
            })
        }
    }
    submitContent = () => {
        const htmlContent = this.state.editorState.toHTML()
        this.setState({
            content: htmlContent
        })
    }
    handleEditorChange = (editorState) => {
        const content = editorState.toHTML()
        this.setState({
            editorState,
            content
        })
    }
    addOptionList = () => {
        let { OptionList } = this.state
        OptionList.push(Math.random() * 10)
        this.setState({
            OptionList
        })
    }
    add = () => {
        this.setState(pre => {
            let { dataSource } = pre
            let label = String.fromCharCode(dataSource.length + 65)
            dataSource.push({
                value: dataSource.length - 1,
                label,
                title: ''
            })
            return {
                dataSource,
                edit_index: dataSource.length - 1
            }
        })
    }
    edit(index) {
        let { dataSource } = this.state
        this.setState({
            edit_value: dataSource[index].title,
            edit_index: index
        })
    }
    save(index) {
        this.setState(pre => {
            let { edit_value, dataSource } = pre
            dataSource[index].title = edit_value

            return {
                dataSource,
                edit_index: -1
            }
        })
    }
    delete(index) {
        if (this.state.dataSource.length <= 1) {
            message.info('请至少保留一个选项')
            return
        }
        this.setState(pre => {
            let { dataSource } = pre
            dataSource = dataSource.filter((ele, idx) => {
                return idx !== index
            })
            return {
                dataSource
            }
        })
    }
    onUpload = ({ fileList }) => {
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList: fileList,
            file_url: img.join(',')
        })
    }
    _onPublish = () => {
        const result = this.onPublish()
        if (result == false) {
            this.setState({ loading: false })
        }
    }
    onPublish = () => {
        this.setState({ loading: true })

        const { actions } = this.props
        const {
            activity_id,

            atype,
            title,
            rule,

            integral,
            begin_time,
            end_time,
            ctype,

            status,
            voteList,
            voteFileList,
            show_vote,
            etype,
            sub_title,
            can_share,
            only_modify_content
        } = this.state
        let {
            signend_time,
            voteend_time,
            voteend_begin_time,
            show_time,
        } = this.state
        const content = this.refs.editor.toHTML()

        let flag = ''
        if (this.refs['flag']) {
            flag = this.refs.flag.getValue()
        }
        let quetionna = []
        let activity_img = ''

        if (title == '') { message.info('请输入活动名称'); return false; }
        if (sub_title == '') { message.info('请输入副标题'); return false; }
        /**
         * atype 2: 主题活动
         * atype 3: 自发投票
         * atype 4: 问卷
         */
        const { iconUpload } = this.refs
        if (typeof iconUpload !== 'undefined') {
            activity_img = iconUpload.getValue()
            if (activity_img == '') {
                message.info('请上传封面')
                return false;
            }
        }
        if (atype == 2) {
            if (begin_time == 0 || begin_time == '') { message.info('请选择活动时间'); return false; }
            if (!signend_time) { message.info('请设置作品收集截止日期'); return false; }
            if (!voteend_begin_time) { message.info('请设置投票开始--截止时间'); return false; }
            if (!show_time) { message.info('请设置展示周期时间'); return false; }
            if (ctype == 19) { message.info('请选择活动形式'); return false; }
        } else if (atype == 3) {
            if (voteList.length == 0) { message.info('请设置投票选项'); return false; }
        } else if (atype == 4) {
            if (this.quetionna)
                quetionna = this.quetionna.getValue() || []
            if (quetionna.length == 0 && atype == 4) {
                message.info('请上传问卷题目'); return false;
            }
        }

        if (atype !== 2) {
            signend_time = ''
            voteend_time = ''
        }

        if (flag === null) {
            return false;
        }


        actions.publishActivity({
            etype,
            show_vote,
            activity_id,
            activity_img,
            flag,
            atype,
            title,
            rule,
            content,
            integral,
            begin_time,
            end_time,
            ctype,
            signend_time,
            voteend_time,
            voteend_begin_time,
            show_time,
            status,
            sub_title,
            can_share,
            only_modify_content,
            resolved: (data) => {
                if (atype == 3)
                    voteList.map(ele => {
                        actions.addVote({
                            activity_id: data.activityId,
                            option_id: ele.option_id,
                            option: ele.name,
                            url: ele.link,
                            vtype: ctype,
                            integral: ele.integral,
                            resolved: (data) => {
                                console.log(data)
                            },
                            rejected: (data) => {
                                message.error(data)
                            }
                        })
                    })

                if (atype == 4) {
                    quetionna.map((ele, index) => {
                        actions.publishQuestionna({
                            ttype: ele.ttype,
                            title: ele.title,
                            options: ele.options.join('|||'),
                            topic_id: 0,
                            activity_id: data.activityId,
                            resolved: () => {

                            },
                            rejected: (data) => {
                                message.error(data)
                            }
                        })
                    })
                }

                if (flag === '/I/' && this.refs.flag.getFile() !== '')
                    this.refs.flag.uploadFile(data.activityId, this.props.actions, this, 2)
                else
                    message.success({
                        content: '提交成功',
                        onClose: () => {
                            this.setState({ loading: false })
                            window.history.back()
                        }
                    })

            },
            rejected: (data) => {
                this.setState({ loading: false })
                message.error(data)
            }
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
    onImgRemove = () => {
        this.setState({
            activity_img: '',
            fileList: []
        })
    }
    onImgChange = ({ file, fileList, event }) => {
        let activity_img = ''
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                if (index == 0) {
                    activity_img = ele.response.resultBody
                }
            }
        })

        this.setState({
            fileList,
            activity_img
        })
    }
    onAddVote = () => {
        const { voteList, vote_title, voteIndex } = this.state
        const { voteVideo, votePoster } = this.refs

        let vote_link = ''

        if (vote_title == '' || !vote_title) { message.info('请设置选项名称'); return }
        if (typeof votePoster !== 'undefined') {
            vote_link = this.refs.votePoster.getValue()
            if (!vote_link) { message.info('请上传封面'); return }
        } else if (typeof voteVideo !== 'undefined') {
            vote_link = this.refs.voteVideo.getValue()
            if (!vote_link) { message.info('请上传视频'); return }
        }

        if (voteIndex !== -1) {
            voteList[voteIndex].title = vote_title
            voteList[voteIndex].link = vote_link
            voteList[voteIndex].name = vote_title
        } else {
            voteList.push({
                integral: '0',
                option_id: '0',
                link: vote_link,
                title: vote_title,
                name: vote_title,
                uid: Date.now() + 'uid'
            })
        }

        this.setState({ voteList, showAddPanel: false })

    }

    //双击
    _onClick = (index) => {
        const { voteList, ctype } = this.state
        const vote_title = voteList[index].title
        let voteFileList = []

        if (voteList[index]['link'])
            voteFileList = [{
                uid: 'voteList',
                name: 'voteList',
                status: 'done',
                type: ctype == 17 ? 'image/png' : 'video/mp4',
                url: voteList[index].link,
            }]

        this.setState({
            voteIndex: index,
            voteFileList,
            vote_title,
            showAddPanel: true
        })

    }
    onRemove = index => {
        this.setState((pre) => {
            const { voteList } = pre
            const newFileList = voteList.filter((item, idx) => idx !== index);
            return { voteList: newFileList }
        });
    }
    onDragEnd = ({ source, destination }) => {
        if (destination == null) return

        const reorder = (list, startIndex, endIndex) => {
            const [removed] = list.splice(startIndex, 1);
            list.splice(endIndex, 0, removed);

            return list;
        }

        this.setState(pre => {
            return { voteList: reorder([...pre.voteList], source.index, destination.index) }
        })
    }
    render() {
        const { aTime, view_mode, voteList, activity_id, title, vTime, sTime, applyTime, sub_title } = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 18 },
            },
        };
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 16 },
            },
        };

        const options = [
            { label: '直销员', value: '1' },
            { label: '服务中心员工', value: '3' },
            { label: '服务中心负责人', value: '4' },

            { label: '优惠顾客', value: '5' },
            { label: '初级经理', value: '6' },

            { label: '中级经理', value: '7' },
            { label: '客户总监', value: '8' },
            { label: '高级客户总监', value: '9' },
            { label: '资深客户总监及以上', value: 'GG' },
        ];
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={activity_id == '0' ? "添加活动" : view_mode ? '查看活动' : '修改活动'}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{ minHeight: '400px' }}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="活动名称">
                                            <Input.TextArea
                                                autoSize={{ minRows: 1 }}
                                                disabled={view_mode}
                                                onChange={e => {
                                                    this.setState({
                                                        title: e.target.value
                                                    })
                                                }}
                                                className="m_w400"
                                                placeholder="输入名称"
                                                value={title}
                                            />
                                        </Form.Item>
                                        <Form.Item label="副标题">
                                            <Input.TextArea
                                                autoSize={{ minRows: 1 }}
                                                disabled={view_mode}
                                                onChange={e => {
                                                    this.setState({
                                                        sub_title: e.target.value
                                                    })
                                                }}
                                                className="m_w400"
                                                placeholder="输入名称"
                                                value={sub_title}
                                            />
                                        </Form.Item>
                                        <Form.Item label="封面">
                                            <AntdOssUpload actions={this.props.actions} disabled={view_mode} accept='image/*' value={this.state.fileList} ref='iconUpload'></AntdOssUpload>
                                            <span style={{ marginTop: '-30px', display: 'block', fontSize: '12px', color: 'red' }}>* 请上传符合尺寸为 332 x 130的图片</span>
                                        </Form.Item>
                                        <Form.Item label="活动时间">
                                            <DatePicker.RangePicker format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }} allowClear={true} disabledDate={this.disabledDate} value={this.state.aTime} locale={locale} onChange={(date, dateString) => {

                                                this.setState({
                                                    aTime: date,
                                                    // vTime:null,
                                                    // sTime:null,
                                                    // signend_time:'',
                                                    // voteend_time:'',
                                                    // voteend_begin_time:'',

                                                    // voteend_begin_time:'',
                                                    // show_time:'',

                                                    begin_time: dateString[0],
                                                    end_time: dateString[1]
                                                })
                                            }}></DatePicker.RangePicker>
                                        </Form.Item>

                                        {
                                           this.state.only_modify_content==1?
                                                <Form.Item label="   ">
                                                    <Button type="primary" onClick={()=>{
                                                        this.setState({
                                                            showInfos:true
                                                        })
                                                    }}>点击修改活动类型</Button>
                                                </Form.Item>
                                                : null
                                        }
                                        {this.state.only_modify_content==0?
                                        <Form.Item label="活动类型">
                                            <Radio.Group
                                                disabled={view_mode}
                                                value={this.state.atype}
                                                onChange={e => {
                                                    this.setState({
                                                        atype: e.target.value,
                                                        voteend_begin_time: 0,
                                                        voteend_time: 0,
                                                        signend_time: 0,
                                                        vTime: null,

                                                        rule: '',
                                                        vote_list: []
                                                    })
                                                }}>
                                                <Radio value={0}>无</Radio>
                                                <Radio value={3}>自发投票</Radio>
                                                <Radio value={4}>问卷</Radio>
                                                <Radio value={2}>主题活动</Radio>
                                            </Radio.Group>
                                            <br />

                                            {this.state.atype == 4 ?
                                                <>
                                                    <Quetionna disabled={view_mode} dataSource={this.state.topicList} ref={(val) => { this.quetionna = val }} />
                                                </>
                                                : null}

                                            {this.state.atype == 2 ?
                                                <Card type='inner'>
                                                    <Form layout='vertical'>
                                                        <Form.Item>
                                                            <Radio.Group value={this.state.etype} disabled={view_mode} onChange={e => {
                                                                this.setState({
                                                                    etype: e.target.value
                                                                })
                                                            }}>
                                                                <Radio value={20}>投票</Radio>
                                                                <Radio value={14}>点赞</Radio>
                                                            </Radio.Group>
                                                        </Form.Item>
                                                        <Form.Item label='作品收集截止日期'>
                                                            <DatePicker
                                                                disabled={true}
                                                                // disabledTime={this.disabledTime} 
                                                                format='YYYY-MM-DD HH:mm'
                                                                showTime={{ format: 'HH:mm' }}
                                                                allowClear={true}
                                                                value={Array.isArray(aTime) ? aTime[0] : null}
                                                                // disabledDate = {this.disabledEndDate} 
                                                                locale={locale}
                                                            />
                                                            <span className='pad_l10 pad_r10'>至</span>
                                                            <DatePicker
                                                                disabled={view_mode}
                                                                // disabledTime={this.disabledTime} 
                                                                format='YYYY-MM-DD HH:mm'
                                                                showTime={{ format: 'HH:mm' }}
                                                                allowClear={true}
                                                                value={applyTime}
                                                                // disabledDate = {this.disabledEndDate} 
                                                                locale={locale}
                                                                onChange={(date, dateString) => {
                                                                    this.setState({ applyTime: date, signend_time: dateString })
                                                                }}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label='投票开始--截止时间'>
                                                            <DatePicker.RangePicker
                                                                disabled={view_mode}
                                                                // disabledTime={this.disabledTime} 
                                                                format='YYYY-MM-DD HH:mm'
                                                                showTime={{ format: 'HH:mm' }}
                                                                allowClear={true}
                                                                value={vTime}
                                                                // disabledDate = {this.disabledEndDate} 
                                                                locale={locale}
                                                                onChange={(date, dateString) => {
                                                                    this.setState({ vTime: date, voteend_begin_time: dateString[0], voteend_time: dateString[1] })
                                                                }}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label='展示周期时间'>
                                                            <DatePicker
                                                                disabled={view_mode}
                                                                // disabledTime={this.disabledTime} 
                                                                format='YYYY-MM-DD HH:mm'
                                                                showTime={{ format: 'HH:mm' }}
                                                                allowClear={true}
                                                                value={sTime}
                                                                // disabledDate = {this.disabledEndDate} 
                                                                locale={locale}
                                                                onChange={(date, dateString) => {
                                                                    this.setState({ sTime: date, show_time: dateString })
                                                                }}
                                                            />
                                                            <span className='pad_l10 pad_r10'>至</span>
                                                            <DatePicker
                                                                disabled={true}
                                                                // disabledTime={this.disabledTime} 
                                                                format='YYYY-MM-DD HH:mm'
                                                                showTime={{ format: 'HH:mm' }}
                                                                allowClear={true}
                                                                value={Array.isArray(aTime) ? aTime[1] : null}
                                                                // disabledDate = {this.disabledEndDate} 
                                                                locale={locale}
                                                            />
                                                        </Form.Item>
                                                    </Form>
                                                </Card>
                                                : null}
                                        </Form.Item>
                                        :null}
                                        {this.state.atype == 3 &&this.state.only_modify_content==0?
                                            <>
                                                <Form.Item label='投票类型'>
                                                    <Radio.Group disabled={view_mode} value={this.state.ctype} onChange={e => {
                                                        this.setState({
                                                            ctype: e.target.value,
                                                            voteList: []
                                                        })
                                                    }}>
                                                        <Radio value={19}>文字投票</Radio>
                                                        <Radio value={17}>图片投票</Radio>
                                                        <Radio value={16}>视频投票</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item label='投票主题'>
                                                    <Input.TextArea
                                                        disabled={view_mode}
                                                        value={this.state.rule}
                                                        autoSize={{ minRows: 4 }}
                                                        onChange={(e) => {
                                                            this.setState({ rule: e.target.value })
                                                        }}
                                                        className="m_w400"
                                                        placeholder=''
                                                    />
                                                </Form.Item>
                                                <Form.Item label='投票选项'>
                                                    {voteList.length == 0 ? null :
                                                        <div className='mb_10'>
                                                            <DragDropContext onDragEnd={this.onDragEnd} disabled={view_mode}>
                                                                <Droppable droppableId="droppable" disabled={view_mode}>
                                                                    {provided => (
                                                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                                                            {voteList.map((item, index) => (
                                                                                <Draggable key={item.uid} draggableId={item.uid} index={index}>
                                                                                    {provided => (
                                                                                        <div
                                                                                            ref={provided.innerRef}
                                                                                            {...provided.draggableProps}
                                                                                            {...provided.dragHandleProps}
                                                                                        >
                                                                                            <div style={{ padding: '10px 0', lineHeight: 1.5 }}>
                                                                                                <span>{index + 1}、</span>
                                                                                                <span style={{ paddingLeft: '10px' }}>{item.title}</span>
                                                                                                {view_mode ? null :
                                                                                                    <span style={{ float: 'right' }}>

                                                                                                        <a onClick={this._onClick.bind(this, index)} style={{ paddingRight: '10px' }}>修改</a>
                                                                                                        <a onClick={this.onRemove.bind(this, index)}>删除</a>
                                                                                                    </span>
                                                                                                }
                                                                                            </div>
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

                                                    <Button disabled={view_mode} onClick={() => {
                                                        this.setState({
                                                            voteIndex: -1,
                                                            showAddPanel: true,
                                                            vote_title: '',
                                                            voteFileList: []
                                                        })
                                                    }}>添加投票选项</Button>
                                                    <div style={{ marginTop: '10px', display: 'block', color: '#8b8b8b', lineHeight: '1.5' }}>

                                                    </div>
                                                </Form.Item>
                                                <Form.Item label="是否展示投票结果">
                                                    <Switch disabled={view_mode} checked={this.state.show_vote == 1 ? true : false} onChange={(checked) => {
                                                        if (checked)
                                                            this.setState({ show_vote: 1 })
                                                        else
                                                            this.setState({ show_vote: 0 })
                                                    }} />
                                                </Form.Item>
                                            </> : null}

                                        {this.state.atype == 2 ?
                                            <Form.Item label='活动形式'>
                                                <Radio.Group disabled={view_mode} value={this.state.ctype} onChange={e => {
                                                    this.setState({
                                                        ctype: e.target.value
                                                    })
                                                }}>
                                                    <Radio value={17}>图片</Radio>
                                                    <Radio value={16}>视频</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            : null}
                                        <Form.Item label="发布对象">
                                            <PersonTypePublic showO2O={true} actions={this.props.actions} contentId={this.state.activity_id} ctype='2' showUser={this.state.activity_id == '0' ? false : true} ref='flag' disabled={view_mode} flag={this.state.flag} />
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
                                        <Form.Item label="是否启用">
                                            <Switch disabled={view_mode} checked={this.state.status == 1 ? true : false} onChange={(checked) => {
                                                if (checked)
                                                    this.setState({ status: 1 })
                                                else
                                                    this.setState({ status: 0 })
                                            }} />
                                        </Form.Item>

                                        <Form.Item label="活动详情">
                                            <Editor readOnly={view_mode} content={this.state.content} ref='editor' actions={this.props.actions}></Editor>
                                        </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button type="primary" ghost onClick={() => window.history.back()}>取消</Button>
                                        &nbsp;
                                        {
                                            view_mode ?
                                                null :
                                                <Button loading={this.state.loading} onClick={this._onPublish} type="primary">提交</Button>
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
                    width={600}
                    zIndex={90}
                    title="投票设置"
                    visible={this.state.showAddPanel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showAddPanel: false })
                    }}
                    onOk={this.onAddVote}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>

                        <Form.Item label="选项名称">
                            <Input onChange={e => { this.setState({ vote_title: e.target.value }) }} value={this.state.vote_title}></Input>
                        </Form.Item>
                        {this.state.ctype == 17 ?
                            <Form.Item label='上传封面'>
                                <AntdOssUpload actions={this.props.actions} accept='image/*' key='votePoster' value={this.state.voteFileList} ref='votePoster'></AntdOssUpload>
                            </Form.Item>
                            : null}
                        {this.state.ctype == 16 ?
                            <Form.Item label='上传视频'>
                                <AntdOssUpload actions={this.props.actions} accept='video/mp4' key='voteVideo' value={this.state.voteFileList} ref='voteVideo'></AntdOssUpload>
                            </Form.Item>
                            : null}
                    </Form>
                </Modal>
                <Modal
                    width={800}
                    zIndex={90}
                    title="添加问卷"
                    visible={this.state.showQuestionPanel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showQuestionPanel: false })
                    }}
                    onOk={null}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    {this.state.QuetionList.map((ele, index) => (
                        <Card type='inner' className='mb_10'>
                            <Form {...formItemLayout2}>
                                <Form.Item label='题目类型'>
                                    <Radio.Group defaultValue={0} onChange={e => {
                                        this.setState({

                                        })
                                    }}>
                                        <Radio value={0}>单选题</Radio>
                                        <Radio value={1}>多选题</Radio>
                                        <Radio value={2}>开放题</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label='题干'>
                                    <Input
                                        onChange={(e) => {

                                        }}
                                        placeholder=''
                                        defaultValue=''
                                    />
                                </Form.Item>
                                <Form.Item label="选项">
                                    {ele.map((_ele, index) => (
                                        <Input className='mt_5 mb_5' placeholder={'选项' + index} className='m_w400'></Input>
                                    ))}
                                    <Button type="dashed" onClick={this.addQuetionList.bind(this, 'sub', index)} className='mt_10 mb_5 m_w400' style={{ minWidth: '10%' }}>
                                        <Icon type="plus" /> 增加选项
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    ))}
                    <Button type="dashed" onClick={this.addQuetionList.bind(this, 'parent', -1)} className='mt_10 mb_5' style={{ minWidth: '10%' }}>
                        <Icon type="plus" /> 增加题目
                    </Button>
                </Modal>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ previewVisible: false })
                }}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal visible={this.state.showInfos} maskClosable={true} onOk={()=>{
                    this.setState({
                        showInfos:false,
                        only_modify_content:0
                    })
                }} onCancel={() => {
                    this.setState({ showInfos: false })
                }}>
                    <div>若要修改活动类型，则会清除所有参与此活动的数据。</div>
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = ActivityEdit;
const mapStateToProps = state => {
    return {
        vote_list: state.activity.activity_vote_list,
        activity_list: state.activity.activity_list,
        quetion_list: state.activity.questionna_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });