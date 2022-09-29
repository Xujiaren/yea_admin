import React, { Component } from 'react';
import { Table, Card, Form, Modal, Checkbox, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, Select } from 'antd';
import { Button, Popconfirm } from '../../components/BtnComponent'
import moment from 'moment';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import cookie from 'react-cookies';

const role = ["超级管理员", "运营管理员"]
class Admin extends Component {

    admin_list = []
    admin_data = {}
    role_list = []
    page_total = 0
    page_current = 0
    page_size = 10

    state = {

        edit: true,
        view: true,
        showEdit: false,
        visible: false,
        list: [{}, {}, {}, {}],
        mobile: '',
        password: '',
        realname: '',
        role_id: 1,
        status: 1,
        username: '',
        user_id: 0,
        dept: '',


        _mobile: '',
        _password: '',
        _realname: '',
        _role_id: 1,
        _status: 1,
        _username: '',
        _edit_id: '',

        isHit: false,
        isEditHit: false,
        region_id: 1,
        adresses_list: [],
        companyList:[],
        companyNo:'01000',
        role_id:0,
        keyword:''
    };


    componentDidMount() {
        const { actions } = this.props;
        actions.getAdmin()
        actions.getRole()
        this.getAdress()
        this.getCompany()
    }
    componentWillMount() {


    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.admin_list.data !== this.props.admin_list.data) {
            this.admin_list = nextProps.admin_list.data;
            this.admin_data = nextProps.admin_list
            this.page_total = nextProps.admin_list.total
            this.page_current = nextProps.admin_list.page
        }
        if (nextProps.role_list !== this.props.role_list) {
            this.role_list = nextProps.role_list;
        }
        if (nextProps.adresses_list !== this.props.adresses_list) {
            this.setState({
                adresses_list: nextProps.adresses_list
            })
        }

    }
    getCompany=()=>{
        const{actions}=this.props
        actions.getCompanyList({
            resolved:(res)=>{
                console.log(res)
                this.setState({
                    companyList:res
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    getAdress = () => {
        const { actions } = this.props
        actions.getAdresses()
    }
    _onPage = (val) => {
        const { actions } = this.props;
        actions.getAdmin(val - 1)
    }
    _updateAdmin(user_id) {
        const { actions } = this.props;
        actions.updateAdmin({
            user_id,
            resolved: (data) => {
                message.success("操作成功");
                actions.getRole()
                actions.getAdmin(this.page_current)
            },
            rejected: (msg) => {
                message.error("操作失败");
            }
        })
    }

    showEdit(ele) {
        const admin = ele;
        this.setState({
            showEdit: true,
            _mobile: admin.mobile,
            _realname: admin.realname,
            _role_id: admin.roleId,
            _status: admin.status,
            _username: admin.username,
            _edit_id: admin.userId,
            region_id: admin.regionId,
            companyNo:admin.companyNo
        });
    }
    hideEdit = () => {
        this.setState({
            showEdit: false,
            _mobile: '',
            _password: '',
            _realname: '',
            _role_id: 1,
            _username: '',
            isEditHit: false,
            region_id: 1,
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    hideModal = () => {
        this.setState({
            visible: false,
            mobile: '',
            password: '',
            realname: '',
            role_id: 1,
            username: '',
            isHit: false,
            region_id: 1,
        });
    };
    _onEdit = () => {

        this.setState({ isEditHit: true })
        const { _mobile, _password, _realname, _username,companyNo } = this.state
        if (!_mobile || !_password || !_realname || !_username)
            return;
        const { actions } = this.props;

        actions.publishAdmin({
            mobile: this.state._mobile,
            password: this.state._password,
            realname: this.state._realname,
            role_id: this.state._role_id,
            status: this.state._status,
            username: this.state._username,
            user_id: this.state._edit_id,
            dept: this.state.dept,
            regionId: this.state.region_id,
            company_no:companyNo,
            resolved: (data) => {
                let c_username = cookie.load('admin_name')
                if (_username == c_username) {
                    message.info({
                        content: '修改成功！当前管理员权限组已被修改，请重新登录',
                        onClose: () => {
                            this.props.history.push({
                                pathname: '/login'
                            })
                            this.setState({ region_id: 1 })
                        }
                    })
                } else {
                    message.success("修改成功");
                }

                this.hideEdit();
                actions.getAdmin(this.page_current)
            },
            rejected: (msg) => {
                message.error(JSON.stringify(msg))
            }
        })
    }
    _onPublish = () => {
        this.setState({ isHit: true })
        const { mobile, password, realname, username, user_id,companyNo } = this.state
        if (!mobile || !password || !realname || !username)
            return;
        const { actions } = this.props;

        actions.publishAdmin({
            mobile: this.state.mobile,
            password: this.state.password,
            realname: this.state.realname,
            role_id: this.state.role_id,
            status: this.state.status,
            username: this.state.username,
            user_id,
            dept: this.state.dept,
            company_no:companyNo,
            resolved: (data) => {
                message.success("创建成功");
                this.hideModal();
                actions.user()
                setTimeout(() => { actions.getAdmin(this.page_current) }, 1000)
            },
            rejected: (msg) => {
                message.error(JSON.stringify(msg))
            }
        })
    }
    onSelect=()=>{
        const{role_id,keyword}=this.state
        this.props.actions.getAdmin(0,role_id,keyword)
    }
    deletes=(val,ele)=>{
        this.props.actions.deleteAdmin({
            user_id:ele,
            action:val,
            resolved:(res)=>{
                message.success({
                    content:'删除成功'
                })
                this.props.actions.getAdmin()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
   
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
        console.log(this.role_list,'???')
        return (
            <div className="animated fadeIn">
                <Card extra={<Button value='admin/add' onClick={this.showModal}>添加管理员</Button>}>
                    <Select style={{width:'160px'}} value={this.state.role_id} onChange={(e)=>{
                        this.setState({
                            role_id:e
                        },()=>{
                            this.onSelect()
                        })
                    }}>
                        <Select.Option value={0}>全部</Select.Option>
                        {
                            this.role_list.map((item)=>{
                                return(
                                    <Select.Option value={item.roleId}>{item.name}</Select.Option>
                                )
                            })
                        }
                    </Select>
                    <Input placeholder="用户名／手机号" value={this.state.keyword} onChange={(e)=>{
                        this.setState({
                            keyword:e.target.value
                        })
                    }} style={{width:'180px'}}></Input>
                    <Button onClick={this.onSelect}>筛选</Button>
                    <Table rowKey='userId' columns={this.col} dataSource={this.admin_list || []} pagination={{
                        current: this.page_current + 1,
                        pageSize: this.page_size,
                        total: this.page_total,
                        showQuickJumper: true,
                        onChange: this._onPage,
                        showTotal: (total) => '总共' + total + '条'
                    }} />
                </Card>
                <Modal
                    title="添加管理员"
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideModal}
                    bodyStyle={{ padding: "10px" }}
                    onOk={this._onPublish}
                >
                    <Form {...formItemLayout}>
                        <Form.Item
                            label="登录名"
                            hasFeedback={this.state.isHit && !this.state.username ? true : false}
                            validateStatus={this.state.isHit && !this.state.username ? "error" : "success"}
                            help={this.state.isHit && !this.state.username ? "登录名不能为空" : ""}
                        >
                            <Input
                                autoComplete="username"
                                placeholder="请输入登录名"
                                value={this.state.username}
                                onChange={e => { this.setState({ username: e.target.value }) }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            hasFeedback={this.state.isHit && !this.state.password ? true : false}
                            validateStatus={this.state.isHit && !this.state.password ? "error" : "success"}
                            help={this.state.isHit && !this.state.password ? "密码不能为空" : ""}
                        >
                            <Input.Password
                                autoComplete="current-password"
                                placeholder="请输入密码"
                                value={this.state.password}
                                onChange={e => { this.setState({ password: e.target.value }) }}
                            />
                        </Form.Item>
                        <Form.Item label="管理组">
                            <Select defaultValue={1} onChange={(val) => { this.setState({ role_id: val }) }}>
                                {this.role_list.map((ele, index) =>
                                    <Select.Option disabled={ele.status == 0 ? true : false} key={index + 'role'} value={ele.roleId}>
                                        {ele.status == 0 ? ele.name + ' (已被禁用)' : ele.name}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="姓名"
                            hasFeedback={this.state.isHit && !this.state.realname ? true : false}
                            validateStatus={this.state.isHit && !this.state.realname ? "error" : "success"}
                            help={this.state.isHit && !this.state.realname ? "姓名不能为空" : ""}
                        >
                            <Input
                                placeholder="请输入姓名"
                                value={this.state.realname}
                                onChange={e => { this.setState({ realname: e.target.value }) }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="省份"
                            // hasFeedback={this.state.isHit && !this.state.adress ? true : false}
                            // validateStatus={this.state.isHit && !this.state.adress ? "error" : "success"}
                            // help={this.state.isHit && !this.state.adress ? "省份不能为空" : ""}
                        >
                            <Select value={this.state.region_id} onChange={(val) => { this.setState({ region_id: val }) }}>
                            <Select.Option value={1}>
                                    全部
                                </Select.Option>
                                {
                                    this.state.adresses_list.map(item => {
                                        return (
                                            <Select.Option value={item.regionId}>
                                                {item.regionName}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="公司"
                            // hasFeedback={this.state.isHit && !this.state.adress ? true : false}
                            // validateStatus={this.state.isHit && !this.state.adress ? "error" : "success"}
                            // help={this.state.isHit && !this.state.adress ? "省份不能为空" : ""}
                        >
                            <Select value={this.state.companyNo} onChange={(val) => { this.setState({ companyNo: val }) }}>
                            <Select.Option value={''}>
                                            无
                            </Select.Option>
                                {
                                    this.state.companyList.map(item => {
                                        return (
                                            <Select.Option value={item.companyNo}>
                                                {item.companyName}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="部门"
                            // hasFeedback={this.state.isHit && !this.state.dept ? true : false}
                            // validateStatus={this.state.isHit && !this.state.dept ? "error" : "success"}
                            // help={this.state.isHit && !this.state.dept ? "部门不能为空" : ""}
                        >
                            <Input
                                placeholder="请输入部门"
                                value={this.state.department}
                                onChange={e => { this.setState({ department: e.target.value }) }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="手机号"
                            hasFeedback={this.state.isHit && !this.state.mobile ? true : false}
                            validateStatus={this.state.isHit && !this.state.mobile ? "error" : "success"}
                            help={this.state.isHit && !this.state.mobile ? "手机号不能为空" : ""}
                        >
                            <Input
                                placeholder="请输入手机号"
                                value={this.state.mobile}
                                onChange={e => { this.setState({ mobile: e.target.value }) }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="修改管理员"
                    visible={this.state.showEdit}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideEdit}
                    bodyStyle={{ padding: "10px" }}
                    onOk={this._onEdit}
                >
                    <Form {...formItemLayout}>
                        <Form.Item
                            label="登录名"
                            hasFeedback={this.state.isEditHit && !this.state._username ? true : false}
                            validateStatus={this.state.isEditHit && !this.state._username ? "error" : "success"}
                            help={this.state.isEditHit && !this.state._username ? "登录名不能为空" : ""}
                        >
                            <Input
                                autoComplete="username"
                                placeholder="请输入登录名"
                                value={this.state._username}
                                onChange={e => { this.setState({ _username: e.target.value }) }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            hasFeedback={this.state.isEditHit && !this.state._password ? true : false}
                            validateStatus={this.state.isEditHit && !this.state._password ? "error" : "success"}
                            help={this.state.isEditHit && !this.state._password ? "密码不能为空" : ""}
                        >
                            <Input.Password
                                autoComplete="current-password"
                                placeholder="请输入密码"
                                value={this.state._password}
                                onChange={e => { this.setState({ _password: e.target.value }) }}
                            />
                        </Form.Item>
                        <Form.Item label="管理组">
                            <Select defaultValue={this.state._role_id} onChange={(val) => { this.setState({ _role_id: val }) }}>
                                {this.role_list.map((ele, index) =>
                                    <Select.Option disabled={ele.status == 0 ? true : false} key={index + 'role'} value={ele.roleId}>
                                        {ele.status == 0 ? ele.name + ' (已被禁用)' : ele.name}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="姓名"
                            hasFeedback={this.state.isEditHit && !this.state._realname ? true : false}
                            validateStatus={this.state.isEditHit && !this.state._realname ? "error" : "success"}
                            help={this.state.isEditHit && !this.state._realname ? "姓名不能为空" : ""}
                        >
                            <Input
                                placeholder="请输入姓名"
                                value={this.state._realname}
                                onChange={e => { this.setState({ _realname: e.target.value }) }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="省份"
                            // hasFeedback={this.state.isEditHit && !this.state.adress ? true : false}
                            // validateStatus={this.state.isEditHit && !this.state.adress ? "error" : "success"}
                            // help={this.state.isEditHit && !this.state.adress ? "省份不能为空" : ""}
                        >
                            <Select value={this.state.region_id} onChange={(val) => { this.setState({ region_id: val }) }}>
                                <Select.Option value={1}>
                                    全部
                                </Select.Option>
                                {
                                    this.state.adresses_list.map(item => {
                                        return (
                                            <Select.Option value={item.regionId}>
                                                {item.regionName}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="公司"
                            // hasFeedback={this.state.isHit && !this.state.adress ? true : false}
                            // validateStatus={this.state.isHit && !this.state.adress ? "error" : "success"}
                            // help={this.state.isHit && !this.state.adress ? "省份不能为空" : ""}
                        >
                            <Select value={this.state.companyNo} onChange={(val) => {this.setState({ companyNo: val }) }}>
                            <Select.Option value={''}>
                                            无
                            </Select.Option>
                                {
                                    this.state.companyList.map(item => {
                                        return (
                                            <Select.Option value={item.companyNo}>
                                                {item.companyName}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="部门"
                            hasFeedback={this.state.isEditHit && !this.state.department ? true : false}
                            validateStatus={this.state.isHit && !this.state.department ? "error" : "success"}
                            help={this.state.isHit && !this.state.department ? "部门不能为空" : ""}
                        >
                            <Input
                                placeholder="请输入部门"
                                value={this.state.department}
                                onChange={e => { this.setState({ department: e.target.value }) }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="手机号"
                            hasFeedback={this.state.isEditHit && !this.state._mobile ? true : false}
                            validateStatus={this.state.isEditHit && !this.state._mobile ? "error" : "success"}
                            help={this.state.isEditHit && !this.state._mobile ? "手机号不能为空" : ""}
                        >
                            <Input
                                placeholder="请输入手机号"
                                value={this.state._mobile}
                                onChange={e => { this.setState({ _mobile: e.target.value }) }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    col = [
        { dataIndex: '', title: '',render:(item,ele,index)=>{
            return (
                <div>{this.page_current*10+index+1}</div>
            )
        }},
        { dataIndex: 'userId', title: 'ID' },
        { dataIndex: 'username', title: '用户名' },
        {
            dataIndex: 'userId', title: '管理组', render: (item, ele) => (this.role_list.length == 0 ? null : this.role_list.map(_ele => {
                if (_ele.roleId == ele.roleId) {
                    return _ele.name
                }
            }))
        },
        { dataIndex: 'mobile', title: '手机号' },
        { dataIndex: 'addTime', title: '增加时间', render: (item, ele) => moment.unix(ele.addTime).format('YYYY-MM-DD HH:mm:ss') },

        {
            dataIndex: '', title: '操作', width: 300, render: (item, ele) => (
                <div>
                    <Button value='admin/edit' onClick={this.showEdit.bind(this, ele)} size={'small'}>修改</Button>&nbsp;
                    <Button value='admin/status' onClick={this._updateAdmin.bind(this, ele.userId)} type={ele.status == 1 ? "" : "danger"} size={'small'} >{ele.status == 1 ? "禁用" : "解禁"}</Button>
                    <Popconfirm
                        okText="确定"
                        cancelText='取消'
                        title='确定删除吗？'
                        onConfirm={this.deletes.bind(this,'delete',ele.userId)}
                    >
                        <Button type="danger" ghost size={'small'} className='m_2'>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]
}

const LayoutComponent = Admin;
const mapStateToProps = state => {
    return {
        admin_list: state.system.admin_list,
        role_list: state.system.role_list,
        user: state.site.user,
        adresses_list: state.system.adresses_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });

