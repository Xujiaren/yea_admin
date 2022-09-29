import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { PageHeader,Table, Radio, Popconfirm, Pagination, Switch, Modal, Form, Card, Select, Input, Button, Empty, InputNumber, message } from 'antd';

import connectComponent from '../../util/connect';
import _ from 'lodash'
import * as ComFn from '../../components/CommonFn'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';
import action from '../../redux/action';
import { Object } from 'core-js';
const { Search } = Input;

class AuthClassScore extends Component {
    state = {
        visible: false,
        editTitle: '添加',
        isView: false,

        keyword: '',
        parent_id: '0',
        categoryId: '0',
        categoryName: '',
        sortOrder: 0,
        status: 0,
        ctype: this.props.match.path === '/auth/topic-cate' ? '96' : '18',
        cctype: '-1',
        action: 'none',
        link: '',
        is_must: 0,

        edit: true,
        view: true,

        category_list: [],
        parent_list: [],
        loading:false,
        data_list:[],
        total:0,
        page:0,
        pageSize: 10,
        loading:false,
    };
  
    componentWillMount() {
        this.squad_id = this.props.match.params.id
        this.getSquadScore()
    }
    componentWillReceiveProps(n_props) {
        if (n_props.auth_squad_score !== this.props.auth_squad_score) {
            const {data,total,page} = n_props.auth_squad_score
            if(Array.isArray(data)){
                this.setState({ data_list:data,total,page })
            }
            this.setState({ loading:false })
        }

    }
    getSquadScore = ()=>{
        this.setState({ loading:true })
        const {actions} =this.props
        const {keyword,page,pageSize} = this.state
        actions.getSquadScore({
            squad_id:this.squad_id,
            keyword,
            page: page,
            pageSize: pageSize
        })
    }
    exportSquadScore(type){
        this.setState({loading:true})
        const {actions} = this.props

        actions.exportSquadScore({
            squad_id:this.squad_id,
            type:type,

            resolved:(data)=>{
                console.log(data)
                const {address} = data
                message.success('导出成功')
                window.open(address,'_black')
                this.setState({loading:false})
            },
            rejected:(data)=>{
                message.error(data)
                this.setState({loading:false})
            }
        })
        
    }
    _onSearch = (val) => {
        this.setState({ page:0,keyword: val },()=>{
            this.getSquadScore()
        })
    }
    
    render() {
        const { keyword, categoryId, categoryName, sortOrder, status, ctype, cctype, parent_id } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card style={{ minHeight: '400px' }}>
                            <PageHeader
                                className="pad_0"
                                ghost={false}
                                onBack={() => window.history.back()}
                                title=""
                                subTitle='成绩管理'
                            >
                            <div className="flex f_row j_space_between align_items mb_10">
                                <div>
                                    <Search
                                        placeholder="关键词"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={keyword}
                                        onChange={(e) => {
                                            this.setState({ keyword: e.currentTarget.value })
                                        }}
                                    />
                                </div>
                                <div>
                                    <Button loading={this.state.loading} onClick={this.exportSquadScore.bind(this,'')} className='m_2'>导出</Button>
                                    <Button loading={this.state.loading} onClick={this.exportSquadScore.bind(this,'unpass')} className='m_2'>导出不及格名单</Button>
                                </div>
                            </div>
                            <div style={{ minHeight: '300px' }}>
                                <Table expandIcon={() => null} rowKey='testId' columns={this.col} dataSource={this.state.data_list} pagination={{
                                    current: this.state.page + 1,
                                    pageSize: this.state.pageSize,
                                    total: this.state.total,
                                    showQuickJumper:true,
                                    onChange: (val)=>{
                                        this.setState({ page: val-1 },this.getSquadScore)
                                    },
                                    showTotal:(total)=>'总共'+total+'条'
                                }} />
                            </div>
                        </PageHeader>
                        </Card>
                    </Col>
                </Row>
                
            </div>
        )
    }
    col = [
        { title: 'ID', dataIndex: 'testId', key: 'testId' },
        { title: '会员名', dataIndex: 'userName', key: 'userName', },
        { title: '手机号', dataIndex: '', key: '',render:(item,ele)=>{
            if(ele.squadUser == null){
                ele.squadUser = {}
            }
            if(Object.keys(ele.squadUser).indexOf('mobile') > -1){
                return ele.squadUser.mobile||'暂无'
            }else{
                return '暂无'
            }
        }},
        { title: '卡号', dataIndex: 'squadUser.sn', key: 'squadUser.sn', },
        { title: '对应试卷', dataIndex: 'paperName', key: 'paperName', },
        { title: '题目总数', dataIndex: 'topicNum', key: 'topicNum', },
        { title: '成绩', dataIndex: 'score', key: 'score', },
        { title: '正确数量', dataIndex: 'correctNum', key: 'correctNum', },
        { title: '是否通过', dataIndex: 'isPass', key: 'isPass',render:(item,ele)=>{
            if(ele.isPass == 1) return '通过'
            else return '未通过'
        }},
        
    ]
}
const LayoutComponent = AuthClassScore;
const mapStateToProps = state => {
    return {
        auth_squad_score: state.auth.auth_squad_score,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
