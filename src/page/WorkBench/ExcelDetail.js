import React, { Component } from 'react';
import { Row ,Col,} from 'reactstrap';
import { Table,Divider,Spin,Card,Select ,Input,Button} from 'antd';
import connectComponent from '../../util/connect';
import config from '../../config/config'

const {Option} = Select;

class ExcelDetail extends Component {
    state={
        url:''
    }
    componentWillMount(){

    }
    excel_list = [
        {id:'1',}
    ]
    column = [
        {
            key:1,
            name:'报表',
            dataIndex:'1',
            ellipsis:false,
        },
        {
            key:2,
            name:'操作',
            dataIndex:'2',
            ellipsis:false,
            render:(item,record)=>(
                <span>
                    <a onClick={this.state.view_mode?null:()=>{
                        this.props.history.push('/workbench/excel-manager/excel-detail?url='+record.url)
                    }}>查看</a>
                    <Divider type="vertical" />
                    <a href={record.url} target='_black'>下载</a>
                </span>
            )
        }
    ]
    onLoad =()=>{
        console.log('onLoad')
    }
    render(){

        return(
            <div className="animated fadeIn mb_10">
                <Row>
                    <Col xs="12">
                        <Card title="报表管理">
                            <Card type='inner' className="mt_10" bodyStyle={{minHeight:'610px',padding:0}}>
                            <Table dataSource={this.excel_list} columns={this.columns} rowKey={'id'} tableLayout={'fixed'} size={'middle'} pagination={false} />
                            </Card>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

const LayoutComponent =ExcelDetail;
const mapStateToProps = state => {
    return {

    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
