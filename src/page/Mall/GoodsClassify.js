import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Pagination,Switch,Modal,Form,Card,Select ,Input, Empty, InputNumber, message} from 'antd';

import connectComponent from '../../util/connect';
import _ from 'lodash'
import SelectCom from './SelectCom'
import * as ComFn from '../../components/CommonFn'
import AntdOssUpload from '../../components/AntdOssUpload'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Search} = Input;

class GoodsClassify extends Component {
    state = {
        visible: false,
        editTitle:'添加',
        isView:false,

        keyword:'',
        parent_id:0,
        categoryId:'0',
        categoryName:'',
        sortOrder:0,
        status:0,
        ctype:7,

        edit: false,
        view: false,

        goods_cate_list:[],
        parent_list:[]
    };
    parent_list = []
    goods_cate_list = [{}]
    page_total=0
    page_current=1
    page_size=0

    getGoodsCate = ()=>{
        const {actions} = this.props;
        actions.getGoodsCate({
            keyword:this.state.keyword,
            page:this.page_current-1,
            pageSize:this.page_size,
            ctype:this.state.ctype,
            parent_id:'-1'
        })
    }
    _onPage = (val)=>{
        this.page_current = val
        this.getGoodsCate()
    }
    _onUpdate(id){
        const {actions} = this.props
        actions.actionGoodsCate({
            action:'status',
            category_id:id,
            resolved:()=>{
                this.handleCancel()
                message.success("操作成功")
                this.getGoodsCate()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onDelete(id){
        const {actions} = this.props
        actions.removeCategory({
            action:'delete',
            category_id:id,
            resolved:(data)=>{
                this.handleCancel()
                message.success("操作成功")
                this.getGoodsCate()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val)=>{
        this.page_current = 1
        this.setState({ keyword:val },()=>{
            this.getGoodsCate()
        })
    }
    _onPublish = ()=>{
        const {actions} = this.props
        const { categoryId,categoryName,sortOrder,status,ctype,cctype,parent_id} = this.state
        let link = ''
        const { iconUpload } = this.refs
        if (typeof iconUpload !== 'undefined') {
            link = iconUpload.getValue()
            if (link == '') {
                message.info('请上传图标')
                return
            }
        }
        
        if(sortOrder > 9999){ message.info('排序不能大于9999'); return; }
        actions.publishGoodsCate({
            link,
            category_id:categoryId, 
            category_name:categoryName,
            ctype:ctype,
            sort_order:sortOrder,
            status:status,
            parent_id:parent_id,
            resolved:(data)=>{
                this.handleCancel()
                message.success("操作成功")
                this.getGoodsCate()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    showModal(txt,index,parent_id){
        let is_view = false
        if(txt !== ''){
            if(txt=="查看"){
                is_view =true
            }
            const cate_item = this.goods_cate_list[index]
            const iconList = [
                { status: 'done', type: 'image/png', url: cate_item.link, uid: Date.now() + 'uid' }
            ]

            this.setState({
                iconList,
                editTitle:txt,
                isView: is_view,
                visible: true,
                categoryId:cate_item.categoryId,
                categoryName:cate_item.categoryName,
                sortOrder:cate_item.sortOrder,
                status:cate_item.status,
                ctype:cate_item.ctype,
                cctype:cate_item.cctype,
                parent_id:parent_id+''
            })
        }else{
            this.setState({
                iconList:[],
                editTitle:'添加分类',
                isView: false,
                visible: true,
                categoryId:'0',
                categoryName:'',
                sortOrder:0,
                status:'0',
                ctype:3,
                cctype:'',
                parent_id:0
            }) 
        }
    };

    componentDidMount(){
        this.getGoodsCate()
    }
    componentWillReceiveProps(n_props){
      
        if(n_props.goods_cate_list !==this.props.goods_cate_list){
            // if(n_props.goods_cate_list.data.length == 0){
            //     // message.info('暂时没有数据')
            // }
            // if(n_props.goods_cate_list == null)
            console.log(n_props.goods_cate_list)
            let parent_list = []
            let child_list = []
            let goods_cate_list = []
            let data = n_props.goods_cate_list.data
            this.page_total=n_props.goods_cate_list.total
            this.page_current=n_props.goods_cate_list.page+1

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
                child_list.forEach(ele=>{
                    if(ele.parentId === parent_list[i].categoryId)
                        final.push(ele)
                })
                
            }

    
            console.log(final)

            this.page_total = final.length
            this.goods_cate_list = final
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
                        <Card title="商品分类管理" style={{minHeight:'400px'}}>
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
                                    <Button value='goodsCate/add' onClick={this.showModal.bind(this,'','',0)}>添加分类</Button>
                                </div>
                            </div>
                            <Table responsive size="sm">
                                <thead>
                                <tr>
                                    <th>ID</th>
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
                                {this.goods_cate_list.length == 0?
                                    <tr>
                                        <td colSpan={7}>
                                            <Empty description="暂时没有数据" />
                                        </td>
                                    </tr>
                                    :
                                    this.goods_cate_list.map((ele,index)=>
                                    <tr key={index+'cate'}>
                                        <td>{ele.categoryId}</td>
                                        <td>{ele.parentId==0?ele.categoryName:''}</td>
                                        <td>{ele.parentId==0?'':ele.categoryName}</td>
                                        {/*
                                        <td>{ele.ctype ==3?'视频课程':'图文课程'}</td>
                                        */}
                                        <td>{ele.parentId==0?ele.sortOrder:''}</td>
                                        <td>{ele.parentId==0?'':ele.sortOrder}</td>
                                        <td>{ele.status == 1?'已启用':'未启用'}</td>
                                        <td style={{width:'220px'}}>
                                            <div>
                                                <Button value='goodsCate/view' type="primary" size={'small'} onClick={this.showModal.bind(this,"查看",index,ele.parentId)}>查看</Button>&nbsp;
                                                <Button value='goodsCate/edit'type="primary" size={'small'} onClick={this.showModal.bind(this,"修改",index,ele.parentId)}>修改</Button>&nbsp;
                                                <Button value='goodsCate/edit' onClick={this._onUpdate.bind(this,ele.categoryId)} type={ele.status == 1?"danger":"primary"} size={'small'} >{ele.status == 1?'禁用':'启用'}</Button>&nbsp;
                                                <Popconfirm
                                                    value='goodsCate/del'
                                                    title={"该分类下的所有商品将被删除，确定删除吗？"}
                                                    onConfirm={this._onDelete.bind(this,ele.categoryId)}
                                                    okText="确定"
                                                    cancelText="取消"
                                                >
                                                    <Button type="danger" size={'small'}>删除</Button>
                                                </Popconfirm>
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
                    zIndex={98}
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
                        <Form.Item label="分类图标">
                            <AntdOssUpload actions={this.props.actions} disabled={this.state.isView} accept='image/*' value={this.state.iconList} ref='iconUpload'></AntdOssUpload>
                            <div style={{ marginTop: '-20px' }}>(70px * 70px )</div>
                        </Form.Item>
                        <Form.Item label="排序">
                            <InputNumber value={sortOrder} onChange={(val)=>{
                                if(val !== ''&&!isNaN(val)){
                                    val = Math.round(val)
                                    if(val<0) val=0
                                    this.setState({sortOrder:val})
                                }
                            }} disabled={this.state.isView?true:false}  min={0} max={9999}/>
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
            </div>
        )
    }
}
const LayoutComponent = GoodsClassify;
const mapStateToProps = state => {
    return {
        goods_cate_list:state.mall.goods_cate_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
