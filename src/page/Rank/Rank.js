import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {Tabs, DatePicker, message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, InputNumber} from 'antd'
import moment from 'moment'
import Editor from '../../components/Editor'
import { getKeywords } from '../../redux/service/ad';
const { RangePicker } = DatePicker;
class Rank extends Component{
    state = {
        view_mode:false,
        status:0,
        data_list:[
            {title:'学霸周榜',id:1},
            {title:'金币月榜',id:2},
            {title:'活跃月榜',id:3},
        ],
        listPanel:false,
        rulePanel:false,
        tab: '1',
        id:0,
        begin:'',
        end:'',
        ranks:'',
        text:'',
        showsettings:false,
        sn:'',
        rewardId:0
    }
    post_list = [
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
    componentDidMount(){
        this.Text()
    }
    componentWillMount(){
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }
        this.getActiveReward()
       
    }
    componentWillReceiveProps(n_props){
        if (n_props.post_list !== this.props.post_list) {
            this.post_list = n_props.post_list.data;
            this.page_total = n_props.post_list.total
            this.page_current = n_props.post_list.page
        }
        if(n_props.check_list!==this.props.check_list){
            this.setState({
                ranks:n_props.check_list[0].val
            })
        }
        if(n_props.nums!==this.state.nums){
            console.log(n_props.nums)
            if(n_props.nums.length>0){
                this.setState({
                    text:n_props.nums[0].val
                })
            }
        }
    }
    onOpen=(id)=>{
        this.setState({ listPanel:true,id:id })
        const{actions} = this.props
        actions.getCheck(id,'rank')
    }
    getActiveReward = ()=>{
        this.props.actions.getRankRewards({
            atype:-1,
            begin_time:'',
            end_time:'',
            ctype:-1,
            is_admin:-1,
            keyword:'',
            page:this.page_current,
            pageSize:this.page_size,
            status:-1,
            user_id:0,
        })
    }
    onDate = (e) => {
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        var begintime = e[0]._d.Format("yyyy-MM-dd hh:mm")
        var endtime = e[1]._d.Format("yyyy-MM-dd hh:mm")
        this.setState({
            begin: begintime,
            end: endtime
        })
    }
    Text=()=>{
		const{actions}=this.props
		actions.getNums('ranks_text','teacher')
	}
    onOkey=()=>{
		const{text}=this.state
		const{actions}=this.props
		actions.publishNum({
			keyy:'ranks_text',
			section:'teacher',
			val:text,
			resolved:(res)=>{
				message.success({
					content:'操作成功'
				})
				this.Text()
				this.setState({
					rulePanel:false
				})
			},
			rejected:(err)=>{
				console.log(err)
			}
		})
	}
    onOkeys = () => {
        const { actions } = this.props
        const { rewardId, sn } = this.state
        if (!sn) { message.info({ content: '请填写单号' }); return; }
        actions.updatePost({
            reward_id: rewardId,
            ship_sn: sn,
            resolved: (res) => {
                message.success({
                    content: "操作成功"
                })
                this.setState({
                    showsettings: false
                })
                this.getActiveReward()
            }
        })
    }
    render(){
        const {view_mode} = this.state
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
        return (
            <div className="animated fadeIn">
                <Card title='榜单管理' extra={
                    <>
                        <Button className='m_2' onClick={()=>{
                            this.setState({ rulePanel:true })
                        }}>规则</Button>
                    </>
                }>
                    <Tabs activeKey={this.state.tab} onChange={tab=>this.setState({ tab })} className='mt_10 mb_10'>
                        <Tabs.TabPane key='1' tab='榜单列表'>
                            <Table
                                columns={this.col}
                                rowKey='id'
                                dataSource={this.state.data_list}
                                pagination={{
                                    showQuickJumper:true,
                                    showTotal:(total)=>'总共'+total+'条'
                                }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane key='2' tab='中奖列表'>
                            <Table
                                columns={this.col_r}
                                dataSource={this.post_list}
                                pagination={{
                                    current: this.page_current+1,
                                    pageSize: this.page_size,
                                    total: this.page_total,
                                    showQuickJumper: true,
                                    onChange: (val) => {
                                        let pathname = this.props.history.location.pathname
                                        this.props.history.replace(pathname + '?page=' + val)
                                        this.page_current = val - 1
                                        this.getActiveReward()
        
                                    },
                                    showTotal: (total) => '总共' + total + '条'
                                }}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                    
                </Card>
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
                    onOk={this.onOkeys}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                     <Form {...formItemLayout}>
                        <Form.Item label='单号'>
                            <Input value={this.state.sn} style={{width:'300px'}} onChange={(e) => { this.setState({ sn: e.target.value }) }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal title='规则设置' width={800} visible={this.state.rulePanel}  onOk={this.onOkey} onCancel={()=>this.setState({rulePanel:false})}>
                    {/* <Editor actions={this.props.actions}></Editor> */}
                    <Input.TextArea autoSize={{minRows:6}} defaultValue={'签到规则设置'} value={this.state.text} onChange={e=>{this.setState({text:e.target.value})}}></Input.TextArea>
					<div style={{color:'red',fontSize:'14px',marginTop:'5px'}}>提示:换行请用";"隔开</div>
                </Modal>
                <Modal title='获奖名单' okText='确定' cancelText='取消' visible={this.state.listPanel} onCancel={()=>this.setState({listPanel:false})}>
                    {/* <DatePicker></DatePicker> */}
                    {
                        this.state.id!=1?
                        <div style={{color:'red',fontSize:'12px',marginBottom:'10px'}}>提示:开始时间请选择本月1号</div>
                        :null
                    }
                    <Table rowKey='id' pagination={false} size='small' columns={this.reward_col} dataSource={this.v_list} bordered={true} />
                </Modal>
                <style>{`.bf-modal{ z-index:88888 }`}</style>
            </div>
        )
    }
    v_list = [
        {id:1,time:'2020.6.1 -- 2020.6.7'},
        // {id:2,time:'2020.6.8 -- 2020.6.13'},
    ]
    reward_col = [
        // { dataIndex:'id', key:'id',title:'序号' },
        { dataIndex:'', key:'',title:'时间',render:(item,ele)=>{
            return(
                <>
                    <RangePicker format='YYYY-MM-DD HH:mm' onChange={this.onDate} allowClear={false}/>
                    <div style={{color:'red',fontSize:'12px', marginTop:'10px'}}>注：此日期选择仅限于查看名单(榜单中奖时间固定每周或每月开奖)</div>
                </>
            )
        }},
        { dataIndex:'title', key:'title',title:'操作',render:(item,ele)=>{
            return(
                <>
                    <Button size={'small'} className='m_2' onClick={()=>{
                        if(!this.state.begin&&!this.state.end){
                            message.info({content:'请选择日期'})
                        }else{
                            this.props.history.push('/rank/list/'+this.state.id+'/'+this.state.ranks+'/'+this.state.begin+'/'+this.state.end)
                        }
                    }}>查看名单</Button>
                    {/* <Button size={'small'} className='m_2'>导出名单</Button> */}
                </>
            )
        }},
    ]
    col_r = [
        { dataIndex:'rewardId',key:'rewardId',title:'ID',width:100 },
        { dataIndex:'nickname',key:'nickname',title:'用户名' },
        { dataIndex:'mobile',key:'mobile',title:'手机号',ellipsis:true },
        { dataIndex:'winningTime',key:'winningTime',title:'中奖时间',ellipsis:true},
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

        { dataIndex:'address',key:'address',title:'收货信息' },

        { dataIndex:'rankName',key:'rankName',title:'来源'},
        { width:250,dataIndex:'',key:'',title:'操作',render:(item,ele,index)=>{
            if(ele.ctype==1)
            return(
                <>
                    {ele.shipSn?
                        '单号：'+ele.shipSn
                        :
                        <Button onClick={()=>{this.setState({ expressPanel:true })}} size='small' className='m_2' onClick={()=>{
                            if(!ele.address){
                                message.info({
                                    content:'用户暂未填写地址'
                                })
                            }else{
                                this.setState({
                                    rewardId:ele.rewardId,
                                    showsettings:true
                                })
                            }
                        }}>物流单号回填</Button>
                    }
                </>
            )
            else
            return ''
        }},
    ]
    col = [
        { dataIndex:'id',key:'id',title:'ID' },

        { dataIndex:'title',key:'title',title:'榜单名称' },
        { width:250,dataIndex:'',key:'',title:'操作',render:(item,ele,index)=>{
            return(
                <>
                    <Button size='small' className='m_2' onClick={()=>{
                        this.props.history.push('/rank/edit/'+ele.id)
                    }}>奖品设置</Button>
                    <Button size='small' className='m_2'
                        onClick={this.onOpen.bind(this, ele.id)
                    }>获奖名单</Button>
                </>
            )
        }},

    ]
}

const LayoutComponent = Rank;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        post_list:state.user.rankRewards,
        check_list:state.ad.check_list,
        nums:state.user.nums,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
