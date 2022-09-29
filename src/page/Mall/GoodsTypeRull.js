import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { Table,PageHeader,Icon,Upload,Tag,Checkbox,Tabs,DatePicker,Popconfirm,message,Pagination,Switch,Modal,Form,Card,Select ,Input,Button, Radio} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import config from '../../config/config';

const { TabPane } = Tabs;
const {RadioGroup} = Radio;
const {Option} = Select;
const {Search} = Input;
const {RangePicker} = DatePicker
class GoodsTypeRull extends Component {
    state = {
        edit:'添加',
        attr_id: 0,
        name: '',
        atype: 1,
        itype: 1,
        values: '',
    };
    data_list = []
    page_total=0
    page_current=1
    page_size=12
    type_id = 0

    getGoodsTypeRull = ()=>{
        const {actions} = this.props
        const {keyword} = this.state
        const type_id = this.type_id
        actions.getGoodsTypeRull({
            type_id, keyword, page: this.page_current-1 ,pageSize:this.page_size
        })
    }
    componentWillMount() {
        this.type_id = this.props.match.params.id
        this.getGoodsTypeRull()
    }
    componentWillReceiveProps(n_props) {
        
        if (n_props.goods_type_rull !== this.props.goods_type_rull) {

            console.log(n_props.goods_type_rull)
    
            if (n_props.goods_type_rull.data.length == 0) {
                message.info('暂时没有数据')
            } else {
                this.data_list = n_props.goods_type_rull.data
                this.page_current = n_props.goods_type_rull.page+1
                this.page_total = n_props.goods_type_rull.total
            }
        }

    }

    _onAction = (action,attr_id)=>{
        const {actions} = this.props
        actions.actionGoodsTypeRull({
            attr_id,
            action,
            resolved:()=>{
                message.success('提交成功')
                this.getGoodsTypeRull()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSearch = (val) => {
        this.page_current = 1
        this.setState({ keyword: val },()=>{
            this.getGoodsTypeRull()
        })
    }
    _onPublish = () => {
        const { actions } = this.props
        let { 
            attr_id,
            atype,
            itype,
            values,
            name,
         } = this.state

        let type_id = this.type_id

        if(name == ''){ message.info('请输入名称'); return; }
        if(values == ''){ message.info('请填写列表'); return; }
        
        values = values.replace(/\r\n/g, '|||').replace(/\n/g, '|||')

        actions.publishGoodsTypeRull({
            attr_id,
            type_id,
            atype,
            itype,
            values,
            name,
            resolved: () => {
                this.handleCancel()
                message.success("操作成功")
                this.getGoodsTypeRull()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    handleCancel = ()=>{
        this.setState({ showAddPanel:false })
    }
    render(){
        const { 
            status, 
            tag_id,
            tagName,
            ttype,
        } = this.state

        const uploadButtonImg = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );
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
        const formItemLayoutPanel = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card>
                        <PageHeader
                            className="pad_0"
                            ghost={false}
                            onBack={() => window.history.back()}
                            title=""
                            subTitle="商品类型规则"
                        >
                            <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">
                               
                                <div className='flex f_row align_items'>
                                   {/* <Search
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />&nbsp;
                                    <Button>搜索</Button>*/}
                                </div>
                               
                                <div>
                                    <Button onClick={()=>{
                                        this.setState({
                                            attr_id:'',
                                            showAddPanel:true,
                                            name:'',
                                            values:'',
                                            edit:'添加属性'
                                        })
                                    }}>添加属性</Button>
                                </div>
                            </div>
                            <Table expandIcon={() => null} rowKey='attrId' columns={this.col} dataSource={this.data_list}  pagination={{
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    onChange: (val)=>{
                                        this.page_current = val
                                        this.getGoodsTypeRull()
                                    },
                                    showTotal:(total)=>'总共'+total+'条'
                            }}/>
                            </div>
                            
                            </PageHeader>
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
                <Modal
                    zIndex={90}
					title={this.state.edit}
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
                    <Form {...formItemLayout}>
                        <Form.Item label='名称'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ name:e.target.value })
                                }}
                                placeholder=''
                                value={this.state.name}
                            />
                        </Form.Item>
                        <Form.Item label='属性'>
                            <Radio.Group disabled defaultValue={0}>
                                <Radio value={0}>单选属性</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='填写列表'>
                            <Input.TextArea
                                autoSize={{minRows:4}}
                                onChange={(e)=>{
                                    console.log(e.target.value)
                                    this.setState({ values: e.target.value })
                                }}
                                placeholder=''
                                value={this.state.values}
                            />&nbsp;每个值一行，每行中间请勿夹杂空格
                        </Form.Item>
                    </Form>
                </Modal>
                
            </div>
        )
    }
    col = [
        { title: 'ID', dataIndex: 'attrId', key: 'attrId',width:100 },
        { title: '属性名', dataIndex: 'name', key: 'name' },
        { title: '类型', dataIndex: 'atype', key: 'atype',render:(item,ele)=>ele.atype==0?'单一属性':ele.atype==1?'单选属性':'多选属性' },
        {   
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>
                    <Button onClick={()=>{
                         message.info({content:'提示：修改规则会删除已绑定该类型的商品库存'})
                        this.setState({
                            edit:'修改属性',
                            attr_id:ele.attrId,
                            name:ele.name,
                            values:ele.valueList.join("\n"),
                            showAddPanel:true
                        })
                    }} type="primary" size={'small'} className='m_2'>修改</Button>
                    <Popconfirm 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this._onAction.bind(this,'delete',ele.attrId)}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2' onClick={()=>{ message.info({content:'提示：删除规则会删除已绑定该类型的商品库存'})}}>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]
}
const LayoutComponent =GoodsTypeRull;
const mapStateToProps = state => {
    return {
        goods_type_rull:state.mall.goods_type_rull,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
