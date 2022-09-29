import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { Table, TabPane, Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio, InputNumber} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import {Button,Popconfirm} from '../../../components/BtnComponent'

const {RadioGroup} = Radio;
const {Option} = Select;
const {Search} = Input;
const {RangePicker} = DatePicker
class MallManager extends Component {
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

        showPostTime:false,
        showAddProduct:false,
        showHotTag:false,
        payType:0,

        activeTab:'1',
        fetching:false,
        selectData:[],
        selectValue:[],

        brand_id:0,
        category_id:0,
        keyword:'',
        status:-1,
        sort:0,
        selectedRowKeys:[],
        delivery_time:''

    };
    goods_cate_list = []
    goods_brand_list = []
    data_list = []
    page_total=0
    page_current=1
    page_size=10
    _onPage = (val)=>{
        let pathname = this.props.history.location.pathname
        this.props.history.replace(pathname+'?page='+val)
        this.page_current = val
        this.getMallGoods()
    }
    _onSearch = (val)=>{
        this.page_current = 1
        this.setState({  keyword:val },()=>{
            this.getMallGoods()
        })
    }
    _onFilter = ()=>{
        this.page_current = 1
        this.getMallGoods()
    }
  
    componentWillMount(){
        
        const {search} = this.props.history.location
        if(search.indexOf('page=') > -1){
            this.page_current = search.split('=')[1]
        }
        this.getMallGoods()
        this.getGoodsBrand()
        this.getGoodsCate()
    }

    componentWillReceiveProps(n_props){
       
        if(n_props.goods_list !==this.props.goods_list){
            if(n_props.goods_list.data.length == 0){
                message.info('暂时没有数据')
            }
            this.data_list = n_props.goods_list.data
            this.page_total=n_props.goods_list.total
            this.page_current=n_props.goods_list.page+1
        }
        if (n_props.goods_brand_list !== this.props.goods_brand_list) {
            console.log(n_props.goods_brand_list)
            this.goods_brand_list = n_props.goods_brand_list.data
        }
        if(n_props.goods_cate_list !==this.props.goods_cate_list){
            console.log(n_props.goods_cate_list)
            this.goods_cate_list = n_props.goods_cate_list.data
        }
        
    }
    getMallGoods = ()=>{
        const {actions} = this.props
        const { keyword,brand_id,status,sort,category_id } = this.state
        actions.getMallGoods({
            category_id,
            brand_id,
            keyword,
            page: this.page_current-1,
            pageSize: this.page_size,
            status,
            sort
        })
    }
    getGoodsBrand = ()=>{
        const {actions} = this.props
        actions.getGoodsBrand({
            keyword:'', page:0 ,pageSize:200000
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
    setPostTime = (e)=>{
        this.setState({ delivery_time:e.target.value })
    }
    _onPublishTag = ()=>{
        const {tagName} = this.state
        const {actions} = this.props
        if(tagName==''){ message.info('请选择标签'); return; }
        actions.setGoodsTag({
            goods_id:this.goods_id,
            tagName:tagName,
            resolved:()=>{
                message.success('提交成功')
                this.setState({ showHotTag:false,tagName:'' })
            }
        })
    }
    _onSetPostTime = ()=>{
        const {delivery_time} = this.state
        if(delivery_time==''||isNaN(delivery_time)){
            message.info('请输入正确的时间')
            return
        }
        const {actions} = this.props
        actions.setGoodsTime({
            delivery_time,
            resolved:()=>{
                this.setState({showPostTime:false,delivery_time:''})
                message.success('提交成功')
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    
    actionMallGoods(action,status,id){
        const { selectedRowKeys } = this.state
        const {actions} = this.props

        let goods_ids = ''
        if(id !== ''){
            goods_ids = id
        }else if(selectedRowKeys.length == 0){
            message.info('请选择商品')
            return
        }else{
            goods_ids = selectedRowKeys.join(',')
        }
        actions.actionMallGoods({
            action,
            goods_ids,
            status,
            resolved:()=>{
                message.success('提交成功')
                this.getMallGoods()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
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
        const {keyword,brand_id,category_id,sort,status} = this.state
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="库存管理">
                            <div className='min_height'>
                            <div className="flex f_row align_items mb_10 ">
                                <Search
                                    className='m_2'
                                    placeholder='商品名称／货号'
                                    onSearch={this._onSearch}
                                    style={{ maxWidth: 200 }}
                                    value={keyword}
                                    onChange={e=>this.setState({ keyword:e.target.value })}
                                />
                                <div style={{flexGrow:1}}>
                                    <Button value='inventory/export' loading={this.state.loading} style={{float:'right'}} onClick={()=>{
                                        this.setState({ loading:true })
                                        const {actions} = this.props
                                        actions.exportInventoryGoods({
                                            resolved:(data)=>{
                                                const {fileName,adress,name} = data
                                                let url = fileName||adress||name

                                                message.success('导出成功')
                                                this.setState({ loading:false },()=>{window.open(url,'_black')})
                                            },
                                            rejected:(data)=>{
                                                message.error(data)
                                                this.setState({ loading:false })
                                            }
                                        })
                                    }}>导出</Button>
                                </div>
                            </div>
                            <Table rowKey='goodsId'  columns={this.col} dataSource={this.data_list} pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    onChange: (val)=>{
                                        this.page_current = val
                                        this.getMallGoods()
                                    },
                                    showTotal:(total)=>'总共'+total+'条'
                                }}/>
                            </div>
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={90}
					title="热销标签选择"
					visible={this.state.showHotTag}
					okText="提交"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showHotTag:false })
                    }}
					onOk={this._onPublishTag}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form {...formItemLayout}>
                        <Form.Item label='标签设置'>
                            <Input.Group compact>
                                <Select
                                    value={this.state.tagName}
                                    placeholder="选择标签"
                                    filterOption={false}
                                    onChange={(val)=>{
                                        this.setState({ tagName:val })
                                    }}
                                    style={{ width: '300px' }}
                                >
                                    <Option key={'HOT'}>HOT</Option>
                                    <Option key={'NEW'}>NEW</Option>
                                    <Option key={'热销'}>热销</Option>
                                    <Option key={'推荐'}>推荐</Option>
                                    <Option key={'限量'}>限量</Option>
                                    <Option key={'特价'}>特价</Option>
                                    <Option key={'专属'}>专属</Option>
                                    <Option key={'清仓'}>清仓</Option>
                                </Select>
                                {/*
                                <Button onClick={this.addTmp}>添加</Button>
                                */}
                            </Input.Group>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
					title="配送时间"
					visible={this.state.showPostTime}
					okText="确定"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showPostTime:false })
                    }}
					onOk={this._onSetPostTime}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form {...formItemLayout}>
                        <Form.Item label='配送时间（小时）'>
                            <Input onChange={this.setPostTime}></Input>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
					title="修改"
					visible={this.state.showEditPanel}
					okText="提交"
					cancelText="关闭"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showEditPanel:false })
                    }}
					onOk={null}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form {...formItemLayout}>
                        <Form.Item label='名称'>
                            <Input
                                onChange={(e)=>{
                                    
                                }}
                                placeholder='请输入名称'
                                defaultValue='顺丰快递'
                            />
                        </Form.Item>
                        <Form.Item label='官网'>
                            <Input
                                onChange={(e)=>{
                                    
                                }}
                                placeholder='请输入官网链接'
                                defaultValue='http://www.sf-express.com'
                            />
                        </Form.Item>
                        <Form.Item label='结算方式'>
                            <Radio.Group defaultValue={0}
                                onChange={e=>{
                                    this.setState({ payType:e.target.value })
                                }}
                            >
                                <Radio value={0}>按重量</Radio>
                                <Radio value={1}>按件数</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='首重'>
                            <InputNumber defaultValue='23' min={0} max={800000}/>&nbsp;KG&nbsp;&nbsp;
                            <InputNumber defaultValue='8' min={0} max={800000}/>&nbsp;元&nbsp;&nbsp;
                        </Form.Item>
                        <Form.Item label={this.state.payType===0?'续重':'续件'}>
                            <InputNumber defaultValue='66' min={0} max={800000}/>&nbsp;{this.state.payType===0?'KG':'件'}&nbsp;&nbsp;
                            <InputNumber defaultValue='22' min={0} max={800000}/>&nbsp;元&nbsp;&nbsp;
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    col = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId' },
        { title: '商品货号', dataIndex: 'goodsSn',width:250, key: 'goodsSn' },
        { title: '商品名称', dataIndex: 'goodsName', key: 'goodsName',render:(item,ele)=><div>{ele.goodsName}</div> },
        { title: '售出数', dataIndex: 'saleNum', key: 'saleNum' },
        { title: '库存数', dataIndex: 'stock', key: 'stock',render:(item,ele)=>{
            let num = 0
            ele.attrStockMaps.map(item=>{
                num = num+item.stock
            })
            return num
        } },
        
    ]
}
const LayoutComponent = MallManager;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        goods_list:state.mall.goods_list,
        goods_brand_list: state.mall.goods_brand_list,
        goods_cate_list: state.mall.goods_cate_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
