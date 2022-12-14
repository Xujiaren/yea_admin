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
                message.success("????????????")
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
                message.success("????????????")
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
                message.success({ content: '????????????' })
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
                message.success({ content: '????????????' })
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
                message.success({ content: '????????????' })
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
                    content: '????????????',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (err) => {
                that.setState({ exportLoading: false })
                message.error('????????????')
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
                    content: '????????????',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (err) => {
                that.setState({ exportLoading: false })
                message.error('????????????')
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
                    content:'????????????'
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
                <Card title='????????????' extra={
                    <>
                        <Button className='m_2' onClick={this.onOut} loading={this.state.exportLoading}>????????????</Button>
                        <Button onClick={() => {
                            this.props.history.push('/meetting/edit/0')
                        }}>????????????</Button>
                    </>
                }>
                    <Input.Search className='m_w200' value={this.state.keyword} onSearch={() => { this.getCourses() }} onChange={(e) => { this.setState({ keyword: e.target.value }) }}></Input.Search>
                    <div className='mt_10 mb_10'>
                        <Popconfirm title='???????????????' okText='??????' cancelText='??????' onConfirm={this._onDelete}>
                            <Button size='small' className='m_2'>??????</Button>
                        </Popconfirm>
                        {/* <Button size='small' className='m_2'>??????</Button>
                        <Button size='small' className='m_2'>????????????</Button> */}
                        <Button size='small' className='m_2' onClick={this.onUp}>??????</Button>
                        <Button size='small' className='m_2' onClick={this.onDown}>??????</Button>
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
                            showTotal: (total) => '??????' + total + '???'
                        }}
                    />
                </Card>

                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="????????????" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    title="??????"
                    visible={this.state.showCode}
                    maskClosable={true}
                    onCancel={this.hideCode}
                    okText="??????"
                    cancelText="??????"
                    footer={null}
                >
                    {this.state.qrcode ?
                        <div>
                            <img className="block_center" alt="" style={{ width: '40%' }} src={this.state.qrcode} />
                            <div className="text_center">??????????????????</div>
                        </div>
                        : <div>????????????????????????</div>}
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex: 'courseId', key: 'courseId', title: 'ID', width: 50 },
        {
            dataIndex: '', key: '', title: '????????????', width: 90, render: (item, ele) => {
                return (
                    <img src={item.courseImg} className='head-example-img' onClick={() => {
                        this.setState({ showImgPanel: true })
                    }}></img>
                )
            }
        },
        { dataIndex: 'sn', key: 'sn', title: '????????????' },
        { dataIndex: 'courseName', key: 'courseName', title: '????????????' },
        { dataIndex: 'channel_name', key: 'channel_name', title: '??????' },
        { dataIndex: 'link', key: 'link', title: '????????????' },
        { dataIndex: 'summary', key: 'summary', title: '????????????', ellipsis: true },
        { dataIndex: 'score', key: 'score', title: '??????' },
        {
            dataIndex: 'isMust', key: 'isMust', title: '????????????', render: (item, ele) => {
                return ele.isMust == 1 ? '??????' : '??????'
            }
        },
        { dataIndex: 'sortOrder', key: 'sortOrder', title: '??????' },
        {
            dataIndex: '', key: '', title: '??????', render: (item, ele) => {
                return ele.status == 1 ? '?????????' : '?????????'
            }
        },
        {
            width: 250, dataIndex: '', key: '', title: '??????', render: (item, ele, index) => {
                return (
                    <>
                        <Button size='small' className='m_2' type={ele.status == 0 ? 'primary' : ''} onClick={this.onStatus.bind(this, ele)}>{ele.status == 0 ? '??????' : '??????'}</Button>
                        {/* <Button size='small' className='m_2' type={ele.channelList==[]?'primary':''}>{ele.channelList==[]?'?????????':'??????'}</Button> */}
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/meetting/view/' + ele.courseId)
                        }}>??????</Button>
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/meetting/edit/' + ele.courseId)
                        }}>??????</Button>
                        {
                            ele.ctype==48?
                            <Button value='courseV/chapter' className='m_2' type="" size={'small'} onClick={() => {
                                this.props.history.push('/course-manager/chapter-setting/' + ele.courseId)
                            }}>????????????</Button>
                            :null
                        }
                        
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/todo-list/comment-list/48/' + ele.courseId)
                        }}>????????????</Button>
                        {
                            ele.ctype == 49 ?
                                <Button size='small' className='m_2' loading={this.state.exportLoadings} onClick={this.onEndout.bind(this, ele)}>??????</Button>
                                : null
                        }
                        <Button size='small' className='m_2' onClick={this.showCode.bind(this, ele.courseId)}>???????????????</Button>
                        {/* <Button size='small' className='m_2' onClick={()=>{message.info({content:'?????????????????????????????????'})}}>???????????????</Button> */}
                        <Popconfirm title='???????????????' okText='??????' cancelText='??????' onConfirm={this._onRemove.bind(this, ele.courseId)}>
                            <Button size='small' className='m_2'>??????</Button>
                        </Popconfirm>
                        {
                            ele.ctype==49?
                            <Button size='small' loading={this.state.loads} onClick={this.onExportScore.bind(this,ele.courseId)}>????????????</Button>
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
