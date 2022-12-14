import React, { Component } from 'react'
import { Card, Table, Tree, Form, Modal, Checkbox, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, Select, Tabs, Spin } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import moment from 'moment';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import { Button, Popconfirm } from '../../components/BtnComponent'
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Search } = Input;
const InputGroup = Input.Group;
const { Option } = Select;

const { TreeNode } = Tree;

class EXAuth extends Component {
    state = {
        visible: false,
        list: [{}, {}, {}, {}],
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        bindUsers: false,
        is_system: 2,
        role_list: [],
        role_id: 0,
        keyword: '',
        admin_list: [],
        key: [],
        admins: [],
        level_loading: false,
        pageSize: 10,
        total: 0,
        current: 0,
        showQuickJumper: false,
        admin_list: [],
        roles: []
    };


    edit = false
    view = false

    componentDidMount() {

        const { actions } = this.props
        actions.user()
        actions.getRole()
        this.getRole()
    }

    getRole = () => {
        const { actions } = this.props
        actions.getExRole({
            is_system: this.state.is_system,
            resolved: (res) => {
                this.setState({
                    role_list: res
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getAdmins = () => {
        this.setState({ level_loading: true })
        const { actions } = this.props
        const { current, pageSize, role_id, is_system } = this.state
        if (is_system == 2) {
            actions.getExAdmin({
                apply_role_id: role_id,
                enter_role_id: 0,
                keyword: '',
                page: current,
                pageSize: pageSize,
                role_id: 0,
                resolved: (res) => {
                    this.setState({
                        admins: res.data,
                        current: res.page,
                        total: res.total,
                        level_loading: false,
                    })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else {
            actions.getExAdmin({
                apply_role_id: 0,
                enter_role_id: role_id,
                keyword: '',
                page: current,
                pageSize: pageSize,
                role_id: 0,
                resolved: (res) => {
                    this.setState({
                        admins: res.data,
                        current: res.page,
                        total: res.total,
                        level_loading: false,
                    })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        }
    }
    componentWillReceiveProps(n_props) {
        if (!n_props.role_list !== this.props.role_list) {
            this.setState({
                roles: n_props.role_list
            })
        }
        if (n_props.admin_list.data !== this.props.admin_list.data) {
            this.setState({
                admin_list: n_props.admin_list.data
            })
        }
    }
    onAdds = (val) => {
        const { actions } = this.props
        const { role_id, is_system } = this.state
        actions.postExAdmin({
            role_id: role_id,
            user_id: val,
            type: is_system - 2,
            resolved: (res) => {
                message.success({
                    content: '????????????'
                })
                this.setState({
                    bindUsers: false
                })
                this.getAdmins()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    _onDelete(id) {
        const { actions } = this.props
        actions.updateRole({
            role_id: id,
            action: 'delete',
            resolved: (data) => {
                message.success('????????????')
                actions.getRole()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    onSelect = () => {
        const { keyword } = this.state
        this.props.actions.getAdmin(0, 0, keyword)
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
    renderTable = () => {
        const { admins } = this.state

        return (
            <Spin spinning={this.state.level_loading}>
                <Table rowKey='levelId' columns={this.innercol} dataSource={this.state.admins} pagination={{
                    current: this.state.current + 1,
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                    showQuickJumper: true,
                    onChange: (val) => {
                        this.setState({ current: val - 1 }, this.getAdmins)
                    },
                    showTotal: (total) => '??????' + total + '???'
                }}></Table>
            </Spin>
        )
    }
    onDeletOut = (val) => {
        const { actions } = this.props
        const { is_system } = this.state
        actions.deleteExAdmin({
            user_id: val,
            type: is_system - 2,
            resolved: (res) => {
                message.success({
                    content: '????????????'
                })
                this.getAdmins()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    render() {
        // console.log(this.state.role_id,'///')
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
                        <Button onClick={() => {
                            window.history.back()
                        }}>??????</Button>
                    </>
                }>
                    <Tabs style={{ marginLeft: '10px' }} onChange={(e) => {
                        this.page_current = 0
                        this.setState({
                            is_system: e
                        }, () => { this.getRole() })
                    }}>
                        <TabPane tab="???????????????" key={2}>
                        </TabPane>
                        <TabPane tab="???????????????" key={3}>
                        </TabPane>
                    </Tabs>
                    <Table rowKey='roleId'
                        expandedRowKeys={this.state.key}
                        expandedRowRender={this.renderTable}
                        onExpandedRowsChange={(res) => {
                            console.log(res)
                            let m_id = res.pop()
                            this.setState({ role_id: m_id, key: [m_id], current: 0 }, this.getAdmins)
                        }}
                        columns={this.col}
                        dataSource={this.state.role_list}
                        pagination={false} />
                </Card>
                <Modal
                    width={800}
                    title="???????????????"
                    visible={this.state.visible}
                    okText="??????"
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="???????????????">
                            <Input placeholder="???????????????" />
                        </Form.Item>
                        <Form.Item label="??????">
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
                <Modal
                    title='????????????'
                    visible={this.state.bindUsers}
                    closable={true}
                    maskClosable={true}
                    okText='??????'
                    cancelText='??????'
                    onCancel={() => {
                        this.setState({ bindUsers: false })
                    }}
                    onOk={() => {
                        this.setState({
                            bindUsers: false,
                            keyword: ''
                        })
                    }}
                // confirmLoading={this.state.importLoading}
                >
                    <Form.Item label="">
                        <Input placeholder="?????????????????????" style={{ width: '200px' }} value={this.state.keyword} onChange={(e) => {
                            this.setState({
                                keyword: e.target.value
                            })
                        }} />
                        <Button onClick={this.onSelect}>??????</Button>
                    </Form.Item>
                    <Table rowKey='roleId' columns={this.cols} dataSource={this.state.admin_list} pagination={{
                        showQuickJumper: true,
                        showTotal: (total) => '??????' + total + '???'
                    }} />
                </Modal>
            </div>
        );
    }
    innercol = [
        { dataIndex: 'userId', title: 'ID' },
        { dataIndex: 'username', title: '?????????' },
        { dataIndex: 'mobile', title: '?????????' },
        { dataIndex: 'companyName', title: '??????' },
        {
            dataIndex: 'userId', title: '?????????', render: (item, ele) => (this.state.roles.length == 0 ? null : this.state.roles.map(_ele => {
                if (_ele.roleId == ele.roleId) {
                    return _ele.name
                }
            }))
        },
        { dataIndex: 'addTime', title: '????????????', render: (item, ele) => moment.unix(ele.addTime).format('YYYY-MM-DD HH:mm:ss') },

        {
            dataIndex: '', title: '??????', width: 60, render: (item, ele) => (
                <div>
                    {
                        this.state.role_id != 42 ?
                            <Popconfirm
                                value='auth/del'
                                title={"??????????????????"}
                                onConfirm={this.onDeletOut.bind(this.setState, ele.userId)}
                                okText="??????"
                                cancelText="??????"
                            >
                                <Button size={'small'}>????????????</Button>
                            </Popconfirm>
                            : null
                    }

                </div>
            )
        }
    ]
    cols = [
        { dataIndex: 'userId', title: 'ID', width: 60 },
        { dataIndex: 'username', title: '?????????', width: 60 },
        { dataIndex: 'mobile', title: '?????????', width: 120 },
        { dataIndex: 'addTime', title: '????????????', width: 120, render: (item, ele) => moment.unix(ele.addTime).format('YYYY-MM-DD HH:mm:ss') },

        {
            dataIndex: '', title: '??????', width: 60, render: (item, ele) => (
                <div>
                    <Popconfirm
                        value='auth/del'
                        title={"??????????????????"}
                        onConfirm={this.onAdds.bind(this, ele.userId)}
                        okText="??????"
                        cancelText="??????"
                    >
                        <Button size={'small'}>??????</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]
    col = [
        { dataIndex: 'roleId', title: 'ID' },
        { dataIndex: 'name', title: '???????????????' },
        {
            dataIndex: '', title: '??????', width: 300, render: (item, ele) => (
                // ele.roleId == 1?null:
                <div>
                    <Button size={'small'} onClick={() => {
                        this.setState({
                            current: 0,
                            level_loading: true,
                            role_id: ele.roleId,
                            key: [ele.roleId],
                        }, this.getAdmins)
                    }}>????????????</Button>
                    {
                        ele.name != '????????????-1' ?
                            <Button size={'small'} onClick={() => {
                                this.setState({
                                    role_id: ele.roleId,
                                    bindUsers: true
                                })
                            }}>????????????</Button>
                            : null
                    }

                    {/* <Popconfirm
                        value='auth/del'
                        title={"??????????????????"}
                        onConfirm={this._onDelete.bind(this, ele.roleId)}
                        okText="??????"
                        cancelText="??????"
                    >
                        <Button type="" size={'small'} >??????</Button>
                    </Popconfirm> */}

                </div>
            )
        }
    ]
}

const LayoutComponent = EXAuth;
const mapStateToProps = state => {
    return {
        admin_list: state.system.admin_list,
        role_list: state.system.role_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });