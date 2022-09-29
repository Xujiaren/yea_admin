import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Table as TableAntd, Icon, Tooltip, Empty, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio, Spin } from 'antd';
import PieChart from 'bizcharts/lib/plots/PieChart'

import connectComponent from '../../util/connect';
import _ from 'lodash'
import 'braft-editor/dist/index.css'
import moment from 'moment';
import * as ComFn from '../../components/CommonFn'
import { Button, Popconfirm } from '../../components/BtnComponent'

const { Search } = Input;

class News extends Component {

    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            view: false,
            showImgPanel: false,
            previewImage: '',

            teacher_id: '',
            atype: 0,
            ctype: 11,
            keyword: '',
            result: [],
            news_stat: {
                'num': 0,
                    'col': 0,
                    'read': 0,
                    'com': 0,
                    'tou':0,
                    'fou':'',
                    'zan':'0',
                    'liu':0,
                    'zhuan':0,
                    'fa':0,
            },
            dataSource: [],
            statPanel: false,
            atime: [moment().subtract('days', 30), moment()],
            news_name: '',
            time_type: 0
        }
    }

    news_list = []
    page_total = 0
    page_current = 1
    page_size = 12

    _onPage = (val) => {
        const { actions } = this.props;
        let { keyword, teacher_id, atype, ctype } = this.state

        let pathname = this.props.history.location.pathname
        this.props.history.replace(pathname + '?page=' + val)

        actions.getNews({
            keyword,
            teacher_id,
            atype,
            page: val - 1,
            ctype: ctype,
            pageSize: this.page_size
        })
    }

    _onSearch = (val) => {
        const { actions } = this.props
        let { keyword, teacher_id, atype, ctype } = this.state

        let pathname = this.props.history.location.pathname
        this.props.history.replace(pathname + '?page=1')

        actions.getNews({
            keyword,
            teacher_id,
            atype,
            page: 0,
            pageSize: this.page_size,
            ctype: ctype
        })
        this.setState({
            keyword: val
        })
    }
    actionNews(action, article_id) {

        console.log(action, article_id)
        const { actions } = this.props
        const { keyword, teacher_id, atype, ctype } = this.state
        actions.actionNews({
            article_id,
            action,
            resolved: () => {
                actions.getNews({
                    keyword,
                    teacher_id,
                    atype,
                    page: this.page_current - 1,
                    pageSize: this.page_size,
                    ctype: ctype
                })
                message.success('提交成功')
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    componentWillMount() {
        const { actions } = this.props;
        const { search } = this.props.history.location
        const { teacher_id, atype, keyword, ctype } = this.state
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page + 1
        }

        actions.getNews({
            keyword,
            teacher_id,
            atype,
            page: page,
            pageSize: this.page_size,
            ctype: ctype
        })
    }

    componentWillReceiveProps(n_props) {

        if (n_props.static_course_qrcode_info !== this.props.static_course_qrcode_info) {
            this.setState({ qrcode: n_props.static_course_qrcode_info.data })
        }
        if (n_props.news_list !== this.props.news_list) {
            if (n_props.news_list.data.length == 0) {
                message.info('暂时没有数据')
            }
            //排序
            this.news_list = n_props.news_list.data
            this.page_total = n_props.news_list.total
            this.page_current = n_props.news_list.page + 1
        }

    }
    showCode(course_id) {
        this.setState({
            showCode: true,
            qrcode: ''
        })
        const { actions } = this.props
        actions.getStaticCoursePreviewQrcode({
            course_id,
            ctype: 11
        })
    }
    showResult(articleId) {
        this.setState({ showLoading: true })
        this.props.actions.getNewsResult({
            articleId,
            resolved: (data) => {
                const _result = Object.keys(data).map(ele => ({ type: ele, value: data[ele] }))
                this.setState({ showLoading: false, result: _result, showResult: true })
            },
            rejected: (data) => {
                this.setState({ showLoading: false })
                message.error(JSON.stringify(data))
            }
        })
    }
    render() {
        const { news_stat } = this.state
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="资讯管理">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>
                                        <Search
                                            placeholder=''
                                            onSearch={this._onSearch}
                                            style={{ maxWidth: 200 }}
                                            value={this.state.keyword}
                                            onChange={(e) => {
                                                this.setState({ keyword: e.target.value })
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Button value='news/add' onClick={() => {
                                            this.props.history.push('/news/edit/-1')
                                        }}>添加</Button>
                                    </div>
                                </div>
                                <Table responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>ID</th>
                                            <th>封面</th>
                                            <th>资讯名称</th>
                                            <th>副标题</th>
                                            <th>标签</th>

                                            <th>发布时间</th>
                                            <th style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ marginRight: '5px' }}>排序</span>
                                                <Tooltip placement='right' title={<span style={{ fontSize: '12px' }}>数值越大越靠前</span>}>
                                                    <Icon type="question-circle" size={'small'} />
                                                </Tooltip>
                                            </th>
                                            <th style={{ width: '350px' }}>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.news_list.length == 0 ?
                                            <tr>
                                                <td colSpan={9}>
                                                    <Empty className="mt_20 mb_10" description='暂时没有数据'></Empty>
                                                </td>
                                            </tr>
                                            :
                                            this.news_list.map((ele, index) => (
                                                <tr key={index + '_news'}>
                                                    <td>
                                                    </td>
                                                    <td>{ele.articleId}</td>
                                                    <td>
                                                        <a>
                                                            <img
                                                                onClick={() => {
                                                                    this.setState({ previewImage: ele.articleImg, showImgPanel: true })
                                                                }}
                                                                className="head-example-img"
                                                                src={ele.articleImg}
                                                            />
                                                        </a>
                                                    </td>
                                                    <td className='pad_t20 pad_b20'>
                                                        <Tooltip title={ele.title}>
                                                            <div className='text_more'>{ele.title}</div>
                                                        </Tooltip>
                                                        <div className='be_ll_gray m_w400'>{'/pages/index/consultDesc?articleId=' + ele.articleId}</div>
                                                    </td>
                                                    <td>
                                                        <div className="video_content">
                                                            <Tooltip title={ele.summary}>
                                                                {ele.summary}
                                                            </Tooltip>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {ele.tagList.map((_ele, _index) => (
                                                            _ele ?
                                                                <Tag className='m_2' key={_index + '_tag'}>{_ele.tagName}</Tag>
                                                                : null
                                                        )) || <Tag>无标签</Tag>}
                                                    </td>

                                                    <td>{moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')}</td>
                                                    <td>{ele.sortOrder}</td>
                                                    <td>
                                                        <div>
                                                            <Button value='news/all' className='m_2' size={'small'} onClick={() => {
                                                                this.props.history.push('/todo-list/comment-list/11/' + ele.articleId)
                                                            }}>
                                                                所有评论
                                                            </Button>
                                                            <Button value='news/status' type={ele.status == 1 ? "primary" : ''} size={'small'} className='m_2'
                                                                onClick={this.actionNews.bind(this, 'status', ele.articleId)}
                                                            >
                                                                {ele.status == 1 ? '下架' : '上架'}
                                                            </Button>
                                                            <Button value='news/top' type={ele.isTop == 1 ? "primary" : ''} size={'small'} className='m_2'
                                                                onClick={this.actionNews.bind(this, 'top', ele.articleId)}
                                                            >
                                                                {ele.isTop == 1 ? '取消置顶' : '置顶'}
                                                            </Button>
                                                            <Button value='news/view' onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: '/news/edit/' + ele.articleId,
                                                                    state: { type: 'view' }
                                                                })
                                                            }} type="primary" size={'small'} className='m_2'>查看</Button>
                                                            <Button value='news/edit' onClick={() => {
                                                                this.props.history.push({
                                                                    pathname: '/news/edit/' + ele.articleId,
                                                                    state: { type: 'edit' }
                                                                })
                                                            }} type="primary" size={'small'} className='m_2'>修改</Button>
                                                            <Popconfirm
                                                                value='news/del'
                                                                okText="确定"
                                                                cancelText='取消'
                                                                title='确定删除吗？'
                                                                onConfirm={this.actionNews.bind(this, 'delete', ele.articleId)}
                                                            >
                                                                <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                                                            </Popconfirm>
                                                            <Button value='news/view' className='m_2' onClick={this.showCode.bind(this,ele.articleId)} type="" size={'small'}>
                                                    二维码预览
                                                </Button>
                                                            {/* <Button value='news/view' className='m_2' onClick={() => { message.info({ content: '测试服不支持二维码预览' }) }}>
                                                                二维码预览
                                                            </Button> */}
                                                            <Button value='news/res' size="small" onClick={this.showResult.bind(this, ele.articleId)}>查看结果</Button>
                                                            <Button value='news/view' className='m_2' size='small' onClick={() => {
                                                                const that = this
                                                                that.setState({ news_name: ele.title, dataSource: [], article_id: ele.articleId, statPanel: true }, () => {
                                                                    that.getStatNews()
                                                                })
                                                            }}>数据统计</Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                    </tbody>
                                </Table>
                            </div>
                            <Pagination showTotal={() => ('总共' + this.page_total + '条')} showQuickJumper onChange={this._onPage} pageSize={this.page_size} current={this.page_current} onChange={this._onPage} total={this.page_total} />

                        </Card>
                    </Col>
                </Row>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    title="预览(https方式访问)"
                    visible={this.state.showCode}
                    maskClosable={true}
                    onCancel={() => { this.setState({ showCode: false }) }}
                    okText="确定"
                    cancelText="取消"
                    footer={null}
                >
                    {this.state.qrcode ?
                        <div>
                            <img className="block_center" alt="" style={{ width: '40%' }} src={this.state.qrcode} />
                            <div className="text_center">微信扫码预览</div>
                        </div>
                        : <div>正在加载中。。。</div>}
                </Modal>
                <Modal width={888} visible={this.state.showResult} onCancel={() => { this.setState({ showResult: false }) }} onOk={() => { this.setState({ showResult: false }) }}>
                    <Spin spinning={this.state.showLoading}>
                        {
                            this.state.result.length === 0 ?
                                <Empty className='mt_10'></Empty> :
                                <PieChart
                                    data={this.state.result}
                                    title={{
                                        visible: true,
                                        text: ''
                                    }}
                                    description={{
                                        visible: true,
                                        text: '',
                                    }}
                                    radius={0.8}
                                    angleField='value'
                                    colorField='type'
                                    label={{
                                        visible: true,
                                        type: 'outer',
                                        offset: 20,
                                    }}
                                />
                        }
                    </Spin>
                </Modal>
                <Modal width={1000} visible={this.state.statPanel} maskClosable={true} footer={null} onCancel={() => { this.setState({ statPanel: false }) }} onOk={() => { this.setState({ statPanel: false }) }}>
                    <Card loading={this.state.loading} title={this.state.news_name} bordered={false} size='small' bodyStyle={{ padding: 20 }}
                        extra={
                            <>
                                <DatePicker.RangePicker size='small' format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }} value={this.state.atime} allowClear={false} onChange={(atime, dataString) => {
                                    console.log(atime)
                                    this.setState({ atime }, () => {
                                        this.getStatNews()
                                    })
                                }} disabledDate={val => val > moment()}></DatePicker.RangePicker>

                                <Select size='small' value={this.state.time_type} onChange={(val) => { this.setState({ time_type: val }, () => this.getStatNews()) }}>
                                    <Select.Option value={0}>自定义</Select.Option>
                                    <Select.Option value={1}>12小时</Select.Option>
                                    <Select.Option value={2}>24小时</Select.Option>
                                    <Select.Option value={3}>3天</Select.Option>
                                    <Select.Option value={4}>7天</Select.Option>
                                </Select>
                                <Button size="small" onClick={this.onExport} loading={this.state.loading}>导出</Button>
                            </>}
                    >
                        <div className='mb_10'>
                            <span className='pad_r10'>阅读量(次数)：<Tag>{news_stat['read']}</Tag></span>
                            <span className='pad_r10'>人数：<Tag>{news_stat['num']}</Tag></span>
                            <span className='pad_r10'>留言评论量：<Tag>{news_stat['com']}</Tag></span>
                            <span className='pad_r10'>收藏量：<Tag>{news_stat['col']}</Tag></span>
                            <span className='pad_r10'>投票人数：<Tag>{news_stat['tou']}</Tag></span>
                            <span className='pad_r10'>是否有投票：<Tag>{news_stat['fou']}</Tag></span>
                            <span className='pad_r10'>留言评论人数：<Tag>{news_stat['liu']}</Tag></span>
                            <span className='pad_r10'>点赞量：<Tag>{news_stat['zan']}</Tag></span>
                            <span className='pad_r10'>转发人数：<Tag>{news_stat['zhuan']}</Tag></span>
                            <span className='pad_r10'>转发量：<Tag>{news_stat['fa']}</Tag></span>
                        </div>
                        <TableAntd size='small' rowKey='id' bordered={false} columns={[
                            { dataIndex: 'id', title: 'id', key: 'id' },
                            { dataIndex: 'name', title: '用户名', key: 'name' },
                            { dataIndex: 'username', title: '姓名', key: 'username' },
                            { dataIndex: 'sn', title: '卡号', key: 'sn' },
                            { dataIndex: 'lv', title: '等级', key: 'lv' }
                        ]} dataSource={this.state.dataSource} pagination={{
                            showTotal: (total) => '总共' + total + '条',
                            showQuickJumper: true
                        }}></TableAntd>
                    </Card>
                </Modal>
            </div>
        )
    }
    onExport = () => {
        this.setState({ loading: true })
        const { article_id, auth, atime, time_type } = this.state
        let begin_time = ''
        let end_time = ''
        if (time_type == 0) {
            if (!Array.isArray(atime)) return;
            begin_time = atime[0].format('YYYY-MM-DD HH:mm')
            end_time = atime[1].format('YYYY-MM-DD HH:mm')
        }
        this.props.actions.getStatNews({
            time_type, begin_time, end_time, article_id, action: 'export',
            resolved: (res) => {
                console.log(res)
                const { adress, address } = res
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(adress || address, '_black')
                    }
                })
                this.setState({ loading: false })
            },
            rejected: (res) => {
                this.setState({ loading: false })
                message.error(JSON.stringify(res))
            }
        })
    }
    getStatNews = () => {
        this.setState({ loading: true })
        const { article_id, auth, atime, time_type } = this.state
        let begin_time = ''
        let end_time = ''
        if (time_type == 0) {
            if (!Array.isArray(atime)) return;
            begin_time = atime[0].format('YYYY-MM-DD HH:mm')
            end_time = atime[1].format('YYYY-MM-DD HH:mm')
        }
        this.props.actions.getStatNews({
            time_type, begin_time, end_time, article_id,
            resolved: (res) => {
                const key = ['阅读人数', '资讯阅读会员信息', '收藏量', '阅读量', '留言评论量','投票人数','是否有投票','点赞量','留言评论人数','转发人数','转发量']
                const value = ['num', '', 'col', 'read', 'com','tou','fou','zan','liu','zhuan','fa']
                let list = []
                let item = {
                    'num': 0,
                    'col': 0,
                    'read': 0,
                    'com': 0,
                    'tou':0,
                    'fou':'',
                    'zan':'0',
                    'liu':0,
                    'zhuan':0,
                    'fa':0,
                }
                key.map((ele, index) => {
                    if (Array.isArray(res[ele])) {
                        list = res[ele]
                    } else {
                        item[value[index]] = res[ele]
                    }
                })
                list = list.map(ele => ({ lv: ele[0], sn: ele[1], username: ele[2], name: ele[3], id: ele[4] }))
                this.setState({ loading: false, dataSource: list, news_stat: item })
            },
            rejected: (res) => {
                this.setState({ loading: false })
                message.error(JSON.stringify(res))
            }
        })
    }
}
const LayoutComponent = News;
const mapStateToProps = state => {
    return {
        news_list: state.news.news_list,
        user: state.site.user,
        static_course_qrcode_info: state.course.static_course_qrcode_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
