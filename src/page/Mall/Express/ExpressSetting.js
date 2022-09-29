import React, { Component } from 'react';
import { Row ,Col, TabPane} from 'reactstrap';
import {Table,Tooltip, Tree, PageHeader,Tag,Checkbox,Tabs,DatePicker,Popconfirm,message,Pagination,Switch,Modal,Form,Card,Select ,Input,Button, Radio, InputNumber} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import { pca, pcaa } from 'area-data';

const {RadioGroup} = Radio;
const {Option} = Select;
const {Search} = Input;
const {RangePicker} = DatePicker
const { TreeNode } = Tree;
class ExpressSetting extends Component {
    state = {
            
        edit : true,
        view : true,
        visible: false,
        isView:false,

        
        previewImage:'',
        showImgPanel:false,
        
        showAddPanel:false,
        showEditPanel:false,
        showCity:false,
        payType:0,
        region:'',

        activeTab:'1',

        treeData: [],
        checkedKeys:[],

        warehouse_id:'',
        rule_id:0,
        shipping_id:0,
        shipping_url:'',
        status:1,
        rule_name:'',
    
        rule_status:0,
     
        city_ids:'',
        config:[],

        input_less_fir: 0,
        input_5_fir: 0,
        input_5_sec: 0,
        input_20_fir: 0,
        input_20_sec: 0,
        input_more_fir: 0,
        input_more_sec: 0,

    };
    express_rule = []
    page_total=0
    page_current=1
    page_size=12

    componentDidMount(){
        const {actions} = this.props

        actions.getRegion({
            region_id: '',
            region_type: 1,
            resolved:(data)=>{
                let treeData = []
                data.map(ele=>{
                    let item = {}
                    item.title = ele.regionName
                    item.key = ele.regionId
                    treeData.push(item)
                })
                console.log(treeData)
                this.setState({ treeData })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    componentWillMount(){
        this.shipping_id = this.props.match.params.id
        console.log(this.shipping_id)
        this.getExpressRull()
    }
    componentWillReceiveProps(n_props){
        
        if(n_props.express_rule !==this.props.express_rule){
            if(n_props.express_rule.length == 0){
                message.info('暂时没有数据')
            }
            
            this.express_rule = n_props.express_rule
            console.log(this.express_rule)
        }
    }
    _onPublish = ()=>{
        const {actions} = this.props
        let { 
            rule_id,
            rule_name,
            rule_status,
            checkedKeys,

            input_less_fir,
            input_5_fir,
            input_5_sec,
            input_20_fir,
            input_20_sec,
            input_more_fir,
            input_more_sec,

        } = this.state
        const city_ids = checkedKeys.join(',')
        if(rule_name==''){ message.info('请输入名称'); return; }
        if(checkedKeys.length==0){ message.info('请选择区域'); return; }
        if( 
            isNaN(input_less_fir)||
            isNaN(input_5_fir)||
            isNaN(input_5_sec)||
            isNaN(input_20_fir)||
            isNaN(input_20_sec)||
            isNaN(input_more_fir)||
            isNaN(input_more_sec)
        ){
            message.info('请输入合法的数字');return;
        }
        const cfg = {
            "0.5": {fir: input_less_fir, sec: "0"},
            "0.5|5.0": {fir: input_5_fir, sec: input_5_sec},
            "5.0|20.0": {fir: input_20_fir, sec: input_20_sec},
            "20.0|*": {fir: input_more_fir, sec: input_more_sec}
        }
        actions.publishExpressRull({
            rule_id,
            rule_status,
            city_ids,
            cfg: JSON.stringify(cfg),
            rule_name,
            resolved:()=>{
                this.handleCancel()
                message.success("操作成功")
                this.getExpressRull()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    reset = ()=>{
        this.setState({
            showAddPanel:true,
            region:'',
            checkedKeys:[],
            warehouse_id:'',
            city_ids:'',
            rule_id:0,
            status:1,
            is_default:0,
            rule_name:'',
            first_price:'',
            added_weight:'',
            added_price:'',
            added_number_price:'',
            rule_status:0,
            stype:0,
            first_weight:'',
            added_number:'',
        })
    }
    onAction(rule_id){
        const {actions} = this.props
        actions.actionExpressRull({
            rule_id,
            resolved:()=>{
                message.success('提交成功')
                this.getExpressRull()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    edit(item){
        let config = {
            "0.5": {fir: "6.4", sec: "0"},
            "0.5|5.0": {fir: "11.2", sec: "4"},
            "5.0|20.0": {fir: "11.2", sec: "4"},
            "20.0|*": {fir: "11.2", sec: "4"}
        }
        if(item.cfg){
            let tmp = JSON.parse(item.cfg)
            config = Object.assign(config,tmp)
        }
        console.log(config)
        
        let input_less_fir = 0
        let input_5_fir = 0
        let input_5_sec = 0
        let input_20_fir = 0
        let input_20_sec = 0
        let input_more_fir = 0
        let input_more_sec = 0
        let checkedKeys = []
        let region = ''

        if(Object.keys(config["0.5"]).indexOf('fir') > -1){
            input_less_fir = config['0.5']['fir']
            input_5_fir = config['0.5|5.0']['fir']
            input_5_sec = config['0.5|5.0']['sec']
            input_20_fir = config['5.0|20.0']['fir']
            input_20_sec = config['5.0|20.0']['sec']
            input_more_fir = config['20.0|*']['fir']
            input_more_sec = config['20.0|*']['sec']
        }
        item.regions.map((ele,index)=>{
            if(index === item.regions.length-1)
                region += ele.regionName
            else
                region += ele.regionName+'、'
            if(checkedKeys.indexOf(ele.parentId)===-1){
                checkedKeys.push(ele.parentId)
            }
            checkedKeys.push(ele.regionId)
        })
        this.setState({

            input_less_fir,
            input_5_fir,
            input_5_sec,
            input_20_fir,
            input_20_sec,
            input_more_fir,
            input_more_sec,
            
            region:region,
            checkedKeys: checkedKeys,
            status: item.status,
            showAddPanel: true,
            rule_id:item.ruleId,
            rule_name: item.ruleName,
            warehouse_id: item.warehouseId
        })
    }
    getExpressRull = ()=>{
        const {actions} = this.props
        actions.getExpressRull({
            shipping_id:this.shipping_id
        })
    }
    onCheck = (checkedKeys,e) => {
        let region = ''
        let length = e.checkedNodes.length-1
        e.checkedNodes.map((ele,index)=>{
            if(index === length)
                region += ele.props.title
            else
                region += ele.props.title+'、'

        })
        console.log(checkedKeys)
        this.setState({ checkedKeys,region });
    };
    onLoadData = treeNode =>new Promise(resolve => {
        const {actions} = this.props
        if (treeNode.props.children) {
            resolve();
            return;
        }
        
        // actions.getRegion({
        //     region_id: treeNode.props.eventKey,
        //     region_type: 2,
        //     resolved:(data)=>{
        //         console.log(data)
        //         let subTreeData = []
        //         data.map(ele=>{
        //             let item = {}
        //             item.title = ele.regionName
        //             item.key = ele.regionId
        //             item.isLeaf = true
        //             subTreeData.push(item)
        //         })

        //         treeNode.props.dataRef.children = subTreeData
        //         let treeData = [...this.state.treeData]
        //         this.setState({
        //             treeData
        //         });
        //         resolve()
        //     },
        //     rejected:(data)=>{
        //         message.error(data)
        //     }
        // })
    });
    renderTreeNodes = data =>
        data.map(item => {
        if (item.children) {
            return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode key={item.key} {...item} dataRef={item} />;
    })
    
    _onPage = (val)=>{
  
    }
    _onSearch = (val)=>{
        this.setState({
            keyword:val
        },()=>{
            this.getExpressRull()
        })
    }
    
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
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 19 },
                sm: { span: 19 },
            },
        };
        return(
            <div className="animated fadeIn">
                <Card>
                <PageHeader
                    className="pad_0"
                    ghost={false}
                    onBack={() => window.history.back()}
                    title=""
                    subTitle="运费配置"
                >
                <Row>
                    <Col xs="12">
                        <Card title="">
                            <div style={{minHeight:'400px'}}>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    {/*
                                    <Search
                                        placeholder=''
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />&nbsp;
                                    <Button>搜索</Button>
                                    */}
                                </div>
                                {/* <div>
                                    <Button onClick={()=>{
                                        this.reset()
                                    }} >添加运费</Button>
                                </div> */}
                            </div>
                            <Table expandIcon={() => null} rowKey='ruleId' columns={this.col} dataSource={this.express_rule} pagination={{
                                current: this.page_current,
                                pageSize: this.page_size,
                                total: this.page_total,
                                showQuickJumper:true,
                                onChange: (val)=>{
                                    this.page_current = val
                                    this.getExpressRull()
                                },
                                showTotal:(total)=>'总共'+total+'条'
                            }}/>
                            </div>
                        </Card>
                    </Col>
                </Row>
                </PageHeader>
                </Card>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={10}
                    width={888}
					title={this.state.rule_id==0?"添加运费":'修改'}
					visible={this.state.showAddPanel}
					okText="提交"
					cancelText="关闭"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showAddPanel:false })
                    }}
					onOk={this._onPublish}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form layout='vertical'>
                        <Form.Item label='名称'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ rule_name:e.target.value })
                                }}
                                placeholder='请输入名称'
                                value={this.state.rule_name}
                            />
                        </Form.Item>
                        <Form.Item label='配送区域'>
                            <Input.TextArea
                                disabled={true}
                                autoSize={{minRows:1}}
                                onChange={(e)=>{
                                    this.setState({region:e.target.value})
                                }}
                                placeholder=''
                                value={this.state.region}
                            />
                            {/* <Button onClick={()=>{
                                this.setState({ showCity:true })
                            }}>设置区域</Button> */}
                        </Form.Item>
                        <Form.Item label='运费配置(单位:元)' help={<a href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/33cb9886-86ad-4deb-87ca-d34f89cd30d9.xls'>运费参考文档</a>}>
                            <Table
                                pagination={false}
                                bordered
                                size="small"
                                columns={[
                                    {dataIndex:'1',key:'1',title:'0.5KG及以下',render:()=>(
                                        <InputNumber min={0} value={this.state.input_less_fir} onChange={input_less_fir=>this.setState({ input_less_fir })}/>
                                    )},
                                    {title:'0.5KG-5KG',children:[
                                        {dataIndex:'2',key:'2',title:'首重(公斤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_5_fir} onChange={input_5_fir=>this.setState({ input_5_fir })}/>
                                        )},
                                        {dataIndex:'2',key:'3',title:'续重(公斤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_5_sec} onChange={input_5_sec=>this.setState({ input_5_sec })}/>
                                        )},
                                    ]},
                                    {title:'5KG-20KG',children:[
                                        {dataIndex:'2',key:'4',title:'首重(公斤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_20_fir} onChange={input_20_fir=>this.setState({ input_20_fir })}/>
                                        )},
                                        {dataIndex:'2',key:'5',title:'续重(公斤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_20_sec} onChange={input_20_sec=>this.setState({ input_20_sec })}/>
                                        )},
                                    ]},
                                    {title:'20KG以上',children:[
                                        {dataIndex:'2',key:'6',title:'首重(公斤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_more_fir} onChange={input_more_fir=>this.setState({ input_more_fir })}/>
                                        )},
                                        {dataIndex:'2',key:'7',title:'续重(公斤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_more_sec} onChange={input_more_sec=>this.setState({ input_more_sec })}/>
                                        )},
                                    ]}
                                ]}
                                dataSource={[1]}
                            />
                        </Form.Item>
                        {/* <Form.Item label='结算方式'>
                            <Radio.Group value={this.state.stype}
                                onChange={e=>{
                                    if(e.target.value==1){
                                        this.setState({ first_weight:1 })
                                    }
                                    this.setState({ stype:e.target.value })
                                }}
                            >
                                <Radio value={0}>按重量</Radio>
                                <Radio value={1}>按件数</Radio>
                            </Radio.Group>
                        </Form.Item> 
                        <Form.Item label={this.state.stype==1?'首件':'首重'}>
                            <InputNumber disabled={this.state.stype==1} min={0} max={800000} value={this.state.first_weight} onChange={val=>{this.setState({first_weight:val})}}/>
                            <span style={{padding:'0 10px'}}>{this.state.stype==1?'件':'KG'}</span>
                            <InputNumber min={0} max={800000} value={this.state.first_price} onChange={val=>{this.setState({first_price:val})}}/>
                            <span style={{padding:'0 10px'}}>元</span>
                        </Form.Item>
                        {this.state.stype===0?
                        <Form.Item label='续重'>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_weight}
                                onChange={val=>{this.setState({added_weight:val})}}
                            />
                            <span style={{padding:'0 10px'}}>{this.state.stype===0?'KG':'件'}</span>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_price}
                                onChange={val=>{this.setState({added_price:val})}}
                            />
                            <span style={{padding:'0 10px'}}>元</span>
                        </Form.Item>
                        :
                        <Form.Item label='续件'>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_number}
                                onChange={val=>{this.setState({added_number:val})}}
                            />
                            <span style={{padding:'0 10px'}}>{this.state.stype===0?'KG':'件'}</span>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_number_price}
                                onChange={val=>{this.setState({added_number_price:val})}}
                            /><span style={{padding:'0 10px'}}>元</span>
                        </Form.Item>
                        } */}
                    </Form>
                </Modal>
                
                <Modal
                    zIndex={11}
					title="选择区域"
					visible={this.state.showCity}
					okText="确定"
					cancelText="关闭"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showCity:false })
                    }}
					onOk={()=>{
                        this.setState({ showCity:false })
                    }}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Tree
                        checkable
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        // loadData={this.onLoadData}
                    >
                        {this.renderTreeNodes(this.state.treeData)}
                    </Tree>
                </Modal>
            </div>
        )
    }
    col = [
        { title: 'ID', dataIndex: 'ruleId', key: 'ruleId' },
        { title: '名称', dataIndex: 'ruleName', key: 'ruleName' },
        { title: '地区', dataIndex: 'ruleName', key: 'ruleName',render:(item,ele)=>{
            return <Tooltip trigger='click' title={ele.regions.map(_ele=>_ele.regionName).join("，")}>查看地区</Tooltip>
        }},
        // { title: '类型', dataIndex: 'stype', key: 'stype',render:(item,ele)=>ele.stype==1?'按件数':'按重量' },
        {
            width: '250px',
            title: '操作',
            render: (item, ele, index) => (
                <div>               
                    <Button onClick={this.edit.bind(this,ele)} type="primary" size={'small'} className='m_2'>修改</Button>
                    {/* <Popconfirm 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.onAction.bind(this,ele.ruleId)}
                    >
                        <Button type="danger" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm> */}
                </div>
            )
        }
    ]
}
const LayoutComponent =ExpressSetting;
const mapStateToProps = state => {
    return {
        express_rule:state.mall.express_rule,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
