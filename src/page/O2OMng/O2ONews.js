import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import {Icon,Tooltip,Empty,Tag,Checkbox,Tabs,DatePicker,message,Pagination,Switch,Modal,Form,Card,Select ,Input, Radio} from 'antd';

import connectComponent from '../../util/connect';
import _ from 'lodash'
import 'braft-editor/dist/index.css'
import moment from 'moment';
import * as ComFn from '../../components/CommonFn'
import {Button,Popconfirm} from '../../components/BtnComponent'

const {Search} = Input;

class O2ONews extends Component {

    constructor(props){
        super(props)
        this.state = {
            edit : true,
            view : true,
            showImgPanel:false,
            previewImage:'',

            teacher_id:'',
            atype:0,
            ctype:13,
            keyword:''
        }
    }

    news_list=[]
    page_total=0
    page_current=1
    page_size=12

    _onPage = (val)=>{
        const {actions} = this.props;
        let pathname = this.props.history.location.pathname
        let {keyword,teacher_id,atype,ctype} = this.state
        this.props.history.replace(pathname+'?page='+val)

        actions.getNews({
            keyword,
            teacher_id,
            atype,
            ctype,
            page:val-1,
            pageSize:this.page_size
        })
    }

    _onSearch = (val)=>{
        const {actions} = this.props
        let {keyword,teacher_id,atype,ctype} = this.state

        actions.getNews({
            keyword,
            teacher_id,
            atype,
            ctype,
            page:this.page_current-1,
            pageSize:this.page_size
        })
        this.setState({
            keyword:val
        })
    }
    actionNews(action,article_id){

        console.log(action,article_id)
        const {actions} = this.props
        const {keyword, teacher_id, atype, ctype} = this.state
        actions.actionNews({
            article_id,
            action,
            resolved:()=>{
                actions.getNews({
                    keyword,
                    teacher_id,
                    atype,
                    ctype,
                    page:this.page_current-1,
                    pageSize: this.page_size,
                    ctype: ctype
                })
                message.success('提交成功')
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    componentWillMount(){
        const {actions} = this.props;
        const {search} = this.props.history.location
        const { teacher_id,atype,keyword,ctype } = this.state
        let page =0
        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page+1
        }
       
        actions.getNews({
            keyword,
            teacher_id,
            atype,
            page:page,
            pageSize:this.page_size,
            ctype:ctype
        })
    }

    componentWillReceiveProps(n_props){
        
        if(n_props.news_list !==this.props.news_list){
            if(n_props.news_list.data.length == 0){
                message.info('暂时没有数据')
            }
            //排序
            this.news_list = n_props.news_list.data
            this.page_total=n_props.news_list.total
            this.page_current=n_props.news_list.page+1
        }
        
    }
    
    render(){
        
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="O2O资讯管理">
                            <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    <Search
                                        placeholder=''
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keyword}
                                        onChange={(e)=>{
                                            this.setState({ keyword:e.target.value })
                                        }}
                                    />
                                </div>
                                <div>
                                    <Button value='o2onews/add' onClick={()=>{
                                        this.props.history.push('/o2o/o2oNews/edit/-1')
                                    }}>添加</Button>
                                </div>
                            </div>
                            <Table responsive size="sm">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th style={{minWidth: '60px'}}>资讯ID</th>
                                        <th>资讯名称</th>
                                        <th>副标题</th>
                                        <th style={{minWidth:'100px'}}>封面</th>
                                      
                                        <th style={{minWidth:'100px'}}>发布时间</th>
                                        <th style={{minWidth:'100px'}}>点赞数</th>
                                        <th style={{minWidth:'100px'}}>点击数</th>
                                        <th style={{minWidth:'100px'}}>收藏数</th>
                                        <th style={{minWidth:'100px'}}>浏览数</th>
                                        {/*
                                        <th style={{display:'flex',alignItems:'center',width:'60px'}}>
                                            <span style={{marginRight:'5px'}}>排序</span>
                                            <Tooltip placement='right' title={<span style={{fontSize:'12px'}}>数值越大越靠前</span>}>
                                                <Icon type="question-circle" size={'small'}/>
                                            </Tooltip>
                                        </th>*/}
                                        <th style={{width:'350px'}}>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.news_list.length == 0?
                                    <tr>
                                        <td colSpan={12}>
                                            <Empty className="mt_20 mb_10" description='暂时没有数据'></Empty>
                                        </td>
                                    </tr>
                                    :
                                    this.news_list.map((ele,index)=>(
                                    <tr key={index+'_news'}>
                                        <td>
                                        </td>
                                        <td>{ele.articleId}</td>
                                        <td>
                                            <div className='video_content'>
                                                <Tooltip title={ele.title}>{ele.title}</Tooltip>
                                            </div>
                                            <div className='be_ll_gray'>
                                                <Tooltip title={`/subPages/pages/find/artDesc?articleId=${ele.articleId}`}>
                                                    <a>查看链接</a>
                                                </Tooltip>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="video_content">
                                                <Tooltip title={ele.summary}>{ele.summary}</Tooltip>
                                            </div>
                                        </td>
                                        <td>
                                            <a>
                                                <img 
                                                    onClick={()=>{
                                                        this.setState({ previewImage:ele.articleImg, showImgPanel:true })
                                                    }}
                                                    className="head-example-img" 
                                                    src={ele.articleImg}
                                                />
                                            </a>
                                        </td>
                                        {/*
                                        <td>
                                            {ele.tagList.map((_ele,_index)=>(
                                                <Tag className='m_2' key={_index+'_tag'}>{_ele.tagName}</Tag>
                                            ))||<Tag>无标签</Tag>}
                                        </td>
                                        */}
                                        <td>{moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')}</td>
                                        <td>{ele.likeNum}</td>
                                        <td>{ele.hit}</td>
                                        <td>{ele.collectNum}</td>
                                        <td>{ele.hit}</td>
                                        {/*<td>{ele.sortOrder}</td>*/}
                                        <td>
                                            <div>
                                                {/*
                                                <Button className='m_2' size={'small'} onClick={()=>{
                                                    this.props.history.push('/todo-list/comment-list/'+ele.articleId+'?ctype=11')
                                                }}>
                                                    所有评论
                                                </Button>
                                                <Button type={ele.isTop==1?"primary":''} size={'small'} className='m_2'
                                                    onClick={this.actionNews.bind(this,'top',ele.articleId)}
                                                >
                                                    {ele.isTop==1?'取消置顶':'置顶'}
                                                </Button>
                                                */}
                                                <Button value='o2onews/status' type={ele.status==1?"primary":''} size={'small'} className='m_2'
                                                    onClick={this.actionNews.bind(this,'status',ele.articleId)}
                                                >
                                                    {ele.status==1?'下架':'上架'}
                                                </Button>
                                                
                                                <Button value='o2onews/view'  onClick={()=>{
                                                    this.props.history.push({
                                                        pathname:'/o2o/o2oNews/edit/'+ele.articleId,
                                                        state:{type:'view'}
                                                    })
                                                }}  type="primary" size={'small'} className='m_2'>查看</Button>
                                                <Button value='o2onews/edit'  onClick={()=>{
                                                    this.props.history.push({
                                                        pathname:'/o2o/o2oNews/edit/'+ele.articleId,
                                                        state:{type:'edit'}
                                                    })
                                                }}  type="primary" size={'small'} className='m_2'>修改</Button>
                                                <Popconfirm
                                                    value='o2onews/del' 
                                                    okText="确定"
                                                    cancelText='取消'
                                                    title='确定删除吗？'
                                                    onConfirm={this.actionNews.bind(this,'delete',ele.articleId)}
                                                >
                                                    <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                    ))}                 
                                    
                                </tbody>
                            </Table>
                            </div>
                            <Pagination showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper onChange={this._onPage} pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                            
                        </Card>
                    </Col>
                </Row>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={()=>{
                    this.setState({showImgPanel:false})
                }}>
                    <img alt="预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <style>
                    {`
                        .table thead th {
                            vertical-align: baseline;
                            border-top: 1px solid #c8ced3;
                            border-bottom: none;
                        }
                    `}
                </style>
            </div>
        )
    }
    columnsGoods = [
        {
            title: '资讯ID',
            dataIndex: 'articleId',
            key: 'articleId',
        },
        {
            title: '资讯名称',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '副标题',
            dataIndex: 'goodsName',
            key: 'goodsName',
            ellipsis: true,
        },
        {
            title: '封面',
            dataIndex: 'goodsImg',
            key: 'goodsImg',
            render:(ele,record)=>(
                <a>
                    <img onClick={()=>{this._onPreviewImg(record)}} className="head-example-img" src={record.articleImg}/>
                </a>
            )
        },
        
        {
            title: '价格',
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
            render:(ele,record)=>record.goodsPrice+'元'
        },
        {
            title: '添加时间',
            dataIndex: 'pubTime',
            key: 'pubTime',
            render:(item,record)=>record.pubTime==0?'':moment.unix(record.pubTime).format('YYYY-MM-DD HH:mm')
        },
        
        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder'
        },
        {
            title: '启用状态',
            dataIndex: 'status',
            key: 'status',
            render:(item,record)=>(record.status == 1?'已启用':'未启用')
        },
        {
            title: '操作',
            key: 'action',
            render:(item, ele) =>(
                <div>
                    {/*
                    <Button className='m_2' size={'small'} onClick={()=>{
                        this.props.history.push('/todo-list/comment-list/'+ele.articleId+'?ctype=11')
                    }}>
                        所有评论
                    </Button>
                    <Button type={ele.isTop==1?"primary":''} size={'small'} className='m_2'
                        onClick={this.actionNews.bind(this,'top',ele.articleId)}
                    >
                        {ele.isTop==1?'取消置顶':'置顶'}
                    </Button>
                    */}
                    <Button type={ele.status==1?"primary":''} size={'small'} className='m_2'
                        onClick={this.actionNews.bind(this,'status',ele.articleId)}
                    >
                        {ele.status==1?'下架':'上架'}
                    </Button>
                    
                    <Button value='' onClick={()=>{
                        this.props.history.push({
                            pathname:'/o2o/o2oNews/edit/'+ele.articleId,
                            state:{type:'view'}
                        })
                    }}  type="primary" size={'small'} className='m_2'>查看</Button>
                    <Button value=''  onClick={()=>{
                        this.props.history.push({
                            pathname:'/o2o/o2oNews/edit/'+ele.articleId,
                            state:{type:'edit'}
                        })
                    }}  type="primary" size={'small'} className='m_2'>修改</Button>
                    <Popconfirm 
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.actionNews.bind(this,'delete',ele.articleId)}
                    >
                        <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ]
}
const LayoutComponent = O2ONews;
const mapStateToProps = state => {
    return {
        news_list:state.news.news_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
