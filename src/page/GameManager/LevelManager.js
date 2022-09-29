import React, { Component } from 'react';
import { Row ,Col,Table} from 'reactstrap';
import { InputNumber,Icon,Upload,Tag,Checkbox,Tabs,DatePicker,Popconfirm,message,Pagination,Switch,Modal,Form,Card,Select ,Input,Button, Radio} from 'antd';
import {Link} from 'react-router-dom';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import locale from 'antd/es/date-picker/locale/zh_CN';
import config from '../../config/config';

const { TabPane } = Tabs;
const {RadioGroup} = Radio;
const {Option} = Select;
const {Search} = Input;
const {RangePicker} = DatePicker

function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
function beforeUpload(file) {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //   if (!isJpgOrPng) {
    //     message.error('只能上传 JPG/PNG 文件!');
    //   }
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        message.info('图片文件需小于 1MB!');
      }
    //   return isJpgOrPng && isLt2M;
      return isLt2M;
}
class LevelManager extends Component {
    state = {
            
        edit : true,
        view : true,
        visible: false,
        isView:false,
        title:'',

        status:0, 
        tag_id:'',
        tag_name:'',
        ttype:0,
        keyword:'',
        previewImage:'',
        showImgPanel:false,
        showRefund:false,
        showEditPanel:false,
        showAddPanel:false,
        showPost:false,
        showPostView:false,
        fileList:[],
        fileList1:[
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              },
        ],
        activeTab:'1',
        order:1,
        sub:false,
        levelList:[],
    };
    tag_list = [1,2,3,4,5,6,7,8]
    page_total=0
    page_current=1
    page_size=12




	onRefuse = ()=>{
		message.info('当前管理员无此权限');
    }

    _onPage = (val)=>{
        return
        const {actions} = this.props;
        let pathname = this.props.history.location.pathname
        let {keyword} = this.state
        this.props.history.replace(pathname+'?page='+val)
        actions.getTag({
            keyword:keyword,
            page:val-1,
            ttype:'',
            pageSize:this.page_size
        })
    }
    
    
    componentWillMount(){
        const {actions} = this.props;
        const {search} = this.props.history.location
        let page =0
        if(search.indexOf('page=') > -1){
            page = search.split('=')[1]-1
            this.page_current = page+1
        }
       this.getPklevel()
       
    }
    getPklevel=()=>{
        const{actions}=this.props
        actions.getPkLevel({
            keyword:'',
            page:0,
            pageSize:100,
            resolved:(res)=>{
                this.setState({
                    levelList:res
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    componentWillReceiveProps(n_props){
      
        
    }
    showModal(txt,index){
        let is_view = false
        if(index !== 'add'){
            if(txt=="查看"){
                is_view =true
            }
            const tag_item = this.tag_list[index]

            this.setState({
                title:txt,
                isView: is_view,
                visible: true,
                status:tag_item.status, 
                tag_id:tag_item.tagId,
                tag_name:'健康大调查',
                ttype:tag_item.ttype
            })  
        }else{
            this.setState({
                title:txt,
                isView: false,
                visible: true,
                
                status:0, 
                tag_id:'',
                tag_name:'',
                ttype:0
            }) 
        }
    };
    handleCancel = () => {
        this.setState({
            visible: false, 
            tag_id:'',
        });
    };
    showImgPanel(url){
        this.setState({
            showImgPanel: true,
            previewImage:url
        });
    }
    hideImgPanel=()=>{
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
    edit(order,sub){
        this.setState({
            order,
            sub,
            showEditPanel:true,
        })
    }
    onCourseImgChange = ({file,fileList,event}) =>{
        let img = []
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                img.push(ele.response.resultBody)
            }
        })
        
        this.setState({
            fileList:fileList,
            course_img:img.join(',')
        })

    }
    onCourseImgChange1 = ({file,fileList,event}) =>{
        let img = []
        fileList.map((ele,index)=>{
            if(ele.status == 'done'){
                img.push(ele.response.resultBody)
            }
        })
        
        this.setState({
            fileList1:fileList,
            course_img:img.join(',')
        })

    }
    render(){
        const { 
            status, 
            tag_id,
            tag_name,
            ttype,
        } = this.state

        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const formItemLayoutPanel = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };
        const uploadButtonImg = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return(
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12">
                        <Card title="段位管理">
                            <div className='min_height'>
                            <div className="flex f_row j_space_between align_items mb_10">

                                <div className='flex f_row align_items'>
                                    {/*<Search
                                        onSearch={this._onSearch}
                                        style={{ maxWidth: 200 }}
                                    />&nbsp;
                                    <Button>搜索</Button>
                                    */}
                                </div>
                                {/* <div>
                                    <Button onClick={()=>{
                                        this.setState({
                                            showAddPanel:true
                                        })
                                    }}>添加段位等级</Button>
                                </div> */}
                            </div>
                            <Table responsive size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th style={{width:'100px'}}>段位名称</th>
                                        <th>等级</th>
                                        <th>图标</th>
                                        <th>积分</th>

                                        <th>奖励金币</th>
                                        {/* <th>操作</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.levelList.map(item=>{
                                            return(
                                                <tr>
                                                <td></td>
                                                <td>{item.levelName}</td>
                                                <td>{item.levelId}</td>
                                                <td>
                                                    <a>
                                                        <img onClick={this.showImgPanel.bind(this)} className="head-example-img" src={item.levelImg}/>
                                                    </a>
                                                </td>
                                                <td>{item.beginPoint}-{item.endPoint}</td>
                                                <td>{item.shareIntegral}</td>
                                                {/* <td style={{width:'320px'}}>
                                                    <div>
                                                        <Button onClick={()=>{
                                                            this.setState({ showViewPanel:true})
                                                        }} type="primary" size={'small'} className='m_2'>查看</Button>&nbsp;
                                                        <Button onClick={()=>{
                                                            this.setState({ showEditPanel:true})
                                                        }} type="primary" size={'small'} className='m_2'>修改</Button>&nbsp;
                                                        <Popconfirm 
                                                            okText="确定"
                                                            cancelText='取消'
                                                            title='确定删除吗？'
                                                        >
                                                            <Button type="primary" ghost size={'small'} className='m_2'>删除</Button>
                                                        </Popconfirm>
                                                    </div>
                                                </td> */}
                                            </tr>
                                            )
                                        })
                                    }
                                   
                                </tbody>
                            </Table>
                            </div>
                            {/* <Pagination showTotal={(total)=>"总共xxx条"} pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} /> */}
                            
                        </Card>
                    </Col>
                </Row>
                
                <Modal zIndex={99} visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                
                <Modal
                    zIndex={90}
					title="添加段位等级"
					visible={this.state.showAddPanel}
					okText="确定"
					cancelText="取消"
					closable={true}
					maskClosable={false}
					onCancel={()=>{
                        this.setState({ showAddPanel:false })
                    }}
					onOk={null}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form {...formItemLayout}>
                        <Form.Item label='级别'>
                            <Select defaultValue={0}>
                                <Select.Option value={0}>新段位</Select.Option>
                                <Select.Option value={1}>黄金段位</Select.Option>
                                <Select.Option value={2}>黄金段位  一级</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='名称'>
                            <Input
                                onChange={(e)=>{
                                    
                                }}
                                placeholder=''
                                defaultValue=''
                            />
                        </Form.Item>
                        <Form.Item label="图标">
                            <Upload
                                action={config.api+'/site/upload/'}
                                listType="picture-card"
                                fileList={this.state.fileList}
                                onPreview={this.handlePreview}
                                onChange={this.onCourseImgChange}
                                onRemove={this.onRemove}
                                beforeUpload={this.beforeUpload}
                            >
                                {this.state.fileList.length >= 1 ? null : uploadButtonImg}
                            </Upload>
                        </Form.Item>
                        <Form.Item label='积分'>
                            <InputNumber
                                onChange={(e)=>{
                                    
                                }}
                                placeholder=''
                                defaultValue=''
                            />&nbsp;&nbsp;-&nbsp;&nbsp;
                            <InputNumber
                                onChange={(e)=>{
                                    
                                }}
                                placeholder=''
                                defaultValue=''
                            />
                        </Form.Item>
                        {/* <Form.Item label='奖励金币'>
                            <Input
                                onChange={(e)=>{
                                    
                                }}
                                placeholder=''
                                defaultValue=''
                            />
                        </Form.Item> */}
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
					title="修改"
					visible={this.state.showEditPanel}
					okText="确定"
					cancelText="取消"
					closable={true}
					maskClosable={false}
					onCancel={()=>{
                        this.setState({ showEditPanel:false })
                    }}
					onOk={null}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form {...formItemLayout}>
                        <Form.Item label='级别'>
                            <Select defaultValue={0}>
                                <Select.Option value={0}>新段位</Select.Option>
                                <Select.Option value={1}>黄金段位</Select.Option>
                                <Select.Option value={2}>黄金段位  一级</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='名称'>
                            <Input
                                onChange={(e)=>{
                                    
                                }}
                                placeholder=''
                                defaultValue='黑铁'
                            />
                        </Form.Item>
                        <Form.Item label="图标">
                            <Upload
                                action={config.api+'/site/upload/'}
                                listType="picture-card"
                                fileList={this.state.fileList1}
                                onPreview={this.handlePreview}
                                onChange={this.onCourseImgChange1}
                                onRemove={this.onRemove}
                                beforeUpload={this.beforeUpload}
                            >
                                {this.state.fileList1.length >= 1 ? null : uploadButtonImg}
                            </Upload>
                        </Form.Item>
                        <Form.Item label='积分'>
                            <InputNumber
                                onChange={(e)=>{
                                    
                                }}
                                placeholder=''
                                defaultValue='0'
                            />&nbsp;&nbsp;-&nbsp;&nbsp;
                            <InputNumber
                                onChange={(e)=>{
                                    
                                }}
                                placeholder=''
                                defaultValue='100'
                            />
                        </Form.Item>
                        {/* <Form.Item label='奖励金币'>
                            <Input
                                onChange={(e)=>{
                                    
                                }}
                                placeholder=''
                                defaultValue='100'
                            />
                        </Form.Item> */}
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
					title="查看"
					visible={this.state.showViewPanel}
					okText="确定"
					cancelText="取消"
					closable={true}
					maskClosable={false}
					onCancel={()=>{
                        this.setState({ showViewPanel:false })
                    }}
					onOk={null}
					bodyStyle={{ padding: "10px 25px" }}
				>
                    <Form {...formItemLayout}>
                        <Form.Item label='级别'>
                            <Tag>新段位</Tag>
                        </Form.Item>
                        <Form.Item label='名称'>
                            <Tag>黑铁</Tag>
                        </Form.Item>
                        <Form.Item label="图片">
                            <Upload
                                disabled
                                action={config.api+'/site/upload/'}
                                listType="picture-card"
                                fileList={this.state.fileList1}
                                onPreview={this.handlePreview}
                                onChange={this.onCourseImgChange}
                                onRemove={this.onRemove}
                                beforeUpload={this.beforeUpload}
                            >
                                {this.state.fileList1.length >= 1 ? null : uploadButtonImg}
                            </Upload>
                        </Form.Item>
                        <Form.Item label='积分'>
                            <Tag>0</Tag>
                            &nbsp;&nbsp;-&nbsp;&nbsp;
                            <Tag>100</Tag>
                        </Form.Item>
                        {/* <Form.Item label='奖励金币'>
                            <Tag>200</Tag>
                        </Form.Item> */}
                    </Form>
                </Modal>
            </div>
        )
    }
}
const LayoutComponent = LevelManager;
const mapStateToProps = state => {
    return {
        tag_list:state.course.tag_list,
		user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
