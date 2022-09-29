import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Table, Radio, Pagination, Switch, Modal, Form, Card, Select, Input, Empty, InputNumber, message } from 'antd';

import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';
import {Button,Popconfirm} from '../../components/BtnComponent'

const { Search } = Input;

class GuaGua extends Component {
    state = {
        visible: false,
        ctype:1,
        integral:'',
        itemNum:'',
        item_img:'',
        item_index:0,
        item_name:'',
        rate:'',
        iconList:[]
    };
    activity_id = 18
    data_list = []
    page_total = 0
    page_current = 1
    page_size = 20

    componentWillMount() {
        const {actions} = this.props
        actions.getActiveInfo({activity_id: this.activity_id})
        this.getActiveItem()
    }
    componentWillReceiveProps(n_props) {

        if(n_props.active_info !== this.props.active_info){
            console.log(n_props.active_info)
            this.active_info = n_props.active_info
            this.setState({
                rule:this.active_info.rule,
                coin:this.active_info.integral
            })
        }
        if(n_props.active_item_list !== this.props.active_item_list){
            console.log(n_props.active_item_list)
            this.data_list = n_props.active_item_list.data||[]
            this.page_current = n_props.active_item_list.page + 1
            this.page_total = n_props.active_item_list.total
        }

    }
    getActiveItem = ()=>{
        this.props.actions.getActiveItem({
            activity_id: this.activity_id, page:this.page_current - 1, pageSize:this.page_size
        })
    }
    _onEdit(index){
        const item = this.data_list[index]
        if(!item) return
        const {
            ctype:ctype,
            integral:integral,
            itemImg:item_img,
            itemIndex:item_index,
            itemName:item_name,
            itemNum:itemNum,
            rate:rate
        } = item
        const iconList = [{
            url: item_img,
            type: 'image/png',
            status: 'done',
            name: item_img,
            uid: item_img,
        }]
        const showPanel = true
        this.setState({
            showPanel,ctype,integral,iconList,item_index,item_name,itemNum,rate
        })
    }
    _onPublish = ()=>{

        const {actions} = this.props
        let {
            
            ctype,
            integral,
            itemNum,
            
            item_index,
            item_name,
            rate
        } = this.state
        const item_img = this.refs.iconUpload.getValue()
        const activity_id = this.activity_id

        // if(item_img == ''){ message.info('请上传图片'); return; }
        if(!item_name){
            message.info('请输入卡牌名称')
            return
        }
        if(!item_img){
            message.info('请上传卡牌图片')
            return
        }
        if(rate > 10000){
            message.info('中奖概率不能超过1万')
            return
        }
        if(itemNum > 30000){
            message.info('商品数量不能超过3万')
            return
        }
        if(integral > 30000){
            message.info('金币面额不能超过3万')
            return
        }
        actions.publishActiveItem({
            activity_id,
            ctype,
            integral,
            itemNum,
            item_img,
            item_index,
            item_name,
            rate,
            resolved:(data)=>{
                message.success('提交成功')
                this.getActiveItem()
                this.setState({
                    showPanel: false,
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
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
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title='刮刮卡管理' style={{ minHeight: '400px' }}>
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    {/* <Search
                                        placeholder="关键词"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={keyword}
                                        onChange={(e) => {
                                            this.setState({ keyword: e.currentTarget.value })
                                        }}
                                    /> */}
                                </div>
                                <div>
                                    <Button value='guagua/add' className='m_2' onClick={()=>{
                                        this.setState({ 
                                            showPanel:true,
                                            item_index:-1,
                                            item_name:'',
                                            iconList:[],
                                            itemNum:'',
                                            rate:'',
                                            ctype:1,
                                            integral:''
                                        })
                                    }}>添加</Button>
                                    <Button value='guagua/list' className='m_2' onClick={()=>{
                                        this.props.history.push('/web-manager/guagua/lucky-list')
                                    }}>获奖列表</Button>
                                </div>
                            </div>
                            <div style={{ minHeight: '300px' }}>
                                <Table rowKey='itemIndex' expandIcon={() => null} columns={ this.col } dataSource={this.data_list}  pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    onChange: (val)=>{
                                        this.page_current = val
                                        this.getActiveItem()
                                    },
                                    showTotal:(total)=>'总共'+total+'条'
                                }}/>
                            </div>
                          
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title={this.state.item_index==''?'添加':'修改'}
                    visible={this.state.showPanel}
                    centered
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={()=> { this.setState({ showPanel:false }) }}
                    onOk={this._onPublish}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="卡牌名称">
                            <Input value={this.state.item_name} onChange={(e) => {
                                this.setState({ item_name: e.target.value })
                            }} disabled={this.state.isView} />
                        </Form.Item>
                        <Form.Item label="上传图片">
                            <AntdOssUpload  actions={this.props.actions} disabled={this.state.isView} accept='image/*' value={this.state.iconList} ref='iconUpload'></AntdOssUpload>
                            <div style={{ marginTop: '-20px' }}>(70px * 70px )</div>
                        </Form.Item>
                        <Form.Item label="中奖概率">
                            <InputNumber
                                value={this.state.rate} 
                                onChange={(val) => {
                                    this.setState({ rate: val })
                                }}
                                disabled={this.state.isView}
                                min={0}
                                max={888}
                            />
                        </Form.Item>
                        <Form.Item label="类型">
                            <Radio.Group disabled={this.state.isView} value={this.state.ctype} onChange={e => {
                                this.setState({
                                    ctype: e.target.value,
                                    integral:'',
                                    itemNum:''
                                })
                            }}>
                                <Radio value={0}>无</Radio>
                                <Radio value={1}>金币</Radio>
                                <Radio value={8}>优惠券</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {this.state.ctype==0?null:
                        <>
                        <Form.Item label="面值">
                            {
                                this.state.ctype==4?
                                <Select value={0}>
                                    <Select.Option value={0}>选择优惠券</Select.Option>
                                </Select>:
                                <InputNumber
                                    value={this.state.integral} 
                                    min={0}
                                    max={888}
                                    onChange={(val) => {
                                        this.setState({ integral: val })
                                    }}
                                    disabled={this.state.isView||this.state.ctype==0}
                                />
                            }
                        </Form.Item>
                       
                        <Form.Item label="数量">
                            <InputNumber
                                value={this.state.itemNum} 
                                onChange={(val) => {
                                    this.setState({ itemNum: val })
                                }}
                                disabled={this.state.isView}
                                min={0}
                                max={30000}
                            />
                        </Form.Item>
                        </>
                         }
                    </Form>
                </Modal>
                <Modal visible={this.state.showImg} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImg: false })
                }}>
                    <img alt="预览" style={{ width: '100%' }} src={this.state.url} />
                </Modal>
            </div>
        )
    }
    
    col = [
       
        { title: '卡牌图标', dataIndex: 'itemImg', key: 'itemImg', render: (item, ele) => <img src={ele.itemImg} onClick={() => { this.setState({ showImg: true, url: ele.itemImg }) }} className='head-example-img'></img> },
        { title: '卡牌名称', dataIndex: 'itemName', key: 'itemName' },
        { title: '中奖概率', dataIndex: 'rate', key: 'rate' },
        { title: '奖品类型', dataIndex: 'ctype', key: 'ctype', render: (item, ele) => {
            return ele.ctype == 0 ? '无' : ele.ctype == 1 ?'金币':ele.ctype == 2?'实物':'优惠券'
        }},
        { title: '面值', dataIndex: 'integral', key: 'integral' },
        { title: '商品数量', dataIndex: 'itemNum', key: 'itemNum' },
        { 
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    {/* <Button type="primary" size={'small'} className='m_2' onClick={his.showModal.bind(this, "查看", index, ele.parentId)}></Button> */}
                    <Button value='guagua/edit' type="primary" size={'small'} className='m_2' onClick={this._onEdit.bind(this,index)}>修改</Button>
                    {/* <Button className='m_2' onClick={this._onUpdate.bind(this, index)} type={ele.status == 1 ? "danger" : "primary"} size={'small'} >{ele.status == 1 ? '禁用' : '启用'}</Button> */}
                    {/* <Popconfirm
                        title={"确定删除吗？"}
                        onConfirm={this._onDelete.bind(this, index)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button className='m_2' type="danger" size={'small'}>删除</Button>
                    </Popconfirm> */}
                </div>
            )
        }
    ]
}
const LayoutComponent = GuaGua;
const mapStateToProps = state => {
    return {
        active_info:state.ad.active_info,
        active_item_list:state.ad.active_item_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
