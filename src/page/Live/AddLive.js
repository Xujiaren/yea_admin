import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Popover, Divider, Table, Tag, List, Checkbox, Empty, Radio, InputNumber, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message, DatePicker, Spin } from 'antd';

import locale from 'antd/es/date-picker/locale/zh_CN';

import qrcode from '../../assets/img/code.jpg'
import debounce from 'lodash/debounce';

import config from '../../config/config';

import connectComponent from '../../util/connect';
import ChapterSetting from './ChapterSetting'
import qs from 'qs';

// import BraftFinder from "braft-finder";
import BraftEditor from '../../components/braft-editor'
// import BraftFinder from "../../components/braft-finder";
import moment from 'moment';
import _ from 'lodash'
import * as courseService from '../../redux/service/course'
import customUpload from '../../components/customUpload'
import PersonType from '../../components/PersonType'
import SwitchCom from '../../components/SwitchCom'
import AntdOssUpload from '../../components/AntdOssUpload'
import CoursePrice from '../../components/CoursePrice'

const { Option } = Select;
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



class AddLive extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchTag = debounce(this.fetchTag, 200);
        this.fetchTeacher = debounce(this.fetchTeacher, 200);
        this.input_value = ''
    }
    state = {
        view_mode: false,
        roll_mode: false,

        publishLoading: false,

        fileList: [],
        fileLists: [],
        videoList: [],
        /**
         * 直播广告
         */
        adVideoList: [],
        ad_img_list: [],
        showAdPannel: false,
        ad_media_id: '',
        ad_title: '',
        mtype: 0,
        director_id: '0',
        ad_link: '',
        /**
         * 直播商品
         */
        importGoodsLoading: false,
        excelFileList: [],
        goodsImgList: [],
        goods_id: 0,
        goods_name: '',
        goods_price: '',
        goods_link: '',
        goods_sort_order: 0,
        goods_status: 0,
        is_shop: 0,

        isEdit: false,
        ad_begin_time: 0,
        ad_end_time: 0,
        ltype: 0,
        adBeginTime: null,
        adEndTime: null,

        showImgPanel: false,
        previewImage: '',
        editorState: BraftEditor.createEditorState(null),
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

        ctype: 2,
        category_id: '',
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
        teacher_name: '',

        course_link: '',
        isSeries: '0',
        begin_time: '',
        end_time: '',
        BeginTime: null,
        EndTime: null,
        media_id: '',
        duration: '',
        size: '',

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
        notify: 0,

        course_cash: "",
        pay_type: 0,
        course_integral: '',
        plant: 0,
        level_integral: '',
        is_agent: 0,
        tuser_tax: 0,
        vuser_tax: 0,
        user_tax: 0,
        atime: null,
        promote_price: 0,
        cost_price: 0,
        market_price: 0,
        pdfList: [],
        can_share: 0,
        istrue: 0,
        adresses_list: [],
        region_id: 0,
        publish_type: 0,
    };

    course_price = {
        getValue: () => ''
    }
    course_info = { liveStatus: 0 }
    category_list = []
    id = 0
    course_id = '0'
    getAdress = () => {
        const { actions } = this.props
        actions.getAdresses()
    }
    _onPreviewImg(item) {
        this.setState({ previewImage: item.goodsImg, showImgPanel: true })
    }
    _onDeleteGoods(item) {
        const { actions } = this.props
        actions.actionLiveGoods({
            goods_id: item.goodsId,
            action: 'delete',
            resolved: () => {
                message.success('提交成功')
                actions.getLiveGoods({ course_id: this.state.course_id, keyword: '' })
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onEditGoods(item) {
        let { goodsId: goods_id, courseId: course_id, goodsName: goods_name, goodsImg: goods_img, goodsPrice: goods_price, goodsLink: goods_link, sortOrder: goods_sort_order, status: goods_status } = item

        let goodsImgList = [{
            response: { resultBody: goods_img },
            uid: goods_id + course_id,
            name: 'img' + goods_id,
            status: 'done',
            url: goods_img,
            type: 'image/png'
        }]

        let showGoodsPannel = true
        this.setState({
            showGoodsPannel, goodsImgList, goods_id, course_id, goods_name, goods_img, goods_price, goods_link, goods_sort_order, goods_status
        })
    }

    _onEditAd(item) {
        let { beginTime, endTime, ltype, mediaId, link, courseId, title, mtype, directorId } = item
        // let adBeginTime = moment(moment.unix(beginTime).format('YYYY-MM-DD HH:mm'))
        // let adEndTime = moment(moment.unix(endTime).format('YYYY-MM-DD HH:mm'))
        // let ad_begin_time = moment.unix(beginTime).format('YYYY-MM-DD HH:mm')
        // let ad_end_time = moment.unix(endTime).format('YYYY-MM-DD HH:mm')
        let adVideoList = []
        let ad_img_list = []
        if (mtype == 1) {
            let url = mediaId
            if (mediaId.indexOf('png') == -1 && mediaId.indexOf('jpeg') == -1 && mediaId.indexOf('jpg') == -1 && mediaId.indexOf('gif') == -1 && mediaId.indexOf('gif') == -1) {
                url = ''
            }
            ad_img_list.push({ status: 'done', type: 'image/png', response: { resultBody: mediaId }, uid: mediaId, name: 'ad_img' + mediaId, url: url })
        } else {
            adVideoList.push({ status: 'done', type: 'video/mp4', response: { data: { videoId: mediaId }, err: '0' }, uid: mediaId, name: 'ad_' + mediaId, url: '' })
        }
        let showAdPannel = true
        let isEdit = true
        let ad_media_id = mediaId
        let ad_link = link
        let ad_title = title
        let director_id = directorId
        this.setState({
            ad_link, director_id, mtype, ad_img_list, ad_title, adVideoList, ad_media_id,
            // ad_begin_time,ad_end_time,adBeginTime,adEndTime,
            ltype, showAdPannel, isEdit
        })
    }
    _onDeleteAd(media_id, ltype, course_id, record) {
        const { actions } = this.props
        let { live_ad } = this.state
        let director_id = record.directorId
        if (course_id !== 0) {
            actions.removeLiveAd({
                course_id, ltype, director_id,
                resolved: () => {
                    actions.getLiveAd({ course_id })
                },
                rejected: (data) => {
                    message.error('删除失败')
                }
            })
        } else {
            live_ad = live_ad.filter(ele => ele.directorId !== record.directorId)
            this.setState({ live_ad })
        }

    }
    saveAd(ltype, media_id, title, mtype, director_id) {
        this.setState(preState => {
            let { live_ad } = preState
            let item = {}
            item.courseId = 0
            item.ltype = ltype
            item.mediaId = media_id
            item.link = ''
            // item.beginTime = Date.parse(begin_time)
            // item.endTime = Date.parse(end_time)
            item.title = title
            item.mtype = mtype

            if (director_id == 0) { item.directorId = this.id + 1; this.id++ }
            else item.directorId = director_id

            live_ad = live_ad.filter(ele => ele.directorId !== item.directorId)
            live_ad.push(item)
            return { showAdPannel: false, live_ad }
        })
    }
    addLiveAd = () => {

        const { actions } = this.props
        const { adVideoList } = this.state
        let { ad_link: ad_link, director_id: director_id, mtype: mtype, ad_title: title, course_id: course_id, ltype: ltype, ad_begin_time: begin_time, ad_end_time: end_time } = this.state
        let link = ''
        let ad_img_list = ''
        if (title == '') { message.info('请广告标题'); return; }
        // if(ltype == 1&&!begin_time){ message.info('请设置广告开始时间'); return;}
        // if(ltype == 1&&!end_time){ message.info('请设置广告结束时间'); return;}

        if (this.adImg) {
            ad_img_list = this.adImg.getValue()
        }

        if (mtype == 1) {
            if (ad_img_list == '') {
                message.info('请上传图片'); return;
            }
            ad_img_list.split(',').map(ele => {
                let media_id = ele
                if (!course_id || course_id == '0') {
                    this.saveAd(ltype, media_id, title, mtype, director_id)
                } else {
                    actions.publishLiveAd({
                        link: ad_link, course_id, ltype, media_id, begin_time, end_time, title, mtype, director_id,
                        resolved: () => {
                            this.setState({ showAdPannel: false })
                            actions.getLiveAd({ course_id })
                        },
                        rejected: (data) => {
                            message.error(data)
                        }
                    })
                }
            })
        } else {
            if (ad_link == '' || adVideoList.length == 0) {
                message.info('请上传视频'); return;
            } else if (adVideoList.length > 5) {
                message.info('批量上传最多支持 5 个视频'); return;
            }
            if (adVideoList.length !== 0)
                adVideoList.map(ele => {
                    if (ele.status == 'done' && ele.response.err == '0') {

                        let media_id = ele.response.data.videoId
                        if (!course_id || course_id == '0') {

                            this.saveAd(ltype, media_id, title, mtype, director_id)
                        } else {
                            actions.publishLiveAd({
                                link: ad_link, course_id, ltype, media_id, begin_time, end_time, title, mtype, director_id,
                                resolved: () => {
                                    this.setState({ showAdPannel: false })
                                    actions.getLiveAd({ course_id })
                                },
                                rejected: (data) => {
                                    message.error(data)
                                }
                            })
                        }
                    }
                })
            else
                ad_link.split(',').map(ele => {
                    let media_id = ele
                    if (!course_id || course_id == '0') {
                        this.saveAd(ltype, media_id, title, mtype, director_id)
                    } else {
                        actions.publishLiveAd({
                            link, course_id, ltype, media_id, begin_time, end_time, title, mtype, director_id,
                            resolved: () => {
                                this.setState({ showAdPannel: false })
                                actions.getLiveAd({ course_id })
                            },
                            rejected: (data) => {
                                message.error(data)
                            }
                        })
                    }
                })
        }

    }

    addLiveGoods = () => {

        const { actions } = this.props
        const { goods_id, course_id, goods_name, goods_price, goods_link, goods_sort_order, goods_status } = this.state

        let goods_img = ''
        if (this.goodsImg) {
            goods_img = this.goodsImg.getValue()
        }

        // if(!course_id||course_id == '0'){message.info('直播ID不存在'); return;}
        if (!goods_name) { message.info('请输入商品名称'); return; }
        if (!goods_img || goods_img == '') { message.info('请上传商品图片'); return; }
        if (!goods_link) { message.info('请输入商品链接'); return; }
        if (!goods_price) { message.info('请输入商品价格'); return; }

        let sort_order = goods_sort_order
        let status = goods_status

        if (!course_id || course_id == '0') {

            this.setState(preState => {
                let { live_goods } = preState
                let item = {}

                if (goods_id == 0) { item.goodsId = this.id + 1; this.id++ }
                else item.goodsId = goods_id


                item.goodsName = goods_name
                item.goodsImg = goods_img
                item.goodsPrice = goods_price
                item.goodsLink = goods_link
                item.sortOrder = sort_order
                item.status = status
                item.pubTime = 0

                live_goods = live_goods.filter(ele => ele.goodsId !== item.goodsId)
                live_goods.push(item)
                return { showGoodsPannel: false, live_goods }
            })
        } else {
            actions.publishLiveGoods({
                goods_id, course_id, goods_name, goods_img, goods_price, goods_link, sort_order, status,
                resolved: () => {
                    message.success('提交成功')
                    this.setState({ showGoodsPannel: false })
                    actions.getLiveGoods({ course_id, keyword: '' })
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        }
    }
    componentDidMount() {

        const { actions } = this.props
        actions.getCategory({
            keyword: '',
            page: 0,
            pageSize: 10000,
            cctype: '-1',
            ctype: '3',
            parent_id: '0'
        })

        this.fetchTeacher('')
        this.fetchTag('')
        this.getAdress()

        const course_id = this.props.match.params.id + '';
        this.course_id = course_id

        let _state = this.props.location.state
        if (typeof _state === 'undefined') {
            _state = { type: '' }
        } else if (_state.type === 'view') {
            this.setState({ view_mode: true })
        } else if (_state.type === 'edit_roll') {
            this.setState({ roll_mode: true })
        } else if (_state.type === 'view_roll') {
            this.setState({ view_mode: true, roll_mode: true })
        }

        if (course_id !== '0') {
            actions.getCourseInfo(course_id)
            actions.getLiveAd({ course_id })
            actions.getLiveGoods({ course_id, keyword: '' })
            this.setState({ course_id })
        }
    }
    componentWillReceiveProps(n_props) {
        const { user } = n_props

        if (n_props.category_list !== this.props.category_list) {
            this.category_list = n_props.category_list.data
        }

        if (n_props.live_ad !== this.props.live_ad) {
            this.setState({ live_ad: n_props.live_ad })
        }
        if (n_props.live_goods !== this.props.live_goods) {
            this.setState({ live_goods: n_props.live_goods })

        }
        if (n_props.adresses_list !== this.props.adresses_list) {
            console.log(n_props.adresses_list, '///')
            this.setState({
                adresses_list: n_props.adresses_list
            })
        }
        if (n_props.course_info !== this.props.course_info) {
            this.course_info = n_props.course_info

            let editorState = BraftEditor.createEditorState(this.course_info.content) || BraftEditor.createEditorState(null)
            let fileList = []
            let fileLists = []
            let selectValue = []
            let flag_select = 1

            let checkValue = []

            let teacher_id = 0
            let images = []
            let imgList = []

            let selectTeacher = [{
                key: '0',
                label: '无'
            }]

            let tag_ids = []
            //标签
            this.course_info.tagList.map((ele) => {
                tag_ids.push(ele.tagId)
            })
            tag_ids = tag_ids.join(',')
            //标签展示
            if (this.course_info.tagList.length !== 0) {
                this.course_info.tagList.map(ele => {
                    selectValue.push({
                        key: ele.tagId,
                        label: ele.tagName
                    })

                })
            }
            //讲师

            if (this.course_info.teacherId) {
                teacher_id = this.course_info.teacherId
                selectTeacher = [{
                    key: this.course_info.teacherId + '',
                    label: this.course_info.teacherName
                }]
            }

            if (this.course_info.flag) {
                checkValue = this.course_info.flag.split('/')
                checkValue.pop()
                checkValue.shift()
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
            if (this.course_info.beginUrl) {

                let imgs = this.course_info.beginUrl.split(',')
                imgs.map((ele, idx) => {
                    fileLists.push({
                        response: { resultBody: ele },
                        uid: idx,
                        name: 'img' + idx,
                        status: 'done',
                        url: ele,
                        type: 'image/png'
                    })
                })

            }
            let pdfList = []
            if (Array.isArray(this.course_info.coursewareList)) {
                this.course_info.coursewareList.map(ele => {
                    pdfList.push({
                        uid: ele.fpath,
                        type: 'image/png',
                        status: 'done',
                        url: ele.fpath,
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

            let videoList = []
            if (this.course_info.mediaId !== '') {
                videoList = [{ type: 'video/mp4', response: { resultBody: this.course_info.mediaId }, uid: 'dd', name: this.course_info.mediaId, url: '' }]
            }
            let begin_time = moment.unix(this.course_info.beginTime).format('YYYY-MM-DD HH:mm')
            let BeginTime = moment(begin_time)
            let end_time = moment.unix(this.course_info.endTime).format('YYYY-MM-DD HH:mm')
            let EndTime = moment(end_time)

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
                costPrice,
                marketPrice,
                promotePrice,
                promoteBegin,
                promoteEnd,
            } = this.course_info
            let atime = null
            if (tuserTax && vuserTax && userTax && isAgent) {
                is_agent = isAgent
                tuser_tax = tuserTax
                vuser_tax = vuserTax
                user_tax = userTax
            }
            if (promoteBegin && promoteEnd) {
                atime = [moment.unix(promoteBegin), moment.unix(promoteEnd)]
            }
            let ctypes = this.course_info.ctype
            if (this.course_info.ctype == 51) {
                this.setState({
                    istrue: 1
                })
                ctypes = 2
            }
            if (this.course_info.ctype == 53) {
                this.setState({
                    istrue: 1
                })
                ctypes = 52
            }
            this.setState({
                atime: atime,
                promote_price: promotePrice,
                cost_price: costPrice,
                market_price: marketPrice,
                tuser_tax,
                vuser_tax,
                user_tax,
                is_agent,
                level_integral: this.course_info.levelIntegral,
                integral: this.course_info.integral,
                course_integral: this.course_info.courseIntegral,
                course_cash: this.course_info.courseCash,
                pay_type: this.course_info.payType,
                pdfList: pdfList,
                teacher_name: this.course_info.teacherName,
                videoList: videoList,
                ccategory_id: this.course_info.ccategoryId,
                ctype: ctypes,
                media_id: this.course_info.mediaId,
                tag_ids: tag_ids,
                begin_time: begin_time,
                BeginTime: BeginTime,
                end_time: end_time,
                EndTime: EndTime,
                course_id: this.course_info.courseId,
                checkValue: checkValue,
                flag_select: flag_select,
                flag: this.course_info.flag,
                teacher_id: teacher_id,
                fileList: fileList,
                fileLists: fileLists,
                course_name: this.course_info.courseName,
                summary: this.course_info.summary,
                selectValue: selectValue,
                course_img: this.course_info.courseImg,
                category_id: this.course_info.categoryId,

                category_name: this.course_info.category_name,
                sort_order: this.course_info.sortOrder,
                score: this.course_info.score,
                status: this.course_info.status,
                is_shop: this.course_info.isShop,
                sn: this.course_info.sn,
                content: this.course_info.content,
                isSeries: this.course_info.isSeries + '',
                ttype: this.course_info.ttype,

                images: images.join(','),
                editorState: editorState,
                imgList: imgList,
                plant: this.course_info.plant,
                can_share: this.course_info.canShare,
                region_id: this.course_info.regionId,
                publish_type: this.course_info.publishType
            })
            setTimeout(() => {
                this.setState({
                    selectTeacher: selectTeacher,
                })
            }, 500);
        }
    }

    addTmp1 = () => {
        if (!this.input_value1) {
            message.info("请输入内容再提交");
            return;
        }
        let selectValue1 = this.state.selectValue1;
        selectValue1.push({ key: Math.random() * 100, label: this.input_value1 });
        this.setState({ selectValue1 });
        this.input_value1 = ''
    }

    add = () => {
        this.setState(pre => {
            let { dataSource, edit_level, edit_value, edit_index } = pre
            if (edit_index !== -1) {
                message.info('请先保存其他选项'); return null;
            }
            dataSource.push({
                level: 'LV1',
                value: ''
            })
            return {
                dataSource,
                edit_index: dataSource.length - 1,
                edit_level: 'LV1',
                edit_value: ''
            }
        })
    }
    edit(index) {
        let { dataSource, edit_index } = this.state
        let edit_level = dataSource[index].level
        let edit_value = dataSource[index].value

        if (edit_index !== -1) {
            message.info('请先保存其他选项'); return null;
        }
        dataSource[index].level = ''
        dataSource[index].value = ''

        this.setState({
            edit_value,
            edit_level,
            edit_index: index,
            dataSource
        })
    }
    save(index) {
        this.setState(pre => {
            let { edit_index, edit_level, edit_value, dataSource } = pre
            if (!edit_value) {
                message.info('请输入价格')
                return null
            }
            if (typeof dataSource.find(item => item.level === edit_level) !== 'undefined') {
                message.info('当前等级已存在')
                return null
            }

            dataSource[index].level = edit_level
            dataSource[index].value = edit_value

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
                edit_index: -1,
                dataSource
            }
        })
    }
    fetchTeacher = value => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ selectTeacher: [], teacherFetching: true });
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

    fetchTag = value => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ selectData: [], fetching: true });
        fetch(config.api + '/course/tag/?keyword=' + value + '&page=0', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(body => {
                const { errorMsg } = body
                if (!errorMsg) {
                    const selectData = body.resultBody.data.map(ele => ({
                        text: `${ele.tagName}`,
                        value: ele.tagId,
                    }));
                    this.setState({ selectData, fetching: false });
                }
            });
    };
    onSelectTag = value => {
        this.setState({
            selectValue: value,
            fetching: false,
        });
    };
    onSelectTeacher = value => {
        this.setState({
            selectTeacher: value,
            teacherFetching: false,
            teacher_id: value.key,
            teacher_name: value.label,
        });
    };
    onSelected = (value) => {
        if (value == 2) {
            this.setState({
                flag_select: 2,
                flag: ''
            })
        } else if (value == 1) {
            this.setState({
                flag: '/2/',
                flag_select: 1
            })
        } else {
            this.setState({
                flag: '',
                flag_select: 0
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
    submitContent = () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
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
    beforeADVideoUpload(file) {
        const isMp4 = file.type === 'video/mp4'
        return isMp4;
    }
    beforeVideoUpload(file, fileList) {
        const isMp4 = file.type === 'video/mp4'
        return isMp4;
    }
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        return isJpgOrPng;
    }
    onGoodsImgChange = ({ file, fileList }) => {
        const isJpgOrPng = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.info('只能上传 JPG/PNG/GIF 文件!');
            return
        }

        let goods_img = ''
        let goodsImgList = fileList

        if (file.status == 'done' && file.response.errorCode !== '1') {
            goods_img = file.response.resultBody
        }

        this.setState({
            goodsImgList,
            goods_img
        })
    };

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
    onAdVideoChange = ({ file, fileList }) => {
        if (file.type !== 'video/mp4') {
            message.error('请上传正确的 MP4 视频文件');
            return;
        }
        let size = ''
        let ad_media_id = ''
        let ad_link = []
        if (file.status == 'done' && file.response.err == '0') {
            message.info('上传成功')

        } else if (file.status == 'error') {
            message.info('上传失败')
        }

        fileList.map(ele => {
            if (ele.status == 'done' && ele.response.err == '0') {
                ad_link.push(ele.response.data.videoId)
            } else if (ele.status == 'error') {
                message.info('上传失败')
            }
        })
        ad_link = ad_link.join(',')
        this.setState({
            adVideoList: fileList,
            ad_link: ad_link
        })
    }
    onCheckBox = (val) => {
        const checkValue = val
        const flag = '/' + val.join('/') + '/';
        this.setState({
            flag,
            checkValue
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
    onPublish = () => {
        const { media_id } = this.state
        const { actions } = this.props
        this.setState({ publishLoading: true })


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
                    message.error('获取视频时长信息出错，请重新上传')
                }
            })
        setTimeout(() => {
            if (this._onPublish() === false)
                this.setState({ publishLoading: false })
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
            begin_time,
            end_time,
            media_id,
            ccategory_id,

            duration,
            size,

            live_ad,
            live_goods,
            is_shop,
            teacher_name,
            notify,

            course_integral,
            course_cash,
            pay_type,
            plant,
            tuser_tax,
            vuser_tax,
            user_tax,
            is_agent,
            atime,
            promote_price,
            cost_price,
            market_price,
            can_share,
            istrue,
            selectTeacher,
            region_id,
            publish_type
        } = this.state;

        let tag_ids = []
        selectValue.map(ele => {
            tag_ids.push(ele.key)
        })
        tag_ids = tag_ids.join(',')

        const that = this
        const flag = this.refs.personType.getValue()
        const { actions } = this.props
        let course_img = ''
        let begin_url = ''
        let courseware = ''
        let promote_begin = '', promote_end = ''
        courseware = this.pdf.getValue()
        if (Array.isArray(atime) && atime.length === 2) {
            promote_begin = atime[0].format('YYYY-MM-DD HH:mm:ss')
            promote_end = atime[1].format('YYYY-MM-DD HH:mm:ss')
        }
        if (this.img) {
            course_img = this.img.getValue()
        }
        if (this.imgs) {
            begin_url = this.imgs.getValue()
        }
        if (!course_name) { message.info('请输入课程名称'); return false; }
        if (!summary) { message.info('请输入课程摘要'); return false; }
        // if(!teacher_id || teacher_id == 0){ message.info('请选择讲师'); return;}
        if (teacher_id == 0 && teacher_name == '') { message.info('请输入直播讲师名字'); return false; }

        if (!course_img) { message.info('请上传主图'); return false; }

        if (category_id == '') { message.info('请选择课程分类'); return false; }
        if (!ccategory_id) { message.info('请选择课程子分类'); return false; }
        if (flag === null) {
            return false;
        }
        if (sort_order > 9999) { message.info('课程排序不能大于9999'); return false; }
        if (!sn) { message.info('请输入课程编号'); return false; }

        if ((pay_type == 1 || pay_type == 3) && !integral) {
            message.info('请设置金币价格'); return false
        }
        if ((pay_type == 2 || pay_type == 3) && !course_cash) {
            message.info('请设置现金'); return false
        }

        // if(!content){ message.info('请输入课程详情'); return;}
        let level_integral = this.course_price.getValue()
        // let value = this.pdf.getValues()[0].originFileObj
        // let file = new FormData();
        // file.append('file', value);
        // console.log(value)
        let types = 2
        if (ctype == 2 && istrue == 1) {
            types = 51
        }
        if (ctype == 2 && istrue == 0) {
            types = 2
        }
        if (ctype == 52 && istrue == 1) {
            types = 53
        }
        if (ctype == 52 && istrue == 0) {
            types = 52
        }
        console.log(courseware, '???')
        if (!courseware) {
            actions.publishCourse({
                cost_price,
                market_price,
                promote_price,
                promote_begin,
                promote_end,
                level_integral,
                is_agent,
                tuser_tax,
                vuser_tax,
                user_tax,

                ctype: types,
                category_id,
                content,
                course_id,
                course_img,
                course_name,
                flag: flag === 'nofile' ? '/I/' : flag,
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
                can_share,
                ccategory_id,
                duration,
                size,
                is_shop,
                teacher_name,
                notify,
                course_integral,
                course_cash,
                pay_type,
                plant,
                regionId: region_id,
                begin_url,
                publish_type,
                resolved: (data) => {

                    if (flag === '/I/')
                        that.refs.personType.uploadFile(data.courseId, this.props.actions, this)

                    if (this.state.course_id == '0') {
                        const course_id = data.courseId

                        this.setState({ course_id: data.courseId }, () => {
                            this.handleUpload()
                        })

                        if (live_ad.length == 0 && live_goods.length == 0)
                            if (flag !== '/I/')
                                message.success({
                                    content: '提交成功',
                                    onClose: () => {
                                        this.setState({ publishLoading: false })
                                        window.history.back()
                                    }
                                })
                            else if (live_ad.length == 0)
                                this._publishGoods(course_id, flag)
                            else live_ad.map((ele, index) => {

                                let {
                                    ltype: ltype,
                                    mediaId: media_id,
                                    // beginTime:begin_time,
                                    // endTime:end_time,
                                    title: title,
                                    mtype: mtype,
                                    link: link

                                } = ele
                                let director_id = 0
                                let begin_time = 0
                                let end_time = 0

                                actions.publishLiveAd({
                                    link, director_id, course_id, ltype, media_id, begin_time, end_time, title, mtype,
                                    resolved: () => {
                                        if (index == live_ad.length - 1) {
                                            if (live_goods.length == 0)
                                                if (flag !== '/I/')
                                                    message.success({
                                                        content: '提交成功',
                                                        onClose: () => {
                                                            this.setState({ publishLoading: false })
                                                            window.history.back()
                                                        }
                                                    })
                                                else
                                                    this._publishGoods(course_id)

                                        }

                                    },
                                    rejected: (data) => {
                                        message.error(data)
                                    }
                                })
                            })
                    } else {
                        if (flag !== '/I/')
                            message.success({
                                content: '提交成功',
                                onClose: () => {
                                    this.setState({ publishLoading: false })
                                    window.history.back()
                                }
                            })
                    }


                },
                rejected: (data) => {
                    this.setState({ publishLoading: false })
                    if (data.toString().indexOf('query did not return a unique result') > -1) {
                        this.setState({ publishLoading: false })
                        message.info('课程编号已存在，请重新输入')
                    } else {
                        message.error({
                            content: data
                        })
                    }

                }
            })
        } else {

            actions.publishCourse({
                cost_price,
                market_price,
                promote_price,
                promote_begin,
                promote_end,
                level_integral,
                is_agent,
                tuser_tax,
                vuser_tax,
                user_tax,

                ctype: types,
                category_id,
                content,
                course_id,
                course_img,
                course_name,
                flag: flag === 'nofile' ? '/I/' : flag,
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
                can_share,
                ccategory_id,
                duration,
                size,
                is_shop,
                teacher_name,
                notify,
                course_integral,
                course_cash,
                pay_type,
                plant,
                regionId: region_id,
                begin_url,
                publish_type,
                resolved: (data) => {
                    actions.publishFile({
                        course_id: data.courseId,
                        file: courseware,
                        resolved: (res) => {
                            if (flag === '/I/')
                                that.refs.personType.uploadFile(data.courseId, this.props.actions, this)

                            if (this.state.course_id == '0') {
                                const course_id = data.courseId

                                this.setState({ course_id: data.courseId }, () => {
                                    this.handleUpload()
                                })

                                if (live_ad.length == 0 && live_goods.length == 0)
                                    if (flag !== '/I/')
                                        message.success({
                                            content: '提交成功',
                                            onClose: () => {
                                                this.setState({ publishLoading: false })
                                                window.history.back()
                                            }
                                        })
                                    else if (live_ad.length == 0)
                                        this._publishGoods(course_id, flag)
                                    else live_ad.map((ele, index) => {

                                        let {
                                            ltype: ltype,
                                            mediaId: media_id,
                                            // beginTime:begin_time,
                                            // endTime:end_time,
                                            title: title,
                                            mtype: mtype,
                                            link: link

                                        } = ele
                                        let director_id = 0
                                        let begin_time = 0
                                        let end_time = 0

                                        actions.publishLiveAd({
                                            link, director_id, course_id, ltype, media_id, begin_time, end_time, title, mtype,
                                            resolved: () => {
                                                if (index == live_ad.length - 1) {
                                                    if (live_goods.length == 0)
                                                        if (flag !== '/I/')
                                                            message.success({
                                                                content: '提交成功',
                                                                onClose: () => {
                                                                    this.setState({ publishLoading: false })
                                                                    window.history.back()
                                                                }
                                                            })
                                                        else
                                                            this._publishGoods(course_id)

                                                }

                                            },
                                            rejected: (data) => {
                                                message.error(data)
                                            }
                                        })
                                    })
                            } else {
                                if (flag !== '/I/')
                                    message.success({
                                        content: '提交成功',
                                        onClose: () => {
                                            this.setState({ publishLoading: false })
                                            window.history.back()
                                        }
                                    })
                            }


                        },
                        rejected: (data) => {
                            this.setState({ publishLoading: false })
                            if (data.toString().indexOf('query did not return a unique result') > -1) {
                                this.setState({ publishLoading: false })
                                message.info('课程编号已存在，请重新输入')
                            } else {
                                message.error({
                                    content: data
                                })
                            }

                        }
                    })
                },
                rejected: (err) => {
                    console.log(err)
                    // message.error({
                    //     content:'上传失败'
                    // })
                },
            })


        }

    }
    _publishGoods(course_id, flag) {
        let { live_goods } = this.state
        const { actions } = this.props

        live_goods.map((ele, index) => {

            let {
                goodsName: goods_name,
                goodsImg: goods_img,
                goodsPrice: goods_price,
                goodsLink: goods_link,
                sortOrder: sort_order,
                status: status
            } = ele
            let goods_id = 0
            actions.publishLiveGoods({
                goods_id, course_id, goods_name, goods_img, goods_price, goods_link, sort_order, status,
                resolved: () => {

                    if (index == live_goods.length - 1 && flag !== '/I/')
                        message.success({
                            content: '提交成功',
                            onClose: () => {
                                this.setState({ publishLoading: false })
                                window.history.back()
                            }
                        })

                },
                rejected: (data) => {
                    message.error(data)
                }
            })
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

                let tag_ids = []
                selectValue.push({ key: data.tagId, label: data.tagName });
                selectValue.map((ele) => {
                    tag_ids.push(ele.tagId)
                })
                tag_ids = tag_ids.join(',')
                this.setState({ selectValue, tag_ids });
                this.input_value = ''
                //message.success("操作成功",interval)
            },
            rejected: (data) => {
                message.error(data)
            }
        })


    }

    disabledDate = (current) => {
        return current < moment().subtract(1, 'day')
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
    handleUpload = () => {
        const { actions } = this.props
        const { excelFileList, course_id } = this.state;
        const that = this
        let file = new FormData();

        if (excelFileList.length === 0 || course_id == '0') return;

        this.setState({ importGoodsLoading: true })
        file.append('file', excelFileList[0]);
        console.log(excelFileList[0])
        file.append('course_id', course_id)
        actions.uploadLiveGoods({
            course_id: { course_id: course_id },
            file: file,
            resolved: () => {
                if (that.course_id !== '0') {
                    message.success('导入成功')
                    actions.getLiveGoods({ course_id: course_id, keyword: '' })
                    this.setState({ importGoodsLoading: false, excelFileList: [] })
                }
            },
            rejected: (data) => {
                message.error('导入失败，请参考Excel模板文件，错误信息：' + data)
                this.setState({ importGoodsLoading: false })
            }
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 18 },
            },
        };
        const adLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 16 },
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
        const uploadBtnVideo = () => {

            if (this.state.director_id == 0) {
                if (this.state.adVideoList.length >= 5)
                    return null
                else
                    return (
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">上传视频</div>
                        </div>
                    )
            } else {
                if (this.state.adVideoList.length >= 1)
                    return null
                else
                    return (
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">上传视频</div>
                        </div>
                    )
            }
        }
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

            importGoodsLoading,
            publishLoading,
            uploading,
            excelFileList,
            course_cash,
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

        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={
                            course_id == '0' ?
                                '创建直播课程' :
                                (this.state.roll_mode ?
                                    (view_mode ? '回播课程详情' : '编辑回播课程')
                                    : '编辑直播课程')
                        }
                    >
                        <Row>
                            <Col xs="12">

                                <Card type='inner'>
                                    <Form {...formItemLayout}>
                                        <Form.Item label='直播类型'>
                                            <Radio.Group value={this.state.ctype} disabled={view_mode} onChange={e => {
                                                this.setState({ ctype: e.target.value })
                                            }}>
                                                <Radio value={2}>课程直播</Radio>
                                                <Radio value={52}>活动直播</Radio>
                                                {/* <Radio value={51}>研讨会直播</Radio> */}
                                            </Radio.Group>
                                        </Form.Item>
                                        {
                                            this.state.ctype == 52 || this.state.ctype == 53 ?
                                                <Form.Item label='推流方式'>
                                                    <Select className="m_w400" value={this.state.publish_type} onChange={(e)=>{
                                                    this.setState({
                                                        publish_type:e
                                                    })
                                                }}>
                                                        <Option value={0}>OBS(横屏)</Option>
                                                        <Option value={1}>小程序(竖屏)</Option>
                                                    </Select>
                                                </Form.Item>
                                                : null
                                        }

                                        <Form.Item label="课程名称">
                                            <Input disabled={view_mode} onChange={(e) => {
                                                this.setState({ course_name: e.target.value })
                                            }} className="m_w400" value={course_name} />
                                        </Form.Item>
                                        <Form.Item label="摘要">
                                            <TextArea disabled={view_mode} autoSize={{ minRows: 6 }} value={summary} onChange={e => {
                                                this.setState({ summary: e.target.value })
                                            }} className="m_w400" />
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
                                                value={this.state.selectTeacher}
                                            >
                                                <Option key={'0'}>无</Option>
                                                {teacherData.map(d => (
                                                    <Option key={d.value}>{d.text}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="直播讲师名字">
                                            <Input value={this.state.teacher_name} className="m_w400" onChange={e => {
                                                this.setState({ teacher_name: e.target.value })
                                            }}></Input>
                                        </Form.Item>
                                        <Form.Item label="主图">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                disabled={view_mode}
                                                accept="image/*"
                                                listType="picture-card"
                                                value={this.state.fileList}
                                                ref={ref => this.img = ref}
                                            >
                                            </AntdOssUpload>
                                            <span style={{ marginTop: '-30px', display: 'block' }}>(480px * 272px)</span>
                                        </Form.Item>
                                        {
                                            this.state.ctype == 52 || this.state.ctype == 53 ?
                                                <Form.Item label="背景图">
                                                    <AntdOssUpload
                                                        actions={this.props.actions}
                                                        disabled={view_mode}
                                                        accept="image/*"
                                                        listType="picture-card"
                                                        value={this.state.fileLists}
                                                        ref={ref => this.imgs = ref}
                                                    >
                                                    </AntdOssUpload>
                                                    <span style={{ marginTop: '-30px', display: 'block' }}>(375px * 812px(参照 iPhone X))</span>
                                                </Form.Item>
                                                : null
                                        }

                                        {/*
                                            {!this.state.roll_mode?null:
                                            <Form.Item label='时长'>
                                                {this.course_info.duration}秒
                                            </Form.Item>
                                            }
                                            {!this.state.roll_mode?null:
                                            <Form.Item label='视频大小'>
                                                {this.course_info.size}MB
                                            </Form.Item>
                                            }
                                            {course_id&&course_id !== '0'&&!view_mode&&this.course_info.liveStatus == 2&&(this.course_info.endTime < Date.parse(new Date())/1000)?
                                            <Form.Item label="上传回播视频">
                                                <Upload
                                                        disabled={view_mode}
                                                       
                                                        listType="picture-card"
                                                        fileList={this.state.videoList}
                                                        onChange={this.onCourseVideoChange}
                                                        beforeUpload={this.beforeVideoUpload}
                                                        customRequest={customUpload}
                                                >
                                                    {this.state.videoList.length >= 1 ? null : uploadBtnVideoRoll}
                                                </Upload>
                                                <span>媒体ID ：{this.state.media_id}</span>
                                            </Form.Item>
                                            :null}
                                            */}
                                        {/* <Form.Item label="课程形式">
                                                <Select className="m_w400"
                                                    disabled={view_mode}
                                                    value={this.state.isSeries}
                                                    onChange={val=>{
                                                        this.setState({
                                                            isSeries:val
                                                        })
                                                    }}
                                                >
                                                    <Option value={'0'}>单课</Option>
                                                    <Option value={'1'}>系列课</Option>
                                                </Select>
                                            </Form.Item> */}
                                        <Form.Item label="直播时间">

                                            {this.state.course_id !== '0' ?
                                                <DatePicker
                                                    key='t_5'
                                                    disabled={view_mode || this.course_info.liveStatus > 0}
                                                    disabledDate={this.disabledDate}
                                                    format={'YYYY-MM-DD HH:mm'}
                                                    placeholder="选择开始时间"
                                                    onChange={(val, dateString) => {
                                                        this.setState({
                                                            begin_time: dateString,
                                                            BeginTime: val
                                                        })
                                                    }}
                                                    value={this.state.BeginTime}
                                                    locale={locale}
                                                    showTime={{ format: 'HH:mm' }}
                                                    allowClear={false}
                                                /> :
                                                <DatePicker
                                                    key='t_6'
                                                    disabled={view_mode || this.course_info.liveStatus > 0}
                                                    disabledDate={this.disabledDate}
                                                    format={'YYYY-MM-DD HH:mm'}
                                                    placeholder="选择开始时间"
                                                    onChange={(val, dateString) => {
                                                        this.setState({
                                                            begin_time: dateString,
                                                            BeginTime: val
                                                        })
                                                    }}
                                                    locale={locale}
                                                    showTime={{ format: 'HH:mm' }}
                                                    allowClear={false}
                                                />
                                            }
                                            <span style={{ padding: '0 10px' }}>至</span>

                                            {this.state.course_id !== '0' ?
                                                <DatePicker
                                                    key='t_7'
                                                    disabled={view_mode || this.course_info.liveStatus > 0}
                                                    disabledDate={this.disabledDate}
                                                    format={'YYYY-MM-DD HH:mm'}
                                                    placeholder="选择结束时间"
                                                    onChange={(val, dateString) => {
                                                        this.setState({
                                                            end_time: dateString,
                                                            EndTime: val
                                                        })
                                                    }}
                                                    value={this.state.EndTime}
                                                    locale={locale}
                                                    showTime={{ format: 'HH:mm' }}
                                                    allowClear={false}
                                                /> :
                                                <DatePicker
                                                    key='t_8'
                                                    disabled={view_mode || this.course_info.liveStatus > 0}
                                                    disabledDate={this.disabledDate}
                                                    format={'YYYY-MM-DD HH:mm'}
                                                    placeholder="选择结束时间"
                                                    onChange={(val, dateString) => {
                                                        this.setState({
                                                            end_time: dateString,
                                                            EndTime: val
                                                        })
                                                    }}
                                                    locale={locale}
                                                    showTime={{ format: 'HH:mm' }}
                                                    allowClear={false}
                                                />
                                            }
                                            <p style={{ color: "#ff7e7e", fontSize: '12px', lineHeight: '2' }}>
                                                * 正在直播或已结束的直播课程将无法再设置时间
                                            </p>
                                        </Form.Item>
                                        {/* <Form.Item label='章节设置'>
                                                <Button onClick={()=>{
                                                    this.setState({ showChapter:true })
                                                }}>设置章节</Button>
                                            </Form.Item> */}
                                        <Form.Item label="课程分类">
                                            <Select onChange={this._onCateChange} value={this.state.category_id} disabled={view_mode} className="m_w400">
                                                {this.category_list.map((ele, index) => (
                                                    <Option key={index + 'cate'} value={ele.categoryId}>{ele.categoryName}</Option>
                                                ))}
                                            </Select>
                                            <Select value={this.state.ccategory_id} className="m_w400" disabled={view_mode} onChange={val => {
                                                this.setState({ ccategory_id: val })
                                            }}>
                                                <Option value={0}>无</Option>
                                                {this.state.second_category.map((ele, index) => (
                                                    <Option key={index + 'cate_se'} value={ele.categoryId}>{ele.categoryName}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="发布对象">
                                            {/*  <Select 
                                                    disabled={view_mode}
                                                    className="m_w400"
                                                    value={this.state.flag_select}
                                                    onChange={this.onSelected}>
                                                    <Option value={0}>全部用户</Option>
                                                    <Option value={1}>新用户</Option>
                                                    <Option value={2}>有标签用户</Option>
                                                </Select>
                                                {this.state.flag_select == 2?
                                                    <div>
                                                        <Checkbox.Group 
                                                            disabled={view_mode}
                                                            options={options} 
                                                            value={this.state.checkValue} 
                                                            onChange={this.onCheckBox} 
                                                            className='mt_20'
                                                        />
                                                    </div>
                                                :null} */}
                                            <PersonType disabled={view_mode} flag={this.state.flag} ref='personType' actions={this.props.actions} courseId={this.course_id}></PersonType>
                                            {console.log(this.state.flag)}

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
                                                    style={{ width: '338px' }}
                                                >
                                                    {selectData.map(d => (
                                                        <Option key={d.value}>{d.text}</Option>
                                                    ))}
                                                </Select>
                                                <Button disabled={view_mode} onClick={this.addTmp}>添加</Button>
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
                                        <Form.Item label="课程编号">
                                            <Input disabled={view_mode} value={this.state.sn} onChange={e => {
                                                this.setState({ sn: e.target.value })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="是否上架">
                                            <Switch disabled={view_mode} checked={this.state.status == 1 ? true : false} onChange={(e) => {
                                                this.setState({ status: e ? 1 : 0 })
                                            }} />
                                        </Form.Item>
                                        <Form.Item label="是否通知">
                                            <SwitchCom tips="* 当选择讲师后，将会向关注此讲师的用户推送系统通知" value={this.state.notify} onChange={(notify) => { this.setState({ notify }) }}></SwitchCom>
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
                                        <Form.Item label="是否推荐至研学会直播">
                                            <Switch disabled={view_mode} checked={this.state.istrue == 1 ? true : false} onChange={(e) => {
                                                if (e) {
                                                    this.setState({ istrue: 1 })
                                                } else {
                                                    this.setState({ istrue: 0 })
                                                }
                                            }} />
                                        </Form.Item>
                                    </Form>
                                </Card>
                                <Card type='inner' className='mt_10' title='定价'>
                                    <Form {...formItemLayout}>

                                        <Form.Item label="定价">
                                            划线价&nbsp;&nbsp;<InputNumber onChange={val => this.setState({ market_price: parseInt(val) })} value={this.state.market_price} disabled={view_mode} /><br />
                                            成本价&nbsp;&nbsp;<InputNumber onChange={val => this.setState({ cost_price: parseInt(val) })} value={this.state.cost_price} disabled={view_mode} />
                                        </Form.Item>
                                        <Form.Item label='推课'>
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
                                        </Form.Item>

                                        <Form.Item label="销售价类型">
                                            <Radio.Group
                                                value={this.state.pay_type}
                                                onChange={e => {
                                                    console.log(e)
                                                    this.setState({ pay_type: e.target.value })
                                                }}
                                            >
                                                <Radio value={0}>免费</Radio>
                                                {/* <Radio value={2}>现金</Radio> */}
                                                <Radio value={1}>金币</Radio>
                                                {/* <Radio value={3}>现金+金币</Radio> */}
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
                                                        min={0} max={800000}
                                                    />
                                                    : null}
                                                {this.state.pay_type == 3 ? <span className='pad_l5 pad_r5'>+</span> : null}
                                                {this.state.pay_type == 1 || this.state.pay_type == 3 ?
                                                    <InputNumber
                                                        min={0} max={800000}
                                                        placeholder='输入金币'
                                                        style={{ minWidth: '120px' }}
                                                        onChange={(e) => {
                                                            this.setState({ course_integral: e, integral: e })
                                                        }}
                                                        value={integral}
                                                    />
                                                    : null}
                                            </Form.Item>
                                        }
                                        <Form.Item label={this.state.roll_mode ? "回播活动价" : "直播活动价"}>
                                            <InputNumber
                                                value={this.state.promote_price}
                                                onChange={val => {
                                                    this.setState({ promote_price: parseInt(val) })
                                                }}
                                                disabled={view_mode}
                                                min={0}
                                                max={800000}
                                            />&nbsp;&nbsp;
                                            活动时间&nbsp;
                                            <DatePicker.RangePicker
                                                value={this.state.atime}
                                                onChange={(date) => {
                                                    this.setState({ atime: date })
                                                }}
                                                disabled={view_mode}
                                                showTime={{ format: 'HH:mm:ss' }}
                                                locale={locale}
                                                format='YYYY-MM-DD HH:mm:ss'
                                            />
                                        </Form.Item>
                                        <Form.Item label='会员阶梯价格'>
                                            <CoursePrice
                                                ref={ref => this.course_price = ref}
                                                value={this.state.level_integral}
                                            />
                                        </Form.Item>
                                        {/* <Form.Item label="权益兑换">
                                                <Radio.Group
                                                    disabled
                                                    value={this.state.proType}
                                                    onChange={e=>{
                                                        this.setState({proType:e.target.value})
                                                    }}
                                                    defaultValue={0}
                                                >
                                                    <Radio value={0}>老师等级</Radio>
                                                    <Radio value={1}>会员等级</Radio>
                                                </Radio.Group><br/>
                                                <Select disabled defaultValue={0} className='m_w400'>
                                                    <Select.Option value={0}>{this.state.proType==0?'老师':'会员'}等级LV0</Select.Option>
                                                </Select>
                                            </Form.Item> */}
                                        {/*
                                            <Form.Item label="试听章节">
                                                <Input value={this.state.sn} onChange={e=>{
                                                    this.setState({sn:e.target.value})
                                                }}  className="m_w400"/>
                                            </Form.Item>
                                            */}

                                    </Form>

                                </Card>
                                <Card type='inner' className='mt_10' title='直播广告管理' bodyStyle={{ padding: '10px' }}>
                                    <div>
                                        <Table disabled={view_mode} dataSource={this.state.live_ad} columns={this.columns} rowKey={'directorId'} tableLayout={'fixed'} size={'middle'} pagination={false} />
                                        {view_mode ? null :
                                            <Button
                                                type="dashed"
                                                onClick={() => {
                                                    this.setState({
                                                        showAdPannel: true,
                                                        isEdit: false,
                                                        ad_begin_time: 0,
                                                        ad_end_time: 0,
                                                        ltype: 0,
                                                        ad_media_id: '',
                                                        ad_title: '',
                                                        adVideoList: [],
                                                        ad_img_list: [],
                                                        mtype: 0,
                                                        director_id: 0,
                                                        ad_link: ''
                                                    })
                                                }} style={{ minWidth: '10%', marginTop: '10px' }}
                                            >
                                                <Icon type="plus" /> 添加
                                            </Button>
                                        }
                                    </div>

                                </Card>
                                {/* <Card type='inner' className='mt_10 ' title='互动答题'>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="发布试卷">
                                            <Input.Group compact>
                                                <Select
                                                    mode="multiple"
                                                    labelInValue
                                                    value={this.state.selectValue1}
                                                    placeholder="搜索试卷"
                                                    onSearch={(value) => {
                                                        this.input_value1 = value;
                                                    }}
                                                    filterOption={false}
                                                    onChange={(value) => {
                                                        this.setState({
                                                            selectValue1: value
                                                        });
                                                    }}
                                                    style={{ width: '225px' }}
                                                >

                                                </Select>
                                                <Button onClick={this.addTmp1}>添加</Button>
                                            </Input.Group>
                                        </Form.Item>
                                    </Form>
                                </Card> */}
                                <Card type='inner' className='mt_10' title='购物管理' bodyStyle={{ padding: '10px' }}>

                                    <div className='d_flex ai_ct mb_10'>
                                        <span>是否带货：</span>
                                        <Switch disabled={view_mode} checked={this.state.is_shop == 1 ? true : false} onChange={(e) => {
                                            this.setState({ is_shop: e ? 1 : 0 })
                                        }} />
                                    </div>
                                    <div>
                                        <Table disabled={view_mode} dataSource={this.state.live_goods} columns={this.columnsGoods} rowKey={'goodsId'} tableLayout={'fixed'} size={'middle'} pagination={false} />
                                        {view_mode ? null :
                                            <>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        this.setState({
                                                            showGoodsPannel: true,
                                                            goods_name: '',
                                                            goods_id: 0,
                                                            goods_img: '',
                                                            goods_link: '',
                                                            goods_price: '',
                                                            goods_sort_order: 0,
                                                            goods_status: 0,
                                                            goodsImgList: []
                                                        })
                                                    }} style={{ minWidth: '10%', marginTop: '10px' }}
                                                >
                                                    <Icon type="plus" /> 添加商品
                                                </Button>&nbsp;&nbsp;
                                                <Popover placement="top" trigger="hover" content={
                                                    <div style={{ color: "#8e8e8e" }}>
                                                        <p>
                                                            * 导入前，请先下载Excel模板文件<br />
                                                            * 仅支持xlsx格式的文件<br />
                                                            * 模版中的商品价格和排序请取整数 <br />
                                                            * 模版中的图片地址必须是小程序允许的域名地址 <br />
                                                            * 模版中的商品图片请正确地放到对应的格子里 <br />
                                                        </p>
                                                        <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/7edc6265-f189-45cd-a8e6-a80bae0ac6bd.xlsx'>
                                                            Excel导入模板下载
                                                        </a>
                                                    </div>
                                                }>

                                                    <span>
                                                        <Upload
                                                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                            fileList={excelFileList}
                                                            beforeUpload={this.beforeUploadExcel}
                                                            onRemove={this.onRemoveExcel}
                                                        >
                                                            <Button>
                                                                <Icon type="upload" /> 导入商品
                                                            </Button>
                                                        </Upload>
                                                    </span>
                                                </Popover>
                                                {this.course_id !== '0' && this.state.excelFileList.length > 0 ?
                                                    <Button loading={importGoodsLoading} onClick={this.handleUpload}>
                                                        <Icon type="upload" />开始上传
                                                    </Button>
                                                    : null}
                                            </>
                                        }
                                    </div>
                                </Card>
                                <Card type='inner' className='mt_10'>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="上传课件" help={
                                            <Popover trigger='click' content={
                                                <img style={{ height: 336, width: 360 }} src="https://anran-edu.oss-cn-qingdao.aliyuncs.com/images/93d3e9de-0f43-45b1-ae77-ef8a274b262c.jpg"></img>
                                            }>
                                                <span className='pdf_tip'>
                                                    请将PPT另存为PDF文件后，再上传
                                                </span>
                                            </Popover>
                                        }>
                                            <AntdOssUpload listType='text' accept='application/pdf' value={this.state.pdfList} ref={ref => this.pdf = ref}></AntdOssUpload>
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
                                        <Form.Item
                                            label="省份"
                                        // hasFeedback={this.state.isEditHit && !this.state.adress ? true : false}
                                        // validateStatus={this.state.isEditHit && !this.state.adress ? "error" : "success"}
                                        // help={this.state.isEditHit && !this.state.adress ? "省份不能为空" : ""}
                                        >
                                            <Select style={{ width: '200px' }} value={this.state.region_id} onChange={(val) => { this.setState({ region_id: val }) }}>
                                                <Select.Option value={0}>
                                                    全国
                                                </Select.Option>
                                                {
                                                    this.state.adresses_list.map(item => {
                                                        return (
                                                            <Select.Option value={item.regionId}>
                                                                {item.regionName}
                                                            </Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                        {this.state.roll_mode ?
                                            <Form.Item label="课程详情">
                                                <TextArea disabled={this.state.view_mode} autoSize={{ minRows: 6 }} value={content} onChange={e => { this.setState({ content: e.target.value }) }} />
                                            </Form.Item>
                                            : null}
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
                                            <Button loading={publishLoading} onClick={this.onPublish} style={{ minWidth: '64px' }} type="primary">提交</Button>
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
                    okText="发布"
                    cancelText="取消"
                >
                    <img className="block_center" alt="example" style={{ width: '40%' }} src={qrcode} />
                    <div className="text_center">扫码预览</div>
                </Modal>
                <Modal
                    zIndex={90}
                    width={800}
                    title='商品编辑'
                    visible={this.state.showProductPanel}
                    closable={true}
                    maskClosable={true}
                    okText='提交'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showProductPanel: false })
                    }}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Card type='inner' title='商品' bodyStyle={{ padding: 0 }} extra={
                        <Search
                            placeholder="搜索商品"
                            onChange={null}
                            style={{ maxWidth: 200 }}
                            onSearch={null}
                        >
                        </Search>
                    }>

                        <Table responsive size="" className="v_middle">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>货号</th>
                                    <th>商品名称</th>
                                    {/*
                                <th style={{width:'120px'}}>数量</th>
                                <th style={{width:'150px'}}>操作</th>
                                */}
                                </tr>
                            </thead>
                            <tbody>
                                {[1].map((ele, index) => (
                                    <tr key={index}>
                                        <td>
                                            20
                                        </td>
                                        <td>
                                            20192332
                                        </td>
                                        <td>
                                            日本不粘锅子
                                        </td>
                                        {/*<td>
                                    {index == this.state.editIndex?
                                        <InputNumber 
                                            value={editNum}
                                            onChange={val=>{
                                                this.setState({ editNum:val })
                                            }}
                                        />
                                    :'200'}
                                </td>
                                <td>
                                    <Button 
                                        size='small'
                                        onClick={index == this.state.editIndex?()=>{
                                            this.setState({ editIndex:-1 })
                                        }:()=>{
                                            this.setState({ editIndex:index })
                                        }}
                                    > {index == this.state.editIndex?'保存':'修改'}</Button>&nbsp;
                                    <Button size='small'>删除</Button>
                                </td>
                                */}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Modal>
                <Modal
                    zIndex={6001}
                    width={800}
                    title='章节设置'
                    visible={this.state.showChapter}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showChapter: false })
                    }}
                    bodyStyle={{ padding: "25px", paddingTop: '25px' }}
                >
                    <ChapterSetting></ChapterSetting>
                </Modal>

                <Modal
                    width={540}
                    title={this.state.director_id == 0 ? '添加广告' : '修改广告'}
                    visible={this.state.showAdPannel}
                    closable={true}
                    maskClosable={true}
                    okText='提交'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showAdPannel: false })
                    }}
                    bodyStyle={{ padding: "10px" }}
                    onOk={view_mode ? null : this.addLiveAd}
                >
                    <Form {...adLayout}>
                        <Form.Item label="广告推送">
                            <Select disabled={view_mode} value={this.state.ltype} onChange={val => {
                                this.setState({ ltype: val })
                            }}>
                                <Select.Option value={0}>播放前</Select.Option>
                                <Select.Option value={1}>播放中</Select.Option>
                                <Select.Option value={2}>播放后</Select.Option>
                            </Select>

                        </Form.Item>
                        <Form.Item label="广告名称">
                            <Input value={this.state.ad_title} onChange={e => {
                                this.setState({ ad_title: e.target.value })
                            }} />
                        </Form.Item>
                        <Form.Item label="媒体类型">
                            <Radio.Group value={this.state.mtype} onChange={e => {
                                this.setState({
                                    mtype: e.target.value,
                                    ad_media_id: '',
                                    adVideoList: [],
                                    ad_img_list: [],
                                    ad_link: ''
                                })
                            }}>
                                <Radio value={0}>视频</Radio>
                                <Radio value={1}>图片</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={this.state.mtype == 1 ? "广告图片" : "广告视频"}>
                            {this.state.mtype == 1 ?
                                <div>
                                    <AntdOssUpload
                                        actions={this.props.actions}
                                        disabled={view_mode}
                                        ref={ref => this.adImg = ref}
                                        listType="picture-card"
                                        multiple={this.state.director_id == 0 ? true : false}
                                        value={this.state.ad_img_list}
                                        multiple={this.state.director_id == 0 ? 6 : 1}
                                        accept="image/*"
                                        maxLength={this.state.director_id == 0 ? 18 : 1}
                                    >
                                    </AntdOssUpload>
                                    <span style={{ marginTop: '-30px', display: 'block' }}>(480px * 272px)</span>
                                </div>
                                :
                                <div>
                                    <Upload
                                        disabled={view_mode}
                                        multiple={this.state.director_id == 0 ? true : false}
                                        listType="picture-card"
                                        fileList={this.state.adVideoList}
                                        onChange={this.onAdVideoChange}
                                        beforeUpload={this.beforeADVideoUpload}
                                        customRequest={customUpload}
                                        accept='video/mp4'
                                    >
                                        {uploadBtnVideo()}
                                    </Upload>

                                </div>
                            }

                            <div style={{ fontSize: '12px', lineHeight: '1.5', marginTop: '2px' }}>{this.state.director_id !== 0 ? '* 如要批量上传视频、图片，请到添加广告面板添加' : this.state.mtype == 0 ? '* 批量上传最多支持 5 个视频' : '* 请上传图片'}</div>
                        </Form.Item>
                        <Form.Item label="广告链接">
                            <Input.TextArea autosize={{ minRows: 2 }} value={this.state.ad_link} onChange={e => {
                                this.setState({ ad_link: e.target.value })
                            }} />
                            <div style={{ fontSize: '12px', lineHeight: '1.5', marginTop: '2px' }}>
                                * 如上传了视频，广告链接将会自动生成<br />
                                * 如要手动输入广告链接，请删除掉上传的视频、图片<br />
                                * 如果是视频链接，请输入32位的媒体ID<br />
                                * 如果是图片链接，请输入小程序允许的域名链接<br />
                            </div>
                        </Form.Item>

                        {/* 
                        <Form.Item label="媒体ID">
                            <Input value={this.state.ad_media_id} onChange={e=>{
                                this.setState({ ad_media_id:e.target.value })
                            }} />
                        </Form.Item>
                        
                        {this.state.ltype !== 1?null:<div>
                        <Form.Item label='开始时间'>
                            {this.state.ad_begin_time!==''?
                            <DatePicker
                                key='t_1'
                                disabled={view_mode}
                                disabledDate = {this.disabledDate}
                                format = {'YYYY-MM-DD HH:mm'}
                                placeholder="选择开始时间" 
                                onChange={(val, dateString)=>{
                                    this.setState({
                                        ad_begin_time:dateString,
                                        adBeginTime:val
                                    })
                                }}
                                value={this.state.adBeginTime}
                                locale={locale}
                                showTime ={{format:'HH:mm'}}
                                allowClear={false}
                            />:
                            <DatePicker
                                key='t_2'
                                disabled={view_mode} 
                                disabledDate = {this.disabledDate}
                                format = {'YYYY-MM-DD HH:mm'}
                                placeholder="选择开始时间" 
                                onChange={(val, dateString)=>{
                                    this.setState({
                                        ad_begin_time:dateString,
                                        adBeginTime:val
                                    })
                                }}
                                locale={locale}
                                showTime ={{format:'HH:mm'}}
                                allowClear={false}
                            />
                            }
                        </Form.Item>
                        <Form.Item label='结束时间'>
                            {this.state.ad_end_time!==''?
                            <DatePicker
                                key='t_3'
                                disabled={view_mode}
                                disabledDate = {this.disabledDate}
                                format = {'YYYY-MM-DD HH:mm'}
                                placeholder="选择结束时间" 
                                onChange={(val, dateString)=>{
                                    this.setState({
                                        ad_end_time:dateString,
                                        adEndTime:val
                                    })
                                }}
                                value={this.state.adEndTime}
                                locale={locale}
                                showTime ={{format:'HH:mm'}}
                                allowClear={false}
                            />:
                            <DatePicker
                                key='t_4'
                                disabled={view_mode}
                                disabledDate = {this.disabledDate}
                                format = {'YYYY-MM-DD HH:mm'}
                                placeholder="选择结束时间" 
                                onChange={(val, dateString)=>{
                                    this.setState({
                                        ad_end_time:dateString,
                                        adEndTime:val
                                    })
                                }}
                                locale={locale}
                                showTime ={{format:'HH:mm'}}
                                allowClear={false}
                            />
                            }
                        </Form.Item></div>
                         */}
                    </Form>
                </Modal>
                <Modal
                    title='直播商品设置'
                    visible={this.state.showGoodsPannel}
                    closable={true}
                    maskClosable={true}
                    okText='提交'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showGoodsPannel: false })
                    }}
                    bodyStyle={{ padding: "10px" }}
                    onOk={view_mode ? null : this.addLiveGoods}
                >
                    <Form {...adLayout}>
                        <Form.Item label="商品名称">
                            <Input
                                value={this.state.goods_name}
                                onChange={(e) => {
                                    this.setState({ goods_name: e.currentTarget.value })
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="商品图片">
                            <AntdOssUpload
                                actions={this.props.actions}
                                disabled={view_mode}
                                listType="picture-card"
                                value={this.state.goodsImgList}
                                ref={ref => this.goodsImg = ref}
                                maxLength={1}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                            <span style={{ marginTop: '-30px', display: 'block' }}>请上传符合 88px * 50px 尺寸的图片</span>
                        </Form.Item>

                        <Form.Item label="商品链接">
                            <Input
                                value={this.state.goods_link}
                                onChange={(e) => {
                                    this.setState({ goods_link: e.target.value })
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="商品价格">
                            <InputNumber
                                value={this.state.goods_price}
                                onChange={(val) => {
                                    this.setState({ goods_price: val })
                                }}
                                min={0} max={800000}
                            />
                        </Form.Item>
                        <Form.Item label="排序">
                            <InputNumber
                                value={this.state.goods_sort_order}
                                onChange={(val) => {
                                    this.setState({ goods_sort_order: val })
                                }}
                                min={0} max={800000}
                            />
                        </Form.Item>
                        <Form.Item label="是否启用">
                            <Switch checked={this.state.goods_status == 1 ? true : false} onChange={(checked) => {
                                this.setState({ goods_status: checked ? 1 : 0 })
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => { this.setState({ showImgPanel: false }) }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }

    columnsGoods = [
        {
            title: '商品ID',
            dataIndex: 'goodsId',
            key: 'goodsId',
        },
        {
            title: '图片',
            dataIndex: 'goodsImg',
            key: 'goodsImg',
            render: (ele, record) => (
                <a>
                    <img onClick={() => { this._onPreviewImg(record) }} className="head-example-img" src={record.goodsImg} />
                </a>
            )
        },
        {
            title: '名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            ellipsis: true,
        },
        {
            title: '价格',
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
            render: (ele, record) => record.goodsPrice + '元'
        },
        {
            title: '添加时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render: (item, record) => record.pubTime == 0 ? '' : moment.unix(record.pubTime).format('YYYY-MM-DD HH:mm')
        },

        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder'
        },
        {
            title: '启用状态',
            dataIndex: 'status',
            key: 'status',
            render: (item, record) => (record.status == 1 ? '已启用' : '未启用')
        },
        {
            title: '操作',
            key: 'action',
            render: (item, record) => (
                <span>
                    <a onClick={this.state.view_mode ? null : () => {
                        this._onEditGoods(record)
                    }}>修改 </a>
                    <Divider type="vertical" />
                    <a onClick={this.state.view_mode ? null : () => {
                        this._onDeleteGoods(record)
                    }}>删除</a>
                </span>
            ),
        },
    ]
    columns = [
        {
            title: '广告ID',
            dataIndex: 'directorId',
            key: 'directorId'
        },
        {
            title: '广告推送',
            dataIndex: 'ltype',
            key: 'ltype',
            render: (item, record) => {
                let txt = ['播放前', '播放中', '播放后']

                return txt[parseInt(record.ltype)]
            }
        },
        {
            title: '广告名称',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '媒体类型',
            dataIndex: 'mtype',
            key: 'mtype',
            ellipsis: true,
            render: (item, record) => ['视频', '图片'][record.mtype]
        },
        {
            title: '广告链接',
            dataIndex: 'link',
            key: 'link',
            ellipsis: true,
        },
        // {
        //     title: '广告链接',
        //     dataIndex: 'link',
        //     key: 'link',
        //     ellipsis: true,
        // },


        // {
        //     title: '开始时间',
        //     dataIndex: 'beginTime',
        //     key: 'beginTime',
        //     render:(item,record)=>moment.unix(record.beginTime).format('YYYY-MM-DD HH:mm')
        // },
        // {
        //     title: '结束时间',
        //     dataIndex: 'endTime',
        //     key: 'endTime',
        //     render:(item,record)=>moment.unix(record.endTime).format('YYYY-MM-DD HH:mm')
        // },

        {
            title: '操作',
            key: 'action',
            render: (item, record) => (
                <span>
                    <a onClick={this.state.view_mode ? null : () => {
                        this._onEditAd(record)
                    }}>修改 </a>
                    <Divider type="vertical" />
                    <a onClick={this.state.view_mode ? null : () => {
                        this._onDeleteAd(record.mediaId, record.ltype, record.courseId, record)
                    }}>删除</a>
                </span>
            ),
        },
    ]
}
const LayoutComponent = AddLive;
const mapStateToProps = state => {
    return {
        category_list: state.course.category_list,
        course_info: state.course.course_info,
        user: state.site.user,
        live_ad: state.course.live_ad,
        live_goods: state.course.live_goods,
        adresses_list: state.system.adresses_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
