import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Table, List, Icon, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio } from 'antd';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import {Button,Popconfirm} from '../../../components/BtnComponent'

const { Search } = Input;
class AuthCourse extends Component {
    state = {
        edit: true,
        view: true,
        course_id: '',
        keyword: '',
        category_id: 0,
    };
    category_list = []
    category_obj = {}
    auth_course_list = []
    page_total = 0
    page_current = 1
    page_size = 12
    cate_ctype = 18
    cate_keyword = ''

    componentWillMount() {
        const { actions } = this.props;
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page + 1
        }
        actions.getAuthCate({ keyword: this.cate_keyword, ctype: this.cate_ctype })
        this.getAuthCourse()
    }

    componentWillReceiveProps(n_props) {
 
        if (n_props.auth_course_list !== this.props.auth_course_list) {
            this.auth_course_list = n_props.auth_course_list.data
            this.page_total = n_props.auth_course_list.total
            this.page_current = n_props.auth_course_list.page + 1
        }
        if (n_props.auth_cate_list !== this.props.auth_cate_list) {
            let category_obj = {}
            if (n_props.auth_cate_list.length !== 0) {
                n_props.auth_cate_list.map(ele => {
                    category_obj[ele.categoryId] = ele.categoryName
                })
                this.category_obj = category_obj
                this.category_list = n_props.auth_cate_list
            }
        }

    }
    _onPage = (val) => {
        let pathname = this.props.history.location.pathname
        this.props.history.replace(pathname + '?page=' + val)
        this.page_current = val + 1
        this.getAuthCourse()
    }
    getAuthCourse = () => {
        const { actions } = this.props
        const { course_id, keyword, category_id } = this.state
        actions.getAuthCourse({
            course_id,
            keyword,
            category_id,
            pageSize: this.page_size,
            page: this.page_current - 1
        })
    }
    _onSearch = (val) => {
        this.setState({
            keyword: val
        }, () => {
            this.getAuthCourse()
        })
    }
    actionCourse(course_id, action) {
        const { actions } = this.props
        const that = this
        actions.actionAuthCourse({
            course_id, action,
            resolved: () => {
                that.getAuthCourse()
            }, rejected: (data) => {
                message.error(data)
            }
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
                        <Card title="视频课程导入">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>

                                        <Select value={this.state.category_id} style={{ width: 200 }} onChange={val => {
                                            this.setState({ category_id: val })
                                        }}>
                                            <Select.Option value={0}>全部</Select.Option>
                                            {this.category_list.map(ele => (
                                                <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                            ))}
                                        </Select>&nbsp;
                                    <Search
                                            value={this.state.keyword}
                                            onChange={(e) => { this.setState({ keyword: e.target.value }) }}
                                            onSearch={this._onSearch}
                                            style={{ maxWidth: 200 }}
                                        />&nbsp;
                                    <Button onClick={this.getAuthCourse}>搜索</Button>
                                    </div>
                                    <div>
                                        <Button value='authVideo/add' onClick={() => {
                                            this.props.history.push('/auth/course/edit/0')
                                        }}>创建课程</Button>
                                    </div>
                                </div>
                                <Table columns={this.col} dataSource={this.auth_course_list} pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper: true,
                                    onChange: (val) => {
                                        this.page_current = val
                                        this.getAuthCourse()
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
            dataIndex: 'courseId',
            key: 'courseId',
            ellipsis: false,
        },
        {
            title: '课程主图',
            dataIndex: 'courseImg',
            key: 'courseImg',
            ellipsis: false,
            render: (item, ele) => {
                return <img onClick={this.showImgPanel.bind(this, ele.courseImg)} className="head-example-img" src={ele.courseImg} />
            }
        },
        {
            title: '课程名称',
            dataIndex: 'courseName',
            key: 'courseName',
            ellipsis: true,
        },
        {
            title: '视频课程分类',
            dataIndex: 'categoryId',
            key: 'categoryId',
            ellipsis: true,
            render: (item, ele) => this.category_obj[ele.categoryId]
        },
        {
            title: '课程摘要',
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
                    <Button  value='authVideo/status'  onClick={this.actionCourse.bind(this, ele.courseId, 'status')} type={ele.status == 1 ? "primary" : ''} size={'small'} className='m_2'>{ele.status == 1 ? "下架" : '上架'}</Button>
                    <Button  value='authVideo/view'  className='m_2' type="primary" size={'small'} onClick={() => {
                        this.props.history.push({
                            pathname: '/auth/course/edit/' + ele.courseId,
                            state: { type: "view" }
                        })
                    }}>
                        查看
                    </Button>
                    <Button value='authVideo/edit'  className='m_2' type="primary" size={'small'} onClick={() => {
                        this.props.history.push({
                            pathname: '/auth/course/edit/' + ele.courseId,
                            state: { type: "edit" }
                        })
                    }}>
                        修改
                    </Button>
                    <Popconfirm
                        value='authVideo/del' 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.actionCourse.bind(this, ele.courseId, 'delete')}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                </div>
            )
        },
    ]
}
const LayoutComponent = AuthCourse;
const mapStateToProps = state => {
    return {
        auth_course_list: state.auth.auth_course_list,
        auth_cate_list: state.auth.auth_cate_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
