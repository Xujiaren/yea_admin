import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { DatePicker, Checkbox, Empty, Spin, Radio, InputNumber, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import _ from 'lodash'
import moment from 'moment'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import qrcode from '../../assets/img/code.jpg'
import type_1 from '../../assets/img/type_05.png'
import type_2 from '../../assets/img/type_06.png'
import type_3 from '../../assets/img/type_07.png'

import connectComponent from '../../util/connect';
import config from '../../config/config';
import Editor from '../../components/Editor'
import PersonTypePublic from '../../components/PersonTypePublic'
import AntdOssUpload from '../../components/AntdOssUpload'
import SwitchCom from '../../components/SwitchCom';

const { Option } = Select;

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


class EditNews extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchTag = debounce(this.fetchTag, 800);
        this.fetchTeacher = debounce(this.fetchTeacher, 800);
    }
    state = {

        view_mode: false,

        imgList: [],
        fileList: [],
        previewVisible: false,

        fetching: false,
        selectData: [],
        selectValue: [],

        teacherFetching: false,
        selectTeacher: [],
        teacherData: [],


        article_id: 0,
        teacher_id: 0,
        category_id: '',
        article_img: '',
        atype: '0',
        ctype: '11',
        content_id: '',

        ttype: 0,
        images: '',
        tags: '',
        title: '',
        summary: '',
        content: '',
        sort_order: 0,
        status: 0,
        can_share: 0,
        is_top: 0,
        media_id: '',
        flag: '',

        voteList: [],
        link: '',
        is_link: 0,

        is_vote: 0,
        vote_id: 0,
        vote_title: '',
        endTime: null,
        end_time: '',
        options: '',
        //0:??????,1:??????
        mtype: 0,
        //0:??????,3:??????
        cttype: 0,
        label: '',
        voteIndex: -1,
        is_modify_vote: 1,
    };
    category_list = []
    input_value = ''
    onCourseImgRemove = () => {
        this.setState({
            article_img: ''
        })
    }
    onCourseImgChange = ({ file, fileList, event }) => {
        let article_img = ''
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                if (index == 0) {
                    article_img = ele.response.resultBody
                }
            }
        })

        this.setState({
            fileList,
            article_img
        })
    }
    onImgRemove = () => {
        this.setState({
            images: ''
        })
    }
    onImgChange = ({ file, fileList, event }) => {
        let imgList = []
        let images = ''

        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                imgList.push(ele.response.resultBody)
            }
        })

        if (imgList.length !== 0)
            images = imgList.join(',')

        this.setState({
            imgList: fileList,
            images,
        })
    }
    _onPublish = () => {
        if (this.onPublish() == false) this.setState({ loading: false })
    }
    onPublish = () => {
        this.setState({ loading: true })
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

            sort_order,
            status,
            can_share,
            is_top,
            media_id,

            link,
            is_vote,
            vote_id,
            vote_title,
            end_time,
            options,
            mtype,
            cttype,
            voteList,
            is_link,
            is_modify_vote
        } = this.state;
        const { actions } = this.props

        const article_img = (this.img && this.img.getValue()) || ''
        const images = (this.imgList && this.imgList.getValue()) || ''
        const flag = (this.flag && this.flag.getValue())
        let content = ''

        if (flag === null) { return false }

        if (!title) { message.info('???????????????'); return false; }

        if (!article_img) { message.info('???????????????'); return false; }

        if (!images) {
            message.info('??????????????????'); return false;
        }
        if (this.state.ttype == 1 && images.split(',').length < 3) {
            message.info('??????????????????????????????'); return false;
        }
        if (sort_order > 2500) { message.info('??????????????????2500'); return false; }
        if (is_link == 1) {
            if (link == '') { message.info('?????????????????????'); return false; }
            is_vote = 0
            options = ''
        } else {
            if (is_vote == 1) {
                if (!end_time) { message.info('???????????????????????????'); return false; }
                if (!vote_title) { message.info('?????????????????????'); return false; }
                if (voteList.length == 0) { message.info('?????????????????????'); return false; }
            }
            content = this.refs.editor.toHTML()
            if (!content || content == '<p></p>') { message.info('??????????????????'); return false; }
        }


        options = JSON.stringify(voteList)
        console.log(flag,'????')
        if(flag&&flag.indexOf('squad-')!==-1){
            let nums = flag.split('-')[1]
            actions.forNumber({
                input:nums,
                resolved:(res)=>{
                    actions.publishNews({
                        ctype,
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
                        flag:'squad-'+res,
            
                        link,
                        is_vote,
                        vote_id,
                        vote_title,
                        end_time,
                        options,
                        mtype,
                        cttype,
                        is_link,
                        is_modify_vote,
                        resolved: (data) => {
            
                            if (this.flag && this.flag.getValue() == '/I/' && this.flag.getFile() !== '')
                                this.flag.uploadFile(data.articleId, this.props.actions, this, 11)
                            else
                                message.success({
                                    content: '????????????',
                                    onClose: () => {
                                        this.setState({ loading: false })
                                        window.history.back()
                                    }
                                })
                        },
                        rejected: (data) => {
                            this.setState({ loading: false })
                            message.error({
                                content: data
                            })
                        }
                    })
                }
            })
        }else{
            actions.publishNews({
                ctype,
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
                flag,
    
                link,
                is_vote,
                vote_id,
                vote_title,
                end_time,
                options,
                mtype,
                cttype,
                is_link,
                is_modify_vote,
                resolved: (data) => {
    
                    if (this.flag && this.flag.getValue() == '/I/' && this.flag.getFile() !== '')
                        this.flag.uploadFile(data.articleId, this.props.actions, this, 11)
                    else
                        message.success({
                            content: '????????????',
                            onClose: () => {
                                this.setState({ loading: false })
                                window.history.back()
                            }
                        })
                },
                rejected: (data) => {
                    this.setState({ loading: false })
                    message.error({
                        content: data
                    })
                }
            })
        }
        
    }

    componentWillMount() {
        this.fetchTeacher('')
        this.fetchTag('')

        const article_id = this.props.match.params.id;

        const { actions } = this.props

        let _state = this.props.location.state
        if (typeof _state === 'undefined') {
            _state = { type: '' }
        } else if (_state.type === 'view') {
            this.setState({ view_mode: true })
        }

        if (article_id !== '-1') {
            actions.getNewsDetail({ articleId: article_id })
            this.setState({ article_id,is_modify_vote:0 })
        }

    }
    componentDidMount() {

    }
    componentWillReceiveProps(n_props) {
        const { user } = n_props
        if (n_props.category_list !== this.props.category_list) {
            this.category_list = n_props.category_list.data
        }
        if (n_props.news_detail !== this.props.news_detail) {

            let {
                articleId: article_id,
                teacherId: teacher_id,
                articleImg: article_img,
                categoryId: category_id,
                ttype: ttype,
                galleryList: galleryList,
                tagList: tagList,
                title: title,
                summary: summary,
                content: content,
                sortOrder: sort_order,
                status: status,
                canShare: can_share,
                isTop: is_top,

                flag,
                teacherName: teacherName,

                vote,
                voteInfo,
                isLink: is_link,
                isVote: is_vote,
                endTime: end_time,
                link,

            } = n_props.news_detail

            let tags = []
            let images = []
            let imgList = []
            let fileList = []
            let selectValue = []
            let selectTeacher = [{
                key: '0',
                label: '???'
            }]

            //??????
            if (teacher_id) {
                selectTeacher = [{
                    key: teacher_id + '',
                    label: teacherName
                }]
            }

            //??????
            tagList.map((ele) => {
                tags.push(ele.tagId)
            })
            tags = tags.join(',')
            //????????????
            tagList.map(ele => {
                selectValue.push({
                    key: ele.tagId.toString(),
                    label: ele.tagName
                })
            })

            //?????????
            galleryList.map((ele, index) => {
                images.push(ele.fpath)
                imgList.push({
                    response: { resultBody: ele.link },
                    uid: index,
                    name: 'img_' + index,
                    status: 'done',
                    url: ele.link,
                    type: 'image/png'
                })
            })
            images = images.join(',')

            //??????
            fileList.push({
                response: { resultBody: article_img },
                uid: article_id,
                name: title,
                status: 'done',
                url: article_img
            })

            //??????
            let endTime = null
            if (end_time !== 0) {
                end_time = moment.unix(end_time).format('YYYY-MM-DD HH:mm')
                endTime = moment(end_time)
            }
            const { mtype, ttype: cctype, title: vote_title } = vote
            let voteList = []
            voteInfo.map(ele => {
                voteList.push({ uid: Math.random() + 'uid', label: ele.optionLabel, pic: ele.picUrl })
            })
            this.setState({
                flag,
                selectTeacher,
                imgList,
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

                end_time,
                endTime,
                is_link,
                is_vote,
                mtype,
                cctype,
                voteList,
                vote_title,
                link
            })
        }

    }

    fetchTeacher = value => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ teacherFetching: true });
        fetch(config.api + '/user/teacher/?keyword=' + value, {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(body => {
                const { errorMsg } = body
                if (!errorMsg) {
                    const teacherData = body.resultBody.data.map(ele => ({
                        text: `${ele.teacherName}`,
                        value: ele.teacherId,
                    }));
                    this.setState({ teacherData, teacherFetching: false });
                }
            });
    }
    onSearchTag = value => {
        this.input_value = value;
        this.fetchTag(value);
    }
    fetchTag = value => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ selectData: [], fetching: true });
        fetch(config.api + '/course/taglist/?ttype=0', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(body => {
                const { errorMsg } = body
                if (!errorMsg) {
                    console.log(body.resultBody)
                    const selectData = body.resultBody.map(ele => ({
                        text: `${ele.tagName}`,
                        value: ele.tagId,
                    }));
                    this.setState({ selectData, fetching: false });
                }
            });
    };
    onSelectTag = value => {
        console.log(value)
        let tag = []
        value.map((ele) => [
            tag.push(ele.key)
        ])
        this.setState({
            selectValue: value,
            tags: tag.join(','),
            fetching: false,
        });
    };
    onSelectTeacher = value => {
        this.setState({
            selectTeacher: value,
            teacherFetching: false,
            teacher_id: value.key
        });
    };

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

    addTmp = () => {
        if (!this.input_value) {
            message.error("????????????????????????");
            return;
        }
        let { selectValue } = this.state;
        const { actions } = this.props

        actions.publishTag({
            tagName: this.input_value,
            resolved: (data) => {
                selectValue.push({ key: data.tagId, label: data.tagName });
                let tags = []
                selectValue.map((ele) => {
                    tags.push(ele.key)
                })
                tags = tags.join(',')
                this.setState({ selectValue, tags });
                this.input_value = ''
            },
            rejected: (data) => {
                message.error(data)
            }
        })

    }

    render() {
        const uploadButtonImg = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">????????????</div>
            </div>
        );


        const { is_link, voteList, view_mode, fetching, selectData, selectValue, can_share, article_id, is_modify_vote } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={!article_id ? '????????????' : view_mode ? '????????????' : '??????????????????'}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{ minHeight: '400px' }}>
                                    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
                                        <Form.Item label="??????">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e => {
                                                    this.setState({ title: e.target.value })
                                                }}
                                                value={this.state.title} className="m_w400" placeholder="" />
                                        </Form.Item>
                                        <Form.Item label="?????????">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e => {
                                                    this.setState({ summary: e.target.value })
                                                }}
                                                value={this.state.summary} className="m_w400" placeholder="" />
                                        </Form.Item>

                                        <Form.Item label="??????" help='???????????????????????? 674 x 260?????????'>
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                accept='image/*'
                                                ref={ref => this.img = ref}
                                                tip='????????????'
                                                value={this.state.fileList}
                                                disabled={view_mode}
                                            ></AntdOssUpload>
                                        </Form.Item>
                                        <Form.Item label="??????">
                                            <Select
                                                disabled={view_mode}
                                                showSearch
                                                labelInValue
                                                placeholder="????????????"
                                                notFoundContent={this.state.teacherFetching ? <Spin size="small" /> : <Empty />}
                                                filterOption={false}
                                                onSearch={this.fetchTeacher}
                                                onChange={this.onSelectTeacher}
                                                style={{ width: '400px' }}
                                                value={this.state.selectTeacher}
                                            >
                                                <Option key={'0'}>???</Option>
                                                {this.state.teacherData.map(d => (
                                                    <Option key={d.value}>{d.text}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>


                                        <Form.Item label="????????????">
                                            <Input.Group compact>
                                                <Select
                                                    disabled={view_mode}
                                                    mode="multiple"
                                                    labelInValue
                                                    value={selectValue}
                                                    placeholder="????????????"
                                                    notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
                                                    filterOption={false}
                                                    onSearch={this.onSearchTag}
                                                    onChange={this.onSelectTag}
                                                    style={{ width: '338px' }}
                                                >
                                                    {selectData.map(d => (
                                                        <Option key={d.value}>{d.text}</Option>
                                                    ))}
                                                </Select>
                                                <Button disabled={view_mode} onClick={this.addTmp}>??????</Button>
                                            </Input.Group>
                                        </Form.Item>
                                        <Form.Item label="??????">
                                            <Radio.Group disabled={view_mode} onChange={e => {
                                                this.setState({ ttype: e.target.value })
                                            }} name="radiogroup" value={this.state.ttype}>
                                                <Radio value={0}>
                                                    <img src={type_1} style={{ width: '66%', boxShadow: '0 0 2px 0px #d6d6d6', margin: '20px' }} />
                                                </Radio>
                                                <Radio value={1}>
                                                    <img src={type_2} style={{ width: '66%', boxShadow: '0 0 2px 0px #d6d6d6', margin: '20px' }} />
                                                </Radio>
                                                <Radio value={2}>
                                                    <img src={type_3} style={{ width: '66%', boxShadow: '0 0 2px 0px #d6d6d6', margin: '20px' }} />
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="?????????">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                accept='image/*'
                                                listType="picture-card"
                                                ref={ref => this.imgList = ref}
                                                tip='????????????'
                                                value={this.state.imgList}
                                                disabled={view_mode}
                                                maxLength={3}
                                            ></AntdOssUpload>
                                            <span style={{ marginTop: '-30px', display: 'block', color: 'red' }}>
                                                {
                                                    this.state.ttype == 1 ? '* ???????????????????????? 200 x 116 ?????????' :
                                                        this.state.ttype == 2 ? '* ???????????????????????? 230 x 126 ?????????' :
                                                            '* ???????????????????????? 630 x 260 ?????????'
                                                }
                                            </span>
                                        </Form.Item>

                                        <Form.Item label="??????">
                                            <InputNumber min={0} max={2500} disabled={view_mode} onChange={val => {
                                                if (val !== '' && !isNaN(val)) {
                                                    val = Math.round(val)
                                                    if (val < 0) val = 0
                                                    this.setState({ sort_order: val })
                                                }
                                            }} value={this.state.sort_order} />
                                        </Form.Item>

                                        <Form.Item label="????????????">
                                            <Switch disabled={view_mode} checked={this.state.is_top == 1 ? true : false} onChange={(checked) => {
                                                if (checked)
                                                    this.setState({ is_top: 1 })
                                                else
                                                    this.setState({ is_top: 0 })
                                            }} />
                                        </Form.Item>
                                        <Form.Item label="????????????">
                                            <Switch disabled={view_mode} checked={this.state.status == 1 ? true : false} onChange={(checked) => {
                                                if (checked)
                                                    this.setState({ status: 1 })
                                                else
                                                    this.setState({ status: 0 })
                                            }} />
                                        </Form.Item>
                                        <Form.Item label="????????????">
                                            <Switch disabled={view_mode} checked={can_share == 1 ? true : false} onChange={(checked) => {
                                                if (checked)
                                                    this.setState({ can_share: 1 })
                                                else
                                                    this.setState({ can_share: 0 })
                                            }} />
                                        </Form.Item>
                                        {
                                            this.state.article_id ?
                                                <Form.Item label="????????????????????????">
                                                    <Switch disabled={view_mode} checked={is_modify_vote == 1 ? true : false} onChange={(checked) => {
                                                        if (checked)
                                                            this.setState({ is_modify_vote: 1 })
                                                        else
                                                            this.setState({ is_modify_vote: 0 })
                                                    }} />
                                                </Form.Item>
                                                : null
                                        }

                                        <Form.Item label="????????????">
                                            <PersonTypePublic ref={ref => this.flag = ref} actions={this.props.actions} contentId={this.state.article_id} ctype='11' showUser={this.state.article_id == '0' ? false : true} disabled={view_mode} flag={this.state.flag} />
                                        </Form.Item>
                                        <Form.Item label='????????????'>
                                            <SwitchCom value={this.state.is_link} onChange={is_link => this.setState({ is_link })}></SwitchCom>
                                        </Form.Item>
                                        {this.state.is_link ?
                                            <Form.Item label='????????????'>
                                                <Input.TextArea
                                                    disabled={view_mode}
                                                    value={this.state.link}
                                                    autoSize={{ minRows: 1 }}
                                                    onChange={(e) => {
                                                        this.setState({ link: e.target.value })
                                                    }}
                                                    className="m_w400"
                                                    placeholder=''
                                                />
                                            </Form.Item>
                                            : null}
                                        {this.state.is_link ? null :
                                            <Form.Item label='??????'>
                                                <SwitchCom value={this.state.is_vote} onChange={is_vote => this.setState({ is_vote })}></SwitchCom>
                                            </Form.Item>
                                        }
                                        {this.state.is_vote == 1 && this.state.is_link == 0 ?
                                            <>
                                                <Form.Item label='????????????'>
                                                    <Radio.Group disabled={view_mode} value={this.state.mtype} onChange={e => {
                                                        this.setState({
                                                            mtype: e.target.value,
                                                        })
                                                    }}>
                                                        <Radio value={0}>????????????</Radio>
                                                        <Radio value={1}>????????????</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item label='????????????'>
                                                    <Radio.Group disabled={view_mode} value={this.state.cttype} onChange={e => {
                                                        this.setState({
                                                            cttype: e.target.value,
                                                        })
                                                    }}>
                                                        <Radio value={0}>??????</Radio>
                                                        <Radio value={3}>??????</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item label='????????????'>
                                                    <DatePicker disabled={view_mode} value={this.state.endTime} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }} disabledData={() => { }} onChange={(endTime, end_time) => {
                                                        this.setState({ endTime, end_time })
                                                    }}>
                                                    </DatePicker>
                                                </Form.Item>
                                                <Form.Item label='????????????'>
                                                    <Input.TextArea
                                                        disabled={view_mode}
                                                        value={this.state.vote_title}
                                                        autoSize={{ minRows: 4 }}
                                                        onChange={(e) => {
                                                            this.setState({ vote_title: e.target.value })
                                                        }}
                                                        className="m_w400"
                                                        placeholder=''
                                                    />
                                                </Form.Item>
                                                <Form.Item label='????????????'>
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
                                                                                                <span>{index + 1}???</span>
                                                                                                <span style={{ paddingLeft: '10px' }}>{item.label}</span>
                                                                                                {view_mode ? null :
                                                                                                    <span style={{ float: 'right' }}>
                                                                                                        <a onClick={this._onClick.bind(this, index)} style={{ paddingRight: '10px' }}>??????</a>
                                                                                                        <a onClick={this.onRemove.bind(this, index)}>??????</a>
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
                                                            label: '',
                                                            voteFileList: []
                                                        })
                                                    }}>??????????????????</Button>
                                                    <div style={{ marginTop: '10px', display: 'block', color: '#8b8b8b', lineHeight: '1.5' }}>

                                                    </div>
                                                </Form.Item>
                                            </> : null}
                                        {this.state.is_link ? null :
                                            <Form.Item label="??????">
                                                <Editor readOnly={view_mode} content={this.state.content} ref='editor' actions={this.props.actions}></Editor>
                                            </Form.Item>
                                        }
                                    </Form>
                                    <div className="flex f_row j_center">
                                        {view_mode ? null :
                                            <Button loading={this.state.loading || this.state.importLoading} onClick={this._onPublish} type="primary">{this.state.importLoading ? '????????????' : '??????'}</Button>
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
                    title="????????????"
                    visible={this.state.showAddPanel}
                    okText="??????"
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showAddPanel: false })
                    }}
                    onOk={this.onAddVote}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>

                        <Form.Item label="????????????">
                            <Input.TextArea autoSize={{ minRows: 1 }} onChange={e => { this.setState({ label: e.target.value }) }} value={this.state.label}></Input.TextArea>
                        </Form.Item>
                        {this.state.mtype == 1 ?
                            <Form.Item label='????????????' help='296px * 220px'>
                                <AntdOssUpload actions={this.props.actions} accept='image/*' key='votePoster' value={this.state.voteFileList} ref='votePoster'></AntdOssUpload>
                            </Form.Item>
                            : null}
                    </Form>
                </Modal>
            </div>
        )
    }
    onAddVote = () => {
        const { voteList, label, voteIndex, mtype } = this.state
        const { votePoster } = this.refs

        let pic = ''

        if (label == '' || !label) { message.info('?????????????????????'); return false }
        if (mtype == 1 && typeof votePoster !== 'undefined') {
            pic = this.refs.votePoster.getValue()
            if (!pic) { message.info('???????????????'); return false }
        }

        if (voteIndex !== -1) {
            voteList[voteIndex].label = label
            voteList[voteIndex].pic = pic
        } else {
            voteList.push({
                label: label,
                pic: pic,
                uid: Date.now() + 'uid'
            })
        }

        this.setState({ voteList, showAddPanel: false })

    }
    onRemove = index => {
        this.setState((pre) => {
            const { voteList } = pre
            const newFileList = voteList.filter((item, idx) => idx !== index);
            return { voteList: newFileList }
        });
    }
    _onClick = (index) => {
        const { voteList, mtype } = this.state
        const label = voteList[index].label
        let voteFileList = []

        if (voteList[index]['pic'])
            voteFileList = [{
                uid: 'voteList',
                name: 'voteList',
                status: 'done',
                type: mtype == 1 ? 'image/png' : '',
                url: voteList[index].pic,
            }]

        this.setState({
            voteIndex: index,
            voteFileList,
            label,
            showAddPanel: true
        })

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
}
const LayoutComponent = EditNews;
const mapStateToProps = state => {
    return {
        category_list: state.course.category_list,
        news_detail: state.news.news_detail,
        user: state.site.user,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
