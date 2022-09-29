import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { Table, Icon,Upload,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import config from '../../config/config';
import {Button,Popconfirm} from '../../components/BtnComponent'

const { TabPane } = Tabs;
const {RadioGroup} = Radio;
const {Option} = Select;
const {Search} = Input;
const {RangePicker} = DatePicker
class GoodsType extends Component {
    state = {
        
        fileList:[],
        edit : true,
        view : true,
        visible: false,
        isView:false,
        title:'',

        status:0, 
        tag_id:'',
        tagName:'',
        ttype:0,
        keyword:'',
        previewImage:'',
        showImgPanel:false,
        showRefund:false,
        showOrderEdit:false,
        showOrderView:false,
        showPost:false,
        showAddPanel:false,
        showEditPanel:false,

        activeTab:'1',
        title:'添加类型'
    };
    data_list = []
    page_total=0
    page_current=1
    page_size=12

    getGoodsType = ()=>{
        const {actions} = this.props
        actions.getGoodsType({
            
        })
    }
    componentWillMount() {
        this.getGoodsType()
    }
    componentWillReceiveProps(n_props) {
       
        if (n_props.goods_type_list !== this.props.goods_type_list) {
            if (n_props.goods_type_list.length == 0) {
                // message.info('暂时没有数据')
            } else {
                this.data_list = n_props.goods_type_list
            }
        }

    }

    _onAction = (type_id,action)=>{
        const {actions} = this.props
        actions.actionGoodsType({
            type_id,
            action,
            resolved:()=>{
                message.success('提交成功')
                this.getGoodsType()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val) => {
        this.page_current = 1
        this.setState({ keyword: val },()=>{
            this.getGoodsType()
        })
    }
    _onPublish = () => {
        const { actions } = this.props
        const { 
            type_id,
            name
         } = this.state

        // if(sortOrder > 127){ message.info('排序不能大于127'); return; }
        actions.publishGoodsType({
            type_id,
            type_name:name,
            resolved: () => {
                this.handleCancel()
                message.success("操作成功")
                this.getGoodsType()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    showModal(txt, index) {
        let is_view = false
        if (txt) {
            if (txt == "查看") {
                is_view = true
            }
            this.setState({
                
            })
        } else {
            this.setState({
                editTitle: '添加品牌',
                isView: false,
                visible: true,
                categoryId: '0',
                categoryName: '',
                sortOrder: 0,
                status: '0',
                is_must: 0,
                iconList: []
            })
        }
    };
    handleCancel = () => {
        this.setState({
            showAddPanel: false,
        });
    };
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
    render(){
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="商品类型管理">
                        
                            <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">
                               
                                <div className='flex f_row align_items'>
                                    {/*<Search
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />&nbsp;
                                    <Button>搜索</Button>*/}
                                </div>
                               
                                <div>
                                    <Button value='goodsType/add' onClick={()=>{
                                        this.setState({
                                            showAddPanel:true,
                                            name:'',
                                            title:'添加类型',
                                            type_id:0
                                        })
                                    }}>添加类型</Button>
                                </div>
                            </div>
                            <Table expandIcon={() => null} rowKey='typeId' columns={this.col} dataSource={this.data_list}  pagination={false}/>
                            </div>
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
                <Modal
                    zIndex={90}
					title={this.state.title}
					visible={this.state.showAddPanel}
					okText="确定"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showAddPanel:false })
                    }}
					onOk={this._onPublish}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form labelCol={{span:4}} wrapperCol={{span:18}}>
                        <Form.Item label='名称'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ name:e.target.value })
                                }}
                                placeholder=''
                                value={this.state.name}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    col = [
        { title: 'ID', dataIndex: 'typeId', key: 'typeId',width:100 },
        { title: '类型名称', dataIndex: 'typeName', key: 'typeName' },
        { title: '状态', dataIndex: 'status', key: 'status',render:(item,ele)=>ele.status==1?'已启用':'未启用' },
        {   
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    <Button value='goodsType/edit' className='m_2' onClick={this._onAction.bind(this, ele.typeId, 'status')} type={ele.status == 1 ? "danger" : "primary"} size={'small'} >{ele.status == 1 ? '禁用' : '启用'}</Button>
                    <Button value='goodsType/rule' onClick={()=>{
                        this.props.history.push('/mall/goods-type/rull/'+ele.typeId)
                    }} type="primary" size={'small'} className='m_2'>商品规则</Button>
                    <Button value='goodsType/edit' onClick={()=>{
                        this.setState({showAddPanel:true,title:'修改', name:ele.typeName,type_id:ele.typeId})
                    }} type="primary" size={'small'} className='m_2'>修改</Button>
                    <Popconfirm
                        value='goodsType/del' 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this._onAction.bind(this, ele.typeId, 'delete')}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]
}

const LayoutComponent =GoodsType;
const mapStateToProps = state => {
    return {
        goods_type_list:state.mall.goods_type_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
