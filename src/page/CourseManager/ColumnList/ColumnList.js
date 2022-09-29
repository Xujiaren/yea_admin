import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Tag,Empty,Spin,Pagination,Switch,Modal,Form,Card,Select ,Input, message} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import debounce from 'lodash/debounce';
import config from '../../../config/config';
import QRCode  from 'qrcode.react';
import { orderSort } from '../../../components/CommonFn'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {Button,Popconfirm} from '../../../components/BtnComponent'

const {Option} = Select;
const {Search} = Input;
const qrcode = require("../../../assets/img/code.jpg");
const ctype =['视频课','音频课','直播课','图文课']
const ttype = ['四宫格','单栏']

class ColumnList extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchTeacher = debounce(this.fetchTeacher, 200);
    }
    state = {
        qrUrl:'',

        edit:true,
        view:true,
        isView:false,
        visible: false,
        qrcodePanel:false,
        teacherData:[],
        teacherFetching:false,

        teacher_list:[
            {key:'',label:''},
            {key:'',label:''},
            {key:'',label:''},
            {key:'',label:''},
            {key:'',label:''},
            {key:'',label:''},
        ],
        col_list:[],
        keyword:'',
        showSortPanel:false,
        sortList:[],
        channel:[],
        channel_mapping:[],
        sort_item: {label:'',key:''},
        position:'content'
    };
    col_list = []
    page_total=0
    page_current=1
    page_size=100000

    _onUpdateRe = ()=>{
        const {teacher_list} = this.state
        let data = []
        teacher_list.map((ele,idx)=>{
            if(ele.key == '') return;
            data.push({teacher_id:ele.key,recomm_index:idx+1})
        })
        if(data.length==0){
            message.info('请至少选择一个讲师'); return;
        }
        const {actions} = this.props

        actions.updateReTeacher({
            json:JSON.stringify(data),
            resolved:(data)=>{
                message.success('提交成功')
                this.handleCancel()
                actions.getReTeacher()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })

    }
    onView(id,name,type){
        let qrUrl = config.host+'/channel_preview.html?id='+id+'&name='+name+'&type='+type
        this.setState({
            qrcodePanel:true,
            qrUrl:qrUrl
        })
    }
    componentDidMount(){
        this.fetchTeacher('')
        const {actions} = this.props
        actions.getChannel('',0,this.page_size)
        actions.getReTeacher()
        // this.getSortChannel()
    }

    componentWillReceiveProps(n_props){
    
        if(n_props.col_list !== this.props.col_list){
            this.col_list = n_props.col_list.data||[]

            // this.col_list = orderSort({arr:this.col_list,flag:'sortOrder'})

            
            let channel_mapping = {}
            let channel = [
                {label:'领导风采',key:'leader'},
                {label:'讲师区',key:'teacher'},
                {label:'资讯专栏',key:'article'},
                
                {label:'活动',key:'activity'},
                {label:'专题',key:'column'},
            ]

            this.col_list.map(ele=>{
                channel.push({label:ele.channelName,key:'channel_'+ele.channelId})
            })
            channel.map(ele=>{
                channel_mapping[ele.key] = ele.label
            })

            this.setState({
                col_list:[...this.col_list],
                channel,
                channel_mapping
            })

        }
        if(n_props.re_teacher_list !== this.props.re_teacher_list){
            let _list = n_props.re_teacher_list 

            this.setState(pre=>{
                pre.teacher_list.map(ele=>[
                    ele.key
                ])
                let teacher_list = pre.teacher_list

                _list.map((ele,idx)=>{
                    if(ele.recommIndex>6) return;
                    teacher_list[ele.recommIndex-1].key = ele.teacherId
                    teacher_list[ele.recommIndex-1].label = ele.teacherName
                })

                return {
                    teacher_list
                }
            })
            
        }
    }
    _onOrder = ()=>{
        
        const col_list = orderSort({
            orderBy:this.orderBy,
            arr:this.state.col_list,
            flag:'sortOrder'
        })
        this.setState({
            col_list
        })
        this.orderBy = !this.orderBy
    }
    onSelectTeacher = (idx,val) => {
        console.log(val)
        let isExist = false
        this.state.teacher_list.map(ele=>{
            if(ele.key !==' '&&ele.key==val.key){
                message.info('该讲师已经存在专栏中');
                isExist =true;
            }
        })
        this.setState(pre=>{
            let teacher_list = pre.teacher_list
            
            if(isExist){
                teacher_list[idx].key=''
                teacher_list[idx].label=''
            }else{
                if(val.key == ' '){
                    val.key=''
                    val.label=''
                }
                teacher_list[idx].key=val.key
                teacher_list[idx].label=val.label
            }
            return{
                teacher_list
            }
        })
    };
    fetchTeacher =value =>{
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ selectTeacher: [], teacherFetching: true });
        fetch(config.api+'/user/teacher/?keyword='+value, {
			method: 'get',
			mode: 'cors',
			credentials: 'include',
		})
        .then(response => response.json())
        .then(body => {
            
            const {errorMsg} = body
            if(!errorMsg){

            const teacherData = body.resultBody.data.map(ele => ({
                text: `${ele.teacherName}`,
                value: ele.teacherId,
            }));
            this.setState({ teacherData, teacherFetching: false });
            }
        });
    }
    onSearch=(val)=>{
        const {actions} = this.props
        actions.getChannel(val,0,this.page_size)
    }
    onSearchChange = (e)=>{
        this.setState({ keyword:e.target.value })
    }
    _onUpdataChannel(val,action){
        const {actions} = this.props;
        actions.updateChannel({
            action:action,
            channel_id:val,
            resolved:(data)=>{
                message.success('操作成功')
                actions.getChannel('',0,this.page_size)
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }

    qrcodePanelCancel = () => {
        this.setState({
            qrcodePanel: false,
        });
    };

    createRecourse = () => {
        this.props.history.push("/course-manager/create-recourse");
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    
    render(){
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
        const {teacherData,teacherFetching,keyword} = this.state;

        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="专栏列表" style={{minHeight:'400px'}}>
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this.onSearch}
                                        style={{ maxWidth: 200 }}
                                        onChange={this.onSearchChange}
                                        value = {keyword}
                                    />
                                </div>
                                <div>
                                    <Button value='column/menu' className='m_2' onClick={this.getSortChannel.bind(this,'row')}>首页菜单排序</Button>
                                    <Button value='column/content' className='m_2' onClick={this.getSortChannel.bind(this,'content')}>首页专栏排序</Button>
                                    <Button value='column/add' className='m_2' onClick={this.createRecourse}>创建栏目</Button>
                                </div>
                            </div>
                            <Table  hover bordered responsive size="sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>名称</th>
                                        <th>板式</th>
                                        <th>类型</th>
                                        {/*
                                        <th>开放对象</th>
                                        */}
                                        <th>状态</th>
                                         {/*<th onClick={this._onOrder}>排序（数值越大越靠前）</th>
                                          */}
                                        <th>跳转链接</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.col_list.map((ele,index)=>
                                    <tr key={index+'col'}>
                                        <td>{ele.channelId}</td>
                                        <td>{ele.channelName}</td>
                                        <td>{ttype[ele.ttype]}</td>
                                        <td>{ctype[ele.ctype]}</td>
                                        {/*
                                        <td>
                                            {ele.flag?this.flag_list[index].map(_ele=>{
                                                if(_ele!=='')
                                                    return <Tag key={_ele+'tag'}>{flag_arg[_ele]}</Tag>
                                            }):<Tag>全部</Tag>}
                                        </td>
                                        */}
                                        <td>{ele.status == 1?'已启用':'未启用'}</td> 
                                   
                                        <td>/pages/index/indexCourse?channel_id={ele.channelId}</td>
                                        <td style={{width:'400px' }}>
                                            <div>
                                                {ele.ctype == 3?null:
                                                <Button value='column/view' className='m_2' onClick={this.onView.bind(this,ele.channelId,ele.channelName,ele.ttype)} type="primary" size={'small'}>预览</Button>
                                                }
                                                <Button value='column/view' className='m_2' type="primary" size={'small'} onClick={()=>{
                                                    this.props.history.push('/course-manager/view-recourse/'+index)
                                                }}>查看专栏</Button>
                                                <Button value='column/edit' className='m_2' type="primary" size={'small'} onClick={()=>{
                                                    this.props.history.push('/course-manager/edit-recourse/'+index)
                                                }}>修改</Button>
                                                <Button value='column/course' className='m_2' type="" size={'small'} onClick={()=>{
                                                    this.props.history.push("/course-manager/recommend-list/"+ele.channelId+'?colName='+ele.channelName)
                                                }}>查看课程</Button>
                                                <Button value='column/edit' className='m_2' onClick={this._onUpdataChannel.bind(this,ele.channelId,'status')} type="danger" ghost={ele.status?false:true} size={'small'}>{ele.status?'禁用':'启用'}</Button>
                                                <Popconfirm
                                                    value='column/del'
                                                    okText="确定"
                                                    cancelText='取消'
                                                    title='确定删除吗？'
                                                    onConfirm={this._onUpdataChannel.bind(this,ele.channelId,'delete')}
                                                >
                                                    <Button className='m_2' type="danger" ghost size={'small'}>删除</Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                    )}
                                    <tr>
                                        <td></td>
                                        <td>讲师区</td>
                                        <td>四宫格</td>
                                        <td>讲师区</td>
                                        <td>已启用</td>
                                        <td></td>
                                        <td style={{width:'260px' }}>
                                            <div> 
                                                {/*<Button onClick={()=>{this.setState({qrcodePanel:true})}} type="primary" size={'small'}>预览</Button>&nbsp;*/}
                                                <Button value='column/view' onClick={()=>{this.setState({isView:true,visible:true})}} type="primary" size={'small'}>查看</Button>&nbsp;
                                                <Button value='column/edit' onClick={()=>{this.setState({isView:false,visible:true})}} type="primary" size={'small'}>修改</Button>&nbsp;
                                                {/*<Button type="danger" ghost size={'small'}>删除</Button>*/}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            {/*<Pagination defaultCurrent={6} total={500} />*/}
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="讲师推荐位"
                    visible={this.state.visible}
                    okText="完成"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    bodyStyle={{padding:"10px"}}
                    onOk={this.state.isView?this.handleCancel:this._onUpdateRe}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="推荐位一">
                            <Select
                                disabled={this.state.isView?true:false}
                                value={this.state.teacher_list[0]}
                                showSearch
                                labelInValue
                                placeholder="搜索讲师"
                                notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                filterOption={false}
                                onSearch={this.fetchTeacher}
                                onChange={this.onSelectTeacher.bind(this,0)}
                            >
                                <Option key={' '}>无</Option>
                                {teacherData.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="推荐位二">
                            <Select
                                disabled={this.state.isView?true:false}
                                value={this.state.teacher_list[1]}
                                showSearch
                                labelInValue
                                placeholder="搜索讲师"
                                notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                filterOption={false}
                                onSearch={this.fetchTeacher}
                                onChange={this.onSelectTeacher.bind(this,1)}
                            >
                                <Option key={' '}>无</Option>
                                {teacherData.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="推荐位三">
                            <Select
                                disabled={this.state.isView?true:false}
                                value={this.state.teacher_list[2]}
                                showSearch
                                labelInValue
                                placeholder="搜索讲师"
                                notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                filterOption={false}
                                onSearch={this.fetchTeacher}
                                onChange={this.onSelectTeacher.bind(this,2)}
                            >
                                <Option key={' '}>无</Option>
                                {teacherData.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="推荐位四">
                            <Select
                                disabled={this.state.isView?true:false}
                                value={this.state.teacher_list[3]}
                                showSearch
                                labelInValue
                                placeholder="搜索讲师"
                                notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                filterOption={false}
                                onSearch={this.fetchTeacher}
                                onChange={this.onSelectTeacher.bind(this,3)}
                            >
                                <Option key={' '}>无</Option>
                                {teacherData.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="推荐位五">
                            <Select
                                disabled={this.state.isView?true:false}
                                value={this.state.teacher_list[4]}
                                showSearch
                                labelInValue
                                placeholder="搜索讲师"
                                notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                filterOption={false}
                                onSearch={this.fetchTeacher}
                                onChange={this.onSelectTeacher.bind(this,4)}
                            >
                                <Option key={' '}>无</Option>
                                {teacherData.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="推荐位六">
                            <Select
                                disabled={this.state.isView?true:false}
                                value={this.state.teacher_list[5]}
                                showSearch
                                labelInValue
                                placeholder="搜索讲师"
                                notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                filterOption={false}
                                onSearch={this.fetchTeacher}
                                onChange={this.onSelectTeacher.bind(this,5)}
                            >
                                <Option key={' '}>无</Option>
                                {teacherData.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="是否启用">
                            <Switch disabled defaultChecked/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal 
                    title="预览"
                    visible={this.state.qrcodePanel}
                    maskClosable={true}
                    onCancel={this.qrcodePanelCancel}
                    footer={null}
                    bodyStyle={{display: 'flex',justifyContent: 'center'}}
                >
                    {!this.state.qrUrl?
                        <div className="text_center">正在加载。。。</div>
                        :
                        <QRCode
                            value={this.state.qrUrl}  //value参数为生成二维码的链接
                            size={200} //二维码的宽高尺寸
                            fgColor="#000000"  //二维码的颜色
                        />
                    }
                </Modal>
                <Modal 
                    title={this.state.position=='content'?'首页专栏排序（拖动排序）':'首页菜单排序（拖动排序）'}
                    visible={this.state.showSortPanel}
                    maskClosable={true}
                    onCancel={()=>{ this.setState({ showSortPanel:false }) }}
                    okText='提交'
                    cancelText='取消'
                    onOk={this.sortChannel}
                >
                    <div style={{minHeight:130}}>
                    {this.state.sortList.length==0?<Empty/>:
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable" >
                            {provided => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {this.state.sortList.map((item, index) => (
                                    <Draggable key={item.key} draggableId={item.key} index={index}>
                                        {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div style={{padding:'5px'}}>{item.label} <a style={{float:'right'}} onClick={this.onRemoveItem.bind(this,item)}>删除</a></div>
                                        </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    }
                    </div>
                    <div style={{display:'flex',justifyContent:'center',marginTop:15}}>
                        <Select value={this.state.sort_item} labelInValue onChange={(sort_item)=>{ console.log(sort_item); this.setState({ sort_item }) }} style={{flexGrow:1}}>
                            {this.state.channel.map(ele=>(
                                 <Select.Option value={ele.key}>{ele.label}</Select.Option>
                            ))}
                        </Select>
                        <Button onClick={()=>{
                            const {sortList,sort_item,channel,position} = this.state
                            if(sort_item.key==''){ message.info('请先选择专栏');return; }
                            if(sortList.filter(ele=>ele.key==sort_item.key).length>0){ message.info('专栏已经存在');return; }
                            if(position=='row'&&sortList.length>=8){
                                message.info('首页菜单最多设置 8 个项目');return;
                            }
                            this.setState({channel:[...channel.filter(ele=>ele.key!==sort_item.key)],sortList:[...sortList,sort_item],sort_item:{key:'',label:''}})
                        }}>添加</Button>
                    </div>
                </Modal>
            </div>
        )
    }
    onRemoveItem(item){
        const {sortList,channel} = this.state
        this.setState({ 
            sortList:sortList.filter(ele=>ele.key!==item.key),
            channel:[...channel,item]
        })
    }
    getSortChannel(position){
        const {sortList,channel_mapping} = this.state
        const {actions} = this.props
        let channel = [
            {label:'领导风采',key:'leader'},
            {label:'讲师区',key:'teacher'},
            {label:'资讯专栏',key:'article'},

            {label:'活动',key:'activity'},
            {label:'专题',key:'column'},
        ]

        this.col_list.map(ele=>{
            channel.push({label:ele.channelName,key:'channel_'+ele.channelId})
        })


        actions.getSortChannel({
            position:position,
            resolved:(data)=>{
                console.log(data)
                if(data){
                    let sortList = []
                    
                    Object.keys(data).map(ele=>{
                        channel = channel.filter(_ele=>_ele.key!==ele)
                        if(channel_mapping[ele])
                            sortList.push({key:ele, sortOrder:data[ele], label:channel_mapping[ele]})
                    })
                    
                    
                    sortList = orderSort({arr:sortList,flag:'sortOrder',orderBy:true})

                    this.setState({channel, sortList,position, showSortPanel:true})

                    console.log(sortList)
                }
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    sortChannel = ()=>{
        const {sortList,position} = this.state
        const {actions} = this.props
        let json = {}
        sortList.map((ele,index)=>{
            json[ele.key]=index
        })
        actions.sortChannel({
            data:JSON.stringify(json),
            position:position,
            resolved:()=>{
                message.success('提交成功')
                this.setState({ showSortPanel:false,sort_item:{key:'',label:''} })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    onDragEnd = ({ source, destination }) => {
        if(destination == null) return

        const reorder = (list, startIndex, endIndex) => {
          const [removed] = list.splice(startIndex, 1);
          list.splice(endIndex, 0, removed);
    
          return list;
        }

        this.setState(pre=>{
            return {sortList:reorder([...pre.sortList], source.index, destination.index)}
        })
    }
}


const LayoutComponent =ColumnList;
const mapStateToProps = state => {
    return {
        col_list:state.course.col_list,
        user:state.site.user,
        re_teacher_list:state.course.re_teacher_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});