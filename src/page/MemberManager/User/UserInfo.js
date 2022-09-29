import React, { Component } from 'react';
import { Badge, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Tag, Avatar, Card, Select, PageHeader, DatePicker, Menu, Dropdown, Button, Icon, message, Input, Pagination, Descriptions, InputNumber } from 'antd';
import { Link, NavLink } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import connectComponent from '../../../util/connect';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;

const flag_arg = {
    '1': '直销员',
    '2': '新用户',
    '3': '服务中心员工',
    '4': '店主',
    '5': '客户代表',
    '6': '客户经理',
    '7': '中级经理',
    '8': '客户总监',
    '9': '高级客户总监',
    'GG': '资深客户总监',
}

class Edit extends Component {

    state = {
        mobile: '',
        nickname: '',
        username: '',
        password: '',
        sex: 0,
        user_id: '0',
        Identity: '',
        avatar: '',
        birthday: '',
        integral: '',
        level: 0,
        isPrimary: 0,
        is_auth: 0,
        id_level: '',
        id_hlevel: '',
        is_seller: 0,
        is_agent_chair: 0,
        is_agent_employee: 0,

        _birthday: '',
        num: 0,
        nums: 0,
        tabs: '',
        work_sn: ''
    }

    componentWillMount() {
        if (typeof this.props.the_user == 'undefined') {
            message.info({
                content: "会员对象为空，请先返回会员列表页",
                onClose: () => {
                    window.history.back();
                }
            })
        } else {
            const _index = this.props.match.params.index;
            const _user = this.props.the_user.data[_index]
            let _birthday = _user.birthday

            if (_birthday < 0) {
                this.setState({ emptyDatePicker: true })
            } else if (_user.birthday > 1000000000) {
                _birthday = _user.birthday / 1000
            }
            const { actions } = this.props
            actions.getUserInfo(_user.userId)

            const tmp = moment.unix(_birthday).format('YYYY-MM-DD')
            _birthday = moment(tmp, 'YYYY-MM-DD')
            this.setState({
                is_auth: _user.isAuth,
                id_level: _user.idLevel,
                id_hlevel: _user.idHlevel,
                is_seller: _user.isSeller,
                is_agent_chair: _user.isAgentChair,
                is_agent_employee: _user.isAgentEmployee,
                isPrimary: _user.isPrimary,
                mobile: _user.mobile,
                nickname: _user.nickname,
                username: _user.username,

                sex: _user.sex,
                user_id: _user.userId,
                Identity: _user.identity,

                birthday: tmp,
                integral: _user.integral + _user.rintegral,
                level: _user.level,
                avatar: _user.avatar,

                _birthday: _birthday,
                num: _user.yintegral,
                nums: _user.yintegral,
                work_sn: _user.workSn
            })
            if (_user.isSeller == 1) {
                this.setState({ tabs: 'is_seller' })
            }
            if (_user.isAgentChair == 1) {
                this.setState({ tabs: 'is_agent_chair' })
            }
            if (_user.isAgentEmployee == 1) {
                this.setState({ tabs: 'is_agent_employee' })
            }
        }

    }
    _onPublish = () => {
        const { actions } = this.props
        const { is_auth, id_level, id_hlevel, is_seller, is_agent_chair, is_agent_employee, mobile, nickname, username, password, sex, user_id, Identity, avatar, birthday, integral, level, num, nums, work_sn } = this.state;

        if (!nickname) { message.info('昵称不能为空'); return; }
        if (!mobile) { message.info('手机不能为空'); return; }
        //if(!username){ message.info('用户不能为空',interval); return;}
        //if(!password){ message.info('密码不能为空',interval); return;}
        //if(!birthday){ message.info('生日不能为空',interval); return;}

        let telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        if (!telStr.test(mobile)) {
            message.info('手机号码不规范'); return;
        }

        actions.publishUser({
            is_auth, id_level, id_hlevel, is_seller, is_agent_chair, is_agent_employee, mobile, nickname, username, password, sex, Identity, birthday, integral, level, user_id, avatar, work_sn,
            resolved: (data) => {
                if (num > nums) {
                    actions.postPoint({
                        user_id: user_id.toString(),
                        integral: num - nums,
                        type: 0,
                        resolved: (res) => {
                            message.success({
                                content: '修改成功',
                                onClose: () => {
                                    window.history.back()
                                }
                            })
                        },
                        rejected: (err) => {
                            console.log(err)
                        }
                    })
                }
                if (nums > num) {
                    actions.postPoint({
                        user_id: user_id.toString(),
                        integral: nums - num,
                        type: 1,
                        resolved: (res) => {
                            message.success({
                                content: '修改成功',
                                onClose: () => {
                                    window.history.back()
                                }
                            })
                        },
                        rejected: (err) => {
                            console.log(err)
                        }
                    })
                }
                if (num == nums) {
                    message.success({
                        content: '修改成功',
                        onClose: () => {
                            window.history.back()
                        }
                    })
                }
                console.log(data)
            },
            rejected: (data) => {
                message.error({
                    content: '修改失败，' + data
                })
            }
        })
    }
    render() {
        const { id_level, id_hlevel, num, is_seller, is_agent_chair, is_agent_employee, _birthday, mobile, nickname, username, password, sex, user_id, Identity, avatar, birthday, integral, level, isPrimary, is_auth } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardBody className="pad_0">
                        <PageHeader
                            className="pad_0"
                            ghost={false}
                            onBack={() => window.history.back()}
                            title=""
                            subTitle="编辑用户"
                            extra={[

                            ]}
                        >
                            <Card type="inner" title="基本信息" extra={

                                <Button onClick={this._onPublish}>提交</Button>

                            }>
                                <Descriptions size="small" column={3}>
                                    <Descriptions.Item label="昵称">
                                        <Input value={nickname} onChange={(e) => {
                                            this.setState({
                                                nickname: e.target.value
                                            })
                                        }} />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="手机号码">
                                        <Input disabled={true} maxLength={11} value={mobile} onChange={(e) => {
                                            this.setState({
                                                mobile: e.target.value
                                            })
                                        }} />
                                    </Descriptions.Item>

                                    <Descriptions.Item label="用户账户">
                                        <Input maxLength={11} value={this.state.mobile} onChange={(e) => {
                                            this.setState({
                                                mobile: e.target.value
                                            })
                                        }} />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="工号">
                                        <Input value={this.state.work_sn} onChange={(e) => {
                                            this.setState({
                                                work_sn: e.target.value
                                            })
                                        }} />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="姓名">
                                        <Input value={this.state.username} onChange={(e) => {
                                            this.setState({
                                                username: e.target.value
                                            })
                                        }} />
                                    </Descriptions.Item>
                                    {/*
                                <Descriptions.Item label="密码">
                                    <Input.Password value={password} onChange={(e)=>{
                                        this.setState({
                                            password:e.target.value
                                        })
                                    }}  />
                               
                                </Descriptions.Item>
                                 */}

                                    <Descriptions.Item label="地区（2.0）">
                                        <Input placeholder="" />
                                    </Descriptions.Item>

                                    <Descriptions.Item label="生日">
                                        <DatePicker
                                            defaultValue={_birthday}
                                            locale={locale}
                                            onChange={(i, dateString) => {
                                                this.setState({
                                                    _birthday: i,
                                                    birthday: dateString
                                                })
                                            }}
                                        />
                                    </Descriptions.Item>

                                    <Descriptions.Item label="金币">
                                        <Input disabled value={integral} onChange={(e) => {
                                            this.setState({
                                                integral: e.target.value
                                            })
                                        }} />
                                    </Descriptions.Item>

                                    <Descriptions.Item label="正副卡标识(2.0)">
                                        <Select disabled defaultValue="0" style={{ width: 90 }}>
                                            <Option value="0">正卡</Option>
                                            <Option value="1">副卡</Option>
                                        </Select>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="性别">
                                        <Select
                                            value={sex}
                                            style={{ width: 90 }}
                                            onChange={(val) => {
                                                this.setState({ sex: val })
                                            }}
                                        >
                                            <Option value={0}>未知</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="当前业绩等级">
                                        {id_level == '5' ? <Tag>优惠顾客</Tag> : null}
                                        {id_level == '6' ? <Tag>初级经理</Tag> : null}
                                        {id_level == '7' ? <Tag>中级经理</Tag> : null}
                                        {id_level == '8' ? <Tag>客户总监</Tag> : null}
                                        {id_level == '9' ? <Tag>高级客户总监</Tag> : null}
                                        {id_level == 'GG' ? <Tag>资深及以上</Tag> : null}
                                        {!id_level ? <Tag>无</Tag> : null}
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
                                            value={level}
                                            style={{ width: 90 }}
                                            onChange={(val) => {
                                                this.setState({ level: val })
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
                                        {id_hlevel == '5' ? <Tag>优惠顾客</Tag> : null}
                                        {id_hlevel == '6' ? <Tag>初级经理</Tag> : null}
                                        {id_hlevel == '7' ? <Tag>中级经理</Tag> : null}
                                        {id_hlevel == '8' ? <Tag>客户总监</Tag> : null}
                                        {id_hlevel == '9' ? <Tag>高级客户总监</Tag> : null}
                                        {id_hlevel == 'GG' ? <Tag>资深及以上</Tag> : null}
                                        {!id_hlevel ? <Tag>无</Tag> : null}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="是否问答">
                                        <Select
                                            value={Identity}
                                            style={{ width: 90 }}
                                            onChange={(val) => {
                                                this.setState({ Identity: val })
                                            }}
                                        >
                                            <Option value={''}>否</Option>
                                            <Option value={'问答'}>是</Option>
                                        </Select>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="身份标签">
                                        {/* <Select value={this.state.tabs} style={{ width: 150 }} onChange={(e)=>{
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
                                    </Select> */}
                                        {id_hlevel == '5' ? <Tag>优惠顾客</Tag> : null}
                                        {id_hlevel == '6' ? <Tag>初级经理</Tag> : null}
                                        {id_hlevel == '7' ? <Tag>中级经理</Tag> : null}
                                        {id_hlevel == '8' ? <Tag>客户总监</Tag> : null}
                                        {id_hlevel == '9' ? <Tag>高级客户总监</Tag> : null}
                                        {id_hlevel == 'GG' ? <Tag>资深及以上</Tag> : null}
                                        {is_seller == 1 ? <Tag>直销员</Tag> : null}
                                        {is_agent_chair == 1 ? <Tag>店主</Tag> : null}
                                        {is_agent_employee == 1 ? <Tag>服务中心员工</Tag> : null}
                                        {is_auth == 1 ? <Tag>认证</Tag> : null}
                                        {is_auth == 0 ? <Tag>非认证</Tag> : null}
                                        {is_auth == 1 && isPrimary == 1 ? <Tag>正卡</Tag> : null}
                                        {is_auth == 1 && isPrimary == 0 ? <Tag>副卡</Tag> : null}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="游学积分">
                                        <InputNumber value={num} onChange={(e) => {
                                            this.setState({
                                                num: e
                                            })
                                        }} />
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                        </PageHeader>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

const LayoutComponent = Edit;
const mapStateToProps = state => {
    return {
        the_user: state.user.user_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
