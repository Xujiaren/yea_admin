import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, Tabs } from 'antd'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload';

class Mood extends Component {
    state = {
        view_mode: false,
        tab: 1,
        loading: false,
        rowKey: [],
        images: [],
        username: '',
        content: '',
        mood_list: {},
        moods_list: {},
        mood: [],
        moods: [],
        moodss: [],
        searchs: '',
        exportLoading: false,
        vies: 0,
    }
    page_current = 0
    page_total = 0
    page_size = 10
    page_currents = 0
    page_totals = 0
    page_currentss = 0
    page_totalss = 0


    componentWillMount() {
        const { search } = this.props.history.location
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page
            this.page_currents = page
            this.page_currentss = page
        }
        this.getMood()
        this.getMoods()
        this.getMoodss()
    }
    getMood = () => {
        const { actions } = this.props
        actions.getMood({
            keyword: this.state.searchs,
            page: this.page_current,
            pageSize: this.page_size,
            status: 0
        })
    }
    getMoods = () => {
        const { actions } = this.props
        actions.getMoods({
            keyword: this.state.searchs,
            page: this.page_currents,
            pageSize: this.page_size,
            status: 1
        })
    }
    getMoodss = () => {
        const { actions } = this.props
        actions.getMoodss({
            keyword: this.state.searchs,
            page: this.page_currentss,
            pageSize: this.page_size,
            status: 2
        })
    }
    componentWillReceiveProps(n_props) {
        if (n_props.mood_list !== this.props.mood_list) {
            this.setState({
                mood: n_props.mood_list.data
            })
            this.page_current = n_props.mood_list.page
            this.page_total = n_props.mood_list.total
        }

        if (n_props.moods_list !== this.props.moods_list) {
            this.setState({
                moods: n_props.moods_list.data
            })
            this.page_currents = n_props.moods_list.page
            this.page_totals = n_props.moods_list.total
        }
        if (n_props.moodss_list !== this.props.moodss_list) {
            this.setState({
                moodss: n_props.moodss_list.data
            })
            this.page_currentss = n_props.moodss_list.page
            this.page_totalss = n_props.moodss_list.total
        }
    }
    onShenhe = (val) => {
        const { actions } = this.props
        actions.publishMood({
            mood_id: val.moodId,
            status: 1,
            resolved: (res) => {
                console.log(res)
                message.success({
                    content: '????????????',
                    onClose: () => {
                        this.setState({ loading: false })
                    }
                })
                this.getMood()
                this.getMoods()
                this.getMoodss()

            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onShenhes = (val) => {
        const { actions } = this.props
        actions.publishMood({
            mood_id: val.moodId,
            status: 2,
            resolved: (res) => {
                console.log(res)
                // message.success({
                //     content: '????????????',
                //     onClose: () => {
                //         this.setState({ loading: false })
                //     }
                // })
                this.getMood()
                this.getMoods()
                this.getMoodss()

            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    info = (record) => {
        const { img } = record
        if (img instanceof Array)
            return <>
                {
                    img.map(ele => <img src={ele} className='head-example-img m_2' style={{ display: 'inline-block' }} onClick={() => {
                        this.setState({ showImgPanel: true, previewImage: ele })
                    }}></img>)
                }
                <div className='mt_10'>{record.content}</div>
            </>
        else return null
    }
    onchange = (tab) => {
        this.setState({ tab })
        this.page_current = 0
        this.page_currents = 0
        this.page_currentss = 0
        this.setState({
            searchs: ''
        })
        const { actions } = this.props
        actions.getMood({
            keyword: '',
            page: this.page_current,
            pageSize: this.page_size,
            status: 0
        })
        actions.getMoods({
            keyword: '',
            page: this.page_currents,
            pageSize: this.page_size,
            status: 1
        })
        actions.getMoodss({
            keyword: '',
            page: this.page_currentss,
            pageSize: this.page_size,
            status: 2
        })
    }
    upLoad = (val) => {
        console.log(val)
        const { actions } = this.props
        if (val.status == 1) {
            actions.publishMood({
                mood_id: val.moodId,
                status: 2,
                resolved: (res) => {
                    console.log(res)
                    message.success({
                        content: '?????????',
                        onClose: () => {
                            this.setState({ loading: false })
                        }
                    })
                    this.getMoods()
                    this.getMoodss()
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else if (val.status == 2) {
            actions.publishMood({
                mood_id: val.moodId,
                status: 1,
                resolved: (res) => {
                    console.log(res)
                    message.success({
                        content: '?????????',
                        onClose: () => {
                            this.setState({ loading: false })
                        }
                    })
                    this.getMoods()
                    this.getMoodss()
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        }
    }
    onSearch = () => {
        const { searchs, tab } = this.state
        if (parseInt(tab) == 1) {
            this.getMood()
        }
        if (parseInt(tab) == 2) {
            this.getMoods()
        }
        if (parseInt(tab) == 3) {
            this.getMoodss()
        }
    }
    onOut = () => {
        var that = this
        this.setState({
            exportLoading: true
        })
        this.props.actions.getOuts({
            begin_time: '',
            resolved: (data) => {
                console.log(data)
                const url = data.adress
                this.setState({
                    exportLoading: false
                })
                message.success({
                    content: '????????????',
                    onClose: () => {
                        window.open(url, '_black')
                    }
                })
            },
            rejected: (err) => {
                that.setState({ exportLoading: false })
                message.error('????????????')
            }
        })
    }
    render() {
        const { view_mode, mood, moods, moodss, tab, searchs } = this.state
        return (
            <div className="animated fadeIn">
                <Card title='???????????????' extra={
                    <>
                        <Button className='m_2' onClick={this.onOut} loading={this.state.exportLoading}>????????????</Button>
                    </>
                }>
                    <Input.Search className='m_w200' placeholder='??????/?????????/??????' value={searchs} onChange={e => this.setState({ searchs: e.target.value })} onSearch={this.onSearch}></Input.Search>

                    <Tabs activeKey={this.state.tab} onChange={this.onchange} className='mt_10 mb_10'>
                        <Tabs.TabPane key='1' tab='?????????'></Tabs.TabPane>
                        <Tabs.TabPane key='2' tab='?????????'></Tabs.TabPane>
                        <Tabs.TabPane key='3' tab='?????????'></Tabs.TabPane>
                    </Tabs>
                    <Table
                        expandedRowRender={this.info}
                        expandedRowKeys={this.state.rowKey}
                        onExpandedRowsChange={(rowKey) => {
                            this.setState({ rowKey })
                        }}

                        loading={this.state.loading}
                        columns={this.col}
                        dataSource={tab == '1' ? mood : tab == '2' ? moods : tab == '3' ? moodss : null}
                        pagination={{
                            current: tab == '1' ? this.page_current + 1 : tab == '2' ? this.page_currents + 1 : tab == '3' ? this.page_currentss + 1 : null,
                            pageSize: this.page_size,
                            total: tab == '1' ? this.page_total : tab == '2' ? this.page_totals : tab == '3' ? this.page_totalss : null,
                            showQuickJumper: true,
                            onChange: (val) => {
                                if (tab == '1') {
                                    let pathname = this.props.history.location.pathname
                                    this.props.history.replace(pathname + '?page=' + val)
                                    this.page_current = val - 1
                                    this.getMood()
                                } else if (tab == '2') {
                                    let pathname = this.props.history.location.pathname
                                    this.props.history.replace(pathname + '?page=' + val)
                                    this.page_currents = val - 1
                                    this.getMoods()
                                } else if (tab == '3') {
                                    let pathname = this.props.history.location.pathname
                                    this.props.history.replace(pathname + '?page=' + val)
                                    this.page_currentss = val - 1
                                    this.getMoodss()
                                }

                            },
                            showTotal: (total) => '??????' + total + '???'
                        }}
                    />
                </Card>

                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="????????????" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal okText='??????' cancelText='??????' onOk={() => {
                    message.success('????????????')
                    this.setState({ editPanel: false})
                }} visible={this.state.editPanel} maskClosable={false} onCancel={() => {
                    this.setState({ editPanel: false})
                }}>
                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                        <Form.Item label='?????????'>{this.state.username}</Form.Item>
                        <Form.Item label='????????????'>
                            <Input.TextArea autoSize={{ minRows: 4 }} value={this.state.content} onChange={(e) => this.setState({ content: e.target.value })}></Input.TextArea>
                        </Form.Item>
                        <Form.Item label='????????????'>
                            {
                                this.state.vies == 0 ?
                                    <AntdOssUpload
                                        value={this.state.images}
                                        // accept='image/*'
                                        actions={this.props.actions}
                                        ref={ref => this.img = ref}
                                        maxLength={80}
                                    ></AntdOssUpload>
                                    :
                                    <video controls src={this.state.images.length>0?this.state.images[0].url:null} style={{ width: '300px' }} />        
                            }
                            {/* <div style={{ color: 'red', fontSize: '12px' }}>???????????????????????????????????????????????????????????????????????????</div> */}
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        )
    }
    onEdit(ele) {
        let images = []
        let vies = 0
        ele.galleryList.map(ele => {
            console.log(ele,'???')
            if (ele.fpath.search('mp4') != -1) {
                images.push({
                    uid: ele.galleryId,
                    type: 'video/mp4',
                    status: 'done',
                    url: ele.fpath,
                })
                vies = 1
            } else {
                images.push({
                    uid: ele.galleryId,
                    type: 'image/png',
                    status: 'done',
                    url: ele.fpath,
                })
                vies = 0
            }

        })
        this.setState({ images:images,vies:vies, content: ele.content, username: ele.nickname, editPanel: true })
    }
    col = [
        { dataIndex: 'moodId', key: 'moodId', title: 'ID', width: 50 },
        { dataIndex: 'nickname', key: 'nickname', title: '?????????' },
        { dataIndex: 'content', key: 'content', title: '??????', ellipsis: true },
        // { dataIndex:'courseImg',key:'courseImg',title:'????????????',width:90,render:(item,ele)=>{
        //     return(
        //         <img src='' className='head-example-img' onClick={()=>{
        //             this.setState({ showImgPanel: true })
        //         }}></img>
        //     )
        // }},
        { dataIndex: 'pubTime', key: 'pubTime', title: '????????????', render: (item, ele) => moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm') },
        {
            dataIndex: 'status', key: 'status', title: '??????', render: (item, ele) => {
                if (this.state.tab == '1') return '?????????'
                return ele.status == 1 ? '?????????' : '?????????'
            }
        },
        {
            width: 250, dataIndex: '', key: '', title: '??????', render: (item, ele, index) => {
                return (
                    <>
                        {this.state.tab == 1 ?
                            <>
                                <Popconfirm title='???????????????' okText='??????' cancelText='??????' onCancel={this.onShenhes.bind(this, item, ele)} onConfirm={this.onShenhe.bind(this, item, ele)}>
                                    <Button size='small' className='m_2' type={'primary'}>??????</Button>
                                </Popconfirm>
                                <Button size='small' className='m_2' onClick={this.onEdit.bind(this, ele)}>??????</Button>
                            </>
                            :
                            <>
                                <Button size='small' className='m_2'>{ele.status == 1 ? '????????????' : '????????????'}</Button>
                                <Button size='small' className='m_2' type={ele.status == 1 ? 'primary' : ''} onClick={this.upLoad.bind(this, item, ele)}>{item.status == 2 ? '??????' : '??????'}</Button>
                                <Button size='small' className='m_2' onClick={this.onEdit.bind(this, ele)}>??????</Button>
                            </>
                        }
                    </>
                )
            }
        },
    ]
}

const LayoutComponent = Mood;
const mapStateToProps = state => {
    return {
        user: state.site.user,
        mood_list: state.meet.mood_list,
        moods_list: state.meet.moods_list,
        moodss_list: state.meet.moodss_list,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
