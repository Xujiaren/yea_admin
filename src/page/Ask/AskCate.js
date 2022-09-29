import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Table, Radio, Pagination, Switch, Modal, Form, Card, Select, Input, Empty, InputNumber, message } from 'antd';

import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';
import {Button,Popconfirm} from '../../components/BtnComponent'

const { Search } = Input;

class AskCate extends Component {
    state = {
        visible: false,
        editTitle: '添加',
        isView: false,

        keyword: '',
        parent_id: '0',
        categoryId: '0',
        categoryName: '',
        sortOrder: 0,
        status: 0,
        ctype: 10,
        cctype: '-1',
        action: 'none',
        link: '',
        is_must: 1,

        edit: true,
        view: true,

        category_list: [],
        parent_list: []
    };
    parent_list = []
    category_list = []
    page_total = 0
    page_current = 1
    componentWillMount() {
        const { actions } = this.props
        actions.getAuthCate({ keyword: this.state.keyword, ctype: this.state.ctype })
    }
    componentWillReceiveProps(n_props) {
        if (n_props.auth_cate_list !== this.props.auth_cate_list) {
            this.category_list = n_props.auth_cate_list
            this.page_total = n_props.auth_cate_list.length
        }

    }

    _onUpdate(index) {
        const cate_item = this.category_list[index]
        this.setState({
            categoryId: cate_item.categoryId,
            categoryName: cate_item.categoryName,
            status: !cate_item.status ? 1 : 0,
            action: 'status',
        }, () => {
            this._onPublish()
        })
    }
    _onDelete(index) {
        const cate_item = this.category_list[index]
        this.setState({
            categoryId: cate_item.categoryId,
            categoryName: cate_item.categoryName,
            action: 'delete',
        }, () => {
            this._onPublish()
        })
    }
    _onSearch = (val) => {
        const { actions } = this.props
        actions.getAuthCate({ keyword: val, ctype: this.state.ctype })
    }
    _onPublish = () => {
        const { actions } = this.props
        const { is_must, action, categoryId, categoryName, sortOrder, status, ctype, cctype, parent_id } = this.state

        let link = ''

        if (ctype == 96) {
            const { iconUpload } = this.refs
            if (typeof iconUpload !== 'undefined') {
                link = iconUpload.getValue()
                if (link == '') {
                    message.info('请上传图标')
                    return
                }
            }
        }

        // if(sortOrder > 127){ message.info('排序不能大于127'); return; }
        actions.publicAuthCate({
            category_id: categoryId,
            category_name: categoryName,
            ctype: ctype,
            link: link,
            status: status,
            action: action,
            is_must,
            resolved: () => {
                this.handleCancel()
                message.success("操作成功")
                actions.getAuthCate({ keyword: this.state.keyword, ctype: this.state.ctype })
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    showModal(txt, index, parent_id) {
        let is_view = false
        if (txt) {
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
                categoryId: cate_item.categoryId,
                categoryName: cate_item.categoryName,
                sortOrder: cate_item.sortOrder,
                status: cate_item.status,
                ctype: cate_item.ctype,
                cctype: cate_item.cctype,
                is_must: cate_item.isMust,
                parent_id: parent_id + '',
                action: 'none'
            })
        } else {
            this.setState({
                editTitle: '添加分类',
                isView: false,
                visible: true,
                categoryId: '0',
                categoryName: '',
                sortOrder: 0,
                status: '0',
                is_must: 1,
                iconList: []
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
                        <Card title={"问吧分类"} style={{ minHeight: '400px' }}>
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
                                    <Button value='ask/add' onClick={this.showModal.bind(this, '', '', '0')}>添加分类</Button>
                                </div>
                            </div>
                            <div style={{ minHeight: '300px' }}>
                                <Table expandIcon={() => null} rowKey='categoryId' columns={this.col} dataSource={this.category_list} pagination={false} />
                            </div>
                            <div className='mt_10'>{'总共' + this.page_total + '条'}</div>
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
                    footer={this.state.isView ? null : <Button value='ask/cate' onClick={this._onPublish} type='primary'>提交</Button>}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="分类名称">
                            <Input value={categoryName} onChange={(e) => {
                                this.setState({ categoryName: e.target.value })
                            }} disabled={this.state.isView ? true : false} />
                        </Form.Item>
                        {ctype == 96 ?
                            <Form.Item label="分类图标">
                                <AntdOssUpload  actions={this.props.actions} disabled={this.state.isView} accept='image/*' value={this.state.iconList} ref='iconUpload'></AntdOssUpload>
                                <div style={{ marginTop: '-20px' }}>(70px * 70px )</div>
                            </Form.Item>
                        : null}
                        {ctype == 96 ?
                            <Form.Item label="类型">
                                <Radio.Group disabled={this.state.isView} value={this.state.is_must} onChange={e => {
                                    this.setState({
                                        is_must: e.target.value
                                    })
                                }}>
                                    <Radio value={1}>必修</Radio>
                                    <Radio value={0}>选修</Radio>
                                </Radio.Group>
                            </Form.Item>
                        : null}
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
        { title: 'ID', dataIndex: 'categoryId', key: 'categoryId' },
        { title: '分类', dataIndex: 'categoryName', key: 'categoryName' },
        { title: '状态', dataIndex: 'status', key: 'status', render: (item, ele) => ele.status == 1 ? '已启用' : '未启用' },
        {   
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    <Button value='ask/cate' type="primary" size={'small'} className='m_2' onClick={this.showModal.bind(this, "修改", index, ele.parentId)}>修改</Button>
                    <Button value='ask/cate' className='m_2' onClick={this._onUpdate.bind(this, index)} type={ele.status == 1 ? "danger" : "primary"} size={'small'} >{ele.status == 1 ? '禁用' : '启用'}</Button>
                    <Popconfirm
                        value='askCate/del' 
                        title={"确定删除吗？"}
                        onConfirm={this._onDelete.bind(this, index)}
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
const LayoutComponent = AskCate;
const mapStateToProps = state => {
    return {
        auth_cate_list: state.auth.auth_cate_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
