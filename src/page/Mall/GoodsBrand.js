import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Table, Radio, Pagination, Switch, Modal, Form, Card, Select, Input, Empty, InputNumber, message } from 'antd';

import connectComponent from '../../util/connect';
import _ from 'lodash'
import * as ComFn from '../../components/CommonFn'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';
import action from '../../redux/action';
import {Button,Popconfirm} from '../../components/BtnComponent'


const { Search } = Input;

class GoodsBrand extends Component {
    state = {
        visible: false,
        editTitle: '添加品牌',
        isView: false,

        keyword: '',
        parent_id: '0',
        categoryId: '0',
        categoryName: '',
        sortOrder: 0,
        status: 0,
        ctype: '18',
        cctype: '-1',
        action: 'none',
        link: '',
        is_must: 0,

        brand_id: 0,
        brand_name: '',
        brand_img: '',
        brand_intro: '',
        link: '',
        status: 1,
        sort_order: 0,
        
        edit: false,
        view: false,

        category_list: [],
        parent_list: []
    };
    parent_list = []
    category_list = []
    page_total = 0
    page_current = 1
    page_size = 10
    getGoodsBrand = ()=>{
        const {actions} = this.props
        const {keyword} = this.state
        actions.getGoodsBrand({
            keyword, page: this.page_current-1 ,pageSize:this.page_size
        })
    }
    componentWillMount() {
        this.getGoodsBrand()
    }
    componentWillReceiveProps(n_props) {
        
        if (n_props.goods_brand_list !== this.props.goods_brand_list) {

            console.log(n_props.goods_brand_list)

            if (n_props.goods_brand_list.data.length == 0) {
                // message.info('暂时没有数据')
            } else {
                this.category_list = n_props.goods_brand_list.data
                this.page_current = n_props.goods_brand_list.page+1
                this.page_total = n_props.goods_brand_list.total
            }
        }

    }

    _onAction = (brand_id,action)=>{
        const {actions} = this.props
        actions.actionGoodsBrand({
            brand_id,
            action,
            resolved:()=>{
                message.success('提交成功')
                this.getGoodsBrand()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val) => {
        this.page_current = 1
        this.setState({ keyword: val },()=>{
            this.getGoodsBrand()
        })
    }
    _onPublish = () => {
        const { actions } = this.props
        const { 
            brand_id,
            brand_name,
            brand_img,
            brand_intro,

            status,
            sort_order
         } = this.state

        let link = ''

        const { iconUpload } = this.refs
        if (typeof iconUpload !== 'undefined') {
            link = iconUpload.getValue()
            if (link == '') {
                message.info('请上传图标')
                return
            }
        }

        // if(sortOrder > 127){ message.info('排序不能大于127'); return; }
        actions.publishGoodsBrand({
            brand_id,
            brand_name,
            brand_img,
            brand_intro,
            link,
            status,
            sort_order,
            resolved: () => {
                this.handleCancel()
                message.success("操作成功")
                this.getGoodsBrand()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    showModal(txt, index) {
        let is_view = false
        if (txt !=='') {
            if (txt == "查看") {
                is_view = true
            }
            const cate_item = this.category_list[index]
            const iconList = [
                { status: 'done', type: 'image/png', url: cate_item.link, uid: Date.now() + 'uid' }
            ]
            this.setState({
                iconList: iconList,
                editTitle: txt,
                isView: is_view,
                visible: true,
                brand_id: cate_item.brandId,
                brand_name:cate_item.brandName,
                sortOrder: cate_item.sortOrder,
                status: cate_item.status
            })
        } else {
            this.setState({
                editTitle: '添加品牌',
                isView: false,
                visible: true,
                sortOrder: 0,
                status: '0',
                iconList: [],
                brand_name:'',
                brand_id:0
            })
        }
    };


    handleCancel = () => {
        this.setState({
            visible: false,
            categoryId: '0',
            action: '',
        });
    };
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
        const { keyword, categoryId, categoryName, sortOrder, status, ctype, cctype, parent_id } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title='商品品牌管理' style={{ minHeight: '400px' }}>
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={keyword}
                                        onChange={(e) => {
                                            this.setState({ keyword: e.currentTarget.value })
                                        }}
                                    />
                                </div>
                                <div>
                                    <Button value='goodsBrand/view' onClick={this.showModal.bind(this, '', '')}>添加品牌</Button>
                                </div>
                            </div>
                            <div style={{ minHeight: '300px' }}>
                                <Table expandIcon={() => null} rowKey='brandId' columns={this.col} dataSource={this.category_list} pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    onChange: (val)=>{
                                        this.page_current = val
                                        this.getGoodsBrand()
                                    },
                                    showTotal:(total)=>'总共'+total+'条'
                                }}/>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    zIndex={9}
                    title={this.state.editTitle}
                    visible={this.state.visible}
                    centered
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    onOk={this._onPublish}
                    bodyStyle={{ padding: "10px" }}
                    footer={this.state.isView ? null : <Button value='goodsBrand/edit' onClick={this._onPublish} type='primary'>提交</Button>}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="品牌名称">
                            <Input disabled={this.state.isView} value={this.state.brand_name} onChange={e=>{ this.setState({ brand_name:e.target.value }) }}></Input>
                        </Form.Item>
                        <Form.Item label="品牌图标">
                            <AntdOssUpload actions={this.props.actions} disabled={this.state.isView} accept='image/*' value={this.state.iconList} ref='iconUpload'></AntdOssUpload>
                            <div style={{ marginTop: '-20px' }}>(70px * 70px )</div>
                        </Form.Item>
                        <Form.Item label="是否启用">
                            <Switch checked={status == 1 ? true : false} disabled={this.state.isView} onChange={(checked) => {
                                if (checked)
                                    this.setState({ status: 1 })
                                else
                                    this.setState({ status: 0 })
                            }} disabled={this.state.isView ? true : false} />
                        </Form.Item>
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
        { title: 'ID编号', dataIndex: 'brandId', key: 'brandId' },
        { title: '品牌名称', dataIndex: 'brandName', key: 'brandName' },
        { title: '图标', dataIndex: 'link', key: 'link', render: (item, ele) => <img src={ele.link} onClick={() => { this.setState({ showImg: true, url: ele.link }) }} className='disc head-example-img'></img> },
        { title: '商品数量', dataIndex: 'goodsNum', key: 'goodsNum' },
        { title: '状态', dataIndex: 'status', key: 'status', render: (item, ele) => ele.status == 1 ? '已启用' : '未启用' },
        {   
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    <Button value='goodsBrand/view' type="primary" size={'small'} className='m_2' onClick={this.showModal.bind(this, "查看", index)}>查看</Button>
                    <Button value='goodsBrand/edit' type="primary" size={'small'} className='m_2' onClick={this.showModal.bind(this, "修改", index)}>修改</Button>
                    <Button value='goodsBrand/edit' className='m_2' onClick={this._onAction.bind(this, ele.brandId, 'status')} type={ele.status == 1 ? "danger" : "primary"} size={'small'} >{ele.status == 1 ? '禁用' : '启用'}</Button>
                    <Popconfirm
                        value='goodsBrand/del'
                        title={"确定删除吗？"}
                        onConfirm={this._onAction.bind(this, ele.brandId, 'delete')}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button className='m_2' type="danger" size={'small'}>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]
}
const LayoutComponent = GoodsBrand;
const mapStateToProps = state => {
    return {
        goods_brand_list: state.mall.goods_brand_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
