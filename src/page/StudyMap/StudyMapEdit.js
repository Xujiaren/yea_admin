import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PersonTypePublic from '../../components/PersonTypePublic'
import SwitchCom from '../../components/SwitchCom'
import action from '../../redux/action';

const options = [
    { label: '客户代表', value: '5' },
    { label: '客户经理', value: '6' },
    { label: '中级经理', value: '7' },
    { label: '客户总监', value: '8' },
    { label: '高级客户总监', value: '9' },
    { label: '资深客户总监', value: 'GG' },

    // { label: '直销员', value: '1' },
    // { label: '服务中心员工', value: '3' },
    // { label: '服务中心负责人', value: '4' },
];

class StudyMapEdit extends Component {
    state = {
        importLoading: false,
        loading: false,
        view_mode: false,
        paper_type: 0,
        searching: false,
        select_data: [],
        select_value: [],
        paper_list: [],
        step: -1,
        level: '5',
        level_name: '',
        level_id: 0,
        map_id: '',
        paper_id: 0,
        course_id: 0,
        status: 1,
        flag: '',
        content_sort: 1, //0:先试卷，1：先课程

        showPaperPanel: false,
        showWords: false
    }

    select_data = []
    auth_paper_list = []
    paper_keyword = ''
    paper_ctype = 26
    map_type = 0
    componentWillMount() {
        this.getAuthPaper()
        this.getCourse()
        const { view, id } = this.props.match.params
        const { actions } = this.props
        this.setState({ view_mode: view == '1' ? true : false, level_id: id })
        if (id !== '0') {
            actions.getStudyMap({ level_id: id })
        }
    }
    componentWillReceiveProps(n_props) {
        if (n_props.study_level !== this.props.study_level) {
            console.log(n_props.study_level)
            if (n_props.study_level.data.length !== 0) {
                let {
                    contentSort: content_sort,
                    courseId: course_id,
                    paperId: paper_id,
                    flag,
                    level,
                    levelId: level_id,
                    levelName: level_name,
                    mapId: map_id,
                    pubTime,
                    score,
                    status,
                    step,
                    course,
                    paper,
                } = n_props.study_level.data[0]
                level += ''

                let paper_list = []

                if (content_sort == 1) {
                    if (course !== null) {
                        paper_list.push({ status: course['status'], uid: course['courseId'] + 'course', id: course['courseId'], label: course['courseName'], ptype: 0 })
                    }
                    if (paper !== null) {
                        paper_list.push({ status: paper['status'], uid: paper['paperId'] + 'paper', id: paper['paperId'], label: paper['paperName'], ptype: 1 })
                    }
                } else {
                    if (paper !== null) {
                        paper_list.push({ status: paper['status'], uid: paper['paperId'] + 'paper', id: paper['paperId'], label: paper['paperName'], ptype: 1 })
                    }
                    if (course !== null) {
                        paper_list.push({ status: course['status'], uid: course['courseId'] + 'course', id: course['courseId'], label: course['courseName'], ptype: 0 })
                    }
                }

                this.setState({
                    paper_list,
                    level_name,
                    map_id,
                    status,
                    step,
                    flag,
                    level,
                    content_sort,
                    course_id,
                    paper_id,
                })
            }
        }
        if (n_props.course_list !== this.props.course_list) {
            this.select_data = n_props.course_list.data || []
        }
        if (n_props.auth_paper_list !== this.props.auth_paper_list) {
            this.auth_paper_list = n_props.auth_paper_list.data || []
        }
    }
    getAuthPaper = () => {
        const { actions } = this.props;
        const { keyword } = this.state
        actions.getAuthPaper({
            ctype: this.paper_ctype,
            page: 0,
            pageSize: 20,
            keyword,
        })
    }
    getCourse = () => {
        const { actions } = this.props
        const { keyword } = this.state
        actions.getCourse({
            keyword,
            page: 0,
            pageSize: 20,
            ctype: 0
        })
    }
    // asyncGetCourse = debounce(this.getCourse, 400);
    // asyncGetAuthPaper = debounce(this.getAuthPaper, 400);

    onSelectSearch = (value) => {
        const { paper_type } = this.state
        if (paper_type == 0) {
            this.props.actions.getCourse({
                keyword: value,
                page: 0,
                pageSize: 20,
                ctype: -1
            })
            // this.getCourse()
            // this.asyncGetCourse()
        } else {
            this.props.actions.getAuthPaper({
                ctype: this.paper_ctype,
                page: 0,
                pageSize: 20,
                keyword: value,
            })
            // this.getAuthPaper()
            // this.asyncGetAuthPaper()
        }
    }
    onSelectChange = (value) => {
        this.setState({ select_value: value })
    }
    onPaperOk = () => {
        const { select_value, paper_type } = this.state
        const tips = paper_type == 0 ? '课程' : '试卷'
        if (select_value.length == 0) {
            message.info('请选择' + tips)
            return
        }
        const { key, label } = select_value
        const item = {
            uid: key + '' + Date.now(),
            id: key,
            label: label,
            ptype: paper_type,
            status: 1
        }
        this.setState(pre => {

            let canPush = true
            const exist = pre.paper_list.filter(ele => {
                if (paper_type == ele.ptype) canPush = false
                return ele.ptype == paper_type && ele.id == key
            })
            if (exist.length > 0) {
                message.info('已经存在该' + tips)
            } else if (!canPush) {
                message.info('只能添加一个' + tips)
            } else {
                return { paper_list: [...pre.paper_list, item], showPaperPanel: false }
            }

        })
    }
    _onPublish = () => {
        const { actions } = this.props
        this.setState({ loading: true })
        if (this.onPublish() == false) {
            this.setState({ loading: false, importLoading: false })
        }
    }
    onPublish = () => {
        let that = this
        const { actions } = this.props
        const { level_id, map_id, step, status, level, level_name, paper_list } = this.state
        const type = this.map_type
        let { content_sort } = this.state
        let paper_id = ''
        let course_id = ''
        let flag = (this.refs.flag && this.refs.flag.getValue()) || ''
        let file_url = ''

        if (flag == '/I/') {
            file_url = this.refs.flag.getFile()
        }

        if (flag === null) {
            return false;
        }
        console.log(flag)
        if (level_name == '') { message.info('请输入关卡名称'); return false; }
        if (level == '') { message.info('请选择级别'); return false; }
        if (isNaN(step)) { message.info('请输入正确的排序'); return false; }
        // if(step<0||step>127){ message.info('排序不能大于 127 或者小于 0 '); return false; }
        // if(step%1 !== 0){ message.info('排序请取整数'); return false; }
        if (paper_list.length == 0) { message.info('请选择关联'); return false; }

        paper_list.map((ele, index) => {
            if (index == 0) {
                if (ele.ptype == 1) {
                    content_sort = 0
                } else {
                    content_sort = 1
                }
            }

            if (ele.ptype == 0) {
                course_id = ele.id
            } else {
                paper_id = ele.id
            }
        })
        if (level_id) {
            actions.checkMap({
                action: 'check',
                level_id: level_id,
                resolved: (res) => {
                    console.log(res,'?????')
                    if (res == true) {
                        this.setState({
                            showWords: true
                        })
                        actions.setStudyMap({
                            type, level_id, map_id, step, paper_id, course_id, status, level, flag, content_sort, level_name,
                            resolved: (data) => {
                                const { levelId } = data
                                actions.postMapMails({
                                    level_id: levelId,
                                    resolved: (res) => {

                                    },
                                    rejected: (err) => {
                                        console.log(err)
                                    }
                                })
                                if (flag == '/I/' && file_url !== '') {
                                    that.refs.flag.uploadFile(levelId, that.props.actions, that, 27)
                                }
                            },
                            rejected: (data) => {
                                that.setState({ loading: false, importLoading: false })
                                message.error(data)
                            }
                        })
                    } else {
                        actions.setStudyMap({
                            type, level_id, map_id, step, paper_id, course_id, status, level, flag, content_sort, level_name,
                            resolved: (data) => {
                                const { levelId } = data
                                actions.postMapMails({
                                    level_id: levelId,
                                    resolved: (res) => {

                                    },
                                    rejected: (err) => {
                                        console.log(err)
                                    }
                                })
                                if (flag == '/I/' && file_url !== '') {
                                    this.refs.flag.uploadFile(levelId, this.props.actions, this, 27)
                                } else {
                                    message.success({
                                        content: '提交成功',
                                        onClose: () => {
                                            window.history.back()
                                        }
                                    })
                                }
                            },
                            rejected: (data) => {
                                this.setState({ loading: false, importLoading: false })
                                message.error(data)
                            }
                        })
                    }
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else {
            actions.setStudyMap({
                type, level_id, map_id, step, paper_id, course_id, status, level, flag, content_sort, level_name,
                resolved: (data) => {
                    const { levelId } = data
                    actions.postMapMails({
                        level_id: levelId,
                        resolved: (res) => {

                        },
                        rejected: (err) => {
                            console.log(err)
                        }
                    })
                    if (flag == '/I/' && file_url !== '') {
                        this.refs.flag.uploadFile(levelId, this.props.actions, this, 27)
                    } else {
                        message.success({
                            content: '提交成功',
                            onClose: () => {
                                window.history.back()
                            }
                        })
                    }
                },
                rejected: (data) => {
                    this.setState({ loading: false, importLoading: false })
                    message.error(data)
                }
            })
        }

    }
    onRight = () => {
        let {
            level_id,

        } = this.state;
        this.props.actions.checkMap({
            action: 'clear',
            level_id:level_id,
            resolved: (res) => {
                this.setState({
                    showWords: false
                })
                message.success({
                    content: '提交成功',
                    onClose: () => {
                        this.setState({ loading: false })
                        window.history.back()
                    }
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })

    }
    onOut = () => {
        this.setState({
            showWords: false
        })
        message.success({
            content: '提交成功',
            onClose: () => {
                this.setState({ loading: false })
                window.history.back()
            }
        })
    }
    onEdit(index) {
        const { paper_list } = this.state
        const { ptype, uid, label } = paper_list[index]
        this.setState({
            select_value: { key: uid, label: label },
            paper_type: ptype,
            showPaperPanel: true,
        })
    }
    onRemove(index) {
        this.setState(pre => {
            return { paper_list: pre.paper_list.filter((_ele, _index) => _index !== index) }
        })
    }
    onDragEnd = ({ source, destination }) => {
        if (destination == null) return

        const reorder = (list, startIndex, endIndex) => {
            const [removed] = list.splice(startIndex, 1);
            list.splice(endIndex, 0, removed);

            return list;
        }

        this.setState(pre => {
            return { paper_list: reorder([...pre.paper_list], source.index, destination.index) }
        })
    }
    infoName = (val) => {
        if (val.ctype == 0) {
            return val.courseName + '[视频]'
        } else if (val.ctype == 1) {
            return val.courseName + '[音频]'
        } else if (val.ctype == 3) {
            return val.courseName + '[图文]'
        } else {
            return val.courseName
        }
    }
    render() {
        const { status, importLoading, loading, view_mode, level_id, step, level, level_name, paper_list, paper_type } = this.state
        const renderSelect = () => {
            if (paper_type == 0)
                return this.select_data.map(ele => (
                    <Select.Option
                        disabled={ele.ctype !== 3 && (ele.chapter == 0 || ele.status == 0)}
                        key={ele.courseId + 'course'} value={ele.courseId}>{(ele.status == 0 ? '(未上架)' : '') + (ele.chapter == 0 && ele.ctype !== 3 ? '(无章节)' : '') + this.infoName(ele)}</Select.Option>
                ))
            else
                return this.auth_paper_list.map(ele => (
                    <Select.Option
                        disabled={ele.num == 0 || ele.status == 0}
                        key={ele.paperId + 'paper'} value={ele.paperId}>{(ele.status == 0 ? '(未上架)' : '') + (ele.num == 0 ? '(无题目)' : '') + ele.paperName}</Select.Option>
                ))
        }
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={level_id == 0 ? '添加关卡' : view_mode ? '查看' : '修改关卡'}
                    >
                        <Card title="" style={{ minHeight: '400px' }}>
                            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                <Form.Item label="关卡名称">
                                    <Input disabled={view_mode} value={level_name} onChange={e => this.setState({ level_name: e.target.value })} className='m_w400' />
                                </Form.Item>
                                <Form.Item label="级别">
                                    <Select disabled={view_mode} value={level} onChange={(val) => { this.setState({ level: val }) }} className='m_w400'>
                                        <Select.Option value={''}>无</Select.Option>
                                        {options.map((ele, index) => (
                                            <Select.Option key={index + 'level'} value={ele.value}>{ele.label}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                {/* <Form.Item label="排序">
                                    <Input disabled={view_mode} value={step} onChange={e=>this.setState({step:e.target.value})} className='m_w400'/>
                                </Form.Item> */}
                                <Form.Item label="关联试卷">
                                    {view_mode ?
                                        <>
                                            {paper_list.map((item, index) => (
                                                <div key={item.uid} draggableId={item.uid} index={index}>
                                                    <div>
                                                        <div style={{ padding: '10px 0', lineHeight: 1.5 }}>
                                                            <span>
                                                                {index + 1}、 <Tag>{item.ptype == 0 ? '课程' : '试卷'}</Tag>
                                                            </span>
                                                            <span style={{ paddingLeft: '10px' }}>{item.label}{item.status == 1 ? '' : '【未上架】'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                        :
                                        <DragDropContext disabled={view_mode} onDragEnd={this.onDragEnd}>
                                            <Droppable disabled={view_mode} droppableId="droppable" >
                                                {provided => (
                                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                                        {paper_list.map((item, index) => (
                                                            <Draggable key={item.uid} draggableId={item.uid} index={index}>
                                                                {provided => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <div style={{ padding: '10px 0', lineHeight: 1.5 }}>
                                                                            <span>{index + 1}、 <Tag>{item.ptype == 0 ? '课程' : '试卷'}</Tag></span>
                                                                            <span style={{ paddingLeft: '10px' }}>{item.label}{item.status == 1 ? '' : '【未上架】'}</span>
                                                                            <span style={{ float: 'right' }}>
                                                                                {/* <a onClick={this.onEdit.bind(this,index)} style={{paddingRight:'10px'}}>修改</a> */}
                                                                                <a onClick={this.onRemove.bind(this, index)}>删除</a>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    }
                                    <Button type="dashed" disabled={view_mode} onClick={() => {
                                        this.setState({
                                            showPaperPanel: true,
                                            paper_type: 0,
                                            select_value: []
                                        }
                                        )
                                    }} style={{ minWidth: '10%' }}>
                                        <Icon type="plus" /> 选择关联
                                    </Button>

                                </Form.Item>
                                {/* <Form.Item label="发布对象">
                                    <PersonTypePublic actions={this.props.actions} contentId={this.state.level_id} ctype='27' showUser={this.state.level_id=='0'?false:true} ref='flag' disabled={view_mode} flag={this.state.flag} />
                                </Form.Item> */}
                                <Form.Item label="是否上架">
                                    <SwitchCom disabled={view_mode} value={status} onChange={val => this.setState({ status: val })} />
                                </Form.Item>
                            </Form>
                            <div className="flex f_row j_center">
                                {
                                    view_mode ? null :
                                        <Button loading={loading || importLoading} onClick={this._onPublish} type="primary">{importLoading ? '正在导入' : '提交'}</Button>
                                }
                            </div>
                        </Card>
                    </PageHeader>
                </Card>

                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    title='选择关联'
                    okText='添加'
                    cancelText='取消'
                    visible={this.state.showPaperPanel}
                    maskClosable={true}
                    onCancel={() => { this.setState({ showPaperPanel: false }) }}
                    onOk={this.onPaperOk}
                >
                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                        <Form.Item label='关联类型'>
                            <Radio.Group
                                value={this.state.paper_type}
                                onChange={(e) => this.setState({
                                    select_value: [],
                                    paper_type: e.target.value
                                })}
                            >
                                <Radio value={0}>课程</Radio>
                                <Radio value={1}>试卷</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={this.state.paper_type == 0 ? '选择课程' : this.state.paper_type == 1 ? '选择试卷' : ''}>
                            <Select
                                showSearch
                                labelInValue
                                placeholder="搜索关键词"
                                notFoundContent={this.state.searching ? <Spin size="small" /> : <Empty />}
                                filterOption={false}
                                onSearch={this.onSelectSearch}
                                onChange={this.onSelectChange}
                                style={{ width: '400px' }}
                                value={this.state.select_value}
                            >
                                {renderSelect()}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal visible={this.state.showWords} onCancel={this.onOut} onOk={this.onRight}>
                    <div style={{padding: '5px'}}>提示：当前关卡已经有用户完成过，若修改关卡关联则会清空此关所有完成记录，是否继续</div>
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = StudyMapEdit;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        course_list: state.course.course_list,
        auth_paper_list: state.auth.auth_paper_list,
        study_level: state.course.study_level,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
