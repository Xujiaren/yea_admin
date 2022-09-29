import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { DatePicker,Pagination,Switch,Modal,Form,Card,Select ,Input, Empty, InputNumber, message} from 'antd';
import { Interaction, Chart, Axis, Tooltip, Geom, Interval, Legend, Slider, Coordinate } from 'bizcharts';

import connectComponent from '../../util/connect';
import _ from 'lodash'
import SelectCom from './SelectCom'
import * as ComFn from '../../components/CommonFn'
import moment from 'moment'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Search} = Input;

class CourseClassify extends Component {
    state = {
        visible: false,
        editTitle:'添加',
        isView:false,

        keyword:'',
        parent_id:'0',
        categoryId:'0',
        categoryName:'',
        sortOrder:0,
        status:0,
        ctype:'3',
        cctype:'-1',

        edit: true,
        view: true,

        category_list:[],
        parent_list:[],
        the_ids:[],
        dataSourceTimes:[],
        dataSourceTimes:[],
        atime:[moment().subtract('month', 6), moment()],
        loading:false,
        category_id:0,
        auth:-1,
    };
    parent_list = []
    category_list = []
    page_total=0
    page_current=1
    page_size=10000

    _onPage = (val)=>{
        const {actions} = this.props;
        actions.getCategory({
            keyword:this.state.keyword,
            page:val-1,
            pageSize:this.page_size,
            cctype:this.state.cctype,
            ctype:this.state.ctype,
        })
        
    }
    _onUpdate(id){
        const {actions} = this.props

        actions.updateCategory({
            category_id:id,
            resolved:()=>{
                this.handleCancel()
                message.success("操作成功")
                actions.getCategory({
                    keyword:this.state.keyword,
                    page:this.page_current-1,
                    pageSize:this.page_size,
                    cctype:this.state.cctype,
                    ctype:this.state.ctype,
                    parent_id:'-1'
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onDelete(id){
        const {actions} = this.props
        actions.removeCategory({
            category_id:id,
            resolved:(data)=>{
                this.handleCancel()
                message.success("操作成功")
                actions.getCategory({
                    keyword:this.state.keyword,
                    page:this.page_current-1,
                    pageSize:this.page_size,
                    cctype:this.state.cctype,
                    ctype:this.state.ctype,
                    parent_id:'-1'
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val)=>{
        const {actions} = this.props
        
        actions.getCategory({
            keyword:val,
            page:this.page_current-1,
            pageSize:this.page_size,
            cctype:this.state.cctype,
            ctype:this.state.ctype,
            parent_id:'-1'
        })
        this.setState({ keyword:val })
    }
    _onPublish = ()=>{
        const {actions} = this.props
        const { categoryId,categoryName,sortOrder,status,ctype,cctype,parent_id,parent_list} = this.state
        let ids = []


        if(sortOrder > 9999){ message.info('排序不能大于9999'); return; }

        if(parent_id=='0'){
            parent_list.map(ele=>{
                if(categoryId!==ele.categoryId)
                    ids.push(ele.sortOrder)
            })
            if(ids.indexOf(sortOrder)>-1){
                message.info('当前父分类已经存在相同的排序'); return;
            }
        }else{
            let child = []
            parent_list.map(ele=>{
                if(ele.categoryId == parent_id)
                    child = ele.child
            })
            child.map(_ele=>{
                if(categoryId!==_ele.categoryId)
                    ids.push(_ele.sortOrder)
            })
            if(ids.indexOf(sortOrder)>-1){
                message.info('当前子分类已经存在相同的排序'); return;
            }
        }

        
        

        actions.publishCategory({
            category_id:categoryId, 
            category_name:categoryName,
            cctype:cctype,
            ctype:ctype,
            sort_order:sortOrder,
            status:status,
            parent_id:parent_id,
            resolved:(data)=>{
                this.handleCancel()
                message.success("操作成功")
                actions.getCategory({
                    keyword: this.state.keyword,
                    page: this.page_current-1,
                    pageSize: this.page_size,
                    cctype: this.state.cctype,
                    ctype: this.state.ctype,
                    parent_id:'-1'
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    showModal(txt,index,parent_id){
        let is_view = false
        if(txt){
            if(txt=="查看"){
                is_view =true
            }
            const cate_item = this.category_list[index]


            this.setState({
                editTitle:txt,
                isView: is_view,
                visible: true,
                categoryId:cate_item.categoryId,
                categoryName:cate_item.categoryName,
                sortOrder:cate_item.sortOrder,
                status:cate_item.status,
                ctype:cate_item.ctype,
                cctype:cate_item.cctype,
                parent_id:parent_id+'',
                the_ids:[]
            })  
        }else{
            this.setState({
                editTitle:'添加分类',
                isView: false,
                visible: true,
                categoryId:'0',
                categoryName:'',
                sortOrder:0,
                status:'0',
                ctype:3,
                cctype:'',
                parent_id:parent_id+''
            }) 
        }
    };

    componentDidMount(){
        const {actions} = this.props
        actions.getCategory({
            keyword:this.state.keyword,
            page:this.page_current-1,
            pageSize:this.page_size,
            cctype:this.state.cctype,
            ctype:this.state.ctype,
            parent_id:'-1'
        })
    }
    componentWillReceiveProps(n_props){
 
        if(n_props.category_list !==this.props.category_list){
            if(n_props.category_list.data.length == 0){
                // message.info('暂时没有数据')
            }
            let parent_list = []
            let child_list = []
            let category_list = []
            let data = n_props.category_list.data
            this.page_total=n_props.category_list.total
            this.page_current=n_props.category_list.page+1

            data = ComFn.orderSort({arr:data,flag:'sortOrder'})
     
            for(let i=0;i<data.length;i++){
                if(data[i].parentId == 0){
                    data[i].parentName = ''
                    parent_list.push(data[i])
                }else{
                    for(let j=0;j<data.length;j++){
                        if(data[i].parentId==data[j].categoryId){
                            data[i].parentName = data[j].categoryName
                            child_list.push(data[i])
                        }
                    }
                }
            }

            let final = []
            for(let i=0;i<parent_list.length;i++){
                final.push(parent_list[i])
                parent_list[i].child = []
                child_list.forEach(ele=>{
                    if(ele.parentId === parent_list[i].categoryId){
                        final.push(ele)
                        parent_list[i].child.push(ele)
                    }
                })
            }

    
            console.log(final,parent_list)

            this.category_list = final
            this.setState({ parent_list:parent_list })
        }
        
    }
    
    handleCancel = () => {
        this.setState({
            visible: false,
            categoryId:'0'
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
        const {keyword,categoryId,categoryName,sortOrder,status,ctype,cctype,parent_id} = this.state;
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="课程分类" style={{minHeight:'400px'}}>
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={keyword}
                                        onChange={(e)=>{
                                            this.setState({keyword:e.currentTarget.value})
                                        }}
                                    />
                                </div>
                                <div>
                                    <Button value='classify/add' onClick={this.showModal.bind(this,'','','0')}>添加分类</Button>
                                </div>
                            </div>
                            <Table responsive size="sm">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>链接</th>
                                    <th>一级分类名称</th>
                                    
                                    <th>二级分类名称</th>
                                   {/*<th>课程分类</th>*/}
                                    <th>一级排序<span style={{fontSize:'12px',color:'#8a8a8a'}}>(排序越大越靠前)</span></th>
                                    <th>二级排序<span style={{fontSize:'12px',color:'#8a8a8a'}}>(排序越大越靠前)</span></th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.category_list.length == 0?
                                    <tr>
                                        <td colSpan={7}>
                                            <Empty description="暂时没有数据" />
                                        </td>
                                    </tr>
                                    :
                                    this.category_list.map((ele,index)=>
                                    <tr key={index+'cate'}>
                                        <td>{ele.categoryId}</td>
                                        <td>/pages/course/courseCate?cateId={ele.parentId?ele.parentId:ele.categoryId}&categoryId={ele.parentId?ele.categoryId:0}</td>
                                        <td>{ele.parentId==0?ele.categoryName:''}</td>
                                        <td>{ele.parentId==0?'':ele.categoryName}</td>
                                        {/*
                                        <td>{ele.ctype ==3?'视频课程':'图文课程'}</td>
                                        */}
                                        <td>{ele.parentId==0?ele.sortOrder:''}</td>
                                        <td>{ele.parentId==0?'':ele.sortOrder}</td>
                                        <td>{ele.status == 1?'已启用':'未启用'}</td>
                                        <td style={{width:'380px'}}>
                                            <div>
                                                <Button value='classify/view' className='m_2' type="primary" size={'small'} onClick={this.showModal.bind(this,"查看",index,ele.parentId,ele)}>查看</Button>
                                                <Button value='classify/edit' className='m_2' type="primary" size={'small'} onClick={this.showModal.bind(this,"修改",index,ele.parentId,ele)}>修改</Button>
                                                <Button value='classify/edit' className='m_2' onClick={this._onUpdate.bind(this,ele.categoryId)} type={ele.status == 1?"danger":"primary"} size={'small'} >{ele.status == 1?'禁用':'启用'}</Button>
                                                <Popconfirm
                                                    value='classify/del' 
                                                    title={"该分类下的所有课程将被删除，确定删除吗？"}
                                                    onConfirm={this._onDelete.bind(this,ele.categoryId)}
                                                    okText="确定"
                                                    cancelText="取消"
                                                >
                                                    <Button className='m_2' type="danger" size={'small'}>删除</Button>
                                                </Popconfirm>
                                                <Button value='classify/view' className='m_2' size='small' onClick={()=>{
                                                    const that = this
                                                    that.setState({ dataSource:[],dataSourceTimes:[],category_id:ele.categoryId,statPanel:true },()=>{
                                                        that.getCateStat()
                                                    })
                                                }}>数据统计</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                
                                </tbody>
                            </Table>
                            <div>{'总共'+this.page_total+'条'}</div>
                            {/*
                            <Pagination  showTotal={()=>()} showQuickJumper pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                            */}
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title={this.state.editTitle}
                    visible={this.state.visible}
                    centered
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    onOk={this._onPublish}
                    bodyStyle={{padding:"10px"}}
                    footer={this.state.isView?null:<Button onClick={this._onPublish} type='primary'>提交</Button>}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='选择级别'>
                            <SelectCom disabled={this.state.isView||this.state.editTitle=='修改'?true:false} parentlist={this.state.parent_list} value={this.state.parent_id} onSelect={(parent_id)=>{
                                this.setState({ parent_id })
                            }}/>
                        </Form.Item>

                        <Form.Item label="分类名称">
                            <Input value={categoryName} onChange={(e)=>{
                                this.setState({categoryName:e.target.value})
                            }} disabled={this.state.isView?true:false}/>
                        </Form.Item>
                        {/*
                        <Form.Item label="课程类型">
                            <Select disabled={this.state.isView?true:false} value={ctype} onChange={(val)=>{this.setState({ctype:val})}}>
                                    <Select.Option value={3}>视频课程</Select.Option>
                                    <Select.Option value={1}>图文课程</Select.Option>
                            </Select>
                        </Form.Item>
                        */}
                        <Form.Item label="排序">
                            <InputNumber value={sortOrder} onChange={(val)=>{
                                if(val !== ''&&!isNaN(val)){
                                    val = Math.round(val)
                                    if(val<0) val=0
                                    this.setState({sortOrder:val})
                                }
                            }} disabled={this.state.isView?true:false} min={0} max={9999}/>
                            <div style={{fontSize:'12px'}}>* 请不要设置相同的排序</div>
                        </Form.Item>
                        <Form.Item label="是否启用">
                            <Switch checked={status==1?true:false} onChange={(checked)=>{
                                if(checked)
                                    this.setState({status:1})
                                else
                                    this.setState({status:0})
                            }} disabled={this.state.isView?true:false}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal width={1000} visible={this.state.statPanel} maskClosable={true} footer={null} onCancel={() => { this.setState({ statPanel: false }) }} onOk={() => { this.setState({ statPanel: false }) }}>
                    <Card loading={this.state.loading} title='各分类课程复学人数、复学次数' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                        extra={
                            <>
                                <DatePicker.RangePicker size='small' value={this.state.atime} allowClear={false} onChange={(atime, dataString) => {
                                    this.setState({atime},()=>{
                                        this.getCateStat()
                                    })
                                }} disabledDate={val => val > moment().subtract(1, 'day')}></DatePicker.RangePicker>
                    
                                <Select size='small' value={this.state.auth} onChange={(val) => { this.setState({auth:val},()=>this.getCateStat()) }}>
                                    <Select.Option value={-1}>全 部</Select.Option>
                                    <Select.Option value={0}>未认证</Select.Option>
                                    <Select.Option value={1}>已认证</Select.Option>
                                </Select>
                                {/* <Button size="small" onClick={onExport} loading={loading}>导出</Button> */}
                            </>}
                    >
                        <Chart height={400} autoFit data={this.state.dataSource} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                            <Axis name="value" visible={true} />
                            <Axis name="type" visible={true} />
                            <Geom
                                shape='smooth'
                                type="line"
                                color='name'
                                position="type*value"
                            />
                            <Legend position='top' itemName={{
                                style: {
                                    fill: "#333"
                                }
                            }} />
                            <Tooltip shared showCrosshairs />
                            <Slider end={1} height={25} />
                        </Chart>
                        <Chart className='mt_20' height={400} autoFit data={this.state.dataSourceTimes} interactions={['active-region']} padding={[40, 40, 100, 40]} description={{
                                visible: true,
                                text: '复学次数',
                            }}>
                            <Axis name="value" visible={true} />
                            <Axis name="type" visible={true} />
                            <Geom
                                shape='smooth'
                                type="line"
                                color='name'
                                position="type*value"
                            />
                            <Legend position='top' itemName={{
                                style: {
                                    fill: "#333"
                                }
                            }} />
                            <Tooltip shared showCrosshairs />
                            <Slider end={1} height={25} />
                        </Chart>
                    </Card>
				</Modal>
            </div>
        )
    }
    getCateStat = ()=>{

        this.setState({ loading:true })
        const {atime,auth,category_id} = this.state
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        this.props.actions.getStatCourseCateRelearn({
            begin_time,
            end_time,
            is_auth:auth,
            category_id,
            resolved:(data)=>{
                console.log(data)
                
                const {personNum,againTime} = data
                let arr = []//复学次数
                let arrTimes = []//复学人数
                if(personNum && personNum instanceof Array){
                  
                    let key = ''
                    personNum.map(ele=>{
                        key = Object.keys(ele)[0]
                        arr.push({ type: key, value: ele[key], name: '复学人数' })
                    })
                }
                if(againTime && againTime instanceof Array){
                    
                    let key = ''
                    againTime.map(ele=>{
                        key = Object.keys(ele)[0]
                        arrTimes.push({ type: key, value: ele[key], name: '复学次数' })
                    })
                }
                this.setState({ loading:false,dataSource:arr, dataSourceTimes:arrTimes })
            },
            rejected:(data)=>{
                this.setState({ loading:false })
                message.error(JSON.stringify(data))
            }
        })
    }
}
const LayoutComponent =CourseClassify;
const mapStateToProps = state => {
    return {
        category_list:state.course.category_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
