import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './redux';

// import { renderRoutes } from 'react-router-config';
import { ConfigProvider } from 'antd';
import './App.scss';
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';

const loading = () => <div className="animated fadeIn pt-3 text-center pad_t50">加载中...</div>;

// Containers
const Main = React.lazy(() => import('./page/Main'));

// Pages
const LoginM = React.lazy(() => import('./page/LoginM'));
const Login = React.lazy(() => import('./page/Login'));
const Page404 = React.lazy(() => import('./page/Page404'));
const Page500 = React.lazy(() => import('./page/Page500'));
const LiveView = React.lazy(() => import('./page/Live/LiveView'));
const UserApply = React.lazy(() => import('./page/AuthMng/UserApply'));
class App extends Component {

  render() {
    const appstore = configureStore();
    return (
      <ConfigProvider locale={zhCN}>
      <Provider store={appstore}>
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/loginM" name="验证管理员" render={props => <LoginM {...props}/>} />
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/userCheck/:squad/:id" name="签到" render={props => <UserApply {...props}/>} />
              <Route exact path="/room/:id" name="LIVE Page" render={props => <LiveView {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <Main {...props}/>} />
              
            </Switch>
          </React.Suspense>
      </HashRouter>
      </Provider>
      </ConfigProvider>
    );
  }
}

export default App;
