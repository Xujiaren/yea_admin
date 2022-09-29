import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, Tabs, InputNumber} from 'antd'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';

class Sun extends Component{
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
    data=[1]
    page_current = 0
    page_total = 0
    page_size = 10
    col = [
        {title:'第一天',render:()=>(<InputNumber />)},
        {title:'第二天',render:()=>(<InputNumber />)},
        {title:'第三天',render:()=>(<InputNumber />)},
        {title:'第四天',render:()=>(<InputNumber />)},
        {title:'第五天',render:()=>(<InputNumber />)},
        {title:'第六天',render:()=>(<InputNumber />)},
        {title:'第七天',render:()=>(<InputNumber />)},
    ]
    componentWillMount(){

    }
    componentWillReceiveProps(n_props){
        
    }
    render(){
        const {view_mode} = this.state
        return (
            <div className="animated fadeIn">
                <Card title='阳光管理'>
                    <Card type='inner' className='mb_10' title='设置签到阳光数' extra={<Button>保存</Button>}>
                        <Table pagination={false} size={'small'} columns={this.col} dataSource={this.data}></Table>
                    </Card>
                    <Card type='inner' className='mb_10' title='设置分享阳光数' extra={<Button>保存</Button>}>
                        <span className='pad_r5'>分享获得</span>
                        <InputNumber placeholder='填写阳光数'/>
                    </Card>
                    <Card type='inner' title='设置步数兑换阳光数' extra={<Button>保存</Button>}>
                        <span className='pad_r5'> 100 步 = </span>
                        <InputNumber placeholder='填写阳光数'/>
                    </Card>
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
}

const LayoutComponent = Sun;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
