import React, { Component } from 'react';
import connectComponent from '../../util/connect'
import { Tabs, message, Card, Spin, DatePicker, Table, Input, InputNumber, Modal, Form, Tag } from 'antd'
import moment from 'moment'
import { Button, Popconfirm } from '../../components/BtnComponent'
import FormItem from 'antd/lib/form/FormItem';
const { TabPane } = Tabs;
class Transaction extends Component {
    state = {
        atype: -1,
        begin: '',
        end: '',
        is_done: '0',
        keyword: '',
        page: 0,
        pageSize: 10,
        status: 12,
        total: 0,
        num: 0,
        numin: 0,
        showsetting: false,
        rulePanel: false,
        text: '',
        iftext: '',
        loading: false,
        order_id: 0,
        data_list: [],
        water_number: '',
        orderSn: '',
        rulePanels: false,
        realname: '',
        mobile: '',
        address: '',
        orderGoods: [],
    };
    componentDidMount() {
        // const { search } = this.props.history.location
        // let page = 0
        // if (search.indexOf('page=') > -1) {
        //     page = search.split('=')[1] - 1
        //     this.setState({
        //         page:page
        //     })
        // }
        this.getOders()
    }
    getOders = () => {
        const { actions } = this.props
        const { status, begin, end, keyword, order_id, page, pageSize } = this.state
        actions.getGoodsOders({
            status: status,
            begin_time: begin,
            end_time: end,
            keyword: keyword,
            order_id: order_id,
            page: page,
            pageSize: pageSize,
            resolved: (res) => {
                console.log(res)
                this.setState({
                    data_list: res.data,
                    page: res.page,
                    total: res.total
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    componentWillReceiveProps(n_props) {

    }
    actionWithDrawOrder = (withdraw_id) => {
        this.props.actions.actionWithdrawOrder({
            is_done: 1,
            withdraw_id,
            resolved: (res) => {
                message.success('提交成功')
                this.getWithdrawOrder()
            },
            rejected: () => {

            }
        })
    }
    onOkey = () => {
        const { actions } = this.props
        const { order_id, water_number } = this.state
        actions.imporGoodsOrders({
            order_id: order_id,
            water_number: water_number,
            resolved: (res) => {
                message.success({
                    content: '操作成功'
                })
                this.getOders()
                this.setState({
                    rulePanel: false,
                    order_id: 0,
                    water_number: 0,
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }

    renderTitle = () => {
        return (
            <>
                <DatePicker.RangePicker format='YYYY-MM-DD' onChange={(val, dateString) => {
                    let begin = '', end = ''
                    if (Array.isArray(dateString) && dateString.length === 2) {
                        begin = dateString[0]
                        end = dateString[1]
                    }
                    console.log(dateString)
                    this.setState({ begin, end }, this.getOders)
                }}></DatePicker.RangePicker>
                <Input.Search style={{ width: 200 }} onSearch={() => {
                    this.setState({ page: 0 }, this.getOders)
                }} value={this.state.keyword} onChange={e => {
                    this.setState({ keyword: e.target.value })
                }}></Input.Search>

            </>
        )
    }
    onOpen = (val) => {
        console.log(val)
        this.setState({
            orderSn: val.orderSn,
            realname: val.realname,
            mobile: val.mobile,
            address: val.province + val.city + val.district + val.address,
            orderGoods: val.orderGoods,
            rulePanels: true
        })
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
        return (
            <div className="animated fadeIn" >
                <Spin spinning={this.state.loading}>
                    <Card title={this.renderTitle()}>
                        {/* <Tabs onChange={(is_done)=>this.setState({ is_done },this.getWithdrawOrder)} activeKey={this.state.is_done}>
					<Tabs.TabPane tab="未处理" key='12'>
					</Tabs.TabPane>
					<Tabs.TabPane tab="已处理" key='11'>
					</Tabs.TabPane>
				</Tabs> */}
                <Tabs defaultActiveKey="1" onChange={(e) => {
                    this.setState({
                        status: parseInt(e),
                        page: 0,
                        total: 0,
                    }, () => {
                        this.getOders()
                    })
                }}>
                    <TabPane tab="未确认" key="12">
                    </TabPane>
                    <TabPane tab="已确认" key="13">
                    </TabPane>
                </Tabs>
                        <Table
                            scroll={{ x: 1200 }}
                            rowKey='withdrawId'
                            // rowSelection={{
                            //     selectedRowKeys:this.state.selectedRowKeys,
                            //     onChange:(value)=>{ this.setState({ selectedRowKeys:value }) }}
                            // }
                            columns={this.col}
                            dataSource={this.state.data_list}
                            pagination={{
                                current: this.state.page + 1,
                                pageSize: this.state.pageSize,
                                total: this.state.total,
                                showQuickJumper: true,
                                onChange: (val) => {
                                    this.setState({ page: val - 1 }, this.getOders)
                                },
                                showTotal: (total) => '总共' + total + '条'
                            }}>

                        </Table>
                    </Card>
                </Spin>
                <Modal
                    zIndex={90}
                    title="提现设置"
                    visible={this.state.showsetting}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsetting: false })
                    }}
                    onOk={this.onOk}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='兑换金币比例'>
                            <InputNumber value={this.state.num} onChange={(e) => { this.setState({ num: e }) }} /><span style={{ marginLeft: '5px', fontSize: '20px' }}>%</span>
                        </Form.Item>
                        <Form.Item label='最低额度'>
                            <InputNumber value={this.state.numin} onChange={(e) => { this.setState({ numin: e }) }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'确认付款'} onOk={this.onOkey} visible={this.state.rulePanel} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
                    this.setState({ rulePanel: false, order_id: 0, water_number: 0 })
                }}>
                    <FormItem label='订单号'>
                        <Tag>{this.state.orderSn}</Tag>
                    </FormItem>
                    <FormItem label='流水号'>
                        <Input value={this.state.water_number} onChange={(e) => {
                            this.setState({
                                water_number: e.target.value
                            })
                        }} />
                    </FormItem>
                </Modal>
                <Modal title={'订单信息'} onOk={() => { this.setState({ rulePanels: false, orderSn: '', realname: '', mobile: '', address: '', orderGoods: [], order_id: 0 }) }} visible={this.state.rulePanels} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
                    this.setState({ rulePanels: false, orderSn: '', realname: '', mobile: '', address: '', orderGoods: [], order_id: 0 })
                }}>
                    <FormItem label='订单号'>
                        <Tag>{this.state.orderSn}</Tag>
                    </FormItem>
                    <FormItem>
                        <span>收件人：</span>
                        <Tag>{this.state.realname}</Tag>
                        <span style={{ marginLeft: '20px' }}>手机号：</span>
                        <Tag>{this.state.mobile}</Tag>
                        <br />
                        <span>地址：</span>
                        <Tag>{this.state.address}</Tag>
                    </FormItem>
                    <FormItem>
                        <Table
                            scroll={{ x: 500 }}
                            rowKey='withdrawId'
                            columns={this.cols}
                            dataSource={this.state.orderGoods}
                        >

                        </Table>
                    </FormItem>

                </Modal>
            </div>
        );
    }
    cols = [
        {
            title: "图片", dataIndex: "", key: '', render: (ele, index) => {
                return (
                    <div style={{ width: '60px', height: '40px' }}>
                        <img style={{ width: '100%', height: '100%' }} src={ele.goodsImg}></img>
                    </div>
                )
            }
        },
        { title: '商品名', dataIndex: 'goodsName', key: 'goodsName' },
        { title: "数量", dataIndex: "goodsNum", key: 'goodsNum' },
        { title: '单价', dataIndex: 'goodsAmount', key: 'goodsAmount' },
    ]
    col = [
        { title: "订单ID", dataIndex: "orderId", key: 'orderId' },
        { title: "订单号", dataIndex: "orderSn", key: 'orderSn' },
        {
            title: '支付方式', dataIndex: '', key: '', render: (item, ele, index) => {
                if (ele.payment == 0)
                    return '微信'
                else if (ele.payment == 1)
                    return '支付宝'
                else if (ele.payment == 9)
                    return '微信'
            }
        },
        {
            title: '商品费用', dataIndex: 'goodsAmount', key: 'goodsAmount', render: (item, ele) => {
                return '¥' + ele.goodsAmount
            }
        },
        {
            title: '运费', dataIndex: 'shippingAmount', key: 'shippingAmount', render: (item, ele) => {
                return '¥' + ele.shippingAmount
            }
        },
        {
            title: '优惠券抵扣金额', dataIndex: 'couponAmount', key: 'couponAmount', render: (item, ele) => {
                return '¥' + ele.couponAmount
            }
        },
        {
            title: '总金额', dataIndex: '', key: '', render: (item, ele) => {
                return '¥' + (ele.goodsAmount + ele.shippingAmount)
            }
        },
        {
            title: '实付', dataIndex: '', key: '', render: (item, ele) => {
                return '¥' + ele.orderAmount
            }
        },
        {
            title: '下单时间', render: (item, ele) => {
                if (ele.payTime) {
                    return moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm')
                } else {
                    return '暂无'
                }
            }
        },
        {
            title: '操作', fixed: "right", render: (item, ele) => {
                if (!ele.waterNumber)
                    return <Button size='small' type='primary' onClick={() => {
                        this.setState({
                            rulePanel: true,
                            order_id: ele.orderId,
                            orderSn: ele.orderSn
                        })
                    }}>确认支付</Button>
                else if (ele.waterNumber)
                    return (
                        <Button size='small' onClick={this.onOpen.bind(this, ele)}>查看详情</Button>
                    )
            }
        }
    ]

}

const LayoutComponent = Transaction;
const mapStateToProps = state => {
    return {
        num: state.user.num,
        nums: state.user.nums,
        numss: state.user.numss,
        check_list: state.ad.check_list,
    }
}

export default connectComponent({ LayoutComponent, mapStateToProps })