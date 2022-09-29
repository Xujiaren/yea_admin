import React, { Component } from 'react';
import { Badge,CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import {Card,PageHeader,Form,Modal,Checkbox,DatePicker,Menu, Dropdown, Button, Icon, message,Input,Pagination, Select, InputNumber} from 'antd';
import {Link,NavLink} from 'react-router-dom'
import connectComponent from '../../util/connect';

import _ from 'lodash'

const {RangePicker} = DatePicker;
const { Search } = Input;
const InputGroup = Input.Group;
const {Option} = Select;

class GuaGuaLuckyList extends Component {
    state = {
        edit: true,
        view: true,

        randomNumber:0,
        showRandom:false,

        showPost:false,
        visible: false,
        activity_id:'18',
        address:'',
        ctype:'1',
        integral:0,
        item_name:'',
        mobile:'',
        nickname:'',

        ship_sn:'',
        rewardId:0,
        showLoading:false
    };
    reward_list = []
    page_total=0
    page_current=1
    page_size=10

    componentDidMount(){
        const {actions} = this.props
        actions.getActiveReward({activity_id: this.state.activity_id})
    }

    componentWillReceiveProps(n_props){

        if(n_props.reward_list !== this.props.reward_list){
            this.reward_list = n_props.reward_list.data
            this.page_total=n_props.reward_list.total
            this.page_current=n_props.reward_list.page+1
        }
    }
    hidePost = ()=>{
        this.setState({
            showPost:false
        })

    }
    showPost(index){
        let {
			rewardId,
			realname,
			itemName,
			itemImg,
			address,
			mobile,
			shipSn
        } = this.reward_list[index]

        this.setState({
			rewardId,
			realname,
			itemName,
			itemImg,
			address,
			mobile,
			ship_sn:shipSn,
			showPost: true,
		});
    }
    onPost=()=>{
		const { ship_sn } = this.state
		if(!ship_sn){
			message.error('请输入物流单号')
			return
		}
		const {actions} = this.props
		let {rewardId:reward_id} = this.state
		
		actions.updatePost({
            reward_id,ship_sn,
			resolved:(data)=>{
				actions.getTodo()
				message.success('提交成功')
                this.hidePost()
                actions.getActiveReward({activity_id: this.state.activity_id,page:this.page_current-1})
			}
		})
	}
    _onAddReward = ()=>{
        const {actions} = this.props;
        const {
            activity_id,
            address,
            ctype,
            integral,
            item_name,
            mobile,
            nickname
        } = this.state
        if(!nickname||!item_name){
            message.info('请填写完整信息')
            return
        }
        actions.publishActiveReward({
            activity_id,
            address,
            ctype,
            integral,
            item_name,
            mobile,
            nickname,
            resolved:(data)=>{
                this.handleCancel()
                actions.getActiveReward({activity_id: this.state.activity_id,page:this.page_current-1})
                message.success('提交成功')
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onRandom = ()=>{
        const {randomNumber} = this.state
        if(!randomNumber){
            message.info('请输入大于0的值')
            return
        }
        if(randomNumber>40000){
            message.info('数量不能大于4万')
            return
        }
        const {actions} = this.props
        actions.randomActiveReward({
            activity_id:this.state.activity_id,
            number:randomNumber,
            resolved:(data)=>{
                this.hideRandom()
                actions.getActiveReward({activity_id: this.state.activity_id,page:this.page_current-1})
                message.success('提交成功')
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onPage=(val)=>{
        const {actions} = this.props;
        actions.getActiveReward({activity_id: this.state.activity_id,page:val-1})
    }
    showRandom = ()=>{
        this.setState({
            randomNumber:0,
            showRandom:true
        })
    }
    hideRandom = ()=>{
        this.setState({
            showRandom:false
        })
    }
    showModal = () => {
        this.setState({
            address:'',
            item_name:'',
            mobile:'',
            nickname:'',
            visible: true,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    onOut=()=>{
        this.setState({showLoading:true})
        this.props.actions.getRewardExcel({
            begin_time:'',
            end_time:'',
            activity_id:18,
            resolved:(res)=>{
                const {fileName,adress,name,address} = res
                let url = fileName||adress||name||address
                message.success({
					content: '导出成功',
				})
                this.setState({showLoading:false})
                window.open(url, '_black')
            },
            rejected:(err)=>{

            }
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
        const {
            activity_id,
            address,
            ctype,
            integral,
            item_name,
            mobile,
            nickname
        } = this.state

        return (
            <div className="animated fadeIn">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                subTitle="获奖列表"
            >
            <Row>
                    <Col xs="12" lg="12">
                    <Card bodyStyle={{padding:0}}>
                        <CardHeader className="flex j_space_between align_items">
                            <div className="flex row align_items f_grow_1">
                                
                            </div>
                            <div>
                                <Button value='' onClick={this.onOut} loading={this.state.showLoading}>导出</Button>&nbsp;
                                <Button value='' onClick={this.showRandom}>批量生成获奖信息</Button>&nbsp;
                                <Button value='' onClick={this.showModal}>新增</Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            
                            <Table responsive size="sm">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>用户昵称</th>
                                    <th>真实姓名</th>
                                    <th>联系方式</th>
                                    <th>地址</th>
                                    <th>奖品名称</th>
                                    <th>获奖时间</th>
                                    <th>物流单号</th>
                                    <th>备注</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.reward_list.map((ele,index)=>
                                    <tr key={ele.rewardId+'reward'}> 
                                        <td>{ele.rewardId}</td>
                                        <td>{ele.nickname}</td>
                                        <td>{ele.realname}</td>
                                        <td>{ele.mobile}</td>
                                        <td>{ele.address}</td>
                                        <td>{ele.itemName}</td>
                                        <td>{ele.winningTime}</td>
                                        <td>{ele.shipSn}</td>
                                        <td>{ele.isAdmin==1?'管理员添加':''}</td>
                                        <td style={{width:'200px' }}>
                                            {/* {ele.isAdmin==1?
                                                <Button size={'small'} type="danger">删除</Button>
                                            :null} */}
                                            {ele.ctype == 2&&!ele.isAdmin?
                                                <Button value='' onClick={this.showPost.bind(this,index)} size={'small'}>邮寄</Button>
                                            :null}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                            <Pagination showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper  onChange={this._onPage} pageSize={this.page_size} defaultCurrent={this.page_current} total={this.page_total} />
                        </CardBody>
                    </Card>
                    </Col>

                </Row>
                </PageHeader>
                <Modal
                        title="新增"
                        visible={this.state.visible}
                        okText="确定"
                        cancelText="取消"
                        closable={true}
                        maskClosable={true}
                        onCancel={this.handleCancel}
                        onOk={this._onAddReward}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="用户">
                            <Input 
                                value={nickname}
                                onChange={e=>{
                                    this.setState({
                                        nickname:e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                        {/*<Form.Item label="联系方式">
                            <Input 
                                value={mobile}
                                onChange={e=>{
                                    this.setState({
                                        mobile:e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                        */}
                        <Form.Item label="奖品名称">
                            <Input value={item_name}
                                onChange={e=>{
                                    this.setState({item_name:e.target.value})
                                }}
                            />
                        </Form.Item>
                       {/* <Form.Item label="地址">
                            <Input value={address}
                                onChange={e=>{
                                    this.setState({address:e.target.value})
                                }}
                            />
                        </Form.Item>
                        */}
                    </Form>
                </Modal>
                <Modal
                        title="批量生成数据"
                        visible={this.state.showRandom}
                        okText="确定"
                        cancelText="取消"
                        closable={true}
                        maskClosable={true}
                        onCancel={this.hideRandom}
                        onOk={this._onRandom}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="数量">
                            <InputNumber 
                                min={0} max={8000}
                                style={{width:'150px'}}
                                value={this.state.randomNumber}
                                onChange={val=>{
                                    
                                    if(val !== ''&&!isNaN(val)){
                                        val = Math.round(val)
                                        if(val<0) val=0
                                        this.setState({
                                            randomNumber:val
                                        })
                                    }
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
					title="物流单号回填"
					visible={this.state.showPost}
					okText="提交"
					cancelText="取消"
					closable={true}
					maskClosable={true}
					onCancel={this.hidePost}
					onOk={this.onPost}
					bodyStyle={{ padding: "10px" }}
				>
					<Form {...formItemLayout}>
						<Form.Item label="产品名称">
							<Input disabled value={this.state.itemName} />
						</Form.Item>
						<Form.Item label="产品图">
							<a>
								<img className="head-example-img" src={this.state.itemImg}/>
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
								onChange={e=>{
									this.setState({
										ship_sn:e.target.value
									})
								}}
							/>
						</Form.Item>
					</Form>
				</Modal>
            </div>
        );
    }
}

const LayoutComponent = GuaGuaLuckyList;
const mapStateToProps = state => {
    return {
        reward_list:state.ad.reward_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
