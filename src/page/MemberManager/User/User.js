import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { TreeSelect, Tabs, Tooltip, Table as TableAntd, Tag, Empty, Form, Modal, Spin, Select, DatePicker, Menu, Dropdown, Icon, message, Input, Pagination, InputNumber, Checkbox, Popover, Upload } from 'antd';
import { Link, NavLink } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import EditableTagGroup from '../../../components/EditableTagGroup';
import debounce from 'lodash/debounce';
import connectComponent from '../../../util/connect';
import { getSearch } from '../../../util/tool';
import { Chart, Interval, Tooltip as BTooltip, Axis, Slider } from 'bizcharts';
import AntdOssUpload from '../../../components/AntdOssUpload'
import moment from 'moment';
import _ from 'lodash'
import { Button, Popconfirm } from '../../../components/BtnComponent'
import { number } from 'prop-types';
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;
const { Search } = Input;
const _status = ['禁用', '正常'];
const { Option } = Select;
const flag_arg = {
    '1': '直销员',
    '2': '新用户',
    '3': '服务中心员工',
    '4': '店主',
    '5': '客户代表',
    '6': '客户经理',
    '7': '中级经理',
    '8': '客户总监',
    '9': '高级客户总监',
    'GG': '资深客户总监',
}

class User extends Component {

    user_list = []
    page_total = 0
    page_current = 0
    page_size = 15

    constructor(props) {
        super(props);
    }
    state = {
        view: false,
        edit: false,

        showEditCoin: false,
        fetching: false,
        // selectData: [
        //     { text: '未认证(单选)', value: '0' },
        //     { text: '已认证(单选)', value: '-1' },

        //     { text: '正卡(单选)', value: '-2' },
        //     { text: '副卡(单选)', value: '-3' },

        //     { text: '直销员', value: '1' },
        //     { text: '服务中心员工', value: '3' },
        //     { text: '店主', value: '4' },
        //     { text: '讲师', value: '2' },

        //     { text: '优惠顾客', value: '5' },
        //     { text: '初级经理', value: '6' },
        //     { text: '中级经理', value: '7' },
        //     { text: '客户总监', value: '8' },
        //     { text: '高级客户总监', value: '19' },
        //     { text: '资深客户总监及以上', value: 'GG' },

        // ],
        selectValue: undefined,
        page_current: 0,

        user_id: '',
        type: 0,
        integral: '',

        levels: '',
        flag: '',
        status: '',
        keywords: '',
        userId: '',
        regTimeBegin: '',
        regTimeEnd: '',
        atime: null,
        loading: false,
        coupon_user_id: 0,
        coupon_page: 0,
        coupon_pageSize: 20,
        coupon_keyword: '',
        coupon_data_list: [],
        coupon_total: 0,
        coupon_panel: false,

        statTime: [moment().subtract(6, 'months'), moment()],
        stat_loading: false,
        title: [],
        info: [],
        result: [],
        show: false,
        stat_user_id: 0,
        ids: [],
        showsetting: false,
        num: 0,
        excelFileList: [],
        showsettings: false,
        is_agent_chair:-1,
        is_agent_employee:-1,
        is_seller:-1,
        is_teacher:-1,
        selectValues:[],
        isLoading:false,
    };

    onEdit(index, path) {
        this.props.history.push({
            pathname: path + index,
            state: { page: this.page_current }
        })
    }
    onAdd = () => {
        this.props.history.push({
            pathname: '/user-manager/add-user/add',
            state: {
                page_current: this.page_current
            }
        })
    }

    componentWillMount() {
        this.page_current = getSearch('page') || 0
        this.page_size = getSearch('pageSize') || 15
        const flag = getSearch('id_level') || ''
        const status = getSearch('status') || ''
        const keywords = getSearch('keywords') || ''
        const userId = getSearch('userId') || ''
        const selectValue = flag ? flag.split(',') : []
        const levels = parseInt(getSearch('levels')) || ''
        // const regTimeEnd = getSearch('regTimeEnd')||''
        // const regTimeBegin = getSearch('regTimeBegin')||''
        this.setState({
            levels, flag, status, keywords, userId, selectValue
        }, this.getUser)
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.user_list !== this.props.user_list) {

            if (nextProps.user_list['data']) {
                if (nextProps.user_list.data['length'] == 0) {
                    message.info('暂时没有数据')
                }
                this.user_list = nextProps.user_list.data;
                this.page_total = nextProps.user_list.total
                this.page_current = nextProps.user_list.page
                this.total = nextProps.user_list.total

                this.setState({ page_current: this.page_current })
            } else {
                message.info('数据错误')
                this.user_list = []
                this.page_total = 0
                this.page_current = 1
                this.total = 0
            }
        }

    }
    getUser = () => {
        const { levels, regTimeBegin, regTimeEnd, userId, keywords, status, flag ,is_teacher,is_agent_chair,is_agent_employee,is_seller} = this.state
        this.props.actions.getUser({
            levels,
            regTimeBegin: regTimeBegin,
            regTimeEnd: regTimeEnd,
            userId: userId,
            keywords: keywords,
            page: this.page_current,
            status: status,
            pageSize: this.page_size,
            id_level: flag,
            is_agent_chair,
            is_seller,
            is_teacher,
            is_agent_employee
        });
    }
    _onPage = (val) => {
        this.page_current = val - 1
        this.getUser()
    }
    _onChangeUserCoin = () => {
        const { user_id, type, integral } = this.state
        const { actions } = this.props

        if (!integral) {
            message.info('金币数量不能为空或0')
            return
        }
        if (integral > 200000) {
            message.info('金币数量不能为大于20万')
            return
        }
        actions.chargeUserCoin({
            user_id, type, integral,
            resolved: (data) => {
                this.hideEditCoin()

                this.getUser()
                message.success('操作成功')
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    showEditCoin(id) {
        this.setState({
            user_id: id,
            type: 0,
            integral: 0,
            showEditCoin: true
        })
    }
    hideEditCoin = () => {
        this.setState({
            showEditCoin: false
        })
    }
    _onFilter = () => {
        const { userId, selectValue } = this.state
        if (userId) {
            this.setState({ atime: null, regTimeBegin: '', regTimeEnd: '' })

        }
        this.page_current = 0
        this.getUser()
    }
    _onFilterStatus = (val) => {
        this.setState({
            userId: "",
            status: val
        })
    }
    _onUnAuth(user_id) {
        if (!user_id) return;
        const { actions } = this.props;

        actions.unAuthUser({
            user_id,
            resolved: (data) => {
                message.success("操作成功")

                this.getUser();
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onDelete(user_id) {
        if (!user_id) return;
        const { actions } = this.props;
        actions.removeUser({
            user_id,
            resolved: (data) => {
                message.success("操作成功")
                this.getUser()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onStatus(user_id) {
        if (!user_id) return;
        const { actions } = this.props;

        actions.updateUser({
            user_id,
            resolved: (data) => {
                message.success("操作成功")
                this.getUser()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onSearch = (val) => {
        this.page_current = 0
        this.setState({
            keywords: val
        }, () => {
            this.getUser();
        })
    }

    onSelectTag = value => {
        //如果选中的标签中包含单选标签，则返回
        if (value.indexOf('0') > -1 && value.length > 1) return
        if (value.indexOf('-1') > -1 && value.length > 1) return
        if (value.indexOf('-2') > -1 && value.length > 1) return
        if (value.indexOf('-3') > -1 && value.length > 1) return

        //
        if (value.indexOf('0') > -1) value = ['0']
        if (value.indexOf('-1') > -1) value = ['-1']
        if (value.indexOf('-2') > -1) value = ['-2']
        if (value.indexOf('-3') > -1) value = ['-3']

        this.setState({
            userId: "",
            selectValue: value,
            fetching: false,
            flag: value.join(',')
        });
    };
    getCouponYC = () => {
        this.setState({ loading: true })
        const {
            coupon_page,
            coupon_pageSize,
            coupon_keyword,
        } = this.state
        this.props.actions.getCouponYC({
            page: coupon_page,
            pageSize: coupon_pageSize,
            keyword: coupon_keyword,
            resolved: (res) => {
                console.log(res)
                const { page, total, data } = res
                if (Array.isArray(data)) {
                    this.setState({
                        coupon_data_list: data,
                        coupon_page: page,
                        coupon_total: total,
                    })
                }
                this.setState({ loading: false })
            },
            rejected: () => {
                this.setState({ loading: false })
            }
        })
    }
    releaseCoupon = (code) => {
        const { coupon_user_id } = this.state
        this.props.actions.releaseCouponYC({
            code, user_id: coupon_user_id,
            resolved: (res) => {
                message.success('提交成功')
                this.setState({ coupon_panel: false })
            },
            rejected: () => {

            }
        })
    }
    getUserInfoStat = () => {
        this.setState({ stat_loading: true })
        let { statTime, stat_user_id } = this.state
        let begin_time = '', end_time = ''
        if (statTime && Array.isArray(statTime) && statTime.length == 2) {
            begin_time = statTime[0].format('YYYY-MM-DD')
            end_time = statTime[1].format('YYYY-MM-DD')
        }
        this.props.actions.getUserInfoStat({
            user_id: stat_user_id, begin_time, end_time,
            resolved: (res) => {
                // 学习时长  金币余额  评论数  评论总获赞

                let title = []
                Object.keys(res).map(ele => {
                    title.push(ele)
                    let _tmp = []
                    res[ele].map((_ele, index) => {
                        Object.keys(_ele).map(__ele => {
                            _tmp.push({ type: __ele, value: _ele[__ele] })
                            // _tmp.push({ type:index+'月',value:index+Math.floor(Math.random()*100) })
                        })
                    })
                    res[ele].data = _tmp
                })
                this.setState({ show: true, title, result: res, stat_loading: false })
            },
            rejected: () => {
                this.setState({ stat_loading: false })
            }
        })
    }
    onChange = value => {
        console.log(value);
        if(this.state.selectValue.length>value.length){
            this.setState({
                selectValue: value,
                flag: value.join(',')
            })
        }
        if (value.includes('a') || value.includes('b') || value.includes('c') || value.includes('d')) {
            return;
        }
        let { selectValue } = this.state
        if (selectValue.includes('5') == false && selectValue.includes('6') == false && selectValue.includes('7') == false && selectValue.includes('8') == false && selectValue.includes('9') == false && selectValue.includes('GG') == false) {
            if (value.includes('5') || value.includes('6') || value.includes('7') || value.includes('8') || value.includes('9') || value.includes('GG')) {
                this.setState({
                    selectValue: value,
                    flag: value.join(',')
                })
            }
        }

        if (selectValue.includes('-1') == false && selectValue.includes('0') == false) {
            if (value.includes('-1') || value.includes('0')) {
                this.setState({
                    selectValue: value,
                    flag: value.join(',')
                })
            }
        }

        if (selectValue.includes('-2') == false && selectValue.includes('-3') == false) {
            if (value.includes('-2') || value.includes('-3'))
                this.setState({
                    selectValue: value,
                    flag: value.join(',')
                })
        }
        if (value.includes('1') == false && value.includes('3') == false && value.includes('4') == false && value.includes('2') == false) {
        } else {
            this.setState({
                selectValue: value,
                flag: value.join(',')
            })
        }



    };
    _onChecked = (val, ele) => {
        const { ids } = this.state
        if (ele.target.checked == true) {
            let id = ids.concat(val.userId)
            this.setState({
                ids: id
            })
        } else {
            let _id = ids.filter(item => item != val.userId)
            this.setState({
                ids: _id
            })
        }
    }
    onOk = () => {
        const { ids, num } = this.state
        const { actions } = this.props
        actions.postPoint({
            user_id: ids.toString(),
            integral: num,
            type: 0,
            resolved: (res) => {
                message.success({
                    content: '添加成功'
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
                this.setState({
                    ids: [],
                    num: 0,
                    showsetting: false
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onOkeys = () => {
        this.setState({
            isLoading:true
        })
        let file = this.exel.getValue()
        const{actions}=this.props
        if(!file){
            message.info({content:'请上传文件'});
            this.setState({
                isLoading:false
            })
            return;
        }
        actions.importUsers({
            file_url:file,
            resolved:(res)=>{
                message.success({
                    content:'导入成功'
                })
                this.setState({
                    isLoading:false,
                    showsettings:false
                })
                this.getUser()
            },
            rejected:(err)=>{
                console.log(err)
                this.setState({
                    isLoading:false,
                })
            }
        })
    }
    mapTxt = {
        'duration': '学习时长',
        'commentNum': '评论数',
        'commentUpNum': '评论总获赞',
        'balance': '金币余额',
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
        const { fetching, selectData, selectValue } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader className="flex j_space_between align_items">
                                <div className="flex row align_items f_grow_1">
                                    <span style={{ flexShrink: 0 }}>&nbsp;&nbsp;搜索&nbsp;&nbsp;</span>
                                    <Search
                                        placeholder="请输入搜索内容"
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                        value={this.state.keywords}
                                        onChange={(e) => {
                                            this.setState({ userId: "", keywords: e.target.value })
                                        }}
                                    />&nbsp;
                        <Select value={this.state.status} onChange={this._onFilterStatus}>
                                        <Select.Option value="">
                                            全部用户
                            </Select.Option>
                                        <Select.Option value="1">
                                            正常用户
                            </Select.Option>
                                        <Select.Option value="0">
                                            禁用用户
                            </Select.Option>
                                    </Select>&nbsp;

                        <Input.Group compact>
                                        <Input disabled style={{ width: '55px' }} value={"标签"} />
                                        {/* <Select
                                            mode="multiple"
                                            value={selectValue}
                                            placeholder="选择用户身份"
                                            notFoundContent={fetching ? <Spin size="small" /> : null}
                                            filterOption={false}
                                            onChange={this.onSelectTag}
                                            style={{ minWidth: '150px' }}
                                        >
                                            {selectData.map(d => (
                                                <Select.Option key={d.value}>{d.text}</Select.Option>
                                            ))}
                                        </Select> */}
                                        <TreeSelect
                                            showSearch
                                            style={{ minWidth: '200px' }}
                                            value={selectValue}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="选择用户身份"
                                            allowClear
                                            multiple
                                            treeDefaultExpandAll
                                            onChange={this.onChange}
                                        >
                                            <TreeNode value='a' title="级别标签(单选)">
                                                <TreeNode value="5" title="优惠顾客" />
                                                <TreeNode value="6" title="初级经理" />
                                                <TreeNode value="7" title="中级经理" />
                                                <TreeNode value="8" title="客户总监" />
                                                <TreeNode value="9" title="高级客户总监" />
                                                <TreeNode value="GG" title="资深客户总监" />
                                            </TreeNode>
                                            <TreeNode value='b' title="正副标签(单选)">
                                                <TreeNode value="-2" title='正卡' />
                                                <TreeNode value="-3" title='副卡' />
                                            </TreeNode>
                                            <TreeNode value='c' title="认证标签(单选)">
                                                <TreeNode value="-1" title='认证' />
                                                <TreeNode value="0" title='未认证' />
                                            </TreeNode>
                                            {/* <TreeNode value='d' title="身份标签(多选)">
                                                <TreeNode value="1" title='直销员' />
                                                <TreeNode value="3" title='店主' />
                                                <TreeNode value="4" title='服务中心员工' />
                                                <TreeNode value="2" title='讲师' />
                                            </TreeNode> */}
                                        </TreeSelect>
                                    </Input.Group>&nbsp;
                                    <Input.Group compact>
                                    <Input disabled style={{ width: '55px' }} value={"身份"} />
                                    <Select
                                                    mode="multiple"
                                                    labelInValue
                                                    value={this.state.selectValues}
                                                    placeholder="身份标签"
                                                    // notFoundContent={this.state.fetching ? <Spin size="small" /> : <Empty />}
                                                    filterOption={false}
                                                    // onSearch={this.onSearchTag}
                                                    onChange={(value)=>{
                                                        console.log(value)
                                                        this.setState({
                                                            selectValues:value,
                                                        },()=>{
                                                            console.log('aaa')
                                                            if(this.state.selectValues.filter(item=>item.key=='is_seller').length>0){
                                                                console.log('111')
                                                                this.setState({
                                                                    is_seller:1
                                                                })
                                                            }else{
                                                                this.setState({
                                                                    is_seller:-1
                                                                })
                                                            }
                                                            if(this.state.selectValues.filter(item=>item.key=='is_agent_chair').length>0){
                                                                console.log('222')
                                                                this.setState({
                                                                    is_agent_chair:1
                                                                })
                                                            }else{
                                                                this.setState({
                                                                    is_agent_chair:-1
                                                                })
                                                            }
                                                            if(this.state.selectValues.filter(item=>item.key=='is_agent_employee').length>0){
                                                                console.log('333')
                                                                this.setState({
                                                                    is_agent_employee:1
                                                                })
                                                            }else{
                                                                this.setState({
                                                                    is_agent_employee:-1
                                                                })
                                                            }
                                                            if(this.state.selectValues.filter(item=>item.key=='is_teacher').length>0){
                                                                console.log('444')
                                                                this.setState({
                                                                    is_teacher:1
                                                                })
                                                            }else{
                                                                this.setState({
                                                                    is_teacher:-1
                                                                })
                                                            }
                                                        })
                                                    }}
                                                    style={{ width: '300px' }}
                                                >
                                                  <Option key={'is_seller'}>直销员</Option>
                                                  <Option key={'is_agent_chair'}>店主</Option>
                                                  <Option key={'is_agent_employee'}>服务中心员工</Option>
                                                  <Option key={'is_teacher'}>讲师</Option>
                                                </Select>
                                    </Input.Group>
                        <Input.Group compact>
                                        <Input disabled style={{ width: '65px' }} value={"用户ID"} />
                                        <InputNumber min={0} value={this.state.userId == 0 || !this.state.userId ? "" : this.state.userId} onChange={(val) => {
                                            let userId = 0
                                            if (!isNaN(val)) {
                                                userId = Math.floor(val)
                                            }
                                            this.setState({
                                                userId: userId,
                                                selectValue: [],
                                                keywords: "",
                                                status: "",
                                                id_level: "",
                                                atime: null,
                                                levels: '',
                                                regTimeBegin: '',
                                                regTimeEnd: ''
                                            })
                                        }}></InputNumber>
                                    </Input.Group>&nbsp;
                        <Input.Group compact>
                                        <Input disabled style={{ width: '60px' }} value={"等级"} />
                                        <Select style={{ minWidth: '80px' }} value={this.state.levels} onChange={levels => this.setState({ levels })}>
                                            <Select.Option value={''}>全部</Select.Option>
                                            <Select.Option value={1}>LV1</Select.Option>
                                            <Select.Option value={2}>LV2</Select.Option>
                                            <Select.Option value={3}>LV3</Select.Option>
                                            <Select.Option value={4}>LV4</Select.Option>
                                            <Select.Option value={5}>LV5</Select.Option>
                                            <Select.Option value={6}>LV6</Select.Option>
                                            <Select.Option value={7}>LV7</Select.Option>
                                            <Select.Option value={8}>LV8</Select.Option>
                                        </Select>
                                    </Input.Group>&nbsp;
                        <RangePicker value={this.state.atime} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }} style={{ maxWidth: 320 }} locale={locale} onChange={(date, dateString) => {
                                        console.log(dateString)
                                        this.setState({ userId: '', atime: date, regTimeBegin: dateString[0], regTimeEnd: dateString[1] })
                                    }} />&nbsp;
                        <Button onClick={this._onFilter}>筛选</Button>
                                </div>
                                <div className="flex f_row f_nowrap align_items">
                                    <Button onClick={() => {
                                        this.setState({ showsettings: true })
                                    }}>导入</Button>
                                    <Button onClick={() => { if (this.state.ids.length == 0) { message.info({ content: '请选择用户' }) } else { this.setState({ showsetting: true }) } }}>导入游学积分</Button>
                                    <Button value='user/add' onClick={this.onAdd}>添加用户</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Table responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th>多选</th>
                                            <th>ID</th>
                                            <th>用户账号</th>
                                            <th>认证状态</th>
                                            <th>昵称</th>
                                            <th>VIP卡号</th>
                                            <th>工号</th>
                                            <th>用户等级</th>
                                            <th>可用金币</th>
                                            <th>电话</th>
                                            <th>用户身份</th>
                                            <th>状态</th>
                                            <th>注册时间</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.user_list.length == 0 ?
                                            <tr>
                                                <td colSpan={12}>
                                                    <Empty className="mt_20 mb_10" description='暂时没有数据'></Empty>
                                                </td>
                                            </tr>
                                            : this.user_list.map((ele, index) =>
                                                <tr key={index + 'user'}>
                                                    <td style={{ width: '50px' }}>
                                                        <Checkbox onChange={this._onChecked.bind(this, ele)} />
                                                    </td>
                                                    <td>{ele.userId}</td>
                                                    <td>
                                                        {ele.mobile}
                                                    </td>
                                                    <td>{ele.isAuth == 0 ? '未认证' : '已认证'}</td>
                                                    <td>
                                                        <div className="video_content">
                                                            <Tooltip title={ele.nickname}>
                                                                {ele.nickname}
                                                            </Tooltip>
                                                        </div>
                                                    </td>
                                                    <td>{ele.sn}</td>
                                                    <td>{ele.workSn}</td>
                                                    <td>LV{ele.level}</td>
                                                    <td>{ele.integral+ele.rintegral}</td>
                                                    <td>{ele.mobile}</td>
                                                    <td>
                                                        {ele.isSeller == 1 ? <Tag>直销员</Tag> : null}
                                                        {ele.isAgentChair == 1 ? <Tag>店主</Tag> : null}
                                                        {ele.isAgentEmployee == 1 ? <Tag>服务中心员工</Tag> : null}
                                                        {ele.idLevel ? <Tag>{flag_arg[ele.idLevel]}</Tag> : null}
                                                    </td>
                                                    <td>{_status[ele.status]}</td>
                                                    <td>{moment.unix(ele.regTime).format('YYYY-MM-DD HH:mm')}</td>
                                                    <td>
                                                        <div>
                                                            <Button value='user/view' onClick={() => {
                                                                this.props.history.push('/member-manager/user-view/' + ele.userId)
                                                            }} className='m_2' type="" size={'small'}>查看</Button>
                                                            <Button
                                                                value='user/edit'
                                                                className='m_2'
                                                                onClick={this.onEdit.bind(this, index, '/member-manager/user-info/')}
                                                                size={'small'}
                                                            >
                                                                修改
                                </Button>
                                                            <Button value='user/edit' className='m_2' onClick={this._onStatus.bind(this, ele.userId)} size={'small'}>{ele.status == 1 ? '禁用' : '解禁'}</Button>
                                                            <Button value='user/edit' className='m_2' onClick={this.showEditCoin.bind(this, ele.userId)} size={'small'}>金币修改</Button>
                                                            <Popconfirm
                                                                value='user/del'
                                                                className='m_2'
                                                                title="确定删除吗？"
                                                                okText="确定"
                                                                cancelText="取消"
                                                                onConfirm={this._onDelete.bind(this, ele.userId)}
                                                            >
                                                                <Button type="danger" ghost size={'small'}>删除</Button>
                                                            </Popconfirm>

                                                            {ele.isAuth == 1 ?
                                                                <Popconfirm
                                                                    value='user/edit'
                                                                    className='m_2'
                                                                    title="确定取消认证吗？"
                                                                    okText="确定"
                                                                    cancelText="取消"
                                                                    onConfirm={this._onUnAuth.bind(this, ele.userId)}
                                                                >
                                                                    <Button size={'small'}>取消认证</Button>
                                                                </Popconfirm>
                                                                : null}
                                                            <Button value='user/edit' className='m_2' onClick={() => {
                                                                this.setState({
                                                                    coupon_panel: true,
                                                                    coupon_user_id: ele.userId
                                                                }, this.getCouponYC)
                                                            }} size={'small'}>
                                                                分发优惠码
                                                            </Button>
                                                            <Button value='user/view' onClick={() => {
                                                                this.setState({ show: true, stat_user_id: ele.userId }, this.getUserInfoStat)
                                                            }} size='small' className='m_2'>数据统计</Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </Table>
                                <div>
                                    <Pagination showTotal={() => ('总共' + this.page_total + '条')} showQuickJumper onChange={this._onPage} pageSize={this.page_size} current={this.page_current + 1} total={this.page_total} />

                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                </Row>
                <Modal
                    title="金币修改"
                    visible={this.state.showEditCoin}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideEditCoin}
                    bodyStyle={{ padding: "10px" }}
                    onOk={this._onChangeUserCoin}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="操作">
                            <Select
                                value={this.state.type}
                                onChange={val => {
                                    this.setState({ type: val })
                                }}
                            >
                                <Select.Option value={0}>增加金币</Select.Option>
                                <Select.Option value={1}>减少金币</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="金币数量">
                            <InputNumber
                                min={0} max={800000}
                                style={{ width: '100%' }}
                                value={this.state.integral}
                                onChange={val => {
                                    if (val !== '' && !isNaN(val)) {
                                        val = Math.round(val)
                                        if (val < 0) val = 0
                                        this.setState({
                                            integral: val
                                        })
                                    }
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    visible={this.state.coupon_panel}
                    maskClosable={false}
                    title={'分发油葱商城优惠码'}
                    onCancel={() => this.setState({ coupon_panel: false })}
                    footer={null}
                >
                    <Spin spinning={this.state.loading}>
                        <Input.Search className='m_2' onSearch={() => {
                            this.setState({ coupon_page: 0 }, this.getCouponYC)
                        }} value={this.state.coupon_keyword} onChange={e => {
                            this.setState({ coupon_keyword: e.target.value })
                        }} />
                        <TableAntd
                            rowKey='couponId'
                            columns={this.col}
                            dataSource={this.state.coupon_data_list}
                            pagination={false}
                            pagination={{
                                pageSize: this.state.coupon_pageSize,
                                current: this.state.coupon_page + 1,
                                total: this.state.coupon_total,
                                onChange: (val) => this.setState({ coupon_page: val - 1 }, this.getCouponYC)
                            }}
                        >
                        </TableAntd>
                    </Spin>
                </Modal>
                <Modal width={800} visible={this.state.show} maskClosable={true} footer={null} onCancel={() => { this.setState({ show: false }) }}>
                    <Spin spinning={this.state.stat_loading}>
                        <DatePicker.RangePicker
                            showTime={false}
                            allowClear={true}
                            value={this.state.statTime}
                            locale={locale} onChange={(date) => {
                                this.setState({
                                    statTime: date,
                                }, this.getUserInfoStat)
                            }} />
                        <Tabs defaultActiveKey="0_tabs" size={{ size: 'small' }}>
                            {
                                this.state.title.map((ele, index) => (
                                    <Tabs.TabPane tab={this.mapTxt[ele]} key={index + '_tabs'}>
                                        <Chart height={400} autoFit data={this.state.result[ele]['data'] || []} interactions={['active-region']} padding={[40, 0, 100, 0]} >
                                            <Axis name="value" visible={false} />
                                            <Interval
                                                label={["value", { style: { fill: '#535353' } }]}
                                                color='type'
                                                position="type*value"
                                            />
                                            <BTooltip shared />
                                        </Chart>
                                    </Tabs.TabPane>
                                ))
                            }
                        </Tabs>
                    </Spin>
                </Modal>
                <Modal
                    zIndex={90}
                    title="添加游学积分"
                    visible={this.state.showsetting}
                    okText="添加"
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
                        <Form.Item label='游学积分'>
                            <InputNumber value={this.state.num} onChange={(e) => { this.setState({ num: e }) }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="导入用户"
                    visible={this.state.showsettings}
                    okText="添加"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    confirmLoading={this.state.isLoading}
                    onCancel={() => {
                        this.setState({ showsettings: false })
                    }}
                    onOk={this.onOkeys}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Popover placement="top" trigger="hover" content={
                        <div style={{ color: "#8e8e8e" }}>
                            <p>
                                * 导入前，请先下载Excel模板文件<br />
                                                        * 仅支持xlsx格式的文件<br />
                                                        * 模版中的商品价格和排序请取整数 <br />
                                                        * 模版中的图片地址必须是小程序允许的域名地址 <br />
                                                        * 模版中的商品图片请正确地放到对应的格子里 <br />
                            </p>
                            <a target='_black' href=' https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/b0891ce0-e653-4f86-8956-a4cda78449a8.xlsx'>
                                Excel导入模板下载
                                                    </a>
                        </div>
                    }>
                    </Popover>
                    <span className='pdf_tip'>
                            <div style={{ color: "#8e8e8e" }}>
                                <p>
                                    * 导入前，请先下载Excel模板文件<br />
                             * 仅支持xlsx格式的文件<br />

                                </p>
                                <a target='_black' href=' https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/b0891ce0-e653-4f86-8956-a4cda78449a8.xlsx'>
                                    Excel导入模板下载
                                             </a>
                            </div>
                        </span>
                    <AntdOssUpload listType='text' accept='application/xlsx' value={this.state.excelFileList} ref={ref => this.exel = ref}></AntdOssUpload>
                </Modal>
            </div>
        );
    }
    col = [
        { title: 'ID', dataIndex: 'couponId', key: 'couponId' },
        { title: '优惠券码', dataIndex: 'code', key: 'code' },
        // {title:'发布时间',render:(item,ele)=>{
        //     if(ele.pubTime)
        //         return moment.unix(ele.pubTime).format('YYYY-MM-DD')
        //     else
        //         return '暂无'
        // }},
        // {title:'绑定时间',render:(item,ele)=>{
        //     if(ele.bindTime)
        //         return moment.unix(ele.bindTime).format('YYYY-MM-DD')
        //     else
        //         return '暂无'
        // }},
        {
            title: '已绑定用户ID', render: (item, ele) => {
                if (ele.userId)
                    return ele.userId
                else
                    return '暂无'
            }
        },
        {
            title: '操作', render: (item, ele) => {
                if (ele.userId)
                    return null
                return <div>
                    <Popconfirm
                        title='确定发放优惠码吗？'
                        okText='确定'
                        cancelText='取消'
                        onConfirm={this.releaseCoupon.bind(this, ele.code)}
                    >
                        <Button size='small' className='m_2'>发放</Button>
                    </Popconfirm>
                </div>
            }
        }
    ]
}

const LayoutComponent = User;
const mapStateToProps = state => {
    return {
        user_list: state.user.user_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
