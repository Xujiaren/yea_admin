import React, { Component } from 'react';
import { Avatar,List,Icon,Upload,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio} from 'antd';
import _ from 'lodash'
importÂ connectComponentÂ fromÂ '../../util/connect';
import AntdOssUpload from '../../components/AntdOssUpload'
import {Button,Popconfirm} from '../../components/BtnComponent'
import './UImanager.scss'

class UImanager extends Component {
    state = {
            
        edit : true,
        view : true,
        visible: false,
        isView:false,
        title:'',

        status:0, 
        tag_id:'',
        tag_name:'',
        ttype:0,
        keyword:'',
        previewImage:'',
        showImgPanel:false,

        showEditPanel:false,
        showAddPanel:false,
        showViewPanel:false,

        attr:'',
        ui:{
            course:'',
            live:'',
            mall_icon:'',
            forum:'',
            pk:'',
            squad:'',
            index_light:'',
            index_dark:'',
            discover_light:'',
            discover_dark:'',
            study_light:'',
            study_dark:'',
            my_light:'',
            my_dark:'',
            mall_dark:'',
            mall_light:'',
            cate_dark:'',
            cate_light:'',
            card_light:'',
            card_dark:'',
            order_dark:'',
            order_light:'',
            user_bg:''
        },
        fileList:[],
        activeTab:'1',
        order:1,
        sub:false
    };
    tag_list = [1,2,3,4,5,6,7,8]
    page_total=0
    page_current=1
    page_size=12
  
    componentWillMount(){
       this.getSetting()
    }

    componentWillReceiveProps(n_props){
    }
    
    getSetting = ()=>{
        this.setState({ settingLoading:true })
        this.props.actions.getApplySetting({
            keyy:'choose_field',
            section:'ui',
            resolved:(data)=>{
                if(Array.isArray(data) && data['length'] > 0 && data[0]){
                if(data instanceof Array){
                    data.map(ele=>{
                        const {val} = ele
                        const ui = JSON.parse(val)
                        if(Object.keys(ui).indexOf('course')>-1){
                            this.setState({ ui,settingLoading:false })
                        }
                    })
                }}
                
            },
            rejected:(data)=>{
                this.setState({ settingLoading:false })
                message.error(JSON.stringify(data))
            }
        })
    }
    showImgPanel(url){
        this.setState({
            showImgPanel: true,
            previewImage:url
        });
    }
    hideImgPanel=()=>{
        this.setState({
            showImgPanel: false
        });
    }
    handlePreview = async file => {
        this.setState({
            previewImage: file.url || file.preview ||'',
            showImgPanel: true,
        });
    };
    editImg(attr){

        if(!this.props.rule.includes('ui/edit')){
            message.info('ææ æé')
            return;
        }
        const {ui} = this.state
        const fileList = [{ 
            uid:ui[attr]+Math.random().toString(),
            url:ui[attr],
            type:'image/png',
            status:'done'
        }]
        this.setState({
            fileList,
            editPanel:true,
            attr,
        })
    }
    _onOk = ()=>{
        if(this.img){
            const url = this.img.getValue()
            if(!url||url==''){ message.info('è¯·ä¸ä¼ å¾æ ');return; }

            let { ui,attr } = this.state
            ui[attr] = url
            this.props.actions.publishApplySetting({
                val:JSON.stringify(ui),section:'ui',keyy:'choose_field',
                resolved:(data)=>{
                    message.success('æäº¤æå')
                    this.getSetting()
                    this.setState({ settingPannel:false,editPanel:false},()=>{
                        
                    })
                },
                rejected:(data)=>{
                    message.error(JSON.stringify(data))
                }
            })
        }
    }
    render(){
        const { 
            ui
        } = this.state
        return(
            <div className="animated fadeIn">
                
                <Card title="UIè£ä¿®ç®¡ç">
                    <Card type='inner' title='é¦é¡µéååºå¾æ   å°ºå¯¸ï¼300x300'>
                        <div className='flex align_items' >
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['course']||''}/>
                                <div className='b_text'>è§é¢è¯¾ç¨</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'course')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['live']||''}/>
                                <div className='b_text'>ç´æ­</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'live')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['mall_icon']||''}/>
                                <div className='b_text'>ä¸¥éåå</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'mall_icon')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['forum']||''}/>
                                <div className='b_text'>é®å§</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'forum')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['pk']||''}/>
                                <div className='b_text'>PKèµåº</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'pk')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['squad']||''}/>
                                <div className='b_text'>å¹è®­ç­</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'squad')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['forest']||''}/>
                                <div className='b_text'>å®ç¾æ</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'forest')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['seminar']||''}/>
                                <div className='b_text'>ç è®¨ä¼</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'seminar')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['audio']||''}/>
                                <div className='b_text'>é³é¢è¯¾ç¨</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'audio')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['cate']||''}/>
                                <div className='b_text'>å¨é¨åç±»</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'cate')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['map']||''}/>
                                <div className='b_text'>å­¦ä¹ å°å¾</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'map')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card type='inner' title='é¦é¡µåºé¨å¾æ   å°ºå¯¸ï¼300x300' className='mt_10'>
                        <div className='flex align_items' >
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['index_dark']||''}/>
                                <div className='b_text'>é¦é¡µç°è²</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'index_dark')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['index_light']||''}/>
                                <div className='b_text'>é¦é¡µé«äº®</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'index_light')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['discover_dark']||''}/>
                                <div className='b_text'>åç°ç°è²</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'discover_dark')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['discover_light']||''}/>
                                <div className='b_text'>åç°é«äº®</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'discover_light')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['study_dark']||''}/>
                                <div className='b_text'>å­¦ä¹ ç°è²</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'study_dark')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['study_light']||''}/>
                                <div className='b_text'>å­¦ä¹ é«äº®</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'study_light')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item' style={{padding:'20px',position:'relative'}}>
                                <Avatar shape="square" size={64} src={ui['my_dark']||''}/>
                                <div className='b_text'>æçç°è²</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'my_dark')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['my_light']||''}/>
                                <div className='b_text'>æçé«äº®</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'my_light')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card type='inner' title='åååºé¨å¾æ   å°ºå¯¸ï¼300x300' className='mt_10'>
                        <div className='flex align_items' >
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['mall_dark']||''}/>
                                <div className='b_text'>é¦é¡µç°è²</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'mall_dark')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['mall_light']||''}/>
                                <div className='b_text'>é¦é¡µé«äº®</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'mall_light')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['cate_dark']||''}/>
                                <div className='b_text'>åç±»ç°è²</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'cate_dark')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['cate_light']||''}/>
                                <div className='b_text'>åç±»é«äº®</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'cate_light')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['card_dark']||''}/>
                                <div className='b_text'>è´­ç©è½¦ç°è²</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'card_dark')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['card_light']||''}/>
                                <div className='b_text'>è´­ç©è½¦é«äº®</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'card_light')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['order_dark']||''}/>
                                <div className='b_text'>è®¢åç°è²</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'order_dark')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['order_light']||''}/>
                                <div className='b_text'>è®¢åé«äº®</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'order_light')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card type='inner' title='ä¸ªäººä¸­å¿èæ¯èªå®ä¹  å°ºå¯¸ï¼750x354' className='mt_10'>
                        <div className='flex align_items' >
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['user_bg']||''}/>
                                <div className='b_text'>ä¸ªäººä¸­å¿èæ¯</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'user_bg')}>
                                    ä¿®æ¹
                                </div>
                            </div>
                            
                        </div>
                    </Card>
                </Card>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showImgPanel:false})
                }}>
                    <img alt="å¾çé¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
					title="ä¿®æ¹"
					visible={this.state.editPanel}
					okText="ç¡®å®"
					cancelText="åæ¶"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ editPanel:false })
                    }}
					onOk={this._onOk}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <AntdOssUpload
                        listType="picture-card"
                        value={this.state.fileList}
                        disable={this.state.view}
                        actions={this.props.actions}
                        ref={ref=>this.img = ref}
                        accept='image/*'
                    >
                    </AntdOssUpload>
                </Modal>
            </div>
        )
    }
}
constÂ LayoutComponentÂ =UImanager;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        tag_list:state.course.tag_list,
        user:state.site.user,
        rule:state.site.user.rule,
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});