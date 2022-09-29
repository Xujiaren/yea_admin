import React from "react";
import { Popconfirm, Empty, Modal, Form, Upload, Icon, Input, Tree, Card, PageHeader, Button, Select, message, InputNumber, Switch } from 'antd';
import connectComponent from '../../util/connect';
import config from '../../config/config'
import customUpload from '../../components/customUpload'

const { TreeNode, DirectoryTree } = Tree;

class ChapterSetting extends React.Component {
    isLeaf = false
    chapter_list = []
    chapter_ids = []
    state = {
        //权限
        view: false,
        edit: false,

        videoList: [],

        isAll: false,
        isNew: true,
        showMenu: false,
        showEditChapter: false,
        showEditSection: false,
        visibleAddChapter: false,
        visibleAddSection: false,
        pageX: 0,
        pageY: 0,
        fileList_1: [],
        keys: [],
        checkedKeys: [],

        size: '',

        new_duration: '',
        new_parent_id: '',
        new_section_name: '',
        new_section_content: '',
        new_media_id: '',
        new_status: 1,

        edit_duration: '',
        edit_chapter_id: '',
        edit_parent_id: '',
        edit_section_name: '',
        edit_section_content: '',
        edit_media_id: '',
        edit_status: 1,

        editContent: '',
        editChapterName: '',
        editChapterId: '',

        newContent: '',
        newChapterName: '',

        remove_id: 0,
        chapter_ids: '',
        is_free: 0,
    }
    _onRemoveChapters = () => {
        const { actions } = this.props
        let { checkedKeys } = this.state
        if (checkedKeys.length == 0) {
            message.info('请先选择章节')
            return
        }


        actions.deleteChapters({
            chapter_ids: checkedKeys.join(','),
            resolved: (data) => {
                actions.getChapter(this.course_id, 1)
                message.success('操作成功')
            },
            rejected: (data) => {
                message.error('操作失败：' + data)
            }
        })
    }
    _onRemove = () => {
        const { actions } = this.props
        const { remove_id: chapter_id } = this.state
        if (!chapter_id) {
            message.info('没有选择到章节ID，请重新选择')
            return;
        }
        actions.removeChapter({
            chapter_id,
            resolved: (data) => {
                actions.getChapter(this.course_id, 1)
                message.success('操作成功')
            },
            rejected: (data) => {
                message.error('操作失败：' + data)
            }
        })
    }
    showEditChapter = () => {
        if (this.isLeaf) {
            this.setState({
                showEditSection: true,
                videoList: []
            })
        } else {
            this.setState({ showEditChapter: true })
        }

    }
    hideEditChapter = () => {
        this.setState({ showEditChapter: false })
    }
    hideEditSection = () => {
        this.setState({ showEditSection: false })
    }
    _onEditSection = () => {
        let {
            edit_duration: duration,
            edit_chapter_id: chapter_id,
            edit_parent_id: parent_id,
            edit_media_id: media_id,
            edit_section_content: content,
            edit_section_name: chapter_name,
            edit_status: status,
            is_free
        } = this.state

        const { actions } = this.props

        if (!chapter_name) { message.info('请输入小节名称'); return; }

        if (media_id || media_id !== '') {

            actions.mediaAction({
                video_id: media_id,
                action: 'info',
                resolved: (data) => {
                    let duration = data.duration
                    if (duration && duration !== 0)
                        this.PublishChapter({ status, duration, chapter_id, parent_id, media_id, content, chapter_name,is_free })
                    else
                        message.info('获取的视频时长为 0，请检查视频链接')
                },
                rejected: (data) => {
                    message.error('获取视频时长信息出错，请重新上传')
                }
            })


        } else {
            message.info('视频链接不能为空'); return;
        }


    }
    _onNewSection = () => {

        let {
            new_duration: duration,
            new_parent_id: parent_id,
            new_media_id: media_id,
            new_section_content: content,
            new_section_name: chapter_name,
            new_status: status,
            is_free,
        } = this.state


        const { actions } = this.props

        if (!chapter_name) { message.info('请输入小节名称'); return; }

        if (media_id || media_id !== '') {

            actions.mediaAction({
                video_id: media_id,
                action: 'info',
                resolved: (data) => {
                    let duration = data.duration
                    if (duration && duration !== 0)
                        this.PublishChapter({ status, duration, parent_id, media_id, content, chapter_name,is_free })
                    else
                        message.info('获取的视频时长为 0，请检查视频链接')
                },
                rejected: (data) => {
                    message.error('获取视频时长信息出错，请重新上传')
                }
            })

        } else {
            message.info('视频链接不能为空'); return;
        }
    }

    _onNewChapter = () => {
        let { newContent: content, newChapterName: chapter_name } = this.state
        if (!chapter_name) {
            message.info('请输入章节名称')
            return;
        }
        this.PublishChapter({ content, chapter_name })
    }
    _onEditChapter = () => {
        let {

            editContent: content,
            editChapterName: chapter_name,
            editChapterId: chapter_id,
            is_free
        } = this.state
        this.PublishChapter({ chapter_id, content, chapter_name, is_free })
    }
    PublishChapter = ({ status, duration, parent_id, media_id, chapter_id, chapter_name, content, is_free }) => {

        let course_id = this.course_id
        const { actions } = this.props;
        actions.publishChapter({
            status, parent_id, media_id, chapter_id, chapter_name, course_id, content, duration, is_free,
            resolved: (data) => {
                this.setState({
                    showEditChapter: false,
                    showEditSection: false,
                    visibleAddChapter: false,
                    visibleAddSection: false,
                })
                this._reset_state()
                actions.getChapter(this.course_id, 1)
                message.success('操作成功')
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onIsNew = (val) => {
        if (val == 0)
            this.setState({ isNew: true, editChapterId: '', new_parent_id: '' })
        else
            this.setState({ isNew: false, new_parent_id: val })
    }
    _reset_state = () => {
        this.setState({
            new_section_name: '',
            new_section_content: '',
            new_media_id: '',
            new_duration: '',

            size: '',
            videoList: [],

            edit_section_name: '',
            edit_section_content: '',
            edit_media_id: '',
            edit_duration: '',

            editContent: '',
            editChapterName: '',
            editChapterId: '',

            newContent: '',
            newChapterName: '',

            remove_id: '',
            edit_parent_id: '',
            is_free:0,
        })
    }
    componentDidMount() {
        window.addEventListener("click", (e) => {
            this.setState({
                showMenu: false
            })
        })
        this.course_id = this.props.match.params.course_id
        const { actions } = this.props
        actions.getChapter(this.course_id, 1)
    }
    componentWillReceiveProps(n_props) {
        if (n_props.chapter_list !== this.props.chapter_list) {
            this.chapter_list = n_props.chapter_list
            this.chapter_ids = []
            this.setState({
                checkedKeys: [],
                isAll: false
            })
            this.chapter_list.map(ele => {
                this.chapter_ids.push(ele.chapterId)
                if (ele.courseChapterList.length !== 0) {
                    ele.courseChapterList.map(_ele => {
                        this.chapter_ids.push(_ele.chapterId)
                    })
                }
            })

        }
    }
    onSelectAll = () => {
        let checkedKeys = []
        let isAll = false
        if (!this.state.isAll) {
            isAll = true
            checkedKeys = this.chapter_ids
        }

        this.setState({
            checkedKeys,
            isAll
        })
    }
    onSelect = (keys, event) => {
        this.setState({
            keys: keys
        })
    };
    onCheck = (checkedKeys, event) => {

        let isAll = false
        if (checkedKeys.length == this.chapter_ids.length) {
            isAll = true
        }
        this.setState({
            checkedKeys,
            isAll
        })
    };
    showAddChapterPannel = () => {

        this.setState({
            visibleAddChapter: true,
            size: '',
            videoList: [],
            new_duration: '',

        })
    }
    onExpand = () => {

    };
    handleCancel = () => {
        this.setState({
            visibleAddSection: false,
        });
    };
    handleCancelChapter = () => {
        this.setState({
            visibleAddChapter: false,
        });
    }
    rightClick = (e) => {
        console.log(e)
        const obj = e.node.props
        let keys = []
        keys.push(obj.eventKey)
        if (!obj.eventKey)
            return
        if (typeof obj.isLeaf == 'undefined') {
            this.isLeaf = false

            this.setState({
                remove_id: obj.eventKey,
                keys: keys,
                showMenu: true,
                editChapterId: obj.eventKey,
                editChapterName: obj['data-name'],
                editContent: obj['data-content'],
                pageX: e.event.clientX,
                pageY: e.event.clientY,
            })

        } else {
            this.isLeaf = true
            this.setState({
                keys: keys,
                showMenu: true,

                remove_id: obj.eventKey,
                edit_chapter_id: obj['data-id'],
                edit_parent_id: obj['data-parent'],
                edit_section_name: obj['data-name'],
                edit_section_content: obj['data-content'],
                edit_media_id: obj['data-media'],
                edit_duration: obj['data-duration'],
                edit_status: obj['data-status'],
                size: obj['data-size'],
                is_free:obj['data-free'],
                pageX: e.event.clientX,
                pageY: e.event.clientY,
            })
        }



    }

    beforeVideoUpload(file) {
        const isMp4 = file.type === 'video/mp4'
        return isMp4;
    }
    onCourseVideoChange = ({ file, fileList }) => {
        if (file.type !== 'video/mp4') {
            message.error('只能上传 MP4 视频文件!');
            return;
        }
        let media_id = ''
        let duration = ''
        let size = ''
        let videoList = fileList
        // if(file.status == 'done'&&file.response.errorCode !== '1'){
        //     media_id = file.response.resultBody.mediaId
        //     duration = file.response.resultBody.duration
        //     size = file.response.resultBody.size
        // }

        if (file.status == 'done' && file.response.err == '0') {
            media_id = file.response.data.videoId
            message.info('上传成功')
            size = (file.size / 1000000).toFixed(2)
            this.setState({
                size,
                duration
            })
        } else if (file.status == 'error') {
            message.info('上传失败')
        }

        this.setState({
            videoList: videoList,
            edit_media_id: media_id,
            new_media_id: media_id,
            size: size,
            edit_duration: duration,
            new_duration: duration,
        })
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const uploadBtnVideo = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传视频</div>
            </div>
        );
        const { isNew } = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle="发布章节(点击右键修改指定章节)"
                    >
                        <div className="pad_b10">
                            <Button onClick={this.onSelectAll} size={'small'} className="">{this.state.isAll ? "取消全选" : "全选"}</Button>&nbsp;
                            <Popconfirm
                                title='确定删除吗？'
                                okText={'确定'}
                                cancelText={'取消'}
                                onConfirm={this._onRemoveChapters}
                            >
                                <Button size={'small'} className="">删除</Button>
                            </Popconfirm>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={this.showAddChapterPannel} size={'small'} className="">发布章节</Button>&nbsp;
                            {/*<Button onClick={()=>{this.setState({visibleAddSection:true})}} size={'small'} className="">发布节</Button>*/}
                        </div>
                        {this.chapter_list.length == 0 ?
                            <Empty description="暂时没有章节信息" />
                            : null}
                        <DirectoryTree onRightClick={this.rightClick}
                            draggable
                            checkable
                            multiple
                            defaultExpandAll
                            onSelect={this.onSelect}
                            onExpand={this.onExpand}
                            onCheck={this.onCheck}
                            blockNode={false}
                            selectedKeys={this.state.keys}
                            checkedKeys={this.state.checkedKeys}
                        >
                            {this.chapter_list.map((ele, index) => (
                                <TreeNode
                                    title={`${ele.chapterName}\t${ele.content}`}
                                    data-name={ele.chapterName}
                                    data-content={ele.content}
                                    key={ele.chapterId}
                                >
                                    {ele.courseChapterList === null ? null : ele.courseChapterList.map((_ele, _index) => (
                                        <TreeNode
                                            data-size={_ele.size}
                                            data-status={_ele.status}
                                            data-duration={_ele.duration}
                                            data-id={_ele.chapterId}
                                            data-parent={_ele.parentId}
                                            data-name={_ele.chapterName}
                                            data-content={_ele.content}
                                            data-media={_ele.mediaId}
                                            data-free={_ele.isFree}
                                            title={`${_ele.chapterName}\t${_ele.content}`}
                                            key={_ele.chapterId}
                                            isLeaf
                                        />
                                    ))}
                                </TreeNode>
                            ))}
                        </DirectoryTree>
                    </PageHeader>
                </Card>
                <div className="pad_10 bg_white border_1" style={{ display: this.state.showMenu ? 'block' : 'none', position: 'fixed', left: `${this.state.pageX}px`, top: `${this.state.pageY}px`, zIndex: 9999 }}>
                    <div>
                        <Button size={"small"} onClick={this.showEditChapter}>修改</Button>
                    </div>
                    <div>
                        <Button onClick={this._onRemove} className={"mt_5"} size={"small"}>删除</Button>
                    </div>
                </div>
                <Modal
                    title="修改节"
                    visible={this.state.showEditSection}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onOk={this._onEditSection}
                    onCancel={this.hideEditSection}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="级别">
                            <Select disabled value={this.state.edit_parent_id}>
                                {this.chapter_list.map((ele, index) => (
                                    <Select.Option key={index + '_edit_chapter'} value={ele.chapterId}>{ele.chapterName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="小节名称">
                            <Input
                                placeholder='如 第一节'
                                onChange={e => {
                                    this.setState({ edit_section_name: e.target.value })
                                }}
                                value={this.state.edit_section_name}
                            />
                        </Form.Item>
                        <Form.Item label="小节标题">
                            <Input
                                placeholder='请输入标题'
                                onChange={e => {
                                    this.setState({ edit_section_content: e.target.value })
                                }}
                                value={this.state.edit_section_content}
                            />
                        </Form.Item>
                        <Form.Item label="是否试看">
                            <Switch checked={this.state.is_free == 1 ? true : false} onChange={(e) => {
                                if (e) {
                                    this.setState({ is_free: 1 })
                                } else {
                                    this.setState({ is_free: 0 })
                                }
                            }} />
                        </Form.Item>
                        <Form.Item label="上传视频(MP4)">
                            <Upload
                                listType="picture-card"
                                fileList={this.state.videoList}
                                onChange={this.onCourseVideoChange}
                                beforeUpload={this.beforeVideoUpload}
                                customRequest={customUpload}
                            >
                                {this.state.videoList.length >= 1 ? null : uploadBtnVideo}
                            </Upload>
                            <div style={{ fontSize: '12px', lineHeight: '1.5', marginTop: '-15px' }}>
                                * 如上传了视频，视频链接将会自动生成<br />
                            </div>
                        </Form.Item>
                        <Form.Item label="视频链接">
                            <Input
                                onChange={e => {
                                    this.setState({ edit_media_id: e.target.value })
                                }}
                                value={this.state.edit_media_id}
                            />
                        </Form.Item>
                        <Form.Item label="视频时长(秒)">
                            <InputNumber
                                onChange={val => {
                                    if (val !== '' && !isNaN(val)) {
                                        //val = Math.round(val)
                                        if (val < 0) val = 0
                                        this.setState({ edit_duration: val })
                                    }
                                }}
                                value={this.state.edit_duration}
                                min={0}
                                max={20000}
                            />
                            <div style={{ fontSize: '12px', lineHeight: '1.5', marginTop: '6px' }}>
                                * 视频时长取整数<br />
                            * 如果视频时长为空，点击提交时将会根据视频链接自动获取视频的时长信息，请确保视频链接的正确性，如获取失败，请检查视频链接的有效性<br />
                            </div>
                        </Form.Item>


                    </Form>
                </Modal>

                <Modal
                    title="修改章节"
                    visible={this.state.showEditChapter}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideEditChapter}
                    onOk={this._onEditChapter}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="章节名称">
                            <Input
                                placeholder='如 第一章'
                                onChange={(e) => {
                                    this.setState({ editChapterName: e.target.value })
                                }} value={this.state.editChapterName} placeholder="" />
                        </Form.Item>

                        <Form.Item label="章节标题">
                            <Input onChange={(e) => {
                                this.setState({ editContent: e.target.value })
                            }} value={this.state.editContent} placeholder="" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="发布新章节"
                    visible={this.state.visibleAddChapter}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancelChapter}
                    bodyStyle={{ padding: "10px" }}
                    footer={isNew ?
                        <Button key={'chapter'} onClick={this._onNewChapter} type='primary'>发布新章</Button>
                        :
                        <Button key={'section'} onClick={this._onNewSection} type='primary'>发布新节</Button>
                    }
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="级别">
                            <Select onChange={this._onIsNew} defaultValue={0}>
                                <Select.Option value={0}>新章</Select.Option>
                                {this.chapter_list.map((ele, index) => (
                                    <Select.Option key={index + '_new'} value={ele.chapterId}>{ele.chapterName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {isNew ?
                            <div>
                                <Form.Item label="章节名称">
                                    <Input
                                        placeholder='如 第一章'
                                        value={this.state.newChapterName}
                                        onChange={e => {
                                            this.setState({ newChapterName: e.target.value })
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="章节标题">
                                    <Input
                                        value={this.state.newContent}
                                        onChange={e => {
                                            this.setState({ newContent: e.target.value })
                                        }}
                                    />
                                </Form.Item>
                            </div>
                            :
                            <div>
                                <Form.Item label="小节名称">
                                    <Input
                                        placeholder='如 第一节'
                                        onChange={e => {
                                            this.setState({ new_section_name: e.target.value })
                                        }}
                                        value={this.state.new_section_name}
                                    />
                                </Form.Item>
                                <Form.Item label="小节标题">
                                    <Input
                                        placeholder='小节标题'
                                        onChange={e => {
                                            this.setState({ new_section_content: e.target.value })
                                        }}
                                        value={this.state.new_section_content}
                                    />
                                </Form.Item>
                                <Form.Item label="是否试看">
                                    <Switch checked={this.state.is_free == 1 ? true : false} onChange={(e) => {
                                        if (e) {
                                            this.setState({ is_free: 1 })
                                        } else {
                                            this.setState({ is_free: 0 })
                                        }
                                    }} />
                                </Form.Item>
                                <Form.Item label="上传视频(MP4)">
                                    <Upload
                                        listType="picture-card"
                                        fileList={this.state.videoList}
                                        onChange={this.onCourseVideoChange}
                                        beforeUpload={this.beforeVideoUpload}
                                        customRequest={customUpload}
                                    >
                                        {this.state.videoList.length >= 1 ? null : uploadBtnVideo}
                                    </Upload>

                                    <div style={{ fontSize: '12px', lineHeight: '1.5', marginTop: '-15px' }}>
                                        * 如上传了视频，视频链接将会自动生成<br />
                                    </div>
                                </Form.Item>
                                <Form.Item label="视频链接">
                                    <Input
                                        onChange={e => {
                                            this.setState({ new_media_id: e.target.value })
                                        }}
                                        value={this.state.new_media_id}
                                    />
                                </Form.Item>
                                <Form.Item label="视频时长(秒)">
                                    <InputNumber
                                        onChange={val => {
                                            if (val !== '' && !isNaN(val)) {
                                                //val = Math.round(val)
                                                if (val < 0) val = 0
                                                this.setState({ new_duration: val })
                                            }
                                        }}
                                        value={this.state.new_duration}
                                        min={0}
                                        max={20000}
                                    />
                                    <div style={{ fontSize: '12px', lineHeight: '1.5', marginTop: '6px' }}>
                                        * 视频时长取整数<br />
                            * 如果视频时长为空，点击提交时将会根据视频链接自动获取视频的时长信息，请确保视频链接的正确性，如获取失败，请检查视频链接的有效性<br />
                                    </div>
                                </Form.Item>

                            </div>
                        }
                    </Form>
                </Modal>
            </div>
        );
    }
}
const LayoutComponent = ChapterSetting;
const mapStateToProps = state => {
    return {
        chapter_list: state.course.chapter_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
