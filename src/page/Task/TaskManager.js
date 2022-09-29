import React, { Component } from 'react';
import { Table, Upload, Tag, Empty, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio, InputNumber, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { Col, Row, Table as Tables } from 'reactstrap';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import config from '../../config/config';
import AntdOssUpload from '../../components/AntdOssUpload'
import moment from 'moment'
import { Button, Popconfirm } from '../../components/BtnComponent'

const { TabPane } = Tabs;
const { RadioGroup } = Radio;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
function beforeUpload(file) {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //   if (!isJpgOrPng) {
    //     message.error('只能上传 JPG/PNG 文件!');
    //   }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
        message.info('图片文件需小于 1MB!');
    }
    //   return isJpgOrPng && isLt2M;
    return isLt2M;
}
class Task extends Component {
    state = {

        edit: true,
        view: true,
        visible: false,
        isView: false,
        title: '',

        status: 0,
        tag_id: '',
        tag_name: '',
        ttype: 0,
        previewImage: '',
        showImgPanel: false,
        showRefund: false,
        showEditPanel: false,
        showAddPanel: false,
        showPost: false,
        showPostView: false,
        fileList: [],
        activeTab: '1',
        order: 1,
        sub: false,

        task_level: '',
        task_name: '',
        edit_task_level: 0,
        begin_time: '',
        end_time: '',
        integral: 0,
        task_limit: 0,
        task_img: '',
        task_summary: '',
        total: 0,
        page: 0,
        pageSize: 20,
        data_list: [],
        keyword: '',
        atime: null,
        loading: false,
        integral_list: [

        ],
        task_cycle: '',
    };
    img = {
        getValue: () => ''
    }

    componentWillMount() {
        // this.getTask()
        this.props.actions.getIntegral()
    }
    // _onUpdate(id) {
    //     this.handleCancel()
    //     message.success("操作成功")
    //     return
    //     const { actions } = this.props
    //     actions.updateTag({
    //         tag_id: id,
    //         resolved: (data) => {
    //             let { keyword } = this.state
    //             this.handleCancel()
    //             // message.success("操作成功")
    //             // actions.getTag({
    //             //     keyword:keyword,
    //             //     page:this.page_current-1,
    //             //     ttype:'',
    //             //     pageSize:this.page_size
    //             // })
    //         },
    //         rejected: (data) => {
    //             message.error("data")
    //         }
    //     })
    // }
    setTask = () => {
        let {
            task_id,
            task_name,
            edit_task_level: task_level,
            begin_time,
            end_time,
            integral,
            task_limit,
            task_img,
            task_summary,
            atime,
        } = this.state
        // if (!task_name) { message.info('请输入任务名称'); return }
        // if(!task_level) { message.info('请选择任务类型'); return }
        // if (Array.isArray(atime)) {
        //     begin_time = moment(atime[0]).format('YYYY-MM-DD')
        //     end_time = moment(atime[1]).format('YYYY-MM-DD')
        // }
        task_img = this.img.getValue()

        this.props.actions.setTask({
            task_id,
            task_name,
            task_level,
            begin_time,
            end_time,
            integral,
            task_limit,
            task_img,
            task_summary,
            resolved: (res) => {
                message.success('提交成功')
                // this.getTask()
                this.props.actions.getIntegral()
                this.setState({
                    showAddPanel: false
                })
            },
            rejected: () => {

            }
        })
    }
    // getTask = () => {
    //     // this.setState({ loading:true })
    //     const { task_level, keyword, page, pageSize } = this.state
    //     this.props.actions.getTask({
    //         task_level, keyword, page, pageSize, taskId: -1,
    //         resolved: (res) => {
    //             console.log(res, "??????????")
    //             if (res && typeof res === 'object') {
    //                 const { page, total, data } = res
    //                 if (Array.isArray(data))
    //                     this.setState({ data_list: data, total, page })
    //             }
    //             this.setState({ loading: false })
    //         },
    //         rejected: () => {
    //             this.setState({ loading: false })
    //         }
    //     })
    // }
    componentWillReceiveProps(n_props) {
        // if(n_props.task_list!==this.props.task_list){
        //     this.setState({
        //         //  data_list:data
        //     })
        // }
        if (n_props.integral_list !== this.props.integral_list) {
            this.setState({
                integral_list: n_props.integral_list,
            })
        }
    }
    // _onDelete(id) {
    //     const { actions } = this.props
    //     this.handleCancel()
    //     message.success("操作成功")
    //     return
    //     actions.removeTag({
    //         tag_id: id,
    //         resolved: (data) => {
    //             let { keyword } = this.state
    //             this.handleCancel()
    //             message.success("操作成功")
    //             if (this.tag_list.length == 1) {
    //                 keyword = ''
    //             }
    //             // actions.getTag({
    //             //     keyword:keyword,
    //             //     page:this.page_current-1,
    //             //     ttype:'',
    //             //     pageSize:this.page_size
    //             // })
    //         },
    //         rejected: (data) => {
    //             message.error(data)
    //         }
    //     })
    // }

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
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            showImgPanel: true,
        });
    };
    actionTask = (action, task_id) => {
        this.props.actions.actionTask({
            action, task_id,
            resolved: (res) => {
                message.success('提交成功')
                // this.getTask()
                this.props.actions.getIntegral()
            }
        })
    }
    onEdit = (ele) => {
        const {

            taskId: task_id,
            taskName: task_name,
            editTaskLevel: edit_task_level,
            beginTime: begin_time,
            endTime: end_time,
            integral,
            taskLimit: task_limit,
            taskImg,
            taskSummary: task_summary,

        } = ele
        console.log(ele,'??')
        let img = [{
            response: { resultBody: ele.taskImg },
            uid: 'img',
            name: 'img' + 1,
            url: ele.taskImg,
            type: 'image/png',
            status: 'done'
        }]
        const atime = [moment.unix(begin_time), moment.unix(end_time)]
        this.setState({
            // atime,
            showAddPanel: true,
            task_id,
            task_name,
            edit_task_level,
            begin_time,
            end_time,
            integral,
            task_limit,
            // task_img:img,
            task_summary,
            fileList:img,
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
        const cycle_type = ['无限', '每天', '每周']
        return (
            <div className="animated fadeIn">
                <Spin spinning={this.state.loading}>
                    <Card title="任务管理">
                        <div className="flex f_row j_space_between align_items mb_10">
                            <div className='flex f_row align_items'>
                                {/* <Input.Group compact className='flex'>
                                <Input disabled style={{width:'80px'}} value={"任务类型"}/>
                                <Select value={this.state.task_level} onChange={e=>{
                                    this.setState({ task_level:e })
                                }}>
                                    <Select.Option value={''}>全部</Select.Option>
                                    <Select.Option value={0}>新手任务</Select.Option>
                                    <Select.Option value={1}>日常任务</Select.Option>

                                    <Select.Option value={2}>高阶任务</Select.Option>
                                    <Select.Option value={3}>活动任务</Select.Option>
                                </Select>
                            </Input.Group>&nbsp;
                            <Search
                                placeholder='任务名称'
                                onSearch={(val)=>this.setState({ keyword:val },this.getTask)}
                                style={{ maxWidth: 200 }}
                            /> */}
                            </div>
                            <div>
                                <Button value='taskRecord' onClick={() => {
                                    this.props.history.push('/member-manager/task/record')
                                }}>任务记录</Button>&nbsp;
                                {/* <Button value='task/add' onClick={()=>{
                                this.setState({ 
                                    atime:null,
                                    showAddPanel:true,
                                    task_id:0,
                                    task_name:'',
                                    edit_task_level:0,
                                    begin_time:'',
                                    end_time:'',
                                    integral:0,
                                    task_limit:0,
                                    task_img:'',
                                    task_summary:'',
                                    img:[]
                                })
                            }}>新增任务</Button> */}
                            </div>
                        </div>

                        {/* <Table scroll={{x:1200}} rowKey='taskId' columns={[
                        {dataIndex:'taskId',key:'taskId',title:'ID'},
                        {dataIndex:'taskName',key:'taskName',title:'任务名称'},
                        {title:'任务周期',render:(item,ele)=>{
                            if(ele.beginTime==0&&ele.endTime==0)
                            return '无期限'
                            else if(ele.beginTime!=0&&ele.endTime==0)
                            return moment.unix(ele.beginTime).format('YYYY-MM-DD') + '至无期限'
                            else if(ele.beginTime==0&&ele.endTime!=0)
                            return '无期限至'+ moment.unix(ele.endTime).format('YYYY-MM-DD')
                            else if(ele.beginTime!=0&&ele.endTime!=0)
                            return moment.unix(ele.beginTime).format('YYYY-MM-DD') + '至' + moment.unix(ele.endTime).format('YYYY-MM-DD')
                        }},
                        {dataIndex:'integral',key:'integral',title:'奖励金币'},

                        {dataIndex:'taskLimit',key:'taskLimit',title:'限制次数'},
                        {dataIndex:'status',key:'status',title:'状态',render:(item,ele)=>ele.status?'已上架':'已下架'},
                        {fixed:'right',title:'操作',render:(item,ele)=>{
                            return (<>
                                <Button value='task/edit' size='small' className='m_2' onClick={this.onEdit.bind(this,ele)}>修改</Button>
                                <Button type={ele.status?'primary':''} value='task/status' size='small' className='m_2'
                                    onClick={this.actionTask.bind(this,'status',ele.taskId)}
                                >
                                    {ele.status?'下架':'上架'}
                                </Button>
                                <Popconfirm 
                                    title='确定删除吗'
                                    okText='确定'
                                    cancelText='取消'
                                    value='task/del'
                                    className='m_2'
                                    onConfirm={this.actionTask.bind(this,'delete',ele.taskId)}
                                >
                                </Popconfirm>
                            </>)
                        }},
                    ]} dataSource={this.state.data_list} pagination={{
                        pageSize:this.state.pageSize,
                        current:this.state.page+1,
                        total:this.state.total,
                        onChange:(val)=>this.setState({ page:val-1 },this.getTask),
                        onShowSizeChange:(idx,pageSize)=>this.setState({pageSize},this.getTask)
                    }}>
                    </Table> */}
                        <div>
                            <Tables responsive size="" className="v_middle">
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
                                                        type={ele.status?'':"primary"}
                                                        size={'small'}
                                                        onClick={this.actionTask.bind(this,'status',ele.taskId)}
                                                        >
                                                       {ele.status?'下架':'上架'}
                                                    </Button>&nbsp;
                                                    <Button
                                                        type="primary"
                                                        size={'small'}
                                                        onClick={this.onEdit.bind(this,ele)}
                                                        >
                                                        图标
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Tables>
                        </div>
                    </Card>
                </Spin>
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
                <Modal
                    zIndex={90}
					title={this.state.task_id?'修改':'新增'}
					visible={this.state.showAddPanel}
					okText="确定"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={()=>{
                        this.setState({ showAddPanel:false })
                    }}
					onOk={this.setTask}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form {...formItemLayout}>
                        {/* <Form.Item label='任务名称'>
                            <Input value={this.state.task_name} onChange={e=>{
                                this.setState({ task_name:e.target.value })
                            }}></Input>
                        </Form.Item>
                        <Form.Item label='任务类型'>
                            <Select value={this.state.edit_task_level} onChange={e=>{
                                this.setState({ edit_task_level:e })
                            }}>
                                <Select.Option value={0}>新手任务</Select.Option>
                                <Select.Option value={1}>日常任务</Select.Option>

                                <Select.Option value={2}>高阶任务</Select.Option>
                                <Select.Option value={3}>活动任务</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='任务期限'>
                            <DatePicker.RangePicker 
                            value={this.state.atime} format='YYYY-MM-DD' showTime={false} 
                            onChange={(date)=>{
                                this.setState({ atime:date })
                            }}></DatePicker.RangePicker>
                        </Form.Item>
                        <Form.Item label='任务说明'>
                            <Input.TextArea autoSize={{minRows:2}} value={this.state.task_summary} onChange={e=>{
                                this.setState({ task_summary:e.target.value })
                            }}></Input.TextArea>
                        </Form.Item> */}
                        <Form.Item label="上传图标">
                        <AntdOssUpload
                            actions={this.props.actions}
                            ref={ref => this.img = ref}
                            value={this.state.fileList}
                            listType="picture-card"
                            maxLength={1}
                            accept='image/*'
                        >
                        </AntdOssUpload>
                        </Form.Item>
                        {/* <Form.Item label='奖励积分'>
                            <InputNumber
                                value={this.state.integral}
                                min={0}
                                onChange={(e)=>{
                                    this.setState({integral:e})
                                }}
                            />
                        </Form.Item>
                        <Form.Item label='奖励次数'>
                            <InputNumber
                                value={this.state.task_limit}
                                min={0}
                                onChange={(e)=>{
                                    this.setState({task_limit:e})
                                }}
                            />
                        </Form.Item> */}
                    </Form>
                </Modal>

            </div>
        )
    }
}
const LayoutComponent = Task;
const mapStateToProps = state => {
    return {
        integral_list: state.user.integral_list,
        user: state.site.user,
        tasks_list: state.site.tasks_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
