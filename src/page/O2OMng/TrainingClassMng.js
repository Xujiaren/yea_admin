import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Table as TableAntd, List, Icon, Upload, Tag, Checkbox, Tabs, DatePicker, message, Pagination, Switch, Modal, Form, Card, Select, Input, Radio, Tooltip } from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment'
import { Button, Popconfirm } from '../../components/BtnComponent'

const { Search } = Input;

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class TrainingClassMng extends Component {
    state = {

        edit: true,
        view: true,
        visible: false,
        isView: false,
        title: '',

        status: -1,
        stype: 0,
        keyword: '',
        previewImage: '',
        showImgPanel: false,

        fileList: [],

        squad_id: '0',
        excelFileList: [],
        importLoading: false,
        showImportPannel: false,
        rejectedUser: [],
        loads: false,
        type: 0,
    };
    page_total = 0
    page_current = 1
    page_size = 10
    squad_list = []

    componentWillMount() {
        const { actions } = this.props;
        const { search } = this.props.history.location
        const pageSize = this.page_size
        const { keyword, stype, status } = this.state

        let page = 0

        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_current = page + 1
        }

        actions.getSquad({
            keyword, stype, status, pageSize, page
        })
    }

    componentWillReceiveProps(n_props) {

        if (n_props.squad_list !== this.props.squad_list) {
            this.squad_list = n_props.squad_list.data
            this.page_total = n_props.squad_list.total
            this.page_current = n_props.squad_list.page + 1
        }
    }
    _onPage = (val) => {
        const { actions } = this.props;
        const pathname = this.props.history.location.pathname
        this.props.history.replace(pathname + '?page=' + val)

        actions.getSquad({
            keyword: this.state.keyword,
            stype: this.state.stype,
            status: this.state.status,
            pageSize: this.page_size,
            page: val - 1
        })
    }
    _onUpdate(squad_id, action) {
        const { actions } = this.props
        actions.actionSquad({
            action, squad_id,
            resolved: (data) => {
                message.success("????????????")
                actions.getSquad({
                    keyword: this.state.keyword,
                    stype: this.state.stype,
                    status: this.state.status,
                    pageSize: this.page_size,
                    page: this.page_current - 1
                })
            },
            rejected: (data) => {
                message.error('????????????')
            }
        })
    }
    _onSearch = (val) => {
        const { actions } = this.props

        actions.getSquad({
            keyword: val,
            stype: this.state.stype,
            status: this.state.status,
            pageSize: this.page_size,
            page: 0
        })
    }


    showImgPanel(url) {
        this.setState({
            showImgPanel: true,
            previewImage: url
        });
    }
    hideImgPanel = () => {
        this.setState({
            showImgPanel: false
        });
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            showImgPanel: true,
        });
    };
    importUser = () => {
        this.setState({ importLoading: true })

        const { actions } = this.props
        const { excelFileList, squad_id } = this.state;
        const that = this
        let file = new FormData();

        if (excelFileList.length === 0 || squad_id == '0') {
            message.info('?????????Excel??????')
            this.setState({ importLoading: false })
            return;
        }

        file.append('file', excelFileList[0]);
        file.append('squad_id', squad_id)
        file.append('type', this.state.type)
        actions.importSquadUser({
            file: file,
            resolved: (data) => {
                message.success('????????????')
                that.setState({ importLoading: false, showImportPannel: false, excelFileList: [] }, () => {

                    let rejectedUser = []
                    if(data.fail){
                        Object.keys(data.fail).map(ele => {
                            rejectedUser.push(data.fail[ele])
                        })
                        that.setState({
                            showResult: true,
                            rejectedUser: rejectedUser,
                            success: data.success,
                            total: data.total
                        })
                    }
                    
                })
            },
            rejected: (data) => {
                this.setState({ importLoading: false })
                message.error('???????????? ????????????Excel?????????????????????????????????2??????')
            }
        })
    }
    showImportPannel(squadId) {
        const that = this
        that.setState({ showImportPannel: true, squad_id: squadId })
    }
    onExports = (val) => {
        this.setState({
            loads: true
        })
        this.props.actions.getCertificationExport({
            squad_id: val,
            resolved: (res) => {
                if (res.address) {
                    message.success({
                        content: '????????????'
                    })
                    window.open(res.address)
                    this.setState({
                        loads: false
                    })
                } else {
                    message.info({
                        content: '????????????'
                    })
                    this.setState({
                        loads: false
                    })
                }

            },
            rejected: (err) => {
                this.setState({
                    loads: false
                })
            }
        })
    }
    render() {

        const { keyword, excelFileList, importLoading } = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
            },
        };
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="???????????????">
                            <div className='min_height'>
                                <div className="flex f_row j_space_between align_items mb_10">

                                    <div className='flex f_row align_items'>
                                        <Search
                                            placeholder=''
                                            onSearch={this._onSearch}
                                            style={{ maxWidth: 200 }}
                                            value={keyword}
                                            onChange={e => { this.setState({ keyword: e.target.value }) }}
                                        />
                                    </div>
                                    <div>
                                        <Button value='o2oClass/add' onClick={() => {
                                            this.props.history.push('/o2o/edit/0')
                                        }}>??????</Button>
                                    </div>
                                </div>
                                <Table responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>ID</th>
                                            <th>???????????????</th>
                                            <th>?????????</th>
                                            <th>??????</th>
                                            <th>????????????</th>
                                            <th>??????????????????</th>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th style={{ width: '300px' }}>??????</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.squad_list.map((ele, index) => (
                                            <tr key={ele.squadId}>
                                                <td>
                                                </td>
                                                <td>{ele.squadId}</td>
                                                <td style={{ maxWidth: '200px' }}>
                                                    <Tooltip title={ele.squadName}>
                                                        <div className='text_more'>{ele.squadName}</div>
                                                    </Tooltip>
                                                    <div className='be_ll_gray'>
                                                        <Tooltip title={`/subPages/pages/user/qualification/myTranDetail?squadId=${ele.squadId}&type=0&stype=0`}>
                                                            <a>????????????</a>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                                <td style={{ maxWidth: '260px' }}>
                                                    <Tooltip title={ele.summary}>
                                                        <div className='text_more'>{ele.summary}</div>
                                                    </Tooltip>
                                                </td>
                                                <td>
                                                    <a>
                                                        <img onClick={this.showImgPanel.bind(this, ele.squadImg)} className="head-example-img" src={ele.squadImg} />
                                                    </a>
                                                </td>
                                                <td>{moment.unix(ele.applyBegin).format('YYYY-MM-DD')}</td>
                                                <td>{moment.unix(ele.applyEnd).format('YYYY-MM-DD')}</td>
                                                <td>{moment.unix(ele.beginTime).format('YYYY-MM-DD')}</td>
                                                <td>{moment.unix(ele.endTime).format('YYYY-MM-DD')}</td>
                                                <td>{ele.location}</td>
                                                <td>{ele.enrollNum}</td>
                                                <td>{ele.registeryNum}</td>
                                                <td>
                                                    <div>
                                                        <Button value='o2oClass/status' type={ele.status == 1 ? "primary" : ''} className='m_2' size={'small'} onClick={this._onUpdate.bind(this, ele.squadId, 'status')}>{ele.status == 1 ? '??????' : '??????'}</Button>
                                                        <Button value='o2oClass/in' className='m_2' size={'small'} onClick={this.showImportPannel.bind(this, ele.squadId)}>??????</Button>
                                                        <Button value='o2oClass/view' onClick={() => {
                                                            this.props.history.push({
                                                                pathname: '/o2o/edit/' + ele.squadId,
                                                                state: { type: "view" }
                                                            })
                                                        }} type="primary" size={'small'} className='m_2'>??????</Button>
                                                        <Button
                                                            value='o2oClass/user'
                                                            onClick={e => {
                                                                this.props.history.push({
                                                                    pathname: '/o2o/o2oClass/user/' + ele.squadId,
                                                                    state: { view: false }
                                                                })
                                                            }} type="primary" size={'small'} className='m_2'>
                                                            ????????????
                                                        </Button>
                                                        <Button value='o2oClass/edit' onClick={() => {
                                                            this.props.history.push({
                                                                pathname: '/o2o/edit/' + ele.squadId,
                                                                state: { type: "edit" }
                                                            })
                                                        }} type="primary" size={'small'} className='m_2'>??????</Button>
                                                        <Popconfirm
                                                            value='o2oClass/del'
                                                            okText="??????"
                                                            cancelText='??????'
                                                            title='??????????????????'
                                                            onConfirm={this._onUpdate.bind(this, ele.squadId, 'delete')}
                                                        >
                                                            <Button className='m_2' size={'small'}>??????</Button>
                                                        </Popconfirm>
                                                        <Button size='small' loading={this.state.loads} className='m_2' onClick={this.onExports.bind(this, ele.squadId)}>??????????????????</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Pagination pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />

                        </Card>
                    </Col>
                </Row>

                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="??????????????? ??????" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>

                <Modal
                    zIndex={6001}
                    title='??????'
                    visible={this.state.showCheckPanel}
                    closable={true}
                    maskClosable={true}
                    okText='??????'
                    cancelText='??????'
                    onCancel={() => {
                        this.setState({ showCheckPanel: false })

                    }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="????????????">
                            <Input placeholder='????????????????????????????????????' />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title='??????'
                    visible={this.state.showImportPannel}
                    closable={true}
                    maskClosable={true}
                    okText='????????????'
                    cancelText='??????'
                    onCancel={() => {
                        this.setState({ showImportPannel: false })
                    }}
                    onOk={this.importUser}
                    confirmLoading={importLoading}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="??????????????????">
                            <Select style={{ width: '100px' }} value={this.state.type} onChange={(e) => {
                                this.setState({
                                    type: e
                                })
                            }}>
                                <Select.Option value={0}>??????</Select.Option>
                                <Select.Option value={1}>??????</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="??????Excel??????">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Upload
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    fileList={excelFileList}
                                    beforeUpload={this.beforeUploadExcel}
                                    onRemove={this.onRemoveExcel}
                                >
                                    <Button>
                                        <Icon type="upload" /> ????????????
                                    </Button>
                                </Upload>
                            </div>

                            <div style={{ color: "#8e8e8e", marginTop: '10px', lineHeight: '1.5' }}>
                                <p>
                                    * ????????????????????????Excel????????????<br />
                                    * ?????????xlsx???????????????
                                </p>
                                <a target='_black' href='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/excel/09b8e959-ffce-425b-a216-811bf7bb5d89.xlsx'>
                                    Excel??????????????????
                                </a>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    width={600}
                    title='????????????'
                    visible={this.state.showResult}
                    closable={true}
                    maskClosable={true}
                    okText='??????'
                    cancelText='??????'
                    onCancel={() => {
                        this.setState({ showResult: false })
                    }}
                    onOk={() => {
                        this.setState({ showResult: false })
                    }}
                >
                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '10px' }}>
                        <span style={{ paddingRight: '20px' }}>??????:{this.state.total}</span>
                        <span style={{ paddingRight: '20px' }}>???????????????:{this.state.success}</span>
                        <span style={{ paddingRight: '20px' }}>???????????????:{this.state.total - this.state.success}</span>
                    </div>
                    <TableAntd columns={this.rejectedUser} pagination={{ size: 'small', showTotal: (total) => `??????${total}???` }} dataSource={this.state.rejectedUser} rowKey='sn'></TableAntd>
                </Modal>
            </div>
        )
    }
    onRemoveExcel = file => {
        this.setState(state => {
            const index = state.excelFileList.indexOf(file);
            const newFileList = state.excelFileList.slice();
            newFileList.splice(index, 1);
            return {
                excelFileList: newFileList,
            };
        });
    }
    beforeUploadExcel = file => {
        if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            message.info('?????????xlsx???????????????')
            return;
        }
        this.setState(state => ({
            excelFileList: [file],
        }));
        return false;
    }
    rejectedUser = [
        {
            title: '??????',
            dataIndex: 'name',
            key: 'name',
            ellipsis: false,
        },
        {
            title: '??????',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: false,
        },
        {
            title: '??????',
            dataIndex: 'sn',
            key: 'sn',
            ellipsis: false,
        },

        {
            title: '??????????????????',
            dataIndex: 'result',
            key: 'result',
        },
    ]
}
const LayoutComponent = TrainingClassMng;
const mapStateToProps = state => {
    return {
        squad_list: state.o2o.squad_list,
        user: state.site.user
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
