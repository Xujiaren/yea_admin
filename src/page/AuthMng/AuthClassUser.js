import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import {Tooltip,InputNumber,Divider,Table,Tag,List,Checkbox, Empty,Spin,Radio,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message, DatePicker, Popconfirm} from 'antd';
import moment from 'moment'
import connectComponent from '../../util/connect';
import config from '../../config/config'
const {Search,TextArea} = Input;


class AuthClassUser extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        view_mode:false,
        exportLoading:false,
        
        squad_user_list:[],
        showCheckPannel:false,
        showImportPannel:false,
        showResult:false,
        importLoading:true,

        keyword:'',
        file_list:[],
        excelFileList:[],
        rejectedUser:[],
        loading:true,
        signCount:0
    }
    page_total=0
    page_current=1
    page_size=10000000
    squad_user_list=[]
    stype = 0

    componentWillMount(){
        this.squad_id = this.props.match.params.id+''

        if(this.props.match.path === '/auth/class-underline/user/:id'){
            this.title = '线下课程管理'
            this.stype = 3
        }else if(this.props.match.path === '/auth/class-new/user/:id'){
            this.title = '创建班级'
            this.stype = 2
        }
        this.interval = setInterval(()=>{this.getSquadUser()},1000)
        
    }
    componentWillUnmount(){
        if(this.interval){ clearInterval(this.interval) }
    }
    getSquadUser = ()=>{
        const {actions} = this.props
        const {keyword} = this.state
        try {
            actions.getSquadUser({
                squad_id: this.squad_id,
                keyword: keyword,
                page: this.page_current-1,
                pageSize: this.page_size,
                type:'cert'
            })
        } catch (error) {
            this.setState({ loading:false })
        }
    }
    componentWillReceiveProps(n_props){

        if(n_props.squad_user_list !== this.props.squad_user_list){
            let signCount = 0
            this.squad_user_list = n_props.squad_user_list.data
            this.page_total=n_props.squad_user_list.total
            this.page_current=n_props.squad_user_list.page+1
            if(Array.isArray(this.squad_user_list))
            this.squad_user_list.map(ele=>{
                if(ele.status==1) signCount ++
            })
            this.setState({ signCount:signCount, loading:false })
        }
    }
    actionSquadUser(action,user_ids){
        const {actions} = this.props
        const squad_id = this.squad_id

        actions.actionSquadUser({
            action,squad_id,user_ids,
            resolved:(data)=>{
                message.success('提交成功')
                actions.getSquadUser({
                    squad_id: squad_id,
                    keyword: this.state.keyword,
                    page: this.page_current-1,
                    pageSize: this.page_size
                })
            }
        })
    }

    importUser = ()=>{
        this.setState({importLoading:true})

        const {actions} = this.props
        const {excelFileList} = this.state;
        const that = this
        let file = new FormData();

        if(excelFileList.length === 0||this.squad_id == '0'){
            message.info('请选择Excel文件')
            this.setState({importLoading:false})
            return;
        }

        file.append('file', excelFileList[0]);
        file.append('squad_id',this.squad_id)
        actions.importSquadUser({
            file:file,
            resolved:(data)=>{
                message.success('导入成功')
                that.setState({ importLoading:false,showImportPannel:false,excelFileList:[] },()=>{
                    that.getSquadUser()
                    let rejectedUser = []
                    Object.keys(data.fail).map(ele=>{
                        rejectedUser.push(data.fail[ele])
                    })

                    if(rejectedUser.length>0){
                        
                        
                        that.setState({
                            showResult:true,
                            rejectedUser:rejectedUser
                        })
                    }
                })
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('导入失败 ，请参考Excel导入模版')
            }
        })
    }
    exportExcel = ()=>{
        const {actions} = this.props
        const squad_id = this.squad_id
        const that = this

        this.setState({ exportLoading:true })
        if(this.squad_user_list.length === 0){
            message.info('当前报名表人数为0，无法导出')
            that.setState({ exportLoading:false })
        }else{
            setTimeout(()=>{
                actions.exportSquadUser({
                    squad_id,
                    resolved:(data)=>{
                        that.setState({ exportLoading:false })
                        const {adress,address} = data
                        const url = adress||address
                        console.log(url)
                        message.success({
                            content:'导出成功',
                            onClose:()=>{
                                window.open(url,'_black')
                            }
                        })
                    },
                    rejected:()=>{
                        that.setState({ exportLoading:false })
                        message.error('导出失败')
                    }
                })
            },800)
            
        }
    }
    signUser = ()=>{
        const {actions} = this.props
        const squad_id = this.squad_id
        const {user_id} = this.state
        
        if(!user_id){
            message.info('学员标识码有误，无法签到')
            return
        }
        actions.sighSquadUser({
            squad_id,
            user_id:user_id+'',
            resolved:(data)=>{
                console.log(data)
                message.success('签到成功')
                this.getSquadUser()
                this.setState({ showCheckPannel:false })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    beforeUpload(file) {
        console.log(file)
        return true;
    }
    onSighClick = ()=>{
        message.info('请管理员使用微信扫一扫，扫描用户学生证下的二维码进行签到')
        // this.setState({ showCheckPannel:true,user_id:'' })
    }
    showImgPanel(url){
        this.setState({
            showImgPanel: true,
            previewImage:url
        });
    }
    render(){
        const {view_mode,exportLoading,excelFileList,importLoading} = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
            },
        };
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle='查看报名'
                    >
                        <div className='mb_5'>
                            
                            {/*<Button size={'small'} className='m_2' onClick={()=>{this.setState({ showImportPannel:true })}}>导入</Button>*/}
                            <Button disabled={exportLoading} loading={exportLoading} size={'small'} className='m_2' onClick={this.exportExcel}>导出</Button>
                            {/* <Button size={'small'} className='m_2' onClick={this.onSighClick}>签到</Button> */}
                        </div>
                        <Row>
                            <Col xs="12">
                                <Card type='inner' bodyStyle={{padding:0}}>
                                <Table size='small' loading={this.state.loading} disabled={view_mode} dataSource={this.squad_user_list} columns={this.stype==3?this.underline_col:this.columns} rowKey={'userId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    showTotal:(total)=>'总共'+total+'条【已签到'+this.state.signCount+'人】【未签到'+ (total - this.state.signCount) +'人】'
                                }}/>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showImgPanel:false})
                }}>
                    <img alt="图片" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    title='签到'
                    visible={this.state.showCheckPannel}
                    closable={true}
                    maskClosable={true}
                    okText='签到'
                    cancelText='退出'
                    onCancel={()=>{
                        this.setState({showCheckPannel:false})
                    }}
                    onOk={this.signUser}
                >
                     <Form {...formItemLayout}>
                        <Form.Item label="学员标识(学号)">
                            <Input style={{width: '100%'}} value={this.state.user_id} onChange={(e)=>{ this.setState({ user_id:e.target.value }) }} placeholder='可手动输入也可使用扫码枪'  ref={ref=>{
                                if(ref !== null){
                                    const { input } = ref
                                    input.focus() 
                                }
                            }}/>
                            <div>* 学员标识为手机号+学号</div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title='导入'
                    visible={this.state.showImportPannel}
                    closable={true}
                    maskClosable={true}
                    okText='开始导入'
                    cancelText='取消'
                    onCancel={()=>{
                        this.setState({showImportPannel:false})
                    }}
                    onOk={this.importUser}
                    confirmLoading={importLoading}
                >
                     <Form {...formItemLayout}>
                        <Form.Item label="选择Excel文件">
                            <Upload
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                fileList={excelFileList}
                                beforeUpload={this.beforeUploadExcel}
                                onRemove={this.onRemoveExcel}
                            >
                                <Button>
                                    <Icon type="upload" /> 选择文件
                                </Button>
                            </Upload>
                            <div style={{color:"#8e8e8e",marginTop:'10px',lineHeight:'1.5'}}>
                                <p>
                                    * 导入前，请先下载Excel模板文件<br/>
                                    * 仅支持xlsx格式的文件
                                </p>
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/d479e1ee-d99f-48f1-b829-e7fa48823a37.xlsx'>
                                    Excel导入模板下载
                                </a>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    width={600}
                    title='导入失败名单'
                    visible={this.state.showResult}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={()=>{
                        this.setState({showResult:false})
                    }}
                    onOk={()=>{
                        this.setState({showResult:false})
                    }}
                >
                    <Table columns={this.rejectedUser} pagination={false} dataSource={this.state.rejectedUser} rowKey='mobile'></Table>
                </Modal>
            </div>
        )
    }
    onRemoveExcel = file => {
        this.setState(state => {
            const index = state.excelFileList.indexOf(file);
            const newFileList = state.excelFileList.slice();
            newFileList.splice(index, 1);
            return {
                excelFileList: newFileList,
            };
        });
    }
    beforeUploadExcel = file => {
        
        if(file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            message.info('请上传xlsx格式的文件')
            return;
        }
        this.setState(state => ({
            excelFileList: [file],
        })); 
        return false;
    }
    rejectedUser = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
        },
        {
            title: '手机',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: '导入失败原因',
            dataIndex: 'result',
            key: 'result',
        },
    ]
    underline_col = [
        {
            title: '学号',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
            render:(item,ele)=>{
                return ele.realname||ele.name
            }
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.user.nickname}>{ele.user.nickname}</Tooltip>
        },
        {
            title: '卡号',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.sn}>{ele.sn}</Tooltip>
        },
        {
            title: '性别',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render:(item,record)=>record.sex==0?'未知':record.sex==1?'男':'女'
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            ellipsis: false,
        },
        {
            title: '身份证',
            dataIndex: 'identitySn',
            key: 'identitySn',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.identitySn}>{ele.identitySn}</Tooltip>
        },
        {
            title: '联系电话',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.mobile}>{ele.mobile}</Tooltip>
        },
        {
            title: '是否签到',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render:(item,ele)=>{
                return ele.status==1?<span style={{color:'green'}}>已签到</span>:'未签到'
            }
        },
        {
            title: '报名时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            ellipsis: false,
            render:(item,ele)=>{
                if(!ele.pubTime||ele.pubTime=='0'||ele.pubTime==''){
                    return ''
                }else{
                    return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
                }
            }
        },
        {
            title: '签到时间',
            dataIndex: 'applyTime',
            key: 'applyTime',
            ellipsis: false,
            render:(item,ele)=>{
                if(ele.status == 0||!ele.applyTime||ele.applyTime=='0'||ele.applyTime==''){
                    return ''
                }else{
                    return moment.unix(ele.applyTime).format('YYYY-MM-DD HH:mm')
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (item, record) =>(
                <span>
                    <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this.state.view_mode?null:()=>{
                        this.actionSquadUser('delete',record.userId)
                    }}>
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        },
    ]
    columns = [
        {
            title: '学号',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
            render:(item,ele)=>{
                return ele.realname||ele.name
            }
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            ellipsis: true,
            render:(item,ele)=>ele.user.nickname
        },
        {
            title: '卡号',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.sn}>{ele.sn}</Tooltip>
        },
        {
            title: '性别',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render:(item,record)=>record.sex==0?'未知':record.sex==1?'男':'女'
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            ellipsis: true,
        },
        {
            title: '级别',
            dataIndex: 'level',
            key: 'level',
            ellipsis: true,
            render:(item,ele)=>'LV'+ele.user.level
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.address}>{ele.address}</Tooltip>
        },
        // {
        //     title: '正副卡',
        //     dataIndex: 'isPrimary',
        //     key: 'isPrimary',
        //     ellipsis: false,
        //     render:(item,ele)=>ele.isPrimary==1?'正卡':'副卡'
        // },
        {
            title: '联系电话',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.mobile}>{ele.mobile}</Tooltip>
        },
       
        
        // {
        //     title: '邮箱',
        //     dataIndex: 'email',
        //     key: 'email',
        //     ellipsis: true,
        // },
        // {
        //     title: '口味要求',
        //     dataIndex: 'taste',
        //     key: 'taste',
        //     ellipsis: true,
        // },
        // {
        //     title: '膳食要求',
        //     dataIndex: 'meal',
        //     key: 'meal',
        //     ellipsis: true,
        // },
        {
            title: '专卖号',
            dataIndex: 'sellSn',
            key: 'sellSn',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.sellSn}>{ele.sellSn}</Tooltip>
        },
        {
            title: '学历',
            dataIndex: 'edu',
            key: 'edu',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='leftTop' title={ele.edu}>{ele.edu}</Tooltip>
        },
        {
            title: '身高',
            dataIndex: 'height',
            key: 'height',
            ellipsis: true,
        },
        
        {
            title: '身份证正面',
            dataIndex: 'identityFront',
            key: 'identityFront',
            ellipsis: false,
            width:68,
            render:(item,ele)=><img onClick={this.showImgPanel.bind(this,ele.identityFront)} className="head-example-img" src={ele.identityFront}/>
        },
        {
            title: '身份证反面',
            dataIndex: 'identityBack',
            key: 'identityBack',
            ellipsis: false,
            width:68,
            render:(item,ele)=><img onClick={this.showImgPanel.bind(this,ele.identityBack)} className="head-example-img" src={ele.identityBack}/>
        },
        {
            title: '学历证书',
            dataIndex: 'eduCert',
            key: 'eduCert',
            ellipsis: false,
            width:68,
            render:(item,ele)=><img onClick={this.showImgPanel.bind(this,ele.eduCert)} className="head-example-img" src={ele.eduCert}/>
        },
        {
            title: '电子照片',
            dataIndex: 'ephoto',
            key: 'ephoto',
            ellipsis: false,
            render:(item,ele)=><img onClick={this.showImgPanel.bind(this,ele.ephoto)} className="head-example-img" src={ele.ephoto}/>
        },
        {
            title: '是否签到',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render:(item,ele)=>{
                return ele.status==1?<span style={{color:'green'}}>已签到</span>:'未签到'
            }
        },
        {
            title: '报名时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            ellipsis: false,
            render:(item,ele)=>{
                if(!ele.pubTime||ele.pubTime=='0'||ele.pubTime==''){
                    return ''
                }else{
                    return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
                }
            }
        },
        {
            title: '签到时间',
            dataIndex: 'applyTime',
            key: 'applyTime',
            ellipsis: false,
            render:(item,ele)=>{
                if(ele.status == 0||!ele.applyTime||ele.applyTime=='0'||ele.applyTime==''){
                    return ''
                }else{
                    return moment.unix(ele.applyTime).format('YYYY-MM-DD HH:mm')
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (item, record) =>(
                <span>
                    <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this.state.view_mode?null:()=>{
                        this.actionSquadUser('delete',record.userId)
                    }}>
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        },
    ]
}
const LayoutComponent =AuthClassUser;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        squad_user_list:state.o2o.squad_user_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
