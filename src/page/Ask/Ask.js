import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, Tabs } from 'antd'
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import './Ask.scss'

class Ask extends Component {

    state = {
        keyword: '',
        view: false,
        edit: false,
        keys: [],
        answerRow: [],
        status: 0,
        rtype:1,
        reply_content: '',
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

    componentWillReceiveProps(n_props) {
        const { ask } = n_props;
    
        if (ask !== this.props.ask) {
            this.data_list = ask.data;
            this.page_total = ask.total;
            this.page_current = ask.page;
        }
    }

    onRefresh = () => {
        const { actions } = this.props;
        const { keyword, status } = this.state;

        this.data_list = [];
        this.page_total = 0;
        this.page_current = 0;

        actions.ask(keyword, this.page_current, this.page_size, parseInt(status));

    }

    onMore = () => {
        const { actions } = this.props;
        const { keyword, status } = this.state;
        actions.ask(keyword, this.page_current, this.page_size, status);
    }

    onBatchAction = (action) => {
        const { actions } = this.props;
        const { keys } = this.state;

        if (keys.length > 0) {
            if (action == 'pass') {
                actions.askReview({
                    ask_ids: keys.join(','),
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
                actions.askReview({
                    ask_ids: keys.join(','),
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
                actions.askOp({
                    ask_ids: keys.join(','),
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
        const { reply_content,rtype } = this.state;
        console.log(actions)

        if (action == 'pass') {
            actions.askReview({
                ask_ids: ele.askId,
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
            actions.askReview({
                ask_ids: ele.askId,
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
            actions.askOp({
                ask_ids: ele.askId,
                action: 'delete',
                reason: '',
                resolved: () => {
                    this.onRefresh();
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        } else if (action == 'top') {
            actions.askOp({
                ask_ids: ele.askId,
                action: 'top',
                reason: '',
                resolved: () => {
                    this.onRefresh();
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        } else if (action == 'reply') {
            actions.askReply({
                ask_id: ele.askId,
                content: reply_content,
                rtype:rtype,
                resolved: () => {
                    this.onRefresh()
                    this.setState({
                        reply_content:''
                    })
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        }
    }

    showImgPanel = (previewImage) => {
        this.setState({
            previewImage: previewImage,
            showImgPanel: true
        })
    }

    topicDetail = (record) => {
        const { status, reply_content } = this.state

        return (
            <>
                <div className='m_2'>
                    <strong>提问：</strong>
                    <span>{record.title}</span>
                    <p dangerouslySetInnerHTML={{ __html: record.content }}></p>
                </div>
                <div>
                    {record.galleryList.map((gallery, index) => {
                        return (
                            <img onClick={() => this.showImgPanel(gallery.fpath)} src={gallery.fpath} className='mb_10 img_content'></img>
                        )
                    })}
                </div>
                {record.replyList.map((reply, index) => {
                    return (
                        <div className='mb_10'>
                            <strong>回复：</strong>
                            <span>{reply.content}</span>
                        </div>
                    )
                })}
                <Select style={{width:'80px',marginBottom:'5px'}} value={this.state.rtype} onChange={e=>{
                    this.setState({
                        rtype:e
                    })
                }}>
                    <Select.Option value={1}>公开</Select.Option>
                    <Select.Option value={2}>私密</Select.Option>
                </Select>
                {status == 0 ? null :
                    <>
                        <div>
                            <TextArea autoSize={{ minRows: 4 }} className='m_w400' value={reply_content} onChange={e => {
                                this.setState({
                                    reply_content: e.target.value
                                })
                            }} />
                        </div>
                        <div className='mt_10'>
                            <Button onClick={() => { this.actionAsk(record, 'reply') }}>回复</Button>&nbsp;&nbsp;
                    <Button onClick={() => { this.setState({ answerRow: [] }) }}>关闭</Button>
                        </div>
                    </>
                }
            </>
        )
    }
    render() {
        const { keyword } = this.state
        return (
            <div className="animated fadeIn">
                <Card title="问答管理" extra={<>
                    <Button onClick={() => { this.props.history.push('/ask/edit/0') }}>创建问题</Button>
                </>}>
                    <Input.Search className='max_w200' onSearch={() => this.onRefresh()} value={keyword} onChange={e => {
                        this.setState({ keyword: e.target.value })
                    }}></Input.Search>
                    <Tabs activeKey={this.state.status} onChange={(val) => {
                        this.setState({
                            status: val
                        }, () => this.onRefresh());
                    }}>
                        <Tabs.TabPane key="0" tab='未审核'></Tabs.TabPane>
                        <Tabs.TabPane key="1" tab='已审核用户问题列表'></Tabs.TabPane>
                        <Tabs.TabPane key="2" tab='管理员问题列表'></Tabs.TabPane>
                        <Tabs.TabPane key="3" tab='已拒绝用户问题列表'></Tabs.TabPane>
                        {/* <Tabs.TabPane key="2" tab='已拒绝'></Tabs.TabPane> */}
                    </Tabs>
                    <Button size='small' className='m_2' onClick={() => this.onBatchAction('delete')}>删除</Button>
                    {this.state.status == 0 ?
                        <>
                            <Button size='small' className='m_2' onClick={() => this.onBatchAction('pass')}>通过</Button>
                            <Button size='small' loading={this.state.loading} className='m_2' onClick={() => this.onBatchAction('unpass')}>拒绝</Button>
                        </>
                        : null}
                    <Table
                        expandedRowRender={this.topicDetail}
                        expandedRowKeys={this.state.answerRow}
                        onExpandedRowsChange={(answerRow) => {
                            this.setState({ answerRow: [answerRow.pop()] })
                        }}
                        columns={this.state.status == 1 ? this.done_user_col : this.state.status == 2 ? this.done_admin_col :this.state.status==3? this.un_user_col: this.col}
                        rowSelection={{
                            selectedRowKeys: this.state.keys,
                            onChange: (keys) => {
                                this.setState({ keys })
                            }
                        }}
                        rowKey='askId'
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

                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex: 'askId', title: 'ID', key: 'askId' },
        { dataIndex: 'title', title: '提问', key: 'title' },
        { dataIndex: 'integral', title: '悬赏', key: 'integral' },
        { dataIndex: 'replyList[0].content', title: '回答', key: 'replyList[0].content' },
        {
            dataIndex: 'replyList[0].nickname', title: '标签', key: 'replyList[0].nickname',render:(item,ele)=>{
                return (
                    <>
                        <Tag  className='m_2'>{ele.nickname}</Tag>
                    </>
                )
            }
        },

        { dataIndex: 'nickname', title: '用户', key: 'nickname' },
        { dataIndex: 'mobile', title: '手机号', key: 'mobile' },
        {
            dataIndex: 'pubTime', title: '提问时间', key: 'pubTime', render: (item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'replyTime', title: '回答时间', key: 'replyTime', render: (item, ele) => {
                if (ele.replyTime == 0) return ''
                return moment.unix(ele.replyTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'status', title: '状态', key: 'status', render: (item, ele) => {

                return <>
                    <Popconfirm title='审核通过吗' okText='确定' cancelText='取消' onConfirm={() => this.actionAsk(ele, 'pass')}>
                        <Button type='primary' size='small' className='m_2'>通过</Button>
                    </Popconfirm>
                    <Popconfirm title='确定拒绝吗' okText='确定' cancelText='取消' onConfirm={() => this.actionAsk(ele, 'unpass')}>
                        <Button type='primary' size='small' className='m_2' >拒绝</Button>
                    </Popconfirm>
                </>
            }
        },
        {
            dataIndex: '', title: '操作', key: '', render: (item, ele) => {
                return (
                    <>
                        <Button className='m_2' size="small" onClick={() => {
                            this.setState({ answerRow: [ele.askId] })
                        }}>查看</Button>
                        {this.state.status == 1 ?
                            <>
                                <Button className='m_2' size="small" onClick={() => {
                                    this.setState({ answerRow: [ele.askId] })
                                }}>回复</Button>

                            </>
                            : null}
                        <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'delete')}>删除</Button>
                        <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'top')}>{ele.isTop==0?'置顶':'取消置顶'}</Button>
                    </>
                )
            }
        },

    ]
    done_admin_col = [
        { dataIndex: 'askId', title: 'ID', key: 'askId' },
        { dataIndex: 'title', title: '提问', key: 'title' },
        { dataIndex: 'integral', title: '悬赏', key: 'integral' },
        { dataIndex: 'replyList[0].content', title: '回答', key: 'replyList[0].content' },
        {
            dataIndex: 'replyList[0].nickname', title: '标签', key: 'replyList[0].nickname',render:(item,ele)=>{
                return (
                    <>
                        <Tag  className='m_2'>{ele.nickname}</Tag>
                    </>
                )
            }
        },

        // { dataIndex:'admin',title:'身份',key:'admin' },

        { dataIndex: 'nickname', title: '管理员', key: 'nickname' },
        { dataIndex: 'mobile', title: '手机号', key: 'mobile' },
        {
            dataIndex: 'pubTime', title: '提问时间', key: 'pubTime', render: (item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'replyTime', title: '回答时间', key: 'replyTime', render: (item, ele) => {
                if (ele.replyTime == 0) return ''
                return moment.unix(ele.replyTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'status', title: '状态', key: 'status', render: (item, ele) => {
                if (ele.status == 0) {
                } else if (ele.status == 1) {
                    return '已审核'
                } else if (ele.status == 2) {
                    return '已拒绝'
                }
            }
        },
        {
            dataIndex: '', title: '操作', key: '', render: (item, ele) => {
                return (
                    <>
                        <Button className='m_2' size="small" onClick={() => {
                            this.setState({ answerRow: [ele.askId] })
                        }}>查看</Button>

                        <Button className='m_2' size="small" onClick={() => { this.props.history.push('/ask/edit/' + ele.askId) }}>修改</Button>

                        <Button className='m_2' size="small" onClick={() => {
                            this.setState({ answerRow: [ele.askId] })
                        }}>回复</Button>
                        <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'delete')}>删除</Button>
                        <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'top')}>{ele.isTop==0?'置顶':'取消置顶'}</Button>
                    </>
                )
            }
        },

    ]
    done_user_col = [
        { dataIndex: 'askId', title: 'ID', key: 'askId' },
        { dataIndex: 'title', title: '提问', key: 'title' },
        { dataIndex: 'integral', title: '悬赏', key: 'integral' },
        { dataIndex: 'replyList[0].content', title: '回答', key: 'replyList[0].content' },
        {
            dataIndex: 'replyList[0].nickname', title: '标签', key: 'replyList[0].nickname',render:(item,ele)=>{
                return (
                    <>
                        <Tag  className='m_2'>{ele.nickname}</Tag>
                    </>
                )
            }
        },
        { dataIndex: 'nickname', title: '用户', key: 'nickname' },
        { dataIndex: 'mobile', title: '手机号', key: 'mobile' },
        {
            dataIndex: 'pubTime', title: '提问时间', key: 'pubTime', render: (item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'replyTime', title: '回答时间', key: 'replyTime', render: (item, ele) => {
                if (ele.replyTime == 0) return ''
                return moment.unix(ele.replyTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'status', title: '状态', key: 'status', render: (item, ele) => {
                if (this.state.status == '0') {
                } else if (this.state.status == '1') {
                    return '已审核'
                } else if (this.state.status == '2') {
                    return '已审核'
                }
            }
        },
        {
            dataIndex: '', title: '操作', key: '', render: (item, ele) => {
                return (
                    <>
                        <Button className='m_2' size="small" onClick={() => {
                            this.setState({ answerRow: [ele.askId] })
                        }}>查看</Button>

                        {this.state.status == 1 ?
                            <>
                                <Button className='m_2' size="small" onClick={() => {
                                    this.setState({ answerRow: [ele.askId] })
                                }}>回复</Button>

                            </>
                            : null}
                        <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'delete')}>删除</Button>
                        <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'top')}>{ele.isTop==0?'置顶':'取消置顶'}</Button>
                    </>
                )
            }
        },

    ]
    un_user_col = [
        { dataIndex: 'askId', title: 'ID', key: 'askId' },
        { dataIndex: 'title', title: '提问', key: 'title' },
        { dataIndex: 'integral', title: '悬赏', key: 'integral' },
        { dataIndex: 'replyList[0].content', title: '回答', key: 'replyList[0].content' },
        {
            dataIndex: 'replyList[0].nickname', title: '标签', key: 'replyList[0].nickname',render:(item,ele)=>{
                return (
                    <>
                        <Tag  className='m_2'>{ele.nickname}</Tag>
                    </>
                )
            }
        },
        { dataIndex: 'nickname', title: '用户', key: 'nickname' },
        { dataIndex: 'mobile', title: '手机号', key: 'mobile' },
        {
            dataIndex: 'pubTime', title: '提问时间', key: 'pubTime', render: (item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'replyTime', title: '回答时间', key: 'replyTime', render: (item, ele) => {
                if (ele.replyTime == 0) return ''
                return moment.unix(ele.replyTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            dataIndex: 'status', title: '状态', key: 'status', render: (item, ele) => {
                if (this.state.status == '0') {
                } else if (this.state.status == '1') {
                    return '已审核'
                } else if (this.state.status == '2') {
                    return '已审核'
                }
            }
        },
        {
            dataIndex: '', title: '操作', key: '', render: (item, ele) => {
                return (
                    <>
                        <Button className='m_2' size="small" onClick={() => {
                            this.setState({ answerRow: [ele.askId] })
                        }}>查看</Button>

                        {this.state.status == 1 ?
                            <>
                                <Button className='m_2' size="small" onClick={() => {
                                    this.setState({ answerRow: [ele.askId] })
                                }}>回复</Button>

                            </>
                            : null}
                        <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'delete')}>删除</Button>
                        {/* <Button className='m_2' size="small" onClick={() => this.actionAsk(ele, 'top')}>置顶</Button> */}
                    </>
                )
            }
        },

    ]
}

const LayoutComponent = Ask;
const mapStateToProps = state => {
    return {
        ask: state.ask.ask,
        user: state.site.user,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
