import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Tag,Popconfirm,message,Pagination,Switch,Modal,Form,Card,Select ,Input,Button} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment';
const {Option} = Select;
const {Search} = Input;

class RankQuestionClassify extends Component {
    state = {
            
        edit : true,
        view : true,
        visible: false,
        isView:false,
        title:'添加分类',

        status:1, 
        tag_id:'',
        tag_name:'',
        ttype:0,
        keyword:'',
        list:[],
        tname:'',
        type:1,
        category_id:0,
    };
    tag_list = [1]
    page_total=0
    page_current=1
    page_size=12




	onRefuse = ()=>{
		message.info('当前管理员无此权限');
    }

    _onPage = (val)=>{
        return
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
   
    
    componentWillMount(){
        const {actions} = this.props;
        const {search} = this.props.history.location
        let page =0
        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page+1
        }
       this.getPks()
       
    }
    getPks=()=>{
        const{actions}=this.props
        actions.getPkcategories({
            keyword:this.state.keyword,
            resolved:(res)=>{
                this.setState({
                    list:res
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    componentWillReceiveProps(n_props){
       
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
                tag_name:'健康',
                ttype:tag_item.ttype
            })  
        }else{
            this.setState({
                title:txt,
                isView: false,
                visible: true,
                
                status:0, 
                tag_id:'',
                tag_name:'',
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
    postClass=()=>{
        const{actions}=this.props
        const{tag_name,status}=this.state
        actions.postPkcategories({
            category_name:tag_name,
            status:status,
            category_id:0,
            resolved:(res)=>{
                message.success({
                    content:'添加成功'
                })
                this.setState({
                    visible:false
                })
                this.getPks()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    onEdit=()=>{
        const{actions}=this.props
        const{category_id,type,tname}=this.state
        actions.postPkcategories({
            category_name:tname,
            status:type,
            category_id:category_id,
            resolved:(res)=>{
                message.success({
                    content:'修改成功'
                })
                this.setState({
                    showEdit:false
                })
                this.getPks()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    _onChanges=(val,ele)=>{
        const{actions}=this.props
        actions.deletePkcategories({
            category_id:val,
            action:ele,
            resolved:(res)=>{
                message.success({
                    content:'操作成功'
                })
                this.getPks()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    render(){
        const { 
            status, 
            tag_id,
            tag_name,
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
                        <Card title="题目分类管理" style={{minHeight:'400px'}}>
                            <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this.getPks}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                        onChange={(e)=>{
                                            this.setState({
                                                keyword:e.target.value
                                            })
                                        }}
                                    />
                                </div>
                                <div>
                                    <Button onClick={!this.state.edit?this.onRefuse:this.showModal.bind(this,"添加分类",'add')}>添加分类</Button>
                                </div>
                            </div>
                            <Table responsive size="sm">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>分类名称</th>
                                    <th>创建时间</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.list.map(item=>{
                                            let pub = moment.unix(item.pubTime).format('YYYY-MM-DD HH:mm')
                                            return(
                                                <tr>
                                                <td></td>
                                                <td>{item.categoryName}</td>
                                                <td>{pub}</td>
                                                <td>{item.status==1?'已启用':'未启用'}</td>
                                                <td style={{width:'320px'}}>
                                                    <div>
                                                        <Button onClick={this._onChanges.bind(this,item.categoryId,'status')} size={'small'} type={item.status == 1?"":"primary"}>{item.status==1?'禁用':'启用'}</Button>&nbsp;
                                                        <Button type="primary" size={'small'} onClick={()=>{
                                                            this.setState({
                                                                showView:true,
                                                                tname:item.categoryName,
                                                            })
                                                        }}>查看</Button>&nbsp;
                                                        <Button type="primary" size={'small'}  onClick={()=>{
                                                            this.setState({
                                                                showEdit:true,
                                                                category_id:item.categoryId,
                                                                tname:item.categoryName,
                                                                type:item.status
                                                            })
                                                        }}>修改</Button>&nbsp;
                                                        {/* <Popconfirm 
                                                            okText="确定"
                                                            cancelText='取消'
                                                            title='确定删除吗？'
                                                            onConfirm={null}
                                                        > */}
                                                            <Button onClick={this._onChanges.bind(this,item.categoryId,'delete')} type="danger" ghost size={'small'}>删除</Button>
                                                        {/* </Popconfirm> */}
                                                    </div>
                                                </td>
                                            </tr>
                                            )
                                        })
                                    }  
                                </tbody>
                            </Table>
                            </div>
                            {/* <Pagination showTotal={(total)=>"总共xxx条"} pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} /> */}
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title='添加'
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    bodyStyle={{padding:"10px"}}
                    onOk={this.postClass}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="分类名称">
                            <Input onChange={(e)=>{
                                this.setState({
                                    tag_name:e.target.value
                                })
                            }} value={this.state.tag_name} disabled={this.state.isView?true:false}/>
                        </Form.Item>
                        <Form.Item label="状态">
                            <Switch checked={this.state.status==1?true:false} disabled={this.state.isView?true:false} onChange={(checked)=>{
                                if(checked)
                                    this.setState({status:1})
                                else
                                    this.setState({status:0})
                            }}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title='查看'
                    visible={this.state.showView}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={()=>{
                        this.setState({showView:false})
                    }}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="分类名称">
                            <Tag>{this.state.tname}</Tag>
                        </Form.Item>
                        {/* <Form.Item label="状态">
                            <Switch disabled/>
                        </Form.Item> */}
                    </Form>
                </Modal>
                <Modal
                    title='修改'
                    visible={this.state.showEdit}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={()=>{
                        this.setState({showEdit:false})
                    }}
                    bodyStyle={{padding:"10px"}}
                    onOk={this.onEdit}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="分类名称">
                            <Input onChange={(e)=>{
                                this.setState({
                                    tname:e.target.value
                                })
                            }} value={this.state.tname}/>
                        </Form.Item>
                        <Form.Item label="状态">
                            <Switch checked={this.state.type==1?true:false} onChange={(checked)=>{
                                if(checked)
                                    this.setState({type:1})
                                else
                                    this.setState({type:0})
                            }}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const LayoutComponent =RankQuestionClassify;
const mapStateToProps = state => {
    return {
        tag_list:state.course.tag_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
