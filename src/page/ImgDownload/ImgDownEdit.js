import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { Checkbox, message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber, Switch } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom';
import action from '../../redux/action';
import PersonTypePublic from '../../components/PersonTypePublic'
import { parseInt } from 'lodash';
class ImgDownEdit extends Component {
    state = {
        view_mode: false,
        course_type: 0,
        course_exchange: 0,
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
        imgList: [],
        isVideo: false,
        type: 1,
        m_type: 0,
        edit_order: 0,
        name: '',
        coverList: [],
        files: '',
        title: '',
        galleryId: 0,
        sort_order: [],
        flag: '',
        can_share: 1,
        download_sort: 0,
    }
    source_list = []

    componentWillMount() {
        const { id, page,ftype } = this.props.match.params
        const { path } = this.props.match
        const { actions } = this.props
        if (path == '/imgdownload/view/:id/:page') {
            this.setState({ view_mode: true })
        }
        if (parseInt(id) !== 0) {
            this.setState({ id: parseInt(id) })
            actions.getSource(parseInt(ftype),'',parseInt(page),10,0)
        }
    }
    componentWillReceiveProps(n_props) {
        this.source_list = Object.values(n_props.source_list)
        const { id } = this.props.match.params
        let data_list = this.source_list[0].filter(item => item.downId == id)
        let coverList = []
        let img = data_list[0].imgUrl.split(',')
        img.map((ele, idx) => {
            coverList.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
        })
        this.setState({
            name: data_list[0].name,
            m_type: data_list[0].codeType,
            type: data_list[0].ftype,
            id: data_list[0].downId,
            p_list: data_list[0].galleryList,
            coverList: coverList,
            files: data_list[0].content,
            flag: data_list[0].flag,
            can_share: data_list[0].canShare,
            download_sort:data_list[0].downloadSort
        })
        if (!data_list[0].flag) {
            this.setState({
                course_type: 0
            })
        } else {
            this.setState({
                course_type: 1,
                course_exchange: data_list[0].flag.split(","),
            })
        }
        if (!data_list[0].codeUrl) {
            
        } else {
            let fileList = []
            let imgs = data_list[0].codeUrl.split(',')
            imgs.map((ele, idx) => {
                fileList.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
            })
            this.setState({
                fileList: fileList,
            })
        }
    }
    onPublish = () => {
        const { actions } = this.props;
        const { name, type, course_type, course_exchange, files, p_list, m_type, id, can_share,download_sort } = this.state;
        const cover = (this.img && this.img.getValue()) || ''
        const imgs = (this.imgs && this.imgs.getValue()) || ''
        let content = ''
        let lists = []
        let file = ''
        const flag = (this.flag && this.flag.getValue())
        let titles = ''
        titles = p_list.map(item => item == item ? item.title : null).toLocaleString()
        if (!name) { message.info('请输入图集名称'); return; }
        if (!cover) { message.info('请选择封面'); return; }
        if (type == 2) {
            content = p_list[0].fpath
            lists.push(p_list.map(item => item == item ? item.fpath : null))
            file = lists.join(',')
        }
        if (type == 1) {
            content = p_list[0].galleryId
            lists.push(p_list.map(item => item == item ? item.fpath : null))
            file = lists.join(',')
        }
        if (!content) { message.info('请添加图片或视频'); return; }
        // if(course_type==0){
        //     flag=''
        // }
        // if(course_type==1){
        //     flag=course_exchange.toLocaleString()
        // }
        console.log(p_list)
        let sort = []
        p_list.map(item => {
            sort = sort.concat(item.sortOrder)
        })
        if (flag.indexOf('squad-') != -1) {
            let flags = flag.slice(6)
            actions.forNumber({
                input: flags,
                resolved: (res) => {
                    let flagd = 'squad-' + res
                    actions.publishSource({
                        content: files,
                        files: file,
                        code_type: m_type,
                        ftype: type,
                        code_url: imgs,
                        name: name,
                        img_url: cover,
                        down_id: id,
                        flag: flagd,
                        titles: titles,
                        sort_order: sort.toLocaleString(),
                        can_share: can_share,
                        download_sort:download_sort,
                        resolved: (data) => {
                            if (this.flag && this.flag.getValue() == '/I/' && this.flag.getFile() !== '') {
                                this.flag.uploadFile(data.downId, this.props.actions, this, 39);
                            } else {
                                message.success({
                                    content:'提交成功',
                                    onClose:()=>{
                                        this.setState({loading:false})
                                        window.history.back()
                                    }
                                })
                            }
                        },
                        rejected: (data) => {
                            this.setState({ loading: false })
                            message.error({
                                content: data
                            })
                        }
                    })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else {
            actions.publishSource({
                content: files,
                files: file,
                code_type: m_type,
                ftype: type,
                code_url: imgs,
                name: name,
                img_url: cover,
                down_id: id,
                flag: flag,
                titles: titles,
                sort_order: sort.toLocaleString(),
                can_share: can_share,
                download_sort:download_sort,
                resolved: (data) => {
                    if (this.flag && this.flag.getValue() == '/I/' && this.flag.getFile() !== '') {
                        this.flag.uploadFile(data.downId, this.props.actions, this, 39);
                    } else {
                        message.success({
                            content:'提交成功',
                            onClose:()=>{
                                this.setState({loading:false})
                                window.history.back()
                            }
                        })
                    }
                },
                rejected: (data) => {
                    this.setState({ loading: false })
                    message.error({
                        content: data
                    })
                }
            })
        }


    }


    render() {
        const { name, view_mode, id, flag, coverList, files, isVideo, edit_title, fileList, type, course_type, edit_intro, course_exchange, edit_order, posterList, p_list, imgList, m_type } = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={id == 0 ? '添加图集' : view_mode ? '查看' : '修改'}
                    >
                        <Card title="" style={{ minHeight: '400px' }}>
                            <Form wrapperCol={{ span: 18 }} labelCol={{ span: 3 }}>

                                <Form.Item label='图集名称'>
                                    <Input disabled={view_mode} className='m_w400' value={this.state.name} disabled={view_mode} onChange={e => {
                                        this.setState({
                                            name: e.target.value,
                                        })
                                    }}></Input>
                                </Form.Item>

                                <Form.Item label='图集封面' help='请上传符合尺寸为400px * 400px 的图片'>
                                    <AntdOssUpload
                                        actions={this.props.actions}
                                        disabled={view_mode}
                                        ref={ref => this.img = ref}
                                        value={this.state.coverList}
                                        listType="picture-card"
                                        accept='image/*'
                                    ></AntdOssUpload>
                                </Form.Item>
                                <Form.Item label='图集类型'>
                                    <Select disabled={view_mode} className='m_w400' value={this.state.type} disabled={view_mode} onChange={(type) => this.setState({ type })}>
                                        <Select.Option value={0}>无</Select.Option>
                                        <Select.Option value={1}>视频</Select.Option>
                                        <Select.Option value={2}>图片</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label='介绍(限150字)'>
                                    <Input.TextArea disabled={view_mode} maxLength={150} autoSize={{ minRows: 4 }} className='m_w400' disabled={view_mode} value={this.state.files} onChange={e => {
                                        this.setState({
                                            files: e.target.value,
                                        })
                                    }}></Input.TextArea>
                                </Form.Item>
                                <Form.Item label="是否分享">
                                    <Switch disabled={view_mode} checked={this.state.can_share == 1 ? true : false} onChange={(e) => {
                                        if (e) {
                                            this.setState({ can_share: 1 })
                                        } else {
                                            this.setState({ can_share: 0 })
                                        }
                                    }} />
                                </Form.Item>
                                <Form.Item label="排序">
                                    <InputNumber disabled={view_mode} onChange={val => {
                                        if (val !== '' && !isNaN(val)) {
                                            val = Math.round(val)
                                            if (val < 0) val = 0
                                            this.setState({ download_sort: val })
                                        }
                                    }} value={this.state.download_sort} min={0} max={9999} />
                                </Form.Item>
                                <Form.Item label='设置对象'>
                                    <PersonTypePublic ref={ref => this.flag = ref} actions={this.props.actions} contentId={this.state.id} ctype='39' showUser={this.state.article_id == '0' ? false : true} disabled={view_mode} flag={this.state.flag} />
                                    {/* <Select value={this.state.course_type} className='m_w400' disabled={view_mode} onChange={(course_type) => this.setState({ course_type })}>
                                        <Select.Option value={0}>全部用户</Select.Option>
                                        <Select.Option value={1}>认证用户</Select.Option>
                                    </Select>
                                    {this.state.course_type == 1 ?
                                        <div>
                                            <Checkbox.Group options={[
                                                { label: '讲师', value: '1' },
                                                { label: '店主', value: '3' },
                                                { label: '店员', value: '4' },
                                                { label: '优惠顾客', value: '5' },
                                                { label: '直销员', value: '6' },

                                                { label: '初级业务员', value: '7' },
                                                { label: '中级业务员', value: '8' },
                                                { label: '高级业务员', value: '9' },
                                                { label: '资深或以上业务员', value: 'GG' },
                                            ]} value={this.state.course_exchange} onChange={(course_exchange) => this.setState({ course_exchange })} className='mt_20' />
                                        </div>
                                        : null} */}
                                </Form.Item>
                                <Form.Item label='图片/视频'>
                                    <Table pagination={false} size='small' columns={this.p_col} dataSource={p_list} bordered={true} />
                                    <Button type='dashed' disabled={view_mode} onClick={() => {
                                        this.setState({ edit_order: 0, isVideo: false, editPanel: true, edit_index: -1, edit_title: '', edit_intro: '', posterList: [], imgList: [] })
                                    }}>
                                        <Icon type="plus" /> 添加图片/视频
                                    </Button>
                                </Form.Item>
                                <Form.Item label='选择打码'>
                                    <Radio.Group disabled={view_mode} value={this.state.m_type} onChange={(e) => this.setState({ m_type: e.target.value })}>
                                        <Radio value={0}>无</Radio>
                                        <Radio value={1}>好友专属码</Radio>
                                        <Radio value={2}>个人二维码(系统生成)</Radio>
                                    </Radio.Group>
                                    <br />
                                    {this.state.m_type == 1 ?
                                        <AntdOssUpload
                                            actions={this.props.actions}
                                            ref={ref => this.imgs = ref}
                                            value={fileList}
                                            listType="picture-card"
                                            disabled={view_mode}
                                            accept='image/*'
                                        ></AntdOssUpload>
                                        : null}
                                </Form.Item>
                                {/* <Form.Item label='上传二维码'>
                                    <AntdOssUpload 
                                        disabled={view_mode}
                                        actions={this.props.actions}
                                        value={this.state.fileList1}
                                        accept='image/*'
                                        ref={ref=>this.imgs = ref}
                                    ></AntdOssUpload>
                                </Form.Item> */}
                                <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
                                    <Button className='m_2' onClick={() => {
                                        window.history.back()
                                    }}>取消</Button>
                                    {view_mode ? null :
                                        <Button disabled={view_mode} className='m_2' type='primary' onClick={this.onPublish}>提交</Button>
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
                <Modal okText='确定' cancelText='取消' title={this.state.edit_index == -1 ? '添加' : '修改'} onOk={this.onEdit} visible={this.state.editPanel} maskClosable={false} onCancel={() => {
                    this.setState({ editPanel: false })
                }}>
                    <Form wrapperCol={{ span: 20 }} labelCol={{ span: 4 }}>

                        <Form.Item label={'图片/视频'}>
                            <AntdOssUpload actions={this.props.actions} maxLength={1} accept={this.state.type == 2 ? 'image/*' : this.state.type == 1 ? 'video/mp4' : 'image/*,video/mp4'} value={this.state.posterList} ref={(ref) => this.fpath = ref}></AntdOssUpload>
                            {
                                this.state, type == 2 ?
                                    <div style={{ color: 'red', fontSize: '12px' }}>请上传 1080px * 1920px 图片</div>
                                    : null
                            }

                        </Form.Item>
                        <Form.Item label={'标题(38字)'}>
                            <Input value={this.state.title} maxLength={38} onChange={val => {
                                this.setState({ title: val.target.value })
                            }}></Input>
                        </Form.Item>
                        <Form.Item label='排序'>
                            <InputNumber min={0} value={edit_order} max={9999} onChange={e => {
                                if (e !== '' && !isNaN(e)) {
                                    e = Math.round(e)
                                    if (e < 0) e = 0
                                    this.setState({ edit_order: e })
                                }

                            }}></InputNumber>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    onDelete = (index, type) => {
        const { p_list } = this.state
        let tmp = []
        tmp = p_list.filter((ele, _index) => _index !== index)
        this.setState({ p_list: tmp })
    }
    onEdit = () => {
        const { p_list, edit_index, edit_title, edit_order, title } = this.state
        const fpath = this.fpath && this.fpath.getValue()

        // if(edit_title==''){ message.info('请输入文案');return; }
        if (!fpath) { message.info('请上传照片'); return; }

        if (edit_index == -1) {
            const item = {
                galleryId: Date.now().toString(),
                title: title,
                fpath: fpath,
                sortOrder: edit_order,
            }
            this.setState({ p_list: [...p_list, item], editPanel: false })
        } else {
            const items = {
                galleryId: this.state.galleryId,
                title: title,
                fpath: fpath,
                sortOrder: edit_order,
            }
            console.log(title)
            this.setState({
                p_list: p_list.map((_item, index) => _item.galleryId == this.state.galleryId ? items : _item),
                editPanel: false
            })
        }
    }
    onEdits = (val, index) => {
        const { p_list, sort_order } = this.state
        this.setState({ editPanel: true })
        let coverList = []
        let img = val.fpath.split(',')
        img.map((ele, idx) => {
            if (this.state.type == 2) {
                coverList.push({ response: { resultBody: ele }, type: 'image/png', uid: idx, name: 'img' + idx, status: 'done', url: ele })
            }
            if (this.state.type == 1) {
                coverList.push({ response: { resultBody: ele }, type: 'video/mp4', uid: idx, name: 'mp4' + idx, status: 'done', url: ele })
            }
        })
        this.setState({
            title: val.title,
            galleryId: val.galleryId,
            posterList: coverList,
            edit_order: val.sortOrder,
            edit_index: 0
        })
    }
    p_col = [
        { dataIndex: 'galleryId', key: 'galleryId', title: 'ID' },
        {
            dataIndex: 'fpath', key: 'fpath', title: '图片', render: (item, ele) => {
                return (
                    <img src={ele.fpath} className='head-example-img' onClick={() => {
                        this.setState({ showImgPanel: true, previewImage: ele.fpath })
                    }} />)
            }
        },
        {
            dataIndex: '', key: '', title: '链接',render: (item, ele,index) => {
                return (
                    <div style={{width:'150px'}}>{'/comPages/pages/index/atlasWatch?downId='+this.state.id+'&ftype=' +this.state.type+'&index=' +index}</div>
                )
            }
        },
        { dataIndex: 'title', key: 'title', title: '标题' },
        { dataIndex: 'sortOrder', key: 'sortOrder', title: '排序' },
        {
            title: '操作', render: (item, ele, index) => {
                return <>
                    <a className='m_2' onClick={this.onEdits.bind(this, ele, index)}>修改</a>
                    <a className='m_2' onClick={this.onDelete.bind(this, index, '')}>删除</a>
                </>
            }
        },
    ]
}

const LayoutComponent = ImgDownEdit;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        source_list: state.ad.source_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
