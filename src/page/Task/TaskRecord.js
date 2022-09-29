import React, { Component } from 'react';
import moment from 'moment'
import {Table,Card,PageHeader, message,Input, Spin} from 'antd';
import connectComponent from '../../util/connect';

class TaskRecord extends Component {
    state = {
        pageSize: 10,
        total:0,
        page:0,
        keyword:'',
        data:[],
        loading:false
    };

    componentDidMount(){
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }
        this.getTaskLog()
    }
    getTaskLog = ()=>{
        this.setState({ loading:true })
        const {page,pageSize,keyword} = this.state
        this.props.actions.getTaskLog({
            page:page,pageSize:pageSize,keyword:keyword,
            resolved:(res)=>{
                const {page,total ,data} = res
                this.setState({ page, data, total})
                this.setState({ loading:false })
            },
            rejected:()=>{
                this.setState({ loading:false })
            }
        })
    }
    render() {
        return (
            <div className="animated fadeIn">
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    subTitle="任务记录"
                >
                <Spin spinning={this.state.loading}>
                <Card>
                    <Table dataSource={this.state.data} rowKey='recId' columns={[
                        {dataIndex:'recId',key:'recId',title:'ID'},
                        {dataIndex:'username',key:'username',title:'用户',render:(item,ele)=>{
                            if(ele.user && 'username' in ele.user){
                                return ele.user.username||'暂无'
                            }else{
                                return '暂无'
                            }
                        }},
                        {dataIndex:'taskName',key:'taskName',title:'任务名称',render:(item,ele)=>{
                            if(ele.task && 'taskName' in ele.task){
                                return ele.task.taskName||'暂无'
                            }else{
                                return '暂无'
                            }
                        }},
                        {dataIndex:'integral',key:'integral',title:'积分'},
                        {dataIndex:'pubTime',key:'pubTime',title:'时间',render:(item,ele)=>{
                            return moment.unix(ele.pubTime).format('YYYY-MM-DD')
                        }}
                    ]}
                    pagination={{
                        current: this.state.page + 1,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                        showQuickJumper: true,
                        onChange: (val) => {
                            let pathname = this.props.history.location.pathname
                            this.props.history.replace(pathname + '?page=' + val)
                            this.setState({
                                page:val-1
                            },()=>{
                                this.getTaskLog()
                            })
                            
                            // this.getMallGoods()
                        },
                        showTotal: (total) => '总共' + total + '条'
                    }}
                    >
                        
                    </Table>
                </Card>
                </Spin>
                </PageHeader>
            </div>
        );
    }
}

const LayoutComponent = TaskRecord;
const mapStateToProps = state => {
    return {
        site_type: state.site.site_type,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
