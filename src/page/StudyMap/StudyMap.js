import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import moment from 'moment'
import _ from 'lodash'
import {Tag,Modal,Table,Card,PageHeader,Input, message, InputNumber,Form,DatePicker,Spin} from 'antd'
import {Button,Popconfirm} from '../../components/BtnComponent'
import locale from 'antd/es/date-picker/locale/zh_CN';
import FormItem from 'antd/lib/form/FormItem';

// import H5dsEditor from '@rotd01/h5ds';

const options = {
    '5':'客户代表',
    '6':'客户经理',
    '7':'中级经理',
    '8':'客户总监',
    '9':'高级客户总监',
    'GG':'资深客户总监',
}
class StudyMap extends Component{
    state = {
        edit : true,
        view : true,
        step:'',
        level:'',
        level_name:'',

        level_id:'',
        map_id:'',
        step:'',
        showImgPanels:false,
        num:0,
        begin_time: '',
        end_time: '',
        BeginTime: null,
        EndTime: null,
        data_list:[],
        loading:false,
        key:[],
        level_loading:false ,
        level_list:[],
        page:0,
        total:0,
        loads:false,
        showLoading:false,
    }
    page_current = 1
    page_size = 10
    map_type = 0
    data_list = []
    componentDidMount(){
        this.getMain()
    }
    componentWillMount(){
        // this.getStudyMap()
        this.getNums()
       
    }
    getMain=()=>{
        this.setState({ loading:true })
        this.props.actions.getMainss({
            resolved:(res)=>{
                console.log(res)
                this.setState({ data_list: res,loading:false })
            },
            rejected:()=>{
                this.setState({ loading:false })
            }
        })
    }
    _getStudyMap = ()=>{
        this.setState({ level_loading:true })
        const {page,pageSize,map_id,type,data_list} = this.state
        const {actions} = this.props
        if(map_id==0||map_id){
            actions.getMainsss({
                level:data_list[map_id].map_level,
                type:-1,
                page:page,
                resolved:(res)=>{
                    console.log(res)
                    const {total,page,data} = res
                    if(Array.isArray(data)){
                        this.setState({ 
                            level_list: data,
                            total,
                            page
                        })
                    }
                    this.setState({ level_loading:false })
                },
                rejected:()=>{
                    this.setState({ level_loading:false })
                }
            })
        }
        
    }
    getNums = () => {
        // this.props.actions.getApplySetting({
        //     keyy: 'map_paper_percentage',
        //     section: 'paper',
        //     resolved: (data) => {
        //         this.setState({
        //             num: parseInt(data[0].val)
        //         })
        //     },
        //     rejected: (data) => {
        //         message.error(JSON.stringify(data))
        //     }
        // })
        this.props.actions.getApplySetting({
            keyy: 'close_time_begin',
            section: 'map',
            resolved: (data) => {
                let begin_time = moment.unix(data[0].val).format('YYYY-MM-DD HH:mm')
                let BeginTime = moment(begin_time)
                this.setState({
                    BeginTime:BeginTime,
                    begin_time:begin_time
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.getApplySetting({
            keyy: 'close_time_end',
            section: 'map',
            resolved: (data) => {
                // console.log(data,'???????')
                let end_time = moment.unix(data[0].val).format('YYYY-MM-DD HH:mm')
                let EndTime = moment(end_time)
               this.setState({
                    EndTime:EndTime,
                    end_time:end_time
               })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        
    }
    onOkey=()=>{
        const{begin_time,BeginTime,end_time,EndTime}=this.state
        let beg = Date.parse(begin_time)/1000
        let end =  Date.parse(end_time)/1000
        console.log(beg,end,'///////')
        console.log(beg,end)
        // this.props.actions.publishNum({
        //     keyy: 'map_paper_percentage',
        //     section: 'paper',
        //     val: this.state.num.toString(),
        //     resolved: (data) => {
        //         // message.success('提交成功')
        //         this.setState({ showImgPanels: false }, () => {
        //             this.getNums()
        //         })
        //     },
        //     rejected: (data) => {
        //         message.error(JSON.stringify(data))
        //     }
        // })
        this.props.actions.publishNum({
            keyy: 'close_time_begin',
            section: 'map',
            val: beg.toString(),
            resolved: (data) => {
                // message.success('提交成功')
                this.setState({ showImgPanels: false }, () => {
                    this.getNums()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.publishNum({
            keyy: 'close_time_end',
            section: 'map',
            val: end.toString(),
            resolved: (data) => {
                message.success('提交成功')
                this.setState({ showImgPanels: false }, () => {
                    this.getNums()
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    
    }
    componentWillReceiveProps(n_props){
  
        if(n_props.study_level !== this.props.study_level){
            console.log(n_props.study_level)
            this.data_list = n_props.study_level.data
            this.page_current = n_props.study_level.page+1
            this.page_total = n_props.study_level.total
        }
    }
    getStudyMap = ()=>{
        const {actions} = this.props
        actions.getStudyMap({

            page:this.page_current - 1,
            pageSzie:this.page_size,

        })
    }
    actionStudyMap(level_id,action){
        const {actions} = this.props
        actions.actionStudyMap({
            level_id,action,
            resolved:()=>{
                message.success('提交成功')
                this._getStudyMap()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    onSort(ele){
        const {step} = this.state
        const {
            courseId:course_id,
            paperId:paper_id,
            flag,
            level,
            levelId:level_id,
            levelName:level_name,
            mapId:map_id,
            status,
            contentSort:content_sort,
        } = ele
        const type = this.map_type

        if(isNaN(parseInt(step))){ message.info('请输入正确的数字');return; }
        if(step%1 !== 0){ message.info('排序请取整数');return; }

        this.props.actions.setStudyMap({
            type,level_id,map_id,step,paper_id,course_id,status,level,flag,content_sort,level_name,
            resolved:(data)=>{
                this._getStudyMap()
                message.success({
                    content:'提交成功',
                    onClose:()=>{
                        
                    }
                })
                this.setState({ levelId:0 })
            },
            rejected:(data)=>{
                this.setState({ loading:false,importLoading:false })
                message.error(data)
            }
        })
    }
    onLearnExport=(val)=>{
        this.setState({
            loads:true
        })
        this.props.actions.getMainLevels({
            levels:val.map_level,
            resolved:(res)=>{
                message.success({
                    content:'导出成功'
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
    onLevelOut=(val)=>{
        this.setState({showLoading:true})
        this.props.actions.getLevelMaps({
            levelId:val,
            resolved:(res)=>{
                message.success({content:'导出成功'})
                this.setState({
                    showLoading:false
                })
                window.open(res.address)
            },
            rejected:(err)=>{
                console.log(err)
                this.setState({
                    showLoading:false
                })
            }
        })
    }
    renderTable = ()=>{
        const {level_list,page,pageSize,total,level_loading,type} = this.state
        const title = '关卡'

        return (
            <Spin spinning={level_loading}>
            <Table title={()=>title} rowKey='levelId' columns={this.innercol} dataSource={level_list} pagination={{
                current: page+1,
                pageSize: pageSize,
                total: total,
                showQuickJumper: true,
                onChange: (val) => {
                    this.setState({ page: val-1 },this._getStudyMap)
                },
                showTotal: (total) => '总共' + total + '条'
            }}></Table>
            </Spin>
        )
    }
    render(){
        const {step,level,level_name} = this.state
        return (
            <div className="animated fadeIn">
                {/* <H5dsEditor
                    plugins={[]} // 第三方插件包
                    options={{
                        appId: 'test_app_id' // 当前appId
                    }}
                /> */}
                <Card title="学习地图管理">
                    <div className='min_height'>
                        <div className="flex f_row j_space_between align_items mb_10">
                            <div className='flex f_row align_items'>
                                
                            </div>
                            <div>
                                <Button value='studymap/add' style={{marginRight:'5px'}} onClick={()=>{
                                    this.setState({
                                        showImgPanels:true
                                    })
                                }}>维护周期设置</Button>
                                <Button value='studymap/add' onClick={() => {
                                    this.props.history.push('/topic/study-map/edit/0/0')
                                }}>添加关卡</Button>
                            </div>
                        </div>
                        {/* <Table rowKey='levelId' columns={this.col} dataSource={this.data_list} pagination={{
                            current: this.page_current,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper: true,
                            onChange: (val) => {
                                this.page_current = val
                                this.getStudyMap()
                            },
                            showTotal: (total) => '总共' + total + '条'
                        }}></Table> */}
                         <Table
                            expandedRowKeys={this.state.key}
                            expandedRowRender={this.renderTable}
                            onExpandedRowsChange={(res)=>{
                                console.log(res,'???')
                                let m_id = res.pop()
                                console.log(m_id,'///')
                                this.setState({map_id: m_id,key:[m_id],page:0},this._getStudyMap)
                            }}
                            rowKey='map_id'
                            columns={this.col} 
                            dataSource={this.state.data_list} 
                            pagination={false}></Table>
                    </div>

                </Card>
                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal visible={this.state.showImgPanels} onOk={this.onOkey}  onCancel={() => {
                    this.setState({ showImgPanels: false })
                }}>
                    <FormItem label='维护周期'>
                        {/* <InputNumber value={this.state.num} onChange={(e)=>{
                        this.setState({
                            num:e
                        })
                    }}></InputNumber> */}
                     <Form.Item label='考核周期设置'>
                        <DatePicker
                            key='t_5'
                            format={'YYYY-MM-DD HH:mm'}
                            placeholder="选择开始时间"
                            onChange={(val, dateString) => {
                                this.setState({
                                    begin_time: dateString,
                                    BeginTime: val
                                })
                            }}
                            value={this.state.BeginTime}
                            locale={locale}
                            showTime={{ format: 'HH:mm' }}
                            allowClear={false}
                        />
                         <span style={{ padding: '0 10px' }}>至</span>
                         <DatePicker
                            key='t_6'
                            format={'YYYY-MM-DD HH:mm'}
                            placeholder="选择开始时间"
                            onChange={(val, dateString) => {
                                this.setState({
                                    end_time: dateString,
                                    EndTime: val
                                })
                            }}
                            value={this.state.EndTime}
                            locale={locale}
                            showTime={{ format: 'HH:mm' }}
                            allowClear={false}
                        />
                    </Form.Item>
                    </FormItem>
                   
                </Modal>
            </div>
        )
    }
    col = [
        // {
        //     title: 'ID',
        //     dataIndex: 'map_id',
        //     key: 'map_id',
        //     ellipsis: false,
        //     width:80
        // },
        {
            title: '关卡名称',
            dataIndex: 'map_name',
            key: 'map_name',
            ellipsis: false,
        },
        
        //  {
        //     title: '对应级别',
        //     dataIndex: 'level',
        //     key: 'level',
        //     ellipsis: true,
        //     render: (item, ele) => options[ele.level]
        // },
        // {
        //     title: '发布时间',
        //     dataIndex: 'pubTime',
        //     key: 'pubTime',
        //     ellipsis: true,
        //     render: (item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        // },
        {
            title: '排序',
            dataIndex: 'step',
            key: 'step',
            ellipsis: true,
            render:(item,ele,index)=>{
                // if(this.state.levelId==ele.levelId)
                //     return <InputNumber style={{width:100}} placeholder='填写数量' value={this.state.step} onChange={e=>this.setState({step:e})}/>
                // else
                    return <Tag>{index+1}</Tag>
            }
        },
        {
            title: '关卡数',
            dataIndex: 'map_level_numbers',
            key: 'map_level_numbers',
            ellipsis: true,
        },
        // {
        //     title: '状态',
        //     dataIndex: 'status',
        //     key: 'status',
        //     ellipsis: true,
        //     render: (item, ele) => ele.status == 1 ? '已上架' : '未上架'
        // },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render: (item, ele,index) => (
                <div>
                    {/* <Button onClick={this.state.levelId == ele.levelId ? this.onSort.bind(this,ele) : ()=>this.setState({levelId:ele.levelId, step:ele.step})} size={'small'} className='m_2'>{this.state.levelId == ele.levelId ? "保存" : '排序'}</Button>
                    <Button onClick={this.actionStudyMap.bind(this, ele.levelId, 'status')} type={ele.status == 1 ? "primary" : ''} size={'small'} className='m_2'>{ele.status == 1 ? "下架" : '上架'}</Button> */}
                    {/* <Button className='m_2' type="primary" size={'small'} onClick={() => {
                        // this.props.history.push('/topic/o2oStudyMap/edit/' + ele.map_id)
                        this.setState({ map_id: ele.map_id, page:0,key:[ele.map_id],type:1,level_loading:true },this._getStudyMap)
                    }}>
                        查看关卡
                    </Button> */}
                    <Button className='m_2' type="primary" size={'small'} onClick={() => {
                        // this.props.history.push('/topic/o2oStudyMap/edit/' + ele.map_id)
                        this.setState({ map_id:index,page:0,key:[index],type:2,level_loading:true },this._getStudyMap)
                    }}>
                        查看关卡
                    </Button>
                    <Button className='m_2' loading={this.state.loads} size={'small'} onClick={this.onLearnExport.bind(this,ele)}>学习情况导出</Button>
                    {/* <Button className='m_2' type="primary" size={'small'} onClick={() => {
                        this.props.history.push('/topic/study-map/edit/0/' + ele.levelId)
                    }}>
                        修改
                    </Button>
                    <Popconfirm
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.actionStudyMap.bind(this, ele.levelId, 'delete')}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm> */}
                </div>
            )
        },
    ]
    innercol = [
        {
            title: 'ID',
            dataIndex: 'levelId',
            key: 'levelId',
            ellipsis: false,
            width:80
        },
        {
            title: '关卡名称',
            dataIndex: 'levelName',
            key: 'levelName',
            ellipsis: false,
        },
        
        //  {
        //     title: '对应级别',
        //     dataIndex: 'level',
        //     key: 'level',
        //     ellipsis: true,
        //     render: (item, ele) => options[ele.level]
        // },
        {
            title: '发布时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            ellipsis: true,
            render: (item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        },
        {
            title: '排序',
            dataIndex: 'step',
            key: 'step',
            ellipsis: true,
            render:(item,ele,index)=>{
                if(this.state.levelId==ele.levelId)
                    return <InputNumber style={{width:100}} placeholder='填写数量' value={this.state.step} onChange={e=>this.setState({step:e})}/>
                else
                    return <Tag>{10*this.state.page+index+1}</Tag>
            }
        },
        // {
        //     title: '状态',
        //     dataIndex: 'status',
        //     key: 'status',
        //     ellipsis: true,
        //     render: (item, ele) => ele.status == 1 ? '已上架' : '未上架'
        // },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render: (item, ele) => (
                <div>
                {/* <Button value='studymap/order' onClick={this.state.levelId == ele.levelId ? this.onSort.bind(this,ele) : ()=>this.setState({levelId:ele.levelId, step:ele.step})} size={'small'} className='m_2'>{this.state.levelId == ele.levelId ? "保存" : '排序'}</Button> */}
                <Button value='studymap/edit' onClick={this.actionStudyMap.bind(this, ele.levelId, 'status')} type={ele.status == 1 ? "primary" : ''} size={'small'} className='m_2'>{ele.status == 1 ? "下架" : '上架'}</Button>
                <Button value='studymap/view' className='m_2' type="primary" size={'small'} onClick={() => {
                    this.props.history.push('/topic/study-map/edit/1/' + ele.levelId)
                }}>
                    查看
                </Button>
                <Button value='studymap/edit' className='m_2' type="primary" size={'small'} onClick={() => {
                    this.props.history.push('/topic/study-map/edit/0/' + ele.levelId)
                }}>
                    修改
                </Button>
                <Popconfirm
                    value='studymap/del' 
                    okText="确定"
                    cancelText='取消'
                    title='确定删除吗？'
                    onConfirm={this.actionStudyMap.bind(this, ele.levelId, 'delete')}
                >
                    <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                </Popconfirm>
                {
                    ele.paperId>0?
                    <Button loading={this.state.showLoading} className='m_2' size={'small'} onClick={this.onLevelOut.bind(this,ele.levelId)}>导出考试关卡统计</Button>
                    :null
                }
            </div>
            )
        },
    ]
    // col = [
    //     {
    //         title: 'ID',
    //         dataIndex: 'levelId',
    //         key: 'levelId',
    //         ellipsis: false,
    //         width:80
    //     },
    //     {
    //         title: '关卡名称',
    //         dataIndex: 'levelName',
    //         key: 'levelName',
    //         ellipsis: false,
    //     },
        
    //      {
    //         title: '对应级别',
    //         dataIndex: 'level',
    //         key: 'level',
    //         ellipsis: true,
    //         render: (item, ele) => options[ele.level]
    //     },
    //     {
    //         title: '发布时间',
    //         dataIndex: 'pubTime',
    //         key: 'pubTime',
    //         ellipsis: true,
    //         render: (item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
    //     },
    //     {
    //         title: '排序',
    //         dataIndex: 'step',
    //         key: 'step',
    //         ellipsis: true,
    //         render:(item,ele)=>{
    //             if(this.state.levelId==ele.levelId)
    //                 return <InputNumber style={{width:100}} placeholder='填写数量' value={this.state.step} onChange={e=>this.setState({step:e})}/>
    //             else
    //                 return <Tag>{ele.step}</Tag>
    //         }
    //     },
        // {
        //     title: '状态',
        //     dataIndex: 'status',
        //     key: 'status',
        //     ellipsis: true,
        //     render: (item, ele) => ele.status == 1 ? '已上架' : '未上架'
        // },
//         {
//             title: '操作',
//             dataIndex: '',
//             key: '',
//             render: (item, ele) => (
                // <div>
                //     {/* <Button value='studymap/order' onClick={this.state.levelId == ele.levelId ? this.onSort.bind(this,ele) : ()=>this.setState({levelId:ele.levelId, step:ele.step})} size={'small'} className='m_2'>{this.state.levelId == ele.levelId ? "保存" : '排序'}</Button> */}
                //     <Button value='studymap/edit' onClick={this.actionStudyMap.bind(this, ele.levelId, 'status')} type={ele.status == 1 ? "primary" : ''} size={'small'} className='m_2'>{ele.status == 1 ? "下架" : '上架'}</Button>
                //     <Button value='studymap/view' className='m_2' type="primary" size={'small'} onClick={() => {
                //         this.props.history.push('/topic/study-map/edit/1/' + ele.levelId)
                //     }}>
                //         查看
                //     </Button>
                //     <Button value='studymap/edit' className='m_2' type="primary" size={'small'} onClick={() => {
                //         this.props.history.push('/topic/study-map/edit/0/' + ele.levelId)
                //     }}>
                //         修改
                //     </Button>
                //     <Popconfirm
                //         value='studymap/del' 
                //         okText="确定"
                //         cancelText='取消'
                //         title='确定删除吗？'
                //         onConfirm={this.actionStudyMap.bind(this, ele.levelId, 'delete')}
                //     >
                //         <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                //     </Popconfirm>
                // </div>
//             )
//         },
//     ]
}

const LayoutComponent = StudyMap;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        study_level:state.course.study_level,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
