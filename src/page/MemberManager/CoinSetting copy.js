import React, { Component } from 'react';
import { Col, Row ,Table} from 'reactstrap';
import {Empty, Select,Tabs,Card, DatePicker,Menu, Dropdown, Button, Icon, message,Input,InputNumber} from 'antd';
import { Line , Pie } from 'react-chartjs-2';
import {Link} from 'react-router-dom';
import connectComponent from '../../util/connect'
import {interval} from '../../config/config';
import _ from 'lodash'

const { TabPane } = Tabs;
const { Search } = Input;
const {Option} = Select;

class CoinSetting extends Component {
    integral_list = []
    se_list = []
    state={
        integral_list:[
            {id:1,integral:0,max_integral:0}
        ],
        se_list:[
            {id:1,integral:0,max_integral:0}
        ]
    }

    edit = false
    view = false

 
    componentDidMount(){
        const {actions} = this.props
        actions.getIntegral()
    }
    componentWillReceiveProps(nextProps){
        const tmp_list = []
        const se_tmp_list = []
       
        if(nextProps.integral_list !== this.props.integral_list){
            
            nextProps.integral_list.map((ele,index)=>{
                let _tmp = {id:ele.id,integral:ele.integral,max_integral:ele.maxIntegral}  
               
                if(ele.type == 1){
                    se_tmp_list.push(_tmp)
                    this.se_list.push(ele)
                }else{
                    tmp_list.push(_tmp)
                    this.integral_list.push(ele)
                }
            })
            
            this.setState({
                integral_list:tmp_list,
                se_list:se_tmp_list
            })
        }
    }
    _onPublish = ()=>{
        const {actions} = this.props;
        const {integral_list} = this.state;
        let json = JSON.stringify(integral_list);

        actions.publishIntegral({
            json,
            resolved:(data)=>{
                message.success("提交成功")
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onSePublish = ()=>{
        const {actions} = this.props;
        const {se_list} = this.state;
        let json = JSON.stringify(se_list);

        actions.publishIntegral({
            json,
            resolved:(data)=>{
                message.success("提交成功")
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    
    _onInput(index,val){ 
        if(val !== ''&&!isNaN(val)){
            val = Math.round(val)
            if(val<0) val=0
            this.setState((pre)=>{
                let _list = pre.integral_list
                _list[index].integral = val
                return{
                    integral_list:_list
                }
            })
        }
    }
    _onMaxInput(index,val){ 
        if(val !== ''&&!isNaN(val)){
            val = Math.round(val)
            if(val<0) val=0
            this.setState((pre)=>{
                let _list = pre.integral_list
                _list[index].max_integral = val
                return{
                    integral_list:_list
                }
            })
        }
    }
    _onSeInput(index,val){ 
        if(val !== ''&&!isNaN(val)){
            val = Math.round(val)
            if(val<0) val=0
            this.setState((pre)=>{
                let _list = pre.integral_list
                _list[index].integral = val
                return{
                    se_list:_list
                }
            })
        }
    }
    
    render() {
        const {integral_list,se_list} = this.state;
        return (
        <div className="animated fadeIn">
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="系统赠送规则设置" key="1">
                        <div>
                            <Table  hover bordered responsive size="sm" className="v_middle">
                                <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>描述</th>
                                        <th>获得金币</th>
                                        <th>上限金币</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.integral_list.length == 0?
                                    <tr><td colSpan={4}>
                                        <Empty className="mt_10" description="暂时没有数据"/>
                                    </td></tr>
                                :
                                this.integral_list.map((ele,index)=>(
                                    <tr key={index+'inte'}>
                                        <td>{index+1}</td><td>{ele.intro}</td>
                                        <td>
                                            <InputNumber onChange={this._onInput.bind(this,index)} value={integral_list[index].integral} placeholder='输入金币'/>
                                        </td>
                                        <td>
                                            <InputNumber onChange={this._onMaxInput.bind(this,index)} value={integral_list[index].max_integral} placeholder='上限金币'/>
                                        </td>
                                    </tr>
                                )) 
                                }
                                </tbody>
                        </Table>
                        {this.integral_list.length == 0?null:
                            <Button onClick={this._onPublish}>提交</Button>
                        }
                        </div>
                    </TabPane>
                    <TabPane tab="金币消耗规则设置" key="2">
                        <div>
                            <Card type='inner' title="翻牌抽奖">
                                <Table  hover bordered responsive size="sm" className="v_middle">
                                    <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>描述</th>
                                        <th>消耗金币</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.se_list.length == 0?
                                        <tr><td colSpan={3}>
                                            <Empty className="mt_10" description="暂时没有数据"/>
                                        </td></tr>
                                    :
                                    this.se_list.map((ele,index)=>(
                                        <tr key={index+'inte'}>
                                            <td>{index+1}</td><td>{ele.intro}</td>
                                            <td>
                                                <InputNumber onChange={this._onSeInput.bind(this,index)} value={se_list[index].integral} placeholder='输入金币'/>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                                <Button onClick={this._onSePublish}>提交</Button>
                            </Card>
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
        );
    }
}

const LayoutComponent = CoinSetting;
const mapStateToProps = state => {
    return {
        integral_list : state.user.integral_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});