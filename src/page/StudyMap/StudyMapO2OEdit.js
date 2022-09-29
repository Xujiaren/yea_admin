import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PersonTypePublic from '../../components/PersonTypePublic'
import SwitchCom from '../../components/SwitchCom'

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

class StudyMapO2OEdit extends Component {
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
        level: '',
        level_name: '',
        level_id: 0,
        map_id: '0',
        paper_id: 0,
        course_id: 0,
        status: 1,
        flag: '',
        content_sort: 1, //0:先试卷，1：先课程， 2:培训班

        showPaperPanel: false,
        data_list: [],
        type: 2,
    }
    personType = {
        getValue: () => '',
        uploader: () => false
    }
    squad_list = []
    select_data = []
    auth_paper_list = []
    paper_keyword = ''
    paper_ctype = 26
    map_type = 0
    componentWillMount() {
        this.getStudyMapO2O()
        this.getAuthPaper()
        this.getAuthClass()
        this.getCourse()
        const { mapId, id } = this.props.match.params
        const { actions } = this.props
        this.setState({ map_id: mapId, level_id: id })
        if (this.props.match.path === '/topic/o2oStudyMap/view/:mapId/:id') {
            this.setState({ view_mode: true })
        }
        if (id !== '0') {
            actions.getStudyMap({ type: this.state.type, level: '', level_id: id, map_id: mapId, page: 0, pageSize: 10 })
        }
    }
    componentWillReceiveProps(n_props) {
        if (n_props.study_level !== this.props.study_level) {
            console.log(n_props.study_level, '????')
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
                    squad,
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
                } else if (content_sort == 0) {
                    if (paper !== null) {
                        paper_list.push({ status: paper['status'], uid: paper['paperId'] + 'paper', id: paper['paperId'], label: paper['paperName'], ptype: 1 })
                    }
                    if (course !== null) {
                        paper_list.push({ status: course['status'], uid: course['courseId'] + 'course', id: course['courseId'], label: course['courseName'], ptype: 0 })
                    }
                } else {
                    if (squad !== null) {
                        paper_list.push({ uid: squad['squadId'] + 'squadId', id: squad['squadId'], label: squad['squadName'], ptype: 2 })
                    }
                    // if(course !== null){
                    //     paper_list.push({ status:course['status'], uid:course['courseId']+'course',id:course['courseId'],label:course['courseName'],ptype:0 })
                    // }
                }

                this.setState({
                    paper_list,
                    level_name,
                    map_id: map_id + '',
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
        if (n_props.squad_list !== this.props.squad_list) {
            this.squad_list = n_props.squad_list.data
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
    getAuthClass = () => {
        const { actions } = this.props
        const { keyword } = this.state
        actions.getSquad({
            keyword,
            status: 1,
            pageSize: 20,
            stype: 0,
            page: 0,
            type: 'cert'
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
                ctype: 0
            })
            // this.getCourse()
            // this.asyncGetCourse()
        } else if (paper_type == 1) {
            this.props.actions.getAuthPaper({
                ctype: this.paper_ctype,
                page: 0,
                pageSize: 20,
                keyword: value,
            })
            // this.getAuthPaper()
            // this.asyncGetAuthPaper()
        } else {
            this.props.actions.getSquad({
                keyword: value,
                status: 1,
                pageSize: 20,
                stype: 0,
                page: 0,
                type: 'cert'
            })
        }
    }
    onSelectChange = (value) => {
        this.setState({ select_value: value })
    }
    onPaperOk = () => {
        const { select_value, paper_type } = this.state
        const tips = paper_type == 0 ? '课程' : paper_type == 1 ? '试卷' : '线下培训班'
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
        this.setState({ loading: true })
        if (this.onPublish() == false) {
            this.setState({ loading: false, importLoading: false })
        }
    }
    onPublish = () => {
        const { actions } = this.props
        let { type, level_id, map_id, step, status, level, level_name, paper_list, data_list } = this.state
        let { content_sort } = this.state
        let paper_id = ''
        let course_id = ''
        let squad_id = ''
        let flag = this.personType.getValue()
        let file_url = ''

        if (level_name == '') { message.info('请输入关卡名称'); return false; }
        if (!map_id) { message.info('请选择级别'); return false; }
        if (isNaN(step)) {
            message.info('请输入正确的排序'); return false;
        } else {
            step = parseInt(step)
        }
        // if(step<0||step>127){ message.info('排序不能大于 127 或者小于 0 '); return false; }
        // if(step%1 !== 0){ message.info('排序请取整数'); return false; }
        if (paper_list.length == 0) { message.info('请选择关联'); return false; }
        let vas = data_list.filter(item => item.map_id == map_id)
        let stp = 0
        if (vas.length > 0 && vas[0].steps.length > 0) {
            stp = vas[0].steps[vas[0].steps.length - 1]
        }
        paper_list.map((ele, index) => {
            if (index == 0) {
                if (ele.ptype == 1) {
                    content_sort = 0
                } else if (ele.ptype == 0) {
                    content_sort = 1
                } else {
                    //线下培训班
                    content_sort = 2
                }
            }

            if (ele.ptype == 0) {
                course_id = ele.id
            } else if (ele.ptype == 1) {
                paper_id = ele.id
            } else {
                squad_id = ele.id
            }
        })
        console.log(squad_id)
        if( this.state.map_id == 0 && this.state.level_id == 0 ){
            actions.setStudyMap({
                squad_id, level: '', type, level_id, map_id, step: stp, paper_id, course_id, status, flag, content_sort, level_name,
                resolved: async (data) => {
                    const { levelId } = data
                    let result = false
                    if (levelId) {
                        result = await this.personType.uploader(levelId)
                    }
                    if (!result)
                        message.success({
                            content: '提交成功',
                            onClose: () => {
                                window.history.back()
                            }
                        })
                },
                rejected: (data) => {
                    this.setState({ loading: false, importLoading: false })
                    message.error(data)
                }
            })
        }else{
            actions.setStudyMap({
                squad_id, level: '', type, level_id, map_id, step:step, paper_id, course_id, status, flag, content_sort, level_name,
                resolved: async (data) => {
                    const { levelId } = data
                    let result = false
                    if (levelId) {
                        result = await this.personType.uploader(levelId)
                    }
                    if (!result)
                        message.success({
                            content: '提交成功',
                            onClose: () => {
                                window.history.back()
                            }
                        })
                },
                rejected: (data) => {
                    this.setState({ loading: false, importLoading: false })
                    message.error(data)
                }
            })
        }
       
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
    render() {
        const { squad_list, status, importLoading, loading, view_mode, level_id, step, level, level_name, paper_list, paper_type } = this.state
        const renderSelect = () => {
            if (paper_type == 0)
                return this.select_data.map(ele => (
                    <Select.Option disabled={ele.chapter == 0 || ele.status == 0} key={ele.courseId + 'course'} value={ele.courseId}>{(ele.status == 0 ? '(未上架)' : '') + (ele.chapter == 0 ? '(无章节)' : '') + ele.courseName}</Select.Option>
                ))
            else if (paper_type == 1)
                return this.auth_paper_list.map(ele => (
                    <Select.Option disabled={ele.num == 0 || ele.status == 0} key={ele.paperId + 'paper'} value={ele.paperId}>{(ele.status == 0 ? '(未上架)' : '') + (ele.num == 0 ? '(无题目)' : '') + ele.paperName}</Select.Option>
                ))
            else
                return this.squad_list.map(ele => (
                    <Select.Option key={ele.squadId + 'class'} value={ele.squadId}>{ele.squadName}</Select.Option>
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
                                {
                                    this.state.map_id == 0 && this.state.level_id == 0 ?
                                        <Form.Item label="选择级别">
                                            <Select disabled={view_mode} value={this.state.map_id} onChange={(val) => { this.setState({ map_id: val }) }} className='m_w400'>
                                                <Select.Option value={'0'}>无</Select.Option>
                                                {this.state.data_list.map((ele, index) => (
                                                    <Select.Option key={ele.map_id} value={ele.map_id}>{ele.map_name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        :
                                        <Form.Item label="选择级别">
                                        <Select disabled={true} value={this.state.map_id} onChange={(val) => { this.setState({ map_id: val }) }} className='m_w400'>
                                            <Select.Option value={'0'}>无</Select.Option>
                                            {this.state.data_list.map((ele, index) => (
                                                <Select.Option key={ele.map_id} value={ele.map_id}>{ele.map_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                }

                                {/* <Form.Item label='选择主线副线'>
                                    <Radio.Group value={this.state.type} onChange={e=>this.setState({ type:e.target.value })}>
                                        <Radio value={1}>主线</Radio>
                                        <Radio value={2}>副线</Radio>
                                    </Radio.Group>
                                </Form.Item> */}
                                {/* <Form.Item label="排序">
                                    <Input disabled={view_mode} value={step} onChange={e=>this.setState({step:e.target.value})} className='m_w400'/>
                                </Form.Item> */}
                                <Form.Item label="选择关联">
                                    {view_mode ?
                                        <>
                                            {paper_list.map((item, index) => (
                                                <div key={item.uid} draggableId={item.uid} index={index}>
                                                    <div>
                                                        <div style={{ padding: '10px 0', lineHeight: 1.5 }}>
                                                            <span>
                                                                {index + 1}、 <Tag>{item.ptype == 0 ? '课程' : item.ptype == 1 ? '试卷' : '线下培训班'}</Tag>
                                                            </span>
                                                            <span style={{ paddingLeft: '10px' }}>{item.label}{item.status == 1 || item.ptype == 2 ? '' : '【未上架】'}</span>
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
                                                                            <span>{index + 1}、 <Tag>{item.ptype == 0 ? '课程' : item.ptype == 1 ? '试卷' : '线下培训班'}</Tag></span>
                                                                            <span style={{ paddingLeft: '10px' }}>{item.label}{item.status == 1 || item.ptype == 2 ? '' : '【未上架】'}</span>
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
                                    {
                                        this.state.paper_list.length == 0 ?
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
                                            : null}

                                </Form.Item>
                                {/* <Form.Item label="发布对象">
                                    <PersonTypePublic
                                        disabled={view_mode}
                                        ref={ref=>this.personType = ref}
                                        actions={this.props.actions}
                                        showO2O={false}
                                        showUser={this.state.level_id=='0'?false:true} 
                                        flag={this.state.flag}
                                        contentId={this.state.level_id}
                                        ctype={38}
                                        parent={this}
                                    >
                                    </PersonTypePublic>
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
                                <Radio value={2}>线下培训班</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={this.state.paper_type == 0 ? '选择课程' : this.state.paper_type == 1 ? '选择试卷' : this.state.paper_type == 2 ? '选择线下班' : ''}>
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
            </div>
        )
    }
}

const LayoutComponent = StudyMapO2OEdit;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        squad_list: state.o2o.squad_list,
        course_list: state.course.course_list,
        auth_paper_list: state.auth.auth_paper_list,
        study_level: state.course.study_level,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
