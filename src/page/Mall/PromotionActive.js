import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Table, TabPane, InputNumber, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio } from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment'
import { Button, Popconfirm } from '../../components/BtnComponent'

const { RadioGroup } = Radio;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker

class PromotionActive extends Component {
    state = {
        edit: true,
        view: true,
        visible: false,
        isView: false,
        status: 0,
        tag_id: '',
        tagName: '',
        ttype: 0,
        previewImage: '',
        showImgPanel: false,
        showRefund: false,
        showOrderEdit: false,
        showOrderView: false,
        showPost: false,
        showPostView: false,
        activeTab: '1',
        way: '',
        keyword: '',
        edit_index: -1,
        goods_list: [],
        id_group: [],
    }
    goods_active = []
    page_total = 0
    page_current = 1
    page_size = 10

    getGoodsActive = () => {
        const { actions } = this.props
        const {
            way,
            keyword,
        } = this.state
        actions.getGoodsActive({
            way,
            keyword,
            page: this.page_current - 1,
            pageSize: this.page_size,
        })
    }
    _onPage = (val) => {
        let pathname = this.props.history.location.pathname
        this.props.history.replace(pathname + '?page=' + val)
        this.page_current = val
        this.getGoodsActive()
    }
    _onAction(action, activity_id) {
        const { actions } = this.props
        const { order_sort } = this.state
        if (action == 'order') {
            if (order_sort > 9999) { message.info('排序不能大于 9999'); return }
        }
        console.log(activity_id, action)
        actions.actionGoodsActive({
            activity_id,
            action,
            order_sort,
            resolved: (data) => {
                if (action == 'order') {
                    this.setState({ edit_index: -1 })
                }
                message.success("操作成功")
                this.getGoodsActive()
            },
            rejected: (data) => {
                message.error(data)
            }
        })


    }
    _onSearch = (val) => {
        this.page_current = 1
        this.setState({
            keyword: val
        }, () => { this.getGoodsActive() })
    }
    componentWillMount() {
        const { search } = this.props.history.location

        if (search.indexOf('page=') > -1) {
            this.page_current = search.split('=')[1]
        }
        this.getGoodsActive()
    }

    componentWillReceiveProps(n_props) {

        if (n_props.goods_active !== this.props.goods_active) {
            if (n_props.goods_active.data.length == 0) {
                message.info('暂时没有数据')
            }

            this.goods_active = n_props.goods_active.data
            this.page_total = n_props.goods_active.total
            this.page_current = n_props.goods_active.page + 1

            console.log(this.goods_active)
        }

    }
    handleCancel = () => {
        this.setState({
            visible: false,
            tag_id: '',
        });
    };
    showImgPanel(url) {
        this.setState({
            showImgPanel: true,
            previewImage: url
        });
    }
    hideImgPanel = () => {
        this.setState({
            showImgPanel: false
        });
    }
    _onCheck(val, idx) {
       const{id_group}=this.state
       if(id_group.length>0){
            let leg = id_group.filter(item=>item==val.activityId)
            if(leg.length>0){
                let lst = id_group
                lst = lst.filter(item=>item!=val.activityId)
                this.setState({
                    id_group:lst
                })
            }else{
                let lst = id_group
                lst = lst.concat(val.activityId)
                this.setState({
                    id_group:lst
                })
            }
       }else{
            let lst = id_group
            lst = lst.concat(val.activityId)
            this.setState({
                id_group:lst
            })
       }
      
    }
    onDeletes=()=>{
        const{id_group,order_sort}=this.state
        this.props.actions.actionGoodsActive({
            activity_id:id_group.toString(),
            action:'delete',
            order_sort:order_sort,
            resolved: (data) => {
                this.setState({
                    id_group:[]
                })
                message.success("操作成功")
                this.getGoodsActive()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    render() {
        const {
            keyword
        } = this.state

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
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="促销活动">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>
                                        <Search
                                            placeholder=''
                                            onSearch={this._onSearch}
                                            style={{ maxWidth: 200 }}
                                            value={keyword}
                                            onChange={e => { this.setState({ keyword: e.target.value }) }}
                                        />&nbsp;
                                        <Button onClick={() => { this.page_current = 1; this.getGoodsActive() }}>搜索</Button>
                                    </div>
                                    <div>
                                        <Button value='goodsActive/add' onClick={() => {
                                            this.props.history.push('/mall/goods-active/edit/0')
                                        }}>添加促销</Button>
                                    </div>
                                </div>
                                <div>
                                    <Button size='small' onClick={this.onDeletes}>删除</Button>
                                </div>
                                <Table columns={this.col} dataSource={this.goods_active} rowKey={'activityId'} pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper: true,
                                    onChange: (val) => {
                                        this.page_current = val
                                        this.getGoodsActive()
                                    },
                                    showTotal: (total) => '总共' + total + '条'
                                }}></Table>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal width={800} onCancel={() => { this.setState({ showTopicPannel: false }) }} visible={this.state.showTopicPannel} maskClosable={true} footer={null}>
                    <Table
                        rowKey='goodsId'
                        columns={this.goods_column}
                        dataSource={this.state.goods_list}
                    />
                </Modal>
            </div>
        )
    }
    col = [
        {
            title: '', dataIndex: '', key: '', render: (item,ele, index) => {
                return (
                    <Checkbox
                        data-id={ele.activityId}
                        onChange={this._onCheck.bind(this, ele,index)}
                        // checked={this.state.id_group[index].checked}
                    />
                )
            }
        },
        { title: 'ID', dataIndex: 'activityId', key: 'activityId' },
        { title: '活动名称', dataIndex: 'title', key: 'title' },
        { title: '开始时间', dataIndex: 'beginTime', key: 'beginTime', render: (item, ele) => !ele.beginTime ? "无" : moment.unix(ele.beginTime).format('YYYY-MM-DD HH:ss') },
        { title: '结束时间', dataIndex: 'endTime', key: 'endTime', render: (item, ele) => !ele.endTime ? "无" : moment.unix(ele.endTime).format('YYYY-MM-DD HH:ss') },
        { title: '方式', dataIndex: 'way', key: 'way', render: (item, ele) => ele.way == 1 ? '折扣' : '满减' },
        { title: '金额', dataIndex: 'goodsAmount', key: 'goodsAmount' },
        { title: '数量', dataIndex: 'goodsLimit', key: 'goodsLimit' },
        {
            title: '排序', dataIndex: 'orderSort', key: 'orderSort', render: (item, ele) => (
                this.state.edit_index == ele.activityId ?
                    <InputNumber value={this.state.order_sort} min={0} max={9999} onChange={(val) => this.setState({ order_sort: val })} /> :
                    ele.orderSort
            )
        },
        { title: '状态', dataIndex: 'status', key: 'status', render: (item, ele) => ele.status == 1 ? '已启用' : '未启用' },
        {
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    <Button value='goodsActive/edit' className='m_2' onClick={this._onAction.bind(this, 'status', ele.activityId)} type={ele.status == 1 ? "danger" : "primary"} size={'small'} >{ele.status == 1 ? '禁用' : '启用'}</Button>
                    <Button value='goodsActive/view' type="primary" size={'small'} className='m_2' onClick={() => {
                        this.setState({ showTopicPannel: true, goods_list: ele.goodsList })
                    }}>活动商品</Button>
                    <Button value='goodsActive/edit' type={this.state.edit_index == ele.activityId ? "primary" : ""} size={'small'} className='m_2' onClick={() => {
                        if (this.state.edit_index == -1) {
                            this.setState({ edit_index: ele.activityId, order_sort: ele.orderSort })
                        } else {
                            this._onAction('order', ele.activityId)
                        }
                    }}>{this.state.edit_index == ele.activityId ? "保存排序" : "修改排序"}</Button>
                    <Button value='goodsActive/view' type="primary" size={'small'} className='m_2' onClick={() => {
                        this.props.history.push({
                            pathname: '/mall/goods-active/edit/' + ele.activityId,
                            state: { type: 'view' }
                        })
                    }}>查看</Button>
                    <Button value='goodsActive/edit' type="primary" size={'small'} className='m_2' onClick={() => {
                        this.props.history.push({
                            pathname: '/mall/goods-active/edit/' + ele.activityId,
                            state: { type: 'edit' }
                        })
                    }}>修改</Button>
                    <Popconfirm
                        value='goodsActive/del'
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this._onAction.bind(this, 'delete', ele.activityId)}
                    >
                        <Button type="danger" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]
    goods_column = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId', width: 100 },
        { title: '商品名称', dataIndex: 'goodsName', key: 'goodsName', ellipsis: true },
    ]
}
const LayoutComponent = PromotionActive;
const mapStateToProps = state => {
    return {
        goods_active: state.mall.goods_active,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
