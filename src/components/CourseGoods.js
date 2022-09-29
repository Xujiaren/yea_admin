import React, { Component } from 'react';
import { Divider,Popover,Table,InputNumber,Switch,Card, Input, List, Modal, Form, Upload, message, Button, Icon } from 'antd';
import PropTypes from 'prop-types'
import AntdOssUpload from './AntdOssUpload'
import moment from 'moment'
export default class CourseGoods extends Component {
	
	static propTypes = {
        onShopChange: PropTypes.func,
        isShop: PropTypes.number,
        courseId: PropTypes.number,
        value: PropTypes.string,
        disabled: PropTypes.bool
	}
	static defaultProps = {
        onShopChange:()=>null,
        isShop: 0,
        courseId: 0,
        value: '',
        disabled: false,
        imgPanel: false,
        url: '',
	}
	constructor(props){
		super(props)
        this.state = {
            live_goods:[],
            excelFileList:[],
            goodsPanel:false,
            goods_name:'',
            goods_id:0,
            goods_img:'',
            goods_link:'',
            goods_price:'',
            goods_sort_order:0,
            goods_status:0,
            goodsImgList:[],
            edit_index: -1,
            del_goods:[],
		}
    }
    id = 0
    goodsImg = {
        getValue:()=>''
    }
	componentDidMount() {
        const {courseId} = this.props
        this.getGoods(courseId)
	}
	componentWillMount(){

	}
	componentWillReceiveProps(n_props) {
		if (n_props.courseId !== this.props.courseId) {
            this.getGoods(n_props.courseId)
		}
	}
	// init = (value)=>{
    //     if(value){
    //         console.log(value)
    //         let obj = JSON.parse(value)
    //         if(typeof obj === 'object'){
    //             let dataSource = Object.keys(obj).map(ele=>({ value: obj[ele] }))
    //             this.setState({ dataSource })
    //         }
    //     }
    // }
    getGoods = (courseId)=>{
        if(courseId && courseId != '0')
        this.props.actions._getLiveGoods({
            course_id: courseId,
            keyword: '',
            resolved:(res)=>{
                console.log(res)
                if(Array.isArray(res)){
                    let live_goods = res.map(ele=>{
                        ele['goods_id'] = ele.goodsId
                        return ele
                    })
                    this.setState({ live_goods })
                }
            },
            rejected:()=>{

            }
        })
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
    actionLiveGoods = (goods_id)=>{
        return new Promise((resolve,reject)=>{
            const {actions} = this.props
            actions.actionLiveGoods({
                goods_id,
                action:'delete',
                resolved:()=>{
                    resolve(true)
                },
                rejected:()=>{
                   reject(false)
                }
            })
        })
    }
    publishLiveGoods = (goods_id, course_id, goods_name, goods_img, goods_price, goods_link, sort_order,status,)=>{
        return new Promise((resolve,reject)=>{
            const {actions} = this.props
            actions.publishLiveGoods({
                goods_id, course_id, goods_name, goods_img, goods_price, goods_link, sort_order,status,
                resolved:()=>{
                    resolve(true)
                },
                rejected:()=>{
                    reject(false)
                }
            })
        })
    }
    publisher = (courseId)=>{
        const {live_goods,del_goods} = this.state
        console.log(live_goods)
        return new Promise((resolve,reject)=>{
            if(live_goods.length === 0){
                // resolve(true)
            }else{
                live_goods.map( async (item,index)=>{
                    let {
                        goods_id,
                        goodsName: goods_name,
                        goodsImg: goods_img,
                        goodsPrice: goods_price,
                        goodsLink: goods_link,
                        sortOrder: sort_order,
                        status: status
                    } = item
                
                    await this.publishLiveGoods(
                        goods_id, courseId, goods_name, goods_img, goods_price, goods_link, sort_order,status
                    )
                    
                })
            }
            if(del_goods.length === 0){
                resolve(true)
            }else{
                del_goods.map( async (item,index)=>{
                    await this.actionLiveGoods(item)
                    if(index === del_goods.length - 1){
                        resolve(true)
                    }
                })
            }
        })
    }
    uploader = (courseId)=>{
        const {actions,parent} = this.props
        const {excelFileList} = this.state;
        const that = this
        let file = new FormData();
        return new Promise((resolve,reject)=>{
            if(excelFileList.length === 0){
                resolve(false)
            }else{
                parent&&parent.setState({ goods_loading:true })
                file.append('file', excelFileList[0]);
                file.append('course_id',courseId)
                actions.uploadLiveGoods({
                    course_id:{course_id:courseId},
                    file:file,
                    resolved:()=>{
                        resolve(true)
                        parent&&parent.setState({ goods_loading:false,excelFileList:[] })
                    },
                    rejected:()=>{
                        resolve(false)
                        message.error('导入失败，请参考Excel模板文件')
                        this.setState({ goods_loading:false })
                        parent && parent.setState({ loading:false })
                    }
                })
            }
        })
    }
    addLiveGoods= ()=>{
        const {actions,courseId} = this.props
        const {edit_index,goods_id, goods_name, goods_price, goods_link, goods_sort_order,goods_status} = this.state
        let {live_goods} = this.state
        let goods_img = this.goodsImg.getValue()

        // if(!course_id||course_id == '0'){message.info('直播ID不存在'); return;}
        if(!goods_name){ message.info('请输入商品名称'); return;}
        if(!goods_img||goods_img==''){ message.info('请上传商品图片'); return;}
        if(!goods_link){ message.info('请输入商品链接'); return;}
        if(!goods_price){ message.info('请输入商品价格'); return;}

        let sort_order = goods_sort_order
        let status = goods_status

        if(edit_index == -1){
            let item = {
                goods_id:0,
                goodsId: this.id,
                goodsName: goods_name,
                goodsImg: goods_img,
                goodsPrice: goods_price,
                goodsLink: goods_link,
                sortOrder: sort_order,
                status: status,
                pubTime: 0
            }
            this.id++ 
            this.setState({ 
                goodsPanel:false,
                live_goods: [...live_goods,item]
            })
            
        }else{
            live_goods[edit_index]['goodsName'] = goods_name
            live_goods[edit_index]['goodsImg'] = goods_img
            live_goods[edit_index]['goodsPrice'] = goods_price
            live_goods[edit_index]['goodsLink'] = goods_link
            live_goods[edit_index]['sortOrder'] = sort_order
            live_goods[edit_index]['status'] = status
            this.setState({ 
                goodsPanel:false,
                live_goods: [...live_goods]
            })
        }
    }
    _onDeleteGoods(item,index){
        let {live_goods,del_goods} = this.state
        
        live_goods = live_goods.filter((ele,idx)=>{
            let tmp = idx !== index
            if(!tmp && ele.goods_id !== 0){
                this.setState({ 
                    del_goods: [...del_goods, ele.goods_id]
                })
            }
            return tmp
        })
        this.setState({
            live_goods: [...live_goods]
        })
    }

    _onEditGoods(item,idx){
        let { goodsId:goods_id, courseId:course_id, goodsName:goods_name, goodsImg:goods_img, goodsPrice:goods_price, goodsLink:goods_link, sortOrder:goods_sort_order,status:goods_status} = item
        let goodsImgList = [{
            response:{resultBody:goods_img},
            uid:goods_id+course_id,
            name:'img'+goods_id,
            status:'done',
            url:goods_img,
            type:'image/png'
        }]
        let goodsPanel = true
        let edit_index = idx

        this.setState({
            edit_index,goodsPanel,goodsImgList, goods_id,course_id,goods_name,goods_img,goods_price,goods_link,goods_sort_order,goods_status
        })
    }
	render() {
		const {disabled} = this.props
		return (
			<>
				<Card type='inner' className='mt_10' title='带货管理' bodyStyle={{padding:'10px'}}>
                                   
                <div className='d_flex ai_ct mb_10'>
                    <span>是否带货：</span>
                    <Switch disabled={disabled} checked={this.props.isShop==1?true:false} onChange={(e)=>{
                        this.props.onShopChange && this.props.onShopChange(e?1:0)
                    }}/>
                </div>
                <div>
                    <Table disabled={disabled} dataSource={this.state.live_goods} columns={this.columnsGoods} rowKey={'goodsId'} tableLayout={'fixed'} size={'middle'} pagination={false} />
                    {disabled?null:
                        <>
                        <Button 
                            type="dashed" 
                            onClick={() => {
                                this.setState({ 
                                    edit_index: -1,
                                    goodsPanel:true,
                                    goods_name:'',
                                    goods_id:0,
                                    goods_img:'',
                                    goods_link:'',
                                    goods_price:'',
                                    goods_sort_order:0,
                                    goods_status:0,
                                    goodsImgList:[]
                                })
                            }} style={{ minWidth: '10%',marginTop:'10px' }}
                        >
                            <Icon type="plus" /> 添加商品
                        </Button>&nbsp;&nbsp;
                        <Popover placement="top" trigger="hover"  content={
                            <div style={{color:"#8e8e8e"}}>
                                <p>
                                    * 导入前，请先下载Excel模板文件<br/>
                                    * 仅支持xlsx格式的文件<br/>
                                    * 模版中的商品价格和排序请取整数 <br/>
                                    * 模版中的图片地址必须是小程序允许的域名地址 <br/>
                                    * 模版中的商品图片请正确地放到对应的格子里 <br/>
                                </p>
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/7edc6265-f189-45cd-a8e6-a80bae0ac6bd.xlsx'>
                                    Excel导入模板下载
                                </a>
                            </div>
                        }>
                            
                            <span>
                                <Upload
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    fileList={this.state.excelFileList}
                                    beforeUpload={this.beforeUploadExcel}
                                    onRemove={this.onRemoveExcel}
                                >
                                    <Button>
                                        <Icon type="upload" /> 导入商品
                                    </Button>
                                </Upload>
                            </span>
                        </Popover>
                        {/* {this.props.courseId !== '0'&&this.state.excelFileList.length >0?
                            <Button loading={importGoodsLoading} onClick={this.handleUpload}>
                                <Icon type="upload" />开始上传
                            </Button>
                        :null} */}
                        </>
                    }
                </div>
            </Card>
            <Modal
                title='商品设置'
                visible={this.state.goodsPanel}
                closable={true}
                maskClosable={false}
                okText='提交'
                cancelText='取消'
                onCancel={()=>{
                    this.setState({ goodsPanel:false })
                }}
                bodyStyle={{padding:"10px"}}
                onOk={this.props.disabled?null:this.addLiveGoods}
            >
                <Form labelCol={{span:5}} wrapperCol={{span:16}}>
                    <Form.Item label="商品名称">
                        <Input 
                            value={this.state.goods_name}
                            onChange={(e)=>{
                                this.setState({ goods_name:e.currentTarget.value })
                            }}
                        />
                    </Form.Item>
                    
                    <Form.Item label="商品图片">
                        <AntdOssUpload
                            actions={this.props.actions}
                            disabled={this.props.disabled}
                            listType="picture-card"
                            value={this.state.goodsImgList}
                            ref={ref=>this.goodsImg = ref}
                            maxLength={1}
                            accept='image/*'
                        >
                        </AntdOssUpload>
                        <span style={{marginTop:'-30px',display:'block'}}>请上传符合 200px * 200px 尺寸的图片</span>
                    </Form.Item>
                    
                    <Form.Item label="商品链接">
                        <Input
                            value={this.state.goods_link}
                            onChange={(e)=>{
                                this.setState({ goods_link:e.target.value })
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="商品价格">
                        <InputNumber
                            value={this.state.goods_price}
                            onChange={(val)=>{
                                this.setState({ goods_price:val })
                            }}
                            min={0} max={800000}
                        />
                    </Form.Item>
                    <Form.Item label="排序">
                        <InputNumber
                            value={this.state.goods_sort_order}
                            onChange={(val)=>{
                                this.setState({ goods_sort_order:val })
                            }}
                            min={0} max={800000}
                        />
                    </Form.Item>
                    <Form.Item label="是否启用">
                        <Switch checked={this.state.goods_status == 1?true:false} onChange={(checked)=>{
                            this.setState({goods_status: checked?1:0})
                        }}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={this.state.imgPanel} maskClosable={true} footer={null} onCancel={()=>{
                this.setState({ imgPanel:false })
            }}>
                <img alt="preview" style={{ width: '100%' }} src={this.state.url} />
            </Modal>
			</>
		);
    }
    columnsGoods = [
        {
            title: '商品ID',
            dataIndex: 'goodsId',
            key: 'goodsId',
        },
        {
            title: '图片',
            dataIndex: 'goodsImg',
            key: 'goodsImg',
            render:(ele,record)=>(
                <a>
                    <img onClick={()=>{
                        this.setState({ url:record.goodsImg,imgPanel:true })
                    }} className="head-example-img" src={record.goodsImg}/>
                </a>
            )
        },
        {
            title: '名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            ellipsis: true,
        },
        {
            title: '价格',
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
            render:(ele,record)=>record.goodsPrice+'元'
        },
        {
            title: '添加时间',
            render:(item,record)=>record.pubTime==0?'暂无':moment.unix(record.pubTime).format('YYYY-MM-DD HH:mm')
        },
        
        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder'
        },
        {
            title: '启用状态',
            dataIndex: 'status',
            key: 'status',
            render:(item,record)=>(record.status == 1?'已启用':'未启用')
        },
        {
            title: '操作',
            key: 'action',
            render:(item, record, idx) =>{
                if(this.props.disabled)
                    return null
                return (<span>
                    <a onClick={()=>{
                        this._onEditGoods(record,idx)
                    }}>修改 </a>
                    <Divider type="vertical" />
                    <a onClick={()=>{
                        this._onDeleteGoods(record,idx)
                    }}>删除</a>
                </span>)
            },
        },
    ]
}