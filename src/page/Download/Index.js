import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {Divider,message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, Tabs, InputNumber} from 'antd'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';

class ImgDownload extends Component{
    state = {
        view_mode:false,
        tab:'1',
        loading:false,
        rowKey:[],
        images:[],
        username:'',
        content:'',
    }
    data_list = []
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
                <Card title='下载专区管理' bodyStyle={{display:'flex',alignItems:'center',flexWrap:'wrap'}} extra={
                    <Button onClick={()=>{
                        this.props.history.push('/imgdownload/edit/0')
                    }}>新建图集</Button>
                }>
                    {this.data_list.map((ele,index)=>(
                        <Card
                            key={index} 
                            style={{ width: '180px',margin:'10px'}} 
                            cover={<img style={{height:'112px'}} src={ele.img} />} 
                            type='inner' hoverable bordered={true} 
                            bodyStyle={{padding:'10px'}}
                        >
                            <Card.Meta title="图片集合" description={
                            <>
                                <a onClick={()=>{ this.props.history.push('/imgdownload/view/1') }}>查看</a>
                                <Divider type='vertical'></Divider>
                                <a onClick={()=>{ this.props.history.push('/imgdownload/edit/1') }}>修改</a>
                                <Divider type='vertical'></Divider>
                                <Popconfirm title='确定删除吗？' cancelText='取消' okText='确定'>
                                    <a>删除</a>
                                </Popconfirm>
                            </>
                            }/>
                        </Card>
                    ))}
                </Card>
                
                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                

            </div>
        )
    }
}

const LayoutComponent = ImgDownload;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
