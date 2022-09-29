import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber } from 'antd'
import moment from 'moment'
import SwitchCom from '../../components/SwitchCom';

class Province extends Component {
    state = {
        view_mode: false,
        isFcShow: 0,
        name: '标签管理',
        keyword:''
    }
    data_list = []
    page_current = 0
    page_total = 0
    page_size = 10

    componentWillMount() {
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }
        this.getStaticCourse()
    }
    componentWillReceiveProps(n_props) {
        if (n_props.data_list !== this.props.data_list) {
            this.data_list = n_props.data_list.data;
            this.page_total = n_props.data_list.total
            this.page_current = n_props.data_list.page + 1
        }
    }
    showModal = (regionId, regionName, sFcShow) => {
        this.setState({
            editPanel: true,
            regionName: regionName,
            regionId: regionId,
            isFcShow: sFcShow
        })
    }
    onClick = (regionId) => {
        const { actions } = this.props
        actions.deleteRank({
            region_id: regionId,
            actions: 'delete',
            resolved: (data) => {
                actions.getRank(this.page_current-1, this.keywords, this.page_size)
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    onPublish = () => {
        const { regionName, isFcShow, isFc, edit_index, data_list, regionId ,keyword} = this.state
        if (regionName == '') { message.info('请输入名称'); return; }

        if (edit_index == -1) {
            const item = {
                id: Date.now().toString(),
                regionName,
                isFcShow
            }
            this.setState({ data_list: [item, ...data_list], editPanel: false })
        } else {
            const set_list = this.data_list.filter(item => item.regionId == regionId)
            if (isFcShow != set_list[0].isFcShow) {
                const { actions } = this.props
                actions.deleteRank({
                    region_id: regionId,
                    actions: 'delete',
                    resolved: (data) => {
                        this.setState({ editPanel: false })
                        actions.getRank(this.page_current-1, keyword, this.page_size)
                    },
                    rejected: (data) => {
                        message.error(data)
                    }
                })
            } else {
                this.setState({ editPanel: false })
            }
        }
    }
    getStaticCourse = ()=>{
        const {ccategoryId,keyword,category_id} = this.state
        this.props.actions.getRank(this.page_current,keyword,this.page_size)
    }
    render() {
        const { view_mode } = this.state
        return (
            <div className="animated fadeIn">
                <Card title='风采省份管理' extra={
                    <>
                    </>
                }>

                    <Table
                        columns={this.col}
                        rowSelection={{
                            selectedRowKeys: this.state.keys,
                            onChange: (keys) => {
                                this.setState({ keys })
                            }
                        }}
                        rowKey='regionId'
                        dataSource={this.data_list}

                        pagination={{
                            defaultCurrent: this.page_current+1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper: true,
                            onChange: (val) => {
                                let pathname = this.props.history.location.pathname
                                this.props.history.replace(pathname + '?page=' + val)
                                this.page_current = val - 1
                                this.getStaticCourse()

                            },
                            showTotal: (total) => '总共' + total + '条'
                        }}
                    />
                </Card>

                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    visible={this.state.editPanel}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ editPanel: false })
                    }}
                    title="设置"
                    okText='确定'
                    cancelText='取消'
                    onOk={this.onPublish}
                >
                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <Form.Item label='省份名称'>
                            <Input value={this.state.regionName} disabled={true} onChange={e => this.setState({ regionName: e.target.value })}></Input>
                        </Form.Item>
                        <Form.Item label='状态'>
                            <SwitchCom value={this.state.isFcShow} onChange={isFcShow => this.setState({ isFcShow })}></SwitchCom>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex: 'regionId', key: 'regionId', title: 'ID' },
        { dataIndex: 'regionName', key: 'regionName', title: '省份名称', ellipsis: true },

        {
            dataIndex: 'isFcShow', key: 'isFcShow', title: '状态', render: (item, ele, index) => {
                return ele.isFcShow == 1 ? '已启用' : '未启用'
            }
        },
        {
            width: 250, dataIndex: '', key: '', title: '操作', render: (item, ele, index) => {
                return (
                    <>
                        <Button size='small' type={ele.isFcShow == 1 ? 'primary' : ''} className='m_2' onClick={this.onClick.bind(this, ele.regionId)}>{ele.isFcShow == 1 ? '禁用' : '启用'}</Button>

                        {/* <Button size='small' className='m_2' onClick={()=>{
                        this.props.history.push('/meetting/activity/view/1')
                    }}>查看</Button> */}
                        <Button size='small' className='m_2' onClick={this.showModal.bind(this, ele.regionId, ele.regionName, ele.isFcShow)}>设置</Button>
                    </>
                )
            }
        },

    ]
    // class_col = [
    //     { dataIndex: 'id', key: 'id', title: 'ID' },
    //     { dataIndex: 'title', key: 'title', title: '栏目名称', ellipsis: true },

    //     {
    //         dataIndex: 'isFcShow', key: 'isFcShow', title: '状态', render: (item, ele, index) => {
    //             return ele.isFcShow == 1 ? '已启用' : '未启用'
    //         }
    //     },
    //     {
    //         width: 250, dataIndex: '', key: '', title: '操作', render: (item, ele, index) => {
    //             return (
    //                 <>
    //                     <Button size='small' type={ele.isFcShow == 1 ? 'primary' : ''} className='m_2' onClick={() => {
    //                         const { data_list } = this.state
    //                         data_list[index].isFcShow = !data_list[index].isFcShow
    //                         this.setState({ data_list })
    //                     }}>{ele.isFcShow == 1 ? '禁用' : '启用'}</Button>

    //                     {/* <Button size='small' className='m_2' onClick={()=>{
    //                     this.props.history.push('/meetting/activity/view/1')
    //                 }}>查看</Button> */}
    //                     <Button size='small' className='m_2' onClick={() => {
    //                         this.setState({ editPanel: true, edit_index: index, title: ele.title, isFcShow: ele.isFcShow })
    //                     }}>设置</Button>

    //                     <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={() => {
    //                         const { data_list } = this.state
    //                         data_list.filter(_ele => _ele.id !== ele.id)
    //                         this.setState({ data_list: data_list.filter(_ele => _ele.id !== ele.id) })
    //                     }}>
    //                         <Button size='small' className='m_2'>删除</Button>
    //                     </Popconfirm>
    //                 </>
    //             )
    //         }
    //     },

    // ]
}

const LayoutComponent = Province;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        data_list: state.system.rank_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
