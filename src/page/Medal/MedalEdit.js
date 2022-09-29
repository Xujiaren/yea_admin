import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
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
        if(!title){ message.info('请选择徽章名称');return false; }
        if(!condition){ message.info('请输入数量');return false; }
        if(condition.indexOf(',')==-1){
            if(isNaN(condition)){ message.info('请输入正确的数量');return false; }
            if(condition%1 !== 0){ message.info('数量请取整数');return false; }
            if(condition >10000 ){ message.info('数量不能大于10000');return false; }
        }
        if(medal_img==''){ message.info('请上传图片');return false; }
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
                    content:'提交成功',
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
                        subTitle={medal_id==0?'添加徽章':view_mode?'查看徽章':'修改徽章'}
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            <Form labelCol={{span:4}} wrapperCol={{span:18}}>
                                <Form.Item label="徽章名称">
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
                                <Form.Item label="等级">
                                    <Select className='m_w400' disabled={medal_id!==0} value={level} onChange={val=>{this.setState({level:val})}}>
                                       {this.level_map.map((ele)=>(
                                            <Select.Option disabled={ele<=new_level} value={ele} key={'level'+ele}>LV.{ele}</Select.Option>
                                       ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="描述" help='描述最多输入30个字符'>
                                    <Input.TextArea maxLength={30} autoSize={{minRows:2}} className='m_w400' value={this.state.description} onChange={e=>{ this.setState({ description:e.target.value }) }}></Input.TextArea>
                                </Form.Item>
                                <Form.Item label="满足条件" help={medal_id==0?'':this.state.content}>
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
                                    <Input disabled={view_mode||(this.state.condition.indexOf(',')>-1&&medal_id!==0)} style={{width:100}} placeholder='填写数量' value={this.state.condition} onChange={e=>this.setState({condition:e.target.value})}/>
                                </Form.Item>
                                <Form.Item label="上传图标">
                                    <AntdOssUpload
                                        actions={this.props.actions}
                                        ref={ref=>this.img = ref}
                                        value={this.state.iconList}
                                        accept="image/*"
                                        maxLength={1}
                                        disabled={view_mode}
                                        tip='上传图片'
                                        listType='picture-card'
                                    />
                                </Form.Item>
                                {/* <Form.Item label="选择本站优惠券">
                                    <Select disabled={true} defaultValue={0} className="m_w400" >
                                        <Select.Option value={0}>课程券，无门槛5元券</Select.Option>
                                        <Select.Option value={1}>商城券，无门槛5元券</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="选择油葱券">
                                    <Select disabled={true} defaultValue={0} className="m_w400" >
                                        <Select.Option value={0}>无 </Select.Option>
                                        <Select.Option value={1}>5元券</Select.Option>
                                        <Select.Option value={2}>2元券</Select.Option>
                                    </Select>
                                </Form.Item> */}
                            </Form>
                            <div className="flex f_row j_center">
                                <Button onClick={()=>{
                                    window.history.go(-1)
                                }}>取消</Button>&nbsp;
                                {view_mode?null:
                                    <Button loading={loading} onClick={this.onPublish} style={{minWidth:'64px'}} type="primary">提交</Button>
                                }
                            </div>
                        </Card>
                    </PageHeader>
                </Card>
                
                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = MedalEdit;
const mapStateToProps = state => {
    return {
        medal_list:state.user.medal_list,
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
