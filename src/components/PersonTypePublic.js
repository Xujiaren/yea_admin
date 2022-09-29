import React from "react";
import { Empty,Spin,Table as TableAntd, Checkbox, Icon, Upload, Modal, Form, Card, Select, Input, Button, message } from 'antd';
import moment from 'moment'
import AntdOssUpload from './AntdOssUpload'
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types'

const { Option } = Select;
const options = [
    { label: '直销员', value: '1' },
    { label: '服务中心员工', value: '3' },
    { label: '店主', value: '4' },

    { label: '客户代表', value: '5' },
    { label: '客户经理', value: '6' },

    { label: '中级经理', value: '7' },
    { label: '客户总监', value: '8' },
    { label: '高级客户总监', value: '9' },
    { label: '资深客户总监', value: 'GG' },
];
const options_level = [
    { label: 'LV0', value: 'L-0' },
    { label: 'LV1', value: 'L-1' },
    { label: 'LV2', value: 'L-2' },
    { label: 'LV3', value: 'L-3' },

    { label: 'LV4', value: 'L-4' },
    { label: 'LV5', value: 'L-5' },

    { label: 'LV6', value: 'L-6' },
    { label: 'LV7', value: 'L-7' }
];
export default class PersonTypePublic extends React.Component {
    static propTypes = {
        /**提交后是否返回上一页 */
        canBack: PropTypes.bool,
		showO2O: PropTypes.number,
		showUser: PropTypes.bool,
		disabled: PropTypes.bool,
        flag: PropTypes.bool,
        actions: PropTypes.object,
    }
    static defaultProps = {
        canBack:true,
        flag: '',
        disabled:false,
        showUser:false,
        showO2O:true,
        actions:null
	}
    constructor(props) {
        super(props);
        this.getO2OClass = debounce(this.getO2OClass, 500);
    }
    
    state = {
        user_is_auth: -1,
        excelFileList: [],
        selectValue: [],
        viewUser:[],
        rejectedUser:[],
        peopleType: 0,
        checkValue: [],
        checkLevelValue: [],

        flag_select: 0,
        importLoading: false,
        showImportPannel: false,

        stype:0,
        status:-1,
        keyword:"",
        pageSize:10,
        page:0,
        squadId:'',
        class_list:[],
        fetching:false,
        type:1
    }
    componentWillReceiveProps(n_props) {
        if (this.props.flag !== n_props.flag) {
            let flag_select = 0
            let checkLevelValue = []
            let checkValue = n_props.flag.split('/')
            checkValue.pop()
            checkValue.shift()

            if (!n_props.flag)
                flag_select = 0
            else if (n_props.flag == '/2/')
                flag_select = 1 //新用户
            else if (n_props.flag == '/I/')
                flag_select = 3 //导入用户
            else if (n_props.flag.indexOf('L-') > -1)
                flag_select = 5 //有等级用户
            else if (n_props.flag.indexOf('squad-') > -1)
                flag_select = 6 //O2O
            else if (n_props.flag == '/NONE/')
                flag_select = 4 //未认证
            else
                flag_select = 2

            if(flag_select == 6){
                this.getO2OClassById(1)
            }
            if(flag_select == 5){
                checkLevelValue = checkValue
                checkValue = []
            }
            this.setState({ checkLevelValue, checkValue, flag_select })
        }
        // if (this.props.flag === n_props.flag) {
        //     let flag_select = 0
        //     let checkLevelValue = []
        //     let checkValue = n_props.flag.split('/')
        //     checkValue.pop()
        //     checkValue.shift()

        //     if (!n_props.flag)
        //         flag_select = 0
        //     else if (n_props.flag == '/2/')
        //         flag_select = 1 //新用户
        //     else if (n_props.flag == '/I/')
        //         flag_select = 3 //导入用户
        //     else if (n_props.flag.indexOf('L-') > -1)
        //         flag_select = 5 //有等级用户
        //     else if (n_props.flag.indexOf('squad-') > -1)
        //         flag_select = 6 //O2O
        //     else if (n_props.flag == '/NONE/')
        //         flag_select = 4 //未认证
        //     else
        //         flag_select = 2

        //     if(flag_select == 6){
        //         this.getO2OClassById(1)
        //     }
        //     if(flag_select == 5){
        //         checkLevelValue = checkValue
        //         checkValue = []
        //     }
        //     this.setState({ checkLevelValue, checkValue, flag_select })
        // }
    }
    componentDidMount(){
        this.getO2OClass()
    }
    getO2OClassById(id){

    }
    getO2OClass = ()=>{
        this.setState({ class_list: [], fetching: true });
        const {stype,status,keyword,page,pageSize} = this.state
        this.props.actions&&this.props.actions.getO2OClass({
            stype,status,keyword,page,pageSize,
            resolved:(res)=>{
                console.log(res)
                const {data} = res
                if(data){
                    if(Array.isArray(data))
                        this.setState({ class_list:data,fetching:false })
                }
            },
            rejected:(res)=>{
                this.setState({ fetching: false })
                message.error(JSON.stringify(res))
            }
        })
    }
    getValue = () => {
        const { squadId, checkValue, flag_select, checkLevelValue} = this.state
        const{ctype}=this.props
        let flag = ''
        if (checkValue.length > 0)
            flag = '/' + checkValue.join('/') + '/';
        if (checkLevelValue.length > 0)
            flag = '/' + checkLevelValue.join('/') + '/';
        if (flag_select === 2 && flag === '') {
            message.info('请选择开放对象')
            return null
        }if (flag_select === 5 && flag === '') {
            message.info('请选择等级')
            return null
        } else if (flag_select === 1) {
            return '/2/'
        }else if (flag_select === 3) {
            return '/I/'
        } else if (flag_select === 4) {
            return '/NONE/'
        } else if (flag_select === 6) {
            if(!squadId){
                message.info('请选择O2O班级')
                return null
            }
            return "squad-"+squadId
        } else {
            return flag
        }
        
    }
    getFile = ()=>{
        if(this.excelFile){
            return this.excelFile.getValue()||''
        }
    }

    //优惠券、关卡副线中开放对象的导入，我使用的是这个接口,type == comm
    uploader = (contentId)=>{
        const that = this
        const {actions,parent,ctype} = this.props
        const {flag_select} = this.state
        let file_url = this.excelFile&&this.excelFile.getValue()

        const uploading = new Promise((resolve,reject)=>{
            if(!file_url||flag_select !== 3){
                resolve(false);
            }else{
                //资讯、活动等导入
                actions.importUserPublic({
                    content_id:contentId,
                    file_url,
                    ctype,
                    type:'comm',
                    resolved: (data) => {
        
                        let rejectedUser = []
                        if (Object.keys(data).indexOf('fail') > -1) {
                            rejectedUser = data.fail
                        }
                        if (parent)
                            parent.setState({ importLoading: false,loading:false })
                        that.setState({ importLoading: false, showImportPannel: false, excelFileList: [] }, () => {
                            that.setState({
                                showResult: true,
                                total: data.total,
                                success: data.success,
                                rejectedUser: rejectedUser
                            })
                        })
                        resolve(true);
                    },
                    rejected: (data) => {
                        if (parent)
                            parent.setState({ importLoading: false,loading:false })
                        message.error(JSON.stringify(data))
                        resolve(false);
                    }
                })
            }
        })
        return uploading
    }

    uploadFile = (content_id, actions, parent,ctype) => {
        if (parent)
            parent.setState({ loading:false,importLoading: true })
        const that = this
        const file_url = this.excelFile&&this.excelFile.getValue()
        actions.importUserPublic({
            content_id,
            file_url,
            ctype,
            type:this.state.type,
            resolved: (data) => {

                let rejectedUser = []
                if (Object.keys(data).indexOf('fail') > -1) {
                    rejectedUser = data.fail
                }
                if (parent)
                    parent.setState({ importLoading: false,loading:false })
                that.setState({ importLoading: false, showImportPannel: false, excelFileList: [] }, () => {
                    that.setState({
                        showResult: true,
                        total: data.total,
                        success: data.success,
                        rejectedUser: rejectedUser
                    })
                })
            },
            rejected: (data) => {
                if (parent)
                    parent.setState({ importLoading: false,loading:false })
                message.error(data)
            }
        })
    }
    onCheckBox = (checkValue) => {
        this.setState({ checkValue })
    }
    onCheckLevelBox = (checkValue) => {
        this.setState({ checkLevelValue: checkValue })
    }

    onSelected = (value) => {
        let flag = ''
        if (value == 1) {
            flag = '/2/'
        }
        if (value == 4) {
            flag = '/NONE/'
        }
        this.setState({
            checkLevelValue: [],
            checkValue: [],
            flag,
            flag_select: value
        })

    }
    onRemoveExcel = file => {
        this.setState(state => {
            const index = state.excelFileList.indexOf(file);
            const newFileList = state.excelFileList.slice();
            newFileList.splice(index, 1);
            return {
                excelFileList: newFileList,
            };
        });
    }
    beforeUploadExcel = file => {

        if (file.name.indexOf('xlsx') === -1) {
            message.info('请上传xlsx格式的文件')
            return;
        }
        this.setState(state => ({
            excelFileList: [file],
        }));
        return false;
    }
    _onExportUser = () => {
        this.setState({ exportLoading: true })
        const { actions } = this.props
        const { courseId: course_id } = this.props
        const { user_is_auth: is_auth } = this.state

        actions&&actions.exportCourseUser({
            course_id, type: 'customUser', is_auth,
            resolved: (data) => {
                this.setState({ exportLoading: false })
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(data.adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                this.setState({ exportLoading: false })
                message.error(data)
            }
        })
    }

    _onShowUser = () => {
        this.setState({ viewLoading: true })

        const { contentId: content_id,ctype:ctype } = this.props
        if (content_id !== '0' && content_id)
            this.props.actions&&this.props.actions.getImportUserPublic({
                content_id,
                ctype,
                resolved: (data) => {
                    console.log(data)
                    this.setState({
                        viewUser: data,
                        showUser: true
                    }, () => {
                        this.setState({ viewLoading: false })
                    })
                },
                rejected: (data) => {
                    message.error(data)
                    this.setState({ viewLoading: false })
                }
            })
    }
    _onPage = (val) => {
        this.setState({ u_page: val }, () => {
            this._onShowUser()
        })
    }
    render() {
        const { disabled,showUser} = this.props
        return (
            <>
                <Select
                    disabled={disabled}
                    className="m_w400"
                    value={this.state.flag_select}
                    onChange={this.onSelected}
                >
                    <Option value={0}>全部用户</Option>
                    
                    <Option value={5}>有等级用户</Option>
                   
                    <Option value={1}>新用户</Option>
                    
                    <Option value={4}>未认证</Option>
                    <Option value={2}>有标签用户</Option>
                    {this.props.showO2O?
                    <Option value={6}>O2O培训班</Option>:null
                    }
                    <Option value={3}>自定义</Option>
                </Select>
              {
                    this.state.flag_select==3?
                    <Select
                    disabled={disabled}
                    style={{width:'150px'}}
                    value={this.state.type}
                    onChange={(e)=>{this.setState({type:e})}}
                >
                    <Option value={0}>覆盖</Option>
                    <Option value={1}>增加</Option>
                </Select>
                :null
                }
                {this.state.flag_select == 6 ?
                    <div>
                        <Select
                            placeholder="搜索O2O培训班"
                            notFoundContent={this.state.fetching ? <Spin size="small" /> : <Empty />}
                            showSearch
                            disabled={disabled}
                            className="m_w400"
                            value={this.state.squadId}
                            placeholder='搜索培训班'
                            filterOption={false}
                            onChange={(val)=>this.setState({squadId:val})}
                            onSearch={(val)=>{
                                this.setState({ keyword:val },()=>{
                                    this.getO2OClass()
                                })
                            }}
                        >
                            {
                                this.state.class_list.map(item=>(
                                    <Select.Option key={item.squadId} value={item.squadId}>{item.squadName}</Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                : null}
                {this.state.flag_select == 5 ?
                    <div>
                        <Checkbox.Group
                            key='level'
                            disabled={disabled}
                            options={options_level}
                            value={this.state.checkLevelValue}
                            onChange={this.onCheckLevelBox}
                            className='mt_20'
                        />
                    </div>
                : null}
                {this.state.flag_select == 2 ?
                    <div>
                        <Checkbox.Group
                            key='tag'
                            disabled={disabled}
                            options={options}
                            value={this.state.checkValue}
                            onChange={this.onCheckBox}
                            className='mt_20'
                        />
                    </div>
                : null}
                {this.state.flag_select == 3 ?
                    <div>
                        {
                            showUser? 
                            <Button  onClick={() => { this.setState({ u_page: 1}, () => { this._onShowUser() }) }} className='m_2'>查看用户</Button> 
                            :null
                        }
                        
                        <AntdOssUpload
                            showMedia={false}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                            listType='text' 
                            ref={(ref)=>{ this.excelFile = ref }}
                        />

                        <div style={{ color: "#8e8e8e", marginTop: '10px', lineHeight: '1.5' }}>
                            <p>
                                * 导入前，请先下载Excel模板文件<br />
                                * 仅支持xlsx格式的文件
                            </p>
                            <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/dff4d08b-e550-475f-91d6-cc3f42f3c350.xlsx'>
                                Excel导入模板下载
                            </a>
                        </div>
                    </div>
                : null}
                <Modal
                    width={600}
                    title='导入结果'
                    visible={this.state.showResult}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showResult:false })
                        if(this.props.canBack){
                            window.history.back()
                        }
                    }}
                    onOk={() => {
                        this.setState({ showResult:false })
                        if(this.props.canBack){
                            window.history.back()
                        }
                    }}
                    bodyStyle={{ padding: '10px' }}
                >

                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '10px' }}>
                        <span style={{ paddingRight: '20px' }}>总数:{this.state.total}</span>
                        <span style={{ paddingRight: '20px' }}>导入成功数:{this.state.success}</span>
                        <span style={{ paddingRight: '20px' }}>导入失败数:{this.state.total - this.state.success}</span>
                    </div>
                    {!this.state.rejectedUser.length?null:
                        <TableAntd columns={this.rejectedUser} pagination={{size:'small',showTotal:(total)=>`总共${total}条`}} dataSource={this.state.rejectedUser} rowKey='sn'></TableAntd>
                    }
                </Modal>
                <Modal
                    width={800}
                    destroyOnClose={true}
                    title='自定义用户名单'
                    visible={this.state.showUser}
                    closable={true}
                    maskClosable={true}
                    okText='确定'
                    cancelText='取消'
                    onCancel={() => {
                        this.setState({ showUser: false })
                    }}
                    onOk={() => {
                        this.setState({ showUser: false })
                    }}
                    bodyStyle={{ padding: '10px' }}
                >
                    <div>
                        <Select
                            className='m_2'
                            style={{ minWidth: '130px' }}
                            onChange={val => this.setState({ u_page: 1, user_is_auth: val }, () => { this._onShowUser() })}
                            value={this.state.user_is_auth}
                        >
                            <Select.Option value={-1}>全部状态</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                        </Select>
                        <Button style={{ float: 'right' }} onClick={this._onExportUser} loading={this.state.exportLoading}>导出</Button>
                    </div>
                    <TableAntd columns={this.viewUser} dataSource={this.state.viewUser} rowKey='id' pagination={{
                        current: this.state.u_page,
                        pageSize: this.state.u_pageSize,
                        total: this.state.u_total,
                        showQuickJumper: true,
                        onChange: this._onPage,
                        showTotal: (total) => '总共' + total + '条'
                    }}/>
                </Modal>
            </>
        );
    }
    rejectedUser = [
        {
            title: '',
            dataIndex: '',
            key: '',
            ellipsis: false,
        },
        {
            title: '卡号',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        },
        {
            title: '导入失败原因',
            dataIndex: 'result',
            key: 'result',
        },
    ]
    viewUser = [
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            ellipsis: false,
            render: (item, ele) => ele.userId == 0 ? '' : ele.userId
        },
        {
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname',
            ellipsis: false,
            render: (item, ele) => ele.nickname? ele.nickname : ele.name
        },
        {
            title: 'VIP卡号',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        },
        {
            title: '手机',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        // {
        //     title: '状态',
        //     dataIndex: 'isAuth',
        //     key: 'isAuth',
        //     ellipsis: false,
        //     render: (item, record) => record.isAuth == 1 ? '已认证' : '未认证'
        // },
        {
            title: '导入时间',
            dataIndex: 'result',
            key: 'result',
            render: (item, record) => record.isAuth == 0 ? "" : moment.unix(record.pubTime).format('YYYY-MM-DD HH:mm')
        },
    ]
}