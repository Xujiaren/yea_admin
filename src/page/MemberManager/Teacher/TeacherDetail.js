import React, { Component } from 'react';
import { Badge, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Tag, Empty, Modal,Table as TableAntd, Upload, Avatar, Card, Select, Tabs, PageHeader, DatePicker, Menu, Dropdown, Button, Icon, message, Input, Pagination, Descriptions } from 'antd';
import { Link, NavLink } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import connectComponent from '../../../util/connect';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
        message.error('图片文件需小于 1MB!');
    }
    return isJpgOrPng && isLt2M;
}

class AddTeacher extends Component {

    teacher_info = { user: { avatar: '' } }

    state = {
        loading: false,
        previewVisible: false,
        fileList: [],
        previewImage: '',
        avatar: '',
        tab: '0',
        live: [],
        underline: [],
        other: [],
        teacher_id: 0,
        teacher_level_log:[]
    };
    componentWillReceiveProps(nextProps) {

        if (nextProps.teacher_info !== this.props.teacher_info) {
            this.teacher_info = nextProps.teacher_info
            let imgs = this.teacher_info.imgs
            this.setState({
                live: this.teacher_info.courses.filter(item => item.ctype == 100),
                underline: this.teacher_info.courses.filter(item => item.ctype == 101),
                other: this.teacher_info.courses.filter(item => item.ctype != 100 && item.ctype != 101),
            })
            let _img = []
            let avatar = ''
            if (this.teacher_info.user == null) {

            } else {
                avatar = this.teacher_info.user['avatar']
            }

            this.setState({ avatar })

            if (imgs.length > 0) {

                imgs.map((ele, idx) => {
                    _img.push({ uid: idx, name: 'img' + idx, status: 'done', url: ele.fpath })
                })
                this.setState({
                    fileList: _img
                })
            }
        }
    }
    onRemove = () => {
        return false
    }
    componentDidMount() {
        const teacher_id = this.props.match.params.id;
        const { actions } = this.props;
        this.setState({ teacher_id: parseInt(teacher_id) })
        actions.getTeacherInfo(teacher_id)
        actions.getTeacherSheng({
            teacherId:parseInt(teacher_id),
            resolved:(res)=>{
                if(res.length>0){
                    this.setState({
                        teacher_level_log:res
                    })
                }
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    handleCancelModal = () => this.setState({ previewVisible: false });
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    onDelete = (val) => {
        console.log(val)
        this.props.actions.removeCourse({
            course_id: val.courseId,
            resolved: (res) => {
                message.success({ content: '删除成功' })
                setTimeout(() => {
                    this.props.actions.getTeacherInfo(this.state.teacher_id)
                }, 1000);

            },
            rejected: (err) => {

            }
        })
    }

    render() {
        const uploadButton = (txt) => (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{txt}</div>
            </div>
        );
        const uploadButtonImg = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );

        return (
            <div className="animated fadeIn">
                <Card>
                    <CardBody className="pad_0">
                        <PageHeader
                            className="pad_0"
                            ghost={false}
                            onBack={() => window.history.back()}
                            title=""
                            subTitle="讲师详情"
                            extra={[

                            ]}
                        >
                            <Card type="inner" title="基本信息">
                                <div className="flex f_row mb_10">
                                    <span>
                                        <Avatar shape="disc" size={60} src={this.state.avatar} />
                                        <div className="text_center mt_10">讲师头像</div>
                                    </span>
                                    <span className="ml_20">
                                        <Avatar shape="disc" size={60} src={this.teacher_info.teacherImg} />
                                        <div className="text_center mt_10">推荐位头像</div>
                                    </span>
                                </div>
                                <Descriptions size="small" column={4}>
                                    <Descriptions.Item label="名字">
                                        <Tag>{this.teacher_info.teacherName}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="手机号码">
                                        <Tag>{this.teacher_info.mobile}</Tag>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="性别">
                                        <Tag>{this.teacher_info.sex == 0 ? '男' : '女'}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="当前等级">
                                        <Tag>
                                            {this.teacher_info.level == 0 ? '讲师' : this.teacher_info.level == 1 ? '初级' : this.teacher_info.level == 2 ? '中级' : '高级'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="最高等级">
                                        <Tag>
                                            {this.teacher_info.teacherHlevel == 0 ? '初级' : this.teacher_info.teacherHlevel == 1 ? '中级' : this.teacher_info.teacherHlevel == 2 ? '高级' : '无'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="卡号">
                                        <Tag>
                                            {this.teacher_info.sn ? this.teacher_info.sn : '无'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="工号">
                                        <Tag>
                                            {this.teacher_info.workSn ? this.teacher_info.workSn : '无'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="正副卡标识">
                                        {
                                            this.teacher_info.user?
                                            <Tag>{this.teacher_info.user.isAuth ? (this.teacher_info.user.isPrimary == 1 ? '正卡' : '副卡') : '无'}</Tag>
                                            :<Tag>无</Tag>
                                        }      
                                        </Descriptions.Item>
                                    <Descriptions.Item label="总打赏">
                                        <Tag>
                                            {this.teacher_info.totalIntegral ? this.teacher_info.totalIntegral : '无'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="授课数量">
                                        <Tag>
                                            {this.teacher_info.courseNum ? this.teacher_info.courseNum : '无'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="授课课时">
                                        <Tag>
                                            {this.teacher_info.newScore ? this.teacher_info.newScore : '无'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="满意度">
                                        <Tag>
                                            {this.teacher_info.satis ? this.teacher_info.satis : '无'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="新课数">
                                        <Tag>
                                            {this.teacher_info.newCourse ? this.teacher_info.newCourse : '无'}
                                        </Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                                {/*
                            <Descriptions>
                                <Descriptions.Item label="聘用时间">
                                    <RangePicker disabled defaultValue={[moment('2019-06-06', 'YYYY-MM-DD'), moment('2020-06-06', 'YYYY-MM-DD')]} style={{ maxWidth: 250 }} locale={locale}/>
                                </Descriptions.Item>
                            </Descriptions>
                            */}
                                <Descriptions>
                                    <Descriptions.Item label="讲师头衔">
                                        <Tag>{this.teacher_info.honor}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="积分">
                                        <Tag>{this.teacher_info.user ? this.teacher_info.user.integral : ''}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="注册时间">
                                        <Tag>{this.teacher_info.user ? moment.unix(this.teacher_info.user.regTime).format('YYYY-MM-DD HH:mm:ss') : ''}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="聘期">
                                        <Tag>{this.teacher_info.beginTime?moment.unix(this.teacher_info.beginTime).format('YYYY-MM-DD HH:mm:ss'):null} 至 {this.teacher_info.endTime?moment.unix(this.teacher_info.endTime).format('YYYY-MM-DD HH:mm:ss'):'不限期'}</Tag>
                                    </Descriptions.Item>
                                    {console.log(this.teacher_info, '???')}
                                    <Descriptions.Item label="讲师类型">
                                        {
                                            this.teacher_info.wtype == 0 ?
                                                <Tag>无</Tag>
                                                : this.teacher_info.wtype == 1 ?
                                                    <Tag>经销商讲师</Tag>
                                                    : this.teacher_info.wtype == 2 ?
                                                        <Tag>外部讲师</Tag>
                                                        : this.teacher_info.wtype == 3 ?
                                                            <Tag>内部讲师</Tag>
                                                            : null
                                        }

                                    </Descriptions.Item>
                                </Descriptions>
                                <div>
                                    <div className="mb_10">讲师展示页：</div>
                                    <Upload
                                        disabled
                                        listType="picture-card"
                                        fileList={this.state.fileList}
                                        onPreview={this.handlePreview}
                                        onRemove={this.onRemove}
                                    >
                                        {this.state.fileList.length == 0 ? '暂时为空' : null}
                                    </Upload>
                                </div>
                                <hr />
                                <div>
                                    <div className="pad_b10">讲师介绍</div>
                                    <TextArea rows={8} value={this.teacher_info.content} disabled />
                                </div>
                            </Card>
                            <Card type="inner" className="mt_20" title="升降级记录">
                                <TableAntd size='small' dataSource={this.state.teacher_level_log} columns={this.level_log_col} rowKey={'levelHistoryId'} tableLayout={'fixed'} size={'middle'} pagination={{
                                    showQuickJumper: true,
                                    showTotal: (total) => '总共' + total + '条'
                                }} />
                            </Card>
                            <Card type="inner" className="mt_20" title="数据统计">
                                <Descriptions>
                                    <Descriptions.Item label="粉丝">
                                        {this.teacher_info.follow}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="课程数量">
                                        {this.teacher_info.courseNum}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="总浏览量">
                                        {this.teacher_info.hit}
                                    </Descriptions.Item>
                                </Descriptions>
                                <hr />
                                <div>
                                    <div className="pad_b10">课程列表</div>
                                    <Tabs activeKey={this.state.tab} onChange={val => {
                                        let pathname = this.props.history.location.pathname
                                        this.setState({ tab: val })
                                        this.props.history.replace(pathname + '?tab=' + val)
                                    }}>
                                        <TabPane tab="直播" key="0">
                                            <Table hover responsive size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>序号</th>
                                                        <th>课程名称</th>
                                                        <th>满意度</th>
                                                        <th>课时</th>
                                                        <th>操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.live && this.state.live.length > 0 ? this.state.live.map((_ele, index) =>
                                                        <tr key={index + 't_course'}>
                                                            <td>{index + 1}</td>
                                                            <td>{_ele.courseName}</td>
                                                            <td>{_ele.score.toFixed(2)}</td>
                                                            <td>{_ele.hour}</td>
                                                            <td>
                                                                <Button onClick={this.onDelete.bind(this, _ele)}>删除</Button>
                                                            </td>
                                                        </tr>
                                                    ) :
                                                        <tr>
                                                            <td colSpan={3}>
                                                                <Empty className="mt_10" description="暂时没有数据" />
                                                            </td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                        </TabPane>
                                        <TabPane tab="线下课程" key="1">
                                            <Table hover responsive size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>序号</th>
                                                        <th>课程名称</th>
                                                        <th>满意度</th>
                                                        <th>课时</th>
                                                        <th>操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.underline && this.state.underline.length > 0 ? this.state.underline.map((_ele, index) =>
                                                        <tr key={index + 't_course'}>
                                                            <td>{index + 1}</td>
                                                            <td>{_ele.courseName}</td>
                                                            <td>{_ele.score.toFixed(2)}</td>
                                                            <td>{_ele.hour}</td>
                                                            <td>
                                                                <Button onClick={this.onDelete.bind(this, _ele)}>删除</Button>
                                                            </td>
                                                        </tr>
                                                    ) :
                                                        <tr>
                                                            <td colSpan={3}>q
                                                                <Empty className="mt_10" description="暂时没有数据" />
                                                            </td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                        </TabPane>
                                        <TabPane tab="线上课" key="2">
                                            <Table hover responsive size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>序号</th>
                                                        <th>课程名称</th>
                                                        <th>价格</th>
                                                        <th>购买人数</th>
                                                        <th>浏览量</th>
                                                        <th>满意度</th>
                                                        <th>课时</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.other && this.state.other.length > 0 ? this.state.other.map((_ele, index) =>
                                                        <tr key={index + 't_course'}>
                                                            <td>{index + 1}</td>
                                                            <td>{_ele.courseName}</td>
                                                            <td>
                                                                {
                                                                    _ele.integral && !_ele.courseCash ?
                                                                        <div>{_ele.integral}金币</div>
                                                                        : null
                                                                }
                                                                {
                                                                    _ele.courseCash && !_ele.integral ?
                                                                        <div>¥{_ele.courseCash}</div>
                                                                        : null
                                                                }
                                                                {
                                                                    !_ele.courseCash && !_ele.integral ?
                                                                        <div>免费</div>
                                                                        : null
                                                                }
                                                                {
                                                                    _ele.courseCash && _ele.integral ?
                                                                        <div>{_ele.integral}金币+¥{_ele.courseCash}</div>
                                                                        : null
                                                                }
                                                            </td>
                                                            <td>{_ele.buyCourseNum}</td>
                                                            <td>{_ele.hit}</td>
                                                            <td>{_ele.score.toFixed(2)}</td>
                                                            <td>{_ele.hour}</td>
                                                        </tr>
                                                    ) :
                                                        <tr>
                                                            <td colSpan={3}>
                                                                <Empty className="mt_10" description="暂时没有数据" />
                                                            </td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                        </TabPane>
                                    </Tabs>

                                </div>
                            </Card>
                        </PageHeader>
                    </CardBody>
                </Card>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        );
    }
    level_log_col = [
        { title: 'ID', dataIndex: "levelHistoryId" },
        { title: '用户昵称', dataIndex: "nickname", },
        { title: '升降级', dataIndex: "actionType", render: (item, ele) => ele.actionType == 6 ? "降级" : "升级" },
        {
            title: '旧等级', dataIndex: "idLevelAfter"
        },
        {
            title: '新等级', dataIndex: "idLevelLatest"
        },
        { title: '升降级时间', dataIndex: "actionTime", render: (item, ele) => moment.unix(ele.actionTime).format('YYYY-MM-DD HH:mm') },
        // { title:'升降级时间',dataIndex:"pubTime",render:(item,ele)=>moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm') },
    ]
}


const LayoutComponent = AddTeacher;
const mapStateToProps = state => {
    return {
        teacher_info: state.teacher.teacher_info
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
