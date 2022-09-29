import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import moment from 'moment'
import _ from 'lodash'
import { Tag, Modal, Table,Table as TableAntd, Card,Icon, PageHeader, Input, message, InputNumber, Spin,Form,Upload } from 'antd'
import { Button, Popconfirm } from '../../components/BtnComponent'
import AntdOssUpload from '../../components/AntdOssUpload';
// import H5dsEditor from '@rotd01/h5ds';

const options = {
    '5': '客户代表',
    '6': '客户经理',
    '7': '中级经理',
    '8': '客户总监',
    '9': '高级客户总监',
    'GG': '资深客户总监',
}
class StudyMapO2O extends Component {
    state = {
        step: '',
        level: '',
        level_name: '',

        level_id: '',
        map_id: '',
        step: '',
        data_list: [],
        key: [],

        page: 0,
        total: 0,
        pageSize: 10,
        level_list: [],
        ///type	0:学习地图，1:o2o学习地图 2:学习地图副线
        type: 2,
        showImportUser: false,
        showResult:false,
        excelFileList:[],
        content_id:0,
        showLoding:false,
        showUser:false,
        viewUser:[],
        rejectedUser:[],
        totals:0,
        success:0,
        loads:false
    }
    page_current = 1
    page_size = 10
    map_type = 0
    data_list = []

    componentWillMount() {
        this.getStudyMapO2O()
    }
    componentWillReceiveProps(n_props) {
    }
    _getStudyMap = () => {
        this.setState({ level_loading: true })
        const { page, pageSize, map_id, type } = this.state
        const { actions } = this.props
        actions._getStudyMap({
            type,
            map_id,
            page: page,
            pageSzie: pageSize,
            resolved: (res) => {
                console.log(res)
                const { total, page, data } = res
                if (Array.isArray(data)) {
                    this.setState({
                        level_list: data,
                        total,
                        page
                    })
                }
                this.setState({ level_loading: false })
            },
            rejected: () => {
                this.setState({ level_loading: false })
            }
        })
    }
    getStudyMapO2O = () => {
        this.setState({ loading: true })
        const { actions } = this.props
        actions.getStudyMapO2O({
            resolved: (res) => {
                console.log(res)
                if (Array.isArray(res)) {
                    this.setState({ data_list: res })
                }
                this.setState({ loading: false })
            },
            rejected: () => {
                this.setState({ loading: false })
            }
        })
    }
    actionStudyMap(level_id, action) {
        const { actions } = this.props
        actions.actionStudyMap({
            level_id, action,
            resolved: () => {
                message.success('提交成功')
                this._getStudyMap()
            },
            rejected: () => {
            }
        })
    }
    onSort(ele) {
        const { step, type, level_list } = this.state

        let {
            squadId: squad_id,
            courseId: course_id,
            paperId: paper_id,
            flag,
            level,
            levelId: level_id,
            levelName: level_name,
            mapId: map_id,
            status,
            contentSort: content_sort,
            // type: type
        } = ele
        let lst = level_list.filter(item => item.levelId !== level_id)
        let vas = []
        if (lst.length > 0) {
            vas = lst.filter(itm => itm.step == step)
        }

        if (isNaN(parseInt(step))) { message.info('请输入正确的数字'); return; }
        if (step % 1 !== 0) { message.info('排序请取整数'); return; }
        if (step > 5) { message.info('副线关卡最多5关，请在0-5间进行排序'); return; }
        if (vas.length > 0) { message.info('该排序已存在,请先选用未选择过的序号或者0进行临时替选,再进行替换'); return; }
        this.props.actions.setStudyMap({
            squad_id, type, level_id, map_id, step, paper_id, course_id, status, level, flag, content_sort, level_name,
            resolved: (data) => {
                this._getStudyMap()
                message.success({
                    content: '提交成功',
                    onClose: () => {

                    }
                })
                this.setState({ levelId: 0 })
            },
            rejected: (data) => {
                console.log(data)
                this.setState({ loading: false, importLoading: false })
            }
        })
    }
    renderTable = () => {
        const { level_list, page, pageSize, total, level_loading, type } = this.state
        const title = type === 1 ? '关卡' : '副线关卡'

        return (
            <Spin spinning={level_loading}>
                <Table title={() => title} rowKey='levelId' columns={this.innercol} dataSource={level_list} pagination={{
                    current: page + 1,
                    pageSize: pageSize,
                    total: total,
                    showQuickJumper: true,
                    onChange: (val) => {
                        this.setState({ page: val - 1 }, this._getStudyMap)
                    },
                    showTotal: (total) => '总共' + total + '条'
                }}></Table>
            </Spin>
        )
    }
    onDaoru=(val)=>{
        this.setState({
            content_id:parseInt(val.map_id),
            showImportUser:true
        })
    }
    importUser=()=>{
        const { actions } = this.props
        const { excelFileList,content_id } = this.state;
        const file_url = this.excelFile.getValue()
        if(!file_url){message.info({content:'请上传文件'});return;}
        this.setState({
            showLoding:true
        })
        actions.importUserPublic({
            file_url:file_url,
            content_id:content_id,
            ctype:38,
            type:1,
            resolved:(res)=>{
                if(res.fail.length>0){
                    message.success({
                        content:'操作成功'
                    })
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
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    onShows=()=>{
        const { actions } = this.props
        const { excelFileList,content_id } = this.state;
        actions.getImportUserPublic({
            content_id:content_id,
            ctype:38,
            resolved:(res)=>{
                this.setState({
                    viewUser:res
                },()=>{
                    this.setState({
                        showUser:true
                    })
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    onLearnExport=(val)=>{
        this.setState({
            loads:true
        })
        this.props.actions.getMapLearnExport({
            mapId:val.map_id,
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
    onTestExport=(val)=>{
        this.setState({
            loads:true
        })
        this.props.actions.getMapTestExport({
            mapId:val.map_id,
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
        const { step, level, level_name } = this.state
        return (
            <div className="animated fadeIn">
                <Card title="学习地图O2O管理">
                    <div className='min_height'>
                        <div className="flex f_row j_space_between align_items mb_10">
                            <div className='flex f_row align_items'>

                            </div>
                            <div>
                                <Button value='studymapo2o/add' onClick={() => {
                                    this.props.history.push('/topic/o2oStudyMap/edit/0/0')
                                }}>添加关卡</Button>
                            </div>
                        </div>
                        <Table
                            expandedRowKeys={this.state.key}
                            expandedRowRender={this.renderTable}
                            onExpandedRowsChange={(res) => {
                                console.log(res)
                                let m_id = res.pop()
                                this.setState({ map_id: m_id, key: [m_id] }, this._getStudyMap)
                            }}
                            rowKey='map_id'
                            columns={this.col}
                            dataSource={this.state.data_list}
                            pagination={false}></Table>
                    </div>

                </Card>
                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    title={'导入用户'}
                    visible={this.state.showImportUser}
                    okText='确定'
                    cancelText='取消'
                    loading={this.state.showLoding}
                    onCancel={() => {
                        this.setState({ showImportUser: false })
                    }}
                    onOk={() => {
                        this.importUser()
                    }}
                    maskClosable={false}
                >
                    <div>
                       
                        <Form.Item label="选择Excel文件">
                            <Button style={{marginRight:'20px'}} onClick={this.onShows}>查看名单</Button>
                            <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' listType='text' ref={(ref) => { this.excelFile = ref }}></AntdOssUpload>
                        </Form.Item>
                        <div style={{ color: "#8e8e8e", marginTop: '10px', lineHeight: '1.5' }}>
                            <p>
                                * 导入前，请先下载Excel模板文件<br />
                                * 仅支持xlsx格式的文件
                            </p>
                            <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/dff4d08b-e550-475f-91d6-cc3f42f3c350.xlsx'>
                                Excel导入模板下载
                            </a>
                        </div>
                    </div>
                </Modal>
                <Modal
                    width={800}
                    destroyOnClose={true}
                    title='自定义用户名单'
                    visible={this.state.showUser}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showUser: false })
                    }}
                    onOk={() => {
                        this.setState({ showUser: false })
                    }}
                    bodyStyle={{ padding: '10px' }}
                >
                    {/* <div>
                        <Select
                            className='m_2'
                            style={{ minWidth: '130px' }}
                            onChange={val => this.setState({ u_page: 1, user_is_auth: val }, () => { this._onShowUser() })}
                            value={this.state.user_is_auth}
                        >
                            <Select.Option value={-1}>全部状态</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                        </Select>
                        <Button style={{ float: 'right' }} onClick={this._onExportUser} loading={this.state.exportLoading}>导出</Button>
                    </div> */}
                    <TableAntd columns={this.viewUser} dataSource={this.state.viewUser} rowKey='id' pagination={{
                        // current: this.state.u_page,
                        // pageSize: this.state.u_pageSize,
                        // total: this.state.u_total,
                        // showQuickJumper: true,
                        // onChange: this._onPage,
                        showTotal: (total) => '总共' + total + '条'
                    }}/>
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
    viewUser = [
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            ellipsis: false,
            render: (item, ele) => ele.userId == 0 ? '' : ele.userId
        },
        {
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname',
            ellipsis: false,
            render: (item, ele) => ele.nickname? ele.nickname : ele.name
        },
        {
            title: 'VIP卡号',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        },
        {
            title: '手机',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        // {
        //     title: '状态',
        //     dataIndex: 'isAuth',
        //     key: 'isAuth',
        //     ellipsis: false,
        //     render: (item, record) => record.isAuth == 1 ? '已认证' : '未认证'
        // },
        {
            title: '导入时间',
            dataIndex: 'result',
            key: 'result',
            render: (item, record) => record.isAuth == 0 ? "" : moment.unix(record.pubTime).format('YYYY-MM-DD HH:mm')
        },
    ]
    innercol = [
        {
            title: 'ID',
            dataIndex: 'levelId',
            key: 'levelId',
            ellipsis: false,
            width: 80
        },
        {
            title: '关卡名称',
            dataIndex: 'levelName',
            key: 'levelName',
            ellipsis: false,
        },

        //  {
        //     title: '对应级别',
        //     dataIndex: 'level',
        //     key: 'level',
        //     ellipsis: true,
        //     render: (item, ele) => options[ele.level]
        // },
        {
            title: '发布时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            ellipsis: true,
            render: (item, ele) => moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        },
        {
            title: '排序',
            dataIndex: 'step',
            key: 'step',
            ellipsis: true,
            render: (item, ele, index) => {
                if (this.state.levelId == ele.levelId)
                    return <InputNumber style={{ width: 100 }} placeholder='填写数量' value={this.state.step} min={0} onChange={e => this.setState({ step: e })} />
                else
                    // return <Tag>{10*this.state.page+index+1}</Tag>
                    return <Tag>{ele.step}</Tag>
            }
        },
        // {
        //     title: '状态',
        //     dataIndex: 'status',
        //     key: 'status',
        //     ellipsis: true,
        //     render: (item, ele) => ele.status == 1 ? '已上架' : '未上架'
        // },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render: (item, ele) => (
                <div>
                    <Button value='studymapo2o/order' onClick={this.state.levelId == ele.levelId ? this.onSort.bind(this, ele) : () => this.setState({ levelId: ele.levelId, step: ele.step })} size={'small'} className='m_2'>{this.state.levelId == ele.levelId ? "保存" : '排序'}</Button>
                    <Button value='studymapo2o/edit' onClick={this.actionStudyMap.bind(this, ele.levelId, 'status')} type={ele.status == 1 ? "primary" : ''} size={'small'} className='m_2'>{ele.status == 1 ? "下架" : '上架'}</Button>
                    <Button value='studymapo2o/view' className='m_2' type="primary" size={'small'} onClick={() => {
                        this.props.history.push(`/topic/o2oStudyMap/view/${ele.mapId}/${ele.levelId}`)
                    }}>
                        查看
                    </Button>
                    <Button value='studymapo2o/edit' className='m_2' type="primary" size={'small'} onClick={() => {
                        this.props.history.push(`/topic/o2oStudyMap/edit/${ele.mapId}/${ele.levelId}`)
                    }}>
                        修改
                    </Button>
                    <Popconfirm
                        value='studymapo2o/del'
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.actionStudyMap.bind(this, ele.levelId, 'delete')}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                </div>
            )
        },
    ]

    col = [
        {
            title: 'ID',
            dataIndex: 'map_id',
            key: 'map_id',
            ellipsis: false,
            width: 80
        },
        {
            title: '关卡名称',
            dataIndex: 'map_name',
            key: 'map_name',
            ellipsis: false,
        },

        //  {
        //     title: '对应级别',
        //     dataIndex: 'level',
        //     key: 'level',
        //     ellipsis: true,
        //     render: (item, ele) => options[ele.level]
        // },
        // {
        //     title: '发布时间',
        //     dataIndex: 'pubTime',
        //     key: 'pubTime',
        //     ellipsis: true,
        //     render: (item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        // },
        // {
        //     title: '排序',
        //     dataIndex: 'step',
        //     key: 'step',
        //     ellipsis: true,
        //     render: (item, ele) => {
                // if(this.state.levelId==ele.levelId)
                //     return <InputNumber style={{width:100}} placeholder='填写数量' value={this.state.step} onChange={e=>this.setState({step:e})}/>
                // else
        //         return <Tag>{ele.step}</Tag>
        //     }
        // },
        {
            title: '关卡数',
            dataIndex: 'map_level_numbers',
            key: 'map_level_numbers',
            ellipsis: true,
        },
        // {
        //     title: '状态',
        //     dataIndex: 'status',
        //     key: 'status',
        //     ellipsis: true,
        //     render: (item, ele) => ele.status == 1 ? '已上架' : '未上架'
        // },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render: (item, ele) => (
                <div>
                    {/* <Button onClick={this.state.levelId == ele.levelId ? this.onSort.bind(this,ele) : ()=>this.setState({levelId:ele.levelId, step:ele.step})} size={'small'} className='m_2'>{this.state.levelId == ele.levelId ? "保存" : '排序'}</Button>
                    <Button onClick={this.actionStudyMap.bind(this, ele.levelId, 'status')} type={ele.status == 1 ? "primary" : ''} size={'small'} className='m_2'>{ele.status == 1 ? "下架" : '上架'}</Button> */}
                    {/* <Button className='m_2' type="primary" size={'small'} onClick={() => {
                        // this.props.history.push('/topic/o2oStudyMap/edit/' + ele.map_id)
                        this.setState({ map_id: ele.map_id, page:0,key:[ele.map_id],type:1,level_loading:true },this._getStudyMap)
                    }}>
                        查看关卡
                    </Button> */}
                    <Button className='m_2' type="primary" size={'small'} onClick={() => {
                        // this.props.history.push('/topic/o2oStudyMap/edit/' + ele.map_id)
                        this.setState({ map_id: ele.map_id, page: 0, key: [ele.map_id], type: 2, level_loading: true }, this._getStudyMap)
                    }}>
                        查看副线关卡
                    </Button>
                    <Button size={'small'} onClick={this.onDaoru.bind(this,ele)}>导入用户</Button>
                    <Button size={'small'} loading={this.state.loads} onClick={this.onLearnExport.bind(this,ele)}>学习情况导出</Button>
                    <Button size={'small'} loading={this.state.loads} onClick={this.onTestExport.bind(this,ele)}>测试情况导出</Button>
                    {/* <Button className='m_2' type="primary" size={'small'} onClick={() => {
                        this.props.history.push('/topic/study-map/edit/0/' + ele.levelId)
                    }}>
                        修改
                    </Button>
                    <Popconfirm
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.actionStudyMap.bind(this, ele.levelId, 'delete')}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm> */}
                </div>
            )
        },
    ]
}

const LayoutComponent = StudyMapO2O;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        study_level: state.course.study_level,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
