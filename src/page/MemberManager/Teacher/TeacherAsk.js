import React,{ Component } from 'react';
import connectComponent from '../../../util/connect';
import {Popover,message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input} from 'antd'
import PieChart from 'bizcharts/lib/plots/PieChart'
import moment from 'moment'
import AntdOssUpload from '../../../components/AntdOssUpload'

class ActivityResult extends Component{
    state = {
        view_mode:false,
        atype:0,
        activity_id:0,
        data:[],

        img_list:[],
        activity_id:0,
        join_id:0,
        gallerId:0,
        imgPanel:false,
        ftype:0,
        data_list:[]
    }
    data_list = []
    result = []
    atype = 0
    activity_id = 0

    componentWillMount(){
        /**
         *  <Radio value={3}>自发投票</Radio>
            <Radio value={4}>问卷</Radio>
            <Radio value={2}>主题活动</Radio>
         */
        const { atype,id } = this.props.match.params
        if(atype&&id){
            // this.setState({ atype,activity_id:id },()=>{
            //     this.getResult()
            // })
            this.atype = atype
            this.activity_id = id
        }
    }
    componentDidMount(){
        if(this.atype&&this.activity_id){
            // this.setState({ atype,activity_id:id },()=>{
            //     this.getResult()
            // })
            
        }
        this.getResult()
    }
    componentWillReceiveProps(n_props){
        if(this.props.activity_result !== n_props.activity_result){
            const atype = this.atype
            // const {atype} = this.state
            const data = n_props.activity_result
            if(data)
                if(atype==3){
                    const _result = Object.keys(data.vote).map(ele=>({type:ele,value:data.vote[ele]}))
                    this.result = _result
                }else if(atype==2){
                    const _result = data.data
                    this.data_list = _result
                }else if(atype==4){
                    this.data_list = Object.keys(data).map(ele=>{
                        let {title,ttype,result} = data[ele][0]
                        if(ttype!==4) result = Object.keys(result).map(_ele=>({ type:_ele,value:result[_ele] }))
                        return {
                            id:ele,
                            title:title,
                            ttype:ttype,
                            result:result
                        }
                    })
                }
        }
    }
    onActionActivityResult(activityId,joinId,galleryId,link,ftype){
        let img_list = []
        if(link != ''){
            img_list.push({
                uid:'uid',
                url: link,
                type: ftype == 1?'video/mp4':'image/png',
                status: 'done'
            })
        }
        this.setState({
            img_list,
            activity_id:activityId,
            join_id:joinId,
            gallerId:galleryId,
            imgPanel:true,
            ftype:ftype
        })
    }
    onActionImg = ()=>{
        const {activity_id,join_id,gallerId} = this.state
        const {actions} = this.props
        let gallery = ""
        if(this.img){
            gallery = this.img.getValue()||""
        }
        if(gallery == ""){
            message.info("请上传图片"); return;
        }
        actions.actionActivityResult({
            activity_id,join_id,gallery,gallerId,
            resolved:(res)=>{
                if(res == '上传成功'){
                    this.getResult()
                    message.success('提交成功')
                    this.setState({
                        imgPanel:false,
                        showImgPanel:false,
                    })
                }
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    getResult = ()=>{
        const {actions} = this.props
        // const {atype,activity_id} = this.state
        actions.getTeachersAsks({
            teacher_id:this.activity_id,
            resolved:(data)=>{
                const atype = this.atype
                // const {atype} = this.state
                if(data)
                    if(atype==3){
                        const _result = Object.keys(data.vote).map(ele=>({type:ele,value:data.vote[ele]}))
                        this.result = _result
                    }else if(atype==2){
                        const _result = data.data
                        this.data_list = _result
                    }else if(atype==4){
                       let data_list = []
                        Object.keys(data).map(ele=>{
                            console.log(ele,'???')
                            let {title,ttype,result} = data[ele][0]
                            if(ttype!==4) result = Object.keys(result).map(_ele=>({ type:_ele,value:result[_ele] }))
                            data_list.push({
                                id:ele,
                                title:title,
                                ttype:ttype,
                                result:result
                            })
                        })
                        this.data_list=data_list
                        this.setState({
                            data_list:data_list
                        })
                    }
            
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
        
    }

    detail = (ele)=>{
        console.log(ele)
        if(ele.ttype==4){
            
            return(
                <Table
                    rowKey='userId'
                    size='small'
                    columns={this.col_info}
                    dataSource={ele.result}
                    pagination={{
                        position: 'bottom',
                        showTotal:(total)=>'总共'+total+'条'
                    }}
                />
            )
        }
        return(
            <div>
                <PieChart
                    data={ele.result}
                    title={{
                        visible: false,
                        text: ''
                    }}
                    description={{
                        visible: true,
                        text: ele.title,
                    }}
                    radius={0.8}
                    angleField='value'
                    colorField='type'
                    label={{
                        visible: true,
                        type: 'outer',
                        offset: 20,
                    }}
                />
            </div>
    )}
    onExport = ()=>{
        this.props.actions.exportActivityResult({
            activity_id:this.activity_id,
            resolved:(res)=>{
                const {address} = res
                message.success({
                    content:'导出成功',
                    onClose:()=>{
                        window.open(address,'_black')
                    }
                })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    render(){
        console.log('times',this.data_list)
        const {view_mode,data} = this.state
        const title = this.atype==4?'调查问卷':this.atype==2?'主题活动':this.atype==3?'自发投票':''
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={title+'结果'}
                        // extra={<Button onClick={this.onExport}>导出</Button>}
                    >
                    <Card title="" style={{minHeight:'400px'}}>
                        {
                            this.atype==2?
                                <Table dataSource={this.data_list} columns={this.check_col} rowKey={'joinId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                    showTotal:(total)=>'总共'+total+'条'
                                }}/>
                            :this.atype==4?
                            <Table
                                columns={this.col}
                                expandedRowRender={this.detail}
                                dataSource={this.state.data_list}
                                pagination={{
                                    position: 'bottom',
                                    // current: this.page_current,
                                    // pageSize: this.page_size,
                                    // total: this.page_total,
                                    // showQuickJumper:true,
                                    // onChange: this._onPage,
                                    showTotal:(total)=>'总共'+total+'条'
                                }}
                            />:
                            <PieChart
                                data={this.result}
                                title={{
                                    visible: true,
                                    text: title
                                }}
                                description={{
                                    visible: true,
                                    text: '',
                                }}
                                radius={0.8}
                                angleField='value'
                                colorField='type'
                                label={{
                                    visible: true,
                                    type: 'outer',
                                    offset: 20,
                                }}
                            />
                        }
                    </Card>
                    </PageHeader>
                </Card>
                <Modal title='修改' onOk={this.onActionImg} zIndex={100} visible={this.state.imgPanel} maskClosable={true} onCancel={()=>{
                    this.setState({imgPanel:false})
                }}>
                   <AntdOssUpload 
                        actions={this.props.actions} 
                        accept={this.state.ftype==1?'video/mp4':'image/*'}
                        value={this.state.img_list}
                        ref={ref=>this.img = ref}
                    />
                </Modal>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal zIndex={99} visible={this.state.showVideoPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showVideoPanel:false})
                }}>
                    <video controls={true} alt="视频预览" src={this.state.previewImage} style={{ width: '100%' }} />
                </Modal>
            </div>
        )
    }
    col = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: false,
            width:100
        },
        {
            width:150,
            title: '题目类型',
            dataIndex: 'ttype',
            key: 'ttype',
            ellipsis: false,
            render:(item,ele)=>ele.ttype==0?'单选题':ele.ttype==3?'多选题':ele.ttype==4?'开放题':'未知',
        },
        {
            title: '题目',
            dataIndex: 'title',
            key: 'title',
            ellipsis: false,
        },
    ]
    col_info = [
        {
            title: 'UID',
            dataIndex: 'userId',
            key: 'userId',
            ellipsis: false,
        },
        {
            title: '回答',
            dataIndex: 'answer',
            key: 'answer',
            ellipsis: false,
        },
    ]
    check_col = [
        {
            title: 'ID',
            dataIndex: 'joinId',
            key: 'joinId',
            ellipsis: false,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            ellipsis: false,
        },
        {
            title: '联系方式',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: '作品名称',
            dataIndex: 'workName',
            key: 'workName',
            ellipsis: true,
        },
        {
            title: '作品描述',
            dataIndex: 'workIntro',
            key: 'workIntro',
            ellipsis: true,
        },
        {
            title: '作品',
            dataIndex: 'workUrl',
            key: 'workUrl',
            ellipsis: false,
            render:(item,ele)=>{
                if(ele.galleries instanceof Array && ele.galleries.length>0){
                    return ele.galleries.map(_ele=>{
                        const {link,ftype} = _ele
                        return(
                        <Popover trigger='hover' content={<>
                            <Button onClick={this.onActionActivityResult.bind(this,ele.activityId,ele.joinId,_ele.galleryId,link,ftype)}>修改作品</Button>
                            <Button onClick={()=>window.open(link,'_black')}>下载作品</Button>
                        </>}>
                            {
                                ftype==0?
                                    <Button key={link} size={'small'} className='m_2' onClick={()=>{ this.setState({ showImgPanel:true,previewImage:link }) }}>查看图片</Button>
                                :ftype==1?
                                    <Button key={link} size={'small'} className='m_2' onClick={()=>{ this.setState({ showVideoPanel:true,previewImage:link }) }}>查看视频</Button>
                                :'未知文件类型'
                            }
                        </Popover>)
                    })
                }else{
                    return '暂无作品'
                }
            }
        },
        {
            title: '投票数',
            dataIndex: 'number',
            key: 'number',
            ellipsis: false
        },
        {
            title: '参加时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        },
        {
            title: '是否审核',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            render:(item,ele)=>{
                console.log(ele,ele.status == 1)
                return ele.status==0?'未审核':ele.status==1?<span style={{color:'green'}}>已通过</span>:<span style={{color:'red'}}>已拒绝</span>
            }
        },
    ]
}

const LayoutComponent = ActivityResult;
const mapStateToProps = state => {
    return {
        user:state.site.user,
        activity_result:state.activity.activity_result
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
