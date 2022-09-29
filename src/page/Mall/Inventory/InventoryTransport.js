import React, { Component } from 'react';
import {Table, CardBody, CardHeader, Col, Row} from 'reactstrap';
import {Spin,Card,Table as TableAntd,Form,Tabs,Modal,Card as CardAntd,DatePicker,Affix,Pagination, Tag,Menu, Dropdown, Icon, message,Input, InputNumber, Select, Radio, Checkbox,} from 'antd';

import connectComponent from '../../../util/connect';
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

        if(fileUrl==''){ message.info('请上传excel文件'); this.setState({importLoading:false}); return; }
        actions.importInventory({
            itype,
            fileUrl,
            resolved:(data)=>{
                message.success('提交成功')
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
        //         message.info('请先选择项目再 打印')
        //     }else{
        //         message.info('请先选择项目再 导出')
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
                    message.success('导出成功')
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
        if(selectedRowKeys.length==0){ message.info('请选择选项');return; }
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
        { title: '货号', dataIndex: 'goodsSn', key: 'goodsSn',width: 100 },
        { title: '名称', dataIndex: 'goodsName', key: 'goodsName', ellipsis:true},
        { title: '数量', dataIndex: 'number', key: 'number',},
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
                    <TabPane tab="入库" key={'0'}>
                        <CardAntd>
                        <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Select className='m_2' value={status} style={{width:200}} onChange={val=>{
                                        this.setState({ status:val })
                                    }}>
                                        <Select.Option value={-1}>所有状态</Select.Option>
                                        <Select.Option value={0}>等待审核</Select.Option>
                                        <Select.Option value={1}>审核通过</Select.Option>
                                        <Select.Option value={2}>拒绝</Select.Option>
                                        <Select.Option value={3}>报废</Select.Option>
                                    </Select>
                                    <DatePicker.RangePicker disabledDate={(val)=>val > moment().subtract(0, 'day')} format='YYYY-MM-DD' allowClear={true} value={this.state.aTime} locale={locale} onChange={(date,dateString)=>{
                                        this.setState({
                                            aTime:date,
                                            begin_time:dateString[0],
                                            end_time:dateString[1]
                                        })
                                    }} />
                                     <Search
                                        placeholder='流水号'
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                        onChange={(e)=>this.setState({ keyword:e.target.value })}
                                    />&nbsp;
                                    <Button onClick={()=>{ this.page_current = 1; this.getInventory() }}>搜索</Button>
                                </div>
                                <div>
                                    <Button value='inventoryTran/apply' className='m_2' onClick={()=>{ 
                                        this.props.history.push('/mall/inventory-transport/apply/0')
                                     }}>
                                         入库申请
                                    </Button>
                                    <Button value='inventoryTran/in' className='m_2' onClick={()=>{
                                        this.setState({showImportPanel:true,})}
                                    }>导入</Button>
                                </div>
                            </div>
                            <div className='mb_10'>
                                <Popconfirm
                                    value='inventoryTran/check'
                                    title='是否审核通过？'
                                    okText='通过'
                                    cancelText='拒绝'
                                    onConfirm={this.actionInventoryAll.bind(this,'status','1')}
                                    onCancel={this.actionInventoryAll.bind(this,'status','2')}
                                >
                                    <Button className='m_2' size='small'>审批</Button>
                                </Popconfirm>
                                <Button value='inventoryTran/baofei' className='m_2' size='small' onClick={this.actionInventoryAll.bind(this,'scrapped','0')}>报废</Button>
                                <Button value='inventoryTran/print' className='m_2' size='small' onClick={this.exportInventory.bind(this,'print')}>批量打印入库单</Button>
                                <Button value='inventoryTran/out' className='m_2' size='small' onClick={this.exportInventory.bind(this,'')}>导出</Button>
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
                                    showTotal:(total)=>'总共'+total+'条',
                                    onShowSizeChange:(val)=>{console.log(val)}
                                }}
                            />
                        </div>
                        </CardAntd>
                    </TabPane>
                    <TabPane tab="出库" key={'1'}>
                        <CardAntd>
                        <div className='min_height'>
                            
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Select className='m_2' value={status} style={{width:200}} onChange={val=>{
                                        this.setState({ status:val })
                                    }}>
                                        <Select.Option value={-1}>所有状态</Select.Option>
                                        <Select.Option value={0}>等待审核</Select.Option>
                                        <Select.Option value={1}>审核通过</Select.Option>
                                        <Select.Option value={2}>拒绝</Select.Option>
                                    </Select>
                                    <DatePicker.RangePicker disabledDate={(val)=>val > moment().subtract(0, 'day')} format='YYYY-MM-DD' allowClear={true} value={this.state.aTime} locale={locale} onChange={(date,dateString)=>{
                                        this.setState({
                                            aTime:date,
                                            begin_time:dateString[0],
                                            end_time:dateString[1]
                                        })
                                    }} />
                                     <Search
                                        placeholder='流水号'
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                        onChange={(e)=>this.setState({ keyword:e.target.value })}
                                    />&nbsp;
                                    <Button onClick={()=>{ this.page_current = 1; this.getInventory() }}>搜索</Button>
                                </div>
                                <div>
                                    <Button value='inventoryTran/applyOut' className='m_2' onClick={()=>{ 
                                        this.props.history.push('/mall/inventory-transport/apply/1')
                                     }}>
                                         出库申请
                                    </Button>
                                    <Button value='inventoryTran/in' className='m_2' onClick={()=>{
                                        this.setState({showImportPanel:true,})}
                                    }>导入</Button>
                                </div>
                            </div>
                            <div className='mb_10'>
                                <Popconfirm
                                    value='inventoryTran/check'
                                    title='是否审核通过？'
                                    okText='通过'
                                    cancelText='拒绝'
                                    onConfirm={this.actionInventoryAll.bind(this,'status','1')}
                                    onCancel={this.actionInventoryAll.bind(this,'status','2')}
                                >
                                    <Button className='m_2' size='small'>审批</Button>
                                </Popconfirm>
                                <Button value='inventoryTran/print' className='m_2' size='small' onClick={this.exportInventory.bind(this,'print')}>批量打印出库单</Button>
                                <Button value='inventoryTran/out' className='m_2' size='small' onClick={this.exportInventory.bind(this,'')}>导出</Button>
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
                                    showTotal:(total)=>'总共'+total+'条',
                                    
                                }}
                            />
                        </div>
                        </CardAntd>
                    </TabPane>
                    <TabPane tab="待报废" key={'2'}>
                        <CardAntd>
                        <div className='min_height'>
                            
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Select className='m_2' value={status} style={{width:200}} onChange={val=>{
                                        this.setState({ status:val })
                                    }}>
                                        <Select.Option value={-1}>所有状态</Select.Option>
                                        <Select.Option value={2}>等待审核</Select.Option>
                                        <Select.Option value={3}>已报废</Select.Option>
                                    </Select>
                                    <DatePicker.RangePicker disabledDate={(val)=>val > moment().subtract(0, 'day')} format='YYYY-MM-DD' allowClear={true} value={this.state.aTime} locale={locale} onChange={(date,dateString)=>{
                                        this.setState({
                                            aTime:date,
                                            begin_time:dateString[0],
                                            end_time:dateString[1]
                                        })
                                    }} />
                                     <Search
                                        placeholder='流水号'
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                        onChange={(e)=>this.setState({ keyword:e.target.value })}
                                    />&nbsp;
                                    <Button onClick={()=>{ this.page_current = 1; this.getInventory() }}>搜索</Button>
                                </div>
                                <div>
                                    
                                </div>
                            </div>
                            <div className='mb_10'>
                                <Button value='inventoryTran/baofei' className='m_2' size='small' onClick={this.actionInventoryAll.bind(this,'scrapped','2')}>报废</Button>
                                <Button value='inventoryTran/out' className='m_2' size='small' onClick={this.exportInventory.bind(this,'')}>导出</Button>
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
                                    showTotal:(total)=>'总共'+total+'条'
                                }}
                            />
                        </div>
                        </CardAntd>
                    </TabPane>
                </Tabs>
                    
                </Col>
            </Row>
            <Modal
                title='导入'
                visible={this.state.showImportPanel}
                closable={true}
                maskClosable={true}
                okText='开始导入'
                cancelText='取消'
                onCancel={()=>{
                    this.setState({showImportPanel:false})
                }}
                onOk={this.importInventory}
                confirmLoading={importLoading}
            >
                <Form labelCol={{span:6}} wrapperCol={{span:18}}>
                    <Form.Item label="选择Excel文件">
                        <AntdOssUpload showMedia={false} actions={this.props.actions} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' listType='text' ref={(ref)=>{ this.excelFile = ref }}></AntdOssUpload>
                    </Form.Item>
                    <Form.Item label="说明">
                        <div style={{color:"#8e8e8e",marginTop:'10px',lineHeight:'1.5'}}>
                            <p>
                                * 导入前，请先下载Excel模板文件<br/>
                                * 仅支持xlsx格式的文件
                                &nbsp;&nbsp;&nbsp;
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/135531ff-ac08-4c07-8e96-16d1281196aa.xlsx'>
                                    Excel导入模板下载
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
                    }}>取消</Button>
                    <Button onClick={this.actionInventory.bind(this,'status',2)} className='m_2' >拒绝</Button>
                    <Button onClick={this.actionInventory.bind(this,'status',1)} className='m_2' type='primary'>同意</Button>
                </div>}
            >
                <TableAntd
                    rowKey='goodsId'
                    columns={this.goods_column}
                    dataSource={this.state.goods_list}
                    pagination={false}
                />
                <div style={{margin:'10px 0',display:'flex'}}>
                    <span style={{paddingRight:'10px'}}>备注：</span>
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
                <span style={{color:"red"}}>* 如需打印请点击左上角【文件】并选择【打印】</span>
            </Modal>
		</div>
		);
    }
    goods_column = [
        { title: 'ID', dataIndex: 'goodsId', key: 'goodsId',width: 100 },
        { title: '货号', dataIndex: 'goodsSn', key: 'goodsSn',width: 100 },
        { title: '名称', dataIndex: 'goodsName', key: 'goodsName', ellipsis:true},
        { title: '数量', dataIndex: 'number', key: 'number',},
        { title: '规格', dataIndex: 'number', key: 'number1', },
        { title: this.state.itype==1?'收货人昵称':'供应商', dataIndex: 'supplierName', key: 'supplierName', },
        { title: '经办人', dataIndex: 'managerName', key: 'managerName',},
        { title: ' 单号', dataIndex: 'orderSn', key: 'orderSn',},
        // { title: '时间', dataIndex: 'goodsTime', key: 'goodsTime',},
    ]
    topic_column = [
        { title: 'ID', dataIndex: 'inventoryId', key: 'inventoryId',width:100 },
        { title: '类型', dataIndex: 'itype', key: 'itype',width:100,render:(item,ele)=>(
            ele.itype==0?'入库':ele.itype==1?'出库':''
        )},
        { title: '流水号', dataIndex: 'sn', key: 'sn'},
        { title: '时间', dataIndex: 'pubTime', key: 'pubTime', ellipsis:false,render:(item,ele)=>(
            moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')+(ele.isAuto==0?'(人工录入)':'(自动录入)')
        )},
        { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis:true},
        { title: '状态', dataIndex: 'status', key: 'status', ellipsis:false,render:(item,ele)=>(
            ele.status==0?'待审核':ele.status==1?'审核通过':ele.status==2?(this.state.itype=='2'?(ele.itype<2?'待报废':ele.itype==2?'已报废':''):'拒绝'):ele.status==3?'报废':''
        )},
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (item,ele) =>{
            const {itype} = this.state
            const btn_text = itype==0?'入库':itype==1?'出库':itype==2?'待报废':''

            return(
                <>
                    {/*
                    <Button onClick={()=>{
                        
                    }}  type="primary" size={'small'} className='m_2'>{btn_text}详情</Button>
                    */}
                    {
                        itype==2||ele.status>0?null:
                        <Button value='inventoryTran/check' type="primary" size={'small'} className='m_2' onClick={()=>{
                            const modalTitle = itype==0?'审核入库申请':itype==1?'审核出库申请':''
                            this.setState({ inventory_id:ele.inventoryId, modalTitle:modalTitle,showTopicPannel:true,goods_list:ele.goodsInventoryMaps })
                        }}>审批</Button>
                    }
                </>
            )},
        },
    ]
}

const LayoutComponent = InventoryTransport;
const mapStateToProps = state => {
    return {
        inventory:state.mall.inventory,
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
