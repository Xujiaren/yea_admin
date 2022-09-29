import React, { Component } from 'react';
import connectComponent from '../../util/connect'
import { Card, Button, Popconfirm, Table, Spin, Input, Modal, Form, message, Tabs,DatePicker,Checkbox } from 'antd'
import moment from 'moment'
import FormItem from 'antd/lib/form/FormItem';
//invoice_url
const { TabPane } = Tabs;
class Fapiao extends Component {
    state = {
        loading: false,
        status: 10,
        keyword: '',
        begin_time: '',
        end_time: '',
        page: 0,
        total: 0,
        pageSize: 10,
        data_list: [],
        rulePanels: false,
        invoice_url: '',
        order_id: 0,
        loads: false,
        checks:[]
    };
    componentDidMount() {
        this.getGoodsOrder()
    }
    getGoodsOrder = () => {
        this.setState({ loading: true })
        const {
            keyword,
            begin_time,
            end_time,
            status,
            pageSize,
            page
        } = this.state
        const { actions } = this.props
        actions._getGoodsOrder({
            order_id: '',
            page: page,
            pageSize: pageSize,
            keyword,
            begin_time,
            end_time,
            status,
            resolved: (res) => {
                console.log(res)
                const { total, page, data } = res
                if (Array.isArray(data)) {
                    this.setState({ data_list: data, total, page })
                }
                this.setState({ loading: false })
            },
            rejected: () => {
                this.setState({ loading: false })
            }
        })
    }
    onUps = () => {
        const { actions } = this.props
        const { order_id, invoice_url } = this.state
        actions.postFaPiaos({
            order_id: order_id,
            invoice_url: invoice_url,
            resolved: (res) => {
                message.success({
                    content: '操作成功'
                })
                this.getGoodsOrder()
                this.setState({
                    rulePanels: false,
                    order_id: 0,
                    invoice_url: ''
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onExports = () => {
        this.setState({
            loads: true
        })
        this.props.actions.getFaPiaoExports({
            begin_time: this.state.begin_time,
            end_time: this.state.end_time,
            order_id: 0,
            time_type: 0,
            user_id: '',
            resolved: (res) => {
                message.success({
                    content: '导出成功'
                })
                window.open(res.adress)
                this.setState({
                    loads: false
                })
            },
            rejected: (err) => {
                this.setState({
                    loads: false
                })
            }
        })
    }
    onOuts=(val)=>{
        this.setState({
            loads: true
        })
        this.props.actions.getFaPiaoExports({
            begin_time: '',
            end_time: '',
            order_id: val.orderId,
            time_type: 0,
            user_id: '',
            resolved: (res) => {
                message.success({
                    content: '导出成功'
                })
                window.open(res.adress)
                this.setState({
                    loads: false
                })
            },
            rejected: (err) => {
                this.setState({
                    loads: false
                })
            }
        })
    }
    onChecks=(val)=>{
        const{checks}=this.state
        if(checks.indexOf(val)==-1){
            let lst = checks.concat(val)
            this.setState({
                checks:lst
            })
        }else{
            let vas = checks.filter(item=>item!=val)
            this.setState({
                checks:vas
            })
        }
    }
    onOutss=()=>{
        if(this.state.checks.length==0){message.info({content:'请先进行选择'});return;}
        this.setState({
            loads: true
        })
        this.props.actions.getFaPiaoExports({
            begin_time: '',
            end_time: '',
            order_id: this.state.checks.toString(),
            time_type: 0,
            user_id: '',
            resolved: (res) => {
                message.success({
                    content: '导出成功'
                })
                window.open(res.adress)
                this.setState({
                    loads: false,
                    checks:[]
                })
            },
            rejected: (err) => {
                this.setState({
                    loads: false,
                    checks:[]
                })
            }
        })
    }
    render() {
        return (
            <div className="animated fadeIn" >
                <Spin spinning={this.state.loading}>
                    <Card title='发票管理' extra={
                        <>
                            <DatePicker.RangePicker format='YYYY-MM-DD' onChange={(val, dateString) => {
                                let begin = '', end = ''
                                if (Array.isArray(dateString) && dateString.length === 2) {
                                    begin = dateString[0]
                                    end = dateString[1]
                                }
                                console.log(dateString)
                                this.setState({begin_time:begin, end_time:end }, this.getGoodsOrder)
                            }}></DatePicker.RangePicker>
                            <Button loading={this.state.loads} onClick={this.onExports}>导出</Button>
                        </>
                    }>
                        <Tabs defaultActiveKey="1" onChange={(e) => {
                            this.setState({
                                status: parseInt(e),
                                page: 0,
                                total: 0,
                            }, () => {
                                this.getGoodsOrder()
                            })
                        }}>
                            <TabPane tab="未开票" key="10">
                            </TabPane>
                            <TabPane tab="已开票" key="11">
                            </TabPane>
                        </Tabs>
                        <Button loading={this.state.loads} size='small' onClick={this.onOutss}>导出</Button>
                        <Table
                            scroll={{ x: 1200 }}
                            rowKey='orderId'
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
                                    this.setState({ page: val - 1 }, this.getGoodsOrder)
                                },
                                showTotal: (total) => '总共' + total + '条'
                            }}>

                        </Table>
                    </Card>
                </Spin>
                <Modal title={'发票链接填写'} onOk={this.onUps} visible={this.state.rulePanels} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
                    this.setState({ rulePanels: false, invoice_url: '', order_id: 0 })
                }}>
                    <FormItem label='发票链接'>
                        <Input value={this.state.invoice_url} onChange={(e) => { this.setState({ invoice_url: e.target.value }) }}></Input>
                    </FormItem>
                </Modal>
            </div>
        );
    }
    col = [
        { title: '多选', dataIndex: '', key: '',render:(item,ele,index)=>{
            return(
                <Checkbox onChange={this.onChecks.bind(this,ele.orderId)}></Checkbox>
            )
        }},
        { title: 'ID', dataIndex: 'orderId', key: 'orderId' },
        { title: '订单号', dataIndex: 'orderSn', key: 'orderSn' },
        { title: '下单账户', dataIndex: 'realname', key: 'realname', },
        // { title: '商品图片', dataIndex: 'orderGoods', key: 'orderGoods1', render: (item, ele) =>{
        //     if(ele.orderGoods.length==0){
        //         return null
        //     }
        //     let goods = ele.orderGoods[0]
        //     return <img src={goods.goodsImg} onClick={() => { this.setState({ showImgPanel: true, previewImage: goods.goodsImg }) }} className='disc head-example-img'></img>
        // }},
        { title: '商品名称', dataIndex: 'orderGoods', key: 'orderGoods2', render: (item, ele) => ele.orderGoods[0] && ele.orderGoods[0].goodsName },
        //{ title: '总价', dataIndex: 'cost', key: 'cost' },
        { title: '数量', dataIndex: 'orderGoods', key: 'orderGoods3', render: (item, ele) => ele.orderGoods[0] && ele.orderGoods[0].goodsNum },
        { title: '支付金额', dataIndex: 'integralAmount', key: 'integralAmount' },
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
        // { title: '退换状态', dataIndex: 'returnStatusIntro', key: 'returnStatusIntro',render:(item,ele)=>{
        //     return ele.orderStatus==2?'':ele.returnStatusIntro
        // } },
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
            fixed: 'right',
            width: '250px',
            title: '操作',
            render: (item, ele, index) => {
                // if(typeof invoiceUrl === 'object' && 'invoiceUrl' in ele && ele['invoiceUrl']){
                //     return <a target='_black' href={ele['invoiceUrl']}>查看发票</a>
                // }else{
                //     return (
                //         <Button onClick={()=>{this.setState({
                //             rulePanels:true,
                //             order_id:ele.orderId
                //         })}}>填写发票链接</Button>
                //     )
                // }
                if (ele.invoiceUrl) {
                    return (
                        <>
                        <a target='_black' href={ele['invoiceUrl']}>查看发票</a>
                        <Button className='ml_5' loading={this.state.loads} onClick={this.onOuts.bind(this,ele)}>导出</Button>
                        </>
                    
                    )
                } else {
                    return (
                        <>
                        <Button onClick={() => {
                            this.setState({
                                rulePanels: true,
                                order_id: ele.orderId
                            })
                        }}>填写发票链接</Button>
                        <Button className='ml_5' loading={this.state.loads} onClick={this.onOuts.bind(this,ele)}>导出</Button>
                        </>
                        
                    )
                }
            }
        }
    ]
}

const LayoutComponent = Fapiao;
const mapStateToProps = state => {
    return {
        goods_order_list: state.mall.goods_order_list,
    }
}

export default connectComponent({ LayoutComponent, mapStateToProps })