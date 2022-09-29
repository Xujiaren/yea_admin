import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import {Checkbox,Modal,PageHeader,Tabs,Card as CardAntd,Affix,Pagination, Tag,Menu, Dropdown, Button, Icon, message,Input, InputNumber, Select} from 'antd';

import connectComponent from '../../util/connect';
import config from '../../config/config';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import _ from 'lodash'

const { TabPane } = Tabs;
const { Search } = Input;

class RankPaperManager extends Component {

	state = {
		edit : true,
    	view : true,
        hot_index:[],

        h_search_val:'',

        hot_tags: [],
        inputVisible: false,
		inputValue: '',
        times:'',
        activeTab:'1',
        keyword:'',
        paperList:[],
	};
	sen_list = {}
    page_total=0
    page_current=1
    page_size=10

	onRefuse = ()=>{
		message.info('当前管理员无此权限');
    }

	componentDidMount(){
        const {actions} = this.props
        //actions.getSen()
	}
	componentWillMount(){
        
    }
  
	componentWillReceiveProps(n_props){
		
    }
    _onPage = (val)=>{

    }
    myUploadFn = (param) => {

        const serverURL = config.api+'/site/upload';
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        const successFn = (response) => {

            const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
            param.success({
                url: JSON.parse(xhr.responseText).resultBody,
                meta: {
                    // id: upLoadObject && upLoadObject.id,
                    // title: upLoadObject && upLoadObject.fileName,
                    // alt: upLoadObject && upLoadObject.fileName,
                    loop: false, // 指定音视频是否循环播放
                    autoPlay: false, // 指定音视频是否自动播放
                    controls: false, // 指定音视频是否显示控制栏
                    poster: '', // 指定视频播放器的封面
                }
            })
        };

        const progressFn = (event) => {
            param.progress(event.loaded / event.total * 100)

        };

        const errorFn = (response) => {
            param.error({
                msg: '上传出错！请重试'
            })
        };

        xhr.upload.addEventListener("progress", progressFn, false);
        xhr.addEventListener("load", successFn, false);
        xhr.addEventListener("error", errorFn, false);
        xhr.addEventListener("abort", errorFn, false);

        fd.append('file', param.file);
        
        xhr.open('POST', serverURL, true);
        xhr.withCredentials = true;
        xhr.send(fd)
    };
	render() {
		return (
        <div className="animated fadeIn">
            <CardAntd>
			<Row>
                <Col xs="12">
                
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle="题目审核"
                    >
                    <CardAntd className='mb_10' bodyStyle={{paddingTop:'8px',paddingBottom:'8px'}}>
                        <div className='flex j_space_between align_items'>
                            <div className="flex row align_items f_grow_1">
                                <Select 
                                    onChange={val=>{
                                        
                                    }}
                                    className="m_w400"
                                    defaultValue={0}
                                >
                                    <Select.Option value={-1}>全部</Select.Option>
                                    <Select.Option value={0}>文化</Select.Option>
                                    <Select.Option value={1}>常识</Select.Option>
                                    <Select.Option value={2}>技能</Select.Option>
                                    <Select.Option value={3}>法务</Select.Option>
                                    <Select.Option value={4}>金融</Select.Option>
                                    <Select.Option value={5}>专题1</Select.Option>
                                </Select>&nbsp;
                                <Search 
                                    placeholder="搜索"
                                    onChange={null}
                                    style={{ maxWidth: 200 }}
                                    onSearch={null}
                                >
                                </Search>&nbsp;
                                <Button>搜索</Button>
                            </div>
                            <div className="flex f_row f_nowrap align_items">
                                {this.state.activeTab == '1'?
                                <Button 
                                    onClick={()=>{
                                        this.setState({ regularPanel:true })
                                    }}
                                >
                                    出题规范
                                </Button>
                                :null}
                            </div>
                        </div>
                    </CardAntd>
                    <Tabs onChange={val=>{
                        this.setState({
                            activeTab:val
                        })
                    }} activeKey={this.state.activeTab}>
                        
                        <TabPane tab="待审核" key='1'>
                            <div className='flex align_items mb_10'>
                                <Button size='small'>全选</Button>&nbsp;
                                <Button size='small'>通过</Button>&nbsp;
                                <Button size='small'>不通过</Button>&nbsp;&nbsp;&nbsp;
                                <div>总题数：<Tag>2323</Tag></div>
                            </div>
                            <div className='min_height'>
                            {[1,2].map(ele=>(
                            <Card className='mb_10 card_style' style={{minHeight:'100px'}}>
                                <CardHeader style={{verticalAlign:'center'}}>
                                    <Checkbox className='mr_10'/>单选题：下列有关正确的说法是
                                </CardHeader>
                                <CardBody style={{padding:0}}>
                                    <div className='question pad_10 flex align_start'>
                                        <div>A.药品药品药品药健康知识大调查品药品药品</div>
                                        <div className='be_green'>B.健康知识大调查健康知识大调查健康知识大调查</div>
                                        <div>C.健康知识大调查</div>
                                        <div>D.健康知识大调查健康知识大调查健康知识大调查</div>
                                    </div>
                                    <div className='pad_l20 pad_r20 pad_b10 flex align_start'>
                                        解析：健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查
                                    </div>
                                </CardBody>
                                <CardHeader className="flex j_space_between">
                                    <div>
                                        分类：<Tag>文化</Tag>
                                        来源：<Tag>kusa</Tag>
                                        标签：<Tag>排位赛</Tag>
                                    </div>
                                    <div>
                                        <Button onClick={()=>{
                                            message.success('操作成功')
                                        }}>通过</Button>&nbsp;
                                        <Button onClick={()=>{
                                            this.setState({rejectedPanel:true})
                                        }}>不通过</Button>
                                    </div>
                                </CardHeader>
                            </Card>
                            ))}
                            </div>
                            <Card className='mb_10 card_style'>
                                <CardHeader className="flex j_space_between align_items">
                                    <Pagination showTotal={(total)=>"总共xxx条"} pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                                </CardHeader>
                            </Card>        
                        </TabPane>
                        <TabPane tab="已审核" key='2'>
                            <div className='min_height'>
                            {[1,2,34,5,52,4].map(ele=>(
                            <Card className='mb_10 card_style' style={{minHeight:'100px'}}>
                                <CardHeader style={{verticalAlign:'center'}}>
                                    单选题：下列有关正确的说法是
                                </CardHeader>
                                <CardBody style={{padding:0}}>
                                    <div className='question pad_10 flex align_start'>
                                        <div>A.药品药品药品药健康知识大调查品药品药品</div>
                                        <div className='be_green'>B.健康知识大调查健康知识大调查健康知识大调查</div>
                                        <div>C.健康知识大调查</div>
                                        <div>D.健康知识大调查健康知识大调查健康知识大调查</div>
                                    </div>
                                    <div className='pad_l20 pad_r20 pad_b10 flex align_start'>
                                        解析：健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查健康知识大调查
                                    </div>
                                </CardBody>
                                <CardHeader className="flex j_space_between">
                                    <div>
                                        分类：<Tag>文化</Tag>
                                        来源：<Tag>晓军</Tag>

                                        标签：<Tag>排位赛</Tag>
                                    </div>
                                    <div>
                                        {/*<Button 
                                            onClick={()=>{
                                                this.props.history.push('/rankPaper-manager/edit')
                                            }}
                                        >修改</Button>&nbsp;
                                        */}
                                        <Button>删除</Button>
                                    </div>
                                </CardHeader>
                            </Card>
                            ))}
                            </div>
                            <Card className='mb_10 card_style'>
                                <CardHeader className="flex j_space_between align_items">
                                    <Pagination showTotal={(total)=>"总共xxx条"} pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                                </CardHeader>
                            </Card>
                        </TabPane>
                        
                    </Tabs>
                    
                    </PageHeader>
                </Col>
            </Row>
            </CardAntd>
            <Modal
                width={600}
                visible={this.state.regularPanel}
                onCancel={()=>{
                    this.setState({regularPanel:false})
                }}
                title='出题规范'
                okText='确定'
                cancelText='取消'
                maskClosable={false}
            >
                {/*
                <Input.TextArea autoSize={{minRows:6}} placeholder='出题规范内容' />
                */}
                <BraftEditor
                    style={{border:"1px solid #eaeaea"}}
                    value={this.state.editorState}
                    onChange={this.handleEditorChange}
                    contentStyle={{height:'400px'}}
                    media={{uploadFn:this.myUploadFn}}
                />
            </Modal>
            <Modal
                visible={this.state.rejectedPanel}
                onCancel={()=>{
                    this.setState({rejectedPanel:false})
                }}
                title='填写原因'
                okText='确定'
                cancelText='取消'
            >
                <Input.TextArea autoSize={{minRows:2}} placeholder='填写不通过原因'>
                </Input.TextArea>
            </Modal>
		</div>
		);
	}
}

const LayoutComponent = RankPaperManager;
const mapStateToProps = state => {
    return {
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
