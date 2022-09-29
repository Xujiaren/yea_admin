import React, { Component } from 'react'
import { Input, Radio, Modal, Select, Form, Tabs, Card, Table, message, InputNumber,Switch } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import cookie from 'react-cookies'

import connectComponent from '../../../util/connect';
import AntdOssUpload from '../../../components/AntdOssUpload'
import { Button, Popconfirm } from '../../../components/BtnComponent'
const { Option } = Select
const { TextArea } = Input
class TeacherApply extends Component {
    state = {
        edit: true,
        view: true,
        status: '0',
        data_list: [],
        loading: false,
        checkNum: 1,
        check_apply_id: 0,
        check_status: 1,
        reason: '',
        keyword: '',
        checkList: [],
        isLog: false,
        roleName: '空',
        settingPannel: false,
        inaudit: 0,
        companyList: [],
        companyNo: '',
        settingStatus: false,
        open:0,
        content:''
    }
    data_list = []
    page_current = 1
    page_size = 10
    page_total = 0

    onRefuse = () => {
        message.info('当前管理员无此权限');
    }
    componentWillMount() {
        this.getTeacherApply()
        this.getSetting()
        this.getNums()
        this.getCompany()
        this.getStatus()
    }
    getCompany = () => {
        const { actions } = this.props
        actions.getCompanyList({
            resolved: (res) => {
                console.log(res)
                this.setState({
                    companyList: res
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getNums = () => {
        this.props.actions.getNum('apply_audits', 'teacher')
    }
    componentWillReceiveProps(n_props) {

        if (n_props.data_list !== this.props.data_list) {
            this.data_list = n_props.data_list.data || []
            this.page_current = (n_props.data_list.page || 0) + 1
            this.page_total = n_props.data_list.total
        }
        if (n_props.num != this.props.num) {
            this.setState({
                inaudit: parseInt(n_props.num[0].val)
            })
        }
    }
    getStatus=()=>{
        this.props.actions.getApplySetting({
            keyy: 'apply_status',
            section: 'user',
            resolved: (data) => {

                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        this.setState({ open: Number(val) })
                    }
                }
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.getApplySetting({
            keyy: 'apply_close_text',
            section: 'user',
            resolved: (data) => {

                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        this.setState({ content: val })
                    }
                }
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    getSetting = () => {
        this.props.actions.getApplySetting({
            keyy: 'apply_audits',
            section: 'teacher',
            resolved: (data) => {

                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        this.setState({ checkNum: Number(val) })
                    }
                }
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    postStatus=()=>{
        const{open,content}=this.state
        this.props.actions.publishNum({
            keyy: 'apply_status',
            section: 'user',
            val: open.toString(),
            resolved: (data) => {
                
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.publishNum({
            keyy: 'apply_close_text',
            section: 'user',
            val: content,
            resolved: (data) => {
                message.success('提交成功')
                this.setState({ settingStatus: false }, () => {
                    this.getStatus()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    publishApplySetting = () => {
        const { inaudit } = this.state
        this.props.actions.publishNum({
            keyy: 'apply_audits',
            section: 'teacher',
            val: inaudit.toString(),
            resolved: (data) => {
                message.success('提交成功')
                this.setState({ settingPannel: false }, () => {
                    this.getNums()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    getTeacherApply = () => {
        this.setState({ loading: true })
        this.props.actions.getTeacherApply({
            type: this.state.status,
            pageSize: this.page_size,
            page: this.page_current - 1,
            keyword: this.state.keyword,
            company_no: this.state.companyNo,
            resolved: (data) => {
                this.setState({ loading: false })
            },
            rejected: (data) => {
                this.setState({ loading: false })
                message.error(JSON.stringify(data))
            }
        })
    }
    actionTeacherApply = (apply_id, action) => {
        this.props.actions.actionTeacherApply({
            apply_id, action,
            resolved: (data) => {
                message.success('提交成功')
                this.getTeacherApply()
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    importTeacherApply = () => {
        const file_url = this.excelFile.getValue() || ''
        if (file_url == '') { message.info('请上传文件'); return; }

        this.setState({ importLoading: true })
        this.props.actions.importTeacherApply({
            file_url,
            resolved: (data) => {
                console.log(data)
                this.setState({ importLoading: false })
                message.success({
                    content: '导入成功',
                })
            },
            rejected: (data) => {
                this.setState({ importLoading: false })
                message.error(data)
            }
        })
    }
    exportTeacherApply = () => {
        const { status, keyword,companyNo } = this.state
        let val = -1
        if (status == 0) {
            val = 0
        } else if (status == 1) {
            val = 2
        }
        this.setState({ exportLoading: true })
        this.props.actions.exportTeacherApply({
            type: 1,
            status: val,
            keyword: keyword,
            company_no:companyNo,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                const url = fileName || adress || name || address

                this.setState({ exportLoading: false })
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (data) => {
                this.setState({ exportLoading: false })
                message.error(data)
            }
        })
    }
    renderBtn = (
        <>
            <Button className='m_2' onClick={() => { this.setState({ settingStatus: true }) }}>讲师申请设置</Button>
            <Button className='m_2' onClick={() => { this.setState({ settingPannel: true }) }}>申请审批流设置</Button>
            {/* <Popconfirm
                value='classify/del'
                title={"该分类下的所有课程将被删除，确定删除吗？"}
                onConfirm={this.exportTeacherApply.bind(this,2)}
                onCancel = {this.exportTeacherApply.bind(this,0)}
                okText="确定"
                cancelText="取消"
            > */}
            <Button value='teacherApply/out' className='m_2' loading={this.state.exportLoading} onClick={this.exportTeacherApply}>导出</Button>
            {/* </Popconfirm> */}
            {/* <Button className='m_2' onClick={()=>{ this.setState({ showImportPannel:true }) }}>导入</Button> */}
            <Button value='teacherApply/add' className='m_2' onClick={() => { this.props.history.push('/teacher/apply/edit/0/0') }}>申请讲师</Button>
        </>
    )
    renderCheckPanel = () => {
        const { isLog } = this.state
        return (
            <>
                {this.state.checkList.map(ele => {

                    if (isLog || ele.isSelf == 0) {
                        let res = ''
                        let isCheck = -1
                        if (ele.checkLogs instanceof Array) {
                            ele.checkLogs.map(item => {
                                isCheck = parseInt(item['checkStatus'] || -1)
                                res = item['reason'] || ''
                            })
                        }
                        return (
                            <>
                                <Form.Item label={'账户：' + ele.username}>
                                    <Radio.Group value={isCheck}>
                                        <Radio disabled value={1}>通过</Radio>
                                        <Radio disabled value={2}>拒绝</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {parseInt(isCheck) == 2 ?
                                    <Form.Item label='原因'>
                                        <TextArea disabled autosize={{ minRows: 3 }} value={res}></TextArea>
                                    </Form.Item>
                                    : null}
                            </>)
                    } else {
                        return (
                            <>
                                <Form.Item label={'账户：' + ele.username + '【当前管理员】'}>
                                    <Radio.Group value={this.state.check_status} onChange={e => { this.setState({ check_status: e.target.value, reason: '' }) }}>
                                        <Radio value={1}>通过</Radio>
                                        <Radio value={2}>拒绝</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {this.state.check_status == 1 ? null :
                                    <Form.Item label='原因'>
                                        <TextArea autosize={{ minRows: 3 }} value={this.state.reason} onChange={(e) => {
                                            this.setState({ reason: e.target.value })
                                        }}></TextArea>
                                    </Form.Item>
                                }
                            </>
                        )
                    }
                })}
            </>
        )
    }
    render() {
        return (
            <div className='animated fadeIn'>
                <Card title='讲师申请管理' extra={this.renderBtn}>
                    <Tabs activeKey={this.state.status} onChange={val => {
                        this.setState({ status: val, keyword: '' }, () => { this.page_current = 1; this.getTeacherApply() })
                    }}>
                        <Tabs.TabPane tab="待审核" key={'0'}>

                        </Tabs.TabPane>
                        <Tabs.TabPane tab="已审核" key={'1'}>

                        </Tabs.TabPane>
                    </Tabs>
                    <Input.Search
                        placeholder="卡号／姓名"
                        onSearch={() => {
                            this.page_current = 1
                            this.getTeacherApply()
                        }}
                        style={{ maxWidth: 200 }}
                        value={this.state.keyword}
                        onChange={(e) => {
                            this.setState({ keyword: e.target.value })
                        }}
                        className='m_10'
                    />
                    <Select style={{ width: '150px' }} value={this.state.companyNo} onChange={(val) => {
                        this.page_current = 1
                        this.setState({ companyNo: val }, () => { this.getTeacherApply() })
                    }}>
                        <Option value={''}>全部</Option>
                        {
                            this.state.companyList.map(item => {
                                return (
                                    <Option value={item.companyNo}>{item.companyName}</Option>
                                )
                            })
                        }
                    </Select>
                    <Table rowKey='applyId' loading={this.state.loading} dataSource={this.data_list} columns={this.col} pagination={{
                        current: this.page_current,
                        pageSize: this.page_size,
                        total: this.page_total,
                        showQuickJumper: true,
                        onChange: (val) => {
                            this.page_current = val
                            this.getTeacherApply()
                        },
                        showTotal: (total) => '总共' + total + '条'
                    }} />
                </Card>
                <Modal
                    title={'当前评审组【' + this.state.roleName + '】'}
                    visible={this.state.checkPannel}
                    onCancel={() => { this.setState({ checkPannel: false }) }}
                    onOk={this.state.isLog ? () => { this.setState({ checkPannel: false }) } : this.checkTeacherApply}
                >
                    <Form layout='vertical'>
                        {this.renderCheckPanel()}
                    </Form>
                </Modal>
                <Modal
                    title='导入'
                    visible={this.state.showImportPannel}
                    closable={true}
                    maskClosable={true}
                    okText='开始导入'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showImportPannel: false })
                    }}
                    onOk={this.importTeacherApply}
                    confirmLoading={this.state.importLoading}
                >
                    <Form labelCol={{ span: 6 }}>
                        <Form.Item label="选择Excel文件">
                            <AntdOssUpload
                                showMedia={false}
                                actions={this.props.actions}
                                maxLength={1}
                                tip='上传文件'
                                value={[]}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                listType='text'
                                ref={(ref) => { this.excelFile = ref }}
                            />
                            <div style={{ color: "#8e8e8e", marginTop: '10px', lineHeight: '1.5' }}>
                                <p>
                                    * 导入前，请先下载Excel模板文件<br />
                                    * 仅支持xlsx格式的文件
                                </p>
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/dff4d08b-e550-475f-91d6-cc3f42f3c350.xlsx'>
                                    Excel导入模板下载
                                </a>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title='设置' visible={this.state.settingPannel} onCancel={() => { this.setState({ settingPannel: false }) }} onOk={this.publishApplySetting}>
                    <Form layout='vertical'>
                        <Form.Item label='申请审批流设置'>
                            <InputNumber min={1} max={6} value={this.state.inaudit} onChange={(val) => {
                                this.setState({ inaudit: val })
                            }}></InputNumber>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title='讲师申请设置' visible={this.state.settingStatus} onCancel={() => { this.setState({ settingStatus: false }) }} onOk={this.postStatus} >
                    <Form layout='vertical'>
                        <Form.Item label='是否开启申请通道'>
                            <Switch checked={this.state.open == 1 ? true : false} onChange={(e) => {
                                if (e) {
                                    this.setState({ open: 1 })
                                } else {
                                    this.setState({ open: 0 })
                                }
                            }} />
                        </Form.Item>
                        <Form.Item label='关闭通道提示'>
                        <TextArea autoSize={{ minRows: 4 }} value={this.state.content} onChange={e => { this.setState({ content: e.target.value }) }} className="m_w400" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    // col = [
    //     { title:'ID',dataIndex:'userId',key:'userId',ellipsis:false, },
    //     { title:'账号',dataIndex:'username',key:'username',ellipsis:false, },
    //     { title:'审核结果',dataIndex:'checkLogs',key:'checkLogs1',render:(item,ele)=>{
    //         //checkLogs
    //         return ''
    //     }}
    // ]
    col = [
        { title: 'ID', dataIndex: 'applyId', key: 'applyId', ellipsis: false, },
        { title: '用户账号', dataIndex: 'mobile', key: 'userId', ellipsis: false, },
        { title: '名字', dataIndex: 'name', key: 'name', ellipsis: false, },
        { title: '电话', dataIndex: 'mobile', key: 'mobile', ellipsis: false, },
        { title: '卡号', dataIndex: 'sn', key: 'sn', ellipsis: false, },
        { title: '公司', dataIndex: 'companyName', key: 'companyName', ellipsis: false, },
        // { title: '省份', dataIndex: 'regionName', key: 'regionName', ellipsis: false, render:(item,ele)=>{
        //     return ele.regionName?ele.regionName.split(',')[0]:null
        // }},
        {
            title: '申请时间', dataIndex: '', key: '', ellipsis: false, render: (item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },
        {
            title: '审核状态', dataIndex: '', key: '', ellipsis: false, render: (item, ele) => {
                if (ele.status == 0) {
                    const { checkNum } = this.state
                    let arr = []

                    for (let i = 1; i < checkNum + 1; i++) {
                        arr.push(
                            <Button
                                disabled={ele.checkPnum + 1 !== i}
                                key={i + ele.applyId + 'check'}
                                className='m_2'
                                size='small'
                                onClick={this.onCheck.bind(this, ele.applyId, 'teacherApply/@' + i + '@')}
                            >
                                评审{i}组
                            </Button>
                        )
                    }
                    console.log(arr)
                    return arr
                } else if (ele.status == 1) {
                    return '通过'
                } else if (ele.status == 2) {
                    return '拒绝'
                }
            }
        },
        {
            title: '操作', dataIndex: '', key: '', ellipsis: false, render: (item, ele) => {
                return (
                    <>
                        <Button value='teacherApply/history' className='m_2' type="primary" size={'small'} onClick={this.showLog.bind(this, ele.applyId)}>
                            审核记录
                        </Button>
                        <Button value='teacherApply/view' className='m_2' type="primary" size={'small'} onClick={() => {
                            let url = '/teacher/apply/edit/1/'
                            if (ele.status !== 0) { url = '/teacher/apply/check/1/' }
                            this.props.history.push(url + ele.applyId)
                        }}>
                            查看
                        </Button>
                        <Popconfirm
                            value='teacherApply/del'
                            okText="确定"
                            cancelText='取消'
                            title='确定删除吗？'
                            onConfirm={this.actionTeacherApply.bind(this, ele.applyId, 'delete')}
                        >
                            <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                        </Popconfirm>
                    </>
                )
            }
        },
    ]

    onCheck(check_apply_id, item_rule) {
        this.setState({ getAdminLoading: true })
        this.props.actions.user({
            resolved: (data) => {
                const { rule, username, name } = data

                let c_username = cookie.load('admin_name')
                if (username == c_username) {

                    if (_.indexOf(rule, item_rule) == -1) {
                        cookie.save('admin_name', username, { path: '/', maxAge: 60 * 60 * 24 * 7 })
                        this.onRefuse()
                    } else {
                        this.getCheckList(check_apply_id, name)
                        this.setState({ isLog: false, check_apply_id: check_apply_id, checkPannel: true })
                    }

                } else {
                    message.info({
                        content: '当前登录的管理员是另一个账号，页面将重新刷新',
                        onClose: () => {
                            window.location.reload()
                        }
                    })
                }
            },
            rejected: (data) => {
                message.error(data.codeErrorMsg)
            }
        })
    }
    showLog(check_apply_id) {
        this.props.actions.user({
            resolved: (data) => {
                const { name } = data
                this.getCheckList(check_apply_id, name)
                this.setState({ isLog: true, check_apply_id: check_apply_id, checkPannel: true })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    getCheckList = (check_apply_id, roleName) => {
        this.props.actions.getCheckList({
            ctype: 29,
            content_id: check_apply_id,
            resolved: (data) => {
                if (data instanceof Array) {
                    this.setState({ checkList: data, roleName })
                }
            },
            rejected: (data) => {
                console.log(data)
                setTimeout(() => {
                    this.setState({ checkPannel: false })
                }, 2000);
            }
        })
    }
    checkTeacherApply = () => {

        const { check_apply_id: apply_id, check_status: status, reason } = this.state
        if (status == 2 && reason == '') { message.info('请输入拒绝原因'); return; }
        this.props.actions.actionTeacherApply({
            apply_id,
            status,
            reason,
            action: 'status',
            resolved: (data) => {
                message.success('提交成功')
                this.setState({ checkPannel: false })
                this.getTeacherApply()
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
}
const LayoutComponent = TeacherApply;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        data_list: state.teacher.teacher_apply,
        num: state.user.num
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });