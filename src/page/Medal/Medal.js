import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Table, List, Icon, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio } from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import {Button,Popconfirm} from '../../components/BtnComponent'

const { Search } = Input;

class Medal extends Component {
    state = {
        edit: true,
        view: true,
        medal_id: 0,
        keyword: '',
        loading: false,
    };
    data_list = []
    page_total = 0
    page_current = 0
    page_size = 10

    componentWillMount() {
       this.getMedal()
    }

    componentWillReceiveProps(n_props) {
       
        if(n_props.medal_list !== this.props.medal_list){
            this.page_current = n_props.medal_list.page
            this.page_total = n_props.medal_list.total
            this.data_list = n_props.medal_list.data||[]
        }
    }

    getMedal = () => {
        this.setState({loading:true})
        this.props.actions.getMedal({
            keyword: this.state.keyword,
            page:this.page_current,
            pageSize:this.page_size,
            resolved:(data)=>{
                this.setState({loading:false})
            },
            rejected:(data)=>{
                this.setState({loading:false})
                message.error(JSON.stringify(data))
            }
        })
    }
    actionMedal(medal_id, action) {
        this.setState({loading:true})
        const { actions } = this.props
        const that = this
        actions.actionMedal({
            medal_id, action,
            resolved: () => {
                that.getMedal()
                this.setState({loading:false})
            }, rejected: (data) => {
                this.setState({loading:false})
                message.error(JSON.stringify(data))
            }
        })
    }
    onSearch = (val) => {
        this.page_current = 0
        this.setState({ keyword: val }, () => {
            this.getMedal()
        })
    }
    showImgPanel(url) {
        this.setState({
            showImgPanel: true,
            previewImage: url
        });
    }
    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="徽章管理">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>
                                        <Search
                                            value={this.state.keyword}
                                            onChange={(e) => { this.setState({ keyword: e.target.value }) }}
                                            onSearch={this.onSearch}
                                            style={{ maxWidth: 200 }}
                                            placeholder='徽章名称'
                                        />
                                    </div>
                                    <div>
                                        <Button value='medal/add' onClick={() => {
                                            this.props.history.push('/member-manager/medal/edit/0')
                                        }}>新增徽章</Button>
                                    </div>
                                </div>
                                <Table loading={this.state.loading} columns={this.col} dataSource={this.data_list} pagination={{
                                    current: this.page_current+1,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper: true,
                                    onChange: (val) => {
                                        this.page_current = val-1
                                        this.getMedal()
                                    },
                                    showTotal: (total) => '总共' + total + '条'
                                }}></Table>
                            </div>

                        </Card>
                    </Col>
                </Row>

                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
    col = [
        {
            title: 'ID',
            dataIndex: 'medalId',
            key: 'medalId',
            ellipsis: false,
        },
        {
            title: '徽章名称',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '图标',
            dataIndex: 'medalImg',
            key: 'medalImg',
            ellipsis: false,
            render: (item, ele) => {
                return <img onClick={this.showImgPanel.bind(this, ele.medalImg)} className="disc head-example-img" src={ele.medalImg} />
            }
        },
        {
            title: '等级',
            dataIndex: 'level',
            key: 'level',
            ellipsis: true,
            render:(item,ele)=>'LV.'+ele.level
        },
        {
            title: '满足条件',
            dataIndex: 'content',
            key: 'condicontenttion',
            ellipsis: false,
        },
        {
            title: '券类型',
            dataIndex: 'summary',
            key: 'summary',
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render: (item, ele) => ele.status == 1 ? '已上架' : '未上架'
        },
        {
            title: '操作',
            dataIndex: 'do',
            key: 'do',
            render: (item, ele) => (
                <div>
                    <Button value='medal/edit' onClick={this.actionMedal.bind(this, ele.medalId, 'status')} type={ele.status == 1 ? "primary" : ''} size={'small'} className='m_2'>{ele.status == 1 ? "下架" : '上架'}</Button>
                    <Button value='medal/view' className='m_2' type="primary" size={'small'} onClick={() => {
                        this.props.history.push({
                            pathname: '/member-manager/medal/view/' + ele.medalId,
                        })
                    }}>
                        查看
                    </Button>
                    <Button value='medal/edit' className='m_2' type="primary" size={'small'} onClick={() => {
                        this.props.history.push({
                            pathname: '/member-manager/medal/edit/' + ele.medalId,
                        })
                    }}>
                        修改
                    </Button>
                    <Popconfirm
                        value='medal/del' 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.actionMedal.bind(this, ele.medalId, 'delete')}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                </div>
            )
        },
    ]
}
const LayoutComponent = Medal;
const mapStateToProps = state => {
    return {
        medal_list: state.user.medal_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
