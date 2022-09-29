import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, Tabs} from 'antd'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';

class ExchangeList extends Component{
    state = {
        view_mode:false,
        tab:'1',
        loading:false,
        rowKey:[],
        images:[],
        username:'',
        content:'',
        keys:[],
    }
    data_list = [
        {addr:'李，1723212323，上海******',num:4,goods:'芦荟胶',pubTime:15649483875,username:'李双shau',id:'2',content:'【一起拍夜景吧！】手机能拍星空，也能陪你走过春夏秋冬，还能拍部电影轻轻松松，主要是大眼萌微云台立了功！看完#朱广权夜游中国#（链接：L央视新闻的微博视频）大家是不是跃跃欲试想要应用学到的手机拍照技巧？邀你参与“试试X50”活动一展身手！还有惊喜奖品哦',status:0,img:[
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/xfcv3o9r1596790175609.png',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/rnaqvi231596779992804.png',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/3fx8apva1597199283189.png',
        ]},
        {addr:'李，1723212323，北京******',num:6,goods:'大山',pubTime:15649483875,username:'李双shau',id:'3',content:'【一起拍夜景吧！】手机能拍星空，也能陪你走过春夏秋冬，还能拍部电影轻轻松松，主要是大眼萌微云台立了功！看完#朱广权夜游中国#（链接：L央视新闻的微博视频）大家是不是跃跃欲试想要应用学到的手机拍照技巧？邀你参与“试试X50”活动一展身手！还有惊喜奖品哦',status:1,img:[
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
    render(){
        const {view_mode} = this.state
        return (
            <div className="animated fadeIn">
                <Card title='兑换列表' extra={<Button>导出</Button>}>
                    <Input.Search className='m_w200' placeholder=''></Input.Search>
                    
                    <Tabs activeKey={this.state.tab} onChange={tab=>this.setState({ tab })} className='mt_10 mb_10'>
                        <Tabs.TabPane key='1' tab='待审核'></Tabs.TabPane>
                        <Tabs.TabPane key='2' tab='已审核'></Tabs.TabPane>
                    </Tabs>
                    <Table
                        rowKey='id'
                        rowSelection={{
                            selectedRowKeys:this.state.keys,
                            onChange:(keys)=>{
                                this.setState({ keys })
                            }
                        }}
                        loading={this.state.loading}
                        columns={this.col}
                        dataSource={this.data_list}
                        pagination={{
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
                <Modal title='输入物流单号' visible={this.state.expressPanel} maskClosable={false} okText={'确定'} cancelText='取消' onCancel={() => {
                    this.setState({ expressPanel: false })
                }}>
                    <Input></Input>
                </Modal>
                

            </div>
        )
    }
    onEdit(ele){
        const {img,username,content} = ele
        let  images = []
        // img.map(ele=>{
        //     images.push({
        //         uid:ele,
        //         type:'image/png',
        //         status:'done',
        //         url:ele,
        //     })
        // })
        this.setState({ images:img,content,username,editPanel:true })
    }
    col = [
        { dataIndex:'id',key:'id',title:'ID',width:100 },
        { dataIndex:'username',key:'username',title:'用户名' },
        { dataIndex:'pubTime',key:'pubTime1',title:'手机号',ellipsis:true },
        { dataIndex:'goods',key:'goods',title:'兑换商品' },
        { dataIndex:'num',key:'num',title:'兑换券数量' },

        { dataIndex:'addr',key:'addr',title:'收货地址' },
        { width:250,dataIndex:'',key:'',title:'操作',render:(item,ele,index)=>{
            return(
                <>
                    {this.state.tab=='2'?
                        '圆通快递 30234234234'
                        :
                        <Button onClick={()=>{this.setState({ expressPanel:true })}} size='small' className='m_2'>物流单号回填</Button>
                    }
                </>
            )
        }},
    ]
}

const LayoutComponent = ExchangeList;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
