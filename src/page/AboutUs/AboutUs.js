import React, { Component } from 'react';
import { Spin, Icon, Tabs, Card, message, Form, Input } from 'antd';
import AntdOssUpload from '../../components/AntdOssUpload';
import BraftEditor from 'braft-editor'
import Editor from '../../components/Editor'
import 'braft-editor/dist/index.css'
import connectComponent from '../../util/connect';
import config from '../../config/config';
import _ from 'lodash'
import { myUploadFn } from '../../components/MyUploadFn'
import { Button, Popconfirm } from '../../components/BtnComponent'
const { Search, TextArea } = Input;
const { TabPane } = Tabs;
const controls = [
    'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'separator', 'text-indent', 'text-align', 'separator',
    'headings',

    //'blockquote',  'emoji', 
    //'list-ol', 'list-ul', 'code', 'link', 'media', 
    'hr',
    'clear'
]

class AboutUs extends Component {


    state = {
        tab: '5',

        edit: false,
        view: false,

        article_id: "0",
        atype: '5',
        content: '',
        ctype: '0',
        fileList: [],
        contents: '',
        editorState: BraftEditor.createEditorState(null),
    }

    submitContent = () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        this.setState({
            content: htmlContent
        })
    }
    handleEditorChange = (editorState) => {
        const content = editorState.toHTML()
        this.setState({
            editorState,
            content
        })
    }

    componentWillMount() {

    }
    componentDidMount() {
        this.getAbout()
    }
    getAbout = () => {
        const { actions } = this.props
        const { tab } = this.state

        actions.getAbout({
            resolved: (data) => {
                if (data && data.length !== 0) {
                    let content = ''
                    let article_id = ''
                    let editorState = BraftEditor.createEditorState(null)
                    data.map(ele => {
                        if (ele.atype == tab) {
                            content = ele.content
                            article_id = ele.articleId
                            // if(ele.atype==10){
                            //     let fileList = []
                            //     // let imgs = ele.content.split(',')
                            //     ele.galleryList.map((_ele,idx)=>{
                            //         fileList.push({response:{resultBody:_ele.fpath},type:'image/png',uid:idx,name:'img'+idx,status:'done',url:_ele.fpath})
                            //     })
                            //     this.setState({
                            //         fileList:fileList,
                            //         contents:ele.content
                            //     })
                            // }
                        }
                    })

                    editorState = BraftEditor.createEditorState(content) || BraftEditor.createEditorState(null)

                    this.setState({ content, editorState, article_id })
                }
            }
        })
    }
    _onTabChange = val => {
        this.setState({ tab: val, atype: val, content: '' }, () => {
            this.getAbout()
        })

    }
    _onPublish = () => {
        const {
            article_id,
            atype,
            content,
            ctype,
            contents
        } = this.state
        const { actions } = this.props
        if (atype == 10) {
            let vas = this.refs.editor.toHTML()
            actions.publishAbout({
                article_id,
                atype,
                content: vas,
                ctype,
                resolved: (data) => {
                    message.success('提交成功')
                },
                rejected: (data) => {

                }
            })
        } else {
            actions.publishAbout({
                article_id,
                atype,
                content,
                ctype,
                resolved: (data) => {
                    message.success('提交成功')
                },
                rejected: (data) => {

                }
            })
        }


    }
    myUploadFn = (param) => {

        // console.log('param',param);
        const serverURL = config.api + '/site/upload';//upload 是接口地址
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        let name = param.file.name
        const id = param.file.lastModified
        if (name.indexOf('.mp3') > -1)
            name = name.replace('.mp3', '')

        const successFn = (response) => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            console.log('response:  ', response);
            //console.log('xhr.responseText', xhr.responseText);
            const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
            param.success({
                url: JSON.parse(xhr.responseText).resultBody,
                meta: {
                    id: id,
                    title: name || '',
                    alt: name || '',
                    loop: false, // 指定音视频是否循环播放
                    autoPlay: false, // 指定音视频是否自动播放
                    controls: true, // 指定音视频是否显示控制栏
                    poster: '', // 指定视频播放器的封面
                    name: name || ''
                }
            })
        };

        const progressFn = (event) => {
            param.progress(event.loaded / event.total * 100)

        };

        const errorFn = (response) => {
            param.error({
                msg: '上传出错！请重试'
            })
        };

        xhr.upload.addEventListener("progress", progressFn, false);
        xhr.addEventListener("load", successFn, false);
        xhr.addEventListener("error", errorFn, false);
        xhr.addEventListener("abort", errorFn, false);

        console.log(param)
        if (param.file.type == 'image/gif' || param.file.type == 'image/jpeg' || param.file.type == 'image/png') {
            fd.append('file_type', 0);
        } else if (param.file.type == 'video/mp4') {
            fd.append('file_type', 1);
        } else if (param.file.type == 'audio/mp3') {
            fd.append('file_type', 2);
            fd.append('upload_type', 'vod');
        } else {
            message.info('只支持JPEG、PNG、MP3、MP4、GIF文件');
            param.error({
                msg: '请选择正确的文件！'
            })
            return;
        }
        fd.append('file', param.file);
        xhr.open('POST', serverURL, true);
        xhr.withCredentials = true;
        xhr.send(fd)
    };
    render() {
        const { view, tab } = this.state
        return (
            <div className="animated fadeIn">
                <Card bodyStyle={{ paddingTop: 20 }}>
                    <Tabs activeKey={tab} onChange={this._onTabChange}>
                        <TabPane tab="油葱学堂介绍" key="5">

                        </TabPane>
                        <TabPane tab="用户服务使用协议" key="6">

                        </TabPane>
                        <TabPane tab="隐私条款" key="7">

                        </TabPane>
                        <TabPane tab="版权说明" key="8">

                        </TabPane>
                        <TabPane tab="联系我们" key="9">

                        </TabPane>
                        <TabPane tab="证照信息" key="10">

                        </TabPane>
                        <TabPane tab="付费服务及充值协议" key="11">

                        </TabPane>
                    </Tabs>
                    {
                        tab == 10 ?
                            <Card
                                type="inner"
                                bodyStyle={{ padding: 0 }}
                                bordered={false}
                                style={{ boxShadow: 'none' }}
                                bodyStyle={{ minHeight: '564px' }}
                            >
                                {/* <Form.Item label='证照信息'>
                            <AntdOssUpload
                                actions={this.props.actions}
                                value={this.state.fileList}
                                accept='image/*'
                                maxLength={80}
                                ref={ref => this.img = ref}

                            ></AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='文本描述'>
                            <TextArea autoSize={{ minRows: 4 }} value={this.state.contents} onChange={e => { this.setState({ contents: e.target.value }) }} className="m_w400" />
                        </Form.Item> */}
                                <div>
                                    <Editor content={this.state.content} ref='editor' actions={this.props.actions}></Editor>
                                </div>
                            </Card>
                            :
                            <Card
                                type="inner"
                                bodyStyle={{ padding: 0 }}
                                bordered={false}
                                style={{ boxShadow: 'none' }}
                                bodyStyle={{ minHeight: '564px' }}
                            >
                                {this.state.content == '' ? <Spin className='block_center pad_20' indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /> :
                                    <div>
                                        <BraftEditor
                                            readOnly={view}
                                            className='animated fadeIn'
                                            style={{ border: "1px solid #eaeaea" }}
                                            value={this.state.editorState}
                                            onChange={this.handleEditorChange}
                                            onSave={this.submitContent}
                                            contentStyle={{ height: '400px' }}
                                            media={{ uploadFn: myUploadFn }}
                                            controls={controls}
                                        />
                                        <p style={{ color: "#ff7e7e", fontSize: '12px', lineHeight: '2' }}>
                                            * 别处复制的文字内容，请先清除样式，再重新设置文字样式<br />
                                            * 图片、视频、音频等媒体请通过上传按钮上传<br />
                                            * 请确保编辑框的视频、音频有显示正常的链接、图片正常显示，否则请删除并重新上传<br />
                                            * 上传的文件中文件名不要包含 特殊字符 以及 空格，否则媒体将不能正常显示<br />
                                        </p>
                                    </div>
                                }
                            </Card>
                    }


                    <Button value='about/edit' onClick={this._onPublish} className='mt_10 mb_10' style={{ display: 'block', margin: '0 auto' }}>提交</Button>
                </Card>

            </div>
        );
    }
}

const LayoutComponent = AboutUs;
const mapStateToProps = state => {
    return {
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
