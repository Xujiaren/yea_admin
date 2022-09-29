import React, { Component } from 'react';
import cookie from 'react-cookies'
import { Tooltip, Modal } from 'antd';

import {
	Button,
	Card,
	CardBody,
	CardGroup,
	Col,
	Container,
	Form,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row
} from 'reactstrap';

import connectComponent from '../../src/util/connect';

import { message } from 'antd';
import 'antd/dist/antd.css';
import "../scss/base.scss";

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: '',
			psd: '',
			code: '',
			img: '',
			showImportPannel: false,
			showImportPannels: false,
			username: '',
			mobile: '',
			password: '',
			passwords: '',
			user_id:0,
		}

		this._onPsdInput = this._onPsdInput.bind(this);
		this._onUserInput = this._onUserInput.bind(this);
		this._onCode = this._onCode.bind(this);
		this._onSubmit = this._onSubmit.bind(this);

	}
	componentDidMount() {
		const { actions } = this.props
		actions.getConfirmImg()
		window.addEventListener('keyup', this._onEnter)
	}
	componentWillUnmount() {
		window.removeEventListener('keyup', this._onEnter)
	}
	componentWillReceiveProps(n_props) {
		if (n_props.img_info !== this.props.img_info) {

			this.setState({
				img: n_props.img_info.url
			})
		}
	}

	getCode = () => {
		const { actions } = this.props
		actions.getConfirmImg()
	}
	_onCode(e) {
		this.setState({
			code: e.target.value
		})
	}
	_onPsdInput(e) {
		this.setState({
			psd: e.target.value
		})
	}
	_onUserInput(e) {
		this.setState({
			user: e.target.value
		})
	}
	_onEnter = (event) => {
		if (event.keyCode == "13") {
			this._onSubmit()
		}
	}
	_onSubmit() {
		const { actions } = this.props

		if (this.state.user == '') {
			message.info('管理员账号不能为空！');
			return;
		}
		if (this.state.psd == '') {
			message.info('密码不能为空！');
			return;
		}
		if (this.state.code == '') {
			message.info('验证码不能为空！');
			return;
		}

		actions.login({
			acc_type: '',
			account: this.state.user,
			password: this.state.psd,
			vaildCode: this.state.code,
			resolved: (data) => {
				console.log(data)
				const { add_time, now } = data.resultBody
				cookie.save('admin_name', this.state.user, { path: '/', maxAge: 60 * 60 * 24 * 7 })
				cookie.save('add_time', add_time, { path: '/' })
				cookie.save('now', now, { path: '/' })
				message.success({
					duration: 2,
					content: data.errorMsg,
					onClose: () => {
						this.props.history.push('/todo-list');
					}
				});
			},
			rejected: (msg) => {
				message.error(msg);
				actions.getConfirmImg()
			}
		})
	}
	onOk = () => {
		const{username,mobile}=this.state
		const{actions}=this.props
		if(!username){message.info({content:'请填写用户名'});return;}
		if(!mobile){message.info({content:'请填写手机号'});return;}
		actions.postNewUser({
			mobile:mobile,
			userName:username,
			resolved:(res)=>{
				this.setState({
					user_id:res.userId,
					username:'',
					mobile:'',
					showImportPannel: false
				}, () => {
					this.setState({
						showImportPannels: true
					})
				})
			},
			rejected:(err)=>{
				console.log(err)
			}
		})
		
	}
	okey=()=>{
		const{user_id,password,passwords}=this.state
		const{actions}=this.props
		if(!password){message.info({content:'请填写新密码'});return;}
		if(!passwords){message.info({content:'请填写确认新密码'});return;}
		if(password!==passwords){message.info({content:'请确保输入的密码都正确'});return;}
		actions.postNewPsd({
			password:password,
			user_id:user_id,
			resolved:(res)=>{
				console.log(res)
				this.setState({
					user_id:0,
					password:'',
					passwords:'',
					showImportPannels: false
				})
				message.success({content:'修改成功'})
			},
			rejected:(err)=>{
				console.log(err)
			}
		})
	}
	render() {

		return (
			<div className="app flex-row align-items-center">
				<Container>
					<Row className="justify-content-center">
						<Col md="5">
							<CardGroup>
								<Card className="p-4">
									<CardBody>
										<Form>
											<h1>后台登录</h1>
											<p className="text-muted">TO BE PERFECT</p>
											<InputGroup className="mb-3">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-user"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input type="text" placeholder="账号" value={this.state.user} onChange={this._onUserInput} autoComplete="username" />
											</InputGroup>
											<InputGroup className="mb-3">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-lock"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input type="password" placeholder="密码" value={this.state.psd} onChange={this._onPsdInput} autoComplete="current-password" />
											</InputGroup>
											<InputGroup className="mb-2">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-lock"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input type="text" placeholder="验证码" value={this.state.code} onChange={this._onCode} />
												<div className="img_wrap" style={{ display: 'flex', alignItems: 'center', width: "115px", marginLeft: '10px', background: '#fff' }}>
													<img onClick={this.getCode} style={{ width: "110px", verticalAlign: 'center' }} src={this.state.img}></img>
												</div>
											</InputGroup>
											<InputGroup className="mb-4">
												<div style={{ fontSize: '12px', color: '#F4623F' }} onClick={() => {
													this.setState({
														showImportPannel: true
													})
												}}>忘记密码</div>
											</InputGroup>
											<Row>
												<Col xs="12">
													<Tooltip placement="right" title={<span style={{ fontSize: '12px' }}>ENTER键</span>}>
														<Button color="primary" onClick={this._onSubmit} className="px-4 block_center">登录</Button>
													</Tooltip>
												</Col>
											</Row>
										</Form>
									</CardBody>
								</Card>
							</CardGroup>
						</Col>
					</Row>
				</Container>
				<Modal
					title='填写信息'
					visible={this.state.showImportPannel}
					closable={true}
					maskClosable={true}
					okText='修改'
					cancelText='取消'
					onCancel={() => {
						this.setState({ showImportPannel: false })
					}}
					onOk={this.onOk}
				// confirmLoading={this.state.importLoading}
				>
					<InputGroup className="mb-3">
						<InputGroupAddon addonType="prepend">
							<InputGroupText>
								<i className="icon-user"></i>
							</InputGroupText>
						</InputGroupAddon>
						<Input type="text" placeholder="账号" value={this.state.username} onChange={(e) => { this.setState({ username: e.target.value }) }} autoComplete="username" />
					</InputGroup>
					<InputGroup className="mb-3">
						<InputGroupAddon addonType="prepend">
							<InputGroupText>
								<i className="icon-user"></i>
							</InputGroupText>
						</InputGroupAddon>
						<Input type="text" placeholder="手机号" value={this.state.mobile} onChange={(e) => { this.setState({ mobile: e.target.value }) }} autoComplete="username" />
					</InputGroup>
				</Modal>
				<Modal
					title='修改密码'
					visible={this.state.showImportPannels}
					closable={true}
					maskClosable={true}
					okText='确定'
					cancelText='取消'
					onCancel={() => {
						this.setState({ showImportPannels: false })
					}}
				onOk={this.okey}
				// confirmLoading={this.state.importLoading}
				>
					<InputGroup className="mb-3">
						<InputGroupAddon addonType="prepend">
							<InputGroupText>
								<i className="icon-lock"></i>
							</InputGroupText>
						</InputGroupAddon>
						<Input type="password" placeholder="新密码" value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }) }} autoComplete="current-password" />
					</InputGroup>
					<InputGroup className="mb-3">
						<InputGroupAddon addonType="prepend">
							<InputGroupText>
								<i className="icon-lock"></i>
							</InputGroupText>
						</InputGroupAddon>
						<Input type="password" placeholder="确认新密码" value={this.state.passwords} onChange={(e) => { this.setState({ passwords: e.target.value }) }} autoComplete="current-password" />
					</InputGroup>
				</Modal>
			</div>
		);
	}
}

const LayoutComponent = Login;
const mapStateToProps = state => {
	return {
		img_info: state.site.img_info
	}
}

export default connectComponent({ LayoutComponent, mapStateToProps })

