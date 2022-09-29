import React, { Component } from 'react';
import { Table, PageHeader,Card,Form,Modal,Checkbox,DatePicker,Menu, Dropdown, Button, Icon, message,Input,Pagination, Select} from 'antd';
import {Link,NavLink} from 'react-router-dom'
import connectComponent from '../../../util/connect';
import {interval} from '../../../config/config'
import moment from 'moment'

const { Search } = Input;


class InviteDetail extends Component {
    state = {
        visible: false,
        list:[],
        keyword:'',
        invite_info: [],
        page_total: 0,
        page_current: 0,
        page_size: 10,
        title:''
    };
    
    id = ''
    componentWillMount(){
        console.log(this.props)
        let {search} = this.props.location
        this.setState({ title:search.slice(1,search.length) })
    }
    componentDidMount(){
        this.id = this.props.match.params.id
        this.setState({
            user_id:this.id,
        },()=>{
            this.getInviteById()
        })
    }

    getInviteById = ()=>{
        const { user_id,keyword,page_current,page_size } = this.state
        const {actions} = this.props
        actions.getInviteById({
            user_id: user_id,
            keyword,
            page:page_current,
            pageSize:page_size,
            resolved:(res)=>{
                console.log(res)
                const {page,total,data} = res
                this.setState({
                    page_current:page,
                    page_total: total,
                    invite_info: data||[]
                })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    onSearch = (val)=>{
        
        this.setState({
            page_current: 0
        },()=>{
            this.getInviteById()
        })
    }
    _onPage=(val)=>{
        this.setState({
            page_current: val -1
        },()=>{
            this.getInviteById()
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    render() {
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
        <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title=""
            subTitle={this.state.title+" 邀请详情"}
        >
            <Card>
                <Search
                    placeholder="关键词"
                    onSearch={this.onSearch}
                    style={{ maxWidth: 200 }}
                    value={this.state.keyword}
                    onChange={e=>{
                        this.setState({ keyword:e.target.value })
                    }}
                    className='mb_10'
                />
                <Table columns={this.col} rowKey='userId' dataSource={this.state.invite_info||[]}  pagination={{
                    current: this.state.page_current+1,
                    pageSize: this.state.page_size,
                    total: this.state.page_total,
                    showQuickJumper:true,
                    onChange: (val)=>{
                        this.setState({page_current:val-1},()=>{
                            this.getInviteById()
                        })
                    },
                    showTotal:(total)=>'总共'+total+'条'
                }} />
            </Card>
            </PageHeader>
        </div>
        );
    }
    col = [
        { dataIndex:'userId',key:'userId',title:'用户ID' },
        { dataIndex:'nickName',key:'nickName',title:'昵称' },
        { dataIndex:'sn',key:'sn',title:'卡号' },
        { dataIndex:'username',key:'username',title:'姓名' },
        { dataIndex:'mobile',key:'mobile',title:'手机号' },
        { dataIndex:'integral',key:'integral',title:'金币奖励' },
        { dataIndex:'pubTime',key:'pubTime',title:'邀请时间',render:(item,ele)=>{
            return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        } },
        
    ]
}

const LayoutComponent =InviteDetail;
const mapStateToProps = state => {
    return {
        invite_info:state.ad.invite_info
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
