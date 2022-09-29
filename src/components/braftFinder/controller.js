import { UniqueIndex } from './utils/base'
import { compressImage } from './utils/image'
import {myUploadFn} from '../MyUploadFn'

const defaultValidator = () => true

export default class BraftFinderController {

	constructor(props = {}) {
		this.items = props.items || []
		this.files = props.files || []
		this.file_route = []
		this.deep = 0
		this.uploadFn = myUploadFn
		this.validateFn = props.validator || defaultValidator

		this.changeListeners = []
	}

	updateFiles = (items) => {

		let current_folder = ''

		if (this.file_route.length > 0)
			current_folder = this.file_route[this.file_route.length - 1].name

		if (current_folder !== '') {
			let child = this.deepFiles(0, this.file_route, this.files, items)
			child = [...items]
		} else {
			this.files = [...items]
		}
	}
	deepFiles(start = 0, route, files, items) {
		console.log(route)
		console.log(files)
		console.log(items)
		console.log(start)
		let index = route[start].index
		if (start == route.length - 1) {
			if (items)
				files[index].child = items
			return files[index].child
		}
		console.log(index)
		console.log(files[index])
		console.log(files[index].child)

		this.deepFiles(++start, route, files[index].child, items)
	}
	getFiles = ({ route, name = '', index = 0, type }) => {

		if (name == '') {
			return this.files
		} else {
			if (route.length === 0)
				return this.files

			if (type == 'forward') {
				return this.items[index].child
			}
			return this.deepFiles(0, route, this.files) || []
		}
	}
	setFileRoute = ({ file_route }) => {
		this.file_route = file_route
		console.log(JSON.stringify(this.files))
	}
	getFileRoute = () => {
		return this.file_route
	}
	setProps = (props = {}) => {

		this.items = props.items || this.items || []
		this.files = props.files || this.files || []

		this.uploadFn = props.uploader
		this.validateFn = props.validator || defaultValidator

	}

	getMediaItem = (id) => {
		return this.items.find(item => item.id === id)
	}

	getSelectedItems = () => {
		return this.items.filter(item => item.selected)
	}

	getItems = () => {
		return this.items
	}

	addItems = (items) => {
		this.items = [...this.items, ...items.map(item => ({ ...item, id: item.id.toString() }))]
		this.applyChange()
		this.uploadItems()
	}

	setItems = (items) => {

		this.items = items.map(item => ({ ...item, id: item.id.toString() })) || []

		this.applyChange()
	}

	addMediaItem = (item) => {
		this.addItems([item])
	}



	selectMediaItem = (id) => {
		const item = this.getMediaItem(id)
		if (item && (item.uploading || item.error)) {
			return false
		}
		this.setMediaItemState(id, {
			selected: true
		})
	}

	selectAllItems = () => {
		this.items = this.items.filter(item => !item.error && !item.uploading).map(item => ({ ...item, selected: true }))
		this.applyChange()
	}

	deselectMediaItem = (id) => {
		this.setMediaItemState(id, {
			selected: false
		})
	}

	deselectAllItems = () => {
		this.items = this.items.map(item => ({ ...item, selected: false }))
		this.applyChange()
	}

	removeMediaItem = (id) => {
		this.items = this.items.filter(item => item.id !== id)
		this.applyChange()

		this.updateFiles(this.items)
	}

	removeItems = (ids = []) => {
		this.items = this.items.filter(item => !ids.includes(item.id))
		this.applyChange()
		this.updateFiles(this.items)
	}

	removeSelectedItems = () => {
		this.items = this.items.filter(item => !item.selected)
		this.applyChange()
		this.updateFiles(this.items)
	}

	removeErrorItems = () => {
		this.items = this.items.filter(item => !item.error)
		this.applyChange()
		this.updateFiles(this.items)
	}

	removeAllItems = () => {
		this.items = []
		this.applyChange()
		this.updateFiles(this.items)
	}

	setMediaItemState = (id, state) => {
		this.items = this.items.map(item => item.id === id ? { ...item, ...state } : item)
		this.applyChange()
		this.updateFiles(this.items)
	}

	reuploadErrorItems = () => {
		this.uploadItems(true)
	}

	uploadItems = (ignoreError = false) => {

		this.items.forEach((item, index) => {

			if (item.uploading || item.url) {
				return false
			}

			if (!ignoreError && item.error) {
				return false
			}

			if (item.type === 'IMAGE') {
				this.createThumbnail(item)
				this.uploadFn = this.uploadFn || this.createInlineImage
			} else if (!this.uploadFn) {
				this.setMediaItemState(item.id, { error: 1 })
				return false
			}

			this.setMediaItemState(item.id, {
				uploading: true,
				uploadProgress: 0,
				error: 0
			})

			var uploader = this.uploadFn({
				id: item.id,
				file: item.file,
				success: (res) => {
					this.handleUploadSuccess(item.id, res)
				},
				progress: (progress) => {
					this.setMediaItemState(item.id, {
						uploading: true,
						uploadProgress: progress
					})
				},
				error: (error) => {
					this.setMediaItemState(item.id, {
						uploading: false,
						error: 2
					})
				}
			})

			console.log(uploader)

		})

	}

	createThumbnail = ({ action, id, file }) => {

		compressImage(URL.createObjectURL(file), 226, 226).then((result) => {
			this.setMediaItemState(id, { thumbnail: result.url })
		})

	}

	createInlineImage = (param) => {

		compressImage(URL.createObjectURL(param.file), 1280, 800).then((result) => {
			param.success({ url: result.url })
		}).catch((error) => {
			param.error(error)
		})

	}

	handleUploadSuccess = (id, data) => {

		this.setMediaItemState(id, {
			...data,
			file: null,
			uploadProgress: 1,
			uploading: false,
			selected: false,
		})
		
		const item = this.getMediaItem(data.id || id)
		if(item && typeof item === 'object' && 'onReady' in item){
			item['onReady'](item)
		}
	}

	applyChange = () => {
		this.changeListeners.forEach(({ callback }) => callback(this.items))
	}

	uploadImage = (file, callback) => {

		const fileId = new Date().getTime() + '_' + UniqueIndex()

		this.addMediaItem({
			type: 'IMAGE',
			id: fileId,
			file: file,
			name: fileId,
			size: file.size,
			uploadProgress: 0,
			uploading: false,
			selected: false,
			error: 0,
			onReady: callback
		})

	}

	uploadImageRecursively = (files, callback, index = 0) => {

		if (files[index] && files[index].type.indexOf('image') > -1) {
			this.uploadImage(files[index], (image) => {
				callback && callback(image)
				index < files.length - 1 && this.uploadImageRecursively(files, callback, index + 1)
			})
		} else {
			index < files.length - 1 && this.uploadImageRecursively(files, callback, index + 1)
		}

	}

	addResolvedFiles = (param, index, accepts) => {
		let data = {
			id: new Date().getTime() + '_' + UniqueIndex(),
			file: param.files[index],
			name: param.files[index].name,
			size: param.files[index].size,
			uploadProgress: 0,
			uploading: false,
			selected: false,
			error: 0,
			onReady: (item) => {
				param.onItemReady && param.onItemReady(item,index)
			}
		}

		if (param.files[index].type.indexOf('image/') > -1 && accepts.image) {
			data.type = 'IMAGE'
		} else if (param.files[index].type.indexOf('video/') > -1 && accepts.video) {
			data.type = 'VIDEO'
		} else if (param.files[index].type.indexOf('audio/') > -1 && accepts.audio) {
			data.type = 'AUDIO'
		}

		this.addMediaItem(data)
		setTimeout(() => {
			this.resolveFiles(param, index + 1, accepts)
		}, 60)

	}

	resolveFiles = (param, index, accepts) => {
		console.log(index,param)
		if (index < param.files.length) {

			const validateResult = this.validateFn(param.files[index])

			if (validateResult instanceof Promise) {
				validateResult.then(() => {
					this.addResolvedFiles(param, index, accepts)
				})
			} else if (validateResult) {
				this.addResolvedFiles(param, index, accepts)
			}

		} else {
			//param.onAllReady && param.onAllReady()
		}

	}

	// resolvePastedFiles ({ clipboardData }, callback) {

	//   if (clipboardData && clipboardData.items && clipboardData.items[0].type.indexOf('image') > -1) {
	//     this.uploadImage(clipboardData.items[0].getAsFile(), callback)
	//   }

	// }

	onChange = (callback) => {

		const listenerId = UniqueIndex()

		this.changeListeners.push({
			id: listenerId,
			callback: callback
		})

		return listenerId

	}

	offChange = (listenerId) => {
		this.changeListeners = this.changeListeners.filter(({ id }) => id !== listenerId)
	}

}