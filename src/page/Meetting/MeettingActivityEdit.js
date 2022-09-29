import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom';
import Editor from '../../components/Editor'

class MeettingActivityEdit extends Component {
    state = {
        view_mode: false,
        course_type: 1,
        course_exchange: 2,
        is_must: 0,
        status: 0,
        id: 0,
        v_list: [],
        p_list: [],
        fileList: [],
        editPanel: false,
        edit_index: -1,
        edit_title: '',
        edit_intro: '',
        posterList: [],
        posterLists: [],
        imgList: [],
        isVideo: false,
        title: '',
        content: '',
        article_id: 0,
        downId: 0,
        sort_order: 0,
        duration:0,
        showTim:false,
        gallery_id:0,
    }
    componentWillMount() {
        const { id } = this.props.match.params
        const { path } = this.props.match
        if (path == '/meetting/activity/view/:id') {
            this.setState({ view_mode: true })
        }
        if (parseInt(id) !== 0) {
            this.setState({ id: parseInt(id) })
            const { actions } = this.props
            actions.getMom({ articleId: id })
        }
    }
    componentWillReceiveProps(n_props) {
        const { p_list, v_list } = this.state
        if (n_props.mom_list != this.props.mom_list) {
            let file = []
            let img = n_props.mom_list.articleImg.split(',')
            img.map((ele, idx) => {
                file.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
            })
            this.setState({
                title: n_props.mom_list.title,
                fileList: file,
                content: n_props.mom_list.content,
                article_id: n_props.mom_list.articleId,
                sort_order: n_props.mom_list.sortOrder
            })
            let alist = []
            let blist = []
            n_props.mom_list.downloadList.map((item, index) => {
                if (item.ftype == 0) {
                    let plist = {
                        downId: item.downId,
                        id: item.pubTime,
                        img: item.imgUrl,
                        title: item.name,
                        intro: item.content,
                        link: item.galleryList.map(_item => _item == _item ? _item.link : null).toString(),
                        galleryList:item.galleryList
                    }
                    alist = alist.concat(plist)
                    this.setState({ p_list: alist })
                } else {
                    let vlist = {
                        downId: item.downId,
                        id: item.pubTime,
                        img: item.imgUrl,
                        title: item.name,
                        intro: item.content,
                        link: item.galleryList.map(_item => _item == _item ? _item.link : null).toString(),
                        galleryList:item.galleryList
                    }
                    blist = blist.concat(vlist)
                    this.setState({ v_list: blist })
                }
            })
        }
        if (n_props.moment_lists != this.props.moment_lists) {
            this.setState({
                article_id: n_props.moment_lists.articleId,
                downId: n_props.moment_lists.downloadList[0].downId
            })
        }
    }
    onOk = () => {
        const { title, content, p_list, v_list, article_id, downId, sort_order } = this.state
        const img = (this.img && this.img.getValue()) || ''
        const { actions } = this.props
        if (!title) { message.info({ content: '请填写活动名称' }); return; }
        if (!content) { message.info({ content: '请填写介绍' }); return; }
        if (!img) { message.info({ content: '请导入封面' }); return; }
        actions.publishMoments({
            title: title,
            article_img: img,
            content: content,
            article_id: article_id,
            files: p_list[0].link,
            name: p_list[0].title,
            content1: p_list[0].intro,
            img_url: p_list[0].img,
            downId: downId,
            sort_order: sort_order,
            resolved: (res) => {
                let down = res.downloadList
                let id = down[down.length - 1].downId
                actions.publishPv({
                    down_id: id,
                    action: 'delete',
                    resolved: (res) => {
                        message.success({ content: '提交成功' })
                        window.history.back()
                    },
                    rejected: (err) => {
                        console.log(err)
                    }
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onCancel = () => {
        const { id, article_id } = this.state
        const { actions } = this.props
        if (id == 0 && article_id != 0) {
            actions.publishMom({
                article_id: article_id,
                action: 'delete',
                resolved: (res) => {
                    window.history.back()
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else {
            window.history.back()
        }
    }
    _onEdit = (val, index) => {
        const { edit_index, editPanel, isVideo, edit_title, edit_intro, posterList, posterLists, id } = this.state
        this.setState({ edit_index: index, editPanel: true, isVideo: false })
        let file = []
        let post = []
        let img = val.img.split(',')
        let imgs = val.link.split(',')
        img.map((ele, idx) => {
            file.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
        })
        imgs.map((ele, idx) => {
            post.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
        })
        this.setState({
            downId: val.downId,
            edit_title: val.title,
            edit_intro: val.intro,
            posterList: file,
            posterLists: post
        })
    }
    _onEditr = (val, index) => {
        const { edit_index, editPanel, isVideo, edit_title, edit_intro, posterList, posterLists, id } = this.state
        this.setState({ edit_index: index, editPanel: true, isVideo: true })
        let file = []
        let post = []
        let img = val.img.split(',')
        let imgs = val.link.split(',')
        img.map((ele, idx) => {
            file.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
        })
        imgs.map((ele, idx) => {
            post.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
        })
        this.setState({
            downId: val.downId,
            edit_title: val.title,
            edit_intro: val.intro,
            posterList: file,
            posterLists: post
        })
    }
    render() {
        const { view_mode, id, isVideo, title, content } = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={id == 0 ? '添加活动' : view_mode ? '查看活动' : '修改活动'}
                    >
                        <Card title="" style={{ minHeight: '400px' }}>
                            <Form wrapperCol={{ span: 18 }} labelCol={{ span: 3 }}>

                                <Form.Item label='活动名称'>
                                    <Input className='m_w400' disabled={view_mode} value={title} onChange={e => this.setState({ title: e.target.value })}></Input>
                                </Form.Item>

                                <Form.Item label='活动封面'>
                                    <AntdOssUpload
                                        disabled={view_mode}
                                        actions={this.props.actions}
                                        value={this.state.fileList}
                                        accept='image/*'
                                        ref={ref => this.img = ref}
                                    ></AntdOssUpload>
                                    <span style={{ marginTop: '-30px', display: 'block' }}>(330px * 145px)</span>
                                </Form.Item>
                                <Form.Item label='介绍'>
                                    <Input.TextArea className='m_w400' disabled={view_mode} value={content} onChange={(e) => this.setState({ content: e.target.value })} />
                                </Form.Item>
                                <Form.Item label='视频集'>
                                    <Table pagination={false} size='small' columns={this.v_col} dataSource={this.state.v_list} bordered={true} />
                                    <Button type='dashed' disabled={view_mode} onClick={() => {
                                        this.setState({ isVideo: true, editPanel: true, edit_index: -1, edit_title: '', edit_intro: '', posterList: [], posterLists: [], imgList: [] })
                                    }}>
                                        <Icon type="plus" /> 添加
                                    </Button>
                                </Form.Item>
                                <Form.Item label='相册'>
                                    <Table pagination={false} size='small' columns={this.p_col} dataSource={this.state.p_list} bordered={true} />
                                    <Button type='dashed' disabled={view_mode} onClick={() => {
                                        this.setState({ isVideo: false, editPanel: true, edit_index: -1, edit_title: '', edit_intro: '', posterList: [], posterLists: [], imgList: [] })
                                    }}>
                                        <Icon type="plus" /> 添加
                                    </Button>
                                </Form.Item>
                                <Form.Item label='排序'>
                                    <InputNumber value={this.state.sort_order} onChange={(e) => { this.setState({ sort_order: e }) }}></InputNumber>
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
                                    <Button className='m_2' onClick={this.onCancel}>取消</Button>
                                    {view_mode ? null :
                                        <Button className='m_2' type='primary' onClick={this.onOk}>提交</Button>
                                    }
                                </Form.Item>
                            </Form>
                        </Card>
                    </PageHeader>
                </Card>

                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal width={600} okText='确定' cancelText='取消' title={this.state.edit_index == -1 ? '添加' : '修改'} onOk={this.onEdit} visible={this.state.editPanel} maskClosable={false} onCancel={() => {
                    this.setState({ editPanel: false })
                }}>
                    <Form wrapperCol={{ span: 20 }} labelCol={{ span: 4 }}>
                        <Form.Item label={isVideo ? '视频标题' : '相册标题'}>
                            <Input value={this.state.edit_title} onChange={e => {
                                this.setState({ edit_title: e.target.value })
                            }}></Input>
                        </Form.Item>
                        <Form.Item label={isVideo ? '视频介绍' : '相册介绍'}>
                            <Input.TextArea value={this.state.edit_intro} onChange={e => {
                                this.setState({ edit_intro: e.target.value })
                            }}></Input.TextArea>
                        </Form.Item>
                        <Form.Item label={isVideo ? '视频封面' : '相册封面'}>
                            <AntdOssUpload actions={this.props.actions} maxLength={1} accept={'image/*'} value={this.state.posterList} ref={(ref) => this.poster = ref}></AntdOssUpload>
                            <span style={{ marginTop: '-30px', display: 'block' }}>(340px * 191px)</span>
                        </Form.Item>
                        <Form.Item label={isVideo ? '视频' : '照片'}>
                            <AntdOssUpload actions={this.props.actions} maxLength={isVideo ? 1 : 800} multiple={true} accept={isVideo ? 'video/mp4' : 'image/*'} value={this.state.posterLists} ref={(ref) => this.imgs = ref}></AntdOssUpload>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal width={600} okText='确定' cancelText='取消' title={'时长设置'} onOk={this.editTime} visible={this.state.showTim} maskClosable={false} onCancel={() => {
                    this.setState({ showTim: false })
                }}>
                    <Form.Item label={'时长'}>
                            <InputNumber onChange={val => {
                                if (val !== '' && !isNaN(val)) {
                                    val = Math.round(val)
                                    if (val < 0) val = 0
                                    this.setState({ duration: val })
                                }
                            }} value={this.state.duration} min={0} max={9999} />
                        </Form.Item>
                </Modal>
            </div>
        )
    }
    onDelete = (val, ele) => {
        const { actions } = this.props
        actions.publishPv({
            down_id: val.downId,
            action: ele,
            resolved: (res) => {
                message.success({ content: '删除成功' })
                actions.getMom({ articleId: this.state.article_id })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    setTime=(val)=>{
        this.setState({
            duration:val.galleryList[0].duration,
            gallery_id:val.galleryList[0].galleryId,
            showTim:true
        })
    }
    editTime=()=>{
        const{duration,gallery_id}=this.state
        this.props.actions.postMomentTime({
            gallery_id:gallery_id,
            duration:duration,
            resolved:(res)=>{
                message.success({content:'操作成功'})
                this.setState({
                    showTim:false
                })
                this.props.actions.getMom({ articleId: this.state.article_id })
            },rejected:(err)=>{
                console.log(err)
            }
        })
    }
    onEdit = () => {
        const { v_list, p_list, isVideo, edit_index, edit_intro, edit_title, article_id, downId, title, content, fileList } = this.state
        const img = this.img && this.img.getValue()
        const poster = this.poster && this.poster.getValue()
        const imgs = this.imgs && this.imgs.getValue()
        const { actions } = this.props
        if (edit_title == '') { message.info('请输入标题'); return; }
        if (edit_intro == '') { message.info('请输入介绍'); return; }
        if (!poster) { message.info('请上传封面'); return; }
        if (!imgs) { message.info(isVideo ? '视频集不能为空' : '请上传照片'); return; }

        if (edit_index == -1) {
            const item = {
                id: Date.now().toString(),
                img: poster,
                title: edit_title,
                intro: edit_intro,
                link: imgs
            }
            isVideo ? this.setState({ v_list: [...v_list, item], editPanel: false }) : this.setState({ p_list: [...p_list, item], editPanel: false })
            if (isVideo) {
                actions.publishMoment({
                    title: title,
                    content: content,
                    article_img: img,
                    article_id: article_id,
                    files: item.link,
                    name: item.title,
                    content1: item.intro,
                    img_url: item.img,
                    downId: downId,
                    ftype: 1,
                })
            } else {
                actions.publishMoment({
                    title: title,
                    content: content,
                    article_img: img,
                    article_id, article_id,
                    files: item.link,
                    name: item.title,
                    content1: item.intro,
                    img_url: item.img,
                    downId: downId,
                    ftype: 0,
                })
            }
        } else {
            if (isVideo) {
                v_list[edit_index].img = poster
                v_list[edit_index].title = edit_title
                v_list[edit_index].intro = edit_intro
                v_list[edit_index].link = imgs
                this.setState({ v_list, editPanel: false })
                actions.publishMoment({
                    title: title,
                    content: content,
                    article_img: img,
                    article_id: article_id,
                    files: v_list[edit_index].link,
                    name: v_list[edit_index].title,
                    content1: v_list[edit_index].intro,
                    img_url: v_list[edit_index].img,
                    downId: downId,
                    ftype: 1,
                })
                actions.publishPv({
                    down_id: downId,
                    action: 'delete',
                    resolved: (res) => {
                        actions.getMom({ articleId: article_id })
                    },
                    rejected: (err) => {
                        console.log(err)
                    }
                })
            } else {
                p_list[edit_index].img = poster
                p_list[edit_index].title = edit_title
                p_list[edit_index].intro = edit_intro
                p_list[edit_index].link = imgs
                this.setState({ p_list, editPanel: false })
                console.log(p_list[edit_index].title)
                actions.publishMoment({
                    title: title,
                    content: content,
                    article_img: img,
                    article_id: article_id,
                    files: p_list[edit_index].link,
                    name: p_list[edit_index].title,
                    content1: p_list[edit_index].intro,
                    img_url: p_list[edit_index].img,
                    downId: downId,
                    ftype: 0,
                })
                actions.publishPv({
                    down_id: downId,
                    action: 'delete',
                    resolved: (res) => {
                        actions.getMom({ articleId: article_id })
                    },
                    rejected: (err) => {
                        console.log(err)
                    }
                })
            }
        }
    }
    v_col = [
        { dataIndex: 'downId', key: 'downId', title: 'ID' },
        {
            dataIndex: 'img', key: 'img', title: '视频封面', render: (item, ele) => {
                return (
                    <img src={ele.img} className='head-example-img' onClick={() => {
                        this.setState({ showImgPanel: true, previewImage: ele.img })
                    }} />)
            }
        },
        { dataIndex: 'title', key: 'title', title: '视频标题' },
        { dataIndex: 'intro', key: 'intro', title: '视频介绍', ellipsis: true },
        { dataIndex: 'link', key: 'link', title: '视频链接', ellipsis: true },
        { dataIndex: '', key: '', title: '时长', render:(item,ele)=>{
            return item.galleryList[0].duration
        }},
        {
            title: '操作', render: (item, ele, index) => {
                return <>
                    <a className='m_2' onClick={this._onEditr.bind(this, ele, index)}>修改</a>
                    <a className='m_2' onClick={this.onDelete.bind(this, ele, 'delete')}>删除</a>
                    <div className='m_2'><a onClick={this.setTime.bind(this, ele)}>时长设置</a></div>
                </>
            }
        },
    ]
    p_col = [
        { dataIndex: 'downId', key: 'downId', title: 'ID' },
        {
            dataIndex: 'img', key: 'img', title: '相册封面', render: (item, ele) => {
                return (
                    <img src={ele.img} className='head-example-img' onClick={() => {
                        this.setState({ showImgPanel: true, previewImage: ele.img })
                    }} />)
            }
        },
        { dataIndex: 'title', key: 'title', title: '相册标题' },
        { dataIndex: 'intro', key: 'intro', title: '相册介绍', ellipsis: true },
        {
            title: '操作', render: (item, ele, index) => {
                return <>
                    <a className='m_2' onClick={this._onEdit.bind(this, ele, index)}>修改</a>
                    <a className='m_2' onClick={this.onDelete.bind(this, ele, 'delete')}>删除</a>
                </>
            }
        },
    ]
}

const LayoutComponent = MeettingActivityEdit;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        mom_list: state.meet.mom_list,
        moment_lists: state.meet.moment_lists,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
