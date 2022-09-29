import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, InputNumber} from 'antd'
import moment from 'moment'

class MeettingActivity extends Component{
    state = {
        view_mode:false,
        status:0,
        data_list:[
            {order:2,id:324,name:'2020瑞士研讨会',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg',time:'22',isTop:1,status:0},
            {order:2,id:325,name:'2019瑞士研讨会',image:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg',time:'22',isTop:0,status:1},
        ],
        moment_list:[],
        searchs:'',
        loads:false
    }
    
    page_current = 0
    page_total = 0
    page_size = 10

    componentWillMount(){
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }
        this.getMoment()
    }
    getMoment=()=>{
        const{actions}=this.props
        actions.getMoment({
            keyword:this.state.searchs,
            page:this.page_current,
            pageSize:this.page_size
        })
    }
    componentWillReceiveProps(n_props){
        if(n_props.moment_list!=this.props.moment_list){
            this.setState({
                moment_list:n_props.moment_list.data
            })
            this.page_current=n_props.moment_list.page
            this.page_total=n_props.moment_list.total
        }
    }
    onClick=(val,e)=>{
        console.log(val,e)
        const{actions}=this.props
        actions.publishMom({
            article_id:val.articleId,
            action:e,
            resolved:(res)=>{
                message.success({content:'操作成功'})
                this.getMoment()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    onSearch=()=>{
        this.getMoment()
    }
    onExports=(val)=>{
        this.setState({
            loads:true
        })
        this.props.actions.getMeetActexport({
            dowload_id:val,
            resolved:(res)=>{
                message.success({
                    content:'导出成功'
                })
                window.open(res.address)
                this.setState({
                    loads:false
                })
            },
            rejected:(err)=>{
                this.setState({
                    loads:false
                })
            }
        })
    }
    render(){
        const {view_mode,moment_list,searchs} = this.state
        return (
            <div className="animated fadeIn">
                <Card title='精彩瞬间管理' extra={
                    <>
                        <Button className='m_2' onClick={()=>{
                            this.props.history.push('/meetting/activity/edit/0')
                        }}>添加活动</Button>
                    </>
                }>
                    <Input.Search className='m_w200 m_2' placeholder='手机号/姓名' value={searchs} onChange={e=> this.setState({ searchs: e.target.value })} onSearch={this.onSearch}></Input.Search>
                   
                    <Table
                        columns={this.col}
                        rowSelection={{
                            selectedRowKeys:this.state.keys,
                            onChange:(keys)=>{
                                this.setState({ keys })
                            }
                        }}
                        rowKey='id'
                        dataSource={this.state.moment_list}
                        pagination={{
                            current: this.page_current+1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper:true,
                            onChange: (val)=>{
                                let pathname = this.props.history.location.pathname
                                this.props.history.replace(pathname + '?page=' + val)
                                this.page_current = val - 1
                                this.getMoment()
                                // this.getMallGoods()
                            },
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
        { dataIndex:'articleId',key:'articleId',title:'ID' },
        { dataIndex:'title',key:'title',title:'精彩活动名称' },
        { dataIndex:'',key:'',title:'活动封面',width:90,render:(item,ele)=>{
            return(
                <img src={ele.articleImg} className='head-example-img' onClick={()=>{
                    this.setState({ showImgPanel: true, previewImage:ele.image })
                }}></img>
            )
        }},
        { dataIndex:'pubTime',key:'pubTime',title:'发布时间',render:(item,ele)=>{
            return moment().format('YYYY-MM-DD HH:mm')
        }},
        // { dataIndex:'order',key:'order',title:'排序',render:(item,ele,index)=>{
        //     return <InputNumber defaultValue={ele.order}></InputNumber>
        // }},
        { width:250,dataIndex:'',key:'',title:'操作',render:(item,ele,index)=>{
            return(
                <>
                    <Button size='small' type={ele.status==1?'primary':''} className='m_2' onClick={this.onClick.bind(this,ele,'status')}>{ele.status==1?'禁用':'启用'}</Button>
                    <Button size='small' type={ele.isTop==1?'primary':''} className='m_2' onClick={this.onClick.bind(this,ele,'top')}>{ele.isTop==1?'取消置顶':'置顶'}</Button>
                    <Button size='small' className='m_2' onClick={()=>{
                        this.props.history.push('/meetting/activity/view/'+ele.articleId)
                    }}>查看</Button>
                    <Button size='small' className='m_2' onClick={()=>{
                        this.props.history.push('/meetting/activity/edit/'+ele.articleId)
                    }}>修改</Button>
                   
                    <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this.onClick.bind(this,ele,'delete')}>
                        <Button size='small' className='m_2'>删除</Button>
                    </Popconfirm>
                    <Button size='small' loading={this.state.loads} onClick={this.onExports.bind(this,ele.articleId)} className='m_2'>导出</Button>
                </>
            )
        }},

    ]
}

const LayoutComponent = MeettingActivity;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        moment_list:state.meet.moment_list,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
