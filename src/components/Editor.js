import React from "react";
import {message,Modal,Icon} from 'antd';
import {myUploadFn} from './MyUploadFn'
import BraftEditor from './braft-editor'
import {ContentUtils} from 'braft-utils'
import config from '../config/config'
import AntdOssUpload from './AntdOssUpload'
import PropTypes from 'prop-types'

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

const controls = [
    'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
    'headings', 
    'list-ul',
    //'blockquote', 
    //'list-ol', 'code', 
    'link','separator', 'hr', 'separator',
    'media',
    'separator',
    'clear'
]

export default class Editor extends React.Component {
    static propTypes = {
		content: PropTypes.string,
	}
    static defaultProps = {
		content: '',
	}
    constructor(props){
        super(props)
    }
    state={
        editorState: BraftEditor.createEditorState(null),
        link:'',
        entityKey:'',
        mediaData:{},
        fileList:[],
        previewVisible:false,
        previewImage:'',
    }
    componentDidMount(){
        this.setState({
            editorState:BraftEditor.createEditorState(this.props.content)||BraftEditor.createEditorState(null)
        })
    }
    componentWillReceiveProps(n_props){
        console.log(n_props.content)
        if(n_props.content !== this.props.content){
            console.log(n_props.content)

            // const {editorState} = this.state
            // ContentUtils.insertHTML(editorState,n_props.content)
            this.setState({editorState:BraftEditor.createEditorState(n_props.content)||BraftEditor.createEditorState(null)})
        }
    }
    handleEditorChange = (editorState) => {
        let content = editorState.toHTML()
        this.setState({ editorState,content })
    }
    submitContent = () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        this.setState({
            content:htmlContent
        })
    }
    toHTML = ()=>{
        const {editorState} = this.state
        return editorState.toHTML()
    }
    onAudioClick = (props)=>{
        
        const entityKey = props.block.getEntityAt(0)
        
        if (!entityKey) {
            return
        }
        const entity = props.contentState.getEntity(entityKey)
        const mediaData = entity.getData()
        // const mediaType = entity.getType()

        this.setState({
            showPannel:true,
            entityKey,
            mediaData,
        })
    }
    onConfirm = ()=>{
        const {editorState,entityKey,mediaData} = this.state
        let link = ''
        if(this.img){
            link = this.img.getValue()
        }
        this.setState({showPannel:false},()=>{
            mediaData.meta.poster = link
            this.editorInstance.setValue(ContentUtils.setMediaData(this.editorInstance.getValue(), entityKey, mediaData))
            this.editorInstance.requestFocus()
        })
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
    }
    onRemove = ()=>{
        this.setState({
            fileList:[],
            link:''
        })
    }
    onImgChange = ({fileList}) =>{
        let link = ''
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                if(index == 0){
                    link = ele.response.resultBody
                    message.success('上传成功')
                }
            }
        })
        this.setState({
            fileList,
            link
        })
    }
    render() {
    return (
        <>
            <BraftEditor
                ref={instance => this.editorInstance = instance}
                readOnly={this.props.readOnly}
                style={{border:"1px solid #eaeaea"}}
                value={this.state.editorState}
                onChange={this.handleEditorChange}
                onSave={this.submitContent}
                contentStyle={{minHeight:'400px',maxHeight: '800px',height: 'auto'}}
                media={{uploadFn:myUploadFn}}
                controls={controls}
                onAudioClick={this.onAudioClick}
                actions={this.props.actions}
            />
            <p style={{color:"#ff7e7e",fontSize:'12px',lineHeight:'2'}}>
                * 别处复制的文字内容，请先清除样式，再重新设置文字样式<br />
                * 图片、视频等媒体请通过上传按钮上传<br />
                * 请确保编辑框的视频、音频有显示正常的链接、图片正常显示，否则请删除并重新上传<br />
                * 上传的文件中文件名不要包含 特殊字符 以及 空格，否则媒体将不能正常显示<br />
                * 上传长图时，请上传原尺寸图片的两倍尺寸的高清分辨率图片<br />
            </p>
            <Modal onOk={this.onConfirm} maskClosable={true} onCancel={()=>{this.setState({showPannel:false,fileList:[]})}} title='设置封面' visible={this.state.showPannel} okText='确定' cancelText='取消'>
                <AntdOssUpload
                    listType="picture-card"
                    value={[]}
                    ref={ref=>this.img = ref}
                    accept='image/*'
                    actions={this.props.actions}
                >
                </AntdOssUpload>
                <span style={{marginTop:'0px',display:'block',fontSize:'12px',color:'red'}}>* 根据上传的视频比例上传封面图片，例如视频是16：9，封面也要上传16：9，以此类推；音频封面比例为1:1</span>
            </Modal>
            <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
                <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
        </>
    )
  }
}