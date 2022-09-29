
import React, { Component } from "react";
import BraftFinder from "../components/braftFinder";
import connectComponent from '../util/connect';
import {Row, Col,Popconfirm,message,Pagination,Switch,Modal,Form,Card,Select ,Input,Button} from 'antd';
import folder_icon from '../assets/img/folder.png'

const {Search} = Input
const defaultAccepts = {
    image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
    video: 'video/mp4',
    audio: 'audio/mp3'
}

class MediaManager extends Component {
    constructor(props) {
        super(props);
        this.braftFinder = new BraftFinder({
            language: "zh"
        });
        this.state={
            view:true,
            edit:true,
            showAddFolder:false,
            showFolderBtn:true
        }
    }
    componentWillReceiveProps(n_props){

    }
  
    addFolder = ()=>{
        const {folder_name} = this.state
        if(folder_name == ''){
            message.info('请输入文件夹名称')
            return
        }
        let item = [{
            id:folder_name,
            type:'IMAGE',
            thumbnail:folder_icon,
            name:folder_name,
            file:folder_icon,
            url:folder_icon,
            uploading:false,
            folder:true,
            child:[],
        }]
        let items = this.braftFinder.getItems()
        if(items.find(item => item.name == folder_name)){
            message.info('该文件夹名已存在')
            return
        }
        this.braftFinder.addItems(item)
        console.log(this.braftFinder.files)
        this.setState({
            showAddFolder:false
        })
    }
    beforeRemove = items => {
        return true;
    };

    handelFileSelect = files => {
        return [].slice.call(files, 0, 3);
    };
    reslovePickedFiles = (event) => {

        event.persist()
    
        let { files } = event.target
        const accepts = {
            ...defaultAccepts
        }
        this.braftFinder.resolveFiles({
            files: files,
            onItemReady: ({ id }) => this.braftFinder.selectMediaItem(id),
            onAllReady: () => event.target.value = null
        }, 0,accepts)
    }
    render() {
    const FinderComponent = this.braftFinder.ReactComponent;

    return (
        <div className="animated fadeIn">
            <Row>
                <Col span={24}>
                    <Card title="素材管理">
                        <FinderComponent
                            accepts={{
                                audio: true,
                                video: true
                            }}
                            { ...this.props }
                            actions={ this.props.actions }
                            language="zh"
                            onSelect={item => console.log("seleced:", item)}
                            onBeforeSelect={item => console.log("will select:", item)}
                            onDeselect={item => console.log("deselected:", item)}
                            onBeforeDeselect={item => console.log("will deselect:", item)}
                            onInsert={items => console.log("insert:", items)}
                            onBeforeInsert={items => console.log("will insert:", items)}
                            onRemove={items => console.log("removed", items)}
                            onBeforeRemove={this.beforeRemove}
                            onFileSelect={this.handelFileSelect}
                            onRouteChange={file_route=>{
                               if(file_route.length>0){
                                   this.setState({ showFolderBtn:false })
                               }else{
                                    this.setState({ showFolderBtn:true })
                               }
                            }}
                        />
                        </Card>
                </Col>
            </Row>
            <Modal
                visible={this.state.showAddFolder}
                title='创建文件夹'
                okText='提交'
                cancelText='取消'
                onCancel={()=>{
                    this.setState({
                        showAddFolder:false
                    })
                }}
                onOk={this.addFolder}
            >
                <Input
                    onChange={(e)=>{
                        this.setState({ folder_name:e.target.value})
                    }}
                    placeholder='请输入文件夹名称'
                    value={this.state.folder_name}
                />
            </Modal>
        </div>
    );
  }
}


const LayoutComponent = MediaManager;
const mapStateToProps = state => {
    return {
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
