import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { Table, TabPane,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio, InputNumber} from 'antd';
import {Link} from 'react-router-dom';
importÂ connectComponentÂ fromÂ '../../../util/connect';
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

        if(!shipping_name||shipping_name==''){ message.info('è¯·è¾å¥åç§°'); return; }
        if(!shipping_url||shipping_url==''){ message.info('è¯·è¾å¥å®ç½å°å'); return; }

        if(first_weight==''){ message.info('è¯·è¾å¥é¦é'); return; }
        if(first_price==''){ message.info('è¯·è¾å¥é¦éä»·æ ¼'); return; }

        if(stype==1){
            if(added_number==''){ message.info('è¯·è¾å¥ç»­ä»¶'); return; }
            if(added_number_price==''){ message.info('è¯·è¾å¥ç»­ä»¶ä»·æ ¼'); return; }
            if(isNaN(added_number)||isNaN(added_number_price)){ message.info('è¯·è¾å¥åæ³çæ°å­') }
        }else{
            if(added_weight==''){ message.info('è¯·è¾å¥ç»­é'); return; }
            if(added_price==''){ message.info('è¯·è¾å¥ç»­éä»·æ ¼'); return; }
        }   if(isNaN(added_weight)||isNaN(added_price)){ message.info('è¯·è¾å¥åæ³çæ°å­') }
        if(isNaN(first_weight)||isNaN(first_price)){
            message.info('è¯·è¾å¥åæ³çæ°å­')
        }
        if(added_number>9){ message.info('ä»¶æ°ä¸è½å¤§äº 9');return; }
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
                message.success("æä½æå")
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
                        <Card title="ç©æµç®¡ç">
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
                                    <Button onClick={this.getExpress}>æç´¢</Button>
                                </div>
                                {/* <div>
                                    <Button onClick={()=>{
                                        this.reset()
                                        this.setState({ showAddPanel:true })
                                    }} >æ°å¢å¿«é</Button>
                                </div> */}
                            </div>
                            <Table expandIcon={() => null} rowKey='shippingId' columns={this.col} dataSource={this.data_list} pagination={false}/>
                            </div>
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="å¾çé¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
                <Modal
                    zIndex={90}
					title={this.state.shipping_id==0?"æ¥çè¯¦æ":'æ¥çè¯¦æ'}
					visible={this.state.showAddPanel}
					okText="ç¡®å®"
					cancelText="å³é­"
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
                        <Form.Item label='åç§°'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ shipping_name:e.target.value })
                                }}
                                placeholder='è¯·è¾å¥åç§°'
                                value={this.state.shipping_name}
                            />
                        </Form.Item>
                        <Form.Item label='å®ç½'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ shipping_url:e.target.value })
                                }}
                                placeholder='è¯·è¾å¥å®ç½é¾æ¥'
                                value={this.state.shipping_url}
                            />
                        </Form.Item>
                        <Form.Item label='ç»ç®æ¹å¼'>
                            <Radio.Group value={this.state.stype}
                                onChange={e=>{
                                    if(e.target.value==1){
                                        this.setState({ first_weight:1 })
                                    }
                                    this.setState({ stype:e.target.value })
                                }}
                            >
                                <Radio value={0}>æéé</Radio>
                                <Radio value={1}>æä»¶æ°</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={this.state.stype==1?'é¦ä»¶':'é¦é'}>
                            <InputNumber disabled={this.state.stype==1} min={0} max={800000} value={this.state.first_weight} onChange={val=>{this.setState({first_weight:val})}}/>
                            <span style={{padding:'0 10px'}}>{this.state.stype==1?'ä»¶':'KG'}</span>
                            <InputNumber min={0} max={800000} value={this.state.first_price} onChange={val=>{this.setState({first_price:val})}}/>
                            <span style={{padding:'0 10px'}}>å</span>
                        </Form.Item>
                        {this.state.stype===0?
                        <Form.Item label='ç»­é'>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_weight}
                                onChange={val=>{this.setState({added_weight:val})}}
                            />
                            <span style={{padding:'0 10px'}}>{this.state.stype===0?'KG':'ä»¶'}</span>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_price}
                                onChange={val=>{this.setState({added_price:val})}}
                            />
                            <span style={{padding:'0 10px'}}>å</span>
                        </Form.Item>
                        :
                        <Form.Item label='ç»­ä»¶'>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_number}
                                onChange={val=>{this.setState({added_number:val})}}
                            />
                            <span style={{padding:'0 10px'}}>{this.state.stype===0?'KG':'ä»¶'}</span>
                            <InputNumber
                                 min={0} max={800000}
                                 value={this.state.added_number_price}
                                 onChange={val=>{this.setState({added_number_price:val})}}
                            /><span style={{padding:'0 10px'}}>å</span>
                        </Form.Item>
                        }
                    </Form>
                </Modal>
            </div>
        )
    }
    col = [
        { title: 'ID', dataIndex: 'shippingId', key: 'shippingId' },
        { title: 'ç©æµå¬å¸', dataIndex: 'shippingName', key: 'shippingName'},
        { title: 'å®ç½', dataIndex: 'shippingUrl', key: 'shippingUrl' ,render:(item,ele)=><a href={ele.shippingUrl}>{ele.shippingUrl}</a> },
        {   
            width: '250px',
            title: 'æä½',
            render: (item, ele, index) => (
                <div>
                    <Button value='express/setting' onClick={()=>{
                        this.props.history.push({
                            pathname:'/mall/express/edit/'+ele.shippingId
                        })
                    }} type="primary" size={'small'} className='m_2'>è¿è´¹éç½®</Button>
                    {/* <Button onClick={this.edit.bind(this,ele)} type="primary" size={'small'} className='m_2'>æ¥ç</Button> */}
                    {/* <Popconfirm 
                        okText="ç¡®å®"
                        cancelText='åæ¶'
                        title={ele.status==1?'ç¡®å®åç¨åï¼':'ç¡®å®å¯ç¨åï¼'}
                        onConfirm={this._onAction.bind(this,ele.shippingId)}
                    >
                        <Button type={ele.status==1?"danger":''} size={'small'} className='m_2'>{ele.status==1?'åç¨':'å¯ç¨'}</Button>
                    </Popconfirm> */}
                </div>
            )
        }
    ]

}
constÂ LayoutComponentÂ = Express;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        express_list:state.mall.express_list,
		user:state.site.user
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
