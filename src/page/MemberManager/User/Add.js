import React, { Component } from 'react';
import { Badge, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Avatar,Card,Select,PageHeader,DatePicker,Menu, Dropdown, Button, Icon, message,Input,Pagination,Descriptions} from 'antd';
import {Link,NavLink} from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import connectComponent from '../../../util/connect';
import moment from 'moment';

const {RangePicker} = DatePicker;
const { Search } = Input;
const { Option } = Select;

class Add extends Component {

    state={
        mobile:'',
        nickname:'',
        username:'',
        password:'',
        sex:0,
        user_id:0,
        Identity:'', 
        avatar:'',
        birthday:'1970-01-01',
        integral:'',
        level:0,

        is_auth:0,
        id_level:'',
        id_hlevel:'',
        is_seller:0,
        is_agent_chair:0,
        is_agent_employee:0,
        tabs:'',
        work_sn:''
    }
    _onPublish = ()=>{
        const {actions} = this.props
        const {is_auth,id_level,id_hlevel,is_seller,is_agent_chair,is_agent_employee,mobile,nickname,username, password,sex,user_id,Identity, avatar,birthday,integral,level,work_sn} = this.state;

        if(!nickname){ message.info('昵称不能为空'); return;}
        if(!mobile){ message.info('手机不能为空'); return;}
        //if(!username){ message.info('用户账户不能为空',interval); return;}
        //if(!password){ message.info('密码不能为空',interval); return;}
        //if(!birthday){ message.info('生日不能为空',interval); return;}

        let telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        if(!telStr.test(mobile)){
            message.info('手机号码不规范'); return;
        }
        
        actions.publishUser({
            is_auth,id_level,id_hlevel,is_seller,is_agent_chair,is_agent_employee,mobile,nickname,username, password,sex,Identity,birthday,integral,level,user_id,avatar,work_sn,
            resolved:(data)=>{
                message.success({
                    content:'提交成功',
                    onClose:()=>{
                        window.history.back()
                    }
                })
            },
            rejected:(data)=>{
                message.error({
                    content:'提交失败'+data,
                    onClose:()=>{}
                })
            }
        })
    }
    render() {
        return (
        <div className="animated fadeIn">
                <Card>
                    <CardBody className="pad_0">
                        <PageHeader
                            className="pad_0"
                            ghost={false}
                            onBack={() => window.history.back()}
                            title=""
                            subTitle="添加用户"
                            extra={[
                            
                            ]}
                        >
                        <Card type="inner" title="基本信息" extra={

                            <Button onClick={this._onPublish}>提交</Button>

                        }>
                            <Descriptions size="small" column={3}>
                                <Descriptions.Item label="昵称">
                                    <Input onChange={(e)=>{
                                        this.setState({
                                            nickname:e.target.value
                                        })
                                    }} />
                                </Descriptions.Item>
                                <Descriptions.Item label="手机号码">
                                    <Input maxLength={11} value={this.state.mobile} onChange={(e)=>{
                                        this.setState({
                                            mobile:e.target.value
                                        })
                                    }}  />
                                </Descriptions.Item>
                                <Descriptions.Item label="用户账户">
                                    <Input maxLength={11} value={this.state.mobile} onChange={(e)=>{
                                        this.setState({
                                            mobile:e.target.value
                                        })
                                    }} />
                                </Descriptions.Item>
                                <Descriptions.Item label="工号">
                                    <Input  value={this.state.work_sn} onChange={(e)=>{
                                        this.setState({
                                            work_sn:e.target.value
                                        })
                                    }} />
                                </Descriptions.Item>
                                <Descriptions.Item label="姓名">
                                    <Input value={this.state.username} onChange={(e)=>{
                                        this.setState({
                                            username:e.target.value
                                        })
                                    }} />
                                </Descriptions.Item>
                                <Descriptions.Item label="密码">
                                    <Input.Password onChange={(e)=>{
                                        this.setState({
                                            password:e.target.value
                                        })
                                    }}  />
                                </Descriptions.Item>

                                <Descriptions.Item label="地区（2.0）">
                                    <Input placeholder="" />
                                </Descriptions.Item>

                                <Descriptions.Item label="生日">
                                    <DatePicker 
                                    locale={locale} 
                                    onChange={(i,dateString)=>{
                                        this.setState({
                                            birthday:dateString
                                    })}}/>
                                </Descriptions.Item>
                                {/*
                                <Descriptions.Item label="金币">
                                    <Input onChange={(e)=>{
                                        this.setState({
                                            integral:e.target.value
                                        })
                                    }}  />
                                </Descriptions.Item>
                                */}
                                <Descriptions.Item label="正副卡标识(2.0)">
                                    <Select defaultValue="0" style={{ width: 90 }}>
                                        <Option value="0">正卡</Option>
                                        <Option value="1">副卡</Option>
                                    </Select>
                                </Descriptions.Item>
                                
                                <Descriptions.Item label="性别">
                                    <Select 
                                        value={this.state.sex} 
                                        style={{ width: 90 }}
                                        onChange={(val)=>{
                                            this.setState({sex:val})
                                        }}
                                    >
                                        <Option value={0}>未知</Option>
                                        <Option value={1}>男</Option>
                                        <Option value={2}>女</Option>
                                    </Select>
                                </Descriptions.Item>
                                
                                <Descriptions.Item label="当前业绩等级（2.0）">
                                    <Select value={this.state.id_level} style={{ width: 120 }} onChange={(e)=>{
                                        this.setState({
                                            id_level:e
                                        })
                                    }}>
                                        <Option value="">无</Option>
                                        <Option value="5">优惠顾客</Option>
                                        <Option value="6">初级经理</Option>
                                        <Option value="7">中级经理</Option>
                                        <Option value="8">客户总监</Option>
                                        <Option value="9">高级客户总监</Option>
                                        <Option value="GG">资深及以上</Option>
                                    </Select>
                                </Descriptions.Item>
                                {/*
                                <Descriptions.Item label="当前业绩等级">
                                    <Select disabled defaultValue="Lv0" style={{ width: 90 }}>
                                        <Option value="0">Lv0</Option>
                                        <Option value="1">Lv1</Option>
                                        <Option value="2">Lv2</Option>
                                    </Select>
                                </Descriptions.Item>
                                */}
                                <Descriptions.Item label="权益等级">
                                    <Select    
                                        value={this.state.level} 
                                        style={{ width: 90 }}
                                        onChange={(val)=>{
                                            this.setState({level:val})
                                        }}
                                    >
                                        <Option value={0}>Lv0</Option>
                                        <Option value={1}>Lv1</Option>
                                        <Option value={2}>Lv2</Option>
                                        <Option value={3}>Lv3</Option>
                                        <Option value={4}>Lv4</Option>
                                        <Option value={5}>Lv5</Option>
                                        <Option value={6}>Lv6</Option>
                                    </Select>
                                </Descriptions.Item>
                                <Descriptions.Item label="历史最高级别(2.0)">
                                    <Select value={this.state.id_hlevel} style={{ width: 150 }} onChange={(e)=>{
                                        this.setState({
                                            id_hlevel:e
                                        })
                                    }}>
                                        <Option value="">无</Option>
                                        <Option value="5">优惠顾客</Option>
                                        <Option value="6">初级经理</Option>
                                        <Option value="7">中级经理</Option>
                                        <Option value="8">客户总监</Option>
                                        <Option value="9">高级客户总监</Option>
                                        <Option value="GG">资深及以上</Option>
                                    </Select>
                                </Descriptions.Item>
                            </Descriptions>

                            {/* <Descriptions>
                                <Descriptions.Item label="身份标签">
                                    <Select value={this.state.tabs} style={{ width: 150 }} onChange={(e)=>{
                                        this.setState({
                                            tabs:e
                                        })
                                        if(e=='is_seller'){
                                            this.setState({
                                                is_seller:1,
                                                is_agent_chair:0,
                                                is_agent_employee:0,
                                            })
                                        }else if(e=='is_agent_chair'){
                                            this.setState({
                                                is_seller:0,
                                                is_agent_chair:1,
                                                is_agent_employee:0,
                                            })
                                        }else if(e=='is_agent_employee'){
                                            this.setState({
                                                is_seller:0,
                                                is_agent_chair:0,
                                                is_agent_employee:1,
                                            })
                                        }else{
                                            this.setState({
                                                is_seller:0,
                                                is_agent_chair:0,
                                                is_agent_employee:0,
                                            })
                                        }
                                    }}>
                                        <Option value="">无</Option>
                                        <Option value="is_seller">直销员</Option>
                                        <Option value="is_agent_chair">服务中心负责人</Option>
                                        <Option value="is_agent_employee">服务中心员工</Option>
                                    </Select>
                                </Descriptions.Item>
                            </Descriptions> */}
                        </Card>
                        
                        </PageHeader>
                    </CardBody>
                </Card>
        </div>
        );
    }
}

const LayoutComponent = Add;
const mapStateToProps = state => {
    return {

    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
