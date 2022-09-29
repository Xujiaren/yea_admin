import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import {InputNumber, Icon,Upload,message,Pagination,Modal,Form,Card ,Input, Radio} from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import config from '../../config/config';
import AntdOssUpload from '../../components/AntdOssUpload';
import {Button,Popconfirm} from '../../components/BtnComponent'


function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
function beforeUpload(file) {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //   if (!isJpgOrPng) {
    //     message.error('只能上传 JPG/PNG 文件!');
    //   }
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        message.info('图片文件需小于 1MB!');
      }
    //   return isJpgOrPng && isLt2M;
      return isLt2M;
}
class GiftManager extends Component {
    state = {
            
        edit : false,
        view : false,

        keyword:'',
        previewImage:'',
        showImgPanel:false,
        fileList:[],

        integral:50,
        gift_name:'',
        gift_img:'',
        gift_id:'',
        gtype:'1',
        status:0,

        isEdit:false,
        showAddGift: false,
       
    };
    gift_list = []
    page_total=0
    page_current=1
    page_size=20

    _onPage = (val)=>{

        const {actions} = this.props;

        actions.getGift({
            gift_name:'',
            page:val-1,
            ttype:'',
            pageSize:this.page_size
        })
    }
    
    uploadChange = ({ fileList }) => {
        let img = []
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                img.push(ele.response.resultBody)
            }
        })
        
        this.setState({
            fileList:fileList,
            gift_img:img.join(',')
        })
    };

    _onStatus(id,action){
        const {actions} = this.props
        actions.updateGift({action:action,gift_id:id,
            resolved:(data)=>{
                actions.getGift({
                    gift_name:'',
                    page:this.page_current - 1,
                    pageSize:this.page_size,
                    gtype:this.state.gtype
                })
                message.success('操作成功')
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }

    _onPublish = ()=>{
        const {gift_id,gift_name,integral,status,gtype} =this.state
        let gift_img = ''
        if(this.img){
            gift_img = this.img.getValue()
        }
        if(!gift_name){
            message.info('请输入礼物名称'); return;
        }
        if(!gift_img||gift_img==''){
            message.info('请上传礼物图片'); return;
        }
        if(integral>30000){
            message.info('金币花费不能超过3万'); return;
        }
        const {actions} = this.props
        actions.publishGift({
            gift_id,gift_img,gift_name,integral,status,gtype,
            resolved:(data)=>{
                actions.getGift({
                    gift_name:'',
                    page:0,
                    pageSize:this.page_size,
                    gtype:this.state.gtype
                })
                message.success('提交成功')
                this.setState({ showAddGift:false })
            }
        })
    }
    onEdit(index){
        let {giftId,giftImg,giftName,integral,status} = this.gift_list[index]
        let fileList = 
            [{
                response:{resultBody:giftImg},
                uid:'-1',
                name:'img',
                status:'done',
                url:giftImg,
                type:'image/png'
            }];
        this.setState({
            fileList:fileList,
            integral:integral,
            gift_name:giftName,
            gift_img:giftImg,
            gift_id:giftId,
            status:status,
            isEdit:true,
            showAddGift: true,
        })
    }
    componentWillMount(){
        const {actions} = this.props;
        actions.getGift({
            gift_name:'',
            page:this.page_current - 1,
            pageSize:this.page_size,
            gtype:this.state.gtype
        })
    }

    componentWillReceiveProps(n_props){
       

        if(n_props.gift_list !== this.props.gift_list){
            if(n_props.gift_list.data.length == 0){
                message.info('暂时没有数据')
            }
            this.gift_list = n_props.gift_list.data
            this.page_total=n_props.gift_list.total
            this.page_current=n_props.gift_list.page+1
        }
        
    }
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
        const uploadButtonImg = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="礼物管理">
                            <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    {/*<Search
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />&nbsp;
                                    <Button>搜索</Button>
                                    */}
                                </div>
                                <div>
                                    <Button value='liveGift/add' onClick={()=>{
                                        this.setState({
                                            showAddGift:true,
                                            isEdit:false,
                                            fileList:[],
                                            integral:'',
                                            gift_name:'',
                                            gift_img:'',
                                            gift_id:'',
                                            status:0
                                        })
                                    }}>添加礼物</Button>
                                </div>
                            </div>
                            </div>
                            <Table responsive size="sm" className="v_middle">
                                <thead>
                                <tr>
                                    <th>礼物名称</th>
                                    <th>礼物图片</th>
                                    <th>金币花费</th>
                                    {/*<th>现金花费</th>*/}
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.gift_list.map((ele,index)=>
                                    <tr key={ele.giftId+'_gift'}>
                                        <td style={{width:"100px"}}>{ele.giftName}</td>
                                        <td>
                                            <a>
                                                <img onClick={()=>{
                                                    this.setState({ showImgPanel:true,previewImage:ele.giftImg })
                                                }} src={ele.giftImg} style={{height:'auto',width:'60px',margin:'20px 0',display: 'block'}}/>
                                            </a>
                                        </td>
                                        <td>{ele.integral}</td>
                                       {/* <td></td>*/}
                                        <td>{ele.status == 1?'已上架':'未上架'}</td>
                                        <td style={{width:'220px' }}>
                                            <div>
                                                <Button value='liveGift/edit' onClick={this._onStatus.bind(this,ele.giftId,'status')} size={'small'} type={ele.status=='1'?'primary':''} className='m_2'>{ele.status ==1?'下架':'上架'}</Button>
                                                <Button value='liveGift/edit' onClick={this.onEdit.bind(this,index)} type="primary" size={'small'} className='m_2'>修改</Button>
                                                <Popconfirm
                                                    value='liveGift/del'
                                                    cancelText="取消"
                                                    okText="确定"
                                                    title="确定删除吗？" 
                                                    onConfirm={this._onStatus.bind(this,ele.giftId,'delete')}
                                                >
                                                    <Button type="danger" size={'small'} className='m_2'>删除</Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                            <Pagination showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper  pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({ showImgPanel:false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    title={this.state.isEdit?"修改礼物":"添加礼物"}
                    visible={this.state.showAddGift}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={()=>{
                        this.setState({ showAddGift:false })
                    }}
                    bodyStyle={{padding:"10px"}}
                    onOk={this._onPublish}
                >
                <Form {...formItemLayout}>
                    <Form.Item label="礼物名称">
                        <Input 
                            onChange={e=>{
                                this.setState({
                                    gift_name:e.target.value
                                })
                            }}
                            value={this.state.gift_name}
                        />
                    </Form.Item>
                    <Form.Item label="图片(JPG/PNG)">
                        <AntdOssUpload
                            actions={this.props.actions}
                            listType="picture-card"
                            value={this.state.fileList}
                            accept='image/*'
                            ref={ref=>this.img = ref}
                        >
                        </AntdOssUpload>
                        <span style={{marginTop:'-20px',display:'block'}}>60px * 60px</span>
                    </Form.Item>
                    <Form.Item label="金币花费">
                        <InputNumber
                            value={this.state.integral}
                            onChange={val=>{
                                if(val !== ''&&!isNaN(val)){
                                    val = Math.round(val)
                                    if(val<0) val=0
                                    this.setState({
                                        integral:val
                                    })
                                }
                            }}
                            min={0} max={800000}
                        />
                    </Form.Item>
                    <Form.Item label="现金花费">
                        <InputNumber
                            min={0} max={800000}
                            disabled
                            onChange={val=>{
                                if(val !== ''&&!isNaN(val)){
                                    val = Math.round(val)
                                    if(val<0) val=0
                                    this.setState({
                                        integral:val
                                    })
                                }
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            </div>
        )
    }
}
const LayoutComponent =GiftManager;
const mapStateToProps = state => {
    return {
        gift_list:state.ad.gift_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
