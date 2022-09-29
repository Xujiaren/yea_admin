import React, { Component } from 'react';
import cookie from 'react-cookies'
import { Tooltip } from 'antd';
import PropTypes from 'prop-types'

import { message } from 'antd';
import 'antd/dist/antd.css';
import "../scss/base.scss";

class LoginM extends Component {

	static defaultProps = {
		actions: null,
	}

	constructor(props) {
		document.title = '验证管理员'
		super(props);
		this.state = {
			user: '',
			psd: '',
			code: '',
			img: '',
			obj:{}
			
		}

		this._onPsdInput = this._onPsdInput.bind(this);
		this._onUserInput = this._onUserInput.bind(this);
		this._onCode = this._onCode.bind(this);
		this._onSubmit = this._onSubmit.bind(this);

	}
	componentWillMount(){
		document.title = '验证管理员'
	}
	componentDidMount() {
		this.getCode()
		window.addEventListener('keyup', this._onEnter)
		document.title = '验证管理员'
	}
	componentWillUnmount() {
		document.title = '签到'
		window.removeEventListener('keyup', this._onEnter)
	}
	componentWillReceiveProps(n_props) {

	}

	getCode = () => {
		const { actions } = this.props
		actions.getConfirmImgM({
			resolved:(data)=>{
				this.setState({
					img: data.url
				})
			},
			rejected:(data)=>{
				message.error(JSON.stringify(data))
			}
		})
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
	_onSubmit(){
		// WeixinJSBridge.call('closeWindow');
		// window.WeixinJSBridge.call('scanQRCode',{},function(e){
		// 	alert(JSON.stringify(e))
		// })
		const { actions,parent } = this.props

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
		// cookie.save('admin_name', this.state.user, { path: '/',maxAge:60*60*24 * 7 })

		actions.login({
			acc_type: '',
			account: this.state.user,
			password: this.state.psd,
			vaildCode: this.state.code,
			resolved: (data) => {
				cookie.save('admin_name', this.state.user, { path: '/',maxAge:60*60*24 * 7 })
				
				message.success({
					duration:2,
					content: '验证成功',
					onClose: () => {
						parent.setState({visible: false},()=>{
							parent.startSignUser()
						})
					}
				});
			},
			rejected: (msg) => {
				message.error(msg);
				this.getCode()
			}
		})
	}

	render() {
		return (
			<div>
				<div className="wrap">
					<p className="headTit">验证管理员</p>
					<div className="from" id='from'>
						<div className="fromItem">
							<input value={this.state.user} onChange={this._onUserInput} type="text" name="username" id='username' placeholder="用户名" />
							
						</div>
						<div className="fromItem mt_20">
							<input value={this.state.psd} onChange={this._onPsdInput} type="password" name="password" id='password' placeholder="密码" />
							
						</div>
						<div className="fromItem mt_20">
							<div style={{width:'100%',display:'flex',flexWrap:'nowrap',justifyContent:'space-between'}}>
								<input value={this.state.code} onChange={this._onCode} type="text" name="code" id='code' placeholder="验证码" />
								<div className="img_wrap" style={{ display: 'flex', alignItems: 'center', width: "115px", marginLeft: '10px', background: '#fff' }}>
									<img onClick={this.getCode} style={{ width: "110px", verticalAlign: 'center' }} src={this.state.img}></img>
								</div>
							</div>
						</div>

						<div onClick={this._onSubmit} className="fromBtn" id="fromBtn"><p>登陆</p></div>
					</div>
					<div className="wrapTip mt_20">
						<span className="tip">提示：请登录管理员账户</span>
					</div>
				</div>
				<style>
					{styleSheet}
				</style>
			</div>
		);
	}
}
const styleSheet = `
#code{
	flex-grow:1;
}
.img_wrap{
	flex-shrink:0;
}
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
a{
    text-decoration : none
}

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

html body{
    overflow-x: hidden;
}

input{
    border: 0px;
    outline: none;
	flex: 1;
	background:transparent;
}
.mt_20{
    margin-top: 20px;
}


.wrap{
    display: flex;
    flex-direction: column;
    padding: 0px 20px;
    padding-top: 70px;
}
.headTit{
    font-size: 26px;
    color: #333333;
}
.from{
    display: flex;
    flex-direction: column;
    padding-top: 50px;
}
.fromItem{
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;
    display: flex;
}
.fromBtn{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 42px;
    background-color: #F4623F;
    border-radius: 5px;
    margin-top: 35px;
    font-size: 16px;
    color: #ffffff;
}

.wrapTip{
    text-align: center;
}
.tip{
    font-size: 12px;
    color: #999999;
}
.tips{
    font-size: 12px;
    color: red;
    display: none;
}
body{
	background: #fff !important;
}
`
export default LoginM

