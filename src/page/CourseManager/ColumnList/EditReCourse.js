import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { Empty, Spin, Checkbox,Radio,InputNumber,Icon,Upload,PageHeader,Switch,Modal,Form,Card,Select ,Input,Button,message} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../../util/connect';

import layout_1 from '../../../assets/img/layout_1.png'
import layout_2 from '../../../assets/img/layout_2.png'
const {Option} = Select;

class EditReCourse extends Component {
    state = {
        view_mode:false,

        teacherData:[],
        selectTeacher:[],
        teacherFetching:false,

        checkValue:[],
        flag_select:2,

        fileList:[],
        fileList_1:[],
        previewVisible:false,
        previewImage: '',
        editorState: null,
        showTheBox:true,
        isVideoCourse:true,

        channel_id:0, 
        channel_name:'',
        ttype:0,
        ctype:0,
        sort_order:0,
        status:0,
        flag:'',
        teacher_id:0,
        isEdit:true,
    };
    col_list = []
    componentDidMount(){
        this.fetchTeacher('')
        if(this.props.match.path == '/course-manager/create-recourse'){
            this.setState({ isEdit:false })
        }else if(typeof this.props.col_list == 'undefined'){
            message.info({
                content:"专栏对象为空，请先返回专栏列表页",
                onClose:()=>{
                    window.history.back();
                }
            })
        }else{
            const index =this.props.match.params.channel
 
            if(!index||isNaN(index)){
                message.info({
                    content:"地址参数错误，请先返回专栏列表页",
                    onClose:()=>{
                        window.history.back();
                    }
                })
            }else{
                
                if(this.props.match.path == '/course-manager/view-recourse/:channel'){
                    this.setState({ view_mode:true })
                }
                let col_list = this.props.col_list.data[index]
                
                let flag_select = 1
                let checkValue = []
                let selectTeacher = []

                if(col_list.teacherId !== 0){
                    const {teacherId} = col_list
                    const {teacher} = col_list
                    selectTeacher = [{ key:teacherId,label:teacher['teacherName']||'' }]
                }
                if(col_list.flag){
                    checkValue = col_list.flag.split('/')
                    checkValue.pop()
                    checkValue.shift()
                }
    
                if(!col_list.flag)
                    flag_select = 0
                else if(col_list.flag == '/2/')
                    flag_select = 1
                else
                    flag_select = 2

                this.setState({
                    selectTeacher,
                    checkValue:checkValue,
                    flag_select:flag_select,
                    channel_id:col_list.channelId, 
                    channel_name:col_list.channelName,
                    ttype:col_list.ttype,
                    ctype:col_list.ctype,
                    sort_order:col_list.sortOrder,
                    status:col_list.status
                })

            }
            
        }
        
    }
    onSelectTeacher = value => {
        if(value.key == ' ')
            value.key = 0
        this.setState({
            selectTeacher:value,
            teacherFetching: false,
            teacher_id:value.key
        });
    };
    fetchTeacher =value =>{
        this.setState({ teacherData: [], teacherFetching: true });
        this.props.actions.searchTeacher({
            keyword: value,
            resolved: (data)=>{
                const teacherData = data.data.map(ele => ({
                    text: ele.teacherName,
                    value: ele.teacherId,
                }))
                this.setState({ teacherData, teacherFetching: false })
            },
            rejected: (data)=>{
                this.setState({ teacherFetching: false })
                message.error(JSON.stringify(data))
            }
        })
    }
    onSelected = (value)=>{
        let flag = ''
        if(value == 1){
            flag = '/2/'
        }else{
            flag = ''
        }
        this.setState({
            flag:flag,
            flag_select:value
        })
    }
    onCheckBox = (checkValue)=>{
        let flag = '/'+checkValue.join('/')+'/';

        this.setState({
            flag:flag,
            checkValue:checkValue
        })
    }
    _onPublish = ()=>{
       
        const { 
            channel_id,
            channel_name,
            ttype,
            ctype,
            sort_order,
            status,
            flag,
            teacher_id,
        } = this.state
        if(!channel_name){
            message.info('请输入专栏名称')
            return;
        }
        // if(this.state.flag_select == 2&&(!flag||flag=='//')){
        //     message.info('请选择开放对象')
        //     return;
        // }
        if(sort_order > 99999){ message.info('排序不能大于99999'); return; }

        const {actions} = this.props;
        actions.publishChannel({
            channel_id,
            channel_name,
            ttype,
            ctype,
            sort_order,
            status,
            flag,
            teacher_id,
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
                    content:data,
                    onClose:()=>{
                        
                    }
                })
            }
        })
    }
    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 20 },
            },
        };
        const options = [
            { label: '直销员工', value: '1' },
            { label: '服务中心员工', value: '3'},
            { label: '店主', value: '4'},
            
            { label: '优惠顾客', value: '5' },
            { label: '初级经理', value: '6' },

            { label: '中级经理', value: '7' },
            { label: '客户总监', value: '8' },
            { label: '高级客户总监', value: '9' },
            { label: '资深客户总监及以上', value: 'GG' },
        ];
        const {view_mode, teacherData, selectTeacher,teacherFetching } = this.state
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={this.state.channel_id==0?'创建专栏':view_mode?'查看专栏':"修改专栏"}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="专栏名称">
                                            <Input
                                                disabled={view_mode}
                                                onChange={e=>{
                                                    this.setState({channel_name:e.target.value})
                                                }}
                                                value={this.state.channel_name}
                                                className="m_w400" placeholder=""/>
                                        </Form.Item>
                                        <Form.Item label="课程类型">
                                            <Select 
                                                disabled={view_mode||this.state.isEdit}
                                                onChange={val=>{
                                                   
                                                    if(val == 2||val ==3)
                                                        this.setState({ctype:val,ttype:1})
                                                    else
                                                        this.setState({ctype:val})
                                                }} value={this.state.ctype} className="m_w400">
                                                <Select.Option value={0}>视频课程</Select.Option>
                                                <Select.Option value={1}>音频课程</Select.Option>
                                                <Select.Option value={2}>直播课程</Select.Option>
                                                <Select.Option value={3}>图文课程</Select.Option>
                                            </Select>
                                            <div style={{color:'#8a8a8a',fontSize:'12px'}}>* 提交后，课程类型无法再次修改</div>
                                        </Form.Item>
                                        <Form.Item label="关联讲师">
                                            <Select
                                                disabled={view_mode}
                                                showSearch
                                                labelInValue
                                                placeholder="搜索讲师"
                                                notFoundContent={teacherFetching ? <Spin size="small" /> : <Empty />}
                                                filterOption={false}
                                                onSearch={this.fetchTeacher}
                                                onChange={this.onSelectTeacher}
                                                style={{ width: '400px' }}
                                                value={selectTeacher}
                                            >
                                                <Option key={0}>无</Option>
                                                {teacherData.map(d => (
                                                    <Option key={d.value}>{d.text}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="课程布局">
                                            <Radio.Group disabled={view_mode} onChange={e=>{this.setState({ttype:e.target.value})}} name="radiogroup" value={this.state.ttype}>
                                                {this.state.ctype == 0||this.state.ctype == 1?
                                                <Radio value={0}>
                                                    <img src={layout_1} style={{ height: '40%' }} />
                                                </Radio>
                                                :null}
                                                <Radio value={1}>
                                                    <img src={layout_2} style={{ height: '40%' }} />
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {/* <Form.Item label="排序">
                                            <InputNumber disabled={view_mode} onChange={val=>{
                                                if(val !== ''&&!isNaN(val)){
                                                    val = Math.round(val)
                                                    if(val<0) val=0
                                                    this.setState({sort_order:val})
                                                }
                                            }} value={this.state.sort_order} min={0} max={99999}/>
                                        </Form.Item> */}
                                        {/*
                                        <Form.Item label="开放对象">
                                            <Select 
                                                className="m_w400"
                                                value={this.state.flag_select}
                                                onChange={this.onSelected}>
                                                <Option value={0}>全部用户</Option>
                                                <Option value={1}>新用户</Option>
                                                <Option value={2}>有标签用户</Option>
                                            </Select>
                                            {this.state.flag_select == 2?
                                                <div>
                                                    <Checkbox.Group 
                                                        options={options} 
                                                        value={this.state.checkValue} 
                                                        onChange={this.onCheckBox} 
                                                        className='mt_20'
                                                    />
                                                </div>
                                            :null}
                                        </Form.Item>
                                        */}
                                        <Form.Item label="是否启用">
                                            <Switch disabled={view_mode} checked={this.state.status==1?true:false} onChange={(checked)=>{
                                                if(checked)
                                                    this.setState({status:1})
                                                else
                                                    this.setState({status:0})
                                            }}/>
                                        </Form.Item>
                                        {/*<Form.Item label="自动推送">
                                            <Switch />
                                            </Form.Item>
                                            <Form.Item label="推送周期">
                                                <Select className="m_w400" defaultValue={1}>
                                                    <Option value={0}>每日</Option>
                                                    <Option value={1}>每周</Option>
                                                    <Option value={2}>半月</Option>
                                                    <Option value={3}>每月</Option>
                                                </Select>
                                            </Form.Item>
                                        */}
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button disabled={view_mode} onClick={this._onPublish} type="primary">提交</Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
            </div>
        )
    }
}


const LayoutComponent =EditReCourse;
const mapStateToProps = state => {
    return {
        col_list:state.course.col_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});