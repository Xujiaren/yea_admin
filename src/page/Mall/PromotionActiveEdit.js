import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Checkbox,TimePicker,DatePicker,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message} from 'antd';
import {Link} from 'react-router-dom';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import connectComponent from '../../util/connect';
import GoodsBox from '../../components/GoodsBox'

const InputGroup = Input.Group;
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search,TextArea} = Input;

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}


class PromotionActiveEdit extends Component {
    state = {
        view_mode: false,
        activity_id:0,
        title:'',
        aTime:null,

        begin_time:'',
        end_time:'',
        goods_limit:0,
        status:0,
        goods_ids:'',
        goods_amount:0,
        way:0,

        goods_num:'1',
        goods_discount:'5折',
        pay_total:'',
        sub_total:'',
        
        goods_type: 0,
        goodslist: [],
        category_id: 0,
        brand_id: 0,
        keyword: '',
        sort: 0,
        publishLoading:false
    }
    goods_cate_list = []
    activity_id = 0

    componentWillMount(){
        this.activity_id = this.props.match.params.id
        let _state = this.props.location.state
        if( typeof _state === 'undefined'){
            _state = { type:'' }
        }else if(_state.type === 'view'){
            this.setState({ view_mode:true })
        }

        if (this.activity_id !== '0') {
            this.getGoodsActive()
        }

        this.getGoodsCate()
        this.getMallGoods()
    }
    componentWillReceiveProps(n_props){
        if(n_props.goods_active !==this.props.goods_active){
            if(n_props.goods_active.data.length !== 0){
                let {
                    activityId:activity_id,
                    beginTime,
                    endTime,

                    condFir,
                    condSec,
                    goodsAmount:goods_amount,
                    goodsLimit:goods_limit,
                    goodsList,
                    orderSort:order_sort,
                    status,
                    title,
                    way,
                } = n_props.goods_active.data[0]
                
                let pay_total = ''
                let sub_total = ''
                let goods_num = '1'
                let goods_discount = '5折'

                let begin_time = 0
                let end_time = 0
                let aTime = null
                let goods_type = 0
                let targetKeys = []

                if(beginTime && endTime){
                    end_time = moment.unix(endTime).format('YYYY-MM-DD HH:mm')
                    begin_time = moment.unix(beginTime).format('YYYY-MM-DD HH:mm')
                    aTime = [moment(begin_time),moment(end_time)]
                }
                if(goodsList.length !== 0){
                    goods_type = 1
                    goodsList.map(ele=>{ targetKeys.push(ele.goodsId) })
                }
                if(way==0){
                    pay_total = condFir
                    sub_total = condSec
                }else{
                    goods_num = condFir
                    goods_discount = condSec
                }

                this.setState({ 
                    activity_id,
                    goods_amount,
                    goods_limit,
                    order_sort,
                    status,
                    title,
                    way,
                    pay_total,
                    sub_total,
                    goods_num,
                    goods_discount,
                    begin_time,
                    end_time,
                    aTime,
                    goods_type,
                    targetKeys
                 })
            }
        }

        if(n_props.goods_list !== this.props.goods_list){
            console.log(n_props.goods_list.data)
			this.setState({ goodslist:n_props.goods_list.data })
        }
        if(n_props.goods_cate_list !==this.props.goods_cate_list){
            console.log(n_props.goods_cate_list)
            this.goods_cate_list = n_props.goods_cate_list.data
        }
    }
    getGoodsActive = ()=>{
        const { actions } = this.props
        actions.getGoodsActive({
            activity_id:this.activity_id
        })
    }

    getGoodsCate = ()=>{
        const {actions} = this.props;
        actions.getGoodsCate({
            keyword:'',
            page:0,
            pageSize:0,
            ctype:7,
            parent_id:0
        })
    }
    getMallGoods = ()=>{
        const {actions} = this.props
        const { keyword,brand_id,status,sort,category_id } = this.state
        actions.getMallGoods({
            category_id,
            brand_id,
            keyword,
            page: 0,
            pageSize: 100000,
            status: -1,
            sort
        })
    }
    _onPublish =()=>{
        const {actions} = this.props
        const {
            activity_id,
            title,
            begin_time,
            end_time,
            goods_limit,
            status,
            goods_amount,
            way,

            pay_total,
            sub_total,

            goods_num,
            goods_discount,
            goods_type,

        } = this.state

        
        let cond_fir = ''
        let cond_sec = ''
        let goods_ids = ''

        if(goods_type == 1){
           
            goods_ids = this.refs.goodsbox.getValue().join(',')
            if(goods_ids == ''){ message.info('请选择商品'); return; }
        }
        if(!title){ message.info('请输入名称'); return;}
        if(begin_time==''||end_time==''){ message.info('请选择时间'); return; }
        if(way == 0){
            cond_fir = pay_total
            cond_sec = sub_total
            if(cond_fir == ''||cond_sec == ''||isNaN(cond_fir)||isNaN(cond_sec)){
                message.info('请输入正确的满减价格'); return;
            }
        }else{
            cond_fir = goods_num
            cond_sec = goods_discount
        }

        this.setState({
            publishLoading:true
        })
        actions.publishGoodsActive({
            activity_id,
            title,
            begin_time,
            end_time,
            goods_limit,
            status,
            goods_ids,
            goods_amount,
            way,
            cond_fir,
            cond_sec,
            resolved:(data)=>{
                this.setState({
                    publishLoading:false
                })
                message.success({
                    content:'提交成功',
                })
                window.history.back()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }

    disabledDate = (current)=>{
        return current < moment().subtract(1, 'day')
    }
    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 20 },
            },
        }
        const {category_id} = this.state
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={this.state.view_mode?'查看促销':this.activity_id==0?"添加促销":'修改促销'}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        
                                        <Form.Item label="名称">
                                           <Input 
                                                onChange={e=>{
                                                    this.setState({ title:e.target.value })
                                                }}
                                                value={this.state.title} 
                                                className="m_w400" 
                                                placeholder="输入名称" 
                                            />
                                        </Form.Item>

                                        <Form.Item label="活动时间">
                                            <DatePicker.RangePicker showTime ={{format:'HH:mm'}} style={{width:400}} format='YYYY-MM-DD HH:mm' allowClear={false} value={this.state.aTime} locale={locale} onChange={(date,dateString)=>{
                                                console.log(date)
                                                this.setState({
                                                    aTime:date,
                                                    begin_time:dateString[0],
                                                    end_time:dateString[1]
                                                })
                                            }}></DatePicker.RangePicker>
                                        </Form.Item>
                                        {/*<Form.Item label="优先级">
                                            <InputNumber
                                                min={0} max={127}
                                                onChange={val=>{
                                                    if(val !== ''&&!isNaN(val)){
                                                        //val = Math.round(val)
                                                        if(val<0) val=0
                                                        //this.setState({edit_duration:val})
                                                    }
                                                }}
                                                defaultValue={''}
                                            />
                                            <div>优先级取整数</div>
                                        </Form.Item>
                                        
                                        <Form.Item label="优惠范围">
                                            <Select className="m_w400" defaultValue={0}>
                                                <Select.Option value={0}>全部</Select.Option>
                                                <Select.Option value={1}>视频课程</Select.Option>
                                                <Select.Option value={2}>图文课程</Select.Option>
                                                <Select.Option value={3}>音频课程</Select.Option>
                                                <Select.Option value={4}>直播课程</Select.Option>
                                                <Select.Option value={5}>商城</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="使用场景">
                                            <Select className="m_w400" defaultValue={0}>
                                                <Select.Option value={0}>订单价格</Select.Option>
                                                <Select.Option value={1}>商品数量</Select.Option>
                                                <Select.Option value={2}>单一商品数量</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="数量区间">
                                            <InputGroup compact>
                                                <Input style={{ width: 100, textAlign: 'center' }} placeholder="最小数量" />
                                                <Input
                                                    style={{
                                                        width: 30,
                                                        borderLeft: 0,
                                                        pointerEvents: 'none',
                                                        backgroundColor: '#fff',
                                                    }}
                                                    placeholder="~"
                                                    disabled
                                                />
                                                <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大数量" />
                                            </InputGroup>
                                        </Form.Item>
                                        */}
                                        <Form.Item label="促销方式">
                                            <Radio.Group value={this.state.way} onChange={e=>{
                                                this.setState({way:e.target.value})
                                            }}>
                                                <Radio value={0}>满减</Radio>
                                                <Radio value={1}>多买多折</Radio>
                                            </Radio.Group>
                                            {this.state.way ==1?
                                            <div>
                                                {/* <Select style={{width:200}} value={this.state.goods_num} onChange={goods_num=>this.setState({goods_num})}>
                                                    <Select.Option value={'1'}>1件</Select.Option>
                                                    <Select.Option value={'2'}>2件</Select.Option>
                                                    <Select.Option value={'3'}>3件</Select.Option>
                                                </Select> */}
                                                
                                                <InputNumber min={1} value={this.state.goods_num} onChange={goods_num=>{
                                                    if(goods_num % 1 !== 0){
                                                        goods_num = Math.floor(goods_num)
                                                    }
                                                    this.setState({ goods_num })
                                                }}></InputNumber>
                                                <span className='m_2'>件</span>
                                                <Select style={{width:200}} value={this.state.goods_discount} onChange={goods_discount=>this.setState({goods_discount})}>
                                                    <Select.Option value={"0.1"}>1折</Select.Option>
                                                    <Select.Option value={"0.2"}>2折</Select.Option>
                                                    <Select.Option value={"0.3"}>3折</Select.Option>
                                                    <Select.Option value={"0.4"}>4折</Select.Option>
                                                    <Select.Option value={"0.5"}>5折</Select.Option>
                                                    <Select.Option value={"0.6"}>6折</Select.Option>
                                                    <Select.Option value={"0.7"}>7折</Select.Option>
                                                    <Select.Option value={"0.8"}>8折</Select.Option>
                                                    <Select.Option value={"0.9"}>9折</Select.Option>
                                                </Select>
                                            </div>
                                            :
                                            <div>
                                                <span style={{paddingRight:'10px'}}>满</span>
                                                <Input
                                                    style={{width:100}}
                                                    onChange={e=>{
                                                        this.setState({ pay_total:e.target.value })
                                                    }}
                                                    value={this.state.pay_total}
                                                />
                                                <span style={{padding:'0 10px'}}>减</span>
                                                <Input
                                                    style={{width:100}}
                                                    onChange={e=>{
                                                        this.setState({ sub_total:e.target.value })
                                                    }}
                                                    value={this.state.sub_total}
                                                />
                                            </div>
                                            }
                                        </Form.Item>
                                        <Form.Item label="促销商品">
                                            <Select style={{width:200}} className='m_2' value={this.state.goods_type} onChange={goods_type=>this.setState({ goods_type })}>
                                                <Select.Option value={0}>全部商品</Select.Option>
                                                <Select.Option value={1}>部分商品</Select.Option>
                                            </Select>
                                            {this.state.goods_type == 0?null:
                                                <Select
                                                    className='m_2'
                                                    style={{width:200}}
                                                    placeholder="选择分类"
                                                    onChange={val=>this.setState({ category_id:val,targetKeys:[] },()=>{this.getMallGoods()})}
                                                    value={category_id}
                                                >
                                                    <Select.Option value={0}>全部分类</Select.Option>
                                                    {this.goods_cate_list.map(ele=>(
                                                        <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                                    ))}
                                                </Select>
                                            }
                                            {this.state.goods_type == 0?null:
                                                <GoodsBox ref='goodsbox' goodslist={this.state.goodslist} targetKeys={this.state.targetKeys}></GoodsBox>
                                            }
                                        </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button type="primary" ghost onClick={() => window.history.back()}>取消</Button>
                                        &nbsp;
                                        <Button onClick={this._onPublish} loading={this.state.publishLoading} type="primary">提交</Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal 
                    visible={this.state.coursePreviewVisible}
                    maskClosable={true}
                    onCancel={this.handleCancelCourse}
                    okText="发布"
                    cancelText="取消"
                >
                    <img className="block_center" alt="example" style={{ width: '40%' }} src={''} />
                    <div className="text_center">扫码预览</div>
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = PromotionActiveEdit;
const mapStateToProps = state => {
    return {
        goods_active:state.mall.goods_active,
        goods_list:state.mall.goods_list,
        goods_cate_list: state.mall.goods_cate_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});