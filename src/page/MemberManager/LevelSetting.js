import React, { Component } from 'react';
import { Col, Row ,Table} from 'reactstrap';
import { Empty,Upload,Modal,Form,Slider,Tooltip,Select,Tabs,Card, DatePicker,Menu, Dropdown, Icon, message,Input, Avatar, InputNumber} from 'antd';
import {Link} from 'react-router-dom';
import TextArea from 'antd/lib/input/TextArea';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import {Button,Popconfirm} from '../../components/BtnComponent'

const { TabPane } = Tabs;
const { Search } = Input;
const {Option} = Select;
let id = 0;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 文件!');
  }
  const isLt2M = file.size / 1024  < 500;
  if (!isLt2M) {
    message.error('图片文件需小于 500KB!');
  }
  return isJpgOrPng && isLt2M;
}

class LevelSetting extends Component {
    level_list = []
    equity_list = []
    state = {
        edit : false,
        view : false,

        showEdit:false,
        visible: false,
        showView:false,
        keys:[],
        loading: false,
        imageUrl:'',
        level_item:{equityList:[]},

        begin_prestige:0,
        end_prestige:0,
        equity:[],
        level_id:0,
        level_name:"",

        _begin_prestige:0,
        _end_prestige:0,
        _equity:[],
        _level_id:0,
        _level_name:""
    };
    
    componentWillReceiveProps(nextProps){
    
        if(nextProps.level_list !== this.props.level_list){
            this.level_list = nextProps.level_list;
        }
        if(nextProps.equity_list !== this.props.equity_list){
            this.equity_list = nextProps.equity_list;
        }
        if(nextProps.user !== this.props.user){
			const { user } = nextProps
			
		}
    }
    componentDidMount(){
        const {actions} = this.props;
        actions.getLevel();
        actions.getEquity();
    }
    _onSelect = (value) => {
        this.setState({
            equity:value
        })
    }
    _onEditSelect = (value) => {
        this.setState({
            _equity:value
        })
    }
    _onPublish(){
        let {begin_prestige,end_prestige,equity,level_name,_level_id} = this.state;
        const {actions} = this.props
        if(!level_name){
            message.info('等级名称不能为空')
            return;
        }
        if(begin_prestige == end_prestige){
            message.info('成长区间不能相等')
            return;
        }
        if(begin_prestige > end_prestige){
            message.info('起始区间不能大于结束区间')
            return;
        }
        if(equity.length == 0){
            message.info('请选择会员权益')
            return;
        }
        equity = equity.join(',')

        actions.publishLevel({
            begin_prestige,end_prestige,equity,level_name,
            resolved:()=>{
                this.hideModal()
                message.success("提交成功")
                this.setState({
                    begin_prestige:0,
                    end_prestige:0,
                    equity:[],
                    level_id:0,
                    level_name:""
                })
                actions.getLevel();
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onEdit(){
        let {_begin_prestige,_end_prestige,_equity,_level_name,_level_id} = this.state;
        const {actions} = this.props

        if(!_level_name){
            message.info('等级名称不能为空')
            return;
        }
        if(_begin_prestige == _end_prestige){
            message.info('成长区间不能相等')
            return;
        }
        if(_begin_prestige > _end_prestige){
            message.info('起始区间不能大于结束区间')
            return;
        }
        if(_equity.length == 0){
            message.info('请选择会员权益')
            return;
        }
        
        _equity = _equity.join(',')

        actions.publishLevel({
            begin_prestige:_begin_prestige,end_prestige:_end_prestige,equity:_equity,level_name:_level_name,level_id:_level_id,
            resolved:()=>{
                this.hideEdit()
                message.success("提交成功")
                this.setState({
                    _begin_prestige:0,
                    _end_prestige:0,
                    _equity:[],
                    _level_id:0,
                    _level_name:""
                })
                actions.getLevel();
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    
    _onDelete(id){
        const {actions} = this.props;
        actions.removeLevel({
            level_id:id,
            resolved:(data)=>{
                message.success("操作成功")
                actions.getLevel();
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    showEdit(index){
        let ele = this.level_list[index]
        let _equity = []
        ele.equityList.map((ele)=>{
            _equity.push(ele.equityId)
        })
        this.setState({
            showEdit: true,
            _begin_prestige:ele.beginPrestige,
            _end_prestige:ele.endPrestige,
            _equity:_equity,
            _level_id:ele.levelId,
            _level_name:ele.levelName
        });
    }
    hideEdit = ()=>{
        this.setState({
            showEdit: false,
            _begin_prestige:0,
            _end_prestige:0,
            _equity:[],
            _level_id:0,
            _level_name:""
        });
    }
    showView(index){
        this.setState({
            showView: true,
            level_item:this.level_list[index]
        });
    }
    hideView = ()=>{
        this.setState({
            showView: false,
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    remove = k => {

        if (this.state.keys.length === 1) {
            return;
        }
        this.setState({
            keys:this.state.keys.filter(key => key !== k),
        })

    };

    add = () => {
        const nextKeys = this.state.keys.concat(id++);
        this.setState({
            keys: nextKeys,
        })
    };
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

        const uploadButton = (
            <div style={{position:'relative'}}>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图标</div>
                <div className="be_l_gray text_center" style={{position:'absolute',bottom:'-25px',width:'95px'}}>(45px * 45px)</div>
            </div>
        );
        
        const { imageUrl,level_item,begin_prestige,end_prestige,equity,level_id,level_name,_begin_prestige,_end_prestige,_equity,_level_name} = this.state;
  
        return (
        <div className="animated fadeIn">
            <Card title="会员等级列表" >
            {/* <Card title="会员等级列表" extra={<Button value='level/add' onClick={this.showModal}>创建等级</Button>}> */}
                <Table responsive size="sm" className="v_middle">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>等级</th>
                        <th>成长值区间</th>
                        <th>权益</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.level_list.length == 0?
                        <tr>
                            <td colSpan={5}>
                                <Empty className="mt_20" description="暂时没有数据"/>
                            </td>
                        </tr>
                        :this.level_list.map((ele,index)=>
                        <tr key={index+'level'}>
                            <td>{ele.levelId}</td>
                            <td>{ele.levelName}</td>
                            <td>{ele.beginPrestige} - {ele.endPrestige}</td>
                            <td>
                            {
                                ele.equityList.map((_ele,_index)=>(
                                    <Tooltip key={_index+'equityList'} placement="top" title={(<span>{_ele.equityName}</span>)}>
                                        <Avatar src={_ele.equityImg} className="mr_10" shape="disc"/>
                                    </Tooltip>
                                ))
                            }
                            </td>
                            <td>
                                <div>
                                    <Button value='level/view' onClick={this.showView.bind(this,index)} type="primary" ghost size={'small'}>查看</Button>&nbsp;
                                    <Button value='level/edit' onClick={this.showEdit.bind(this,index)} type="primary" size={'small'}>修改</Button>&nbsp;
                                    <Popconfirm 
                                        value='level/del' 
                                        okText="确定"
                                        cancelText='取消'
                                        title='确定删除吗？'
                                        onConfirm={this._onDelete.bind(this,ele.levelId)}
                                    >
                                        <Button type="danger" ghost size={'small'}>删除</Button>
                                    </Popconfirm>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </Card>
            <Modal
                title="添加会员等级"
                visible={this.state.visible}
                okText="提交"
                cancelText="取消"
                closable={true}
                maskClosable={true}
                onCancel={this.handleCancel}
                onOk={this._onPublish.bind(this)}
                bodyStyle={{padding:"10px"}}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="会员等级">
                        <Input 
                            onChange={(e)=>{
                                this.setState({level_name:e.target.value})
                            }}
                            value={level_name} 
                            placeholder="等级名称"
                        />
                    </Form.Item>
                    <Form.Item label="成长值区间">
                        <Input.Group compact>
                            <InputNumber 
                                value={begin_prestige} 
                                onChange={(val)=>{
                                    if(val !== ''&&!isNaN(val)){
                                        val = Math.round(val)
                                        if(val<0) val=0
                                        this.setState({
                                            begin_prestige:val
                                        })
                                    }
                                }}
                                min={0} max={800000}
                            />
                            &nbsp; - &nbsp;
                            <InputNumber 
                                value={end_prestige} 
                                onChange={(val)=>{
                                    if(val !== ''&&!isNaN(val)){
                                        val = Math.round(val)
                                        if(val<0) val=0
                                        this.setState({
                                            end_prestige:val
                                        })
                                    }
                                }}
                                min={0} max={800000}
                            />
                        </Input.Group>
                    </Form.Item>
                    <Form.Item label="会员权益">
                        <Select
                            value={this.state.equity}
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="选择会员权益"
                            onChange={this._onSelect}
                        >
                            {this.equity_list.map((ele,index)=>(
                                <Option key={index+'equi'} value={ele.equityId}>{ele.equityName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {/*<
                    Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> 添加权益
                        </Button>
                    </Form.Item>
                    */}
                </Form>
            </Modal>
            <Modal
                title="修改会员等级"
                visible={this.state.showEdit}
                okText="提交"
                cancelText="取消"
                closable={true}
                maskClosable={true}
                onCancel={this.hideEdit}
                onOk={this._onEdit.bind(this)}
                bodyStyle={{padding:"10px"}}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="会员等级">
                        <Input 
                            onChange={(e)=>{
                                this.setState({_level_name:e.target.value})
                            }}
                            value={_level_name} 
                            placeholder="等级名称"
                        />
                    </Form.Item>
                    <Form.Item label="成长值区间">
                        <Input.Group compact>
                            <InputNumber 
                                value={_begin_prestige} 
                                onChange={(val)=>{
                                    if(val !== ''&&!isNaN(val)){
                                        val = Math.round(val)
                                        if(val<0) val=0
                                        this.setState({
                                            _begin_prestige:val
                                        })
                                    }
                                }}
                                min={0} max={800000}
                            />
                            &nbsp; - &nbsp;
                            <InputNumber 
                                value={_end_prestige} 
                                onChange={(val)=>{
                                    if(val !== ''&&!isNaN(val)){
                                        val = Math.round(val)
                                        if(val<0) val=0
                                        this.setState({
                                            _end_prestige:val
                                        })
                                    }
                                }}
                                min={0} max={800000}
                            />
                        </Input.Group>
                    </Form.Item>
                    <Form.Item label="会员权益">
                        <Select
                            value={this.state._equity}
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="选择会员权益"
                            onChange={this._onEditSelect}
                        >
                            {this.equity_list.map((ele,index)=>(
                                <Option key={index+'_equi'} value={ele.equityId}>{ele.equityName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {/*<
                    Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> 添加权益
                        </Button>
                    </Form.Item>
                    */}
                </Form>
            </Modal>
            <Modal
                title="会员等级详情"
                visible={this.state.showView}
                footer={null}
                closable={true}
                maskClosable={true}
                onCancel={this.hideView}

                bodyStyle={{padding:"10px"}}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="会员等级">
                        {level_item?level_item.levelName:''}
                    </Form.Item>
                    <Form.Item label="成长值区间">
                        {level_item?`${level_item.beginPrestige} - ${level_item.endPrestige}`:''}
                    </Form.Item>
                    <Form.Item label="会员权益">
                    {!level_item?"":level_item.equityList.map((_ele,_index)=>(

                        <div key={_index+'equity'} className="flex f_row mt_20">
                            <Avatar src={_ele.equityImg} size="large" shape="disc" className="mr_10" style={{flexShrink:0}}/>
                            <div style={{marginRight:10}} >
                                <Input disabled value={_ele.equityName}/>
                                <Input disabled value={_ele.tag}/>
                                <TextArea disabled rows={4} value={_ele.content} />
                            </div>
                        </div>
                    
                    ))} 
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        );
    }
}

const LayoutComponent = LevelSetting;
const mapStateToProps = state => {
    return {
        level_list:state.user.level_list,
        equity_list:state.user.equity_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});