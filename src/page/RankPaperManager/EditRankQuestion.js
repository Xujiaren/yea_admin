import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import {Avatar,List,Checkbox,DatePicker,Radio,Icon,Upload,PageHeader,Modal,Form,Card,Select ,Input,Button,message} from 'antd';

import moment from 'moment';
import connectComponent from '../../util/connect';
import config from '../../config/config';

function getBase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

class EditRankQuestion extends Component {
    state = {
        fileList:[],
        previewVisible:false,
        previewImage: '',

        dataSource:[
            {   
                value:0,
                title: '健康知识大调查健康知识大调查',
            },
            {   
                value:0,
                title: '健康知识大调查健康知识大调查',
            },
            {   
                value:0,
                title: '健康知识大调查健康知识大调查',
            },
            {   
                value:0,
                title: '健康知识大调查健康知识大调查',
            }
        ],
        
        topic_name:0,
        content:'下列有关正确的说法是',
        radio:0,
        checkbox:[0],
        topic_type:0,
        topic_display:0,
        edit_index:-1,
        edit_value:'健康知识大调查',
        list:[],
    };
    componentDidMount() {
        const id = this.props.match.params.id
        this.getPks()

    }
    getPks=()=>{
        const{actions}=this.props
        actions.getPkcategories({
            keyword:this.state.keyword,
            resolved:(res)=>{
                this.setState({
                    list:res
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    add = ()=>{
        this.setState(pre=>{
            let {dataSource} = pre
            if(dataSource.length===26){
                message.info('最多只能添加26个选项')
                return null
            }
            dataSource.push({
                value:dataSource.length-1,
                title:''
            })
            return{
                dataSource,
                edit_index:dataSource.length-1
            }
        })
    }
    edit(index){
        let {dataSource} = this.state
        this.setState({
            edit_value:dataSource[index].title,
            edit_index:index,
            edit_value:''
        })
    }
    save(index){
        this.setState(pre=>{
            let {edit_value,dataSource} = pre
            dataSource[index].title = edit_value

            return{
                dataSource,
                edit_index:-1
            }
        })
    }
    delete(index){
        if(this.state.dataSource.length<=1){
            message.info('请至少保留一个选项')
            return
        }
        this.setState(pre=>{
            let {dataSource} = pre
            dataSource = dataSource.filter((ele,idx)=>{
                return idx !== index
            })
            return{
                dataSource
            }
        })
    }
    onUpload = ({fileList})=>{
        let img = []
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                img.push(ele.response.resultBody)
            }
        })
        
        this.setState({
            fileList:fileList,
            file_url:img.join(',')
        })
    }
    _onPublish =()=>{

        
        const {actions} = this.props
        const {dataSource,topic_name,content} = this.state
        let empty = false
        let charater = ''

        for(let i = 0;i<dataSource.length;i++){
            if(dataSource[i].title == ''){
                charater = String.fromCharCode(i+65)
                empty = true
                break
            }
        }

        //if(!topic_name){ message.info('请输入试卷名称'); return;}

        if(!content){ message.info('请输入题干'); return;}

        if(this.state.topic_type == 1&&this.state.checkbox.length == 0){
            message.info('请设置答案')
            return;
        }
        if(empty){
            message.info('选项'+charater+'的内容不能为空')
            return
        }
        
        message.success({
            content:'提交成功',
            onClose:()=>{
                window.history.back()
            }
        })
        return

       
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
    handleCancelModal = () => this.setState({ previewVisible: false });
    handleCancelCourse = () => this.setState({ coursePreviewVisible: false });
    handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
      };
    
    handleChangeModal = ({ fileList }) => this.setState({ fileList });
    
    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 20 },
            },
        };
        const uploadButtonImg = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadBtnVideo = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传视频</div>
            </div>
        );
        return(
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle="编辑题目"
                    >
                        <Row>
                            <Col xs="12">
                                <Card title="" style={{minHeight:'400px'}}>
                                    <Form {...formItemLayout}>
                                        <Form.Item label="题目类型">
                                            <Select 
                                                onChange={val=>{
                                                    this.setState({
                                                        topic_type:val,
                                                        radio:1
                                                    })
                                                }}
                                                className="m_w400" 
                                                value={this.state.topic_type}
                                            >
                                                <Select.Option value={0}>单选题</Select.Option>
                                                <Select.Option value={1}>多选题</Select.Option>
                                                <Select.Option value={2}>判断题</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="题目形式">
                                            <Select 
                                                onChange={val=>{
                                                    this.setState({
                                                        topic_display:val
                                                    })
                                                }}
                                                className="m_w400"
                                                value={this.state.topic_display}
                                            >
                                                <Select.Option value={0}>文字题目</Select.Option>
                                                <Select.Option value={1}>图片题目</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="分类">
                                            <Select 
                                                onChange={val=>{
                                                    
                                                }}
                                                className="m_w400"
                                                defaultValue={0}
                                            >
                                                <Select.Option value={0}>文化</Select.Option>
                                                <Select.Option value={1}>常识</Select.Option>
                                                <Select.Option value={2}>技能</Select.Option>
                                                <Select.Option value={3}>法务</Select.Option>
                                                <Select.Option value={4}>金融</Select.Option>
                                                <Select.Option value={5}>专题1</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="标签">
                                            <Select 
                                                onChange={val=>{
                                                    this.setState({
                                                        topic_name:val
                                                    })
                                                }}
                                                className="m_w400"
                                                value={this.state.topic_name}
                                            >
                                                <Select.Option value={0}>排位赛</Select.Option>
                                                <Select.Option value={1}>专题赛</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="题干">
                                           <Input 
                                                onChange={e=>{
                                                    this.setState({
                                                        content:e.target.value
                                                    })
                                                }}
                                                value={this.state.content}
                                                className="m_w400" 
                                                placeholder="输入名称" 
                                            />
                                        </Form.Item>
                                        {this.state.topic_display === 1?
                                        <Form.Item label="上传图片">
                                            <Upload
                                                action={config.api+'/site/upload/'}
                                                listType="picture-card"
                                                fileList={this.state.fileList}
                                                onPreview={this.handlePreview}
                                                onChange={this.onUpload}
                                            >
                                                {this.state.fileList.length >= 4 ? null : uploadButtonImg}
                                            </Upload>
                                            {/*<span style={{marginTop:'-30px',display:'block'}}>(345px * 135px)</span>*/}
                                        </Form.Item>
                                        :null}
                                        {this.state.topic_type == 2?null:
                                        <Form.Item label="选项">
                                            <List
                                                className="demo-loadmore-list"
                                                itemLayout="horizontal"
                                                dataSource={this.state.dataSource}
                                                renderItem={(item,index) => (
                                                    <List.Item
                                                        actions={[
                                                            <a 
                                                                onClick={this.state.edit_index === index?
                                                                    this.save.bind(this,index):
                                                                    this.edit.bind(this,index)
                                                                }
                                                                key="list-loadmore-edit"
                                                            >
                                                                {this.state.edit_index === index?'保存':'修改'}
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
                                                        {this.state.edit_index === index?
                                                            <Input 
                                                                placeholder='请输入选项内容'
                                                                style={{flex:'1 1'}} 
                                                                onChange={(e)=>{
                                                                    this.setState({
                                                                        edit_value:e.currentTarget.value
                                                                    })
                                                                }}
                                                                value={this.state.edit_value}
                                                            ></Input>:
                                                            <div style={{flex:'1 1'}}>{item.title?item.title:'空'}</div>
                                                        }
                                                    </List.Item>
                                                )}
                                            />
                                            <Button type="dashed" onClick={this.add} style={{ minWidth: '10%' }}>
                                                <Icon type="plus" /> 添加
                                            </Button>
                                        </Form.Item>
                                        }
                                        <Form.Item label="设置答案">
                                            {this.state.topic_type == 2?
                                                <Radio.Group onChange={this.onRadio} value={this.state.radio}>
                                                    
                                                    <Radio value={1}>是</Radio>
                                                    <Radio value={0}>否</Radio>

                                                </Radio.Group>
                                            :this.state.topic_type == 1?
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
                <Modal visible={this.state.previewVisible} maskClosable={false} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
            </div>
        )
    }
}

const LayoutComponent =EditRankQuestion;
const mapStateToProps = state => {
    return {

    }
}
export default connectComponent({LayoutComponent, mapStateToProps});