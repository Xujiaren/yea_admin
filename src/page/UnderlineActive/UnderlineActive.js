import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Table as TableAntd,List,Icon,Upload,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio, Tooltip} from 'antd';
importÂ connectComponentÂ fromÂ '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Search} = Input;

class UnderlineActive extends Component {
    state = {
            
        edit : true,
        view : true,
        visible: false,
        isView:false,
        title:'',

        status:-1,
        stype:8,
        keyword:'',
        previewImage:'',
        showImgPanel:false,

        fileList:[],

        squad_id:'0',
        excelFileList:[],
        importLoading:false,
        showImportPannel:false,
        rejectedUser:[],
        loads:false
    };
    page_total=0
    page_current=1
    page_size=10
    squad_list=[]

    componentWillMount(){
        const {actions} = this.props;
        const {search} = this.props.history.location
        const pageSize =  this.page_size
        const {keyword,stype,status} = this.state
        
        let page =0

        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page+1
        }

        actions.getSquad({
            keyword,stype,status,pageSize,page
        })
    }

    componentWillReceiveProps(n_props){
       
        if(n_props.squad_list !== this.props.squad_list){
            this.squad_list = n_props.squad_list.data
            this.page_total=n_props.squad_list.total
            this.page_current=n_props.squad_list.page+1
        }
    }
    _onPage = (val)=>{
        const {actions} = this.props;
        const pathname = this.props.history.location.pathname
        this.props.history.replace(pathname+'?page='+val)
 
        actions.getSquad({
            keyword:this.state.keyword,
            stype:this.state.stype,
            status:this.state.status,
            pageSize:this.page_size,
            page:val-1
        })
    }
    _onUpdate(squad_id,action){
        const {actions} = this.props
        actions.actionSquad({
            action, squad_id,
            resolved:(data)=>{
                message.success("æä½æå")
                actions.getSquad({
                    keyword:this.state.keyword,
                    stype:this.state.stype,
                    status:this.state.status,
                    pageSize:this.page_size,
                    page:this.page_current-1
                })
            },
            rejected:(data)=>{
                message.error('æäº¤å¤±è´¥')
            }
        })
    }
    _onSearch = (val)=>{
        const {actions} = this.props

        actions.getSquad({
            keyword:val,
            stype:this.state.stype,
            status:this.state.status,
            pageSize:this.page_size,
            page:0
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
    importUser = ()=>{
        this.setState({importLoading:true})

        const {actions} = this.props
        const {excelFileList,squad_id} = this.state;
        const that = this
        let file = new FormData();

        if(excelFileList.length === 0||squad_id == '0'){
            message.info('è¯·éæ©Excelæä»¶')
            this.setState({importLoading:false})
            return;
        }

        file.append('file', excelFileList[0]);
        file.append('squad_id',squad_id)
        actions.importSquadUser({
            file:file,
            resolved:(data)=>{
                message.success('æäº¤æå')
                that.setState({ importLoading:false,showImportPannel:false,excelFileList:[] },()=>{

                    let rejectedUser = []
                    Object.keys(data.fail).map(ele=>{
                        rejectedUser.push(data.fail[ele])
                    })
                    that.setState({
                        showResult:true,
                        rejectedUser:rejectedUser,
                        success:data.success,
                        total:data.total
                    })
                })
            },
            rejected:(data)=>{
                this.setState({importLoading:false})
                message.error('å¯¼å¥å¤±è´¥ ï¼è¯·åèExcelå¯¼å¥æ¨¡ç')
            }
        })
    }
    showImportPannel(squadId){
        const that = this
        that.setState({ showImportPannel:true,squad_id:squadId })
    }
    onExports=(val)=>{
        this.setState({
            loads:true
        })
        this.props.actions.getDownActExport({
            squad_id:val,
            resolved:(res)=>{
                message.success({
                    content:'å¯¼åºæå'
                })
                window.open(res.address)
                this.setState({
                    loads:false
                })
            },
            rejected:(err)=>{
                this.setState({
                    loads:false
                })
            }
        })
    }
    render(){

        const {keyword,excelFileList,importLoading} = this.state
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
                <Card title="çº¿ä¸æ´»å¨ç®¡ç">
                    <div className='min_height'>
                    <div className="flex f_row j_space_between align_items mb_10">

                        <div className='flex f_row align_items'>
                            <Search
                                placeholder=''
                                onSearch={this._onSearch}
                                style={{ maxWidth: 200 }}
                                value={keyword}
                                onChange={e=>{ this.setState({ keyword:e.target.value }) }}
                            />
                        </div>
                        <div>
                            <Button value='underActive/add' onClick={()=>{
                                this.props.history.push('/underactive/add/0')
                            }}>æ·»å </Button>
                        </div>
                    </div>
                    <Table responsive size="sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th>å¹è®­ç­æ é¢</th>
                                <th>å¯æ é¢</th>
                                <th>å°é¢</th>
                                <th>æ¥åæ¶é´</th>
                                <th>æ¥åæªæ­¢æ¶é´</th>
                                <th>å¼å§æ¶é´</th>
                                <th>ç»ææ¶é´</th>
                                <th>å¹è®­å°ç¹</th>
                                <th>æçäººæ°</th>
                                <th>æ¥åäººæ°</th>
                                <th style={{width:'300px'}}>æä½</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.squad_list.map((ele,index)=>(
                            <tr key={ele.squadId}>
                                <td>
                                </td>
                                <td>{ele.squadId}</td>
                                <td style={{maxWidth:'200px'}}>
                                    <Tooltip title={ele.squadName}>
                                    <div className='text_more'>{ele.squadName}</div>
                                    </Tooltip>
                                    <div className='be_ll_gray'>
                                        <Tooltip title={`/subPages/pages/user/qualification/myTranDetail?squadId=${ele.squadId}&type=0&stype=${ele.stype}`}>
                                            <a>æ¥çé¾æ¥</a>
                                        </Tooltip>
                                    </div>
                                </td>
                                <td style={{maxWidth:'260px'}}>
                                    <Tooltip title={ele.summary}>
                                        <div className='text_more'>{ele.summary}</div>
                                    </Tooltip>
                                </td>
                                <td>
                                    <a>
                                        <img onClick={this.showImgPanel.bind(this,ele.squadImg)} className="head-example-img" src={ele.squadImg}/>
                                    </a>
                                </td>
                                <td>{moment.unix(ele.applyBegin).format('YYYY-MM-DD')}</td>
                                <td>{moment.unix(ele.applyEnd).format('YYYY-MM-DD')}</td>
                                <td>{moment.unix(ele.beginTime).format('YYYY-MM-DD')}</td>
                                <td>{moment.unix(ele.endTime).format('YYYY-MM-DD')}</td>
                                <td>{ele.location}</td>
                                <td>{ele.enrollNum}</td>
                                <td>{ele.registeryNum}</td>
                                <td>
                                    <div>
                                        <Button value='underActive/status' type={ele.status==1?"primary":''} className='m_2' size={'small'} onClick={this._onUpdate.bind(this,ele.squadId,'status')}>{ele.status==1?'ä¸æ¶':'ä¸æ¶'}</Button>
                                        {/* <Button value='underActive/in' className='m_2' size={'small'} onClick={this.showImportPannel.bind(this,ele.squadId)}>å¯¼å¥</Button> */}
                                        <Button value='underActive/view' onClick={()=>{
                                            this.props.history.push({
                                                pathname:'/underactive/view/'+ele.squadId,
                                                state:{type:"view"}
                                            })
                                        }}  type="primary" size={'small'} className='m_2'>æ¥ç</Button>
                                        <Button 
                                            value='underActive/user' 
                                            onClick={e=>{
                                                this.props.history.push({
                                                    pathname:'/underactive/user/'+ele.squadId,
                                                    state:{view:false}
                                                })
                                            }} type="primary" size={'small'} className='m_2'>
                                                æ¥çæ¥å
                                        </Button>
                                        <Button value='underActive/edit' onClick={()=>{
                                            this.props.history.push({
                                                pathname:'/underactive/edit/'+ele.squadId,
                                                state:{type:"edit"}
                                            })
                                        }}  type="primary" size={'small'} className='m_2'>ä¿®æ¹</Button>
                                        <Popconfirm
                                            value='underActive/del' 
                                            okText="ç¡®å®"
                                            cancelText='åæ¶'
                                            title='ç¡®å®å é¤åï¼'
                                            onConfirm={this._onUpdate.bind(this,ele.squadId,'delete')}
                                        >
                                            <Button className='m_2' size={'small'}>å é¤</Button>
                                        </Popconfirm>
                                        <Button size='small' loading={this.state.loads} className='m_2' onClick={this.onExports.bind(this,ele.squadId)}>å­¦ä¹ æ¦åµå¯¼åº</Button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                    </div>
                    <Pagination pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                    
                </Card>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showImgPanel:false})
                }}>
                    <img alt="å¾çï¼è§é¢ é¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
                <Modal
                    zIndex={6001}
                    title='ç­¾å°'
                    visible={this.state.showCheckPanel}
                    closable={true}
                    maskClosable={true}
                    okText='ç­¾å°'
                    cancelText='éåº'
                    onCancel={()=>{
                        this.setState({showCheckPanel:false})

                    }}
                >
                     <Form {...formItemLayout}>
                        <Form.Item label="å­¦åæ¡ç ">
                            <Input  placeholder='å¯æå¨è¾å¥ä¹å¯ä½¿ç¨æ«ç æª'/>
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
                    title='å¯¼å¥ç»æ'
                    visible={this.state.showResult}
                    closable={true}
                    maskClosable={true}
                    okText='ç¡®å®'
                    cancelText='åæ¶'
                    onCancel={()=>{
                        this.setState({showResult:false})
                    }}
                    onOk={()=>{
                        this.setState({showResult:false})
                    }}
                >
                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '10px' }}>
                        <span style={{ paddingRight: '20px' }}>æ»æ°:{this.state.total}</span>
                        <span style={{ paddingRight: '20px' }}>å¯¼å¥æåæ°:{this.state.success}</span>
                        <span style={{ paddingRight: '20px' }}>å¯¼å¥å¤±è´¥æ°:{this.state.total - this.state.success}</span>
                    </div>
                    <TableAntd columns={this.rejectedUser} pagination={{size:'small',showTotal:(total)=>`æ»å±${total}æ¡`}} dataSource={this.state.rejectedUser} rowKey='sn'></TableAntd>
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
}
constÂ LayoutComponentÂ = UnderlineActive;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        squad_list:state.o2o.squad_list,
		user:state.site.user
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
