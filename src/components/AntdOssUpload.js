import React, { Component } from 'react';
import { Modal, Form, Upload, message, Button, Icon } from 'antd';
import config from '../config/config'
import PropTypes from 'prop-types'
import BraftFinder from './braftFinder'
import zhCN from 'antd/es/locale/zh_CN';
function dataURLtoFile(dataurl) {
	const arr = dataurl.split(',')
	const mime = arr[0].match(/:(.*?);/)[1]
	const bstr = atob(arr[1])
	let n = bstr.length
	const u8arr = new Uint8Array(n)
	while (n--) {
	  u8arr[n] = bstr.charCodeAt(n)
	}
	let blob = new File([u8arr], 'file', { key:Date.now().toString(),type: mime })
	// const params = new FormData()
	// params.append('file', blob)
	return blob
}
export default class AntdOssUpload extends Component {
	
	static propTypes = {
		tip: PropTypes.string,
		value: PropTypes.array,
		accept: PropTypes.string,
		maxLength: PropTypes.number,
		disabled: PropTypes.bool,
		listType: PropTypes.string,
		fixedName:PropTypes.string,
		multiple: PropTypes.bool,
		onChange: PropTypes.func,
		actions: PropTypes.object,
		showMedia: PropTypes.bool,
	}
	static defaultProps = {
		tip: '选择文件',
		value: [],
		accept: '',
		maxLength: 1,
		disabled: false,
		listType: 'picture-card',
		fixedName:'',
		multiple:false,
		onChange:()=>{},
		actions:null,
		showMedia:true,
	}
	constructor(props){
		super(props)
        this.state = {
			OSSData: {},
			fileList: [],
			pdfList:[],
			previewImage: '',
			previewVisible: false,
			showFolder: false,
		}
		this.canvas = null
		this.fileList = []
		this.pdfFile = null
		this.pdf = null
		this.pageNum = 1
		this.context = null
		this.preview  = null
    }
	async componentDidMount() {
		await this.init();
	}
	componentWillMount(){
		this.braftFinder = new BraftFinder({
			
		})
		this.canvas = document.createElement('canvas');
		console.log(this.props)
		this.setState({ fileList: this.props.value||[] })
	}
	componentWillReceiveProps(n_props) {
		if (n_props.value !== this.props.value) {
			if(this.props.accept == 'application/pdf'){
				if(n_props.value.length>0){
					let fileList = [{ uid:'uid',status:'done',url:'',name:'课件.pdf',fname:'课件.pdf' }]
					this.setState({ fileList:fileList, pdfList:n_props.value||[], })
				}
			}else{
				this.setState({ fileList: n_props.value||[] })
			}
		}
	}
	init = async () => {
		try {
			const OSSData = await this.mockGetOSSData();
			this.setState({
				OSSData,
			});
		} catch (error) {
			message.error('获取上传签名出错');
		}
	}
	mockGetOSSData = async () => {
		let res = await fetch(config.api + '/site/getSign', {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		}).then(response => response.json()).catch(() => { message.error('获取OSS验证信息失败') })
		if(res && typeof res === 'object' && 'resultBody' in res)
			return res.resultBody
		else
		 return {
			dir:'',
			accessid:'',
			policy:'',
			callback:'',
			signature:'',
		 }
	}
	onChange = ({ file, fileList }) => {
		const {accept} = this.props
		// if(accept){
		// 	if(accept.indexOf('video')>-1 && file.type.indexOf('video')==-1){
		// 		message.info('请上传mp4文件'); return;
		// 	}
		// 	if(accept.indexOf('image')>-1 &&file.type.indexOf('image')==-1){
		// 		message.info('请上传图片文件'); return;
		// 	}
		// 	if(accept.indexOf('audio')>-1 &&file.type.indexOf('audio')==-1){
		// 		message.info('请上传音频文件'); return;
		// 	}
		// 	if(accept.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')>-1&&file.name.indexOf('xlsx')==-1){
		// 		message.info('请上传xlsx文件'); return;
		// 	}
			
		// }
		if(file.type=='image/png'||file.type=='image/jpeg'||file.type=='image/jpg'){
			if(file.size>11000000){
				message.info({content:'上传图片不得超过10Mb'});
				return;
			}
		}
		if (file.status == 'done') {
			if (file.response.Status == 'OK') {
				message.success("上传成功")
				this.changeFile(file.url)
			}
		}
		this.setState({ fileList:fileList })
		// this.setState({ pdfList:fileList })
		this.props.onChange&&this.props.onChange({ file, fileList })
	}
	onRemove = file => {
		const { fileList } = this.state;
		const files = fileList.filter(v => v.url !== file.url);
		this.setState({ fileList: files })
	}
	transformFile = file => {
		const { OSSData } = this.state;
		const { fixedName } = this.props
		const suffix = file.name.slice(file.name.lastIndexOf('.'));
		let filename = Date.now() + suffix;

		if(fixedName){
			filename = fixedName
		}
		file.url = OSSData.host + '/' + OSSData.dir + filename;
		file.fname = filename
		return file;
	};
	getExtraData = file => {
		const { OSSData } = this.state;
		return {
			key: OSSData.dir + file.fname,
			OSSAccessKeyId: OSSData.accessid,
			success_action_status: '200',
			policy: OSSData.policy,
			callback: OSSData.callback,
			signature: OSSData.signature,
		};
	};
	beforeUpload = async () => {
		const { OSSData } = this.state;
		const expire = OSSData.expire * 1000;

		if (expire < Date.now()) {
			await this.init();
		}
		return true;
	};
	handlePreview = async file => {
		if (!file.url && !file.preview) {
			return
		}
		
		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
		});
	}
	getValue = () => {
		const { fileList,pdfList,img } = this.state
		const {accept,defImg} = this.props
		let value = []
		if(accept === 'application/pdf'){
			pdfList.map((ele, index) => {
				if (ele.status == 'done') {
					value.push(ele.url)
				}
			})
		}else{
			fileList.map((ele, index) => {
				if (ele.status == 'done') {
					value.push(ele.url)
				}
			})
		}
		return value.join(',')
	}
	getValues = () => {
		const { fileList } = this.state
		
		return fileList
	}
	changeFile = (file)=>{
		const that = this
		if(this.props.accept.indexOf('pdf')>-1){
			var loadingTask = window.pdfjsLib.getDocument(file);
			loadingTask.promise.then(function(pdf) {
				that.pdf = pdf
				that.savePage()
			});
		}
		
	}
	readPage = (callback)=>{
		const that = this
		console.log(that.pdf)
		that.pdf.getPage(that.pageNum).then((page)=>{
			
			var viewport = page.getViewport({ scale: 2 });
			this.canvas.width = viewport.width;
			this.canvas.height = viewport.height;
			var ctx = this.canvas.getContext("2d");
			let renderContext = { canvasContext: ctx, viewport: viewport };
			var renderTask = page.render(renderContext).promise.then(()=>{
				callback(this.canvas)
			});
			return renderTask.promise;
		});
	}
	savePage = ()=>{
		const that = this
		const {pdfList} = this.state
		if (that.pageNum > that.pdf.numPages) {
			if(this.pdfUploader){
				if( Array.isArray(pdfList) && pdfList.length > 0 )
				this.pdfUploader.upload.uploader.uploadFiles(pdfList)
			}
			that.pageNum = 1;
			return;
		}
		that.readPage((canvas)=>{
			const url = canvas.toDataURL('image/jpeg')
			var file_item = dataURLtoFile(url)
			that.pageNum ++
			that.setState(pre=>{
				let {pdfList} = pre
				const uuid = URL.createObjectURL(new Blob()).toString();

				const obj = {
					fname: 'image',
					lastModifiedDate: file_item.lastModifiedDate,
					lastModified: file_item.lastModified,
					name: file_item.name,
					size:file_item.size,
					type:file_item.type,
					uid: uuid.substr(uuid.lastIndexOf('/')+1),
					originFileObj: file_item,
					status:'uploading',
					url:url,
					response:'true'
				}
				pdfList.push(obj)
				return {pdfList:pdfList}
			})
			that.savePage();
		})
	}
	render() {
		const MediaLibrary = this.braftFinder.ReactComponent
		const {accept,maxLength,tip} = this.props
		const props = {
			name: 'file',
			disabled: this.props.disabled,
			listType: this.props.listType,
			fileList: this.state.fileList,
			action: this.state.OSSData.host,
			onChange: this.onChange,
			onRemove: this.onRemove,
			transformFile: this.transformFile,
			data: this.getExtraData,
			beforeUpload: this.beforeUpload,
			onPreview: this.handlePreview,
			accept:accept||'',
			multiple:this.props.multiple,
		}
		const { previewImage } = this.state
		const content = (
			previewImage.indexOf('.jpg')>-1||previewImage.indexOf('.jpeg')>-1||previewImage.indexOf('.gif')>-1||previewImage.indexOf('.png')>-1?
				<img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />:
			previewImage.indexOf('.mp3')>-1||previewImage.indexOf('.m4a')>-1?
				<audio alt="音频预览" style={{ width: '100%' }} controls src={this.state.previewImage} />:
			previewImage.indexOf('.mp4')>-1||previewImage.indexOf('.MP4')>-1?
				<video alt="视频预览" style={{ width: '100%' }} controls src={this.state.previewImage} />:
				<img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
		)
		return (
			<>
				{
					this.props.listType !=='text'?
					<>{this.props.disabled||!this.props.showMedia?null:<Button onClick={()=>{ this.setState({ showFolder:true }) }}>素材库</Button>}
					<Upload {...props}>
						{
							this.state.fileList.length === maxLength||this.props.disabled==true ? null :
							<>
								<Icon type="plus" />
              					<div className="ant-upload-text">{tip}</div>
							</>
						}
					</Upload>
					</>
					:
					<Upload {...props}>
						<Button disabled={this.state.fileList.length === maxLength}>
							<Icon type="upload" /> {tip}
						</Button>
					</Upload>
				}
				{
				this.props.accept.indexOf('pdf') > -1 ?
				<Upload
					key='pdfUploader'
					transformFile = {(file)=>{
						const { OSSData } = this.state;
						const uuid = URL.createObjectURL(new Blob()).toString();
						let filename = uuid.substr(uuid.lastIndexOf('/')+1) + '.jpeg';

						file.url = OSSData.host + '/' + OSSData.dir + filename;
						file.fname = filename
						file.originFileObj.fname = filename
						file.originFileObj.url = OSSData.host + '/' + OSSData.dir + filename;
						return file.originFileObj;
						// file.name = Math.random().toString()
						// return file.originFileObj;
					}}
					
					data = {this.getExtraData}
					beforeUpload ={this.beforeUpload}
					action= {this.state.OSSData.host}
					fileList={this.state.pdfList}
					locale={zhCN}
					listType='picture-card'
					showRemoveIcon={true}
					showDownloadIcon={true}
					showPreviewIcon={true}
					onPreview={this.handlePreview}
					onChange={({fileList})=>this.setState({pdfList:fileList})}
					ref={ref => this.pdfUploader = ref}
				/>
				:null
			}
				<Modal zIndex={2020} visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={() => { this.setState({ previewVisible: false }) }}>
					{content}
				</Modal>
				<Modal width={1000} closable={false} footer={null} visible={this.state.showFolder} onCancel={()=>{ this.setState({ showFolder:false }) }}>
					<MediaLibrary
						showFooter
						maxLength={ this.props.maxLength }
						actions={ this.props.actions }
						accepts={ this.props.accepts }
						onCancel={()=>{ this.setState({ showFolder:false }) }}
						onInsert={this.onInsert}
						onChange={(val)=>{ console.log(val) }}
					/>
				</Modal>
			</>
		);
	}
	onInsert = (val)=>{
		let {fileList} = this.state
		if((fileList.length + val.length)>this.props.maxLength){
			message.info('最多允许设置'+this.props.maxLength+'个素材')
			return
		}
		if(this.props.accept){

			
			let flag = false
			val.map(ele=>{
				if(this.props.accept.indexOf(ele.type.toLowerCase()) == -1){
					flag = true
				}else{
					fileList = [...fileList,{
						...ele,
						uid:Math.random().toString(36).slice(-8) + Date.now() + ele.id,
						status:'done',
						type:ele.type=='IMAGE'?'image/png':ele.type=='VIDEO'?'video/mp4':'audio/mp3'
					}]
				}
			})
			if(flag){ message.info('请选择正确文件类型');return; }
			 
			this.setState({showFolder:false},()=>{
				this.setState({fileList})
			})
		}
	}
}