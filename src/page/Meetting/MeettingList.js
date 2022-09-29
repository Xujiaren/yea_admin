import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, Tabs} from 'antd'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';

class Mood extends Component{
    state = {
        view_mode:false,
        tab:'1',
        loading:false,
        rowKey:[],
        images:[],
        username:'',
        content:'',

    }
    data_list = [
        {pubTime:15649483875,username:'李双shau',moodId:'2',content:'【一起拍夜景吧！】手机能拍星空，也能陪你走过春夏秋冬，还能拍部电影轻轻松松，主要是大眼萌微云台立了功！看完#朱广权夜游中国#（链接：L央视新闻的微博视频）大家是不是跃跃欲试想要应用学到的手机拍照技巧？邀你参与“试试X50”活动一展身手！还有惊喜奖品哦',status:0,img:[
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/xfcv3o9r1596790175609.png',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/rnaqvi231596779992804.png',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/3fx8apva1597199283189.png',
        ]},
        {pubTime:15649483875,username:'李双shau',moodId:'3',content:'【一起拍夜景吧！】手机能拍星空，也能陪你走过春夏秋冬，还能拍部电影轻轻松松，主要是大眼萌微云台立了功！看完#朱广权夜游中国#（链接：L央视新闻的微博视频）大家是不是跃跃欲试想要应用学到的手机拍照技巧？邀你参与“试试X50”活动一展身手！还有惊喜奖品哦',status:1,img:[
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4n820s3l1596704819050.jpg',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/mqzhlk4u1596439457543.png',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/8m7tjazq1597025786127.jpg',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/rnaqvi231596779992804.png',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/rnaqvi231596779992804.png',
        ]},
    ]
    page_current = 0
    page_total = 0
    page_size = 10

    componentWillMount(){

    }
    componentWillReceiveProps(n_props){
        
    }
    info = (record)=>{
        const {img} = record
        if(img instanceof Array)
            return <>
                {
                    img.map(ele=><img src={ele} className='head-example-img m_2' style={{display:'inline-block'}} onClick={()=>{
                        this.setState({ showImgPanel: true, previewImage:ele })
                    }}></img>)
                }
                <div className='mt_10'>{record.content}</div>
            </>
        else return null
    }
    render(){
        const {view_mode} = this.state
        return (
            <div className="animated fadeIn">
                <Card title='心情墙管理'>
                    <Input.Search className='m_w200' placeholder='卡号/手机号/名字'></Input.Search>
                    {/* <div className='mt_10 mb_10'>
                        <Popconfirm title='确定删除吗' okText='确定' cancelText='取消'>
                            <Button size='small' className='m_2'>删除</Button>
                        </Popconfirm>
                        <Button size='small' className='m_2'>推荐</Button>
                        <Button size='small' className='m_2'>取消推荐</Button>
                        <Button size='small' className='m_2'>上架</Button>
                        <Button size='small' className='m_2'>下架</Button>
                    </div> */}
                    <Tabs activeKey={this.state.tab} onChange={tab=>this.setState({ tab })} className='mt_10 mb_10'>
                        <Tabs.TabPane key='1' tab='待审核'></Tabs.TabPane>
                        <Tabs.TabPane key='2' tab='已审核'></Tabs.TabPane>
                    </Tabs>
                    <Table
                        expandedRowRender={this.info}
                        expandedRowKeys={this.state.rowKey}
                        onExpandedRowsChange={(rowKey)=>{
                            this.setState({rowKey})
                        }}

                        loading={this.state.loading}
                        columns={this.col}
                        // rowSelection={{
                        //     selectedRowKeys:this.state.keys,
                        //     onChange:(keys)=>{
                        //         this.setState({ keys })
                        //     }
                        // }}
                        // rowKey='moodId'
                        dataSource={this.data_list}
                        pagination={{
                            current: this.page_current+1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper:true,
                            onChange: (val)=>{
                                this.page_current = val-1
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
                <Modal okText='修改' cancelText='取消' onOk={()=>{
                    message.success('提交成功')
                    this.setState({ editPanel:false })
                }} visible={this.state.editPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ editPanel: false })
                }}>
                   <Form labelCol={{span:4}} wrapperCol={{span:18}}>
                        <Form.Item label='用户名'>{this.state.username}</Form.Item>
                        <Form.Item label='发布内容'>
                            <Input.TextArea autoSize={{minRows:4}} value={this.state.content} onChange={(e)=>this.setState({ content:e.target.value })}></Input.TextArea>
                        </Form.Item>
                        <Form.Item label='发布图片'>
                            <AntdOssUpload 
                                value={this.state.images}
                                accept='image/*'
                                actions={this.props.actions}
                                ref={ref=>this.img = ref}
                                maxLength={20}
                            ></AntdOssUpload>
                        </Form.Item>
                   </Form>
                </Modal>

            </div>
        )
    }
    onEdit(ele){
        const {img,username,content} = ele
        let  images = []
        img.map(ele=>{
            images.push({
                uid:ele,
                type:'image/png',
                status:'done',
                url:ele,
            })
        })
        this.setState({ images,content,username,editPanel:true })
    }
    col = [
        { dataIndex:'moodId',key:'moodId',title:'ID',width:50 },
        { dataIndex:'username',key:'username',title:'用户名' },
        { dataIndex:'content',key:'content',title:'内容',ellipsis:true },
        // { dataIndex:'courseImg',key:'courseImg',title:'课程主图',width:90,render:(item,ele)=>{
        //     return(
        //         <img src='' className='head-example-img' onClick={()=>{
        //             this.setState({ showImgPanel: true })
        //         }}></img>
        //     )
        // }},
        { dataIndex:'pubTime',key:'pubTime',title:'发布时间', render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')},
        { dataIndex:'status',key:'status',title:'状态',render:(item,ele)=>{
            if(this.state.tab=='1') return ''
            return ele.status==1?'已上架':'已下架'
        }},
        { width:250,dataIndex:'',key:'',title:'操作',render:(item,ele,index)=>{
            return(
                <>
                    {this.state.tab=='1'?
                        <Popconfirm title='确定通过吗' okText='通过' cancelText='拒绝'>
                            <Button size='small' className='m_2' type={'primary'}>审核</Button>
                        </Popconfirm>
                        :
                        <>
                            <Button size='small' className='m_2'>{ele.status==1?'审核通过':'审核拒绝'}</Button>
                            <Button size='small' className='m_2' type={ele.status==1?'primary':''}>{index==0?'上架':'下架'}</Button>
                            <Button size='small' className='m_2' onClick={this.onEdit.bind(this,ele)}>修改</Button>
                        </>
                    }
                </>
            )
        }},
    ]
}

const LayoutComponent = Mood;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
