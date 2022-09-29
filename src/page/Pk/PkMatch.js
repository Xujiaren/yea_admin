import React, { Component } from 'react';
import connectComponent from '../../util/connect'
import {InputNumber,Card,Table,Button,Modal, Form, Input, message, DatePicker, Popconfirm, Avatar} from 'antd'
import moment from 'moment'
import SwitchCom from '../../components/SwitchCom'
import AntdOssUpload from '../../components/AntdOssUpload'
import locale from 'antd/es/date-picker/locale/zh_CN';
import PersonTypePublic from '../../components/PersonTypePublic'
import Editor from '../../components/Editor'

class PkMatch extends Component {
	state = { 
        data_list:[],
        total:0,
        page:0,
        pageSize:10,

        begin_time:'',
        end_time:'',
        match_img:'',
        match_name:'',
        flag:'',
        match_id:0,
        mtype:0,
        rule:'',
        status:0,

        imgList:[],
        atime:null,
        view_reward:false,

        reward_list:[],
        edit_index:-1,
        award_name:"",
        award_id:0,
        award_num:"",
        begin_rank:0,
        end_rank:0,
        
        rank_page:0,
        rank_pageSize:10,
        rank_match_id:0,
        rank_list:[],
        rank_total:0,
    };
    editor = {
        toHTML:()=>''
    }
    img = {
        getValue:()=>''
    }
    flag = {
        getValue:()=>''
    }
	componentDidMount() {
        this.getPkMatch()
    }
    getPkMatchRank = ()=>{
        this.setState({ rank_loading:true })
        const {rank_page,rank_pageSize,rank_match_id} = this.state
        this.props.actions.getPkMatchRank({
            page: rank_page,
            pageSize: rank_pageSize,
            match_id: rank_match_id,
            resolved:(res)=>{
                this.setState({ rank_loading:false })
            },
            rejected:()=>{
                this.setState({ rank_loading:false })
            }
        })
    }
    getPkMatch = ()=>{
        this.props.actions.getPkMatch({
            resolved:(res)=>{
                console.log(res)
                if(Array.isArray(res)){
                    this.setState({ data_list:res })
                }
            }
        })
    }
    actionPkMatch = (action,match_id)=>{
        this.props.actions.actionPkMatch({
            action,match_id,
            resolved:(res)=>{
                message.success('提交成功')
                this.getPkMatch()
            },
            rejected:()=>{

            }
        })
    }
    setPkMatch = ()=>{
        let {
            view,
            match_img,
            match_name,
            
            match_id,
            mtype,
            rule,
            status,
            atime
        } = this.state
        let begin_time = ''
        let end_time = ''
        let flag = ''
        if(Array.isArray(atime) && atime.length === 2){
            begin_time = atime[0].format('YYYY-MM-DD HH:mm')
            end_time = atime[1].format('YYYY-MM-DD HH:mm')
        }

        if(view){
            this.setState({ setPanel:false })
            return;
        }
        match_img = this.img.getValue()
        flag = this.flag.getValue()

        if(!match_name) { message.info('请输入专题赛名称');return  }
        if(!match_img) { message.info('请上传图片');return  }

        this.setState({ loading:true })
        this.props.actions.setPkMatch({
            begin_time,
            end_time,
            match_img,
            match_name,
            flag,
            match_id,
            mtype,
            rule,
            status,
            resolved:(res)=>{
                this.setState({ 
                    loading:false,
                    setPanel:false
                })
                message.success('提交成功')
                this.getPkMatch()
            },
            rejected:()=>{
                this.setState({ loading:false })
            }
        })
    }
    setPkMatchRule = ()=>{
        let {
            match_img,
            match_name,
            atime,
            match_id,
            mtype,
            rule,
            status,
            begin_time,
            end_time,
            flag,
        } = this.state
        rule = this.editor.toHTML()
        if(Array.isArray(atime) && atime.length === 2){
            begin_time = atime[0].format('YYYY-MM-DD HH:mm')
            end_time = atime[1].format('YYYY-MM-DD HH:mm')
        }

        this.props.actions.setPkMatch({
            begin_time,
            end_time,
            match_img,
            match_name,
            flag,
            match_id,
            mtype,
            rule,
            status,
            resolved:(res)=>{
                this.setState({ 
                    loading:false,
                    rulePanel:false
                })
                message.success('提交成功')
                this.getPkMatch()
            },
            rejected:()=>{
                this.setState({ loading:false })
            }
        })
    }
    onAdd = ()=>this.setState({
        view:false,
        setPanel:true,

        imgList:[],
        atime:null,
        match_img:'',
        match_name:'',
        flag:'',
        match_id:0,
        mtype:0,
        rule:'',
        status:0,
    })
    renderTitle = ()=>{
        return (
            <>
                {/* <Button className='m_2'>设置</Button> */}
                <Button className='m_2' onClick={this.onAdd}>添加专题</Button>
            </>
        )
    }
    setPkMatchReward = ()=>{
        const {match_id,reward_list,reward_view} = this.state
        if(reward_view){ this.setState({ rewardPanel:false }); return; }
        if(reward_list.length == 0){ message.info('请设置实物商品'); return; }

        this.props.actions.setPkMatchReward({
            atype:0,
            match_id,
            json: JSON.stringify(reward_list),
            resolved:(res)=>{
                message.success('提交成功')
                this.setState({ rewardPanel:false })
            },
            rejected:()=>{

            }
        })
    }
    getPkMatchReward = ()=>{
        const {match_id} = this.state
        this.props.actions.getPkMatchReward({
            match_id,
            resolved:(res)=>{
                let reward_list = []
                if(Array.isArray(res)){
                    reward_list = res.map(ele=>({
                        atype: ele.atype,
                        award_id: ele.awardId,
                        award_name: ele.awardName,
                        award_num: ele.awardNum,
                        begin_rank: ele.beginRank,
                        end_rank: ele.endRank
                    }))
                }
                this.setState({ reward_list })
                console.log(res)
            }
        })
    }
    onDelete = (index)=>{
       const {reward_list} = this.state
       this.setState({ reward_list: reward_list.filter((ele,idx)=>idx !== index) })              
    }
    onAddReward = ()=>{
        let {edit_index,reward_list,award_name,begin_rank,end_rank} = this.state

        if(!award_name){ message.info('请输入商品名称'); return }
        if(isNaN(begin_rank)||isNaN(end_rank)){ message.info('名次请取数字'); return }
        if( begin_rank%1!==0 || end_rank%1!==0 ){ message.info('名次请取整数'); return }

        if(edit_index === -1){
            reward_list.push({
                award_id:0,
                award_name,
                begin_rank,
                end_rank,
                award_num:0,
            })
        }else{
            reward_list[edit_index]['award_name'] = award_name
            reward_list[edit_index]['begin_rank'] = begin_rank
            reward_list[edit_index]['end_rank'] = end_rank
        }
        this.setState({ reward_list,editPanel:false  })
    }
	render() {
        const {view,data_list,total,page,pageSize} = this.state
		return (
			<div className="animated fadeIn" >
                <Card title='专题赛管理' extra={this.renderTitle()}>
                    <Table
                        scroll={{x:1200}}
                        rowKey='matchId'
                        columns={this.col} 
                        dataSource={data_list}
                        pagination={false}
                    >
                    </Table>
                </Card>
                
                <Modal title='查看排行' footer={null} visible={this.state.rankPanel} maskClosable={false} onCancel={()=>{
                    this.setState({rankPanel:false})
                }}>
                    <Table
                        size='small'
                        dataSource={this.state.rank_list}
                        columns={[
                            {title:'用户ID',render:(item,ele)=>{
                                return  ele.userId
                            }},
                            {title:'头像',render:(item,ele)=>{
                                return  <Avatar src={ele.avatar}></Avatar>
                            }},
                            {title:'昵称',render:(item,ele)=>{
                                return  ele.nickname
                            }},
                            {title:'排位类型',render:(item,ele)=>{
                                return  ele.rtype === 1?'月榜': ele.rtype === 2?'周榜':'总榜'
                            }},
                            {title:'分数',dataIndex:'score',key:'score'},
                            {title:'结算时间',render:(item,ele)=>{
                                if(ele.pubTime)
                                    return moment.unix(ele.pubTime).format('YYYY-MM-DD')
                                return '暂无'
                            }},
                        ]}
                        pagination={{
                            current: this.state.rank_page+1,
                            pageSize: this.state.rank_pageSize,
                            total: this.state.rank_total,
                            onChange:(val)=>this.setState({ rank_page: val-1 }),
                            showTotal:(t)=>'总共'+t+'条'
                        }}
                    >
                    </Table>
                    {
                        this.state.reward_view?null:
                        <Button className='m_2' onClick={()=>{
                            this.setState({ 
                                editPanel:true,
                                edit_index:-1,
                                begin_rank:0,
                                end_rank:0,
                                award_name:''
                            })
                        }}>添加</Button>
                    }
                </Modal>

                <Modal title={
                    this.state.reward_view?'查看奖品':'修改奖品'
                } onOk={this.setPkMatchReward} okText='确定' cancelText='取消' visible={this.state.rewardPanel} maskClosable={false} onCancel={()=>{
                    this.setState({rewardPanel:false})
                }}>
                    <Table
                        size='small'
                        dataSource={this.state.reward_list}
                        columns={[
                            {title:'序号',render:(item,ele,index)=>index+1},
                            {title:'名次',render:(item,ele)=>{
                                return  ele.begin_rank+'至'+ele.end_rank
                            }},
                            {title:'商品名',dataIndex:'award_name',key:'award_name'},
                            {title:'操作',render:(item,ele,idx)=>{
                                if(this.state.reward_view) return null
                                return (
                                    <>
                                        <a className='m_2' onClick={()=>{
                                            this.setState({ 
                                                editPanel:true,
                                                edit_index: idx,
                                                begin_rank: ele.begin_rank,
                                                end_rank: ele.end_rank,
                                                award_name: ele.award_name,
                                                award_id: ele.award_id
                                            })
                                        }}>修改</a>
                                        <a className='m_2' onClick={this.onDelete.bind(this,idx)}>删除</a>
                                    </>
                                )
                            }}
                        ]}
                        pagination={false}
                    >
                    </Table>
                    {
                        this.state.reward_view?null:
                        <Button className='m_2' onClick={()=>{
                            this.setState({ 
                                editPanel:true,
                                edit_index:-1,
                                begin_rank:0,
                                end_rank:0,
                                award_name:''
                            })
                        }}>添加</Button>
                    }
                </Modal>
                <Modal 
                    title={'实物商品编辑'} 
                    onOk={this.onAddReward} 
                    okText='确定' 
                    cancelText='取消' 
                    visible={this.state.editPanel} 
                    maskClosable={false} 
                    onCancel={()=>{
                        this.setState({editPanel:false})
                    }}
                >
                    <Form labelCol={{span:4}} wrapperCol={{span:20}}>
                        <Form.Item label='商品名称'>
                            <Input disabled={view} value={this.state.award_name} onChange={(e)=>{
                                this.setState({ award_name:e.target.value })
                            }}></Input>
                        </Form.Item>
                        <Form.Item label='名次'>
                            <InputNumber  disabled={view}  value={this.state.begin_rank} min={0} onChange={begin_rank=>{
                                this.setState({ begin_rank })
                            }}></InputNumber>
                            <span className='m_2'>至</span>
                            <InputNumber  disabled={view}  value={this.state.end_rank} min={0} onChange={end_rank=>{
                                this.setState({ end_rank })
                            }}></InputNumber>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={
                    this.state.match_id == 0?'添加':
                    this.state.view?'查看':'修改'
                } onOk={this.setPkMatch} okText='确定' cancelText='取消' visible={this.state.setPanel} maskClosable={false} onCancel={()=>{
                    this.setState({setPanel:false})
                }}>
                    <Form labelCol={{span:4}} wrapperCol={{span:20}}>
                        <Form.Item label='专题名称'>
                            <Input disabled={view} value={this.state.match_name} onChange={(e)=>{
                                this.setState({ match_name:e.target.value })
                            }}></Input>
                        </Form.Item>
                        <Form.Item label='图片'>
                            <AntdOssUpload
                                disabled={view}
                                ref={ref=>this.img = ref}
                                accept='image/*'
                                value={this.state.imgList}
                                actions={this.props.actions}
                            >
                            </AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='状态'>
                            <SwitchCom  disabled={view}  value={this.state.status} onChange={(status)=>{
                                this.setState({ status })
                            }}></SwitchCom>
                        </Form.Item>
                        <Form.Item label='活动周期'>
                            <DatePicker.RangePicker
                                disabled={view}
                                allowClear={false}
                                locale={locale}
                                format='YYYY-MM-DD HH:mm'
                                showTime={{format:'HH:mm'}}
                                value={this.state.atime}
                                onChange={(date,str)=>{
                                    this.setState({ atime:date })
                                }}>
                            </DatePicker.RangePicker>
                        </Form.Item>
                        <Form.Item label="发布对象">
                            <PersonTypePublic 
                                ref={ref=>this.flag=ref} 
                                actions={this.props.actions} 
                                contentId={this.state.match_id} 
                                ctype='11' 
                                showUser={this.state.match_id=='0'?false:true} 
                                disabled={view} 
                                flag={this.state.flag} 
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal width={800} zIndex={8} title='设置规则' onOk={this.setPkMatchRule} okText='确定' cancelText='取消' visible={this.state.rulePanel} maskClosable={false} onCancel={()=>{
                    this.setState({rulePanel:false})
                }}>
                    <Editor ref={ref=>this.editor = ref} actions={this.props.actions} content={this.state.rule}>
                        
                    </Editor>
                </Modal>
                <Modal zIndex={99} visible={this.state.imgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({imgPanel:false})
                }}>
                    <img alt="图片／视频" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                

			</div>
		);
    }
    col = [
        {title:'ID',dataIndex:'matchId',key:'matchId'},
        {title:'专题名称',dataIndex:'matchName',key:'matchName'},
        {title:'图片',render:(item,ele)=>(
            <a>
                <img onClick={()=>{
                    this.setState({ previewImage:ele.matchImg,imgPanel:true })
                }} className="head-example-img" src={ele.matchImg}/>
            </a>
        )},
        {title:'专题周期',render:(item,ele)=>{
            return moment.unix(ele.beginTime).format('YYYY-MM-DD') +
            '至' +
            moment.unix(ele.endTime).format('YYYY-MM-DD')
        }},
        {title:'状态',render:(item,ele)=>{
            return ele.status == 1?'已上架':'未上架'
        }},
        {fixed:'right',width:280,title:'操作',render:(item,ele)=>(
            <div>
                 <Button className='m_2' size='small' onClick={()=>{
                    this.setState({ rank_match_id:ele.matchId,rankPanel:true },this.getPkMatchRank)
                }}>查看排行</Button>
                <Button className='m_2' size='small' onClick={()=>{
                    this.setState({ match_id:ele.matchId, reward_view:true,rewardPanel:true },this.getPkMatchReward)
                }}>查看奖品</Button>
                <Button className='m_2' size='small' onClick={()=>{
                    this.setState({ match_id:ele.matchId, reward_view:false,rewardPanel:true },this.getPkMatchReward)
                }}>奖品编辑</Button>
                <Button className='m_2' size='small' onClick={()=>{
                    let atime = null
                    if(ele.beginTime && ele.endTime)
                        atime = [moment.unix(ele.beginTime),moment.unix(ele.endTime)]
                    this.setState({ 
                        view:true,
                        setPanel:true,
                        atime,
                        match_name:ele.matchName,
                        imgList:[{ 
                            uid:'uid',
                            type:'image/png',
                            url:ele.matchImg,
                            status:'done'
                        }],
                        status:ele.status,
                        match_id:ele.matchId,
                        flag:ele.flag
                    })
                }}>查看</Button>
                 <Button className='m_2' size='small' onClick={()=>{
                     let atime = null
                     if(ele.beginTime && ele.endTime)
                         atime = [moment.unix(ele.beginTime),moment.unix(ele.endTime)]
                    this.setState({ 
                        view:false,
                        setPanel:true,
                        atime,
                        match_name:ele.matchName,
                        imgList:[{ 
                            uid:'uid',
                            type:'image/png',
                            url:ele.matchImg,
                            status:'done'
                        }],
                        status:ele.status,
                        match_id:ele.matchId,
                        flag:ele.flag,
                        rule:ele.rule
                    })
                }}>修改</Button>
                <Button className='m_2' size='small' onClick={()=>{
                    let atime = null
                    if(ele.beginTime && ele.endTime)
                        atime = [moment.unix(ele.beginTime),moment.unix(ele.endTime)]

                    this.setState({ 
                        rulePanel:true,
                        atime,
                        match_name:ele.matchName,
                        match_img:ele.matchImg,
                        status:ele.status,
                        match_id:ele.matchId,
                        flag:ele.flag,
                        
                    },()=>{
                        this.setState({ rule:ele.rule })
                    })
                }}>规则</Button>
                <Button  className='m_2' onClick={this.actionPkMatch.bind(this,'status',ele.matchId)} size='small' type={ele.status?'primary':''}>
                    {ele.status?'禁用':'启用'}
                </Button>
                <Popconfirm onConfirm={this.actionPkMatch.bind(this,'delete',ele.matchId)} title='确定删除吗' okText='确定' cancelText='取消'>
                    <Button size='small' className='m_2'>删除</Button>
                </Popconfirm>
            </div>
        )}
    ]
}

const LayoutComponent = PkMatch;
const mapStateToProps = state => {
	return {

	}
}

export default connectComponent({ LayoutComponent, mapStateToProps })