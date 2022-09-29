import React, { Component } from 'react';
import { Col, Row ,Table} from 'reactstrap';
import { Empty,Modal,Select,Tabs,Card, DatePicker,Menu, Dropdown, Icon, message,Input} from 'antd';
import { Line , Pie } from 'react-chartjs-2';
import {Link} from 'react-router-dom';
import connectComponent from '../../../util/connect';
import _ from 'lodash'
import {Button,Popconfirm} from '../../../components/BtnComponent'

class TmpManager extends Component {
    tmp_list = []
    page_total=0
    page_current=1
    page_size=10

    state={
        edit : true,
        view : true,
    }
    _onPage = (val)=>{
        const {actions} = this.props;
        actions.getTmp({page:val-1})
    }
    _onDelete(tmp_id){

        const {actions} = this.props
        let action = 'delete'

        actions.updateTmp({
            action,
            tmp_id,
            resolved:(data)=>{
                message.success('操作成功')
                actions.getTmp()
            },
            rejected:data=>{
                message.error(data)
            }
        })
    }
    componentDidMount(){
        const {actions} = this.props
        actions.getTmp()
    }

    componentWillReceiveProps(n_props){

        if(this.props.tmp_list !== n_props.tmp_list){
            this.tmp_list = n_props.tmp_list
        }
    }
    render() {
        return (
        <div className="animated fadeIn">
            <Card title="模板管理"  extra={<Button value='tmp/add' onClick={()=>{
                    this.props.history.push("/web-manager/tmp-manager/add-tmp")
                }}>添加模板</Button>} bodyStyle={{paddingTop:0}}>
                <Table hover responsive size="sm" className="v_middle">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>标题</th>
                        <th>内容</th>
                        <th>摘要</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.tmp_list.length == 0?
                        <tr>
                            <td colSpan={8}><Empty className="mt_10" description='暂时没有数据'/></td>
                        </tr>
                    :this.tmp_list.map((ele,index)=>
                        <tr key={index+'tmp'}>
                            <td>{ele.templateId}</td>
                            <td>{ele.title}</td>
                            <td>{ele.content}</td>
                            <td>{ele.summary}</td>
                            <td style={{width:'220px' }}>
                                <div>
                                    <Button value='tmp/view' type="primary" size={'small'} onClick={()=>{
                                        this.props.history.push("/web-manager/tmp-manager/view-tmp/"+index)
                                    }}>查看</Button>
                                    &nbsp;
                                    <Button value='tmp/edit' type="primary" size={'small'} onClick={()=>{
                                        this.props.history.push("/web-manager/tmp-manager/edit-tmp/"+index)
                                    }}>修改</Button>
                                    &nbsp;
                                    <Popconfirm 
                                        value='tmp/del'
                                        title="确定删除吗？"
                                        onConfirm={this._onDelete.bind(this,ele.templateId)}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <Button type="danger" size={'small'}>删除</Button>
                                    </Popconfirm>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </Card>
            
        </div>
        );
    }
}
const LayoutComponent =TmpManager;
const mapStateToProps = state => {
    return {
        tmp_list:state.ad.tmp_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});