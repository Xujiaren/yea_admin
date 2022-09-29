import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Form, Checkbox, Modal, Tabs, Card as CardAntd, Affix, Pagination, Tag, Menu, Dropdown, Button, Icon, message, Input, InputNumber, Select } from 'antd';

import connectComponent from '../../util/connect';

import _ from 'lodash'

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

class ExerciseManager extends Component {

    state = {
        edit: true,
        view: true,
        hot_index: [],

        h_search_val: '',

        hot_tags: [],
        inputVisible: false,
        inputValue: '',
        times: '',
        activeTab: '1',
        selectValue: [],
        paperList: [],
        list:[],
        category_id:-1,
        keyword:'',
    };
    sen_list = {}
    page_total = 0
    page_current = 0
    page_size = 10

    onRefuse = () => {
        message.info('当前管理员无此权限');
    }

    componentDidMount() {
        const { actions } = this.props
        //actions.getSen()
        this.getPaper()
        this.getPks()
    }
    getPaper = () => {
        const { actions } = this.props
        actions.getPkpaper({
            category_id: this.state.category_id,
            keyword: this.state.keyword,
            page: this.page_current,
            pageSize: this.page_size,
            status: 0,
            resolved: (res) => {
                this.page_total=res.total
                this.setState({
                    paperList: res.data
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getPks=()=>{
        const{actions}=this.props
        actions.getPkcategories({
            keyword:this.state.keyword,
            resolved:(res)=>{
                this.setState({
                    list:res
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    componentWillMount() {

    }
    componentWillReceiveProps(n_props) {
        const { user } = n_props
        if (_.indexOf(user.rule, '*') >= 0 || _.indexOf(user.rule, 'bandfilter/view') >= 0) {
            this.setState({ view: true })
        }
        if (_.indexOf(user.rule, '*') >= 0 || _.indexOf(user.rule, 'bandfilter/edit') >= 0) {
            this.setState({ edit: true })
        }
        if (n_props.sen_list !== this.props.sen_list) {
            let hot_tags = n_props.sen_list.sensitive_list
            let times = n_props.sen_list.sensitive_times
            this.setState({
                hot_tags,
                times
            })
        }
    }
    onSearchTag = value => {
        this.input_value = value;
        //this.fetchTag(value);
    }
    onSelectTag = value => {
        this.setState({
            selectValue: value,
            fetching: false,
        });
    };
    _onPage = (val) => {

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
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <CardAntd title="趣味探索题库管理" >

                            <CardAntd className='mb_10' bodyStyle={{ paddingTop: '8px', paddingBottom: '8px' }}>
                                <div className='flex j_space_between align_items'>
                                    <div className="flex row align_items f_grow_1">
                                        <Select
                                            onChange={val => {
                                                this.setState({
                                                    category_id:val
                                                })
                                            }}
                                            className="m_w400"
                                            style={{width:'120px'}}
                                            value={this.state.category_id}
                                        >
                                            <Select.Option value={-1}>全部</Select.Option>
                                            {
                                                this.state.list.map(item=>{
                                                    return(
                                                        <Select.Option value={item.categoryId}>{item.categoryName}</Select.Option>
                                                    )
                                                })
                                            }
                                        </Select>&nbsp;
                                        <Search
                                            placeholder="搜索"
                                            onChange={(e)=>{
                                                this.setState({
                                                    keyword:e.target.value
                                                })
                                            }}
                                            style={{ maxWidth: 200 }}
                                            onSearch={null}
                                            value={this.state.keyword}
                                        >
                                        </Search>&nbsp;
                                        <Button onClick={this.getPaper}>搜索</Button>
                                    </div>
                                    <div className="flex f_row f_nowrap align_items">
                                        <Input.Group compact>

                                            <Button>
                                                排位赛规则
                                            </Button>
                                            <Button onClick={() => {
                                                this.props.history.push('/rankPaper-manager/check')
                                            }}>
                                                审核题目
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    this.props.history.push('/rankPaper-manager/add')
                                                }}
                                            >
                                                发布题目
                                            </Button>
                                            <Button>
                                                导入题目
                                            </Button>
                                            <Button>
                                                导出题目
                                            </Button>
                                        </Input.Group>
                                    </div>
                                </div>
                            </CardAntd>
                            <div className='min_height'>
                                <div className='flex align_items mb_10'>
                                    <Button size='small' className='m_2'>全选</Button>
                                    <Button size='small' className='m_2' onClick={() => {
                                        this.setState({ showHotTag: true })
                                    }}>添加标签</Button>
                                    <Button size='small' className='m_2'>删除</Button>
                                </div>
                                {
                                    this.state.paperList.map(item => {
                                        let opt = JSON.parse(item.options)
                                        return (
                                            <Card className='mb_10 card_style' style={{ minHeight: '100px' }}>
                                                <CardHeader style={{ verticalAlign: 'center' }}>
                                                    <Checkbox className='mr_10' />单选题：{item.title}
                                                </CardHeader>
                                                <CardBody style={{ padding: 0 }}>
                                                    <div className='question pad_10 flex align_start'>
                                                        <div>A.{opt[0]}</div>
                                                        <div className='be_green'>B.{opt[1]}</div>
                                                        <div>C.{opt[2]}</div>
                                                        <div>D.{opt[3]}</div>
                                                    </div>
                                                    {/* <div className='pad_l20 pad_r20 pad_b10 flex align_start'>
                                                        解析：健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查
                                                    </div> */}
                                                </CardBody>
                                                <CardHeader className="flex j_space_between">
                                                    <div>
                                                        分类：<Tag>文化</Tag>
                                                        来源：<Tag>平台</Tag>
                                                        标签：<Tag>排位赛&nbsp;&nbsp;专题赛</Tag>
                                                    </div>
                                                    <div>
                                                        <Button
                                                            onClick={() => {
                                                                this.props.history.push('/rankPaper-manager/edit/'+item.topicId)
                                                            }}
                                                        >修改</Button>&nbsp;
                                                        <Button>删除</Button>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        )
                                    })
                                }

                                {/* <Card className='mb_10 card_style' style={{minHeight:'100px'}}>
                            <CardHeader style={{verticalAlign:'center'}}>
                                <Checkbox className='mr_10'/>多选题：下列有关正确的说法是
                            </CardHeader>
                            <CardBody style={{padding:0}}>
                                <div className='question pad_10 flex align_start'>
                                    <div>A.药品药品药品药健康知识大调查品药品药品</div>
                                    <div className='be_green'>B.健康知识大调查健康知识大调查健康知识大调查</div>
                                    <div>C.健康知识大调查</div>
                                    <div>D.健康知识大调查健康知识大调查健康知识大调查</div>
                                </div>
                                <div className='pad_l20 pad_r20 pad_b10 flex align_start'>
                                    解析：健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查
                                </div>
                            </CardBody>
                            <CardHeader className="flex j_space_between">
                                <div>
                                    分类：<Tag>专题赛1</Tag>
                                    来源：<Tag>平台</Tag>
                                    标签：<Tag>排位赛&nbsp;&nbsp;专题赛</Tag>
                                </div>
                                <div>
                                    <Button 
                                        onClick={()=>{
                                            this.props.history.push('/static/paper-list/edit')
                                        }}
                                    >修改</Button>&nbsp;
                                    <Button>删除</Button>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className='mb_10 card_style' style={{minHeight:'100px'}}>
                            <CardHeader style={{verticalAlign:'center'}}>
                                <Checkbox className='mr_10'/>判断题：下列有关正确的说法是
                            </CardHeader>
                            <CardBody style={{padding:0}}>
                                <div className='question pad_10 flex align_start'>
                                    <div>A.正确</div>
                                    <div className='be_green'>B.错误</div>
                                </div>
                                <div className='pad_l20 pad_r20 pad_b10 flex align_start'>
                                    解析：健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查
                                </div>
                            </CardBody>
                            <CardHeader className="flex j_space_between">
                                <div>
                                    分类：<Tag>专题赛1</Tag>
                                    来源：<Tag>平台</Tag>
                                    标签：<Tag>排位赛&nbsp;&nbsp;专题赛</Tag>
                                </div>
                                <div>
                                    <Button 
                                        onClick={()=>{
                                            this.props.history.push('/static/paper-list/edit')
                                        }}
                                    >修改</Button>&nbsp;
                                    <Button>删除</Button>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className='mb_10 card_style' style={{minHeight:'100px'}}>
                            <CardHeader style={{verticalAlign:'center'}}>
                                <Checkbox className='mr_10'/>多选题：下列关于基本医疗保险品目录的说法,错误的是
                            </CardHeader>
                            <CardBody style={{padding:0}}>
                                <div className='pad_l5'>
                                    <a>
                                        <img 
                                            onClick={()=>{
                                                this.setState({showImgPanel:true})
                                            }} 
                                            className="head-example-img" 
                                            style={{
                                                width:200,
                                                height:100,
                                                padding:5
                                            }}
                                        />
                                    </a>
                                </div>
                                <div className='question pad_10 flex align_start'>
                                    <div>A.选项1</div>
                                    <div className='be_green'>B.选项2</div>
                                    <div>C.选项3</div>
                                    <div>D.选项4</div>
                                </div>
                                <div className='pad_l20 pad_r20 pad_b10 flex align_start'>
                                    解析：健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查
                                </div>
                            </CardBody>
                            <CardHeader className="flex j_space_between">
                                <div>
                                    分类：<Tag>专题赛1</Tag>
                                    来源：<Tag>平台</Tag>
                                    标签：<Tag>排位赛&nbsp;&nbsp;专题赛</Tag>
                                </div>
                                <div>
                                    <Button 
                                        onClick={()=>{
                                            this.props.history.push('/static/paper-list/edit')
                                        }}
                                    >修改</Button>&nbsp;
                                    <Button>删除</Button>
                                </div>
                            </CardHeader>
                        </Card> */}
                            </div>
                            <Card className='mb_10 card_style'>
                                <CardHeader className="flex j_space_between align_items">
                                    <Pagination showTotal={(total) => "总共"+this.page_total+"条"} pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                                </CardHeader>
                            </Card>

                        </CardAntd>
                    </Col>
                </Row>
                <Modal zIndex={6001} visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>

                <Modal
                    zIndex={90}
                    title="标签选择"
                    visible={this.state.showHotTag}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ showHotTag: false })
                    }}
                    onOk={null}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='标签设置'>
                            <Input.Group compact>
                                <Select
                                    mode="multiple"
                                    labelInValue
                                    value={this.state.selectValue}
                                    placeholder="搜索标签"

                                    filterOption={false}
                                    onSearch={this.onSearchTag}
                                    onChange={this.onSelectTag}
                                    style={{ width: '300px' }}
                                >
                                    <Option key={0}>排位赛</Option>
                                    <Option key={1}>专题赛1</Option>
                                    <Option key={2}>专题赛2</Option>
                                </Select>
                                {/*
                                <Button onClick={this.addTmp}>添加</Button>
                                */}
                            </Input.Group>
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        );
    }
}

const LayoutComponent = ExerciseManager;
const mapStateToProps = state => {
    return {
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
