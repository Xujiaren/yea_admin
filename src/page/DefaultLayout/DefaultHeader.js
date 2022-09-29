import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
import connectComponent from '../../util/connect';
import cookie from  'react-cookies';
import { List, Avatar, message,Icon,Badge as AntdBadge,Dropdown,Menu,Button } from 'antd';
import Chat from '../../components/Chat'
import './DefaultHeader.scss'

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

	constructor(props) {
		super(props);
		this.onShowDrawer = this.onShowDrawer.bind(this)
		this.state={
			msg:0,
			username:'',
			msgList:[{title:'33'},{title:'123'}],
			visible:false,
			msgLoading:false,
		}
	}
	componentDidMount(){
		const {actions}  = this.props
		actions.getTodo()
		actions.user()
	}
	componentWillReceiveProps(n_props){
		if(n_props.todo_info !== this.props.todo_info){
			this.todo_info = n_props.todo_info
			const {
				activityRewards,
				comments,
				feedBacks,
				notShip,
				receipt,
				refund,
				return:_return,
				teacherRview,
				theme
			} = n_props.todo_info
			let msg = 0
			msg =	parseInt(activityRewards) +
					parseInt(comments) +
					parseInt(feedBacks) +
					parseInt(notShip) +
					parseInt(receipt) +
					parseInt(refund) +
					parseInt(_return) +
					parseInt(teacherRview) +
					parseInt(theme)
			if(msg>100)
				msg = '99+'
			
			this.setState({
				msg
			})
		}
		if(cookie.load('admin_name')!==n_props.user.username){
			cookie.save('admin_name', n_props.user.username, { path: '/',maxAge:60*60*24 * 7 })
			this.setState({
				username:n_props.user.username
			})
		}
		if(n_props.user !== this.props.user){
			this.setState({
				username:n_props.user.username
			})
		}
	}
	onShowDrawer(showDrawer) {
		showDrawer();
	}
	toChat(){
		this.props.history.push('/message')
	}
	render() {

		// eslint-disable-next-line
		const { showDrawer, children, ...attributes } = this.props;
		
		return (
			<>
				<AppSidebarToggler className="d-lg-none" display="md" mobile />
				{/**/}
				<AppNavbarBrand
					full={{ src: require('../../assets/img/logo.png'), width: 100, height: 32,}}
					minimized={{ src: require('../../assets/img/logo.png'), width: 30, height: 30,}}
				/>
				<AppSidebarToggler className="d-md-down-none" display="lg" />

				<Nav className="d-md-down-none" navbar>
					<NavItem className="px-3">
						<Link to="#" className="nav-link" >进入网站 ></Link>
					</NavItem>
				</Nav>
				<Nav className="ml-auto" navbar>
					<span className="ant-dropdown-link" onClick={this.toChat.bind(this)}>
						<AntdBadge dot={false}>
							<Icon style={{fontSize:16}} type="bell" />
						</AntdBadge>
						<span>消息</span>
					</span>
					<NavItem className="d-md-down-none" onClick={this.onShowDrawer.bind(this, showDrawer)}>
						<NavLink to="#" className="nav-link"><i className="icon-bell"></i>{this.state.msg?<Badge pill color="danger">{this.state.msg}</Badge>:null}</NavLink>
					</NavItem>
					<NavItem className="d-md-down-none">
						<NavLink to="#" className="nav-link">我的工单</NavLink>
					</NavItem>
					<UncontrolledDropdown nav direction="down">
						<DropdownToggle nav>
							<img src={'../../assets/img/avatars/6.jpg'} className="img-avatar" alt="" />
						</DropdownToggle>

					</UncontrolledDropdown>
					<NavItem className="d-md-down-none">
						<NavLink style={{maxWidth:'100px'}} to="#" className="nav-link text_more">{this.state.username}</NavLink>
					</NavItem>
					<NavItem className="d-md-down-none">
						<NavLink to="#" onClick={e => this.props.onLogout(e)} className="nav-link">退出</NavLink>
					</NavItem>
				</Nav>

				{/*<AppAsideToggler className="d-md-down-none" />*/}
				{/*<AppAsideToggler className="d-lg-none" mobile />*/}
			</>
		);
	}
}

const LayoutComponent = DefaultHeader;
const mapStateToProps = state => {
    return {
		user:state.site.user,
		todo_info:state.dashboard.todo_info
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});