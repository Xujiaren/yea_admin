import React, { Component } from 'react';

import {Table,Icon,Tooltip,Empty,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio} from 'antd';

import connectComponent from '../../util/connect';
import _ from 'lodash'
import 'braft-editor/dist/index.css'
import moment from 'moment';
import * as ComFn from '../../components/CommonFn'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Search} = Input;

class ColumnManager extends Component {

    constructor(props){
        super(props)
        this.state = {
            edit : true,
            view : true,
            showImgPanel:false,
            previewImage:'',

            teacher_id:'',
            atype:0,
            ctype:15,
            keyword:'',
            loading:false
        }
    }

    news_list=[]
    page_total=0
    page_current=0
    page_size=10

    _onPage = (val)=>{
        let pathname = this.props.history.location.pathname
        this.props.history.replace(pathname+'?page='+val)
        this.page_current = val - 1
        this.getData()
    }

    _onSearch = (val)=>{
        this.setState({
            keyword:val
        },()=>{
            this.page_current = 0
            this.getData()
        })
    }
    actionNews(action,article_id){
        this.props.actions.actionNews({
            article_id,
            action,
            resolved:()=>{
                message.success('提交成功')
                this.getData()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    componentWillMount(){
        const {search} = this.props.history.location
        let page =0
        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page
        }
        this.getData()
    }

    componentWillReceiveProps(n_props){

        if(n_props.news_list !==this.props.news_list){
            this.setState({ loading:false })
            if(n_props.news_list.data.length == 0){
                message.info('暂时没有数据')
            }
            //排序
            this.news_list = n_props.news_list.data
            this.page_total=n_props.news_list.total
            this.page_current=n_props.news_list.page
        }
        
    }
    getData = ()=>{
        this.setState({ loading:true })
        const { teacher_id,atype,keyword,ctype } = this.state
        this.props.actions.getNews({
            keyword,
            teacher_id,
            atype,
            ctype,
            page:this.page_current,
            pageSize: this.page_size,
            ctype: ctype
        })
    }
    render(){
        
        return(
            <div className="animated fadeIn">
                <Card title="专题管理" extra={
                    <div>
                        <Button value='special/add' className='m_2' onClick={()=>{
                            this.props.history.push('/col/edit/-1')
                        }}>添加</Button>
                        <Button value='special/comment' className='m_2' onClick={()=>{
                            this.props.history.push('/todo-list/comment-list/15/-1')
                        }}>评论列表</Button>
                    </div>
                }>
                    <Search
                        placeholder=''
                        onSearch={this._onSearch}
                        style={{ maxWidth: 200 }}
                        value={this.state.keyword}
                        onChange={(e)=>{
                            this.setState({ keyword:e.target.value })
                        }}
                        className='mb_10'
                    />
                    <Table loading={this.state.loading} columns={this.col} dataSource={this.news_list||[]}  pagination={{
                        current: this.page_current+1,
                        pageSize: this.page_size,
                        total: this.page_total,
                        showQuickJumper:true,
                        onChange: (val)=>{
                            this.page_current = val-1
                            this.getData()
                        },
                        showTotal:(total)=>'总共'+total+'条'
                    }} />
                </Card>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showImgPanel:false})
                }}>
                    <img alt="预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
    col = [
        {
            title: '专题ID',
            dataIndex: 'articleId',
            key: 'articleId',
        },
        {
            title: '专题名称',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render:(item,ele)=>(
            <>
                <Tooltip title={ele.title}>
                <div className='text_more'>{ele.title}</div>
                </Tooltip>
                <div className='be_ll_gray'>
                    <Tooltip title={`/subPages/pages/find/projectDesc?articleId=${ele.articleId}`}>
                        <a>查看链接</a>
                    </Tooltip>
                </div>
            </>
            )
        },
        {
            title: '副标题',
            dataIndex: 'summary',
            key: 'summary',
            ellipsis: true,
        },
        {
            title: '封面',
            dataIndex: 'articleImg',
            key: 'articleImg',
            render:(record,ele)=>(
                <a>
                    <img 
                        onClick={()=>{
                            this.setState({ previewImage:ele.articleImg, showImgPanel:true })
                        }}
                        className="head-example-img" 
                        src={ele.articleImg}
                    />
                </a>
            )
        },
        
        {
            title: '发布时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        },
        {
            title: '点赞数',
            dataIndex: 'likeNum',
            key: 'likeNum',
        },
        {
            title: '播放次数',
            dataIndex: 'hit',
            key: 'hit'
        },
        {
            title: '收藏数',
            dataIndex: 'collectNum',
            key: 'collectNum'
        },
        {
            title: '评论数',
            dataIndex: 'comment',
            key: 'comment'
        },
        {
            title: '分享次数',
            dataIndex: 'shareNum',
            key: 'shareNum'
        },
        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
        },
        {
            title: '操作',
            key: 'action',
            width: 280,
            render:(item, ele) =>(
                <div>
                    
                    <Button value='special/top' type={ele.isTop==1?"primary":''} size={'small'} className='m_2'
                        onClick={this.actionNews.bind(this,'top',ele.articleId)}
                    >
                        {ele.isTop==1?'取消推荐':'推荐'}
                    </Button>
                   
                    <Button value='special/status' type={ele.status==1?"primary":''} size={'small'} className='m_2'
                        onClick={this.actionNews.bind(this,'status',ele.articleId)}
                    >
                        {ele.status==1?'下架':'上架'}
                    </Button>
                    
                    <Button value='special/view' onClick={()=>{
                        this.props.history.push({
                            pathname:'/col/edit/'+ele.articleId,
                            state:{type:'view'}
                        })
                    }}  type="primary" size={'small'} className='m_2'>查看</Button>
                    <Button value='special/edit'  onClick={()=>{
                        this.props.history.push({
                            pathname:'/col/edit/'+ele.articleId,
                            state:{type:'edit'}
                        })
                    }}  type="primary" size={'small'} className='m_2'>修改</Button>
                    <Button value='special/comment' className='m_2' size={'small'} onClick={()=>{
                        this.props.history.push('/todo-list/comment-list/15/'+ele.articleId)
                    }}>
                        评论
                    </Button>
                    <Popconfirm
                        value='special/del'
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.actionNews.bind(this,'delete',ele.articleId)}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                    {/* <Button type={ele.isTop==1?"primary":''} size={'small'} className='m_2'
                        onClick={this.actionNews.bind(this,'top',ele.articleId)}
                    >
                        {ele.isTop==1?'取消推荐':'推荐'}
                    </Button> */}
                </div>
            ),
        },
    ]
}
const LayoutComponent = ColumnManager;
const mapStateToProps = state => {
    return {
        news_list:state.news.news_list,
        user:state.site.user,
        rule:state.site.user.rule
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
