import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import {Divider,Table,Tag,List,Checkbox, Empty,Spin,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message, DatePicker} from 'antd';

import locale from 'antd/es/date-picker/locale/zh_CN';

import qrcode from '../../assets/img/code.jpg'
import debounce from 'lodash/debounce';

import config from '../../config/config';

importÂ connectComponentÂ fromÂ '../../util/connect';
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
                label:'æ '
            }]

            let tag_ids = []
            //æ ç­¾
            this.course_info.tagList.map((ele)=>{
                tag_ids.push(ele.tagId)
            })
            tag_ids = tag_ids.join(',')
            //æ ç­¾å±ç¤º
            if(this.course_info.tagList.length !== 0){
                this.course_info.tagList.map(ele=>{
                    selectValue.push({
                        key:ele.tagId,
                        label:ele.tagName
                    })

                })
            }
            //è®²å¸

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
                message.info('è¯·åä¿å­å¶ä»éé¡¹'); return null;
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
            message.info('è¯·åä¿å­å¶ä»éé¡¹'); return null;
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
                message.info('è¯·è¾å¥ä»·æ ¼')
                return null
            }
            if(typeof dataSource.find(item=>item.level===edit_level) !== 'undefined'){
                message.info('å½åç­çº§å·²å­å¨')
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
            message.info('è¯·è³å°ä¿çä¸ä¸ªéé¡¹')
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
        // å¨ç¼è¾å¨è·å¾ç¦ç¹æ¶æä¸ctrl+sä¼æ§è¡æ­¤æ¹æ³
        // ç¼è¾å¨åå®¹æäº¤å°æå¡ç«¯ä¹åï¼å¯ç´æ¥è°ç¨editorState.toHTML()æ¥è·åHTMLæ ¼å¼çåå®¹
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
            message.error('åªè½ä¸ä¼  mp3  m4a é³é¢æä»¶!');
            return;
        }

        let media_id = ''
        let size = ''
        let mediaList = fileList
        console.log(file)
        if(file.status == 'done'){
            media_id = file.response.data.videoId
            message.info('ä¸ä¼ æå')
            size = (file.size/1000000).toFixed(2)
            this.setState({
                size
            })
        }else if(file.status == 'error'){
            message.info('ä¸ä¼ å¤±è´¥')
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
                message.error('è·åé³é¢æ¶é¿ä¿¡æ¯åºéï¼è¯·éæ°ä¸ä¼ ')
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

        if(!course_name){ message.info('è¯·è¾å¥è¯¾ç¨åç§°'); return;}
        if(!summary){ message.info('è¯·è¾å¥è¯¾ç¨æè¦'); return;}
        // if(!teacher_id || teacher_id == 0){ message.info('è¯·éæ©è®²å¸'); return;}
       
        if(!course_img){ message.info('è¯·ä¸ä¼ ä¸»å¾'); return;}

        if(category_id == ''){ message.info('è¯·éæ©è¯¾ç¨åç±»'); return;}
        if(!ccategory_id){ message.info('è¯·éæ©è¯¾ç¨å­åç±»'); return false;}

        
        if(sort_order > 9999){ message.info('è¯¾ç¨æåºä¸è½å¤§äº9999'); return; }
        if(!sn){ message.info('è¯·è¾å¥è¯¾ç¨ç¼å·'); return;}

        if((pay_type==1||pay_type==3)&&!integral){
            message.info('è¯·è®¾ç½®éå¸ä»·æ ¼'); return false
        }
        if((pay_type==2||pay_type==3)&&!course_cash){
            message.info('è¯·è®¾ç½®ç°é'); return false
        }
        if(is_agent==1){
            if(tuser_tax>100){message.info({content:'èå¸ä½£éæ¯ä¾ä¸è½è¶è¿100'});return}
            if(vuser_tax>100){message.info({content:'è®¤è¯ä½£éæ¯ä¾ä¸è½è¶è¿100'});return}
            if(user_tax>100){message.info({content:'éè®¤è¯ä½£éæ¯ä¾ä¸è½è¶è¿100'});return}
        }
        // if(!content){ message.info('è¯·è¾å¥è¯¾ç¨è¯¦æ'); return;}

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
                    content:'æäº¤æå',
                    onClose:()=>{
                        this.setState({ publishLoading:false })
                        window.history.back()
                    }
                })
            },
            rejected:(data)=>{
                this.setState({ publishLoading:false })
                if(data.toString().indexOf('query did not return a unique result')>-1){
                    message.info('è¯¾ç¨ç¼å·å·²å­å¨ï¼è¯·éæ°è¾å¥')
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
                            content:'æäº¤æå',
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
            message.info("è¯·è¾å¥åå®¹åæäº¤");
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
                //message.success("æä½æå",interval)
            },
            rejected:(data)=>{
                message.error(data)
            }
        })

        
    }
    
    myUploadFn = (param) => {
        const {course_img} = this.state
        // console.log('param',param);
        const serverURL = config.api+'/site/upload';//upload æ¯æ¥å£å°å
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        let name = param.file.name
        const id = param.file.lastModified
        if(name.indexOf('.mp3')>-1)
            name = name.replace('.mp3','')


        const successFn = (response) => {
            // åè®¾æå¡ç«¯ç´æ¥è¿åæä»¶ä¸ä¼ åçå°å
            // ä¸ä¼ æååè°ç¨param.successå¹¶ä¼ å¥ä¸ä¼ åçæä»¶å°å
            console.log('response:  ', response);
            //console.log('xhr.responseText', xhr.responseText);
            const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
            param.success({
                url: JSON.parse(xhr.responseText).resultBody,
                meta: {
                    id: id,
                    title: name||'',
                    alt: name||'',
                    loop: false, // æå®é³è§é¢æ¯å¦å¾ªç¯æ­æ¾
                    autoPlay: false, // æå®é³è§é¢æ¯å¦èªå¨æ­æ¾
                    controls: true, // æå®é³è§é¢æ¯å¦æ¾ç¤ºæ§å¶æ 
                    poster: course_img==''?'':course_img, // æå®è§é¢æ­æ¾å¨çå°é¢
                    name: name||''
                }
            })
        };

        const progressFn = (event) => {
            param.progress(event.loaded / event.total * 100)

        };

        const errorFn = (response) => {
            param.error({
                msg: 'ä¸ä¼ åºéï¼è¯·éè¯'
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
              <div className="ant-upload-text">ä¸ä¼ å¾ç</div>
            </div>
        );
        const uploadBtnVideoRoll =(
            <div>
            <Icon type="plus" />
            <div className="ant-upload-text">ä¸ä¼ é³é¢</div>
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
                            <div className="ant-upload-text">ä¸ä¼ è§é¢</div>
                            </div>
                        )
                }else{
                    if(this.state.adVideoList.length>=1)
                        return null
                    else
                        return(
                            <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">ä¸ä¼ è§é¢</div>
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
            { label: 'ç´éå', value: '1' },
            { label: 'æå¡ä¸­å¿åå·¥', value: '3'},
            { label: 'æå¡ä¸­å¿è´è´£äºº', value: '4'},
            
            { label: 'ä¼æ é¡¾å®¢', value: '5' },
            { label: 'åçº§ç»ç', value: '6' },

            { label: 'ä¸­çº§ç»ç', value: '7' },
            { label: 'å®¢æ·æ»ç', value: '8' },
            { label: 'é«çº§å®¢æ·æ»ç', value: '9' },
            { label: 'èµæ·±å®¢æ·æ»çåä»¥ä¸', value: 'GG' },
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
                            course_id=='0'?'åå»ºé³é¢è¯¾ç¨':(view_mode?'é³é¢è¯¾ç¨è¯¦æ':'ç¼è¾é³é¢è¯¾ç¨')
                        }
                    >
                        <Row>
                            <Col xs="12">
                                
                                    <Card type='inner'>
                                        <Form {...formItemLayout}>
                                            <Form.Item label="è¯¾ç¨åç§°">
                                                <Input disabled={view_mode} onChange={(e)=>{
                                                    this.setState({course_name:e.target.value})
                                                }} className="m_w400" value={course_name}/>
                                            </Form.Item>
                                            <Form.Item label="æè¦">
                                                <TextArea disabled={view_mode} autoSize={{minRows:6}} value={summary} onChange={e=>{
                                                    let summary = e.target.value.replace(/\s+/g,'')
                                                    this.setState({summary})
                                                }} className="m_w400"/>
                                            </Form.Item>
                                            
                                            <Form.Item label="è®²å¸">
                                                <Select
                                                    disabled={view_mode}
                                                    showSearch
                                                    labelInValue
                                                    placeholder="æç´¢è®²å¸"
                                                    notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                                    filterOption={false}
                                                    onSearch={this.fetchTeacher}
                                                    onChange={this.onSelectTeacher}
                                                    style={{ width: '400px' }} 
                                                    value={this.state.selectTeacher}
                                                >
                                                    <Option key='0'>æ </Option>
                                                    {teacherData.map(d => (
                                                        <Option key={d.value}>{d.text}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="ä¸»å¾">
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
                                            <Form.Item label='æ¶é¿'>
                                                {this.course_info.duration}ç§
                                            </Form.Item>
                                            }
                                            {!this.state.view_mode?null:
                                            <Form.Item label='é³é¢å¤§å°'>
                                                {this.course_info.size}MB
                                            </Form.Item>
                                            } */}
                                            
                                            {/* <Form.Item label="ä¸ä¼ é³é¢">
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
                                                <span>åªä½ID ï¼{this.state.media_id}</span>
                                            </Form.Item> */}
                                            
                                            {/* <Form.Item label="è¯¾ç¨å½¢å¼">
                                                <Select className="m_w400"
                                                    disabled={view_mode}
                                                    value={this.state.isSeries}
                                                    onChange={val=>{
                                                        this.setState({
                                                            isSeries:val
                                                        })
                                                    }}
                                                >
                                                    <Option value={'0'}>åè¯¾</Option>
                                                    <Option value={'1'}>ç³»åè¯¾</Option>
                                                </Select>
                                            </Form.Item> */}
                                            {/* <Form.Item label='ç« èè®¾ç½®'>
                                                <Button onClick={()=>{
                                                    this.setState({ showChapter:true })
                                                }}>è®¾ç½®ç« è</Button>
                                            </Form.Item> */}
                                            <Form.Item label="è¯¾ç¨åç±»">
                                                <Select onChange={this._onCateChange} value={this.state.category_id}Â disabled={view_mode} className="m_w400">
                                                    {this.category_list.map((ele,index)=>(
                                                        <Option key={index+'cate'} value={ele.categoryId}>{ele.categoryName}</Option>
                                                    ))}
                                                </Select>
                                                <Select value={this.state.ccategory_id} className="m_w400" disabled={view_mode} onChange={val=>{
                                                    this.setState({ ccategory_id:val })
                                                }}>
                                                    <Option value={0}>æ </Option>
                                                    {this.state.second_category.map((ele,index)=>(
                                                        <Option key={index+'cate_se'} value={ele.categoryId}>{ele.categoryName}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="åå¸å¯¹è±¡">
                                                <PersonType disabled={view_mode} actions={this.props.actions} courseId={this.course_id} flag={this.state.flag} ref='personType'></PersonType>
                                            </Form.Item>
                                            <Form.Item label="æ ç­¾è®¾ç½®">
                                                <Input.Group compact>
                                                    <Select
                                                        disabled={view_mode}
                                                        mode="multiple"
                                                        labelInValue
                                                        value={selectValue}
                                                        placeholder="æç´¢æ ç­¾"
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
                                                    <Button disabled={view_mode} onClick={this.addTmp}>æ·»å </Button>
                                                </Input.Group>
                                            </Form.Item>
                                            
                                            <Form.Item label="æåº">
                                                <InputNumber disabled={view_mode} onChange={val=>{
                                                    if(val !== ''&&!isNaN(val)){
                                                        val = Math.round(val)
                                                        if(val<0) val=0
                                                        this.setState({sort_order:val})
                                                    }
                                                }} value={sort_order} min={0} max={9999}/>
                                            </Form.Item>
                                            <Form.Item label="è¯å¬æ¶é´">
                                        <InputNumber disabled={view_mode} value={this.state.free_chapter} onChange={val => {
                                                this.setState({ free_chapter: parseInt(val) })
                                            }} className="m_w400" />
                                        </Form.Item>
                                            <Form.Item label="è¯¾ç¨ç¼å·">
                                                <Input disabled={view_mode} value={this.state.sn} onChange={e=>{
                                                    this.setState({sn:e.target.value})
                                                }}  className="m_w400"/>
                                            </Form.Item>
                                            <Form.Item label="æ¯å¦ä¸æ¶">
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
                                            <Form.Item label="ä¸æ¶æ¶é´">
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
                                            <Form.Item label="æ¯å¦åé">
                                            <Switch disabled={view_mode} checked={this.state.can_bonus?true:false} onChange={(e)=>{
                                                if(e){
                                                    this.setState({ course_cash:'',integral:'',course_integral:'',pay_type:1 })
                                                    this.setState({can_bonus:1})
                                                }else{
                                                    this.setState({can_bonus:0})
                                                }
                                            }}/>
                                        </Form.Item>
                                            <Form.Item label="æ¯å¦éç¥">
                                                <SwitchCom tips="* å½éæ©è®²å¸åï¼å°ä¼åå³æ³¨æ­¤è®²å¸çç¨æ·æ¨éç³»ç»éç¥" value={this.state.notify} onChange={(notify)=>{ 
                                                    this.setState({ notify }) 
                                                    if(notify){
                                                        message.info({
                                                            content:'æç¤ºï¼æ¬æ¬¡ä¿®æ¹ææ·»å éç¥çè¯¾ç¨ä»éä¸æ¬¡ï¼å¦éåéç¥ï¼è¯·ä¿®æ¹æ¶ç»§ç»­ç¹å»æ­¤æé®ï¼'
                                                        })
                                                    }
                                                    }}></SwitchCom>
                                            </Form.Item>
                                            <Form.Item label="æ¯å¦åäº«">
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
                                        <Card type='inner' className='mt_10' title='å®ä»·'>
                                        <Form {...formItemLayout}>
                                        
                                            <Form.Item label="å®ä»·">
                                                åçº¿ä»·&nbsp;&nbsp;<InputNumber onChange={val=>this.setState({ market_price:parseInt(val) })} value={this.state.market_price} disabled={view_mode}/><br/>
                                                ææ¬ä»·&nbsp;&nbsp;<InputNumber onChange={val=>this.setState({ cost_price:parseInt(val) })} value={this.state.cost_price} disabled={view_mode}/>
                                            </Form.Item>
                                            {/* <Form.Item label='æ¨è¯¾'>
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
                                                    <Radio value={0}>å¦</Radio>
                                                    <Radio value={1}>æ¯</Radio>
                                                </Radio.Group>
                                                {this.state.is_agent?
                                                    <div>
                                                        èå¸ä½£éæ¯ä¾&nbsp;&nbsp;<InputNumber value={this.state.tuser_tax} onChange={tuser_tax=>this.setState({ tuser_tax })} disabled={view_mode}/><br/>
                                                        è®¤è¯ä½£éæ¯ä¾&nbsp;&nbsp;<InputNumber value={this.state.vuser_tax} onChange={vuser_tax=>this.setState({ vuser_tax })} placeholder='éå¯¹éå®ä»·çæ¯ä¾' style={{width:'150px'}} disabled={view_mode}/><br/>
                                                        éè®¤è¯ä½£éæ¯ä¾&nbsp;&nbsp;<InputNumber value={this.state.user_tax} onChange={user_tax=>this.setState({ user_tax })} placeholder='éå¯¹éå®ä»·çæ¯ä¾' style={{width:'150px'}} disabled={view_mode}/>
                                                    </div>
                                                :null}
                                            </Form.Item> */}
                                            <Form.Item label='åæ¢ç¨æ·ç­çº§'>
                                                <Select disabled={view_mode} value={this.state.ulevel} className='m_w400' onChange={e => this.setState({ ulevel: e })}>
                                                    <Select.Option value={0}>æ </Select.Option>
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
                                            <Form.Item label='åæ¢èå¸ç­çº§'>
                                                <Select disabled={view_mode} value={this.state.tlevel} className='m_w400' onChange={e => this.setState({ tlevel: e })}>
                                                    <Select.Option value={0}>æ </Select.Option>
                                                    <Select.Option value={1}>LV1</Select.Option>
                                                    <Select.Option value={2}>LV2</Select.Option>
                                                    <Select.Option value={3}>LV3</Select.Option>
                                                    <Select.Option value={4}>LV4</Select.Option>
                                                    <Select.Option value={7}>LV7</Select.Option>
                                                    <Select.Option value={8}>LV8</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="éå®ä»·ç±»å">
                                                <Radio.Group
                                                    value={this.state.pay_type}
                                                    onChange={e => {
                                                        console.log(e)
                                                        this.setState({ pay_type: e.target.value,course_cash:'',course_integral:'',integral:'' })
                                                    }}
                                                >
                                                    <Radio value={0}>åè´¹</Radio>
                                                    {/* <Radio value={2}>ç°é</Radio> */}
                                                    <Radio value={1}>éå¸</Radio>
                                                    {/* {
                                                        !this.state.can_bonus?
                                                        <Radio value={3}>ç°é+éå¸</Radio>
                                                        :null
                                                    } */}
                                                   
                                                </Radio.Group>
                                            </Form.Item>
                                            {this.state.pay_type == 0 ? null :
                                                <Form.Item label="éå®ä»·">
                                                    {this.state.pay_type == 2 || this.state.pay_type == 3 ?
                                                        <InputNumber
                                                            placeholder='è¾å¥ä»·æ ¼'
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
                                                            placeholder='è¾å¥éå¸'
                                                            style={{ minWidth: '120px' }}
                                                            onChange={(e) => {
                                                                this.setState({ course_integral:e,integral: e })
                                                            }}
                                                            value={integral}
                                                        />
                                                    :null}
                                                </Form.Item>
                                            }
                                            
                                            <Form.Item label='ä¼åé¶æ¢¯ä»·æ ¼'>
                                                <CoursePrice 
                                                    ref={ref=>this.course_price = ref}
                                                    value={this.state.level_integral}
                                                />
                                            </Form.Item>
                                            <Form.Item label="æçåæ¢">
                                                <Radio.Group
                                                    disabled
                                                    value={this.state.proType}
                                                    onChange={e=>{
                                                        this.setState({proType:e.target.value})
                                                    }}
                                                    defaultValue={0}
                                                >
                                                    <Radio value={0}>èå¸ç­çº§</Radio>
                                                    <Radio value={1}>ä¼åç­çº§</Radio>
                                                </Radio.Group><br/>
                                                <Select disabled defaultValue={0} className='m_w400'>
                                                    <Select.Option value={0}>{this.state.proType==0?'èå¸':'ä¼å'}ç­çº§LV0</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            {/*
                                            <Form.Item label="è¯å¬ç« è">
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
                                    {/*<Form.Item label="è¯¾ç¨è¯¦æ">
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
                                                * å«å¤å¤å¶çæå­åå®¹ï¼è¯·åæ¸é¤æ ·å¼ï¼åéæ°è®¾ç½®æå­æ ·å¼<br />
                                                * å¾çãè§é¢ãé³é¢ç­åªä½è¯·éè¿ä¸ä¼ æé®ä¸ä¼ <br />
                                                * è¯·ç¡®ä¿ç¼è¾æ¡çè§é¢ãé³é¢ææ¾ç¤ºæ­£å¸¸çé¾æ¥ãå¾çæ­£å¸¸æ¾ç¤ºï¼å¦åè¯·å é¤å¹¶éæ°ä¸ä¼ <br />
                                                * ä¸ä¼ çæä»¶ä¸­æä»¶åä¸è¦åå« ç¹æ®å­ç¬¦ ä»¥å ç©ºæ ¼ï¼å¦ååªä½å°ä¸è½æ­£å¸¸æ¾ç¤º<br />
                                            </p>
                                            
                                        
                                    </Form.Item>
                                    */}
                                    <Form.Item label="è¯¾ç¨è¯¦æ">
                                        <TextArea disabled={view_mode} autoSize={{minRows:6}} value={content} onChange={e=>{this.setState({content:e.target.value})}}/>
                                    </Form.Item>
                                    <Form.Item label="åå¸å¹³å°">
                                        <Radio.Group
                                            disabled={view_mode}
                                            value={this.state.plant}
                                            onChange={e => {
                                                this.setState({ plant: e.target.value })
                                            }}
                                        >
                                            <Radio disabled={view_mode} value={0}>å¨é¨</Radio>
                                            <Radio disabled={view_mode} value={1}>å¾®ä¿¡</Radio>
                                            <Radio disabled={view_mode} value={2}>APP</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button onClick={()=>{
                                            window.history.go(-1)
                                        }}>åæ¶</Button>&nbsp;
                                        {/*
                                        <Button type="primary" ghost onClick={()=>{this.setState({coursePreviewVisible:true})}}>é¢è§</Button>
                                        &nbsp;
                                        */}
                                        {view_mode?null:
                                        <Button onClick={this.state.publishLoading?null:this.onPublish} style={{minWidth:'64px'}} type="primary">{this.state.publishLoading?<Icon type="loading" style={{ fontSize: 24,color:'#fff' }} spin />:'æäº¤'}</Button>
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
                    okText="åå¸"
                    cancelText="åæ¶"
                >
                    <img className="block_center" alt="example" style={{ width: '40%' }} src={qrcode} />
                    <div className="text_center">æ«ç é¢è§</div>
                </Modal>
                
                <Modal
                    zIndex={6001}
                    width={800}
                    title='ç« èè®¾ç½®'
                    visible={this.state.showChapter}
                    closable={true}
                    maskClosable={true}
                    okText='ç¡®å®'
                    cancelText='åæ¶'
                    onCancel={()=>{
                        this.setState({ showChapter:false })
                    }}
                    bodyStyle={{ padding: "25px",paddingTop:'25px' }}
                >
                    <ChapterSetting></ChapterSetting>
                </Modal>
               
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{this.setState({ showImgPanel:false })}}>
                    <img alt="å¾çé¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}
constÂ LayoutComponentÂ =MediaEdit;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        category_list:state.course.category_list,
        course_info:state.course.course_info,
        user:state.site.user
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
