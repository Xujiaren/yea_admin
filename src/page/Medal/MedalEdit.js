import React,{ Component } from 'react';
importÂ connectComponentÂ fromÂ '../../util/connect';
import {InputNumber, message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input} from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';

class MedalEdit extends Component{
    state = {
        view_mode:false,
        medal_id: 0,
        medal_map:[],
        event_map:[],
        iconList:[],
        medal_id:0,
        level:1,
        medal_img:'',
        title:"",
        invent_name:'',
        condition:'',
        school_coupon_id:0,
        shop_coupon_id:0,
        content:'',
        new_level:0,
        description:'',
    }
    level_map = [1,2,3,4,5,6,7,8,9,10,11,12]

    componentWillMount(){
        const medal_id = parseInt(this.props.match.params['id']||0)

        if(medal_id!==0){
            this.props.actions.getMedal({medal_id})
        }
        if(this.props.match.path==='/member-manager/medal/view/:id'){
            this.setState({view_mode:true})
        }

        this.props.actions.getMedalEvent({
            resolved:(data)=>{
                console.log(data)
                if(data['length']){
                    this.setState({event_map:data})
                }
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    componentWillReceiveProps(n_props){
        if(n_props.medal_list !== this.props.medal_list){
            if(n_props.medal_list.data['length']&&n_props.medal_list.data['length']!==0){
                const {
                    medalId:medal_id,
                    level,
                    title,
                    inventName:invent_name,
                    condition:condition,
                    // school_coupon_id:school_coupon_id,
                    // shop_coupon_id:shop_coupon_id,
                    medalImg:medal_img,
                    content,
                    description,
                } = n_props.medal_list.data[0]
                const iconList = [{
                    uid:'dd',
                    status:'done',
                    type:'image/png',
                    url:medal_img,
                }]
                this.setState({
                    description,
                    content,
                    iconList,
                    medal_id,
                    level,
                    title,
                    invent_name,
                    condition,
                    // school_coupon_id,
                    // shop_coupon_id,
                })
            }
        }
    }
    onPublish =()=>{
        if(this._onPublish()===false){
            this.setState({loading:false})
        }
    }
    _onPublish = ()=>{
        this.setState({loading:true})
        
        const {
            medal_id,
            level,
            title,
            invent_name,
            condition,
            school_coupon_id,
            shop_coupon_id,
            description,
        } = this.state
        const medal_img = this.img? this.img.getValue() : ''
        console.log(medal_img)
        if(!title){ message.info('è¯·éæ©å¾½ç« åç§°');return false; }
        if(!condition){ message.info('è¯·è¾å¥æ°é');return false; }
        if(condition.indexOf(',')==-1){
            if(isNaN(condition)){ message.info('è¯·è¾å¥æ­£ç¡®çæ°é');return false; }
            if(condition%1 !== 0){ message.info('æ°éè¯·åæ´æ°');return false; }
            if(condition >10000 ){ message.info('æ°éä¸è½å¤§äº10000');return false; }
        }
        if(medal_img==''){ message.info('è¯·ä¸ä¼ å¾ç');return false; }
        this.props.actions.publishMedal({
            medal_id,
            level,
            title,
            invent_name,
            condition,
            school_coupon_id,
            shop_coupon_id,
            medal_img,
            description,
            resolved:(data)=>{
                message.success({
                    content:'æäº¤æå',
                    onClose:()=>{
                        window.history.back()
                        this.setState({loading:false})
                    }
                })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
                this.setState({loading:false})
            }
        })
    }
    render(){
        const {new_level,loading,view_mode,medal_id,medal_map,invent_name,level,event_map,title} = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={medal_id==0?'æ·»å å¾½ç« ':view_mode?'æ¥çå¾½ç« ':'ä¿®æ¹å¾½ç« '}
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            <Form labelCol={{span:4}} wrapperCol={{span:18}}>
                                <Form.Item label="å¾½ç« åç§°">
                                    <Select className='m_w400' disabled={medal_id!==0} value={title} onChange={(val,option)=>{
                                        console.log(option)
                                        this.setState({
                                            level:parseInt(option.props.item['newLevel'])+1,
                                            new_level:parseInt(option.props.item['newLevel']),
                                            title:val,invent_name:option.props.item['inventName']
                                        })
                                    }}>
                                        {event_map.map(ele=>(
                                            <Select.Option item={ele} value={ele.medalName} key={ele.medalName+'me'}>{ele.medalName}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ç­çº§">
                                    <Select className='m_w400' disabled={medal_id!==0} value={level} onChange={val=>{this.setState({level:val})}}>
                                       {this.level_map.map((ele)=>(
                                            <Select.Option disabled={ele<=new_level} value={ele} key={'level'+ele}>LV.{ele}</Select.Option>
                                       ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="æè¿°" help='æè¿°æå¤è¾å¥30ä¸ªå­ç¬¦'>
                                    <Input.TextArea maxLength={30} autoSize={{minRows:2}} className='m_w400' value={this.state.description} onChange={e=>{ this.setState({ description:e.target.value }) }}></Input.TextArea>
                                </Form.Item>
                                <Form.Item label="æ»¡è¶³æ¡ä»¶" help={medal_id==0?'':this.state.content}>
                                    <Select className='m_w400' disabled={medal_id!==0} value={invent_name} onChange={(val,option)=>{
                                        console.log(option)
                                        this.setState({
                                            level:parseInt(option.props.item['newLevel'])+1,
                                            new_level:parseInt(option.props.item['newLevel']),
                                            title:option.props.item['medalName'],
                                            invent_name:val
                                        })
                                    }}>
                                        {event_map.map(ele=>(
                                            <Select.Option value={ele.inventName} item={ele} key={ele.inventName+'in'}>{ele.inventName}</Select.Option>
                                        ))}
                                    </Select>&nbsp;
                                    <Input disabled={view_mode||(this.state.condition.indexOf(',')>-1&&medal_id!==0)} style={{width:100}} placeholder='å¡«åæ°é' value={this.state.condition} onChange={e=>this.setState({condition:e.target.value})}/>
                                </Form.Item>
                                <Form.Item label="ä¸ä¼ å¾æ ">
                                    <AntdOssUpload
                                        actions={this.props.actions}
                                        ref={ref=>this.img = ref}
                                        value={this.state.iconList}
                                        accept="image/*"
                                        maxLength={1}
                                        disabled={view_mode}
                                        tip='ä¸ä¼ å¾ç'
                                        listType='picture-card'
                                    />
                                </Form.Item>
                                {/* <Form.Item label="éæ©æ¬ç«ä¼æ å¸">
                                    <Select disabled={true} defaultValue={0} className="m_w400" >
                                        <Select.Option value={0}>è¯¾ç¨å¸ï¼æ é¨æ§5åå¸</Select.Option>
                                        <Select.Option value={1}>ååå¸ï¼æ é¨æ§5åå¸</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="éæ©æ²¹è±å¸">
                                    <Select disabled={true} defaultValue={0} className="m_w400" >
                                        <Select.Option value={0}>æ Â </Select.Option>
                                        <Select.Option value={1}>5åå¸</Select.Option>
                                        <Select.Option value={2}>2åå¸</Select.Option>
                                    </Select>
                                </Form.Item> */}
                            </Form>
                            <div className="flex f_row j_center">
                                <Button onClick={()=>{
                                    window.history.go(-1)
                                }}>åæ¶</Button>&nbsp;
                                {view_mode?null:
                                    <Button loading={loading} onClick={this.onPublish} style={{minWidth:'64px'}} type="primary">æäº¤</Button>
                                }
                            </div>
                        </Card>
                    </PageHeader>
                </Card>
                
                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="å¾çé¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}

constÂ LayoutComponentÂ = MedalEdit;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        medal_list:state.user.medal_list,
        user:state.site.user,
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
