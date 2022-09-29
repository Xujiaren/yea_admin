import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input } from 'antd'

class Meetting extends Component {
    state = {
        view_mode: false,
        ccategoryId: 0,
        keyword: '',
        category_id: 0,
        ctype: 48,
        course_list: [],
        showCode: false,
        qrcode: '',
        ids: '',
        keys: [],
        exportLoading: false,
        exportLoadings: false,
        loads:false
    }
    course_list = [

    ]
    page_current = 0
    page_total = 0
    page_size = 10
    id_group = []

    componentWillMount() {
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }
        this.getCourse()
    }
    getCourse = () => {
        const { ccategoryId, keyword, category_id, ctype } = this.state
        this.props.actions.getCourseLs({
            category_id: category_id,
            ccategoryId: ccategoryId,
            live_status: -1,
            page: this.page_current,
            pageSize: this.page_size,
            sort: ''
        })
    }
    getCourses = () => {
        const { ccategoryId, keyword, category_id } = this.state
        this.props.actions.getCourse({
            ccategoryId,
            keyword,
            page: this.page_current,
            pageSize: this.page_size,
            category_id,
            ctype: -1
        })
    }
    componentWillReceiveProps(n_props) {
        if (n_props.course_list != this.props.course_list) {
            this.id_group = []
            this.course_list = n_props.course_list.data;
            this.page_total = n_props.course_list.total
            this.page_current = n_props.course_list.page
        }
        if (n_props.courses_list != this.props.courses_list) {
            this.id_group = []
            this.course_list = n_props.courses_list.data;
            this.page_total = n_props.courses_list.total
            this.page_current = n_props.courses_list.page
        }
        if (n_props.course_qrcode_info !== this.props.course_qrcode_info) {

            this.setState({
                qrcode: n_props.course_qrcode_info.data
            })

        }
    }
    _onRemove(courseId) {
        const { actions } = this.props
        actions.removeCourse({
            course_id: courseId,
            resolved: (data) => {
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                //console.log(data)
                message.error(data)
            }
        })
    }
    onStatus = (val) => {
        const { actions } = this.props
        actions.updateCourse({
            action: 'status',
            course_id: val.courseId,
            resolved: (data) => {
                message.success("操作成功")
                this.getCourse()
            },
            rejected: (data) => {
                //console.log(data)
                message.error(data)
            }
        })
    }
    showCode(course_id) {
        this.setState({
            showCode: true,
            qrcode: ''
        })
        const { actions } = this.props
        actions.getCoursePreviewQrcode({
            course_id, ctype: 0
        })

    }
    hideCode = () => {
        this.setState({
            showCode: false
        })
    }
    _onDelete = () => {
        const { ids } = this.state
        const { actions } = this.props
        actions.removeCourse({
            course_ids: ids,
            resolved: (res => {
                message.success({ content: '删除成功' })
                this.getCourse()
                this.setState({
                    ids: '',
                    keys: []
                })
            }),
            rejected: (err => {
                message.error(err)
            })
        })
    }
    onUp = () => {
        const { ids } = this.state
        const { actions } = this.props
        actions.upCourse({
            course_ids: ids,
            resolved: (res => {
                message.success({ content: '操作成功' })
                this.getCourse()
                this.setState({
                    ids: '',
                    keys: []
                })
            }),
            rejected: (err => {
                message.error(err)
            })
        })
    }
    onDown = () => {
        const { ids } = this.state
        const { actions } = this.props
        actions.downCourse({
            course_ids: ids,
            resolved: (res => {
                message.success({ content: '操作成功' })
                this.getCourse()
                this.setState({
                    ids: '',
                    keys: []
                })
            }),
            rejected: (err => {
                message.error(err)
            })
        })
    }
    onOut = () => {
        var that = this
        this.setState({
            exportLoading: true
        })
        this.props.actions.getOutss({
            begin_time: '',
            resolved: (data) => {
                console.log(data)
                const url = data.adress
                this.setState({
                    exportLoading: false
                })
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (err) => {
                that.setState({ exportLoading: false })
                message.error('导出失败')
            }
        })
    }
    onEndout = (val) => {
        var that = this
        this.setState({
            exportLoadings: true
        })
        this.props.actions.getOutsss({
            course_id: val.courseId,
            resolved: (data) => {
                console.log(data)
                const url = data.address
                this.setState({
                    exportLoadings: false
                })
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (err) => {
                that.setState({ exportLoading: false })
                message.error('导出失败')
            }
        })
    }
    onExportScore=(val)=>{
        this.setState({
            loads:true
        })
        this.props.actions.getMeetScore({
            course_id:val,
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
                <Card title='课程管理' extra={
                    <>
                        <Button className='m_2' onClick={this.onOut} loading={this.state.exportLoading}>导出数据</Button>
                        <Button onClick={() => {
                            this.props.history.push('/meetting/edit/0')
                        }}>创建课程</Button>
                    </>
                }>
                    <Input.Search className='m_w200' value={this.state.keyword} onSearch={() => { this.getCourses() }} onChange={(e) => { this.setState({ keyword: e.target.value }) }}></Input.Search>
                    <div className='mt_10 mb_10'>
                        <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this._onDelete}>
                            <Button size='small' className='m_2'>删除</Button>
                        </Popconfirm>
                        {/* <Button size='small' className='m_2'>推荐</Button>
                        <Button size='small' className='m_2'>取消推荐</Button> */}
                        <Button size='small' className='m_2' onClick={this.onUp}>上架</Button>
                        <Button size='small' className='m_2' onClick={this.onDown}>下架</Button>
                    </div>
                    <Table
                        columns={this.col}
                        rowSelection={{
                            selectedRowKeys: this.state.keys,
                            onChange: (keys) => {
                                let list = []
                                keys.map(item => {
                                    list = list.concat(this.course_list[item].courseId)
                                })
                                this.setState({ keys: keys, ids: list.toString() })
                            }
                        }}
                        rowKey='meettingId'
                        dataSource={this.course_list}
                        pagination={{
                            current: this.page_current + 1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper: true,
                            onChange: (val) => {
                                let pathname = this.props.history.location.pathname
                                this.props.history.replace(pathname + '?page=' + val)
                                this.page_current = val - 1
                                this.getCourse()
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
                <Modal
                    title="预览"
                    visible={this.state.showCode}
                    maskClosable={true}
                    onCancel={this.hideCode}
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
            </div>
        )
    }
    col = [
        { dataIndex: 'courseId', key: 'courseId', title: 'ID', width: 50 },
        {
            dataIndex: '', key: '', title: '课程主图', width: 90, render: (item, ele) => {
                return (
                    <img src={item.courseImg} className='head-example-img' onClick={() => {
                        this.setState({ showImgPanel: true })
                    }}></img>
                )
            }
        },
        { dataIndex: 'sn', key: 'sn', title: '课程编号' },
        { dataIndex: 'courseName', key: 'courseName', title: '课程名称' },
        { dataIndex: 'channel_name', key: 'channel_name', title: '栏目' },
        { dataIndex: 'link', key: 'link', title: '链接地址' },
        { dataIndex: 'summary', key: 'summary', title: '课程摘要', ellipsis: true },
        { dataIndex: 'score', key: 'score', title: '评分' },
        {
            dataIndex: 'isMust', key: 'isMust', title: '是否必修', render: (item, ele) => {
                return ele.isMust == 1 ? '必修' : '选修'
            }
        },
        { dataIndex: 'sortOrder', key: 'sortOrder', title: '排序' },
        {
            dataIndex: '', key: '', title: '状态', render: (item, ele) => {
                return ele.status == 1 ? '已上架' : '已下架'
            }
        },
        {
            width: 250, dataIndex: '', key: '', title: '操作', render: (item, ele, index) => {
                return (
                    <>
                        <Button size='small' className='m_2' type={ele.status == 0 ? 'primary' : ''} onClick={this.onStatus.bind(this, ele)}>{ele.status == 0 ? '上架' : '下架'}</Button>
                        {/* <Button size='small' className='m_2' type={ele.channelList==[]?'primary':''}>{ele.channelList==[]?'已推荐':'推荐'}</Button> */}
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/meetting/view/' + ele.courseId)
                        }}>查看</Button>
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/meetting/edit/' + ele.courseId)
                        }}>修改</Button>
                        {
                            ele.ctype==48?
                            <Button value='courseV/chapter' className='m_2' type="" size={'small'} onClick={() => {
                                this.props.history.push('/course-manager/chapter-setting/' + ele.courseId)
                            }}>章节设置</Button>
                            :null
                        }
                        
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/todo-list/comment-list/48/' + ele.courseId)
                        }}>用户评论</Button>
                        {
                            ele.ctype == 49 ?
                                <Button size='small' className='m_2' loading={this.state.exportLoadings} onClick={this.onEndout.bind(this, ele)}>导出</Button>
                                : null
                        }
                        <Button size='small' className='m_2' onClick={this.showCode.bind(this, ele.courseId)}>二维码预览</Button>
                        {/* <Button size='small' className='m_2' onClick={()=>{message.info({content:'测试服不支持二维码预览'})}}>二维码预览</Button> */}
                        <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this._onRemove.bind(this, ele.courseId)}>
                            <Button size='small' className='m_2'>删除</Button>
                        </Popconfirm>
                        {
                            ele.ctype==49?
                            <Button size='small' loading={this.state.loads} onClick={this.onExportScore.bind(this,ele.courseId)}>成绩导出</Button>
                            :null
                        }
                    </>
                )
            }
        },

    ]
}

const LayoutComponent = Meetting;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        course_list: state.meet.course_list,
        courses_list: state.course.course_list,
        course_qrcode_info: state.course.course_qrcode_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
