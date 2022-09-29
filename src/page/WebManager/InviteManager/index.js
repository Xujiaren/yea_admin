import React, { Component } from 'react';
import { Table, Card, Empty, Form, Modal, Checkbox, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, Select } from 'antd';
import connectComponent from '../../../util/connect';
import { Button, Popconfirm } from '../../../components/BtnComponent'
import locale from 'antd/es/date-picker/locale/zh_CN';
import _ from 'lodash'
import moment from 'moment'
const { Search } = Input;
const { Option } = Select
class InviteManager extends Component {
    state = {
        edit: true,
        view: true,
        visible: false,
        showImgPanel: false,
        previewImage: '',
        loading: false,
        isAuth: -1,
        regionId: 0,
        sex: -1,
        sortType: 0,
        regions: [],
        loadings: false,
        userId: '',
        mobile: '',
        begin_time: '',
        end_time: '',
        BeginTime: null,
        EndTime: null,
        selet:0,
        list:['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']
    };
    invite_list = []
    page_total = 0
    page_current = 0
    page_size = 15


    componentDidMount() {
        this.props.actions.getAdressesList({
            resolved: (res) => {
                this.setState({
                    regions: res
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        this.getInvite()
    }

    componentWillReceiveProps(n_props) {

        if (n_props.invite_list !== this.props.invite_list) {
            this.setState({ loading: false })
            if (n_props.invite_list.data.length == 0) {
                message.info('暂时没有数据')
            }
            this.invite_list = n_props.invite_list.data || []
            this.page_total = n_props.invite_list.total
            this.page_current = n_props.invite_list.page
        }
    }
    getInvite = () => {
        this.setState({ loading: true })
        const { keyword, isAuth, regionId, sex, sortType, userId, mobile,begin_time,end_time } = this.state
        let date = new Date().getTime()
        date = date.toString().slice(0, date.toString().length - 3)
        let lst = 0
        if (userId) {
            if (!parseInt(userId)) {
                message.info({ content: '请输入正确的ID' });
                return;
            }
            lst = parseInt(userId)
        }
        if (mobile) {
            if (!parseInt(mobile)) {
                message.info({ content: '请输入正确的账号' });
                return;
            }
        }
        let beg = begin_time
        if(!beg){
            beg='1980-01-01'
        }
        this.props.actions.getInvite({
            keyword,
            page: this.page_current,
            pageSize: this.page_size,
            endTime:end_time,
            beginTime: beg,
            isAuth: isAuth,
            regionId: regionId,
            sex: sex,
            sortType: sortType,
            mobile: mobile,
            userId: lst
        })
    }
    onSearch = (val) => {
        this.page_current = 0
        this.getInvite()
    }
    showImgPanel(url) {
        this.setState({
            showImgPanel: true,
            previewImage: url
        });
    }
    hideImgPanel = () => {
        this.setState({
            showImgPanel: false
        });
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
    onOut = () => {
        this.setState({ loadings: true })
        const { keyword, isAuth, regionId, sex, sortType,selet,begin_time,end_time} = this.state
        let beg = begin_time
        if(!beg){
            beg='1980-01-01'
        }
        this.props.actions.getInviteOut({
            keyword,
            page: selet,
            pageSize: 2000,
            beginTime: beg,
            endTime:end_time,
            isAuth: isAuth,
            regionId: regionId,
            sex: sex,
            sortType: sortType,
            resolved: (res) => {
                message.success({
                    content: '导出成功'
                })
                this.setState({
                    loadings: false
                })
                window.open(res.address)
            },
            rejected: (err) => {
                this.setState({ loadings: false })
            }
        })
    }
    onUserOut = (val) => {
        this.setState({ loadings: true })
        this.props.actions.getInviteUserOut({
            keyword: '',
            userId: val[0],
            resolved: (res) => {
                message.success({
                    content: '导出成功'
                })
                this.setState({
                    loadings: false
                })
                window.open(res.address)
            },
            rejected: (err) => {
                this.setState({ loadings: false })
            }
        })
    }
    render() {
        return (
            <div className="animated fadeIn">
                <Card title='邀请管理' extra={
                    <>
                        <Button value='inviteImg' onClick={() => { this.props.history.push('/web-manager/invite-manager/picture') }}>推荐图片管理</Button>
                        {
                            this.page_total?
                            <Select value={this.state.selet} onChange={(e)=>{this.setState({selet:e})}}>
                            {
                                this.state.list.map((item,index)=>{
                                    if(index<=parseInt(this.page_total/2000)){
                                        return(
                                            <Option value={index}>第{index+1}批</Option>
                                        ) 
                                    }  
                                })
                            }
                        </Select>
                        :null
                        }
                        
                        <Button loading={this.state.loadings} onClick={this.onOut}>导出</Button>
                    </>
                }>
                    <Search
                        placeholder="昵称"
                        onSearch={this.onSearch}
                        style={{ maxWidth: 200 }}
                        onChange={(e) => {
                            this.setState({ keyword: e.target.value })
                        }}
                    />
                    <Search
                        placeholder="账号"
                        onSearch={this.onSearch}
                        style={{ maxWidth: 200 }}
                        onChange={(e) => {
                            this.setState({ mobile: e.target.value })
                        }}
                    />
                    <Search
                        placeholder="用户ID"
                        onSearch={this.onSearch}
                        style={{ maxWidth: 200 }}
                        onChange={(e) => {
                            this.setState({ userId: e.target.value })
                        }}
                    />
                    <Select style={{ width: '100px' }} className='m_2' value={this.state.sortType} onChange={(e) => { this.setState({ sortType: e }, () => { this.getInvite() }) }}>
                        <Select.Option value={0}>降序</Select.Option>
                        <Select.Option value={1}>升序</Select.Option>
                    </Select>
                    <Select style={{ width: '100px' }} className='m_2' value={this.state.isAuth} onChange={(e) => { this.setState({ isAuth: e }, () => { this.getInvite() }) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Select style={{ width: '100px' }} className='m_2' value={this.state.sex} onChange={(e) => { this.setState({ sex: e }, () => { this.getInvite() }) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未知</Select.Option>
                        <Select.Option value={1}>男</Select.Option>
                        <Select.Option value={1}>女</Select.Option>
                    </Select>
                    {
                        this.state.regions.length > 0 ?
                            <Select value={this.state.regionId} style={{ width: '100px' }} onChange={(e) => {
                                this.setState({
                                    regionId: e
                                }, () => {
                                    this.getInvite()
                                })
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    this.state.regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <DatePicker
                        key='t_5'
                        format={'YYYY-MM-DD HH:mm'}
                        placeholder="选择开始时间"
                        onChange={(val, dateString) => {
                            this.setState({
                                begin_time: dateString,
                                BeginTime: val
                            })
                        }}
                        value={this.state.BeginTime}
                        locale={locale}
                        showTime={{ format: 'HH:mm' }}
                        allowClear={false}
                    />
                    <span style={{ padding: '0 10px' }}>至</span>
                    <DatePicker
                        key='t_7'
                        format={'YYYY-MM-DD HH:mm'}
                        placeholder="选择结束时间"
                        onChange={(val, dateString) => {
                            this.setState({
                                end_time: dateString,
                                EndTime: val
                            })
                        }}
                        value={this.state.EndTime}
                        locale={locale}
                        showTime={{ format: 'HH:mm' }}
                        allowClear={false}
                    />
                    <Button onClick={this.getInvite}>筛选</Button>
                    <Table loading={this.state.loading} columns={this.col} dataSource={this.invite_list || []} pagination={{
                        current: this.page_current + 1,
                        pageSize: this.page_size,
                        total: this.page_total,
                        showQuickJumper: true,
                        onChange: (val) => {
                            this.page_current = val - 1
                            this.getInvite()
                        },
                        showTotal: (total) => '总共' + total + '条'
                    }} />
                </Card>
                <Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        );
    }
    col = [
        { key: '1', title: 'ID', render: (item, ele) => ele[0] },
        { key: '2', title: '用户账号', render: (item, ele) => ele[1] },
        { key: '3', title: '昵称', render: (item, ele) => ele[2] },
        { key: '4', title: '用户等级', render: (item, ele) => ele[3] },
        { key: '5', title: '成功邀请', render: (item, ele) => ele[4] },
        { key: '6', title: '累计奖励', render: (item, ele) => ele[5] },
        {
            key: '8', title: '操作', render: (item, ele) => (
                <>
                    <Button value='invite/view' size='small' onClick={() => {
                        this.props.history.push('/web-manager/invite-manager/info/' + ele[0] + '?' + ele[2])
                    }}>查看</Button>
                    <Button value='invite/view' size='small' loading={this.state.loadings} onClick={this.onUserOut.bind(this, ele)}>导出</Button>
                </>
            )
        },

    ]
}

const LayoutComponent = InviteManager;
const mapStateToProps = state => {
    return {
        invite_list: state.ad.invite_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
