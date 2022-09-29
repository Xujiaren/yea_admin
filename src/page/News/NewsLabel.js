import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { message,Pagination,Switch,Modal,Form,Card,Select ,Input} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Option} = Select;
const {Search} = Input;

class NewsLabel extends Component {
    state = {
            
        edit : false,
        view : false,
        visible: false,
        isView:false,
        title:'添加标签',

        status:0, 
        tag_id:'',
        tagName:'',
        ttype:0,
        keyword:''
    };
    tag_list = []
    page_total=0
    page_current=1
    page_size=12

    _onPage = (val)=>{
        const {actions} = this.props;
        let pathname = this.props.history.location.pathname
        let {keyword} = this.state
        this.props.history.replace(pathname+'?page='+val)
        actions.getTag({
            keyword:keyword,
            page:val-1,
            ttype:'',
            pageSize:this.page_size
        })
    }
    _onUpdate(id){
        const {actions} = this.props
        actions.updateTag({
            tag_id:id,
            resolved:(data)=>{
                let {keyword} = this.state
                this.handleCancel()
                message.success("操作成功")
                actions.getTag({
                    keyword:keyword,
                    page:this.page_current-1,
                    ttype:'',
                    pageSize:this.page_size
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onDelete(id){
        const {actions} = this.props
        actions.removeTag({
            tag_id:id,
            resolved:(data)=>{
                let {keyword} = this.state
                this.handleCancel()
                message.success("操作成功")
                if(this.tag_list.length == 1){
                    keyword = ''
                }
                actions.getTag({
                    keyword:keyword,
                    page:this.page_current-1,
                    ttype:'',
                    pageSize:this.page_size
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val)=>{
        const {actions} = this.props
        
        actions.getTag({
            keyword:val,
            page:0,
            ttype:'',
            pageSize:this.page_size
        })
        this.setState({
            keyword:val
        })
    }
    _onPublish = ()=>{
        const {actions} = this.props
        const { 
            status, 
            tag_id,
            tagName,
            ttype,
        } = this.state
        actions.publishTag({
            status, 
            tag_id,
            tagName,
            ttype,
            resolved:(data)=>{
                this.handleCancel()
                message.success("操作成功")
                
                actions.getTag({
                    keyword:'',
                    page:this.page_current-1,
                    ttype:'',
                    pageSize:this.page_size
                })
            },
            rejected:(data)=>{
               setTimeout(() => {
                message.info({
                    content:'该标签已存在'
                })
               }, 2000);
                // message.error(data)
            }
        })
    }
    componentWillMount(){
        const {actions} = this.props;
        const {search} = this.props.history.location
        let page =0
        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page+1
        }
       
        actions.getTag({
            keyword:'',
            page:page,
            ttype:'',
            pageSize:this.page_size
        })
    }

    componentWillReceiveProps(n_props){
       
        if(n_props.tag_list !==this.props.tag_list){
            if(n_props.tag_list.data.length == 0){
                message.info('暂时没有数据')
            }
            this.tag_list = n_props.tag_list.data
            this.page_total=n_props.tag_list.total
            this.page_current=n_props.tag_list.page+1
        }
        
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
                tagName:tag_item.tagName,
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
    render(){
        const { 
            status, 
            tag_id,
            tagName,
            ttype,
        } = this.state

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
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="标签列表" style={{minHeight:'400px'}}>
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />
                                </div>
                                <div>
                                    <Button value='newsLabel/add' onClick={this.showModal.bind(this,"添加标签",'add')}>添加标签</Button>
                                </div>
                            </div>
                            <Table  hover responsive size="sm">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>标签名称</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.tag_list.map((ele,index)=>(
                                    <tr key={index+'tag'}>
                                        <td>{ele.tagId}</td>
                                        <td>{ele.tagName}</td>
                                        <td>{ele.status==1?'已启用':'未启用'}</td>
                                        <td style={{width:'320px'}}>
                                            <div>
                                                {/* <Link to={'/course-manager/label-detail/'+ele.tagId}>
                                                    <Button type="primary" size={'small'}>所有课程</Button>
                                                </Link>&nbsp; */}
                                                <Button value='newsLabel/view' type="primary" size={'small'} onClick={this.showModal.bind(this,"查看",index)}>查看</Button>&nbsp;
                                                <Button value='newsLabel/edit' type="primary" size={'small'} onClick={this.showModal.bind(this,"修改",index)}>修改</Button>&nbsp;
                                                <Button value='newsLabel/status' onClick={this._onUpdate.bind(this,ele.tagId)} type={ele.status == 0?"primary":'danger'} ghost size={'small'}>{ele.status == 1?'禁用':'启用'}</Button>&nbsp;
                                                <Popconfirm 
                                                    value='newsLabel/del'
                                                    okText="确定"
                                                    cancelText='取消'
                                                    title='确定删除吗？'
                                                    onConfirm={this._onDelete.bind(this,ele.tagId)}
                                                >
                                                <Button type="danger" ghost size={'small'}>删除</Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                    )
                                )}
                                </tbody>
                            </Table>
                            <Pagination  showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    footer={this.state.isView?null:<Button type='primary' onClick={this._onPublish}>提交</Button>}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="标签名称">
                            <Input onChange={(e)=>{
                                this.setState({
                                    tagName:e.target.value
                                })
                            }} value={tagName} disabled={this.state.isView?true:false}/>
                        </Form.Item>
                        <Form.Item label="是否启用">
                            <Switch checked={status==1?true:false} disabled={this.state.isView?true:false} onChange={(checked)=>{
                                if(checked)
                                    this.setState({status:1})
                                else
                                    this.setState({status:0})
                            }}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const LayoutComponent =NewsLabel;
const mapStateToProps = state => {
    return {
        tag_list:state.course.tag_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});