import React, { Component } from 'react';
import { Badge, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import {Empty,Card,PageHeader,Form,Modal,Checkbox,DatePicker,Menu, Dropdown, Button, Icon, message,Input,Pagination, Select, InputNumber} from 'antd';
import {Link,NavLink} from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import connectComponent from '../../../util/connect';
import _ from 'lodash'

const {RangePicker} = DatePicker;
const { Search } = Input;
const InputGroup = Input.Group;
const {Option} = Select;

class RecommendList extends Component {
    state = {
        view:true,
        edit:true,

        isAll:false,
        selected_g:[],
        id_group:[],

        visible: false,
        showImgPanel:false,
        previewImage:'',
        keyword:'',
        cate_id:'',

        sort_order:'',
        course_id:'',
        channel_name:''
    };
    id_group = []
    category_list = []
    col_info_list = []
    page_total=0
    page_current=1
    page_size=10
    channel_id=''

    _onPage = (val)=>{
        const {actions} = this.props;
        const {keyword,cate_id} = this.state
        actions.getChannelInfo(keyword,val-1,this.channel_id,cate_id,this.page_size)
    }
    componentDidMount(){
        const {actions} = this.props
        let search_str = decodeURI(this.props.location.search)
        let channel_name = search_str.replace('?colName=','')||''
        this.channel_id =this.props.match.params.channel_id

        this.setState({channel_name})

        console.log(this.props,channel_name)
        if(!this.channel_id){
            message.info('课程ID参数为空，返回专栏列表页')
        }else{
            actions.getChannelInfo('',0,this.channel_id,'',this.page_size)
        }
        actions.getCategory({
            keyword:'',
            page:0,
            pageSize:10000,
            cctype:'-1',
            ctype:'3',
            parent_id:'0'
        })
    }
    componentWillReceiveProps(n_props){
     

        if(n_props.col_info_list !== this.props.col_info_list){
            let _id_tmp = []
            this.col_info_list = n_props.col_info_list.data
            if(this.col_info_list.length == 0){
                message.info('暂时没有数据')
            }
            this.page_total=n_props.col_info_list.total
            this.page_current=n_props.col_info_list.page+1
     
            this.col_info_list.map((ele,index)=>{
                _id_tmp.push({id:ele.courseId,checked:false})
            })
            this.setState({
                id_group:_id_tmp
            })
        }
        if(n_props.category_list !== this.props.category_list){
            this.category_list = n_props.category_list.data
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
    showModal(idx){
        let {channelSort,courseId} = this.col_info_list[idx]
        this.setState({
            sort_order:channelSort,
            course_id:courseId,
            visible: true,
        });
    };
    _onSort = ()=>{
        const {actions} = this.props
        let {
            sort_order,course_id,keyword,cate_id
        } =this.state

        let channel_id = this.channel_id

        if(sort_order > 9999){ message.info('排序不能大于9999'); return; }

        actions.sortChannelCourse({
            sort_order,channel_id,course_id,
            resolved:(data)=>{
                this.handleCancel()
                actions.getChannelInfo(keyword,this.page_current-1,this.channel_id,cate_id,this.page_size)
                message.success("操作成功，排序数值越大越靠前")
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onDownCourse = ()=>{
        const {selected_g,cate_id,keyword} = this.state
        if(selected_g.length == 0){
            message.info('请先选择课程')
            return;
        }
        const {actions} = this.props

        actions.recommCourse({
            channel_ids:this.channel_id,
            course_ids:selected_g.join(','),
            type:1,
            resolved:(data)=>{
                this.setState({
                    isAll:false,
                    selected_g:[]
                })
                message.success('操作成功')
                actions.getChannelInfo(keyword,0,this.channel_id,cate_id,this.page_size)
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onFilter = ()=>{
        const {actions} = this.props
        let {keyword,cate_id} = this.state
        if(cate_id === -1){
            cate_id = ''
        }
        actions.getChannelInfo(keyword,0,this.channel_id,cate_id,this.page_size)
    }
    _onSearch = (val)=>{
        const {actions} = this.props
        let {cate_id} = this.state

        actions.getChannelInfo(val,0,this.channel_id,cate_id,this.page_size)
    }
    onSearchChange =(e)=>{
        this.setState({keyword:e.target.value})
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

   
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
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
        <PageHeader
            
            ghost={false}
            onBack={() => window.history.back()}
            title=""
            subTitle={this.state.channel_name||"专栏课程"}
        >
        <Row>
                <Col xs="12" lg="12">
                <Card bodyStyle={{padding:0}}>
                    <CardHeader className="flex j_space_between align_items">
                        <div className="flex row align_items f_grow_1">
                            <span style={{ flexShrink: 0 }}>搜索&nbsp;&nbsp;</span>
                            {/*
                                <RangePicker style={{ maxWidth: 200 }} locale={locale}/>
                            */}
                            <Search
                                placeholder="关键词"
                                onSearch={this._onSearch}
                                onChange={this.onSearchChange}
                                style={{ maxWidth: 200 }}
                            />&nbsp;
                            <InputGroup compact>
                                <Input disabled={true} style={{ width: '100px' }} defaultValue="课程分类"/>
                                <Select defaultValue={-1} onChange={val=>{this.setState({cate_id:val})}} style={{ width: '130px' }}>
                                    <Option value={-1}>全部</Option>
                                    {this.category_list.map((ele,index)=>(
                                        <Option key={index+'cate'} value={ele.categoryId}>{ele.categoryName}</Option>
                                    ))}
                                </Select>
                            </InputGroup>&nbsp;
                            <Button onClick={this._onFilter}>筛选</Button>
                            {/*
                            <InputGroup compact>
                                <Input disabled={true} style={{ width: '80px' }} defaultValue="课程形式"/>
                                <Select defaultValue="0">
                                    <Option value="0">视频课</Option>
                                    <Option value="1">图文课</Option>
                                    <Option value="1">音频课</Option>
                                </Select>
                            </InputGroup>&nbsp;
                            <InputGroup compact>
                                <Input disabled={true} style={{ width: '60px' }} defaultValue="状态"/>
                                <Select defaultValue="0">
                                    <Option value="0">已上架</Option>
                                    <Option value="1">未上架</Option>
                                </Select>
                            </InputGroup>&nbsp;
                            <InputGroup compact>
                                <Input disabled={true} style={{ width: '60px' }} defaultValue="推荐"/>
                                <Select defaultValue="0">
                                    <Option value="0">已推荐</Option>
                                    <Option value="1">未推荐</Option>
                                </Select>
                            </InputGroup>
                            */}
                        </div>
                        <div className="flex f_row f_nowrap align_items">
                            {/*<Button>提交</Button>*/}
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="pad_b10">
                            <Button onClick={this._onCheckAll} type="" size={'small'} className="">{this.state.isAll?'取消全选':'全选'}</Button>&nbsp;
                            <Button onClick={this._onDownCourse} size={'small'} className="">批量取消推荐</Button>
                        </div>
                        <Table responsive size="sm">
                            <thead>
                            <tr>
                                <th></th>
                                <th>主图</th>
                                <th>课程名称</th>
                                {/*
                                <th>课程分类</th>
                                <th>当前专栏名称</th>
                                */}
                                <th>状态</th>
                                <th>排序（数值越大越靠前）</th>
                                <th>操作</th>
                                {/*
                                <th>排序</th>
                                <th>推荐</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {this.col_info_list.length === 0?
                            <tr>
                                <td colSpan={6}>
                                    <Empty className="mt_20" description="暂时没有数据"/>
                                </td>
                            </tr>
                            :this.col_info_list.map((ele,index)=>
                                <tr key={index+'cha'}>
                                    <td>
                                        <Checkbox 
                                            data-id={ele.courseId}
                                            onChange={this._onCheck.bind(this,index)}
                                            checked={this.state.id_group[index].checked}
                                        />
                                    </td>
                                    <td>
                                        <a>
                                            <img onClick={this.showImgPanel.bind(this,ele.courseImg)} className="head-example-img" src={ele.courseImg}/>
                                        </a>
                                    </td>
                                    <td>
                                        <Link to={
                                            ele.ctype==3?
                                            '/course-manager/view-static-course/'+ele.courseId:
                                            ele.ctype==0?
                                            '/course-manager/view-course/'+ele.courseId:
                                            ele.ctype==1?
                                            '/course-manager/MediaCourse/MediaEdit/'+ele.courseId:
                                            '/course-manager/view-course/'+ele.courseId
                                        }>{ele.courseName}</Link>
                                    </td>
                                    <td style={ele.status==0?{color:'#bebebe'}:null}>
                                       {ele.status==1?'已上架':'未上架'}
                                    </td>
                                    {/*
                                    <td>{ele.category_name}</td>
                                    <td>
                                        {!ele.channelList?null:ele.channelList.map(_ele=>{
                                            if(_ele.channelId == this.channel_id){
                                                return _ele.channelName
                                            }
                                        })}
                                    </td>
                                    */}
                                    <td style={ele.status==0?{color:'#bebebe'}:null}>{ele.channelSort}</td>
                                    
                                    <td>
                                        <Button onClick={this.showModal.bind(this,index)} type='primary' size={'small'}>修改排序</Button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                        <Pagination showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                    </CardBody>
                </Card>
                </Col>

            </Row>
            </PageHeader>
            <Modal
                    title="排序"
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    bodyStyle={{padding:"10px"}}
                    onOk={this._onSort}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="排序">
                        <InputNumber 
                            value={this.state.sort_order}
                            onChange={val=>{
                                if(val !== ''&&!isNaN(val)){
                                    val = Math.round(val)
                                    if(val<0) val=0
                                    this.setState({sort_order:val})
                                }
                            }}
                            min={0} max={9999}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
        </div>
        );
    }
}

const LayoutComponent =RecommendList;
const mapStateToProps = state => {
    return {
        col_info_list:state.course.col_info_list,
        category_list:state.course.category_list,
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
