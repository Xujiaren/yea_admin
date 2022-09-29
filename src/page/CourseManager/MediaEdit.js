import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import {Divider,Table,Tag,List,Checkbox, Empty,Spin,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message, DatePicker} from 'antd';

import locale from 'antd/es/date-picker/locale/zh_CN';

import qrcode from '../../assets/img/code.jpg'
import debounce from 'lodash/debounce';

import config from '../../config/config';

import connectComponent from '../../util/connect';
import ChapterSetting from './ChapterSetting'
import qs from 'qs';

// import BraftFinder from "braft-finder";
import BraftEditor from '../../components/braft-editor'
// import BraftFinder from "../../components/braft-finder";
import moment from 'moment';
import _ from 'lodash'
import * as courseService from '../../redux/service/course'
import customUpload from '../../components/customUpload'
import PersonType from '../../components/PersonType'
import SwitchCom from '../../components/SwitchCom'
import AntdOssUpload from '../../components/AntdOssUpload'
import CoursePrice from '../../components/CoursePrice'
import CourseGoods from '../../components/CourseGoods'

const {Option} = Select;
const {Search,TextArea} = Input;
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
    'media', 'separator',
    'clear'
]

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}



class MediaEdit extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchTag = debounce(this.fetchTag, 200);
        this.fetchTeacher = debounce(this.fetchTeacher, 200);
        this.input_value = ''
    }
    state = {
        view_mode:false,
        roll_mode:false,

        publishLoading:false,

        fileList:[],
        mediaList:[],

        showImgPanel:false,
        previewImage: '',
        editorState: BraftEditor.createEditorState(null),
        showTheBox:true,
        isVideoCourse:true,

        fetching:false,
        selectData:[],
        selectValue:[],
        checkValue:[],

        teacherFetching:false,
        selectTeacher:[],
        teacherData:[],
        second_category:[],

        ctype:1, 
        category_id:'',
        ccategory_id:'',
		content:'',
		course_id:'0',
		course_img:'',
		course_name:'',
		flag:'',
		integral:'',
		is_recomm:'',
        room_id:'',
        sn:'',
		sort_order:0,
		status:0,
		summary:'',
		tag_ids:'',
		teacher_id:'0',

        course_link:'',
        isSeries:'0',
        begin_time:'',
        end_time:'',
        BeginTime:0,
        EndTime:0,
        media_id:'',
        duration:'',
        size:'',
        can_share:0,

        sellType:1,
        
        dataSource:[
            {
                value:0,
                level:'',
            }
        ],
        edit_level:'LV1',
        edit_index:0,
        edit_value:'',

        linkList:[1],
        selectValue:[],
        selectValue1:[],

        flag_select:0,
        
        live_ad:[],
        live_goods:[],

        proType:0,
        notify:0,

        course_cash:"",
        pay_type:0,
        course_integral:'',
        plant:0,
        level_integral:'',
        is_agent:0,
        tuser_tax:0,
        vuser_tax:0,
        user_tax:0,
        tlevel:0,
        ulevel:0,
        cost_price: 0,
        market_price: 0,
        is_shop:0,
        can_bonus:0,
        shows:true,
        free_chapter:0,
        shelves_time:'',
        shelvesTime:null,
        stime:0
    };
    
    course_info = {liveStatus:0}
    category_list = []
    id = 0
    course_price = {
        getValue:()=>''
    }
    course_goods = {
        uploader:()=>false,
        publisher:()=>false
    }
    componentWillMount(){

        const {actions} = this.props
        actions.getCategory({
            keyword:'',
            page:0,
            pageSize:10000,
            cctype:'-1',
            ctype:'3',
            parent_id:'0'
        })

        this.fetchTeacher('')
        this.fetchTag('')

        const course_id = this.props.match.params.id+'';

        this.course_id = course_id

        let _state = this.props.location.state
        if( typeof _state === 'undefined'){
            _state = { type:'' }
        }else if(_state.type === 'view'){
            this.setState({ view_mode:true })
        }else if(_state.type === 'edit_roll'){
            this.setState({ roll_mode:true })
        }else if(_state.type === 'view_roll'){
            this.setState({ view_mode:true, roll_mode:true })
        }
        
        if(course_id !== '0'){
            actions.getCourseInfo(course_id)
            this.setState({ course_id })
        }

    }
    componentWillReceiveProps(n_props){

        if(n_props.category_list !==this.props.category_list){
            this.category_list = n_props.category_list.data
        }

        if(n_props.live_ad !== this.props.live_ad){
            console.log(n_props.live_ad)

            this.setState({ live_ad:n_props.live_ad })
        }
        if(n_props.live_goods !== this.props.live_goods){
            console.log(n_props.live_goods)

            this.setState({ live_goods:n_props.live_goods })

        }
        if(n_props.course_info !==this.props.course_info){
            this.course_info = n_props.course_info

            let editorState =  BraftEditor.createEditorState(this.course_info.content)||BraftEditor.createEditorState(null)
            console.log(this.course_info)

            let _course_img = []
            let fileList = []
            let selectValue = []
            let flag_select = 1
       
            let checkValue = []

            let teacher_id = 0
            let images = []
            let imgList = []

            let selectTeacher =[{
                key:'0',
                label:'无'
            }]

            let tag_ids = []
            //标签
            this.course_info.tagList.map((ele)=>{
                tag_ids.push(ele.tagId)
            })
            tag_ids = tag_ids.join(',')
            //标签展示
            if(this.course_info.tagList.length !== 0){
                this.course_info.tagList.map(ele=>{
                    selectValue.push({
                        key:ele.tagId,
                        label:ele.tagName
                    })

                })
            }
            //讲师

            if(this.course_info.teacherId){
                teacher_id = this.course_info.teacherId
                selectTeacher = [{
                    key:this.course_info.teacherId+'',
                    label:this.course_info.teacherName
                }]
            }

            if(this.course_info.flag){
                checkValue = this.course_info.flag.split('/')
                checkValue.pop()
                checkValue.shift()
            }
            
            
            if(this.course_info.courseImg){

                let imgs = this.course_info.courseImg.split(',')
                imgs.map((ele,idx)=>{
                    fileList.push({
                        response:{resultBody:ele},
                        uid:idx,
                        name:'img'+idx,
                        status:'done',
                        url:ele,
                        type:'image/png'
                    })
                })

            }
            if(this.course_info.galleryList.length !== 0){
                this.course_info.galleryList.map((ele,idx)=>{
                    
                    images.push(ele.link)
                    
                    imgList.push({
                        response:{resultBody:ele.link},
                        uid:idx,
                        name:'img'+idx,
                        status:'done',
                        url:ele.link,
                        type:'image/png'
                    })

                })

            }

            if(this.course_info.flag){
                checkValue = this.course_info.flag.split('/')
                checkValue.pop()
                checkValue.shift()
            }

            if(!this.course_info.flag)
                flag_select = 0
            else if(this.course_info.flag == '/2/')
                flag_select = 1
            else
                flag_select = 2

            let mediaList = []
            if(this.course_info.mediaId !== ''){
                mediaList = [{ type:'audio/mp3',status:'done',response:{resultBody:this.course_info.mediaId},uid:'dd',name:this.course_info.mediaId,url:'' }]
            }
            let time = ''
            let Tims = null
            if(this.course_info.shelvesTime){
                time = moment.unix(this.course_info.shelvesTime).format('YYYY-MM-DD HH:mm')
                Tims = moment(time)
            }

            this._getCategory(this.course_info.categoryId)

            let is_agent = 0,
            tuser_tax = 0,
            vuser_tax = 0,
            user_tax = 0
            const {
                tuserTax,
                vuserTax,
                userTax,
                isAgent,
                tlevel,
                ulevel,
                isShop:is_shop,
                costPrice: cost_price,
                marketPrice: market_price,
            } = this.course_info
            if(tuserTax&&vuserTax&&userTax&&isAgent){
                is_agent = isAgent
                tuser_tax = tuserTax
                vuser_tax = vuserTax
                user_tax = userTax
            }
            this.setState({
                is_shop,
                cost_price,
                market_price,
                tlevel,
                ulevel,
                is_agent,
                tuser_tax,
                vuser_tax,
                user_tax,
                level_integral: this.course_info.levelIntegral,
                integral:this.course_info.integral,
                course_integral:this.course_info.courseIntegral,
                course_cash:this.course_info.courseCash,
                pay_type:this.course_info.payType,

                mediaList:mediaList,
                ccategory_id:this.course_info.ccategoryId,
                ctype:this.course_info.ctype,
                media_id:this.course_info.mediaId,
                tag_ids:tag_ids,

                course_id:this.course_info.courseId,
                checkValue:checkValue,
                flag_select:flag_select,
                flag: this.course_info.flag,
                teacher_id:teacher_id,
                fileList: fileList,
                course_name: this.course_info.courseName,
                summary: this.course_info.summary,
                selectTeacher: selectTeacher,
                selectValue: selectValue,
                course_img: this.course_info.courseImg,
                category_id: this.course_info.categoryId,

                category_name: this.course_info.category_name,
                sort_order: this.course_info.sortOrder,
                score: this.course_info.score,
                status: this.course_info.status,
                sn: this.course_info.sn,
                content: this.course_info.content,
                isSeries:this.course_info.isSeries+'',
                ttype:this.course_info.ttype,
                images:images.join(','),
                editorState:editorState,
                imgList:imgList,

                can_share:this.course_info.canShare,
                plant:this.course_info.plant,
                can_bonus:this.course_info.isAgent,
                free_chapter:this.course_info.freeChapter,
                shelves_time:time,
                shelvesTime:Tims,
                stime:this.course_info.shelvesTime,
            })
        }
    }

    add = ()=>{
        this.setState(pre=>{
            let {dataSource,edit_level,edit_value,edit_index} = pre
            if(edit_index !== -1){
                message.info('请先保存其他选项'); return null;
            }
            dataSource.push({
                level:'LV1',
                value:''
            })
            return{
                dataSource,
                edit_index:dataSource.length-1,
                edit_level:'LV1',
                edit_value:''
            }
        })
    }
    edit(index){
        let {dataSource,edit_index} = this.state
        let edit_level = dataSource[index].level
        let edit_value = dataSource[index].value

        if(edit_index !== -1){
            message.info('请先保存其他选项'); return null;
        }
        dataSource[index].level = ''
        dataSource[index].value = ''

        this.setState({
            edit_value,
            edit_level,
            edit_index:index,
            dataSource
        })
    }
    save(index){
        this.setState(pre=>{
            let {edit_index,edit_level,edit_value,dataSource} = pre
            if(!edit_value){
                message.info('请输入价格')
                return null
            }
            if(typeof dataSource.find(item=>item.level===edit_level) !== 'undefined'){
                message.info('当前等级已存在')
                return null
            }

            dataSource[index].level = edit_level
            dataSource[index].value = edit_value

            return{
                dataSource,
                edit_index:-1
            }
        })
    }
    delete(index){
        if(this.state.dataSource.length<=1){
            message.info('请至少保留一个选项')
            return
        }
        this.setState(pre=>{
            let {dataSource} = pre
            dataSource = dataSource.filter((ele,idx)=>{
                return idx !== index
            })
            return{
                edit_index:-1,
                dataSource
            }
        })
    }
    fetchTeacher =value =>{
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ selectTeacher: [], teacherFetching: true });
        fetch(config.api+'/user/teacher/?keyword='+value, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		})
        .then(response => response.json())
        .then(body => {
            
            const {errorMsg} = body
            if(!errorMsg){
            const teacherData = body.resultBody.data.map(ele => ({
                text: `${ele.teacherName}`,
                value: ele.teacherId,
            }));
            this.setState({ teacherData, teacherFetching: false });
            }
        });
    }
    
    fetchTag = value => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ selectData: [], fetching: true });
        fetch(config.api+'/course/tag/?keyword='+value+'&page=0', {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		})
        .then(response => response.json())
        .then(body => {
            const {errorMsg} = body
            if(!errorMsg){
            const selectData = body.resultBody.data.map(ele => ({
                text: `${ele.tagName}`,
                value: ele.tagId,
            }));
            this.setState({ selectData, fetching: false });
            }
        });
    };
    onSelectTag = value => {
        this.setState({
            selectValue:value,
            fetching: false,
        });
    };
    onSelectTeacher = value => {
        this.setState({
            selectTeacher:value,
            teacherFetching: false,
            teacher_id:value.key
        });
    };
    onSelected = (value)=>{
        if(value == 2){
            this.setState({
                flag_select:2,
                flag:''
            })
        }else if(value == 1){
            this.setState({
                flag:'/2/',
                flag_select:1
            })
        }else{
            this.setState({
                flag:'',
                flag_select:0
            })
        }
        
    }
    onCourseSelected = (value) =>{
        if(value == 0){
            this.setState({
                isVideoCourse:true
            })
        }else{
            this.setState({
                isVideoCourse:false
            })
        }
    }
    submitContent = () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        this.setState({
            content:htmlContent
        })
    }
    handleEditorChange = (editorState) => {
        const content = editorState.toHTML()
        this.setState({ 
            editorState,
            content
        })
    }
    handleCancelModal = () => this.setState({ previewVisible: false });
    handleCancelCourse = () => this.setState({ coursePreviewVisible: false });
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }
    
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    
    beforeADVideoUpload(file) {
        const isMp4 = file.type === 'video/mp4'
        return isMp4;
    }
    beforeMediaUpload(file,fileList) {
        const isMedia = file.type === 'audio/mp3' || file.type === 'audio/x-m4a'||file.type === 'audio/mpeg'
        return isMedia;
    }
    beforeUpload(file) {
        const isImg = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/png';
        return isImg;
    }
    
    onCourseMediaChange = ({ file,fileList }) =>{
        console.log(file)
        const isMedia = file.type === 'audio/mp3' || file.type === 'audio/x-m4a' ||file.type === 'audio/mpeg'

        if(!isMedia){
            message.error('只能上传 mp3  m4a 音频文件!');
            return;
        }

        let media_id = ''
        let size = ''
        let mediaList = fileList
        console.log(file)
        if(file.status == 'done'){
            media_id = file.response.data.videoId
            message.info('上传成功')
            size = (file.size/1000000).toFixed(2)
            this.setState({
                size
            })
        }else if(file.status == 'error'){
            message.info('上传失败')
        }

        this.setState({
            mediaList,
            media_id
        })
    };
    
    onCheckBox = (val)=>{
        const checkValue = val
        const flag = '/'+val.join('/')+'/';
        this.setState({
            flag,
            checkValue
        })
    }

    _onCateChange = (val)=>{
        this.setState({category_id:val,ccategory_id:''})
        this._getCategory(val)
    }
    _getCategory = (parent_id)=>{
        courseService.getCategory({
            keyword:'',
            page:0,
            pageSize:100,
            cctype:'',
            ctype:'3',
            parent_id:parent_id
        }).then((data)=>{
            
            let second_category = []
            data.data.map((ele)=>{
                second_category.push({ categoryId:ele.categoryId,categoryName:ele.categoryName })
            })

            this.setState({ second_category })

        })
    }
    onPublish = ()=>{
        const {media_id} = this.state
        const {actions} = this.props

        

        if(media_id||media_id !== '')
        actions.mediaAction({
            video_id:media_id,
            action:'info',
            resolved:(data)=>{
                let duration = data.duration
                let size = data.size
                this.setState({ duration,size })
            },
            rejected:(data)=>{
                message.error('获取音频时长信息出错，请重新上传')
            }
        })
        setTimeout(()=>{
            this._onPublish()

        },1000)
    }
    _onPublish =()=>{

        let { 
            ctype, 
            category_id ,
            content,
            course_id,
         
            course_name,

            integral,
            is_recomm,
            room_id,
            sort_order,
            status,
            summary,
            teacher_id,
            sn,
            selectValue,
            isSeries,
            begin_time,
            end_time,
            media_id,
            ccategory_id,
            duration,
            size,

            live_ad,
            live_goods,
            can_share,
            notify,

            course_integral,
            course_cash,
            pay_type,
            plant,
            is_agent,
            tuser_tax,
            vuser_tax,
            user_tax,
            tlevel,
            ulevel,
            cost_price,
            market_price,
            is_shop,
            can_bonus,
            free_chapter,
            shelves_time
        } = this.state;
        let tag_ids = []
        selectValue.map(ele=>{
            tag_ids.push(ele.key)
        })

        const {actions} = this.props
        const flag = this.refs.personType.getValue()
        const that = this
        let course_img = ''
        if(this.img){
            course_img = this.img.getValue()
        }
        if(flag===null){
            return;
        }

        if(!course_name){ message.info('请输入课程名称'); return;}
        if(!summary){ message.info('请输入课程摘要'); return;}
        // if(!teacher_id || teacher_id == 0){ message.info('请选择讲师'); return;}
       
        if(!course_img){ message.info('请上传主图'); return;}

        if(category_id == ''){ message.info('请选择课程分类'); return;}
        if(!ccategory_id){ message.info('请选择课程子分类'); return false;}

        
        if(sort_order > 9999){ message.info('课程排序不能大于9999'); return; }
        if(!sn){ message.info('请输入课程编号'); return;}

        if((pay_type==1||pay_type==3)&&!integral){
            message.info('请设置金币价格'); return false
        }
        if((pay_type==2||pay_type==3)&&!course_cash){
            message.info('请设置现金'); return false
        }
        if(is_agent==1){
            if(tuser_tax>100){message.info({content:'老师佣金比例不能超过100'});return}
            if(vuser_tax>100){message.info({content:'认证佣金比例不能超过100'});return}
            if(user_tax>100){message.info({content:'非认证佣金比例不能超过100'});return}
        }
        // if(!content){ message.info('请输入课程详情'); return;}

        let level_integral = this.course_price.getValue()
        this.setState({ publishLoading:true })
        let times = shelves_time
        if(status==1){
            times=''
        }
        actions.publishCour({
            cost_price,
            market_price,
            level_integral,
            is_agent:can_bonus,
            tuser_tax,
            vuser_tax,
            user_tax,
            tlevel,
            ulevel,

            ctype, 
            category_id ,
            content,
            course_id,
            course_img,
            course_name,
            flag,
            integral,
            is_recomm,
            room_id,
            sort_order,
            status:1,
            summary,
            tag_ids:tag_ids.join(','),
            teacher_id,
            sn,
            is_series:isSeries,
            begin_time,
            end_time,
            media_id,
            ccategory_id,
            duration,
            size,
            can_share,
            notify,
            course_integral,
            course_cash,
            pay_type,
            plant,
            is_shop,
            can_bonus,
            free_chapter,
            shelves_time:times,
            resolved: async (data)=>{
                await this.course_goods.publisher(data.courseId)
                await this.course_goods.uploader(data.courseId)

                if(flag==='/I/')
                    that.refs.personType.uploadFile(data.courseId,this.props.actions,this)
                else
                message.success({
                    content:'提交成功',
                    onClose:()=>{
                        this.setState({ publishLoading:false })
                        window.history.back()
                    }
                })
            },
            rejected:(data)=>{
                this.setState({ publishLoading:false })
                if(data.toString().indexOf('query did not return a unique result')>-1){
                    message.info('课程编号已存在，请重新输入')
                }else{
                    message.error({
                        content:data
                    })
                }
                
            }
        })

    }
    _publishGoods(course_id){
        let {live_goods} = this.state
        const {actions} = this.props
        
        live_goods.map((ele,index)=>{

            let {
                goodsName:goods_name,
                goodsImg:goods_img,
                goodsPrice:goods_price,
                goodsLink:goods_link,
                sortOrder:sort_order,
                status:status
            } = ele
            let goods_id = 0
            actions.publishLiveGoods({
                goods_id, course_id, goods_name, goods_img, goods_price, goods_link, sort_order,status,
                resolved:()=>{
                    
                    if(index == live_goods.length -1)
                        message.success({
                            content:'提交成功',
                            onClose:()=>{
                                this.setState({ publishLoading:false })
                                window.history.back()
                            }
                        })

                },
                rejected:(data)=>{
                    message.error(data)
                }
            })
        })
    }
    onSearchTag = value=>{
        console.log(value)
        this.input_value = value;
        this.fetchTag(value);
    }
    addTmp = ()=>{
        if(!this.input_value){
            message.info("请输入内容再提交");
            return;
        }
        let {selectValue} = this.state;
        const {actions} = this.props
        actions.publishTag({
            tagName:this.input_value,
            resolved:(data)=>{
                
                let tag_ids = []
                selectValue.push({key:data.tagId,label:data.tagName});
                selectValue.map((ele)=>{
                    tag_ids.push(ele.tagId)
                })
                tag_ids = tag_ids.join(',')
                this.setState({ selectValue,tag_ids });
                this.input_value= ''
                //message.success("操作成功",interval)
            },
            rejected:(data)=>{
                message.error(data)
            }
        })

        
    }
    
    myUploadFn = (param) => {
        const {course_img} = this.state
        // console.log('param',param);
        const serverURL = config.api+'/site/upload';//upload 是接口地址
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        let name = param.file.name
        const id = param.file.lastModified
        if(name.indexOf('.mp3')>-1)
            name = name.replace('.mp3','')


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
                    title: name||'',
                    alt: name||'',
                    loop: false, // 指定音视频是否循环播放
                    autoPlay: false, // 指定音视频是否自动播放
                    controls: true, // 指定音视频是否显示控制栏
                    poster: course_img==''?'':course_img, // 指定视频播放器的封面
                    name: name||''
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

        fd.append('file', param.file);
        
        xhr.open('POST', serverURL, true);
        xhr.withCredentials = true;
        xhr.send(fd)
    };

    disabledDate = (current)=>{
        return current < moment().subtract(1, 'day')
    }

    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 20 },
            },
        };
        const adLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 16 },
            },
        };
        const uploadButtonImg = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadBtnVideoRoll =(
            <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传音频</div>
            </div>
        )
        const uploadBtnVideo =()=>{

                if(this.state.director_id==0){
                    if(this.state.adVideoList.length>=5)
                        return null
                    else
                        return(
                            <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">上传视频</div>
                            </div>
                        )
                }else{
                    if(this.state.adVideoList.length>=1)
                        return null
                    else
                        return(
                            <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">上传视频</div>
                            </div>
                        )
                }
        }
        const { 
            fetching, 
            selectData, 
            selectValue,
            checkValue,
            teacherFetching,
            selectTeacher,
            teacherData,
            
            ctype, 
            category_id ,
            content,
            course_id,
            course_img,
            course_name,
            integral,
            is_recomm,
            room_id,
            sort_order,
            status,
            summary,
            teacher_id,
            view_mode,
            can_share,
            course_cash,
        } = this.state;

        const options = [
            { label: '直销员', value: '1' },
            { label: '服务中心员工', value: '3'},
            { label: '服务中心负责人', value: '4'},
            
            { label: '优惠顾客', value: '5' },
            { label: '初级经理', value: '6' },

            { label: '中级经理', value: '7' },
            { label: '客户总监', value: '8' },
            { label: '高级客户总监', value: '9' },
            { label: '资深客户总监及以上', value: 'GG' },
        ];
        let time = new Date().getTime()
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={
                            course_id=='0'?'创建音频课程':(view_mode?'音频课程详情':'编辑音频课程')
                        }
                    >
                        <Row>
                            <Col xs="12">
                                
                                    <Card type='inner'>
                                        <Form {...formItemLayout}>
                                            <Form.Item label="课程名称">
                                                <Input disabled={view_mode} onChange={(e)=>{
                                                    this.setState({course_name:e.target.value})
                                                }} className="m_w400" value={course_name}/>
                                            </Form.Item>
                                            <Form.Item label="摘要">
                                                <TextArea disabled={view_mode} autoSize={{minRows:6}} value={summary} onChange={e=>{
                                                    let summary = e.target.value.replace(/\s+/g,'')
                                                    this.setState({summary})
                                                }} className="m_w400"/>
                                            </Form.Item>
                                            
                                            <Form.Item label="讲师">
                                                <Select
                                                    disabled={view_mode}
                                                    showSearch
                                                    labelInValue
                                                    placeholder="搜索讲师"
                                                    notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                                    filterOption={false}
                                                    onSearch={this.fetchTeacher}
                                                    onChange={this.onSelectTeacher}
                                                    style={{ width: '400px' }} 
                                                    value={this.state.selectTeacher}
                                                >
                                                    <Option key='0'>无</Option>
                                                    {teacherData.map(d => (
                                                        <Option key={d.value}>{d.text}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="主图">
                                                <AntdOssUpload
                                                    actions={this.props.actions}
                                                    disabled={view_mode}
                                                    listType="picture-card"
                                                    value={this.state.fileList}
                                                    accept="image/*"
                                                    ref={ref=>this.img = ref}
                                                >
                                                </AntdOssUpload>
                                                <span style={{marginTop:'-30px',display:'block'}}>(480px * 272px)</span>
                                            </Form.Item>
                                            {/* {!this.state.view_mode?null:
                                            <Form.Item label='时长'>
                                                {this.course_info.duration}秒
                                            </Form.Item>
                                            }
                                            {!this.state.view_mode?null:
                                            <Form.Item label='音频大小'>
                                                {this.course_info.size}MB
                                            </Form.Item>
                                            } */}
                                            
                                            {/* <Form.Item label="上传音频">
                                                <Upload
                                                        disabled={view_mode}
                                                        
                                                        listType="picture-card"
                                                        fileList={this.state.mediaList}
                                                        onChange={this.onCourseMediaChange}
                                                        beforeUpload={this.beforeMediaUpload}
                                                        customRequest={customUpload}
                                                >
                                                    {this.state.mediaList.length >= 1 ? null : uploadBtnVideoRoll}
                                                </Upload>
                                                <span>媒体ID ：{this.state.media_id}</span>
                                            </Form.Item> */}
                                            
                                            {/* <Form.Item label="课程形式">
                                                <Select className="m_w400"
                                                    disabled={view_mode}
                                                    value={this.state.isSeries}
                                                    onChange={val=>{
                                                        this.setState({
                                                            isSeries:val
                                                        })
                                                    }}
                                                >
                                                    <Option value={'0'}>单课</Option>
                                                    <Option value={'1'}>系列课</Option>
                                                </Select>
                                            </Form.Item> */}
                                            {/* <Form.Item label='章节设置'>
                                                <Button onClick={()=>{
                                                    this.setState({ showChapter:true })
                                                }}>设置章节</Button>
                                            </Form.Item> */}
                                            <Form.Item label="课程分类">
                                                <Select onChange={this._onCateChange} value={this.state.category_id} disabled={view_mode} className="m_w400">
                                                    {this.category_list.map((ele,index)=>(
                                                        <Option key={index+'cate'} value={ele.categoryId}>{ele.categoryName}</Option>
                                                    ))}
                                                </Select>
                                                <Select value={this.state.ccategory_id} className="m_w400" disabled={view_mode} onChange={val=>{
                                                    this.setState({ ccategory_id:val })
                                                }}>
                                                    <Option value={0}>无</Option>
                                                    {this.state.second_category.map((ele,index)=>(
                                                        <Option key={index+'cate_se'} value={ele.categoryId}>{ele.categoryName}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="发布对象">
                                                <PersonType disabled={view_mode} actions={this.props.actions} courseId={this.course_id} flag={this.state.flag} ref='personType'></PersonType>
                                            </Form.Item>
                                            <Form.Item label="标签设置">
                                                <Input.Group compact>
                                                    <Select
                                                        disabled={view_mode}
                                                        mode="multiple"
                                                        labelInValue
                                                        value={selectValue}
                                                        placeholder="搜索标签"
                                                        notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
                                                        filterOption={false}
                                                        onSearch={this.onSearchTag}
                                                        onChange={this.onSelectTag}
                                                        style={{ width: '338px' }}
                                                    >
                                                        {selectData.map(d => (
                                                            <Option key={d.value}>{d.text}</Option>
                                                        ))}
                                                    </Select>
                                                    <Button disabled={view_mode} onClick={this.addTmp}>添加</Button>
                                                </Input.Group>
                                            </Form.Item>
                                            
                                            <Form.Item label="排序">
                                                <InputNumber disabled={view_mode} onChange={val=>{
                                                    if(val !== ''&&!isNaN(val)){
                                                        val = Math.round(val)
                                                        if(val<0) val=0
                                                        this.setState({sort_order:val})
                                                    }
                                                }} value={sort_order} min={0} max={9999}/>
                                            </Form.Item>
                                            <Form.Item label="试听时间">
                                        <InputNumber disabled={view_mode} value={this.state.free_chapter} onChange={val => {
                                                this.setState({ free_chapter: parseInt(val) })
                                            }} className="m_w400" />
                                        </Form.Item>
                                            <Form.Item label="课程编号">
                                                <Input disabled={view_mode} value={this.state.sn} onChange={e=>{
                                                    this.setState({sn:e.target.value})
                                                }}  className="m_w400"/>
                                            </Form.Item>
                                            <Form.Item label="是否上架">
                                                <Switch disabled={view_mode} checked={status==1&&time>=this.state.stime*1000?true:false} onChange={(e)=>{
                                                    this.setState({
                                                        stime:0
                                                    })
                                                    if(e){
                                                        this.setState({status:1})
                                                    }else{
                                                        this.setState({status:0})
                                                    }
                                                }}/>
                                            </Form.Item>
                                             
                                        {
                                            this.state.status == 0 || time<=this.state.stime*1000?
                                            <Form.Item label="上架时间">
                                                <DatePicker
                                                    disabled={view_mode}
                                                    // disabledTime={this.disabledTime} 
                                                    format='YYYY-MM-DD HH:mm'
                                                    showTime={{ format: 'HH:mm' }}
                                                    allowClear={true}
                                                    value={this.state.shelvesTime}
                                                    // disabledDate = {this.disabledEndDate} 
                                                    locale={locale}
                                                    onChange={(date, dateString) => {
                                                        console.log(dateString)
                                                        this.setState({shelves_time: dateString,shelvesTime:date})
                                                    }}
                                                />
                                                </Form.Item>
                                                :null
                                        }
                                            <Form.Item label="是否分销">
                                            <Switch disabled={view_mode} checked={this.state.can_bonus?true:false} onChange={(e)=>{
                                                if(e){
                                                    this.setState({ course_cash:'',integral:'',course_integral:'',pay_type:1 })
                                                    this.setState({can_bonus:1})
                                                }else{
                                                    this.setState({can_bonus:0})
                                                }
                                            }}/>
                                        </Form.Item>
                                            <Form.Item label="是否通知">
                                                <SwitchCom tips="* 当选择讲师后，将会向关注此讲师的用户推送系统通知" value={this.state.notify} onChange={(notify)=>{ 
                                                    this.setState({ notify }) 
                                                    if(notify){
                                                        message.info({
                                                            content:'提示：本次修改或添加通知的课程仅限一次，如需再通知，请修改时继续点击此按钮！'
                                                        })
                                                    }
                                                    }}></SwitchCom>
                                            </Form.Item>
                                            <Form.Item label="是否分享">
                                                <Switch disabled={view_mode} checked={can_share==1?true:false} onChange={(e)=>{
                                                    if(e){
                                                        this.setState({can_share:1})
                                                    }else{
                                                        this.setState({can_share:0})
                                                    }
                                                }}/>
                                            </Form.Item>
                                            </Form>
                                        </Card>
                                        <Card type='inner' className='mt_10' title='定价'>
                                        <Form {...formItemLayout}>
                                        
                                            <Form.Item label="定价">
                                                划线价&nbsp;&nbsp;<InputNumber onChange={val=>this.setState({ market_price:parseInt(val) })} value={this.state.market_price} disabled={view_mode}/><br/>
                                                成本价&nbsp;&nbsp;<InputNumber onChange={val=>this.setState({ cost_price:parseInt(val) })} value={this.state.cost_price} disabled={view_mode}/>
                                            </Form.Item>
                                            {/* <Form.Item label='推课'>
                                                <Radio.Group
                                                    value={this.state.is_agent}
                                                    onChange={e=>{
                                                        this.setState({ is_agent:e.target.value,course_cash:'',integral:'',course_integral:'' })
                                                        if(e==1){
                                                            this.setState({
                                                                shows:false
                                                            })
                                                       }else{
                                                            this.setState({
                                                                shows:true
                                                            })
                                                       }
                                                    }}
                                                    disabled={view_mode}
                                                >
                                                    <Radio value={0}>否</Radio>
                                                    <Radio value={1}>是</Radio>
                                                </Radio.Group>
                                                {this.state.is_agent?
                                                    <div>
                                                        老师佣金比例&nbsp;&nbsp;<InputNumber value={this.state.tuser_tax} onChange={tuser_tax=>this.setState({ tuser_tax })} disabled={view_mode}/><br/>
                                                        认证佣金比例&nbsp;&nbsp;<InputNumber value={this.state.vuser_tax} onChange={vuser_tax=>this.setState({ vuser_tax })} placeholder='针对销售价的比例' style={{width:'150px'}} disabled={view_mode}/><br/>
                                                        非认证佣金比例&nbsp;&nbsp;<InputNumber value={this.state.user_tax} onChange={user_tax=>this.setState({ user_tax })} placeholder='针对销售价的比例' style={{width:'150px'}} disabled={view_mode}/>
                                                    </div>
                                                :null}
                                            </Form.Item> */}
                                            <Form.Item label='兑换用户等级'>
                                                <Select disabled={view_mode} value={this.state.ulevel} className='m_w400' onChange={e => this.setState({ ulevel: e })}>
                                                    <Select.Option value={0}>无</Select.Option>
                                                    <Select.Option value={1}>LV1</Select.Option>
                                                    <Select.Option value={2}>LV2</Select.Option>
                                                    <Select.Option value={3}>LV3</Select.Option>
                                                    <Select.Option value={4}>LV4</Select.Option>
                                                    <Select.Option value={5}>LV5</Select.Option>
                                                    <Select.Option value={6}>LV6</Select.Option>
                                                    <Select.Option value={7}>LV7</Select.Option>
                                                    <Select.Option value={8}>LV8</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label='兑换老师等级'>
                                                <Select disabled={view_mode} value={this.state.tlevel} className='m_w400' onChange={e => this.setState({ tlevel: e })}>
                                                    <Select.Option value={0}>无</Select.Option>
                                                    <Select.Option value={1}>LV1</Select.Option>
                                                    <Select.Option value={2}>LV2</Select.Option>
                                                    <Select.Option value={3}>LV3</Select.Option>
                                                    <Select.Option value={4}>LV4</Select.Option>
                                                    <Select.Option value={7}>LV7</Select.Option>
                                                    <Select.Option value={8}>LV8</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="销售价类型">
                                                <Radio.Group
                                                    value={this.state.pay_type}
                                                    onChange={e => {
                                                        console.log(e)
                                                        this.setState({ pay_type: e.target.value,course_cash:'',course_integral:'',integral:'' })
                                                    }}
                                                >
                                                    <Radio value={0}>免费</Radio>
                                                    {/* <Radio value={2}>现金</Radio> */}
                                                    <Radio value={1}>金币</Radio>
                                                    {/* {
                                                        !this.state.can_bonus?
                                                        <Radio value={3}>现金+金币</Radio>
                                                        :null
                                                    } */}
                                                   
                                                </Radio.Group>
                                            </Form.Item>
                                            {this.state.pay_type == 0 ? null :
                                                <Form.Item label="销售价">
                                                    {this.state.pay_type == 2 || this.state.pay_type == 3 ?
                                                        <InputNumber
                                                            placeholder='输入价格'
                                                            style={{ minWidth: '120px' }}
                                                            value={course_cash}
                                                            onChange={(e) => {
                                                                this.setState({ course_cash: e })
                                                            }}
                                                            min={0} max={800000}
                                                        />
                                                    :null}
                                                    {this.state.pay_type == 3 ? <span className='pad_l5 pad_r5'>+</span> : null}
                                                    {this.state.pay_type == 1 || this.state.pay_type == 3 ?
                                                        <InputNumber
                                                            min={0} max={800000}
                                                            placeholder='输入金币'
                                                            style={{ minWidth: '120px' }}
                                                            onChange={(e) => {
                                                                this.setState({ course_integral:e,integral: e })
                                                            }}
                                                            value={integral}
                                                        />
                                                    :null}
                                                </Form.Item>
                                            }
                                            
                                            <Form.Item label='会员阶梯价格'>
                                                <CoursePrice 
                                                    ref={ref=>this.course_price = ref}
                                                    value={this.state.level_integral}
                                                />
                                            </Form.Item>
                                            <Form.Item label="权益兑换">
                                                <Radio.Group
                                                    disabled
                                                    value={this.state.proType}
                                                    onChange={e=>{
                                                        this.setState({proType:e.target.value})
                                                    }}
                                                    defaultValue={0}
                                                >
                                                    <Radio value={0}>老师等级</Radio>
                                                    <Radio value={1}>会员等级</Radio>
                                                </Radio.Group><br/>
                                                <Select disabled defaultValue={0} className='m_w400'>
                                                    <Select.Option value={0}>{this.state.proType==0?'老师':'会员'}等级LV0</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            {/*
                                            <Form.Item label="试听章节">
                                                <Input value={this.state.sn} onChange={e=>{
                                                    this.setState({sn:e.target.value})
                                                }}  className="m_w400"/>
                                            </Form.Item>
                                            */}
                                        
                                    </Form>
                                    
                                </Card>
                                <CourseGoods
                                    disabled={view_mode}
                                    courseId={this.state.course_id}
                                    ref={ref=>this.course_goods = ref}
                                    isShop={this.state.is_shop}
                                    actions={this.props.actions}
                                    onShopChange={is_shop=>this.setState({ is_shop })}
                                />
                                <Card type='inner' className='mt_10'>
                                    <Form {...{
                                        labelCol: {
                                            xs: { span: 5 },
                                            sm: { span: 3 },
                                        },
                                        wrapperCol: {
                                            xs: { span: 12 },
                                            sm: { span: 18 },
                                        }
                                    }}>
                                    {/*<Form.Item label="课程详情">
                                        <BraftEditor
                                                readOnly={view_mode}
                                                style={{border:"1px solid #eaeaea"}}
                                                value={this.state.editorState}
                                                onChange={this.handleEditorChange}
                                                onSave={this.submitContent}
                                                contentStyle={{height:'400px'}}
                                                media={{uploadFn:myUploadFn}}
                                                controls={controls}
                                            />
                                            <p style={{color:"#ff7e7e",fontSize:'12px',lineHeight:'2'}}>
                                                * 别处复制的文字内容，请先清除样式，再重新设置文字样式<br />
                                                * 图片、视频、音频等媒体请通过上传按钮上传<br />
                                                * 请确保编辑框的视频、音频有显示正常的链接、图片正常显示，否则请删除并重新上传<br />
                                                * 上传的文件中文件名不要包含 特殊字符 以及 空格，否则媒体将不能正常显示<br />
                                            </p>
                                            
                                        
                                    </Form.Item>
                                    */}
                                    <Form.Item label="课程详情">
                                        <TextArea disabled={view_mode} autoSize={{minRows:6}} value={content} onChange={e=>{this.setState({content:e.target.value})}}/>
                                    </Form.Item>
                                    <Form.Item label="发布平台">
                                        <Radio.Group
                                            disabled={view_mode}
                                            value={this.state.plant}
                                            onChange={e => {
                                                this.setState({ plant: e.target.value })
                                            }}
                                        >
                                            <Radio disabled={view_mode} value={0}>全部</Radio>
                                            <Radio disabled={view_mode} value={1}>微信</Radio>
                                            <Radio disabled={view_mode} value={2}>APP</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button onClick={()=>{
                                            window.history.go(-1)
                                        }}>取消</Button>&nbsp;
                                        {/*
                                        <Button type="primary" ghost onClick={()=>{this.setState({coursePreviewVisible:true})}}>预览</Button>
                                        &nbsp;
                                        */}
                                        {view_mode?null:
                                        <Button onClick={this.state.publishLoading?null:this.onPublish} style={{minWidth:'64px'}} type="primary">{this.state.publishLoading?<Icon type="loading" style={{ fontSize: 24,color:'#fff' }} spin />:'提交'}</Button>
                                        }
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal 
                    visible={this.state.coursePreviewVisible}
                    maskClosable={true}
                    onCancel={this.handleCancelCourse}
                    okText="发布"
                    cancelText="取消"
                >
                    <img className="block_center" alt="example" style={{ width: '40%' }} src={qrcode} />
                    <div className="text_center">扫码预览</div>
                </Modal>
                
                <Modal
                    zIndex={6001}
                    width={800}
                    title='章节设置'
                    visible={this.state.showChapter}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={()=>{
                        this.setState({ showChapter:false })
                    }}
                    bodyStyle={{ padding: "25px",paddingTop:'25px' }}
                >
                    <ChapterSetting></ChapterSetting>
                </Modal>
               
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{this.setState({ showImgPanel:false })}}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}
const LayoutComponent =MediaEdit;
const mapStateToProps = state => {
    return {
        category_list:state.course.category_list,
        course_info:state.course.course_info,
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
