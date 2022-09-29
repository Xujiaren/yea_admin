
import React, { Component } from 'react';
import {
    Tag,
    Tabs,
    DatePicker,
    message,
    Pagination,
    Modal,
    Card,
    Select,
    Input,
    
    Tooltip,
    Table as TableAntd,
    Form,
    Spin,
} from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment'
import {Button,Popconfirm} from '../../components/BtnComponent'

const { TabPane } = Tabs;
const {Search} = Input;
const {RangePicker} = DatePicker
class CourseOrder extends Component {
    state = {

        status:0, 
        tag_id:'',
        tagName:'',
        ttype:0,
        previewImage:'',
        showImgPanel:false,
        showRefund:false,
        showOrderEdit:false,
        showOrderView:false,
        showPost:false,
        showPostView:false,

        activeTab:'1',
        page_current:0,
        page_size:10,
        page_total: 0,
        otype: '0',
        keyword: '',
        goods_list:[],
        data_list: [],
        mobile:'',
        ids:'',
    };

    componentWillMount(){
        this.getTheOrder()
    }

    showImgPanel(url){
        this.setState({
            showImgPanel: true,
            previewImage:url
        });
    }
    hideImgPanel=()=>{
        this.setState({
            showImgPanel: false
        });
    }
    exportTheOrder = ()=>{
        this.setState({ exportLoading:true })
        const { atime, otype, keyword, page_current,page_size, page_total,ids,mobile } = this.state
        let begin_time = ''
        let end_time = ''
        if(Array.isArray(atime) && atime.length == 2){
            begin_time = atime[0].format('YYYY-MM-DD')
            end_time = atime[1].format('YYYY-MM-DD')
        }
        this.props.actions.exportCourseOrder({
            keyword,
            begin: begin_time,
            end: end_time,
            user_id:ids,
            mobile:mobile,
            resolved:(res)=>{
               
                this.setState({ exportLoading:false })
                message.success({
                    content:'导出成功',
                    onClose:()=>{
                        if(typeof res === 'string'){
                            window.open(res,'_black')
                        }else if(typeof res == 'object'){
                            const {address='',adress=''} = res
                            window.open(address||adress,'_black')
                        }
                    }
                })
            },
            rejected:()=>{
                this.setState({ exportLoading:false })
            }
        })
        
    }
    getTheOrder = ()=>{
        this.setState({ loading:true })
        const { atime, otype, keyword, page_current,page_size, page_total,ids,mobile } = this.state
        let begin_time = ''
        let end_time = ''
        if(Array.isArray(atime) && atime.length == 2){
            begin_time = atime[0].format('YYYY-MM-DD')
            end_time = atime[1].format('YYYY-MM-DD')
        }
        this.props.actions.getUserCourseOrder({
            page: page_current,
            pageSize: page_size,
            keyword,
            otype,
            begin: begin_time,
            end: end_time,
            user_id:ids,
            mobile:mobile,
            resolved:(res)=>{
                const { total,page,data } = res
                this.setState({ page_total:total, page_current: page, data_list: data })
                console.log(res)
                this.setState({ loading:false })
            },
            rejected:()=>{
                this.setState({ loading:false })
            }
        })
    }
    render(){

        return(
            <div className="animated fadeIn">
                <Card>
                    <Spin spinning={this.state.loading}>
                    <div className='min_height'>
                    <Tabs onChange={val=>{
                        this.setState({
                            otype:val
                        },this.getTheOrder)
                    }} activeKey={this.state.otype}>
                        <TabPane tab="课程订单" key='0'>
                        </TabPane>
                        {/* <TabPane tab="充值订单" key='3'>
                        </TabPane>
                        <TabPane tab="培训班订单" key='13'>
                        </TabPane> */}
                    </Tabs>
                    <div className="flex f_row j_space_between align_items mb_10">

                        <div className='flex f_row align_items'>
                            
                            {/* <Select value={this.state.otype} onChange={otype=>this.setState({ otype })}>
                                <Select.Option value={0}>课程订单</Select.Option>
                                <Select.Option value={3}>充值订单</Select.Option>
                            </Select>&nbsp; */}
                            <RangePicker value={this.state.atime} showTime={false} format="YYYY-MM-DD" locale={locale} onChange={(atime)=>{
                                this.setState({ atime },this.getTheOrder)
                            }}></RangePicker>&nbsp;
                            <Search
                                placeholder='用户名/课程名'
                                // placeholder='订单号／手机号'
                                onSearch={()=>{
                                    this.setState({ page_current:0 },this.getTheOrder)
                                }}
                                style={{ maxWidth: 200 }}
                                value={this.state.keyword}
                                onChange={(e)=>this.setState({ keyword: e.target.value })}
                            />&nbsp;
                             <Search
                                placeholder='手机号'
                                // placeholder='订单号／手机号'
                                onSearch={()=>{
                                    this.setState({ page_current:0 },this.getTheOrder)
                                }}
                                style={{ maxWidth: 200 }}
                                value={this.state.mobile}
                                onChange={(e)=>this.setState({ mobile: e.target.value })}
                            />&nbsp;
                             <Search
                                placeholder='ID'
                                // placeholder='订单号／手机号'
                                onSearch={()=>{
                                    this.setState({ page_current:0 },this.getTheOrder)
                                }}
                                style={{ maxWidth: 200 }}
                                value={this.state.ids}
                                onChange={(e)=>this.setState({ ids: e.target.value })}
                            />&nbsp;
                        </div>
                        <div>
                            <Button value='courseOrder/out'  loading={this.state.exportLoading} onClick={this.exportTheOrder}>导出订单</Button>
                        </div>
                    </div>
                    <TableAntd
                        rowKey='orderId'
                        pagination={{
                            showQuickJumper:true,
                            current:this.state.page_current + 1,
                            onChange: (page_current)=>this.setState({ page_current:page_current-1 },this.getTheOrder),
                            pageSize: this.state.page_size,
                            total: this.state.page_total,
                            showTotal:(total)=>'总共'+total+'条'
                        }}
                        dataSource={this.state.data_list}
                        columns={
                            this.state.otype==0?this.course_col:
                            this.state.otype==3?this.order_col:
                            this.state.otype==13?this.o2o_col:this.order_col
                        }
                    ></TableAntd>
                    </div>
                    </Spin>
                </Card>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
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
                    onCancel={()=>{
                        this.setState({ showOrderView:false })
                    }}
                    onOk={()=>{
                        this.setState({ showOrderView:false })
                    }}
                    bodyStyle={{ padding: "15px",paddingTop:'15px' }}
                >
                    <Card type='inner' title='商品清单' bodyStyle={{padding:0}}>
                        <TableAntd
                            rowKey='recId'
                            columns={this.goods_column}
                            dataSource={this.state.goods_list}
                            pagination={{size:'small'}}
                        />
                    </Card>
                    <Card type='inner' className='mt_10' >
                        <Form labelCol={{span:3}} wrapperCol={{span:20}}>
                            <Form.Item label='支付状态' className='mb_0'>
                                {this.state.pay_status}
                            </Form.Item>
                            <Form.Item label='订单状态' className='mb_0'>
                                {this.state.order_status}
                            </Form.Item>
                            <Form.Item label='订单总额' className='mb_0'>
                                {this.state.order_total}
                            </Form.Item>
                            {/*
                            <Form.Item label='优惠' className='mb_0'>
                                -¥590.00 （每满1000减100）
                            </Form.Item>
                            */}
                            <Form.Item label='应付金额' className='mb_0'>
                                {this.state.order_pay_price}
                            </Form.Item>
                            {/* <Form.Item label='支付方式' className='mb_0'>
                                积分
                            </Form.Item>
                            <Form.Item label='用户姓名' className='mb_0'>
                                {this.state.order_username}
                            </Form.Item>
                            <Form.Item label='用户电话' className='mb_0'>
                                {this.state.order_mobile}
                            </Form.Item>
                            <Form.Item label='收货地址' className='mb_0'>
                                {this.state.order_location}
                            </Form.Item> */}
                        </Form>
                    </Card>
                </Modal>
            </div>
        )
    }
    order_col = [
        {dataIndex:'orderId',title:'ID',ellipsis:false},
        // {dataIndex:'orderSn',title:'订单号',ellipsis:true,render:(item,ele)=>{
        //     return <Tooltip title={ele.orderSn}>{ele.orderSn}</Tooltip>
        // }},
        {dataIndex:'userName',title:'下单账户',ellipsis:false,render:(item,ele)=>{
            return ele.realname||ele.userName
        }},
        {dataIndex:'orderGoods',title:'套餐名称',render:(item,ele)=>{
            if(Array.isArray(ele.orderGoods) && ele.orderGoods.length > 0){
                return ele.orderGoods[0].goodsName
            }else{
                return '暂无'
            }
        }},
        {dataIndex:'orderAmount',ellipsis:false, title:'现金'},
        // {dataIndex:'orderAmount',ellipsis:false, title:'积分',},
        {dataIndex:'payTime',ellipsis:false, title:'下单时间',render:(item,ele)=>{
            return ele.payTime>0 ?moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm'):'暂无'
        }},
        { title: '支付状态', dataIndex: 'payStatus', key: 'payStatus', render: (item, ele) => ele.payStatus == 1 ? '已支付' : '未支付' },
       
    ]
    o2o_col = [
        {dataIndex:'orderId',title:'ID',ellipsis:false},
        {dataIndex:'orderSn',title:'订单号',ellipsis:true,render:(item,ele)=>{
            return <Tooltip title={ele.orderSn}>{ele.orderSn}</Tooltip>
        }},
        {dataIndex:'userName',title:'下单账户',ellipsis:false,render:(item,ele)=>{
            return ele.realname||ele.userName
        }},
        {dataIndex:'orderGoods',title:'培训班名称',render:(item,ele)=>{
            if(Array.isArray(ele.orderGoods) && ele.orderGoods.length > 0){
                return ele.orderGoods[0].goodsName
            }else{
                return '暂无'
            }
        }},
        {dataIndex:'orderAmount',ellipsis:false, title:'支付现金'},
        // {dataIndex:'orderAmount',ellipsis:false, title:'积分',},
        {dataIndex:'payTime',ellipsis:false, title:'下单时间',render:(item,ele)=>{
            return ele.payTime>0 ?moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm'):'暂无'
        }},
        { title: '支付状态', dataIndex: 'payStatus', key: 'payStatus', render: (item, ele) => ele.payStatus == 1 ? '已支付' : '未支付' },
        // { title:'操作',render:(item,ele)=>(
        //     <Button value='courseOrder/view' type="primary" size={'small'} className='m_2' onClick={()=>{
    
        //         let order_status = ele.orderStatus == 0 ? 
        //         (ele.shippingStatus==1?'已发货':ele.shippingStatus==2?'已完成':'订单正常') :
        //          ele.orderStatus == 1?'订单取消' : 
        //          ele.orderStatus==2?'退款':
        //          ele.orderStatus==3?'退款退货':
        //          ele.orderStatus==4?'换货':''
        //         console.log(ele.orderGoods)
        //          this.setState({
        //             showOrderView:true,
        //             goods_list:ele.orderGoods,
        //             pay_status:ele.payStatus == 1 ? '已支付' : '未支付',
        //             order_status:order_status,
        //             order_total:ele.orderAmount,
        //             order_pay_price:ele.orderAmount,
        //             order_location:ele.province+ele.city+ele.district+ele.street+ele.address,
        //             order_username:ele['realname']||'',
        //             order_mobile:ele['mobile']||''
        //         })
        //     }}>查看订单</Button>
        // )}
    ]
    course_col = [
        {dataIndex:'id',title:'ID',ellipsis:false},
        {dataIndex:'pubTime',title:'订单号',ellipsis:true,render:(item,ele)=>{
            return <Tooltip title={ele.pubTime}>{ele.pubTime}</Tooltip>
        }},
        {key:'userId',dataIndex:'userId',title:'用户ID',ellipsis:false},
        {dataIndex:'nickname',title:'下单账户',ellipsis:false,render:(item,ele)=>{
            return ele.nickname||'暂无'
        }},
        {dataIndex:'content',title:'名称',render:(item,ele)=>{
            if(ele.content){
                return ele.content
            }else{
                return '暂无'
            }
        }},
        {dataIndex:'integral',ellipsis:false, title:'积分'},
        {dataIndex:'pubTime',ellipsis:false, title:'下单时间',render:(item,ele)=>{
            return ele.pubTime>0 ?moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm'):'暂无'
        }},
        { title: '支付状态', dataIndex: 'payStatus', key: 'payStatus', render: (item, ele) => '已支付' },
        // { title:'操作',render:(item,ele)=>(
        //     <Button value='courseOrder/view' type="primary" size={'small'} className='m_2' onClick={()=>{
    
        //         let order_status = ele.orderStatus == 0 ? 
        //         (ele.shippingStatus==1?'已发货':ele.shippingStatus==2?'已完成':'订单正常') :
        //          ele.orderStatus == 1?'订单取消' : 
        //          ele.orderStatus==2?'退款':
        //          ele.orderStatus==3?'退款退货':
        //          ele.orderStatus==4?'换货':''
        //         console.log(ele.orderGoods)
        //          this.setState({
        //             showOrderView:true,
        //             goods_list:ele.orderGoods,
        //             pay_status:ele.payStatus == 1 ? '已支付' : '未支付',
        //             order_status:order_status,
        //             order_total:ele.orderAmount,
        //             order_pay_price:ele.orderAmount,
        //             order_location:ele.province+ele.city+ele.district+ele.street+ele.address,
        //             order_username:ele['realname']||'',
        //             order_mobile:ele['mobile']||''
        //         })
        //     }}>查看订单</Button>
        // )}
    ]
    goods_column = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId',width: 100 },
        { title: '商品图片', dataIndex: 'goodsImg', key: 'goodsImg', render: (item, ele) =>{
            return <img src={ele.goodsImg} onClick={() => { this.setState({ showImgPanel: true, previewImage: ele.goodsImg }) }} className='disc head-example-img'></img>
        }},
        { title: '商品名称', dataIndex: 'goodsName', key: 'goodsName', ellipsis:true},
        // { title: '属性', dataIndex: 'goodsAttr', key: 'goodsAttr', ellipsis:true},
        // { title: '货号', dataIndex: 'goodsSn', key: 'goodsSn', ellipsis:true},
        { title: '价格', dataIndex: 'integralAmount', key: 'integralAmount', ellipsis:true},
        { title: '数量', dataIndex: 'goodsNum', key: 'goodsNum', ellipsis:true},
    ]
}
const LayoutComponent =CourseOrder;
const mapStateToProps = state => {
    return {
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
