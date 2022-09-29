import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { InputNumber, message, Tag, Icon, Radio, Spin, Form, Empty, Select, Modal, Table, Card, PageHeader, Input } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import { Button, Popconfirm } from '../../components/BtnComponent'

class TeacherLevel extends Component {
    state = {
        view_mode: false,
        levelName: '',
        num: '',
        level_id: 0,
        data_list: [],
        showsetting: false,
        num:0
    }
    img = {
        getValue: () => ''
    }
    page_current = 0
    page_size = 10
    page_total = 0

    componentWillMount() {
        this.getTeacherLevel()
        this.Num()
    }
    Num=()=>{
        const{actions}=this.props
        actions.getNum('course_learn_reward','reward')
    }
    componentWillReceiveProps(n_props) {
        if(n_props.num!==this.props.num){
            this.setState({
                num:parseInt(n_props.num.filter(item=>item.keyy=='course_learn_reward')[0].val)
            })
        }
    }
    getTeacherLevel = () => {
        this.setState({ loading: true })
        // const {level_id} = this.state
        this.props.actions.getTeacherLevel({
            page: this.page_current,
            pageSize: this.page_size,
            level_id: 0,
            resolved: (data) => {
                console.log(data)
                if (data instanceof Array) {
                    this.setState({ data_list: data })
                }
                this.setState({ loading: false })
            },
            rejected: () => {
                this.setState({ loading: false })
            }
        })
    }
    onOk=()=>{
        const{num}=this.state
        const{actions}=this.props
        actions.publishNum({
            keyy:'course_learn_reward',
            section:'reward',
            val:num.toString(),
            resolved:(res)=>{
                message.success({
                    content:'设置成功'
                })
                this.setState({
                    showsetting:false
                })
                this.Num()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    render() {
        const { view_mode } = this.state
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
        return (
            <div className="animated fadeIn">
                {/* <Button type='primary' style={{position:'absolute',left:'105em',top:'9em',zIndex:'22'}}>金币设置</Button> */}
                <Card title='讲师权益管理'
                // extra={<Button value='teacherPro/add' onClick={()=>{
                //     this.setState({
                //         level_id:0,
                //         levelName:'',
                //         fileList:[],
                //         editPanel:true,
                //     })
                // }}>创建老师权益</Button>}
                >
                    <Button type='primary' style={{ marginBottom: '20px', float: 'right',zIndex:'22' }} onClick={()=>{this.setState({showsetting:true})}}>金币设置</Button>
                    <Table
                        columns={this.col}
                        rowKey='levelId'
                        dataSource={this.state.data_list}
                        pagination={false}
                    />
                </Card>

                <Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal title={this.state.level_id == 0 ? '创建老师等级' : '修改'} onOk={this.onPublish} visible={this.state.editPanel} onCancel={() => this.setState({ editPanel: false })}>
                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                        <Form.Item label='等级名称'>
                            <Input value={this.state.levelName} onChange={e => { this.setState({ levelName: e.target.value }) }}></Input>
                        </Form.Item>
                        <Form.Item label='等级图标'>
                            <AntdOssUpload
                                actions={this.props.actions}
                                tip='上传图片'
                                value={this.state.fileList}
                                accept='image/*'
                                ref={ref => this.img = ref}
                            ></AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='兑换课程数'>
                            <InputNumber min={0} max={888} value={this.state.exchange} onChange={(exchange) => {
                                this.setState({ exchange })
                            }}></InputNumber>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="金币设置"
                    visible={this.state.showsetting}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsetting: false })
                    }}
                    onOk={this.onOk}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='金币数'>
                            <InputNumber value={this.state.num} onChange={(e)=>{this.setState({num:e})}}/>
                            <span style={{color:'red',marginLeft:'5px'}}>用户观看讲师的课程(免费／收费)都会给讲师金币</span>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    actionTeacherLevel(ele) {

    }
    onPublish = () => {
        const { levelName, exchange, level_id } = this.state
        let level_img = ''
        if (this.img) {
            level_img = this.img.getValue()
        }

        if (!levelName) { message.info('请输入等级名称'); return; }
        if (!level_img) { message.info('请上传等级标识'); return; }

        this.props.actions.setTeacherLevel({
            level_img: level_img,
            level_name: levelName,
            level_id: level_id,
            exchange: exchange,
            resolved: (data) => {
                message.success('提交成功')
                this.getTeacherLevel()
                this.setState({ editPanel: false })
            },
            rejected: () => {
            }
        })
    }
    col = [
        { dataIndex: 'levelId', title: 'ID', key: 'levleId' },
        { dataIndex: 'levelName', title: '等级名称', key: 'levelName' },
        {
            dataIndex: 'levelImg', title: '标识', key: 'levelImg', render: (item, ele) => {
                return <img src={ele.levelImg} className='head-example-img' onClick={() => { this.setState({ previewImage: ele.levelImg, showImgPanel: true }) }}></img>
            }
        },
        { dataIndex: 'exchange', title: '兑换课程数', key: 'exchange' },
        {
            dataIndex: '', title: '操作', key: '', render: (item, ele) => {
                return (
                    <>
                        <Button value='teacherPro/edit' size='small' className='m_2' onClick={() => {
                            const fileList = [{ uid: 'uid', type: 'image/png', status: 'done', url: ele.levelImg }]
                            this.setState({
                                editPanel: true,
                                fileList,
                                level_id: ele.levelId,
                                levelName: ele.levelName,
                                exchange: ele.exchange
                            })
                        }}>修改</Button>
                        {/* <Popconfirm
                        value='teacherPro/del'
                        title='确定删除吗'
                        okText='确定'
                        cancelText='取消'
                        onConfirm={this.actionTeacherLevel.bind(this,ele)}
                    >
                        <Button size='small' className='m_2'>删除</Button>
                    </Popconfirm>
                     */}
                    </>
                )
            }
        },
    ]
}

const LayoutComponent = TeacherLevel;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        num:state.user.num
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
