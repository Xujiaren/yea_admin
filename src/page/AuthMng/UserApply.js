import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import { List, Modal, InputNumber,Divider,Table,Tag,Checkbox, Empty,Spin,Radio,Icon,Upload,PageHeader,Switch,Form,Card,Select ,Input,Button,message, DatePicker, Popconfirm} from 'antd';
import moment from 'moment'
import connectComponent from '../../util/connect';
import ModalPanel from '../../components/ModalPanel'
import cookie from 'react-cookies'
import LoginM from '../LoginM'
class UserApply extends Component {
    constructor(props) {
        document.title = '签到'
        super(props);
    }
    state = {
        view_mode:false,
        exportLoading:false,
        
        squad_user_list:[],
        showCheckPannel:false,
        showImportPannel:false,
        showResult:false,
        importLoading:false,

        keyword:'',
        file_list:[],
        excelFileList:[],
        rejectedUser:[],
        show:false,
        msg:'',
        squad_id:'',
        class_list:[],
        showList:false,

    }
    page_total=0
    page_current=1
    page_size=10
    squad_user_list=[]
    stype = 0

    componentWillMount(){
        document.title = '签到'
        cookie.save('url',this.props.location.pathname, { path: '/',maxAge:60*60*24 * 7 })
    }
    componentDidMount(){
        document.title = '签到'
        const username = cookie.load('admin_name')
        const {squad,id} = this.props.match.params
        this.user_id = id
        this.squad_id = squad
        // cookie.save('url',this.props.location.pathname, { path: '/',maxAge:60*60*24 * 7 })
        if (typeof username == 'undefined') {
            message.info({
                content: '请验证管理员账号',
                onClose:()=>{
                    this.setState({ visible:true })
                }
            })
        }else{
            this.startSignUser()
            // this._onSignUser()
        }

    }

    startSignUser = ()=>{
        const {actions} = this.props
        actions.getUserClassById({
            user_id: this.user_id,
            resolved:(data)=>{
                if(data instanceof Array){
                    
                    if(data.length == 1){
                        this.setState({ squad_id: data[0].squadId },()=>{
                            this.signUser()
                        })
                    }else if(data.length == 0){
                        this.setState({ show:true,msg:'该用户未报名任何培训班' })
                    }else{
                        this.setState({ class_list:data,showList:true })
                    }
                }
            },
            rejected:(data)=>{
                if(data == 'please login first'){
                    message.info({
                        content: '请验证管理员账号',
                        onClose:()=>{
                            this.setState({ visible:true,showList:false })
                        }
                    })
                }else{
                    this.setState({ visible:true })
                    message.info(JSON.stringify(data))
                }
            }
        })
    }
    componentWillReceiveProps(n_props){

    }

    
    signUser = ()=>{
        const {actions} = this.props
        const user_id = this.user_id
        const {squad_id} = this.state
        actions.sighSquadUser({
            type:'new_apply',
            squad_id,
            user_id:user_id+'',
            resolved:(data)=>{
                console.log(data)
                this.setState({ showList:false },()=>{
                    this.setState({show:true,msg:'签到成功'})
                })
            },
            rejected:(data)=>{
                if(data == 'please login first'){
                    message.info({
                        content: '请验证管理员账号',
                        onClose:()=>{
                            this.setState({ visible:true,showList:false })
                        }
                    })
                }else{
                    this.setState({show:true,msg:data})
                }
            }
        })
    }
    
    close = ()=>{
        console.log(this.state.showList)
        if(this.state.showList==true&&this.state.show==true){
            this.setState({ show:false })
        }else{
            if( window.WeixinJSBridge){
                window.WeixinJSBridge.call('closeWindow')
            }else{
                var opened=window.open('about:blank','_self'); opened.close(); window.close()
            }
        }
        
    }
    render(){
        const content = this.state.visible?
            <LoginM actions={this.props.actions} parent={this}/>
            :
            <div className="animated fadeIn">
                <ModalPanel title={this.state.msg} content='' visible={this.state.show}  onClose={this.close}/>
            </div>

        return(
            <>
                {content}
                <Modal maskClosable={false} title='请选择要签到的班级' footer={null} visible={this.state.showList} onCancel={this.close}>
                    <List
                        size="large"
                        bordered
                        dataSource={this.state.class_list}
                        renderItem={item => 
                            <List.Item onClick={()=>{ this.setState({ squad_id:item.squadId },()=>{ this.signUser() }) }}>{item.squadName}</List.Item>
                        }
                    />
                </Modal>
            </>
        )
    }
   
}
const LayoutComponent = UserApply;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        squad_user_list:state.o2o.squad_user_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
