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

        // if(item_img == ''){ message.info('???????????????'); return; }
        if(!item_name){
            message.info('?????????????????????')
            return
        }
        if(!item_img){
            message.info('?????????????????????')
            return
        }
        if(rate > 10000){
            message.info('????????????????????????1???')
            return
        }
        if(itemNum > 30000){
            message.info('????????????????????????3???')
            return
        }
        if(integral > 30000){
            message.info('????????????????????????3???')
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
                message.success('????????????')
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
                        <Card title='???????????????' style={{ minHeight: '400px' }}>
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    {/* <Search
                                        placeholder="?????????"
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
                                    }}>??????</Button>
                                    <Button value='guagua/list' className='m_2' onClick={()=>{
                                        this.props.history.push('/web-manager/guagua/lucky-list')
                                    }}>????????????</Button>
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
                                    showTotal:(total)=>'??????'+total+'???'
                                }}/>
                            </div>
                          
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title={this.state.item_index==''?'??????':'??????'}
                    visible={this.state.showPanel}
                    centered
                    okText="??????"
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={()=> { this.setState({ showPanel:false }) }}
                    onOk={this._onPublish}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="????????????">
                            <Input value={this.state.item_name} onChange={(e) => {
                                this.setState({ item_name: e.target.value })
                            }} disabled={this.state.isView} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <AntdOssUpload  actions={this.props.actions} disabled={this.state.isView} accept='image/*' value={this.state.iconList} ref='iconUpload'></AntdOssUpload>
                            <div style={{ marginTop: '-20px' }}>(70px * 70px )</div>
                        </Form.Item>
                        <Form.Item label="????????????">
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
                        <Form.Item label="??????">
                            <Radio.Group disabled={this.state.isView} value={this.state.ctype} onChange={e => {
                                this.setState({
                                    ctype: e.target.value,
                                    integral:'',
                                    itemNum:''
                                })
                            }}>
                                <Radio value={0}>???</Radio>
                                <Radio value={1}>??????</Radio>
                                <Radio value={8}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {this.state.ctype==0?null:
                        <>
                        <Form.Item label="??????">
                            {
                                this.state.ctype==4?
                                <Select value={0}>
                                    <Select.Option value={0}>???????????????</Select.Option>
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
                       
                        <Form.Item label="??????">
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
                    <img alt="??????" style={{ width: '100%' }} src={this.state.url} />
                </Modal>
            </div>
        )
    }
    
    col = [
       
        { title: '????????????', dataIndex: 'itemImg', key: 'itemImg', render: (item, ele) => <img src={ele.itemImg} onClick={() => { this.setState({ showImg: true, url: ele.itemImg }) }} className='head-example-img'></img> },
        { title: '????????????', dataIndex: 'itemName', key: 'itemName' },
        { title: '????????????', dataIndex: 'rate', key: 'rate' },
        { title: '????????????', dataIndex: 'ctype', key: 'ctype', render: (item, ele) => {
            return ele.ctype == 0 ? '???' : ele.ctype == 1 ?'??????':ele.ctype == 2?'??????':'?????????'
        }},
        { title: '??????', dataIndex: 'integral', key: 'integral' },
        { title: '????????????', dataIndex: 'itemNum', key: 'itemNum' },
        { 
            width: '250px',
            title: '??????',
            render: (item, ele, index) => (
                <div>
                    {/* <Button type="primary" size={'small'} className='m_2' onClick={his.showModal.bind(this, "??????", index, ele.parentId)}></Button> */}
                    <Button value='guagua/edit' type="primary" size={'small'} className='m_2' onClick={this._onEdit.bind(this,index)}>??????</Button>
                    {/* <Button className='m_2' onClick={this._onUpdate.bind(this, index)} type={ele.status == 1 ? "danger" : "primary"} size={'small'} >{ele.status == 1 ? '??????' : '??????'}</Button> */}
                    {/* <Popconfirm
                        title={"??????????????????"}
                        onConfirm={this._onDelete.bind(this, index)}
                        okText="??????"
                        cancelText="??????"
                    >
                        <Button className='m_2' type="danger" size={'small'}>??????</Button>
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
