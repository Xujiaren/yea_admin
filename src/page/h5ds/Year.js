import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload'
import { identity } from 'lodash';
import { act } from 'react-test-renderer';
class Year extends Component {
    state = {
        bill_id: 0,
        action: '',
        view_mode: false,
        isShare: 0,
        imgList: [],
        data: '',
        year: '',
        title: '',
        cover_url: '',
        keyword: '',
        bills_list: [],
        settingPanels: false,
        designation: '',
        t_list:[],
        loads:false
    }
    page_current = 0
    page_total = 0
    page_size = 10
    componentDidMount() {
        this.getBill()
        this.getEpithet()
    }
    componentWillMount() {

    }
    getEpithet=()=>{
        this.props.actions.getApplySetting({
            keyy: 'epithet',
            section: 'yearbill',
            resolved:(res)=>{
                let val = res[0].val.split(',')
                this.setState({
                    t_list:val
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    getBill = () => {
        const { actions } = this.props
        actions.getOpBill({
            keyword: this.state.keyword,
            billId: 0,
            resolved: (res) => {
                this.setState({
                    bills_list: res
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    componentWillReceiveProps(n_props) {
        // if (n_props.bills_list !== this.props.bills_list) {
        //     this.bills_list = Object.values(n_props.bills_list)
        // }
    }
    onPublish = () => {
        // const { actions } = this.props;
        // const { isShare, year, title, cover_url, data, bill_id} = this.state;
        // actions.publishBills({
        //     bill_id:bill_id,
        //     title: title,
        //     year: year,
        //     data: data,
        //     status: isShare,
        //     cover_url: cover_url,

        //     resolved: (data) => {
        //         message.success({
        //             content: '设置成功',
        //         })
        //         this.setState({ settingPanel: false })
        //         actions.getBills(this.keyword)
        //     },
        //     rejected: (data) => {
        //         this.setState({ loading: false })
        //         message.error({
        //             content: data
        //         })
        //     }
        // })
    }
    showModal(title, bill_id, year, coverUrl, status) {
        this.setState({
            settingPanel: true,
            title: title,
            bill_id: bill_id,
            year: year,
            cover_url: coverUrl,
            status: status
        })
        console.log(bill_id)
    }

    onDelete = (id) => {
        console.log(id)
        const { actions } = this.props;
        const { action } = this.state;
        actions.deleteBills({
            bill_ids: id,
            action: 'delete',
            resolved: (data) => {
                message.success('操作成功')
                this.getBill()
            },
            rejected: (data) => {
                this.setState({ loading: false })
                message.error({
                    content: data
                })
            }
        })
    }
    onSearch = (val) => {
        this.keyword = val
        const { actions } = this.props
        actions.getBills(this.keyword)
    }
    onStatus = (val) => {
        const { actions } = this.props
        actions.updateOpBills({
            bill_ids: val.billId,
            action: 'status',
            resolved: (res) => {
                this.getBill()
            },
            rejected: (err) => {
                setTimeout(() => {
                    message.info({
                        content:'请先下架当前年度账单'
                    })
                }, 2000);
            }
        })
    }
    onAdd=()=>{
        const{designation,t_list}=this.state
        if(!designation){message.info({content:'请输入名称'});return;}
        let val = t_list.concat(designation)
        this.props.actions.publishNum({
            keyy: 'epithet',
            section: 'yearbill',
            val:val.toLocaleString(),
            resolved: (data) => {
                message.success({
                    content:'创建成功'
                })
                this.setState({
                    designation:''
                })
                this.getEpithet()
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    onDeletes=(val)=>{
        const{t_list}=this.state
        let vals = t_list.filter(item=>item!=val)
        this.props.actions.publishNum({
            keyy: 'epithet',
            section: 'yearbill',
            val:vals.toLocaleString(),
            resolved: (data) => {
                message.success({
                    content:'操作成功'
                })
                this.getEpithet()
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    onExports=(val)=>{
        this.setState({
            loads:true
        })
        this.props.actions.getBillsUserExporets({
            type:0,
            action:'export',
            billId:val,
            resolved:(res)=>{
                message.success({
                    content:'导出成功'
                })
                window.open(res.address)
                this.setState({
                    loads:false
                })
            },
            rejected:(err)=>{
                this.setState({
                    loads:false
                })
            }
        })
    }
    render() {
        const { view_mode, isShare, imgList, year, title } = this.state
        return (
            <div className="animated fadeIn">
                <Card title='年度账单管理' extra={
                    <>
                        <Button onClick={() => { this.setState({ settingPanels: true }) }}>添加年度称号</Button>
                        <Button onClick={() => this.props.history.push("/year/setting")}>关键词设置</Button>
                        <Button onClick={() => {
                            this.props.history.push('/year/h5ds/0')
                        }}>添加</Button>
                    </>
                }>
                    <Input.Search className='m_w200' onSearch={this.onSearch}></Input.Search>
                    <Table
                        columns={this.col}

                        rowKey='title'
                        dataSource={this.state.bills_list}
                        pagination={{
                            current: this.page_current + 1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper: true,
                            onChange: (val) => {
                                this.page_current = val - 1
                                // this.getMallGoods()
                            },
                            showTotal: (total) => '总共' + total + '条'
                        }}
                    />
                </Card>

                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal title="设置" okText='确定' cancelText='取消' visible={this.state.settingPanel} onOk={this.onPublish} onCancel={() => this.setState({ settingPanel: false })}>
                    <Form layout='vertical'>
                        <Form.Item label='入口是否开通'>
                            <Radio.Group defaultValue={isShare} onChange={e => {
                                this.setState({ isShare: e.target.value })
                            }}>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='上传封面'>
                            <AntdOssUpload accept='image/*' actions={this.props.actions} value={imgList}></AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='时间'>
                            <Input value={title} onChange={e => {
                                this.setState({
                                    title: e.target.value,
                                })
                            }}></Input>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="年度称号" okText='确定' cancelText='取消' visible={this.state.settingPanels} onCancel={() => this.setState({ settingPanels: false })}>
                    <Form.Item>
                        <Input value={this.state.designation} style={{width:'200px'}} onChange={e => {
                            this.setState({
                                designation: e.target.value,
                            })
                        }}></Input>
                        <Button onClick={this.onAdd}>添加</Button>
                    </Form.Item>
                    <Form.Item label='称号'>
                        {
                            this.state.t_list.map(item=>{
                                return(
                                    <Popconfirm title='操作' okText='删除' cancelText='取消' onConfirm={this.onDeletes.bind(this,item)}>
                                        <Tag>{item}</Tag>
                                    </Popconfirm>
                                )
                            })
                        }
                    </Form.Item>
                </Modal>
            </div>
        )
    }
    col = [
        { dataIndex: 'billId', key: 'id', title: 'ID', width: 150 },
        {
            dataIndex: '', key: '', title: '封面', width: 290, render: (item, ele) => {
                // let list = JSON.parse(ele.data)
                return (
                    <img src={ele.billImg} className='head-example-img' onClick={() => {
                        this.setState({ showImgPanel: true })
                    }}></img>
                )
            }
        },
        // { dataIndex: 'coverUrl', key: 'link', title: '链接' },
        { dataIndex: 'year', key: 'year', title: '时间' },
        { dataIndex: 'title', key: 'title', title: '标题' },
        {
            width: 200, dataIndex: '', key: '', title: '操作', render: (item, ele, index) => {
                return (
                    <>
                        <Button size='small' className='m_2' type={ele.status == 1 ? 'primary' : ''} onClick={this.onStatus.bind(this, ele)}>{ele.status == 0 ? '上架' : '下架'}</Button>
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/year/h5ds/' + ele.billId)
                        }}>编辑</Button>
                        <Button size='small' className='m_2' onClick={() => {
                            this.props.history.push('/year/h5ds/' + ele.billId)
                        }}>查看</Button>

                        {/* <Button size='small' className='m_2' onClick={this.showModal.bind(this,ele.title,ele.billId,ele.year,ele.coverUrl,ele.status)}>设置</Button> */}
                        <Popconfirm title='确定删除吗' okText='确定' cancelText='取消' onConfirm={this.onDelete.bind(this, ele.billId)}>
                            <Button size='small' className='m_2'>删除</Button>
                        </Popconfirm>
                        <Button size='small' loading={this.state.loads} className='m_2' onClick={this.onExports.bind(this,ele.billId)}>用户明细导出</Button>
                    </>
                )
            }
        },

    ]
}

const LayoutComponent = Year;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        bills_list: state.ad.bills_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
