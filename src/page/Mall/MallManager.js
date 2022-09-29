import React, { Component } from 'react';
import { Tooltip, Table, TabPane, Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio, InputNumber} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import {Button,Popconfirm} from '../../components/BtnComponent'
import moment from 'moment';
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
        let {tagName} = this.state
        const {actions} = this.props
        if(tagName==' '){ tagName = '' }
        actions.setGoodsTag({
            goods_id:this.goods_id,
            tagName:tagName,
            resolved:()=>{
                message.success('提交成功')
                this.setState({ showHotTag:false,tagName:'' })
                this.getMallGoods()
            },
            rejected:(data)=>{
                message.error(data)
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
                <Card title="商品管理">
                    <div className='min_height'>
                    <div className="flex f_row align_items mb_10 ">
                            <Select
                                className='m_2'
                                style={{ minWidth: '110px' }}
                                placeholder="选择品牌"
                                onChange={val=>this.setState({ brand_id:val })}
                                value={brand_id}
                            >
                                <Select.Option value={0}>全部品牌</Select.Option>
                                {this.goods_brand_list.map(ele=>(
                                    <Select.Option key={ele.brandId} value={ele.brandId}>{ele.brandName}</Select.Option>
                                ))}
                            </Select>
                            <Select
                                className='m_2'
                                style={{ minWidth: '110px' }}
                                placeholder="选择分类"
                                onChange={val=>this.setState({ category_id:val })}
                                value={category_id}
                            >
                                <Select.Option value={0}>全部分类</Select.Option>
                                {this.goods_cate_list.map(ele=>(
                                    <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                ))}
                            </Select>
                            <Select
                                className='m_2'
                                placeholder="上下架状态"
                                style={{ minWidth: '130px' }}
                                onChange={val=>this.setState({ status:val })}
                                value={status}
                            >
                                <Select.Option value={-1}>全部状态</Select.Option>
                                <Select.Option value={0}>未上架</Select.Option>
                                <Select.Option value={1}>已上架</Select.Option>
                            </Select>
                            <Select
                                className='m_2'
                                placeholder="选择排序"
                                style={{ minWidth: '110px' }}
                                onChange={val=>this.setState({ sort:val })}
                                value={sort}
                            >
                                <Select.Option value={0}>默认排序</Select.Option>
                                <Select.Option value={1}>销售量</Select.Option>
                                <Select.Option value={2}>发布日期</Select.Option>
                            </Select>
                            <Search
                                className='m_2'
                                placeholder=''
                                onSearch={this._onSearch}
                                style={{ maxWidth: 200 }}
                                value={keyword}
                                onChange={e=>this.setState({ keyword:e.target.value })}
                            />
                            <Button onClick={this._onFilter}>查找</Button>
                        <div style={{flexGrow:1}}>
                            <Input.Group compact style={{float:'right'}}>
                                <Button value='goods/time' onClick={()=>{
                                    this.setState({ showPostTime:true })
                                }} >设置配送时间</Button>
                                <Button value='goods/add' onClick={()=>{
                                    this.props.history.push('/mall/list/edit/0')
                                }} >添加商品</Button>
                            </Input.Group>
                        </div>
                    </div>
                    <div>
                        <Button value='goods/status' size='small' className='mb_5' onClick={this.actionMallGoods.bind(this,'status',1,'')}>上架</Button>&nbsp;
                        <Button value='goods/status' size='small' className='mb_5' onClick={this.actionMallGoods.bind(this,'status',0,'')}>下架</Button>&nbsp;
                        <Button value='goods/del' size='small' className='mb_5' onClick={this.actionMallGoods.bind(this,'delete',0,'')}>删除</Button>
                    </div>
                    <Table rowKey='goodsId' rowSelection={{selectedRowKeys:this.state.selectedRowKeys,onChange:(value)=>{ this.setState({ selectedRowKeys:value }) }}} columns={this.col} dataSource={this.data_list} pagination={{
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
                                    <Option key={' '}>无</Option>
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
        { title: '商品名称', dataIndex: 'goodsName',width:160, key: 'goodsName',render:(item,ele)=>(
            <div>{ele.goodsName}<br/>
                <span className='be_ll_gray'>
                    <Tooltip title={'/mailPages/pages/mail/mailDesc?goods_id='+ele.goodsId}>
                        <a>查看链接</a>
                    </Tooltip>
                </span>
            </div>
        )},
        { title: '商品图片', dataIndex: 'goodsImg', key: 'goodsImg',render:(item,ele)=>(
            <div>
                <a>
                    <img onClick={this.showImgPanel.bind(this,ele.goodsImg)} className="head-example-img" src={ele.goodsImg} />
                </a>
            </div>
        )},
        { title: '分类', dataIndex: 'categoryName', key: 'categoryName',render:(item,ele)=>{
            let txt = ''
            if(ele.category['length']&&ele.category['length']>0){
                txt += ele.category[0]['categoryName']||''
            }
            if(ele.ccategory['length']&&ele.ccategory['length']>0){
                txt += (' / '+ele.ccategory[0]['categoryName']||'')
            }
            return txt
            
        }},
        { title: '品牌名称', dataIndex: 'brandName', key: 'brandName',render:(item,ele)=>ele.goodsBrand.brandName},
        { title: '成本价', dataIndex: 'cost', key: 'cost' },
        { title: '划线价', dataIndex: 'marketAmount', key: 'marketAmount' },
        { title: '销售价', dataIndex: '', key: '',render:(item,ele)=>{
            if(ele.gtype==1)
                return <Tag>免费</Tag>
            else if(ele.gtype==2)
                return <Tag>现金 {ele.goodsAmount}</Tag>
            else if(ele.gtype==3)
                return <Tag>金币 {ele.goodsIntegral}</Tag>
            else if(ele.gtype==4)
                return <><Tag>现金 {ele.goodsAmount}</Tag><Tag>金币 {ele.goodsIntegral}</Tag></>
        }},
        { title: '售出', dataIndex: 'saleNum', key: 'saleNum' },
        { title: '库存数', dataIndex: 'stock', key: 'stock' }, 
        { title: '上架时间', dataIndex: '', key: '',render:(item,ele)=>{
            let begin =  moment.unix(ele.beginTime).format('YYYY-MM-DD HH:mm')
            let pub =  moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            return(
                <>
                {
                    ele.beginTime==0?
                    <div>{pub}</div>
                    :
                    <div>{begin}</div>
                }
                
                </>
            )
        } },   
        { title: '状态', dataIndex: 'status', key: 'status', render: (item, ele) => ele.fstatus == 1 ? '已上架' : '未上架' },
        {   
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    <Tooltip trigger='hover' title={ele.tagMaps.length>0?ele.tagMaps.map(ele=>ele.tagName):'无'}>
                    <Button value='goods/tag' onClick={()=>{
                        this.goods_id = ele.goodsId
                        this.setState({
                            showHotTag:true,
                            tagName:ele.tagMaps.length>0?ele.tagMaps[0].tagName:''
                        })
                    }} type="" size={'small'} className='m_2'>
                        
                            加热销标签
                        
                    </Button>
                    </Tooltip>
                    <Popconfirm
                        value='goods/recomm'
                        title={ele.isRecomm==0?'是否推荐到首页':'是否取消推荐'}
                        okText='是'
                        cancelText='否'
                        onConfirm={this.actionMallGoods.bind(this,'recom','',ele.goodsId)}
                    >
                        <Button type={ele.isRecomm==1?"primary":""} size={'small'} className='m_2'>{ele.isRecomm==1?'取消推荐':'推荐'}</Button>
                    </Popconfirm>
                    <Popconfirm 
                        value='goods/limit'
                        title={ele.timeLimit==1?'是否取消限时抢购':'是否设置限时抢购'}
                        okText='是'
                        cancelText='否'
                        onConfirm={this.actionMallGoods.bind(this,'timeLimit','',ele.goodsId)}
                    >
                        <Button type={ele.timeLimit==1?"primary":""} size={'small'} className='m_2'>{ele.timeLimit==1?'取消限时抢购':'限时抢购'}</Button>
                    </Popconfirm>
                    <Button value='goods/status' onClick={this.actionMallGoods.bind(this,'status',ele.fstatus==1?0:1,ele.goodsId)} type={ele.status==1?'primary':''} size={'small'} className='m_2'>{ele.fstatus==1?'下架':'上架'}</Button>
                    <Button onClick={()=>{
                        this.props.history.push({
                            pathname:'/mall/list/edit/'+ele.goodsId,
                            state:{type:'view'}
                        })
                    }} type="" size={'small'} className='m_2'>查看</Button>
                    <Button value='goods/edit' onClick={()=>{
                        this.props.history.push({
                            pathname:'/mall/list/edit/'+ele.goodsId,
                            state:{type:'edit'}
                        })
                    }} type="" size={'small'} className='m_2'>修改</Button>
                    <Popconfirm
                        value='goods/del'
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.actionMallGoods.bind(this,'delete',0,ele.goodsId)}
                    >
                        <Button type="danger" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
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
