import React, { Component } from 'react';
import connectComponent from '../../util/connect'
import {Icon,Upload,InputNumber,Card,Table,Modal, Form, Input, message, Spin} from 'antd'
import moment from 'moment'
import SwitchCom from '../../components/SwitchCom'
import AntdOssUpload from '../../components/AntdOssUpload'
import {Button,Popconfirm} from '../../components/BtnComponent'

class CouponYC extends Component {
	state = { 
        data_list:[],
        total:0,
        page:0,
        pageSize:10,
        keyword:'',

        begin_point:0,
        end_point:0,
        level_img:'',
        level_name:'',
        share_integral:0,
        levelId:0,
        status:0,
        imgList:[],
        excelFileList:[],
        importLoading:false,
        showImportPannel:false,
        loading:false,
        coupon_ids:[],
        edit_code:0,
        edit_coupon_id:0,
    };
    img = {
        getValue:()=>''
    }
	componentDidMount() {
        this.getCouponYC()
    }
    getCouponYC = ()=>{
        this.setState({ loading:true })
        const {
            page,
            pageSize,
            keyword,
        } = this.state
        this.props.actions.getCouponYC({
            page,
            pageSize,
            keyword,
            resolved:(res)=>{
                console.log(res)
                const {page,total,data} = res
                if(Array.isArray(data)){
                    this.setState({ 
                        data_list:data,
                        page,
                        total,
                    })
                }
                this.setState({ loading:false })
            },
            rejected:()=>{
                this.setState({ loading:false })
            }
        })
    }
  
    importCouponYC = ()=>{

        const {actions} = this.props
        const {excelFileList} = this.state;
        const that = this
        let file = new FormData();
        if(excelFileList.length === 0){
            message.info('请选择Excel文件')
            this.setState({importLoading:false})
            return;
        }
        this.setState({importLoading:true})
        file.append('file', excelFileList[0]);
        // file.append('squad_id',squad_id)
        actions.importCouponYC({
            file:file,
            resolved:(data)=>{
                console.log(data)
                message.success('提交成功')
                that.setState({ importLoading:false,showImportPannel:false,excelFileList:[] },()=>{
                    // let rejectedUser = []
                    // Object.keys(data.fail).map(ele=>{
                    //     rejectedUser.push(data.fail[ele])
                    // })
                    // that.setState({
                    //     showResult:true,
                    //     rejectedUser:rejectedUser,
                    //     success:data.success,
                    //     total:data.total
                    // })
                })
            },
            rejected:()=>{
                this.setState({importLoading:false})
                message.error('导入失败')
            }
        })
    }
    beforeUploadExcel = file => {
        
        if(file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            message.info('请上传xlsx格式的文件')
            return;
        }
        this.setState(state => ({
            excelFileList: [file],
        })); 
        return false;
    }
    onRemoveExcel = file => {
        this.setState(state => {
            const index = state.excelFileList.indexOf(file);
            const newFileList = state.excelFileList.slice();
            newFileList.splice(index, 1);
            return {
                excelFileList: newFileList,
            };
        });
    }
    renderTitle = ()=>{
        return (
            <>
                {/* <Button className='m_2'>设置</Button> */}
                <Button value='couponYC/add' className='m_2' onClick={()=>{
                    this.setState({ showImportPannel:true })
                }}>导入优惠券码</Button>
            </>
        )
    }
    actionDel = (coupon_ids)=>{
        this.props.actions.actionCouponYC({
            coupon_ids,
            action:'delete',
            resolved:(res)=>{
                message.success('提交成功')
                this.getCouponYC()
            },
            rejected:()=>{

            }
        })
    }
    actionDels = ()=>{
        const {coupon_ids} = this.state
        if(coupon_ids.length === 0){ message.info('请选择要操作的项目'); return; }
        this.props.actions.actionCouponYC({
            coupon_ids: coupon_ids.join(','),
            action:'delete',
            resolved:(res)=>{
                message.success('提交成功')
                this.getCouponYC()
            },
            rejected:()=>{

            }
        })
    }
    actionCoupon = ()=>{
        const {edit_code,edit_coupon_id} = this.state
        if(!edit_code){ message.info('请输入优惠码'); return; }
        this.props.actions.actionCouponYC({
            coupon_ids: edit_coupon_id,
            action:'update',
            code: edit_code,
            resolved:(res)=>{
                message.success('提交成功')
                this.getCouponYC()
            },
            rejected:()=>{

            }
        })
    }
	render() {
        const {loading,view,data_list,total,page,pageSize} = this.state
		return (
			<div className="animated fadeIn" >
                <Spin spinning={loading}>
                <Card title='油葱商城优惠码管理' extra={this.renderTitle()}>
                    <div>
                        <Input.Search className='m_w400 m_2' onSearch={()=>{
                            this.setState({ page:0 },this.getCouponYC)
                        }} value={this.state.keyword} onChange={e=>{
                            this.setState({ keyword:e.target.value })
                        }} />
                    </div>
                    <Popconfirm
                        value='couponYC/del'
                        title='确定删除吗'
                        okText='确定'
                        cancelText='取消'
                        onConfirm={this.actionDels}
                    >
                        <Button size='small' className='m_2'>删除</Button>
                    </Popconfirm>
                    
                    <Table
                        rowSelection={{
                            selectedRowKeys:this.state.coupon_ids,
                            onChange:(coupon_ids)=>{
                                this.setState({ coupon_ids })
                            }
                        }}
                        rowKey='couponId'
                        columns={this.col} 
                        dataSource={data_list}
                        pagination={false}
                        pagination={{
                            pageSize:pageSize,
                            current:page+1,
                            total:total,
                            onChange:(val)=>this.setState({ coupon_ids:[], page:val-1 },this.getCouponYC)
                        }}
                    >
                    </Table>
                </Card>
                </Spin>
                <Modal
                    title='导入'
                    visible={this.state.showImportPannel}
                    closable={true}
                    maskClosable={true}
                    okText='开始导入'
                    cancelText='取消'
                    onCancel={()=>{
                        this.setState({showImportPannel:false})
                    }}
                    onOk={this.importCouponYC}
                    confirmLoading={this.state.importLoading}
                >
                     <Form labelCol={{span:6}} wrapperCol={{span:18}}>
                        <Form.Item label="选择Excel文件">
                            <Upload
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                fileList={this.state.excelFileList}
                                beforeUpload={this.beforeUploadExcel}
                                onRemove={this.onRemoveExcel}
                            >
                                <Button>
                                    <Icon type="upload" /> 选择文件
                                </Button>
                            </Upload>
                            <div style={{color:"#8e8e8e",marginTop:'10px',lineHeight:'1.5'}}>
                                <p>
                                    * 导入前，请先下载Excel模板文件<br/>
                                    * 仅支持xlsx格式的文件
                                </p>
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1613742887757.xlsx'>
                                    Excel导入模板下载
                                </a>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title={'更新优惠码'} onOk={this.actionCoupon} okText='确定' cancelText='取消' visible={this.state.setPanel} maskClosable={false} onCancel={()=>{
                    this.setState({setPanel:false})
                }}>
                    <Form labelCol={{span:4}} wrapperCol={{span:20}}>
                        <Form.Item label='优惠码'>
                            <Input  value={this.state.edit_code} onChange={(e)=>{
                                this.setState({ edit_code:e.target.value })
                            }}></Input>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal zIndex={99} visible={this.state.imgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({imgPanel:false})
                }}>
                    <img alt="图片／视频" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
			</div>
		);
    }
    col = [
        {title:'ID',dataIndex:'couponId',key:'couponId'},
        {title:'优惠券码',dataIndex:'code',key:'code'},
        {title:'发布时间',render:(item,ele)=>{
            if(ele.pubTime)
                return moment.unix(ele.pubTime).format('YYYY-MM-DD')
            else
                return '暂无'
        }},
        {title:'绑定时间',render:(item,ele)=>{
            if(ele.bindTime)
                return moment.unix(ele.bindTime).format('YYYY-MM-DD')
            else
                return '暂无'
        }},
        {title:'绑定用户ID',render:(item,ele)=>{
            if(ele.userId)
                return ele.userId
            else
                return '暂无'
        }},
        {title:'操作',render:(item,ele)=>(
            <div>
                 <Button value='couponYC/edit' className='m_2' size='small' onClick={()=>{
                    this.setState({ 
                        setPanel:true,
                        edit_code:'',
                        edit_coupon_id: ele.couponId
                    })
                }}>修改</Button>
                <Popconfirm
                    value='couponYC/del'
                    title='确定删除吗'
                    okText='确定'
                    cancelText='取消'
                    onConfirm={this.actionDel.bind(this,ele.couponId)}
                >
                    <Button size='small' className='m_2'>删除</Button>
                </Popconfirm>
                
            </div>
        )}
    ]
}

const LayoutComponent = CouponYC;
const mapStateToProps = state => {
	return {

	}
}

export default connectComponent({ LayoutComponent, mapStateToProps })