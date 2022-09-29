import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Tag, List, Checkbox, Empty, Spin, Radio, InputNumber, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message, DatePicker } from 'antd';

import locale from 'antd/es/date-picker/locale/zh_CN';
import debounce from 'lodash/debounce';
import config from '../../config/config';
import connectComponent from '../../util/connect';
import * as mallService from '../../redux/service/mall'
import Editor from '../../components/Editor'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload'
import './GoodsEdit.scss'

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

class GoodsEdit extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;

        this.input_value = ''
    }
    state = {
        view_mode: false,
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

        goods_id: 0,
        category_id: 0,
        ccategory_id: 0,
        brand_id: 0,
        good_name: '',
        summary: '',

        beginTime: null,
        begin_time: '',
        end_time: '',
        goods_sn: '',
        goods_img: '',
        goods_intro: '',
        goods_amount: '',
        market_amount: '',
        goods_weight: 0,
        goods_limit: 0,
        goods_integral: '',
        sale_num: '',
        is_free: 1,
        cost: '',
        status: 0,
        // stock: 0,
        activity_id: 0,

        tlevel: 0,
        ulevel: 0,
        delivery: 0,
        gtype: 3,

        dataSource: [],
        teacherLevel: [{ value: 10, title: '讲师' }, { value: 10, title: '初级讲师' }, { value: 10, title: '中级讲师' }, { value: 10, title: '高级讲师' }],
        edit_level: 'LV1',
        edit_index: -1,
        edit_value: '',

        _edit_level: 'LV1',
        _edit_index: -1,
        _edit_value: '',

        isUpNow: 0,
        showMedia: false,
        second_category: [],
        goodsType: '',

        goods_type_rull: [],
        attr_list: [],

        goodsAttrList: [],
        can_share: 1,
        stock: [],
        fp_list:[],
        kate_sn:''
    };
    goods_id = 0
    category_list = []
    goods_type_list = []
    goods_type_rull = []
    goods_brand_list = []
    goods_active = []
    componentDidMount() {

        this.goods_id = this.props.match.params.id
        let _state = this.props.location.state
        if (typeof _state === 'undefined') {
            _state = { type: '' }
        } else if (_state.type === 'view') {
            this.setState({ view_mode: true })
        }

        if (this.goods_id !== '0') {
            this.getMallGoods()
            this.getLevelPrice()
        }
        const { actions } = this.props
        this.getGoodsActive()
        this.getGoodsCate()
        this.getGoodsType()
        this.getGoodsBrand()
        this.Fapiaotype()
        if (this.goods_id != 0) {
            actions.getGoodsprice({
                goods_id: parseInt(this.goods_id),
                resolved: (res) => {
                    console.log(res)
                    let tlist = res.filter(item => item.type == 1)
                    let ulist = res.filter(item => item.type == 0)
                    let users = []
                    let teachers = []
                    tlist.map((itm, idx) => {
                        let teacher = { value: itm.discount * 10, title: idx == 0 ? '讲师' : idx == 1 ? '初级' : idx == 2 ? '中级' : '高级' }
                        teachers = teachers.concat(teacher)
                    })
                    ulist.map(itm => {
                        let uss = { value: itm.goodsAmount }
                        users = users.concat(uss)
                    })
                    this.setState({
                        teacherLevel: teachers,
                        dataSource: users
                    })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        }

    }
    componentWillReceiveProps(n_props) {
        if (n_props.goods_active !== this.props.goods_active) {
            if (n_props.goods_active['data']) {
                this.goods_active = n_props.goods_active.data || []
            }
            console.log(this.goods_active)
        }

        if (n_props.goods_price_level !== this.props.goods_price_level) {
            console.log(n_props.goods_price_level)
            let dataSource = []
            let edit_index = -1

            // let teacherLevel = []
            // let _edit_index = -1
            // n_props.goods_price_level.map(ele=>{
            //     if(ele.type==1){
            //         teacherLevel.push({value:ele.goodsAmount})
            //     }else{
            //         dataSource.push({value:ele.goodsAmount})
            //     }
            // })
            this.setState({
                dataSource, edit_index,
                // teacherLevel,_edit_index
            })
        }

        if (n_props.goods_cate_list !== this.props.goods_cate_list) {
            console.log(n_props.goods_cate_list)
            this.category_list = n_props.goods_cate_list.data
        }
        if (n_props.goods_type_rull !== this.props.goods_type_rull) {
            this.goods_type_rull = n_props.goods_type_rull.data
            this.goods_type_rull.map((item, index) => {
                this.goods_type_rull[index].value = []
            })

            this.setState({ goods_type_rull: this.goods_type_rull })
            console.log(n_props.goods_type_rull)
        }
        if (n_props.goods_type_list !== this.props.goods_type_list) {
            this.goods_type_list = n_props.goods_type_list

            console.log(n_props.goods_type_list)
        }
        if (n_props.goods_list !== this.props.goods_list) {
            if (n_props.goods_list.data.length == 0) {
                message.info('暂时没有数据')
            }
            console.log(n_props.goods_list.data[0])

            let {
                goodsAttrList,
                beginTime,
                brandId: brand_id,
                category,
                ccategory,
                categoryId: category_id,
                ccategoryId: ccategory_id,
                cost,
                delivery,
                endTime,
                galleries,
                goodsAmount: goods_amount,
                goodsAttrMaps,
                goodsBrand,
                goodsId: goods_id,

                goodsIntegral: goods_integral,
                goodsIntro: goods_intro,
                goodsLimit: goods_limit,
                goodsName: good_name,
                goodsSn: goods_sn,
                goodsWeight: goods_weight,
                gtype,
                isFree: is_free,
                isRecomm,
                marketAmount: market_amount,
                saleNum: sale_num,
                status,
                summary,
                stock,
                ulevel,
                tlevel,
                activityId: activity_id,
                stepPrice,
                canShare,
                attrStockMaps,
                kateSn,
            } = n_props.goods_list.data[0]

            this._getCategory(category_id)

            let isUpNow = 0
            let begin_time = ''
            let end_time = 0
            let goods_img = []
            let fileList = []

            let goodsType = goodsAttrList.length > 0 ? goodsAttrList[0].typeId : ''

            if (beginTime == 0) {
                beginTime = null
                isUpNow = 1
            } else {
                begin_time = moment.unix(beginTime).format('YYYY-MM-DD HH:mm')
                beginTime = moment(begin_time)
                isUpNow = 0
            }
            //主图
            galleries.map((ele, index) => {
                goods_img.push(ele.fpath)
                fileList.push({
                    response: { resultBody: ele.link },
                    uid: index,
                    name: 'img_' + index,
                    status: 'done',
                    url: ele.link,
                    type: 'image/png'
                })
            })
            goods_img = goods_img.join(',')

            //商品类型
            let goods_type_rull = []
            let vas = Object.keys(attrStockMaps)
            attrStockMaps.map((ele,idx) => {
                console.log(ele,'???')
                this.props.actions.getAttrIds({
                    attr_map_ids:ele.goodsAttrIds,
                    goods_id:goods_id,
                    resolved:(res)=>{
                        let vst = {key:res,val:ele.stock}
                        let lst = []
                        lst = lst.concat(vst)
                        this.setState({
                            stock:this.state.stock.concat(lst)
                        })
                    }
                })
            })
            goodsAttrList.map((ele,idx) => {
                let value = []
                ele.goodsAttrMapList.map(_ele => {
                    value.push({ key: _ele.attrVal, value: _ele.attrVal })
                })
                goods_type_rull.push({
                    attrId: ele.attrId,
                    values: ele.values,
                    name: ele.name,
                    value: value
                })
            })
            // let tlist = stepPrice.filter(item=>item.type==1)
            // let ulist = stepPrice.filter(item=>item.type==0)
            // let users = []
            // let teachers = []
            // tlist.map(itm=>{
            //     let teacher = {value:itm.discount*10,title:itm.levelName}
            //     teachers = teachers.concat(teacher)
            // })
            // ulist.map(itm=>{
            //     let uss = {value:itm.goodsAmount}
            //     users = users.concat(uss)
            // })
            this.setState({
                goods_type_rull,
                goodsType,
                goodsAttrList,

                begin_time,
                beginTime,
                fileList,

                goods_id,
                category_id,
                ccategory_id,
                brand_id,
                good_name,
                summary,
                begin_time,
                end_time,
                goods_sn,
                goods_img,
                goods_intro,
                goods_amount,
                market_amount,
                goods_weight,
                goods_limit,
                goods_integral,
                sale_num,
                is_free,
                cost,
                status,
                // stock,
                activity_id,
                ulevel,
                tlevel,
                delivery,
                gtype,
                isUpNow,
                can_share: canShare,
                kate_sn:kateSn,
                // teacherLevel:teachers,
                // dataSource:users
            })

        }
        if (n_props.goods_brand_list !== this.props.goods_brand_list) {
            console.log(n_props.goods_brand_list)
            this.goods_brand_list = n_props.goods_brand_list.data
        }
    }
    Fapiaotype=()=>{
        const{actions}=this.props
        actions.getFapiaos({
            resolved:(res)=>{
                this.setState({
                    fp_list:res
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    getLevelPrice = () => {
        const { actions } = this.props
        actions.getGoodsLevelPrice({ goods_id: this.goods_id })
    }
    getGoodsActive = () => {
        const { actions } = this.props
        actions.getGoodsActive({
            page: 0,
            pageSize: 100000,
        })
    }
    getGoodsType = () => {
        const { actions } = this.props
        actions.getGoodsType({})
    }
    getGoodsCate = () => {
        const { actions } = this.props;
        actions.getGoodsCate({
            keyword: '',
            page: 0,
            pageSize: 0,
            ctype: 7,
            parent_id: 0
        })
    }
    getMallGoods = () => {
        const { actions } = this.props
        actions.getMallGoods({
            goods_id: this.goods_id,
        })
    }
    getGoodsBrand = () => {
        const { actions } = this.props
        actions.getGoodsBrand({
            keyword: '', page: 0, pageSize: 200000
        })
    }
    add = () => {
        this.setState(pre => {
            let { dataSource } = pre
            dataSource.push({
                value: 0
            })
            return {
                dataSource,
                edit_index: dataSource.length - 1,
                edit_value: ''
            }
        })
    }
    edit(index) {
        let { dataSource } = this.state
        let edit_value = dataSource[index].value

        this.setState({
            edit_value,
            edit_index: index,
            dataSource
        })
    }
    save(index) {
        this.setState(pre => {
            let { edit_value, dataSource } = pre
            if (!edit_value || edit_value == '') {
                edit_value = 0
            }
            if (isNaN(edit_value)) {
                message.info('请输入正确的价格')
                return null
            }
            dataSource[index].value = edit_value

            return {
                dataSource,
                edit_index: -1
            }
        })
    }
    delete(index) {
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
    //////
    _add = () => {
        this.setState(pre => {
            let { teacherLevel } = pre
            teacherLevel.push({
                value: 0
            })
            return {
                teacherLevel,
                _edit_index: teacherLevel.length - 1,
                _edit_value: ''
            }
        })
    }
    _edit(index) {
        let { teacherLevel } = this.state
        let _edit_value = teacherLevel[index].value

        this.setState({
            _edit_value,
            _edit_index: index,
            teacherLevel
        })
    }
    _save(index) {
        this.setState(pre => {
            let { _edit_value, teacherLevel } = pre
            if (!_edit_value || _edit_value == '') {
                _edit_value = 0
            }
            if (isNaN(_edit_value)) {
                message.info('请输入正确的价格')
                return null
            }
            teacherLevel[index].value = _edit_value

            return {
                teacherLevel,
                _edit_index: -1
            }
        })
    }
    _delete(index) {
        this.setState(pre => {
            let { teacherLevel } = pre
            teacherLevel = teacherLevel.filter((ele, idx) => {
                return idx !== index
            })
            return {
                _edit_index: -1,
                teacherLevel
            }
        })
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

    onCourseImgChange = ({ file, fileList, event }) => {
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

    _onCateChange = (val) => {
        this.setState({ category_id: val, ccategory_id: '' })
        this._getCategory(val)
    }
    _getCategory = (parent_id) => {
        mallService.getGoodsCate({
            keyword: '',
            page: 0,
            pageSize: 0,
            ctype: '7',
            parent_id: parent_id
        }).then((data) => {

            let second_category = []
            data.data.map((ele) => {
                second_category.push({ categoryId: ele.categoryId, categoryName: ele.categoryName })
            })
            this.setState({ second_category })
        })
    }
    // getGoodsCate = ()=>{
    //     const {actions} = this.props;
    //     actions.getGoodsCate({
    //         keyword:this.state.keyword,
    //         page:this.page_current-1,
    //         pageSize:this.page_size,
    //         ctype:this.state.ctype,
    //         parent_id:'-1'
    //     })
    // }

    disabledDate = (current) => {
        return current < moment().subtract(1, 'day')
    }

    onGoodsImgChange = ({ file, fileList, event }) => {
        let goods_img = []
        if (file.status === 'done') {
            message.success('上传成功')
        }
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                goods_img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList,
            goods_img: goods_img.join(',')
        })
    }
    _onPublish = () => {
        var that = this
        let {
            goods_id,
            category_id,
            ccategory_id,
            brand_id,
            good_name,
            summary,
            begin_time,
            end_time,
            goods_sn,
            goods_intro,
            goods_amount,
            market_amount,
            goods_weight,
            goods_limit,
            goods_integral,
            sale_num,
            is_free,
            cost,
            status,
            stock,
            activity_id,
            tlevel,
            ulevel,
            delivery,

            gtype,
            goods_type_rull,

            dataSource,
            teacherLevel,
            isUpNow,
            can_share,
            kate_sn
        } = this.state;
        const { actions } = this.props
        let flag = true
        let goods_img = ''
        if (this.img) {
            goods_img = this.img.getValue()
        }

        goods_intro = this.refs.editor.toHTML()

        if (good_name == '') { message.info('请输入商品名称'); return; }
        if (summary == '') { message.info('请输入卖点'); return; }
        if (category_id == 0) { message.info('请选择分类'); return; }
        if (ccategory_id == 0) { message.info('请选择子分类'); return; }
        if (brand_id == 0) { message.info('请选择品牌'); return; }
        if(!kate_sn){ message.info('请选择税收分类'); return; }
        if (goods_sn == '') { message.info('请输入货号'); return; }
        if (goods_type_rull.length == 0) { message.info('请设置商品类型'); return; }

        for (let i = 0; i < goods_type_rull.length; i++) {
            if (goods_type_rull[i].value.length == 0) { flag = false; }
        }
        if (!flag) { message.info('请设置商品属性'); return; }



        if (goods_img == '') { message.info('请上传商品图片'); return; }
        if (!goods_intro || goods_intro == '<p></p>') { message.info('详情不能为空'); return; }
        if (isUpNow) {
            begin_time = ''
        } else if (begin_time == '') {
            message.info('请选择上架时间'); return;
        }

        actions.publishMallGoods({
            goods_id,
            category_id,
            ccategory_id,
            brand_id,
            good_name,
            summary,
            begin_time,
            end_time,
            goods_sn,
            goods_img,
            goods_intro,
            goods_amount,
            market_amount,
            goods_weight,
            goods_limit,
            goods_integral,
            sale_num,
            is_free,
            cost,
            status,
            stock:0,
            activity_id,
            tlevel,
            ulevel,
            delivery,
            gtype,
            can_share,
            kate_sn,
            resolved: (data) => {
                console.log(data, '???')
                let id = data.goodsId
                // console.log(dataSource,'???')
                if (dataSource.length !== 0) {
                    dataSource.map((l_ele, l_index) => {
                        actions.setGoodsLevelPrice({
                            goods_id: data.goodsId,
                            level: l_index + 1,
                            goods_amount: l_ele.value,
                            type: 0,
                            discount: 0
                        })
                    })
                }
                if (teacherLevel.length !== 0) {
                    teacherLevel.map((l_ele, l_index) => {
                        actions.setGoodsLevelPrice({
                            goods_id: data.goodsId,
                            level: l_index,
                            goods_amount: 0,
                            type: 1,
                            discount: l_ele.value
                        })
                    })
                }

                goods_type_rull.map((ele, index) => {
                    ele.value.map((_ele, _index) => {
                        actions.publishGoodsAttr({
                            goods_id: data.goodsId,
                            attr_id: ele.attrId,
                            value: _ele.key,
                            resolved: (e) => {
                                actions.getMallGoodss({
                                    goods_id:id,
                                    resolved:(res)=>{
                                        let lst = []
                                        let lsts = []
                                        let arts = []
                                        let vas = []
                                        res.data[0].goodsAttrList.map(item=>{
                                            item.goodsAttrMapList.map(itm=>{
                                                lst=lst.concat(itm.goodsAttrId)
                                            })
                                        })
                                        // stock.map(item=>{
                                        //     lsts = lsts.concat(item.val)
                                        // })
                                        goods_type_rull.map(item=>{
                                            arts=arts.concat(item.attrId)
                                        })
                                        // lst.map((item,index)=>{
                                        //     let ls = item
                                        //     lst.map((itm,idx)=>{
                                        //         if(itm!=ls&&idx>index){
                                        //             vas=vas.concat({val:ls+','+itm})
                                        //         }
                                        //     })
                                        // })
                                        stock.map(item=>{
                                            actions.getAttrVal({
                                                attrValues:item.key,
                                                goods_id:id,
                                                resolved:(res)=>{
                                                    actions.postMallAttr({
                                                        attr_ids:arts.toLocaleString(),
                                                        goods_attr_ids:res,
                                                        goods_id:id,
                                                        stock:item.val,
                                                        resolved:(res)=>{
            
                                                        },
                                                        rejected:(err)=>{
            
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                        // lsts.map((itm,idx)=>{
                                            // actions.postMallAttr({
                                            //     attr_ids:arts.toLocaleString(),
                                            //     goods_attr_ids:vas[idx].val,
                                            //     goods_id:id,
                                            //     stock:itm,
                                            //     resolved:(res)=>{
    
                                            //     },
                                            //     rejected:(err)=>{
    
                                            //     }
                                            // })
                                        // }) 
                                    }
                                })
                            },
                            rejected: (data) => {
                                message.error(data)
                            }
                        })
                    })
                })

                message.success({
                    content: '提交成功',
                    onClose: () => {
                        window.history.back()
                    }
                })
            },
            rejected: (data) => {
                message.error({
                    content: data
                })
            }
        })
    }
    onGoodsType = (goodsType) => {
        const { actions } = this.props
        const type_id = goodsType
        this.setState({ goodsType })
        actions.getGoodsTypeRull({
            type_id,
            pageSize: 1000000
        })
    }
    onCostChange = (e) => {
        this.setState({ cost: e })
    }
    onMarketChange = (e) => {
        this.setState({ market_amount: e })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };
        const uploadButtonImg = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const {
            view_mode,
            selectData,
            selectValue,

            goods_id,
            category_id,
            ccategory_id,
            brand_id,
            good_name,
            summary,
            begin_time,
            end_time,
            goods_sn,
            goods_img,
            goods_intro,
            goods_amount,
            market_amount,
            goods_weight,
            goods_limit,
            goods_integral,
            sale_num,
            is_free,
            cost,
            status,
            stock,
            activity_id,
            ltype,
            tlevel,
            ulevel,
            delivery,
            gtype
        } = this.state;
        
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={view_mode ? '查看商品' : this.goods_id == 0 ? "添加商品" : "修改商品"}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{ minHeight: '400px' }}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="商品名称">
                                            <Input.TextArea disabled={view_mode} autoSize={{ minRows: 2 }} value={good_name} onChange={(e) => {
                                                this.setState({ good_name: e.target.value })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="卖点">
                                            <Input.TextArea disabled={view_mode} autoSize={{ minRows: 2 }} value={summary} onChange={(e) => {
                                                this.setState({ summary: e.target.value })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="分类">
                                            <Select onChange={this._onCateChange} value={this.state.category_id} disabled={view_mode} className="m_w400">
                                                <Option value={0}>无</Option>
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
                                        <Form.Item label="税收分类">
                                            <Select onChange={(e)=>{this.setState({kate_sn:e})}} value={this.state.kate_sn} disabled={view_mode} className="m_w400">
                                                {this.state.fp_list.map((ele, index) => (
                                                    <Option key={index + 'cate'} value={ele.kateSn}>{ele.kateName}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="品牌">
                                            <Select
                                                disabled={view_mode}
                                                className="m_w400"
                                                style={{ minWidth: '110px' }}
                                                placeholder="选择品牌"
                                                onChange={val => this.setState({ brand_id: val })}
                                                value={this.state.brand_id}
                                            >
                                                <Select.Option value={0}>无</Select.Option>
                                                {this.goods_brand_list.map(ele => (
                                                    <Select.Option key={ele.brandId} value={ele.brandId}>{ele.brandName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="成本价">
                                            <InputNumber disabled={view_mode} min={0} max={80000000} style={{ minWidth: '120px' }} value={this.state.cost} onChange={this.onCostChange} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="划线价">
                                            <InputNumber disabled={view_mode} min={0} max={80000000} style={{ minWidth: '120px' }} value={this.state.market_amount} onChange={this.onMarketChange} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="销售价类型">
                                            <Radio.Group
                                                disabled={view_mode}
                                                value={this.state.gtype}
                                                onChange={e => {
                                                    this.setState({ gtype: e.target.value, goods_amount: '', goods_integral: '' })
                                                    if (e.target.value == 3) {
                                                        this.setState({
                                                            is_free: 1
                                                        })
                                                    }

                                                }}
                                            >
                                                <Radio disabled={view_mode} value={1}>免费</Radio>
                                                <Radio disabled={view_mode} value={2}>现金</Radio>
                                                <Radio disabled={view_mode} value={3}>金币</Radio>
                                                <Radio disabled={view_mode} value={4}>现金+金币</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {this.state.gtype == 1 ? null :
                                            <Form.Item label="销售价">
                                                {this.state.gtype == 2 || this.state.gtype == 4 ?
                                                    <InputNumber
                                                        disabled={view_mode}
                                                        placeholder='输入价格'
                                                        style={{ minWidth: '120px' }}
                                                        value={goods_amount}
                                                        onChange={(e) => {
                                                            this.setState({ goods_amount: e })
                                                        }}
                                                        min={0} max={80000000}
                                                    />
                                                    : null}
                                                {this.state.gtype == 4 ? <span>&nbsp;+&nbsp;</span> : null}
                                                {this.state.gtype == 3 || this.state.gtype == 4 ?
                                                    <InputNumber
                                                        disabled={view_mode}
                                                        min={0} max={80000000}
                                                        placeholder='输入金币'
                                                        onChange={(e) => {
                                                            this.setState({ goods_integral: Math.floor(e) })
                                                        }}
                                                        value={goods_integral}
                                                    />
                                                    : null}
                                            </Form.Item>
                                        }
                                        <Form.Item label="会员阶梯价格" className='' help='会员阶梯价格只支持现金支付'>
                                            <List
                                                className="demo-loadmore-list m_w400"
                                                style={{ marginTop: '-2px' }}
                                                itemLayout="horizontal"
                                                dataSource={this.state.dataSource}
                                                renderItem={(item, index) => (
                                                    <List.Item
                                                        actions={view_mode ? [] : [
                                                            <a
                                                                onClick={this.state.edit_index === index ?
                                                                    this.save.bind(this, index) :
                                                                    this.edit.bind(this, index)
                                                                }
                                                                key="list-loadmore-edit"
                                                            >
                                                                {this.state.edit_index === index ? '保存' : '修改'}
                                                            </a>,
                                                            <a
                                                                key="list-loadmore-more"
                                                                onClick={this.delete.bind(this, index)}
                                                            >删除</a>
                                                        ]}
                                                    >
                                                        <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', width: '100%' }}>
                                                            <div style={{ flexShrink: 0, width: 100 }}>等级：<Tag>LV{index + 1}</Tag></div>
                                                            {this.state.edit_index === index ?
                                                                <Input
                                                                    disabled={view_mode}
                                                                    placeholder='请输入价格'
                                                                    style={{ flexGrow: 1, }}
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            edit_value: e.target.value
                                                                        })
                                                                    }}
                                                                    value={this.state.edit_value}
                                                                /> :
                                                                <div style={{ flexGrow: 1 }}>价格：<Tag>{item.value}</Tag></div>
                                                            }
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                            {view_mode ? null :
                                                <Button type="dashed" onClick={this.add} style={{ minWidth: '10%' }}>
                                                    <Icon type="plus" /> 添加
                                                </Button>
                                            }
                                        </Form.Item>
                                        <Form.Item label="讲师阶梯价格" className='' help='讲师阶梯价格只支持现金支付'>
                                            <List
                                                className="demo-loadmore-list m_w400"
                                                style={{ marginTop: '-2px' }}
                                                itemLayout="horizontal"
                                                dataSource={this.state.teacherLevel}
                                                renderItem={(item, index) => (
                                                    <List.Item
                                                        actions={view_mode ? [] : [
                                                            <a
                                                                onClick={this.state._edit_index === index ?
                                                                    this._save.bind(this, index) :
                                                                    this._edit.bind(this, index)
                                                                }
                                                                key="list-loadmore-edit"
                                                            >
                                                                {this.state._edit_index === index ? '保存' : '修改'}
                                                            </a>
                                                            // ,<a
                                                            //     key="list-loadmore-more"
                                                            //     onClick={this._delete.bind(this, index)}
                                                            // >删除</a>
                                                        ]}
                                                    >
                                                        <div style={{ width: '100%' }}>
                                                            {this.state._edit_index === index ?
                                                                <InputNumber
                                                                    max={10}
                                                                    min={0}
                                                                    placeholder='请输入价格'
                                                                    style={{ flexGrow: 1, }}
                                                                    onChange={(e) => {
                                                                        if(e<=0){
                                                                            message.info({
                                                                                content:'阶梯价不能为0折'
                                                                            })
                                                                        }else{
                                                                            this.setState({
                                                                                _edit_value: e
                                                                            })
                                                                        }
                                                                        
                                                                    }}
                                                                    value={this.state._edit_value}
                                                                /> :
                                                                <div style={{ flexGrow: 1 }}>{item.title}：<Tag>{item.value}折</Tag></div>
                                                            }
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                            {/* {view_mode?null:
                                            <Button type="dashed" onClick={this._add} style={{ minWidth: '10%' }}>
                                                <Icon type="plus" /> 添加
                                            </Button>
                                            } */}
                                        </Form.Item>
                                        <Form.Item label='兑换用户等级'>
                                            <Select disabled={view_mode} value={ulevel} className='m_w400' onChange={e => this.setState({ ulevel: e })}>
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
                                            <Select disabled={view_mode} value={tlevel} className='m_w400' onChange={e => this.setState({ tlevel: e })}>
                                                <Select.Option value={0}>无</Select.Option>
                                                <Select.Option value={1}>讲师</Select.Option>
                                                <Select.Option value={2}>初级讲师</Select.Option>
                                                <Select.Option value={3}>中级讲师</Select.Option>
                                                <Select.Option value={4}>高级讲师</Select.Option>

                                            </Select>
                                        </Form.Item>
                                        {/* <Form.Item label="库存">
                                            <InputNumber disabled={view_mode} min={0} max={800000} value={stock} onChange={(e) => {
                                                if(isNaN(e)){
                                                    
                                                }else if(e % 1 !== 0){
                                                    e = Math.floor(e)
                                                }
                                                this.setState({ stock: e })
                                            }} className="m_w400" />
                                        </Form.Item> */}
                                        <Form.Item label="货号">
                                            <Input disabled={view_mode} value={goods_sn} onChange={(e) => {
                                                this.setState({ goods_sn: e.target.value })
                                            }} className="m_w400" />
                                        </Form.Item>

                                        <Form.Item label="商品类型">
                                            <Select
                                                disabled={view_mode}
                                                value={this.state.goodsType}
                                                placeholder="选择类型"
                                                filterOption={false}
                                                onChange={this.onGoodsType}
                                                className="m_w400"
                                            >
                                                {this.goods_type_list.map(ele => (
                                                    <Select.Option disabled={ele.status == 0} key={ele.typeId} value={ele.typeId}>{ele.typeName}</Select.Option>
                                                ))}
                                            </Select>
                                            <List
                                                key={Date.now()}
                                                className="demo-loadmore-list m_w400"
                                                style={{ marginTop: '-2px' }}
                                                itemLayout="horizontal"
                                                dataSource={this.state.goods_type_rull}
                                                renderItem={(item, index) => {
                                                    const select = (
                                                        <Select disabled={view_mode} value={item.value} mode='multiple' labelInValue onChange={val => {
                                                            this.setState((pre) => {
                                                                let { goods_type_rull } = pre
                                                                goods_type_rull[index].value = val
                                                                return { goods_type_rull }
                                                            }, () => {
                                                                if (this.state.goods_type_rull.length == 1) {
                                                                    if (this.state.goods_type_rull[0].value.length > 0) {
                                                                        let lst = []
                                                                        this.state.goods_type_rull[0].value.map(itm => {
                                                                            let vas = {key:itm.key,val:0}
                                                                            lst = lst.concat(vas)
                                                                        })
                                                                        this.setState({
                                                                            stock: lst
                                                                        })
                                                                    }
                                                                }
                                                                if (this.state.goods_type_rull.length == 2) {
                                                                    if (this.state.goods_type_rull[0].value.length > 0 && this.state.goods_type_rull[1].value.length > 0) {
                                                                        let lst = []
                                                                        this.state.goods_type_rull[0].value.map(itm => {
                                                                            this.state.goods_type_rull[1].value.map(itms => {
                                                                                let vas = {key:itm.key+','+itms.key,val:0}
                                                                                lst = lst.concat(vas)
                                                                            })
                                                                        })
                                                                        this.setState({
                                                                            stock: lst
                                                                        })
                                                                    }
                                                                }
                                                                if (this.state.goods_type_rull.length == 3) {
                                                                    if (this.state.goods_type_rull[0].value.length > 0 && this.state.goods_type_rull[1].value.length > 0) {
                                                                        let lst = []
                                                                        this.state.goods_type_rull[0].value.map(itm => {
                                                                            this.state.goods_type_rull[1].value.map(itms => {
                                                                                this.state.goods_type_rull[2].value.map(itmss => {
                                                                                    let vas = {key:itm.key+','+itms.key+','+itmss.key,val:0}
                                                                                    lst = lst.concat(vas)
                                                                                })
                                                                            })
                                                                        })
                                                                        this.setState({
                                                                            stock: lst
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        }}>
                                                            {item.values.split(',').map((_ele, _index) => (
                                                                <Select.Option key={_ele + _index} value={_ele}>{_ele}</Select.Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                    return (
                                                        <List.Item key={item.attrId}>
                                                            <List.Item.Meta
                                                                title={item.name}
                                                                description={select}
                                                            />
                                                        </List.Item>
                                                    )
                                                }}
                                            />
                                            {/* {
                                                this.state.goods_type_rull.length > 0 ?
                                                    <div>
                                                        {
                                                            this.state.goods_type_rull.length == 1 ?
                                                                <div>
                                                                    {
                                                                        this.state.goods_type_rull[0].value.map(item => {
                                                                            return (
                                                                                <div style={{color:'#666666'}}>
                                                                                    {item.key}库存量 <InputNumber />
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                                :
                                                                <div>
                                                                    {
                                                                        this.state.goods_type_rull[0].value.map(item => {
                                                                            return (
                                                                                <div>
                                                                                    {
                                                                                        this.state.goods_type_rull[1].value.map(itm => {
                                                                                            return (
                                                                                                <div style={{color:'#666666'}}>
                                                                                                    {item.key}:{itm.key}库存量 <InputNumber />
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                        }
                                                    </div>
                                                    : null
                                            } */}
                                            {
                                                this.state.stock.length > 0 ?
                                                    <div>
                                                        {
                                                            this.state.stock.map(item => {
                                                                return (
                                                                    <div style={{ color: '#666666' }}>
                                                                        {item.key}库存量 <InputNumber min={0} value={item.val} onChange={(e)=>{
                                                                             if(isNaN(e)){
                                                    
                                                                            }else if(e % 1 !== 0){
                                                                                e = Math.floor(e)
                                                                            }
                                                                            this.setState({
                                                                                stock:stock.map(itm=>itm.key==item.key?{...itm,val:e}:itm)
                                                                            })
                                                                        }}/>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    : null
                                            }
                                        </Form.Item>
                                        <Form.Item label='活动'>
                                            <Select
                                                className="m_w400"
                                                style={{ minWidth: '110px' }}
                                                placeholder="选择促销活动"
                                                onChange={val => this.setState({ activity_id: val })}
                                                value={this.state.activity_id}
                                            >
                                                <Select.Option value={0}>无</Select.Option>
                                                {this.goods_active.map(ele => (
                                                    <Select.Option key={ele.activityId} value={ele.activityId}>{ele.title}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label='是否立即上架'>
                                            <Switch disabled={view_mode} checked={this.state.isUpNow == 1} onChange={(e) => {
                                                if (e) {
                                                    this.setState({ isUpNow: 1 })
                                                } else {
                                                    this.setState({ isUpNow: 0 })
                                                }
                                            }} />
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
                                        {this.state.isUpNow ? null :
                                            <Form.Item disabled={view_mode} label='上架时间'>
                                                <DatePicker allowClear={false} showTime={{ format: 'HH:mm' }} format='YYYY-MM-DD HH:mm' disabledDate={this.disabledDate} value={this.state.beginTime} locale={locale} onChange={(date, dateString) => {
                                                    this.setState({
                                                        beginTime: date,
                                                        begin_time: dateString
                                                    })
                                                }}></DatePicker>
                                            </Form.Item>
                                        }
                                        <Form.Item label='快递'>
                                            <Radio.Group disabled={view_mode} value={is_free} onChange={e => {
                                                if (gtype == 3 && e.target.value == 0) {
                                                    message.info({ content: '该物品是金币商品' });
                                                    return;
                                                }
                                                if (gtype == 1 && e.target.value == 0) {
                                                    message.info({ content: '该物品是免费商品' });
                                                    return;
                                                }
                                                this.setState({ is_free: e.target.value })
                                            }}>
                                                <Radio value={0}>
                                                    不包邮
                                                </Radio>
                                                <Radio value={1}>
                                                    包邮
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="主图">
                                            <AntdOssUpload
                                                actions={this.props.actions}
                                                disabled={view_mode}
                                                listType="picture-card"
                                                accept='image/*'
                                                value={this.state.fileList}
                                                ref={ref => this.img = ref}
                                                maxLength={8}
                                            >
                                            </AntdOssUpload>
                                            <span style={{ marginTop: '-30px', display: 'block', fontSize: '12px', color: 'red' }}>* 请上传符合尺寸为 800 x 800的图片</span>
                                        </Form.Item>
                                        <Form.Item label="重量(KG)">
                                            <InputNumber disabled={view_mode} min={0} max={800000} value={goods_weight} onChange={(e) => {
                                                this.setState({ goods_weight: e })
                                            }} className="m_w400" />
                                        </Form.Item>
                                        <Form.Item label="商品介绍">
                                            <Editor readOnly={view_mode} content={this.state.goods_intro} ref='editor' actions={this.props.actions}></Editor>
                                        </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button type="primary" ghost onClick={() => { window.history.go(-1) }} className='m_2'>取消</Button>
                                        {
                                            view_mode ? null :
                                                <Button onClick={this._onPublish} type="primary" className='m_2'>提交</Button>
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
const LayoutComponent = GoodsEdit;
const mapStateToProps = state => {
    return {
        goods_price_level: state.mall.goods_price_level,
        goods_active: state.mall.goods_active,
        goods_type_list: state.mall.goods_type_list,
        goods_type_rull: state.mall.goods_type_rull,
        goods_cate_list: state.mall.goods_cate_list,
        goods_brand_list: state.mall.goods_brand_list,
        goods_list: state.mall.goods_list,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
