import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Empty,PageHeader,Switch,Modal,Form,Card,Select ,Input, message} from 'antd';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import {Button,Popconfirm} from '../../../components/BtnComponent'

const {Search} = Input;

class FeedbackClassify extends Component {
    state = {
        edit : true,
        view : true,

        visible: false,
        ctype:'',
		cctype:'',
		category_id:'',
		category_name:'',
		sort_order:'',
		status:''
    };
    feed_cate_list = []

    componentDidMount(){
        const {actions} = this.props
        actions.getFeedCate({
            ctype:9,
            pageSize:40000
        })
    }

	componentWillReceiveProps(n_props) {
		if (n_props.feed_cate_list !== this.props.feed_cate_list) {
			this.feed_cate_list = n_props.feed_cate_list.data
		}
    }
    _onPublish = ()=>{
        const {
            category_name,
        } = this.state
        const {actions} = this.props

        if(!category_name){
            message.info('请输入类型名称')
            return
        }
        if(this.feed_cate_list.find(ele=>ele.categoryName==category_name)){
            message.info('该类型已存在')
            return
        }
        actions.publishFeedCate({
            category_name,
            resolved:(data)=>{
                message.success("操作成功")
                actions.getFeedCate({
                    ctype:9,
                    pageSize:40000
                })
                this.setState({
                    visible: false,
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })

    }
    _onStatus(id){
        const {actions} = this.props

        actions.updateFeedCate({
            category_id:id,action:'status',
            resolved:(data)=>{
                message.success("操作成功")
                actions.getFeedCate({
                    ctype:9,
                    pageSize:40000
                })
                this.setState({
                    visible: false,
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val)=>{

        const {actions} = this.props
        actions.getFeedCate({
            keyword:val,
            ctype:9,
            pageSize:40000
        })
    }
    _onDelete(id){
        const {actions} = this.props

        actions.updateFeedCate({
            category_id:id,action:'delete',
            resolved:(data)=>{
                message.success("操作成功")
                actions.getFeedCate({
                    ctype:9,
                    pageSize:40000
                })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    showModal = () => {
        this.setState({
            category_name:'',
            visible: true,
        });
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
        return(
            <div className="animated fadeIn">
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    subTitle="反馈类型分类"
                >
                <Row>
                    <Col xs="12">
                        <Card style={{minHeight:'400px'}} bodyStyle={{padding:"10px"}}>
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />
                                </div>
                                <div>
                                    <Button value='feedbackClassify/add' onClick={this.showModal}>添加类型</Button>
                                </div>
                            </div>
                            <Table responsive size="sm">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>问题类型</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.feed_cate_list.length==0?
                                    <tr>
                                        <td colSpan={3}>
                                            <Empty className='mt_20 mb_10' description='暂时没有数据'></Empty>
                                        </td>
                                    </tr>
                                    :this.feed_cate_list.map((ele,index)=>
                                    <tr key={ele.categoryId}>
                                        <td>{ele.categoryId}</td>
                                        <td>{ele.categoryName}</td>
                                        <td style={{width:'200px'}}>
                                            <div>
                                                <Button value='feedbackClassify/edit' onClick={this._onStatus.bind(this,ele.categoryId)} type={ele.status==1?'primary':''} size={'small'}>{ele.status==1?'禁用':'解禁'}</Button>&nbsp;
                                                <Popconfirm
                                                    value='feedbackClassify/del'
                                                    okText="确定"
                                                    cancelText="取消"
                                                    title="确定删除吗？"
                                                    onConfirm={this._onDelete.bind(this,ele.categoryId)}
                                                >
                                                    <Button type="danger" ghost size={'small'}>删除</Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
                </PageHeader>
                <Modal
                    title="添加类型"
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    onOk={this._onPublish}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="类型名称">
                            <Input 
                                value={this.state.category_name} 
                                placeholder="输入类型名称"
                                onChange={e=>{
                                    this.setState({
                                        category_name:e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = FeedbackClassify;
const mapStateToProps = state => {
    return {
        feed_cate_list:state.dashboard.feed_cate_list,
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});