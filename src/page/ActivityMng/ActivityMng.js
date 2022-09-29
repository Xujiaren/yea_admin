import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Popover,Tooltip,Table as TableAntd,List,Icon,Tabs,DatePicker,message,Pagination,Modal,Form,Card,Select ,Input, Radio} from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload'
import {Button,Popconfirm} from '../../components/BtnComponent'

const { TabPane } = Tabs;
const {RadioGroup} = Radio;
const {Option} = Select;
const {Search} = Input;
const {RangePicker} = DatePicker
function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class ActivityMng extends Component {
    state = {
            
        edit : true,
        view : true,
        visible: false,
        isView:false,
        title:'',

        status:0, 
        tag_id:'',
        tagName:'',
        ttype:0,
        keyword:'',
        previewImage:'',
        showImgPanel:false,

        showEditPanel:false,
        showAddPanel:false,
        showViewPanel:false,


        fileList:[],

       
        activeTab:'1',
        order:1,
        sub:false,

        activity_id:'-1',
        //2:主题活动  3:投票  4:问卷
        atype:'-1',
        keyword:'',
        status:'-1',
        activity_status:'-1',
        
        view_mode:false,
        result_list:[],

        img_list:[],
        activity_id:0,
        join_id:0,
        gallerId:0,
        imgPanel:false,
        ftype:0,
        showCheckPannels:false,
        workName:'',
        joinId:0,
        workIntro:'',
        ids:0
    };
    activity_list = []
    page_total=0
    page_current=1
    page_size=10

    componentWillMount(){
        const {search} = this.props.history.location
        if(search.indexOf('page=') > -1){
            this.page_current = search.split('=')[1]
        }
        this.getActivity()
    }

    componentWillReceiveProps(n_props){
        if(n_props.activity_list !==this.props.activity_list){
            if(n_props.activity_list.data.length == 0){
                // message.info('暂时没有数据')
            }
            this.activity_list = n_props.activity_list.data||[]
            this.page_total=n_props.activity_list.total
            this.page_current=n_props.activity_list.page+1
            
        }
        
    }
    getActivity = ()=>{
        const {
            
            atype,
            keyword,
            status,
            activity_status,
        } = this.state
        const {actions} = this.props
        const activity_id = 0
        actions.getActivity({
            activity_id,
            atype,
            keyword,
            status,
            activity_status,
            page:this.page_current-1,
            pageSize:this.page_size
        })
    }
    _onPage = (val)=>{
        this.page_current = val
        this.getActivity()
    }
    onActionActivityResult(activityId,joinId,galleryId,link,ftype){
        let img_list = []
        if(link != ''){
            img_list.push({
                uid:'uid',
                url: link,
                type: ftype == 1?'video/mp4':'image/png',
                status: 'done'
            })
        }
        this.setState({
            img_list,
            activity_id:activityId,
            join_id:joinId,
            gallerId:galleryId,
            imgPanel:true,
            ftype:ftype
        })
    }
    onActionImg = ()=>{
        const {activity_id,join_id,gallerId} = this.state
        const {actions} = this.props
        let gallery = ""
        if(this.img){
            gallery = this.img.getValue()||""
        }
        if(gallery == ""){
            message.info("请上传图片"); return;
        }
        actions.actionActivityResult({
            activity_id,join_id,gallery,gallerId,
            resolved:(res)=>{
                if(res == '上传成功')
                actions.getActivityResult({
                    activity_id,
                    resolved:(_res)=>{
                        const {data} = _res
                        if(Array.isArray(data)){
                            message.success('提交成功')
                            this.setState({
                                result_list:data,
                                imgPanel:false,
                                showImgPanel:false,
                            })
                        }
                    },
                    rejected:(data)=>{
                        message.error(JSON.stringify(data))
                    }
                })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    _onSearch = (val)=>{
        this.page_current=1
        this.setState({ keyword:val },()=>{ this.getActivity() })
    }
    
    
    showModal(txt,index){
        let is_view = false
        if(index !== 'add'){
            if(txt=="查看"){
                is_view =true
            }
            const tag_item = this.tag_list[index]

            this.setState({
                title:txt,
                isView: is_view,
                visible: true,
                status:tag_item.status, 
                tag_id:tag_item.tagId,
                tagName:'健康大调查',
                ttype:tag_item.ttype
            })  
        }else{
            this.setState({
                title:txt,
                isView: false,
                visible: true,
                
                status:0, 
                tag_id:'',
                tagName:'',
                ttype:0
            }) 
        }
    };
    handleCancel = () => {
        this.setState({
            visible: false, 
            tag_id:'',
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
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }
    
        this.setState({
            previewImage: file.url || file.preview,
            showImgPanel: true,
        });
    };
    edit(order,sub){
        this.setState({
            order,
            sub,
            showEditPanel:true,
        })
    }
    onCourseImgChange = ({file,fileList,event}) =>{

        let img = []
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                img.push(ele.response.resultBody)
            }
        })
        
        this.setState({
            fileList:fileList,
            course_img:img.join(',')
        })

    }
    showResult(ele){
        const {actions} = this.props
        const activity_id = ele.activityId
        actions.getActivityResult({
            activity_id,
            resolved:(data)=>{
                console.log(data)
                this.setState({ result_list:data.data,showCheckPannel:true,ids:activity_id })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
        
    }
    actionWork(type,join_id,activityId){
        const {actions} = this.props
        actions.passActivityWork({
            join_id,type,
            resolved:(data)=>{
                const activity_id = activityId
 
                message.success('提交成功')
                actions.getActivityResult({
                    activity_id,
                    resolved:(data)=>{
                        this.setState({ result_list:data.data })
                        console.log(data)
                    },
                    rejected:(data)=>{
                        message.error(data)
                    }
                })
            }
        })
    }
    _onAction(action,activity_id){
        const {actions} = this.props
        const that = this
        actions.actionActivity({
            action,activity_id,
            resolved:(data)=>{
                that.getActivity()
                message.success('提交成功')
               
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    onEditjoin=(val)=>{
        this.setState({
            joinId:val.joinId,
            workName:val.workName,
            workIntro:val.workIntro,
            showCheckPannels:true,
        })
    }
    onOkjion=()=>{
        const{joinId,workIntro,workName,ids}=this.state
        this.props.actions.actionActivityResult({
            join_id:joinId,
            work_intro:workIntro,
            work_name:workName,
            resolved:(res)=>{
                message.success({
                    content:'操作成功'
                })
                this.props.actions.getActivityResult({
                    activity_id:ids,
                    resolved:(data)=>{
                        console.log(data)
                        this.setState({ result_list:data.data,showCheckPannel:true })
                    },
                    rejected:(data)=>{
                        message.error(JSON.stringify(data))
                    }
                })
                this.setState({
                    showCheckPannels:false,
                    joinId:0,
                    workIntro:'',
                    workName:'',
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    render(){
        const { 
            view_mode,
            activity_status,
            atype,
        } = this.state

        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="活动管理">
                            <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Select value={activity_status} onChange={val=>{ this.setState({ activity_status:val }) }}>
                                        <Select.Option value={'-1'}>全部状态</Select.Option>
                                        <Select.Option value={0}>未开始</Select.Option>
                                        <Select.Option value={1}>进行中</Select.Option>
                                        <Select.Option value={2}>已结束</Select.Option>
                                    </Select>&nbsp;
                                    <Select value={atype} onChange={val=>{ this.setState({ atype:val }) }}>
                                        <Select.Option value={'-1'}>全部类型</Select.Option>
                                        <Select.Option value={3}>自发投票</Select.Option>
                                        <Select.Option value={4}>调查问卷</Select.Option>
                                        <Select.Option value={2}>主题活动</Select.Option>
                                    </Select>&nbsp;
                                    <Search
                                        placeholder=''
                                        onSearch={this._onSearch}
                                        onChange={e=>{ this.setState({keyword:e.target.value}) }}
                                        style={{ maxWidth: 200 }}
                                    />&nbsp;
                                    <Button onClick={()=>{this.page_current = 1;this.getActivity()}}>搜索</Button>
                                </div>
                                <div>
                                    <Button value='activity/add' onClick={()=>{
                                        this.props.history.push('/activity/edit/1/0')
                                    }}>添加</Button>&nbsp;
                                    <Button value='activity/comment' onClick={()=>{
                                        this.props.history.push('/todo-list/comment-list/2/-1')
                                    }}>评论列表</Button>
                                </div>
                            </div>
                            <TableAntd
                                columns={this.col}
                                dataSource={this.activity_list}
                                rowKey='activityId'
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
                            </div>
                            
                            
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showImgPanel:false})
                }}>
                    <img alt="图片／视频 预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal zIndex={99} visible={this.state.showVideoPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showVideoPanel:false})
                }}>
                    <video controls={true} alt="视频预览" src={this.state.previewImage} style={{ width: '100%' }} />
                </Modal>
                
                <Modal title='修改' onOk={this.onActionImg} zIndex={100} visible={this.state.imgPanel} maskClosable={true} onCancel={()=>{
                    this.setState({imgPanel:false})
                }}>
                   <AntdOssUpload 
                        actions={this.props.actions} 
                        accept={this.state.ftype==1?'video/mp4':'image/*'}
                        value={this.state.img_list}
                        ref={ref=>this.img = ref}
                    />
                </Modal>
                <Modal
                    zIndex={90}
                    width={1100}
                    title='审核'
                    visible={this.state.showCheckPannel}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={()=>{
                        this.setState({ showCheckPannel:false })
                    }}
                    bodyStyle={{ padding: "10px" }}
                >
                    <TableAntd  disabled={view_mode} dataSource={this.state.result_list} columns={this.check_col} rowKey={'joinId'} tableLayout={'fixed'} size={'middle'} pagination={{
                        showTotal:(total)=>'总共'+total+'条'
                    }}/>
                </Modal>
                <Modal
                    zIndex={99}
                    width={700}
                    title='修改信息'
                    visible={this.state.showCheckPannels}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={()=>{
                        this.setState({ showCheckPannels:false })
                    }}
                    onOk={this.onOkjion}
                    bodyStyle={{ padding: "10px" }}
                >
                     <Form.Item style={{width:'150px'}} label='作品名'>
                        <Input value={this.state.workName} onChange={(e)=>{
                            this.setState({
                                workName:e.target.value
                            })
                        }}/>
                    </Form.Item>
                    <Form.Item style={{width:'500px'}} label='作品信息'>
                        <Input value={this.state.workIntro} onChange={(e)=>{
                            this.setState({
                                workIntro:e.target.value
                            })
                        }}/>
                    </Form.Item>
                </Modal>
            </div>
        )
    }
    col = [
        {
            title: 'ID',
            dataIndex: 'activityId',
            key: 'activityId',
            ellipsis: false,
        },
        {
            title: '活动内容',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            width:250,
            render:(item,ele)=>(
                <>
                    <Tooltip title={ele.title}>
                    <div className='text_more'>{ele.title}</div>
                    </Tooltip>
                    <div className='be_ll_gray'>
                        <Tooltip title={`/subPages/pages/find/activityDesc?activityId=${ele.activityId}&atype=${ele.atype}`}>
                            <a>查看链接</a>
                        </Tooltip>
                    </div>
                </>
            )
        },
        {
            title: '活动类型',
            dataIndex: 'atype',
            key: 'atype',
            ellipsis: false,
            render:(item,ele)=>ele.atype==4?'调查问卷':ele.atype==3?'自发投票':ele.atype==2?'主题活动':'无'
        },
        {
            title: '封面',
            dataIndex: 'activityImg',
            key: 'activityImg',
            ellipsis: false,
            render:(item,ele)=><img onClick={this.showImgPanel.bind(this,ele.activityImg)} className="head-example-img" src={ele.activityImg}/>
        },
        {
            title: '活动时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            ellipsis: false,
            render:(item,ele)=>moment.unix(ele.beginTime).format('YYYY-MM-DD')
        },
        {
            title: '发布时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            ellipsis: false,
            render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD')
        },
        {
            title: '关注数',
            dataIndex: 'follow',
            key: 'follow',
            ellipsis: false,
        },
        {
            title: '参与人数',
            dataIndex: 'num',
            key: 'num',
            ellipsis: false,
            render:(item,ele)=>ele.atype==0?'无':ele.num
        },
        {
            title: '状态',
            dataIndex: 'statusName',
            key: 'statusName',
            ellipsis: false,
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action',
            ellipsis: false,
            width:300,
            render:(item,ele)=>(
            <div>
                <Button value='activity/status' onClick={this._onAction.bind(this,'status',ele.activityId)} type={ele.status==1?"primary":''} size={'small'} className='m_2'>{ele.status==1?'禁用':'启用'}</Button>
                
                <Button value='activity/recomm' onClick={this._onAction.bind(this,'recommend',ele.activityId)} type={ele.isRecomm==1?"primary":''} size={'small'} className='m_2'>{ele.isRecomm==1?'取消推荐':'推荐'}</Button>
                <Button value='activity/view' onClick={()=>{
                    this.props.history.push('/activity/edit/1/'+ele.activityId)
                }}  type="primary" size={'small'} className='m_2'>查看</Button>
                {
                    ele.atype==2?
                    <Button value='activity/check' onClick={this.showResult.bind(this,ele)} type="primary" size={'small'} className='m_2'>审核</Button>
                    :null
                }
                <Button value='activity/result' onClick={()=>{
                    this.props.history.push('/activity/result/'+ele.atype+'/'+ele.activityId)
                }} type="primary" size={'small'} className='m_2'>
                    查看结果
                </Button>
                
                <Button value='activity/edit' onClick={()=>{
                    this.props.history.push('/activity/edit/0/'+ele.activityId)
                }} type="primary" size={'small'} className='m_2'>修改</Button>
                <Button value='activity/comment' onClick={()=>{
                    this.props.history.push('/todo-list/comment-list/2/'+ele.activityId)
                }} type="primary" size={'small'} className='m_2'>评论</Button>
                <Popconfirm
                    value='activity/del'
                    okText="确定"
                    cancelText='取消'
                    title='确定删除吗？'
                    onConfirm={this._onAction.bind(this,'delete',ele.activityId)}
                >
                    <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                </Popconfirm>
            </div>
            )
        },
    ]
    check_col = [
        {
            title: 'ID',
            dataIndex: 'joinId',
            key: 'joinId',
            ellipsis: false,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            ellipsis: false,
        },
        {
            title: '联系方式',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: '作品名称',
            dataIndex: 'workName',
            key: 'workName',
            ellipsis: true,
        },
        {
            title: '作品描述',
            dataIndex: 'workIntro',
            key: 'workIntro',
            ellipsis: true,
        },
        {
            title: '作品',
            dataIndex: 'workUrl',
            key: 'workUrl',
            ellipsis: false,
            render:(item,ele)=>{
                if(ele.galleries instanceof Array && ele.galleries.length>0){
                    return ele.galleries.map(_ele=>{
                        //PIC = 0
                        //VIDEO = 1
                        //AUDIO = 2
                        // TXT = 3
                        //PDF = 4
                        //EXCEL = 5
                        //WORD = 6
                        //ZIP = 7
                        const {link,ftype} = _ele
                        return(
                        <Popover trigger='hover' content={<>
                            <Button onClick={this.onActionActivityResult.bind(this,ele.activityId,ele.joinId,_ele.galleryId,link,ftype)}>修改作品</Button>
                            <Button onClick={()=>window.open(link,'_black')}>下载作品</Button>
                        </>}>
                            {
                                ftype==0?
                                    <Button key={link} size={'small'} className='m_2' onClick={()=>{ this.setState({ showImgPanel:true,previewImage:link }) }}>查看图片</Button>
                                :ftype==1?
                                    <Button key={link} size={'small'} className='m_2' onClick={()=>{ this.setState({ showVideoPanel:true,previewImage:link }) }}>查看视频</Button>
                                :'未知文件类型'
                            }
                        </Popover>)
                    })
                }else{
                    return '暂无作品'
                }
            }
        },
        {
            title: '点赞数',
            dataIndex: 'number',
            key: 'number',
            ellipsis: false
        },
        {
            title: '参加时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        },
        {
            title: '是否审核',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render:(item,ele)=>{
                console.log(ele,ele.status == 1)
                return ele.status==0?'未审核':ele.status==1?<span style={{color:'green'}}>已通过</span>:<span style={{color:'red'}}>已拒绝</span>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (item, record) =>{
                return record.status>0?
                <Popconfirm value='activity/check' title={`确定${record.status==1?'拒绝':'通过'}吗`} okText='确定' cancelText='取消' onConfirm={this.state.view_mode?null:()=>{
                    this.actionWork(record.status==1?2:1,record.joinId,record.activityId)
                }}>
                    <a>重新审核</a>
                </Popconfirm>
                :
                <div style={{width:'120px'}}>
                    <a onClick={this.onEditjoin.bind(this,record)}>修改</a>&nbsp;&nbsp;
                    <Popconfirm value='activity/check' title='确定通过吗' okText='确定' cancelText='取消' onConfirm={this.state.view_mode?null:()=>{
                        this.actionWork(1,record.joinId,record.activityId)
                    }}>
                        <a>通过</a>
                    </Popconfirm>
                    &nbsp;&nbsp;
                    <Popconfirm value='activity/check' title='确定拒绝吗' okText='确定' cancelText='取消' onConfirm={this.state.view_mode?null:()=>{
                        this.actionWork(2,record.joinId,record.activityId)
                    }}>
                        <a>拒绝</a>
                    </Popconfirm>
                </div>
            },
        },
    ]
}
const LayoutComponent =ActivityMng;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        activity_list:state.activity.activity_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
