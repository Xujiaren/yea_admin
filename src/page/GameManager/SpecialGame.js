import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { List, Avatar, Icon, Upload, Tag, Checkbox, Tabs, DatePicker, Popconfirm, message, Pagination, Switch, Modal, Form, Card, Select, Input, Button, Radio, InputNumber } from 'antd';
import { Link } from 'react-router-dom';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import config from '../../config/config';
import BraftEditor from 'braft-editor'
import Editor from '../../components/Editor'
import 'braft-editor/dist/index.css'
import PeopleType from '../../components/PersonType'
import AntdOssUpload from '../../components/AntdOssUpload'
import moment from 'moment';
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
class SpecialGame extends Component {
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
        keyword: '',
        previewImage: '',
        showImgPanel: false,
        showRefund: false,
        showEditPanel: false,
        showAddPanel: false,
        showPost: false,
        showPostView: false,
        fileList: [],
        fileList1: [
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
        ],
        matchList: [],
        rewardList: [],
        activeTab: '1',
        order: 1,
        sub: false,
        listItem: [{
            atype: 0,
            awardId: 0,
            awardName: "",
            awardNum: 0,
            beginRank: 0,
            endRank: 0,
            matchId: 0,
        }],
        giftType: 0,
        match_name: '',
        begin_time: '',
        end_time: '',
        beginTime: null,
        endTime: null,
        flag: '',
        total: 0,
        rankList: [],
        matchId: 0,
        itms:{},
        editorState:''
    };
    tag_list = [1, 2, 3, 4, 5, 6, 7, 8]
    page_total = 0
    page_current = 0
    page_size = 12




    onRefuse = () => {
        message.info('当前管理员无此权限');
    }

    _onPage = (val) => {

        const { actions } = this.props;
        let pathname = this.props.history.location.pathname
        let { keyword } = this.state
        this.props.history.replace(pathname + '?page=' + val)
        this.page_current = val - 1
        this.getPk()
    }
   
   
    componentWillMount() {
        const { actions } = this.props;
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page + 1
        }

        this.getPk()
    }
    getPk = () => {
        const { actions } = this.props
        actions.getPkMatch({
            page: this.page_current,
            pageSize: this.pageSize,
            mytype: 0,
            match_id: -1,
            resolved: (res) => {
                this.page_total = res.total
                this.setState({
                    matchList: res.data,
                    total: res.total
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
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
                tag_name: '健康大调查',
                ttype: tag_item.ttype
            })
        } else {
            this.setState({
                title: txt,
                isView: false,
                visible: true,

                status: 0,
                tag_id: '',
                tag_name: '',
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
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            showImgPanel: true,
        });
    };
    edit(order, sub) {
        this.setState({
            order,
            sub,
            showEditPanel: true,
        })
    }
    onCourseImgChange = ({ file, fileList, event }) => {
        console.log(fileList)
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList: fileList,
            course_img: img.join(',')
        })

    }
    onCourseImgChange1 = ({ file, fileList, event }) => {
        console.log(fileList)
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList1: fileList
        })

    }
    myUploadFn = (param) => {

        const serverURL = config.api + '/site/upload';
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        const successFn = (response) => {

            const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
            param.success({
                url: JSON.parse(xhr.responseText).resultBody,
                meta: {
                    // id: upLoadObject && upLoadObject.id,
                    // title: upLoadObject && upLoadObject.fileName,
                    // alt: upLoadObject && upLoadObject.fileName,
                    loop: false, // 指定音视频是否循环播放
                    autoPlay: false, // 指定音视频是否自动播放
                    controls: false, // 指定音视频是否显示控制栏
                    poster: '', // 指定视频播放器的封面
                }
            })
        };

        const progressFn = (event) => {
            param.progress(event.loaded / event.total * 100)

        };

        const errorFn = (response) => {
            param.error({
                msg: '上传出错！请重试'
            })
        };

        xhr.upload.addEventListener("progress", progressFn, false);
        xhr.addEventListener("load", successFn, false);
        xhr.addEventListener("error", errorFn, false);
        xhr.addEventListener("abort", errorFn, false);

        fd.append('file', param.file);

        xhr.open('POST', serverURL, true);
        xhr.withCredentials = true;
        xhr.send(fd)
    };
    getRewards = (val) => {
        const { actions } = this.props
        actions.getPkMatchReward({
            match_id: val.matchId,
            page: 0,
            pageSize: 100,
            resolved: (res) => {
                console.log(res, '???')
                this.setState({
                    rewardList: res.data
                })
                this.setState({ showList: true })
            },
            rejected: (err) => {
                console.log(err)
            }
        })

    }
    onOk = () => {
        const { actions } = this.props
        const { match_name, flag, begin_time, end_time } = this.state
        let match_img = this.img.getValue() || ''
        console.log(match_img, begin_time, end_time)
        actions.setPkMatch({
            begin_time: begin_time,
            end_time: end_time,
            match_img: match_img,
            match_name: match_name,
            flag: flag,
            match_id: 0,
            mtype: 0,
            rule: '',
            status: 0,
            resolved: (res) => {
                message.success({
                    content: '添加成功'
                })
                this.setState({
                    colPanel: false
                })
                this.getPk()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getRanks = (val) => {
        const { actions } = this.props
        actions.getPkMatchRank({
            match_id: val.matchId,
            page: 0,
            pageSize: 100,
            resolved: (res) => {
                this.setState({
                    rankList: res.data
                })
                this.setState({ rankPanel: true })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onEdits = (val) => {
        const { actions } = this.props
        actions.getPkMatchaward({
            match_id: val,
            resolved: (res) => {
                if (res.length > 0) {
                    this.setState({
                        listItem: res
                    })
                    if(res[0].atype==1){
                        this.setState({
                            giftType:1
                        })
                    }else{
                        this.setState({
                            giftType:0
                        })
                    }
                }
                this.setState({
                    matchId: val,
                    showEditPanel: true
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })

    }
    setAward=(ele)=>{
        const{actions}=this.props
        const{matchId,listItem,giftType}=this.state
        let list = []
        listItem.map(item=>{
            let obj = {
                atype:giftType,
                award_id: item.awardId||0,
                begin_rank: item.beginRank,
                end_rank: item.endRank,
                award_name: item.awardName||'',
                award_num: item.awardNum||0,
            }
            list = list.concat(obj)
        })
        
        let json = JSON.stringify(list)
        actions.setPkMatchReward({
            json:json,
            match_id:matchId,
            resolved:(res)=>{
                message.success({
                    content:'保存成功'
                })
                this.setState({
                    showEditPanel: false
                })   
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    onRules=(val)=>{
        this.setState({
            gameRulePanel: true,
            itms:val,
            editorState:val.rule
        })
    }
    setRule=()=>{
        const{actions}=this.props
        const{itms,editorState}=this.state
        const content = this.refs.editor.toHTML()
        actions.setPkMatch({
            begin_time: itms.beginTime,
            end_time: itms.endTime,
            match_img: itms.matchImg,
            match_name: itms.matchName,
            flag: itms.flag,
            match_id: itms.matchId,
            mtype: itms.mtype,
            rule: content,
            status: itms.status,
            resolved: (res) => {
                message.success({
                    content: '添加成功'
                })
                this.setState({
                    gameRulePanel: false
                })
                this.getPk()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    ondelete=(val)=>{
        this.props.actions.actionPkMatch({
            match_id:val,
            action:'delete',
            resolved:(res)=>{
                message.success({
                    content:'操作成功'
                })
                this.getPk()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    render() {
        const {
            status,
            tag_id,
            tag_name,
            ttype,
        } = this.state

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
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutPanel = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };
        const uploadButtonImg = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="专题赛管理">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>
                                        {/*<Search
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />&nbsp;
                                    <Button>搜索</Button>
                                    */}
                                    </div>
                                    <div>
                                        <Input.Group compact>
                                            {/* <Button onClick={() => {
                                                this.setState({
                                                    showAddPanel: true
                                                })
                                            }}>添加奖品</Button> */}
                                            <Button onClick={() => {
                                                this.setState({
                                                    colPanel: true
                                                })
                                            }}>添加专题</Button>
                                        </Input.Group>
                                    </div>
                                </div>
                                <Table responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th style={{ width: '160px' }}>专题名称</th>
                                            <th style={{ width: '90px' }}>图片</th>
                                            <th>专题周期</th>
                                            <th>题目数</th>
                                            <th>状态</th>

                                            <th style={{ width: '450px' }}>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.matchList.map(item => {
                                                let begin = moment.unix(item.beginTime).format('YYYY-MM-DD HH:mm')
                                                let end = moment.unix(item.endTime).format('YYYY-MM-DD HH:mm')
                                                let date = new Date().getTime()
                                                return (
                                                    <tr>
                                                        <td></td>
                                                        <td>{item.matchName}</td>
                                                        <td>
                                                            <a>
                                                                <img src={item.matchImg} onClick={this.showImgPanel.bind(this)} className="head-example-img" />
                                                            </a>
                                                        </td>
                                                        <td>{begin}-{end}</td>
                                                        <td>20</td>
                                                        <td>{date < item.beginTime * 1000 ? '未开始' : date >= item.beginTime * 1000 && date <= item.endTime * 1000 ? '进行中' : '已结束'}</td>
                                                        <td>
                                                            <div>

                                                                {/* <Button onClick={() => {
                                                                    this.setState({ showViewPanel: true })
                                                                }} type="primary" size={'small'} className='m_2'>查看奖品</Button> */}
                                                                <Button type="primary" size={'small'} className='m_2' onClick={this.getRanks.bind(this, item)}>查看排行</Button>
                                                                <Button type="primary" size={'small'} className='m_2' onClick={this.getRewards.bind(this, item)}>查看获奖名单</Button>
                                                                <Button onClick={this.onEdits.bind(this, item.matchId)} type="primary" size={'small'} className='m_2'>修改奖品</Button>

                                                                <Popconfirm
                                                                    okText="确定"
                                                                    cancelText='取消'
                                                                    title='确定删除吗？'
                                                                    onConfirm={this.ondelete.bind(this,this.state.matchId)}
                                                                >
                                                                    <Button type="primary" ghost size={'small'} className='m_2' onClick={()=>{
                                                                        this.setState({
                                                                            matchId:item.matchId
                                                                        })
                                                                    }}>删除</Button>
                                                                </Popconfirm>

                                                                <Button size={'small'} className='m_2' onClick={this.onRules.bind(this,item)}>规则</Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            <Pagination showTotal={(total) => '总共' + this.state.total + '条'} pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />

                        </Card>
                    </Col>
                </Row>

                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>

                <Modal
                    width={650}
                    title="添加实物奖品"
                    visible={this.state.showAddPanel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ showAddPanel: false })
                    }}
                    onOk={null}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout1}>
                        <Form.Item label='选择专题'>
                            <Select defaultValue={0}>
                                <Select.Option value={0}>脑王大赛</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label='奖品类型'>
                            <Radio.Group defaultValue={1} onChange={e => {
                                this.setState({ giftType: e.target.value })
                            }}>
                                <Radio value={1}>实物</Radio>
                            </Radio.Group>
                            {this.state.listItem.map((ele, index) => (
                                <div key={index + 'item'} className='flex align_items'>
                                    <span style={{ flexShrink: 0 }}>名次&nbsp;</span>
                                    <Select dropdownStyle={{ zIndex: 6003 }} style={{ width: '120px' }}>
                                        {this.state.listItem.map((_ele, _index) => (
                                            <Select.Option key={_index + '_item'} value={_index}>{_index + 1}</Select.Option>
                                        ))}
                                    </Select>&nbsp;
                                    <Select dropdownStyle={{ zIndex: 6003 }} style={{ width: '120px' }}>
                                        <Select.Option value={0}>1</Select.Option>
                                    </Select>
                                    &nbsp;&nbsp;&nbsp;
                                    <span style={{ flexShrink: 0 }}>{this.state.giftType == 0 ? '金币数' : '商品名'}&nbsp;</span>
                                    <Input style={{ flexGrow: 1 }} />
                                </div>
                            ))}
                            <Button type="dashed" style={{ minWidth: '10%' }} onClick={() => {
                                let { listItem } = this.state
                                listItem.push([])
                                this.setState({ listItem })
                            }}>
                                <Icon type="plus" /> 添加
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal

                    zIndex={6000}
                    title="修改"
                    visible={this.state.showEditPanel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ showEditPanel: false })
                    }}
                    // onOk={() => {
                    //     this.setState({ showEditPanel: false })
                    // }}
                    onOk={this.setAward}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    {/* <Form {...formItemLayout1}> */}
                        {/* <Form.Item label='专题'>
                            <Select defaultValue={0}>
                                <Select.Option value={0}>脑王大赛</Select.Option>
                            </Select>
                        </Form.Item> */}

                        <Form.Item label='奖品类型'>
                            <Radio.Group value={this.state.giftType} onChange={e => {
                                this.setState({ 
                                    giftType: e.target.value 
                                })
                                this.state.listItem.map((ele,index)=>{
                                    this.setState({
                                        listItem: this.state.listItem.map((itm, idx) => idx == index ? { ...itm, awardNum: 0 } : itm),
                                        listItem: this.state.listItem.map((itm, idx) => idx == index ? { ...itm, awardName: '' } : itm)
                                    })
                                    
                                })
                            }}>
                                <Radio value={0}>金币</Radio>
                                <Radio value={1}>实物</Radio>
                            </Radio.Group>
                            {this.state.listItem.map((ele, index) => (
                                <div key={index + 'item'} className='flex align_items'>
                                    <span style={{ flexShrink: 0 }}>名次&nbsp;</span>
                                    <InputNumber style={{ width: '120px' }} value={ele.beginRank} min={0} onChange={(e) => {
                                        this.setState({
                                            listItem: this.state.listItem.map((itm, idx) => idx == index ? { ...itm, beginRank: e } : itm)
                                        })
                                    }} />
                                    &nbsp;
                                    <InputNumber style={{ width: '120px' }} value={ele.endRank} min={0} onChange={(e) => {
                                        this.setState({
                                            listItem: this.state.listItem.map((itm, idx) => idx == index ? { ...itm, endRank: e } : itm)
                                        })
                                    }} />
                                    &nbsp;&nbsp;&nbsp;
                                    <span style={{ flexShrink: 0 }}>{this.state.giftType == 0 ? '金币数' : '商品名'}&nbsp;</span>
                                    {
                                        this.state.giftType == 0 ?
                                        <Input style={{ flexGrow: 1 }} value={ele.awardNum} onChange={(e) => {
                                            this.setState({
                                                listItem: this.state.listItem.map((itm, idx) => idx == index ? { ...itm, awardNum: e.target.value } : itm)
                                            })
                                        }} />
                                        :
                                        <Input style={{ flexGrow: 1 }} value={ele.awardName} onChange={(e) => {
                                            this.setState({
                                                listItem: this.state.listItem.map((itm, idx) => idx == index ? { ...itm, awardName: e.target.value } : itm)
                                            })
                                        }} />
                                    }
                                    {/* &nbsp;&nbsp;&nbsp;
                                    <Button onClick={this.setAward.bind(this,ele)}>保存</Button> */}
                                   
                                </div>
                            ))}
                            <Button type="dashed" style={{ minWidth: '10%' }} onClick={() => {
                                let { listItem } = this.state
                                listItem.push([])
                                this.setState({ listItem })
                            }}>
                                <Icon type="plus" /> 添加
                            </Button>
                        </Form.Item>
                    {/* </Form> */}
                </Modal>
                <Modal
                    zIndex={6000}
                    title="查看"
                    visible={this.state.showViewPanel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ showViewPanel: false })
                    }}
                    onOk={null}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout1}>
                        <Form.Item label='选择专题'>
                            <Select defaultValue={0} disabled>
                                <Select.Option value={0}>脑王大赛</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label='奖品类型'>
                            <Radio.Group defaultValue={0} onChange={e => {
                                this.setState({ giftType: e.target.value })
                            }}>
                                <Radio value={0}>金币</Radio>
                                <Radio value={1}>实物</Radio>
                            </Radio.Group>
                            {this.state.listItem.map((ele, index) => (
                                <div key={index + 'item'} className='flex align_items'>
                                    <span style={{ flexShrink: 0 }}>名次&nbsp;</span>
                                    <Select dropdownStyle={{ zIndex: 6003 }} style={{ width: '120px' }}>
                                        {this.state.listItem.map((_ele, _index) => (
                                            <Select.Option key={_index + '_item'} value={_index}>{_index + 1}</Select.Option>
                                        ))}
                                    </Select>&nbsp;
                                    <Select dropdownStyle={{ zIndex: 6003 }} style={{ width: '120px' }}>
                                        <Select.Option value={0}>1</Select.Option>
                                    </Select>
                                    &nbsp;&nbsp;&nbsp;
                                    <span style={{ flexShrink: 0 }}>{this.state.giftType == 0 ? '金币数' : '商品名'}&nbsp;</span>
                                    <Input style={{ flexGrow: 1 }} />
                                </div>
                            ))}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={6000}
                    width={800}
                    title='获奖名单'
                    visible={this.state.showList}
                    closable={true}
                    maskClosable={false}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showList: false })
                    }}
                    bodyStyle={{ padding: "25px", paddingTop: '25px' }}
                >
                    <Table responsive size="" className="v_middle">
                        <thead>
                            <tr>
                                {/* <th>专题名称</th> */}
                                <th>用户名</th>
                                <th>手机号</th>
                                <th>名次</th>
                                <th>奖品</th>
                                <th>地址</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        {
                            this.state.rewardList.length > 0 ?
                                <tbody>
                                    {
                                        this.state.rewardList.map(item => {
                                            return (
                                                <tr>
                                                    {/* <td>
                                                        {item.matchName}
                                                    </td> */}
                                                    <td>
                                                        {item.realname}
                                                    </td>
                                                    <td>
                                                        {item.mobile}
                                                    </td>
                                                    <td>
                                                        第一名
                                                    </td>
                                                    <td>
                                                        自行车
                                                    </td>
                                                    <td>
                                                        {item.address}
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => {
                                                            this.setState({ showPost: true })
                                                        }} size='small'>邮寄</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                                : null
                        }

                    </Table>
                </Modal>
                {/* <Modal
                    zIndex={6000}
                    width={800}
                    title='金币获奖名单'
                    visible={this.state.showListCoin}
                    closable={true}
                    maskClosable={false}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showListCoin: false })
                    }}
                    bodyStyle={{ padding: "25px", paddingTop: '25px' }}
                >
                    <Table responsive size="" className="v_middle">
                        <thead>
                            <tr>
                                <th>专题名称</th>
                                <th>用户名</th>
                                <th>手机号</th>
                                <th>名次</th>
                                <th>奖品</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    脑王大赛
                                </td>
                                <td>
                                    李雯
                                </td>
                                <td>
                                    13569788890
                                </td>
                                <td>
                                    第一名
                                </td>
                                <td>
                                    20金币
                                </td>
                                <td>
                                    <Button onClick={() => {
                                        this.setState({ showCoin: true })
                                    }} size='small'>发金币</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal> */}
                <Modal
                    zIndex={6002}
                    title="发金币"
                    visible={this.state.showCoin}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ showCoin: false })
                    }}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="奖励金币">
                            <Input placeholder='填写数量' />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={6001}
                    title="物流单号回填"
                    visible={this.state.showPost}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ showPost: false })
                    }}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="产品名称">
                            <Input disabled value={this.state.itemName} />
                        </Form.Item>
                        <Form.Item label="产品图">
                            <a>
                                <img onClick={() => {
                                    this.setState({ showImgPanel: true })
                                }} className="head-example-img" />
                            </a>
                        </Form.Item>
                        <Form.Item label="收件人信息">
                            <Input disabled value={this.state.realname} />
                        </Form.Item>
                        <Form.Item label="收件人地址">
                            <Input disabled value={this.state.address} />
                        </Form.Item>
                        <Form.Item label="联系方式">
                            <Input disabled value={this.state.mobile} />
                        </Form.Item>
                        <Form.Item label="物流单号">
                            <Input
                                placeholder="请输入单号"
                                value={this.state.ship_sn}
                                onChange={e => {
                                    this.setState({
                                        ship_sn: e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="添加专题"
                    visible={this.state.colPanel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ colPanel: false })
                    }}
                    onOk={this.onOk}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='专题名称'>
                            <Input
                                onChange={(e) => {
                                    this.setState({
                                        match_name: e.target.value
                                    })
                                }}
                                value={this.state.match_name}
                                placeholder=''
                                defaultValue=''
                            />
                        </Form.Item>
                        <Form.Item label="图片">
                            <AntdOssUpload
                                actions={this.props.actions}
                                accept="image/*"
                                listType="picture-card"
                                value={this.state.fileList}
                                ref={ref => this.img = ref}
                            >
                            </AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='活动周期'>
                            <DatePicker
                                key='t_5'
                                // disabledDate={this.disabledDate}
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
                                // disabledDate={this.disabledDate}
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
                        </Form.Item>
                        <Form.Item label="发布对象">
                            <PeopleType></PeopleType>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="修改专题"
                    visible={this.state.colPanelEdit}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ colPanelEdit: false })
                    }}
                    onOk={null}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='专题名称'>
                            <Input
                                onChange={(e) => {

                                }}
                                placeholder=''
                                defaultValue='脑王大赛 第三季'
                            />
                        </Form.Item>
                        <Form.Item label="图片">
                            <AntdOssUpload
                                actions={this.props.actions}
                                accept="image/*"
                                listType="picture-card"
                                value={this.state.fileList}
                                ref={ref => this.img = ref}
                            >
                            </AntdOssUpload>
                        </Form.Item>
                        <Form.Item label='活动周期'>
                            <DatePicker.RangePicker locale={locale}></DatePicker.RangePicker>
                        </Form.Item>
                        <Form.Item label="发布对象">
                            <PeopleType></PeopleType>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title='查看排行'
                    visible={this.state.rankPanel}
                    okText="确定"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ rankPanel: false })
                    }}
                    onOk={null}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Card type='inner' >
                        <List
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={this.state.rankList}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        style={{ flex: '0 1' }}
                                        avatar={
                                            <Avatar src={item.avater} style={{ background: '#bebebe' }} style={{ fontSize: '32px' }}></Avatar>
                                        }
                                    />
                                    <div style={{ flex: '1 1' }}>{item.nickname}&nbsp;&nbsp;&nbsp;&nbsp;分数&nbsp;{item.score}</div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Modal>
                <Modal
                    width={600}
                    title="规则"
                    visible={this.state.gameRulePanel}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({
                            gameRulePanel: false
                        })
                    }}
                    onOk={this.setRule}
                    bodyStyle={{ padding: "10px" }}
                >
                    {/* <BraftEditor
                        style={{ border: "1px solid #eaeaea" }}
                        value={this.state.editorState}
                        onChange={this.handleEditorChange}
                        contentStyle={{ height: '400px' }}
                        media={{ uploadFn: this.myUploadFn }}
                    /> */}
                     <Editor content={this.state.editorState} ref='editor' actions={this.props.actions}></Editor>
                </Modal>
            </div>
        )
    }
}
const LayoutComponent = SpecialGame;
const mapStateToProps = state => {
    return {
        tag_list: state.course.tag_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
