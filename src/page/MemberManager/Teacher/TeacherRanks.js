import React, { Component } from 'react'
import { Input, Radio, Modal, Form, Checkbox, Tabs, Card, Table, message, InputNumber, Select,DatePicker } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import connectComponent from '../../../util/connect';
import cookie from 'react-cookies'
import AntdOssUpload from '../../../components/AntdOssUpload';
import { Button, Popconfirm } from '../../../components/BtnComponent'
import locale from 'antd/es/date-picker/locale/zh_CN';
const {Option} = Select
const { TextArea } = Input
const map_txt = [

    { label: '卡号/工号', value: 'sn', disabled: true },
    { label: '姓名', value: 'name' },
    { label: '年龄', value: 'age' },
    { label: '性别', value: 'sex' },
    { label: '省份', value: 'province' },

    { label: '学历', value: 'edu' },
    { label: '电话', value: 'phone' },

    { label: '服务中心', value: 'center' },
    { label: '特长', value: 'advantage' },
    { label: '副卡', value: 'ssn' },
    { label: '讲师类型', value: 'ttype' },
    { label: '培训授课经历', value: 'experience' },
    { label: '个人履历及能力自诉', value: 'skill' },
    { label: '培训证件', value: 'card' },
    { label: '蓝底照片', value: 'photo' },
];

class TeacherRanks extends Component {
    state = {
        edit: true,
        view: true,
        status: '0',
        data_list: [],
        loading: false,

        map_txt: ['sn'],
        audit: 1,
        settingPannel: false,
        settingLoading: false,
        map: Object.keys(map_txt).map(ele => map_txt[ele].value),

        checkNum: 1,

        check_status: 1,
        check_apply_id: 0,
        reason: '',
        teacher_level: [],

        level: '',
        keyword: '',
        checkList: [],
        isLog: false,
        roleName: '空',
        inaudit: 0,
        leveldate: false,
        texts: '',
        begin_time: '',
        end_time: '',
        BeginTime: null,
        EndTime: null,
        companyList:[],
        companyNo:'',
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
        this.onSetting()
        this.getTeacherLevel()
        this.getNums()
        this.getCompany()
    }
    getCompany=()=>{
        const{actions}=this.props
        actions.getCompanyList({
            resolved:(res)=>{
                console.log(res)
                this.setState({
                    companyList:res
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    getNums = () => {
        this.props.actions.getApplySetting({
            keyy: 'apply_dates',
            section: 'teacher',
            resolved: (data) => {
                console.log(data[0], '??')
                this.setState({
                    text: data[0].val
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        // this.props.actions.getApplySetting({
        //     keyy: 'audit_cycle_begin',
        //     section: 'teacher',
        //     resolved: (data) => {
        //         let begin_time = moment.unix(data[0].val).format('YYYY-MM-DD HH:mm')
        //         let BeginTime = moment(begin_time)
        //         this.setState({
        //             BeginTime:BeginTime,
        //             begin_time:begin_time
        //         })
        //     },
        //     rejected: (data) => {
        //         message.error(JSON.stringify(data))
        //     }
        // })
        this.props.actions.getApplySetting({
            keyy: 'audit_cycle_end',
            section: 'teacher',
            resolved: (data) => {
                let end_time = moment.unix(data[0].val).format('YYYY-MM-DD')
                let EndTime = moment(end_time)
               this.setState({
                    EndTime:EndTime,
                    end_time:end_time
               })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    onLevelDate = () => {
        const{begin_time,BeginTime,end_time,EndTime}=this.state
        let beg = Date.parse(begin_time)/1000
        let end =  Date.parse(end_time)/1000
        console.log(beg,end,'///////')
        console.log(beg,end)
        this.props.actions.publishNum({
            keyy: 'apply_dates',
            section: 'teacher',
            val: this.state.text,
            resolved: (data) => {
                // message.success('提交成功')
                this.setState({ leveldate: false }, () => {
                    this.getNums()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        // this.props.actions.publishNum({
        //     keyy: 'audit_cycle_begin',
        //     section: 'teacher',
        //     val: beg.toString(),
        //     resolved: (data) => {
        //         // message.success('提交成功')
        //         this.setState({ leveldate: false }, () => {
        //             this.getNums()
        //         })
        //     },
        //     rejected: (data) => {
        //         message.error(JSON.stringify(data))
        //     }
        // })
        this.props.actions.publishNum({
            keyy: 'audit_cycle_end',
            section: 'teacher',
            val: end.toString(),
            resolved: (data) => {
                message.success('提交成功')
                this.setState({ leveldate: false }, () => {
                    this.getNums()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    componentWillReceiveProps(n_props) {

        if (n_props.data_list !== this.props.data_list) {
            this.data_list = n_props.data_list.data || []
            this.page_current = (n_props.data_list.page || 0) + 1
            this.page_total = n_props.data_list.total
        }
        if (n_props.teacher_info !== this.props.teacher_info) {
            this.setState({
                level: n_props.teacher_info.level
            })
        }

    }

    onSetting = () => {
        this.setState({ settingLoading: true })
        this.props.actions.getApplySetting({
            keyy: 'audits',
            section: 'teacher',
            resolved: (data) => {
                this.setState({ settingLoading: false })
                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        this.setState({ audit: Number(val), checkNum: Number(val) })
                    }
                }

            },
            rejected: (data) => {
                this.setState({ settingLoading: false })
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.getApplySetting({
            keyy: 'choose_field',
            section: 'teacher',
            resolved: (data) => {
                this.setState({ settingLoading: false })
                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        console.log(JSON.parse(val))
                        this.setState({ map_txt: JSON.parse(val) })
                    }
                }
            },
            rejected: (data) => {
                this.setState({ settingLoading: false })
                message.error(JSON.stringify(data))
            }
        })
    }
    getTeacherApply = () => {
        this.setState({ loading: true })
        this.props.actions.getTeacherRank({
            filter: 'rank',
            status: this.state.status,
            pageSize: this.page_size,
            page: this.page_current - 1,
            keyword: this.state.keyword,
            company_no:this.state.companyNo,
            resolved: (data) => {
                this.setState({ loading: false })
            },
            rejected: (data) => {
                this.setState({ loading: false })
                message.error(JSON.stringify(data))
            }
        })
    }
    onLevel = (val) => {

        this.setState({ check_id: val.checkId, levelPannel: true })
        const { actions } = this.props
        actions.getTeacherInfo(val.teacherId)
    }
    renderBtn = (
        <>
            <Button value='teacherRank/course' className='m_2' onClick={() => { 
                if(this.state.end_time=='1970-01-01'){
                    message.info({
                        content:'截止时间已失效，请重新设置！'
                    })
                }
                this.setState({ leveldate: true }) 
                }}>考核周期设置</Button>
            <Button value='teacherRank/course' className='m_2' onClick={() => { this.setState({ showImportPannel: true }) }}>导入课程数据</Button>
            <Button value='teacherRank/out' className='m_2' loading={this.state.exportLoading} onClick={() => { this.exportTeacherApply(); }}>导出</Button>
            <Button value='teacherRank/setting' className='m_2' loading={this.state.settingLoading} onClick={() => { this.setState({ settingPannel: true }) }}>定级审批流设置</Button>
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
                <Card title='讲师定级管理' extra={this.renderBtn}>
                    <Tabs activeKey={this.state.status} onChange={val => {
                        this.setState({ status: val, keyword: '' }, () => { this.page_current = 1; this.getTeacherApply() })
                    }}>
                        <Tabs.TabPane tab="待审核" key={'0'}>

                        </Tabs.TabPane>
                        <Tabs.TabPane tab="已审核" key={'1'}>

                        </Tabs.TabPane>
                        <Tabs.TabPane tab="未达标" key={'3'}>

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
                    <Select style={{width:'150px'}} value={this.state.companyNo} onChange={(val) => {
                        this.page_current=1
                        this.setState({ companyNo: val },()=>{this.getTeacherApply()}) 
                        }}>
                            <Option value={''}>全部</Option>
                        {
                            this.state.companyList.map(item=>{
                                return(
                                    <Option value={item.companyNo}>{item.companyName}</Option>
                                ) 
                            })
                        }
                    </Select>
                    <Table rowKey='checkId' loading={this.state.loading} dataSource={this.data_list} columns={this.state.status == 0 ? this.col_new : this.col} pagination={{
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
                <Modal title='设置' visible={this.state.settingPannel} onCancel={() => { this.setState({ settingPannel: false }) }} onOk={this.publishApplySetting}>
                    <Form layout='vertical'>
                        <Form.Item label='设置申请讲师字段'>
                            <Checkbox.Group
                                value={this.state.map_txt}
                                options={map_txt}
                                onChange={(val) => { this.setState({ map_txt: val }) }}
                            />
                        </Form.Item>

                        <Form.Item label='定级审批流设置'>
                            <InputNumber min={1} max={6} value={this.state.audit} onChange={(val) => {
                                this.setState({ audit: val })
                            }}></InputNumber>
                        </Form.Item>

                    </Form>
                </Modal>
                <Modal
                    title='导入课程数据'
                    visible={this.state.showImportPannel}
                    closable={true}
                    maskClosable={true}
                    okText='开始导入'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showImportPannel: false })
                    }}
                    destroyOnClose={true}
                    onOk={this._onImport}
                    confirmLoading={this.state.importLoading}
                >
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        <Form.Item label="选择Excel文件">
                            <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' listType='text' ref={(ref) => { this.excelFile = ref }}></AntdOssUpload>
                        </Form.Item>
                        <Form.Item label="说明">
                            <div style={{ color: "#8e8e8e", marginTop: '10px', lineHeight: '1.5' }}>
                                <p>
                                    * 导入前，请先下载Excel模板文件<br />
                                    * 仅支持xlsx格式的文件
                                    &nbsp;&nbsp;&nbsp;
                                    <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/3ec76bc6-2a32-463b-a232-a601fa6a43e7.xlsx'>
                                        Excel导入模板下载
                                    </a>
                                </p>

                            </div>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title='设置讲师等级' visible={this.state.levelPannel} onCancel={() => { this.setState({ levelPannel: false }) }} onOk={this.onLevelChange}>
                    <Form layout='vertical'>
                        <Form.Item label='选择讲师等级'>
                            <Select value={this.state.level} onChange={(val) => {
                                console.log(val,'???')
                                this.setState({ level: val })
                            }}>
                                {/* <Select.Option value={''}>无</Select.Option> */}
                                {
                                    this.state.teacher_level.map(ele => (
                                        <Select.Option key={ele.level + 'level'} value={ele.level}>{ele.levelName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>
                <Modal title='设置讲师等级' visible={this.state.leveldate} onCancel={() => { this.setState({ leveldate: false }) }} onOk={this.onLevelDate}>

                    <Input.TextArea autoSize={{ minRows: 6 }} value={this.state.text} onChange={e => { this.setState({ text: e.target.value }) }}></Input.TextArea>
                    <Form.Item label='考核截止时间设置'>
                        {/* <DatePicker
                            key='t_5'
                            format={'YYYY-MM-DD HH:mm'}
                            placeholder="选择开始时间"
                            onChange={(val, dateString) => {
                                this.setState({
                                    begin_time: dateString,
                                    BeginTime: val
                                })
                            }}
                            value={this.state.BeginTime}
                            locale={locale}
                            showTime={{ format: 'HH:mm' }}
                            allowClear={false}
                        />
                         <span style={{ padding: '0 10px' }}>至</span> */}
                         <DatePicker
                            key='t_6'
                            format={'YYYY-MM-DD'}
                            placeholder="选择开始时间"
                            onChange={(val, dateString) => {
                                this.setState({
                                    end_time: dateString,
                                    EndTime: val
                                })
                            }}
                            value={this.state.EndTime}
                            locale={locale}
                            // showTime={{ format: 'HH:mm' }}
                            allowClear={false}
                        />
                    </Form.Item>
                </Modal>
            </div>
        )
    }
    _onImport = () => {
        this.setState({ importLoading: true })

        const { actions } = this.props
        const that = this
        const file_url = this.excelFile.getValue()

        if (file_url == '') {
            message.info('请选择Excel文件')
            this.setState({ importLoading: false })
            return
        }

        actions.importTeacherCourseData({
            file_url,
            resolved: (data) => {
                message.success('导入成功')
                this.getTeacherApply()
                that.setState({ importLoading: false, showImportPannel: false }, () => {
                })
            },
            rejected: (data) => {
                this.setState({ importLoading: false })
                message.error('导入失败 : ' + data)
            }
        })
    }
    actionTeacherApply = (apply_id, action) => {
        this.props.actions.actionTeacherApply({
            apply_id,
            action,
            type: 'rank',
            resolved: (data) => {
                message.success('提交成功')
                this.getTeacherApply()
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    exportTeacherApply = () => {

        this.setState({ exportLoading: true })
        this.props.actions.exportTeacherApply({
            type: 2,
            company_no:this.state.companyNo,
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

    checkTeacherApply = () => {
        var that = this
        const { check_apply_id: apply_id, check_status: status, reason, inaudit } = this.state
        if (status == 2 && reason == '') { message.info('请输入拒绝原因'); return; }
        this.props.actions.actionTeacherApply({
            apply_id,
            status,
            reason,
            action: 'status',
            type: 'rank',
            resolved: (data) => {
                message.success('提交成功')
                that.setState({ checkPannel: false })
                that.getTeacherApply()

            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    publishApplySetting = () => {
        const { map_txt, audit, inaudit } = this.state
        if (map_txt.length == 0) { message.info('请设置字段'); return; }
        if (isNaN(audit)) { message.info('请设置有效的数字'); return; }
        if (audit % 1 !== 0) { message.info('审核人数请取整数'); return; }
        this.props.actions.publishApplySetting({
            val: JSON.stringify(map_txt), section: 'teacher', keyy: 'choose_field'
        })

        this.props.actions.publishApplySetting({
            val: audit, section: 'teacher', keyy: 'audits',
            resolved: (data) => {
                message.success('提交成功')
                this.setState({ settingPannel: false, checkNum: audit }, () => {
                    this.getTeacherApply()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    col_new = [
        { title: 'ID', dataIndex: 'checkId', key: 'checkId', ellipsis: false, },
        { title: '讲师ID', dataIndex: 'teacherId', key: 'teacherId', ellipsis: false, },
        { title: '用户账号', dataIndex: 'mobile', key: 'mobile', ellipsis: false, },
        { title: '卡号', dataIndex: 'sn', key: 'sn', ellipsis: false, },
        { title: '名字', dataIndex: 'teacherName', key: 'teacherName', ellipsis: false, },

        { title: '当前等级', dataIndex: 'levelName', key: 'levelName', ellipsis: false, },


        {
            title: '申请时间', dataIndex: '', key: '', ellipsis: false, render: (item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },

        { title: '线上课', dataIndex: 'course', key: 'course', ellipsis: false, },
        { title: '线下课', dataIndex: 'importCourse', key: 'importCourse', ellipsis: false, },
        { title: '直播课', dataIndex: 'importLive', key: 'importLive', ellipsis: false, },
        { title: '授课课时', dataIndex: 'newScore', key: 'newScore', ellipsis: false, },
        { title: '学员满意度', dataIndex: 'satisfnew', key: 'satisfnew', ellipsis: false, },
        { title: '新课开发数量', dataIndex: 'newCourse', key: 'newCourse', ellipsis: false, },
        { title: '达标级别', dataIndex: 'newLevelName', key: 'newLevelName', ellipsis: false, },
        // {
        //     title: '晋级(是否达标)', dataIndex: '', key: '', ellipsis: false, render: (item) => {
        //         return (
        //             <div>{item.arrive == true ? '达标' : '未达标'}</div>
        //         )
        //     }
        // },
        // {
        //     title: '申请晋级级别', dataIndex: '', key: '', ellipsis: false, render: (item, ele) => {
        //         if (item.newLevel == 0) {
        //             return (
        //                 <div>讲师</div>
        //             )
        //         } else if (item.newLevel == 1) {
        //             return (
        //                 <div>初级讲师</div>
        //             )
        //         } else if (item.newLevel == 2) {
        //             return (
        //                 <div>中级讲师</div>
        //             )
        //         } else if (item.newLevel == 3) {
        //             return (
        //                 <div>高级讲师</div>
        //             )
        //         }

        //     }
        // },

        {
            title: '审核状态', dataIndex: '', key: '', ellipsis: false, render: (item, ele) => {
                if (ele.status == 0) {
                    const { checkNum } = this.state
                    let arr = []

                    for (let i = 1; i < checkNum + 1; i++) {
                        arr.push(
                            <Button
                                disabled={ele.checkPnum + 1 !== i}
                                key={i + ele.checkId + 'check'}
                                className='m_2'
                                size='small'
                                onClick={this.onCheck.bind(this, ele.checkId, 'teacherRank/$' + i + '$')}
                            >
                                评审{i}组
                    </Button>
                        )
                    }

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
                        <Button value='teacherRank/history' className='m_2' type="primary" size={'small'} onClick={this.showLog.bind(this, ele.checkId)}>
                            审核记录
                    </Button>
                        <Button value='teacherRank/view' className='m_2' type="primary" size={'small'} onClick={() => {
                            this.props.history.push('/teacher/rank/edit/1/' + ele.checkId)
                        }}>
                            查看
                    </Button>
                        {
                            ele.status == 0 ? null :
                                <Button value='teacherRank/edit' className='m_2' type="primary" size={'small'} onClick={this.onLevel.bind(this, ele)}>
                                    修改等级
                        </Button>
                        }
                        <Popconfirm
                            value='teacherRank/del'
                            okText="确定"
                            cancelText='取消'
                            title='确定删除吗？'
                            onConfirm={this.actionTeacherApply.bind(this, ele.checkId, 'delete')}
                        >
                            <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                        </Popconfirm>
                    </>
                )
            }
        },
    ]

    col = [
        { title: 'ID', dataIndex: 'checkId', key: 'checkId', ellipsis: false, },
        { title: '讲师ID', dataIndex: 'teacherId', key: 'teacherId', ellipsis: false, },
        { title: '用户账号', dataIndex: 'mobile', key: 'mobile', ellipsis: false, },
        { title: '卡号', dataIndex: 'sn', key: 'sn', ellipsis: false, },
        { title: '名字', dataIndex: 'teacherName', key: 'teacherName', ellipsis: false, },

        { title: '当前等级', dataIndex: 'levelName', key: 'levelName', ellipsis: false, },


        {
            title: '申请时间', dataIndex: '', key: '', ellipsis: false, render: (item, ele) => {
                return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
            }
        },

        { title: '线上课', dataIndex: 'course', key: 'course', ellipsis: false, },
        { title: '线下课', dataIndex: 'importCourse', key: 'importCourse', ellipsis: false, },
        { title: '直播课', dataIndex: 'importLive', key: 'importLive', ellipsis: false, },
        { title: '授课课时', dataIndex: 'newScore', key: 'newScore', ellipsis: false, },
        { title: '学员满意度', dataIndex: 'satisfnew', key: 'satisfnew', ellipsis: false, },
        { title: '新课开发数量', dataIndex: 'newCourse', key: 'newCourse', ellipsis: false, },



        {
            title: '审核状态', dataIndex: '', key: '', ellipsis: false, render: (item, ele) => {
                if (ele.status == 0) {
                    const { checkNum } = this.state
                    let arr = []

                    for (let i = 1; i < checkNum + 1; i++) {
                        arr.push(
                            <Button
                                disabled={ele.checkPnum + 1 !== i}
                                key={i + ele.checkId + 'check'}
                                className='m_2'
                                size='small'
                                onClick={this.onCheck.bind(this, ele.checkId, 'teacherRank/$' + i + '$')}
                            >
                                评审{i}组
                    </Button>
                        )
                    }
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
                        <Button value='teacherRank/view' className='m_2' type="primary" size={'small'} onClick={() => {
                            this.props.history.push('/teacher/rank/edit/1/' + ele.checkId)
                        }}>
                            查看
                    </Button>
                        {
                            ele.status == 0 ? null :
                                <Button value='teacherRank/edit' className='m_2' type="primary" size={'small'} onClick={this.onLevel.bind(this, ele)}>
                                    修改等级
                        </Button>
                        }
                        <Popconfirm
                            value='teacherRank/del'
                            okText="确定"
                            cancelText='取消'
                            title='确定删除吗？'
                            onConfirm={this.actionTeacherApply.bind(this, ele.checkId, 'delete')}
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
                message.error(JSON.stringify(data))
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
            ctype: 30,
            content_id: check_apply_id,
            resolved: (data) => {
                if (data instanceof Array) {
                    this.setState({ checkList: data, roleName })
                }
            },
            rejected: (data) => {
                message.erorr(JSON.stringify(data))
            }
        })
    }
    getTeacherLevel = () => {
        this.props.actions.getTeacherLevel({
            resolved: (data) => {

                this.setState({ teacher_level: data || [] })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    onLevelChange = () => {
        const { check_id, level } = this.state
        this.props.actions.changeTeacherLevel({
            check_id, level,
            resolved: (data) => {
                message.success('提交成功')
                this.getTeacherApply()
                this.setState({ levelPannel: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
}
const LayoutComponent = TeacherRanks;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        data_list: state.teacher.teacher_rank,
        teacher_info: state.teacher.teacher_info,

    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });