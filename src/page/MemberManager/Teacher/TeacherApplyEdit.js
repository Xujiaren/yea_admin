import React, { Component } from 'react'
import { Tag, Checkbox, Select, Input, InputNumber, Form, PageHeader, Tabs, Card, Button, Table, Radio, message } from 'antd'
import _ from 'lodash'

import connectComponent from '../../../util/connect';
import TextArea from 'antd/lib/input/TextArea';
import AntdOssUpload from '../../../components/AntdOssUpload'



class TeacherApplyEdit extends Component {
    state = {
        view_mode: false,

        id: 0,
        photoList: [],
        cardList: [],

        sn: '',
        name: '',
        age: '',
        sex: 0,
        province: '',
        edu: '',
        phone: '',
        center: '',
        ssn: '',
        teacher_type: '',
        advantage: '',
        experience: '',
        skill: '',

        user_id: 0,
        content_id: 0,
        ctype: '29',
        status: 1,
        reason: '',


        tips: '',
        validating: false,


        check_mode: false,
        map: [],
        companyName: '',
    }
    page_current = 1
    page_size = 10
    page_total = 0

    componentWillMount() {
        const { view, id } = this.props.match.params
        if (this.props.match.path == '/teacher/apply/check/:view/:id') {
            this.setState({ check_mode: true })
        }


        if (id !== '0') {
            let filter = ''
            if (this.props.match.path == '/teacher/rank/edit/:view/:id') {
                filter = 'rank'
            }

            this.props.actions.getTeacherApply({
                apply_id: id,
                filter: filter,
                resolved: (data) => {
                    console.log(data)
                    const { total } = data
                    if (total == 0) return;
                    if (!data.data[0].name) {
                        var {
                            age,
                            applyId: apply_id,
                            categoryIds: teacher_type,
                            contentId: content_id,
                            ctype: ctype,
                            edu: edu,
                            mobile: phone,
                            teacherName: name,
                            photo,
                            province,

                            service: center,
                            sex,
                            sn,
                            ssn,
                            status,
                            strong: advantage,
                            trainExp: experience,
                            content: skill,

                            trainCert,
                            reason,
                            galleries,
                            companyName,
                        } = data.data[0]
                    } else {
                        var {
                            age,
                            applyId: apply_id,
                            categoryIds: teacher_type,
                            contentId: content_id,
                            ctype: ctype,
                            edu: edu,
                            mobile: phone,
                            name: name,
                            photo,
                            province,

                            service: center,
                            sex,
                            sn,
                            ssn,
                            status,
                            strong: advantage,
                            trainExp: experience,
                            selfExp: skill,

                            trainCert,
                            reason,
                            galleries,
                            companyName,
                        } = data.data[0]
                    }



                    let photoList = []
                    let _cardList = photo && photo.split(',').map(ele => ({ uid: ele, name: ele, type: 'image/png', status: 'done', url: ele }))

                    if (galleries) {
                        photoList = galleries.map(ele => ({ uid: ele.link, name: ele.link, type: 'image/png', status: 'done', url: ele.fpath }))
                    }
                    this.setState({
                        photoList,
                        cardList: Array.isArray(_cardList) ? _cardList : [],

                        age,
                        apply_id,
                        teacher_type,
                        content_id,
                        ctype,
                        edu,
                        phone,
                        name,
                        photo,
                        province,

                        center,
                        sex,
                        sn,
                        ssn,
                        status,
                        advantage,
                        experience,
                        skill,
                        reason,
                        companyName
                    })
                },
                rejected: (data) => {
                    message.error(JSON.stringify(data))
                }
            })
        }
        this.setState({
            view_mode: view == '1',
            id: Number(id)
        })
        this.getSetting()
    }
    componentWillReceiveProps(n_props) {

    }
    getSetting = () => {
        this.props.actions.getApplySetting({
            keyy: 'choose_field',
            section: 'teacher',
            resolved: (data) => {
                this.setState({ settingLoading: false })
                if (Array.isArray(data) && data['length'] > 0 && data[0]) {
                    const { val } = data[0]
                    if (val) {
                        console.log(JSON.parse(val))
                        this.setState({ map: JSON.parse(val) })
                    }
                }
            },
            rejected: (data) => {
                this.setState({ settingLoading: false })
                message.error(JSON.stringify(data))
            }
        })
    }
    _onPublish = () => {
        if (this.onPublish() === false) {
            this.setState({ loading: false })
        }
    }
    onPublish = () => {
        this.setState({ loading: true })
        const { map, id: apply_id, user_id, content_id, phone: mobile, sn, ssn, name, age, sex, ctype, center: service, edu, province, teacher_type: category_ids, advantage: strong, experience: train_exp, skill: self_exp } = this.state
        const train_cert = this.refs.card.getValue()
        const photo = this.refs.photo.getValue()

        if (sn == '' && map.indexOf('sn') > -1) { message.info('请输入卡号'); return false; }
        if (name == '' && map.indexOf('name') > -1) { message.info('请输入姓名'); return false; }
        if (!age && map.indexOf('age') > -1) { message.info('请输入年龄'); return false; }
        if (province == '' && map.indexOf('province') > -1) { message.info('请输入省份'); return false; }
        if (edu == '' && map.indexOf('edu') > -1) { message.info('请输入学历'); return false; }

        if (train_cert == '' && map.indexOf('card') > -1) { message.info('请上传培训证件照'); return false; }
        if (photo == '' && map.indexOf('photo') > -1) { message.info('请上传蓝底照片'); return false; }

        this.props.actions.setTeacherApply({
            user_id, content_id, mobile, sn, ssn, name, age, sex, service, edu, province, category_ids, strong, train_exp, self_exp, train_cert, photo,
            resolved: (data) => {
                message.success({
                    content: '提交成功',
                    onClose: () => {
                        window.history.back()
                        this.setState({ loading: false })
                    }
                })
            },
            rejected: (data) => {
                this.setState({ loading: false })
                message.error(JSON.stringify(data))
            }
        })
    }
    _onBlur = (e) => {

        if (e.target.value) {
            this.setState({ validating: true })
            this.props.actions.getUser({
                keywords: e.target.value,
                resolved: (data) => {
                    console.log(data)
                    const { total, data: list } = data
                    if (total == 1 && list.length !== 0) {
                        let { nickname: name, sex, mobile: phone } = list[0]
                        let tips = '', validating = false
                        this.setState({ name, sex, phone, tips, validating })
                    } else {
                        this.setState({ tips: '未匹配到用户', validating: false })
                    }
                },
                rejected: (data) => {
                    this.setState({ validating: false })
                    message.error(JSON.stringify(data))
                }
            })
        } else {
            this.setState({ tips: '' })
        }

    }
    actionTeacherApply = () => {
        const { apply_id, status, reason } = this.state
        if (status == 2 && reason == '') { message.info('请输入拒绝原因'); return; }
        this.props.actions.actionTeacherApply({
            apply_id,
            status,
            reason,
            resolved: (data) => {

            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    renderFooter = () => {
        const { check_mode, view_mode, status, reason } = this.state
        if (check_mode)
            if (!view_mode)
                return (
                    <Form.Item label="审核">
                        <Radio.Group value={status} onChange={e => { this.setState({ status: e.target.value }) }}>
                            <Radio value={1}>通过</Radio>
                            <Radio value={2}>拒绝</Radio>
                        </Radio.Group>
                        <div>
                            <TextArea autoSize={{ minRows: 3 }} value={reason} className='m_w400' onChange={(e) => {
                                this.setState({ reason: e.target.value })
                            }}></TextArea>
                        </div>
                    </Form.Item>
                )
            else
                return (
                    <Form.Item label="审核结果">
                        {status == 1 ? <Tag>通过</Tag> : <Tag>拒绝</Tag>}
                        {status == 2 ?
                            <div>
                                <TextArea autoSize={{ minRows: 3 }} disabled={true} value={reason} className='m_w400'></TextArea>
                            </div>
                            : null}
                    </Form.Item>
                )
    }
    render() {
        const { status, reason, check_mode, id, view_mode, map, loading, tips, validating } = this.state
        return (
            <div className='animated fadeIn'>
                <Card>
                    <PageHeader
                        className=""
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={id == 0 ? '申请讲师' : view_mode ? '查看' : '修改关卡'}
                    >
                        <Card>
                            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>

                                <Form.Item
                                    label="卡号/工号"
                                    className={map.indexOf('sn') > -1 ? '' : 'hide'}
                                    hasFeedback={tips ? true : false}
                                    help={tips ? tips : ''}
                                    placeholder='搜索'
                                    validateStatus={validating ? 'validating' : ''}
                                >
                                    <Input onBlur={this._onBlur} disabled={view_mode} value={this.state.sn} onChange={e => this.setState({ sn: e.target.value })} className='m_w400' />
                                </Form.Item>
                                <Form.Item label="姓名" className={map.indexOf('name') > -1 ? '' : 'hide'}>
                                    <Input disabled={view_mode} value={this.state.name} onChange={e => this.setState({ name: e.target.value })} className='m_w400' />
                                </Form.Item>
                                <Form.Item label="年龄" className={map.indexOf('age') > -1 ? '' : 'hide'}>
                                    <InputNumber min={0} max={99} disabled={view_mode} value={this.state.age} onChange={e => this.setState({ age: e })} className='m_w400' />
                                </Form.Item>
                                <Form.Item label="性别" className={map.indexOf('sex') > -1 ? '' : 'hide'}>
                                    <Radio.Group value={this.state.sex} disabled={view_mode} onChange={e => { this.setState({ sex: e.target.value }) }}>
                                        {/* <Radio value={0}>无</Radio> */}
                                        <Radio value={1}>男</Radio>
                                        <Radio value={2}>女</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {
                                    view_mode ?
                                        <Form.Item label="公司">
                                            <Input disabled={view_mode} value={this.state.companyName} onChange={e => this.setState({ province: e.target.value })} className='m_w400' />
                                        </Form.Item>
                                        : null
                                }
                                <Form.Item label="学历" className={map.indexOf('edu') > -1 ? '' : 'hide'}>
                                    <Input disabled={view_mode} value={this.state.edu} onChange={e => this.setState({ edu: e.target.value })} className='m_w400' />
                                </Form.Item>
                                <Form.Item label="电话" className={map.indexOf('phone') > -1 ? '' : 'hide'}>
                                    <Input disabled={view_mode} value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} className='m_w400' />
                                </Form.Item>
                                <Form.Item label="服务中心" className={map.indexOf('center') > -1 ? '' : 'hide'}>
                                    <Input disabled={view_mode} value={this.state.center} onChange={e => this.setState({ center: e.target.value })} className='m_w400' />
                                </Form.Item>
                                {/* <Form.Item label="副卡" className={map.indexOf('ssn')>-1?'':'hide'}>
                                <Input disabled={view_mode} value={this.state.ssn} onChange={e=>this.setState({ssn:e.target.value})} className='m_w400'/>
                            </Form.Item> */}
                                <Form.Item label="申报讲师类型" className={map.indexOf('ttype') > -1 ? '' : 'hide'}>
                                    <Select className='m_w400' disabled={view_mode} value={this.state.teacher_type} onChange={(val) => { this.setState({ teacher_type: val }) }}>
                                        <Select.Option value={''}>无</Select.Option>
                                        <Select.Option value={'159'}>企业文化</Select.Option>
                                        <Select.Option value={'160'}>健康管理</Select.Option>
                                        <Select.Option value={'161'}>日化</Select.Option>
                                        <Select.Option value={'162'}>美容</Select.Option>
                                        <Select.Option value={'163'}>专业素质</Select.Option>
                                        <Select.Option value={'164'}>自我发展</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="特长" className={map.indexOf('advantage') > -1 ? '' : 'hide'}>
                                    <TextArea disabled={view_mode} autoSize={{ minRows: 4 }} value={this.state.advantage} className='m_w400' onChange={e => this.setState({ advantage: e.target.value })}></TextArea>
                                </Form.Item>
                                <Form.Item label="培训授课经历" className={map.indexOf('experience') > -1 ? '' : 'hide'}>
                                    <TextArea disabled={view_mode} autoSize={{ minRows: 4 }} value={this.state.experience} className='m_w400' onChange={e => this.setState({ experience: e.target.value })}></TextArea>
                                </Form.Item>
                                <Form.Item label="个人履历及能力自述" className={map.indexOf('skill') > -1 ? '' : 'hide'}>
                                    <TextArea disabled={view_mode} autoSize={{ minRows: 4 }} value={this.state.skill} className='m_w400' onChange={e => this.setState({ skill: e.target.value })}></TextArea>
                                </Form.Item>
                                <Form.Item label="职业资格证书" className={map.indexOf('card') > -1 ? '' : 'hide'}>
                                    {this.state.photoList.length == 0 ? <Tag>暂无</Tag> :
                                        <AntdOssUpload
                                            actions={this.props.actions}
                                            maxLength={2}
                                            accept='image/*'
                                            value={this.state.photoList}
                                            disabled={view_mode}
                                            tip={this.state.cardList.length == 0 && view_mode ? '暂无图片' : '选择图片'}
                                            ref='card'
                                        />}
                                </Form.Item>
                                <Form.Item label="蓝底照片" className={map.indexOf('photo') > -1 ? '' : 'hide'}>
                                    {this.state.cardList.length == 0 ? <Tag>暂无</Tag> :
                                        <AntdOssUpload
                                            actions={this.props.actions}
                                            maxLength={1}
                                            accept='image/*'
                                            value={this.state.cardList}
                                            disabled={view_mode}
                                            tip={this.state.cardList.length == 0 && view_mode ? '暂无图片' : '选择照片'}
                                            ref='photo'
                                        />}
                                </Form.Item>
                                {this.renderFooter()}
                            </Form>
                            <div className="flex f_row j_center">
                                {
                                    view_mode ? null :
                                        <Button loading={loading} onClick={check_mode ? this.actionTeacherApply : this._onPublish} type="primary">{'提交'}</Button>
                                }
                            </div>
                        </Card>
                    </PageHeader>
                </Card>
                <style>
                    {style}
                </style>
            </div>
        )
    }
    col = [
        { title: 'ID', dataIndex: '', key: '', ellipsis: false, },
        { title: '用户账号', dataIndex: '', key: '', ellipsis: false, },
        { title: '名字', dataIndex: '', key: '', ellipsis: false, },
        { title: '电话', dataIndex: '', key: '', ellipsis: false, },
        { title: '卡号', dataIndex: '', key: '', ellipsis: false, },
        { title: '申请时间', dataIndex: '', key: '', ellipsis: false, },
        { title: '审核状态', dataIndex: '', key: '', ellipsis: false, },
    ]
}
const style = `
    .hide{ display:none }
`
const LayoutComponent = TeacherApplyEdit;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        user_list: state.user.user_list,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });