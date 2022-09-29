import React, { Component } from 'react';
import { Col, Row ,Table} from 'reactstrap';
import { Modal,Form,Pagination,Select,Tabs,Card, DatePicker,Menu, Dropdown, Icon, message,Input, Empty} from 'antd';
import { Line , Pie } from 'react-chartjs-2';
import {Link} from 'react-router-dom';
import connectComponent from '../../../util/connect';
import moment from 'moment';
import config from '../../../config/config';
import locale from 'antd/es/date-picker/locale/zh_CN';
import _ from 'lodash'
import {Button,Popconfirm} from '../../../components/BtnComponent'

const { TabPane } = Tabs;
const { Search } = Input;
const {Option} = Select;
const msg_type=['商城订单提醒','新用户消息','返还用户消息','直播预约消息','优惠券过期消息','系统提醒','交互提醒'];
const push_type=['短信','微信','站内','锁屏'];

class MsgManager extends Component {

    state={
        edit : false,
        view : false,
    
        showPanel:false,
        begin_time:'',

        _beginTime:'',
        _msg_id:'',
        content:'',
        flag:'',
        link:'',
        message_id:'',
        p_intro:0,
        p_time:'',
        ptype:0,
        status:1,
        summary:'',
        title:'',
        loading:false,
        etype:'41'
    }
    msg_list = []
    page_total=0
    page_current=0
    page_size=10

    showPanel(index){
        const item = this.msg_list[index]
        this.setState({
            content:item.content,
            flag:item.flag,
            link:item.link,
            message_id:item.messageId,
            p_intro:item.pintro,

            ptype:item.ptype,
  
            summary:item.summary,
            title:item.title,
            showPanel:true,
            etype:item.etype,
            message_img:item.message_img
        })
    }
    hidePanel =()=>{
        this.setState({showPanel:false})
    }
    _onRePush = ()=>{
        let {
            etype,message_img,flag,content,link,message_id,p_intro,p_time,ptype,status,summary,title
        } = this.state
        if(!p_time)
        {
            message.info('请选择推送时间')
            return
        }
        const {actions} = this.props
        actions.publishMsg({
            etype,message_img,flag,content,link,message_id,p_intro,p_time,ptype,status,summary,title,
            resolved:(data)=>{
                if(etype>40){
                    actions.SendRemind({
                        message_id:data.messageId,
                        resolved:(res)=>{
                            console.log(res)
                        },
                        rejected:(err)=>{
                            console.log(err)
                        }
                    })
                }
                this.hidePanel()
                message.success('操作成功')
                this.getMsg()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onPage = (val)=>{
        this.page_current = val-1
        this.getMsg()
    }
    componentDidMount(){
        this.getMsg()
    }

    componentWillReceiveProps(n_props){
        const { user } = n_props
        if(_.indexOf(user.rule, '*') >= 0||_.indexOf(user.rule, 'msg/view') >= 0){
            this.setState({ view:true })
        }
        if(_.indexOf(user.rule, '*') >= 0||_.indexOf(user.rule, 'msg/edit') >= 0){
            this.setState({ edit:true })
        }
        if(this.props.msg_list !== n_props.msg_list){
            if(n_props.msg_list.data.length == 0){
                message.info('暂时没有数据')
            }
            this.msg_list = n_props.msg_list.data
            this.page_total=n_props.msg_list.total
            this.page_current=n_props.msg_list.page
            this.setState({ loading:false })
        }
    }
    getMsg = ()=>{
        
        const {etype} = this.state
        const {actions} = this.props
        console.log(etype)
        actions.getMsg({
            keywords:'',
            page:this.page_current,
            etype:etype
        })
    }
    onDelete(id){
        const {actions} = this.props
        actions.updateMsg({
            action:'delete',
            message_id:id,
            resolved:(data)=>{
                message.success('操作成功')
                this.getMsg()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    onStatus(id){
        const {actions} = this.props
        actions.updateMsg({
            action:'status',
            message_id:id,
            resolved:(data)=>{
                message.success('操作成功')
                this.getMsg()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    disabledDate = (current)=>{
        return current < moment().subtract(1, 'day')
    }
    onPushTime = (val, dateString)=>{
        console.log(dateString)
        this.setState({
            p_time:dateString,
            _beginTime:moment(dateString,'YYYY-MM-DD HH:mm')
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        return (
        <div className="animated fadeIn">
            <Card title="消息管理" extra={
                <Button value='msg/add' onClick={()=>{
                    this.props.history.push('/web-manager/msg-manager/edit-msg/0/-1')
                }}>
                    添加消息
                </Button>
            } bodyStyle={{paddingTop:0}}>
                <Tabs activeKey={this.state.etype} onChange={(etype)=>{
                    this.page_current = 0
                    console.log(etype)
                    this.setState({ etype:etype,loading:true },()=>{
                        this.getMsg()
                    })
                }}>
                    <TabPane tab="课程通知" key="41">
                        
                    </TabPane>
                    <TabPane tab="油葱新鲜事" key="40">
                        
                    </TabPane>
                    <TabPane tab="系统通知" key="42">
                       
                    </TabPane>
                </Tabs>
                <Card loading={this.state.loading} bordered={false}>
                    <Table responsive size="sm" className="v_middle">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>标题</th>
                            <th>摘要</th>
                            <th>推送渠道</th>
                            <th>消息类型</th>
                            <th>推送时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.msg_list.length == 0?
                            <tr>
                                <td colSpan={8}><Empty className="mt_10" description='暂时没有数据'/></td>
                            </tr>
                        :this.msg_list.map((ele,index)=>
                            <tr key={index+'msg'}>
                                <td>{ele.messageId}</td>
                                <td>{ele.title}</td>
                                <td>{ele.summary}</td>
                                <td>{push_type[ele.ptype]}</td>
                                <td>{msg_type[ele.pintro]}</td>
                                <td>{moment.unix(ele.ptime).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td style={{width:'360px' }}>
                                    <div> 
                                        <Button value='msg/view' onClick={()=>{
                                            this.props.history.push('/web-manager/msg-manager/edit-msg/1/'+index)
                                        }} type="primary" size={'small'} className='m_2'>查看</Button>
                                        <Button value='msg/edit'  onClick={()=>{
                                            this.props.history.push('/web-manager/msg-manager/edit-msg/0/'+index)
                                        }} type="primary" size={'small'} className='m_2'>修改</Button>
                                        <Popconfirm
                                            value='msg/del' 
                                            title="确定删除吗？"
                                            onConfirm={this.onDelete.bind(this,ele.messageId)}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <Button type="danger" size={'small'} className='m_2'>删除</Button>
                                        </Popconfirm>&nbsp;
                                        {ele.ptype==0?null:
                                        <Button
                                            value='msg/dimiss' 
                                            className='m_2'
                                            onClick={this.onStatus.bind(this,ele.messageId)} 
                                            type="primary" 
                                            size={'small'}
                                            disabled={ele.status==0?true:false}
                                        >
                                            {ele.status==0?'已撤回':'撤回'}
                                        </Button>
                                        }
                                        {
                                            ele.status==0&&ele.ptype!==0?
                                            <Button  value='msg/push'  onClick={this.showPanel.bind(this,index)} size={'small'} type="primary" className='m_2'>推送</Button>
                                            :null
                                        }
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                    <Pagination showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper pageSize={this.page_size} current={this.page_current+1} onChange={this._onPage} total={this.page_total} />
                </Card>
            
            </Card>
            
            <Modal
                    title="选择推送时间"
                    visible={this.state.showPanel}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hidePanel}
                    onOk={this._onRePush}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="推送时间">
                            <DatePicker
                                disabledDate = {this.disabledDate}
                                format = {'YYYY-MM-DD HH:mm'}
                                placeholder="选择推送时间" 
                                onChange={this.onPushTime} 
                                
                                locale={locale}
                                showTime ={{format:'HH:mm'}}
                            />
                        </Form.Item>
                    </Form>
            </Modal>
        </div>
        );
    }
}
const LayoutComponent =MsgManager;
const mapStateToProps = state => {
    return {
        msg_list:state.ad.msg_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
