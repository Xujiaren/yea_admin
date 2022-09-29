import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import {Spin, Empty, Avatar,List,Checkbox,Radio,Icon,Upload,PageHeader,Modal,Form,Card,Select ,Input,Button,message} from 'antd';

import connectComponent from '../../util/connect';
import AntdOssUpload from '../../components/AntdOssUpload'

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

class MeettingTopicEdit extends Component {
    state = {
        fileList:[],
        media_value:[],
        previewVisible:false,
        previewImage: '',

        dataSource:[],
        selectedPaper:{key:0, label:'无'},
        selectedCate:{key:0, label:'无'},
        
        // {   
        //     label:'A',
        //     value:0,
        //     title: '',
        // }

        topic_id:'0',
        title:'',
        analysis:'',
        
        topic_name:0,
        content:'',
        radio:0,
        checkbox:[0],
        ttype:0,
        mtype:0,
        edit_index:0,
        edit_value:'',

        category_id:'',
        view_mode:false,
    };
    category_list = []
    auth_paper_list = []
    auth_cate_list = []
    cate_ctype = 25
    paper_ctype = 26
    topic_ctype = 25
    cate_keyword = ''
    paper_keyword = ''
    uploadMedia = null
    
    componentWillMount(){
        const {actions} = this.props
        const topic_id = this.props.match.params.id+''
        let _state = this.props.location.state

        if( typeof _state === 'undefined'){
            _state = { type:'' }
        }else if(_state.type === 'view'){
            this.setState({ view_mode:true })
        }
        if(topic_id!=='0'){
            this.setState({ topic_id })
            actions.getAuthTopic({ topic_id,ctype:this.topic_ctype })
        }
        actions.getAuthCate({ keyword:this.cate_keyword, ctype:this.cate_ctype })
        this.getAuthPaper()
    }
    componentWillReceiveProps(n_props){

        if(n_props.auth_topic_list !== this.props.auth_topic_list){
            console.log(n_props.auth_topic_list)
            if(n_props.auth_topic_list.data.length==0){ return }
            this.auth_topic_list = n_props.auth_topic_list.data[0]
            let {
                title,
                analysis,
                ttype,
                mtype,
                categoryId,
                categoryName,
                answerIds,
                topicOptions,
                paperIdAndName,
                galleries,
            } = this.auth_topic_list
            let selectedPaper = {
                key:0,
                label:'无'
            }
            let selectedCate = {
                key:0,
                label:'无'
            }

            let dataSource = []
            let media_value = []
            topicOptions.map((ele,index)=>{
                let label = String.fromCharCode(index+66) 
                dataSource.push({
                    value:index,
                    label,
                    title:ele.optionLabel
                })
            })
            galleries.map(ele=>{
                media_value.push({
                    url: ele.link,
                    type: mtype==1?'image/png':mtype==2?'video/mp4':mtype==3?'audio/mp3':'',
                    status: 'done',
                    name:ele.link,
                    uid:ele.link,
                })
            })
            //答案
            let radio = 0
            let checkbox = []
            topicOptions.map((ele,index)=>{
                if(answerIds.indexOf(ele.optionId+'')>-1){
                    checkbox.push(index)
                    radio = index
                }
            })
            //试卷
            paperIdAndName.map(ele=>{
                selectedPaper = {
                    key: ele[0],
                    label: ele[1],
                    value: ele[0]
                }
            })
            //分类
            if(categoryId)
                selectedCate = {
                    key: categoryId,
                    label: categoryName,
                    value: categoryId
                }

            
            this.setState({
                radio,
                checkbox,
                edit_index:-1,
                title,
                analysis,
                dataSource,
                ttype,
                mtype,
                category_id:categoryId,
                selectedPaper,
                selectedCate,
                media_value,
            })
        }

        if(n_props.auth_paper_list !== this.props.auth_paper_list){
            this.auth_paper_list = n_props.auth_paper_list.data
            if(this.auth_paper_list.length === 0){
                this.setState({  fetchingPaper:false })
            }
        }
        if(n_props.auth_cate_list !==this.props.auth_cate_list){
            if(n_props.auth_cate_list.length !== 0){
                this.category_list = n_props.auth_cate_list
            }
        }
    }
    getAuthPaper = ()=>{
        const {actions} = this.props;
        actions.getAuthPaper({ctype:this.paper_ctype, page:0, pageSize:100000, keyword: this.paper_keyword})
    }
    add = ()=>{
        this.setState(pre=>{
            let {dataSource} = pre
            if(dataSource.length>=26){ message.info('最多添加26个选项'); return null; }
            let label = String.fromCharCode(dataSource.length+65) 
            dataSource.push({
                value:dataSource.length-1,
                label,
                title:''
            })
            return{
                dataSource,
                edit_index:dataSource.length-1
            }
        })
    }
    editImg = ()=>{
        const link = this.refs.optionImg.getValue()
        
        if(link == ''){
            message.info('请上传图片')
            return
        }
        this.setState(pre=>{
            let {edit_index,dataSource} = pre

            if(edit_index === -1){
                let label = String.fromCharCode(dataSource.length+65) 
                dataSource.push({
                    value:dataSource.length-1,
                    label,
                    title:link
                })
            }else{
                dataSource[edit_index].title = link
            }

            return{
                showImgPannel:false,
                dataSource,
                iconList:[],
                edit_index:-1
            }
        })
    }
    edit(index){
        const {mtype} = this.state
        let {dataSource} = this.state

        this.setState({
            edit_value:dataSource[index].title,
            edit_index:index
        })
    }
    save(index){
        this.setState(pre=>{
            let {edit_value,dataSource} = pre

            dataSource[index].title = edit_value
            return{
                dataSource,
                edit_value:'',
                edit_index:-1
            }
        })
    }
    delete(index){
        this.setState(pre=>{
            let {dataSource} = pre
            const checkbox = []
            const radio = 0
            dataSource = dataSource.filter((ele,idx)=>{
                return idx !== index
            })
            return{
                dataSource,checkbox,radio
            }
        })
    }

    _onPublish =()=>{
        this.setState({ publishing:true })
        
        const {actions} = this.props
        const {
            topic_id,
            ttype,
            title,
            
            mtype,
            dataSource,
            selectedPaper,
            selectedCate,
            checkbox,
            radio,
            analysis,
        } = this.state

        let empty = false
        let charater = ''
        let paper_id = selectedPaper.key
        let category_id = selectedCate.key
        let options = []
        let answers = []
        const url = this.uploadMedia?this.uploadMedia.getValue():''
        const ctype = this.topic_ctype

        for(let i = 0; i<dataSource.length; i++){
            if(dataSource[i].title == ''){
                charater = String.fromCharCode(i+65)
                empty = true
                break
            }else{
                options.push(dataSource[i].title)
            }
        }

        // if(paper_id == 0){ message.info('请选择试卷'); return false;}
        // if(category_id == 0){ message.info('请选择分类'); return false;}
        if(!title){ message.info('请输入题干'); return false;}
        if(url == ''&&mtype>0){ message.info('请上传文件'); return false; }
        if(ttype !==1 &&empty){
            message.info('选项'+charater+'的内容不能为空')
            return false
        }
        
        options = options.join('|||')

        if(ttype === 1){
            options = '正确|||错误'
            answers = radio
        }else if(ttype === 3){
            if(checkbox.length === 0){
                message.info('请设置多选题答案')
                return false
            }
            answers = checkbox.join(',')

        }else{
            answers = radio
        }

        if(!analysis){ message.info('请设置题目解析'); return false; }
        

        actions.publishAuthTopic({
            paper_id,
            topic_id,
            ttype,
            mtype,
            analysis,
            category_id,
            title,
            options,
            answers:answers,
            url,
            ctype,
            resolved:()=>{
                message.success({
                    content:'提交成功',
                    onClose:()=>{
                        window.history.back()
                    }
                })
                this.setState({ publishing:false })
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    onCheckBox = (val)=>{
        this.setState({
            checkbox:val
        })
    }
    onRadio = (e)=>{
        this.setState({
            radio:e.target.value
        })
    }
    _onSelectPaper = value => {
        console.log(value)
        this.setState({
            selectedPaper:value,
            fetchingPaper: false,
        });
    };
    _onSearchPaper = (value)=>{
        this.setState({ fetchingPaper: true })
        this.paper_keyword = value
        this.getAuthPaper()
    }

    render(){
        const {view_mode,topic_id, mtype, edit_index} = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 20 },
            },
        }
        const renderOptions = ()=>{
            const {mtype,edit_index} = this.state
            return (
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={this.state.dataSource}
                    renderItem={(item,index) => (
                        <List.Item
                            actions={[
                                <a 
                                    onClick={edit_index === index?
                                        this.save.bind(this,index):
                                        this.edit.bind(this,index)
                                    }
                                    key="list-loadmore-edit"
                                >
                                    {edit_index === index?'保存':'修改'}
                                </a>,
                                <a 
                                    key="list-loadmore-more"
                                    onClick={this.delete.bind(this,index)}
                                >删除</a>
                            ]}
                        >
                            <List.Item.Meta
                                style={{flex:'0 1'}}
                                avatar={
                                    <Avatar style={{background:'#f56a00'}}>{String.fromCharCode(index+65)}</Avatar>
                                }
                            />
                                <div style={{flex:'1 1'}}>
                                    {/*
                                    {mtype==1?
                                        <img src={item.title} onClick={()=>{ this.setState({ previewVisible:true,previewImage:item.title }) }} className='head-example-img'/>
                                    :
                                    */}
                                    {
                                        this.state.edit_index === index?
                                        <Input.TextArea
                                            autoSize={{minRows:1}}
                                            placeholder='请输入选项内容'
                                            style={{flex:'1 1'}} 
                                            onChange={(e)=>{
                                                this.setState({
                                                    edit_value:e.currentTarget.value
                                                })
                                            }}
                                            value={this.state.edit_value}
                                        />
                                    :
                                        <div style={{flex:'1 1'}}>{item.title?item.title:'空'}</div>
                                    }
                                </div>
                        </List.Item>
                    )}
                />
                
            )
        }
        const media_label = mtype==1?'上传图片':mtype==2?'上传视频':mtype==3?'上传音频':''

        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={topic_id=='0'?"发布题目":'修改题目'}
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="题目类型">
                                            <Select
                                                onChange={val=>{
                                                    this.setState({
                                                        ttype:val,
                                                        radio:0
                                                    })
                                                }}
                                                className="m_w400" 
                                                value={this.state.ttype}
                                            >
                                                <Select.Option value={0}>单选题</Select.Option>
                                                <Select.Option value={3}>多选题</Select.Option>
                                                <Select.Option value={1}>判断题</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="题目形式">
                                            <Radio.Group 
                                                onChange={e=>{
                                                    
                                                    this.setState({
                                                        mtype:e.target.value,
                                                        media_value:[],
                                                        // dataSource:[],
                                                        // edit_index:-1
                                                    })
                                                }}
                                                className="m_w400"
                                                value={this.state.mtype}
                                            >
                                                <Radio value={0}>文字题目</Radio>
                                                <Radio value={1}>图片题目</Radio>
                                                {/* <Radio value={2}>视频题目</Radio>
                                                <Radio value={3}>音频题目</Radio> */}
                                            </Radio.Group>
                                        </Form.Item>
                                        
                                        <Form.Item label="选择试卷">
                                            <Select
                                                showSearch
                                                labelInValue
                                                disabled={view_mode}
                                                value={this.state.selectedPaper}
                                                placeholder="搜索试卷"
                                                className='m_w400'
                                                notFoundContent={this.state.fetchingPaper ? <Spin size="small" /> : <Empty />}
                                                filterOption={false}
                                                onSearch={this._onSearchPaper}
                                                onChange={this._onSelectPaper}
                                            >
                                                <Select.Option value={0}>无</Select.Option>
                                                {this.auth_paper_list.map(item => (
                                                    <Select.Option key={item.paperId} value={item.paperId}>{item.paperName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        {/* <Form.Item label={"分类"}>
                                            <Select labelInValue value={this.state.selectedCate} disabled={view_mode} className='m_w400' onChange={val=>{
                                                this.setState({ selectedCate:val })
                                                console.log(val)
                                            }}>
                                                <Select.Option value={0}>无</Select.Option>
                                                {this.category_list.map(ele=>(
                                                    <Select.Option key={ele.categoryId} value={ele.categoryId}>{ele.categoryName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item> */}
                                        <Form.Item label="题干">
                                           <Input.TextArea
                                                autoSize={{minRows:4}}
                                                onChange={e=>{
                                                    this.setState({
                                                        title:e.target.value
                                                    })
                                                }}
                                                className="m_w400" 
                                                placeholder="输入题干"
                                                value={this.state.title}
                                            />
                                        </Form.Item>
                                        {mtype>0?
                                        <Form.Item label={media_label}>
                                            <AntdOssUpload  actions={this.props.actions} accept={mtype==1?"image/*":mtype==2?"video/*":mtype==3?"audio/*":""} value={this.state.media_value} ref={ref=>this.uploadMedia = ref}/>
                                        </Form.Item>
                                        :null}
                                        {this.state.ttype == 1?null:
                                        <Form.Item label="选项">
                                            <div className='m_w400'>
                                                {renderOptions()}
                                            </div>
                                            <Button type="dashed" onClick={this.add} style={{ minWidth: '10%' }}>
                                                <Icon type="plus" /> 添加
                                            </Button>
                                        </Form.Item>
                                        }
                                        <Form.Item label="设置答案">
                                            {this.state.ttype == 1?
                                                <Radio.Group onChange={this.onRadio} value={this.state.radio}>
                                                    
                                                    <Radio value={0}>正确</Radio>
                                                    <Radio value={1}>错误</Radio>

                                                </Radio.Group>
                                            :this.state.ttype == 3?
                                                <Checkbox.Group onChange={this.onCheckBox} value={this.state.checkbox} className='mt_10'>
                                                    {this.state.dataSource.map((ele,index)=>(
                                                        <Checkbox key={index+'check'} value={index}>{String.fromCharCode(index+65)}</Checkbox>
                                                    ))}
                                                </Checkbox.Group>
                                            :
                                                <Radio.Group onChange={this.onRadio} value={this.state.radio}>
                                                    {this.state.dataSource.map((ele,index)=>(
                                                        <Radio key={index+'radio'} value={index}>{String.fromCharCode(index+65)}</Radio>
                                                    ))}
                                                </Radio.Group>
                                            }
                                        </Form.Item>
                                        <Form.Item label="题目解析">
                                           <Input.TextArea
                                                autoSize={{minRows:4}}
                                                onChange={e=>{
                                                    this.setState({
                                                        analysis:e.target.value
                                                    })
                                                }}
                                                className="m_w400" 
                                                placeholder="输入题目解析"
                                                value={this.state.analysis}
                                            />
                                        </Form.Item>
                                    </Form>
                                    <div className="flex f_row j_center">
                                        <Button type="primary" ghost onClick={() => window.history.back()}>取消</Button>
                                        &nbsp;
                                        <Button onClick={this._onPublish} type="primary">提交</Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </PageHeader>
                </Card>
                <Modal zIndex={10} visible={this.state.previewVisible} maskClosable={false} footer={null} onCancel={()=>{ this.setState({previewVisible:false}) }}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={8}
                    title={this.state.editTitle}
                    visible={this.state.showImgPannel}
                    centered
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={false}
                    onCancel={()=>{ this.setState({ showImgPannel:false }) }}
                    onOk={this.editImg}
                    bodyStyle={{padding:"40px"}}
                >
                    <Form wrapperCol={{span:18}} labelCol={{span:6}}>
                        <Form.Item label="选项图片">
                            <AntdOssUpload  actions={this.props.actions} accept='image/*' value={this.state.iconList} ref='optionImg'></AntdOssUpload>
                            <div style={{marginTop:'-15px'}}>(70px * 70px )</div>
                        </Form.Item>
                    </Form>
                </Modal>
                <style>
                {
                `
                    .ant-empty-normal{
                        margin:0
                    }
                `
                }
                </style>
            </div>
        )
    }
}

const LayoutComponent =MeettingTopicEdit;
const mapStateToProps = state => {
    return {
        auth_paper_list:state.auth.auth_paper_list,
        auth_cate_list:state.auth.auth_cate_list,
        auth_topic_list:state.auth.auth_topic_list,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});