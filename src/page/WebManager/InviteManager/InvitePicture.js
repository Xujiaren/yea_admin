import React, { Component } from 'react';
import { Col, Row, } from 'reactstrap';
import {Card,Table,Empty,Form,Modal,Checkbox,DatePicker,Menu, Dropdown, Icon, message,Input,Pagination, Select, PageHeader} from 'antd';

import connectComponent from '../../../util/connect';
import _ from 'lodash'
import AntdOssUpload from '../../../components/AntdOssUpload'
import {Button,Popconfirm} from '../../../components/BtnComponent'

const { Search } = Input;

class InvitePicture extends Component {
    state = {
        edit : true,
        view : true,
        visible: false,
        showImgPanel:false,
        previewImage:''
    };
    data_list = []
    page_total=0
    page_current=1
    page_size=10


    componentDidMount(){
        this.getInvitePicture()
    }

    componentWillReceiveProps(n_props){
        if(n_props.invite_picture !== this.props.invite_picture){
            this.data_list = n_props.invite_picture.data
            this.page_total=n_props.invite_picture.total
            this.page_current=n_props.invite_picture.page+1
            console.log(this.invite_picture);
        }
    }
    getInvitePicture = ()=>{
        const {actions} = this.props
        const {keyword} = this.state
        actions.getInvitePicture({
            keyword,
            page:this.page_current-1
        })
    }
    setInvitePicture = ()=>{
        const {actions} = this.props
        const {gallery_id,name} = this.state

        const img_url = this.refs.iconUpload.getValue()
        if(img_url==''){ message.info('请上传图片');return; }

        actions.setInvitePicture({
            gallery_id,img_url,name,
            resolved:()=>{
                message.success('提交成功')
                this.setState({ visible:false })
                this.getInvitePicture()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }

    _onAction(gallery_id,action){
        const {actions} = this.props
        actions.actionInvitePicture({
            gallery_id,
            action,
            resolved:()=>{
                message.success('提交成功')
                this.getInvitePicture()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    onSearch = (val)=>{
        this.setState({keyword:val},()=>{
            this.page_current = 1
            this.getInvitePicture()
        })
    }
    _onPage=(val)=>{
        this.page_current = val
        this.getInvitePicture()
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
            <Card>
                <PageHeader
                    className="pad_0"
                    ghost={false}
                    onBack={() => window.history.back()}
                    title=""
                    subTitle={"邀请图片管理"}
                >
                    <div className="flex j_space_between align_items">
                        <Search
                                placeholder="关键词"
                                onSearch={this.onSearch}
                                style={{ maxWidth: 200 }}
                        />
                       <Button value='inviteImg/add' onClick={()=>this.setState({ isView:false,editTitle:'添加',gallery_id:0,visible:true,iconList:[],name:'' })}>
                           添加图片
                        </Button>
                    </div>
                    <Table
                        className="mt_10"
                        rowKey='galleryId'
                        columns={this.column}
                        
                        dataSource={this.data_list}
                        pagination={{
                            position: 'bottom',
                            current: this.page_current,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper:true,
                            onChange: this._onPage,
                            showTotal:(total)=>'总共'+total+'条'
                            }}
                    />
                </PageHeader>
            </Card>
            <Modal
                    zIndex={9}
                    title={this.state.editTitle}
                    visible={this.state.visible}
                    centered
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={()=>{ this.setState({ visible:false }) }}
                    bodyStyle={{ padding: "10px" }}
                    footer={this.state.isView ? null : <Button value='inviteImg/edit'  onClick={this.setInvitePicture} type='primary'>提交</Button>}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="分类名称">
                            <Input value={this.state.name} onChange={(e) => {
                                this.setState({ name: e.target.value })
                            }} disabled={this.state.isView ? true : false} />
                        </Form.Item>
                        <Form.Item label="分类图标">
                            <AntdOssUpload  actions={this.props.actions} ref='iconUpload' disabled={this.state.isView} accept='image/*' value={this.state.iconList}></AntdOssUpload>
                            <div style={{ marginTop: '-20px' }}>(640px * 1134px )</div>
                        </Form.Item>
                        {/*
                        <Form.Item label="是否启用">
                            <Switch checked={status == 1 ? true : false} disabled={this.state.isView} onChange={(checked) => {
                                if (checked)
                                    this.setState({ status: 1 })
                                else
                                    this.setState({ status: 0 })
                            }} disabled={this.state.isView ? true : false} />
                        </Form.Item>
                        */}
                    </Form>
                </Modal>
            <Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
        </div>
        );
    }
    column = [
        { title: 'ID', dataIndex: 'galleryId', key: 'galleryId',width: 100 },
        { title: '图片', dataIndex: 'link', key: 'link',render:(item,ele)=>(
            <a>
                <img onClick={this.showImgPanel.bind(this,ele.link)} className="head-example-img" src={ele.link}/>
            </a>
        )},
        { title: '名称', dataIndex: 'title', key: 'title', ellipsis:true},
        // { title: '分享次数', dataIndex: 'number', key: 'number',},
        // { title: '邀请成功', dataIndex: 'number', key: 'number1', },
        // { title: ' 累计奖励', dataIndex: 'orderSn', key: 'orderSn1',},
        { title: ' 操作', dataIndex: '', key: 'orderSn',render:(item,ele)=>(
            <>
                <Button value='inviteImg/view'  type="primary" ghost size={'small'} className='m_2' onClick={()=>{
                    const iconList = [{
                        
                        url:ele.link,
                        status:'done',
                        type:'image/png',
                        uid: Date.now() + 'uid'
                    }]
                    this.setState({ isView:true,editTitle:'查看',gallery_id:ele.galleryId,name:ele.title,visible:true,iconList:iconList,editTitle:'修改' })
                }}>查看</Button>
                <Button value='inviteImg/edit'  type="primary" size={'small'} className='m_2' onClick={()=>{
                    const iconList = [{
                        url:ele.link,
                        status:'done',
                        type:'image/png',
                        uid: Date.now() + 'uid'
                    }]
                    this.setState({   editTitle:'修改',isView:false,gallery_id:ele.galleryId,name:ele.title,visible:true,iconList:iconList,editTitle:'修改' })
                }}>修改</Button>
                <Popconfirm
                    value='inviteImg/del' 
                    title={"确定删除吗？"}
                    onConfirm={this._onAction.bind(this,ele.galleryId,'delete')}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="danger" className='m_2' size={'small'}>删除</Button>
                </Popconfirm>
            </>
        )},
    ]

}

const LayoutComponent =InvitePicture;
const mapStateToProps = state => {
    return {
        invite_picture:state.ad.invite_picture,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
