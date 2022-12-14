import React, { Component } from 'react';
import { Row ,Col, TabPane} from 'reactstrap';
import {Table,Tooltip, Tree, PageHeader,Tag,Checkbox,Tabs,DatePicker,Popconfirm,message,Pagination,Switch,Modal,Form,Card,Select ,Input,Button, Radio, InputNumber} from 'antd';
import {Link} from 'react-router-dom';
importÂ connectComponentÂ fromÂ '../../../util/connect';
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
                message.info('ææ¶æ²¡ææ°æ®')
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
        if(rule_name==''){ message.info('è¯·è¾å¥åç§°'); return; }
        if(checkedKeys.length==0){ message.info('è¯·éæ©åºå'); return; }
        if( 
            isNaN(input_less_fir)||
            isNaN(input_5_fir)||
            isNaN(input_5_sec)||
            isNaN(input_20_fir)||
            isNaN(input_20_sec)||
            isNaN(input_more_fir)||
            isNaN(input_more_sec)
        ){
            message.info('è¯·è¾å¥åæ³çæ°å­');return;
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
                message.success("æä½æå")
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
                message.success('æäº¤æå')
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
                region += ele.regionName+'ã'
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
                region += ele.props.title+'ã'

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
                    subTitle="è¿è´¹éç½®"
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
                                    <Button>æç´¢</Button>
                                    */}
                                </div>
                                {/* <div>
                                    <Button onClick={()=>{
                                        this.reset()
                                    }} >æ·»å è¿è´¹</Button>
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
                                showTotal:(total)=>'æ»å±'+total+'æ¡'
                            }}/>
                            </div>
                        </Card>
                    </Col>
                </Row>
                </PageHeader>
                </Card>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="å¾çé¢è§" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={10}
                    width={888}
					title={this.state.rule_id==0?"æ·»å è¿è´¹":'ä¿®æ¹'}
					visible={this.state.showAddPanel}
					okText="æäº¤"
					cancelText="å³é­"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showAddPanel:false })
                    }}
					onOk={this._onPublish}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form layout='vertical'>
                        <Form.Item label='åç§°'>
                            <Input
                                onChange={(e)=>{
                                    this.setState({ rule_name:e.target.value })
                                }}
                                placeholder='è¯·è¾å¥åç§°'
                                value={this.state.rule_name}
                            />
                        </Form.Item>
                        <Form.Item label='ééåºå'>
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
                            }}>è®¾ç½®åºå</Button> */}
                        </Form.Item>
                        <Form.Item label='è¿è´¹éç½®(åä½:å)' help={<a href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/33cb9886-86ad-4deb-87ca-d34f89cd30d9.xls'>è¿è´¹åèææ¡£</a>}>
                            <Table
                                pagination={false}
                                bordered
                                size="small"
                                columns={[
                                    {dataIndex:'1',key:'1',title:'0.5KGåä»¥ä¸',render:()=>(
                                        <InputNumber min={0} value={this.state.input_less_fir} onChange={input_less_fir=>this.setState({ input_less_fir })}/>
                                    )},
                                    {title:'0.5KG-5KG',children:[
                                        {dataIndex:'2',key:'2',title:'é¦é(å¬æ¤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_5_fir} onChange={input_5_fir=>this.setState({ input_5_fir })}/>
                                        )},
                                        {dataIndex:'2',key:'3',title:'ç»­é(å¬æ¤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_5_sec} onChange={input_5_sec=>this.setState({ input_5_sec })}/>
                                        )},
                                    ]},
                                    {title:'5KG-20KG',children:[
                                        {dataIndex:'2',key:'4',title:'é¦é(å¬æ¤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_20_fir} onChange={input_20_fir=>this.setState({ input_20_fir })}/>
                                        )},
                                        {dataIndex:'2',key:'5',title:'ç»­é(å¬æ¤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_20_sec} onChange={input_20_sec=>this.setState({ input_20_sec })}/>
                                        )},
                                    ]},
                                    {title:'20KGä»¥ä¸',children:[
                                        {dataIndex:'2',key:'6',title:'é¦é(å¬æ¤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_more_fir} onChange={input_more_fir=>this.setState({ input_more_fir })}/>
                                        )},
                                        {dataIndex:'2',key:'7',title:'ç»­é(å¬æ¤)',render:()=>(
                                            <InputNumber min={0} value={this.state.input_more_sec} onChange={input_more_sec=>this.setState({ input_more_sec })}/>
                                        )},
                                    ]}
                                ]}
                                dataSource={[1]}
                            />
                        </Form.Item>
                        {/* <Form.Item label='ç»ç®æ¹å¼'>
                            <Radio.Group value={this.state.stype}
                                onChange={e=>{
                                    if(e.target.value==1){
                                        this.setState({ first_weight:1 })
                                    }
                                    this.setState({ stype:e.target.value })
                                }}
                            >
                                <Radio value={0}>æéé</Radio>
                                <Radio value={1}>æä»¶æ°</Radio>
                            </Radio.Group>
                        </Form.Item> 
                        <Form.Item label={this.state.stype==1?'é¦ä»¶':'é¦é'}>
                            <InputNumber disabled={this.state.stype==1} min={0} max={800000} value={this.state.first_weight} onChange={val=>{this.setState({first_weight:val})}}/>
                            <span style={{padding:'0 10px'}}>{this.state.stype==1?'ä»¶':'KG'}</span>
                            <InputNumber min={0} max={800000} value={this.state.first_price} onChange={val=>{this.setState({first_price:val})}}/>
                            <span style={{padding:'0 10px'}}>å</span>
                        </Form.Item>
                        {this.state.stype===0?
                        <Form.Item label='ç»­é'>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_weight}
                                onChange={val=>{this.setState({added_weight:val})}}
                            />
                            <span style={{padding:'0 10px'}}>{this.state.stype===0?'KG':'ä»¶'}</span>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_price}
                                onChange={val=>{this.setState({added_price:val})}}
                            />
                            <span style={{padding:'0 10px'}}>å</span>
                        </Form.Item>
                        :
                        <Form.Item label='ç»­ä»¶'>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_number}
                                onChange={val=>{this.setState({added_number:val})}}
                            />
                            <span style={{padding:'0 10px'}}>{this.state.stype===0?'KG':'ä»¶'}</span>
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.added_number_price}
                                onChange={val=>{this.setState({added_number_price:val})}}
                            /><span style={{padding:'0 10px'}}>å</span>
                        </Form.Item>
                        } */}
                    </Form>
                </Modal>
                
                <Modal
                    zIndex={11}
					title="éæ©åºå"
					visible={this.state.showCity}
					okText="ç¡®å®"
					cancelText="å³é­"
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
        { title: 'åç§°', dataIndex: 'ruleName', key: 'ruleName' },
        { title: 'å°åº', dataIndex: 'ruleName', key: 'ruleName',render:(item,ele)=>{
            return <Tooltip trigger='click' title={ele.regions.map(_ele=>_ele.regionName).join("ï¼")}>æ¥çå°åº</Tooltip>
        }},
        // { title: 'ç±»å', dataIndex: 'stype', key: 'stype',render:(item,ele)=>ele.stype==1?'æä»¶æ°':'æéé' },
        {
            width: '250px',
            title: 'æä½',
            render: (item, ele, index) => (
                <div>               
                    <Button onClick={this.edit.bind(this,ele)} type="primary" size={'small'} className='m_2'>ä¿®æ¹</Button>
                    {/* <Popconfirm 
                        okText="ç¡®å®"
                        cancelText='åæ¶'
                        title='ç¡®å®å é¤åï¼'
                        onConfirm={this.onAction.bind(this,ele.ruleId)}
                    >
                        <Button type="danger" ghost size={'small'} className='m_2'>å é¤</Button>
                    </Popconfirm> */}
                </div>
            )
        }
    ]
}
constÂ LayoutComponentÂ =ExpressSetting;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        express_rule:state.mall.express_rule,
		user:state.site.user
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
