import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { Table, TabPane,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio, InputNumber} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import {Button,Popconfirm} from '../../../components/BtnComponent'

const {RadioGroup} = Radio;
const {Option} = Select;
const {Search} = Input;
const {RangePicker} = DatePicker
class Express extends Component {
    state = {
            
        edit : true,
        view : true,
        visible: false,
        isView:false,

        status:0, 
        tag_id:'',
        tagName:'',
        ttype:0,
        keyword:'',
        previewImage:'',
        showImgPanel:false,
        showRefund:false,
        showOrderEdit:false,
        showOrderView:false,
        showPost:false,
        showPostView:false,
        showAddPanel:false,
        showEditPanel:false,
        payType:0,

        activeTab:'1',

        shipping_id:0,
        shipping_name:'',
        shipping_url:'',
        status:1,
        is_default:0,
        rule_name:'',
        first_price:'',
        added_weight:'',
        added_price:'',
        added_number_price:'',
        rule_status:0,
        stype:0,
        first_weight:'',
        added_number:'',
    };
    page_total=0
    page_current=1
    page_size=12
    data_list=[
        {shippingId:1,shippingName:'EMS',shippingUrl:'http://www.ems.com.cn/'}
    ]

    getExpress = ()=>{
        // const {actions} = this.props
        // const {keyword} = this.state
        // actions.getExpress({
        //     keyword
        // })
    }
    componentWillReceiveProps(n_props){
        if(n_props.express_list !== this.props.express_list){
            this.data_list = n_props.express_list
            console.log(n_props.express_list)
        }
    }
    componentDidMount(){
        this.getExpress()
    }
   
    _onSearch = (val)=>{
        this.setState({
            keyword:val
        },()=>{
            this.getExpress()
        })
    }
    _onAction(shipping_id){
        const {actions} = this.props
        actions.actionExpress({
            shipping_id,
            resolved:()=>{
                this.getExpress()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onPublish = ()=>{
        const {actions} = this.props
        let { 
            shipping_id,
            shipping_name,
            shipping_url,
            status,
            is_default,
            rule_name,
            first_price,
            added_weight,
            added_price,
            added_number_price,
            rule_status,
            stype,
            first_weight,
            added_number,
        } = this.state

        if(!shipping_name||shipping_name==''){ message.info('请输入名称'); return; }
        if(!shipping_url||shipping_url==''){ message.info('请输入官网地址'); return; }

        if(first_weight==''){ message.info('请输入首重'); return; }
        if(first_price==''){ message.info('请输入首重价格'); return; }

        if(stype==1){
            if(added_number==''){ message.info('请输入续件'); return; }
            if(added_number_price==''){ message.info('请输入续件价格'); return; }
            if(isNaN(added_number)||isNaN(added_number_price)){ message.info('请输入合法的数字') }
        }else{
            if(added_weight==''){ message.info('请输入续重'); return; }
            if(added_price==''){ message.info('请输入续重价格'); return; }
        }   if(isNaN(added_weight)||isNaN(added_price)){ message.info('请输入合法的数字') }
        if(isNaN(first_weight)||isNaN(first_price)){
            message.info('请输入合法的数字')
        }
        if(added_number>9){ message.info('件数不能大于 9');return; }
        if(added_number==''||!added_number) added_number = 0
        actions.publishExpress({
            shipping_id,
            shipping_name,
            shipping_url,
            status,
            is_default,
            rule_name,
            first_price,
            added_weight,
            added_price,
            added_number_price,
            rule_status,
            stype,
            first_weight,
            added_number,
            resolved:()=>{
                this.handleCancel()
                message.success("操作成功")
                this.getExpress()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    reset = ()=>{
        this.setState({
            shipping_id:0,
            shipping_name:'',
            shipping_url:'',
            status:1,
            is_default:0,
            rule_name:'',
            first_price:'',
            added_weight:'',
            added_price:'',
            added_number_price:'',
            rule_status:0,
            stype:0,
            first_weight:'',
            added_number:'',
        })
    }
    edit(item){
        let shippingRules = {
            isDefault:0,
            ruleName:'',
            firstPrice:'',
            addedWeight:'',
            addedPrice:'',
            addedNumberPrice:'',
            status:0,
            stype:0,
            firstWeight:'',
            addedNumber:''
        }
        if(item.shippingRules.length > 0){
            shippingRules = item.shippingRules[0]
        }
        this.setState({
            shipping_id: item.shippingId,
            shipping_name: item.shippingName,
            shipping_url: item.shippingUrl,
            status: item.status,
            showAddPanel: true,
            is_default: shippingRules.isDefault,
            rule_name: shippingRules.ruleName,
            first_price: shippingRules.firstPrice,
            added_weight: shippingRules.addedWeight,
            added_price: shippingRules.addedPrice,
            added_number_price: shippingRules.addedNumberPrice,
            rule_status: shippingRules.status,
            stype: shippingRules.stype,
            first_weight: shippingRules.firstWeight,
            added_number: shippingRules.addedNumber,
        })
    }
    handleCancel = () => {
        this.setState({
            showAddPanel: false,
        });
    };
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
    render(){
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
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="物流管理">
                            <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Search
                                        placeholder=''
                                        onSearch={this._onSearch}
                                        onChange={(e)=>{ this.setState({ keyword:e.target.value }) }}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                    />&nbsp;
                                    <Button onClick={this.getExpress}>搜索</Button>
                                </div>
                                {/* <div>
                                    <Button onClick={()=>{
                                        this.reset()
                                        this.setState({ showAddPanel:true })
                                    }} >新增快递</Button>
                                </div> */}
                            </div>
                            <Table expandIcon={() => null} rowKey='shippingId' columns={this.col} dataSource={this.data_list} pagination={false}/>
                            </div>
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
                <Modal
                    zIndex={90}
					title={this.state.shipping_id==0?"查看详情":'查看详情'}
					visible={this.state.showAddPanel}
					okText="确定"
					cancelText="关闭"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showAddPanel:false })
                    }}
                    onOk={()=>{
                        this.setState({ showAddPanel:false })
                    }}
					// onOk={this._onPublish}
					// bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form {...formItemLayout}>
                        <Form.Item label='名称'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ shipping_name:e.target.value })
                                }}
                                placeholder='请输入名称'
                                value={this.state.shipping_name}
                            />
                        </Form.Item>
                        <Form.Item label='官网'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ shipping_url:e.target.value })
                                }}
                                placeholder='请输入官网链接'
                                value={this.state.shipping_url}
                            />
                        </Form.Item>
                        <Form.Item label='结算方式'>
                            <Radio.Group value={this.state.stype}
                                onChange={e=>{
                                    if(e.target.value==1){
                                        this.setState({ first_weight:1 })
                                    }
                                    this.setState({ stype:e.target.value })
                                }}
                            >
                                <Radio value={0}>按重量</Radio>
                                <Radio value={1}>按件数</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={this.state.stype==1?'首件':'首重'}>
                            <InputNumber disabled={this.state.stype==1} min={0} max={800000} value={this.state.first_weight} onChange={val=>{this.setState({first_weight:val})}}/>
                            <span style={{padding:'0 10px'}}>{this.state.stype==1?'件':'KG'}</span>
                            <InputNumber min={0} max={800000} value={this.state.first_price} onChange={val=>{this.setState({first_price:val})}}/>
                            <span style={{padding:'0 10px'}}>元</span>
                        </Form.Item>
                        {this.state.stype===0?
                        <Form.Item label='续重'>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_weight}
                                onChange={val=>{this.setState({added_weight:val})}}
                            />
                            <span style={{padding:'0 10px'}}>{this.state.stype===0?'KG':'件'}</span>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_price}
                                onChange={val=>{this.setState({added_price:val})}}
                            />
                            <span style={{padding:'0 10px'}}>元</span>
                        </Form.Item>
                        :
                        <Form.Item label='续件'>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_number}
                                onChange={val=>{this.setState({added_number:val})}}
                            />
                            <span style={{padding:'0 10px'}}>{this.state.stype===0?'KG':'件'}</span>
                            <InputNumber
                                 min={0} max={800000}
                                 value={this.state.added_number_price}
                                 onChange={val=>{this.setState({added_number_price:val})}}
                            /><span style={{padding:'0 10px'}}>元</span>
                        </Form.Item>
                        }
                    </Form>
                </Modal>
            </div>
        )
    }
    col = [
        { title: 'ID', dataIndex: 'shippingId', key: 'shippingId' },
        { title: '物流公司', dataIndex: 'shippingName', key: 'shippingName'},
        { title: '官网', dataIndex: 'shippingUrl', key: 'shippingUrl' ,render:(item,ele)=><a href={ele.shippingUrl}>{ele.shippingUrl}</a> },
        {   
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    <Button value='express/setting' onClick={()=>{
                        this.props.history.push({
                            pathname:'/mall/express/edit/'+ele.shippingId
                        })
                    }} type="primary" size={'small'} className='m_2'>运费配置</Button>
                    {/* <Button onClick={this.edit.bind(this,ele)} type="primary" size={'small'} className='m_2'>查看</Button> */}
                    {/* <Popconfirm 
                        okText="确定"
                        cancelText='取消'
                        title={ele.status==1?'确定停用吗？':'确定启用吗？'}
                        onConfirm={this._onAction.bind(this,ele.shippingId)}
                    >
                        <Button type={ele.status==1?"danger":''} size={'small'} className='m_2'>{ele.status==1?'停用':'启用'}</Button>
                    </Popconfirm> */}
                </div>
            )
        }
    ]

}
const LayoutComponent = Express;
const mapStateToProps = state => {
    return {
        express_list:state.mall.express_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
