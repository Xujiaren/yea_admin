import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Checkbox, Empty, Spin, Radio, InputNumber, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import 'braft-editor/dist/index.css'
import locale from 'antd/es/date-picker/locale/zh_CN';
import TransferBox from '../../components/TransferBox';
import qrcode from '../../assets/img/code.jpg'
import moment from 'moment';
import debounce from 'lodash/debounce';

import config from '../../config/config';

import connectComponent from '../../util/connect';
import customUpload from '../../components/customUpload'

import * as courseService from '../../redux/service/course'
import PersonType from '../../components/PersonType'
import SwitchCom from '../../components/SwitchCom'
import AntdOssUpload from '../../components/AntdOssUpload';
import SearchPaper from '../../components/SearchPaper'
import CoursePrice from '../../components/CoursePrice'
import CourseGoods from '../../components/CourseGoods'
import Quetionna from '../ActivityMng/Quetionna'


const { Option } = Select;
const { Search, TextArea } = Input;

class EditCourse extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchTag = debounce(this.fetchTag, 500);
        this.fetchTeacher = debounce(this.fetchTeacher, 500);
        this.input_value = ''
    }
    state = {
        view_mode: false,

        checkValue: [],
        flag_select: 1,
        fileList: [],
        fileList_1: [],
        previewVisible: false,
        previewImage: '',
        editorState: null,

        isVideoCourse: true,

        fetching: false,
        selectData: [],
        selectValue: [],

        teacherFetching: false,
        selectTeacher: [],
        teacherData: [],
        category_name: '',
        score: 0,

        ctype: 0,
        category_id: '',
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
        teacher_id: 0,

        course_link: '',
        media_id: '',
        size: '',
        duration: '',
        videoList: [],
        isSeries: 0,

        second_category: [],
        notify: 0,

        course_cash: "",
        pay_type: 0,
        course_integral: '',
        ltype: 0,
        plant: 0,

        linkTypePre: 0,
        preLink: '',
        linkTypeAfter: 0,
        afterLink: '',
        level_integral: "",
        is_agent: 0,
        tuser_tax: 0,
        vuser_tax: 0,
        user_tax: 0,
        ulevel: 0,
        tlevel: 0,
        cost_price: 0,
        market_price: 0,
        is_shop: 0,
        can_share: 0,
        can_bonus: 0,
        patype: 0,
        hhtyp: 0,
        hhtyps: 0,
        papers: [],
        paper: 0,
        topicList: [],
        topicLists: [],
        fe_topicList: [],
        shows: true,
        free_chapter: 0,
        shelves_time: '',
        shelvesTime: null,
        stime: 0,
        ptype: 1,
        showWords: false
    };

    category_list = []
    course_info = {}
    course_price = {
        getValue: () => ''
    }
    course_goods = {
        uploader: () => false,
        publisher: () => false
    }

    componentWillMount() {
        const course_id = this.props.match.params.course_id + ''
        const { actions } = this.props

        this.course_id = course_id
        this.fetchTeacher('')
        this.fetchTag('')

        actions.getCategory({
            keyword: '',
            page: 0,
            pageSize: 10000,
            cctype: '-1',
            ctype: '3',
            parent_id: '0'
        })
        console.log(course_id)
        if (course_id !== '0') {
            actions.getCourseInfo(course_id)
            actions.getCoursePaper({
                course_id: course_id,
                resolved: (res => {
                    if (res.length > 0) {
                        this.setState({
                            hhtyp: 1,
                            paper: res[0].paperId
                        })
                    }
                }),
                rejected: (err => {
                    console.log(err)
                })
            })
            actions.getQues({
                course_id: course_id,
                stype:3,
                resolved: (res => {
                    if (res.length > 0) {
                        let topicList = []
                        res.map(ele => {
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
                        this.setState({ topicList: topicList, hhtyp: 1 })
                    }
                }),
                rejected: (err => {
                    console.log(err)
                })
            })
            actions.getQues({
                course_id: course_id,
                stype:4,
                resolved: (res => {
                    if (res.length > 0) {
                        let topicLists = []
                        res.map(ele => {
                            let optionss = []
                            let dataSources = []
                            ele.topicOptions.map((_ele, _index) => {
                                optionss.push(_ele.optionLabel)
                                dataSources.push({
                                    label: String.fromCharCode(_index + 65),
                                    title: _ele.optionLabel,
                                })
                            })
                            topicLists.push({
                                title: ele.title,
                                ttype: ele.ttype,
                                options: optionss,
                                uid: Math.random() * 10 + Date.now() + '',
                                dataSources
                            })
                        })
                        this.setState({ topicLists: topicLists, hhtyps: 1 })
                    }
                }),
                rejected: (err => {
                    console.log(err)
                })
            })
        }

        if (this.props.match.path === '/course-manager/view-course/:course_id') {
            this.setState({ view_mode: true })
        }
        this.getAuthPaper()
    }
    componentWillReceiveProps(n_props) {
        if (n_props.category_list !== this.props.category_list) {
            this.category_list = n_props.category_list.data
        }
        if (n_props.auth_paper_list !== this.props.auth_paper_list) {
            this.setState({
                papers: n_props.auth_paper_list.data
            })
        }
        if (n_props.course_info !== this.props.course_info) {
            this.course_info = n_props.course_info

            let fileList = []
            let selectValue = []
            let selectTeacher = [{
                key: 0,
                label: '无'
            }]
            let teacher_id = 0

            let videoList = []

            if (this.course_info.mediaId !== '') {
                videoList = [{ status: 'done', type: 'video/mp4', response: { resultBody: this.course_info.mediaId }, uid: 'dd', name: this.course_info.mediaId, url: '' }]
            }

            if (this.course_info.teacherId) {
                teacher_id = this.course_info.teacherId
                selectTeacher = [{
                    key: this.course_info.teacherId,
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
                    fileList.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
                })
            }
            const { beginUrl = '', beginUrlType = 0, endUrl = '', endUrlType = 0 } = this.course_info

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
                tlevel,
                ulevel,
                costPrice,
                marketPrice,
                isShop,

            } = this.course_info
            if (tuserTax && vuserTax && userTax && isAgent) {
                is_agent = isAgent
                tuser_tax = tuserTax
                vuser_tax = vuserTax
                user_tax = userTax
            }
            let time = ''
            let Tims = null
            if (this.course_info.shelvesTime) {
                time = moment.unix(this.course_info.shelvesTime).format('YYYY-MM-DD HH:mm')
                Tims = moment(time)
            }
            this.setState({
                is_shop: isShop,
                cost_price: costPrice,
                market_price: marketPrice,
                tlevel,
                ulevel,
                is_agent,
                tuser_tax,
                vuser_tax,
                user_tax,
                level_integral: this.course_info.levelIntegral,

                linkTypePre: beginUrlType || 0,
                preLink: beginUrl,
                linkTypeAfter: endUrlType || 0,
                afterLink: endUrl,

                ltype: this.course_info.ltype || 0,
                integral: this.course_info.integral,
                course_integral: this.course_info.courseIntegral,
                course_cash: this.course_info.courseCash,
                pay_type: this.course_info.payType,

                ccategory_id: this.course_info.ccategoryId,
                videoList: videoList,
                media_id: this.course_info.mediaId,
                size: this.course_info.size,
                duration: this.course_info.duration,
                course_id: this.course_info.courseId,
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
                plant: this.course_info.plant,
                can_share: this.course_info.canShare,
                can_bonus: this.course_info.isAgent,
                free_chapter: this.course_info.freeChapter,
                stime: this.course_info.shelvesTime,
                shelves_time: time,
                shelvesTime: Tims
            })
        }
    }
    getAuthPaper = () => {
        const { actions } = this.props;

        actions.getAuthPaper({
            ctype: 27,
            paper_id: '',
            keyword: '',
            page: 0,
            pageSize: 10
        })
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
    };
    handleCancelModal = () => this.setState({ previewVisible: false });

    onPublish = () => {
        const { media_id } = this.state
        const { actions } = this.props

        this.setState({ loading: true })

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
                    message.error('获取视频时长信息出错，请重新上传，' + JSON.stringify(data))
                }
            })
        setTimeout(() => {
            if (this._onPublish() === false) {
                this.setState({ loading: false })
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
            score,
            size,
            duration,
            media_id,
            ccategory_id,
            notify,

            course_integral,
            course_cash,
            pay_type,
            ltype,
            plant,
            can_share,

            linkTypePre,
            preLink,
            linkTypeAfter,
            afterLink,
            is_agent,
            tuser_tax,
            vuser_tax,
            user_tax,
            tlevel,
            ulevel,
            cost_price,
            market_price,
            is_shop,
            can_bonus,
            paper,
            hhtyp,
            hhtyps,
            free_chapter,
            shelves_time,
            fe_topicList
        } = this.state;

        // let begin_ks_url = '',begin_wj_url = '',end_ks_url = '',end_wj_url=''
        // if(linkTypePre){
        //     begin_ks_url = preLink
        // }else{
        //     begin_wj_url = preLink
        // }
        // if(linkTypeAfter){
        //     end_ks_url = afterLink
        // }else{
        //     end_wj_url = afterLink
        // }
        // if(linkTypeAfter == -1){
        //     end_ks_url = ''
        //     end_wj_url = ''
        // }
        // if(linkTypePre == -1){
        //     begin_ks_url = ''
        //     begin_wj_url = ''
        // }
        const { actions } = this.props
        let tag_ids = []
        selectValue.map(ele => {
            tag_ids.push(ele.key)
        })

        let flag = this.refs.personType.getValue()

        const course_img = (this.img && this.img.getValue()) || ''
        const that = this
        if (flag === null) {
            return false;
        }
        if (!course_name) { message.info('请输入课程名称'); return false; }
        if (!summary) { message.info('请输入课程摘要'); return false; }

        if (!course_img) { message.info('请上传主图'); return false; }

        if (category_id == '') { message.info('请选择课程分类'); return false; }
        if (!ccategory_id) { message.info('请选择课程子分类'); return false; }
        if (hhtyp == 0) {
            if (linkTypePre != 0 && !preLink) {
                message.info('请输入课前外链')
                return false
            }
        }
        if (hhtyps == 0) {
            if (linkTypeAfter != 0 && !afterLink) {
                message.info('请输入课后外链')
                return false
            }
        }
        if (sort_order > 9999) { message.info('课程排序不能大于9999'); return false; }
        if (!sn) { message.info('请输入课程编号'); return false; }

        if ((pay_type == 1 || pay_type == 3) && !integral) {
            message.info('请设置金币价格'); return false
        }
        if ((pay_type == 2 || pay_type == 3) && !course_cash) {
            message.info('请设置现金价格'); return false
        }
        if (status == 0) {
            if (!shelves_time) { message.info('请设置上架时间'); return false }
        }
        if (pay_type == 0) {
            integral = 0
            course_integral = 0
        }
        if (is_agent == 1) {
            if (tuser_tax > 100) { message.info({ content: '老师佣金比例不能超过100' }); return }
            if (vuser_tax > 100) { message.info({ content: '认证佣金比例不能超过100' }); return }
            if (user_tax > 100) { message.info({ content: '非认证佣金比例不能超过100' }); return }
        }
        // if(!content){ message.info('请输入课程详情'); return false;}

        let level_integral = this.course_price.getValue()
        let quetionna = []
        let quetionnas = []
        if (hhtyp == 1) {
            if (linkTypePre == 1 || linkTypeAfter == 1) {
                if (this.quetionna)
                    quetionna = this.quetionna.getValue() || []
                if (quetionna.length == 0 && hhtyp == 1) {
                    message.info('请上传问卷题目'); return false;
                }
            }
        }
        if (hhtyps == 1) {
            if (linkTypePre == 1 || linkTypeAfter == 1) {
                if (this.quetionnas)
                    quetionnas = this.quetionnas.getValue() || []
                if (quetionnas.length == 0 && hhtyps == 1) {
                    message.info('请上传问卷题目'); return false;
                }
            }
        }
        let times = shelves_time
        if (status == 1) {
            times = ''
        }
        actions.publishCour({
            is_shop,
            cost_price,
            market_price,
            tlevel,
            ulevel,
            is_agent: can_bonus,
            tuser_tax,
            vuser_tax,
            user_tax,
            level_integral,

            begin_url: preLink,
            begin_url_type: linkTypePre,
            end_url: afterLink,
            end_url_type: linkTypeAfter,

            ctype,
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
            status: 1,
            summary,
            tag_ids: tag_ids.join(','),
            teacher_id,
            sn,
            is_series: isSeries,
            score,
            size,
            duration,
            media_id,
            can_share,
            notify,
            course_integral,
            course_cash,
            pay_type,
            ltype,
            plant,
            can_bonus,
            free_chapter,
            shelves_time: times,
            resolved: async (data) => {
                // this.paper_list&&this.paper_list.setCoursePapers(data.courseId)

                await this.course_goods.publisher(data.courseId)
                await this.course_goods.uploader(data.courseId)
                this.setState({
                    course_id: data.courseId
                })
                if (hhtyp == 1) {
                    if (linkTypePre == 2 ) {
                        actions.setCoursePaper({
                            course_id: data.courseId,
                            paper_id: paper,
                            paper_name: data.courseName,
                            ltype: 0,
                            resolved: (res => {
                                if (flag === '/I/')
                                    that.refs.personType.uploadFile(data.courseId, this.props.actions, this)
                                if (linkTypePre !== 1 && linkTypeAfter !== 1) {
                                    message.success({
                                        content: '提交成功',
                                        onClose: () => {
                                            this.setState({ loading: false })
                                            window.history.back()
                                        }
                                    })
                                }
                            }),
                            rejected: (err => {
                                console.log(err)
                            })
                        })

                    }
                    if (linkTypePre == 1) {
                        actions.checkCourseAsk({
                            action: 'check',
                            course_id: data.courseId,
                            resolved: (res) => {
                                if (res == true) {
                                    this.setState({
                                        showWords: true
                                    })
                                    quetionna.map((ele, index) => {
                                        actions.publishQuestionnas({
                                            ttype: ele.ttype,
                                            title: ele.title,
                                            options: ele.options.join('|||'),
                                            topic_id: 0,
                                            course_id: data.courseId,
                                            stype:3,
                                            resolved: () => {
                                                if (flag === '/I/'){
                                                    that.refs.personType.uploadFile(data.courseId, that.props.actions, this)
                                                }
                                            },
                                            rejected: (data) => {
                                                console.log(data)
                                            }
                                        })
                                    })
                                }else{
                                    quetionna.map((ele, index) => {
                                        actions.publishQuestionnas({
                                            ttype: ele.ttype,
                                            title: ele.title,
                                            options: ele.options.join('|||'),
                                            topic_id: 0,
                                            course_id: data.courseId,
                                            stype:3,
                                            resolved: () => {
                                                if (flag === '/I/'){
                                                    that.refs.personType.uploadFile(data.courseId, that.props.actions, this)
                                                }
                                                message.success({
                                                    content: '提交成功',
                                                    onClose: () => {
                                                        this.setState({ loading: false })
                                                        window.history.back()
                                                    }
                                                })
            
                                            },
                                            rejected: (data) => {
                                                console.log(data)
                                            }
                                        })
                                    })
                                }
                            },
                            rejected: (err) => {
                                message.success({
                                    content: '提交成功',
                                    onClose: () => {
                                        this.setState({ loading: false })
                                        window.history.back()
                                    }
                                })
                            }
                        })

                    }
                    if (linkTypePre == 0 ) {
                        if (flag === '/I/')
                            that.refs.personType.uploadFile(data.courseId, this.props.actions, this)
                        else
                            message.success({
                                content: '提交成功',
                                onClose: () => {
                                    this.setState({ loading: false })
                                    window.history.back()
                                }
                            })
                    }

                }
                if(hhtyps==1){
                    if (linkTypeAfter == 2) {
                        actions.setCoursePaper({
                            course_id: data.courseId,
                            paper_id: paper,
                            paper_name: data.courseName,
                            ltype: 1,
                            resolved: (res => {
                                if (flag === '/I/')
                                    that.refs.personType.uploadFile(data.courseId, this.props.actions, this)
                                if (linkTypePre !== 1 && linkTypeAfter !== 1) {
                                    message.success({
                                        content: '提交成功',
                                        onClose: () => {
                                            this.setState({ loading: false })
                                            window.history.back()
                                        }
                                    })
                                }
                            }),
                            rejected: (err => {
                                console.log(err)
                            })
                        })

                    }
                    if (linkTypeAfter == 1) {
                        actions.checkCourseAsk({
                            action: 'check',
                            course_id: data.courseId,
                            resolved: (res) => {
                                if (res == true) {
                                    this.setState({
                                        showWords: true
                                    })
                                    quetionnas.map((ele, index) => {
                                        actions.publishQuestionnas({
                                            ttype: ele.ttype,
                                            title: ele.title,
                                            options: ele.options.join('|||'),
                                            topic_id: 0,
                                            course_id: data.courseId,
                                            stype:4,
                                            resolved: () => {
                                                if (flag === '/I/'){
                                                    that.refs.personType.uploadFile(data.courseId, that.props.actions, this)
                                                }
                                            },
                                            rejected: (data) => {
                                                console.log(data)
                                            }
                                        })
                                    })
                                }else{
                                    quetionnas.map((ele, index) => {
                                        actions.publishQuestionnas({
                                            ttype: ele.ttype,
                                            title: ele.title,
                                            options: ele.options.join('|||'),
                                            topic_id: 0,
                                            course_id: data.courseId,
                                            stype:4,
                                            resolved: () => {
                                                if (flag === '/I/'){
                                                    that.refs.personType.uploadFile(data.courseId, that.props.actions, this)
                                                }
                                                message.success({
                                                    content: '提交成功',
                                                    onClose: () => {
                                                        this.setState({ loading: false })
                                                        window.history.back()
                                                    }
                                                })
            
                                            },
                                            rejected: (data) => {
                                                console.log(data)
                                            }
                                        })
                                    })
                                }
                            },
                            rejected: (err) => {
                                message.success({
                                    content: '提交成功',
                                    onClose: () => {
                                        this.setState({ loading: false })
                                        window.history.back()
                                    }
                                })
                            }
                        })

                    }
                    if (linkTypeAfter == 0) {
                        if (flag === '/I/')
                            that.refs.personType.uploadFile(data.courseId, this.props.actions, this)
                        else
                            message.success({
                                content: '提交成功',
                                onClose: () => {
                                    this.setState({ loading: false })
                                    window.history.back()
                                }
                            })
                    }
                }
                if(hhtyps!==1&&hhtyp!==1){
                    console.log('222')
                    if (flag === '/I/')
                        that.refs.personType.uploadFile(data.courseId, this.props.actions, this)
                    else
                        message.success({
                            content: '提交成功',
                            onClose: () => {
                                this.setState({ loading: false })
                                window.history.back()
                            }
                        })
                }
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
    onSearchTag = value => {
        this.input_value = value;
        this.fetchTag(value);
    }
    addTmp = () => {
        if (!this.input_value) {
            message.info("请输入内容再提交");
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
    beforeVideoUpload(file) {
        const isMp4 = file.type === 'video/mp4'
        return isMp4;
    }
    onCourseVideoChange = ({ file, fileList }) => {
        if (file.type !== 'video/mp4') {
            message.error('只能上传 MP4 视频文件!');
            return;
        }

        let media_id = ''
        let size = ''
        let videoList = fileList

        if (file.status == 'done' && file.response.err == '0') {
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
            videoList,
            media_id
        })
    };
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
    onRight = () => {
        let {
            course_id,

        } = this.state;
        this.props.actions.checkCourseAsk({
            action: 'clear',
            course_id: course_id,
            resolved: (res) => {
                this.setState({
                    showWords: false
                })
                message.success({
                    content: '提交成功',
                    onClose: () => {
                        this.setState({ loading: false })
                        window.history.back()
                    }
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })

    }
    onOut = () => {
        this.setState({
            showWords: false
        })
        message.success({
            content: '提交成功',
            onClose: () => {
                this.setState({ loading: false })
                window.history.back()
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
        const uploadBtnVideo = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传视频</div>
            </div>
        );
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
            course_cash,
            pay_type,
            course_integral,
            can_share,
        } = this.state;
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
        let time = new Date().getTime()
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={course_id == '0' ? "创建视频课程" : view_mode ? "视频课程详情" : "编辑视频课程"}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{ minHeight: '400px' }}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="课程名称">
                                            <Input disabled={view_mode} onChange={(e) => {
                                                this.setState({ course_name: e.target.value })
                                            }} className="m_w400" value={course_name} />
                                        </Form.Item>
                                        <Form.Item label="摘要">
                                            <TextArea disabled={view_mode} autoSize={{ minRows: 2 }} value={summary} onChange={e => { this.setState({ summary: e.target.value }) }} className="m_w400" />
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
                                        <Form.Item label="主图">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                disabled={view_mode}
                                                ref={ref => this.img = ref}
                                                value={this.state.fileList}
                                                listType="picture-card"
                                                maxLength={1}
                                                accept='image/*'
                                            >
                                            </AntdOssUpload>
                                            <span style={{ marginTop: '-30px', display: 'block' }}>(480px * 272px)</span>
                                        </Form.Item>
                                        {/* <Form.Item label="上传视频">
                                            <Upload
                                                disabled={view_mode}
                                                listType="picture-card"
                                                fileList={this.state.videoList}
                                                onChange={this.onCourseVideoChange}
                                                beforeUpload={this.beforeVideoUpload}
                                                customRequest={customUpload}
                                            >
                                                {this.state.videoList.length >= 1 ? null : uploadBtnVideo}
                                            </Upload>
                                            <span>媒体ID ：{this.state.media_id}</span>
                                        </Form.Item>
                                        <Form.Item label="视频链接">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({media_id:e.target.value})
                                                }}
                                                value={this.state.media_id} className="m_w400" placeholder=""/>
                                        </Form.Item> */}
                                        {/*
                                        <Form.Item label="课程形式">
                                            <Select className="m_w400" 
                                                value={this.state.isSeries}
                                                onChange={val=>{
                                                    this.setState({
                                                        isSeries:val
                                                    })
                                                }}
                                            >
                                                <Option value={0}>单课</Option>
                                                <Option value={1}>系列课</Option>
                                            </Select>
                                        </Form.Item>
                                        */}
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
                                            <PersonType disabled={view_mode} actions={this.props.actions} courseId={this.course_id} disabled={false} flag={this.state.flag} ref='personType'></PersonType>
                                        </Form.Item>
                                        <Form.Item label="课前外链">
                                            <Radio.Group value={this.state.linkTypePre} onChange={e => this.setState({ linkTypePre: e.target.value})}>
                                                <Radio value={0}>无</Radio>
                                                <Radio value={1}>问卷</Radio>
                                                <Radio value={2}>试卷</Radio>
                                            </Radio.Group>
                                            {
                                                this.state.linkTypePre == 0 ? null :
                                                    <div>
                                                        <Select style={{ width: 120 }} value={this.state.hhtyp} onChange={e => { this.setState({ hhtyp: e, paper: 0 }) }}>
                                                            <Option value={0}>外链</Option>
                                                            <Option value={1}>内链</Option>
                                                        </Select>
                                                        {
                                                            this.state.linkTypePre == 2 && this.state.hhtyp == 1 ?
                                                                <Select style={{ width: 260 }} value={this.state.paper} onChange={e => { this.setState({ paper: e }) }}>
                                                                    {
                                                                        this.state.papers.map(item => {
                                                                            return (
                                                                                <Option value={item.paperId}>{item.paperName}</Option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Select>
                                                                :
                                                                this.state.linkTypePre == 2 && this.state.hhtyp == 0 ?
                                                                    <Input.TextArea
                                                                        className="m_w400"
                                                                        autoSize={{ minRows: 1 }}
                                                                        value={this.state.preLink}
                                                                        onChange={e => this.setState({ preLink: e.target.value })}
                                                                    ></Input.TextArea>
                                                                    : null
                                                        }
                                                        {
                                                            this.state.linkTypePre == 1 && this.state.hhtyp == 1 ?
                                                                <Quetionna disabled={view_mode} dataSource={this.state.topicList} ref={(val) => { this.quetionna = val }} />
                                                                :
                                                                this.state.linkTypePre == 1 && this.state.hhtyp == 0 ?
                                                                    <Input.TextArea
                                                                        className="m_w400"
                                                                        autoSize={{ minRows: 1 }}
                                                                        value={this.state.preLink}
                                                                        onChange={e => this.setState({ preLink: e.target.value })}
                                                                    ></Input.TextArea>
                                                                    : null
                                                        }
                                                        <div style={{ color: 'red' }}>1.外链接必须加入微信白名单&nbsp;&nbsp;2.外链接必须是https</div>
                                                    </div>
                                            }
                                        </Form.Item>
                                        <Form.Item label="课后外链">
                                            <Radio.Group value={this.state.linkTypeAfter} onChange={e => this.setState({ linkTypeAfter: e.target.value })}>
                                                <Radio value={0}>无</Radio>
                                                <Radio value={1}>问卷</Radio>
                                                <Radio value={2}>试卷</Radio>
                                            </Radio.Group>
                                            {
                                                this.state.linkTypeAfter == 0 ? null :
                                                    <div>
                                                        <Select style={{ width: 120 }} value={this.state.hhtyps} onChange={e => { this.setState({ hhtyps: e, paper: 0 }) }}>
                                                            <Option value={0}>外链</Option>
                                                            <Option value={1}>内链</Option>
                                                        </Select>
                                                        {
                                                            this.state.linkTypeAfter == 2 && this.state.hhtyps == 1 ?
                                                                <Select style={{ width: 260 }} value={this.state.paper} onChange={e => { this.setState({ paper: e }) }}>
                                                                    {
                                                                        this.state.papers.map(item => {
                                                                            return (
                                                                                <Option value={item.paperId}>{item.paperName}</Option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Select>
                                                                : this.state.linkTypeAfter == 2 && this.state.hhtyps == 0 ?
                                                                    <Input.TextArea
                                                                        className="m_w400"
                                                                        autoSize={{ minRows: 1 }}
                                                                        value={this.state.afterLink}
                                                                        onChange={e => this.setState({ afterLink: e.target.value })}
                                                                    ></Input.TextArea>
                                                                    : null
                                                        }
                                                        {
                                                            this.state.linkTypeAfter == 1 && this.state.hhtyps == 1 ?
                                                                <Quetionna disabled={view_mode} dataSource={this.state.topicLists} ref={(val) => { this.quetionnas = val }} />
                                                                : this.state.linkTypeAfter == 1 && this.state.hhtyps == 0 ?
                                                                    <Input.TextArea
                                                                        className="m_w400"
                                                                        autoSize={{ minRows: 1 }}
                                                                        value={this.state.afterLink}
                                                                        onChange={e => this.setState({ afterLink: e.target.value })}
                                                                    ></Input.TextArea>
                                                                    : null
                                                        }

                                                        <div style={{ color: 'red' }}>1.外链接必须加入微信白名单&nbsp;&nbsp;2.外链接必须是https</div>
                                                    </div>
                                            }
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

                                        <Form.Item label="排序">
                                            <InputNumber disabled={view_mode} onChange={val => {
                                                if (val !== '' && !isNaN(val)) {
                                                    val = Math.round(val)
                                                    if (val < 0) val = 0
                                                    this.setState({ sort_order: val })
                                                }
                                            }} value={sort_order} min={0} max={9999} />
                                        </Form.Item>
                                        {/* <Form.Item label="发布试卷">
                                            <SearchPaper ref={ref=>this.paper_list = ref} actions={this.props.actions} id={this.course_id}></SearchPaper>
                                        </Form.Item> */}

                                        <Form.Item label="立即上架">
                                            <Switch disabled={view_mode} checked={this.state.status == 1 && time >= this.state.stime * 1000 ? true : false} onChange={(e) => {
                                                this.setState({
                                                    stime: 0
                                                })
                                                if (e) {
                                                    this.setState({ status: 1 })
                                                } else {
                                                    this.setState({ status: 0 })
                                                }
                                            }} />
                                        </Form.Item>

                                        {
                                            this.state.status == 0 || time <= this.state.stime * 1000 ?
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
                                                            this.setState({ shelves_time: dateString, shelvesTime: date })
                                                        }}
                                                    />
                                                </Form.Item>
                                                : null
                                        }
                                        <Form.Item label="是否分销">
                                            <Switch disabled={view_mode} checked={this.state.can_bonus ? true : false} onChange={(e) => {
                                                if (e) {
                                                    this.setState({ course_cash: '', integral: '', course_integral: '', pay_type: 1 })
                                                    this.setState({ can_bonus: 1 })
                                                } else {
                                                    this.setState({ can_bonus: 0 })
                                                }
                                            }} />
                                        </Form.Item>
                                        <Form.Item label="是否通知">
                                            <SwitchCom disabled={view_mode} tips="* 当选择讲师后，将会向关注此讲师的用户推送系统通知" value={this.state.notify} onChange={(notify) => {
                                                this.setState({ notify })
                                                if (notify) {
                                                    message.info({
                                                        content: '提示：本次修改或添加通知的课程仅限一次，如需再通知，请修改时继续点击此按钮！'
                                                    })
                                                }
                                            }}></SwitchCom>
                                        </Form.Item>
                                        <Form.Item label="是否分享">
                                            <Switch disabled={view_mode} checked={can_share == 1 ? true : false} onChange={(e) => {
                                                if (e) {
                                                    this.setState({ can_share: 1 })
                                                } else {
                                                    this.setState({ can_share: 0 })
                                                }
                                            }} />
                                        </Form.Item>
                                        {/* <Form.Item label="试看章节数">
                                        <InputNumber disabled={view_mode} value={this.state.free_chapter} onChange={val => {
                                             if (val !== '' && !isNaN(val)) {
                                                val = Math.round(val)
                                                if (val < 0) val = 0
                                                this.setState({ free_chapter: parseInt(val) })
                                            }    
                                            }} min={0} className="m_w400" />
                                        </Form.Item> */}
                                        <Form.Item label="课程编号">
                                            <Input disabled={view_mode} value={this.state.sn} onChange={e => {
                                                this.setState({ sn: e.target.value })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="划线价">
                                            <InputNumber disabled={view_mode} value={this.state.market_price} onChange={val => {
                                                if (val !== '' && !isNaN(val)) {
                                                    val = Math.round(val)
                                                    if (val < 0) val = 0
                                                    this.setState({ market_price: parseInt(val) })
                                                }

                                            }} min={0} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="成本价">
                                            <InputNumber disabled={view_mode} value={this.state.cost_price} onChange={val => {
                                                if (val !== '' && !isNaN(val)) {
                                                    val = Math.round(val)
                                                    if (val < 0) val = 0
                                                    this.setState({ cost_price: parseInt(val) })
                                                }

                                            }} min={0} className="m_w400" />
                                        </Form.Item>
                                        {/* <Form.Item label='推课'>
                                            <Radio.Group
                                                value={this.state.is_agent}
                                                onChange={e => {
                                                    this.setState({ is_agent: e.target.value,course_cash:'',integral:'',course_integral:''})
                                                   
                                                }}
                                                disabled={view_mode}
                                            >
                                                <Radio value={0}>否</Radio>
                                                <Radio value={1}>是</Radio>
                                            </Radio.Group>
                                            {this.state.is_agent ?
                                                <div>
                                                    <div>
                                                        老师佣金比例&nbsp;&nbsp;<InputNumber value={this.state.tuser_tax} onChange={tuser_tax => this.setState({ tuser_tax })} disabled={view_mode} /><br />
                                                    认证佣金比例&nbsp;&nbsp;<InputNumber value={this.state.vuser_tax} onChange={vuser_tax => this.setState({ vuser_tax })} placeholder='针对销售价的比例' style={{ width: '150px' }} disabled={view_mode} /><br />
                                                    非认证佣金比例&nbsp;&nbsp;<InputNumber value={this.state.user_tax} onChange={user_tax => this.setState({ user_tax })} placeholder='针对销售价的比例' style={{ width: '150px' }} disabled={view_mode} />
                                                    </div>
                                                    <div style={{ color: 'red', fontSize: '14px', marginTop: '2px' }}>提示:推课比例是按百分百计算，请填写整数</div>
                                                </div>
                                                : null}
                                        </Form.Item> */}
                                        <Form.Item label='会员阶梯价格'>
                                            <CoursePrice
                                                ref={ref => this.course_price = ref}
                                                value={this.state.level_integral}
                                            />
                                        </Form.Item>
                                        <Form.Item label='兑换用户等级'>
                                            <Select disabled={view_mode} value={this.state.ulevel} className='m_w400' onChange={e => this.setState({ ulevel: e })}>
                                                <Select.Option value={0}>无</Select.Option>
                                                <Select.Option value={1}>LV1</Select.Option>
                                                <Select.Option value={2}>LV2</Select.Option>
                                                <Select.Option value={3}>LV3</Select.Option>
                                                <Select.Option value={4}>LV4</Select.Option>
                                                <Select.Option value={5}>LV5</Select.Option>
                                                <Select.Option value={6}>LV6</Select.Option>
                                                <Select.Option value={7}>LV7</Select.Option>
                                                <Select.Option value={8}>LV8</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label='兑换老师等级'>
                                            <Select disabled={view_mode} value={this.state.tlevel} className='m_w400' onChange={e => this.setState({ tlevel: e })}>
                                                <Select.Option value={0}>无</Select.Option>
                                                <Select.Option value={1}>LV1</Select.Option>
                                                <Select.Option value={2}>LV2</Select.Option>
                                                <Select.Option value={3}>LV3</Select.Option>
                                                <Select.Option value={4}>LV4</Select.Option>
                                                <Select.Option value={5}>LV5</Select.Option>
                                                <Select.Option value={6}>LV6</Select.Option>
                                                <Select.Option value={7}>LV7</Select.Option>
                                                <Select.Option value={8}>LV8</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="销售价类型">
                                            <Radio.Group
                                                disabled={view_mode}
                                                value={this.state.pay_type}
                                                onChange={e => {
                                                    this.setState({ pay_type: e.target.value, course_cash: '', course_integral: '' })
                                                }}
                                            >
                                                <Radio value={0} disabled={view_mode}>免费</Radio>
                                                {/* <Radio value={2} disabled={view_mode}>现金</Radio> */}
                                                <Radio value={1} disabled={view_mode}>金币</Radio>
                                                {/* {
                                                    !this.state.can_bonus?
                                                    <Radio value={3} disabled={view_mode}>现金+金币</Radio>
                                                    :null
                                                } */}

                                            </Radio.Group>
                                        </Form.Item>
                                        {this.state.pay_type == 0 ? null :
                                            <Form.Item label="销售价">
                                                {this.state.pay_type == 2 || this.state.pay_type == 3 ?
                                                    <InputNumber
                                                        placeholder='输入价格'
                                                        style={{ minWidth: '120px' }}
                                                        value={course_cash}
                                                        onChange={(e) => {
                                                            this.setState({ course_cash: e })
                                                        }}
                                                        disabled={view_mode}
                                                        min={0} max={800000}
                                                    />
                                                    : null}
                                                {this.state.pay_type == 3 ? <span className='pad_l5 pad_r5'>+</span> : null}
                                                {this.state.pay_type == 1 || this.state.pay_type == 3 ?
                                                    <InputNumber
                                                        min={0} max={800000}
                                                        placeholder='输入金币'
                                                        onChange={(e) => {
                                                            this.setState({ course_integral: e, integral: e })
                                                        }}
                                                        disabled={view_mode}
                                                        value={integral}
                                                    />
                                                    : null}
                                            </Form.Item>
                                        }
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
                                        <Form.Item label="课程详情">
                                            <TextArea disabled={view_mode} autoSize={{ minRows: 4 }} value={content} onChange={e => { this.setState({ content: e.target.value }) }} className="m_w400" />
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
                                        {/* 
                                        <Button type="primary" ghost onClick={()=>{this.setState({coursePreviewVisible:true})}}>预览</Button>
                                        &nbsp;
                                        */}
                                        {view_mode ? null :
                                            <Button
                                                loading={this.state.loading || this.state.importLoading}
                                                onClick={this.onPublish}
                                                type="primary"
                                            >
                                                {this.state.importLoading ? '正在导入' : '提交'}
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
                <Modal visible={this.state.showWords} onCancel={this.onOut} onOk={this.onRight}>
                    <div style={{padding: '5px'}}>提示：检测到当前课程关联了问卷并且已经有用户提交过该问卷，若修改问卷题目则需要清除提交数据，请点击确认清除数据</div>
                </Modal>
            </div>
        )
    }
}
const LayoutComponent = EditCourse;
const mapStateToProps = state => {
    return {
        tag_list: state.course.tag_list,
        teacher_list: state.teacher.teacher_list,
        category_list: state.course.category_list,
        course_info: state.course.course_info,
        auth_paper_list: state.auth.auth_paper_list,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
