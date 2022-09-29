import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, InputNumber} from 'antd'
import moment from 'moment'

class TreeGoods extends Component{
    state = {
        view_mode:false,
        status:0,
        data_list:[
            {exchange:20,consume:222,id:324,name:'芦荟胶',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/3fx8apva1597199283189.png',time:'22',isTop:1,status:0},
            {exchange:40,consume:1000,id:325,name:'葡萄酒',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/3fx8apva1597199283189.png',time:'22',isTop:0,status:1},
        ]
    }
    
    page_current = 0
    page_total = 0
    page_size = 10

    componentWillMount(){

    }
    componentWillReceiveProps(n_props){
        
    }
    
    render(){
        const {view_mode} = this.state
        return (
            <div className="animated fadeIn">
                <Card title='商品管理' extra={
                    <>
                        <Button className='m_2' onClick={()=>{
                            this.props.history.push('/tree/goods/edit/0')
                        }}>添加商品</Button>
                    </>
                }>
                    <Input.Search className='m_w200 m_2' placeholder=''></Input.Search>
                   
                    <Table
                        columns={this.col}
                        // rowSelection={{
                        //     selectedRowKeys:this.state.keys,
                        //     onChange:(keys)=>{
                        //         this.setState({ keys })
                        //     }
                        // }}
                        rowKey='id'
                        dataSource={this.state.data_list}
                        pagination={{
                            // current: this.page_current+1,
                            // pageSize: this.page_size,
                            // total: this.page_total,
                            
                            // onChange: (val)=>{
                            //     this.page_current = val-1
                            //     // this.getMallGoods()
                            // },
                            showQuickJumper:true,
                            showTotal:(total)=>'总共'+total+'条'
                        }}
                    />
                </Card>
                
                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex:'id',key:'id',title:'ID',width:100 },
        { dataIndex:'image',key:'image',title:'商品图片',width:90,render:(item,ele)=>{
            return(
                <img src={ele.image} className='head-example-img' onClick={()=>{
                    this.setState({ showImgPanel: true, previewImage:ele.image })
                }}></img>
            )
        }},
        { dataIndex:'exchange',key:'exchange',title:'兑换券' },
        { dataIndex:'consume',key:'consume',title:'库存数' },
        { dataIndex:'status',key:'status',title:'状态',render:(item,ele,index)=>{
            return ele.status==1?'已上架':'未上架'
        }},
        { width:250,dataIndex:'',key:'',title:'操作',render:(item,ele,index)=>{
            return(
                <>
                    <Button size='small' type={ele.status==1?'primary':''} className='m_2' onClick={()=>{
                        const {data_list} = this.state
                        data_list[index].status = !data_list[index].status
                        this.setState({ data_list })
                    }}>{ele.status==1?'禁用':'启用'}</Button>
                    <Button size='small' className='m_2' onClick={()=>{
                        this.props.history.push('/tree/goods/view/1')
                    }}>查看</Button>
                    <Button size='small' className='m_2' onClick={()=>{
                        this.props.history.push('/tree/goods/edit/1')
                    }}>修改</Button>
                   
                    <Popconfirm title='确定删除吗' okText='确定' cancelText='取消'>
                        <Button size='small' className='m_2'>删除</Button>
                    </Popconfirm>
                </>
            )
        }},

    ]
}

const LayoutComponent = TreeGoods;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
