
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
importÂ connectComponentÂ fromÂ '../../util/connect';
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
                    content:'å¯¼åºæå',
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
                        <TabPane tab="è¯¾ç¨è®¢å" key='0'>
                        </TabPane>
                        {/* <TabPane tab="åå¼è®¢å" key='3'>
                        </TabPane>
                        <TabPane tab="å¹è®­ç­è®¢å" key='13'>
                        </TabPane> */}
                    </Tabs>
                    <div className="flex f_row j_space_between align_items mb_10">

                        <div className='flex f_row align_items'>
                            
                            {/* <Select value={this.state.otype} onChange={otype=>this.setState({ otype })}>
                                <Select.Option value={0}>è¯¾ç¨è®¢å</Select.Option>
                                <Select.Option value={3}>åå¼è®¢å</Select.Option>
                            </Select>&nbsp; */}
                            <RangePicker value={this.state.atime} showTime={false} format="YYYY-MM-DD" locale={locale} onChange={(atime)=>{
                                this.setState({ atime },this.getTheOrder)
                            }}></RangePicker>&nbsp;
                            <Search
                                placeholder='ç¨æ·å/è¯¾ç¨å'
                                // placeholder='è®¢åå·ï¼ææºå·'
                                onSearch={()=>{
                                    this.setState({ page_current:0 },this.getTheOrder)
                                }}
                                style={{ maxWidth: 200 }}
                                value={this.state.keyword}
                                onChange={(e)=>this.setState({ keyword: e.target.value })}
                            />&nbsp;
                             <Search
                                placeholder='ææºå·'
                                // placeholder='è®¢åå·ï¼ææºå·'
                                onSearch={()=>{
                                    this.setState({ page_current:0 },this.getTheOrder)
                                }}
                                style={{ maxWidth: 200 }}
                                value={this.state.mobile}
                                onChange={(e)=>this.setState({ mobile: e.target.value })}
                            />&nbsp;
                             <Search
                                placeholder='ID'
                                // placeholder='è®¢åå·ï¼ææºå·'
                                onSearch={()=>{
                                    this.setState({ page_current:0 },this.getTheOrder)
                                }}
                                style={{ maxWidth: 200 }}
                                value={this.state.ids}
                                onChange={(e)=>this.setState({ ids: e.target.value })}
                            />&nbsp;
                        </div>
                        <div>
                            <Button value='courseOrder/out'  loading={this.state.exportLoading} onClick={this.exportTheOrder}>å¯¼åºè®¢å</Button>
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
                            showTotal:(total)=>'æ»å±'+total+'æ¡'
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
                    <img alt="å¾çé¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={90}
                    width={800}
                    title='æ¥çè®¢å'
                    visible={this.state.showOrderView}
                    closable={true}
                    maskClosable={true}
                    okText='ç¡®å®'
                    cancelText='åæ¶'
                    onCancel={()=>{
                        this.setState({ showOrderView:false })
                    }}
                    onOk={()=>{
                        this.setState({ showOrderView:false })
                    }}
                    bodyStyle={{ padding: "15px",paddingTop:'15px' }}
                >
                    <Card type='inner' title='ååæ¸å' bodyStyle={{padding:0}}>
                        <TableAntd
                            rowKey='recId'
                            columns={this.goods_column}
                            dataSource={this.state.goods_list}
                            pagination={{size:'small'}}
                        />
                    </Card>
                    <Card type='inner' className='mt_10' >
                        <Form labelCol={{span:3}} wrapperCol={{span:20}}>
                            <Form.Item label='æ¯ä»ç¶æ' className='mb_0'>
                                {this.state.pay_status}
                            </Form.Item>
                            <Form.Item label='è®¢åç¶æ' className='mb_0'>
                                {this.state.order_status}
                            </Form.Item>
                            <Form.Item label='è®¢åæ»é¢' className='mb_0'>
                                {this.state.order_total}
                            </Form.Item>
                            {/*
                            <Form.Item label='ä¼æ ' className='mb_0'>
                                -Â¥590.00 ï¼æ¯æ»¡1000å100ï¼
                            </Form.Item>
                            */}
                            <Form.Item label='åºä»éé¢' className='mb_0'>
                                {this.state.order_pay_price}
                            </Form.Item>
                            {/* <Form.Item label='æ¯ä»æ¹å¼' className='mb_0'>
                                ç§¯å
                            </Form.Item>
                            <Form.Item label='ç¨æ·å§å' className='mb_0'>
                                {this.state.order_username}
                            </Form.Item>
                            <Form.Item label='ç¨æ·çµè¯' className='mb_0'>
                                {this.state.order_mobile}
                            </Form.Item>
                            <Form.Item label='æ¶è´§å°å' className='mb_0'>
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
        // {dataIndex:'orderSn',title:'è®¢åå·',ellipsis:true,render:(item,ele)=>{
        //     return <Tooltip title={ele.orderSn}>{ele.orderSn}</Tooltip>
        // }},
        {dataIndex:'userName',title:'ä¸åè´¦æ·',ellipsis:false,render:(item,ele)=>{
            return ele.realname||ele.userName
        }},
        {dataIndex:'orderGoods',title:'å¥é¤åç§°',render:(item,ele)=>{
            if(Array.isArray(ele.orderGoods) && ele.orderGoods.length > 0){
                return ele.orderGoods[0].goodsName
            }else{
                return 'ææ '
            }
        }},
        {dataIndex:'orderAmount',ellipsis:false, title:'ç°é'},
        // {dataIndex:'orderAmount',ellipsis:false, title:'ç§¯å',},
        {dataIndex:'payTime',ellipsis:false, title:'ä¸åæ¶é´',render:(item,ele)=>{
            return ele.payTime>0 ?moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm'):'ææ '
        }},
        { title: 'æ¯ä»ç¶æ', dataIndex: 'payStatus', key: 'payStatus', render: (item, ele) => ele.payStatus == 1 ? 'å·²æ¯ä»' : 'æªæ¯ä»' },
       
    ]
    o2o_col = [
        {dataIndex:'orderId',title:'ID',ellipsis:false},
        {dataIndex:'orderSn',title:'è®¢åå·',ellipsis:true,render:(item,ele)=>{
            return <Tooltip title={ele.orderSn}>{ele.orderSn}</Tooltip>
        }},
        {dataIndex:'userName',title:'ä¸åè´¦æ·',ellipsis:false,render:(item,ele)=>{
            return ele.realname||ele.userName
        }},
        {dataIndex:'orderGoods',title:'å¹è®­ç­åç§°',render:(item,ele)=>{
            if(Array.isArray(ele.orderGoods) && ele.orderGoods.length > 0){
                return ele.orderGoods[0].goodsName
            }else{
                return 'ææ '
            }
        }},
        {dataIndex:'orderAmount',ellipsis:false, title:'æ¯ä»ç°é'},
        // {dataIndex:'orderAmount',ellipsis:false, title:'ç§¯å',},
        {dataIndex:'payTime',ellipsis:false, title:'ä¸åæ¶é´',render:(item,ele)=>{
            return ele.payTime>0 ?moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm'):'ææ '
        }},
        { title: 'æ¯ä»ç¶æ', dataIndex: 'payStatus', key: 'payStatus', render: (item, ele) => ele.payStatus == 1 ? 'å·²æ¯ä»' : 'æªæ¯ä»' },
        // { title:'æä½',render:(item,ele)=>(
        //     <Button value='courseOrder/view' type="primary" size={'small'} className='m_2' onClick={()=>{
    
        //         let order_status = ele.orderStatus == 0 ? 
        //         (ele.shippingStatus==1?'å·²åè´§':ele.shippingStatus==2?'å·²å®æ':'è®¢åæ­£å¸¸') :
        //          ele.orderStatus == 1?'è®¢ååæ¶' : 
        //          ele.orderStatus==2?'éæ¬¾':
        //          ele.orderStatus==3?'éæ¬¾éè´§':
        //          ele.orderStatus==4?'æ¢è´§':''
        //         console.log(ele.orderGoods)
        //          this.setState({
        //             showOrderView:true,
        //             goods_list:ele.orderGoods,
        //             pay_status:ele.payStatus == 1 ? 'å·²æ¯ä»' : 'æªæ¯ä»',
        //             order_status:order_status,
        //             order_total:ele.orderAmount,
        //             order_pay_price:ele.orderAmount,
        //             order_location:ele.province+ele.city+ele.district+ele.street+ele.address,
        //             order_username:ele['realname']||'',
        //             order_mobile:ele['mobile']||''
        //         })
        //     }}>æ¥çè®¢å</Button>
        // )}
    ]
    course_col = [
        {dataIndex:'id',title:'ID',ellipsis:false},
        {dataIndex:'pubTime',title:'è®¢åå·',ellipsis:true,render:(item,ele)=>{
            return <Tooltip title={ele.pubTime}>{ele.pubTime}</Tooltip>
        }},
        {key:'userId',dataIndex:'userId',title:'ç¨æ·ID',ellipsis:false},
        {dataIndex:'nickname',title:'ä¸åè´¦æ·',ellipsis:false,render:(item,ele)=>{
            return ele.nickname||'ææ '
        }},
        {dataIndex:'content',title:'åç§°',render:(item,ele)=>{
            if(ele.content){
                return ele.content
            }else{
                return 'ææ '
            }
        }},
        {dataIndex:'integral',ellipsis:false, title:'ç§¯å'},
        {dataIndex:'pubTime',ellipsis:false, title:'ä¸åæ¶é´',render:(item,ele)=>{
            return ele.pubTime>0 ?moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm'):'ææ '
        }},
        { title: 'æ¯ä»ç¶æ', dataIndex: 'payStatus', key: 'payStatus', render: (item, ele) => 'å·²æ¯ä»' },
        // { title:'æä½',render:(item,ele)=>(
        //     <Button value='courseOrder/view' type="primary" size={'small'} className='m_2' onClick={()=>{
    
        //         let order_status = ele.orderStatus == 0 ? 
        //         (ele.shippingStatus==1?'å·²åè´§':ele.shippingStatus==2?'å·²å®æ':'è®¢åæ­£å¸¸') :
        //          ele.orderStatus == 1?'è®¢ååæ¶' : 
        //          ele.orderStatus==2?'éæ¬¾':
        //          ele.orderStatus==3?'éæ¬¾éè´§':
        //          ele.orderStatus==4?'æ¢è´§':''
        //         console.log(ele.orderGoods)
        //          this.setState({
        //             showOrderView:true,
        //             goods_list:ele.orderGoods,
        //             pay_status:ele.payStatus == 1 ? 'å·²æ¯ä»' : 'æªæ¯ä»',
        //             order_status:order_status,
        //             order_total:ele.orderAmount,
        //             order_pay_price:ele.orderAmount,
        //             order_location:ele.province+ele.city+ele.district+ele.street+ele.address,
        //             order_username:ele['realname']||'',
        //             order_mobile:ele['mobile']||''
        //         })
        //     }}>æ¥çè®¢å</Button>
        // )}
    ]
    goods_column = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId',width: 100 },
        { title: 'ååå¾ç', dataIndex: 'goodsImg', key: 'goodsImg', render: (item, ele) =>{
            return <img src={ele.goodsImg} onClick={() => { this.setState({ showImgPanel: true, previewImage: ele.goodsImg }) }} className='disc head-example-img'></img>
        }},
        { title: 'åååç§°', dataIndex: 'goodsName', key: 'goodsName', ellipsis:true},
        // { title: 'å±æ§', dataIndex: 'goodsAttr', key: 'goodsAttr', ellipsis:true},
        // { title: 'è´§å·', dataIndex: 'goodsSn', key: 'goodsSn', ellipsis:true},
        { title: 'ä»·æ ¼', dataIndex: 'integralAmount', key: 'integralAmount', ellipsis:true},
        { title: 'æ°é', dataIndex: 'goodsNum', key: 'goodsNum', ellipsis:true},
    ]
}
constÂ LayoutComponentÂ =CourseOrder;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
		user:state.site.user
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
