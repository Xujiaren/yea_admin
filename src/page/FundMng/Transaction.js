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
                message.success('????????????')
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
                    content: '????????????'
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
					<Tabs.TabPane tab="?????????" key='12'>
					</Tabs.TabPane>
					<Tabs.TabPane tab="?????????" key='11'>
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
                    <TabPane tab="?????????" key="12">
                    </TabPane>
                    <TabPane tab="?????????" key="13">
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
                                showTotal: (total) => '??????' + total + '???'
                            }}>

                        </Table>
                    </Card>
                </Spin>
                <Modal
                    zIndex={90}
                    title="????????????"
                    visible={this.state.showsetting}
                    okText="??????"
                    width={800}
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsetting: false })
                    }}
                    onOk={this.onOk}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='??????????????????'>
                            <InputNumber value={this.state.num} onChange={(e) => { this.setState({ num: e }) }} /><span style={{ marginLeft: '5px', fontSize: '20px' }}>%</span>
                        </Form.Item>
                        <Form.Item label='????????????'>
                            <InputNumber value={this.state.numin} onChange={(e) => { this.setState({ numin: e }) }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'????????????'} onOk={this.onOkey} visible={this.state.rulePanel} maskClosable={false} okText="??????" cancelText='??????' onCancel={() => {
                    this.setState({ rulePanel: false, order_id: 0, water_number: 0 })
                }}>
                    <FormItem label='?????????'>
                        <Tag>{this.state.orderSn}</Tag>
                    </FormItem>
                    <FormItem label='?????????'>
                        <Input value={this.state.water_number} onChange={(e) => {
                            this.setState({
                                water_number: e.target.value
                            })
                        }} />
                    </FormItem>
                </Modal>
                <Modal title={'????????????'} onOk={() => { this.setState({ rulePanels: false, orderSn: '', realname: '', mobile: '', address: '', orderGoods: [], order_id: 0 }) }} visible={this.state.rulePanels} maskClosable={false} okText="??????" cancelText='??????' onCancel={() => {
                    this.setState({ rulePanels: false, orderSn: '', realname: '', mobile: '', address: '', orderGoods: [], order_id: 0 })
                }}>
                    <FormItem label='?????????'>
                        <Tag>{this.state.orderSn}</Tag>
                    </FormItem>
                    <FormItem>
                        <span>????????????</span>
                        <Tag>{this.state.realname}</Tag>
                        <span style={{ marginLeft: '20px' }}>????????????</span>
                        <Tag>{this.state.mobile}</Tag>
                        <br />
                        <span>?????????</span>
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
            title: "??????", dataIndex: "", key: '', render: (ele, index) => {
                return (
                    <div style={{ width: '60px', height: '40px' }}>
                        <img style={{ width: '100%', height: '100%' }} src={ele.goodsImg}></img>
                    </div>
                )
            }
        },
        { title: '?????????', dataIndex: 'goodsName', key: 'goodsName' },
        { title: "??????", dataIndex: "goodsNum", key: 'goodsNum' },
        { title: '??????', dataIndex: 'goodsAmount', key: 'goodsAmount' },
    ]
    col = [
        { title: "??????ID", dataIndex: "orderId", key: 'orderId' },
        { title: "?????????", dataIndex: "orderSn", key: 'orderSn' },
        {
            title: '????????????', dataIndex: '', key: '', render: (item, ele, index) => {
                if (ele.payment == 0)
                    return '??????'
                else if (ele.payment == 1)
                    return '?????????'
                else if (ele.payment == 9)
                    return '??????'
            }
        },
        {
            title: '????????????', dataIndex: 'goodsAmount', key: 'goodsAmount', render: (item, ele) => {
                return '??' + ele.goodsAmount
            }
        },
        {
            title: '??????', dataIndex: 'shippingAmount', key: 'shippingAmount', render: (item, ele) => {
                return '??' + ele.shippingAmount
            }
        },
        {
            title: '?????????????????????', dataIndex: 'couponAmount', key: 'couponAmount', render: (item, ele) => {
                return '??' + ele.couponAmount
            }
        },
        {
            title: '?????????', dataIndex: '', key: '', render: (item, ele) => {
                return '??' + (ele.goodsAmount + ele.shippingAmount)
            }
        },
        {
            title: '??????', dataIndex: '', key: '', render: (item, ele) => {
                return '??' + ele.orderAmount
            }
        },
        {
            title: '????????????', render: (item, ele) => {
                if (ele.payTime) {
                    return moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm')
                } else {
                    return '??????'
                }
            }
        },
        {
            title: '??????', fixed: "right", render: (item, ele) => {
                if (!ele.waterNumber)
                    return <Button size='small' type='primary' onClick={() => {
                        this.setState({
                            rulePanel: true,
                            order_id: ele.orderId,
                            orderSn: ele.orderSn
                        })
                    }}>????????????</Button>
                else if (ele.waterNumber)
                    return (
                        <Button size='small' onClick={this.onOpen.bind(this, ele)}>????????????</Button>
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