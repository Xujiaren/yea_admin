import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, Tabs } from 'antd'
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import './Ask.scss'
import AntdOssUpload from '../../components/AntdOssUpload';
class AskComment extends Component {
    state = {
        view: false,
        edit: false,

        keyword: '',
        keys: [],
        answerRow: [],
        status: 0,
        showImgPanel: false,
        fileList: [],
        loading:false
    }

    page_total = 0
    page_current = 0
    page_size = 10
    data_list = [

    ]

    componentWillMount() {
        this.onRefresh();
    }

    onRefresh = () => {
        const { actions } = this.props;
        const { keyword, status } = this.state;

        this.data_list = [];
        this.page_total = 0;
        this.page_current = 0;

        actions.reply(keyword, this.page_current, this.page_size, status);
    }

    onMore = () => {
        const { actions } = this.props;
        const { keyword, status } = this.state;
        actions.reply(keyword, this.page_current, this.page_size, status);
    }

    componentWillReceiveProps(n_props) {
        const { reply } = n_props;

        if (reply !== this.props.reply) {
            this.data_list = reply.data;
            this.page_total = reply.total;
            this.page_current = reply.page;
        }
    }

    onBatchAction = (action) => {
        const { actions } = this.props;
        const { keys } = this.state;

        if (keys.length > 0) {
            if (action == 'pass') {
                actions.replyReview({
                    reply_ids: keys.join(','),
                    action: 'pass',
                    reason: '',
                    resolved: () => {
                        this.onRefresh();
                    },
                    rejected: (data) => {
                        message.error(data)
                    }
                })
            } else if (action == 'unpass') {
                this.setState({loading:true})
                actions.replyReview({
                    reply_ids: keys.join(','),
                    action: 'unpass',
                    reason: '',
                    resolved: () => {
                        this.onRefresh();
                        this.setState({loading:false})
                    },
                    rejected: (data) => {
                        message.error(data)
                        this.setState({loading:false})
                    }
                })
            } else if (action == 'delete') {
                actions.replyOp({
                    reply_ids: keys.join(','),
                    action: 'delete',
                    reason: '',
                    resolved: () => {
                        this.onRefresh();
                    },
                    rejected: (data) => {
                        message.error(data)
                    }
                })
            }
        }
    }

    actionAsk = (ele, action) => {
        const { actions } = this.props;
        const { reply_content } = this.state;

        if (action == 'pass') {
            actions.replyReview({
                reply_ids: ele.replyId,
                action: 'pass',
                reason: '',
                resolved: () => {
                    this.onRefresh();
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        } else if (action == 'unpass') {
            actions.replyReview({
                reply_ids: ele.replyId,
                action: 'unpass',
                reason: '',
                resolved: () => {
                    this.onRefresh();
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        } else if (action == 'delete') {
            actions.replyOp({
                reply_ids: ele.replyId,
                action: 'delete',
                reason: '',
                resolved: () => {
                    this.onRefresh();
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        }
    }
    onPreview = (val) => {
        let lst = []
        val.galleryList.map((ele, idx) => {
            lst.push({ response: { resultBody: ele.fpath }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele.fpath })
        })
        this.setState({
            fileList: lst,
            showImgPanel:true
        })
    }
    render() {
        const { keyword } = this.state;
        return (
            <div className="animated fadeIn">
                <Card title="回答管理">
                    <Input.Search className='max_w200' onSearch={() => this.onRefresh()} value={keyword} onChange={e => {
                        this.setState({ keyword: e.target.value })
                    }}></Input.Search>
                    <Tabs activeKey={this.state.status} onChange={(val) => {
                        this.setState({
                            status: val
                        }, () => {
                            this.onRefresh()
                        })
                    }}>
                        <Tabs.TabPane key="0" tab='未审核'></Tabs.TabPane>
                        <Tabs.TabPane key="1" tab='已审核'></Tabs.TabPane>
                        <Tabs.TabPane key="2" tab='已拒绝'></Tabs.TabPane>
                    </Tabs>
                    <Button size='small' className='m_2' onClick={() => this.onBatchAction('delete')}>删除</Button>
                    {this.state.status == 0 ?
                        <>
                            <Button size='small' className='m_2' onClick={() => this.onBatchAction('pass')}>通过</Button>
                            <Button size='small' loading={this.state.loading} className='m_2' onClick={() => this.onBatchAction('unpass')}>拒绝</Button>
                        </>
                        : null}
                    <Table
                        columns={this.col}
                        rowSelection={{
                            selectedRowKeys: this.state.keys,
                            onChange: (keys) => {
                                console.log(keys)
                                this.setState({ keys })
                            }
                        }}
                        rowKey='replyId'
                        dataSource={this.data_list}
                        pagination={{
                            current: this.page_current + 1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper: true,
                            onChange: (val) => {
                                this.page_current = val - 1
                                this.onMore();
                            },
                            showTotal: (total) => '总共' + total + '条'
                        }}
                    />
                </Card>
                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <AntdOssUpload
                        actions={this.props.actions}
                        ref={ref => this.img = ref}
                        value={this.state.fileList}
                        listType="picture-card"
                        maxLength={100}
                        accept='image/*'
                    >
                    </AntdOssUpload>
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex: 'replyId', title: 'ID', key: 'replyId' },
        { dataIndex: 'ask.title', title: '提问', key: 'ask.title' },
        { dataIndex: 'content', title: '回答', key: 'content' },
        {
            dataIndex: 'ask.pubTime', title: '提问时间', key: 'ask.pubTime', render: (item, ele) => {
                return moment.unix(ele.ask.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'pubTime', title: '回答时间', key: 'pubTime', render: (item, ele) => {
                if (ele.pubTime == 0) return ''
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'status', title: '状态', key: 'status', render: (item, ele) => {
                if (this.state.status == '0') {
                    return <>
                        <Popconfirm title='审核通过吗' okText='确定' cancelText='取消' onConfirm={() => this.actionAsk(ele, 'pass')}>
                            <Button type='primary' size='small' className='m_2' >通过</Button>
                        </Popconfirm>
                        <Popconfirm title='确定拒绝吗' okText='确定' cancelText='取消' onConfirm={() => this.actionAsk(ele, 'unpass')}>
                            <Button type='primary' size='small' className='m_2' >拒绝</Button>
                        </Popconfirm>
                    </>
                } else if (this.state.status == '1') {
                    return '通过'
                } else if (this.state.status == '2') {
                    return '拒绝'
                }
            }
        },
        {
            dataIndex: '', title: '操作', key: '', render: (item, ele) => {
                return (
                    <>
                        {
                            ele.galleryList.length > 0 ?
                                <Button className='m_2' size="small" type='primary' onClick={this.onPreview.bind(this, ele)}>查看图片</Button>
                                : null
                        }

                        <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'delete')}>删除</Button>
                    </>
                )
            }
        },

    ]
}

const LayoutComponent = AskComment;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        reply: state.ask.reply,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
