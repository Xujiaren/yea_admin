import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber } from 'antd'
import moment from 'moment'

class MeettingTask extends Component {
    state = {
        view_mode: false,
        status: 0,
        data_list: [
            { order: 2, id: 324, name: '2020.1.2 - 2020.6.30', image: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg', time: '22', isTop: 1, status: 0 },
            { order: 2, id: 325, name: '2019瑞士研讨会', image: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg', time: '22', isTop: 0, status: 1 },
        ],
        rowKey: [],
        keyword: '',
        taskId: 0,
        task_list: [],
        rule: '',
        loads:false
    }

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
        this.getTasks()
        this.getNums()
    }
    getNums = () => {
        this.props.actions.getNum('meet_rule', 'teacher')
    }
    getTasks = () => {
        const { actions } = this.props
        actions.getTasks({
            taskId: this.state.taskId,
            keyword: this.state.keyword,
            page: this.page_current,
            pageSize: this.page_size
        })
    }
    componentWillReceiveProps(n_props) {
        if (n_props.task_list != this.props.task_list) {
            this.setState({
                task_list: n_props.task_list.data
            })
            this.page_current = n_props.task_list.page
            this.page_total = n_props.task_list.total
        }
        if (n_props.num != this.props.num) {
            this.setState({
                rule: n_props.num[0].val
            })
        }
    }
    onOpen = (val) => {
        this.props.history.push('/meetting/task/edit/' + val.taskId)
    }
    onStatus = (val, ele) => {
        const { actions } = this.props
        actions.deleteTask({
            action: ele,
            task_id: val.taskId,
            resolved: (res) => {
                this.getTasks()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onRule = () => {
        this.props.actions.publishNum({
            keyy: 'meet_rule',
            section: 'teacher',
            val: this.state.rule,
            resolved: (res) => {
                this.setState({
                    rulePanel: false
                })
                this.getNums()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onExports=(val)=>{
        this.setState({
            loads:true
        })
        this.props.actions.getMeetTasksHistory({
            taskId:val,
            resolved:(res)=>{
                message.success({
                    content:'导出成功'
                })
                window.open(res.address)
                this.setState({
                    loads:false
                })
            },
            rejected:(err)=>{
                this.setState({
                    loads:false
                })
            }
        })
    }
    render() {
        const { view_mode } = this.state
        return (
            <div className="animated fadeIn">
                <Card title='闯关任务管理' extra={
                    <>
                        <Button className='m_2' onClick={() => {
                            this.setState({ rulePanel: true })
                        }}>设置规则</Button>
                        <Button className='m_2' onClick={() => {
                            this.props.history.push('/meetting/task/edit/0')
                        }}>添加任务</Button>
                    </>
                }>
                    {/* <Input.Search className='m_w200 m_2' placeholder='手机号/姓名'></Input.Search>
                    */}
                    <Table
                        columns={this.col}
                        // expandedRowRender={this.info}
                        expandedRowKeys={this.state.rowKey}
                        onExpandedRowsChange={(rowKey) => {
                            this.setState({ rowKey })
                        }}
                        rowKey='id'
                        dataSource={this.state.task_list}
                        pagination={{
                            current: this.page_current + 1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper: true,
                            onChange: (val) => {
                                let pathname = this.props.history.location.pathname
                                this.props.history.replace(pathname + '?page=' + val)
                                this.page_current = val - 1
                                this.getTasks()
                                // this.getMallGoods()
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
                <Modal title={'规则'} onOk={() => { this.setState({ rulePanel: false }); message.success('提交成功') }} visible={this.state.rulePanel} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
                    this.setState({ rulePanel: false })
                }}
                    onOk={this.onRule}
                >
                    <Input.TextArea autoSize={{ minRows: 6 }} value={this.state.rule} onChange={(e) => { this.setState({ rule: e.target.value }) }}></Input.TextArea>
                    <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>提示：换行请用';'隔开</div>
                </Modal>
            </div>
        )
    }
    info = (record) => {
        return (
            <>

            </>
        )
    }
    col = [
        { dataIndex: 'taskId', key: 'taskId', title: 'ID' },
        {
            dataIndex: '', key: '', title: '闯关任务时间', render: (item, index) => {
                Date.prototype.Format = function (fmt) { //author: meizz
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }
                var begin = new Date(item.beginTime * 1000).Format("yyyy-MM-dd")
                var end = new Date(item.endTime * 1000).Format("yyyy-MM-dd")
                return (
                    <>
                        <div>{begin}至{end}</div>
                    </>
                )
            }
        },
        {
            dataIndex: '', key: '', title: '任务内容', width: 90, render: (item, ele) => {
                const tag = ['观看课程', '完成考试', '完成专题课程', '观看直播', '评分 点赞 分享', '观看组合课程', '发布心情墙', '兑换一堂课']
                return (
                    <>
                        {/* <Tag className='m_2'>{tag[item.etype-1]}</Tag> */}
                        {
                            item.taskList.map((_item, idx) => {
                                return (
                                    <Tag className='m_2'>{tag[_item.etype - 1]}</Tag>
                                )
                            })
                        }
                    </>
                )
            }
        },
        {
            dataIndex: 'status', key: 'status', title: '状态', render: (item, ele, index) => {
                return ele.status == 1 ? '已上架' : '未上架'
            }
        },
        {
            width: 250, dataIndex: '', key: '', title: '操作', render: (item, ele, index) => {
                return (
                    <>
                        <Button size='small' type={ele.status == 1 ? 'primary' : ''} className='m_2' onClick={this.onStatus.bind(this, ele, 'status')}>{ele.status == 1 ? '禁用' : '启用'}</Button>
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/meetting/task/view/' + ele.taskId)
                        }}>查看</Button>
                        <Button size='small' className='m_2' onClick={this.onOpen.bind(this, ele)}>修改</Button>
                        <Popconfirm
                            value='courseV/del'
                            title={"确定删除吗？"}
                            onConfirm={this.onStatus.bind(this, ele, 'delete')}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button size='small' className='m_2'>删除</Button>
                        </Popconfirm>
                        <Button size='small' loading={this.state.loads} className='m_2' onClick={this.onExports.bind(this,ele.taskId)}>记录导出</Button>
                    </>
                )
            }
        },

    ]
}

const LayoutComponent = MeettingTask;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        task_list: state.meet.task_list,
        num: state.user.num
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
