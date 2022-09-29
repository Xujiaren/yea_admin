import React, { Component } from 'react';
import { Avatar,List,Icon,Upload,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio} from 'antd';
import _ from 'lodash'
import connectComponent from '../../util/connect';
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
            message.info('暂无权限')
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
            if(!url||url==''){ message.info('请上传图标');return; }

            let { ui,attr } = this.state
            ui[attr] = url
            this.props.actions.publishApplySetting({
                val:JSON.stringify(ui),section:'ui',keyy:'choose_field',
                resolved:(data)=>{
                    message.success('提交成功')
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
                
                <Card title="UI装修管理">
                    <Card type='inner' title='首页金刚区图标  尺寸：300x300'>
                        <div className='flex align_items' >
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['course']||''}/>
                                <div className='b_text'>视频课程</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'course')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['live']||''}/>
                                <div className='b_text'>直播</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'live')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['mall_icon']||''}/>
                                <div className='b_text'>严选商城</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'mall_icon')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['forum']||''}/>
                                <div className='b_text'>问吧</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'forum')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['pk']||''}/>
                                <div className='b_text'>PK赛场</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'pk')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['squad']||''}/>
                                <div className='b_text'>培训班</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'squad')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['forest']||''}/>
                                <div className='b_text'>完美林</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'forest')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['seminar']||''}/>
                                <div className='b_text'>研讨会</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'seminar')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['audio']||''}/>
                                <div className='b_text'>音频课程</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'audio')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['cate']||''}/>
                                <div className='b_text'>全部分类</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'cate')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['map']||''}/>
                                <div className='b_text'>学习地图</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'map')}>
                                    修改
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card type='inner' title='首页底部图标  尺寸：300x300' className='mt_10'>
                        <div className='flex align_items' >
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['index_dark']||''}/>
                                <div className='b_text'>首页灰色</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'index_dark')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['index_light']||''}/>
                                <div className='b_text'>首页高亮</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'index_light')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['discover_dark']||''}/>
                                <div className='b_text'>发现灰色</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'discover_dark')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['discover_light']||''}/>
                                <div className='b_text'>发现高亮</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'discover_light')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['study_dark']||''}/>
                                <div className='b_text'>学习灰色</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'study_dark')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['study_light']||''}/>
                                <div className='b_text'>学习高亮</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'study_light')}>
                                    修改
                                </div>
                            </div>
                            <div className='item' style={{padding:'20px',position:'relative'}}>
                                <Avatar shape="square" size={64} src={ui['my_dark']||''}/>
                                <div className='b_text'>我的灰色</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'my_dark')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['my_light']||''}/>
                                <div className='b_text'>我的高亮</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'my_light')}>
                                    修改
                                </div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card type='inner' title='商城底部图标  尺寸：300x300' className='mt_10'>
                        <div className='flex align_items' >
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['mall_dark']||''}/>
                                <div className='b_text'>首页灰色</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'mall_dark')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['mall_light']||''}/>
                                <div className='b_text'>首页高亮</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'mall_light')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['cate_dark']||''}/>
                                <div className='b_text'>分类灰色</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'cate_dark')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['cate_light']||''}/>
                                <div className='b_text'>分类高亮</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'cate_light')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['card_dark']||''}/>
                                <div className='b_text'>购物车灰色</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'card_dark')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['card_light']||''}/>
                                <div className='b_text'>购物车高亮</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'card_light')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['order_dark']||''}/>
                                <div className='b_text'>订单灰色</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'order_dark')}>
                                    修改
                                </div>
                            </div>
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['order_light']||''}/>
                                <div className='b_text'>订单高亮</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'order_light')}>
                                    修改
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card type='inner' title='个人中心背景自定义  尺寸：750x354' className='mt_10'>
                        <div className='flex align_items' >
                            <div className='item'>
                                <Avatar shape="square" size={64} src={ui['user_bg']||''}/>
                                <div className='b_text'>个人中心背景</div>
                                <div className='editBtn' onClick={this.editImg.bind(this,'user_bg')}>
                                    修改
                                </div>
                            </div>
                            
                        </div>
                    </Card>
                </Card>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showImgPanel:false})
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
					title="修改"
					visible={this.state.editPanel}
					okText="确定"
					cancelText="取消"
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
const LayoutComponent =UImanager;
const mapStateToProps = state => {
    return {
        tag_list:state.course.tag_list,
        user:state.site.user,
        rule:state.site.user.rule,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});