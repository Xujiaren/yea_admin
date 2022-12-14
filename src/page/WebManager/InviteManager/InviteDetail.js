import React, { Component } from 'react';
import { Table, PageHeader,Card,Form,Modal,Checkbox,DatePicker,Menu, Dropdown, Button, Icon, message,Input,Pagination, Select} from 'antd';
import {Link,NavLink} from 'react-router-dom'
importÂ connectComponentÂ fromÂ '../../../util/connect';
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
            subTitle={this.state.title+" éè¯·è¯¦æ"}
        >
            <Card>
                <Search
                    placeholder="å³é®è¯"
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
                    showTotal:(total)=>'æ»å±'+total+'æ¡'
                }} />
            </Card>
            </PageHeader>
        </div>
        );
    }
    col = [
        { dataIndex:'userId',key:'userId',title:'ç¨æ·ID' },
        { dataIndex:'nickName',key:'nickName',title:'æµç§°' },
        { dataIndex:'sn',key:'sn',title:'å¡å·' },
        { dataIndex:'username',key:'username',title:'å§å' },
        { dataIndex:'mobile',key:'mobile',title:'ææºå·' },
        { dataIndex:'integral',key:'integral',title:'éå¸å¥å±' },
        { dataIndex:'pubTime',key:'pubTime',title:'éè¯·æ¶é´',render:(item,ele)=>{
            return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
        } },
        
    ]
}

constÂ LayoutComponentÂ =InviteDetail;
constÂ mapStateToPropsÂ =Â stateÂ =>Â {
Â Â Â Â returnÂ {
        invite_info:state.ad.invite_info
Â Â Â Â }
}
exportÂ defaultÂ connectComponent({LayoutComponent,Â mapStateToProps});
