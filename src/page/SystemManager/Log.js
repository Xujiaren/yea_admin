import React, { Component } from 'react';
import {Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import {Input,Pagination} from 'antd';
import connectComponent from '../../util/connect';
import moment from 'moment';
import _ from 'lodash'

const { Search } = Input;

class Log extends Component {
    log_list = []
    page_total=0
    page_current=1
    page_size=20

    keyword=''
    state = {
        visible: false,
    };

    _onSearch=(val)=>{
        this.keyword = val
        const {actions} = this.props
        actions.getLog(0,val,this.page_size)
    }
    _onPage = (val)=>{
        const {actions} = this.props;
        actions.getLog(val-1,this.keyword,this.page_size)
    }
    componentDidMount(){
        const {actions} = this.props
        actions.getLog(0,this.keyword,this.page_size)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.log_list!==this.props.log_list){
            this.log_list = nextProps.log_list.data;
            this.page_total=nextProps.log_list.total
            this.page_current=nextProps.log_list.page+1
        }
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
        return (
        <div className="animated fadeIn">
        <Row>
                <Col xs="12" lg="12">
                <Card>
                    <CardHeader className="flex j_space_between align_items">
                        <div className="flex row align_items f_grow_1">
                            <span style={{ flexShrink: 0 }}>搜索&nbsp;&nbsp;</span>
                            {/*
                                <RangePicker style={{ maxWidth: 200 }} locale={locale}/>
                            */}
                            <Search
                                placeholder="关键词"
                                onSearch={this._onSearch}
                                style={{ maxWidth: 200 }}
                            />
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Table hover responsive size="sm">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>管理员</th>
                                <th>操作人姓名</th>
                                <th>IP</th>
                                <th>时间</th>
                                <th>备注</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.log_list.map((ele,index)=>
                                <tr key={index+'log'}> 
                                    <td>{ele.logId}</td>
                                    <td>
                                       {ele.username}
                                    </td>
                                    <td>
                                       {ele.adminUser.realname}
                                    </td>
                                    <td>{ele.pubIp}</td>
                                    <td>{moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                                    <td>{ele.logInfo}</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                        <Pagination showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                    </CardBody>
                </Card>
                </Col>

            </Row>
        </div>
        );
    }
}


const LayoutComponent = Log;
const mapStateToProps = state => {
    console.log(JSON.stringify(state))
    return {
        log_list:state.system.log_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});