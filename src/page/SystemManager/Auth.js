import React, { Component } from 'react'
import { Card, Table, Tree, Form, Modal, Checkbox, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, Select } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import connectComponent from '../../util/connect';
import _ from 'lodash'
import { Button, Popconfirm } from '../../components/BtnComponent'

const { RangePicker } = DatePicker;
const { Search } = Input;
const InputGroup = Input.Group;
const { Option } = Select;

const { TreeNode } = Tree;

class Auth extends Component {
    state = {
        visible: false,
        list: [{}, {}, {}, {}],
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
    };
    role_list = []

    edit = false
    view = false

    componentDidMount() {

        const { actions } = this.props
        actions.user()
        actions.getRole()
    }

    componentWillReceiveProps(n_props) {
        if (!n_props.role_list !== this.props.role_list) {
            this.role_list = n_props.role_list
        }

    }
    _onDelete(id) {
        const { actions } = this.props
        actions.updateRole({
            role_id: id,
            action: 'delete',
            resolved: (data) => {
                message.success('操作成功')
                actions.getRole()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onStatus(id) {
        const { actions } = this.props
        actions.updateRole({
            role_id: id,
            action: 'status',
            resolved: (data) => {
                message.success('操作成功')
                actions.getRole()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    };

    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    };

    showModal = () => {
        this.props.history.push({
            pathname: '/system-manager/auth/add',
            state: {
                id: '1'
            }
        })
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        return (
            <div className="animated fadeIn">
                <Card extra={
                    <>
                        <Button onClick={()=>{
                            this.props.history.push('/system-manager/exauth')
                        }}>特殊权限组</Button>
                        <Button value='auth/add' onClick={this.showModal}>添加管理组</Button>
                    </>
                }>

                    <Table rowKey='roleId' columns={this.col} dataSource={this.role_list} pagination={{
                        showQuickJumper: true,
                        showTotal: (total) => '总共' + total + '条'
                    }} />
                </Card>
                <Modal
                    width={800}
                    title="添加管理组"
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="管理组名称">
                            <Input placeholder="请输入名称" />
                        </Form.Item>
                        <Form.Item label="权限">
                            <Tree
                                blockNode={false}
                                checkable
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onSelect={this.onSelect}
                                selectedKeys={this.state.selectedKeys}
                            >

                            </Tree>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    col = [
        { dataIndex: 'roleId', title: 'ID' },
        { dataIndex: 'name', title: '管理组名称' },
        {
            dataIndex: '', title: '操作', width: 300, render: (item, ele) => (
                // ele.roleId == 1?null:
                <div>
                    <Button value='auth/edit' type="" size={'small'} onClick={() => {
                        this.props.history.push('/system-manager/auth/edit/' + ele.roleId)
                    }}>设置</Button>&nbsp;
                    <Button value='auth/status' onClick={this._onStatus.bind(this, ele.roleId)} type={ele.status == 1 ? 'danger' : ''} size={'small'}>{ele.status == 1 ? "禁用" : "解禁"}</Button>&nbsp;

                    <Popconfirm
                        value='auth/del'
                        title={"确定删除吗？"}
                        onConfirm={this._onDelete.bind(this, ele.roleId)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="" size={'small'} >删除</Button>
                    </Popconfirm>

                </div>
            )
        }
    ]
}

const LayoutComponent = Auth;
const mapStateToProps = state => {
    return {
        role_list: state.system.role_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });