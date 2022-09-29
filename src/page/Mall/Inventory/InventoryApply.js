import React, { Component } from 'react';
import { Row ,Col, TabPane} from 'reactstrap';
import { PageHeader,Tag,Checkbox,Tabs,DatePicker,Popconfirm,message,Pagination,Switch,Modal,Form,Card,Select ,Input,Button, Radio} from 'antd';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import InventoryGoodsBox from '../../../components/InventoryGoodsBox'
import TextArea from 'antd/lib/input/TextArea';

class InventoryApply extends Component {
    state = {
        goodslist: [],
        category_id: 0,
        brand_id: 0,
        keyword: '',
        sort: 0,
        targetKeys:[],

        remark:'',

        goodsNum:'',
        supplierName:'',
        managerName:'',
        orderSn:'',
        edit_index:-1,
        itype:0,
        attrStockMaps:[]
    }
    goodslist = []
    itype = 0

    componentWillMount(){
        this.itype = this.props.match.params.id
        this.getMallGoods()
    }
    componentWillReceiveProps(n_props){
        if(n_props.goods_list !== this.props.goods_list){
            console.log(this.itype)
            // console.log(n_props.goods_list.data)
            // this.setState({ goodslist:n_props.goods_list.data })
            this.goodslist = n_props.goods_list.data
        }
    }
    getMallGoods = ()=>{
        const {actions} = this.props
        const { keyword,brand_id,sort,category_id } = this.state
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
    _onPublish = ()=>{
        const {actions} = this.props
        const {remark} = this.state
        let goods_list = []

        if(this.refs.goodsbox.filterItem.length==0){ message.info('请选择商品');return }
        console.log(this.refs.goodsbox,'///')
        this.refs.goodsbox.filterItem.map(ele=>{
            const {
                goodsId,
                goodsSn,
                goodsName,
                goodsNum,
                supplierName,
                managerName,
                orderSn,
                attrStockMaps
            } = ele
            console.log(attrStockMaps,'???')
            let lst = []
            if(attrStockMaps.length>0){
                attrStockMaps.map(item=>{
                    lst.push(item.goodsAttrIds)
                })
               
            }
            let  goodsAttrId = lst.toString()
            goods_list.push({
                goodsId,
                goodsSn,
                goodsName,
                goodsNum,
                supplierName,
                managerName,
                orderSn,
                goodsAttrId
            })
        })
        actions.publishInventory({
            itype: this.itype,
            remark: remark,
            goods_list: JSON.stringify(goods_list),
            resolved:(data)=>{
                message.success({
                    content:'提交成功',
                    onClose:()=>{
                        window.history.back()
                    }
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    onConfirm = ()=>{
        const {
            goodsNum,
            supplierName,
            managerName,
            orderSn,
            edit_index
        } =this.state

        if(this.itype==1&&orderSn==''){ message.info('请输入单号');return; }
        if(goodsNum==''){ message.info('请输入商品数量');return; }
        if(goodsNum>999){ message.info('商品数量不能超过999');return; }

        this.refs.goodsbox.setState(pre=>{
            const {dataSource} = pre
            dataSource[edit_index].goodsNum = goodsNum
            dataSource[edit_index].supplierName = supplierName
            dataSource[edit_index].managerName = managerName
            dataSource[edit_index].orderSn = orderSn
            return {dataSource}
        })
        this.setState({ 
            showEditPanel:false,
        })
    }
    leftTableColumns = [
        {
            dataIndex: 'key',
            title: 'ID',
        },
        {
            dataIndex: 'goodsSn',
            title: '货号',
        },
        {
            dataIndex: 'title',
            title: '名称',
            ellipsis:true,
        },
        {
            dataIndex: '',
            title: '库存数',
            render:(item,ele)=>{
                let num = 0
                ele.attrStockMaps.map(item=>{
                    num = num+item.stock
                })
                return num
            }
        }
    ]
    render(){
        
        const rightTableColumns = [
            { dataIndex: 'key',title: 'ID',},
            { dataIndex: 'goodsSn',title: '货号',},
            { dataIndex: 'title',title: '名称', ellipsis:true,},
            { dataIndex: '', title: '库存数',render:(item,ele)=>{
                let num = 0
                ele.attrStockMaps.map(item=>{
                    num = num+item.stock
                })
                return num
            }},
            { dataIndex: 'goodsNum', title: '数量',},
            // { dataIndex: 'goodsAttr', title: '规格',},
            { dataIndex: 'supplierName', title: this.itype==0?'供应商名称':'收货人名称',},
            { dataIndex: 'managerName', title: '经办人',},
            { dataIndex: 'orderSn', title: '单号',},
            { dataIndex: 'action', title: '操作',render:(item,ele,index)=>{
                return <a 
                    onClick={(e)=>{ 
                        e.preventDefault();
                        e.stopPropagation();
                        this.setState({
                            goodsNum:ele.goodsNum,
                            supplierName:ele.supplierName,
                            managerName:ele.managerName,
                            orderSn:ele.orderSn,
                            showEditPanel:true,
                            edit_index:ele.index,
                        })
                    }}>编辑</a>
            }},
        ]
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card>
                        <PageHeader
                            className="pad_0"
                            ghost={false}
                            onBack={() => window.history.back()}
                            title=""
                            subTitle={this.itype==0?"入库申请":"出库申请"}
                        >
                            <div className='min_height'>
                                <InventoryGoodsBox 
                                    leftTableColumns={this.leftTableColumns}
                                    rightTableColumns={rightTableColumns} 
                                    itype={this.itype} 
                                    ref='goodsbox' 
                                    goodslist={this.goodslist} 
                                    targetKeys={this.state.targetKeys} 
                                />
                                <div style={{margin:'50px 0',display:'flex'}}>
                                    <span style={{paddingRight:'10px'}}>备注：</span>
                                    <TextArea style={{width:'45%'}} value={this.state.remark} onChange={e=>{
                                        this.setState({remark:e.target.value})
                                    }}></TextArea>
                                </div>
                                <div className="flex f_row j_center">
                                    <Button type="primary" ghost onClick={() => { window.history.go(-1) }} className='m_2'>取消</Button>
                                    <Button onClick={this._onPublish} type="primary" className='m_2'>提交</Button>
                                </div>
                            </div>
                        </PageHeader>
                        
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="编辑"
                    visible={this.state.showEditPanel}
                    onCancel={()=>{
                        this.setState({showEditPanel:false})
                    }}
                    onOk={this.onConfirm}
                    maskClosable={true}
                    closable={true}
                    okText='提交'
                    cancelText='取消'
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form wrapperCol={{span:16}} labelCol={{span:6}}>
                        <Form.Item label='数量'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ goodsNum:e.target.value })
                                }}
                                value={this.state.goodsNum}
                            />
                        </Form.Item>
                        <Form.Item label={this.itype==0?'供应商名称':'收货人'}>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ supplierName:e.target.value })
                                }}
                                value={this.state.supplierName}
                            />
                        </Form.Item>
                        <Form.Item label='经办人'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ managerName:e.target.value })
                                }}
                                value={this.state.managerName}
                            />
                        </Form.Item>
                        <Form.Item label='单号'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ orderSn:e.target.value })
                                }}
                                value={this.state.orderSn}
                            />
                        </Form.Item>
                        {/*
                        <Form.Item label='日期'>
                            <DatePicker popupStyle={{zIndex:6500}} locale={locale} format='YYYY-MM-DD'></DatePicker>
                        </Form.Item>
                        */}
                    </Form>
                </Modal>
            </div>
        )
    }
}
const LayoutComponent =InventoryApply;
const mapStateToProps = state => {
    return {
        goods_list:state.mall.goods_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
