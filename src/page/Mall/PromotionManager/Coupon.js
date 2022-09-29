import React, { Component } from 'react';
import { Row, Col, Statistic, Divider, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio, Spin } from 'antd';
import { Link } from 'react-router-dom';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment'
import { Button, Popconfirm } from '../../../components/BtnComponent'
import FormItem from 'antd/lib/form/FormItem';

const { RadioGroup } = Radio;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker
class Coupon extends Component {
    state = {
        keyword: '', page: 0, pageSize: 10, type: -1,
        data_list: [],
        result: [],
        date_loading: false,
        coupons: [],
        coupons_val: [],
        comes: [],
        comes_val: [],
        ctype:-1,
    };

    getCoupon = () => {
        this.setState({ loading: true })

        const { keyword, page, pageSize, type,ctype } = this.state
        this.props.actions.getCoupon({
            keyword, page, pageSize, type,ctype,
            resolved: (res) => {
                const { total, page, data } = res
                if (Array.isArray(data)) {
                    this.setState({
                        data_list: data,
                        total,
                        page,
                    })
                }
                console.log(res)
                this.setState({ loading: false })
            },
            rejected: () => {
                this.setState({ loading: false })
            }
        })
    }
    getComes = () => {
        this.props.actions.getCouponCome({
            action: 'export',
            resolved: (res) => {
                console.log(res)
                this.setState({
                    comes: Object.keys(res),
                    comes_val: Object.values(res)
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getNums = () => {
        this.props.actions.getCouponMain({
            action: 'export',
            resolved: (res) => {
                this.setState({
                    coupons: Object.keys(res),
                    coupons_val: Object.values(res)
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    _onDelete(id) {

    }

    componentWillMount() {
        this.getCoupon()
        this.getNums()
        this.getComes()
    }

    componentWillReceiveProps(n_props) {

    }
    showModal(txt, index) {
        let is_view = false
        if (index !== 'add') {
            if (txt == "查看") {
                is_view = true
            }
            const tag_item = this.tag_list[index]

            this.setState({
                title: txt,
                isView: is_view,
                visible: true,
                status: tag_item.status,
                tag_id: tag_item.tagId,
                tagName: '健康大调查',
                ttype: tag_item.ttype
            })
        } else {
            this.setState({
                title: txt,
                isView: false,
                visible: true,

                status: 0,
                tag_id: '',
                tagName: '',
                ttype: 0
            })
        }
    };
    handleCancel = () => {
        this.setState({
            visible: false,
            tag_id: '',
        });
    };
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
    actionCoupon = (action, couponId) => {
        this.props.actions.actionCoupon({
            action, coupon_ids: couponId,
            resolved: (res) => {
                message.success('提交成功')
                this.getCoupon()
            },
            rejected: () => {

            }
        })
    }
    getCouponStat = () => {
        this.setState({ date_loading: true })
        this.props.actions.getCouponStat({
            resolved: (res) => {
                if (res && typeof res === 'object' && Object.keys(res).length > 0) {
                    let result = Object.keys(res).map(ele => {
                        return {
                            key: ele,
                            value: res[ele]
                        }
                    })
                    this.setState({ date_loading: false, result })
                }
            },
            rejected: () => {
                this.setState({ date_loading: false })
            }
        })
    }
    render() {
        return (
            <div className="animated fadeIn">
                <Spin spinning={this.state.loading}>
                    <Card title="优惠券管理">
                        <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                <Select value={this.state.ctype} onChange={(val) => {
                                        this.setState({ ctype: val, page: 0 }, this.getCoupon)
                                    }}>
                                        <Select.Option value={-1}>全部</Select.Option>
                                        <Select.Option value={3}>课程</Select.Option>
                                        <Select.Option value={7}>商品</Select.Option>
                                    </Select>&nbsp;
                                    <Select value={this.state.type} onChange={(val) => {
                                        this.setState({ type: val, page: 0 }, this.getCoupon)
                                    }}>
                                        <Select.Option value={-1}>全部类型</Select.Option>
                                        <Select.Option value={1}>已过期</Select.Option>
                                        <Select.Option value={0}>未过期</Select.Option>
                                    </Select>&nbsp;
                                    <Search
                                        placeholder=''
                                        onSearch={() => this.setState({ page: 0 }, this.getCoupon)}
                                        onChange={(e) => { this.setState({ keyword: e.target.value }) }}
                                        style={{ maxWidth: 200 }}
                                    />
                                </div>
                                <div>
                                    <Button value='coupon/data' onClick={() => {
                                        this.setState({ datePanel: true, date_loading: true }, this.getCouponStat)
                                    }}>查看数据</Button>
                                    <Button value='coupon/add' onClick={() => {
                                        this.props.history.push('/mall/coupon/add/0')
                                    }}>添加优惠券</Button>
                                </div>
                            </div>
                            <div className='flex' style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                                {this.state.data_list.map(ele => (
                                    <Card
                                        key={ele.couponId}
                                        style={{ width: '282px', margin: '10px' }}
                                        cover={<img style={{ height: '112px' }} src={ele.couponImg} />}
                                        type='inner' hoverable bordered={true}
                                        bodyStyle={{ padding: '10px' }}
                                    >
                                        <div className='m_2'>
                                            名称：<Tag>{ele.couponName}</Tag>
                                        </div>
                                        {/* <div>
                                券码：<Tag>3950790404</Tag>
                            </div> */}
                                        {
                                            ele.ctype == 3 ?
                                                <div className='m_2'>
                                                    面值：<Tag>{ele.integral}金币</Tag>
                                                </div>
                                                :
                                                <div className='m_2'>
                                                    面值：<Tag>¥{ele.amount}</Tag>
                                                </div>
                                        }
                                        {
                                            ele.ctype == 3 ?
                                                <div className='m_2'>
                                                    满多少可用：<Tag>{ele.requireIntegral}金币</Tag>
                                                </div>
                                                :
                                                <div className='m_2'>
                                                    满多少可用：<Tag>¥{ele.requireAmount}</Tag>
                                                </div>
                                        }

                                        {
                                            ele.endTime == 0 ?
                                                <div className='m_2'>
                                                    有效期：<Tag>{
                                                        moment.unix(ele.beginTime).format('YYYY-MM-DD') + '至无期限'
                                                    }</Tag>
                                                </div>
                                                :
                                                <div className='m_2'>
                                                    有效期：<Tag>{
                                                        moment.unix(ele.beginTime).format('YYYY-MM-DD') + '至' +
                                                        moment.unix(ele.endTime).format('YYYY-MM-DD')
                                                    }</Tag>
                                                </div>
                                        }

                                        <div className='m_2'>
                                            库存：<Tag>{ele.total}</Tag>
                                        </div>
                                        <div className='mb_2 mt_10'>
                                            <span>
                                                <a onClick={() => {
                                                    if (this.props.rule.includes('coupon/view'))
                                                        this.props.history.push({
                                                            pathname: '/mall/coupon/view/' + ele.couponId
                                                        })
                                                    else
                                                        message.info('暂无权限')
                                                }}>查看</a>
                                                <Divider type="vertical" />
                                                <a onClick={() => {
                                                    if (this.props.rule.includes('coupon/edit'))
                                                        this.props.history.push({
                                                            pathname: '/mall/coupon/edit/' + ele.couponId
                                                        })
                                                    else
                                                        message.info('暂无权限')
                                                }}>修改</a>
                                                <Divider type="vertical" />
                                                <Popconfirm value='coupon/del' onConfirm={this.actionCoupon.bind(this, 'delete', ele.couponId)} title='确定删除吗？' okText='确定' cancelText='取消'>
                                                    <a>删除</a>
                                                </Popconfirm>
                                                {/* <Divider type="vertical" />
                                    <a>查看数据</a> */}
                                                <Divider type="vertical" />
                                                <a onClick={() => {
                                                    if (this.props.rule.includes('coupon/status'))
                                                        this.actionCoupon('status', ele.couponId)
                                                    else
                                                        message.info('暂无权限')
                                                }} size='small' type={ele.status === 1 ? 'primary' : ''}>{ele.status === 1 ? '禁用' : '启用'}</a>
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <Pagination
                            pageSize={this.state.pageSize}
                            current={this.state.page + 1}
                            onChange={(val) => {
                                this.setState({ page: val - 1 }, this.getCoupon)
                            }}
                            total={this.state.total}
                            showQuickJumper={true}
                            showTotal={(t) => `总共${t}条`}
                        />
                    </Card>
                </Spin>
                <Modal width={880} visible={this.state.datePanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ datePanel: false })
                }}>
                    <Spin spinning={this.state.date_loading}>
                        <Row
                            gutter={4}
                            align='stretch'
                        >
                            {
                                this.state.result.map((ele, index) => {
                                    return (
                                        <Col span={8}>
                                            <Card className='m_2'>
                                                <Statistic
                                                    title={ele.key}
                                                    value={ele.value}
                                                    valueStyle={{ color: '#1890ff' }}
                                                />
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                            {
                                this.state.coupons.map((ele, index) => {
                                    return (
                                        <Col span={8}>
                                            <Card className='m_2'>
                                                <Statistic
                                                    title={ele}
                                                    value={this.state.coupons_val[index]}
                                                    valueStyle={{ color: '#1890ff' }}
                                                />
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                            <FormItem label='渠道分析'>
                                {
                                    this.state.comes.map((ele, index) => {
                                        return (
                                            <Col span={8}>
                                                <Card className='m_2'>
                                                    <Statistic
                                                        title={ele + '(数量)'}
                                                        value={this.state.comes_val[index]['数量']}
                                                        valueStyle={{ color: '#1890ff' }}
                                                    />
                                                </Card>
                                            </Col>
                                        )
                                    })
                                }
                                {
                                    this.state.comes.map((ele, index) => {
                                        return (
                                            <Col span={8}>
                                                <Card className='m_2'>
                                                    <Statistic
                                                        title={ele + '(金额)'}
                                                        value={this.state.comes_val[index]['金额']}
                                                        valueStyle={{ color: '#1890ff' }}
                                                    />
                                                </Card>
                                            </Col>
                                        )
                                    })
                                }
                            </FormItem>

                        </Row>
                    </Spin>
                </Modal>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}
const LayoutComponent = Coupon;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        rule: state.site.user.rule,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
