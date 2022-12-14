import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import {Tooltip, InputNumber,Divider,Table,Tag,List,Checkbox, Empty,Spin,Radio,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message, DatePicker, Popconfirm} from 'antd';
import moment from 'moment'
importÂ connectComponentÂ fromÂ '../../util/connect';
import config from '../../config/config'
const {Search,TextArea} = Input;


class UnderlineActiveUser extends Component {
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
        importLoading:false,

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
    squad_import_user = []

    componentDidMount(){
        this.squad_id = this.props.match.params.id+''
        this.getSquadImportUser()
        this.interval = setInterval(()=>{this.getSquadUser()},2000)
    }
    componentWillUnmount(){
        if(this.interval){ clearInterval(this.interval) }
    }
    getSquadUser = ()=>{
        const {actions} = this.props
        const {keyword} = this.state
        actions.getSquadUser({
            squad_id: this.squad_id,
            keyword: keyword,
            page: 0,
            pageSize: this.page_size,
        })
    }
    getSquadImportUser = ()=>{
        const {actions} = this.props
        actions.getSquadImportUser({
            squad_id: this.squad_id
        })
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
        if(n_props.squad_import_user !== this.props.squad_import_user){
            console.log(n_props.squad_import_user)
            this.squad_import_user = n_props.squad_import_user
        }
    }
    actionSquadUser(action,user_ids){
        const {actions} = this.props
        const squad_id = this.squad_id

        actions.actionSquadUser({
            action,squad_id,user_ids,
            resolved:(data)=>{
                message.success('æäº¤æå')
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
            message.info('è¯·éæ©Excelæä»¶')
            this.setState({importLoading:false})
            return;
        }

        file.append('file', excelFileList[0]);
        file.append('squad_id',this.squad_id)
        actions.importSquadUser({
            file:file,
            resolved:(data)=>{
                message.success('æäº¤æå')
                that.setState({ importLoading:false,showImportPannel:false,excelFileList:[] },()=>{
                    that.getSquadUser()
                    that.getSquadImportUser()
                    let rejectedUser = []
                    Object.keys(data.fail).map(ele=>{
                        rejectedUser.push(data.fail[ele])
                    })
                    
                    that.setState({
                        showResult:true,
                        rejectedUser:rejectedUser,
                        total:data.total,
                        success:data.success
                    })
                })
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('å¯¼å¥å¤±è´¥ ï¼è¯·åèExcelå¯¼å¥æ¨¡ç')
            }
        })
    }
    exportExcel = ()=>{
        const {actions} = this.props
        const squad_id = this.squad_id
        const that = this

        this.setState({ exportLoading:true })

            setTimeout(()=>{
                actions.exportSquadUser({
                    squad_id,
                    resolved:(data)=>{
                        that.setState({ exportLoading:false })
                        const {address} = data
                        message.success({
                            content:'å¯¼åºæå',
                            onClose:()=>{
                                window.open(address,'_black')
                            }
                        })
                    },
                    rejected:()=>{
                        that.setState({ exportLoading:false })
                        message.error('å¯¼åºå¤±è´¥')
                    }
                })
            },800)
    }
    signUser = ()=>{
        const {actions} = this.props
        const squad_id = this.squad_id
        const {user_id} = this.state
        
        if(!user_id){
            message.info('å­¦åæ è¯ç æè¯¯ï¼æ æ³ç­¾å°')
            return
        }
        actions.sighSquadUser({
            squad_id,
            user_id:user_id+'',
            resolved:(data)=>{
                console.log(data)
                message.success('ç­¾å°æå')
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
        message.info('è¯·ç®¡çåä½¿ç¨å¾®ä¿¡æ«ä¸æ«ï¼æ«æç¨æ·å­¦çè¯ä¸çäºç»´ç è¿è¡ç­¾å°')
        //this.setState({ showCheckPannel:true,user_id:'' })
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
                        subTitle='æ¥çæ¥å'
                    >
                        <div className='mb_5'>
                            
                            {/* <Button size={'small'} className='m_2' onClick={()=>{this.setState({ showImportPannel:true })}}>å¯¼å¥</Button> */}
                            <Button disabled={exportLoading} loading={exportLoading} size={'small'} className='m_2' onClick={this.exportExcel}>å¯¼åº</Button>
                            {/*<Button size={'small'} className='m_2' onClick={this.onSighClick}>ç­¾å°</Button>*/}
                            {
                                this.squad_import_user.length>0?
                                <Button size={'small'} className='m_2' onClick={()=>{this.setState({ showImportUser:true })}}>æ¥çå¯¼å¥åå</Button>
                                :null
                            }
                        </div>
                        <Row>
                            <Col xs="12">
                                <Card type='inner' bodyStyle={{padding:0}}>
                                <Table loading={this.state.loading} disabled={view_mode} dataSource={this.squad_user_list} columns={this.columns} rowKey={'userId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    showTotal:(total)=>'æ»å±'+total+'æ¡ãå·²ç­¾å°'+this.state.signCount+'äººããæªç­¾å°'+ (total - this.state.signCount) +'äººã'
                                }}/>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    title='ç­¾å°'
                    visible={this.state.showCheckPannel}
                    closable={true}
                    maskClosable={true}
                    okText='ç­¾å°'
                    cancelText='éåº'
                    onCancel={()=>{
                        this.setState({showCheckPannel:false})
                    }}
                    onOk={this.signUser}
                >
                     <Form {...formItemLayout}>
                        <Form.Item label="å­¦åæ è¯(å­¦å·)">
                            <Input style={{width: '100%'}} value={this.state.user_id} onChange={(e)=>{ this.setState({ user_id:e.target.value }) }} placeholder='å¯æå¨è¾å¥ä¹å¯ä½¿ç¨æ«ç æª'  ref={ref=>{
                                if(ref !== null){
                                    const { input } = ref
                                    input.focus() 
                                }
                            }}/>
                            <div>* å­¦åæ è¯ä¸ºææºå·+å­¦å·</div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title='å¯¼å¥'
                    visible={this.state.showImportPannel}
                    closable={true}
                    maskClosable={true}
                    okText='å¼å§å¯¼å¥'
                    cancelText='åæ¶'
                    onCancel={()=>{
                        this.setState({showImportPannel:false})
                    }}
                    onOk={this.importUser}
                    confirmLoading={importLoading}
                >
                     <Form {...formItemLayout}>
                        <Form.Item label="éæ©Excelæä»¶">
                            <Upload
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                fileList={excelFileList}
                                beforeUpload={this.beforeUploadExcel}
                                onRemove={this.onRemoveExcel}
                            >
                                <Button>
                                    <Icon type="upload" /> éæ©æä»¶
                                </Button>
                            </Upload>
                            <div style={{color:"#8e8e8e",marginTop:'10px',lineHeight:'1.5'}}>
                                <p>
                                    * å¯¼å¥åï¼è¯·åä¸è½½Excelæ¨¡æ¿æä»¶<br/>
                                    * ä»æ¯æxlsxæ ¼å¼çæä»¶
                                </p>
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/09b8e959-ffce-425b-a216-811bf7bb5d89.xlsx'>
                                    Excelå¯¼å¥æ¨¡æ¿ä¸è½½
                                </a>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    width={600}
                    title='æ¥çå¯¼å¥åå'
                    visible={this.state.showImportUser}
                    closable={true}
                    maskClosable={true}
                    okText='ç¡®å®'
                    cancelText='åæ¶'
                    onCancel={() => {
                        this.setState({ showImportUser:false })
                    }}
                    onOk={() => {
                        this.setState({ showImportUser:false })
                    }}
                    bodyStyle={{ padding: '10px' }}
                >
                    <Table 
                        columns={this.importUserCol}
                        pagination={{size:'small',showTotal:(total)=>`æ»${total}æ¡`,showQiuckJumper:true}}
                        dataSource={this.squad_import_user}
                        rowKey='sn'
                    ></Table>
                </Modal>

                <Modal
                    width={600}
                    title='å¯¼å¥ç»æ'
                    visible={this.state.showResult}
                    closable={true}
                    maskClosable={true}
                    okText='ç¡®å®'
                    cancelText='åæ¶'
                    onCancel={() => {
                        this.setState({ showResult:false })
                    }}
                    onOk={() => {
                        this.setState({ showResult:false })
                    }}
                    bodyStyle={{ padding: '10px' }}
                >

                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '10px' }}>
                        <span style={{ paddingRight: '20px' }}>æ»æ°:{this.state.total}</span>
                        <span style={{ paddingRight: '20px' }}>å¯¼å¥æåæ°:{this.state.success}</span>
                        <span style={{ paddingRight: '20px' }}>å¯¼å¥å¤±è´¥æ°:{this.state.total - this.state.success}</span>
                    </div>
                    <Table 
                        columns={this.rejectedUser}
                        pagination={{size:'small',showTotal:(total)=>`æ»${total}æ¡`,showQiuckJumper:true}}
                        dataSource={this.state.rejectedUser}
                        rowKey='sn'
                    ></Table>

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
            message.info('è¯·ä¸ä¼ xlsxæ ¼å¼çæä»¶')
            return;
        }
        this.setState(state => ({
            excelFileList: [file],
        })); 
        return false;
    }
    importUserCol = [
        {
            title: 'å§å',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
        },
        {
            title: 'ææº',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: 'å¡å·',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        }
    ]
    rejectedUser = [
        {
            title: 'å§å',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
        },
        {
            title: 'ææº',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: 'å¡å·',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        },
        {
            title: 'å¯¼å¥å¤±è´¥åå ',
            dataIndex: 'result',
            key: 'result',
        },
    ]
    columns = [
        {
            title: 'å­¦å·',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: 'çå®å§å',
            dataIndex: 'realname',
            key: 'realname',
            ellipsis: false,
        },
        {
            title: 'æµç§°',
            dataIndex: 'nickname',
            key: 'nickname',
            ellipsis: true,
            render:(item,ele)=><Tooltip title={ele.user.nickname}>{ele.user.nickname}</Tooltip>
        },
        {
            title: 'å¡å·',
            dataIndex: 'sn',
            key: 'sn',
            render:(item,ele)=>ele.sn
        },
        {
            title: 'æ§å«',
            dataIndex: 'sex',
            key: 'sex',
            ellipsis: true,
            render:(item,record)=>record.sex==0?'æªç¥':record.sex==1?'ç·':'å¥³'
        },
        {
            title: 'å¹´é¾',
            dataIndex: 'age',
            key: 'age',
            ellipsis: true,
        },
        {
            title: 'èº«ä»½è¯',
            dataIndex: 'identitySn',
            key: 'identitySn',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='left' title={ele.identitySn}>{ele.identitySn}</Tooltip>
        },
        {
            title: 'æ­£å¯å¡',
            dataIndex: 'isPrimary',
            key: 'isPrimary',
            ellipsis: false,
            render:(item,ele)=>ele.isPrimary==1?'æ­£å¡':'å¯å¡'
        },
        {
            title: 'èç³»çµè¯',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: 'å°å',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
            render:(item,ele)=><Tooltip placement='left' title={ele.address}>{ele.address}</Tooltip>
        },
        {
            title: 'é®ç®±',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            render:(item,ele)=><Tooltip title={ele.email}>{ele.email}</Tooltip>
        },
        // {
        //     title: 'å£å³è¦æ±',
        //     dataIndex: 'taste',
        //     key: 'taste',
        //     ellipsis: true,
        //     render:(item,ele)=><Tooltip title={ele.taste}>{ele.taste}</Tooltip>
        // },
        // {
        //     title: 'è³é£è¦æ±',
        //     dataIndex: 'meal',
        //     key: 'meal',
        //     ellipsis: true,
        //     render:(item,ele)=><Tooltip title={ele.meal}>{ele.meal}</Tooltip>
        // },
        // {
        //     title: 'å¤æ³¨',
        //     dataIndex: 'remark',
        //     key: 'remark',
        //     ellipsis: true,
        //     render:(item,ele)=>ele.remark?<Tooltip title={ele.remark}>{ele.remark}</Tooltip>:'æ '
        // },
        {
            title: 'æ¯å¦ç­¾å°',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render:(item,ele)=>{
                return ele.status==1?<span style={{color:'green'}}>å·²ç­¾å°</span>:'æªç­¾å°'
            }
        },
        {
            title: 'æ¥åæ¶é´',
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
            title: 'ç­¾å°æ¶é´',
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
            title: 'æä½',
            key: 'action',
            render: (item, record) =>(
                <span>
                    <Popconfirm title='ç¡®å®å é¤å' okText='ç¡®å®' cancelText='åæ¶' onConfirm={this.state.view_mode?null:()=>{
                        this.actionSquadUser('delete',record.userId)
                    }}>
                        <a>å é¤</a>
                    </Popconfirm>
                </span>
            ),
        },
    ]
}
constÂ LayoutComponentÂ =UnderlineActiveUser;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        user:state.site.user,
        squad_user_list:state.o2o.squad_user_list,
        squad_import_user:state.o2o.squad_import_user
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
