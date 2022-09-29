import React, { Component } from 'react';
import { Table } from 'reactstrap';
import {Card,Spin,Empty,Tag,Form,Modal,Checkbox,DatePicker,Menu, Dropdown, Icon, message,Input,Pagination, Select, Tooltip} from 'antd';
import connectComponent from '../../util/connect';
import moment from 'moment';
import _ from 'lodash'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {RangePicker} = DatePicker;
const { Search } = Input;
const InputGroup = Input.Group;
const {Option} = Select;
const flag_arg = {
    '1':'直销员',
    '2':'新用户',
    '3':'服务中心员工',
    '4':'店主',
    '5':'优惠顾客',
    '6':'初级经理',
    '7':'中级经理',
    '8':'客户总监',
    '9':'高级客户总监',
    'GG':'资深客户总监及以上'
}
const status_arg=[
    '待开始','进行中','已结束'
]
class AdManager extends Component {
    state = {
        edit:true,
        view:true,
        isAll:false,
        loading:true,
        selected_g:[],
        id_group:[],

        visible: false,
        showAdPreview:false,
        showImgPanel:false,

        adId:'',
        billboardName:'',
        fileUrl:'',
        content:'',
        pubTime:'',
        endTime:'',
        sortOrder:'',
        flag:[],
        link:'',
        status:'',
        export_loading:false,
        keyword:'',
    };


    billboard_list =[]
    page_total=0
    page_current=1
    page_size=10

    componentWillMount(){
        const {actions} = this.props
        const {search} = this.props.history.location
        let page =0

        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page+1
        }
        actions.getBill({
            keywords:this.state.keyword,
            page:page,
            pageSize:this.page_size,
            status:'-1',
            adId:this.state.adId
        })

        this._interval = setInterval(()=>{
            if(this.state.selected_g.length == 0)
            actions.getBill({
                keywords:this.state.keyword,
                page:this.page_current-1,
                pageSize:this.page_size,
                status:'-1',
                adId:this.state.adId
            })
        },10000)
        
    }
    componentWillUnmount(){
        clearInterval(this._interval)
    }
    componentWillReceiveProps(n_props){
        if(n_props.billboard_list !== this.props.billboard_list){

            this.billboard_list = n_props.billboard_list.data
            this.page_total=n_props.billboard_list.total
            this.page_current=n_props.billboard_list.page+1

            if(this.billboard_list.length == 0){
                //message.info('暂时没有数据')
            }else{
                let _id_tmp =[]
                
                this.billboard_list.map((ele,index)=>{
                    _id_tmp.push({id:ele.billboardId,checked:false})
                })
                this.setState({
                    id_group:_id_tmp,
                    isAll:false,
                    selected_g:[]
                })
            }
            this.setState({loading:false})
        }
    }

    _onCheckAll=()=>{

        this.setState(pre=>{
            let selected_g = []
            let id_group = pre.id_group

            let isAll =false
            if(pre.isAll){
                isAll =false
 
                id_group.map(ele=>{
                    ele.checked = false
                })

            }else{
                isAll =true
                id_group.map(ele=>{
                    selected_g.push(ele.id)
                    ele.checked = true
                })
            }
            return{
                isAll,
                selected_g,
                id_group
            }
        })

    }
    _onCheck(idx,e){
        const id = e.target['data-id']

        this.setState((pre)=>{
            let id_group = pre.id_group
            let selected_g =[]
            let tmp = []
            let isAll = false

            if(e.target.checked){
                id_group[idx].checked = true
                selected_g = [...pre.selected_g,id]
            }else{
                id_group[idx].checked = false
                tmp = pre.selected_g.filter((ele)=>(
                    ele !== id
                ))
                selected_g = tmp
            }

            return {
                id_group,
                selected_g,
                isAll
            }
            
        },()=>{
            let isAll = false
            if(this.state.selected_g.length == this.state.id_group.length)
                isAll = true
            this.setState({ isAll })
        })
      
    }
    onSearch = (val)=>{
        const {actions} = this.props
        this.setState({loading:true})
        actions.getBill({
            keywords:val,
            page:0,
            pageSize:this.page_size,
            status:'-1',
            adId:this.state.adId
        })
    }
    onSearchChange = (e)=>{
        this.setState({ keyword:e.target.value })
    }
    _onAdType = (val)=>{
        if(val == 0)
            val =''
        const {actions} = this.props
        actions.getBill({
            keywords:this.state.keyword,
            page:0,
            pageSize:this.page_size,
            status:'-1',
            adId:val
        })
        this.setState({ adId:val })
    }
    _onPage = (val)=>{
        const {actions} = this.props;
        let pathname = this.props.history.location.pathname

        this.props.history.replace(pathname+'?page='+val)
        actions.getBill({
            keywords:this.state.keyword,
            page:val-1,
            pageSize:this.page_size,
            status:'-1',
            adId:this.state.adId
        })
    }
    _onDeleteAll = ()=>{
		const {actions} = this.props
		const {selected_g} = this.state
		if(selected_g.length == 0){
			message.info('请选择要删除的广告');return;
		}
		actions.deleteBill({
			billboard_ids:selected_g.join(','),
			resolved:(data)=>{
				this.setState({
                    selected_g:[],
                    isAll:false
                })
				message.success('操作成功')
                actions.getBill({
                    keywords:this.state.keyword,
                    page:this.page_current-1,
                    pageSize:this.page_size,
                    status:'-1',
                    adId:this.state.adId
                })
			},
			rejected:(data)=>{
				message.error(data)
			}
		})
	}
    _onStatusBill(billboard_id,_status){
        console.log(billboard_id,_status)
        const {actions} = this.props
        let action ='status'
        let status= 'up'
        if(_status == '1')
            status ='down'

        actions.updateBill({
            action,
            billboard_id,
            status,
            resolved:(data)=>{
                message.success('操作成功')
                actions.getBill({
                    keywords:this.state.keyword,
                    page:this.page_current-1,
                    pageSize:this.page_size,
                    status:'-1',
                    adId:this.state.adId
                })
            },
            rejected:data=>{
                message.error(data)
            }
        })
    }
    updateBill(billboard_id,action){
        const {actions} = this.props
        actions.updateBill({
            action,
            billboard_id,
            resolved:(data)=>{
                message.success('操作成功')
                actions.getBill({
                    keywords:this.state.keyword,
                    page:this.page_current-1,
                    pageSize:this.page_size,
                    status:'-1',
                    adId:this.state.adId
                })
            },
            rejected:data=>{
                message.error(data)
            }
        })
    }
    showAdPreview(index){

        let {
            adId,
            billboardName,
            fileUrl,
            content,
            pubTime,
            beginTime,
            endTime,
            sortOrder,
            flag,
            link,
            status 
        } = this.billboard_list[index];

        if(flag){
            flag = flag.split('/')
            flag.pop()
            flag.shift()
        }else{

            flag = []
        }
        
        this.setState({
            adId,
            billboardName,
            fileUrl,
            content,
            pubTime,
            beginTime,
            endTime,
            sortOrder,
            flag,
            link,
            status,
            showAdPreview: true,
        });
    }
    hideAdPreview =()=>{
        this.setState({
            showAdPreview: false,
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    
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
    exportAdexcel = ()=>{
        this.setState({ export_loading:true })
        this.props.actions.exportAdexcel({
            resolved:(res)=>{
                console.log(res)
                if(res && typeof res === 'object' && 'address' in res){
                    message.success({
                        content:'导出成功',
                        onClose:()=>{
                            this.setState({ export_loading:false })
                            window.open('h'+res['address'],'_black')
                        }
                    })
                    
                }else{
                    this.setState({ export_loading:false })
                }
                
            },
            rejected:()=>{
                this.setState({ export_loading:false })
            }
        })
    }
    render() {
       
        const formItemLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };
        const adIdTpye = ['','首页轮播','首页弹窗','个人中心','商城轮播','','问吧','研讨会','启动页(图片)','启动页(视频)']
        return (
        <div className="animated fadeIn">
            <Card title={<>
                <Search
                    placeholder="关键词"
                    onSearch={this.onSearch}
                    onChange={this.onSearchChange}
                    value={this.state.keyword}
                    style={{ maxWidth: 200 }}
                />
                <Select defaultValue={0} onChange={this._onAdType} style={{ width: '95px'}}>
                    <Option value={0}>全部分类</Option>
                    <Option value={1}>首页轮播</Option>
                    <Option value={2}>首页弹窗</Option>
                    <Option value={3}>个人中心</Option>
                    <Option value={4}>商城轮播</Option>
                    <Option value={6}>问吧</Option>
                    <Option value={7}>研讨会</Option>
                    <Option value={8}>启动页（图片）</Option>
                </Select>
            </>}
            extra={
                <>
                    <Button value='ad/excel' onClick={this.exportAdexcel} loading={this.state.export_loading}>查看报表</Button>
                    <Button value='ad/add' onClick={()=>{
                        this.props.history.push('/web-manager/ad-manager/edit-ad/0')
                    }}>添加广告</Button>
                </>
            }
            >
                    <div className="pad_b10">
                        <Button  value='' onClick={this._onCheckAll} type="" size={'small'} className="">{this.state.isAll?'取消全选':'全选'}</Button>&nbsp;
                        
                        <Popconfirm
                            value='ad/del'
                            title="确定删除吗？"
                            onConfirm={this._onDeleteAll}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="" size={'small'} className="">删除</Button>
                        </Popconfirm>&nbsp;
                        {/*
                        <Popconfirm
                            title="确定上架吗？"
                            onConfirm={this.popConfirm.bind(this,"上架成功")}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="" size={'small'} className="">上架</Button>
                        </Popconfirm>&nbsp;
                        <Popconfirm
                            title="确定下架吗？"
                            onConfirm={this.popConfirm.bind(this,"下架成功")}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="danger" ghost size={'small'} className="">下架</Button>
                        </Popconfirm>
                        */}
                    </div>
                    <Table hover responsive size="sm">
                        <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>主图</th>
                            <th style={{minWidth:'90px'}}>广告位置</th>
                            <th>广告名称</th>
                            <th>内容摘要</th>
                            <th>上架时间</th>
                            <th>下架时间</th>
                            <th style={{minWidth:'110px'}}>排序（数值越大越靠前）</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.billboard_list.length==0?
                        <tr>
                            <td colSpan={11}>
                                {
                                    this.state.loading?<Spin size="small" className='animated fadeIn mt_20'/>:<Empty description="暂时没有数据" className="animated fadeIn"/>
                                }
                            </td>
                        </tr>
                        :
                        this.billboard_list.map((ele,index)=>
                            <tr key={ele.billboardId+'ad_msg'}>
                                <td>
                                    <Checkbox 
                                        data-id={ele.billboardId}
                                        onChange={this._onCheck.bind(this,index)}
                                        checked={this.state.id_group[index].checked}
                                    />
                                </td>
                                <td>{ele.billboardId}</td>
                                <td>
                                    <a>
                                        <img 
                                            onClick={this.showImgPanel.bind(this,ele.fileUrl)} 
                                            className="head-example-img" 
                                            src={ele.adId==9?'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg':ele.fileUrl}
                                        />
                                    </a>
                                </td>
                                <td>{adIdTpye[ele.adId]}</td>
                                <td>{ele.billboardName}</td>
                                <td>
                                    <div className="video_content">
                                        <Tooltip title={ele.content}>{ele.content}</Tooltip>
                                    </div>
                                </td>
                                <td>{moment.unix(ele.beginTime).format('YYYY-MM-DD HH:mm')}</td>
                                <td>{moment.unix(ele.endTime).format('YYYY-MM-DD HH:mm')}</td>
                                <td>{ele.sortOrder}</td>
                                <td>{status_arg[ele.status]}</td>
                                <td style={{width:'250px' }}>
                                    <div>
                                        {ele.status == 2?
                                        <Popconfirm 
                                            value='ad/status'
                                            title="请到修改页面设置上架时间后并提交"
                                            onConfirm={()=>{
                                                this.props.history.push("/web-manager/ad-manager/edit-ad/"+ele.billboardId)
                                            }}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <Button size={'small'} className='m_2'>上架</Button>
                                        </Popconfirm>
                                        :
                                        <Button 
                                            value='ad/status'
                                            onClick={this._onStatusBill.bind(this,ele.billboardId,ele.status)} 
                                            type={ele.status==1?"primary":''} 
                                            size={'small'}
                                            className='m_2'
                                        > 
                                            {ele.status==1?'下架':'上架'}
                                        </Button>
                                        }
                                        <Button 
                                            value='ad/view'
                                            onClick={this.showAdPreview.bind(this,index)} 
                                            type="primary" size={'small'}
                                            className='m_2'
                                        >
                                            预览
                                        </Button>
                                        <Button value='ad/edit' className='m_2' type="primary" size={'small'} onClick={()=>{
                                            this.props.history.push("/web-manager/ad-manager/edit-ad/"+ele.billboardId)
                                        }}>修改</Button>
                                        <Popconfirm
                                            value='ad/del'
                                            title="确定删除吗？"
                                            onConfirm={this.updateBill.bind(this,ele.billboardId,'delete')}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <Button className='m_2' type="danger" size={'small'}>删除</Button>
                                        </Popconfirm>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                    <Pagination showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper  pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />

            </Card>
            
            <Modal
                    title="推荐"
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    bodyStyle={{padding:"10px"}}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="推荐位置">
                        <Select defaultValue={0}>
                            <Select.Option value={0}>
                                专栏一
                            </Select.Option>
                            <Select.Option value={1}>
                                专栏二
                            </Select.Option>
                            <Select.Option value={2}>
                                专栏三
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal 
                    title="预览"            
                    visible={this.state.showAdPreview}
                    maskClosable={true}
                    onCancel={this.hideAdPreview}
                    onOk={this.hideAdPreview}
                    okText="确定"
                    cancelText="取消"
                    width={600}
            >
                <Form {...formItemLayout} className="ant-advanced-search-form">
                    <Form.Item label="广告位置">
                        {this.state.adId==0?'首页弹窗':'首页轮播'}
                    </Form.Item>
                    <Form.Item label="广告名称">
                        {this.state.billboardName}
                    </Form.Item>
                    <Form.Item label="主图">
                        <img 
                            className="head-example-img" 
                            src={this.state.fileUrl}
                        />
                    </Form.Item>
                    
                    <Form.Item label="摘要">
                        {this.state.content}
                    </Form.Item>
                    <Form.Item label="发布时间">
                        {moment.unix(this.state.pubTime).format('YYYY-MM-DD HH:mm')}
                    </Form.Item>
                    <Form.Item label="上架时间">
                        {moment.unix(this.state.beginTime).format('YYYY-MM-DD HH:mm')}
                    </Form.Item>
                    <Form.Item label="下架时间">
                        {moment.unix(this.state.endTime).format('YYYY-MM-DD HH:mm')}
                    </Form.Item>
                    <Form.Item label="优先级">
                        {this.state.sortOrder}
                    </Form.Item>
                    
                    <Form.Item label="目标用户">
                        {this.state.flag.length==0?<Tag>空</Tag>:null}
                        {this.state.flag.map(ele=>(
                            ele==''?null:<Tag key={ele+'ele'}>{flag_arg[ele]}</Tag>
                        ))}
                    </Form.Item>
                    <Form.Item label="跳转链接">
                        {this.state.link?this.state.link:'无'}
                    </Form.Item>
                    <Form.Item label="是否启用">
                       {this.state.status==1?'是':'否'}
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
        </div>
        );
    }
}

const LayoutComponent =AdManager;
const mapStateToProps = state => {
    return {
        billboard_list:state.ad.billboard_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});