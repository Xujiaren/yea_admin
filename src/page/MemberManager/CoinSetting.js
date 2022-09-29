import React, { Component } from 'react';
import { Col, Row, Table } from 'reactstrap';
import { Form, Tag, Modal, Empty, Select, Tabs, Card, DatePicker, Menu, Dropdown, Icon, message, Input, InputNumber } from 'antd';
import { Line, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import connectComponent from '../../util/connect'
import _ from 'lodash'
import { Button, Popconfirm } from '../../components/BtnComponent'
import AntdOssUpload from '../../components/AntdOssUpload'

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

class CoinSetting extends Component {
    integral_list = []
    se_list = []
    type = ''
    index = ''
    state = {
        edit: false,
        view: false,
        showEdit: false,
        showMore: false,
        imgList:[],
        integral_list: [

        ],
        more_list: [
            { id: 1, integral: 0, totalIntegral: 0 }
        ],
        se_list: [
            { id: 1, integral: 0, max_integral: 0 }
        ],
        id: '',
        max_integral: 0,
        integral: 0,
        title: '',

        task_cycle: '',
        task_limit: '',

        isSystem: false
    }



    componentDidMount() {
        const { actions } = this.props
        actions.getIntegral()
    }


    componentWillReceiveProps(n_props) {
        if (n_props.integral_list !== this.props.integral_list) {
            this.setState({
                integral_list: n_props.integral_list,
            })
        }
    }
    showEdit(idx, type) {
        this.index = idx
        this.type = type
        this.setState(pre => {
            let list = {}
            let imgList = []
            if (type == 'more') {
                list = pre.more_list[idx]
            } else {
                list = pre.integral_list[idx]
            }
            let imgs = list.taskImg.split(',')
            imgs.map((ele, idx) => {
                imgList.push({
                    response: { resultBody: ele },
                    uid: idx,
                    name: 'img' + idx,
                    status: 'done',
                    url: ele,
                    type: 'image/png'
                })
            })
            return {
                isSystem: list.isSystem == 1 ? true : false,
                showEdit: true,
                integral: list.integral,
                id: list.taskId,
                max_integral: list.totalIntegral,
                task_limit: list.taskLimit,
                task_cycle: list.taskCycle,
                imgList:imgList
            }
        })
    }
    _onPublish = () => {
        const { actions } = this.props;
        const {
            task_cycle: task_cycle,
            task_limit: task_limit,
            id: task_id,
            max_integral: total_integral,
            integral: integral,
        } = this.state;
        let img =(this.imgs && this.imgs.getValue()) || ''
        if (task_limit > 1000) { message.info('限制次数不能大于1000'); return; }
        if (integral > 9999999) { message.info('获得金币不能大于9999999'); return; }

        let json = JSON.stringify([{ task_cycle, task_limit, task_id, total_integral, integral ,task_img:img}]);
        actions.publishIntegral({
            json,
            resolved: (data) => {
                actions.getIntegral()
                this.hideEdit()

                message.success("提交成功")

                if (this.type == 'more') {
                    let list = this.state.more_list
                    list[this.index].integral = integral
                    list[this.index].totalIntegral = total_integral
                    list[this.index].taskCycle = task_cycle
                    list[this.index].taskLimit = task_limit
                    this.setState({
                        more_list: list
                    })
                }


            },
            rejected: (data) => {
                message.error(data)
                setTimeout(() => {
                    message.success("提交成功")
                    this.hideEdit()
                }, 1500);
            }
        })
    }

    hideEdit = () => {

        this.setState({
            showEdit: false
        })
    }
    showMore(idx) {

        this.setState(pre => {
            let showMore = true
            let more_list = pre.integral_list[idx].taskList
            const title = pre.integral_list[idx].taskName
            return {
                more_list, showMore, title
            }
        })
    }
    hideMore = () => {
        this.setState({
            showMore: false
        })
    }
    _onUpate(index) {

    }
    _onSePublish = () => {

    }


    _onInput(index, val) {
        if (val !== '' && !isNaN(val)) {
            val = Math.round(val)
            if (val < 0) val = 0
            this.setState((pre) => {
                let _list = pre.integral_list
                _list[index].integral = val
                return {
                    integral_list: _list
                }
            })
        }
    }
    _onMaxInput(index, val) {
        if (val !== '' && !isNaN(val)) {
            val = Math.round(val)
            if (val < 0) val = 0
            this.setState((pre) => {
                let _list = pre.integral_list
                _list[index].max_integral = val
                return {
                    integral_list: _list
                }
            })
        }
    }
    _onSeInput(index, val) {
        if (val !== '' && !isNaN(val)) {
            val = Math.round(val)
            if (val < 0) val = 0
            this.setState((pre) => {
                let _list = pre.integral_list
                _list[index].integral = val
                return {
                    se_list: _list
                }
            })
        }
    }


    render() {
        console.log(this.state.view, this.state.edit)
        const cycle_type = ['无限', '每天', '每周']
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 10 },
            },
        };
        const { integral_list, se_list } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="系统赠送规则设置" key="1">
                            <div>
                                <Table responsive size="" className="v_middle">
                                    <thead>
                                        <tr>
                                            <th>序号</th>
                                            <th>描述</th>
                                            <th>备注</th>
                                            <th>限制次数</th>
                                            <th>周期</th>
                                            <th>获得金币</th>
                                            {/*<th>上限金币</th>*/}
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.integral_list.length == 0 ?
                                            <tr><td colSpan={7}>
                                                <Empty className="mt_10" description="暂时没有数据" />
                                            </td></tr>
                                            :
                                            this.state.integral_list.map((ele, index) => (
                                                <tr key={index + 'inte'}>
                                                    <td>{index + 1}</td>
                                                    <td>{ele.taskName}</td>
                                                    <td>{ele.taskSummary}</td>
                                                    <td>{ele.taskLimit}</td>
                                                    <td>{cycle_type[ele.taskCycle]}</td>
                                                    <td>
                                                        <Tag color="volcano">{ele.integral}</Tag>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            value='coin/edit'
                                                            data-issystem={ele.isSystem}
                                                            data-title={ele.taskName}
                                                            data-id={ele.taskId}
                                                            data-total={ele.totalIntegral}
                                                            data-inte={ele.integral}
                                                            onClick={this.showEdit.bind(this, index, '')}
                                                            type="primary"
                                                            size={'small'}>
                                                            修改
                                                </Button>&nbsp;
                                                <Button
                                                            data-title={ele.taskName}
                                                            disabled={ele.taskList.length == 0 ? true : false}
                                                            onClick={this.showMore.bind(this, index)}
                                                            type="primary"
                                                            size={'small'}>
                                                            更多
                                                </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </TabPane>
                        <TabPane tab="金币消耗规则设置" key="2">
                            <div>
                                <Card type='inner' title="翻牌抽奖">
                                    {/* <Table responsive size="sm" className="v_middle">
                                    <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>描述</th>
                                        <th>消耗金币</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {this.se_list.length == 0?
                                            <tr><td colSpan={3}>
                                                <Empty className="mt_10" description="暂时没有数据"/>
                                            </td></tr>
                                        :
                                        this.se_list.map((ele,index)=>(
                                            <tr key={index+'inte'}>
                                                <td>{index+1}</td><td>{ele.intro}</td>
                                                <td>
                                                    <InputNumber onChange={this._onSeInput.bind(this,index)} value={se_list[index].integral} placeholder='输入金币'/>
                                                </td>
                                            </tr>
                                        ))}
                                        
                                    </tbody>
                                </Table>
                                
                                <Button onClick={this._onSePublish}>提交</Button>
                            */}
                                </Card>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
                <Modal
                    width={800}
                    title={this.state.title}
                    visible={this.state.showMore}
                    footer={null}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideMore}
                    bodyStyle={{ padding: "25px", paddingTop: '25px' }}

                >
                    <Table responsive size="" className="v_middle">
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>描述</th>
                                <th>备注</th>
                                <th>限制次数</th>
                                <th>周期</th>
                                <th>获得金币</th>
                                {/*<th>上限金币</th>*/}
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.more_list.map((ele, index) => (
                                    <tr key={index + 'more_inte'}>
                                        <td>{index + 1}</td>
                                        <td>{ele.taskName}</td>
                                        <td>{ele.taskSummary}</td>
                                        <td>{ele.taskLimit}</td>
                                        <td>{cycle_type[ele.taskCycle]}</td>
                                        <td>
                                            <Tag color="volcano">{ele.integral}</Tag>
                                        </td>
                                        {/*<td>
                                            <Tag color="volcano">{ele.totalIntegral}</Tag>
                                        </td>
                                        */}
                                        <td>
                                            <Button
                                                value='coin/edit'
                                                data-issystem={ele.isSystem}
                                                data-index={index}
                                                data-title={ele.taskName}
                                                data-id={ele.taskId}
                                                data-total={ele.totalIntegral}
                                                data-inte={ele.integral}
                                                onClick={this.showEdit.bind(this, index, 'more')}
                                                type="primary"
                                                size={'small'}>
                                                修改
                                                </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Modal>
                <Modal
                    title="修改规则"
                    visible={this.state.showEdit}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideEdit}
                    bodyStyle={{ padding: "10px" }}
                    okText="提交"
                    cancelText="取消"
                    onOk={this._onPublish}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="限制次数">
                            <InputNumber
                                min={0} max={1000}
                                style={{ width: '208px' }}
                                disabled={this.state.isSystem ? true : false}
                                onChange={val => {
                                    if (val !== '' && !isNaN(val)) {
                                        val = Math.round(val)
                                        if (val < 0) val = 0
                                        this.setState({
                                            task_limit: val
                                        })
                                    }
                                }}
                                value={this.state.task_limit}
                            />
                        </Form.Item>
                        <Form.Item label="周期类型">
                            <Select
                                disabled={this.state.isSystem ? true : false}
                                value={this.state.task_cycle}
                                onChange={val => {
                                    this.setState({
                                        task_cycle: val
                                    })
                                }}
                            >
                                <Select.Option value={0}>无限</Select.Option>
                                <Select.Option value={1}>每天</Select.Option>
                                <Select.Option value={2}>每周</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="获得金币">
                            <InputNumber
                                min={0} max={1000000}
                                style={{ width: '208px' }}
                                onChange={val => {
                                    if (val !== '' && !isNaN(val)) {
                                        val = Math.round(val)
                                        if (val < 0) val = 0
                                        this.setState({
                                            integral: val
                                        })
                                    }
                                }}
                                value={this.state.integral}
                            />
                        </Form.Item>
                        <div style={{width:'150px',marginLeft:'120px'}}>
                        <AntdOssUpload
                            actions={this.props.actions}
                            ref={ref => this.imgs = ref}
                            value={this.state.imgList}
                            listType="picture-card"
                            maxLength={1}
                            accept='image/*'
                        >
                        </AntdOssUpload>
                        </div>
                        {/*
                        <Form.Item label="上限金币">
                            <InputNumber
                                onChange={val=>{
                                    if(val<0) val=0;
                                    this.setState({
                                        max_integral:val
                                    })
                                }}
                                value={this.state.max_integral}
                            />
                        </Form.Item>
                        */}
                    </Form>
                </Modal>

            </div>
        );
    }
}

const LayoutComponent = CoinSetting;
const mapStateToProps = state => {
    return {
        integral_list: state.user.integral_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });