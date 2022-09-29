import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import { Spin, Drawer, message } from 'antd';
import connectComponent from "../util/connect";
import {
	AppAside,
	AppFooter,
	AppHeader,
	AppSidebar,
	AppSidebarFooter,
	AppSidebarForm,
	AppSidebarHeader,
	AppSidebarMinimizer,
	AppBreadcrumb2 as AppBreadcrumb,
	AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';

// routes config
import routes from '../config/routes';
import TodoList from './WorkBench/TodoList';

import moment from 'moment';
import 'moment/locale/zh-cn';

import _ from 'lodash'
import * as _nav from '../config/_nav';

import qs from 'qs';
import cookie from 'react-cookies'

const DefaultAside = React.lazy(() => import('./DefaultLayout/DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultLayout/DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultLayout/DefaultHeader'));
const Page400 =  React.lazy(() => import('./Page400'));

function genMenu(list,rule){
	let res = []

	//一层
	list.map(ele=>{
		let item = { ...ele }
		if('key' in ele){
			if('children' in ele && Array.isArray( ele['children'] )){
				let child = []
				//二层
				ele['children'].map(_ele=>{
					if('key' in _ele && rule.includes(_ele['key'])){
						if('children' in _ele && Array.isArray( _ele['children'] )){
							//三层
							let _item = _ele['children'].filter(__ele=>{
								return rule.includes(__ele['key'])
							})
							if(_item.length !== 0)
								_ele['children'] = [..._item]
						}
						child.push(_ele)
					}
				})
				item['children'] = child
				
				if(child.length !== 0){
					res.push(item)
				}
			}else if( rule.includes(ele['key']) ){
				res.push(item)
			}
		}
	})
	return res
}
class Main extends Component {

	loading = () => <Spin size="large" className="mt_30 block_center" />;

	signOut(e) {
		
		const { actions } = this.props;
		actions.logout({
			resolved: (data) => {
				this.props.history.push('/login')
				cookie.remove('SESSION',{ path: '/' })
				cookie.remove('admin_name', { path: '/' })
			},
			rejected: (msg) => {
				if(msg=='please login first'){
					this.props.history.push('/login')
					cookie.remove('SESSION',{ path: '/' })
					cookie.remove('admin_name', { path: '/' })
				}
			}
		});
		e.preventDefault()
	}
	state = { 
		visible: false,
		user:{rule:[]},
		menu:[]
	};
	

	showDrawer = () => {
		this.setState({
			visible: !this.state.visible,
		});
	};

	componentDidMount() {
		const {actions} = this.props
		moment.locale('zh-cn');
		actions.user()
		message.config({
			top: 80,
			duration: 2,
			maxCount: 1,
		})
		

	}
	componentWillUnmount() {

	}

	componentWillReceiveProps(n_props) {
		const {user} = n_props
		if(Array.isArray(user.rule) && Array.isArray(this.props.user.rule))
		if (user.rule !== this.props.user.rule || user.rule.length !== this.props.user.rule.length) {
			let navigation = [..._nav.navigation]
			let username = cookie.load('admin_name')
			if (!user.roleId || typeof username == 'undefined') {
				message.info({
					content: '用户未登录',
					onClose:()=>{
						this.props.history.replace("/login");
					}
				})
			}else{
				if(user.rule.includes('*')){
					this.setState({ menu: navigation })
				}else{
					let menu = [...genMenu([...navigation], user.rule)]
					this.setState({ menu })
				}
				
			}
		}
	}
	onClose = () => {
		this.setState({
			visible: false,
		});
	};
	

	render() {
		return (
			<div className="app">
				<AppHeader fixed>
					<Suspense fallback={this.loading()}>
						<DefaultHeader {...this.props} onLogout={e => this.signOut(e)} showDrawer={this.showDrawer} />
					</Suspense>
				</AppHeader>
				<div className="app-body">
					<AppSidebar fixed display="lg">
						<AppSidebarHeader />
						<AppSidebarForm />
						<Suspense>
							<AppSidebarNav navConfig={{items:this.state.menu}} {...this.props} router={router} />
						</Suspense>
						<AppSidebarFooter />
						<AppSidebarMinimizer />
					</AppSidebar>
					<main className="main" style={{ overflowX: 'scroll'}}>
						<AppBreadcrumb appRoutes={routes} router={router} />
						<Container fluid>
							<Drawer
								title="待办事项"
								placement="right"
								closable={true}
								mask={false}
								onClose={this.onClose}
								visible={this.state.visible}
								width={500}
								style={{ top: '55px', height: '100vh' }}
								bodyStyle={{ padding: '10px' }}
							>
								{
									this.props.rule.includes('todo')?
									<TodoList />:
									<Page400></Page400>
								}
							</Drawer>
							<Suspense fallback={this.loading()}>
								<Switch>
									{routes.map((route, idx) => {
										return route.component ? (
											<Route
												key={idx}
												path={route.path}
												exact={route.exact}
												name={route.name}
												render={props =>{
													if(route.key && !this.props.rule.includes(route.key)){
														return <Page400/>
													}
													return <route.component {...props} />
												}} />
										) : (null);
									})}
									<Redirect from="/" to="/todo-list" />
								</Switch>
							</Suspense>
						</Container>
					</main>
					<AppAside fixed>
						<Suspense fallback={this.loading()}>
							<DefaultAside />
						</Suspense>
					</AppAside>
				</div>
				<AppFooter>
					<Suspense fallback={this.loading()}>
						<DefaultFooter />
					</Suspense>
				</AppFooter>
			</div>
		);
	}
}

const LayoutComponent = Main;
const mapStateToProps = state => {
	return {
		rule: state.site.user.rule,
		user:state.site.user
	}
}

export default connectComponent({ LayoutComponent, mapStateToProps })