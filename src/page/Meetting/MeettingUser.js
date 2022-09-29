import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Upload, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
class MeettingUser extends Component {
    state = {
        view_mode: false,
        status: 0,
        tag_list: [],
        tag_id: 0,
        list: [],
        showImportUser: false,
        excelFileList: [],
        showResult: false,
        page_current: 0,
        page_total: 0,
        keyword: '',
        exportLoading: false,
        rejectedUser:[],
        totals:0,
        success:0,
    }
    data_list = [
        // {userName:'李里',courseId:'20201234',courseImg:'www',link:'www',sn:'2020202',courseName:'17315112378',col:'2019D2',sum:'可提高学习效率',rate:7.8,order:2,status:1},
        // {userName:'张往',courseId:'20204355',courseImg:'www',link:'www',sn:'2020203',courseName:'17315442321',col:'2020D3',sum:'便捷的记忆方法',rate:7.8,order:2,status:1},
    ]

    page_size = 10
    componentDidMount() {

    }
    componentWillMount() {
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }
        this.getTags()
    }
    getTags = () => {
        const { actions } = this.props
        actions.getTags({
            keyword: '',
            page: 0,
            ttype: 1,
            pageSize: this.page_size,
            resolved: (res) => {
                console.log(res)
                // let tagId = res.data[0].tagId
                this.setState({
                    tag_list: res.data,
                    // tag_id: tagId
                },()=>{
                    this.getUsers()
                })
               
            },
            rejected: (err) => {
                message.info({ content: err })
            }
        })
    }
    getUsers=()=>{
        this.props.actions.getCourseUserss({
            tag_id: 0,
            page: 0,
            pageSize: 10,
            is_auth: -1,
            keyword: '',
            resolved: (data) => {
                console.log(data)
                this.setState({
                    list: data.data,
                    page_current: data.page,
                    page_total: data.total
                })
                console.log(data.data_list)
            },
            rejected: (err) => {
                message.info({ content: err })
            }
        })
    }
    getTagusers = () => {
        const { tag_id } = this.state
        const { actions } = this.props
        actions.getCourseUserss({
            tag_id: tag_id,
            page: this.state.page_current,
            pageSize: 10,
            is_auth: -1,
            keyword: this.state.keyword,
            resolved: (res) => {
                this.setState({
                    list: res.data,
                    page_current: res.page,
                    page_total: res.total
                })
                console.log(this.data_list)
            },
            rejected: (err) => {
                message.info({ content: err })
            }
        })
    }
    componentWillReceiveProps(n_props) {

    }
    onChange = (val) => {
        this.setState({ tag_id: val, excelFileList: [], keyword: '' })
        const { actions } = this.props
        actions.getCourseUserss({
            tag_id: val,
            page: 0,
            pageSize: 10,
            is_auth: -1,
            keyword: '',
            resolved: (res) => {
                this.setState({
                    list: res.data,
                    page_current: res.page,
                    page_total: res.total
                })
            },
            rejected: (err) => {
                message.info({ content: err })
            }
        })
    }
    beforeUploadExcel = file => {
        if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            message.info('请上传xlsx格式的文件')
            return;
        }
        this.setState(state => ({
            excelFileList: [file],
        }));
        return false;
    }
    onRemoveExcel = file => {
        this.setState(state => {
            const index = state.excelFileList.indexOf(file);
            const newFileList = state.excelFileList.slice();
            newFileList.splice(index, 1);
            return {
                excelFileList: newFileList,
            };
        });
    }
    importUser = () => {

        const { actions } = this.props
        const { excelFileList } = this.state;
        const that = this
        let file = new FormData();
        const file_url = this.excelFile.getValue()
        console.log(file_url)
        file.append('file', excelFileList[0]);
        // file.append('tag_id', this.state.tag_id)
        if (file_url) {
            actions.postTagUser({
                file_url: file_url,
                resolved: (res) => {
                    // if (Object.keys(data).indexOf('fail') > -1) {
                    //     that.setState({ showImportUser: false })
                    //     message.success({ content: '操作成功' })
                    //     this.getTags()
                    //     this.getTagusers()
                    // } else {
                    //     message.error('导入失败 ，请参考Excel导入模版')
                    // }
                    if(res.fail.length>0){
                        message.success({
                            content:'操作成功'
                        })
                        this.getTags()
                        this.getTagusers()
                        this.setState({
                            rejectedUser:res.fail,
                            totals:res.total,
                            success:res.success
                        },()=>{
                            setTimeout(() => {
                                this.setState({
                                    showResult:true,
                                    showImportUser:false
                                })
                            }, 1000);
                           
                        })
                    }else{
                        message.success({
                            content:'操作成功'
                        })
                        this.setState({
                            showLoding:false,
                            showImportUser:false
                        })
                    }
                },
                rejected: (data) => {
                    message.error('导入失败 ，请参考Excel导入模版')
                }
            })
        } else {
            this.setState({ showImportUser: false })
        }

    }
    onDelete = (val) => {
        console.log(val)
        const { actions } = this.props
        actions.deleteTagUser({
            tag_id: this.state.tag_id,
            user_ids: val.userId.toString(),
            resolved: (res) => {
                message.success({ content: '操作成功' })
                this.getTagusers()
            },
            rejected: (err) => {
                message.error({ content: err })
            }
        })
    }
    onDeletes = () => {
        const { keys, list } = this.state
        let ids = []
        keys.map(item => {
            ids = ids.concat(list[item].userId)
        })

        const { actions } = this.props
        actions.deleteTagUser({
            tag_id: this.state.tag_id,
            user_ids: ids.toString(),
            resolved: (res) => {
                message.success({ content: '操作成功' })
                this.getTagusers()
                this.setState({
                    keys: []
                })
            },
            rejected: (err) => {
                message.error({ content: err })
            }
        })
    }
    onDeletess=()=>{
        const { keys, list } = this.state
        let ids = []
        let tas = []
        keys.map(item => {
            ids = ids.concat(list[item].userId)
            tas = tas.concat(list[item].tagId)
        })
        const { actions } = this.props
        ids.map((item,index)=>{
            actions.deleteTagUser({
                tag_id: tas[index],
                user_ids: item,
                resolved: (res) => {
                    message.success({ content: '操作成功' })
                    this.getTagusers()
                    this.setState({
                        keys: []
                    })
                },
                rejected: (err) => {
                    message.error({ content: err })
                }
            })
        })
       
    }
    onOut = () => {
        var that = this
        const { tag_id } = this.state
        const { actions } = this.props
        this.setState({
            exportLoading: true
        })
        actions.getOutTag({
            tag_id: tag_id,
            is_auth: 1,
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
    render() {
        const { view_mode, tag_list } = this.state

        return (
            <div className="animated fadeIn">
                <Card title='名单管理' extra={
                    <>
                        <Button className='m_2' onClick={() => {
                            this.setState({ showImportUser: true })
                        }}>导入用户</Button>
                        <Button className='m_2' onClick={this.onOut} loading={this.state.exportLoading}>导出用户</Button>
                    </>
                }>
                    <Select className='m_2' style={{width:'80px'}} value={this.state.tag_id} onChange={this.onChange}>
                        <Select.Option value={0}>全部</Select.Option>
                        {
                            tag_list.map((item, index) => {
                                return (
                                    <Select.Option value={item.tagId}>{item.tagName}</Select.Option>
                                )
                            })
                        }

                    </Select>
                    <Input.Search className='m_w200 m_2' placeholder='手机号/姓名' value={this.state.keyword} onChange={(e) => {
                        this.setState({ keyword: e.target.value })
                    }} onSearch={() => { this.getTagusers() }}></Input.Search>
                    {
                        this.state.tag_id != 0 ?
                            <div className='mt_10 mb_10'>
                                <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this.onDeletes}>
                                    <Button size='small' className='m_2'>删除</Button>
                                </Popconfirm>
                            </div>
                            : 
                            <div className='mt_10 mb_10'>
                            <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this.onDeletess}>
                                <Button size='small' className='m_2'>删除</Button>
                            </Popconfirm>
                        </div>
                    }

                    <Table
                        columns={this.col}
                        rowSelection={{
                            selectedRowKeys: this.state.keys,
                            onChange: (keys) => {
                                this.setState({ keys })
                            }
                        }}
                        rowKey='meettingId'
                        dataSource={this.state.list}
                        pagination={{
                            current: this.state.page_current + 1,
                            pageSize: this.page_size,
                            total: this.state.page_total,
                            showQuickJumper: true,
                            onChange: (val) => {
                                let pathname = this.props.history.location.pathname
                                this.props.history.replace(pathname + '?page=' + val)
                                this.setState({
                                    page_current: val - 1
                                }, () => {
                                    this.getTagusers()
                                })

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
                    title={'导入用户'}
                    visible={this.state.showImportUser}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showImportUser: false })
                    }}
                    onOk={() => {
                        this.importUser()
                    }}
                    maskClosable={false}
                >
                    <div>
                        {/* <Upload
                            disabled={view_mode}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            fileList={this.state.excelFileList}
                            beforeUpload={this.beforeUploadExcel}
                            onRemove={this.onRemoveExcel}
                        >
                            <Button className='m_2'>
                                <Icon type="upload" /> 导入名单
                                                        </Button>
                        </Upload> */}
                        <Form.Item label="选择Excel文件">
                            <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' listType='text' ref={(ref) => { this.excelFile = ref }}></AntdOssUpload>
                        </Form.Item>
                        <div style={{ color: "#8e8e8e", marginTop: '10px', lineHeight: '1.5' }}>
                            <p>
                                * 导入前，请先下载Excel模板文件<br />
                                * 仅支持xlsx格式的文件
                            </p>
                            <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/9ab5032b-093f-4c55-bf8b-5bfdedc18586.xlsx'>
                                Excel导入模板下载
                            </a>
                        </div>
                    </div>
                </Modal>
                 <Modal
                    width={600}
                    title='导入结果'
                    visible={this.state.showResult}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({
                            showResult:false
                        })
                    }}
                    onOk={() => {
                        this.setState({
                            showResult:false
                        })
                    }}
                    bodyStyle={{ padding: '10px' }}
                >

                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '10px' }}>
                        <span style={{ paddingRight: '20px' }}>总数:{this.state.totals}</span>
                        <span style={{ paddingRight: '20px' }}>导入成功数:{this.state.success}</span>
                        <span style={{ paddingRight: '20px' }}>导入失败数:{this.state.totals - this.state.success}</span>
                    </div>
                    <Table
                        columns={this.rejectedUser}
                        pagination={{ size: 'small', showTotal: (total) => `总${total}条`, showQiuckJumper: true }}
                        dataSource={this.state.rejectedUser}
                        rowKey='sn'
                    ></Table>

                </Modal>
            </div>
        )
    }
    rejectedUser = [
        {
            title: '',
            dataIndex: '',
            key: '',
            ellipsis: false,
        },
        {
            title: '卡号',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        },
        {
            title: '导入失败原因',
            dataIndex: 'result',
            key: 'result',
        },
    ]
    col = [
        { dataIndex: 'sn', key: 'sn', title: '用户卡号' },
        { dataIndex: 'nickname', key: 'nickname', title: '用户名' },
        // { dataIndex:'sn',key:'sn',title:'副卡名' },
        { dataIndex: 'mobile', key: 'mobile', title: '手机号' },
        {
            dataIndex: '', key: '', title: '身份标签', render: (item, ele, index) => {
               
                    return (
                        <>
                            <Tag>{ele.tagName}</Tag>
                        </>
                    )
                
                
            }
        },
        {
            width: 250, dataIndex: '', key: '', title: '操作', render: (item, ele, index) => {
                return (
                    <>
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/meetting/user/view/' + ele.userId + '/' + ele.tagId)
                        }}>查看</Button>
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/meetting/user/edit/' + ele.userId + '/' + ele.tagId)
                        }}>修改</Button>

                        <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this.onDelete.bind(this, ele)}>
                            <Button size='small' className='m_2'>删除</Button>
                        </Popconfirm>
                    </>
                )
            }
        },

    ]
}

const LayoutComponent = MeettingUser;
const mapStateToProps = state => {
    return {
        user: state.site.user,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
