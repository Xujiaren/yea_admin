import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Popover, Table as TableAntd,List,Icon,Upload,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio} from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Search} = Input;

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class AuthClassMng extends Component {
    state = {
        edit : false,
        view : false,
        visible: false,
        isView:false,
        title:'',

        status:-1,
        keyword:'',
        previewImage:'',
        showImgPanel:false,

        editorState: BraftEditor.createEditorState(null),
        fileList:[],

        squad_id:'0',
        excelFileList:[],
        importLoading:false,
        exportLoading:false,
        exportSquadId:'',
        showImportPannel:false,
        rejectedUser:[],
        stype:2,
    };
    page_total=0
    page_current=1
    page_size=10
    squad_list=[]
    auth_paper_list = {}
    category_list = []
    category_obj = {}
    ctype = 18
    keyword = ''


    title = "报名与信息管理"
    stype = 1 //资格认证：1，开班管理：2，线下开班：3
    path = '/auth/list/edit/'

    componentWillMount(){
        const {actions} = this.props
        const {search} = this.props.history.location
        
        
        let page =0

        if(this.props.match.path === '/auth/class-underline'){
            this.title = '线下课程管理'
            this.stype = 3
            this.path = '/auth/class-underline/edit/'
        }else if(this.props.match.path === '/auth/class-new'){
            this.title = '创建班级'
            this.stype = 2
            this.path = '/auth/class-new/edit/'
        }
        this.setState({ stype: this.stype })
        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page+1
        }

        this.getAuthClass()
        actions.getAuthCate({ keyword:this.keyword, ctype:this.ctype })
    }
    getAuthClass = ()=>{
        const {actions} = this.props
        const pageSize =  this.page_size
        const {keyword,status} = this.state

        actions.getSquad({
            keyword,
            status,
            pageSize,
            stype:this.stype,
            page:this.page_current-1,
            type:'cert'
        })
    }
    componentWillReceiveProps(n_props){
        
        if(n_props.squad_list !== this.props.squad_list){
            this.squad_list = n_props.squad_list.data
            this.page_total=n_props.squad_list.total
            this.page_current=n_props.squad_list.page+1
        }
        if(n_props.auth_cate_list !==this.props.auth_cate_list){
            let category_obj = {}
            if(n_props.auth_cate_list.length !== 0){
                n_props.auth_cate_list.map(ele=>{
                    category_obj[ele.categoryId] = ele.categoryName
                })
                this.category_obj = category_obj
                this.category_list = n_props.auth_cate_list
            }
        }
        if(n_props.auth_paper_list !== this.props.auth_paper_list){
            let paper_obj = {}
            this.auth_paper_list = n_props.auth_paper_list.data
            this.auth_paper_list.map(ele=>{
                paper_obj[ele.paperId] = ele.paperName
            })
            this.paper_obj = paper_obj
        }
    }
    _onPage = (val)=>{
        const {actions} = this.props;
        const pathname = this.props.history.location.pathname
        this.props.history.replace(pathname+'?page='+val)
 
        actions.getSquad({
            keyword:this.state.keyword,
            stype:this.stype,
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
                message.success("操作成功")
                this.getAuthClass()
            },
            rejected:(data)=>{
                message.error('提交失败')
            }
        })
    }
    _onSearch = (val)=>{
        
        this.page_current = 1
        this.getAuthClass()
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
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }
    
        this.setState({
            previewImage: file.url || file.preview,
            showImgPanel: true,
        });
    };
    importUser = ()=>{
        this.setState({importLoading:true})

        const {actions} = this.props
        const {excelFileList,squad_id} = this.state;
        const that = this
        let file = new FormData();

        if(excelFileList.length === 0||squad_id == '0'){
            message.info('请选择Excel文件')
            this.setState({importLoading:false})
            return;
        }

        file.append('file', excelFileList[0]);
        file.append('squad_id',squad_id)
        actions.importSquadUser({
            file:file,
            resolved:(data)=>{
                message.success('导入成功')
                that.setState({ importLoading:false,showImportPannel:false,excelFileList:[] },()=>{

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
    showImportPannel(squadId){
        const that = this
        that.setState({ showImportPannel:true,squad_id:squadId })
    }
    render(){

        const {stype,keyword,excelFileList,importLoading} = this.state
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
                <Row>
                    <Col xs="12">
                        <Card title={this.title}>
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
                                    <Button value={stype==2?'authClass/add':'underlineClass/add'} onClick={()=>{
                                        this.props.history.push({
                                            pathname:this.path+'0',
                                            state:{type:"edit"}
                                        })
                                    }}>添加</Button>
                                </div>
                            </div>
                                <TableAntd position='bottomLeft' columns={this.stype===3?this.off_class:this.stype===2?this.new_class:this.auth_class} dataSource={this.squad_list} rowKey='squadId' pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    onChange: (val)=>{
                                        this.page_current = val
                                        this.getAuthClass()
                                    },
                                    showTotal:(total)=>'总共'+total+'条'
                                }}></TableAntd>
                            </div>
                            
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showImgPanel:false})
                }}>
                    <img alt="预览" style={{ width: '100%' }} src={this.state.previewImage} />
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
                    <TableAntd columns={this.rejectedUser} pagination={false} dataSource={this.state.rejectedUser} rowKey='mobile'></TableAntd>
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
    exportExcel(squad_id,num){
        const {actions} = this.props
        const that = this

        this.setState({ exportLoading:true, exportSquadId:squad_id })
        // if(num == 0){
        //     message.info('当前报名表人数为0，无法导出')
        //     that.setState({ exportLoading:false })
        // }else{
            setTimeout(()=>{
                actions.exportSquadUser({
                    squad_id,
                    resolved:(data)=>{
                        that.setState({ exportLoading:false })
                        console.log(data.address)
                        const {adress,address} = data
                        const url = adress||address
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
            
        // }
    }
    new_class = [
        {
            title: 'ID',
            dataIndex: 'squadId',
            key: 'squadId',
            ellipsis: false,
            width:88
        },
        {
            title: '班级名称',
            dataIndex: 'squadName',
            key: 'squadName',
            ellipsis: false,
        },
        // {
        //     title: '副标题',
        //     dataIndex: 'summary',
        //     key: 'summary',
        //     ellipsis: true,
        // },
        {
            title: '封面',
            dataIndex: 'squadImg',
            key: 'squadImg',
            ellipsis: false,
            render:(item,ele)=><img onClick={this.showImgPanel.bind(this,ele.squadImg)} className="head-example-img" src={ele.squadImg}/>
        },
        {
            title: '开班周期',
            dataIndex: 'beginTime',
            key: 'beginTime',
            ellipsis: false,
            render:(item,ele)=>moment.unix(ele.beginTime).format('YYYY-MM-DD')+' 至 '+moment.unix(ele.endTime).format('YYYY-MM-DD')
        },
        {
            title: '发布时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        },
        {
            title: '招生人数',
            dataIndex: 'enrollNum',
            key: 'enrollNum',
            ellipsis: false,
        },
        {
            title: '对应课程分类',
            dataIndex: 'categoryId',
            key: 'categoryId',
            ellipsis: true,
            render:(item, ele)=>this.category_obj[ele.categoryId]
        },
        {
            title: '对应试卷',
            dataIndex: 'paper',
            key: 'paper',
            ellipsis: false,
            render:(record,item)=>{
                const content = item.paper.map(ele=>(<Tag key={ele[0][0]}>{ele[0][1]}</Tag>))
                console.log(content)
                return (<Popover trigger="click" placement="bottom" title='对应试卷' content={content}>
                    <Button size='small'>查看试卷</Button>
                </Popover>)
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render:(item, ele)=>ele.status==1?'已启用':'未启用'
        },
        {
            title: '操作',
            dataIndex: 'do',
            key: 'do',
            width:280,
            render:(item,ele)=>(
                <div>
                    <Button value={this.state.stype==2?'authClass/status':'underlineClass/status'} type={ele.status==1?"primary":''} className='m_2' size={'small'} 
                        onClick={this._onUpdate.bind(this,ele.squadId,'status')}>{ele.status==1?'下架':'上架'}
                    </Button>
                    {/*
                    <Button className='m_2' size={'small'} onClick={this.showImportPannel.bind(this,ele.squadId)}>导入</Button>
                    */}
                    <Button value={this.state.stype==2?'authClass/view':'underlineClass/view'} onClick={()=>{
                        this.props.history.push({
                            pathname:this.path+ele.squadId,
                            state:{type:"view"}
                        })
                    }}  type="primary" size={'small'} className='m_2'>查看</Button>
                    
                    <Button value={this.state.stype==2?'authClass/edit':'underlineClass/edit'} onClick={()=>{
                        this.props.history.push({
                            pathname:this.path+ele.squadId,
                            state:{type:"edit"}
                        })
                    }}  type="primary" size={'small'} className='m_2'>修改</Button>
                    <Button 
                    value={this.state.stype==2?'authClass/apply':'underlineClass/apply'}
                    onClick={e=>{
                        this.props.history.push({
                            pathname:'/auth/list/user/'+ele.squadId,
                            state:{view:false}
                        })
                    }} type="primary" size={'small'} className='m_2'>查看报名</Button>
                    
                    <Popconfirm
                        value={this.state.stype==2?'authClass/del':'underlineClass/del'}
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this._onUpdate.bind(this,ele.squadId,'delete')}
                    >
                        <Button className='m_2' size={'small'}>删除</Button>
                    </Popconfirm>
                    <Button  value={'authClass/score'} type="primary" size={'small'} className='m_2' onClick={e=>{
                        this.props.history.push('/auth/class-new/score/'+ele.squadId)
                    }}>
                            成绩管理
                    </Button>
                    <Button  value={'authClass/out'} loading={this.state.exportLoading&&this.state.exportSquadId==ele.squadId} size={'small'} className='m_2' 
                        onClick={this.exportExcel.bind(this,ele.squadId,ele.registeryNum)}>导出</Button>
                   
                </div>
            )
        },
    ]
    off_class = [
        {
            title: 'ID',
            dataIndex: 'squadId',
            key: 'squadId',
            ellipsis: false,
        },
        {
            title: '班级名称',
            dataIndex: 'squadName',
            key: 'squadName',
            ellipsis: false,
        },
        {
            title: '课程分类',
            dataIndex: 'categoryId',
            key: 'categoryId',
            ellipsis: true,
            render:(item, ele)=>this.category_obj[ele.categoryId]
        },
        {
            title: '报名时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            ellipsis: false,
            render:(item,ele)=>moment.unix(ele.applyBegin).format('YYYY-MM-DD HH:mm')+'至'+moment.unix(ele.applyEnd).format('YYYY-MM-DD HH:mm')
        },
        {
            title: '上课地点',
            dataIndex: 'location',
            key: 'location',
            ellipsis: false,
        },
        {
            title: '招生人数',
            dataIndex: 'enrollNum',
            key: 'enrollNum',
            ellipsis: false,
        },
        {
            title: '操作',
            dataIndex: 'do',
            key: 'do',
            render:(item,ele)=>(
                <div>
                    <Button  value={'underlineClass/status'}  type={ele.status==1?"primary":''} className='m_2' size={'small'} onClick={this._onUpdate.bind(this,ele.squadId,'status')}>{ele.status==1?'下架':'上架'}</Button>
                    {/*
                    <Button className='m_2' size={'small'} onClick={this.showImportPannel.bind(this,ele.squadId)}>导入</Button>
                    */}
                    <Button value={'underlineClass/view'} onClick={()=>{
                        this.props.history.push({
                            pathname:this.path+ele.squadId,
                            state:{type:"view"}
                        })
                    }}  type="primary" size={'small'} className='m_2'>查看</Button>
                    <Button
                    value={'underlineClass/apply'} 
                    onClick={e=>{
                        this.props.history.push({
                            pathname:'/auth/class-underline/user/'+ele.squadId,
                            state:{view:false}
                        })
                    }} type="primary" size={'small'} className='m_2'>查看报名</Button>
                    
                    <Button value={'underlineClass/edit'} onClick={()=>{
                        this.props.history.push({
                            pathname:this.path+ele.squadId,
                            state:{type:"edit"}
                        })
                    }}  type="primary" size={'small'} className='m_2'>修改</Button>
                    <Popconfirm
                        value={'underlineClass/del'} 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this._onUpdate.bind(this,ele.squadId,'delete')}
                    >
                        <Button className='m_2' size={'small'}>删除</Button>
                    </Popconfirm>
                    <Button value={'underlineClass/out'}  loading={this.state.exportSquadId==ele.squadId&&this.state.exportLoading} size={'small'} className='m_2' 
                        onClick={this.exportExcel.bind(this,ele.squadId,ele.registeryNum)}>导出</Button>
                </div>
            )
        },
    ]
    auth_class = [
        {
            title: 'ID',
            dataIndex: 'squadId',
            key: 'squadId',
            ellipsis: false,
        },
        {
            title: '培训班标题',
            dataIndex: 'squadName',
            key: 'squadName',
            ellipsis: false,
        },
        {
            title: '副标题',
            dataIndex: 'summary',
            key: 'summary',
            ellipsis: true,
        },
        {
            title: '封面',
            dataIndex: 'squadImg',
            key: 'squadImg',
            ellipsis: false,
            render:(item,ele)=><img onClick={this.showImgPanel.bind(this,ele.squadImg)} className="head-example-img" src={ele.squadImg}/>
        },
        {
            title: '开始时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            ellipsis: false,
            render:(item,ele)=>moment.unix(ele.beginTime).format('YYYY-MM-DD')
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            ellipsis: false,
            render:(item,ele)=>moment.unix(ele.endTime).format('YYYY-MM-DD')
        },
        {
            title: '发布时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        },
        {
            title: '招生人数',
            dataIndex: 'enrollNum',
            key: 'enrollNum',
            ellipsis: false,
        },
        {
            title: '操作',
            dataIndex: 'do',
            key: 'do',
            render:(item,ele)=>(
                <div>
                    <Button type={ele.status==1?"primary":''} className='m_2' size={'small'} onClick={this._onUpdate.bind(this,ele.squadId,'status')}>{ele.status==1?'下架':'上架'}</Button>
                    {/*
                    <Button className='m_2' size={'small'} onClick={this.showImportPannel.bind(this,ele.squadId)}>导入</Button>
                    */}
                    <Button  onClick={()=>{
                        this.props.history.push({
                            pathname:this.path+ele.squadId,
                            state:{type:"view"}
                        })
                    }}  type="primary" size={'small'} className='m_2'>查看</Button>
                    <Button 
                    onClick={e=>{
                        this.props.history.push({
                            pathname:'/auth/list/user/'+ele.squadId,
                            state:{view:false}
                        })
                    }} type="primary" size={'small'} className='m_2'>查看报名</Button>
                    
                    <Button  onClick={()=>{
                        this.props.history.push({
                            pathname:this.path+ele.squadId,
                            state:{type:"edit"}
                        })
                    }}  type="primary" size={'small'} className='m_2'>修改</Button>
                    <Popconfirm 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this._onUpdate.bind(this,ele.squadId,'delete')}
                    >
                        <Button className='m_2' size={'small'}>删除</Button>
                    </Popconfirm>
                    <Button loading={this.state.exportLoading&&this.state.exportSquadId==ele.squadId} size={'small'} className='m_2' onClick={this.exportExcel.bind(this,ele.squadId,ele.registeryNum)}>导出</Button>
                </div>
            )
        },
    ]
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
}
const LayoutComponent =AuthClassMng;
const mapStateToProps = state => {
    return {
        auth_paper_list:state.auth.auth_paper_list,
        auth_cate_list:state.auth.auth_cate_list,
        squad_list:state.o2o.squad_list,
        user:state.site.user,
        rule:state.site.user.rule,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
