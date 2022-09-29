import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, InputNumber} from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom';
// import Seed from '../Tree/Seed';

class RankEdit extends Component{
    state = {
        view_mode:false,
        course_type:1,
        course_exchange:2,
        is_must:0,
        status:0,
        id:0,
        p_list:[],
        fileList:[],
        fileList1:[],
        editPanel:false,
        edit_index:-1,
        edit_title:'',
        edit_intro:'',
        posterList:[],
        imgList:[],
        isVideo:false,
        begin:'',
        end:'',
        num:0,
        id:0,
        values:[],
        keys:[],
        showsettings:false,
        reward_id:0,
        sn:''
    }
    post_list=[
        {id:1,name:'妮妮',mobile:'1723123456',to:'李加家',toMobile:'17242134123',addr:'广东省广州市民',index:1,type:'实物',price:'风扇'},
        {id:2,name:'妮妮',mobile:'1342334888',to:'李加二',toMobile:'17242134123',addr:'广东省广州市民',index:2,type:'实物',price:'毛巾'},
        {id:3,name:'妮妮',mobile:'135312127656',to:'李加三',toMobile:'17242134123',addr:'广东省广州市民',index:3,type:'实物',price:'电冰箱'},
    ]
    rank_list=[]
    page_current = 0
    page_total = 0
    page_size = 10
    componentWillMount(){
        const { id,rank,begin,end } = this.props.match.params
        let ranks = JSON.parse(rank)
        let valuses = Object.values(ranks)
        let keys = Object.keys(ranks)
        console.log(keys,valuses)
        this.setState({
            values:valuses,
            keys:keys
        })
        let value = Object.keys(ranks)[Object.keys(ranks).length-1]
        let num = value.split('-')[1]
        // if(path=='/tree/seed/view/:id'){
        //     this.setState({ view_mode:true })
        // }
        // if(parseInt(id)!==0){
        //     this.setState({id:parseInt(id)})
        // }
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }
        // this.getActiveReward()
        const{actions}=this.props
        console.log(begin,end,num,id)
        this.setState({
            begin:begin,
            end:end,
            num:parseInt(num),
            id:parseInt(id)-1
        },()=>{
            this.rankRewards()
        })
        // actions.getUserRanks({
        //     beginTime:begin,
        //     endTime:end,
        //     limit:parseInt(num),
        //     type:parseInt(id)-1
        // })
    }
    // ranks=()=>{
    //     const{actions}=this.props
    //     const{begin,end,num,id}=this.state
    //     actions.getUserRanks({
    //         beginTime:begin,
    //         endTime:end,
    //         limit:num,
    //         type:id
    //     })
    // }
    rankRewards=()=>{
        const{actions}=this.props
        const{id,begin,end}=this.state
        let atype =11
        if(id==0){
            atype=11
        }
        if(id==1){
            atype=12
        }
        if(id==2){
            atype=13
        }
        actions.getRankRewards({
            atype:atype,
            begin_time:begin,
            end_time:end,
            ctype:-1,
            is_admin:-1,
            keyword:'',
            page:this.page_current,
            pageSize:this.page_size,
            status:-1,
            user_id:0,
        })
    }
    componentWillReceiveProps(n_props){
        // if (n_props.post_list !== this.props.post_list) {
        //     this.post_list = n_props.post_list.data;
        //     this.page_total = n_props.post_list.total
        //     this.page_current = n_props.post_list.page
        // }
        // if(n_props.user_ranks!==this.props.user_ranks){
        //     this.rank_list = n_props.user_ranks
        // }
        if(n_props.rankRewards!==this.props.rankRewards){
            this.rank_list=n_props.rankRewards.data
        }
    }
    getActiveReward = ()=>{
        const {id} = this.props.match.params
        const {path} = this.props.match
        this.props.actions.getPost({keyword:'',page:this.page_current,pageSize:10,activity_id:id})
    }
    onOkey=()=>{
        const{sn,reward_id}=this.state
        const{actions}=this.props
        if(!sn){message.info({content:'请填写单号'});return;}
        actions.updatePost({
            reward_id:reward_id,
            ship_sn:sn,
            resolved:(res)=>{
                message.success({
                    content:"操作成功",
                })
                this.setState({
                    showsettings:false,
                    reward_id:0
                })
                this.rankRewards()
            }
        })
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
        const {view_mode,id,isVideo} = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle='获奖名单'
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            <Table rowKey='id' pagination={false}  columns={this.v_col} dataSource={this.rank_list} bordered={true} 
                            pagination={{
                                current: this.page_current+1,
                                pageSize: this.page_size,
                                total: this.page_total,
                                showQuickJumper: true,
                                onChange: (val) => {
                                    let pathname = this.props.history.location.pathname
                                    this.props.history.replace(pathname + '?page=' + val)
                                    this.page_current = val - 1
                                    this.rankRewards()
                                    
                                },
                                showTotal: (total) => '总共' + total + '条'
                            }}
                            />
                        </Card>
                    </PageHeader>
                </Card>
                
                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={90}
                    title="运单设置"
                    visible={this.state.showsettings}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsettings: false })
                    }}
                    onOk={this.onOkey}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='单号'>
                            <Input value={this.state.sn} onChange={(e) => { this.setState({ sn: e.target.value }) }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    
    // v_col = [
    //     { dataIndex:'index', key:'index',title:'序号' },
    //     { dataIndex:'nickname', key:'nickname',title:'用户昵称',ellipsis:false},
    //     // { dataIndex:'mobile', key:'mobile',title:'手机号码',ellipsis:false},
    //     // { dataIndex:'realname', key:'realname',title:'收件人信息',ellipsis:false},
    //     // { dataIndex:'mobile', key:'mobile',title:'收件人手机号',ellipsis:false},
    //     // { dataIndex:'address', key:'address',title:'地址',ellipsis:false},
    //     { dataIndex:'index', key:'index',title:'名次',ellipsis:false},
    //     { dataIndex:'', key:'',title:'奖品类型',ellipsis:false,render:(item,ele,index)=>{
    //         let key = this.state.keys.findIndex(_item=>parseInt(_item.split('-')[0])<=ele.index&&parseInt(_item.split('-')[1])>=ele.index)
    //         return(<>
    //                 {parseInt(this.state.values[key])<6?
    //                     '实物'
    //                     :
    //                     '金币'
                        
    //                 }
    //             </>
    //         )
    //     }},
    //     { dataIndex:'', key:'',title:'奖品',ellipsis:false,render:(item,ele,index)=>{
    //         let key = this.state.keys.findIndex(_item=>parseInt(_item.split('-')[0])<=ele.index&&parseInt(_item.split('-')[1])>=ele.index)
    //         var reward = ['谢谢参与','谢谢参与','电脑包','自拍杆','充电宝','电子翻页笔','金币10个','金币50个','金币100个']
    //         return(
    //             <div>{reward[parseInt(this.state.values[key])]}</div>
    //         )
    //     }},

    // ]
    v_col = [
        { dataIndex:'', key:'',title:'序号' ,render:(item,ele,index)=>{
            return this.page_current*10+index+1
        }},
        { dataIndex:'nickname', key:'nickname',title:'用户昵称',ellipsis:false},
        { dataIndex:'winningTime', key:'winningTime',title:'中奖时间',ellipsis:false},
        // { dataIndex:'mobile', key:'mobile',title:'手机号码',ellipsis:false},
        // { dataIndex:'realname', key:'realname',title:'收件人信息',ellipsis:false},
        // { dataIndex:'mobile', key:'mobile',title:'收件人手机号',ellipsis:false},
        // { dataIndex:'address', key:'address',title:'地址',ellipsis:false},
        { dataIndex:'',key:'',title:'奖品' ,render:(item,ele)=>{
            return(
                <>
                {
                    ele.ctype==1?
                    <div>{ele.itemName}</div>
                    :
                    <div>{ele.itemName}金币</div>
                }   
                </>
            )
        }},
        { dataIndex:'', key:'',title:'收货信息',ellipsis:false,render:(item,ele)=>{
            return(
                <div>{ele.realname} &nbsp;&nbsp; {ele.mobile} &nbsp;&nbsp; {ele.address}</div>
            )
        }},
        { dataIndex:'', key:'',title:'来源',ellipsis:false,render:(item,ele)=>{
            return(
                <div>{this.state.begin}至{this.state.end}获奖名单</div>
            )
        }},
        { dataIndex:'', key:'',title:'操作',ellipsis:false,render:(item,ele)=>{
            if(ele.ctype==1)
            return(
                <>
                {
                    ele.shipSn?
                    <Tag>运单号{ele.shipSn}</Tag>
                    :
                    <Button onClick={()=>{
                        if(!ele.address){
                            message.info({
                                content:'用户暂未填写地址'
                            })
                        }else{
                            this.setState({
                                reward_id:ele.rewardId,
                                showsettings:true
                            })
                        }
                    }}>填写物流单号</Button>
                }
                </>
            )
            else
            return ''
        }},

    ]
    
}

const LayoutComponent = RankEdit;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        post_list:state.dashboard.post_list,
        user_ranks:state.dashboard.user_ranks,
        rankRewards:state.user.rankRewards,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
