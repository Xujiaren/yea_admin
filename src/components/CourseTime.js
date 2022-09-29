import React, { Component } from 'react';
import { TimePicker, Modal, Form, Upload, message, Icon, Select, DatePicker, Space } from 'antd';
import moment from 'moment'
import locale from 'antd/es/date-picker/locale/zh_CN';
import PropTypes from 'prop-types'
import { Button } from './BtnComponent'

export default class CourseTime extends Component {
    state = {
        action: 'down',
        timeString: '',
        upDate:null,
        downDate:null,
        up_date:'',
        down_date:'',
        upTime: null,
        downTime: null,
        down_time: '',
        up_time: '',
    };
    static defaultProps = {
        courseIds: [],
        value: ''
    }
    static propTypes = {
        value: PropTypes.string,
        courseIds: PropTypes.array,
    }

    componentDidMount() {

    }
    componentWillMount() {
    }
    componentWillReceiveProps(n_props) {

    }
    setCourseUpDownTime = () => {
        const { up_time, down_time, action,up_date,down_date} = this.state;
        let courseIds = this.props.courseIds || [];

        if (!up_time && action == 'up') { message.info('请设置上架时间'); return; }
        if (!down_time && action == 'up') { message.info('请设置下架时间'); return; }
        if (Array.isArray(courseIds) && courseIds.length > 0) {
        const up = up_date+'／'+up_time
        const down = down_date+'／'+down_time
        console.log(up)
            this.props.actions.setCourseUpDownTime({
                up_time:up,
                down_time:down,
                course_ids: courseIds.join(','),
                action: action,
                resolved: (data) => {
                    message.success('提交成功')
                    this.setState({ show: false, upTime: null, downTime: null })
                },
                rejected: (data) => {
                    message.error(JSON.stringify(data))
                }
            })
        } else {
            message.info('请选择课程')
        }
    }
    disabledDate = (current)=>{
        return current < moment().subtract(1, 'day')
    }
    render() {
        return (
            <>
                <Button value={this.props.value} onClick={() => {
                    if (this.props.courseIds.length == 0) {
                        message.info('请选择课程'); return;
                    }
                    this.setState({
                        show: true,
                        action: 'up'
                    })
                }} className="m_2" size='small'>定时上下架</Button>
                <Button value={this.props.value} onClick={() => {
                    if (this.props.courseIds.length == 0) {
                        message.info('请选择课程'); return;
                    }
                    this.setState({
                        action: 'down',
                        up_time: '',
                        down_time: ''
                    }, () => {
                        this.setCourseUpDownTime()
                    })
                }} className="m_2" size='small'>取消定时上下架</Button>
                <Modal visible={this.state.show} maskClosable={true} cancelText='取消' okText='确定' onOk={this.setCourseUpDownTime} onCancel={() => { this.setState({ show: false }) }}>
                    <Form layout='vertical'>
                        <Form.Item label='设置上架时间'>
                            <DatePicker value={this.state.upDate} disabledDate = {this.disabledDate} onChange={(date, dateString) => {
                                this.setState({upDate:date, up_date:dateString})
                            }} />
                            <TimePicker value={this.state.upTime} format='HH:mm' allowClear={true} locale={locale} onChange={(date, dateString) => {
                                this.setState({ upTime: date, up_time: dateString })
                            }} />
                        </Form.Item>
                        <Form.Item label='设置下架时间'>
                            <DatePicker value={this.state.downDate} disabledDate = {this.disabledDate} onChange={(date, dateString) => {
                                this.setState({downDate:date, down_date:dateString})
                            }} />
                            <TimePicker value={this.state.downTime} format='HH:mm' allowClear={true} locale={locale} onChange={(date, dateString) => {
                                this.setState({ downTime: date, down_time: dateString })
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }

}