import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Upload,Popover, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import customUpload from '../../components/customUpload'
import SwitchCom from '../../components/SwitchCom';
import Editor from '../../components/Editor'
import PersonType from '../../components/PersonType'

class MeettingEdit extends Component {
    state = {
        view_mode: false,
        course_type: 48,
        course_exchange: 0,
        exchange_num: 0,
        is_must: 0,
        status: 0,
        course_id: 0,
        fileList: [],
        videoList: [],
        media_id: 0,
        testList: [],
        title: '',
        content: '',
        channels_list: [],
        channel_id: 0,
        sn: 0,
        flag: '',
        loading: false,
        importLoading: false,
        size: '',
        duration: '',
        summary: '',
        auth_paper_list: [],
        paper: {},
        sort_order:0,
        pdfList:[],
    }
    componentWillMount() {
        const { id } = this.props.match.params
        const { path } = this.props.match
        if (path == '/meetting/view/:id') {
            this.setState({ view_mode: true })
        }
        if (parseInt(id) !== 0) {
            this.setState({ course_id: parseInt(id) })
            const { actions } = this.props
            actions.getCourseInfo(parseInt(id))
        }
        this.getChannels()
        this.getAuthPaper()
        const { actions } = this.props
        actions.getCoursePaper({
            course_id: id,
            resolved: (res) => {
                if (res.length != 0) {
                    let pap = {
                        key: res[0].paperId,
                        label: res[0].paperName
                    }
                    this.setState({
                        paper: pap
                    })
                }
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getAuthPaper = () => {
        const { actions } = this.props;
        actions.getAuthPaper({
            ctype: 48,
            paper_id: '',
            keyword: '',
            page: 0,
            pageSize: 10
        })
    }
    getChannels = () => {
        const { actions } = this.props
        actions.getChannels(4, this.state.keyword, 0, this.page_size)
    }

    componentWillReceiveProps(n_props) {
        if (n_props.channels_list != this.props.channels_list) {
            this.setState({
                channels_list: n_props.channels_list.data
            })
        }
        if (n_props.course_info != this.props.course_info) {
            let videoList = []
            let fileList = []
            if (n_props.course_info.mediaId !== '') {
                videoList = [{ status: 'done', type: 'video/mp4', response: { resultBody: n_props.course_info.mediaId }, uid: 'dd', name: n_props.course_info.mediaId, url: '' }]
            }
            if (n_props.course_info.courseImg) {
                let imgs = n_props.course_info.courseImg.split(',')
                imgs.map((ele, idx) => {
                    fileList.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
                })
            }
            if(n_props.course_info.integral>0){
                this.setState({
                    course_exchange:4
                })
            }
            let pdfList = []
            if(Array.isArray(n_props.course_info.coursewareList)){
                n_props.course_info.coursewareList.map(ele=>{
                    pdfList.push({
                        uid:ele.fpath,
                        type:'image/png',
                        status:'done',
                        url:ele.fpath,
                    })
                })
            }
            this.setState({
                course_type: n_props.course_info.ctype,
                title: n_props.course_info.courseName,
                summary: n_props.course_info.summary,
                channel_id: n_props.course_info.categoryId,
                is_must: n_props.course_info.isMust,
                status: n_props.course_info.status,
                sn: n_props.course_info.sn,
                content: n_props.course_info.content,
                fileList: fileList,
                videoList: videoList,
                pdfList:pdfList,
                sort_order:n_props.course_info.sortOrder,
                exchange_num:n_props.course_info.integral
            })
        }
        if (n_props.auth_paper_list !== this.props.auth_paper_list) {
            this.setState({
                auth_paper_list: n_props.auth_paper_list.data
            })
        }
    }
    onOk = () => {
        const { course_type, title, summary, course_id, duration, size, flag, fileList, media_id, is_must, status, sn, course_exchange, exchange_num, channel_id, paper,sort_order } = this.state
        const course_img = (this.img && this.img.getValue()) || ''
        const { actions } = this.props
        var that = this
        const content = this.refs.editor.toHTML()
        if (!title) { message.info({ content: '???????????????' }); return; }
        if (!summary) { message.info({ content: '???????????????' }); return; }
        if (!course_img) { message.info({ content: '???????????????' }); return; }
        if (!sn) { message.info({ content: '?????????????????????' }); return; }
        if (sort_order > 9999) { message.info('????????????????????????9999'); return false; }
        if (!content || content == '<p></p>') { message.info('?????????????????????'); return false; }
        if(channel_id==0){message.info('???????????????'); return false; }
        if (course_type == 48) {
            // if(!media_id){message.info({content:'???????????????'});return;}
            this.setState({ loading: true })
            // actions.mediaAction({
            //     video_id:media_id,
            //     action:'info',
            //     resolved:(data)=>{
            //         let duration = data.duration
            //         let size = data.size
            actions.publishCourses({
                begin_url: '',
                begin_url_type: 0,
                end_url: '',
                end_url_type: 0,
                promote_begin: '',
                promote_end: '',
                promote_price: 0,
                cost_price: 0,
                market_price: 0,
                tlevel: 0,
                ulevel: 0,
                tuser_tax: 0,
                vuser_tax: 0,
                user_tax: 0,
                is_agent: 0,
                level_integral: 0,
                ctype: course_type,
                category_id: channel_id,
                content: content,
                course_id: course_id,
                course_img: course_img,
                course_name: title,
                flag: flag,
                integral: exchange_num,
                is_recomm: '',
                sn: sn,
                room_id: '',
                sort_order: sort_order,
                status: status,
                summary: summary,
                tag_ids: '',
                teacher_id: 0,
                ttype: 0,
                is_series: 0,
                score: 5,
                images: '',
                begin_time: '',
                end_time: '',
                media_id: media_id,
                ccategory_id: 0,
                duration: duration,
                size: size,
                is_shop: 0,
                teacher_name: '',
                can_share: 1,
                notify: 0,
                course_integral: '',
                course_cash: '',
                pay_type: course_exchange,
                ltype: 0,
                plant: 0,
                is_must: is_must,
                resolved: (res) => {
                    console.log(res)
                    let course_ids = res.courseId
                    let channel_ids = channel_id
                    actions.recommCourse({
                        course_ids,
                        channel_ids,
                        type: 0,
                        resolved: (data) => {
                            this.setState({ loading: false })
                            message.success({ content: '????????????' })
                            window.history.back()
                        },
                        rejected: (data) => {
                            message.error(data)
                        }
                    })
                },
                rejected: (err) => {
                    console.log(err)
                },
            })

            //     },
            //     rejected:(data)=>{
            //         message.error('???????????????????????????????????????????????????'+JSON.stringify(data))
            //     }
            // })
        } else if (course_type == 49) {
            if (paper === {}) { message.info({ content: '???????????????' }) }
            actions.publishCourses({
                begin_url: '',
                begin_url_type: 0,
                end_url: '',
                end_url_type: 0,
                promote_begin: '',
                promote_end: '',
                promote_price: 0,
                cost_price: 0,
                market_price: 0,
                tlevel: 0,
                ulevel: 0,
                tuser_tax: 0,
                vuser_tax: 0,
                user_tax: 0,
                is_agent: 0,
                level_integral: 0,
                ctype: course_type,
                category_id: channel_id,
                content: content,
                course_id: course_id,
                course_img: course_img,
                course_name: title,
                flag: flag,
                integral: exchange_num,
                is_recomm: '',
                sn: sn,
                room_id: '',
                sort_order: sort_order,
                status: status,
                summary: summary,
                tag_ids: '',
                teacher_id: 0,
                ttype: 0,
                is_series: 0,
                score: 5,
                images: '',
                begin_time: '',
                end_time: '',
                media_id: '',
                ccategory_id: 0,
                duration: duration,
                size: size,
                is_shop: 0,
                teacher_name: '',
                can_share: 1,
                notify: 0,
                course_integral: '',
                course_cash: '',
                pay_type: course_exchange,
                ltype: 0,
                plant: 0,
                is_must: is_must,
                resolved: (res) => {
                    console.log(res)
                    let course_ids = res.courseId
                    let channel_ids = channel_id
                    actions.setCoursePaper({
                        course_id: course_ids,
                        paper_id: paper.key,
                        paper_name: paper.label,
                        ltype: 0,
                        resolved: (data) => {
                            console.log(data)
                        },
                        rejected: (data) => {
                            message.error(data)
                        }
                    })
                    actions.recommCourse({
                        course_ids,
                        channel_ids,
                        type: 0,
                        resolved: (data) => {
                            this.setState({ loading: false })
                            message.success({ content: '????????????' })
                            window.history.back()
                        },
                        rejected: (data) => {
                            message.error(data)
                        }
                    })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else if (course_type == 50) {
            let courseware = ''
            courseware = this.pdf.getValue()
            if (!courseware&&this.state.course_id==0) { message.info({ content: '?????????pdf??????' }); return; }
            this.setState({ loading: true })
            actions.publishCourses({
                begin_url: '',
                begin_url_type: 0,
                end_url: '',
                end_url_type: 0,
                promote_begin: '',
                promote_end: '',
                promote_price: 0,
                cost_price: 0,
                market_price: 0,
                tlevel: 0,
                ulevel: 0,
                tuser_tax: 0,
                vuser_tax: 0,
                user_tax: 0,
                is_agent: 0,
                level_integral: 0,
                ctype: course_type,
                category_id: channel_id,
                content: content,
                course_id: course_id,
                course_img: course_img,
                course_name: title,
                flag: flag,
                integral: exchange_num,
                is_recomm: '',
                sn: sn,
                room_id: '',
                sort_order: sort_order,
                status: status,
                summary: summary,
                tag_ids: '',
                teacher_id: 0,
                ttype: 0,
                is_series: 0,
                score: 5,
                images: '',
                begin_time: '',
                end_time: '',
                media_id: '',
                ccategory_id: 0,
                duration: duration,
                size: size,
                is_shop: 0,
                teacher_name: '',
                can_share: 1,
                notify: 0,
                course_integral: '',
                course_cash: '',
                pay_type: course_exchange,
                ltype: 0,
                plant: 0,
                is_must: is_must,
                resolved: (res) => {
                    console.log(res)
                    let course_ids = res.courseId
                    let channel_ids = channel_id
                    if(courseware){
                        actions.publishFile({
                            course_id: course_ids,
                            file: courseware,
                            resolved: (res) => {
                                actions.recommCourse({
                                    course_ids,
                                    channel_ids,
                                    type: 0,
                                    resolved: (data) => {
                                        that.setState({ loading: false })
                                        message.success({ content: '????????????' })
                                        window.history.back()
                                    },
                                    rejected: (data) => {
                                        message.error(data)
                                    }
                                })
                            },
                            rejected: (err) => {
                                message.error({
                                    content: '????????????'
                                })
                            }
                        })
                    }else{
                        that.setState({ loading: false })
                        message.success({ content: '????????????' })
                        window.history.back()
                    }
                   
                },
                rejected: (err) => {
                    message.error({ content: '????????????' })
                }
            })
        }
    }
    _onPublish = () => {
        const { course_type, title, summary, content, course_id, duration, size, flag, fileList, media_id, is_must, status, sn, course_exchange, exchange_num, channel_id ,sort_order} = this.state
        const course_img = (this.img && this.img.getValue()) || ''
        const { actions } = this.props
        actions.publishCourses({
            begin_url: '',
            begin_url_type: 0,
            end_url: '',
            end_url_type: 0,
            promote_begin: '',
            promote_end: '',
            promote_price: 0,
            cost_price: 0,
            market_price: 0,
            tlevel: 0,
            ulevel: 0,
            tuser_tax: 0,
            vuser_tax: 0,
            user_tax: 0,
            is_agent: 0,
            level_integral: 0,
            ctype: course_type,
            category_id: channel_id,
            content: content,
            course_id: course_id,
            course_img: course_img,
            course_name: title,
            flag: flag,
            integral: exchange_num,
            is_recomm: '',
            sn: sn,
            room_id: '',
            sort_order: sort_order,
            status: status,
            summary: summary,
            tag_ids: '',
            teacher_id: 0,
            ttype: 0,
            is_series: 0,
            score: 5,
            images: '',
            begin_time: '',
            end_time: '',
            media_id: media_id,
            ccategory_id: 0,
            duration: duration,
            size: size,
            is_shop: 0,
            teacher_name: '',
            can_share: 1,
            notify: 0,
            course_integral: '',
            course_cash: '',
            pay_type: course_exchange,
            ltype: 0,
            plant: 0,
            is_must: is_must,
            resolved: (res) => {
                console.log(res)
                let course_ids = res.courseId
                let channel_ids = channel_id
                actions.recommCourse({
                    course_ids,
                    channel_ids,
                    type: 0,
                    resolved: (data) => {
                        this.setState({ loading: false })
                        window.history.back()
                    },
                    rejected: (data) => {
                        message.error(data)
                    }
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    beforeVideoUpload(file) {
        const isMp4 = file.type === 'video/mp4'
        return isMp4;
    }
    onCourseVideoChange = ({ file, fileList }) => {
        if (file.type !== 'video/mp4') {
            message.error('???????????? MP4 ????????????!');
            return;
        }

        let media_id = ''
        let size = ''
        let videoList = fileList

        if (file.status == 'done' && file.response.err == '0') {
            media_id = file.response.data.videoId
            message.info('????????????')
            size = (file.size / 1000000).toFixed(2)
            this.setState({
                size
            })
        } else if (file.status == 'error') {
            message.info('????????????')
        }

        this.setState({
            videoList,
            media_id
        })
    };
    onPaper = (e) => {
        this.setState({ paper: e })
    }
    render() {
        const { view_mode, course_id, title, content, channel_id, channels_list,sort_order } = this.state
        const uploadBtnVideo = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">????????????</div>
            </div>
        );
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={course_id == 0 ? '????????????' : view_mode ? '??????' : '??????'}
                    >
                        <Card title="" style={{ minHeight: '400px' }}>
                            <Form wrapperCol={{ span: 18 }} labelCol={{ span: 3 }}>
                                <Form.Item label='????????????'>
                                    <Radio.Group value={this.state.course_type} disabled={view_mode} onChange={e => {
                                        this.setState({ course_type: e.target.value })
                                    }}>
                                        <Radio value={48}>??????</Radio>
                                        <Radio value={49}>??????</Radio>
                                        <Radio value={50}>????????????</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label='????????????'>
                                    <Input className='m_w400' disabled={view_mode} value={title} onChange={e => { this.setState({ title: e.target.value }) }}></Input>
                                </Form.Item>
                                <Form.Item label='??????'>
                                    <Input.TextArea className='m_w400' disabled={view_mode} value={this.state.summary} onChange={e => { this.setState({ summary: e.target.value }) }} />
                                </Form.Item>
                                <Form.Item label='??????'>
                                    <AntdOssUpload
                                        disabled={view_mode}
                                        actions={this.props.actions}
                                        value={this.state.fileList}
                                        accept='image/*'
                                        ref={ref => this.img = ref}

                                    ></AntdOssUpload>
                                </Form.Item>
                                {/* {
                                    this.state.course_type == 48 ?
                                        <Form.Item label='????????????'> */}
                                {/* <AntdOssUpload
                                                disabled={view_mode}
                                                actions={this.props.actions}
                                                value={this.state.videoList}
                                                accept='video/*'
                                                ref={ref => this.video = ref}
                                            ></AntdOssUpload> */}
                                {/* <Upload
                                                disabled={view_mode}
                                                listType="picture-card"
                                                fileList={this.state.videoList}
                                                onChange={this.onCourseVideoChange}
                                                beforeUpload={this.beforeVideoUpload}
                                                customRequest={customUpload}
                                            >{this.state.videoList.length >= 1 ? null : uploadBtnVideo}</Upload> */}
                                {/* <Form.Item label="????????????">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({media_id:e.target.value})
                                                }}
                                                value={this.state.media_id} className="m_w400" placeholder=""/>
                                        </Form.Item> */}
                                {/* </Form.Item>
                                        : null
                                } */}
                                {
                                    this.state.course_type == 49 ?
                                        <Form.Item label='????????????'>
                                            <Select labelInValue showSearch className='m_w400' disabled={view_mode} placeholder='????????????' value={this.state.paper} onChange={this.onPaper}>
                                                {
                                                    this.state.auth_paper_list.map(item => {
                                                        return (
                                                            <Select.Option value={item.paperId}>{item.paperName}</Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                        : null
                                }
                                {
                                    this.state.course_type == 50 ?
                                        <Form.Item label="????????????" help={
                                            <Popover trigger='click' content={
                                                <img style={{ height: 336, width: 360 }} src="https://anran-edu.oss-cn-qingdao.aliyuncs.com/images/93d3e9de-0f43-45b1-ae77-ef8a274b262c.jpg"></img>
                                            }>
                                                <span className='pdf_tip'>
                                                    ??????PPT?????????PDF?????????????????????
                                        </span>
                                            </Popover>
                                        }>
                                           <AntdOssUpload listType='text' accept='application/pdf' value={this.state.pdfList} ref={ref => this.pdf = ref}></AntdOssUpload>
                                        </Form.Item>
                                        : null
                                }
                                <Form.Item label='????????????'>
                                    <Select className='m_w400' value={channel_id == 0 ? '???' : channel_id} onChange={e => { this.setState({ channel_id: e }) }}>
                                        {
                                            channels_list.map((item, index) => {
                                                return (
                                                    <Select.Option value={item.channelId}>{item.channelName}</Select.Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item label='????????????'>
                                    <SwitchCom value={this.state.is_must} disabled={view_mode} onChange={is_must => this.setState({ is_must })}></SwitchCom>
                                </Form.Item>
                                <Form.Item label='????????????'>
                                    <SwitchCom value={this.state.status} disabled={view_mode} onChange={status => this.setState({ status })}></SwitchCom>
                                </Form.Item>
                                <Form.Item label="??????">
                                    <InputNumber disabled={view_mode} onChange={val => {
                                        if (val !== '' && !isNaN(val)) {
                                            val = Math.round(val)
                                            if (val < 0) val = 0
                                            this.setState({ sort_order: val })
                                        }
                                    }} value={sort_order} min={0} max={9999} />
                                </Form.Item>
                                <Form.Item label='????????????'>
                                    <Input className='m_w400' disabled={view_mode} value={this.state.sn} onChange={e => { this.setState({ sn: e.target.value }) }}></Input>
                                </Form.Item>
                                <Form.Item label='????????????'>
                                    <Editor readOnly={view_mode} content={this.state.content} ref='editor' actions={this.props.actions}></Editor>
                                </Form.Item>
                                {/* <Form.Item label='????????????'>
                                    <Radio.Group value={this.state.course_exchange} disabled={view_mode} onChange={e => {
                                        this.setState({ course_exchange: e.target.value, exchange_num: 0 })
                                    }}>
                                        <Radio value={0}>???</Radio>
                                        <Radio value={4}>????????????</Radio>
                                    </Radio.Group>
                                    {this.state.course_exchange == 4 ?
                                        <InputNumber min={0} placeholder='????????????' disabled={view_mode} value={this.state.exchange_num} onChange={e => { this.setState({ exchange_num: e }) }}></InputNumber>
                                        : null}
                                </Form.Item> */}
                                <Form.Item label='????????????' help='?????????????????????????????????'>
                                     <PersonType disabled={view_mode} actions={this.props.actions} courseId={this.state.course_id} disabled={false} flag={this.state.flag} ref='personType'></PersonType>

                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
                                    <Button className='m_2'>??????</Button>
                                    {view_mode ? null :
                                        <Button className='m_2' type='primary' loading={this.state.loading || this.state.importLoading} onClick={this.onOk}>{this.state.loading ? '????????????' : '??????'}</Button>
                                    }
                                </Form.Item>
                            </Form>
                        </Card>
                    </PageHeader>
                </Card>

                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="????????????" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = MeettingEdit;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        channels_list: state.course.channels_list,
        course_info: state.course.course_info,
        auth_paper_list: state.auth.auth_paper_list,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
