import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Spin, Table, Checkbox, TimePicker, DatePicker, Radio, InputNumber, Icon, Upload, PageHeader, Switch, Modal, Form, Card, Select, Input, Button, message, Tag } from 'antd';
import { Link } from 'react-router-dom';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import connectComponent from '../../../util/connect';
import config from '../../../config/config';
import AntdOssUpload from '../../../components/AntdOssUpload'
import PersonTypePublic from '../../../components/PersonTypePublic'
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

class CouponEdit extends Component {
    state = {
        view_mode: false,
        fileList: [],
        previewVisible: false,
        previewImage: '',
        editorState: null,
        showTheBox: true,
        isVideoCourse: true,

        file_url: '',
        flag: '',
        ad_id: 0,
        billboard_id: '',
        billboard_name: '',
        content: '',
        link: '',
        sort_order: 0,
        status: 0,

        _beginTime: null,
        _endTime: null,

        validType: 0,
        endTimeType: 0,
        selectValue: [],
        goodsType: 3,

        isFree: 0,
        amount: 0,
        begin_time: '',
        end_time: '',
        content_id: 0,
        coupon_id: 0,
        coupon_img: '',
        coupon_name: '',
        ctype: 0,
        flag: '',
        limit: 0,
        require_amount: 0,
        total: 0,

        contentItem: [],
        c_keyword: '',
        c_total: 0,
        c_page: 0,
        c_ctype: 0,
        coursePanle: false,
        course_loading: false,

        goodsPanel: false,
        goods_cate_list: [],
        goodss_cate_list: [],

        one_list: 0,
        second_list: 0,
        one_item: '一级分类',
        second_item: '二级分类',

        g_pageSize: 10,
        g_page: 0,
        g_total: 0,
        g_keyword: '',
        g_category_id: 0,
        goods_loading: false,
        goods_list: [],
        etype: 1,
        title: '',
        coupon_id: 0,
        loading: false,
        keyword: '',
        class_one: 0,
        class_two: 0,
        auth_cate_list: [],
        integral: 0,
        require_integral: 0,
    };
    img = {
        getValue: () => ''
    }
    personType = {
        getValue: () => '',
        uploader: () => false
    }
    componentDidMount() {

        const { id } = this.props.match.params
        if (parseInt(id)) {
            this.setState({ coupon_id: id }, this.getCouponInfo)
        }
        if (this.props.match.path === '/mall/coupon/edit/:id') {
            this.setState({ title: '修改' })
        } else if (this.props.match.path === '/mall/coupon/view/:id') {
            this.setState({ view_mode: true, title: '查看' })
        } else {
            this.setState({ title: '添加' })
        }
    }
    componentWillReceiveProps(n_props) {
        if (n_props.goods_list !== this.props.goods_list) {
            const { total, page, data } = n_props.goods_list
            if (Array.isArray(data)) {
                this.setState({
                    g_total: total,
                    g_page: page,
                    goods_list: data,
                    goods_loading: false,
                })
            }
        }
        if (n_props.goods_cate_list !== this.props.goods_cate_list) {
            console.log(n_props.goods_cate_list)
            const { data } = n_props.goods_cate_list
            if (Array.isArray(data)) {
                this.setState({
                    goods_cate_list: data,
                })
            }
        }
        if (n_props.goodss_cate_list !== this.props.goodss_cate_list) {
            console.log(n_props.goodss_cate_list)
            const { data } = n_props.goodss_cate_list
            if (Array.isArray(data)) {
                this.setState({
                    goodss_cate_list: data,
                })
            }
        }
        if (n_props.auth_cate_list !== this.props.auth_cate_list) {
            this.setState({
                auth_cate_list: n_props.auth_cate_list,
                goods_cate_list: n_props.auth_cate_list.filter(item => item.parentId == 0)
            })
            // if(this.state.second_list){
            //     this.setState({
            //         one_list:n_props.auth_cate_list.filter(item=>item.categoryId==this.state.second_list)[0].parentId
            //     })
            // }
        }
    }
    getCouponInfo = () => {
        const { coupon_id } = this.state
        this.props.actions.getCoupon({
            coupon_id,
            resolved: (res) => {
                const { data } = res
                if (Array.isArray(data) && data.length === 1) {
                    let {
                        amount,
                        beginTime,
                        contentId,
                        couponId,
                        couponImg,
                        couponName,
                        ctype,
                        endTime,
                        etype,
                        expTime,
                        flag,
                        identity,
                        integral,
                        requireIntegral,
                        isDelete,
                        isPlus,
                        level,
                        limit,
                        requireAmount,
                        status,
                        total,
                    } = data[0]
                    let isFree = 0
                    let begin_time = ''
                    let end_time = ''
                    let validType = 0
                    let endTimeType = 0
                    let _beginTime = null
                    let _endTime = null
                    let fileList = []
                    let contentItem = []
                    if (requireAmount==0&&requireIntegral==0) { isFree = 1 }
                    if (beginTime) {
                        _beginTime = moment.unix(beginTime)
                        begin_time = _beginTime.format('YYYY-MM-DD')
                        validType = 1
                    }
                    if (endTime) {
                        _endTime = moment.unix(endTime)
                        end_time = _endTime.format('YYYY-MM-DD')
                        endTimeType = 1
                    }
                    if (couponImg) {
                        fileList = [{
                            uid: 'uid',
                            type: 'image/png',
                            status: 'done',
                            url: couponImg,
                        }]
                    }
                    if (contentId) {
                        let tips = ctype === 3 ? '已绑定课程ID' : ctype === 7 ? '已绑定商品ID' : ''
                        // if (ctype != 37) {
                        contentItem = [{ contentId: contentId, contentName: tips + contentId }]
                        // }
                    }
                    this.setState({
                        contentItem,
                        etype,
                        validType,
                        endTimeType,
                        isFree,
                        amount,
                        begin_time,
                        end_time,
                        _beginTime,
                        _endTime,
                        content_id: contentId,
                        coupon_id: couponId,
                        coupon_name: couponName,
                        fileList,
                        ctype,
                        flag,
                        limit,
                        require_amount: requireAmount,
                        integral,
                        require_integral:requireIntegral,
                        total,
                    }, () => {
                        if (this.state.ctype == 37) {
                            this.getGoodsCate()
                        }
                        if (this.state.ctype == 3) {
                            this.getCourseCate()
                            if (contentId) {
                                this.props.actions.getCourseInfos({
                                    course_id: contentId,
                                    resolved: (res) => {
                                        let Item = [{ contentId: contentId, contentName: res.courseName }]
                                        this.setState({
                                            contentItem: Item
                                        })
                                    },
                                    rejected: (err) => {
                                        console.log(err)
                                    }
                                })
                            }
                        }
                        if(contentId!=0){
                            this.props.actions.getCateIds({
                                categoryId:contentId,
                                resolved:(res)=>{
                                    this.setState({
                                        one_item:res.categoryId,
                                        second_list:contentId
                                    })
                                    this.onOnce(res.categoryId)
                                },
                                rejected:(err)=>{
                                    console.log(err)
                                }
                            })
                            setTimeout(() => {
                                this.setState({
                                    second_item:contentId
                                })
                            }, 1000);
                        }
                    })
                   
                    // if (ctype == 37) {
                    //     this.setState({
                    //         second_list: contentId,
                    //     })
                    // }

                }
               
                console.log(res)
            },
            rejected: () => {

            }
        })
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
    getCourseCate = () => {
        const { actions } = this.props
        actions.getAuthCate({
            keyword: '',
            ctype: 3
        })
    }
    _onPublish = () => {

        const { actions } = this.props
        let {
            amount,
            begin_time,
            end_time,
            content_id,
            coupon_id,
            coupon_name,
            ctype,
            flag,
            limit,
            require_amount,
            total,
            endTimeType,
            validType,
            contentItem,
            etype,
            one_list,
            second_list,
            integral,
            require_integral
        } = this.state
        console.log(second_list)
        if (ctype == 37) {
            if (one_list == 0) { message.info('请选择一级品类'); return; }
            if (second_list == 0) { message.info('请选择二级品类'); return; }
        }
        let coupon_img = this.img.getValue()

        if (!coupon_name) { message.info('请输入名称'); return; }
        if (!coupon_img) {
            message.info('请上传图片'); return;
        }
        if (validType === 1 && !begin_time) {
            message.info('请选择开始时间'); return;
        }
        if (endTimeType === 1 && !end_time) {
            message.info('请选择截止时间'); return;
        }
        if (ctype !== 0 && contentItem.length > 0) {
            content_id = contentItem[0]['contentId']
        }
        flag = this.personType.getValue()
        //if(!link){ message.info('请输入跳转链接'); return;}
        this.setState({ loading: true })
        let id = 0
        if (ctype == 3||ctype==7) {
            id = content_id
        }
        if (ctype == 37) {
            id = second_list
        }
        actions.setCoupon({
            etype,
            coupon_img,
            amount,
            begin_time,
            end_time,
            content_id: id,
            coupon_id,
            coupon_name,
            ctype,
            flag,
            limit,
            require_amount,
            total,
            integral,
            require_integral,
            resolved: async (res) => {
                const { couponId: _couponId } = res
                let result = false
                if (_couponId) {
                    result = await this.personType.uploader(_couponId)
                }
                if (!result)
                    message.success({
                        content: '提交成功',
                        onClose: () => {
                            this.setState({ loading: false })
                            window.history.back()
                        }
                    })

            },
            rejected: () => {
                this.setState({ loading: false })
            }
        })
    }
    addTmp = () => {
        if (!this.input_value) {
            message.info("请输入内容再提交");
            return;
        }
        let selectValue = this.state.selectValue;
        selectValue.push({ key: Math.random() * 100, label: this.input_value });
        this.setState({ selectValue });
        this.input_value = ''
    }
    disabledDate = (current) => {
        return current < moment().subtract(1, 'day')
    }
    onSelected = (value) => {
        if (value == 2) {
            this.setState({
                showTheBox: true
            })
        } else if (value == 1) {
            this.setState({
                flag: '/2/',
                showTheBox: false
            })
        } else {
            this.setState({
                flag: '',
                showTheBox: false
            })
        }
    }
    onCheckBox = (val) => {
        val = '/' + val.join('/') + '/';

        this.setState({
            flag: val
        })
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
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
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

    onUpTime = (val, dateString) => {
        this.setState({
            begin_time: dateString,
            _beginTime: val
        })
    }
    onDownTime = (val, dateString) => {
        this.setState({
            end_time: dateString,
            _endTime: val
        })
    }
    getGoods = () => {
        this.setState({ goods_loading: true })
        const { actions } = this.props
        const { g_pageSize, g_page, g_keyword, g_category_id } = this.state
        actions.getMallGoods({
            category_id: g_category_id,
            brand_id: 0,
            keyword: g_keyword,
            page: g_page,
            pageSize: g_pageSize,
            status: -1,
            sort: 0
        })
    }
    getCourse = () => {
        const { c_keyword, c_page, c_ctype } = this.state
        this.setState({ course_loading: true })
        this.props.actions.getCourseList({
            keyword: c_keyword,
            page: c_page,
            pageSize: 10,
            category_id: '',
            ctype: c_ctype,
            resolved: (res) => {
                const { page, total, data } = res
                if (data instanceof Array) {
                    this.setState({ course_list: data, c_total: total, c_page: page })
                }
                this.setState({ course_loading: false })
            },
            rejected: () => {
                this.setState({ course_loading: false })
            }
        })
    }
    onOnce = (val) => {
        console.log(val)
        this.setState({
            one_list: val,
            // one_item: this.state.goods_cate_list.filter(item => item.categoryId == val)[0].categoryName,
            one_item:val,
            second_list: 0,
            second_item: '二级分类'
        })
        const { actions } = this.props;
        if (this.state.ctype == 3) {
            const { goodss_cate_list, auth_cate_list } = this.state
            this.setState({
                goodss_cate_list: auth_cate_list.filter(item => item.parentId == val)
            })
        } else {
            actions.getGoodsCates({
                keyword: '',
                page: 0,
                pageSize: 0,
                ctype: '7',
                parent_id: val
            })
        }
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
        const {
            goods_cate_list,
            _beginTime,
            _endTime,
            view_mode,
        } = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={this.state.title + "优惠券"}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{ minHeight: '400px' }}>
                                    <Form {...formItemLayout}>

                                        <Form.Item label="名称">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e => {
                                                    this.setState({ coupon_name: e.target.value })
                                                }}
                                                value={this.state.coupon_name}
                                                className="m_w400"
                                                placeholder="输入名称"
                                            />
                                        </Form.Item>

                                        <Form.Item label="封面" help='(345px * 135px)'>
                                            <AntdOssUpload
                                                disabled={view_mode}
                                                actions={this.props.actions}
                                                ref={ref => this.img = ref}
                                                listType="picture-card"
                                                value={this.state.fileList}
                                                accept='image/*'
                                            >
                                            </AntdOssUpload>
                                        </Form.Item>
                                        <Form.Item label="品类">
                                            <Select style={{ width: '120px' }} disabled={view_mode} className="m_w400" value={this.state.ctype} onChange={(val) => {
                                                if (val == 37) { this.getGoodsCate() }
                                                if (val == 3) { this.getCourseCate() }
                                                this.setState({ ctype: val, one_list: 0, second_list: 0, one_item: '一级分类', second_item: '二级分类',integral:0,amount:0,require_integral:0,require_amount:0,content_id:0,contentItem:[]})
                                            }}>
                                                <Select.Option value={0}>全部</Select.Option>
                                                <Select.Option value={3}>课程</Select.Option>
                                                <Select.Option value={7}>商城</Select.Option>
                                                <Select.Option value={37}>品类</Select.Option>
                                                {/* <Select.Option value={3}>单课程</Select.Option>
                                                <Select.Option value={4}>单商品</Select.Option> */}
                                                {/* <Select.Option value={5}>品类1</Select.Option>
                                                <Select.Option value={6}>品类2</Select.Option> */}
                                                {console.log(this.state.second_list)}
                                            </Select>
                                            {this.state.ctype == 0 ? null :
                                                <span>
                                                    {this.state.ctype == 3 || this.state.ctype == 7 ?
                                                        <>{
                                                            this.state.ctype == 3 ?
                                                                <>
                                                                    {/* <Select style={{ width: '120px', marginLeft: '30px' }} disabled={view_mode} className="m_w400" value={this.state.one_item} onChange={this.onOnce}>
                                                                        {
                                                                            this.state.goods_cate_list.map((item, ele) => {
                                                                                return (
                                                                                    <Select.Option value={item.categoryId}>{item.categoryName}</Select.Option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Select>
                                                                    <Select style={{ width: '120px', marginLeft: '30px' }} disabled={view_mode} className="m_w400" value={this.state.second_item} onChange={(val) => {
                                                                        this.setState({
                                                                            second_list: val,
                                                                            // second_item: this.state.goodss_cate_list.filter(item => item.categoryId == val)[0].categoryName
                                                                            second_item:val
                                                                        })
                                                                    }}>
                                                                        {
                                                                            this.state.goodss_cate_list.map((item, ele) => {
                                                                                return (
                                                                                    <Select.Option value={item.categoryId}>{item.categoryName}</Select.Option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Select> */}
                                                                </>
                                                                : null
                                                        }
                                                            {/* <Input
                                                                style={{ width: '120px', marginLeft: '30px' }}
                                                                disabled={view_mode}
                                                                onChange={e => {
                                                                    this.setState({ keyword: e.target.value })
                                                                }}
                                                                value={this.state.keyword}
                                                                className="m_w400"
                                                                placeholder="输入关键字"
                                                            /> */}
                                                        </>
                                                        :
                                                        <span>
                                                            <Select style={{ width: '120px', marginLeft: '30px' }} disabled={view_mode} className="m_w400" value={this.state.one_item} onChange={this.onOnce}>
                                                                {
                                                                    this.state.goods_cate_list.map((item, ele) => {
                                                                        return (
                                                                            <Select.Option value={item.categoryId}>{item.categoryName}</Select.Option>
                                                                        )
                                                                    })
                                                                }
                                                            </Select>
                                                            <Select style={{ width: '120px', marginLeft: '30px' }} disabled={view_mode} className="m_w400" value={this.state.second_item} onChange={(val) => {
                                                                this.setState({
                                                                    second_list: val,
                                                                    // second_item: this.state.goodss_cate_list.filter(item => item.categoryId == val)[0].categoryName
                                                                    second_item:val
                                                                })
                                                            }}>
                                                                {
                                                                    this.state.goodss_cate_list.map((item, ele) => {
                                                                        return (
                                                                            <Select.Option value={item.categoryId}>{item.categoryName}</Select.Option>
                                                                        )
                                                                    })
                                                                }
                                                            </Select>
                                                        </span>
                                                    }
                                                </span>}
                                            <br />
                                            {this.state.ctype === 0 ||this.state.ctype === 37? null :
                                                <>
                                                    <p>
                                                        {this.state.contentItem.map(ele => (
                                                            <>
                                                                <Tag>
                                                                    {ele.contentName}
                                                                </Tag>
                                                                {
                                                                    view_mode ? null :

                                                                        <a style={{ marginRight: 18 }} onClick={() => {
                                                                            this.setState({ contentItem: [] })
                                                                        }}>删除</a>
                                                                }
                                                            </>
                                                        ))}

                                                    </p>
                                                    {
                                                        view_mode ? null :
                                                            <Button onClick={() => {
                                                                if (this.state.ctype == 3) {
                                                                    this.setState({ coursePanel: true }, this.getCourse)
                                                                } else {
                                                                    this.setState({ goodsPanel: true }, this.getGoods)
                                                                }
                                                            }}>{
                                                                    this.state.ctype == 3 ? '选择课程' : '选择商品'
                                                                }</Button>
                                                    }
                                                </>
                                            }
                                            {/* ||this.state.goodsType==4?
                                            <Input.Group compact>
                                                <Select
                                                    className="m_w400" 
                                                    mode="multiple"
                                                    labelInValue
                                                    value={this.state.selectValue}
                                                    placeholder={this.state.goodsType==3?'搜索单课程':'搜索单商品'} 
                                                    onSearch={(value)=>{
                                                        this.input_value = value;
                                                    }}
                                                    filterOption={false}
                                                    onChange={(value)=>{
                                                        this.setState({
                                                            selectValue:value
                                                        });
                                                    }}
                                                    style={{ width: '225px' }}
                                                >

                                                </Select>
                                                
                                            </Input.Group>
                                            :null} */}
                                        </Form.Item>
                                        {
                                            this.state.ctype == 3 ?
                                                <Form.Item label="面值" help='面值取整数'>
                                                    <InputNumber
                                                        disabled={view_mode}
                                                        onChange={val => {
                                                            this.setState({ integral: parseInt(val) })
                                                        }}
                                                        value={this.state.integral}
                                                        min={0} max={100000000}
                                                    />
                                                </Form.Item>
                                                :
                                                <Form.Item label="面值" help='面值取整数'>
                                                    <InputNumber
                                                        disabled={view_mode}
                                                        onChange={val => {
                                                            this.setState({ amount: parseInt(val) })
                                                        }}
                                                        value={this.state.amount}
                                                        min={0} max={100000}
                                                    />
                                                </Form.Item>
                                        }

                                        <Form.Item label="有无门槛">
                                            <Radio.Group disabled={view_mode} value={this.state.isFree} onChange={e => {
                                                if (e.target.value == 1) {
                                                    this.setState({ require_amount: 0,require_integral:0 })
                                                }
                                                this.setState({ isFree: e.target.value })
                                            }}>
                                                <Radio value={0}>有门槛</Radio>
                                                <Radio value={1}>无门槛</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {
                                            this.state.ctype == 3 ?
                                                <Form.Item label="满多少可用" help='数值取整数'>
                                                    <InputNumber
                                                        min={0} max={100000000}
                                                        disabled={this.state.isFree || this.state.view_mode}
                                                        className="m_w400"
                                                        placeholder='无门槛时，不需要填写'
                                                        onChange={val => {
                                                            this.setState({ require_integral: parseInt(val) })
                                                        }}
                                                        value={this.state.require_integral}
                                                    />
                                                </Form.Item>
                                                :
                                                <Form.Item label="满多少可用" help='数值取整数'>
                                                    <InputNumber
                                                        min={0} max={800000}
                                                        disabled={this.state.isFree || this.state.view_mode}
                                                        className="m_w400"
                                                        placeholder='无门槛时，不需要填写'
                                                        onChange={val => {
                                                            this.setState({ require_amount: parseInt(val) })
                                                        }}
                                                        value={this.state.require_amount}
                                                    />
                                                </Form.Item>
                                        }

                                        <Card type='inner' className='mb_20' bodyStyle={{ position: 'relative' }}>
                                            <div style={{
                                                padding: '0 10px',
                                                background: '#fff',
                                                position: 'absolute',
                                                top: '-10px',
                                                left: '10px',
                                                fontSize: '14px',
                                            }}>周期</div>
                                            <Form.Item label="开始时间">
                                                <Radio.Group disabled={view_mode} value={this.state.validType} onChange={e => {
                                                    const { value } = e.target
                                                    if (value == 0) {
                                                        this.setState({
                                                            _beginTime: null,
                                                            begin_time: ''
                                                        })
                                                    }
                                                    this.setState({
                                                        validType: value
                                                    })
                                                }}>
                                                    <Radio value={0}>发券日期</Radio>
                                                    <Radio value={1}>固定时间</Radio>
                                                </Radio.Group>
                                                {this.state.validType === 1 ?
                                                    <DatePicker
                                                        disabled={view_mode}
                                                        className="animated fadeIn"
                                                        disabledDate={this.disabledDate}
                                                        format={'YYYY-MM-DD'}
                                                        placeholder="选择时间"
                                                        onChange={this.onUpTime}
                                                        locale={locale}
                                                        showTime={false}
                                                        value={this.state._beginTime}
                                                    />
                                                    : null}
                                            </Form.Item>
                                            <Form.Item label="截止时间" className='mb_0'>
                                                <Radio.Group disabled={view_mode} value={this.state.endTimeType} onChange={e => {
                                                    const { value } = e.target
                                                    if (value == 0) {
                                                        this.setState({
                                                            _endTime: null,
                                                            end_time: ''
                                                        })
                                                    }
                                                    this.setState({
                                                        endTimeType: value
                                                    })
                                                }}>
                                                    <Radio value={0}>无</Radio>
                                                    <Radio value={1}>固定时间</Radio>
                                                </Radio.Group>
                                                {this.state.endTimeType === 1 ?
                                                    <DatePicker
                                                        disabled={view_mode}
                                                        className="animated fadeIn"
                                                        disabledDate={this.disabledDate}
                                                        format={'YYYY-MM-DD'}
                                                        placeholder="选择时间"
                                                        onChange={this.onDownTime}
                                                        locale={locale}
                                                        showTime={false}
                                                        value={this.state._endTime}
                                                    />
                                                    : null}
                                            </Form.Item>
                                        </Card>

                                        {/* <Form.Item label="有效天数">
                                            <InputNumber
                                                onChange={val=>{
                                                    if(val !== ''&&!isNaN(val)){
                                                        //val = Math.round(val)
                                                        if(val<0) val=0
                                                        //this.setState({edit_duration:val})
                                                    }
                                                }}
                                                defaultValue={''}
                                                min={0} max={800000}
                                            />
                                            <div>有效天数取整数</div>
                                        </Form.Item> */}
                                        <Form.Item label="发行总量">
                                            <InputNumber
                                                disabled={view_mode}
                                                onChange={val => {
                                                    this.setState({ total: parseInt(val) })
                                                }}
                                                value={this.state.total}
                                                min={0} max={800000}
                                            />
                                        </Form.Item>
                                        <Form.Item label="每人发送数量">
                                            <InputNumber
                                                disabled={view_mode}
                                                onChange={val => {
                                                    this.setState({ limit: parseInt(val) })
                                                }}
                                                value={this.state.limit}
                                                min={0} max={800000}
                                            />
                                        </Form.Item>
                                        <Form.Item label="发布对象">
                                            <PersonTypePublic
                                                disabled={view_mode}
                                                ref={ref => this.personType = ref}
                                                actions={this.props.actions}
                                                showO2O={false}
                                                showUser={this.state.coupon_id == 0 ? false : true}
                                                flag={this.state.flag}
                                                contentId={this.state.coupon_id}
                                                ctype={8}
                                                parent={this}
                                            >
                                            </PersonTypePublic>
                                        </Form.Item>
                                        {/* <Form.Item label="使用范围">
                                            <Select className="m_w400">
                                                <Select.Option value={0}>全部</Select.Option>
                                                <Select.Option value={1}>视频</Select.Option>
                                             
                                                <Select.Option value={5}>商城</Select.Option>
                                            </Select>
                                        </Form.Item> */}
                                        <Form.Item label="发放场景">
                                            <Select disabled={view_mode} className="m_w400" value={this.state.etype} onChange={etype => {
                                                this.setState({ etype })
                                            }}>
                                                {/* <Select.Option value={-1}>无</Select.Option>
                                                <Select.Option value={0}>首页弹窗</Select.Option>
                                                <Select.Option value={1}>下单后</Select.Option>
                                                <Select.Option value={2}>新用户注册</Select.Option>
                                                <Select.Option value={3}>推荐好友后</Select.Option>
                                                <Select.Option value={4}>权益兑换</Select.Option>
                                                <Select.Option value={5}>消费后赠送</Select.Option> */}
                                                <Select.Option value={1}>登录</Select.Option>
                                                <Select.Option value={2}>注册</Select.Option>

                                                <Select.Option value={8}>刮刮卡</Select.Option>
                                                <Select.Option value={9}>邀请后</Select.Option>
                                                <Select.Option value={22}>下单后</Select.Option>
                                            </Select>
                                            {/* <Select className="m_w400">
                                                <Select.Option value={0}>LV1</Select.Option>
                                                <Select.Option value={1}>LV2</Select.Option>
                                                <Select.Option value={2}>LV3</Select.Option>
                                                <Select.Option value={3}>LV4</Select.Option>
                                            </Select> */}
                                        </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button type="primary" ghost onClick={() => window.history.back()}>取消</Button>
                                        &nbsp;
                                        {
                                            view_mode ? null :
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
                <Modal footer={null} title='选择商品' visible={this.state.goodsPanel} onCancel={() => { this.setState({ goodsPanel: false }) }}>
                    <Spin spinning={this.state.goods_loading}>
                        <div className='d_flex'>
                            <Select
                                className='m_2'
                                style={{ width: 200 }}
                                placeholder="选择分类"
                                onChange={val => this.setState({ g_page: 0, g_category_id: val }, this.getGoods)}
                                value={this.state.g_category_id}
                            >
                                <Select.Option value={0}>全部分类</Select.Option>
                                {this.state.goods_cate_list.map(ele => (
                                    <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                ))}
                            </Select>
                        </div>
                        <Table
                            size='small'
                            rowKey='goodsId'
                            columns={[
                                { dataIndex: 'goodsId', title: 'ID', key: 'goodsId', width: 68 },
                                { dataIndex: 'goodsName', title: '商品名', key: 'goodsName', ellipsis: true },
                                {
                                    title: '操作', render: (item, ele) => {
                                        return <a onClick={() => {
                                            this.setState({
                                                goodsPanel: false,
                                                contentItem: [{
                                                    contentId: ele.goodsId,
                                                    contentName: ele.goodsName
                                                }]
                                            })
                                        }}>选择</a>
                                    }
                                }
                            ]}
                            dataSource={this.state.goods_list}
                            pagination={{
                                pageSize: this.state.g_pageSize,
                                current: this.state.g_page + 1,
                                total: this.state.g_total,
                                showQuickJumper: true,
                                onChange: (val) => {
                                    this.setState({ g_page: val - 1 }, this.getGoods)
                                },
                                showTotal: (total) => '总共' + total + '条'
                            }}></Table>
                    </Spin>
                </Modal>
                <Modal footer={null} title='选择课程' visible={this.state.coursePanel} onCancel={() => { this.setState({ coursePanel: false }) }} onOk={() => { this.setState({ coursePanel: false }) }}>
                    <Spin spinning={this.state.course_loading}>
                        <div className='d_flex'>
                            <Select value={this.state.c_ctype} className='m_2' onChange={(val) => {
                                this.setState({ c_ctype: val }, this.getCourse)
                            }} className='m_2'>
                                <Select.Option value={0}>视频课</Select.Option>
                                <Select.Option value={1}>音频课</Select.Option>
                                <Select.Option value={2}>直播课</Select.Option>
                                <Select.Option value={3}>图文课</Select.Option>
                            </Select>
                            <Input.Search value={this.state.c_keyword} className='m_2' onChange={(e) => {
                                this.setState({ c_page: 0, c_keyword: e.target.value }, this.getCourse)
                            }}></Input.Search>
                        </div>
                        <Table
                            size='small'
                            rowKey='courseId'
                            columns={[
                                { dataIndex: 'courseId', title: 'ID', key: 'courseId', width: 68 },
                                { dataIndex: 'courseName', title: '课程名', key: 'courseName', ellipsis: true },
                                {
                                    title: '操作', render: (item, ele) => {
                                        return <a onClick={() => {
                                            this.setState({
                                                coursePanel: false,
                                                contentItem: [{
                                                    contentId: ele.courseId,
                                                    contentName: ele.courseName
                                                }]
                                            })
                                        }}>选择</a>
                                    }
                                }
                            ]}
                            dataSource={this.state.course_list}
                            pagination={{
                                pageSize: 10,
                                current: this.state.c_page + 1,
                                total: this.state.c_total,
                                showQuickJumper: true,
                                onChange: (val) => {
                                    this.setState({ c_page: val - 1 }, this.getCourse)
                                },
                                showTotal: (total) => '总共' + total + '条'
                            }}></Table>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = CouponEdit;
const mapStateToProps = state => {
    return {
        goods_list: state.mall.goods_list,
        goods_cate_list: state.mall.goods_cate_list,
        goodss_cate_list: state.mall.goodss_cate_list,
        auth_cate_list: state.auth.auth_cate_list,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });