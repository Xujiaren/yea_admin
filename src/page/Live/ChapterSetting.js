import React from "react";
import {Popconfirm,Empty,Modal,Form,Upload,Icon,Input,Tree,Card,PageHeader, Button, Select, message, InputNumber} from 'antd';
import connectComponent from '../../util/connect';

const { TreeNode, DirectoryTree } = Tree;

class ChapterSetting extends React.Component {
    isLeaf = false
    chapter_list = []
    chapter_ids = []
    state = {
        //权限
        view:false,
        edit:false,

        isAll:false,
        isNew:true,
        showMenu:false,
        showEditChapter:false,
        showEditSection:false,
        visibleAddChapter:false,
        visibleAddSection:false,
        pageX:0,
        pageY:0,
        fileList_1:[],
        keys:[],
        checkedKeys:[],

        new_duration:'',
        new_parent_id:'',
        new_section_name:'',
        new_section_content:'',
        new_media_id:'',
        new_status:1,

        edit_duration:'',
        edit_chapter_id:'',
        edit_parent_id:'',
        edit_section_name:'',
        edit_section_content:'',
        edit_media_id:'',
        edit_status:1,

        editContent:'',
        editChapterName:'',
        editChapterId:'',

        newContent:'',
        newChapterName:'',
        
        remove_id:0,
        chapter_ids:''
    }
    _onRemoveChapters = ()=>{
        const {actions} = this.props
        let {checkedKeys} = this.state
        if(checkedKeys.length == 0){
            message.info('请先选择章节')
            return
        }
        

        actions.deleteChapters({
            chapter_ids:checkedKeys.join(','),
            resolved:(data)=>{
                actions.getChapter(this.course_id,1)
                message.success('操作成功')
            },
            rejected:(data)=>{
                message.error('操作失败：'+data)
            }
        })
    }
    _onRemove =()=>{
        const {actions} = this.props
        const {remove_id:chapter_id} = this.state
        if(!chapter_id){
            message.info('没有选择到章节ID，请重新选择')
            return;
        }
        actions.removeChapter({
            chapter_id,
            resolved:(data)=>{
                actions.getChapter(this.course_id,1)
                message.success('操作成功')
            },
            rejected:(data)=>{
                message.error('操作失败：'+data)
            }
        })
    }
    showEditChapter =()=>{
        if(this.isLeaf){
            this.setState({showEditSection:true})
        }else{
            this.setState({showEditChapter:true})
        }
        
    }
    hideEditChapter =()=>{
        this.setState({showEditChapter:false})
    }
    hideEditSection =()=>{
        this.setState({showEditSection:false})
    }
    _onEditSection = ()=>{
        let {
            edit_duration:duration,
            edit_chapter_id:chapter_id,
            edit_parent_id:parent_id,
            edit_media_id:media_id,
            edit_section_content:content,
            edit_section_name:chapter_name,
            edit_status:status
        } = this.state

      
        if(!chapter_name){ message.info('请输入小节名称');return; }
        if(!duration){message.info('视频时长不能为空或0');return; }
        if(duration.toString().indexOf('.')>-1){ message.info('视频时长取整数');return; }
        if(duration>32000){
            message.info('视频时长不能大于32000秒');return;
        }
        
        if(media_id == ''){
            media_id = 0
        }
        this.PublishChapter({status,duration,chapter_id,parent_id,media_id,content,chapter_name})
    }
    _onNewSection = ()=>{
        let {
            new_duration:duration,
            new_parent_id:parent_id,
            new_media_id:media_id,
            new_section_content:content,
            new_section_name:chapter_name,
            new_status:status
        } = this.state

        if(!chapter_name){ message.info('请输入小节名称');return; }
        if(!duration){message.info('视频时长不能为空或0');return; }
        if(duration.toString().indexOf('.')>-1){ message.info('视频时长取整数');return; }
        if(duration>32000){
            message.info('视频时长不能大于32000秒');return;
        }

        if(media_id == ''){
            media_id = 0
        }
        this.PublishChapter({status,duration,parent_id,media_id,content,chapter_name})
    }

    _onNewChapter = ()=>{
        let {newContent:content,newChapterName:chapter_name} = this.state
        if(!content||!chapter_name){
            message.info('请输入完整的内容再提交')
            return;
        }
        this.PublishChapter({content,chapter_name})
    }
    _onEditChapter = ()=>{
        let {
            
            editContent:content,
            editChapterName:chapter_name,
            editChapterId:chapter_id
        } = this.state
        this.PublishChapter({chapter_id,content,chapter_name})
    }
    PublishChapter = ({status,duration,parent_id,media_id,chapter_id,chapter_name,content})=>{

        let course_id = this.course_id
        const {actions} = this.props;
        actions.publishChapter({
            status,parent_id,media_id,chapter_id,chapter_name,course_id,content,duration,
            resolved:(data)=>{
                this.setState({
                    showEditChapter:false,
                    showEditSection:false,
                    visibleAddChapter:false,
                    visibleAddSection:false,
                })
                this._reset_state()
                actions.getChapter(this.course_id,1)
                message.success('操作成功')
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onIsNew =(val)=>{
        if(val == 0)
            this.setState({isNew:true,editChapterId:'',new_parent_id:''})
        else
            this.setState({isNew:false,new_parent_id:val})
    }
    _reset_state = ()=>{
        this.setState({
            new_section_name:'',
            new_section_content:'',
            new_media_id:'',
            new_duration:'',

            edit_section_name:'',
            edit_section_content:'',
            edit_media_id:'',
            edit_duration:'',

            editContent:'',
            editChapterName:'',
            editChapterId:'',

            newContent:'',
            newChapterName:'',
            
            remove_id:'',
            edit_parent_id:''
        })
    }
    componentDidMount(){
        window.addEventListener("click",(e)=>{
            this.setState({
                showMenu:false
            })
        })
        this.course_id = 178 //this.props.match.params.course_id
        const {actions} = this.props
        actions.getChapter(this.course_id,1)
    }
    componentWillReceiveProps(n_props){

        if(n_props.chapter_list !== this.props.chapter_list){
            this.chapter_list = n_props.chapter_list
            this.chapter_ids = []
            this.setState({
                checkedKeys:[],
                isAll:false
            })
            this.chapter_list.map(ele=>{
                this.chapter_ids.push(ele.chapterId)
                if(ele.courseChapterList.length !== 0){
                    ele.courseChapterList.map(_ele=>{
                        this.chapter_ids.push(_ele.chapterId)
                    })
                }
            })

        }
    }
    onSelectAll = ()=>{
        let checkedKeys =[]
        let isAll = false
        if(!this.state.isAll){
            isAll = true
            checkedKeys = this.chapter_ids
        }
        
        this.setState({
            checkedKeys,
            isAll
        })
    }
    onSelect = (keys, event) => {
        this.setState({
            keys:keys
        })
    };
    onCheck = (checkedKeys, event) => {

        let isAll = false
        if(checkedKeys.length == this.chapter_ids.length){
            isAll=true
        }
        this.setState({
            checkedKeys,
            isAll
        })
    };
    modifyBtn =()=>{
        this.setState({visibleAddChapter:true})
    }
    onExpand = () => {
       
    };
    handleCancel = () => {
        this.setState({
            visibleAddSection: false,
        });
    };
    handleCancelChapter = ()=>{
        this.setState({
            visibleAddChapter: false,
        });
    }
    rightClick = (e) => {
        const obj = e.node.props
        let keys =[]
        keys.push(obj.eventKey)
        if(!obj.eventKey)
            return
        if(typeof obj.isLeaf == 'undefined'){
            this.isLeaf = false
            
            this.setState({
                remove_id:obj.eventKey,
                keys:keys,
                showMenu:true,
                editChapterId:obj.eventKey,
                editChapterName:obj['data-name'],
                editContent:obj['data-content'],
                pageX:e.event.clientX,
                pageY:e.event.clientY,
            })

        }else{
            this.isLeaf = true
            this.setState({
                keys:keys,
                showMenu:true,

                remove_id:obj.eventKey,
                edit_chapter_id:obj['data-id'],
                edit_parent_id:obj['data-parent'],
                edit_section_name:obj['data-name'],
                edit_section_content:obj['data-content'],
                edit_media_id:obj['data-media'],
                edit_duration:obj['data-duration'],
                edit_status:obj['data-status'],
                
                pageX:e.event.clientX,
                pageY:e.event.clientY,
            })
        }
            
        
        
    }

    render() {
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
        const uploadBtnVideo = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传视频</div>
            </div>
        );
        const {isNew} =this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    
                        <div className="pad_b10">
                            <Button onClick={this.onSelectAll} size={'small'} className="">{this.state.isAll?"取消全选":"全选"}</Button>&nbsp;
                            <Popconfirm
                                title='确定删除吗？'
                                okText={'确定'}
                                cancelText={'取消'}
                                onConfirm={this._onRemoveChapters}
                            >
                                <Button size={'small'} className="">删除</Button>
                            </Popconfirm>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={()=>{this.setState({visibleAddChapter:true})}} size={'small'} className="">发布章节</Button>&nbsp;
                            {/*<Button onClick={()=>{this.setState({visibleAddSection:true})}} size={'small'} className="">发布节</Button>*/}
                        </div>
                        {this.chapter_list.length==0?
                            <Empty description="暂时没有章节信息"/>
                        :null}
                        <DirectoryTree onRightClick={this.rightClick} 
                                draggable 
                                checkable 
                                multiple 
                                defaultExpandAll 
                                onSelect={this.onSelect} 
                                onExpand={this.onExpand}
                                onCheck={this.onCheck}
                                blockNode={false}
                                selectedKeys={this.state.keys}
                                checkedKeys={this.state.checkedKeys}
                        >
                            {this.chapter_list.map((ele,index)=>(
                                <TreeNode 
                                    title={`${ele.chapterName}\t${ele.content}`} 
                                    data-name={ele.chapterName} 
                                    data-content={ele.content} 
                                    key={ele.chapterId}
                                >
                                    {ele.courseChapterList === null ?null:ele.courseChapterList.map((_ele,_index)=>(
                                        <TreeNode 
                                            data-status={_ele.status}
                                            data-duration={_ele.duration}
                                            data-id={_ele.chapterId}
                                            data-parent={_ele.parentId}
                                            data-name={_ele.chapterName}
                                            data-content={_ele.content}
                                            data-media={_ele.mediaId}
                                            title={`${_ele.chapterName}\t${_ele.content}`}
                                            key={_ele.chapterId} 
                                            isLeaf 
                                        />
                                    ))}
                                </TreeNode>
                            ))}
                        </DirectoryTree>
                </Card>
                <div className="pad_10 bg_white border_1" style={{ display: this.state.showMenu ? 'block' : 'none', position: 'fixed', left: `${this.state.pageX}px`, top: `${this.state.pageY}px`, zIndex: 9999 }}>
                    <div>
                        <Button size={"small"} onClick={this.showEditChapter}>修改</Button>
                    </div>
                    <div>
                        <Button onClick={this._onRemove} className={"mt_5"} size={"small"}>删除</Button>
                    </div>
                </div>
                <Modal
                    title="修改节"
                    visible={this.state.showEditSection}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onOk={this._onEditSection}
                    onCancel={this.hideEditSection}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="级别">
                            <Select disabled value={this.state.edit_parent_id}>
                            {this.chapter_list.map((ele,index)=>(
                                <Select.Option key={index+'_edit_chapter'} value={ele.chapterId}>{ele.chapterName}</Select.Option>
                            ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="小节名称">
                            <Input 
                                placeholder='如 第一节'
                                onChange={e=>{
                                    this.setState({edit_section_name:e.target.value})
                                }}
                                value={this.state.edit_section_name}
                            />
                        </Form.Item>
                        <Form.Item label="小节标题">
                            <Input 
                                placeholder='请输入标题'
                                onChange={e=>{
                                    this.setState({edit_section_content:e.target.value})
                                }}
                                value={this.state.edit_section_content}
                            />
                        </Form.Item>
                        <Form.Item label="视频链接">
                            <Input
                                onChange={e=>{
                                    this.setState({edit_media_id:e.target.value})
                                }}
                                value={this.state.edit_media_id}
                            />
                        </Form.Item>
                        <Form.Item label="视频时长(秒)">
                            <InputNumber
                                onChange={val=>{
                                    if(val !== ''&&!isNaN(val)){
                                        //val = Math.round(val)
                                        if(val<0) val=0
                                        this.setState({edit_duration:val})
                                    }
                                }}
                                value={this.state.edit_duration}
                                min={0} max={800000}
                            />
                            <div>视频时长取整数</div>
                        </Form.Item>
                        <Form.Item label="上传视频(MP4)">
                            <Upload
                                disabled
                                
                                listType="picture-card"
                                fileList={this.state.fileList_1}
                                onChange={this.handleChangeModalVideo}
                            >
                                {this.state.fileList_1.length >= 4 ? null : uploadBtnVideo}
                            </Upload>
                        </Form.Item>
                        
                    </Form>
                </Modal>

                <Modal
                    zIndex={6002}
                    title="修改章节"
                    visible={this.state.showEditChapter}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideEditChapter}
                    onOk={this._onEditChapter}
                    bodyStyle={{padding:"10px"}}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="章节名称">
                            <Input 
                                placeholder='如 第一章'
                                onChange={(e)=>{
                                this.setState({editChapterName:e.target.value})
                            }} value={this.state.editChapterName} placeholder=""/>
                        </Form.Item>
                        
                        <Form.Item label="章节标题">
                            <Input onChange={(e)=>{
                                this.setState({editContent:e.target.value})
                            }} value={this.state.editContent} placeholder=""/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    zIndex={6002}
                    title="发布新章节"
                    visible={this.state.visibleAddChapter}
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancelChapter}
                    bodyStyle={{padding:"10px"}}
                    footer={isNew?
                        <Button key={'chapter'} onClick={this._onNewChapter} type='primary'>发布新章</Button>
                        :
                        <Button key={'section'} onClick={this._onNewSection} type='primary'>发布新节</Button>
                    }
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="级别">
                            <Select onChange={this._onIsNew} defaultValue={0}>
                                <Select.Option value={0}>新章</Select.Option>
                                {this.chapter_list.map((ele,index)=>(
                                    <Select.Option key={index+'_new'} value={ele.chapterId}>{ele.chapterName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {isNew?
                        <div>
                            <Form.Item label="章节名称">
                                <Input 
                                    placeholder='如 第一章'
                                    value={this.state.newChapterName} 
                                    onChange={e=>{
                                        this.setState({newChapterName:e.target.value})
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="章节标题">
                                <Input 
                                    value={this.state.newContent} 
                                    onChange={e=>{
                                        this.setState({newContent:e.target.value})
                                    }}
                                />
                            </Form.Item>
                        </div>
                        :
                        <div>
                        <Form.Item label="小节名称">
                            <Input 
                                placeholder='如 第一节'
                                onChange={e=>{
                                    this.setState({new_section_name:e.target.value})
                                }}
                                value={this.state.new_section_name}
                            />
                        </Form.Item>
                        <Form.Item label="小节标题">
                            <Input 
                                placeholder='小节标题'
                                onChange={e=>{
                                    this.setState({new_section_content:e.target.value})
                                }}
                                value={this.state.new_section_content}
                            />
                        </Form.Item>
                        <Form.Item label="视频链接">
                            <Input
                                onChange={e=>{
                                    this.setState({new_media_id:e.target.value})
                                }}
                                value={this.state.new_media_id}
                            />
                        </Form.Item>
                        <Form.Item label="视频时长(秒)">
                            <InputNumber
                                onChange={val=>{
                                    if(val !== ''&&!isNaN(val)){
                                        //val = Math.round(val)
                                        if(val<0) val=0
                                        this.setState({new_duration:val})
                                    }
                                }}
                                value={this.state.new_duration}
                                min={0} max={800000}
                            />
                            <div>视频时长取整数</div>
                        </Form.Item>
                        <Form.Item label="上传视频(MP4)">
                            <Upload
                                disabled
                                listType="picture-card"
                                fileList={this.state.fileList_1}
                                onChange={this.handleChangeModalVideo}
                            >
                                {this.state.fileList_1.length >= 4 ? null : uploadBtnVideo}
                            </Upload>
                        </Form.Item>
                        </div>
                        }
                    </Form>
                </Modal>
            </div>
        );
    }
}
const LayoutComponent =ChapterSetting;
const mapStateToProps = state => {
    return {
        chapter_list:state.course.chapter_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
