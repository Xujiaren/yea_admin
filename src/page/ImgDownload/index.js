import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { Link } from 'react-router-dom';
import { Divider, message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, Tabs, InputNumber } from 'antd'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';

class ImgDownload extends Component {
    state = {
        view_mode: false,
        tab: '1',
        loading: false,
        rowKey: [],
        images: [],
        username: '',
        content: '',
        view_list: [],
        ftype: 2,
    }
    data_list = []
    keywords = ''
    data = [1]
    post_list=[{}]
    page_current = 0
    page_total = 0
    page_size = 10
    componentWillMount() {
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
        }
        this.getActiveReward()
    }
    componentWillReceiveProps(n_props) {
        if (n_props.data_list !== this.props.data_list) {
            this.data_list = n_props.data_list.data;
            this.page_total = n_props.data_list.total
            this.page_current = n_props.data_list.page
        }
    }
    getActiveReward = () => {
        const { actions } = this.props
        actions.getSource(this.state.ftype, this.keywords, this.page_current, this.page_size,0)
    }

    onOk = (val) => {
        console.log(val)
        const { actions } = this.props
        actions.downDelete(val.downId).then(this.getActiveReward())
    }
    // _onView=(val)=>{
    //     console.log(val)
    //     this.setState({
    //         view_list:val.galleryList
    //     })
    // }
    
    render() {
        const { view_mode } = this.state
        return (
            <div className="animated fadeIn">
                <Card title='下载专区管理'  extra={
                    <Button onClick={() => {
                        this.props.history.push('/imgdownload/edit/0/0/0')
                    }}>新建图集</Button>
                }>
                    <Tabs size={{ size: 'small' }} value={this.state.ftype} onChange={(e) => {
                        this.page_current = 0
                        this.setState({
                            ftype: e,
                        }, this.getActiveReward)
                    }}>
                        <Tabs.TabPane tab='图片' key={2}></Tabs.TabPane>
                        <Tabs.TabPane tab='视频' key={1}></Tabs.TabPane>
                    </Tabs>
                    <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                        {this.data_list.map((ele, index) => (
                            <Card
                                key={index}
                                style={{ width: '180px', margin: '10px' }}
                                cover={<img style={{ height: '112px' }} src={ele.imgUrl} />}
                                type='inner' hoverable bordered={true}
                                bodyStyle={{ padding: '10px' }}
                            // onClick={this._onView.bind(this,ele)}
                            >
                                <Card.Meta title={ele.name} description={
                                    <>
                                        <a value={'imgDownLoad/view'} onClick={() => { this.props.history.push('/imgdownload/view/' + ele.downId + '/' + this.page_current+'/'+this.state.ftype) }}>查看</a>
                                        <Divider type='vertical'></Divider>
                                        <a value={'imgDownLoad/edit'} onClick={() => { this.props.history.push('/imgdownload/edit/' + ele.downId + '/' + this.page_current+'/'+this.state.ftype) }}>修改</a>
                                        <Divider type='vertical'></Divider>
                                        <Popconfirm value={'imgDownLoad/delete'} title='确定删除吗？' cancelText='取消' okText='确定' onConfirm={this.onOk.bind(this, ele)}>
                                            <a>删除</a>
                                        </Popconfirm>
                                        <Divider type='vertical'></Divider>
                                        <span>ID:{ele.downId}</span>
                                    </>
                                } />

                            </Card>

                        ))}
                    </div>


                </Card>

                <Table rowKey='id' pagination={false} columns={this.v_col} dataSource={this.post_list} bordered={true}
                        pagination={{
                            current: this.page_current + 1,
                            pageSize: this.page_size,
                            total: this.page_total,
                            showQuickJumper: true,
                            onChange: (val) => {
                                let pathname = this.props.history.location.pathname
                                this.props.history.replace(pathname + '?page=' + val)
                                this.page_current = val - 1
                                this.getActiveReward()

                            },
                            showTotal: (total) => '总共' + total + '条'
                        }} />

                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>


            </div>
        )
    }
    v_col=[]
}

const LayoutComponent = ImgDownload;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        data_list: state.ad.source_list
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
