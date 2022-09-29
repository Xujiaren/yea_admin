import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { List, Avatar, Spin, Icon, Table, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio } from 'antd';
import connectComponent from '../../util/connect';
import { getSearch } from '../../util/tool';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment'
import { Button, Popconfirm } from '../../components/BtnComponent'

const { TabPane } = Tabs;
const { RadioGroup } = Radio;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker
class OrderManager extends Component {
    state = {

        edit: true,
        view: true,
        visible: false,
        isView: false,
        title: '',

        status: 0,
        tag_id: '',
        tagName: '',
        ttype: 0,
        keyword: '',
        previewImage: '',
        showImgPanel: false,
        showRefund: false,
        showOrderEdit: false,
        showOrderView: false,
        showPost: false,
        showPostView: false,

        activeTab: '',

        order_id: 0,
        keyword: '',
        begin_time: '',
        end_time: '',
        aTime: null,
        status: '',
        selectedRowKeys: [],

        shipping_id: 1,
        shipping_sn: '',
        goods_list: [],

        pay_status: '',
        order_status: '',
        order_total: '',
        order_pay_price: '',
        order_location: '',
        order_mobile: '',
        order_username: '',
        post_name: '',
        post_sn: '',
        ttyp: '金币',
        showExcel: false,
        url: '',
        orderDiscounts:[],
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
        admin_status: 1,
        admin_reason: '',
        linkList: [],
        downPanel: false,
        orderSn: '',
        goodsIntegral: 0,
        goodsAmount: 0,
        integralAmount: 0,
        orderAmount: 0,
    };
    express_list = [
        { shippingId: 1, shippingName: 'EMS物流' }
    ]
    goods_order_list = []
    page_total = 0
    page_current = 0
    page_size = 10

    _onSearch = (val) => {
        this.page_current = 1
        this.setState({ keyword: val }, () => {
            this.getGoodsOrder()
        })
    }
    componentWillMount() {
        const { search } = this.props.history.location

        let tab = getSearch(search.substring(1), 'tab')
        console.log(tab)
        if (tab !== '') {
            this.setState({ activeTab: tab, status: tab }, () => {
                this.getGoodsOrder()
            })
        } else {
            this.getGoodsOrder()
        }

        this.getExpress()
    }
    componentWillReceiveProps(n_props) {

        if (n_props.express_list !== this.props.express_list) {
            // if(Array.isArray(n_props.express_list)){
            //     this.express_list = n_props.express_list
            // }
        }
        if (n_props.goods_order_list !== this.props.goods_order_list) {
            if (Array.isArray(n_props.goods_order_list.data)) {
                if (n_props.goods_order_list.data.length == 0) {
                    message.info('暂时没有数据')
                }
                this.goods_order_list = n_props.goods_order_list.data
                this.page_total = n_props.goods_order_list.total
                this.page_current = n_props.goods_order_list.page
                this.setState({ loading: false })
            }
        }

    }
    getExpress = () => {
        // const {actions} = this.props
        // const {keyword} = this.state
        // actions.getExpress({
        //     keyword
        // })
    }

    getGoodsOrder = () => {
        this.setState({ loading: true })
        const {
            keyword,
            begin_time,
            end_time,
            status,
        } = this.state
        const { actions } = this.props
        actions.getGoodsOrder({
            order_id: '',
            page: this.page_current,
            pageSize: this.page_size,
            keyword,
            begin_time,
            end_time,
            status
        })
    }
    showModal(txt, index) {
        let is_view = false
        if (index !== 'add') {
            if (txt == "查看") {
                is_view = true
            }
            const tag_item = this.tag_list[index]

            this.setState({
                title: txt,
                isView: is_view,
                visible: true,
                status: tag_item.status,
                tag_id: tag_item.tagId,
                tagName: '健康大调查',
                ttype: tag_item.ttype
            })
        } else {
            this.setState({
                title: txt,
                isView: false,
                visible: true,

                status: 0,
                tag_id: '',
                tagName: '',
                ttype: 0
            })
        }
    };
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
    exportGoodsOrder(action) {
        const { selectedRowKeys } = this.state
        const { actions } = this.props
        if (selectedRowKeys.length == 0) { message.info('请选择订单'); return }

        actions.exportGoodsOrder({
            action,
            order_ids: selectedRowKeys.join(','),
            resolved: (data) => {
                const { fileName, adress, name } = data
                let url = fileName || adress || name || ''

                if (action == 'send_order') {
                    this.setState({ showExcel: true, url: 'https://view.officeapps.live.com/op/view.aspx?src=' + url })
                } else if (action == 'in_order') {
                    message.success({
                        content: '成功',
                        onClose: () => {
                            if (Array.isArray(url))
                                this.setState({ downPanel: true, linkList: url })
                        }
                    })
                } else {
                    message.success({
                        content: '成功',
                        onClose: () => {
                            window.open(url, '_black')
                        }
                    })
                }
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    showReturn(item) {
        if (item instanceof Array) {
            let str = ''
            let name = ''
            let reason = ''
            item.map(ele => {
                if (ele.shippingSn !== '' || ele.shippingSn) {
                    str += (' ' + ele.shippingSn)
                    name += (' ' + ele.shippingName)
                    reason += (' ' + ele.reason)
                }

            })
            if (str)
                Modal.confirm({
                    title: '物流公司：' + name,
                    content: <span>
                        <div>{' 原因：' + reason}</div>
                        <div>{' 物流单号：' + str}</div>
                    </span>
                })
            else
                message.info('未收到退换货物流单号')
        } else {
            message.info('未收到退换货物流单号')
        }
    }
    onAction(order_id, action) {

        console.log(order_id)
        const { actions } = this.props
        let payload = {}


        if (action == 'post') {
            const { shipping_sn, shipping_id } = this.state

            if (shipping_sn == '') { message.info('请输入物流单号'); return; }

            payload = {
                order_ids: order_id,
                action,
                shipping_sn,
                shipping_id,
                resolved: () => {
                    message.success('提交成功')
                    this.setState({ shipping_sn: '', showPost: false })
                    this.getGoodsOrder()
                }
            }
        } else if (action == 'refuned' || action == 'return') {
            const { admin_status, admin_reason } = this.state
            if (admin_status == 2 && admin_reason == '') { message.info('请输入原因'); return; }
            payload = {
                order_ids: order_id,
                action,
                admin_status,
                admin_reason,
                resolved: () => {
                    message.success('提交成功')
                    this.setState({ admin_status: 1, admin_reason: '', showExchange: false })
                    this.getGoodsOrder()
                }
            }
        } else {
            payload = {
                order_ids: order_id,
                action,
                resolved: () => {
                    message.success('提交成功')
                    this.getGoodsOrder()
                }
            }
        }
        actions.actionGoodsOrder(payload)

    }

    render() {
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
        const { order_item } = this.state
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="订单管理">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>
                                        <div className='ml_10 mr_10' style={{ flexShrink: 0 }}>筛选</div>&nbsp;
                                        {/* {this.state.activeTab==''?
                                    <Select value={this.state.status} style={{minWidth:200}} onChange={val=>this.setState({ status:val })}>
                                        <Select.Option value={''}>全部订单</Select.Option>
                                        <Select.Option value={0}>待发货订单</Select.Option>
                                        <Select.Option value={1}>已发货订单</Select.Option>
                                        <Select.Option value={2}>待退款订单</Select.Option>
                                        <Select.Option value={3}>已退款订单</Select.Option>
                                        <Select.Option value={4}>已完成订单</Select.Option>
                                        <Select.Option value={5}>已关闭订单</Select.Option>
                                    </Select>:null}&nbsp; */}
                                        <DatePicker.RangePicker format='YYYY-MM-DD' allowClear={true} disabledDate={this.disabledDate} value={this.state.aTime} locale={locale} onChange={(date, dateString) => {

                                            this.setState({
                                                aTime: date,
                                                begin_time: dateString[0],
                                                end_time: dateString[1]
                                            })
                                        }} />
                                        <Search
                                            placeholder='订单号／手机号'
                                            onSearch={this._onSearch}
                                            style={{ maxWidth: 200 }}
                                            value={this.state.keyword}
                                            onChange={(e) => this.setState({ keyword: e.target.value })}
                                        />&nbsp;
                                        <Button onClick={() => { this.page_current = 0; this.getGoodsOrder() }}>搜索</Button>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                                <Tabs onChange={val => {
                                    this.setState({
                                        activeTab: val,
                                        status: val
                                    }, () => {
                                        this.page_current = 0
                                        this.getGoodsOrder()
                                    })
                                }} activeKey={this.state.activeTab}>
                                    <TabPane tab="全部订单" key={''}>
                                    </TabPane>
                                    {/*
                                <TabPane tab="待付款订单" key='2'>
                                </TabPane>
                                <TabPane tab="已付款订单" key='3'>
                                </TabPane>*/}
                                    <TabPane tab="待发货" key={0}>
                                    </TabPane>
                                    <TabPane tab="已发货" key={1}>
                                    </TabPane>
                                    <TabPane tab="待退款" key={2}>
                                    </TabPane>
                                    <TabPane tab="已退款" key={3}>
                                    </TabPane>
                                    <TabPane tab="已完成" key={4}>
                                    </TabPane>
                                    <TabPane tab="已关闭" key={5}>
                                    </TabPane>

                                    <TabPane tab="待换货" key={6}>
                                    </TabPane>
                                    <TabPane tab="已换货" key={7}>
                                    </TabPane>
                                    <TabPane tab="待退货退款" key={8}>
                                    </TabPane>
                                    <TabPane tab="已退货退款" key={9}>
                                    </TabPane>
                                </Tabs>
                                <div className="pad_b10">
                                    {/*<Button onClick={null} type="" size={'small'}>发货</Button>&nbsp;*/}
                                    <Button value='order/down' onClick={this.exportGoodsOrder.bind(this, 'in_order')} type="" size={'small'}>下载配货单</Button>&nbsp;
                                    <Button value='order/print' onClick={this.exportGoodsOrder.bind(this, 'send_order')} type="" size={'small'}>打印发货单</Button>&nbsp;
                                    <Button value='order/out' onClick={this.exportGoodsOrder.bind(this, 'order')} type="" size={'small'}>导出订单</Button>
                                </div>
                                <Table loading={this.state.loading} rowKey='orderId' rowSelection={{ selectedRowKeys: this.state.selectedRowKeys, onChange: (value) => { this.setState({ selectedRowKeys: value }) } }} columns={this.col} dataSource={this.goods_order_list} pagination={{
                                    current: this.page_current + 1,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper: true,
                                    onChange: (val) => {
                                        this.page_current = val - 1
                                        this.getGoodsOrder()
                                    },
                                    showTotal: (total) => '总共' + total + '条'
                                }}></Table>
                            </div>

                        </Card>
                    </Col>
                </Row>

                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => { this.setState({ showImgPanel: false }) }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={90}
                    width={800}
                    title='查看订单'
                    visible={this.state.showOrderView}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showOrderView: false })
                    }}
                    onOk={() => {
                        this.setState({ showOrderView: false })
                    }}
                    bodyStyle={{ padding: "15px", paddingTop: '15px' }}
                >
                    <Card type='inner' title='商品清单' bodyStyle={{ padding: 0 }}>
                        <Table
                            size='small'
                            rowKey='goodsId'
                            columns={this.goods_column}
                            dataSource={this.state.goods_list}
                            pagination={{ size: 'small' }}
                        />
                    </Card>
                    <Card type='inner' className='mt_10' >
                        <Form {...formItemLayoutPanel}>
                            <Form.Item label='订单号' className='mb_0'>
                                {this.state.orderSn}
                            </Form.Item>
                            <Form.Item label='支付状态' className='mb_0'>
                                {this.state.pay_status}
                            </Form.Item>
                            <Form.Item label='订单状态' className='mb_0'>
                                {this.state.order_status}
                            </Form.Item>
                            <Form.Item label='订单总额' className='mb_0'>
                                {this.state.order_total}
                            </Form.Item>
                            <Form.Item label='参与活动' className='mb_0'>
                                {this.state.orderDiscounts.length>0?this.state.orderDiscounts[0].contentName:'无'}
                            </Form.Item>
                            <Form.Item label='优惠金额' className='mb_0'>
                                {this.state.orderDiscounts.length>0?this.state.orderDiscounts[0].amount:'0'}
                            </Form.Item>
                            {/*
                            <Form.Item label='优惠' className='mb_0'>
                                -¥590.00 （每满1000减100）
                            </Form.Item>
                            */}
                            <Form.Item label='应付金额' className='mb_0'>
                                {this.state.order_pay_price}
                            </Form.Item>
                            <Form.Item label='支付方式' className='mb_0'>
                                {this.state.ttyp}
                            </Form.Item>
                            <Form.Item label='用户姓名' className='mb_0'>
                                {this.state.order_username}
                            </Form.Item>
                            <Form.Item label='用户电话' className='mb_0'>
                                {this.state.order_mobile}
                            </Form.Item>
                            <Form.Item label='收货地址' className='mb_0'>
                                {this.state.order_location}
                            </Form.Item>
                        </Form>
                    </Card>
                    {/*
                    <Card type='inner' title='发票信息' className='mt_10' >
                        <Form {...formItemLayoutPanel}>
                            <Form.Item label='发票抬头' className='mb_0'>
                                发票抬头*******
                            </Form.Item>
                            <Form.Item label='发票税号' className='mb_0'>
                                发票税号*********
                            </Form.Item>
                            <Form.Item label='地址' className='mb_0'>
                                李文，1399333423，北京市
                            </Form.Item>
                        </Form>
                    </Card>
                    */}
                </Modal>

                <Modal
                    zIndex={90}
                    width={800}
                    title='退款申请'
                    visible={this.state.showRefund}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showRefund: false })
                    }}
                    bodyStyle={{ padding: "25px", paddingTop: '25px' }}
                    footer={<div>
                        <Button>不同意</Button>
                        <Button type='primary'>同意</Button>
                    </div>}
                >
                    <Card type='inner' title='商品清单' bodyStyle={{ padding: 0 }}>

                    </Card>
                    <Card type='inner' className='mt_10' >
                        <Form {...formItemLayoutPanel}>
                            <Form.Item label='商品金额' className='mb_0'>
                                ¥5998.00
                            </Form.Item>
                            <Form.Item label='优惠' className='mb_0'>
                                满500减50
                            </Form.Item>
                            <Form.Item label='邮费' className='mb_0'>
                                ¥30
                            </Form.Item>
                            <Form.Item label='支付金额' className='mb_0'>
                                ¥5998.00
                            </Form.Item>
                            <Form.Item label='退款金额' className='mb_0'>
                                ¥5998.00
                            </Form.Item>
                            <Form.Item label='退款类型' className='mb_0'>
                                <Radio.Group>
                                    <Radio value={0}>商品金额+邮费</Radio>
                                    <Radio value={1}>商品金额</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </Card>
                </Modal>
                <Modal
                    width={800}
                    zIndex={90}
                    title={this.state.isView ? "查看" : "申请售后"}
                    visible={this.state.showExchange}
                    okText={this.state.isView ? "确定" : "提交"}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showExchange: false })
                    }}
                    onOk={
                        this.state.isView ?
                            () => { this.setState({ showExchange: false }) } :
                            this.state.action == 'return' ?
                                this.onAction.bind(this, this.state.order_id, 'return') :
                                this.onAction.bind(this, this.state.order_id, 'refuned')
                    }
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Card type='inner' title='商品清单' bodyStyle={{ padding: 0 }}>
                        <Table
                            size='small'
                            rowKey='goodsId'
                            columns={this.goods_column}
                            dataSource={this.state.goods_list}
                            pagination={{ size: 'small' }}
                        />
                    </Card>
                    <Card type='inner' bodyStyle={{ padding: 10 }} className='mt_10'>
                        <Form {...formItemLayoutPanel}>
                            <Form.Item label='商品金额' className='mb_0'>
                                {
                                    this.state.goodsIntegral > 0 ?
                                        <Tag>{this.state.goodsIntegral}金币</Tag>
                                        : null
                                }
                                {
                                    this.state.goodsAmount > 0 ?
                                        <Tag>¥{this.state.goodsAmount}</Tag>
                                        : null
                                }
                            </Form.Item>
                            <Form.Item label='支付金额' className='mb_0'>
                                {
                                    this.state.integralAmount > 0 ?
                                        <Tag>{this.state.integralAmount}金币</Tag>
                                        : null
                                }
                                {
                                    this.state.orderAmount > 0 ?
                                        <Tag>¥{this.state.orderAmount}</Tag>
                                        : null
                                }
                            </Form.Item>
                            <Form.Item label='退款金额' className='mb_0'>
                                {
                                    this.state.integralAmount > 0 ?
                                        <Tag>{this.state.integralAmount}金币</Tag>
                                        : null
                                }
                                {
                                    this.state.orderAmount > 0 ?
                                        <Tag>¥{this.state.orderAmount}</Tag>
                                        : null
                                }
                            </Form.Item>

                            <Form.Item label='售后类型' className='mb_0'>
                                <Tag>{order_item.etype == 25 ? '退款' : order_item.etype == 26 ? '退货退款' : order_item.etype == 27 ? '换货' : ''}</Tag>
                            </Form.Item>


                            <Form.Item label={order_item.etype == 25 ? '退款原因描述' : '换货备注'} className='mb_0'>
                                <Tag>{order_item.reason}</Tag>
                            </Form.Item>
                            {/*
                        {order_item.etype==25&&order_item.adminStatus>0?null:
                        <Form.Item label='物流信息' className='mb_0'>
                            <Tag>物流快递: &nbsp;{this.state.shipping_name?this.state.shipping_name:'空'}</Tag>
                            <Tag>物流快递号: &nbsp;{this.state.shipping_sn?this.state.shipping_sn:'空'}</Tag>
                        </Form.Item>
                        }*/}
                            <Form.Item label='凭证' className='mb_0'>
                                <div className='flex'>
                                    {
                                        Array.isArray(this.state.order_item.galleries) && this.state.order_item.galleries.length > 0 ?
                                            this.state.order_item.galleries.map(ele => (
                                                <img onClick={() => {
                                                    this.setState({
                                                        showImgPanel: true,
                                                        previewImage: ele.link
                                                    })
                                                }} className="disc head-example-img m_2" src={ele.link} />
                                            )) :
                                            <Tag className='mt_10'>暂无凭证</Tag>
                                    }
                                </div>
                            </Form.Item>
                            {/*
                        <Form.Item label='退款类型' className='mb_0'>
                            <Radio.Group>
                                <Radio value={0}>商品金额+邮费</Radio>
                                <Radio value={1}>商品金额</Radio>
                            </Radio.Group>
                        </Form.Item>
                        */}
                            {this.state.isView || order_item.adminStatus > 0 ?
                                <Form.Item label='审核' className='mb_0'>
                                    <Tag>{order_item.adminStatus == 1 ? "已同意" : order_item.adminStatus == 2 ? "已拒绝" : ""}</Tag>
                                </Form.Item>
                                :
                                <Form.Item label='审核' className='mb_0'>
                                    <Radio.Group value={this.state.admin_status} onChange={(e) => {
                                        this.setState({ admin_status: e.target.value })
                                    }}>
                                        <Radio value={1}>同意</Radio>
                                        <Radio value={2}>拒绝</Radio>
                                    </Radio.Group>
                                    {this.state.admin_status == 2 ?
                                        <Input.TextArea placeholder='输入拒绝原因' value={this.state.admin_reason} autoSize={{ minRows: 4 }} onChange={e => {
                                            this.setState({ admin_reason: e.target.value })
                                        }}>
                                        </Input.TextArea>
                                        : null}
                                </Form.Item>
                            }
                        </Form>
                    </Card>
                </Modal>
                <Modal
                    zIndex={90}
                    title="填写物流信息"
                    visible={this.state.showPost}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showPost: false })
                    }}
                    onOk={this.onAction.bind(this, this.order_id, 'post')}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='选择物流公司'>
                            <Select value={this.state.shipping_id} onChange={(val) => {
                                this.setState({ shipping_id: val })
                            }}>
                                {this.express_list.map(ele => (
                                    <Select.Option key={ele.shippingId + '_ship'} value={ele.shippingId}>{ele.shippingName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label='物流单号'>
                            <Input
                                onChange={(e) => {
                                    this.setState({ shipping_sn: e.target.value })
                                }}
                                placeholder='请输入单号'
                                value={this.state.shipping_sn}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal zIndex={99} visible={this.state.downPanel} maskClosable={true} footer={null} onCancel={() => this.setState({ downPanel: false })}>
                    <div style={{ padding: '40px' }}>
                        <List
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                        >
                            {this.state.linkList.map((ele, index) => (
                                <List.Item
                                    actions={[<a key="list-loadmore-edit" href={ele} target='_black'>下载</a>]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar size="small">{index + 1}</Avatar>
                                        }
                                        description={ele}
                                    />
                                </List.Item>
                            ))}
                        </List>
                    </div>
                </Modal>
                <Modal
                    title="查看物流信息"
                    visible={this.state.showPostView}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showPostView: false })
                    }}
                    onOk={() => {
                        this.setState({ showPostView: false })
                    }}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='物流公司' className="mb_0">
                            <Tag>{this.state.post_name}</Tag>
                        </Form.Item>
                        <Form.Item label='物流单号' className="mb_0">
                            <Tag>{this.state.post_sn}</Tag>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal closable={true} maskClosable={true} visible={this.state.showExcel} footer={null} width={888} onCancel={() => { this.setState({ showExcel: false }) }}>
                    <Card type='inner' className="mt_10" bodyStyle={{ padding: 0 }}>
                        {this.state.url == '' ? <Spin className='block_center pad_20' indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /> :
                            <iframe name={Date.now()} src={this.state.url} frameBorder='0' key={this.state.url} width='100%' height='610px'></iframe>
                        }
                    </Card>
                    <span style={{ color: "red" }}>* 如需打印请点击左上角【文件】并选择【打印】</span>
                </Modal>
            </div>
        )
    }
    goods_column = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId', width: 100 },
        {
            title: '商品图片', dataIndex: 'goodsImg', key: 'goodsImg', render: (item, ele) => {
                return <img src={ele.goodsImg} onClick={() => { this.setState({ showImgPanel: true, previewImage: ele.goodsImg }) }} className='disc head-example-img'></img>
            }
        },
        { title: '商品名称', dataIndex: 'goodsName', key: 'goodsName', ellipsis: true },
        { title: '属性', dataIndex: 'goodsAttr', key: 'goodsAttr', ellipsis: true },
        { title: '货号', dataIndex: 'goodsSn', key: 'goodsSn', ellipsis: true },
        {
            title: '价格', dataIndex: '', key: '', ellipsis: true, render: (item, ele) => {
                if (ele.goodsIntegral && !ele.goodsAmount)
                    return ele.goodsIntegral + '金币'
                else if (ele.goodsAmount && !ele.goodsIntegral)
                    return '¥' + ele.goodsAmount
                else if (ele.goodsAmount && ele.goodsIntegral) {
                    return '¥' + ele.goodsAmount + '+' + ele.goodsIntegral + '金币'
                }
            }
        },
        { title: '数量', dataIndex: 'goodsNum', key: 'goodsNum', ellipsis: true },
    ]

    col = [
        { title: 'ID', dataIndex: 'orderId', key: 'orderId' },
        { title: '订单号', dataIndex: 'orderSn', key: 'orderSn' },
        { title: '用户姓名', dataIndex: 'realname', key: 'realname', },
        {
            title: '商品图片', dataIndex: 'orderGoods', key: 'orderGoods1', render: (item, ele) => {
                if (ele.orderGoods.length == 0) {
                    return null
                }
                let goods = ele.orderGoods[0]
                return <img src={goods.goodsImg} onClick={() => { this.setState({ showImgPanel: true, previewImage: goods.goodsImg }) }} className='disc head-example-img'></img>
            }
        },
        { title: '商品名称', dataIndex: 'orderGoods', key: 'orderGoods2', render: (item, ele) => ele.orderGoods[0] && ele.orderGoods[0].goodsName },
        //{ title: '总价', dataIndex: 'cost', key: 'cost' },
        { title: '数量', dataIndex: 'orderGoods', key: 'orderGoods3', render: (item, ele) => ele.orderGoods[0] && ele.orderGoods[0].goodsNum },
        {
            title: '支付金额', dataIndex: '', key: '', render: (item, ele) => {
                if (ele.otype == 3) {
                    return <div>{ele.integralAmount}金币</div>
                } else if (ele.otype == 2) {
                    return <div>¥{ele.orderAmount}</div>
                }
            }
        },
        { title: '快递地址', dataIndex: 'district', key: 'district', render: (item, ele) => ele.province + ele.city + ele.district + ele.street + ele.address },
        { title: '下单时间', dataIndex: 'payTime', key: 'payTime', render: (item, ele) => moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm') },
        /**
         * orderStatus 
         * 
         * order_normal 0
         * order_cancel 1
         * order_refund 2 
         * order_return 3
         * 
         * 
         * shippingStatus
         * ship_no 0
         * ship_yes 1
         * ship_recieve 2
         */
        { title: '支付状态', dataIndex: 'payStatus', key: 'payStatus', render: (item, ele) => ele.payStatus == 1 ? '已支付' : '未支付' },
        {
            title: '退换状态', dataIndex: 'returnStatusIntro', key: 'returnStatusIntro', render: (item, ele) => {
                return ele.orderStatus == 2 ? '' : ele.returnStatusIntro
            }
        },
        {
            title: '订单状态', dataIndex: 'orderStatus', key: 'orderStatus',
            render: (item, ele) =>
                ele.orderStatus == 0 ?
                    (ele.shippingStatus == 1 ? '已发货' : ele.shippingStatus == 2 ? '已完成' : '订单正常') :
                    ele.orderStatus == 1 ? '订单取消' :
                        ele.orderStatus == 2 ? '退款' :
                            ele.orderStatus == 3 ? '退款退货' :
                                ele.orderStatus == 4 ? '换货' : ''
        },
        {
            width: '250px',
            title: '操作',
            render: (item, ele, index) => {
                let button = null
                if (ele.orderStatus > 1) {
                    if (ele.orderReturns.length > 0) {
                        let orderReturn = ele.orderReturns[0]

                        if ((ele.orderStatus == 2 && orderReturn.adminStatus > 0) || (ele.orderStatus == 3 && orderReturn.isReceive == 1))
                            button = (<Button value='order/edit' type="primary" size={'small'} disabled={orderReturn.status == 1 ? true : false} className='m_2' onClick={() => {
                                this.setState({
                                    action: 'return',
                                    isView: false,
                                    showExchange: true,
                                    goods_list: ele.orderGoods,
                                    order_id: ele.orderId,
                                    order_item: orderReturn,
                                    integralAmount: ele.integralAmount,
                                    goodsIntegral: ele.orderGoods[0] ? ele.orderGoods[0].goodsIntegral : 0,
                                    goodsAmount: ele.goodsAmount,
                                    orderAmount: ele.orderAmount
                                })
                            }}>{orderReturn.status == 1 ? '售后完成' : '确认退款'}</Button>)
                        else
                            button = (<Button value='order/edit' disabled={ele.orderReturns[0].adminStatus > 0 || (orderReturn.isReceive == 1 && ele.orderStatus == 4)} type="primary" size={'small'} className='m_2' onClick={() => {
                                let action = 'refuned'

                                this.setState({
                                    action: action,
                                    isView: false,
                                    showExchange: true,
                                    goods_list: ele.orderGoods,
                                    order_id: ele.orderId,
                                    order_item: orderReturn,
                                    integralAmount: ele.integralAmount,
                                    goodsIntegral: ele.orderGoods[0] ? ele.orderGoods[0].goodsIntegral : 0,
                                    goodsAmount: ele.goodsAmount,
                                    orderAmount: ele.orderAmount
                                })
                            }}>{orderReturn.isReceive == 1 && ele.orderStatus == 4 ? '售后完成' : '申请售后'}</Button>)
                    }
                }

                return <div>
                    <Button value='order/view' type="primary" size={'small'} className='m_2' onClick={() => {

                        let order_status = ele.orderStatus == 0 ?
                            (ele.shippingStatus == 1 ? '已发货' : ele.shippingStatus == 2 ? '已完成' : '订单正常') :
                            ele.orderStatus == 1 ? '订单取消' :
                                ele.orderStatus == 2 ? '退款' :
                                    ele.orderStatus == 3 ? '退款退货' :
                                        ele.orderStatus == 4 ? '换货' : ''

                        this.setState({
                            showOrderView: true,
                            goods_list: ele.orderGoods,
                            pay_status: ele.payStatus == 1 ? '已支付' : '未支付',
                            order_status: order_status,
                            order_total: ele.integralAmount,
                            order_pay_price: ele.integralAmount,
                            order_location: ele.province + ele.city + ele.district + ele.street + ele.address,
                            order_username: ele['realname'] || '',
                            order_mobile: ele['mobile'] || '',
                            orderSn: ele.orderSn,
                            orderDiscounts:ele.orderDiscounts
                        })
                        if (ele.integralAmount > 0 && ele.goodsAmount == 0) {
                            this.setState({
                                order_total: ele.integralAmount + '金币',
                                order_pay_price: ele.integralAmount + '金币',
                                ttyp: '金币'
                            })
                        } else if (ele.integralAmount == 0 && ele.goodsAmount > 0) {
                            this.setState({
                                order_total: '¥' + ele.orderAmount,
                                order_pay_price: '¥' + ele.orderAmount,
                                ttyp: '现金'
                            })
                        } else if (ele.integralAmount > 0 && ele.goodsAmount > 0) {
                            this.setState({
                                order_total: '¥' + ele.orderAmount + '+' + ele.integralAmount + '金币',
                                order_pay_price: '¥' + ele.orderAmount + '+' + ele.integralAmount + '金币',
                                ttyp: '金币+现金'
                            })
                        }
                    }}>查看订单</Button>
                    <Popconfirm
                        value='order/close'
                        disabled={ele.orderStatus == 1 ? true : false}
                        okText="确定"
                        cancelText='取消'
                        title='确定关闭订单吗？'
                        onConfirm={this.onAction.bind(this, ele.orderId, 'status')}
                    >
                        <Button disabled={ele.orderStatus == 1 ? true : false} type="primary" ghost size={'small'} className='m_2'>
                            {ele.orderStatus == 1 ? '订单取消' : '关闭订单'}
                        </Button>
                    </Popconfirm>
                    {
                        ele.payStatus == 1 && ele.shippingStatus == 0 && ele.orderStatus == 0 ?
                            <Button value='order/send' type="primary" size={'small'} className='m_2' onClick={() => {
                                this.order_id = ele.orderId
                                this.setState({ showPost: true, shipping_id: 1, shipping_sn: '' })
                            }
                            }>
                                待发货
                            </Button>
                            : ele.shipping !== null ?
                                <Button value='order/view' type="primary" size={'small'} className='m_2' onClick={() => {
                                    this.setState({ showPostView: true, post_sn: ele.shippingSn, post_name: ele.shipping.shippingName })
                                }} >
                                    查看物流编号
                                </Button>
                                : null
                    }
                    {
                        ele.orderStatus == 3 || ele.orderStatus == 4 ? <Button value='order/view' size='small' onClick={this.showReturn.bind(this, ele['orderReturns'])}>退换货物流单号</Button> : null
                    }
                    {button}
                </div>
            }
        }
    ]

}
const LayoutComponent = OrderManager;
const mapStateToProps = state => {
    return {
        express_list: state.mall.express_list,
        goods_order_list: state.mall.goods_order_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
