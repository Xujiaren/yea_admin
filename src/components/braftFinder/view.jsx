import './styles.scss'
import React from 'react'
import { UniqueIndex } from './utils/base'

import { Spin, message, Button, Input, Card, Breadcrumb, Modal,Icon } from 'antd';
import folder_icon from '../../assets/img/folder.png'

const defaultAccepts = {
	image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
	video: 'video/mp4',
	audio: 'audio/mp3'
}
export default class BraftFinderView extends React.Component {

	static defaultProps = {
		showFooter:false,
		accepts: defaultAccepts,
		externals: {
			image: true,
			video: true,
			audio: true,
			embed: true
		}
	}

	constructor (props) {

		super(props)
		this.dragCounter = 0
		this.controller = this.props.controller
		const initialItems = this.controller.getItems()

		this.state = {
			draging: false,
			error: false,
			confirmable: initialItems.find(({ selected }) => selected),
			hasFolder:false,
			external: {
				url: '',
				type: 'IMAGE'
			},
			fileAccept: '',
			showExternalForm: false,
			allowExternal: false,
			items: initialItems,
			previewImage:'',
			showImgPanel:false,
			file_route:[],
			files:[],
			parent_id:0,
			folder_id:0,
			material_id:0,
			keyword:'',
			selectedItems:[]
		}

		this.changeListenerId = this.controller.onChange(items => {
			const selectedItems = this.controller.getSelectedItems()
			this.setState({ 
				selectedItems,
				items,
				hasFolder: selectedItems.find(({ folder }) => folder)||false,
				confirmable: items.find(({ selected }) => selected)
			})
			this.props.onChange && this.props.onChange(items)
		})

	}

  	mapPropsToState (props) {

		let { accepts, externals } = props

		accepts = {
		...defaultAccepts,
		...accepts
		}

		const fileAccept = !accepts ? [
			defaultAccepts.image,
			defaultAccepts.video,
			defaultAccepts.audio
		].join(',') : [
			accepts.image,
			accepts.video,
			accepts.audio
		].filter(item => item).join(',')

		const external = {
			url: '',
			type: 
				externals.image ? 'IMAGE' :
				externals.audio ? 'AUDIO' :
				externals.video ? 'VIDEO' :
				externals.embed ? 'EMBED' : ''
		}

		return {
			fileAccept: fileAccept,
			external: external,
			allowExternal: externals && (externals.image || externals.audio || externals.video || externals.embed)
		}

	}

	rightClick = (event)=>{
		event.preventDefault()
	}
	leftClick = ()=>{
	}
	componentWillMount(){
		this.getFile()
	}
	componentDidMount () {
		this.ref.addEventListener('contextmenu', this.rightClick)
		this.setState(this.mapPropsToState(this.props))
		document.addEventListener('click', this.leftClick)
	}

	componentWillReceiveProps (nextProps) {
		this.setState(this.mapPropsToState(nextProps))
	}

	componentWillUnmount () {
		this.ref.removeEventListener('contextmenu', this.rightClick)
		document.removeEventListener('click', this.leftClick)
		this.controller.offChange(this.changeListenerId)
	}
	_onSearch = (val)=>{
		this.setState({ keyword:val,file_route:[],parent_id:0 },()=>{
			this.getFile()
		})
	}
	getFile = ()=>{
		const {parent_id:folder_id,keyword} = this.state
		let param = { folder_id }

		if(folder_id==0||!folder_id||keyword){
			param = { type:'top',keyword }
		}
		this.props.actions&&this.props.actions.getFile({
			...param,
			resolved:(data)=>{
				const {files,folders} = data
				let items = []
				if(folders instanceof Array){
					folders.map(ele=>{
						items.push({
							id: new Date().getTime() + '_' + UniqueIndex(),
							type:'IMAGE',
							thumbnail:folder_icon,
							name:ele.folderName,
							file:folder_icon,
							url:folder_icon,
							uploadProgress:1,
							uploading:false,
							folder:true,
							folderId:ele.folderId,
							parentId:ele.parentId,
							info:ele,
							meta:{
								poster:folder_icon,
								autoPlay:false,
								controls:true,
								id: new Date().getTime() + '_' + UniqueIndex(),
								loop:false,
								name:ele.folderName,
								poster:'',
								title:ele.folderName,
							}
						})
					})
				}
				if(files instanceof Array){
					files.map(ele=>{
						items.push({
							meta:{
								autoPlay:false,
								controls:true,
								id: new Date().getTime() + '_' + UniqueIndex(),
								loop:false,
								name:ele.title,
								poster:"",
								title:ele.title,
							},
							info:ele,
							id: new Date().getTime() + '_' + UniqueIndex(),
							thumbnail:'',
							name:ele.title,
							file:ele.link,
							url:ele.link,
							uploading:false,
							folder:false,
							materialId:ele.materialId,
							folderId:ele.folderId,
							parentId:ele.parentId,
							uploadProgress:1,
							type:ele.ftype==0?'IMAGE':ele.ftype==1?'VIDEO':ele.ftype==2?'AUDIO':'',
						})
					})
				}
				this.controller.setItems(items)
				this.setState({loading:false})
			},
			rejected:(data)=>{
				message.error(JSON.stringify(data))
				this.setState({loading:false})
			}
		})
	}
	
	setFile = (val,index)=>{
		//0:图片，1:视频，2:音频
		const {material_id,parent_id:folder_id} = this.state
		const ctype=''
		let {name:title,url:link,type,id} = val
		const ftype = type == 'IMAGE'? 0:type=='VIDEO'? 1:type == 'AUDIO'? 2:''

		let items = this.controller.getItems()
        if(items.find(item => item.name == title)){
            title = '（'+ UniqueIndex() + '）_' + title
		}
		this.props.actions&&this.props.actions.setFile({
			type: '',
			folder_id,
			material_id,
			link,
			title,
			ftype,
			ctype,
			resolved:(res)=>{
				console.log(val)
				const { materialId } = res
				if(materialId){
					this.controller.setMediaItemState(id,{
						...val,
						materialId: materialId,
						name: title
					})
				}
				this.setState({ loading:false })
				message.success('创建成功')
			},
			rejected:(data)=>{
				message.error(JSON.stringify(data))
			}
		})
	}
	onItemClick(item){
		const {file_route} = this.state
		if(item.folder===true){
			this.setState({loading:true})
			this.setState({
				file_route:[...file_route, item],
				parent_id:item.folderId,
			},()=>{
				this.getFile()
			})
		}else{
			this.setState({ previewImage:item,showImgPanel:true })
		}
	}
	goto(item,index){
		const {file_route} = this.state
		if(file_route.length==0||item.folderId == file_route[file_route.length-1].folderId){
			return
		}
		
		this.setState({ file_route:file_route.slice(0,index+1),parent_id:item.folderId },()=>{
			this.getFile()
		})
		console.log(item,file_route.slice(0,index+1))
	}

	deleteFiles = ()=>{
		const selectedItems = this.controller.getSelectedItems()
		if(selectedItems instanceof Array){
			Modal.confirm({
				title:'确定删除吗',
				content:'',
				onOk:this.actionFile.bind(this,selectedItems)
			})
		}
	}
	actionFile(files){
		files.map((item,index)=>{
			if(item){
				let param = null
				if(item.folder){
					param = {type:'folder', folder_id:item.folderId, action:'delete'}
				}else{
					param = {type:'', material_id:item.materialId, action:'delete'}
				}
				this.props.actions&&this.props.actions.actionFile({
					...param,
					resolved:(data)=>{
						this.getFile()
						if(files.length === index +1){ message.success('提交成功') }
					},
					rejected:(data)=>{
						message.error(JSON.stringify(data))
					}
				})
			}
		})
	}
	renameFile = ()=>{
		const { file_name:title } = this.state
		const { folderId:folder_id, materialId:material_id, link, ftype, ctype } = this.controller.getSelectedItems()[0]['info']

		console.log(this.controller.getSelectedItems())

		if(title == ''){
            message.info('请输入文件名称')
            return
        }
        let items = this.controller.getItems()
        if(items.find(item => item.name == title)){
            message.info('该文件名已存在')
            return
		}

		this.props.actions&&this.props.actions.setFile({
			type:'',folder_id,material_id,link,title,ftype,ctype,
			resolved:(data)=>{
				this.setState({ showAddFile:false })
				message.success('提交成功')
				this.getFile()
			},
			rejected:(data)=>{
				message.error(JSON.stringify(data))
			}
		})
	}
	addFolder = ()=>{
        const {folder_name,parent_id,folder_id} = this.state
        if(folder_name == ''){
            message.info('请输入文件夹名称')
            return
        }
        let items = this.controller.getItems()
        if(items.find(item => item.name == folder_name)){
            message.info('该文件夹名已存在')
            return
		}
		
		this.props.actions&&this.props.actions.setFile({
			type: 'folder',
			parent_id: parent_id||'',
			folder_id: folder_id,
			folder_name: folder_name,
			resolved:(data)=>{
				message.success('提交成功')
				this.getFile()
			},
			rejected:(data)=>{
				message.error(JSON.stringify(data))
			}
		})
        this.setState({
            showAddFolder:false
        })
	}
	editSelectedItems = ()=> {
		const selectedItems = this.controller.getSelectedItems()[0]
		if(selectedItems.folder===true){
			this.setState({ folder_name:selectedItems['name'],folder_id: selectedItems['folderId'],showAddFolder:true })
		}else{
			this.setState({ file_name:selectedItems['name'],showAddFile:true })
		}
	}
  	render () {

    const { language, externals } = this.props
    const { hasFolder, items, draging, confirmable, fileAccept, external, showExternalForm, allowExternal } = this.state

    return <>
    <Modal
        visible={this.state.showAddFolder}
        title={this.state.folder_id==0?'创建文件夹':'修改文件夹'}
        okText='提交'
        cancelText='取消'
        onCancel={()=>{
            this.setState({
                showAddFolder:false
            })
        }}
        onOk={this.addFolder}
    >
        <Input
            onChange={(e)=>{
                this.setState({ folder_name:e.target.value})
            }}
            placeholder='请输入名称'
            value={this.state.folder_name}
        />
    </Modal>
    <Modal
        visible={this.state.showAddFile}
        title={'修改文件名'}
        okText='提交'
        cancelText='取消'
        onCancel={()=>{
            this.setState({
                showAddFile:false
            })
        }}
        onOk={this.renameFile}
    >
        <Input
            onChange={(e)=>{
                this.setState({ file_name:e.target.value})
            }}
            placeholder='请输入名称'
            value={this.state.file_name}
        />
    </Modal>
    <div className="flex f_row j_space_between align_items mb_10">
        <div>
            <Input.Search
				disabled={this.state.loading}
                placeholder="关键词"
                onSearch={this._onSearch}
                style={{ maxWidth: 200 }}
                value={this.state.keyword}
                onChange={(e)=>{ this.setState({keyword:e.target.value}) }}
            />
        </div>
        <div>
            <Button
				disabled={this.state.loading}
                onClick={()=>{
                    this.setState({
                        showAddFolder:true,
                        folder_name:'',
                        folder_id:0
                })
            }}>
                创建文件夹
            </Button>
            &nbsp;
            <Button disabled={this.state.loading}>
                <input
					disabled={this.state.loading}
                    style={{
                        opacity: 0,
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
						width: '100%',
						zIndex: 99,
                    }}
                    onChange={this.reslovePickedFiles}
                    multiple
                    type="file"
                    accept="image/*,video/*,audio/*"
                />
                上传素材
            </Button>
        </div>
    </div>
    <Spin spinning={this.state.loading}>
    <Card type='inner' bodyStyle={{padding:0}}>
    <div className="braft-finder" ref={ref=>{this.ref = ref}}>
        <Breadcrumb 
            className='mt_10 mb_10 pad_15'
        >
            <Breadcrumb.Item
                data-name=''
                onClick={()=>{
                    this.setState({keyword:'', parent_id:'',folder_id:'',file_route:[]},()=>{
                        this.getFile()
                    })
                }}
                style={{cursor:'pointer'}}
            >
                <Icon type='home'/>
            </Breadcrumb.Item>
            {this.state.file_route.map((ele,index)=>(
                <Breadcrumb.Item
                    onClick={this.goto.bind(this,ele,index)}
                    key={ele.name+'route'} 
                    style={{cursor:'pointer'}}
                >
					<Icon type='folder'/>
                    <span>{ele.name}</span>
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
        <div
            onDragEnter={1?null:this.handleDragEnter}
            onDragLeave={1?null:this.handleDragLeave}
            onDrop={1?null:this.handleDragDrop}
            className="bf-uploader"
        >
        
        <div className={"bf-drag-uploader " + (draging || !items.length ? 'active ' : ' ') + (draging ? 'draging' : '')}>
            <span className="bf-drag-tip">
            {/*
            <input accept={fileAccept} onChange={1?null:this.reslovePickedFiles} multiple type="file"/>
            */}
            {draging ? language.dropTip : language.dragTip}
            </span>
        </div>
        {items.length ? (
            <div className="bf-list-wrap">
            <div className="bf-list-tools">
                <span onClick={this.selectAllItems} className="bf-select-all"><i className="braft-icon-done"></i> {language.selectAll}</span>
                <span onClick={this.deselectAllItems} disabled={!confirmable} className="bf-deselect-all"><i className="braft-icon-close"></i> {language.deselect}</span>
                <span onClick={this.editSelectedItems} disabled={this.state.selectedItems.length!==1} className="bf-deselect-all"><i className="braft-icon-replay"></i>重命名</span>
                
                <span onClick={this.removeSelectedItems} disabled={!confirmable} className="bf-remove-selected"><i className="braft-icon-bin"></i> {language.removeSelected}</span>
                
            </div>
            {this.buildItemList()}
            </div>
        ) : null}
        {showExternalForm && allowExternal ? (
            <div className="bf-add-external">
            <div className="bf-external-form">
                <div className="bf-external-input">
                <div>
                    <input onKeyDown={this.confirmAddExternal} value={external.url} onChange={this.inputExternal} placeholder={language.externalInputPlaceHolder}/>
                </div>
                <button type="button" onClick={this.confirmAddExternal} disabled={!external.url.trim().length}>{language.confirm}</button>
                </div>
                <div data-type={external.type} className="bf-switch-external-type">
                {externals.image ? <button type="button" onClick={this.switchExternalType} data-type="IMAGE">{language.image}</button> : null}
                {externals.audio ? <button type="button" onClick={this.switchExternalType} data-type="AUDIO">{language.audio}</button> : null}
                {externals.video ? <button type="button" onClick={this.switchExternalType} data-type="VIDEO">{language.video}</button> : null}
                {externals.embed ? <button type="button" onClick={this.switchExternalType} data-type="EMBED">{language.embed}</button> : null}
                </div>
                <span className="bf-external-tip">{language.externalInputTip}</span>
            </div>
            </div>
        ) : null}
        </div>
        {this.props.showFooter?
        <footer className="bf-manager-footer">
            {/* <div className="pull-left">
                {allowExternal ? (
                <span 
                    onClick={this.toggleExternalForm}
                    className="bf-toggle-external-form"
                >
                    {showExternalForm ? (
                    <span className="bf-bottom-text"><i className="braft-icon-add"></i> {language.addLocalFile}</span>
                    ) : (
                    <span className="bf-bottom-text"><i className="braft-icon-add"></i> {language.addExternalSource}</span>
                    )}
                </span>
                ) : null}
            </div> */}
            
            <div className="pull-right">
                <button onClick={this.confirmInsert} className="button button-insert" disabled={!confirmable||hasFolder}>{language.insert}</button>
                <button onClick={this.cancelInsert} className="button button-cancel">{language.close}</button>
            </div>
        </footer>
        :null}
        <Modal 
            visible={this.state.showImgPanel} 
            maskClosable={true} 
            footer={null} 
            onCancel={()=>{
                this.setState({
                    showImgPanel:false
                })
            }}
        >	
            {
                this.state.previewImage.type==='IMAGE'?<img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage.url} />:
                this.state.previewImage.type==='VIDEO'?<video src={this.state.previewImage.url} style={{ width: '100%' }} controls></video>:
                this.state.previewImage.type==='AUDIO'?<audio src={this.state.previewImage.url} style={{ width: '100%',outlineStyle:'none' }} controls></audio>:''
            }
            
        </Modal>
    </div>
    </Card>
    </Spin>
    </>;

 	}

	buildItemList () {

		return (
		<ul className="bf-list">
			{/*
			<li className="bf-add-item">
				<i className="braft-icon-add"></i>
				<input accept={this.state.fileAccept} onChange={this.reslovePickedFiles} multiple type="file"/>
			</li>
			*/}
			
			{this.state.items.map((item, index) => {

			let previewerComponents = null
			let progressMarker = item.uploading && !this.props.hideProgress ? (
				<div className="bf-item-uploading">
				<div className="bf-item-uploading-bar" style={{width: item.uploadProgress / 1 + '%'}}></div>
				</div>
			) : ''

			switch (item.type) {
				case 'IMAGE': 
				previewerComponents = (
					<div className="bf-image">
					{progressMarker}
					<img src={item.thumbnail || item.url+'?x-oss-process=image/resize,w_64' || item.link+'?x-oss-process=image/resize,w_64'} />
					<div>{item.name || item.url || item.link}</div>
					</div>
				)
				break
				case 'VIDEO':
				previewerComponents = (
					<div className="bf-icon bf-video" title={item.url}>
					{progressMarker}
					<i className="braft-icon-film"></i>
					<span>{item.name || item.url}</span>
					</div>
				)
				break
				case 'AUDIO':
				previewerComponents = (
					<div className="bf-icon bf-audio" title={item.url}>
					{progressMarker}
					<i className="braft-icon-music"></i>
					<span>{item.name || item.url}</span>
					</div>
				)
				break
				case 'EMBED':
				previewerComponents = (
					<div className="bf-icon bf-embed" title={item.url}>
					{progressMarker}
					<i className="braft-icon-code"></i>
					<span>{item.name || this.props.language.embed}</span>
					</div>
				)
				break
				default:
				previewerComponents = (
					<a className="bf-icon bf-file" title={item.url} href={item.url}>
					{progressMarker}
					<i className="braft-icon-file-text"></i>
					<span>{item.name || item.url}</span>
					</a>
				)
				break 
			}

			let className = ['bf-item']
			item.selected && className.push('active')
			item.uploading && className.push('uploading')
			item.error && className.push('error')

			return (
				<li
					key={index}
					
					title={item.name}
					data-index={index}
					data-name={item.name}
					data-id={item.id}
					data-url={item.url}
					data-type={item.type}
					data-folder={item.folder||false}
					className={className.join(' ')}
					onClick={this.onItemClick.bind(this,item)}
				>
					<div 
						key={index}
						title={item.name}
						data-id={item.id}
						onClick={this.toggleSelectItem} 
						className='item_radio'
					>
					</div>
					{previewerComponents}
					<span data-id={item.id} onClick={this.removeItem} className="bf-item-remove braft-icon-close"></span>
					<span className="bf-item-title">{item.name}</span>
				</li>
			)

			})}
		</ul>
		)

	}
	
	toggleSelectItem = (event) => {
		
		event.stopPropagation()
		const itemId = event.currentTarget.dataset.id
		const item = this.controller.getMediaItem(itemId)

		if (!item) {
			return false
		}

		if (item.selected) {

			if (!this.props.onBeforeDeselect || this.props.onBeforeDeselect([item], this.controller.getItems()) !== false) {
				this.controller.deselectMediaItem(itemId)
				this.props.onDeselect && this.props.onDeselect([item], this.controller.getItems())
			}

			} else {

			if (!this.props.onBeforeSelect || this.props.onBeforeSelect([item], this.controller.getItems()) !== false) {
				this.controller.selectMediaItem(itemId)
				this.props.onSelect && this.props.onSelect([item], this.controller.getItems())
			}

		}

	}

	removeItem = (event) => {

		const itemId = event.currentTarget.dataset.id
		const item = this.controller.getMediaItem(itemId)

		if (!item) {
			return false
		}

		if (!this.props.onBeforeRemove || this.props.onBeforeRemove([item], this.controller.getItems()) !== false) {
			// this.controller.removeMediaItem(itemId)
			Modal.confirm({
				title:'确定删除吗',
				content:'',
				onOk:this.actionFile.bind(this,[item])
			})
			this.props.onRemove && this.props.onRemove([item], this.controller.getItems())
		}

		event.stopPropagation()

	}

	selectAllItems = () => {

		const allItems = this.controller.getItems()

		if (!this.props.onBeforeSelect || this.props.onBeforeSelect(allItems, allItems) !== false) {
			this.controller.selectAllItems()
			this.props.onSelect && this.props.onSelect(allItems, allItems)
		}

	}

	deselectAllItems = () => {

		const allItems = this.controller.getItems()

		if (!this.props.onBeforeDeselect || this.props.onBeforeDeselect(allItems, allItems) !== false) {
			this.controller.deselectAllItems()
			this.props.onDeselect && this.props.onDeselect(allItems, allItems)
		}

	}
	
	removeSelectedItems = () => {

		const selectedItems = this.controller.getSelectedItems()

		if (!this.props.onBeforeRemove || this.props.onBeforeRemove(selectedItems, this.controller.getItems()) !== false) {
			// this.controller.removeSelectedItems()
			Modal.confirm({
				title:'确定删除吗',
				content:'',
				onOk:this.actionFile.bind(this,selectedItems)
			})
			this.props.onRemove && this.props.onRemove(selectedItems, this.controller.getItems())
		}

	}

	handleDragLeave = (event) => {
		event.preventDefault()
		this.dragCounter --
		this.dragCounter === 0 && this.setState({
		draging: false
		})
	}

	handleDragDrop = (event) => {
		event.preventDefault()
		this.dragCounter = 0
		this.setState({ draging: false })
		this.reslovePickedFiles(event)
	}

	handleDragEnter = (event) => {
		event.preventDefault()
		this.dragCounter ++
		this.setState({ draging: true })
	}

	reslovePickedFiles = (event) => {
		console.log(event)
		const that = this
		// event.persist()

		let { files } = event.type === 'drop' ? event.dataTransfer : event.target

		if (this.props.onFileSelect) {
			const result = this.props.onFileSelect(files)
			if (result === false) {
				return false
			} else if (result instanceof FileList || result instanceof Array) {
				files = result
			}
		}

		// const accepts = {
		// ...defaultAccepts,
		// ...this.props.accepts
		// }
		this.setState({ loading:true })
		this.controller.resolveFiles({
			length: event.target.files.length,
			files: event.target.files,
			onItemReady: (item,index) =>{ 
				this.setFile(item,index)
				// this.controller.selectMediaItem(item.id)
			},
			onAllReady: () => {
				event.target.value = null
			}
		}, 0, defaultAccepts)

	}

	inputExternal = (event) => {
		this.setState({
		external: {
			...this.state.external,
			url: event.target.value
		}
		})
	}

	switchExternalType = (event) => {
		this.setState({
		external: { ...this.state.external, type: event.target.dataset.type }
		})
	}

	confirmAddExternal = (event) => {

		if (event.target.nodeName.toLowerCase() === 'button' || event.keyCode === 13) {

		let { url, type } = this.state.external
		url = url.split('|')
		let name = url.length > 1 ? url[0] : this.props.language.unnamedItem
		url = url.length > 1 ? url[1] : url[0]
		let thumbnail = type === 'IMAGE' ? url : null

		this.controller.addItems([{
			thumbnail, url, name, type,
			id: new Date().getTime() + '_' + UniqueIndex(),
			uploading: false,
			uploadProgress: 1,
			selected: true
		}])

		this.setState({
			showExternalForm: false,
			external: {
				url: '',
				type: 'IMAGE'
			}
		})

		}

	}

	toggleExternalForm = () => {
		this.setState({
		showExternalForm: !this.state.showExternalForm,
		})
	}

	cancelInsert = () => {
		this.props.onCancel && this.props.onCancel()
	}

	confirmInsert = () => {

		const selectedItems = this.controller.getSelectedItems()

		if (this.props.onBeforeInsert) {

		const filteredItems = this.props.onBeforeInsert(selectedItems)

		if (filteredItems && (filteredItems instanceof Array)) {
			this.controller.deselectAllItems()
			this.props.onInsert && this.props.onInsert(filteredItems)
		} else if (filteredItems !== false) {
			this.controller.deselectAllItems()
			this.props.onInsert && this.props.onInsert(selectedItems)
		}

		} else {
			this.controller.deselectAllItems()
			this.props.onInsert && this.props.onInsert(selectedItems)
		}

	}

}