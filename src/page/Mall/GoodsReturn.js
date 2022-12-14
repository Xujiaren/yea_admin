import React, { Component } from 'react';
import { Row, Col, Table as RTable } from 'reactstrap';
import { Table, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio } from 'antd';
import { Link } from 'react-router-dom';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment'
import { Button, Popconfirm } from '../../components/BtnComponent'
// import TextArea from 'antd/lib/input/TextArea';

const { TabPane } = Tabs;
const { RadioGroup } = Radio;
const { Option } = Select;
const { Search,TextArea } = Input;
const { RangePicker } = DatePicker
class GoodsReturn extends Component {
    state = {

        edit: true,
        view: true,
        visible: false,
        isView: false,
        title: '',

        tag_id: '',
        tagName: '',
        ttype: 0,
        keyword: '',
        previewImage: '',
        showImgPanel: false,
        showRefund: false,
        showOrderEdit: false,
        showOrderView: false,
        showImgPanel: false,
        showConfirm: false,
        showSetting: false,
        activeTab: '-1',

        order_sn: '',
        status: -1,
        begin_time: '',
        end_time: '',
        keyword: '',

        admin_status: 1,
        admin_reason: '',
        is_receive: 1,
        shipping_sn: '',
        shipping_name: '',

        goods_list: [],
        aTime: null,
        order_item: {
            etype: "",
            reason: '',
            shippingName: '',
            adminStatus: '',
            galleries: [],
            orderInfo: {
                shipping: {
                    shippingName: ''
                },
                province: '',
                city: '',
                district: '',
                address: '',
            }
        },
        data_list: [],
        showBack: false,
        backAddress:'',
        backPhone:'',
        backName:''

    };
    data_list = []
    page_total = 0
    page_current = 1
    page_size = 12


    componentWillMount() {
        const { actions } = this.props;
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page + 1
        }
        this.getGoodsReturn()
        this.getBack()
    }

    componentWillReceiveProps(n_props) {

        if (n_props.goods_return !== this.props.goods_return) {
            // if(n_props.goods_return.data.length == 0){
            //     message.info('??????????????????')
            // }
            console.log(n_props.goods_return)
            this.data_list = n_props.goods_return.data || []
            this.page_total = n_props.goods_return.total
            if (n_props.goods_return['page']) {
                this.page_current = n_props.goods_return.page + 1
            }

            this.setState({ data_list: this.data_list })
        }

    }
    reset = () => {
        this.setState({ admin_reason: '', admin_status: 1, shipping_name: '', shipping_sn: '', is_receive: 1, showReture: false, showReturnInfo: false, showExchange: false, showConfirm: false })
    }
    actionReturn(action) {
        const { actions } = this.props
        const { order_id, goods_id, admin_status, admin_reason, is_receive, shipping_sn, shipping_name } = this.state

        if (action == 'update') {
            //if(admin_status==2&&admin_reason == ''){ message.info('???????????????'); return }
            actions.actionGoodsReturn({
                action,
                order_id,
                goods_id,
                admin_status,
                admin_reason,
                resolved: (data) => {
                    message.success('????????????')
                    this.getGoodsReturn()
                    this.reset()
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        } else {
            if (shipping_sn == '') { message.info('?????????????????????'); return }
            actions.actionGoodsReturn({
                action,
                order_id,
                goods_id,
                shipping_name,
                shipping_sn,
                is_receive,
                resolved: (data) => {
                    message.success('????????????')
                    this.getGoodsReturn()
                    this.reset()
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        }

    }
    getBack=()=>{
        this.props.actions.getBackAddress({
            resolved:(res)=>{
                this.setState({
                    backName:res.name,
                    backPhone:res.phone,
                    backAddress:res.address
                })
            },
            rejected:(err)=>{

            }
        })
    }
    postBack=()=>{
        const{backAddress,backName,backPhone}=this.state
        if(parseInt(backPhone)){
            this.props.actions.postBackAddress({
                address:backAddress,
                phone:backPhone,
                name:backName,
                resolved:(res)=>{
                    message.success({
                        content:'????????????'
                    })
                    this.setState({
                        showBack:false
                    })
                    this.getBack()
                },
                rejected:(err)=>{
                    console.log(err)
                }
            })
        }else{
            message.info({
                content:'??????????????????????????????'
            })
        }
    }
    _onSearch = (val) => {
        this.page_current = 1
        this.setState({ keyword: val }, () => {
            this.getGoodsReturn()
        })
    }
    getGoodsReturn = () => {
        const { actions } = this.props
        const {
            order_sn,
            status,
            begin_time,
            end_time,
            keyword,
        } = this.state

        actions.getGoodsReturn({
            order_sn,
            status,
            begin_time,
            end_time,
            keyword,
            page: this.page_current - 1,
            pageSize: this.page_size,
        })
    }

    onConfirm = () => {
        this.setState({
            showConfirm: true
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            tag_id: '',
        });
    };
    showImgPanel(url) {
        this.setState({
            showImgPanel: true,
            previewImage: url
        });
    }
    hideImgPanel = () => {
        this.setState({
            showImgPanel: false
        });
    }
    disabledDate = (current) => {
        return current > moment().subtract(0, 'day')
    }
    render() {
        const {
            order_item
        } = this.state

        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const formItemLayoutPanel = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="???????????????">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>
                                        <div className='ml_10 mr_10' style={{ flexShrink: 0 }}>??????</div>&nbsp;
                                        <DatePicker.RangePicker format='YYYY-MM-DD' allowClear={true} disabledDate={this.disabledDate} value={this.state.aTime} locale={locale} onChange={(date, dateString) => {
                                            // console.log(date)
                                            this.setState({
                                                aTime: date,
                                                begin_time: dateString[0],
                                                end_time: dateString[1]
                                            })
                                        }}></DatePicker.RangePicker>&nbsp;
                                        <Search
                                            placeholder='??????????????????'
                                            onSearch={this._onSearch}
                                            style={{ maxWidth: 200 }}
                                            value={this.state.keyword}
                                            onChange={(e) => this.setState({ keyword: e.target.value })}
                                        />&nbsp;
                                        <Button onClick={() => { this.page_current = 1; this.getGoodsReturn() }}>??????</Button>
                                        <Button style={{ marginLeft: '30px' }} onClick={() => { this.setState({ showBack: true }) }}>??????????????????</Button>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                                <Tabs onChange={val => {
                                    this.setState({
                                        activeTab: val,
                                        status: val
                                    }, () => {
                                        this.getGoodsReturn()
                                    })
                                }} activeKey={this.state.activeTab}>
                                    <TabPane tab="?????????" key='-1'>

                                    </TabPane>
                                    <TabPane tab="?????????" key='1'>

                                    </TabPane>
                                </Tabs>
                                <Table rowKey='returnId' rowSelection={{ selectedRowKeys: this.state.selectedRowKeys, onChange: (value) => { this.setState({ selectedRowKeys: value }) } }} columns={this.col} dataSource={this.state.data_list} pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper: true,
                                    onChange: (val) => {
                                        this.page_current = val
                                        this.getGoodsReturn()
                                    },
                                    showTotal: (total) => '??????' + total + '???'
                                }} />
                            </div>

                        </Card>
                    </Col>
                </Row>

                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="????????????" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    width={800}
                    zIndex={90}
                    title={this.state.isView ? "??????" : "?????????"}
                    visible={this.state.showExchange}
                    okText={this.state.isView ? "??????" : "?????????"}
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showExchange: false })
                    }}
                    onOk={() => {
                        let { data_list, show_index, isView } = this.state
                        if (isView) {
                            this.setState({ showExchange: false })
                        } else {
                            data_list[show_index].hideBtn = true
                            data_list[show_index].showBtn = true

                            this.setState({ showExchange: false, data_list: data_list })
                        }

                    }}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Card type='inner' title='????????????' bodyStyle={{ padding: 0 }}>
                        <Table
                            rowKey='goodsId'
                            columns={this.goods_column}
                            dataSource={this.state.goods_list}
                            pagination={{ size: 'small' }}
                        />
                    </Card>
                    {order_item.etype == 25 ? null :
                        <Card type='inner' bodyStyle={{ padding: 10 }} className='mt_10'>
                            <Form {...formItemLayout}>
                                <Form.Item label='????????????' className='mb_0'>
                                    <Tag>{order_item.etype == 25 ? '??????' : order_item.etype == 26 ? '????????????' : order_item.etype == 27 ? '??????' : ''}</Tag>
                                </Form.Item>
                                {this.state.isView ?
                                    <>
                                        <Form.Item label='???????????????' className='mb_0'>
                                            <Tag>{order_item.isReceive == 1 ? '?????????' : '?????????'}</Tag>
                                        </Form.Item>
                                    </>
                                    : null}


                                <Form.Item label={order_item.etype == 25 ? '??????????????????' : '????????????'} className='mb_0'>
                                    <Tag>{order_item.reason}</Tag>
                                </Form.Item>
                                {order_item.etype == 25 && order_item.adminStatus > 0 ? null :
                                    <Form.Item label='????????????' className='mb_0'>
                                        <Tag>????????????: &nbsp;{this.state.shipping_name ? this.state.shipping_name : '???'}</Tag>
                                        <Tag>???????????????: &nbsp;{this.state.shipping_sn ? this.state.shipping_sn : '???'}</Tag>
                                    </Form.Item>
                                }
                                <Form.Item label='??????' className='mb_0'>
                                    <div className='flex'>
                                        {this.state.order_item.galleries.length > 0 ? this.state.order_item.galleries.map(ele => (
                                            <img onClick={() => {
                                                this.setState({
                                                    showImgPanel: true,
                                                    previewImage: ele.link
                                                })
                                            }} className="disc head-example-img m_2" src={ele.link} />
                                        )) : '??????'}
                                    </div>
                                </Form.Item>
                                {/*
                        {this.state.isView||order_item.adminStatus>0?
                        <Form.Item label='??????' className='mb_0'>
                            <Tag>{order_item.adminStatus==1?"?????????":order_item.adminStatus==2?"?????????":""}</Tag>
                        </Form.Item>
                        :
                        <Form.Item label='??????' className='mb_0'>
                            <Radio.Group value={this.state.admin_status} onChange={(e)=>{
                                this.setState({admin_status:e.target.value})
                            }}>
                                <Radio value={1}>??????</Radio>
                                <Radio value={2}>??????</Radio>
                            </Radio.Group>
                            {this.state.admin_status == 2?
                            <Input.TextArea placeholder='??????????????????' value={this.state.admin_reason} autoSize={{minRows:4}} onChange={e=>{
                                this.setState({ admin_reason:e.target.value })
                            }}>
                            </Input.TextArea>
                            :null}
                        </Form.Item>
                        */}
                            </Form>
                        </Card>
                    }
                </Modal>
                <Modal
                    zIndex={90}
                    title={'????????????' + this.state.etype}
                    visible={this.state.showReture}
                    okText="??????"
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showReture: false })
                    }}
                    onOk={this.actionReturn.bind(this, '')}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label={'????????????' + this.state.etype} className='mb_0'>
                            <Radio.Group value={this.state.is_receive} onChange={val => { this.setState({ is_receive: val.target.value }) }}>
                                <Radio value={1}>???</Radio>
                                <Radio value={0}>???</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='??????' className='mb_0'>
                            <Input.TextArea autoSize={{ minRows: 3 }} placeholder='????????????????????????'
                                value={this.state.shipping_sn}
                                onChange={e => this.setState({ shipping_sn: e.target.value })}
                            ></Input.TextArea>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title='??????????????????'
                    visible={this.state.showBack}
                    okText="??????"
                    cancelText="??????"
                    onCancel={() => {
                        this.setState({ showBack: false })
                    }}
                    onOk={this.postBack}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='??????' className='mb_0'>
                            <Input style={{width:'160px'}} value={this.state.backName} onChange={(e)=>{
                                this.setState({
                                    backName:e.target.value
                                })
                            }}></Input>
                        </Form.Item>
                        <Form.Item label='????????????' className='mb_0'>
                        <Input style={{width:'160px'}} value={this.state.backPhone} onChange={(e)=>{
                                this.setState({
                                    backPhone:e.target.value
                                })
                            }}></Input>
                        </Form.Item>
                        <Form.Item label='??????' className='mb_0'>
                            <Input.TextArea
                                className="m_w400"
                                autoSize={{ minRows: 1 }}
                                value={this.state.backAddress}
                                onChange={e => this.setState({ backAddress: e.target.value })}
                            ></Input.TextArea>
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        )
    }
    goods_column = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId', width: 100 },
        {
            title: '????????????', dataIndex: 'goodsImg', key: 'goodsImg', render: (item, ele) => {
                return <img src={ele.goodsImg} onClick={() => { this.setState({ showImgPanel: true, previewImage: ele.goodsImg }) }} className='disc head-example-img'></img>
            }
        },
        { title: '????????????', dataIndex: 'goodsName', key: 'goodsName', ellipsis: true },
        { title: '??????', dataIndex: 'goodsAttr', key: 'goodsAttr', ellipsis: true, render: () => this.state.order_item.goodsAttr },
        { title: '??????', dataIndex: 'goodsSn', key: 'goodsSn', ellipsis: true },
        { title: '??????', dataIndex: 'goodsIntegral', key: 'goodsIntegral', ellipsis: true },
        { title: '??????', dataIndex: 'goodsNum', key: 'goodsNum', ellipsis: true, render: () => this.state.order_item.goodsNum },
    ]
    col = [
        { title: 'ID', dataIndex: 'returnId', key: 'returnId' },
        { title: '?????????', dataIndex: 'orderSn', key: 'orderSn' },
        { title: '????????????', dataIndex: 'goodsName', width: 250, key: 'goodsName' },
        // { title: '??????', dataIndex: 'categoryName', key: 'categoryName',render:(item,ele)=>{
        //     return ele.category[0].categoryName+'/'+ele.ccategory[0].categoryName
        // }},
        { title: '??????', dataIndex: 'goodsNum', key: 'goodsNum' },
        { title: '???????????????', dataIndex: 'etype', key: 'etype', render: (item, ele) => ele.etype == 25 ? '??????' : ele.etype == 26 ? '????????????' : ele.etype == 27 ? '??????' : '' },
        { title: '??????', dataIndex: 'reason', key: 'reason' },
        {
            title: '???????????????', dataIndex: 'goods', key: 'goods1', render: (item, ele) => {
                return ele.etype == 27 ? '' : ele.goods.goodsIntegral
            }
        },
        { title: '????????????', dataIndex: 'pubTime', key: 'pubTime', render: (item, ele) => moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm') },
        {
            width: '250px',
            title: '??????',
            render: (item, ele, index) => {
                // console.log(index)
                if (this.state.status == -1)
                    return <div>
                        {ele['hideBtn'] == true || ele.shippingSn == '' ? null :
                            <Button value='goodsReturn/edit' onClick={() => {
                                this.setState({
                                    isView: false,
                                    showExchange: true,
                                    goods_list: [ele.goods],
                                    goods_id: ele.goods.goodsId,
                                    order_id: ele.orderId,
                                    return_id: ele.return_id,
                                    show_index: index,
                                    order_item: ele,
                                    etype: ele.etype == 27 ? '??????' : '??????',
                                    shipping_name: ele.shippingName,
                                    shipping_sn: ele.shippingSn
                                })
                            }} type="primary" size={'small'} className='m_2'>?????????</Button>
                        }
                        {ele['showBtn'] == true && ele.shippingSn !== '' ?
                            <Button value='goodsReturn/edit' onClick={() => {
                                this.setState({
                                    isView: false,
                                    showReture: true,
                                    goods_id: ele.goods.goodsId,
                                    order_id: ele.orderId,
                                    etype: ele.etype == 27 ? '??????' : '??????',
                                    shipping_name: '',
                                    shipping_sn: ''
                                })
                            }} type="primary" size={'small'} className='m_2'>{ele.etype == 27 ? '??????????????????' : '??????????????????'}</Button>
                            : null}
                    </div>
                else
                    return <Button value='goodsReturn/view' onClick={() => {
                        this.setState({
                            isView: true,
                            showExchange: true,
                            goods_list: [ele.goods],
                            goods_id: ele.goods.goodsId,
                            order_id: ele.orderId,
                            order_item: ele,
                            shipping_name: ele.shippingName,
                            shipping_sn: ele.shippingSn
                        })
                    }} type="primary" size={'small'} className='m_2'>??????</Button>

            }
        }
    ]
}
const LayoutComponent = GoodsReturn;
const mapStateToProps = state => {
    return {
        goods_return: state.mall.goods_return,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
