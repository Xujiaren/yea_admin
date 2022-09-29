
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import { Card, Row,Col,Divider,Input,Empty,Modal,List, Avatar, message,Icon,Badge as AntdBadge,Dropdown,Menu,Button } from 'antd';
import { List as VList } from "react-virtualized";
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer'
import { CellMeasurerCache, CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer'
import Websocket from 'react-websocket';
import MD5 from 'crypto-js/md5'
import config from '../config/config'
import cookie from 'react-cookies'
import moment from 'moment'
import emoji from './emoji'
import connectComponent from '../util/connect';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgLoading: false,
            ws_url:'',
            msgItem:{},
            
            new_msg_count:0,
            showChat:false,
            msg_pool:[],
            chat_info:[],
            unread:0,
            ws_state:false,
            measureCache: new CellMeasurerCache({
                fixedWidth: true,
                minHeight: 60
            }),
            content: '',
        }
        this._onScroll = this._onScroll.bind(this)
    }
	

	static propTypes = {
		
	}
	static defaultProps = {

    }
    componentWillMount(){
       this.init()
    }
    componentDidMount(){
        this.interval = setTimeout(()=>{
            if(this.websocket&&this.state.ws_state){
                this.websocket.sendMessage(JSON.stringify({
                    mtype: 'ping',
                    content: ''
                }))
            }
        },5000)
    }
    componentWillUnmount(){
        if(this.interval){
            clearTimeout(this.interval)
        }
    }
    init = ()=>{
        const add_time = cookie.load('add_time')||''
        const now = cookie.load('now')||''

        if(!add_time||!now){
            message.info('消息服务器连接出错，请重新登录'); return;
        }
        this.props.actions.getAdminInfo({
            resolved:(data)=>{
                const {adminId,adminName} = data
                this.adminId = adminId
                this.adminName = adminName
                this.getMsg()
                const row = adminId.toString()+add_time.toString()+now.toString()
                const param = MD5(row)
                const ws_url = config.admin_ws+'/ws/chat/0?paramStr='+param+'&paramId='+adminId

                this.setState({ws_url})
            },
            rejeted:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    getMsg = ()=>{
        this.props.actions.getUserChat({
            resolved:(data)=>{
                let msg_pool = []
                let unread = 0
                data.data.map(ele=>{
                    const { 
                        lastMsg:content,
                        toUid:to_id,
                        updateTime,
                        userInfo,
                        chatId:chat_id,
                        fromUnread,
                    } = ele
                    unread += fromUnread
                    const time = moment.unix(updateTime).format('YYYY-MM-DD HH:mm')
                    msg_pool.push({
                        chat_id,
                        content,
                        to_id,
                        to_name:userInfo.nickName,
                        time,
                        avatar:userInfo.avatar
                    })
                })
                this.setState({msg_pool,unread})
             },
             rejected:(data)=>{
                 message.info(JSON.stringify(data))
             }
        })
    }
    _onMessage = (data)=>{
        const {current_top} = this.state
        const msg = JSON.parse(data)
        try {
            if(msg !== 'm_error'){
                if(msg['chat_id']==this.state.msgItem['chat_id']){
                    const {chat_info} = this.state
                    msg['pubTime'] = moment.unix(msg['pubTime']).format('YYYY-MM-DD HH:mm') 
                    //互动区消息滚动
                    // if(current_top === undefined)
                    //     this.setState((pre)=>{
                    //         return {new_msg_count:pre.new_msg_count+1}
                    //     })
                    this.setState({chat_info:[...chat_info,msg]})
                }else{
                    this.getMsg()
                }
            }
        } catch (error) {
            message.error(JSON.stringify(error))
        }
    }
    showChatInfo(item){
        this.setState({ loading:true })
        const {chat_id} = item
        this.props.actions.getUserChatInfo({
            chat_id: chat_id,
            page: 0,
            pageSize: 100000,
            resolved: (data)=>{
                let chat_info = []
                data.data.map(ele=>{
                    ele['avatar'] = item['avatar']
                    ele['pubTime'] = moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
                    ele['to_name'] = item['to_name']
                    ele['is_admin'] = ele.is_admin

                    chat_info =  [ele,...chat_info]
                })
                const measureCache = new CellMeasurerCache({
                    fixedWidth: true,
                    minHeight: 60
                })
                this.setState({ measureCache, chat_info,showChat:true,msgItem:item })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    _onReply = ()=>{
        console.log('hit')
        const { to_id, to_name, chat_id} = this.state.msgItem
        const {content} = this.state
        if(!to_id||!to_name){ message.info('选择回复对象出错'); return; }
        if(content==''){ message.info('请输入消息');return; }

        if(this.websocket&&this.state.ws_state){
            const time = Math.floor(Date.now()/1000)
            const msg = { "avatar":"","pubTime":time, "to_id": to_id, "chat_id": chat_id, "to_name": to_name, "from_id": this.adminId, "from_name": this.adminName, "mtype": 1, "is_admin": 1, "type": 1, "content": content }

            this.websocket.sendMessage(JSON.stringify(msg))
            this.setState({ content:'' })
        }
    }
    _onOpen = ()=>{
        console.log('onOpen')
        this.setState({ws_state:true})
    }
    _onClose = ()=>{
        console.log('onClose')
        this.setState({ws_state:false})
    }
    _onScroll({scrollTop,clientHeight,scrollHeight}){
        if(scrollTop === scrollHeight - clientHeight){
            this.setState({ new_msg_count: 0,current_top: scrollHeight - clientHeight })
        }else{
            this.setState({ current_top:undefined })
        }
    }
    _noRowsRenderer() {
        return <Empty className='mt_20'></Empty>;
    }
    _onPreviewImg(previewImg){
        let showImgPannel = true
        this.setState({ previewImg,showImgPannel })
    }
    icon = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1596179622481.png'
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
        parent,
      })=>{
        const {chat_info} = this.state
        const item = chat_info[index]
        return (
        <CellMeasurer cache={this.state.measureCache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        <div key={key} style={style}>
            <List.Item>
                <List.Item.Meta
                    avatar={
                        <Avatar size="small" src={item['is_admin']==1?this.icon:(item['avatar']||'')}></Avatar>
                    }
                    title={
                        <span>
                            <span href="#" style={{marginRight:'10px'}}>{item['is_admin']==1?'管理员':item['to_name']}</span>
                            <span style={{color:'#bcbcbc'}}>{item['pubTime']}</span>
                        </span>
                    }
                    description={item['mtype']==0?<div style={{width:120,height:90}}><img src={item['content']||''} onClick={this._onPreviewImg.bind(this, item['content']||'')} className='msg_img'/></div>:emoji.textToEmoji(item['content']).map(_ele=>{
                        if(_ele.msgType == 'emoji'){
                            return (<img src={_ele.msgImage} key={'emoji'+Math.random()*100} style={{width:'20px',height:'20px'}}></img>)
                        }
                        else{
                            return _ele.msgCont
                        }
                    })}
                />
                    
            </List.Item>
        </div>
        </CellMeasurer>
        )
    }
	render() {
        const {msg_pool,ws_url,chat_info} = this.state
        const menu = (
			<List
                bordered
				loading={this.state.msgLoading}
				itemLayout="horizontal"
				dataSource={this.state.msg_pool}
				renderItem={item => (
				<List.Item
                    onClick={this.showChatInfo.bind(this,item)}
                >
					<List.Item.Meta
						avatar={<Avatar src={item.avatar} />}
                        title={<a href="javascript:void(0)">{item.to_name?item.to_name:'暂无用户名'}<span className='pad_l5 be_l_gray fs_12'>{item.time}</span></a>}
						description={item['mtype']==0?'[图片消息]':emoji.textToEmoji(item['content']).map(_ele=>{
                            if(_ele.msgType == 'emoji'){
                                return (<img src={_ele.msgImage} key={'emoji'+Math.random()*100} style={{width:'20px',height:'20px'}}></img>)
                            }
                            else{
                                return _ele.msgCont
                            }
                        })}
					/>
				</List.Item>
				)}
			/>
        )
        const renderVlist = (<AutoSizer>
            {({ width, height }) => (
            <VList
                key={chat_info.length}
                width={width}
                height={height}
                
                rowCount={chat_info.length}
                onScroll={this._onScroll}
                scrollToIndex={chat_info.length-1}
                deferredMeasurementCache={this.state.measureCache}
                rowHeight={this.state.measureCache.rowHeight}
                scrollToAlignment='end'
                rowRenderer={this.rowRenderer}
                style={{
                    marginTop:'0',
                    padding:'0',
                    outlineStyle: 'none',
                }}
                noRowsRenderer={this._noRowsRenderer}
            >
            </VList>
            )}
        </AutoSizer>)
        return (
            <Card title={this.state.msgItem['to_name']||'消息'}>
                <Row>
                    <Col xs={2} sm={2} md={0}>
                        <div style={{height:'572px'}}>
                        <List
                            bordered={false}
                            loading={this.state.msgLoading}
                            itemLayout="horizontal"
                            dataSource={this.state.msg_pool}
                            renderItem={item => (
                            <List.Item
                                onClick={this.showChatInfo.bind(this,item)}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                />
                            </List.Item>
                            )}
                        />
                        </div>
                    </Col>
                    <Col xs={0} sm={0} md={6}>
                        <div style={{height:'572px'}}>
                        <List
                            bordered={false}
                            loading={this.state.msgLoading}
                            itemLayout="horizontal"
                            dataSource={this.state.msg_pool}
                            renderItem={item => (
                            <List.Item
                                onClick={this.showChatInfo.bind(this,item)}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<a>{item.to_name?item.to_name:'暂无用户名'}<span className='pad_l5 be_l_gray fs_12'>{item.time}</span></a>}
                                    description={item['content'].indexOf('https://')>-1?'[图片消息]':emoji.textToEmoji(item['content']).map(_ele=>{
                                        if(_ele.msgType == 'emoji'){
                                            return (<img src={_ele.msgImage} key={'emoji'+Math.random()*100} style={{width:'20px',height:'20px'}}></img>)
                                        }
                                        else{
                                            return _ele.msgCont
                                        }
                                    })}
                                />
                            </List.Item>
                            )}
                        />
                        </div>
                    </Col>
                    
                    <Col xs={22} sm={22} md={18}>
                        <div className='pad_l10 pad_r10'>
                        <div style={{width:'100%',height:'520px',position:'relative'}}>
                            {renderVlist}
                            {this.state.new_msg_count==0?null:
                            <div onClick={()=>{this.setState({current_top:0,new_msg_count:0})}}  className='msg_tips animated fadeIn fadeOut'>
                                <Icon type="double-left" rotate={-90} style={{marginRight:'5px',fontSize:'12px',color:'#83d3fd'}}/>
                                <span>{this.state.new_msg_count} 条新消息</span>
                                <Divider type="vertical"></Divider>
                                <Icon onClick={(e)=>{ e.stopPropagation();this.setState({new_msg_count:0}) }} type="close" style={{fontSize:'10px',color:'#b7b7b7'}}/>
                            </div>
                            }
                        </div>
                        {this.state.showChat?
                        <div className='flex' style={{alignItems:'start'}}>
                            <Input.TextArea autoSize={{minRows:1}} value={this.state.content} onChange={e=>{ this.setState({ content:e.target.value }) }}></Input.TextArea>
                            <Button onClick={this._onReply}>发送</Button>
                        </div>
                        :null}
                        </div>
                    </Col>
                </Row>
                <Modal zIndex={1000} visible={this.state.showImgPannel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({ showImgPannel:false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImg} />
                </Modal>
                {!this.state.ws_url?null:
                <Websocket
                    ref={(ref)=>{ this.websocket = ref }}
                    url={ws_url}
                    onMessage={this._onMessage}
                    onOpen={this._onOpen}
                    onClose={this._onClose}
                />
                }
                <style>
                {
                    style
                }
                </style>
            </Card>
        )
		return (
            <>
			<Dropdown
                overlay={menu} 
                placement="bottomCenter" 
                trigger={["click"]}
                onVisibleChange={(visible)=>{ this.setState({visible:visible}) }}
                visible={this.state.visible}
            >
                <a className="ant-dropdown-link" onClick={e =>{ 
                    e.preventDefault()
                }}>
                <AntdBadge dot={this.state.unread>0}>
                    <Icon style={{fontSize:16}} type="bell" />
                </AntdBadge>
                <span>消息</span>
                </a>
            </Dropdown>

            {!this.state.ws_url?null:
            <Websocket
                ref={(ref)=>{ this.websocket = ref }}
                url={ws_url}
                onMessage={this._onMessage}
                onOpen={this._onOpen}
                onClose={this._onClose}
            />
            }
            
            <Modal title={this.state.msgItem['to_name']||''} okText='发送' cancelText='取消' visible={this.state.showChat} onCancel={()=>{ this.setState({ showChat:false }) }} onOk={this._onReply} bodyStyle={{padding:'0 24px 10px 24px'}}>
                <div style={{width:'100%',height:'480px',position:'relative'}}>
                    <AutoSizer>
                        {({ width, height }) => (
                        <VList
                            width={width}
                            height={height}
                            
                            rowCount={chat_info.length}
                            onScroll={this._onScroll}
                            scrollToIndex={chat_info.length-1}
                            deferredMeasurementCache={this.state.measureCache}
                            rowHeight={this.state.measureCache.rowHeight}
                            scrollToAlignment='end'
                            rowRenderer={this.rowRenderer}
                            style={{
                                marginTop:'0',
                                padding:'0',
                                outlineStyle: 'none',
                            }}
                            noRowsRenderer={this._noRowsRenderer}
                        >
                        </VList>
                        )}
                    </AutoSizer>
                    {this.state.new_msg_count==0?null:
                    <div onClick={()=>{this.setState({current_top:0,new_msg_count:0})}}  className='msg_tips animated fadeIn fadeOut'>
                        <Icon type="double-left" rotate={-90} style={{marginRight:'5px',fontSize:'12px',color:'#83d3fd'}}/>
                        <span>{this.state.new_msg_count} 条新消息</span>
                        <Divider type="vertical"></Divider>
                        <Icon onClick={(e)=>{ e.stopPropagation();this.setState({new_msg_count:0}) }} type="close" style={{fontSize:'10px',color:'#b7b7b7'}}/>
                    </div>
                    }
                </div>
                <Input.TextArea  value={this.state.content} onChange={e=>{ this.setState({ content:e.target.value }) }}></Input.TextArea>
            </Modal>
            <Modal zIndex={1000} visible={this.state.showImgPannel} maskClosable={true} footer={null} onCancel={()=>{
                this.setState({ showImgPannel:false })
            }}>
                <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImg} />
            </Modal>
            <style>
            {
                style
            }
            </style>
            </>
        )
        
    }
    
}
const LayoutComponent = Chat;
const mapStateToProps = state => {
    return {
		user:state.site.user,
		todo_info:state.dashboard.todo_info
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});

const style = `
.ws_msg_wrap{
    width: 120px;
    height:90px;
}
.msg_img{
    box-shadow:0 0 8px 0px #b9b9b9;
    max-width:100%;
    max-height: 100%;
    display:block;
}
.arrow_icon{
    width:10px;
    height:10px;
}
.msg_tips{
    cursor: default;
    position: absolute;
    bottom: 10px;
    right: 25px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    color: #83d3fd;
    font-size: 12px;
    box-shadow: 0 0 2px #eaeaea;
    background: #fff;
    padding: 5px 15px;
}
`