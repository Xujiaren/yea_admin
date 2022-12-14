import React, { Component } from 'react';
import {Table, CardBody, CardHeader, Col, Row} from 'reactstrap';
import {Spin,Card,Table as TableAntd,Form,Tabs,Modal,Card as CardAntd,DatePicker,Affix,Pagination, Tag,Menu, Dropdown, Icon, message,Input, InputNumber, Select, Radio, Checkbox,} from 'antd';

importÂ connectComponentÂ fromÂ '../../../util/connect';
import moment from 'moment'
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import InventoryGoodsBox from '../../../components/InventoryGoodsBox'
import AntdOssUpload from '../../../components/AntdOssUpload'
import {Button,Popconfirm} from '../../../components/BtnComponent'

const { TabPane } = Tabs;
const { Search,TextArea } = Input;
const {RangePicker} = DatePicker
class InventoryTransport extends Component {

	state = {
		edit : true,
    	view : true,
        hot_index:[],

        h_search_val:'',

        hot_tags: [],
        inputVisible: false,
		inputValue: '',
        
        showApply:false,
        showReview:false,
        editIndex:-1,
        editNum:200,

        itype:'0',
        status:-1,
        begin_time:'',
        end_time:'',
        aTime:null,
        keyword:'',
        inventory_id:'',
        selectedRowKeys:[],
        goodslist:[],
        targetKeys:[],
        
        showEditPanel:false,

        inventory_id:0,
        remark:'',
        showExcel:false,
        url:'',
        importLoading:false,
	};
    sen_list = {}
    data_list = []
    page_total=0
    page_current=1
    page_size=10


	componentDidMount(){
        this.getInventory()
	}
	componentWillMount(){
        
    }
	componentWillReceiveProps(n_props){
        if(n_props.inventory !== this.props.inventory){
            this.data_list = n_props.inventory.data
            this.page_current = n_props.inventory.page+1
            this.page_total = n_props.inventory.total
        }
    }
    importInventory = ()=>{
        this.setState({ importLoading:true })

        const {actions} = this.props
        const {itype} = this.state
        const fileUrl = this.excelFile.getValue()

        if(fileUrl==''){ message.info('è¯·ä¸ä¼ excelæä»¶'); this.setState({importLoading:false}); return; }
        actions.importInventory({
            itype,
            fileUrl,
            resolved:(data)=>{
                message.success('æäº¤æå')
                this.setState({showImportPanel:false,importLoading:false})
            },
            rejected:(data)=>{
                message.error(data)
                this.setState({importLoading:false})
            }
        })
    }
    exportInventory(action){
        this.setState({ loading:true })
        const {actions} = this.props
        const {selectedRowKeys,itype} = this.state
        // if(selectedRowKeys.length==0){
        //     if(action == 'print'){
        //         message.info('è¯·åéæ©é¡¹ç®å æå°')
        //     }else{
        //         message.info('è¯·åéæ©é¡¹ç®å å¯¼åº')
        //     }
        //     return
        // }
        
        actions.exportInventory({
            inventory_ids:selectedRowKeys.join(','),
            itype:itype,
            resolved:(data)=>{
                const {fileName,adress,name} = data
                let url = fileName||adress||name
                if(action == 'print'){
                    this.setState({ showExcel:true, url:'https://view.officeapps.live.com/op/view.aspx?src='+url })
                }else{
                    message.success('å¯¼åºæå')
                    this.setState({ loading:false },()=>{window.open(url,'_black')})
                }
               
            },
            rejected:(data)=>{
                this.setState({ loading:false })
                message.error(data)
            }
        })
    }
    actionInventoryAll(action,status){
        const {actions} = this.props
        const {selectedRowKeys} = this.state
        if(selectedRowKeys.length==0){ message.info('è¯·éæ©éé¡¹');return; }
        let inventory_id = selectedRowKeys.join(',')
        actions.actionInventory({
            action,
            status,
            remark:'',
            inventory_id,
            resolved:()=>{
                this.getInventory()
            },
            rejected:(data)=>{
                message.info(data)
            }
        })
    }
    actionInventory(action,status){
        const {
            inventory_id,
            remark,
        } = this.state
        const {actions} = this.props

        actions.actionInventory({
            action,
            status,
            remark,
            inventory_id,
            resolved:()=>{
                this.setState({ showTopicPannel:false,remark:'' })
                this.getInventory()
            },
            rejected:(data)=>{
                message.info(data)
            }
        })
    }
    getInventory = ()=>{
        const {
            keyword,
            itype,
            status,
            begin_time,
            end_time,
            page,
            pageSize
        } = this.state
        const {actions} = this.props
        actions.getInventory({
            inventory_id:'',
            keyword,
            itype,
            status,
            begin_time,
            end_time,
            page: this.page_current-1,
            pageSize: this.page_size
        })
    }

    goods_info = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId',width: 100 },
        { title: 'è´§å·', dataIndex: 'goodsSn', key: 'goodsSn',width: 100 },
        { title: 'åç§°', dataIndex: 'goodsName', key: 'goodsName', ellipsis:true},
        { title: 'æ°é', dataIndex: 'number', key: 'number',},
    ]
    topicDetail = (record)=>{
        console.log(record)
        return(<TableAntd columns={this.goods_info} dataSource={record.goodsInventoryMaps} pagination={false} />)
    }
    _onPage = (val)=>{
        this.page_current = val
        this.getInventory()
    }
	render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 20 },
            },
        };
        const {
            editNum,

            aTime,
            itype,
            status,
            begin_time,
            end_time,
            keyword,
            inventory_id,
            selectedRowKeys,
            importLoading,
        } = this.state
		return (
		<div className="animated fadeIn">
            <Row>
                <Col xs="12">
                <Tabs onChange={val=>{
                    this.setState({itype:val,selectedRowKeys:[]},()=>{
                        this.page_current = 1
                        this.getInventory()
                    })
                }} activeKey={this.state.itype}>
                    <TabPane tab="å¥åº" key={'0'}>
                        <CardAntd>
                        <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Select className='m_2' value={status} style={{width:200}} onChange={val=>{
                                        this.setState({ status:val })
                                    }}>
                                        <Select.Option value={-1}>ææç¶æ</Select.Option>
                                        <Select.Option value={0}>ç­å¾å®¡æ ¸</Select.Option>
                                        <Select.Option value={1}>å®¡æ ¸éè¿</Select.Option>
                                        <Select.Option value={2}>æç»</Select.Option>
                                        <Select.Option value={3}>æ¥åº</Select.Option>
                                    </Select>
                                    <DatePicker.RangePicker disabledDate={(val)=>val > moment().subtract(0, 'day')} format='YYYY-MM-DD' allowClear={true} value={this.state.aTime} locale={locale} onChange={(date,dateString)=>{
                                        this.setState({
                                            aTime:date,
                                            begin_time:dateString[0],
                                            end_time:dateString[1]
                                        })
                                    }} />
                                     <Search
                                        placeholder='æµæ°´å·'
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                        onChange={(e)=>this.setState({ keyword:e.target.value })}
                                    />&nbsp;
                                    <Button onClick={()=>{ this.page_current = 1; this.getInventory() }}>æç´¢</Button>
                                </div>
                                <div>
                                    <Button value='inventoryTran/apply' className='m_2' onClick={()=>{ 
                                        this.props.history.push('/mall/inventory-transport/apply/0')
                                     }}>
                                         å¥åºç³è¯·
                                    </Button>
                                    <Button value='inventoryTran/in' className='m_2' onClick={()=>{
                                        this.setState({showImportPanel:true,})}
                                    }>å¯¼å¥</Button>
                                </div>
                            </div>
                            <div className='mb_10'>
                                <Popconfirm
                                    value='inventoryTran/check'
                                    title='æ¯å¦å®¡æ ¸éè¿ï¼'
                                    okText='éè¿'
                                    cancelText='æç»'
                                    onConfirm={this.actionInventoryAll.bind(this,'status','1')}
                                    onCancel={this.actionInventoryAll.bind(this,'status','2')}
                                >
                                    <Button className='m_2' size='small'>å®¡æ¹</Button>
                                </Popconfirm>
                                <Button value='inventoryTran/baofei' className='m_2' size='small' onClick={this.actionInventoryAll.bind(this,'scrapped','0')}>æ¥åº</Button>
                                <Button value='inventoryTran/print' className='m_2' size='small' onClick={this.exportInventory.bind(this,'print')}>æ¹éæå°å¥åºå</Button>
                                <Button value='inventoryTran/out' className='m_2' size='small' onClick={this.exportInventory.bind(this,'')}>å¯¼åº</Button>
                            </div>
                            <TableAntd
                                rowKey='inventoryId'
                                columns={this.topic_column}
                                expandedRowRender={this.topicDetail}
                                rowSelection={{selectedRowKeys:selectedRowKeys,onChange:(value)=>{ this.setState({ selectedRowKeys:value }) }}}
                                dataSource={this.data_list}
                                pagination={{
                                    position: 'bottom',
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    onChange: this._onPage,
                                    showTotal:(total)=>'æ»å±'+total+'æ¡',
                                    onShowSizeChange:(val)=>{console.log(val)}
                                }}
                            />
                        </div>
                        </CardAntd>
                    </TabPane>
                    <TabPane tab="åºåº" key={'1'}>
                        <CardAntd>
                        <div className='min_height'>
                            
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Select className='m_2' value={status} style={{width:200}} onChange={val=>{
                                        this.setState({ status:val })
                                    }}>
                                        <Select.Option value={-1}>ææç¶æ</Select.Option>
                                        <Select.Option value={0}>ç­å¾å®¡æ ¸</Select.Option>
                                        <Select.Option value={1}>å®¡æ ¸éè¿</Select.Option>
                                        <Select.Option value={2}>æç»</Select.Option>
                                    </Select>
                                    <DatePicker.RangePicker disabledDate={(val)=>val > moment().subtract(0, 'day')} format='YYYY-MM-DD' allowClear={true} value={this.state.aTime} locale={locale} onChange={(date,dateString)=>{
                                        this.setState({
                                            aTime:date,
                                            begin_time:dateString[0],
                                            end_time:dateString[1]
                                        })
                                    }} />
                                     <Search
                                        placeholder='æµæ°´å·'
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                        onChange={(e)=>this.setState({ keyword:e.target.value })}
                                    />&nbsp;
                                    <Button onClick={()=>{ this.page_current = 1; this.getInventory() }}>æç´¢</Button>
                                </div>
                                <div>
                                    <Button value='inventoryTran/applyOut' className='m_2' onClick={()=>{ 
                                        this.props.history.push('/mall/inventory-transport/apply/1')
                                     }}>
                                         åºåºç³è¯·
                                    </Button>
                                    <Button value='inventoryTran/in' className='m_2' onClick={()=>{
                                        this.setState({showImportPanel:true,})}
                                    }>å¯¼å¥</Button>
                                </div>
                            </div>
                            <div className='mb_10'>
                                <Popconfirm
                                    value='inventoryTran/check'
                                    title='æ¯å¦å®¡æ ¸éè¿ï¼'
                                    okText='éè¿'
                                    cancelText='æç»'
                                    onConfirm={this.actionInventoryAll.bind(this,'status','1')}
                                    onCancel={this.actionInventoryAll.bind(this,'status','2')}
                                >
                                    <Button className='m_2' size='small'>å®¡æ¹</Button>
                                </Popconfirm>
                                <Button value='inventoryTran/print' className='m_2' size='small' onClick={this.exportInventory.bind(this,'print')}>æ¹éæå°åºåºå</Button>
                                <Button value='inventoryTran/out' className='m_2' size='small' onClick={this.exportInventory.bind(this,'')}>å¯¼åº</Button>
                            </div>
                            <TableAntd
                                rowKey='inventoryId'
                                columns={this.topic_column}
                                expandedRowRender={this.topicDetail}
                                rowSelection={{selectedRowKeys:selectedRowKeys,onChange:(value)=>{ this.setState({ selectedRowKeys:value }) }}}
                                dataSource={this.data_list}
                                pagination={{
                                    position: 'bottom',
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    onChange: this._onPage,
                                    showTotal:(total)=>'æ»å±'+total+'æ¡',
                                    
                                }}
                            />
                        </div>
                        </CardAntd>
                    </TabPane>
                    <TabPane tab="å¾æ¥åº" key={'2'}>
                        <CardAntd>
                        <div className='min_height'>
                            
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Select className='m_2' value={status} style={{width:200}} onChange={val=>{
                                        this.setState({ status:val })
                                    }}>
                                        <Select.Option value={-1}>ææç¶æ</Select.Option>
                                        <Select.Option value={2}>ç­å¾å®¡æ ¸</Select.Option>
                                        <Select.Option value={3}>å·²æ¥åº</Select.Option>
                                    </Select>
                                    <DatePicker.RangePicker disabledDate={(val)=>val > moment().subtract(0, 'day')} format='YYYY-MM-DD' allowClear={true} value={this.state.aTime} locale={locale} onChange={(date,dateString)=>{
                                        this.setState({
                                            aTime:date,
                                            begin_time:dateString[0],
                                            end_time:dateString[1]
                                        })
                                    }} />
                                     <Search
                                        placeholder='æµæ°´å·'
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                        onChange={(e)=>this.setState({ keyword:e.target.value })}
                                    />&nbsp;
                                    <Button onClick={()=>{ this.page_current = 1; this.getInventory() }}>æç´¢</Button>
                                </div>
                                <div>
                                    
                                </div>
                            </div>
                            <div className='mb_10'>
                                <Button value='inventoryTran/baofei' className='m_2' size='small' onClick={this.actionInventoryAll.bind(this,'scrapped','2')}>æ¥åº</Button>
                                <Button value='inventoryTran/out' className='m_2' size='small' onClick={this.exportInventory.bind(this,'')}>å¯¼åº</Button>
                            </div>
                            <TableAntd
                                rowKey='inventoryId'
                                columns={this.topic_column}
                                expandedRowRender={this.topicDetail}
                                rowSelection={{selectedRowKeys:selectedRowKeys,onChange:(value)=>{ this.setState({ selectedRowKeys:value }) }}}
                                dataSource={this.data_list}
                                pagination={{
                                    position: 'bottom',
                                    current: this.page_current,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper:true,
                                    onChange: this._onPage,
                                    showTotal:(total)=>'æ»å±'+total+'æ¡'
                                }}
                            />
                        </div>
                        </CardAntd>
                    </TabPane>
                </Tabs>
                    
                </Col>
            </Row>
            <Modal
                title='å¯¼å¥'
                visible={this.state.showImportPanel}
                closable={true}
                maskClosable={true}
                okText='å¼å§å¯¼å¥'
                cancelText='åæ¶'
                onCancel={()=>{
                    this.setState({showImportPanel:false})
                }}
                onOk={this.importInventory}
                confirmLoading={importLoading}
            >
                <Form labelCol={{span:6}} wrapperCol={{span:18}}>
                    <Form.Item label="éæ©Excelæä»¶">
                        <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' listType='text' ref={(ref)=>{ this.excelFile = ref }}></AntdOssUpload>
                    </Form.Item>
                    <Form.Item label="è¯´æ">
                        <div style={{color:"#8e8e8e",marginTop:'10px',lineHeight:'1.5'}}>
                            <p>
                                * å¯¼å¥åï¼è¯·åä¸è½½Excelæ¨¡æ¿æä»¶<br/>
                                * ä»æ¯æxlsxæ ¼å¼çæä»¶
                                &nbsp;&nbsp;&nbsp;
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/135531ff-ac08-4c07-8e96-16d1281196aa.xlsx'>
                                    Excelå¯¼å¥æ¨¡æ¿ä¸è½½
                                </a>
                            </p>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
            
            <Modal
                title={this.state.modalTitle}
                width={800} 
                onCancel={()=>{ this.setState({showTopicPannel:false}) }} 
                visible={this.state.showTopicPannel} 
                maskClosable={true} 
                footer={<div>
                    <Button className='m_2' onClick={()=>{
                        this.setState({ showTopicPannel:false })
                    }}>åæ¶</Button>
                    <Button onClick={this.actionInventory.bind(this,'status',2)} className='m_2' >æç»</Button>
                    <Button onClick={this.actionInventory.bind(this,'status',1)} className='m_2' type='primary'>åæ</Button>
                </div>}
            >
                <TableAntd
                    rowKey='goodsId'
                    columns={this.goods_column}
                    dataSource={this.state.goods_list}
                    pagination={false}
                />
                <div style={{margin:'10px 0',display:'flex'}}>
                    <span style={{paddingRight:'10px'}}>å¤æ³¨ï¼</span>
                    <TextArea style={{width:'45%'}} value={this.state.remark} onChange={e=>{
                        this.setState({remark:e.target.value})
                    }}></TextArea>
                </div>
            </Modal>
            <Modal closable={true} maskClosable={true} visible={this.state.showExcel} footer={null} width={888} onCancel={()=>{ this.setState({ showExcel:false }) }}>
                <Card type='inner' className="mt_10" bodyStyle={{padding:0}}>
                    {this.state.url == ''?<Spin className='block_center pad_20' indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} />:
                        <iframe name={Date.now()} src={this.state.url} frameBorder='0' key={this.state.url} width='100%' height='610px'></iframe>
                    }
                </Card>
                <span style={{color:"red"}}>* å¦éæå°è¯·ç¹å»å·¦ä¸è§ãæä»¶ãå¹¶éæ©ãæå°ã</span>
            </Modal>
		</div>
		);
    }
    goods_column = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId',width: 100 },
        { title: 'è´§å·', dataIndex: 'goodsSn', key: 'goodsSn',width: 100 },
        { title: 'åç§°', dataIndex: 'goodsName', key: 'goodsName', ellipsis:true},
        { title: 'æ°é', dataIndex: 'number', key: 'number',},
        { title: 'è§æ ¼', dataIndex: 'number', key: 'number1', },
        { title: this.state.itype==1?'æ¶è´§äººæµç§°':'ä¾åºå', dataIndex: 'supplierName', key: 'supplierName', },
        { title: 'ç»åäºº', dataIndex: 'managerName', key: 'managerName',},
        { title: ' åå·', dataIndex: 'orderSn', key: 'orderSn',},
        // { title: 'æ¶é´', dataIndex: 'goodsTime', key: 'goodsTime',},
    ]
    topic_column = [
        { title: 'ID', dataIndex: 'inventoryId', key: 'inventoryId',width:100 },
        { title: 'ç±»å', dataIndex: 'itype', key: 'itype',width:100,render:(item,ele)=>(
            ele.itype==0?'å¥åº':ele.itype==1?'åºåº':''
        )},
        { title: 'æµæ°´å·', dataIndex: 'sn', key: 'sn'},
        { title: 'æ¶é´', dataIndex: 'pubTime', key: 'pubTime', ellipsis:false,render:(item,ele)=>(
            moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')+(ele.isAuto==0?'(äººå·¥å½å¥)':'(èªå¨å½å¥)')
        )},
        { title: 'å¤æ³¨', dataIndex: 'remark', key: 'remark', ellipsis:true},
        { title: 'ç¶æ', dataIndex: 'status', key: 'status', ellipsis:false,render:(item,ele)=>(
            ele.status==0?'å¾å®¡æ ¸':ele.status==1?'å®¡æ ¸éè¿':ele.status==2?(this.state.itype=='2'?(ele.itype<2?'å¾æ¥åº':ele.itype==2?'å·²æ¥åº':''):'æç»'):ele.status==3?'æ¥åº':''
        )},
        {
            title: 'æä½',
            dataIndex: '',
            key: 'x',
            render: (item,ele) =>{
            const {itype} = this.state
            const btn_text = itype==0?'å¥åº':itype==1?'åºåº':itype==2?'å¾æ¥åº':''

            return(
                <>
                    {/*
                    <Button onClick={()=>{
                        
                    }}  type="primary" size={'small'} className='m_2'>{btn_text}è¯¦æ</Button>
                    */}
                    {
                        itype==2||ele.status>0?null:
                        <Button value='inventoryTran/check' type="primary" size={'small'} className='m_2' onClick={()=>{
                            const modalTitle = itype==0?'å®¡æ ¸å¥åºç³è¯·':itype==1?'å®¡æ ¸åºåºç³è¯·':''
                            this.setState({ inventory_id:ele.inventoryId, modalTitle:modalTitle,showTopicPannel:true,goods_list:ele.goodsInventoryMaps })
                        }}>å®¡æ¹</Button>
                    }
                </>
            )},
        },
    ]
}

constÂ LayoutComponentÂ = InventoryTransport;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        inventory:state.mall.inventory,
        user:state.site.user
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
