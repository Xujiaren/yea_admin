import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input} from 'antd'

class ActiveResult extends Component{
    state = {
        view_mode:false
    }
    componentWillMount(){

    }
    componentWillReceiveProps(n_props){
        
    }
    
    render(){
        const {view_mode} = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={1?'添加关卡':view_mode?'查看':'修改关卡'}
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            
                        </Card>
                    </PageHeader>
                </Card>
                
                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = ActiveResult;
const mapStateToProps = state => {
    return {
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
