import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Checkbox, Empty, Spin, Radio, InputNumber,Tag, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message,DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import Editor from '../../components/Editor'
import qrcode from '../../assets/img/code.jpg'
import type_1 from '../../assets/img/type_01.png'
import type_2 from '../../assets/img/type_02.png'
import type_3 from '../../assets/img/type_03.png'
import type_4 from '../../assets/img/type_04.png'
import moment from 'moment';
import connectComponent from '../../util/connect';
import PersonType from '../../components/PersonType'
import locale from 'antd/es/date-picker/locale/zh_CN';
import * as courseService from '../../redux/service/course'
import SwitchCom from '../../components/SwitchCom'
import AntdOssUpload from '../../components/AntdOssUpload'
import CourseGoods from '../../components/CourseGoods'

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


class EditStaticCourse extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchTag = debounce(this.fetchTag, 500);
        this.fetchTeacher = debounce(this.fetchTeacher, 500);
    }
    state = {
        imgList: [],
        fileList: [],
        fileList_1: [],
        previewVisible: false,
        previewImage: '',
        showTheBox: true,
        isVideoCourse: true,
        fetching: false,
        selectData: [],
        selectValue: [],

        teacherFetching: false,
        selectTeacher: [],
        teacherData: [],

        ctype: 3,
        category_id: '',
        ccategory_id: '',
        content: '',
        course_id: 0,
        course_img: '',
        images: '',
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
        teacher_id: '',

        course_link: '',
        is_series: '0',

        ttype: '0',
        second_category: [],
        notify: 0,
        plant: 0,

        course_cash: "",
        pay_type: 0,
        course_integral: '',
        is_agent: 0,
        tuser_tax: 0,
        vuser_tax: 0,
        user_tax: 0,
        is_shop: 0,
        can_share:0,
        can_bonus:0,
        shelves_time:'',
        shelvesTime:null,
        videoList:[],
        beginUrl:'',
        stime:0
    };
    category_list = []
    input_value = ''
    course_goods = {
        uploader: () => false,
        publisher: () => false
    }

    onCourseImgRemove = () => {
        this.setState({
            course_img: ''
        })
    }
    beforeUpload = (file) => {
        const isJpgOrPng = file.type.indexOf('image') > -1;
        return isJpgOrPng;
    }

    onCourseImgChange = ({ file, fileList, event }) => {
        let course_img = ''
        const isMedia = file.type.indexOf('image') > -1
        if (!isMedia) {
            message.info('只能上传 JPG/PNG/GIF 文件!');
            return;
        }

        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                if (index == 0) {
                    course_img = ele.response.resultBody
                }
            }
        })

        this.setState({
            fileList,
            course_img
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
    onPublish = () => {
        if (this._onPublish() === false) {
            this.setState({ loading: false })
        }
    }
    _onPublish = () => {
        this.setState({ loading: true })
        let {

            ctype,
            category_id,

            course_id,
            course_name,

            integral,
            is_recomm,
            sn,
            room_id,
            sort_order,
            status,
            summary,

            teacher_id,
            ttype,
            selectValue,
            is_series,
            score,
            can_share,

            ccategory_id,
            notify,
            plant,
            is_agent,
            tuser_tax,
            vuser_tax,
            user_tax,
            is_shop,
            can_bonus,
            shelves_time,
        } = this.state;

        let tag_ids = []
        selectValue.map(ele => {
            tag_ids.push(ele.key)
        })

        const { actions } = this.props
        const content = this.refs.editor.toHTML()

        let flag = this.refs.personType.getValue()
        const course_img = (this.img && this.img.getValue()) || ''
        const that = this
        let images = ''
        let audio = (this.audio && this.audio.getValue()) || ''
        if (flag === null) {
            return false;
        }

        console.log(flag)
        if (!course_name) { message.info('请输入课程名称'); return false; }
        if (!summary) { message.info('请输入课程摘要'); return false; }

        if (!course_img) { message.info('请上传封面'); return false; }

        if (category_id == '') { message.info('请选择课程分类'); return false; }
        if (!ccategory_id) { message.info('请选择课程子分类'); return false; }

        if (this.state.ttype !== 0) {
            images = (this.imgs && this.imgs.getValue()) || ''
            console.log(images)
            if (images == '') {
                message.info('请上传排版图'); return false;
            }
            if (this.state.ttype == 1 && images.split(',').length < 3) {
                message.info('当前排版需要三张图片'); return false;
            }
        }

        if (sort_order > 9999) { message.info('排序不能大于9999'); return false; }
        if (!sn) { message.info('请输入课程编号'); return false; }
        if (!content || content == '<p></p>') { message.info('请输入课程详情'); return false; }
        if(is_agent==1){
            if(tuser_tax>100){message.info({content:'老师佣金比例不能超过100'});return}
            if(vuser_tax>100){message.info({content:'认证佣金比例不能超过100'});return}
            if(user_tax>100){message.info({content:'非认证佣金比例不能超过100'});return}
        }
        if (this.state.ttype == 0) {
            images = course_img
        }
        let times = shelves_time
        if(status==1){
            times=''
        }
        actions.publishCour({
            is_shop,
            is_agent,
            tuser_tax,
            vuser_tax,
            user_tax,

            ctype: 3,
            category_id,
            ccategory_id,
            content,
            course_id,
            course_img,
            course_name,
            flag: flag === 'nofile' ? '/I/' : flag,
            integral,
            is_recomm,
            room_id,
            sort_order,
            status:1,
            summary,
            tag_ids: tag_ids.join(','),
            teacher_id,
            sn,
            is_series,
            can_share,
            ttype,
            score,
            images,
            notify,
            plant,
            can_bonus,
            shelves_time:times,
            begin_url:audio,
            resolved: async (data) => {
                await this.course_goods.publisher(data.courseId)
                await this.course_goods.uploader(data.courseId)

                if (flag === '/I/')
                    that.refs.personType.uploadFile(data.courseId, this.props.actions)
                else
                    message.success({
                        content: '提交成功',
                        onClose: () => {
                            window.history.back()
                            this.setState({ loading: false })
                        }
                    })
            },
            rejected: (data) => {
                this.setState({ loading: false })
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
    componentWillMount() {
        const course_id = this.props.match.params.course_id
        const { actions } = this.props

        this.fetchTeacher('')
        this.fetchTag('')
        this.course_id = course_id
        actions.getCategory({
            keyword: '',
            page: 0,
            pageSize: 10000,
            cctype: '-1',
            ctype: '3',
            parent_id: '0'
        })
        if (course_id !== '0')
            actions.getCourseInfo(course_id)
        if (this.props.match.path === '/course-manager/view-static-course/:course_id') {
            this.setState({ view_mode: true })
        }
    }
    componentWillReceiveProps(n_props) {
        if (n_props.category_list !== this.props.category_list) {
            this.category_list = n_props.category_list.data
            console.log(this.category_list)
        }
        if (n_props.course_info !== this.props.course_info) {
            this.course_info = n_props.course_info

            console.log(this.course_info)

            let _course_img = []
            let fileList = []
            let selectValue = []
            let flag_select = 1
            let selectTeacher = [{
                key: '0',
                label: '无'
            }]
            let checkValue = []
            let tag_ids = []
            let teacher_id = 0
            let images = []
            let imgList = []

            if (this.course_info.flag) {
                checkValue = this.course_info.flag.split('/')
                checkValue.pop()
                checkValue.shift()
            }
            if (this.course_info.teacherId) {
                teacher_id = this.course_info.teacherId
                selectTeacher = [{
                    key: this.course_info.teacherId + '',
                    label: this.course_info.teacherName
                }]
            }
            if (this.course_info.tagList.length !== 0) {
                this.course_info.tagList.map(ele => {
                    selectValue.push({
                        key: ele.tagId,
                        label: ele.tagName
                    })

                })
            }
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

            if (this.course_info.flag) {
                checkValue = this.course_info.flag.split('/')
                checkValue.pop()
                checkValue.shift()
            }

            if (!this.course_info.flag)
                flag_select = 0
            else if (this.course_info.flag == '/2/')
                flag_select = 1
            else
                flag_select = 2

            this._getCategory(this.course_info.categoryId)
            let is_agent = 0,
                tuser_tax = 0,
                vuser_tax = 0,
                user_tax = 0
            const {
                tuserTax,
                vuserTax,
                userTax,
                isAgent,
                isShop: is_shop,
            } = this.course_info
            if (tuserTax && vuserTax && userTax && isAgent) {
                is_agent = isAgent
                tuser_tax = tuserTax
                vuser_tax = vuserTax
                user_tax = userTax
            }
            let time = ''
            let Tims = null
            if(this.course_info.shelvesTime){
                time = moment.unix(this.course_info.shelvesTime).format('YYYY-MM-DD HH:mm')
                Tims = moment(time)
            }
            if(this.course_info.beginUrl){
                let audioList=[]
                audioList.push({ response: { resultBody: this.course_info.beginUrl }, type: 'audio/mp3', uid: 1, name: 'mp3', status: 'done', url: this.course_info.beginUrl })
                this.setState({
                    videoList:audioList
                })
            }
            this.setState({
                is_shop,
                is_agent,
                tuser_tax,
                vuser_tax,
                user_tax,
                plant: this.course_info.plant,
                course_id: this.course_info.courseId,
                ccategory_id: this.course_info.ccategoryId,
                checkValue: checkValue,
                flag_select: flag_select,
                flag: this.course_info.flag,
                teacher_id: teacher_id,
                fileList: fileList,
                course_name: this.course_info.courseName,
                summary: this.course_info.summary,
                selectTeacher: selectTeacher,
                selectValue: selectValue,
                course_img: this.course_info.courseImg,
                category_id: this.course_info.categoryId,
                category_name: this.course_info.category_name,
                sort_order: this.course_info.sortOrder,
                score: this.course_info.score,
                status: this.course_info.status,
                sn: this.course_info.sn,
                content: this.course_info.content,
                isSeries: this.course_info.isSeries,
                ttype: this.course_info.ttype,
                can_share:this.course_info.canShare,
                imgList: imgList,
                can_bonus:this.course_info.canBonus,
                shelves_time:time,
                shelvesTime:Tims,
                beginUrl:this.course_info.beginUrl,
                stime:this.course_info.shelvesTime,
            })
        }
    }

    fetchTeacher = value => {
        this.setState({ teacherData: [], teacherFetching: true });
        this.props.actions.searchTeacher({
            keyword: value,
            resolved: (data) => {
                const teacherData = data.data.map(ele => ({
                    text: ele.teacherName,
                    value: ele.teacherId,
                }))
                this.setState({ teacherData, teacherFetching: false })
            },
            rejected: (data) => {
                this.setState({ teacherFetching: false })
                message.error(JSON.stringify(data))
            }
        })
    }
    fetchTag = value => {
        this.setState({ selectData: [], fetching: true });
        this.props.actions.searchTag({
            keyword: value,
            resolved: (data) => {
                const selectData = data.data.map(ele => ({
                    text: ele.tagName,
                    value: ele.tagId,
                }))
                this.setState({ selectData, fetching: false })
            },
            rejected: (data) => {
                this.setState({ fetching: false })
                message.error(JSON.stringify(data))
            }
        })
    };
    onSelectTag = value => {
        this.setState({
            selectValue: value,
            fetching: false,
        });
    };
    onSelectTeacher = value => {
        if (value.key == ' ')
            value.key = 0
        this.setState({
            selectTeacher: value,
            teacherFetching: false,
            teacher_id: value.key
        });
    }
    handleCancelModal = () => this.setState({ previewVisible: false });
    onSearchTag = value => {
        this.input_value = value;
        this.fetchTag(value);
    }
    addTmp = () => {
        if (!this.input_value) {
            message.error("请输入内容再提交");
            return;
        }
        let { selectValue } = this.state;
        const { actions } = this.props
        actions.publishTag({
            tagName: this.input_value,
            resolved: (data) => {
                selectValue.push({ key: data.tagId, label: data.tagName });
                let tag_ids = [];
                selectValue.map((ele) => {
                    tag_ids.push(ele.key)
                })
                tag_ids = tag_ids.join(',')

                this.setState({ selectValue, tag_ids });
                this.input_value = ''
            },
            rejected: (data) => {
                message.error(data)
            }
        })

    }

    _onCateChange = (val) => {
        this.setState({ category_id: val, ccategory_id: '' })
        this._getCategory(val)
    }
    _getCategory = (parent_id) => {
        courseService.getCategory({
            keyword: '',
            page: 0,
            pageSize: 100,
            cctype: '',
            ctype: '3',
            parent_id: parent_id
        }).then((data) => {

            let second_category = []
            data.data.map((ele) => {
                second_category.push({ categoryId: ele.categoryId, categoryName: ele.categoryName })
            })

            this.setState({ second_category })

        })
    }
    
    render() {

        const {
            fetching,
            selectData,
            selectValue,
            teacherFetching,
            selectTeacher,
            teacherData,
            category_name,

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
            can_share
        } = this.state;
        let time = new Date().getTime()
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={course_id == '0' ? "创建图文课程" : view_mode ? "图文课程详情" : "编辑图文课程"}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{ minHeight: '400px' }}>
                                    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                                        <Form.Item label="课程名称">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e => {
                                                    this.setState({ course_name: e.target.value })
                                                }}
                                                value={this.state.course_name} className="m_w400" placeholder="" />
                                        </Form.Item>
                                        <Form.Item label="摘要">
                                            <TextArea disabled={view_mode} autoSize={{ minRows: 2 }} onChange={e => {
                                                this.setState({
                                                    summary: e.target.value
                                                })
                                            }} value={this.state.summary} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="讲师">
                                            <Select
                                                disabled={view_mode}
                                                showSearch
                                                labelInValue
                                                placeholder="搜索讲师"
                                                notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                                filterOption={false}
                                                onSearch={this.fetchTeacher}
                                                onChange={this.onSelectTeacher}
                                                style={{ width: '400px' }}
                                                value={selectTeacher}
                                            >
                                                <Option key={0}>无</Option>
                                                {teacherData.map(d => (
                                                    <Option key={d.value}>{d.text}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="封面">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                disabled={view_mode}
                                                ref={ref => this.img = ref}
                                                value={this.state.fileList}
                                                listType="picture-card"
                                                disabled={view_mode}
                                                maxLength={1}
                                                accept='image/*'
                                            >
                                            </AntdOssUpload>
                                            <span style={{ marginTop: '-30px', display: 'block', color: 'red', fontSize: '12px' }}>* 请上传符合尺寸为 900 x 384 的图片</span>
                                        </Form.Item>
                                        <Form.Item label="课程分类">
                                            <Select disabled={view_mode} onChange={this._onCateChange} value={this.state.category_id} disabled={this.state.view_mode} className="m_w400">
                                                {this.category_list.map((ele, index) => (
                                                    <Option key={index + 'cate'} value={ele.categoryId}>{ele.categoryName}</Option>
                                                ))}
                                            </Select>
                                            <Select disabled={view_mode} value={this.state.ccategory_id} className="m_w400" disabled={this.state.view_mode} onChange={val => {
                                                this.setState({ ccategory_id: val })
                                            }}>
                                                <Option value={0}>无</Option>
                                                {this.state.second_category.map((ele, index) => (
                                                    <Option key={index + 'cate_se'} value={ele.categoryId}>{ele.categoryName}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="开放对象">
                                            <PersonType disabled={view_mode} actions={this.props.actions} courseId={this.course_id} flag={this.state.flag} ref='personType'></PersonType>
                                        </Form.Item>
                                        <Form.Item label="标签设置">
                                            <Input.Group compact>
                                                <Select
                                                    disabled={view_mode}
                                                    mode="multiple"
                                                    labelInValue
                                                    value={selectValue}
                                                    placeholder="搜索标签"
                                                    notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
                                                    filterOption={false}
                                                    onSearch={this.onSearchTag}
                                                    onChange={this.onSelectTag}
                                                    style={{ width: '300px' }}
                                                >
                                                    {selectData.map(d => (
                                                        <Option key={d.value}>{d.text}</Option>
                                                    ))}
                                                </Select>
                                                {view_mode ? null :
                                                    <Button onClick={this.addTmp}>添加</Button>
                                                }
                                            </Input.Group>
                                        </Form.Item>
                                        <Form.Item label="排版">
                                            <Radio.Group disabled={view_mode} onChange={e => {
                                                this.setState({ ttype: e.target.value })
                                            }} name="radiogroup" value={this.state.ttype}>
                                                <Radio value={0}>
                                                    <img src={type_1} style={{ height: '40%' }} />
                                                </Radio>
                                                <Radio value={1}>
                                                    <img src={type_2} style={{ height: '40%' }} />
                                                </Radio>
                                                <Radio value={2}>
                                                    <img src={type_3} style={{ height: '40%' }} />
                                                </Radio>
                                                <Radio value={3}>
                                                    <img src={type_4} style={{ height: '40%' }} />
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {this.state.ttype !== 0 ?
                                            <Form.Item label="排版图">
                                                {this.state.ttype == 1 ?
                                                    <AntdOssUpload
                                                        actions={this.props.actions}
                                                        disabled={view_mode}
                                                        ref={ref => this.imgs = ref}
                                                        value={this.state.imgList}
                                                        listType="picture-card"
                                                        maxLength={3}
                                                        accept='image/*'
                                                    >
                                                    </AntdOssUpload> :
                                                    <AntdOssUpload
                                                        actions={this.props.actions}
                                                        disabled={view_mode}
                                                        ref={ref => this.imgs = ref}
                                                        value={this.state.imgList}
                                                        listType="picture-card"
                                                        maxLength={1}
                                                        accept='image/*'
                                                    >
                                                    </AntdOssUpload>
                                                }
                                                <span style={{ marginTop: '-30px', display: 'block', color: 'red' }}>
                                                    {
                                                        this.state.ttype == 1 ? '* 请上传符合尺寸为 510 x 306 的图片' :
                                                            this.state.ttype == 2 ? '* 请上传符合尺寸为 900 x 384 的图片' :
                                                                '* 请上传符合尺寸为 526 x 316 的图片'
                                                    }
                                                </span>
                                            </Form.Item>
                                            : null}
                                        {/* <Form.Item label='推课'>
                                            <Radio.Group
                                                value={this.state.is_agent}
                                                onChange={e => {
                                                    this.setState({ is_agent: e.target.value })
                                                }}
                                                disabled={view_mode}
                                            >
                                                <Radio value={0}>否</Radio>
                                                <Radio value={1}>是</Radio>
                                            </Radio.Group>
                                            {this.state.is_agent ?
                                                <div>
                                                    老师佣金比例&nbsp;&nbsp;<InputNumber value={this.state.tuser_tax} onChange={tuser_tax => this.setState({ tuser_tax })} disabled={view_mode} /><br />
                                                    认证佣金比例&nbsp;&nbsp;<InputNumber value={this.state.vuser_tax} onChange={vuser_tax => this.setState({ vuser_tax })} placeholder='针对销售价的比例' style={{ width: '150px' }} disabled={view_mode} /><br />
                                                    非认证佣金比例&nbsp;&nbsp;<InputNumber value={this.state.user_tax} onChange={user_tax => this.setState({ user_tax })} placeholder='针对销售价的比例' style={{ width: '150px' }} disabled={view_mode} />
                                                </div>
                                                : null}
                                        </Form.Item> */}
                                        <Form.Item label="排序">
                                            <InputNumber disabled={view_mode} onChange={val => {
                                                if (val !== '' && !isNaN(val)) {
                                                    val = Math.round(val)
                                                    if (val < 0) val = 0
                                                    this.setState({ sort_order: val })
                                                }
                                            }} value={this.state.sort_order} min={0} max={9999} />
                                            <div style={{ fontSize: '12px', color: 'red' }}>* 数值越大越靠前</div>
                                        </Form.Item>
                                        <Form.Item label="是否上架">
                                            <Switch disabled={view_mode} checked={this.state.status == 1&&time>=this.state.stime*1000 ? true : false} onChange={(checked) => {
                                                this.setState({
                                                    stime:0
                                                })
                                                if (checked)
                                                    this.setState({ status: 1 })
                                                else
                                                    this.setState({ status: 0 })
                                            }} />
                                        </Form.Item>
                                        {
                                            this.state.status == 0 || time<=this.state.stime*1000?
                                            <Form.Item label="上架时间">
                                                <DatePicker
                                                    disabled={view_mode}
                                                    // disabledTime={this.disabledTime} 
                                                    format='YYYY-MM-DD HH:mm'
                                                    showTime={{ format: 'HH:mm' }}
                                                    allowClear={true}
                                                    value={this.state.shelvesTime}
                                                    // disabledDate = {this.disabledEndDate} 
                                                    locale={locale}
                                                    onChange={(date, dateString) => {
                                                        console.log(dateString)
                                                        this.setState({shelves_time: dateString,shelvesTime:date})
                                                    }}
                                                />
                                                </Form.Item>
                                                :null
                                        }
                                        {/* <Form.Item label="是否分销">
                                            <Switch disabled={view_mode} checked={this.state.can_bonus?true:false} onChange={(e)=>{
                                                if(e){
                                                    this.setState({can_bonus:1})
                                                }else{
                                                    this.setState({can_bonus:0})
                                                }
                                            }}/>
                                        </Form.Item> */}
                                        <Form.Item label="是否通知">
                                            <SwitchCom disabled={view_mode} tips="* 当选择讲师后，将会向关注此讲师的用户推送系统通知" value={this.state.notify} onChange={(notify) => { 
                                                this.setState({ notify }) 
                                                if(notify){
                                                    message.info({
                                                        content:'提示：本次修改或添加通知的课程仅限一次，如需再通知，请修改时继续点击此按钮！'
                                                    })
                                                }
                                                }}></SwitchCom>
                                        </Form.Item>
                                        <Form.Item label="是否分享">
                                                <Switch disabled={view_mode} checked={can_share==1?true:false} onChange={(e)=>{
                                                    if(e){
                                                        this.setState({can_share:1})
                                                    }else{
                                                        this.setState({can_share:0})
                                                    }
                                                }}/>
                                            </Form.Item>
                                        <Form.Item label="课程编号">
                                            <Input disabled={view_mode} value={this.state.sn} onChange={e => {
                                                this.setState({ sn: e.target.value })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="发布平台">
                                            <Radio.Group
                                                disabled={view_mode}
                                                value={this.state.plant}
                                                onChange={e => {
                                                    this.setState({ plant: e.target.value })
                                                }}
                                            >
                                                <Radio disabled={view_mode} value={0}>全部</Radio>
                                                <Radio disabled={view_mode} value={1}>微信</Radio>
                                                <Radio disabled={view_mode} value={2}>APP</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="音频上传">
                                        <AntdOssUpload
                                                actions={this.props.actions}
                                                disabled={view_mode}
                                                ref={ref => this.audio = ref}
                                                value={this.state.videoList}
                                                listType="picture-card"
                                                maxLength={1}
                                                accept='audio/mp3'
                                            >
                                            </AntdOssUpload>
                                            {
                                                this.state.beginUrl?
                                                <Tag>链接:{this.state.beginUrl}</Tag>
                                                :null
                                            }
                                        </Form.Item>
                                        <Form.Item label="课程详情">
                                            <Editor readOnly={view_mode} content={this.state.content} ref='editor' actions={this.props.actions}></Editor>
                                            <p style={{color:"#ff7e7e",fontSize:'12px',lineHeight:'2'}}>* 音频请在音频栏里进行添加</p>
                                        </Form.Item>
                                    </Form>
                                    <CourseGoods
                                        disabled={view_mode}
                                        courseId={this.state.course_id}
                                        ref={ref => this.course_goods = ref}
                                        isShop={this.state.is_shop}
                                        actions={this.props.actions}
                                        onShopChange={is_shop => this.setState({ is_shop })}
                                    />
                                    <div className="flex f_row j_center mt_10">
                                        {view_mode ? null :
                                            <Button
                                                loading={this.state.loading}
                                                onClick={this.onPublish}
                                                type="primary"
                                            >
                                                提交
                                        </Button>
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
const LayoutComponent = EditStaticCourse;
const mapStateToProps = state => {
    return {
        category_list: state.course.category_list,
        course_info: state.course.course_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
