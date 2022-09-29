import React,{ Component } from 'react';
import connectComponent from '../../util/connect';
import {message,Tag,Icon,Radio,Spin,Form, Empty, Select,Button,Modal,Table,Popconfirm,Card,PageHeader,Input, Switch, InputNumber} from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload'
import SwitchCom from '../../components/SwitchCom'
import Editor from '../../components/Editor'
import PersonTypePublic from '../../components/PersonTypePublic';
import { ask } from '../../redux/action/ask';
class AskEdit extends Component{

    state = {
        loaded: false,
        ask_id: 0,
        cate_id: 0,
        title: '',
        content: '',
        flag: '',
        isShare: 0,
        isReward: 0,
        user_id: 0,
        integral: 0,
        rintegral: 0,
        imgList:[],

        loading: false,
        fetching:false,
        selectValue: [],
        ases:{},
    }

    userMap = {}
    userList = []
    cateList = []

    selectData = []

    componentWillMount(){
        const {actions} = this.props;

        const ask_id = this.props.match.params.id || 0;

        this.setState({
            loaded: ask_id == 0,
            ask_id: ask_id,
        })

        actions.kuser('问答');
        actions.getAuthCate({ keyword: '', ctype: 10 });

        if (ask_id > 0) {
            actions.askInfo(ask_id);
        }
    }

    componentWillReceiveProps(n_props){
        const {ask_info, kuser_list, cate_list} = n_props;

        if (kuser_list !== this.props.kuser_list) {
            this.userList = kuser_list;
            this.userList.map((u, index) => {
                this.userMap[u.userId] = u;
            })
        }

        if (cate_list !== this.props.cate_list) {
            this.cateList = cate_list;
        }

        if (ask_info !== this.props.ask_info) {

            let imgList = [];
            ask_info.galleryList.map((ele,index)=>{
                imgList.push({
                    response:{resultBody:ele.link},
                    uid:index,
                    name:'img_'+index,
                    status:'done',
                    url:ele.link,
                    type:'image/png'
                })
            })

            this.setState({
                loaded: true,
                title: ask_info.title,
                content: ask_info.content,
                user_id: ask_info.userId,
                cate_id: ask_info.categoryId,
                flag: ask_info.flag,
                integral: ask_info.integral,
                isShare: ask_info.isShare,
                isReward: ask_info.integral > 0 ? 1 : 0,
                imgList: imgList,
            })
        }
    }

    onSearchTag = (value) => {
        const {actions} = this.props;
        this.setState({ 
            selectData: [], 
            fetching: true 
        });

        actions.searchTag({
            keyword: value,
            resolved: (data)=> {
                this.selectData = data.data.map(ele => ({
                    text: ele.tagName,
                    value: ele.tagId,
                }))

                this.setState({
                    fetching: false 
                })
            },
            rejected: (data)=>{
                this.setState({ 
                    fetching: false 
                })
            }
        })
    }

    onSelectTag = (value) => {
        this.setState({
            selectValue: value,
            fetching: false,
        });
    };

    onPublish = () => {
        const {actions} = this.props;
        const {user_id, integral, title, isShare, ask_id, cate_id} = this.state;

        const content = this.refs.editor.toHTML() || '';
        const images = (this.img && this.img.getValue()) || ''
        const flag = (this.flag && this.flag.getValue()) || ''

        if (user_id == 0) {
            message.error("请选择身份");
            return;
        }

        if (cate_id == 0) {
            message.error("请选择分类");
            return;
        }

        if (title.length == 0) {
            message.error("请输入问题标题");
            return;
        }

        if (content.length == 0) {
            message.error("请输入问题背景");
            return;
        }

        this.setState({loading:true})

        actions.askPublish({
            ask_id: ask_id,
            category_id: cate_id,
            title: title,
            content: content,
            flag: flag,
            integral: integral,
            is_share: isShare,
            pics: images,
            user_id: user_id,

            resolved:(data)=>{

                if (this.flag && this.flag.getValue() == '/I/' && this.flag.getFile() !== '') {
                    this.flag.uploadFile(data.askId, this.props.actions, this, 10);
                } else {
                    message.success({
                        content:'提交成功',
                        onClose:()=>{
                            this.setState({loading:false})
                            window.history.back()
                        }
                    })
                }
            },
            rejected:(data)=>{
                this.setState({loading:false})
                message.error({
                    content:data
                })
            }
        })
        
    }
    
    render(){
        const {loaded, loading, user_id, rintegral, integral, title, content, isShare, isReward, imgList, fetching, selectValue, ask_id, cate_id, flag} = this.state
        if (!loaded) return null;
        if(this.state.isReward&&this.state.ask_id!='0'){
            setTimeout(() => {
                const a = this.userMap[user_id];
                this.setState({
                    rintegral: a.rintegral,
                })
            }, 500);
        }
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={this.props.match.params.id == 0?'创建问题':'修改问题'}
                    >
                        <Card title="" style={{minHeight:'400px'}}>
                            <Form labelCol={{span:4}} wrapperCol={{span:16}}>
                                <Form.Item label='选择身份'>
                                    <Select value={user_id} className='m_w400' onSelect={(val) => {
                                        const u = this.userMap[val];
                                        this.setState({
                                            user_id: val,
                                            integral: 0,
                                            rintegral: u.rintegral,
                                        })
                                    }}>
                                        <Select.Option value={0}>无</Select.Option>
                                        {this.userList.map((user, index) => {
                                            return <Select.Option value={user.userId}>{user.nickname}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item label='选择分类'>
                                    <Select defaultValue={cate_id} className='m_w400' onSelect={(val) => {
                                        this.setState({
                                            cate_id: val,
                                        })
                                    }}>
                                        <Select.Option value={0}>无</Select.Option>
                                        {this.cateList.map((cate, index) => {
                                            return <Select.Option value={cate.categoryId}>{cate.categoryName}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item label='问题标题'>
                                    <Input 
                                        className='m_w400' 
                                        value={title}
                                        onChange={e => {
                                            this.setState({
                                                title: e.target.value,
                                            })
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label='问题背景'>
                                    <Editor ref='editor' content={content} actions={this.props.actions}></Editor>
                                </Form.Item>
                                <Form.Item label='图片' help='686px * 440px'>
                                    <AntdOssUpload
                                        actions={this.props.actions}
                                        ref={ref=>this.img=ref}
                                        accept="image/*"
                                        maxLength={4}
                                        tip='选择图片'
                                        value={imgList}
                                        listType='picture-card'
                                    />
                                </Form.Item>
                                <Form.Item label='是否悬赏'>
                                    <SwitchCom value={isReward} onChange={(isReward)=>{
                                        this.setState({isReward})
                                    }}/>
                                    {
                                        this.state.isReward?
                                        <div>
                                            <InputNumber min={0} max={rintegral} value={integral} onChange={val=>{
                                                if(val !== ''&&!isNaN(val)){
                                                    val = Math.round(val)
                                                    if(val<0) val=0
                                                    this.setState({integral: val})
                                                }
                                            }} />
                                           
                                                <span>（可使用金币：{rintegral}）</span>
                                 
                                            
                                        </div>
                                        :null
                                    }
                                </Form.Item>
                                <Form.Item label='是否分享'>
                                    <Radio.Group defaultValue={isShare} onChange={e => {
                                        this.setState({ isShare: e.target.value })
                                    }}>
                                        <Radio value={0}>是</Radio>
                                        <Radio value={1}>否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                
                                <Form.Item label='发布对象'>
                                    <PersonTypePublic ctype={10} ref={(ref)=>this.flag = ref} actions={this.props.actions} contentId={this.state.ask_id} showUser={ask_id == '0' ? false : true} flag={this.state.flag}/>
                                </Form.Item>
                                <Form.Item wrapperCol={{offset:4}}>
                                    <Button onClick={() => {
                                        window.history.go(-1)
                                    }}>
                                        取消
                                    </Button>&nbsp;
                                    <Button type="primary" htmlType="submit" loading={loading} onClick={this.onPublish}>
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </PageHeader>
                </Card>
                
                <Modal zIndex={6002} visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}

const LayoutComponent = AskEdit;
const mapStateToProps = state => {
    return {
        ask_info: state.ask.ask_info,
        kuser_list: state.user.kuser_list,
        cate_list: state.auth.auth_cate_list,
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
